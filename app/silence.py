"""Silence / Empty-Air Removal — fully LOCAL.

This module provides post-selection timing optimization for already-selected clips.
It analyzes Whisper word timestamps within the clip boundaries and tightens
unnecessary long dead air (e.g. >= 1.6s) while preserving natural conversational
cadence, breathing, and reaction timing.

Key guarantees:
1. Every spoken word is 100% preserved (never cuts through speech).
2. Natural pauses (< 1.6s) are preserved untouched.
3. Long gaps keep 0.5s of natural pause buffer.
4. Captions are remapped to match the compressed timeline with frame accuracy.
5. If anything fails or no qualifying silence exists, falls back to the original clip.
"""

from __future__ import annotations

import logging
from typing import List, Tuple

logger = logging.getLogger(__name__)

# --------------------------------------------------------------------------- #
# Centralized Configuration & Thresholds
# --------------------------------------------------------------------------- #
# Minimum silence gap (seconds) between words before we consider tightening it.
# Shorter pauses (breathing, thinking, comedic beats, speaker turns) are preserved.
MIN_GAP_TO_TIGHTEN: float = 1.6

# How much pause (seconds) to preserve when a long silence is tightened.
# Split evenly: PRESERVED_PAUSE / 2 after previous word, PRESERVED_PAUSE / 2 before next word.
PRESERVED_PAUSE: float = 0.5

# Dead air threshold at the start of a clip.
MAX_LEADING_SILENCE: float = 1.2
LEADING_BUFFER: float = 0.35  # seconds kept before first word

# Dead air threshold at the end of a clip.
MAX_TRAILING_SILENCE: float = 1.2
TRAILING_BUFFER: float = 0.45  # seconds kept after last word

# Absolute minimum duration for a processed clip (prevents over-trimming).
MIN_CLIP_DURATION: float = 5.0


# --------------------------------------------------------------------------- #
# Core Detection & Timeline Computation
# --------------------------------------------------------------------------- #
def detect_kept_intervals(
    clip_start: float,
    clip_end: float,
    words: List[dict],
    min_gap: float = MIN_GAP_TO_TIGHTEN,
    preserved_pause: float = PRESERVED_PAUSE,
    max_leading: float = MAX_LEADING_SILENCE,
    leading_buffer: float = LEADING_BUFFER,
    max_trailing: float = MAX_TRAILING_SILENCE,
    trailing_buffer: float = TRAILING_BUFFER,
) -> List[Tuple[float, float]]:
    """Analyze speech in [clip_start, clip_end] and return the kept (start, end) intervals.

    Returns a list of non-overlapping time tuples [(s0, e0), (s1, e1), ...] in
    source-video timeline coordinates.
    If no speech is detected, or no qualifying silence exists, returns [(clip_start, clip_end)].
    """
    total_len = clip_end - clip_start
    if total_len <= MIN_CLIP_DURATION:
        return [(round(clip_start, 3), round(clip_end, 3))]

    # Filter and sort words strictly overlapping this clip window
    valid_words = []
    for w in (words or []):
        try:
            ws = float(w["start"])
            we = float(w["end"])
            if we > clip_start and ws < clip_end and we > ws:
                valid_words.append({"start": ws, "end": we, "word": w.get("word", "")})
        except (KeyError, ValueError, TypeError):
            continue

    if not valid_words:
        # No word timestamps in this clip; preserve original window untouched
        return [(round(clip_start, 3), round(clip_end, 3))]

    valid_words.sort(key=lambda x: x["start"])

    # 1) Evaluate leading dead air
    first_w = valid_words[0]
    lead_gap = first_w["start"] - clip_start
    if lead_gap > max_leading:
        eff_start = max(clip_start, first_w["start"] - leading_buffer)
    else:
        eff_start = clip_start

    # 2) Evaluate trailing dead air
    last_w = valid_words[-1]
    trail_gap = clip_end - last_w["end"]
    if trail_gap > max_trailing:
        eff_end = min(clip_end, last_w["end"] + trailing_buffer)
    else:
        eff_end = clip_end

    if eff_end <= eff_start:
        return [(round(clip_start, 3), round(clip_end, 3))]

    # 3) Find internal silence cuts between words
    half_pause = preserved_pause / 2.0
    cuts: List[Tuple[float, float]] = []

    # Merge overlapping/adjacent words into continuous speech spans
    speech_spans: List[Tuple[float, float]] = []
    curr_s = max(eff_start, valid_words[0]["start"])
    curr_e = max(curr_s, valid_words[0]["end"])

    for w in valid_words[1:]:
        ws = max(eff_start, min(eff_end, w["start"]))
        we = max(eff_start, min(eff_end, w["end"]))
        if ws <= curr_e:
            curr_e = max(curr_e, we)
        else:
            speech_spans.append((curr_s, curr_e))
            curr_s = ws
            curr_e = we
    speech_spans.append((curr_s, curr_e))

    for i in range(len(speech_spans) - 1):
        span_end = speech_spans[i][1]
        next_span_start = speech_spans[i + 1][0]
        gap = next_span_start - span_end

        if gap >= min_gap:
            # We have a qualifying long silence. Keep `preserved_pause` seconds total.
            cut_start = span_end + half_pause
            cut_end = next_span_start - half_pause
            if cut_end > cut_start + 0.1:  # Only cut if there's meaningful silence to remove
                cuts.append((round(cut_start, 3), round(cut_end, 3)))

    # 4) Construct the kept intervals
    intervals: List[Tuple[float, float]] = []
    cursor = eff_start

    for cut_start, cut_end in cuts:
        if cut_start > cursor + 0.1:
            intervals.append((round(cursor, 3), round(cut_start, 3)))
        cursor = cut_end

    if eff_end > cursor + 0.1:
        intervals.append((round(cursor, 3), round(eff_end, 3)))

    # Fallback guard: if intervals are empty or duration < MIN_CLIP_DURATION, keep original
    total_kept = sum(e - s for s, e in intervals)
    if not intervals or total_kept < MIN_CLIP_DURATION:
        logger.info("Silence removal would reduce clip below %.1fs; keeping original.", MIN_CLIP_DURATION)
        return [(round(clip_start, 3), round(clip_end, 3))]

    return intervals


# --------------------------------------------------------------------------- #
# Timestamp & Caption Remapping
# --------------------------------------------------------------------------- #
def remap_timestamp(t: float, intervals: List[Tuple[float, float]]) -> float:
    """Remap a timestamp from source timeline to the compressed timeline (relative to 0.0)."""
    t_new = 0.0
    for s, e in intervals:
        if t < s:
            return t_new
        elif t <= e:
            return t_new + (t - s)
        else:
            t_new += (e - s)
    return t_new


def remap_words(words: List[dict], intervals: List[Tuple[float, float]]) -> List[dict]:
    """Remap word timestamps so captions stay 100% synchronized with the compressed video.

    Returns new word dicts with start/end relative to the beginning of the compressed clip (0.0).
    """
    remapped: List[dict] = []
    for w in words:
        try:
            orig_s = float(w["start"])
            orig_e = float(w["end"])
        except (KeyError, ValueError, TypeError):
            continue

        # Check if the word falls within any kept interval
        in_interval = any(orig_s < e and orig_e > s for s, e in intervals)
        if not in_interval:
            continue

        new_s = remap_timestamp(orig_s, intervals)
        new_e = remap_timestamp(orig_e, intervals)
        dur = orig_e - orig_s

        # Ensure word duration is preserved accurately
        if new_e <= new_s:
            new_e = new_s + max(0.05, dur)

        new_w = dict(w)
        new_w["start"] = round(new_s, 3)
        new_w["end"] = round(new_e, 3)
        remapped.append(new_w)

    return remapped


def is_silence_removal_active(intervals: List[Tuple[float, float]], clip_start: float, clip_end: float) -> bool:
    """Return True if kept intervals actually removed any silence from the clip."""
    if not intervals:
        return False
    if len(intervals) > 1:
        return True
    s, e = intervals[0]
    return abs(s - clip_start) > 0.05 or abs(e - clip_end) > 0.05
