"""Download the source video with yt-dlp (the only video-fetch network call).

We use the yt-dlp *Python API* rather than shelling out so failures surface as
exceptions we can translate into a clean 400. The server must never crash on a
bad or blocked URL.
"""

from __future__ import annotations

import logging
import os
import re
import threading
import uuid
from pathlib import Path
from typing import Callable, Optional

import yt_dlp

from .models import InvalidVideoURLError
from .paths import DOWNLOADS_DIR, FFMPEG_DIR
from .uploads import ALLOWED_EXTS

logger = logging.getLogger(__name__)


def _yt_dlp_ffmpeg_location() -> Optional[str]:
    """Only override yt-dlp's PATH discovery when bundled FFmpeg exists.

    ensure_dirs() creates an empty ffmpeg/ even on macOS, so directory
    existence alone must never override Homebrew's FFmpeg on PATH.
    """
    binary = FFMPEG_DIR / ("ffmpeg.exe" if os.name == "nt" else "ffmpeg")
    return str(FFMPEG_DIR) if binary.is_file() else None


class DownloadCancelled(Exception):
    pass

# Strip ANSI colour codes yt-dlp sometimes embeds in its error strings.
_ANSI_RE = re.compile(r"\x1b\[[0-9;]*m")

# Browsers we'll borrow cookies from (in order) when YouTube throws up a
# sign-in / "confirm you're not a bot" wall. Override with env vars below.
_DEFAULT_BROWSERS = ["chrome", "edge", "brave", "firefox", "opera", "vivaldi"]
_COOKIE_FILE_ENV = "CLIPXY4ALL_COOKIES_FILE"       # path to a cookies.txt
_COOKIE_BROWSER_ENV = "CLIPXY4ALL_COOKIES_BROWSER"  # force one browser, e.g. "chrome"
_LEGACY_COOKIE_FILE_ENV = "CLIPXY4ALL_COOKIES_FILE"
_LEGACY_COOKIE_BROWSER_ENV = "CLIPXY4ALL_COOKIES_BROWSER"


def _needs_cookies(reason: str) -> bool:
    """True when a failure reason looks like a sign-in / bot / cookie wall —
    used to add a helpful cookie hint to the final error message.
    """
    r = (reason or "").lower()
    return any(k in r for k in (
        "sign in", "not a bot", "cookie", "log in", "login", "consent",
        "age", "members-only", "account", "authentication",
    ))


def _is_terminal(reason: str) -> bool:
    """True when no retry (other client / cookies) can possibly help, so we stop
    early instead of grinding through every fallback for a dead/blocked link.
    """
    r = (reason or "").lower()
    return any(k in r for k in (
        "unavailable", "been removed", "does not exist", "no longer",
        "unsupported url", "not available in your", "is not a valid",
        "deleted", "terminated",
    ))


# YouTube player clients to fall back through. Different clients are served by
# different endpoints, and the cookie-free mobile/TV ones frequently slip past
# the "confirm you're not a bot" wall the default web client trips.
_PLAYER_CLIENTS = ["android", "ios", "tv", "mweb"]


def _installed_browsers() -> list[str]:
    """Return only browsers whose data/profile folders exist on this machine."""
    found = []
    local_app = os.environ.get("LOCALAPPDATA", "")
    app_data = os.environ.get("APPDATA", "")
    
    checks = [
        ("chrome", os.path.join(local_app, "Google", "Chrome", "User Data")),
        ("edge", os.path.join(local_app, "Microsoft", "Edge", "User Data")),
        ("brave", os.path.join(local_app, "BraveSoftware", "Brave-Browser", "User Data")),
        ("firefox", os.path.join(app_data, "Mozilla", "Firefox")),
        ("opera", os.path.join(app_data, "Opera Software", "Opera Stable")),
        ("vivaldi", os.path.join(local_app, "Vivaldi", "User Data")),
    ]
    for name, path in checks:
        if path and os.path.isdir(path):
            found.append(name)
    return found


def _download_attempts(base_opts: dict) -> list[tuple[str, dict]]:
    """Ordered (label, ydl_opts) attempts.

    Order is cheapest-and-most-likely first:
      1. explicit cookies (only if the user configured a file/browser),
      2. the plain default pass (fast for public videos),
      3. cookie-free alternate YouTube player clients (dodge the bot wall),
      4. installed browser cookies (needs the browser closed on Windows) as a last resort.
    """
    cookie_file = os.environ.get(_COOKIE_FILE_ENV) or os.environ.get(_LEGACY_COOKIE_FILE_ENV)
    forced = os.environ.get(_COOKIE_BROWSER_ENV) or os.environ.get(_LEGACY_COOKIE_BROWSER_ENV)

    attempts: list[tuple[str, dict]] = []
    if cookie_file:
        attempts.append(("cookies file", {**base_opts, "cookiefile": cookie_file}))
    if forced:
        b = forced.strip().lower()
        attempts.append((f"{b} cookies", {**base_opts, "cookiesfrombrowser": (b,)}))

    attempts.append(("default", dict(base_opts)))

    for client in _PLAYER_CLIENTS:
        attempts.append((
            f"{client} client",
            {**base_opts, "extractor_args": {"youtube": {"player_client": [client]}}},
        ))

    if not forced:  # only try browsers that actually exist on this system
        for b in _installed_browsers():
            attempts.append((f"{b} cookies", {**base_opts, "cookiesfrombrowser": (b,)}))

    return attempts


def _clean_ydl_error(raw: str) -> str:
    """Turn a raw yt-dlp DownloadError string into one short, readable line.

    yt-dlp prefixes messages with ``ERROR:`` (sometimes coloured) and can append
    a hint about reporting bugs — we drop both and keep just the real reason so
    the UI can show *why* a video failed (private, age-gated, geo-blocked, etc.).
    """
    text = _ANSI_RE.sub("", raw or "").strip()
    # Keep only the first line — that's the human reason.
    line = text.splitlines()[0] if text else ""
    line = re.sub(r"^ERROR:\s*", "", line).strip()
    # Drop yt-dlp's "; please report this issue …" tail and extractor prefixes.
    line = re.split(r";\s*(please report|you might want)", line, maxsplit=1)[0].strip()
    line = re.sub(r"^\[[^\]]+\]\s*[^:]*:\s*", "", line)  # e.g. "[youtube] ID: "
    return line[:300]


def _find_original_audio_format_id(info: dict) -> Optional[str]:
    """Pick the **original/native** audio track from yt-dlp extracted info.

    Selection priority (never hardcodes a language):

    1. A format explicitly marked as original by YouTube / yt-dlp
       (``is_original``, ``language_preference == -1``, or ``"original"`` in
       the ``format_note``).
    2. An audio track whose ``language`` matches the video-level ``language``
       field *and* is not flagged as a dub.
    3. Exclude any track whose ``format_note`` contains ``"dub"`` or
       ``"descriptive"``, then pick the highest-bitrate survivor.
    4. Return ``None`` — caller falls back to the existing ``bestaudio``
       behaviour so the download never breaks.

    Args:
        info: the dict returned by ``yt_dlp.YoutubeDL.extract_info()``.

    Returns:
        A yt-dlp ``format_id`` string, or ``None`` when no original track
        can be confidently identified.
    """
    formats = info.get("formats") or []
    audio_fmts = [
        f for f in formats
        if f.get("acodec", "none") != "none"           # has an audio codec
        and (f.get("vcodec", "none") == "none"          # audio-only stream…
             or f.get("vcodec") is None)                # …(not a muxed video)
    ]
    if not audio_fmts:
        logger.info("orig-audio: no audio-only streams found, using default")
        return None

    # ── Priority 1: explicitly flagged as original ───────────────────────
    p1: list[dict] = []
    for f in audio_fmts:
        note = (f.get("format_note") or "").lower()
        if f.get("is_original") is True:
            p1.append(f)
        elif f.get("language_preference") is not None and f["language_preference"] == 10:
            # yt-dlp uses 10 for the default/original track on YouTube, -1 for dubs
            p1.append(f)
        elif "original" in note and "dub" not in note:
            p1.append(f)
    if p1:
        best = max(p1, key=lambda f: f.get("tbr") or f.get("abr") or 0)
        logger.info(
            "orig-audio: P1 hit — format_id=%s lang=%s note=%s",
            best.get("format_id"), best.get("language"), best.get("format_note"),
        )
        return best["format_id"]

    # ── Priority 2: language matches video's native language ─────────────
    video_lang = (info.get("language") or "").lower().strip()
    if video_lang:
        p2: list[dict] = []
        for f in audio_fmts:
            f_lang = (f.get("language") or "").lower().strip()
            note = (f.get("format_note") or "").lower()
            if f_lang == video_lang and "dub" not in note:
                p2.append(f)
        if p2:
            best = max(p2, key=lambda f: f.get("tbr") or f.get("abr") or 0)
            logger.info(
                "orig-audio: P2 hit — format_id=%s lang=%s matches video_lang=%s",
                best.get("format_id"), best.get("language"), video_lang,
            )
            return best["format_id"]

    # ── Priority 3: exclude dubs, pick best of the remainder ─────────────
    non_dub = [
        f for f in audio_fmts
        if "dub" not in (f.get("format_note") or "").lower()
        and "descriptive" not in (f.get("format_note") or "").lower()
    ]
    if non_dub and len(non_dub) < len(audio_fmts):
        # Only use this if we actually filtered something out — otherwise
        # we have no evidence of dubs and should fall through to P4.
        best = max(non_dub, key=lambda f: f.get("tbr") or f.get("abr") or 0)
        logger.info(
            "orig-audio: P3 hit — format_id=%s lang=%s (excluded %d dub tracks)",
            best.get("format_id"), best.get("language"),
            len(audio_fmts) - len(non_dub),
        )
        return best["format_id"]

    # ── Priority 4: no signal — let yt-dlp choose as before ─────────────
    logger.info("orig-audio: no original-track signal found, using default bestaudio")
    return None


def _find_best_1080p_video_format_id(info: dict) -> Optional[str]:
    """Pick the highest quality video stream capped at 1080p from yt-dlp extracted info.

    Handles BOTH landscape (16:9, short side <= 1080) and portrait / YouTube Shorts
    (9:16, width <= 1080). Prioritizes 1080p streams, highest bitrate/fps, and avoids
    bloated 4K/2160p downloads while strictly preventing YouTube Shorts from being
    downgraded to 480p or 608p.
    """
    formats = info.get("formats") or []
    video_fmts = [
        f for f in formats
        if f.get("vcodec", "none") != "none"
        and f.get("vcodec") is not None
        and f.get("height")
        and f.get("width")
    ]
    if not video_fmts:
        return None

    # Calculate short dimension (e.g. 1080 for 1920x1080 landscape AND 1080x1920 Shorts)
    candidates = []
    for f in video_fmts:
        w = f.get("width") or 0
        h = f.get("height") or 0
        short_dim = min(w, h)
        if short_dim <= 1088:  # 1080p resolution with small encoding tolerance
            candidates.append((short_dim, f.get("tbr") or f.get("vbr") or 0, f.get("fps") or 0, f))

    if candidates:
        # Sort by: short_dim (closest to 1080p), highest bitrate (tbr), highest fps
        candidates.sort(key=lambda x: (x[0], x[1], x[2]), reverse=True)
        best = candidates[0][3]
        logger.info(
            "best-video: selected 1080p-capped format_id=%s (%dx%d, %.0f kbps, %d fps)",
            best.get("format_id"), best.get("width"), best.get("height"),
            best.get("tbr") or 0, best.get("fps") or 0,
        )
        return best["format_id"]

    # Fallback if every stream is > 1080p (e.g. exclusively 4K/8K stream provided)
    # Pick the lowest resolution available to stay closest to 1080p without wasting bandwidth
    video_fmts.sort(key=lambda f: min(f.get("width") or 9999, f.get("height") or 9999))
    return video_fmts[0].get("format_id")


def _build_format_spec(best_video_id: Optional[str], original_audio_id: Optional[str]) -> str:
    """Keep an audio stream attached to *every* video fallback when available.

    yt-dlp's ``/`` separates complete alternatives. Appending ``+bestaudio``
    to a slash-separated video string only affects its last alternative, which
    lets the earlier 1080p video-only candidates win without any sound.
    """
    videos = (
        "bestvideo[height<=1080][width<=1920]",
        "bestvideo[width<=1080][height<=1920]",
        "bestvideo[height<=1080]",
        "bestvideo",
    )
    choices: list[str] = []
    if best_video_id:
        if original_audio_id:
            choices.append(f"{best_video_id}+{original_audio_id}")
        choices.append(f"{best_video_id}+bestaudio")
    if original_audio_id:
        choices.extend(f"{video}+{original_audio_id}" for video in videos)
    choices.extend(f"{video}+bestaudio" for video in videos)
    # A muxed source needs no merge; a truly silent source must still download.
    choices.extend(("best", "bestvideo"))
    return "/".join(choices)


def download_video(
    url: str,
    progress_hook: Optional[Callable[[dict], None]] = None,
    cancel_event: Optional[threading.Event] = None,
) -> Path:
    """Download `url` to downloads/<uuid>.mp4 and return the file path.

    Args:
        url: source video URL.
        progress_hook: optional yt-dlp progress callback (receives the raw
            progress dict with ``status``/``downloaded_bytes``/``total_bytes``)
            so callers can surface live download progress.

    Raises:
        InvalidVideoURLError: on any download failure, with a readable message.
    """
    if not url or not url.strip():
        raise InvalidVideoURLError("No video URL was provided.")

    clip_uuid = uuid.uuid4().hex
    # yt-dlp fills in the real extension; we force a merge to mp4 below so the
    # final file is downloads/<uuid>.mp4.
    out_template = str(DOWNLOADS_DIR / f"{clip_uuid}.%(ext)s")
    expected_path = DOWNLOADS_DIR / f"{clip_uuid}.mp4"

    ffmpeg_location = _yt_dlp_ffmpeg_location()

    # ── Pre-probe: detect the original audio track and optimal 1080p video stream ──
    original_audio_id: Optional[str] = None
    best_video_id: Optional[str] = None
    try:
        probe_opts: dict = {
            "quiet": True,
            "no_warnings": True,
            "skip_download": True,
            "noplaylist": True,
            "ffmpeg_location": ffmpeg_location,
        }
        with yt_dlp.YoutubeDL(probe_opts) as ydl:
            info = ydl.extract_info(url.strip(), download=False)
        if info:
            original_audio_id = _find_original_audio_format_id(info)
            best_video_id = _find_best_1080p_video_format_id(info)
    except Exception:  # noqa: BLE001 - probe failure must never block the download
        logger.warning("pre-probe failed for %s, using default format selection", url)

    # ── Build format string (locks 1080p resolution for both landscape and shorts) ──
    fmt = _build_format_spec(best_video_id, original_audio_id)
    if best_video_id or original_audio_id:
        logger.info("download: preferred video=%s original audio=%s", best_video_id, original_audio_id)

    base_opts = {
        # Prefer the best stream up to 1080p (plenty for shorts, avoids slow 4K
        # downloads). Container is normalised to mp4 by merge_output_format, so
        # we don't restrict by extension - that was too strict and could fall
        # back to a tiny stream when no progressive mp4 existed.
        "format": fmt,
        "format_sort": ["res:1080", "hasaud", "lang", "br", "fps", "codec:h264:vp9"],
        "ffmpeg_location": ffmpeg_location,
        "merge_output_format": "mp4",
        "outtmpl": out_template,
        "noplaylist": True,
        "quiet": True,
        "no_warnings": True,
        # Be resilient: keep going if a single fragment hiccups.
        "ignoreerrors": False,
    }
    if progress_hook is not None or cancel_event is not None:
        def dispatch_progress(data: dict) -> None:
            if cancel_event is not None and cancel_event.is_set():
                raise DownloadCancelled("Download cancelled by user.")
            if progress_hook is not None:
                progress_hook(data)
        base_opts["progress_hooks"] = [dispatch_progress]

    # Try in order: explicit cookies (if set) → plain → browser cookies. We only
    # fall through to the cookie-based attempts when the failure looks like a
    # sign-in / bot wall, so public videos still download on the first (fast) try.
    primary_reason = ""
    last_reason = ""
    last_exc: Optional[Exception] = None
    ok = False
    forced_browser = os.environ.get(_COOKIE_BROWSER_ENV) or os.environ.get(_LEGACY_COOKIE_BROWSER_ENV)
    for label, opts in _download_attempts(base_opts):
        if cancel_event is not None and cancel_event.is_set():
            last_reason = "Download cancelled by user."
            break
        # Only fall through to browser cookie attempts when the failure looks like a
        # sign-in / bot wall, so public or non-auth errors don't grind through locked databases.
        if "cookies" in label and not forced_browser and label != "cookies file":
            if not _needs_cookies(primary_reason):
                logger.debug("Skipping [%s] fallback: error does not indicate sign-in/bot check (%s)", label, primary_reason)
                continue
        try:
            with yt_dlp.YoutubeDL(opts) as ydl:
                ydl.download([url.strip()])
            ok = True
            if label != "default":
                logger.info("Downloaded %s using %s", url, label)
            break
        except Exception as exc:  # noqa: BLE001 - never let the server crash here
            if cancel_event is not None and cancel_event.is_set():
                last_reason = "Download cancelled by user."
                last_exc = exc
                break
            err = _clean_ydl_error(str(exc))
            logger.warning("yt-dlp [%s] failed for %s: %s", label, url, err)
            if not primary_reason or ("could not find" not in err and "database" not in err):
                primary_reason = err
            last_reason = err
            last_exc = exc
            if _is_terminal(err):
                break  # dead/blocked link — no fallback can recover it

    if not ok:
        # Clean up any partial/interrupted files left on disk
        for partial in DOWNLOADS_DIR.glob(f"{clip_uuid}*"):
            try:
                partial.unlink(missing_ok=True)
            except Exception:
                pass
        if cancel_event is not None and cancel_event.is_set():
            raise InvalidVideoURLError("Download cancelled by user.") from last_exc
        display_reason = primary_reason or last_reason
        msg = ("Could not download that video. Check the URL is correct, public, "
               "and reachable from this machine.")
        if display_reason:
            msg += f"\nReason: {display_reason}"
        if _needs_cookies(display_reason):
            msg += (
                "\n\nThis video is behind YouTube's sign-in / bot check. Make sure "
                "you're logged into YouTube in your browser, then close the browser "
                "and try again. To pin a browser set CLIPXY4ALL_COOKIES_BROWSER "
                "(chrome/edge/firefox), or point CLIPXY4ALL_COOKIES_FILE at a cookies.txt."
            )
        raise InvalidVideoURLError(msg) from last_exc

    if expected_path.is_file() and expected_path.stat().st_size > 0:
        return expected_path

    # A successful download can use a different video container, but the
    # completed file must still be named <uuid>.<extension>. yt-dlp may leave
    # format-specific fragments such as <uuid>.f137.mp4 or sidecar files; using
    # one of those produces a non-UUID source id and breaks transcript caching.
    candidates = [
        p for p in sorted(DOWNLOADS_DIR.glob(f"{clip_uuid}.*"))
        if p.is_file() and p.stem == clip_uuid
        and p.suffix.lower() in ALLOWED_EXTS and p.stat().st_size > 0
    ]
    if candidates:
        return candidates[0]

    # Some extractors leave one format-qualified final video such as
    # <uuid>.f137.mp4. Accept it only after checking that it contains a
    # decodable video frame, then normalize the filename to the same UUID
    # contract used by uploads, prefetch, and transcript caching.
    qualified = [
        p for p in sorted(DOWNLOADS_DIR.glob(f"{clip_uuid}.*"))
        if p.is_file() and p.stem.startswith(f"{clip_uuid}.")
        and p.suffix.lower() in ALLOWED_EXTS and p.stat().st_size > 0
    ]
    if len(qualified) == 1:
        candidate = qualified[0]
        try:
            import av
            with av.open(str(candidate)) as container:
                if not container.streams.video:
                    raise ValueError("no video stream")
                next(container.decode(video=0))
            normalized = DOWNLOADS_DIR / f"{clip_uuid}{candidate.suffix.lower()}"
            os.replace(candidate, normalized)
            return normalized
        except Exception as exc:  # PyAV exposes version-specific decode errors.
            logger.warning("Could not normalize format-qualified video %s: %s", candidate, exc)

    raise InvalidVideoURLError(
        "The download completed but no output file was produced. The video may "
        "be unavailable or region-locked."
    )
