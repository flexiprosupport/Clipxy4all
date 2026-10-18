"""Background pre-transcription so Whisper runs while the user is still tweaking
settings — by the time they hit Generate the transcript is already cached.

Transcription depends only on the source video + compute device (NOT on caption
style, aspect ratio, clip count, etc.), so it's safe to start as soon as the
video is on disk. Results are cached per source-file id and reused by the
pipeline, which then skips the (usually slowest) transcribe stage entirely.

A single lock serialises all transcription: the local Whisper model is shared,
and running two transcriptions at once isn't worth the risk on a single-user
tool. Double-checking the cache inside that lock means a Generate run that
arrives while a pre-transcription is mid-flight simply waits for it and then
reuses the result — the same video is never transcribed twice.
"""

from __future__ import annotations

import json
import logging
import os
import re
import tempfile
import threading
import uuid
from pathlib import Path
from typing import Callable, Dict, Optional

from . import transcriber, uploads
from .models import InvalidVideoURLError, TranscriptionError
from .paths import TRANSCRIPTS_DIR

logger = logging.getLogger("clipxy4all.pretranscribe")

# transcript identity key (source file stem + chosen language) -> transcript dict.
# Including the language means switching languages re-transcribes instead of
# reusing a transcript decoded in the wrong language.
_CACHE: Dict[str, dict] = {}
_CACHE_LOCK = threading.Lock()
# Serialises access to the shared Whisper model (and dedupes same-source work).
_TRANSCRIBE_LOCK = threading.Lock()
_SOURCE_ID_RE = re.compile(r"^[0-9a-f]{32}$")
_LANGUAGE_RE = re.compile(r"^[a-z0-9_-]{1,16}$")


def _key(source_id: str, language: Optional[str]) -> str:
    """Cache / transcript-file key for a source at a given language ('auto' = detect)."""
    if not isinstance(source_id, str) or not _SOURCE_ID_RE.fullmatch(source_id):
        raise ValueError("Invalid source reference.")
    lang = (language or "auto").strip().lower() or "auto"
    if not _LANGUAGE_RE.fullmatch(lang):
        raise ValueError("Invalid transcript language.")
    return f"{source_id}__{lang}"


def validate_reference(source_id: str, language: Optional[str] = None) -> None:
    _key(source_id, language)


def _write_json_atomic(path: Path, data: dict) -> None:
    """Commit a transcript without leaving partial JSON after interruption."""
    path.parent.mkdir(parents=True, exist_ok=True)
    temp_name = None
    try:
        with tempfile.NamedTemporaryFile(
            mode="w", encoding="utf-8", dir=path.parent,
            prefix=f".{path.name}.", suffix=".tmp", delete=False,
        ) as handle:
            temp_name = handle.name
            json.dump(data, handle, ensure_ascii=False, indent=2)
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(temp_name, path)
        temp_name = None
    finally:
        if temp_name:
            try:
                Path(temp_name).unlink(missing_ok=True)
            except OSError:
                pass


def cached(source_id: str, language: Optional[str] = None) -> Optional[dict]:
    """Return an in-memory or on-disk cached transcript for this source+language."""
    with _CACHE_LOCK:
        res = _CACHE.get(_key(source_id, language))
        if res is not None:
            return res
        tpath = TRANSCRIPTS_DIR / f"{_key(source_id, language)}.json"
        if tpath.is_file():
            try:
                data = json.loads(tpath.read_text(encoding="utf-8"))
                _CACHE[_key(source_id, language)] = data
                return data
            except Exception:
                pass
    return None


def get_or_transcribe(
    source_path: Path,
    source_id: str,
    device: str,
    progress: Optional[Callable[[float, str], None]] = None,
    language: Optional[str] = None,
    cancel_event: Optional[threading.Event] = None,
) -> dict:
    """Return a cached transcript for this source+language, or transcribe + cache it.

    Concurrency-safe: if another thread is already transcribing this source, this
    call blocks on the lock and then returns the freshly-cached result instead of
    transcribing again. Also reuses a transcript persisted on disk (survives
    restarts / in-memory cache misses). The chosen ``language`` is part of the
    cache identity, so the same video can hold a separate transcript per language.
    """
    key = _key(source_id, language)
    hit = cached(source_id, language)
    if hit is not None:
        return hit

    if progress is not None and _TRANSCRIBE_LOCK.locked():
        progress(0.0, "Waiting for another transcription to finish...")
    while not _TRANSCRIBE_LOCK.acquire(timeout=0.25):
        if cancel_event is not None and cancel_event.is_set():
            raise TranscriptionError("Transcription cancelled by user.")
    try:
        if cancel_event is not None and cancel_event.is_set():
            raise TranscriptionError("Transcription cancelled by user.")
        # Re-check now that we hold the lock — a concurrent run may have finished.
        hit = cached(source_id, language)
        if hit is not None:
            return hit

        # Disk fallback: a previous run (or session) may have already saved it.
        tpath = TRANSCRIPTS_DIR / f"{key}.json"
        if tpath.exists():
            try:
                result = json.loads(tpath.read_text(encoding="utf-8"))
                with _CACHE_LOCK:
                    _CACHE[key] = result
                logger.info("Reusing transcript on disk for %s", key)
                return result
            except Exception:  # noqa: BLE001 - corrupt/partial json -> re-transcribe
                logger.warning("Ignoring unreadable transcript %s", tpath, exc_info=True)

        result = transcriber.transcribe_video(
            source_path, key, progress=progress, device=device, language=language,
            cancel_event=cancel_event,
        )
        with _CACHE_LOCK:
            _CACHE[key] = result
        return result
    finally:
        _TRANSCRIBE_LOCK.release()


def update_cached_transcript(
    source_id: str, segments: list[dict], language: Optional[str] = None
) -> dict:
    """Update segments in memory and on disk for this source+language.

    Also re-synchronizes word-level timestamps ('words') so that
    downstream ASS caption generation uses the updated words with valid timings.
    """
    key = _key(source_id, language)
    existing = cached(source_id, language)
    if existing is None:
        tpath = TRANSCRIPTS_DIR / f"{key}.json"
        if tpath.exists():
            try:
                existing = json.loads(tpath.read_text(encoding="utf-8"))
            except Exception:
                existing = None

    if existing is None:
        raise ValueError("Transcript is not ready for this source and language.")

    clean_segments = []
    rebuilt_words = []
    full_text_parts = []

    old_segments = {s.get("id"): s for s in existing.get("segments", []) if isinstance(s, dict)}
    old_words = [w for w in existing.get("words", []) if isinstance(w, dict)]

    for idx, seg in enumerate(segments):
        s_id = seg.get("id", idx)
        start = float(seg.get("start", 0.0))
        end = float(seg.get("end", start + 1.0))
        text = str(seg.get("text", "")).strip()

        clean_segments.append({
            "id": s_id,
            "start": start,
            "end": end,
            "text": text,
        })
        if text:
            full_text_parts.append(text)

        tokens = text.split()
        if tokens:
            prior = [
                w for w in old_words
                if float(w.get("end", -1)) > start and float(w.get("start", end + 1)) < end
            ]
            prior.sort(key=lambda w: float(w.get("start", 0)))
            old_text = str(old_segments.get(s_id, {}).get("text", "")).strip()
            # Saving an unchanged line preserves every original Whisper timing.
            # A typo correction with the same word count keeps timings and only
            # replaces token text. More structural edits are approximated inside
            # this one segment without disturbing all other segments.
            if prior and text == old_text:
                rebuilt_words.extend(dict(w) for w in prior)
            elif prior and len(prior) == len(tokens):
                for tok, old_word in zip(tokens, prior):
                    rebuilt_words.append({
                        "word": tok,
                        "start": float(old_word["start"]),
                        "end": float(old_word["end"]),
                    })
            else:
                dur = max(0.1, end - start)
                step = dur / len(tokens)
                for i, tok in enumerate(tokens):
                    rebuilt_words.append({
                        "word": tok,
                        "start": round(start + i * step, 3),
                        "end": round(start + (i + 1) * step, 3),
                    })

    updated = {
        **existing,
        "text": " ".join(full_text_parts).strip(),
        "segments": clean_segments,
        "words": rebuilt_words,
    }

    with _CACHE_LOCK:
        _CACHE[key] = updated

    tpath = TRANSCRIPTS_DIR / f"{key}.json"
    try:
        _write_json_atomic(tpath, updated)
        logger.info("Saved updated transcript to %s (%d segments)", tpath.name, len(clean_segments))
    except OSError as exc:
        logger.warning("Could not persist updated transcript %s: %s", tpath, exc)

    return updated


# --------------------------------------------------------------------------- #
# Background job (so the UI can show "transcribing in the background" progress)
# --------------------------------------------------------------------------- #
class TranscriptJob:
    """A single background pre-transcription with thread-safe progress state."""

    def __init__(self, source_id: str, device: str, language: Optional[str] = None) -> None:
        self.id = uuid.uuid4().hex
        self.source_id = source_id
        self.device = device
        self.language = language
        self.status = "running"  # running | done | error | cancelled
        self.progress = 0.0
        self.message = "Preparing transcription..."
        self.error: Optional[str] = None
        self.cancel_event = threading.Event()
        self._lock = threading.Lock()
        self._rev = 0

    def cancel(self) -> None:
        """Stop work superseded by another language for the same source."""
        self.cancel_event.set()

    def update(self, **fields) -> None:
        with self._lock:
            for key, value in fields.items():
                setattr(self, key, value)
            self._rev += 1

    def snapshot(self) -> dict:
        with self._lock:
            return {
                "id": self.id,
                "status": self.status,
                "progress": round(self.progress, 4),
                "message": self.message,
                "error": self.error,
                "rev": self._rev,
            }


_JOBS: Dict[str, TranscriptJob] = {}
_JOBS_LOCK = threading.Lock()


def get(job_id: str) -> Optional[TranscriptJob]:
    with _JOBS_LOCK:
        return _JOBS.get(job_id)


def has_active_jobs() -> bool:
    with _JOBS_LOCK:
        return any(job.status == "running" for job in _JOBS.values())


def find_running(source_id: str, language: Optional[str] = None) -> Optional[TranscriptJob]:
    """Return a still-running background transcription for this source, if any.

    Lets the Generate pipeline mirror an in-flight pre-transcription for its
    requested language while it waits on the shared model lock.
    """
    requested_key = _key(source_id, language)
    with _JOBS_LOCK:
        for job in _JOBS.values():
            if (job.status == "running" and not job.cancel_event.is_set()
                    and _key(job.source_id, job.language) == requested_key):
                return job
    return None


def start(source_id: str, device: str, language: Optional[str] = None) -> TranscriptJob:
    """Begin pre-transcribing `source_id` on a daemon thread."""
    requested_key = _key(source_id, language)
    with _JOBS_LOCK:
        # Reuse an identical request. For this source, stop a transcription in
        # another language before it holds the single model lock for an entire
        # video. Preparations for other sources may belong to another browser
        # tab or a Generate job, so do not cancel them here.
        for existing in _JOBS.values():
            if existing.status != "running" or existing.cancel_event.is_set():
                continue
            if _key(existing.source_id, existing.language) == requested_key:
                return existing
        for existing in _JOBS.values():
            if (existing.status != "running" or existing.cancel_event.is_set()
                    or existing.source_id != source_id):
                continue
            existing.cancel()
        job = TranscriptJob(source_id, device, language)
        if len(_JOBS) >= 50:
            evict_key = next((k for k, j in _JOBS.items() if j.status != "running"), None)
            if evict_key is not None:
                del _JOBS[evict_key]
        _JOBS[job.id] = job
    try:
        threading.Thread(target=_run, args=(job,), daemon=True).start()
    except RuntimeError as exc:
        job.update(status="error", error=f"Could not start transcription: {exc}", message="Pre-transcription could not start.")
        logger.exception("[%s] could not start pretranscription thread", job.id)
    logger.info(
        "[%s] pretranscribe started: source=%s device=%s language=%s",
        job.id, source_id, device, language or "auto",
    )
    return job


def _run(job: TranscriptJob) -> None:
    if job.cancel_event.is_set():
        job.update(status="cancelled", message="Preparation superseded.")
        return
    if cached(job.source_id, job.language) is not None:
        job.update(status="done", progress=1.0, message="Transcript ready.")
        return
    try:
        path = uploads.resolve_upload(job.source_id)
    except InvalidVideoURLError as exc:
        job.update(status="error", error=str(exc), message="Source file not found.")
        return

    def on_progress(frac: float, msg: str) -> None:
        job.update(progress=min(0.99, frac), message=msg)

    try:
        get_or_transcribe(
            path, job.source_id, job.device, progress=on_progress, language=job.language,
            cancel_event=job.cancel_event,
        )
        if job.cancel_event.is_set():
            job.update(status="cancelled", message="Preparation superseded.")
            return
        job.update(status="done", progress=1.0, message="Transcript ready.")
        logger.info("[%s] pretranscribe done", job.id)
    except TranscriptionError as exc:
        if job.cancel_event.is_set():
            job.update(status="cancelled", message="Preparation superseded.")
            return
        logger.warning("[%s] pretranscribe failed: %s", job.id, exc)
        job.update(status="error", error=str(exc), message="Could not pre-transcribe.")
    except Exception as exc:  # noqa: BLE001 - never let the thread die silently
        logger.exception("[%s] unexpected pretranscribe failure", job.id)
        job.update(
            status="error",
            error=f"Unexpected error: {exc}",
            message="Could not pre-transcribe.",
        )
