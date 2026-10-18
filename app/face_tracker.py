"""Auto Face Tracking for 1:1 Square Clips — Single & Multi-Person.

Smoothly follows the primary visible speaker or group using OpenCV YuNet face
detection, temporal track association, group bounding-box framing, adaptive
zoom-out, dead-zone filtering, velocity clamping, and graceful face-loss recovery.
Output keyframes plug directly into Clipxy4all's existing reframe piecewise-linear
FFmpeg pipeline.
"""

from __future__ import annotations

import logging
import math
from dataclasses import dataclass
from pathlib import Path
from typing import List, Optional, Tuple

import cv2
import numpy as np

from app.paths import ASSETS_DIR, MODELS_DIR, ROOT_DIR
from app.silence import remap_timestamp

logger = logging.getLogger("clipxy4all.face_tracker")

# --------------------------------------------------------------------------- #
# Physics & Tracking Constants
# --------------------------------------------------------------------------- #
TARGET_FPS: float = 3.5  # Detection sampling frequency (~0.285s step)
CONF_THRESHOLD: float = 0.65  # Confidence threshold for reliable faces
NMS_THRESHOLD: float = 0.3  # Non-maximum suppression threshold
SMOOTH_ALPHA: float = 0.28  # Exponential Moving Average factor (cinematic ease)
DEAD_ZONE_PCT: float = 2.5  # Ignore micro-movements < 2.5% of pan range
MAX_PAN_SPEED: float = 32.0  # Max camera velocity (% of pan range per second)
FACE_LOSS_HOLD_SEC: float = 2.0  # Hold position during temporary head turns / occlusion
DRIFT_TO_CENTER_SEC: float = 3.0  # Seconds taken to gently drift back to center (50.0)
DETECTION_MAX_DIM: int = 640  # Max width/height for fast CPU inference

# Multi-Face & Adaptive Zoom Physics
ZOOM_SMOOTH_ALPHA: float = 0.22  # Zoom factor changes slightly more gradually than pan
ZOOM_DEAD_ZONE_PCT: float = 1.0  # Ignore zoom changes < 1.0%
MAX_ZOOM_SPEED: float = 16.0  # Max zoom velocity (% per second)
MIN_FRAMES_ACTIVE: int = 3  # Number of samples required before a new face enters group (~0.85s)
HYSTERESIS_LEAVE_FRAMES: int = 4  # Samples a face must be missing before leaving group (~1.14s)
MAX_TRACK_MISSING: int = 5  # Drop track completely after 5 missed samples (~1.4s)
MIN_ZOOM: float = 85.0  # Tightest crop for very close faces
MAX_ZOOM: float = 100.0  # Widest safe crop (max-coverage box, zero black bars)

YUNET_FILENAME = "face_detection_yunet_2023mar.onnx"
EXPECTED_MIN_BYTES = 200_000


# --------------------------------------------------------------------------- #
# Data Structures
# --------------------------------------------------------------------------- #
@dataclass
class FaceTrack:
    """Represents a temporally persistent face track across sampled frames."""

    track_id: int
    bbox: Tuple[float, float, float, float]  # (x, y, w, h) in original video coords
    conf: float
    frames_seen: int = 1
    missing_count: int = 0
    last_seen_t: float = 0.0

    @property
    def center_x(self) -> float:
        return self.bbox[0] + self.bbox[2] / 2.0

    @property
    def center_y(self) -> float:
        return self.bbox[1] + self.bbox[3] / 2.0

    @property
    def area(self) -> float:
        return self.bbox[2] * self.bbox[3]


# --------------------------------------------------------------------------- #
# Model Loading & Face Detection
# --------------------------------------------------------------------------- #
def ensure_model() -> Path:
    """Find the bundled YuNet model; missing assets must never trigger a download."""
    for candidate in [
        ASSETS_DIR / "models" / YUNET_FILENAME,
        MODELS_DIR / YUNET_FILENAME,
        ROOT_DIR / "assets" / "models" / YUNET_FILENAME,
        ROOT_DIR / "models" / YUNET_FILENAME,
    ]:
        if candidate.is_file() and candidate.stat().st_size >= EXPECTED_MIN_BYTES:
            return candidate

    raise RuntimeError(
        "Bundled YuNet face model is missing or incomplete. "
        "Restore the model from the Clipxy4all installer; automatic downloads are disabled."
    )


def create_detector(det_w: int, det_h: int) -> cv2.FaceDetectorYN:
    """Create a YuNet face detector initialized for the given frame size."""
    model_path = ensure_model()
    detector = cv2.FaceDetectorYN.create(
        model=str(model_path),
        config="",
        input_size=(det_w, det_h),
        score_threshold=CONF_THRESHOLD,
        nms_threshold=NMS_THRESHOLD,
        top_k=5000,
        backend_id=cv2.dnn.DNN_BACKEND_OPENCV,
        target_id=cv2.dnn.DNN_TARGET_CPU,
    )
    return detector


def detect_faces(
    frame: np.ndarray,
    detector: cv2.FaceDetectorYN,
    scale: float = 1.0,
) -> List[Tuple[float, float, float, float, float]]:
    """Detect faces in a frame and return boxes in original frame coordinates.

    Returns:
        List of (x, y, w, h, score) tuples.
    """
    det_w, det_h = int(frame.shape[1] * scale), int(frame.shape[0] * scale)
    if scale != 1.0:
        det_frame = cv2.resize(frame, (det_w, det_h))
    else:
        det_frame = frame

    detector.setInputSize((det_w, det_h))
    _, faces = detector.detect(det_frame)
    if faces is None or len(faces) == 0:
        return []

    results: List[Tuple[float, float, float, float, float]] = []
    inv_scale = 1.0 / scale
    for face in faces:
        score = float(face[14])
        if score < CONF_THRESHOLD:
            continue
        x = float(face[0]) * inv_scale
        y = float(face[1]) * inv_scale
        w = float(face[2]) * inv_scale
        h = float(face[3]) * inv_scale
        results.append((x, y, w, h, score))
    return results


# --------------------------------------------------------------------------- #
# Single Face Selection & Positioning (Backward-Compatible)
# --------------------------------------------------------------------------- #
def select_primary_face(
    faces: List[Tuple[float, float, float, float, float]],
    prev_face: Optional[Tuple[float, float, float, float]],
    frame_w: int,
    frame_h: int,
) -> Optional[Tuple[float, float, float, float]]:
    """Select the primary dominant face, maintaining continuity with the previous face.

    Prevents rapid flip-flopping between multiple visible speakers in single-face mode.
    """
    if not faces:
        return None

    norm_w = float(frame_w)
    norm_h = float(frame_h)

    best_face: Optional[Tuple[float, float, float, float]] = None
    best_score = -1.0

    for x, y, w, h, conf in faces:
        cx_norm = (x + w / 2.0) / norm_w
        cy_norm = (y + h / 2.0) / norm_h
        area_norm = (w * h) / (norm_w * norm_h)

        center_factor = 1.0 - 0.25 * (abs(cx_norm - 0.5) + abs(cy_norm - 0.5))
        score = area_norm * conf * max(0.5, center_factor)

        if prev_face is not None:
            px, py, pw, ph = prev_face
            prev_cx_norm = (px + pw / 2.0) / norm_w
            prev_cy_norm = (py + ph / 2.0) / norm_h
            dist = math.hypot(cx_norm - prev_cx_norm, cy_norm - prev_cy_norm)
            if dist < 0.20:
                score *= 2.5
            elif dist < 0.35:
                score *= 1.5

        if score > best_score:
            best_score = score
            best_face = (x, y, w, h)

    return best_face


def calculate_crop_pos(
    face_box: Optional[Tuple[float, float, float, float]],
    video_w: int,
    video_h: int,
) -> Tuple[float, float]:
    """Calculate square crop center (pos_x, pos_y) as percentages [0.0, 100.0].

    Strictly guarantees that the square crop box [S x S] never escapes
    the video boundaries [0, W - S] or [0, H - S].
    """
    if face_box is None:
        return 50.0, 50.0

    x, y, w, h = face_box
    fx = x + w / 2.0
    fy = y + h / 2.0

    if video_w > video_h:
        s = float(video_h)
        desired_left = fx - s / 2.0
        max_left = float(video_w - video_h)
        clamped_left = max(0.0, min(max_left, desired_left))
        pos_x = (clamped_left / max_left) * 100.0 if max_left > 0 else 50.0
        pos_y = 50.0
    elif video_h > video_w:
        s = float(video_w)
        desired_top = fy - s / 2.0
        max_top = float(video_h - video_w)
        clamped_top = max(0.0, min(max_top, desired_top))
        pos_x = 50.0
        pos_y = (clamped_top / max_top) * 100.0 if max_top > 0 else 50.0
    else:
        pos_x = 50.0
        pos_y = 50.0

    return round(pos_x, 2), round(pos_y, 2)


# --------------------------------------------------------------------------- #
# Temporal Multi-Face Tracking Engine
# --------------------------------------------------------------------------- #
class MultiFaceTracker:
    """Maintains persistent face tracks across frames and selects the optimal framing group."""

    def __init__(self, video_w: int, video_h: int):
        self.video_w = video_w
        self.video_h = video_h
        self.tracks: List[FaceTrack] = []
        self.next_track_id: int = 1
        self.current_mode: str = "NO_FACE"
        self.active_track_ids: List[int] = []

    def update(
        self,
        detected_faces: List[Tuple[float, float, float, float, float]],
        t: float,
    ) -> None:
        """Associate detections with existing tracks using spatial proximity."""
        diag = math.hypot(self.video_w, self.video_h)
        match_thresh = 0.20 * diag

        matched_track_indices = set()
        matched_det_indices = set()

        matches = []
        for d_idx, (dx, dy, dw, dh, dconf) in enumerate(detected_faces):
            dcx = dx + dw / 2.0
            dcy = dy + dh / 2.0
            for t_idx, track in enumerate(self.tracks):
                dist = math.hypot(dcx - track.center_x, dcy - track.center_y)
                if dist < match_thresh:
                    matches.append((dist, d_idx, t_idx))

        matches.sort(key=lambda m: m[0])
        for dist, d_idx, t_idx in matches:
            if d_idx in matched_det_indices or t_idx in matched_track_indices:
                continue
            matched_det_indices.add(d_idx)
            matched_track_indices.add(t_idx)

            dx, dy, dw, dh, dconf = detected_faces[d_idx]
            track = self.tracks[t_idx]
            track.bbox = (dx, dy, dw, dh)
            track.conf = dconf
            track.frames_seen += 1
            track.missing_count = 0
            track.last_seen_t = t

        # Unmatched existing tracks -> increment missing counter
        for t_idx in range(len(self.tracks)):
            if t_idx not in matched_track_indices:
                self.tracks[t_idx].missing_count += 1

        # Unmatched detections -> create new tracks with missing_count = 0
        for d_idx, (dx, dy, dw, dh, dconf) in enumerate(detected_faces):
            if d_idx not in matched_det_indices:
                self.tracks.append(
                    FaceTrack(
                        track_id=self.next_track_id,
                        bbox=(dx, dy, dw, dh),
                        conf=dconf,
                        frames_seen=1,
                        missing_count=0,
                        last_seen_t=t,
                    )
                )
                self.next_track_id += 1

        # Prune long-dead tracks
        self.tracks = [tr for tr in self.tracks if tr.missing_count <= MAX_TRACK_MISSING]

    def select_framed_faces(self) -> List[Tuple[float, float, float, float]]:
        """Identify which faces to frame, applying hysteresis and group coherence."""
        reliable_tracks: List[FaceTrack] = []
        for tr in self.tracks:
            if tr.track_id in self.active_track_ids:
                if tr.missing_count < HYSTERESIS_LEAVE_FRAMES:
                    reliable_tracks.append(tr)
            else:
                if tr.missing_count == 0:
                    # Initial face is accepted immediately; secondary joining faces require stability
                    if len(self.active_track_ids) == 0:
                        reliable_tracks.append(tr)
                    elif tr.frames_seen >= MIN_FRAMES_ACTIVE or tr.conf >= 0.95:
                        reliable_tracks.append(tr)

        if not reliable_tracks:
            self.current_mode = "NO_FACE"
            self.active_track_ids = []
            return []

        # Sort by visual dominance: area * confidence
        reliable_tracks.sort(key=lambda tr: tr.area * tr.conf, reverse=True)

        s = float(min(self.video_w, self.video_h))

        # Case 1: Exactly 1 reliable face
        if len(reliable_tracks) == 1:
            self.current_mode = "SINGLE_FACE"
            self.active_track_ids = [reliable_tracks[0].track_id]
            return [reliable_tracks[0].bbox]

        # Case 2: Exactly 2 reliable faces
        if len(reliable_tracks) == 2:
            t1, t2 = reliable_tracks[0], reliable_tracks[1]
            span_x = max(t1.bbox[0] + t1.bbox[2], t2.bbox[0] + t2.bbox[2]) - min(t1.bbox[0], t2.bbox[0])
            span_y = max(t1.bbox[1] + t1.bbox[3], t2.bbox[1] + t2.bbox[3]) - min(t1.bbox[1], t2.bbox[1])

            # Check if both can fit in a 1:1 square crop window
            if max(span_x, span_y) <= s * 1.05:
                self.current_mode = "TWO_FACE"
                self.active_track_ids = [t1.track_id, t2.track_id]
                return [t1.bbox, t2.bbox]
            else:
                # Faces are too far apart to both fit in a 1:1 square without severe clipping.
                # Prioritize the dominant/persistent face.
                primary = t1 if (t1.track_id in self.active_track_ids or t2.track_id not in self.active_track_ids) else t2
                self.current_mode = "SINGLE_FACE"
                self.active_track_ids = [primary.track_id]
                return [primary.bbox]

        # Case 3: 3 or more reliable faces
        # Find the best coherent cluster of 2 (or 3) faces that comfortably fit within 1:1 window
        best_cluster: List[FaceTrack] = [reliable_tracks[0]]
        best_score = reliable_tracks[0].area * reliable_tracks[0].conf

        for i in range(len(reliable_tracks)):
            for j in range(i + 1, len(reliable_tracks)):
                tA, tB = reliable_tracks[i], reliable_tracks[j]
                span_x = max(tA.bbox[0] + tA.bbox[2], tB.bbox[0] + tB.bbox[2]) - min(tA.bbox[0], tB.bbox[0])
                span_y = max(tA.bbox[1] + tA.bbox[3], tB.bbox[1] + tB.bbox[3]) - min(tA.bbox[1], tB.bbox[1])
                if max(span_x, span_y) <= s * 0.98:
                    score = tA.area * tA.conf + tB.area * tB.conf
                    if tA.track_id in self.active_track_ids:
                        score *= 1.4
                    if tB.track_id in self.active_track_ids:
                        score *= 1.4
                    if score > best_score:
                        best_score = score
                        best_cluster = [tA, tB]

        self.active_track_ids = [tr.track_id for tr in best_cluster]
        self.current_mode = "MULTI_FACE" if len(best_cluster) > 2 else ("TWO_FACE" if len(best_cluster) == 2 else "SINGLE_FACE")
        return [tr.bbox for tr in best_cluster]


# --------------------------------------------------------------------------- #
# Group Crop & Adaptive Zoom Calculation
# --------------------------------------------------------------------------- #
def calculate_group_crop(
    faces: List[Tuple[float, float, float, float]],
    video_w: int,
    video_h: int,
) -> Tuple[float, float, float]:
    """Calculate square crop center (pos_x, pos_y) and zoom [MIN_ZOOM, 100.0].

    Returns (pos_x, pos_y, zoom) as percentages.
    Strictly guarantees that the crop window remains within source video boundaries.
    """
    if not faces:
        return 50.0, 50.0, 100.0

    if len(faces) == 1:
        pos_x, pos_y = calculate_crop_pos(faces[0], video_w, video_h)
        return pos_x, pos_y, 100.0

    g_left = min(x for x, y, w, h in faces)
    g_right = max(x + w for x, y, w, h in faces)
    g_top = min(y for x, y, w, h in faces)
    g_bottom = max(y + h for x, y, w, h in faces)

    gw = max(1.0, g_right - g_left)
    gh = max(1.0, g_bottom - g_top)
    cx = (g_left + g_right) / 2.0
    cy = (g_top + g_bottom) / 2.0

    s = float(min(video_w, video_h))

    # Add safety margins around group
    margin_x = gw * 0.18 + 25.0
    margin_y = gh * 0.18 + 25.0
    req_w = gw + 2.0 * margin_x
    req_h = gh + 2.0 * margin_y
    req_size = max(req_w, req_h)

    # Adaptive Zoom:
    # If faces are close together, zoom can be tighter (e.g. 85-90%).
    # If faces are widely separated, zoom widens up to 100.0 (maximum safe crop).
    if req_size <= s * 0.65:
        zoom = MIN_ZOOM
    elif req_size >= s:
        zoom = 100.0
    else:
        frac = (req_size - s * 0.65) / (s * 0.35)
        zoom = MIN_ZOOM + frac * (100.0 - MIN_ZOOM)

    zoom = max(MIN_ZOOM, min(100.0, zoom))
    crop_dim = s * (zoom / 100.0)

    if video_w > video_h:
        # Landscape: pannable along X
        desired_left = cx - crop_dim / 2.0
        max_left = float(video_w) - crop_dim
        clamped_left = max(0.0, min(max_left, desired_left))
        pos_x = (clamped_left / max_left) * 100.0 if max_left > 0 else 50.0

        if float(video_h) > crop_dim:
            desired_top = cy - crop_dim / 2.0
            max_top = float(video_h) - crop_dim
            clamped_top = max(0.0, min(max_top, desired_top))
            pos_y = (clamped_top / max_top) * 100.0 if max_top > 0 else 50.0
        else:
            pos_y = 50.0
    elif video_h > video_w:
        # Portrait: pannable along Y
        desired_top = cy - crop_dim / 2.0
        max_top = float(video_h) - crop_dim
        clamped_top = max(0.0, min(max_top, desired_top))
        pos_y = (clamped_top / max_top) * 100.0 if max_top > 0 else 50.0

        if float(video_w) > crop_dim:
            desired_left = cx - crop_dim / 2.0
            max_left = float(video_w) - crop_dim
            clamped_left = max(0.0, min(max_left, desired_left))
            pos_x = (clamped_left / max_left) * 100.0 if max_left > 0 else 50.0
        else:
            pos_x = 50.0
    else:
        pos_x = 50.0
        pos_y = 50.0

    return round(pos_x, 2), round(pos_y, 2), round(zoom, 2)


# --------------------------------------------------------------------------- #
# Trajectory Smoothing Engine (Synchronized 3-Channel)
# --------------------------------------------------------------------------- #
def smooth_positions(
    raw_samples: List[Tuple[float, Optional[Tuple[float, ...]]]],
    clip_duration: float,
) -> List[Tuple]:
    """Apply dead-zone, EMA smoothing, velocity clamping, and face-loss physics.

    Synchronously smooths pos_x, pos_y, and zoom across time.
    Preserves input channel count:
      - Returns (t, pos_x, pos_y) if input had 2 channels (pos_x, pos_y).
      - Returns (t, pos_x, pos_y, zoom) if input had 3 channels (pos_x, pos_y, zoom).
    """
    has_zoom = any(pos is not None and len(pos) >= 3 for _, pos in raw_samples)

    if not raw_samples:
        if has_zoom:
            return [(0.0, 50.0, 50.0, 100.0), (clip_duration, 50.0, 50.0, 100.0)]
        return [(0.0, 50.0, 50.0), (clip_duration, 50.0, 50.0)]

    faces_detected = any(pos is not None for _, pos in raw_samples)
    if not faces_detected:
        if has_zoom:
            return [(0.0, 50.0, 50.0, 100.0), (clip_duration, 50.0, 50.0, 100.0)]
        return [(0.0, 50.0, 50.0), (clip_duration, 50.0, 50.0)]

    first_valid = next((pos for _, pos in raw_samples if pos is not None), (50.0, 50.0, 100.0))
    curr_x = float(first_valid[0])
    curr_y = float(first_valid[1])
    curr_zoom = float(first_valid[2]) if len(first_valid) >= 3 else 100.0

    last_seen_time: Optional[float] = None
    prev_t = raw_samples[0][0]
    smoothed: List[Tuple] = []

    for t, pos in raw_samples:
        dt = max(0.001, t - prev_t)

        if pos is not None:
            target_x = float(pos[0])
            target_y = float(pos[1])
            target_zoom = float(pos[2]) if len(pos) >= 3 else 100.0
            last_seen_time = t

            # 1. Dead-zone filtering
            if abs(target_x - curr_x) < DEAD_ZONE_PCT:
                desired_x = curr_x
            else:
                desired_x = curr_x + SMOOTH_ALPHA * (target_x - curr_x)

            if abs(target_y - curr_y) < DEAD_ZONE_PCT:
                desired_y = curr_y
            else:
                desired_y = curr_y + SMOOTH_ALPHA * (target_y - curr_y)

            if abs(target_zoom - curr_zoom) < ZOOM_DEAD_ZONE_PCT:
                desired_zoom = curr_zoom
            else:
                desired_zoom = curr_zoom + ZOOM_SMOOTH_ALPHA * (target_zoom - curr_zoom)

        else:
            # Face loss physics
            time_lost = (t - last_seen_time) if last_seen_time is not None else 999.0

            if time_lost <= FACE_LOSS_HOLD_SEC:
                desired_x = curr_x
                desired_y = curr_y
                desired_zoom = curr_zoom
            else:
                drift_speed = 50.0 / max(0.5, DRIFT_TO_CENTER_SEC)
                step = drift_speed * dt

                if abs(curr_x - 50.0) <= step:
                    desired_x = 50.0
                else:
                    desired_x = curr_x + math.copysign(step, 50.0 - curr_x)

                if abs(curr_y - 50.0) <= step:
                    desired_y = 50.0
                else:
                    desired_y = curr_y + math.copysign(step, 50.0 - curr_y)

                zoom_step = MAX_ZOOM_SPEED * dt
                if abs(curr_zoom - 100.0) <= zoom_step:
                    desired_zoom = 100.0
                else:
                    desired_zoom = curr_zoom + math.copysign(zoom_step, 100.0 - curr_zoom)

        # 2. Velocity clamping
        max_pan_delta = MAX_PAN_SPEED * dt
        dx = desired_x - curr_x
        curr_x += math.copysign(min(abs(dx), max_pan_delta), dx)

        dy = desired_y - curr_y
        curr_y += math.copysign(min(abs(dy), max_pan_delta), dy)

        max_zoom_delta = MAX_ZOOM_SPEED * dt
        dz = desired_zoom - curr_zoom
        curr_zoom += math.copysign(min(abs(dz), max_zoom_delta), dz)

        curr_x = max(0.0, min(100.0, curr_x))
        curr_y = max(0.0, min(100.0, curr_y))
        curr_zoom = max(MIN_ZOOM, min(100.0, curr_zoom))

        if has_zoom:
            smoothed.append((t, round(curr_x, 2), round(curr_y, 2), round(curr_zoom, 2)))
        else:
            smoothed.append((t, round(curr_x, 2), round(curr_y, 2)))
        prev_t = t

    return smoothed


# --------------------------------------------------------------------------- #
# Keyframe Generation & Timeline Mapping
# --------------------------------------------------------------------------- #
def build_keyframes(
    smoothed_trajectory: List[Tuple[float, ...]],
    clip_start: float,
    clip_end: float,
    intervals: Optional[List[Tuple[float, float]]] = None,
) -> List[dict]:
    """Convert smoothed trajectory into time-remapped, optimized FFmpeg keyframes."""
    if not smoothed_trajectory:
        return [{"time": 0.0, "pos_x": 50.0, "pos_y": 50.0, "zoom": 100.0}]

    raw_kfs: List[dict] = []
    for item in smoothed_trajectory:
        t_source = item[0]
        px = item[1]
        py = item[2]
        pz = item[3] if len(item) >= 4 else 100.0

        if intervals is not None:
            t_kf = remap_timestamp(t_source, intervals)
        else:
            t_kf = max(0.0, t_source - clip_start)

        raw_kfs.append({
            "time": round(t_kf, 3),
            "pos_x": px,
            "pos_y": py,
            "zoom": pz,
        })

    raw_kfs.sort(key=lambda k: k["time"])
    deduped_raw_kfs: List[dict] = []
    for kf in raw_kfs:
        if deduped_raw_kfs and abs(deduped_raw_kfs[-1]["time"] - kf["time"]) < 0.005:
            deduped_raw_kfs[-1] = kf
        else:
            deduped_raw_kfs.append(kf)
    raw_kfs = deduped_raw_kfs

    # Ensure keyframe exists at time 0.0
    if not raw_kfs or raw_kfs[0]["time"] > 0.0:
        first_px = raw_kfs[0]["pos_x"] if raw_kfs else 50.0
        first_py = raw_kfs[0]["pos_y"] if raw_kfs else 50.0
        first_pz = raw_kfs[0]["zoom"] if raw_kfs else 100.0
        raw_kfs.insert(0, {"time": 0.0, "pos_x": first_px, "pos_y": first_py, "zoom": first_pz})

    if intervals is not None:
        total_dur = sum(e - s for s, e in intervals)
    else:
        total_dur = max(0.0, clip_end - clip_start)

    # Simplify collinear/stationary keyframes
    optimized_kfs: List[dict] = [raw_kfs[0]]
    for i in range(1, len(raw_kfs) - 1):
        prev_kf = optimized_kfs[-1]
        curr_kf = raw_kfs[i]
        next_kf = raw_kfs[i + 1]

        is_stationary = (
            abs(curr_kf["pos_x"] - prev_kf["pos_x"]) < 0.05
            and abs(curr_kf["pos_y"] - prev_kf["pos_y"]) < 0.05
            and abs(curr_kf["zoom"] - prev_kf["zoom"]) < 0.05
            and abs(next_kf["pos_x"] - curr_kf["pos_x"]) < 0.05
            and abs(next_kf["pos_y"] - curr_kf["pos_y"]) < 0.05
            and abs(next_kf["zoom"] - curr_kf["zoom"]) < 0.05
        )
        if not is_stationary:
            optimized_kfs.append(curr_kf)

    if len(raw_kfs) > 1:
        optimized_kfs.append(raw_kfs[-1])

    if optimized_kfs[-1]["time"] < total_dur:
        last = optimized_kfs[-1]
        optimized_kfs.append({
            "time": round(total_dur, 3),
            "pos_x": last["pos_x"],
            "pos_y": last["pos_y"],
            "zoom": last["zoom"],
        })

    return optimized_kfs


# --------------------------------------------------------------------------- #
# Main Entry Point
# --------------------------------------------------------------------------- #
def generate_face_tracking_keyframes(
    source_mp4: Path | str,
    start: float,
    end: float,
    intervals: Optional[List[Tuple[float, float]]] = None,
    cancel_event=None,
) -> List[dict]:
    """Analyze video frames across [start, end], track faces/groups, and produce smooth 1:1 keyframes.

    Args:
        source_mp4: Path to source video.
        start: Start timestamp in seconds.
        end: End timestamp in seconds.
        intervals: Optional kept intervals if Remove Empty Air is active.

    Returns:
        List of ReframeKeyframe-compatible dicts: {"time", "pos_x", "pos_y", "zoom"}.
    """
    source_str = str(source_mp4)
    cap = cv2.VideoCapture(source_str)
    if not cap.isOpened():
        logger.warning("Could not open %s for face tracking; using center crop.", source_mp4)
        return [{"time": 0.0, "pos_x": 50.0, "pos_y": 50.0, "zoom": 100.0}]

    try:
        video_w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        video_h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        if video_w <= 0 or video_h <= 0:
            return [{"time": 0.0, "pos_x": 50.0, "pos_y": 50.0, "zoom": 100.0}]

        scale = min(1.0, float(DETECTION_MAX_DIM) / max(video_w, video_h))
        det_w = max(32, int(video_w * scale))
        det_h = max(32, int(video_h * scale))

        detector = create_detector(det_w, det_h)

        step_sec = 1.0 / TARGET_FPS
        num_steps = max(1, int(math.ceil((end - start) / step_sec)))
        sample_times = [min(end, start + i * step_sec) for i in range(num_steps + 1)]
        sample_times = sorted(list(set(sample_times)))

        raw_samples: List[Tuple[float, Optional[Tuple[float, float, float]]]] = []
        tracker = MultiFaceTracker(video_w, video_h)

        for t in sample_times:
            if cancel_event is not None and cancel_event.is_set():
                raise RuntimeError("Face tracking cancelled by user.")
            if intervals is not None and not any(s <= t <= e for s, e in intervals):
                continue

            cap.set(cv2.CAP_PROP_POS_MSEC, t * 1000.0)
            ret, frame = cap.read()
            if not ret or frame is None:
                raw_samples.append((t, None))
                continue

            faces = detect_faces(frame, detector, scale=scale)
            tracker.update(faces, t)
            framed_faces = tracker.select_framed_faces()

            if framed_faces:
                pos_x, pos_y, zoom = calculate_group_crop(framed_faces, video_w, video_h)
                raw_samples.append((t, (pos_x, pos_y, zoom)))
            else:
                raw_samples.append((t, None))

        clip_duration = max(0.1, end - start)
        smoothed = smooth_positions(raw_samples, clip_duration)
        keyframes = build_keyframes(smoothed, start, end, intervals=intervals)
        return keyframes

    finally:
        cap.release()
