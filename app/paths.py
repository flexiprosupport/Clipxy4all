"""Central filesystem layout for the project.

All other modules import these so directory locations are defined exactly once.
The directories are created on import (and again at startup) so the very first
run works without any manual setup.
"""

from __future__ import annotations

import os
import tempfile
from pathlib import Path

# Project root = the directory that contains the `app/` package.
ROOT_DIR = Path(__file__).resolve().parent.parent

TEMP_DIR = ROOT_DIR / "temp"
TEMP_DIR.mkdir(parents=True, exist_ok=True)
os.environ["TEMP"] = str(TEMP_DIR)
os.environ["TMP"] = str(TEMP_DIR)
tempfile.tempdir = str(TEMP_DIR)

# HuggingFace & faster-whisper model storage (bundled under {app}\models)
MODELS_DIR = ROOT_DIR / "models"
MODELS_DIR.mkdir(parents=True, exist_ok=True)
os.environ["HF_HOME"] = str(MODELS_DIR)
os.environ["HUGGINGFACE_HUB_CACHE"] = str(MODELS_DIR / "hub")
os.environ["HF_HUB_DISABLE_TELEMETRY"] = "1"
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"
os.environ["HF_HUB_OFFLINE"] = "1"
os.environ["TRANSFORMERS_OFFLINE"] = "1"

DOWNLOADS_DIR = ROOT_DIR / "downloads"
TRANSCRIPTS_DIR = ROOT_DIR / "transcripts"
CLIPS_DIR = ROOT_DIR / "clips"
ASSETS_DIR = ROOT_DIR / "assets"
FONTS_DIR = ASSETS_DIR / "fonts"
MASKS_DIR = ASSETS_DIR / "masks"
# Background-music library. Users can drop .mp3/.m4a/.wav files straight in here,
# or upload them through the UI — both show up as track options.
MUSIC_DIR = ASSETS_DIR / "music"
BROLL_DIR = ASSETS_DIR / "broll"
WATERMARKS_DIR = ASSETS_DIR / "watermarks"
STATIC_DIR = ROOT_DIR / "static"
# Built React dashboard (web/dist) — served as the primary frontend when present.
WEB_DIST_DIR = ROOT_DIR / "web" / "dist"
FFMPEG_DIR = ROOT_DIR / "ffmpeg"


def ensure_ffmpeg() -> None:
    """Ensure ffmpeg is on PATH if bundled in ROOT_DIR / 'ffmpeg'."""
    import os
    if (FFMPEG_DIR / "ffmpeg.exe").is_file() or (FFMPEG_DIR / "ffmpeg").is_file():
        ffmpeg_str = str(FFMPEG_DIR)
        current_path = os.environ.get("PATH", "")
        path_dirs = [p.lower() for p in current_path.split(os.pathsep) if p]
        if ffmpeg_str.lower() not in path_dirs:
            os.environ["PATH"] = ffmpeg_str + os.pathsep + current_path


def get_ffmpeg_bin() -> str:
    """Return path to ffmpeg executable, preferring bundled ffmpeg binary."""
    import shutil
    ensure_ffmpeg()
    for candidate in [
        FFMPEG_DIR / ("ffmpeg.exe" if os.name == "nt" else "ffmpeg"),
    ]:
        if candidate.is_file():
            return str(candidate)
    found = shutil.which("ffmpeg") or shutil.which("ffmpeg.exe")
    if found:
        return found
    return "ffmpeg"


def get_ffprobe_bin() -> str:
    """Return path to ffprobe executable, preferring bundled ffprobe binary."""
    import shutil
    ensure_ffmpeg()
    for candidate in [
        FFMPEG_DIR / ("ffprobe.exe" if os.name == "nt" else "ffprobe"),
    ]:
        if candidate.is_file():
            return str(candidate)
    found = shutil.which("ffprobe") or shutil.which("ffprobe.exe")
    if found:
        return found
    return "ffprobe"


def ensure_dirs() -> None:
    """Create every runtime directory if it does not already exist."""
    for directory in (
        TEMP_DIR,
        DOWNLOADS_DIR,
        TRANSCRIPTS_DIR,
        CLIPS_DIR,
        ASSETS_DIR,
        FONTS_DIR,
        MASKS_DIR,
        MUSIC_DIR,
        BROLL_DIR,
        WATERMARKS_DIR,
        MODELS_DIR,
        STATIC_DIR,
        FFMPEG_DIR,
    ):
        directory.mkdir(parents=True, exist_ok=True)
    ensure_ffmpeg()


# Create directories eagerly so importing any module is enough to get a working
# tree. Startup also calls ensure_dirs() defensively.
ensure_dirs()
