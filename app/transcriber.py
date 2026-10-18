"""Local transcription with faster-whisper (word-level timestamps).

Each request can pick its compute device (``auto``/``cuda``/``cpu``). Models are
heavy (~1.5 GB for 'medium'), so we load one lazily per device and cache it for
reuse. CUDA uses float16 and automatically falls back to CPU int8 if it fails.
No audio or text ever leaves the machine.
"""

from __future__ import annotations

import glob
import json
import logging
import os
import sys
import threading
from pathlib import Path
from typing import Callable, Optional

logger = logging.getLogger(__name__)


def _memory_status_gb() -> tuple[Optional[float], Optional[float]]:
    """Return (total, available) physical RAM without adding a dependency."""
    try:
        if os.name == "nt":
            import ctypes

            class _MEMORYSTATUSEX(ctypes.Structure):
                _fields_ = [
                    ("dwLength", ctypes.c_ulong),
                    ("dwMemoryLoad", ctypes.c_ulong),
                    ("ullTotalPhys", ctypes.c_ulonglong),
                    ("ullAvailPhys", ctypes.c_ulonglong),
                    ("ullTotalPageFile", ctypes.c_ulonglong),
                    ("ullAvailPageFile", ctypes.c_ulonglong),
                    ("ullTotalVirtual", ctypes.c_ulonglong),
                    ("ullAvailVirtual", ctypes.c_ulonglong),
                    ("ullAvailExtendedVirtual", ctypes.c_ulonglong),
                ]

            stat = _MEMORYSTATUSEX()
            stat.dwLength = ctypes.sizeof(_MEMORYSTATUSEX)
            if not ctypes.windll.kernel32.GlobalMemoryStatusEx(ctypes.byref(stat)):
                return None, None
            unit = float(1024**3)
            return stat.ullTotalPhys / unit, stat.ullAvailPhys / unit
    except Exception:
        pass
    return None, None


_TOTAL_RAM_GB, _AVAILABLE_RAM_AT_START_GB = _memory_status_gb()


def _recommended_cpu_threads() -> int:
    """Keep native inference fast without multiplying low-memory allocations."""
    logical = max(1, os.cpu_count() or 4)
    if _TOTAL_RAM_GB is not None and _TOTAL_RAM_GB < 6.0:
        return min(2, logical)
    return min(4, logical)


_CPU_THREADS = _recommended_cpu_threads()

# These libraries read their thread/memory settings during import.  Configure
# them before faster_whisper imports CTranslate2.  CTranslate2's MKL packed-GEMM
# path pre-packs weights at model load; disabling it only on constrained systems
# avoids the reported `mkl_malloc ... failed to allocate memory` startup failure.
for _thread_env in ("OMP_NUM_THREADS", "MKL_NUM_THREADS", "OPENBLAS_NUM_THREADS", "NUMEXPR_NUM_THREADS"):
    try:
        _configured_threads = int(os.environ.get(_thread_env, ""))
    except ValueError:
        _configured_threads = 0
    os.environ[_thread_env] = str(
        min(_configured_threads, _CPU_THREADS) if _configured_threads > 0 else _CPU_THREADS
    )
if ((_TOTAL_RAM_GB is not None and _TOTAL_RAM_GB < 8.0) or
        (_AVAILABLE_RAM_AT_START_GB is not None and _AVAILABLE_RAM_AT_START_GB < 3.0)):
    os.environ["CT2_PACKED_GEMM"] = "0"


def _add_cuda_dll_directories() -> None:
    """Make pip-installed NVIDIA CUDA libraries discoverable on Windows.

    ctranslate2 (faster-whisper's backend) loads cuBLAS/cuDNN lazily at compute
    time. The ``nvidia-*-cu12`` wheels drop those DLLs under
    ``site-packages/nvidia/**/bin``, which Windows does NOT search by default -
    so without this the GPU path fails with "cublas64_12.dll is not found".
    No-op on non-Windows (there the loader uses RPATH/LD_LIBRARY_PATH).
    """
    if os.name != "nt":
        return
    for entry in sys.path:
        nvidia_root = os.path.join(entry, "nvidia")
        if not os.path.isdir(nvidia_root):
            continue
        for bin_dir in glob.glob(os.path.join(nvidia_root, "*", "bin")):
            # add_dll_directory helps DLLs loaded with the user-dirs flag, but
            # ctranslate2's native dependency load uses the standard search
            # order - which consults PATH, not these added dirs. So do BOTH.
            try:
                os.add_dll_directory(bin_dir)
            except OSError:
                pass
            if bin_dir not in os.environ.get("PATH", ""):
                os.environ["PATH"] = bin_dir + os.pathsep + os.environ.get("PATH", "")


# Must run before faster_whisper/ctranslate2 try to load the CUDA DLLs.
_add_cuda_dll_directories()

# Set offline cache policy before importing Hugging Face through faster-whisper.
from .paths import MODELS_DIR, ROOT_DIR, TRANSCRIPTS_DIR  # noqa: E402
from faster_whisper import WhisperModel  # noqa: E402
from .models import TranscriptionError  # noqa: E402

# Fallback when hardware can't be probed at all. Per-device auto-selection
# (see _pick_model_size) normally overrides this — kept only as a last resort.
MODEL_SIZE = "small"

# Per-device compute precision. float16 on the GPU, int8 on the CPU.
_COMPUTE_TYPE = {"cuda": "float16", "cpu": "int8"}

# One cached model per device ('cuda' / 'cpu') so switching devices between
# requests is cheap after the first load. `_device` records the most recently
# used device (drives the /health badge); `_cuda_available` is a cached probe.
_models: dict[str, WhisperModel] = {}
_model_sizes: dict[str, str] = {}  # device -> whisper model size actually loaded
_device: str = "uninitialised"
_cuda_available: Optional[bool] = None
# CUDA can be detectable but unusable because of a driver/DLL or late inference
# failure. Avoid retrying that same failure for every subsequent Auto job.
_cuda_failed: bool = False

# Cached human-readable GPU name (e.g. "NVIDIA GeForce RTX 5060 Ti"). `_probed`
# guards the one-time lookup so a missing/None name isn't re-queried every call.
_gpu_name: Optional[str] = None
_gpu_name_probed: bool = False

# Serialises model loads so two requests warming the same device don't double-load.
_load_lock = threading.Lock()
# Serialises actual transcription passes — one GPU pass at a time. Concurrent passes
# on the single model thrash each other and look "stuck at 0%"; this queues them.
_transcribe_lock = threading.Lock()


def cuda_available() -> bool:
    """Best-effort, cached check for a usable CUDA GPU.

    Uses ctranslate2's device count (faster-whisper's backend) so the UI can
    offer/hide the GPU option without paying the cost of a full model load.
    """
    global _cuda_available
    if _cuda_available is None:
        try:
            from ctranslate2 import get_cuda_device_count

            _cuda_available = get_cuda_device_count() > 0
        except Exception:  # noqa: BLE001 - any failure means "no usable GPU"
            _cuda_available = False
    return _cuda_available


def available_devices() -> list[str]:
    """Devices the UI may offer, best (GPU) first."""
    return (["cuda", "cpu"] if cuda_available() else ["cpu"])


def gpu_name() -> Optional[str]:
    """Best-effort, cached human-readable name of the active CUDA GPU.

    Returns the marketing name (e.g. "NVIDIA GeForce RTX 5060 Ti") so the UI can
    auto-detect and show the real device instead of a generic "GPU" label, or
    ``None`` when there's no usable GPU / the name can't be read. Uses
    ``nvidia-smi`` (shipped with every NVIDIA driver) rather than pulling in a
    heavy dep like torch just to read a string. Probed once, then cached.
    """
    global _gpu_name, _gpu_name_probed
    if _gpu_name_probed:
        return _gpu_name
    _gpu_name_probed = True
    if not cuda_available():
        return None
    try:
        import subprocess

        out = subprocess.run(
            ["nvidia-smi", "--query-gpu=name", "--format=csv,noheader"],
            capture_output=True,
            text=True,
            timeout=5,
            # Avoid a flashing console window on Windows (no-op elsewhere).
            creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0),
        )
        if out.returncode == 0:
            lines = [ln.strip() for ln in out.stdout.splitlines() if ln.strip()]
            if lines:
                _gpu_name = lines[0]
    except Exception as exc:  # noqa: BLE001 - any failure -> unnamed GPU
        logger.debug("Could not read GPU name via nvidia-smi: %s", exc)
    return _gpu_name


def _gpu_vram_gb() -> Optional[float]:
    """Best-effort total VRAM of the active CUDA GPU, in GB. None if unknown."""
    if not cuda_available():
        return None
    try:
        import subprocess

        out = subprocess.run(
            ["nvidia-smi", "--query-gpu=memory.total", "--format=csv,noheader,nounits"],
            capture_output=True,
            text=True,
            timeout=5,
            creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0),
        )
        if out.returncode == 0:
            lines = [ln.strip() for ln in out.stdout.splitlines() if ln.strip()]
            if lines:
                return float(lines[0]) / 1024.0  # MiB -> GiB
    except Exception as exc:  # noqa: BLE001 - any failure -> unknown VRAM
        logger.debug("Could not read GPU VRAM via nvidia-smi: %s", exc)
    return None


def _system_ram_gb() -> Optional[float]:
    """Best-effort total system RAM, in GB. None if unknown.

    No new dependency (e.g. psutil) needed: ``GlobalMemoryStatusEx`` on
    Windows, ``sysconf`` on POSIX (Linux and macOS both support it) covers
    every platform this app packages for.
    """
    try:
        if os.name == "nt":
            return _TOTAL_RAM_GB
        return (os.sysconf("SC_PHYS_PAGES") * os.sysconf("SC_PAGE_SIZE")) / (1024**3)
    except Exception as exc:  # noqa: BLE001 - any failure -> unknown RAM
        logger.debug("Could not read system RAM: %s", exc)
        return None


# (min GB, model size) tiers, checked best-first.
_GPU_TIERS: list[tuple[float, str]] = [(10.0, "large-v3"), (6.0, "medium"), (3.0, "small"), (0.0, "base")]
_CPU_TIERS: list[tuple[float, str]] = [(0.0, "small")]


def _complete_local_model(directory: Path) -> bool:
    # Without tokenizer.json, faster-whisper calls Tokenizer.from_pretrained
    # even when its model weights were supplied as a local directory.
    try:
        return all((directory / name).is_file() and (directory / name).stat().st_size > 0
                   for name in ("model.bin", "config.json", "tokenizer.json"))
    except OSError:
        return False


def get_bundled_model_dir(size: str = "small") -> Optional[Path]:
    """Find the local directory containing bundled faster-whisper model files.

    Require local CTranslate2 weights, configuration and tokenizer so missing
    assets cannot activate a library download fallback.
    """
    candidates = [
        MODELS_DIR / "hub" / f"models--Systran--faster-whisper-{size}",
        ROOT_DIR / "models" / "hub" / f"models--Systran--faster-whisper-{size}",
        MODELS_DIR / f"faster-whisper-{size}",
        ROOT_DIR / "models" / f"faster-whisper-{size}",
    ]
    try:
        from huggingface_hub.constants import HF_HUB_CACHE
        if HF_HUB_CACHE:
            candidates.append(Path(HF_HUB_CACHE) / f"models--Systran--faster-whisper-{size}")
    except Exception:
        pass

    for c in candidates:
        if not c.is_dir():
            continue
        # Direct folder with model files
        if _complete_local_model(c):
            return c
        # Snapshot subfolder inside HuggingFace cache
        snaps = c / "snapshots"
        if snaps.is_dir():
            for s in snaps.glob("*"):
                if _complete_local_model(s):
                    return s
    return None


def _is_model_cached(size: str) -> bool:
    """Check if faster-whisper model files are already available locally on disk."""
    return get_bundled_model_dir(size) is not None


def _pick_model_size(device: str) -> str:
    """Auto-select a whisper model size that actually fits this machine.

    Cached per device in ``_model_sizes`` once loaded (see ``_load_on``), so
    this probe runs at most once per device per process.
    Prefers the bundled/cached 'small' model so initial startup works
    100% offline without requiring internet or multi-gigabyte downloads.
    """
    # If the bundled 'small' model is available on disk, ALWAYS prefer it for instant offline first boot
    if _is_model_cached("small"):
        return "small"

    if device == "cuda":
        avail, tiers, unknown_default = _gpu_vram_gb(), _GPU_TIERS, "small"
    else:
        avail, tiers, unknown_default = _system_ram_gb(), _CPU_TIERS, "small"
    if avail is None:
        return unknown_default
    for threshold, size in tiers:
        if avail >= threshold:
            return size
    return tiers[-1][1]


def get_model_size(device: Optional[str] = None) -> str:
    """The whisper model size loaded (or that WOULD be picked) for a device.

    With no argument, returns the size for the most-recently-used device
    (falls back to a fresh auto-pick for 'cuda' if nothing has loaded yet) —
    used by the startup log and the /api/devices response.
    """
    dev = device or (_device if _device != "uninitialised" else ("cuda" if cuda_available() else "cpu"))
    return _model_sizes.get(dev) or _pick_model_size(dev)


def is_loaded(device: str) -> bool:
    """True if a model for this concrete device is already cached (warm)."""
    return device in _models


# ---------------------------------------------------------------------------
# Background local-model loading status, polled by /api/model-status.
# ---------------------------------------------------------------------------
_status_lock = threading.Lock()
_load_status: dict = {"status": "idle", "message": "", "progress": None, "model_size": None, "device": None}

def _set_status(**kwargs) -> None:
    with _status_lock:
        _load_status.update(kwargs)


def model_status() -> dict:
    """Snapshot of the background model load — polled by /api/model-status."""
    with _status_lock:
        return dict(_load_status)


def prepare_model_retry() -> bool:
    """Reset a failed warm-up so the UI can retry after memory is freed."""
    global _cuda_failed
    with _status_lock:
        if _load_status.get("status") == "loading":
            return False
        _cuda_failed = False
        _load_status.update(
            status="idle", message="Retrying local AI model...", progress=0.0,
            model_size=None, device=None,
        )
        return True


def _mark_cuda_failed() -> None:
    """Retire a CUDA model that cannot run; explicit GPU/Retry may recheck it."""
    global _cuda_failed
    with _load_lock:
        _cuda_failed = True
        _models.pop("cuda", None)
        _model_sizes.pop("cuda", None)


def _friendly_model_error(exc: Exception) -> str:
    raw = str(exc).strip() or exc.__class__.__name__
    lowered = raw.lower()
    if any(token in lowered for token in ("mkl_malloc", "allocate memory", "bad allocation", "bad_alloc", "out of memory")):
        return (
            "Not enough free memory to start the local AI model. Close memory-heavy "
            "apps and browser tabs, then click Retry. Clipxy4all now uses its low-memory "
            "single-worker mode automatically."
        )
    return raw


def _is_memory_error(exc: Exception) -> bool:
    message = str(exc).lower()
    return any(token in message for token in (
        "mkl_malloc", "allocate memory", "bad allocation", "bad_alloc", "out of memory"
    ))


def _construct_model(model_target: str, device: str, compute: str, threads: int) -> WhisperModel:
    """Build one model, retrying once without MKL weight packing on OOM."""
    kwargs = dict(
        device=device, compute_type=compute, cpu_threads=threads,
        num_workers=1, local_files_only=True,
    )
    try:
        return WhisperModel(model_target, **kwargs)
    except Exception as exc:
        if device != "cpu" or not _is_memory_error(exc) or os.environ.get("CT2_PACKED_GEMM") == "0":
            raise
        # CTranslate2 reads this switch while constructing the model. Retrying
        # here also protects a machine with plenty of installed RAM but little
        # currently free memory, which cannot be predicted reliably at import.
        logger.warning("CPU model allocation failed; retrying with MKL packed GEMM disabled.")
        os.environ["CT2_PACKED_GEMM"] = "0"
        return WhisperModel(model_target, **kwargs)


def _load_on(device: str) -> WhisperModel:
    """Load (or reuse the cached) model on a concrete device ('cuda'/'cpu')."""
    global _device
    with _load_lock:
        if device in _models:
            _device = device
            return _models[device]
        compute = _COMPUTE_TYPE[device]
        size = _pick_model_size(device)
        _model_sizes[device] = size

        local_dir = get_bundled_model_dir(size)
        if local_dir is None:
            raise TranscriptionError(
                "Bundled Whisper model is missing or incomplete. "
                "Restore the model from the Clipxy4all installer; automatic downloads are disabled."
            )
        _set_status(
            status="loading", message=f"Loading AI model ({size})...",
            progress=None, model_size=size, device=device,
        )
        logger.info("Loading bundled whisper '%s' locally from %s on %s (%s)...", size, local_dir, device, compute)

        threads = _CPU_THREADS
        model_target = str(local_dir)

        try:
            # Transcription is serialized by `_transcribe_lock`, so extra model
            # workers cannot improve throughput here and only increase memory.
            model = _construct_model(model_target, device, compute, threads)
        except Exception as exc:
            if size != "small" and _is_model_cached("small"):
                logger.warning(
                    "Loading whisper '%s' failed (%s). Falling back to bundled 'small' model on %s.",
                    size, exc, device
                )
                size = "small"
                _model_sizes[device] = "small"
                fallback_dir = get_bundled_model_dir("small")
                if fallback_dir is None:
                    raise TranscriptionError("Bundled small Whisper model is unavailable; restore the installation.") from exc
                model = _construct_model(str(fallback_dir), device, compute, threads)
            else:
                raise
        _models[device] = model
        _device = device
        _set_status(status="ready", message="Ready", progress=1.0, model_size=size, device=device)
        logger.info("Whisper '%s' loaded on %s.", size, device)
        return model


def load_model(device: str = "auto") -> WhisperModel:
    """Load the whisper model for the requested device, caching per device.

    Args:
        device: 'auto' (GPU if available, else CPU), 'cuda', or 'cpu'.

    'auto' tries the GPU first and falls back to the CPU. If CUDA fails
    (missing cuDNN or driver mismatch), it gracefully falls back to CPU
    so the app opens reliably on any customer computer. Safe to call repeatedly.
    """
    requested = (device or "auto").lower()
    global _cuda_failed
    if requested == "gpu":
        requested = "cuda"

    if requested == "cuda":
        try:
            model = _load_on("cuda")
            _cuda_failed = False
            return model
        except Exception as exc:  # noqa: BLE001
            logger.warning("CUDA load failed (%s). Falling back to CPU...", exc)
            _mark_cuda_failed()
            try:
                model = _load_on("cpu")
                logger.info("Successfully fell back to CPU after CUDA failure.")
                return model
            except Exception as cpu_exc:
                logger.exception("Both CUDA and CPU model loads failed.")
                message = _friendly_model_error(cpu_exc)
                _set_status(status="error", message=message)
                raise TranscriptionError(f"Could not load whisper model: {message}") from cpu_exc

    if requested == "cpu":
        try:
            return _load_on("cpu")
        except Exception as exc:  # noqa: BLE001
            logger.exception("Failed to load whisper on CPU.")
            message = _friendly_model_error(exc)
            _set_status(status="error", message=message)
            raise TranscriptionError(
                f"Could not load the whisper model on CPU: {message}"
            ) from exc

    # 'auto' (or anything unrecognised): prefer GPU, fall back to CPU.
    if not _cuda_failed and cuda_available():
        try:
            return _load_on("cuda")
        except Exception as exc:  # noqa: BLE001
            logger.warning(
                "CUDA load failed (%s). Falling back to CPU (int8). "
                "If you expected GPU, check CUDA 12 + matching cuDNN.",
                exc,
            )
            _mark_cuda_failed()
    try:
        return _load_on("cpu")
    except Exception as exc:  # noqa: BLE001
        logger.exception("Failed to load whisper on CPU as well.")
        message = _friendly_model_error(exc)
        _set_status(status="error", message=message)
        raise TranscriptionError(
            f"Could not load the whisper model on GPU or CPU: {message}"
        ) from exc


def get_device() -> str:
    """Return the device of the most-recent model ('cuda', 'cpu', or 'uninitialised')."""
    return _device


def _normalize_language(language: Optional[str]) -> Optional[str]:
    """Map UI language values to a Whisper code, or None for auto-detect.

    Empty string / 'auto' (case-insensitive) -> None, which tells Whisper to
    detect the spoken language itself. 'hinglish' is not a Whisper language —
    it's Hindustani transcribed as Hindi and then romanised after the fact (see
    ``transcribe_video``), so here it maps to the Hindi model code.
    """
    if not language:
        return None
    lang = language.strip().lower()
    if lang in ("", "auto"):
        return None
    if lang == "hinglish":
        return "hi"
    return lang


def transcribe_video(
    video_path: Path,
    clip_id: str,
    progress: Optional[Callable[[float, str], None]] = None,
    device: str = "auto",
    language: Optional[str] = None,
    cancel_event: Optional[threading.Event] = None,
) -> dict:
    """Transcribe `video_path`, returning a dict with word-level timestamps.

    Returns a dict shaped like:
        {
          "language": "en",
          "duration": 123.4,
          "text": "full transcript ...",
          "words": [{"word": "Hello", "start": 0.0, "end": 0.4}, ...],
          "segments": [{"id": 0, "start": 0.0, "end": 3.2, "text": "..."}, ...],
        }

    The result is also saved to transcripts/<clip_id>.json.

    Raises:
        TranscriptionError: on any failure.
    """
    # Quick probe: check if video has an audio stream. Silent videos / screen recordings
    # without an audio stream cause PyAV / faster-whisper to raise IndexError: tuple index out of range.
    has_audio = True
    probe_duration = 0.0
    try:
        import av
        with av.open(str(video_path)) as container:
            has_audio = bool(container.streams.audio)
            if container.duration:
                probe_duration = float(container.duration) / 1_000_000.0
    except Exception:
        pass

    if not has_audio:
        logger.info("Video %s has no audio stream; skipping speech transcription.", video_path)
        if progress:
            progress(1.0, "Video has no audio track (silent source)...")
        result = {
            "language": language or "en",
            "duration": probe_duration,
            "text": "",
            "words": [],
            "segments": [],
        }
        transcript_path = TRANSCRIPTS_DIR / f"{clip_id}.json"
        try:
            transcript_path.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
        except Exception:
            pass
        return result

    if progress:
        progress(0.0, "Loading local AI model...")
    model = load_model(device)
    active_device = get_device()

    def _empty_transcript() -> dict:
        return {
            "language": language or "en", "duration": probe_duration,
            "text": "", "words": [], "segments": [],
        }

    def _run(active_model) -> dict:
        """Consume the generator here so late CUDA failures can be retried."""
        if progress:
            progress(0.0, "Preparing audio for transcription...")
        segments_gen, info = active_model.transcribe(
            str(video_path), word_timestamps=True, vad_filter=True,
            beam_size=1, best_of=1, language=_normalize_language(language),
        )
        segments: list[dict] = []
        words: list[dict] = []
        text_parts: list[str] = []
        total_dur = float(info.duration) or 0.0
        if progress:
            # Whisper yields only after decoding a section (often up to 30 s of
            # audio). No measured fraction exists until the first yield.
            progress(0.0, "Transcribing the first audio section...")
        for seg in segments_gen:
            if cancel_event is not None and cancel_event.is_set():
                raise TranscriptionError("Transcription cancelled by user.")
            seg_text = (seg.text or "").strip()
            if progress and total_dur > 0:
                frac = min(0.99, float(seg.end) / total_dur)
                progress(frac, f"Transcribing... {int(frac * 100)}%")
            segments.append(
                {
                    "id": seg.id,
                    "start": float(seg.start),
                    "end": float(seg.end),
                    "text": seg_text,
                }
            )
            text_parts.append(seg_text)

            for w in (seg.words or []):
                token = (w.word or "").strip()
                if not token:
                    continue
                words.append(
                    {
                        "word": token,
                        "start": float(w.start),
                        "end": float(w.end),
                    }
                )

        return {
            "language": info.language,
            "duration": float(info.duration),
            "text": " ".join(text_parts).strip(),
            "words": words,
            "segments": segments,
        }

    # One transcription at a time. Poll the lock so a cancelled queued job does
    # not begin a costly inference pass after the earlier job releases it.
    if progress and _transcribe_lock.locked():
        progress(0.0, "Waiting for an earlier transcription to finish…")
    while not _transcribe_lock.acquire(timeout=0.25):
        if cancel_event is not None and cancel_event.is_set():
            raise TranscriptionError("Transcription cancelled by user.")
    try:
        if cancel_event is not None and cancel_event.is_set():
            raise TranscriptionError("Transcription cancelled by user.")
        try:
            result = _run(model)
        except Exception as exc:
            if isinstance(exc, TranscriptionError) and "cancelled" in str(exc).lower():
                raise
            # PyAV raises FFmpegError for corrupt/unsupported input media. A
            # broken source is independent of the GPU: retrying it on CPU wastes
            # time and incorrectly disables CUDA for every later Auto request.
            from av.error import FFmpegError
            if isinstance(exc, FFmpegError):
                raise TranscriptionError(
                    "The video or audio track could not be decoded. Re-export "
                    "the video as MP4 (H.264/AAC) and try again."
                ) from exc
            if isinstance(exc, IndexError) or "tuple index out of range" in str(exc):
                logger.warning("No audio stream in %s; returning empty transcript.", video_path)
                result = _empty_transcript()
            elif active_device == "cuda":
                # CUDA can fail after yielding one or more segments (driver reset,
                # missing lazy-loaded DLL, or VRAM exhaustion). Discard the partial
                # result and repeat the entire pass on CPU to avoid a truncated transcript.
                logger.warning("CUDA transcription failed (%s). Retrying the full video on CPU...", exc)
                _mark_cuda_failed()
                model = None  # release the failed model before loading another one
                if progress:
                    progress(0.02, "GPU failed — switching to CPU transcription...")
                cpu_model = load_model("cpu")
                try:
                    result = _run(cpu_model)
                except Exception as cpu_exc:
                    if isinstance(cpu_exc, IndexError) or "tuple index out of range" in str(cpu_exc):
                        result = _empty_transcript()
                    else:
                        raise
            else:
                raise
    except Exception as exc:  # noqa: BLE001
        logger.exception("Transcription failed for %s", video_path)
        if isinstance(exc, TranscriptionError):
            raise
        raise TranscriptionError(f"Transcription failed: {exc}") from exc
    finally:
        _transcribe_lock.release()

    # Hinglish: the audio was transcribed as Hindi (Devanagari); romanise the
    # whole transcript to readable Roman Urdu/Hindi before caching/persisting.
    if (language or "").strip().lower() == "hinglish":
        from . import translit

        result = translit.romanize_transcript(result)

    # Persist the transcript for debugging / reuse.
    transcript_path = TRANSCRIPTS_DIR / f"{clip_id}.json"
    try:
        transcript_path.write_text(
            json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8"
        )
    except OSError as exc:
        logger.warning("Could not write transcript json: %s", exc)

    return result
