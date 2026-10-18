"""FastAPI app wiring the local pipeline together.

Startup loads the whisper model once and ensures the bundled font exists. The
heavy pipeline (download -> transcribe -> select -> render) runs on a background
thread as a :class:`~app.jobs.Job` so the request returns instantly; the
frontend then streams live progress over Server-Sent Events. Every domain error
is captured on the job (and surfaced in the stream) so the server never crashes.
"""

from __future__ import annotations

import asyncio
import json
import logging
import os
import stat
import subprocess
import sys
import threading
import time
import uuid
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Optional, Literal
from urllib.parse import urlsplit

from fastapi import FastAPI, File, HTTPException, Request, UploadFile
from fastapi.responses import FileResponse, JSONResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

import shutil
import tempfile

from . import paths
from .paths import BROLL_DIR, CLIPS_DIR, DOWNLOADS_DIR, FONTS_DIR, MUSIC_DIR, TEMP_DIR, WATERMARKS_DIR, WEB_DIST_DIR, ensure_dirs
from . import captions, fonts, history, jobs, mood, music, prefetch, pretranscribe, reframe, silence, transcriber, uploads, watermark
from .clipper import ClipOptions, generate_clip, has_active_processes, terminate_active_processes
from .models import ClipGenerationError, Device, GenerateRequest, InvalidVideoURLError, ReframeKeyframe, TranscriptionError, UpdateTranscriptRequest

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)
logger = logging.getLogger("clipxy4all")


def _clean_temp_dir() -> None:
    """Remove work files older than two hours, without following directory links."""
    cutoff = time.time() - 2 * 60 * 60
    try:
        root_info = TEMP_DIR.lstat()
    except OSError:
        return
    if (stat.S_ISLNK(root_info.st_mode) or
            getattr(root_info, "st_file_attributes", 0) & stat.FILE_ATTRIBUTE_REPARSE_POINT):
        return
    root = TEMP_DIR.resolve()
    clips = CLIPS_DIR.resolve()
    # Fail closed if a changed layout or junction overlaps the clip library.
    if root == clips or clips in root.parents or root in clips.parents:
        logger.warning("Skipping temp cleanup: temp overlaps the clip library.")
        return

    def clean(directory: Path) -> None:
        for item in directory.iterdir():
            try:
                info = item.lstat()
                if (stat.S_ISLNK(info.st_mode) or
                        getattr(info, "st_file_attributes", 0) & stat.FILE_ATTRIBUTE_REPARSE_POINT):
                    continue
                if stat.S_ISDIR(info.st_mode):
                    clean(item)
                    if info.st_mtime < cutoff:
                        item.rmdir()  # Only if empty; never discard fresh descendants.
                elif stat.S_ISREG(info.st_mode) and info.st_mtime < cutoff:
                    item.unlink(missing_ok=True)
            except OSError:
                pass  # Busy, removed concurrently, or non-empty: leave it alone.

    try:
        clean(root)
    except OSError:
        logger.debug("Temp cleanup skipped", exc_info=True)


def _load_model_background() -> None:
    """Load whisper off the startup path (see lifespan() for why)."""
    try:
        transcriber.load_model()
        logger.info(
            "Startup complete. Whisper '%s' on %s. No external AI APIs are used.",
            transcriber.get_model_size(),
            transcriber.get_device(),
        )
    except Exception:  # noqa: BLE001 - status already recorded by transcriber
        logger.exception("Background whisper model load failed.")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create dirs, ensure the font, and start loading whisper.

    The bundled model loads on a background thread so the frontend can show
    its local loading status while the server is already accepting requests.
    """
    ensure_dirs()
    jobs.initialize()
    _clean_temp_dir()
    fonts.ensure_fonts()
    threading.Thread(target=_load_model_background, daemon=True).start()
    try:
        yield
    finally:
        jobs.shutdown()
        terminate_active_processes()


app = FastAPI(title="Clipxy4all Local AI Video Clipper", version="3.6.1", lifespan=lifespan)


def _is_loopback_host(hostname: Optional[str]) -> bool:
    return (hostname or "").lower().rstrip(".") in {"127.0.0.1", "localhost", "::1"}


@app.middleware("http")
async def local_browser_only(request: Request, call_next):
    """Reject DNS-rebinding and cross-site writes to the local desktop API."""
    host = request.url.hostname
    is_test_client = (
        request.client is not None and request.client.host == "testclient" and
        (host or "").lower() == "testserver"
    )
    if not _is_loopback_host(host) and not is_test_client:
        return JSONResponse(status_code=400, content={"detail": "Clipxy4all only accepts local requests."})

    if request.method not in {"GET", "HEAD", "OPTIONS"}:
        origin = request.headers.get("origin")
        if origin:
            try:
                origin_host = urlsplit(origin).hostname
            except ValueError:
                origin_host = None
            if not _is_loopback_host(origin_host):
                return JSONResponse(status_code=403, content={"detail": "Cross-site request blocked."})
    return await call_next(request)

# Serve generated clips so the frontend can preview/download them.
app.mount("/clips", StaticFiles(directory=str(CLIPS_DIR)), name="clips")
# Serve caption fonts so the UI can @font-face them for an accurate live preview.
app.mount("/fonts", StaticFiles(directory=str(FONTS_DIR)), name="fonts")
# Serve the music library so the UI can preview tracks with an <audio> element.
app.mount("/music", StaticFiles(directory=str(MUSIC_DIR)), name="music")
# Serve broll assets (e.g. Subway Surfers) for split-screen live preview
app.mount("/broll", StaticFiles(directory=str(BROLL_DIR)), name="broll")
# Serve watermark assets for live preview
app.mount("/watermarks", StaticFiles(directory=str(WATERMARKS_DIR)), name="watermarks")
# Serve the built React dashboard's hashed JS/CSS bundles (web/dist/assets) when a
# production build exists, so the backend can serve the React app at "/" directly.
if (WEB_DIST_DIR / "assets").is_dir():
    app.mount("/assets", StaticFiles(directory=str(WEB_DIST_DIR / "assets")), name="assets")


@app.get("/favicon.ico")
def favicon():
    for candidate in (WEB_DIST_DIR / "favicon.ico", WEB_DIST_DIR / ".." / "public" / "favicon.ico"):
        if candidate.is_file():
            return FileResponse(str(candidate))
    return JSONResponse(status_code=404, content={"detail": "Favicon not found"})


@app.get("/logo-icon.png")
def logo_icon():
    for candidate in (WEB_DIST_DIR / "logo-icon.png", WEB_DIST_DIR / ".." / "public" / "logo-icon.png"):
        if candidate.is_file():
            return FileResponse(str(candidate))
    return JSONResponse(status_code=404, content={"detail": "Logo not found"})


@app.get("/health")
@app.get("/api/health")
def health() -> dict:
    return {"status": "ok", "app": "clipxy4all-v3", "pid": os.getpid(), "device": transcriber.get_device()}


@app.get("/api/model-status")
def model_status() -> dict:
    """Local Whisper loading progress, polled by the frontend splash screen."""
    return transcriber.model_status()


@app.post("/api/model-retry")
def model_retry() -> dict:
    """Retry a failed local model warm-up without restarting the application."""
    if transcriber.prepare_model_retry():
        threading.Thread(target=_load_model_background, daemon=True).start()
    return transcriber.model_status()


@app.get("/api/caption-styles")
def caption_styles() -> list[dict]:
    """Return the caption style presets for the UI (chips + live preview)."""
    return captions.get_presets_for_api()


@app.get("/api/devices")
def devices() -> dict:
    """Report compute devices the UI may offer for transcription.

    Lets the frontend enable/disable the GPU option and show the active device.
    """
    return {
        "devices": transcriber.available_devices(),
        "default": transcriber.get_device(),
        "cuda_available": transcriber.cuda_available(),
        "gpu_name": transcriber.gpu_name(),
        "model_size": transcriber.get_model_size(),
    }


@app.get("/api/cache-info")
def cache_info() -> dict:
    """Return disk space used by downloaded source videos and temporary cache."""
    downloads_bytes = 0
    if DOWNLOADS_DIR.is_dir():
        for f in DOWNLOADS_DIR.glob("*"):
            try:
                if f.is_file():
                    downloads_bytes += f.stat().st_size
                elif f.is_dir():
                    downloads_bytes += sum(sf.stat().st_size for sf in f.glob("**/*") if sf.is_file())
            except Exception:
                pass

    temp_bytes = 0
    if TEMP_DIR.is_dir():
        for f in TEMP_DIR.glob("*"):
            try:
                if f.is_file():
                    temp_bytes += f.stat().st_size
                elif f.is_dir():
                    temp_bytes += sum(sf.stat().st_size for sf in f.glob("**/*") if sf.is_file())
            except Exception:
                pass

    return {
        "downloads_bytes": downloads_bytes,
        "temp_bytes": temp_bytes,
        "total_bytes": downloads_bytes + temp_bytes,
    }


@app.post("/api/clear-cache")
def clear_cache() -> dict:
    """Delete all downloaded source videos and temporary work files.

    Clips in `clips/` and assets/fonts are never touched.
    """
    if (jobs.has_active_jobs() or prefetch.has_active_jobs() or
            pretranscribe.has_active_jobs() or has_active_processes()):
        raise HTTPException(
            status_code=409,
            detail="A download, transcription, or clip job is still running. Wait for it to finish or cancel it before clearing cache.",
        )
    freed_bytes = 0
    if DOWNLOADS_DIR.is_dir():
        for item in DOWNLOADS_DIR.glob("*"):
            try:
                if item.is_file():
                    size = item.stat().st_size
                    item.unlink(missing_ok=True)
                    freed_bytes += size
                elif item.is_dir():
                    size = sum(sf.stat().st_size for sf in item.glob("**/*") if sf.is_file())
                    shutil.rmtree(item, ignore_errors=True)
                    freed_bytes += size
            except Exception as exc:
                logger.warning("Could not delete download cache item %s: %s", item, exc)

    if TEMP_DIR.is_dir():
        for item in TEMP_DIR.glob("*"):
            try:
                if item.is_file():
                    size = item.stat().st_size
                    item.unlink(missing_ok=True)
                    freed_bytes += size
                elif item.is_dir():
                    size = sum(sf.stat().st_size for sf in item.glob("**/*") if sf.is_file())
                    shutil.rmtree(item, ignore_errors=True)
                    freed_bytes += size
            except Exception as exc:
                logger.warning("Could not delete temp cache item %s: %s", item, exc)

    return {"status": "ok", "freed_bytes": freed_bytes}


@app.post("/api/shutdown")
def shutdown() -> dict:
    """Stop the Clipxy4all backend server cleanly."""
    import time

    def _delayed_exit():
        time.sleep(0.4)
        logger.info("Clipxy4all server shutting down by user request.")
        jobs.shutdown()
        terminate_active_processes()
        os._exit(0)

    threading.Thread(target=_delayed_exit, daemon=True).start()
    return {"status": "ok", "message": "Clipxy4all server is shutting down."}


@app.post("/api/warmup")
def warmup(device: Device = Device.AUTO) -> dict:
    """Load the Whisper model on the chosen device and report readiness.

    The frontend calls this when the user changes the Compute dropdown so it can
    show a live "loading / ready / failed" status. Loads are cached per device,
    so re-selecting a warm device returns instantly.
    """
    already = device.value != "auto" and transcriber.is_loaded(device.value)
    try:
        transcriber.load_model(device.value)
        return {
            "status": "ready",
            "device": transcriber.get_device(),
            "model_size": transcriber.get_model_size(),
            "cached": already,
        }
    except TranscriptionError as exc:
        return {"status": "error", "device": device.value, "message": str(exc)}


@app.post("/api/upload")
def upload(file: UploadFile = File(...)) -> dict:
    """Accept a video file from the user's machine and return an upload reference.

    The returned ``upload_id`` is then passed to ``POST /api/generate`` instead of
    a ``video_url``. Runs in the threadpool (sync def) so streaming a large file
    to disk doesn't block the event loop.
    """
    try:
        info = uploads.save_upload(file.filename, file.file)
    except InvalidVideoURLError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    finally:
        file.file.close()
    return {"status": "ok", **info}


@app.get("/api/fonts")
def get_fonts() -> dict:
    """List caption fonts the UI can offer (bundled trending set + user uploads)."""
    return fonts.list_fonts()


@app.post("/api/fonts/upload")
def upload_font(file: UploadFile = File(...)) -> dict:
    """Accept a user .ttf/.otf font and register it for use in captions."""
    try:
        info = fonts.save_user_font(file.filename, file.file)
    except InvalidVideoURLError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    finally:
        file.file.close()
    return {"status": "ok", **info}


@app.get("/api/music")
def get_music() -> dict:
    """List background-music tracks (files in assets/music + uploads)."""
    return {"tracks": music.list_tracks()}


@app.post("/api/music/upload")
def upload_music(file: UploadFile = File(...)) -> dict:
    """Accept a user audio file and add it to the background-music library."""
    try:
        info = music.save_track(file.filename, file.file)
    except InvalidVideoURLError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    finally:
        file.file.close()
    return {"status": "ok", **info}


@app.post("/api/watermark/upload")
def upload_watermark(file: UploadFile = File(...)) -> dict:
    """Accept a user watermark image (.jpg, .jpeg, .png) for 1:1 square video branding."""
    try:
        info = watermark.save_watermark(file.filename, file.file)
    except (ValueError, InvalidVideoURLError) as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    finally:
        file.file.close()
    return {"status": "ok", **info}


@app.get("/api/watermark/list")
def list_watermarks() -> dict:
    """List available uploaded watermark images."""
    return {"watermarks": watermark.list_watermarks()}


class PrefetchRequest(BaseModel):
    """Body for POST /api/prefetch — start fetching a URL video in the background."""

    video_url: str


@app.post("/api/prefetch")
def prefetch_start(req: PrefetchRequest) -> dict:
    """Begin downloading a URL video ahead of time and return a prefetch id.

    The frontend calls this when the user reaches Step 2 with a pasted link, then
    polls ``GET /api/prefetch/{id}`` for progress. When done, the returned
    ``download_id`` is passed to ``/api/generate`` so the pipeline reuses the file.
    """
    url = (req.video_url or "").strip()
    if not url:
        raise HTTPException(status_code=400, detail="No video URL was provided.")
    pf = prefetch.start(url)
    return {"prefetch_id": pf.id, **pf.snapshot()}


@app.get("/api/prefetch/{prefetch_id}")
def prefetch_status(prefetch_id: str) -> dict:
    """Return the current progress/result of a background prefetch."""
    pf = prefetch.get(prefetch_id)
    if pf is None:
        raise HTTPException(status_code=404, detail="Unknown prefetch id.")
    return pf.snapshot()


class PretranscribeRequest(BaseModel):
    """Body for POST /api/pretranscribe — transcribe a ready video in the background."""

    source_id: str
    device: Device = Device.AUTO
    language: Optional[str] = None


@app.post("/api/pretranscribe")
def pretranscribe_start(req: PretranscribeRequest) -> dict:
    """Begin transcribing an already-downloaded/uploaded video ahead of Generate.

    Called once the video is on disk (download finished, or an upload). The
    result is cached by source id, so the Generate pipeline reuses it and skips
    the transcribe stage. The frontend polls ``GET /api/pretranscribe/{id}``.
    """
    source_id = (req.source_id or "").strip()
    if not source_id:
        raise HTTPException(status_code=400, detail="No source id was provided.")
    try:
        pretranscribe.validate_reference(source_id, req.language)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    job = pretranscribe.start(source_id, req.device.value, req.language)
    return {"pretranscribe_id": job.id, **job.snapshot()}


@app.get("/api/pretranscribe/{job_id}")
def pretranscribe_status(job_id: str) -> dict:
    """Return the current progress/result of a background pre-transcription."""
    job = pretranscribe.get(job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Unknown pretranscribe id.")
    return job.snapshot()


@app.post("/api/transcript/{source_id}")
def update_transcript(source_id: str, req: UpdateTranscriptRequest) -> dict:
    """Save user edits to the transcript for a given source video."""
    source_id = (source_id or "").strip()
    if not source_id:
        raise HTTPException(status_code=400, detail="No source id was provided.")
    try:
        updated = pretranscribe.update_cached_transcript(source_id, req.segments, req.language)
        return {"status": "ok", "source_id": source_id, "transcript": updated}
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        logger.exception("Failed to update transcript for %s", source_id)
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/api/download/{download_id}/video")
def download_file(download_id: str) -> FileResponse:
    """Stream a prefetched video file so the Step-2 preview can swap from the
    embeddable player to the real downloaded file once it's ready.

    The id is resolved via the same ``downloads/<id>.*`` glob used for uploads,
    so it can never reach a file outside the downloads directory. FileResponse
    serves Range requests, so the ``<video>`` element can seek/stream normally.
    """
    try:
        path = uploads.resolve_upload(download_id)
    except InvalidVideoURLError:
        raise HTTPException(status_code=404, detail="Downloaded video not found.")
    return FileResponse(str(path))


class ClipRef(BaseModel):
    """Reference to one generated clip."""

    clip_id: str
    index: int


@app.get("/api/history")
def get_history() -> list:
    """All past generations and their clips, newest first (for the Clips panel)."""
    return history.list_entries()


@app.delete("/api/clip/{clip_id}/{index}")
def delete_clip(clip_id: str, index: int) -> dict:
    """Remove one generated clip (deletes the file and drops it from history)."""
    if history.clip_path(clip_id, index) is None:
        raise HTTPException(status_code=400, detail="Invalid clip reference.")
    deleted = history.remove_clip(clip_id, index)
    if not deleted:
        raise HTTPException(
            status_code=409,
            detail="Windows could not delete this clip because another program is using it. Close the video/player and try again.",
        )
    return {"status": "ok", "deleted": deleted}


class ReframeRequest(BaseModel):
    """Body for POST /api/clip/{clip_id}/{index}/reframe."""

    video_background: Optional[Literal["black", "white"]] = Field(
        default=None,
        description="Canvas colour behind the video: 'black' (default) or "
        "'white'. Omitted leaves the colour the clip was rendered with.",
    )

    keyframes: list[ReframeKeyframe] = Field(
        default_factory=list,
        description="Manual crop keyframes: [{time, pos_x, pos_y}, ...]. Empty "
        "list resets to the default centred crop.",
    )


@app.get("/api/clip/{clip_id}/{index}/source")
def clip_source(clip_id: str, index: int) -> FileResponse:
    """Stream the ORIGINAL (uncropped) source segment behind one clip, for the
    Reframe Editor — it needs the full frame to let the user reposition the
    crop, not the already-cropped output."""
    recipe = reframe.get_recipe(clip_id, index)
    if recipe is None:
        raise HTTPException(
            status_code=404,
            detail="No render recipe for this clip (the server may have restarted since it was generated).",
        )
    return FileResponse(recipe["source_mp4"])


@app.get("/api/clip/{clip_id}/{index}/reframe")
def get_reframe_info(clip_id: str, index: int) -> dict:
    """The clip's trim range (start/end, seconds into the source) — the
    Reframe Editor needs this to know what span of the source video to show."""
    recipe = reframe.get_recipe(clip_id, index)
    if recipe is None:
        raise HTTPException(status_code=404, detail="No render recipe for this clip.")
    return {
        "start": recipe["start"],
        "end": recipe["end"],
        "intervals": recipe.get("opts_kwargs", {}).get("intervals"),
        "video_background": recipe.get("opts_kwargs", {}).get("video_background", "black"),
        "fit_mode": recipe.get("opts_kwargs", {}).get("fit_mode", "crop"),
        "aspect_ratio": recipe.get("opts_kwargs", {}).get("aspect_ratio", "9:16"),
        "square_corners": recipe.get("opts_kwargs", {}).get("square_corners", "square"),
    }


@app.post("/api/clip/{clip_id}/{index}/reframe")
def reframe_clip(clip_id: str, index: int, req: ReframeRequest) -> dict:
    """Re-render ONE clip with a manual crop-position path, in place.

    Reuses the exact recipe (source file, trim range, captions, effects,
    music, watermark) saved when the clip was first generated — only the crop
    keyframes change, and only this one file is touched.
    """
    if history.clip_path(clip_id, index) is None:
        raise HTTPException(status_code=400, detail="Invalid clip reference.")
    recipe = reframe.get_recipe(clip_id, index)
    if recipe is None:
        raise HTTPException(
            status_code=404,
            detail="No render recipe for this clip (the server may have restarted since it was generated).",
        )
    opts_kwargs = dict(recipe["opts_kwargs"])
    if req.video_background is not None:
        opts_kwargs["video_background"] = req.video_background
    incoming_kfs = [kf.model_dump() for kf in req.keyframes]
    intervals = opts_kwargs.get("intervals")
    if intervals and incoming_kfs:
        clip_start = float(recipe.get("start", 0.0))
        remapped_kfs = []
        for kf in incoming_kfs:
            src_t = clip_start + max(0.0, float(kf.get("time", 0.0)))
            new_t = silence.remap_timestamp(src_t, intervals)
            remapped_kfs.append({
                **kf,
                "time": round(new_t, 3),
            })
        remapped_kfs.sort(key=lambda k: k["time"])
        deduped = []
        for k in remapped_kfs:
            if deduped and abs(deduped[-1]["time"] - k["time"]) < 0.001:
                deduped[-1] = k
            else:
                deduped.append(k)
        opts_kwargs["reframe"] = deduped
    else:
        opts_kwargs["reframe"] = incoming_kfs or None

    opts = ClipOptions(
        clip_id=clip_id,
        index=index,
        **opts_kwargs,
    )
    try:
        generate_clip(Path(recipe["source_mp4"]), recipe["start"], recipe["end"], opts)
    except ClipGenerationError as exc:
        raise HTTPException(status_code=500, detail=str(exc))
    reframe.save_recipe(
        clip_id,
        index,
        source_mp4=Path(recipe["source_mp4"]),
        start=recipe["start"],
        end=recipe["end"],
        opts_kwargs=opts_kwargs,
    )
    return {"status": "ok", "url": f"/clips/{clip_id}/{index}.mp4?v={uuid.uuid4().hex[:8]}"}


@app.post("/api/reveal")
def reveal_clip(ref: ClipRef) -> dict:
    """Open the clip's folder in the OS file manager with the file selected.

    Local-only convenience (this app runs on the user's own machine). The path is
    validated to live under the clips directory before anything is launched.
    """
    path = history.clip_path(ref.clip_id, ref.index)
    if path is None or not path.exists():
        raise HTTPException(status_code=404, detail="Clip not found on disk.")
    try:
        if sys.platform.startswith("win"):
            # explorer returns a non-zero exit code even on success — ignore it.
            # Passing explorer /select,"<normpath>" avoids list2cmdline wrapping the
            # /select prefix in quotes when the path contains spaces.
            norm = os.path.normpath(str(path))
            subprocess.run(f'explorer /select,"{norm}"', check=False)
        elif sys.platform == "darwin":
            subprocess.run(["open", "-R", str(path)], check=False)
        else:
            subprocess.run(["xdg-open", str(path.parent)], check=False)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=f"Could not open the folder: {exc}")
    return {"status": "ok"}


@app.get("/")
def index():
    """Serve the frontend.

    Serve the built React dashboard (web/dist). A missing build is an incomplete
    installation and must not expose the obsolete v2 fallback UI.
    ``no-store`` keeps the browser from pinning a stale index that points at old,
    since-rebuilt asset hashes (the "old UI until hard refresh" bug).
    """
    from fastapi.responses import HTMLResponse
    react_index = WEB_DIST_DIR / "index.html"
    if react_index.is_file():
        return FileResponse(str(react_index), headers={"Cache-Control": "no-store"})
    # Show a useful diagnostic instead of endlessly refreshing a missing UI.
    return HTMLResponse(
        content="""<!doctype html><html><head><meta charset="UTF-8">
<title>Clipxy4all — Installation incomplete</title>
<style>
  body{margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh;
    background:#0a0a0a;color:#fff;font-family:system-ui,sans-serif;text-align:center}
  h1{font-size:2rem;margin-bottom:.5rem}p{color:#aaa;max-width:440px}
</style></head><body>
<div><h1>Clipxy4all could not open</h1>
<p>The dashboard files are missing from this installation. Please reinstall Clipxy4all.</p>
</div>
</body></html>""",
        status_code=503,
        headers={"Cache-Control": "no-store"},
    )



@app.get("/api/jobs")
def list_processing_jobs():
    return {"jobs": jobs.list_jobs(), "max_concurrent": jobs.MAX_JOBS}


@app.post("/api/generate")
def generate(req: GenerateRequest) -> dict:
    """Start the pipeline on a background thread and return a job id.

    The actual work (download/transcribe/select/render) runs asynchronously; the
    client subscribes to ``/api/progress/{job_id}`` for live progress and the
    final clips.
    """
    try:
        job = jobs.create_job(req)
    except RuntimeError as exc:
        raise HTTPException(status_code=429, detail=str(exc)) from exc
    try:
        jobs.start_job(job)
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=f"Could not start the clip job: {exc}") from exc
    logger.info("[%s] job accepted", job.id)
    return {"job_id": job.id}


@app.get("/api/transcript/{source_id}")
def get_transcript(source_id: str, language: Optional[str] = None) -> dict:
    """Return the cached transcript's segments (timestamp + text) for the sidebar.

    Returns only the requested language variant, so switching back to Auto never
    displays a transcript forced through another language decoder.
    """
    try:
        tr = pretranscribe.cached(source_id, language)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    if not tr:
        return {"ready": False}
    return {
        "ready": True,
        "language": tr.get("language"),
        "duration": tr.get("duration"),
        "segments": tr.get("segments") or [],
    }


@app.get("/api/music-suggest/{source_id}")
def music_suggest(source_id: str, language: Optional[str] = None) -> dict:
    """Suggest a music mood (sad/happy/romantic/…) from the prepared transcript."""
    try:
        tr = pretranscribe.cached(source_id, language)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    if not tr:
        return {"ready": False}
    segs = tr.get("segments") or []
    text = " ".join((s.get("text") or "") for s in segs)
    return {"ready": True, **mood.suggest_mood(text)}


@app.post("/api/cancel/{job_id}")
def cancel(job_id: str) -> dict:
    """Flag a running job for cancellation; it stops at the next clip boundary."""
    job = jobs.get_job(job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Unknown job id.")
    job.cancel()
    logger.info("[%s] cancel requested", job_id)
    return {"status": "cancelled"}


@app.get("/api/progress/{job_id}")
async def progress(job_id: str) -> StreamingResponse:
    """Stream a job's progress as Server-Sent Events until it finishes."""
    job = jobs.get_job(job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Unknown job id.")

    async def event_stream():
        last_rev = -1
        while True:
            snap = job.snapshot()
            if snap["rev"] != last_rev:
                last_rev = snap["rev"]
                yield f"data: {json.dumps(snap)}\n\n"
            if snap["status"] in ("done", "error", "cancelled", "interrupted"):
                break
            await asyncio.sleep(0.3)

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@app.get("/api/result/{job_id}")
def result(job_id: str) -> dict:
    """Return the current snapshot of a job (useful after a stream reconnect)."""
    job = jobs.get_job(job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Unknown job id.")
    return job.snapshot()


# Catch-all guard: turn any unexpected error into a clean 500 (no crash).
@app.exception_handler(Exception)
async def unhandled_exception_handler(request, exc):  # noqa: ANN001
    logger.exception("Unhandled error on %s", request.url.path)
    return JSONResponse(
        status_code=500,
        content={"detail": f"Unexpected server error: {exc}"},
    )


def find_free_port(start_port: int = 8000, max_port: int = 8015, host: str = "127.0.0.1") -> int:
    """Find the first available TCP port in [start_port, max_port]."""
    import socket
    for port in range(start_port, max_port + 1):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(0.5)
            try:
                s.bind((host, port))
                return port
            except OSError:
                continue
    raise RuntimeError(f"Ports {start_port} through {max_port} on {host} are all occupied.")


if __name__ == "__main__":
    import argparse
    import uvicorn
    import webbrowser

    parser = argparse.ArgumentParser(description="Clipxy4all Local Server")
    parser.add_argument("--port", type=int, default=None, help="Port to run on (default: auto-detect free port 8000-8015)")
    parser.add_argument("--host", type=str, default="127.0.0.1", help="Host address to bind to")
    parser.add_argument("--no-browser", action="store_true", help="Do not automatically open the browser")
    cli_args = parser.parse_args()

    chosen_port = cli_args.port
    if chosen_port is None:
        chosen_port = find_free_port(8000, 8015, host=cli_args.host)
        logger.info("Auto-selected free port: %d", chosen_port)
    else:
        logger.info("Using specified port: %d", chosen_port)

    if not cli_args.no_browser:
        def _open():
            time.sleep(1.0)
            webbrowser.open(f"http://{cli_args.host}:{chosen_port}")
        threading.Thread(target=_open, daemon=True).start()

    uvicorn.run("app.main:app", host=cli_args.host, port=chosen_port, reload=False)
