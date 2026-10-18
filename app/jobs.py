"""Background job model + in-memory registry for the clip pipeline.

The full pipeline (download -> transcribe -> select -> render) can take minutes,
so running it inside the HTTP request would make the browser appear frozen. Each
request instead creates a :class:`Job`, runs the pipeline on a daemon thread, and
reports fine-grained progress that the frontend streams live (see the SSE
endpoint in ``main.py``).

The bounded single-process queue persists status in SQLite. Unfinished jobs
are marked interrupted on restart; rendered clips remain in the Library.
"""

from __future__ import annotations

import os
import logging
import math
import re
import threading
import time
import uuid
from typing import Dict, List, Optional

from . import job_store, captions, downloader, fonts, history, music, prefetch, pretranscribe, reframe, selector, silence, transcriber, uploads
from .clipper import ClipOptions, generate_clip, target_size
from .models import (
    LANGUAGE_NAMES,
    ClipGenerationError,
    FitMode,
    GenerateRequest,
    InvalidVideoURLError,
    TranscriptionError,
)
from .paths import CLIPS_DIR

logger = logging.getLogger("clipxy4all.jobs")


# Overall-progress span (0..1) owned by each stage. The per-stage fraction is
# mapped into these bands so the single top progress bar advances smoothly across
# the whole pipeline rather than jumping per stage.
_STAGE_SPANS = {
    "queued": (0.0, 0.0),
    "downloading": (0.02, 0.25),
    "transcribing": (0.25, 0.70),
    "selecting": (0.70, 0.74),
    "rendering": (0.74, 0.99),
    "done": (1.0, 1.0),
    "error": (0.0, 0.0),
}

# Human labels for the stepper in the UI.
STAGE_LABELS = {
    "downloading": "Download",
    "transcribing": "Transcribe",
    "selecting": "Analyze",
    "rendering": "Render",
}

# Characters not allowed in filenames on Windows (and best avoided elsewhere).
_BAD_FILENAME_CHARS = re.compile(r'[\\/:*?"<>|\x00-\x1f]+')


def download_filename(title: str, language: Optional[str], index: int) -> str:
    """Suggested download name for a clip, written in the caption's language.

    Prefixes the language's native name (e.g. "اردو", "हिन्दी", "English") so the
    file is clearly named in the language its captions are in, then the clip
    title (already in that language, since it's drawn from the transcript). Falls
    back to a numbered name when the title is empty. Always ends in ``.mp4``.
    """
    lang = (language or "").strip().lower()
    native = LANGUAGE_NAMES.get(lang, lang.upper() if lang else "Clip")
    clean_title = _BAD_FILENAME_CHARS.sub(" ", (title or "").strip()).strip()
    clean_title = re.sub(r"\s+", " ", clean_title)
    if clean_title:
        name = f"{native} - {clean_title}"
    else:
        name = f"{native} - clip {index + 1}"
    return name[:120].strip() + ".mp4"


class Job:
    """A single pipeline run with thread-safe progress + result state."""

    def __init__(self, req: GenerateRequest) -> None:
        self.id = uuid.uuid4().hex
        self.created_at = time.time()
        self.finished_at = None
        self.req = req
        self.status = "queued"  # queued | running | done | error
        self.stage = "queued"
        self.stage_progress = 0.0  # 0..1 within the current stage
        self.progress = 0.0  # 0..1 overall (derived from stage span)
        self.message = "Queued..."
        self.clips: List[dict] = []
        self.error: Optional[str] = None
        self.clip_id: Optional[str] = None
        self.cancelled = False
        self._cancel_event = threading.Event()
        self._thread: Optional[threading.Thread] = None
        self._lock = threading.RLock()
        self._rev = 0  # bumped on every change so the SSE stream only sends diffs

    def cancel(self) -> None:
        """Flag the run for cancellation; the pipeline stops at the next checkpoint."""
        with self._lock:
            if self.status in ("done", "error", "cancelled", "interrupted"):
                return
            self.cancelled = True
            self._cancel_event.set()
            self.status = "cancelled"
            self.stage = "cancelled"
            self.message = "Cancelled."
            self._rev += 1
            self.finished_at = self.finished_at or time.time()
            job_store.save(self, force=True)

    # -- mutation ---------------------------------------------------------- #
    def set_stage(self, stage: str, frac: float, message: str) -> None:
        """Move to/within a stage and recompute the overall progress band."""
        frac = min(1.0, max(0.0, frac))
        lo, hi = _STAGE_SPANS.get(stage, (0.0, 0.0))
        with self._lock:
            if self.cancelled or self.status in ("done", "error", "cancelled"):
                return
            self.status = "running"
            self.stage = stage
            self.stage_progress = frac
            self.progress = lo + frac * (hi - lo)
            self.message = message
            self._rev += 1
            job_store.save(self)

    def add_clip(self, clip: dict) -> None:
        """Publish a finished clip so the UI can show it before the run ends."""
        with self._lock:
            if self.cancelled or self.status in ("done", "error", "cancelled"):
                return
            self.clips.append(clip)
            self._rev += 1
            job_store.save(self, force=True)

    def finish(self, clips: List[dict]) -> None:
        with self._lock:
            if self.cancelled or self.status in ("done", "error", "cancelled"):
                return
            self.status = "done"
            self.stage = "done"
            self.stage_progress = 1.0
            self.progress = 1.0
            self.message = f"Done - {len(clips)} clip(s) ready."
            self.clips = clips
            self._rev += 1
            self.finished_at = self.finished_at or time.time()
            job_store.save(self, force=True)

    def fail(self, message: str) -> None:
        with self._lock:
            if self.cancelled or self.status == "cancelled":
                return
            self.status = "error"
            self.stage = "error"
            self.error = message
            self.message = message
            self._rev += 1
            self.finished_at = self.finished_at or time.time()
            job_store.save(self, force=True)

    # -- read -------------------------------------------------------------- #
    def snapshot(self) -> dict:
        """Return a JSON-serialisable view of the current state."""
        with self._lock:
            return {
                "id": self.id,
                "created_at": self.created_at,
                "finished_at": self.finished_at,
                "name": self.req.upload_name or self.req.video_url or "Video",
                "status": self.status,
                "stage": self.stage,
                "stage_progress": round(self.stage_progress, 4),
                "progress": round(self.progress, 4),
                "message": self.message,
                "clips": list(self.clips),
                "error": self.error,
                "clip_id": self.clip_id,
                "rev": self._rev,
            }


# --------------------------------------------------------------------------- #
# Registry
# --------------------------------------------------------------------------- #
_JOBS: Dict[str, Job] = {}
_JOBS_LOCK = threading.RLock()
_WAKE = threading.Condition(_JOBS_LOCK)
_RUNNING: set[str] = set()
_STOPPING = False
_DISPATCHER = None
MAX_JOBS = max(1, min(8, int(os.environ.get("CLIPXY4ALL_MAX_JOBS", "2"))))


def initialize():
    global _DISPATCHER, _STOPPING
    with _WAKE:
        if _DISPATCHER and _DISPATCHER.is_alive():
            return
        job_store.initialize()
        job_store.prune()
        _JOBS.clear()
        for request, snap in job_store.load():
            try:
                job = Job(GenerateRequest.model_validate(request))
            except Exception:  # noqa: BLE001 - a row from an older build
                logger.warning("Skipping a processing-history entry this build cannot read.")
                continue
            job.id = snap["id"]
            for key in ("created_at", "finished_at", "status", "stage", "stage_progress", "progress", "message", "clips", "error", "clip_id"):
                if key in snap: setattr(job, key, snap[key])
            job._rev = snap.get("rev", 0)
            if job.status in ("queued", "running"):
                job.status = job.stage = "interrupted"
                job.message = "Application stopped before this task finished. Submit the video again to retry."
                job.finished_at = time.time()
                job._rev += 1
                job_store.save(job, force=True)
            _JOBS[job.id] = job
        _STOPPING = False
        _DISPATCHER = threading.Thread(target=_dispatch, name="clipxy4all-queue", daemon=True)
        _DISPATCHER.start()


def create_job(req: GenerateRequest) -> Job:
    job = Job(req)
    with _WAKE:
        if _STOPPING:
            raise RuntimeError("The application is shutting down.")
        if sum(j.status in ("queued", "running") for j in _JOBS.values()) >= 100:
            raise RuntimeError("The queue contains 100 unfinished videos. Wait or cancel a task first.")
        job_store.save(job, force=True)
        _JOBS[job.id] = job
        _trim_history()
    return job


def _trim_history():
    """Keep the newest ``HISTORY_LIMIT`` jobs; only finished ones are dropped."""
    if len(_JOBS) <= job_store.HISTORY_LIMIT:
        return
    finished = sorted(
        (j for j in _JOBS.values() if j.status not in ("queued", "running")),
        key=lambda j: j.created_at,
    )
    dropped = []
    for job in finished[: len(_JOBS) - job_store.HISTORY_LIMIT]:
        _JOBS.pop(job.id, None)
        dropped.append(job.id)
    job_store.forget(dropped)


def get_job(job_id):
    with _JOBS_LOCK: return _JOBS.get(job_id)


def list_jobs():
    with _JOBS_LOCK: jobs = list(_JOBS.values())
    return [j.snapshot() for j in sorted(jobs, key=lambda j: j.created_at, reverse=True)]


def has_active_jobs():
    with _JOBS_LOCK:
        return bool(_RUNNING) or any(j.status in ("queued", "running") for j in _JOBS.values())


def cancel_all():
    with _JOBS_LOCK: jobs = list(_JOBS.values())
    for job in jobs: job.cancel()


def shutdown():
    global _STOPPING
    with _WAKE:
        _STOPPING = True
        for job in _JOBS.values():
            with job._lock:
                if job.status in ("queued", "running"):
                    job.cancelled = True
                    job._cancel_event.set()
                    job.status = job.stage = "interrupted"
                    job.message = "Interrupted when the application stopped."
                    job.finished_at = time.time()
                    job._rev += 1
                    job_store.save(job, force=True)
        _WAKE.notify_all()


def start_job(job):
    with _WAKE: _WAKE.notify_all()


def _worker(job):
    try:
        _run_pipeline(job)
    except Exception as exc:
        logger.exception("Unhandled error in job %s", job.id)
        job.fail(str(exc))
    finally:
        with _WAKE:
            _RUNNING.discard(job.id)
            _WAKE.notify_all()


def _dispatch():
    while True:
        with _WAKE:
            if _STOPPING: return
            queued = [j for j in _JOBS.values() if j.status == "queued" and not j.cancelled]
            for job in queued[:max(0, MAX_JOBS - len(_RUNNING))]:
                _RUNNING.add(job.id)
                job.set_stage("downloading", 0, "Starting processing…")
                job._thread = threading.Thread(target=_worker, args=(job,), name="clip-" + job.id[:8], daemon=True)
                try: job._thread.start()
                except RuntimeError as exc:
                    _RUNNING.discard(job.id)
                    job.fail(str(exc))
            _WAKE.wait(timeout=.25)


# --------------------------------------------------------------------------- #
# Pipeline runner
# --------------------------------------------------------------------------- #
def _run_pipeline(job: Job) -> None:
    """download -> transcribe -> select -> render, updating `job` throughout."""
    req = job.req
    logger.info("[%s] starting pipeline: %s", job.id, req.model_dump())

    try:
        if job.cancelled:
            return
        # 1) Get the source video. Order of preference:
        #    a) the user's uploaded file,
        #    b) a file fetched for this same URL in the background (prefetch),
        #    c) a fresh URL download.
        source_mp4 = None

        if req.upload_id:
            job.set_stage("downloading", 0.2, "Loading uploaded video...")
            source_mp4 = uploads.resolve_upload(req.upload_id)
            job.set_stage("downloading", 1.0, "Uploaded video ready. Preparing...")

        if source_mp4 is None and req.download_id and prefetch.matches_download(req.download_id, req.video_url or ""):
            try:
                source_mp4 = uploads.resolve_upload(req.download_id)
                job.set_stage("downloading", 1.0, "Video already downloaded. Preparing...")
            except InvalidVideoURLError:
                # Prefetched file vanished — fall back to a normal download below.
                logger.warning(
                    "[%s] prefetched file %s missing; re-downloading.",
                    job.id,
                    req.download_id,
                )

        elif source_mp4 is None and req.download_id:
            logger.warning("[%s] ignoring a prefetch reference for another URL or session", job.id)

        if source_mp4 is None:
            job.set_stage("downloading", 0.0, "Starting download...")

            def on_download(d: dict) -> None:
                status = d.get("status")
                if status == "downloading":
                    total = d.get("total_bytes") or d.get("total_bytes_estimate")
                    done = d.get("downloaded_bytes") or 0
                    if total:
                        pct = int(done * 100 / total)
                        job.set_stage("downloading", done / total, f"Downloading video... {pct}%")
                    else:
                        mb = done / 1_048_576
                        job.set_stage("downloading", 0.0, f"Downloading video... {mb:.1f} MB")
                elif status == "finished":
                    job.set_stage("downloading", 1.0, "Download complete. Preparing...")

            source_mp4 = downloader.download_video(
                req.video_url, progress_hook=on_download, cancel_event=job._cancel_event,
            )

        if job.cancelled:
            return

        # 2) Transcribe locally (word timestamps) on the requested device. The
        # transcript is keyed by the source file id (its stem), so a transcript
        # prepared in the background (pre-transcription, while the user was still
        # adjusting settings) is reused here and this stage finishes instantly.
        clip_id = uuid.uuid4().hex
        job.clip_id = clip_id
        source_id = source_mp4.stem
        try:
            pretranscribe.validate_reference(source_id, req.language)
        except ValueError as exc:
            raise InvalidVideoURLError(
                "The source video is incomplete or has an invalid reference. "
                "Please upload it again or retry the download."
            ) from exc
        device_label = {"auto": "Auto", "cuda": "GPU", "cpu": "CPU"}.get(
            req.device.value, "Auto"
        )
        def on_transcribe(frac: float, msg: str) -> None:
            job.set_stage("transcribing", frac, msg)

        if req.custom_clips and not req.captions_enabled and not req.remove_empty_air:
            # Custom ranges already supply their own timings and titles. Without
            # captions or silence removal, no downstream stage needs Whisper.
            # This also lets low-memory PCs render such clips when model loading
            # is unavailable.
            transcript = {"language": None, "words": []}
            job.set_stage("transcribing", 1.0, "Transcription not needed for these clips.")
        else:
            if pretranscribe.cached(source_id, req.language) is not None:
                job.set_stage(
                    "transcribing", 1.0, "Using transcript prepared while you set things up..."
                )
            else:
                # Mirror an in-flight pre-transcription while waiting for the
                # shared model lock, so the progress bar stays responsive.
                running = pretranscribe.find_running(source_id, req.language)
                if running is not None:
                    while True:
                        if job.cancelled:
                            logger.info("[%s] cancelled while waiting for pretranscription", job.id)
                            return
                        snap = running.snapshot()
                        if snap.get("status") != "running":
                            break
                        job.set_stage(
                            "transcribing", snap.get("progress", 0.0),
                            f"Transcribing audio with local Whisper ({device_label})... "
                            f"{int((snap.get('progress') or 0) * 100)}%",
                        )
                        if job._cancel_event.wait(0.4):
                            return
                else:
                    job.set_stage(
                        "transcribing", 0.0,
                        f"Transcribing audio with local Whisper ({device_label})...",
                    )

            if job.cancelled:
                return
            transcript = pretranscribe.get_or_transcribe(
                source_mp4, source_id, req.device.value,
                progress=on_transcribe, language=req.language,
                cancel_event=job._cancel_event,
            )
        if job.cancelled:
            return
        # The language the captions are actually in: what the user forced, or
        # what Whisper detected. Drives the per-clip download filename.
        forced = (req.language or "").strip().lower()
        caption_language = (
            forced if forced and forced != "auto" else transcript.get("language")
        )

        # 3) Select clips (custom timestamp ranges or local heuristic / Ollama).
        media_duration = None
        try:
            import av
            with av.open(str(source_mp4)) as container:
                if container.streams.video and container.streams.video[0].duration:
                    stream = container.streams.video[0]
                    candidate_duration = float(stream.duration * stream.time_base)
                    if math.isfinite(candidate_duration) and candidate_duration > 0:
                        media_duration = candidate_duration
                if media_duration is None and container.duration:
                    media_duration = float(container.duration) / 1_000_000.0
        except Exception as exc:
            logger.warning("[%s] could not probe source duration: %s", job.id, exc)
        if req.custom_clips:
            windows = []
            for i, c in enumerate(req.custom_clips):
                start_sec = max(0.0, float(c.start))
                end_sec = max(start_sec + 0.5, float(c.end))
                if media_duration is not None:
                    if start_sec >= media_duration - 0.05:
                        raise ClipGenerationError(
                            f"Custom clip {i + 1} starts after the video ends "
                            f"({media_duration:.2f}s)."
                        )
                    end_sec = min(end_sec, media_duration)
                    if end_sec - start_sec < 0.1:
                        raise ClipGenerationError(f"Custom clip {i + 1} is outside the video duration.")
                header_raw = c.header if c.header is not None else c.bar_text
                header_text = header_raw.strip() if (header_raw and header_raw.strip()) else None
                windows.append({
                    "start": start_sec,
                    "end": end_sec,
                    "title": c.title or f"Custom Clip {i + 1}",
                    "header": header_text,
                    "score": 10.0,
                })
            job.set_stage("selecting", 1.0, f"Using {len(windows)} custom timestamp clip(s).")
        else:
            job.set_stage("selecting", 0.3, "Analyzing transcript for the best moments...")
            windows = selector.select_clips(
                transcript,
                req.num_clips,
                req.clip_length,
                progress_cb=lambda frac, msg: job.set_stage("selecting", 0.3 + frac * 0.6, msg),
                source_duration=media_duration,
            )
            if not windows:
                raise ClipGenerationError(
                    "Could not find any suitable clip windows in this video. "
                    "Try a longer video or fewer clips."
                )
            job.set_stage("selecting", 1.0, f"Found {len(windows)} clip(s) to render.")

        # 4) Per clip: build ASS captions + render with ffmpeg. The caption canvas
        # must match the actual output frame (1:1 in square mode, aspect otherwise).
        words = transcript.get("words") or []
        caption_overrides = fonts.with_language_font(
            req.caption_overrides.model_dump() if req.caption_overrides else None,
            caption_language,
        )
        cinematic = req.cinematic.model_dump() if req.cinematic else None
        # Resolve the background-music track once (None if unset / missing).
        music_path = None
        if req.music_track:
            try:
                music_path = music.resolve_track(req.music_track)
            except InvalidVideoURLError:
                logger.warning("[%s] music track %r not found; skipping.", job.id, req.music_track)
        if getattr(req, "split_screen", False):
            width, height = (1080, 1920)
        else:
            width, height = target_size(req.aspect_ratio, req.fit_mode)
        clip_dir = CLIPS_DIR / clip_id
        clip_dir.mkdir(parents=True, exist_ok=True)

        if req.upload_id:
            source_label = req.upload_name or "Uploaded file"
            source_type = "upload"
        else:
            source_label = req.video_url or "Unknown source"
            source_type = "url"
        history_settings = {
            "aspect_ratio": req.aspect_ratio.value,
            "fit_mode": req.fit_mode.value,
            "caption_style": req.caption_style if req.captions_enabled else "none",
            "captions_enabled": req.captions_enabled,
            "num_clips": req.num_clips,
            "language": caption_language,
        }

        results: List[dict] = []
        total = len(windows)
        for index, win in enumerate(windows):
            if job.cancelled:
                logger.info("[%s] cancelled before clip %d", job.id, index)
                return
            start, end = float(win["start"]), float(win["end"])
            raw_words = []
            for w in words:
                try:
                    if float(w["end"]) > start and float(w["start"]) < end:
                        raw_words.append(w)
                except (KeyError, ValueError, TypeError):
                    continue

            # Optional Empty-Air / Silence Removal (strictly active only when requested)
            intervals = None
            ass_clip_start = start
            clip_words = raw_words

            if getattr(req, "remove_empty_air", False):
                try:
                    detected_intervals = silence.detect_kept_intervals(start, end, raw_words)
                    if silence.is_silence_removal_active(detected_intervals, start, end):
                        intervals = detected_intervals
                        clip_words = silence.remap_words(raw_words, intervals)
                        ass_clip_start = 0.0  # remapped words start from 0.0 of the compressed clip
                        logger.info(
                            "[%s] clip %d: empty-air removal applied (reduced from %.2fs to %.2fs across %d intervals)",
                            job.id,
                            index,
                            end - start,
                            sum(e - s for s, e in intervals),
                            len(intervals),
                        )
                except Exception as silence_exc:
                    logger.warning(
                        "[%s] clip %d: empty-air removal failed (%s); rendering original uncut window.",
                        job.id,
                        index,
                        silence_exc,
                    )
                    intervals = None
                    ass_clip_start = start
                    clip_words = raw_words

            # Optional Auto Face Tracking (for 1:1 square mode or viral split-screen mode)
            reframe_kfs = None
            is_square = (req.fit_mode == FitMode.SQUARE or getattr(req.fit_mode, "value", req.fit_mode) == "square")
            is_split = getattr(req, "split_screen", False)
            need_face_tracking = (is_square and getattr(req, "face_tracking", False)) or (is_split and getattr(req, "split_face_tracking", True))
            if need_face_tracking:
                job.set_stage(
                    "rendering",
                    index / total,
                    f"Tracking face for clip {index + 1} of {total}...",
                )
                try:
                    from app import face_tracker
                    reframe_kfs = face_tracker.generate_face_tracking_keyframes(
                        source_mp4=source_mp4,
                        start=start,
                        end=end,
                        intervals=intervals,
                        cancel_event=job._cancel_event,
                    )
                    if reframe_kfs:
                        logger.info(
                            "[%s] clip %d: face tracking generated %d keyframes",
                            job.id,
                            index,
                            len(reframe_kfs),
                        )
                except Exception as ft_exc:
                    logger.warning(
                        "[%s] clip %d: face tracking failed (%s); falling back to center crop.",
                        job.id,
                        index,
                        ft_exc,
                    )
                    reframe_kfs = None

            if job.cancelled:
                logger.info("[%s] cancelled after face tracking for clip %d", job.id, index)
                return

            job.set_stage(
                "rendering",
                index / total,
                f"Rendering clip {index + 1} of {total}...",
            )

            captions_enabled = getattr(req, "captions_enabled", True)
            clip_bar_text = win.get("header")
            if clip_bar_text is None:
                clip_bar_text = req.bar_text

            if captions_enabled:
                ass_path = clip_dir / f"{index}.ass"
                ass_path = captions.build_ass(
                    words=clip_words,
                    style_preset=req.caption_style,
                    video_w=width,
                    video_h=height,
                    out_path=ass_path,
                    clip_start=ass_clip_start,
                    overrides=caption_overrides,
                    fit_mode=req.fit_mode.value,
                    split_screen=getattr(req, "split_screen", False),
                    has_title=bool(clip_bar_text and clip_bar_text.strip()),
                    cinematic=cinematic,
                )
            else:
                ass_path = None
                logger.info(
                    "[%s] clip %d: captions disabled by user; skipping subtitle generation",
                    job.id,
                    index,
                )

            image_wm = None
            if req.fit_mode == FitMode.SQUARE and getattr(req, "image_watermark", None) and req.image_watermark.enabled:
                image_wm = req.image_watermark.model_dump()

            opts = ClipOptions(
                aspect_ratio=req.aspect_ratio,
                fit_mode=req.fit_mode,
                square_corners=req.square_corners.value,
                ass_path=ass_path,
                video_background=req.video_background,
                clip_id=clip_id,
                index=index,
                bar_text=clip_bar_text,
                bar_text_color=req.bar_text_color or "#FFFFFF",
                bar_text_anim=req.bar_text_anim or "none",
                cinematic=cinematic,
                music_path=music_path,
                music_volume=req.music_volume if req.music_volume is not None else 35.0,
                music_duck=req.music_duck if req.music_duck is not None else 70.0,
                music_start=req.music_start if req.music_start is not None else 0.0,
                signature=req.signature.model_dump() if req.signature else None,
                image_watermark=image_wm,
                reframe=reframe_kfs,
                intervals=intervals,
                split_screen=getattr(req, "split_screen", False),
                split_broll=getattr(req, "split_broll", "subway_surfers"),
                split_divider=getattr(req, "split_divider", "black"),
                split_face_tracking=getattr(req, "split_face_tracking", True),
                custom_broll_id=getattr(req, "custom_broll_id", None),
                progress_bar=getattr(req, "progress_bar", False),
                progress_bar_color=getattr(req, "progress_bar_color", "#FACC15"),
                progress_bar_position=getattr(req, "progress_bar_position", "top"),
                progress_bar_height=getattr(req, "progress_bar_height", 10),
            )
            try:
                generate_clip(source_mp4, start, end, opts, cancel_event=job._cancel_event)
            except ClipGenerationError:
                if not intervals or job.cancelled:
                    raise
                # A concat failure must not fall back with captions and crop
                # keyframes that are still on the compressed timeline.
                logger.warning(
                    "[%s] clip %d: silence-removal render failed; rebuilding the original timeline.",
                    job.id, index, exc_info=True,
                )
                opts.intervals = None
                if captions_enabled:
                    ass_path = captions.build_ass(
                        words=raw_words,
                        style_preset=req.caption_style,
                        video_w=width,
                        video_h=height,
                        out_path=ass_path,
                        clip_start=start,
                        overrides=caption_overrides,
                        fit_mode=req.fit_mode.value,
                        split_screen=getattr(req, "split_screen", False),
                        has_title=bool(clip_bar_text and clip_bar_text.strip()),
                        cinematic=cinematic,
                    )
                opts.ass_path = ass_path
                if need_face_tracking:
                    try:
                        from app import face_tracker as tracker
                        opts.reframe = tracker.generate_face_tracking_keyframes(
                            source_mp4=source_mp4, start=start, end=end, intervals=None,
                            cancel_event=job._cancel_event,
                        )
                    except Exception:
                        opts.reframe = None
                generate_clip(source_mp4, start, end, opts, cancel_event=job._cancel_event)
            if job.cancelled:
                logger.info("[%s] cancelled after clip %d", job.id, index)
                return

            # So "Reframe" can later re-render just this one clip (see reframe.py).
            reframe.save_recipe(
                clip_id, index, source_mp4=source_mp4, start=start, end=end,
                opts_kwargs={
                    "aspect_ratio": opts.aspect_ratio,
                    "fit_mode": opts.fit_mode,
                    "square_corners": opts.square_corners,
                    "ass_path": opts.ass_path,
                    "video_background": opts.video_background,
                    "bar_text": opts.bar_text,
                    "bar_text_color": opts.bar_text_color,
                    "bar_text_anim": opts.bar_text_anim,
                    "cinematic": opts.cinematic,
                    "music_path": opts.music_path,
                    "music_volume": opts.music_volume,
                    "music_duck": opts.music_duck,
                    "music_start": opts.music_start,
                    "signature": opts.signature,
                    "reframe": opts.reframe,
                    "intervals": opts.intervals,
                    "split_screen": opts.split_screen,
                    "split_broll": opts.split_broll,
                    "split_divider": opts.split_divider,
                    "split_face_tracking": opts.split_face_tracking,
                    "custom_broll_id": getattr(opts, "custom_broll_id", None),
                    "progress_bar": getattr(opts, "progress_bar", False),
                    "progress_bar_color": getattr(opts, "progress_bar_color", "#FACC15"),
                    "progress_bar_position": getattr(opts, "progress_bar_position", "top"),
                    "progress_bar_height": getattr(opts, "progress_bar_height", 10),
                    "image_watermark": getattr(opts, "image_watermark", None),
                },
            )

            title = win.get("title") or f"Clip {index + 1}"
            clip = {
                "index": index,
                "title": title,
                "start": round(start, 2),
                "end": round(end, 2),
                "url": f"/clips/{clip_id}/{index}.mp4",
                "language": caption_language,
                "filename": download_filename(title, caption_language, index),
            }
            results.append(clip)
            job.add_clip(clip)  # stream the finished clip to the UI immediately
            try:
                history.upsert_entry(
                    clip_id=clip_id,
                    source=source_label,
                    source_type=source_type,
                    settings=history_settings,
                    clips=results,
                )
            except Exception:
                logger.warning("[%s] could not persist completed clip %d", job.id, index, exc_info=True)

        job.finish(results)
        logger.info("[%s] pipeline complete: %d clips", job.id, len(results))

    except InvalidVideoURLError as exc:
        logger.warning("[%s] download error: %s", job.id, exc)
        job.fail(str(exc))
    except TranscriptionError as exc:
        logger.warning("[%s] transcription error: %s", job.id, exc)
        job.fail(str(exc))
    except ClipGenerationError as exc:
        if job.cancelled or "cancelled" in str(exc).lower():
            logger.info("[%s] render cancelled by user", job.id)
            return
        logger.warning("[%s] render error: %s", job.id, exc)
        job.fail(str(exc))
    except Exception as exc:  # noqa: BLE001 - never let a thread die silently
        logger.exception("[%s] unexpected pipeline failure", job.id)
        job.fail(f"Unexpected error: {exc}")
    finally:
        import gc
        gc.collect()
