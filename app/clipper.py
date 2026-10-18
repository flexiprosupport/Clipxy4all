"""Cut, reframe, and burn captions with ffmpeg.

Each clip is re-encoded (libx264 + aac) so cuts are frame-accurate and the ASS
captions are burned into the pixels.

``crop`` scales to *cover* the chosen aspect ratio (9:16 / 16:9) and center-crops
to fill it. ``square`` renders a 9:16 canvas with the source cropped to a 1:1
square, given **soft rounded corners**, and centered on black — with an optional
title drawn above it (the "rounded square reel" look). The aspect ratio is
ignored in square mode (the canvas is always 9:16).
"""

from __future__ import annotations

import logging
import os
import subprocess
import threading
import time
import uuid
from dataclasses import dataclass
from pathlib import Path
from typing import List, Optional, Tuple

from . import effects, canvas_captions
from .models import AspectRatio, ClipGenerationError, FitMode
from .paths import CLIPS_DIR, FONTS_DIR, MASKS_DIR, get_ffmpeg_bin

logger = logging.getLogger(__name__)

_ACTIVE_PROCESSES: set[subprocess.Popen] = set()
_ACTIVE_PROCESSES_LOCK = threading.Lock()
_RENDER_STALL_SECONDS = 600.0
_PUBLISH_RETRY_SECONDS = 8.0


def terminate_active_processes() -> None:
    """Best-effort stop of ffmpeg children during application shutdown."""
    with _ACTIVE_PROCESSES_LOCK:
        processes = list(_ACTIVE_PROCESSES)
    for proc in processes:
        try:
            if proc.poll() is None:
                proc.kill()
                proc.wait(timeout=2)
        except Exception:
            logger.debug("Could not stop ffmpeg process %s", getattr(proc, "pid", "?"), exc_info=True)


def has_active_processes() -> bool:
    with _ACTIVE_PROCESSES_LOCK:
        return any(proc.poll() is None for proc in _ACTIVE_PROCESSES)


def _publish_render(render_path: Path, out_path: Path) -> None:
    """Replace a clip after a brief Windows player/antivirus sharing lock clears."""
    deadline = time.monotonic() + _PUBLISH_RETRY_SECONDS
    while True:
        try:
            os.replace(render_path, out_path)
            return
        except OSError as exc:
            sharing_lock = isinstance(exc, PermissionError) or getattr(exc, "winerror", None) in (5, 32)
            if os.name != "nt" or not sharing_lock or time.monotonic() >= deadline:
                raise
            time.sleep(0.25)

# Target frame sizes per aspect ratio.
_TARGETS = {
    AspectRatio.NINE_16: (1080, 1920),
    AspectRatio.SIXTEEN_9: (1920, 1080),
    AspectRatio.FOUR_5: (1080, 1350),
}

# Square ("rounded reel") mode: a 9:16 canvas with a centered, rounded 1:1 square.
_SQUARE_CANVAS = (1080, 1920)   # output frame (aspect ratio is ignored)
_SQUARE_INNER = 1020            # side of the centered square
_SQUARE_RADIUS = 60             # corner radius of that square (soft, anti-aliased)


def target_size(aspect_ratio: AspectRatio, fit_mode: FitMode) -> tuple[int, int]:
    """Output (width, height): 9:16 canvas for square mode, else the aspect size."""
    if fit_mode == FitMode.SQUARE:
        return _SQUARE_CANVAS
    return _TARGETS[aspect_ratio]


_MASK_LOCK = threading.Lock()

def ensure_rounded_mask(width: int = _SQUARE_INNER, height: int = _SQUARE_INNER, radius: int = _SQUARE_RADIUS) -> Path:
    with _MASK_LOCK:
        return _ensure_rounded_mask(width, height, radius)

def _ensure_rounded_mask(width: int = _SQUARE_INNER, height: int = _SQUARE_INNER, radius: int = _SQUARE_RADIUS) -> Path:
    """Create (once) and cache a grayscale rounded-rectangle mask via ffmpeg.

    White inside the rounded square, black outside; used by ``alphamerge`` to
    give the centered square or video frame its soft corners. Generated with ffmpeg's ``geq``
    so we need no extra image library.
    """
    path = MASKS_DIR / f"rounded_{width}x{height}_{radius}.png"
    if path.exists():
        return path
    MASKS_DIR.mkdir(parents=True, exist_ok=True)

    ffmpeg_bin = get_ffmpeg_bin()
    if radius <= 0:
        # Sharp corners: a fully opaque square needs no SDF ramp — solid white.
        cmd = [
            ffmpeg_bin, "-y",
            "-f", "lavfi", "-i", f"color=c=white:s={width}x{height}:d=0.1",
            "-frames:v", "1", str(path),
        ]
    else:
        edge_x = width - 1 - radius
        edge_y = height - 1 - radius
        # Distance from each pixel to the inner rectangle's edge (the rounded-rect SDF);
        # a ~1.5px soft ramp around `radius` anti-aliases the corners (smooth, not jaggy).
        # alpha = 255 inside, 0 outside. Commas are escaped for the filtergraph.
        expr = (
            f"255*clip(0.5+({radius}-hypot("
            f"max(0\\,{radius}-X)+max(0\\,X-{edge_x})\\,"
            f"max(0\\,{radius}-Y)+max(0\\,Y-{edge_y})))/1.5\\,0\\,1)"
        )
        cmd = [
            ffmpeg_bin, "-y",
            "-f", "lavfi", "-i", f"color=c=black:s={width}x{height}:d=0.1",
            "-vf", f"geq=lum='{expr}':cb=128:cr=128",
            "-frames:v", "1", str(path),
        ]
    try:
        creationflags = getattr(subprocess, "CREATE_NO_WINDOW", 0)
        proc = subprocess.run(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding="utf-8",
            errors="replace",
            creationflags=creationflags,
            timeout=30,
        )
    except subprocess.TimeoutExpired as exc:
        raise ClipGenerationError("ffmpeg timed out while generating rounded mask.") from exc
    except FileNotFoundError as exc:
        raise ClipGenerationError(
            "ffmpeg was not found on PATH or bundled folder (needed to build the rounded mask)."
        ) from exc
    if proc.returncode != 0 or not path.exists():
        if path.exists():
            path.unlink(missing_ok=True)
        tail = (proc.stderr or "").strip().splitlines()[-8:]
        raise ClipGenerationError(
            "Could not generate the rounded-corner mask:\n" + "\n".join(tail)
        )
    return path

_BAR_FONT = FONTS_DIR / "Roboto-Bold.ttf"


@dataclass
class ClipOptions:
    """Everything generate_clip needs beyond the time range."""

    aspect_ratio: AspectRatio
    fit_mode: FitMode
    clip_id: str
    index: int
    ass_path: Optional[Path] = None
    video_background: str = "black"
    square_corners: str = "round"      # "round" | "square" — square fit mode only
    bar_text: Optional[str] = None
    bar_text_color: str = "#FFFFFF"     # square title colour
    bar_text_anim: str = "none"         # square title entrance: none | fade | slide
    cinematic: Optional[dict] = None  # cinematic effects config (see app.effects)
    music_path: Optional[Path] = None  # background-music track to mix under the audio
    music_volume: float = 35.0         # 0-100, reels-style (ducked under speech)
    music_duck: float = 70.0           # 0-100, how hard music dips under the voice
    music_start: float = 0.0           # seconds into the track to start from (beat-aligned)
    signature: Optional[dict] = None   # burned-in watermark (see app.models.Signature)
    reframe: Optional[list[dict]] = None  # manual crop keyframes (see app.models.ReframeKeyframe)
    intervals: Optional[list[tuple[float, float]]] = None  # kept intervals for empty-air removal
    split_screen: bool = False
    split_broll: Optional[str] = "subway_surfers"
    split_divider: str = "black"
    split_face_tracking: bool = True
    custom_broll_id: Optional[str] = None
    progress_bar: bool = False
    progress_bar_color: str = "#FACC15"
    progress_bar_position: str = "top"
    progress_bar_height: int = 10
    image_watermark: Optional[dict] = None  # personal preference image watermark (1:1 square only)


def _rel_for_filter(target: Path | str, start_dir: Path) -> str:
    """Return `target` relative to `start_dir` with forward slashes.

    ffmpeg's filtergraph parser treats ':' as an option separator and is fussy
    about Windows drive letters and spaces inside filter VALUES (the `ass`,
    `fontsdir`, and drawtext `fontfile` options). By running ffmpeg with its cwd
    set to the clip folder and passing these as *relative* paths (e.g. `0.ass`,
    `../../assets/fonts`) we avoid the drive colon and spaces entirely.
    If target is on a different drive on Windows, falls back to an escaped absolute
    path (colons escaped as \\:) with forward slashes.
    """
    target_str = str(target)
    try:
        return os.path.relpath(target_str, str(start_dir)).replace("\\", "/")
    except ValueError:
        # Cross-drive path on Windows (e.g. target on C: and start_dir on E:):
        clean = target_str.replace("\\", "/")
        return clean.replace(":", "\\:")


def _escape_drawtext(text: str) -> str:
    """Escape user text for ffmpeg drawtext (the value is wrapped in quotes)."""
    return (
        text.replace("\\", "\\\\")
        .replace(":", "\\:")
        .replace("'", "’")  # swap apostrophe for a typographic one to avoid quoting hell
        .replace("%", "\\%")
    )


def _ass_filter(opts: ClipOptions, work_dir: Path) -> str:
    """The caption-burn filter. Relative or escaped paths keep the drive colon/spaces safe."""
    ass_path_str = _rel_for_filter(opts.ass_path, work_dir)
    fonts_dir_str = _rel_for_filter(FONTS_DIR, work_dir)
    return f"ass='{ass_path_str}':fontsdir='{fonts_dir_str}'"


def _caption_stage(in_label: str, opts: ClipOptions, work_dir: Path, out_label: str = "outv") -> str:
    """The final stage that burns the captions onto ``in_label`` -> ``[out_label]``."""
    if not opts.ass_path or Path(opts.ass_path).suffix == ".json":
        return f"[{in_label}]null[{out_label}]"
    return f"[{in_label}]{_ass_filter(opts, work_dir)}[{out_label}]"


def _signature_stages(in_label: str, sig: Optional[dict], w: int, h: int, work_dir: Path) -> tuple[list[str], str]:
    """Burn the signature/watermark text. Returns (stages, out_label).

    pos_x/pos_y are the text centre as a % of the frame; size is at 1080-wide and
    scales to the real width; opacity 0-100. No-op when disabled/empty.
    """
    if not sig or not sig.get("enabled") or not (sig.get("text") or "").strip():
        return [], in_label
    scale = w / 1080.0
    size = max(10, int(round(float(sig.get("size") or 34) * scale)))
    alpha = max(0.0, min(1.0, float(sig.get("opacity") if sig.get("opacity") is not None else 75) / 100.0))
    col = (sig.get("color") or "#FFFFFF").replace("#", "0x")
    px = max(0.0, min(1.0, float(sig.get("pos_x") if sig.get("pos_x") is not None else 50) / 100.0))
    py = max(0.0, min(1.0, float(sig.get("pos_y") if sig.get("pos_y") is not None else 92) / 100.0))
    txt = _escape_drawtext(sig["text"].strip())
    font_file = _rel_for_filter(_BAR_FONT, work_dir)
    stage = (
        f"[{in_label}]drawtext=fontfile='{font_file}':"
        f"text='{txt}':fontcolor={col}@{alpha:.3f}:fontsize={size}:"
        f"x=(w-text_w)*{px:.4f}:y=(h-text_h)*{py:.4f}:"
        f"borderw=2:bordercolor=black@{min(0.55, alpha):.3f}:shadowcolor=black@0.4:shadowx=1:shadowy=1[sig]"
    )
    return [stage], "sig"


def _title_text_stages(
    in_label: str, vw: int, vh: int, opts: ClipOptions, work_dir: Path
) -> tuple[list[str], str]:
    """Render Title text (top) overlay if present."""
    if not (opts.bar_text and opts.bar_text.strip()):
        return [], in_label

    lines = [ln.strip() for ln in opts.bar_text.split("\n") if ln.strip()][:3]
    font_size = max(26, int(round(min(vw, vh) * 0.048)))
    line_h = int(round(font_size * 1.3))
    start_y = max(24, int(round(vh * 0.065)))
    if opts.cinematic and opts.cinematic.get("letterbox"):
        lb_sz = float(opts.cinematic.get("letterbox_size", 50) or 50)
        lb_h = max(1, int(vh * (0.05 + (lb_sz / 100.0) * 0.09)))
        start_y = max(start_y, lb_h + max(16, int(round(vh * 0.02))))
    col = (opts.bar_text_color or "#FFFFFF").replace("#", "0x")
    anim = (opts.bar_text_anim or "none").lower()
    alpha_expr = ":alpha='if(lt(t\\,0.5)\\,t/0.5\\,1)'" if anim == "fade" else ""

    stages = []
    last = in_label
    font_file = _rel_for_filter(_BAR_FONT, work_dir)
    for li, ln in enumerate(lines):
        base_y = start_y + li * line_h
        y = (f"'{base_y}+40*(1-min(t/0.45\\,1))'" if anim == "slide" else str(base_y))
        stages.append(
            f"[{last}]drawtext=fontfile='{font_file}':"
            f"text='{_escape_drawtext(ln)}':"
            f"fontcolor={col}:fontsize={font_size}:x=(w-text_w)/2:y={y}{alpha_expr}:"
            f"borderw=3:bordercolor=black@0.85:shadowcolor=black@0.6:shadowx=2:shadowy=2[ttl{li}]"
        )
        last = f"ttl{li}"
    return stages, last


def _finish_stages(in_label: str, vw: int, vh: int, opts: ClipOptions, work_dir: Path, out_label: str = "outv") -> list[str]:
    """Append cinematic stages, title text (top), signature/watermark, then caption burn.

    Returns the stages that take ``in_label`` -> cinematic effects -> title text -> signature -> ``[out_label]``.
    With no effects/title this is just the single caption-burn stage, so the default
    render is unchanged. Used by crop mode, where the footage fills the whole
    frame so the effects land on the video. (Square mode applies the effects to
    the square itself — see ``_build_square_filter_complex``.)
    """
    cine_stages, cap_in = effects.cinematic_stages(opts.cinematic, in_label, vw, vh)
    title_stages, title_in = _title_text_stages(cap_in, vw, vh, opts, work_dir)
    sig_stages, sig_in = _signature_stages(title_in, opts.signature, vw, vh, work_dir)
    return cine_stages + title_stages + sig_stages + [_caption_stage(sig_in, opts, work_dir, out_label=out_label)]


def _piecewise_linear(pts: list[tuple[float, float]]) -> str:
    """Build an ffmpeg binary-tree ``if(lt(t,...),...)`` expression that linearly
    interpolates between ``(time, value)`` points, holding the first/last
    value outside their range. Uses a balanced O(log N) binary search tree
    to strictly prevent FFmpeg eval stack overflow and Windows command-line limits.
    """
    if not pts:
        return "0.500000"
    deduped_pts: list[tuple[float, float]] = []
    for p in pts:
        if deduped_pts and abs(deduped_pts[-1][0] - p[0]) < 1e-4:
            deduped_pts[-1] = p
        else:
            deduped_pts.append(p)
    pts = deduped_pts
    if len(pts) == 1:
        return f"{pts[0][1]:.6f}"

    def _build_binary(sub_pts: list[tuple[float, float]]) -> str:
        if len(sub_pts) == 1:
            return f"{sub_pts[0][1]:.6f}"
        if len(sub_pts) == 2:
            t0, v0 = sub_pts[0]
            t1, v1 = sub_pts[1]
            if t1 <= t0 or abs(v1 - v0) < 1e-6:
                return f"{v1:.6f}"
            return f"({v0:.6f}+({v1:.6f}-{v0:.6f})*(t-{t0:.3f})/{(t1 - t0):.6f})"
        mid = len(sub_pts) // 2
        t_mid = sub_pts[mid][0]
        left = _build_binary(sub_pts[:mid + 1])
        right = _build_binary(sub_pts[mid:])
        return f"if(lt(t\\,{t_mid:.3f})\\,{left}\\,{right})"

    body = _build_binary(pts)
    if len(pts) > 1:
        return f"if(lt(t\\,{pts[0][0]:.3f})\\,{pts[0][1]:.6f}\\,if(gt(t\\,{pts[-1][0]:.3f})\\,{pts[-1][1]:.6f}\\,{body}))"
    return body


def _pos_frac_expr(keyframes: list[dict], key: str) -> Optional[str]:
    """ffmpeg eval expression for the crop's pan offset fraction [0, 1].

    ``keyframes`` are ``{"time", "pos_x", "pos_y", "zoom"}`` dicts (see
    ``app.models.ReframeKeyframe``); ``key`` picks ``pos_x``/``pos_y``.
    Between keyframes the position is linearly interpolated (a smooth pan);
    before the first / after the last, it holds.
    """
    if not keyframes:
        return None
    valid_kfs = [k for k in keyframes if isinstance(k, dict)]
    if not valid_kfs:
        return None
    alt_key = "x" if key == "pos_x" else ("y" if key == "pos_y" else key)
    pts = sorted(
        ((max(0.0, float(k.get("time", 0.0))), max(0.0, min(100.0, float(k.get(key, k.get(alt_key, 50.0))))) / 100.0)
         for k in valid_kfs),
        key=lambda p: p[0],
    )
    if not pts:
        return None
    return _piecewise_linear(pts)


def _zoom_expr(keyframes: list[dict]) -> Optional[str]:
    """ffmpeg eval expression for the crop's zoom FACTOR (>=1), or None if every
    keyframe is zoom=100 (or there are none) — the common case, where skipping
    this stage keeps the render identical to a build with no zoom support.

    ``zoom`` (see ``app.models.ReframeKeyframe``) is 40-100, the crop box's size
    as a % of the default max-coverage box. This interpolates that percentage
    the same piecewise-linear way as pan, then converts it to a scale factor
    (100/zoom) applied to the pre-crop canvas: 100 -> 1x (no-op), 50 -> 2x
    (scale the canvas up twice as much before cropping the same fixed WxH
    window out of it — i.e. a tighter, more zoomed-in crop).
    """
    if not keyframes:
        return None
    valid_kfs = [k for k in keyframes if isinstance(k, dict)]
    if not valid_kfs:
        return None
    pts = sorted(
        ((max(0.0, float(k.get("time", 0.0))), max(40.0, min(100.0, float(k.get("zoom", 100.0)))))
         for k in valid_kfs),
        key=lambda p: p[0],
    )
    if not pts or all(abs(z - 100.0) < 0.05 for _, z in pts):
        return None
    return f"(100/({_piecewise_linear(pts)}))"


def _crop_filter(width: int, height: int, reframe: Optional[list[dict] | dict]) -> str:
    """The reframe filter fragment for a cover-scaled frame: an optional zoom
    pre-scale (only emitted when a keyframe actually zooms in) feeding a
    ``crop=...`` that's keyframed if ``reframe`` is set, else ffmpeg's plain
    centred crop (unchanged default behaviour)."""
    if isinstance(reframe, dict):
        kfs = [reframe]
    elif isinstance(reframe, list):
        kfs = [k for k in reframe if isinstance(k, dict)]
    else:
        kfs = []
    xf = _pos_frac_expr(kfs, "pos_x")
    yf = _pos_frac_expr(kfs, "pos_y")
    zoom = _zoom_expr(kfs)

    if xf is None and yf is None:
        return f"crop={width}:{height}"
    xf = xf or "0.5"
    yf = yf or "0.5"

    if zoom is not None:
        # Scale the already-covering canvas up further by the zoom factor, then
        # crop the same fixed W:H back out of it — a tighter, more zoomed-in
        # view. The pan offset is computed from the KNOWN base width/height and
        # this SAME zoom expression (not ffmpeg's in_w/in_h): crop does not
        # reliably refresh in_w/in_h per frame when its upstream frame size is
        # itself changing per frame — verified with a real render, where using
        # in_w/in_h here produced an off-centre, runaway-looking zoom instead of
        # a centred one.
        prefix = f"scale=w='iw*{zoom}':h='ih*{zoom}':eval=frame:flags=bicubic,"
        x_part = f"(in_w-out_w)*({xf})"
        y_part = f"(in_h-out_h)*({yf})"
    else:
        prefix = ""
        x_part = f"(in_w-out_w)*({xf})"
        y_part = f"(in_h-out_h)*({yf})"

    # crop's x/y expressions are re-evaluated every frame automatically when
    # they reference time-varying variables like `t` — unlike drawbox/overlay,
    # this filter has no separate `eval` option (passing one is a hard error).
    return f"{prefix}crop={width}:{height}:x='{x_part}':y='{y_part}'"


def _build_crop_filter_complex(
    width: int, height: int, opts: ClipOptions, work_dir: Path, v_in: str = "0:v", mask_idx: Optional[int] = None, out_label: str = "outv"
) -> str:
    """-filter_complex graph for crop mode: cover+crop, rounded corners, cinematic FX, then captions."""
    stages = [
        f"[{v_in}]scale={width}:{height}:force_original_aspect_ratio=increase:flags=bicubic,"
        f"{_crop_filter(width, height, opts.reframe)}[v0]"
    ]
    last = "v0"
    if mask_idx is not None:
        stages += [
            f"[{last}]format=yuva420p[v_fg]",
            f"[{mask_idx}:v]format=gray,scale={width}:{height}:flags=bicubic[v_m]",
            "[v_fg][v_m]alphamerge[v_round]",
            f"color=c={opts.video_background}:s={width}x{height}[v_bg]",
            "[v_bg][v_round]overlay=0:0:shortest=1[v0_masked]",
        ]
        last = "v0_masked"
    stages += _finish_stages(last, width, height, opts, work_dir, out_label=out_label)
    return ";".join(stages)


def _build_square_filter_complex(
    opts: ClipOptions, work_dir: Path, v_in: str = "0:v", wm_idx: Optional[int] = None, out_label: str = "outv"
) -> str:
    """-filter_complex graph for square mode.

    Input 0 = source video, input 1 = the rounded mask. We split the source: one
    branch becomes a 9:16 black canvas (so the canvas shares the video's fps and
    timing), the other is cropped to a square and rounded via ``alphamerge``. The
    rounded square is then ``overlay``-composited onto the black canvas — doing
    the compositing explicitly (rather than ``pad`` + dropping the alpha at encode)
    is what makes the soft corners actually survive into the rendered pixels.
    """
    s = _SQUARE_INNER
    w, h = _SQUARE_CANVAS
    mx, my = (w - s) // 2, (h - s) // 2

    stages = [
        f"[{v_in}]split[base][fg]",
        f"[base]scale={w}:{h}:force_original_aspect_ratio=increase:flags=bicubic,"
        f"crop={w}:{h},drawbox=0:0:iw:ih:{opts.video_background}:t=fill[bg]",
        f"[fg]scale={s}:{s}:force_original_aspect_ratio=increase:flags=bicubic,"
        f"{_crop_filter(s, s, opts.reframe)}[fgsq]",
    ]

    # Cinematic FX go on the SQUARE itself (vw=vh=s) — exactly the region the live
    # preview grades — so gradients/vignette/grade land on the footage, not on the
    # black canvas around it. (Crop mode applies them to the full frame instead.)
    cine_stages, sq_in = effects.cinematic_stages(opts.cinematic, "fgsq", s, s)
    stages += cine_stages
    stages += [
        f"[{sq_in}]format=yuva420p[fg_a]",
        "[1:v]format=gray[mask_a]",
        "[fg_a][mask_a]alphamerge[sq_round]",
        f"[bg][sq_round]overlay={mx}:{my}:shortest=1[sq_comp]",
    ]

    last = "sq_comp"

    # Personal preference image watermark (PNG/JPG/JPEG on 1:1 square canvas)
    if wm_idx is not None and opts.image_watermark and opts.image_watermark.get("enabled"):
        wm = opts.image_watermark
        scale_pct = max(5.0, min(80.0, float(wm.get("scale") if wm.get("scale") is not None else 18.0)))
        wm_w = max(20, int(round(w * (scale_pct / 100.0))))
        alpha = max(0.1, min(1.0, float(wm.get("opacity") if wm.get("opacity") is not None else 85.0) / 100.0))
        px_frac = max(0.0, min(1.0, float(wm.get("pos_x") if wm.get("pos_x") is not None else 85.0) / 100.0))
        py_frac = max(0.0, min(1.0, float(wm.get("pos_y") if wm.get("pos_y") is not None else 15.0) / 100.0))

        stages.append(
            f"[{wm_idx}:v]scale={wm_w}:-1:flags=bicubic,format=rgba,colorchannelmixer=aa={alpha:.3f}[wm_scaled]"
        )
        stages.append(
            f"[{last}][wm_scaled]overlay=x='({w}-overlay_w)*{px_frac:.4f}':y='({h}-overlay_h)*{py_frac:.4f}':shortest=1[sq_wm]"
        )
        last = "sq_wm"

    if opts.bar_text and opts.bar_text.strip():
        # Title text (top) is drawn on the COMPOSITED canvas so it sits in the black
        # just above the square.
        lines = [ln.strip() for ln in opts.bar_text.split("\n") if ln.strip()][:3]
        font_size = max(28, int(round(h * 0.040)))
        line_h = int(round(font_size * 1.3))
        block_h = line_h * len(lines)
        start_y = max(16, my - block_h - 22)  # bottom of block ~22px above the square
        col = (opts.bar_text_color or "#FFFFFF").replace("#", "0x")
        anim = (opts.bar_text_anim or "none").lower()
        # Entrance animation (commas escaped for the filtergraph expression parser):
        #   fade  → alpha ramps 0→1 over 0.5s; slide → drops in from ~40px below.
        alpha_expr = ":alpha='if(lt(t\\,0.5)\\,t/0.5\\,1)'" if anim == "fade" else ""
        font_file = _rel_for_filter(_BAR_FONT, work_dir)
        for li, ln in enumerate(lines):
            base_y = start_y + li * line_h
            y = (f"'{base_y}+40*(1-min(t/0.45\\,1))'" if anim == "slide" else str(base_y))
            stages.append(
                f"[{last}]drawtext=fontfile='{font_file}':"
                f"text='{_escape_drawtext(ln)}':"
                f"fontcolor={col}:fontsize={font_size}:x=(w-text_w)/2:y={y}{alpha_expr}:"
                f"borderw=3:bordercolor=black@0.85[ttl{li}]"
            )
            last = f"ttl{li}"

    # Signature/watermark, then captions, on the composited canvas.
    sig_stages, last = _signature_stages(last, opts.signature, w, h, work_dir)
    stages += sig_stages
    stages.append(_caption_stage(last, opts, work_dir, out_label=out_label))
    return ";".join(stages)


_BROLL_DURATION_CACHE: dict[str, float] = {}

def _get_broll_duration(broll_file: Path) -> float:
    """Return video duration in seconds, caching the result."""
    key = str(broll_file.resolve())
    if key in _BROLL_DURATION_CACHE:
        return _BROLL_DURATION_CACHE[key]

    ffmpeg_bin = get_ffmpeg_bin()
    ffprobe_bin = Path(ffmpeg_bin).parent / "ffprobe.exe"
    if not ffprobe_bin.is_file():
        ffprobe_bin = Path(ffmpeg_bin).parent / "ffprobe"

    if ffprobe_bin.is_file():
        try:
            cmd = [
                str(ffprobe_bin), "-v", "error",
                "-show_entries", "format=duration",
                "-of", "default=noprint_wrappers=1:nokey=1",
                str(broll_file.resolve()),
            ]
            creationflags = getattr(subprocess, "CREATE_NO_WINDOW", 0)
            res = subprocess.run(
                cmd, capture_output=True, text=True, check=True,
                timeout=10, creationflags=creationflags,
            )
            dur = float(res.stdout.strip())
            if dur > 0:
                _BROLL_DURATION_CACHE[key] = dur
                return dur
        except Exception:
            pass

    dur = 90.0
    _BROLL_DURATION_CACHE[key] = dur
    return dur


def _get_broll_start(broll_file: Path, clip_id: str, clip_index: int) -> float:
    """Calculate a varied start offset for the B-roll video so each clip gets a unique moment."""
    import hashlib
    import random

    duration = _get_broll_duration(broll_file)
    if duration <= 10.0:
        return 0.0

    max_offset = max(5.0, duration - 10.0)
    seed_str = f"{clip_id}_{clip_index}_{broll_file.stem}"
    h = int(hashlib.md5(seed_str.encode()).hexdigest()[:8], 16)
    rnd = random.Random(h)

    # Distribute each clip index at a staggered interval plus jitter so clips never start at the same moment
    stagger = (clip_index * 23.7) % max_offset
    jitter = rnd.uniform(0.0, 12.0)
    offset = (stagger + jitter) % max_offset
    return round(offset, 2)


def _build_split_screen_filter_complex(
    opts: ClipOptions, work_dir: Path, v_in: str = "0:v", broll_idx: int = 1, out_label: str = "outv"
) -> str:
    """-filter_complex graph for split-screen mode: top speaker (AI centered) + bottom gameplay.

    Top half: 1080x960, reframed/tracked on speaker face.
    Bottom half: 1080x960, Subway Surfers gameplay loop.
    Stacked vertically (1080x1920) with optional divider, then cinematic effects, watermark, captions.
    """
    stages = [
        f"[{v_in}]scale=1080:960:force_original_aspect_ratio=increase:flags=bicubic,{_crop_filter(1080, 960, opts.reframe)}[v_top]",
        f"[{broll_idx}:v]scale=1080:960:force_original_aspect_ratio=increase:flags=bicubic,crop=1080:960[v_bot]",
        "[v_top][v_bot]vstack=inputs=2[v_stacked]",
    ]

    div_style = (opts.split_divider or "black").lower()
    last = "v_stacked"
    if div_style in ("black", "dark"):
        stages.append(f"[{last}]drawbox=x=0:y=958:w=iw:h=4:color=0x000000@1.0:t=fill[v_div]")
        last = "v_div"
    elif div_style == "blue":
        stages.append(f"[{last}]drawbox=x=0:y=958:w=iw:h=4:color=0x38bdf8@0.95:t=fill[v_div]")
        last = "v_div"
    elif div_style == "slate":
        stages.append(f"[{last}]drawbox=x=0:y=959:w=iw:h=2:color=0x64748b@0.85:t=fill[v_div]")
        last = "v_div"
    elif div_style == "white":
        stages.append(f"[{last}]drawbox=x=0:y=958:w=iw:h=4:color=0xffffff@0.95:t=fill[v_div]")
        last = "v_div"

    stages += _finish_stages(last, 1080, 1920, opts, work_dir, out_label=out_label)
    return ";".join(stages)


def _music_audio_graph(mus_idx: int, volume: float, duck: float = 70.0, a_in: str = "0:a") -> str:
    """Filtergraph that mixes a background track UNDER the original audio, reels-style.

    The voice is split: one copy is the sidechain key for ``sidechaincompress``,
    which automatically ducks the music whenever the speaker is talking, and one
    copy is mixed back at full level. So you hear the voice clearly with music
    filling the gaps — never a wall of loud music. ``normalize=0`` keeps the voice
    at unity gain instead of amix halving everything.

    ``volume`` (0-100) sets the music's resting loudness; ``duck`` (0-100) sets how
    hard the music dips while someone is talking, by scaling the sidechain
    compression ratio: 0 leaves the music steady (ratio ≈ 1), 100 pulls it down
    aggressively (ratio ≈ 20) so the voice always cuts through.

    Input 0's audio is the source voice; ``mus_idx`` is the music input's index.
    Produces the ``[aout]`` label the caller maps as the output audio.
    """
    base = max(0.0, min(1.0, (volume if volume is not None else 35) / 100.0 * 0.7))
    d = max(0.0, min(1.0, (duck if duck is not None else 70) / 100.0))
    ratio = 1.0 + d * 19.0  # 0 → 1 (no ducking), 100 → 20 (hard ducking)
    return (
        f"[{a_in}]asplit=2[__v1][__v2];"
        f"[{mus_idx}:a]volume={base:.3f},aresample=async=1[__m];"
        f"[__m][__v2]sidechaincompress=threshold=0.02:ratio={ratio:.2f}:attack=15:release=300[__md];"
        f"[__v1][__md]amix=inputs=2:duration=first:normalize=0[aout]"
    )


# Shared output-encoding args (everything after the filter graph).
_ENCODE_ARGS = [
    "-c:v", "libx264", "-preset", "veryfast", "-threads", "0", "-crf", "19", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart",
]


def _render_clip_process(
    source_mp4: Path, start: float, end: float, opts: ClipOptions, cancel_event: Optional[threading.Event] = None
) -> Path:
    """Internal rendering routine executed with given options."""
    out_dir = (CLIPS_DIR / opts.clip_id).resolve()
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / f"{opts.index}.mp4"
    # Render beside the destination, validate it, then atomically replace. A
    # failed reframe can therefore never truncate the customer's existing clip.
    render_token = uuid.uuid4().hex
    render_path = out_dir / f".{opts.index}.{render_token}.rendering.mp4"

    src = str(Path(source_mp4).resolve())
    has_music = opts.music_path is not None and Path(opts.music_path).is_file()

    # Determine timing and prep filters
    use_multi_intervals = bool(opts.intervals and len(opts.intervals) > 1)
    has_audio = True
    if use_multi_intervals or has_music:
        # PyAV is already bundled with Whisper; inspect stream metadata only.
        import av
        try:
            with av.open(src) as container:
                has_audio = bool(container.streams.audio)
        except Exception as exc:
            raise ClipGenerationError(f"Could not inspect source audio: {exc}") from exc

    if use_multi_intervals:
        assert opts.intervals is not None
        seek_start = opts.intervals[0][0]
        duration = max(0.1, sum(max(0.0, e - s) for s, e in opts.intervals))

        trim_stages = []
        concat_inputs = []
        for k, (sk, ek) in enumerate(opts.intervals):
            r_sk = max(0.0, sk - seek_start)
            r_ek = max(r_sk, ek - seek_start)
            trim_stages.append(f"[0:v]trim=start={r_sk:.3f}:end={r_ek:.3f},setpts=PTS-STARTPTS[__v{k}]")
            if has_audio:
                trim_stages.append(f"[0:a]atrim=start={r_sk:.3f}:end={r_ek:.3f},asetpts=PTS-STARTPTS[__a{k}]")
            concat_inputs.append(f"[__v{k}]" + (f"[__a{k}]" if has_audio else ""))

        concat_stage = (
            "".join(concat_inputs)
            + f"concat=n={len(opts.intervals)}:v=1:a={int(has_audio)}[v_tight]"
            + ("[a_tight]" if has_audio else "")
        )
        prep_filter = ";".join(trim_stages) + ";" + concat_stage
        v_in = "v_tight"
        a_in = "a_tight"
    else:
        # Single interval or normal clip
        if opts.intervals and len(opts.intervals) == 1:
            eff_start, eff_end = opts.intervals[0]
        else:
            eff_start, eff_end = start, end

        seek_start = eff_start
        duration = max(0.1, eff_end - eff_start)
        prep_filter = ""
        v_in = "0:v"
        a_in = "0:a"

    has_progress_bar = bool(getattr(opts, "progress_bar", False))
    main_out_label = "v_before_pb" if has_progress_bar else "outv"

    if opts.fit_mode == FitMode.SQUARE:
        v_width, v_height = 1080, 1920
        radius = _SQUARE_RADIUS if opts.square_corners != "square" else 0
        mask = ensure_rounded_mask(width=_SQUARE_INNER, height=_SQUARE_INNER, radius=radius)

        wm_file = None
        if opts.image_watermark and opts.image_watermark.get("enabled") and opts.image_watermark.get("image_id"):
            from .watermark import resolve_watermark
            try:
                wm_file = resolve_watermark(opts.image_watermark["image_id"])
            except Exception as exc:
                logger.warning("Failed to resolve image watermark %s: %s", opts.image_watermark.get("image_id"), exc)
                wm_file = None

        inputs = ["-ss", f"{seek_start:.3f}", "-i", src, "-loop", "1", "-i", str(mask.resolve())]
        next_input_idx = 2
        wm_idx = None
        if wm_file and wm_file.is_file():
            wm_idx = next_input_idx
            inputs += ["-loop", "1", "-i", str(wm_file.resolve())]
            next_input_idx += 1

        music_idx = next_input_idx
        fc_main = _build_square_filter_complex(opts, out_dir, v_in=v_in, wm_idx=wm_idx, out_label=main_out_label)
        tail = ["-shortest"]
    elif getattr(opts, "split_screen", False):
        v_width, v_height = 1080, 1920
        from .paths import BROLL_DIR
        broll_name = getattr(opts, "split_broll", "subway_surfers") or "subway_surfers"
        broll_file = None
        if broll_name == "custom" and getattr(opts, "custom_broll_id", None):
            from .uploads import resolve_upload
            try:
                broll_file = resolve_upload(opts.custom_broll_id)
            except Exception as exc:
                logger.warning("Failed to resolve custom B-roll %s: %s", opts.custom_broll_id, exc)
        if not broll_file or not broll_file.is_file():
            broll_file = BROLL_DIR / f"{broll_name}.mp4"
        if not broll_file or not broll_file.is_file():
            broll_file = BROLL_DIR / "subway_surfers.mp4"
        if not broll_file.is_file():
            brolls = list(BROLL_DIR.glob("*.mp4"))
            if brolls:
                broll_file = brolls[0]
            else:
                raise ClipGenerationError(f"Subway Surfers B-roll asset not found in {BROLL_DIR}")

        broll_seek = _get_broll_start(broll_file, opts.clip_id, opts.index)
        logger.info(
            "Split-screen clip %d using B-roll '%s' starting at offset %.2fs",
            opts.index, broll_file.name, broll_seek,
        )
        fc_main = _build_split_screen_filter_complex(opts, out_dir, v_in=v_in, broll_idx=1, out_label=main_out_label)
        inputs = [
            "-ss", f"{seek_start:.3f}", "-i", src,
            "-stream_loop", "-1", "-ss", f"{broll_seek:.2f}", "-i", str(broll_file.resolve()),
        ]
        music_idx = 2  # 0 = source, 1 = broll
        tail = []
    else:
        v_width, v_height = target_size(opts.aspect_ratio, opts.fit_mode)
        is_round = (opts.square_corners == "round")
        if is_round:
            radius = 48
            mask = ensure_rounded_mask(width=v_width, height=v_height, radius=radius)
            fc_main = _build_crop_filter_complex(v_width, v_height, opts, out_dir, v_in=v_in, mask_idx=1, out_label=main_out_label)
            inputs = ["-ss", f"{seek_start:.3f}", "-i", src, "-loop", "1", "-i", str(mask.resolve())]
            music_idx = 2  # 0 = source, 1 = mask
            tail = ["-shortest"]
        else:
            fc_main = _build_crop_filter_complex(v_width, v_height, opts, out_dir, v_in=v_in, out_label=main_out_label)
            inputs = ["-ss", f"{seek_start:.3f}", "-i", src]
            music_idx = 1  # 0 = source
            tail = []

    if has_progress_bar:
        bar_h = max(6, min(30, int(getattr(opts, "progress_bar_height", 10) or 10)))
        pos = str(getattr(opts, "progress_bar_position", "top") or "top").lower()
        pos_y = 0 if pos != "bottom" else max(0, v_height - bar_h)
        raw_col = str(getattr(opts, "progress_bar_color", "#FACC15") or "#FACC15")
        col = raw_col.replace("#", "0x")
        dur = max(0.1, duration)

        pb_stages = [
            f"color=c=black@0.45:s={v_width}x{bar_h}:d={dur:.3f}[p_bg]",
            f"color=c={col}:s={v_width}x{bar_h}:d={dur:.3f}[p_fill]",
            f"[v_before_pb][p_bg]overlay=0:{pos_y}[v_p1]",
            f"[v_p1][p_fill]overlay=x='-w+w*(t/{dur:.3f})':y={pos_y}[outv]",
        ]
        fc_main = fc_main + ";" + ";".join(pb_stages)

    caption_layer = None
    if opts.ass_path and Path(opts.ass_path).suffix == ".json":
        caption_layer = out_dir / f".{opts.index}.{render_token}.captions.mov"
        rendered = canvas_captions.render_layer(Path(opts.ass_path), caption_layer, v_width, v_height,
            cancelled=cancel_event.is_set if cancel_event is not None else None)
        if rendered is None:
            raise ClipGenerationError("Rendering cancelled by user.")
        inputs += ["-i", str(caption_layer)]
        layer_idx = music_idx
        music_idx += 1
        fc_main = fc_main.replace("[outv]", "[caption_base]")
        fc_main += f";[caption_base][{layer_idx}:v]overlay=0:0:eof_action=pass:repeatlast=0[outv]"

    fc = (prep_filter + ";" + fc_main) if prep_filter else fc_main

    # Background music ducking or standard audio mapping
    if has_music:
        seek = ["-ss", f"{max(0.0, opts.music_start):.2f}"] if opts.music_start and opts.music_start > 0 else []
        inputs += ["-stream_loop", "-1", *seek, "-i", str(Path(opts.music_path).resolve())]
        if has_audio:
            fc += ";" + _music_audio_graph(music_idx, opts.music_volume, opts.music_duck, a_in=a_in)
        else:
            # No voice to duck against: use only the selected music, at the
            # same resting volume and bounded by the output clip duration.
            volume = max(0.0, min(1.0, (opts.music_volume if opts.music_volume is not None else 35) / 100.0 * 0.7))
            fc += f";[{music_idx}:a]volume={volume:.3f},aresample=async=1[aout]"
        audio_map = ["-map", "[aout]"]
    else:
        audio_map = (["-map", f"[{a_in}]"] if has_audio else []) if use_multi_intervals else ["-map", "0:a?"]

    ffmpeg_bin = get_ffmpeg_bin()
    # A second render/reframe of the same clip must not overwrite the first
    # process's filtergraph or progress file while FFmpeg is still reading it.
    fc_script = out_dir / f".{opts.index}.{render_token}.filter.txt"
    progress_path = out_dir / f".{opts.index}.{render_token}.progress.txt"
    fc_script.write_text(fc, encoding="utf-8")

    cmd = [
        ffmpeg_bin, "-y",
        "-progress", str(progress_path),
        *inputs,
        "-t", f"{duration:.3f}",
        "-filter_complex_script", str(fc_script.resolve()),
        "-map", "[outv]", *audio_map,
        *_ENCODE_ARGS,
        *tail,
        str(render_path),
    ]

    logger.info("Rendering clip %d (cwd=%s): %s", opts.index, out_dir, " ".join(cmd))

    log_path = out_dir / f"ffmpeg_{opts.index}_{render_token}.log"
    proc = None
    try:
        creationflags = getattr(subprocess, "CREATE_NO_WINDOW", 0)
        with open(log_path, "w", encoding="utf-8", errors="replace") as err_file:
            proc = subprocess.Popen(
                cmd,
                cwd=str(out_dir),
                stdout=subprocess.DEVNULL,
                stderr=err_file,
                creationflags=creationflags,
            )
            with _ACTIVE_PROCESSES_LOCK:
                _ACTIVE_PROCESSES.add(proc)

            # A fixed ten-minute wall-clock deadline kills valid long clips on
            # slower PCs. Only abort if encoded time/frame count has stopped
            # advancing for ten minutes; cancellation stays immediate.
            last_activity = time.monotonic()
            last_encoded_us = -1
            last_frame = -1
            progress_offset = 0
            progress_remainder = ""
            while True:
                ret = proc.poll()
                if ret is not None:
                    break
                if cancel_event is not None and cancel_event.is_set():
                    proc.kill()
                    proc.wait()
                    render_path.unlink(missing_ok=True)
                    raise ClipGenerationError("Rendering cancelled by user.")
                try:
                    with progress_path.open("r", encoding="utf-8", errors="replace") as progress_file:
                        progress_file.seek(progress_offset)
                        chunk = progress_file.read()
                        progress_offset = progress_file.tell()
                except OSError:
                    chunk = ""
                if chunk:
                    lines = (progress_remainder + chunk).split("\n")
                    progress_remainder = lines.pop()
                    for line in lines:
                        key, _, raw = line.strip().partition("=")
                        try:
                            if key in ("out_time_ms", "out_time_us"):
                                value = int(raw)
                                if value > last_encoded_us:
                                    last_encoded_us = value
                                    last_activity = time.monotonic()
                            elif key == "frame":
                                value = int(raw)
                                if value > last_frame:
                                    last_frame = value
                                    last_activity = time.monotonic()
                        except ValueError:
                            continue
                if time.monotonic() - last_activity > _RENDER_STALL_SECONDS:
                    proc.kill()
                    proc.wait()
                    render_path.unlink(missing_ok=True)
                    raise ClipGenerationError(
                        f"Rendering stopped making progress for {int(_RENDER_STALL_SECONDS)}s."
                    )
                time.sleep(0.15)
    except FileNotFoundError as exc:
        render_path.unlink(missing_ok=True)
        if getattr(exc, "winerror", None) == 206 or "too long" in str(exc).lower():
            raise ClipGenerationError(f"Command line or filter script too long: {exc}") from exc
        raise ClipGenerationError(
            "ffmpeg was not found on PATH or bundled folder. Install it (winget/brew/apt) — it "
            "does the cutting, reframing, and caption burning."
        ) from exc
    except ClipGenerationError:
        render_path.unlink(missing_ok=True)
        raise
    except Exception as exc:  # noqa: BLE001
        render_path.unlink(missing_ok=True)
        raise ClipGenerationError(f"Failed to run ffmpeg: {exc}") from exc
    finally:
        if proc is not None:
            try:
                if proc.poll() is None:
                    proc.kill()
                    proc.wait()
            except OSError:
                logger.warning("Could not stop an unfinished FFmpeg process", exc_info=True)
            with _ACTIVE_PROCESSES_LOCK:
                _ACTIVE_PROCESSES.discard(proc)
        for temporary in (fc_script, progress_path, caption_layer):
            if temporary is None:
                continue
            try:
                temporary.unlink(missing_ok=True)
            except OSError:
                logger.warning("Could not remove render support file %s", temporary, exc_info=True)

    if proc.returncode != 0 or not render_path.exists():
        render_path.unlink(missing_ok=True)
        err_tail = ""
        if log_path.is_file():
            try:
                err_tail = "\n".join(log_path.read_text(encoding="utf-8", errors="replace").strip().splitlines()[-12:])
            except Exception:
                pass
        raise ClipGenerationError(
            "ffmpeg failed to render the clip:\n" + err_tail
        )

    # FFmpeg can exit 0 yet create a header-only MP4 when a custom range is
    # entirely beyond EOF. Reject such files before publishing them.
    try:
        import av
        with av.open(str(render_path)) as container:
            if not container.streams.video:
                raise ValueError("render contains no video stream")
            try:
                next(container.decode(video=0))
            except StopIteration as exc:
                raise ValueError("render contains no decodable video frame") from exc
    except Exception as exc:
        render_path.unlink(missing_ok=True)
        raise ClipGenerationError(f"Rendered clip is empty or invalid: {exc}") from exc

    try:
        _publish_render(render_path, out_path)
    except OSError as exc:
        render_path.unlink(missing_ok=True)
        raise ClipGenerationError(
            "Could not replace the finished clip. Close any video player using "
            f"the clip and try again. Windows reported: {exc}"
        ) from exc
    try:
        log_path.unlink(missing_ok=True)
    except OSError:
        logger.warning("Could not remove successful render log %s", log_path, exc_info=True)

    return out_path


def generate_clip(
    source_mp4: Path,
    start: float,
    end: float,
    opts: ClipOptions,
    cancel_event: Optional[threading.Event] = None,
) -> Path:
    """Cut [start, end] or opts.intervals from `source_mp4`, reframe + caption it, return mp4.

    Timeline-aware fallback is handled by jobs.py, which can rebuild captions and
    crop keyframes for the original uncompressed window.
    """
    if cancel_event is not None and cancel_event.is_set():
        raise ClipGenerationError("Rendering cancelled by user.")

    return _render_clip_process(source_mp4, start, end, opts, cancel_event=cancel_event)
