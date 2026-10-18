"""Clip selection — fully LOCAL.

This module provides two tiers of clip selection:

Phase 1 (Primary Heuristic):
    A transparent local heuristic scoring engine that analyzes:
    - Opening quality (rewards strong hooks, penalizes slow filler intros)
    - Payoff & completeness (rewards conclusions/punchlines/realizations, penalizes hanging thoughts)
    - Pacing & flow (word cadence, speech density, absence of dead air)
    - Substantive content & narrative structure (concrete details, storytelling markers,
      without over-weighting raw keywords)
    - Speech / transcription confidence (subtle tie-breaker if available)
    - Candidate duration fit to ideal short-form lengths (30-60s)

Phase 2 (Optional Local AI Reranking):
    When enabled via USE_OLLAMA=1 and an Ollama instance is detected on localhost,
    the top pre-ranked candidate shortlist is evaluated with a compact 4-dimension
    schema (standalone, interest, completeness, overall).
    - Uses a bounded total time budget (never stalls processing)
    - Blends heuristic + AI scores safely (heuristic remains authoritative)
    - AI never controls timestamps
    - Automatically skips when candidate count is small (<8)
    - Fully safe: any failure instantly falls back to the Phase 1 heuristic.
"""

from __future__ import annotations

import json
import logging
import math
import os
import re
import time
from typing import Callable, List, Optional
from urllib.parse import urlsplit

logger = logging.getLogger(__name__)

# Candidate window length bounds (seconds). Manual duration presets still use
# their requested target; Auto mode treats this whole range as valid and lets
# content completeness decide the best ending.
MIN_CLIP_LEN = 25.0
MAX_CLIP_LEN = 55.0
IDEAL_CLIP_LEN = 40.0
AUTO_SWEET_MIN = 30.0
AUTO_SWEET_MAX = 50.0
AUTO_CANDIDATES_PER_ANCHOR = 5
_SENT_END = (".", "!", "?", "।", "…")  # incl. Urdu/Hindi danda

# Topic boundary detection parameters
TOPIC_PAUSE_GAP = 0.5       # seconds of silence that reads as a natural beat
TOPIC_OVERLAP_MAX = 0.25    # word-overlap with the next line below this -> topic shifted
TOPIC_SLACK_FRAC = 0.25     # how much further past target_len to keep looking

# Traditional hook words — balanced so they contribute modest signal without dominating.
STRONG_WORDS = {
    "how", "why", "what", "when", "who", "where", "best", "worst", "never",
    "always", "secret", "mistake", "biggest", "important", "actually", "truth",
    "realize", "realise", "amazing", "incredible", "stop", "avoid", "must",
    "everyone", "nobody", "money", "free", "new", "first", "tip", "tips",
}

# ── Linguistic patterns for opening & payoff evaluation ───────────────────────

# Opening filler patterns that delay the point
_FILLER_OPENING_PATTERNS = re.compile(
    r"^(?:"
    r"um\b|uh\b|er\b|ah\b|"
    r"so\s+basically\b|basically\b|"
    r"like\s+i\s+(?:was\s+)?saying\b|as\s+i\s+(?:was\s+)?saying\b|like\s+i\s+said\b|"
    r"you\s+know\b|well\s+anyway\b|anyway\b|"
    r"in\s+this\s+video\b|today\s+we(?:'re|\s+are)\s+going\s+to\b|"
    r"welcome\s+back(?:\s+to)?\b|what's\s+up\s+guys\b|hey\s+guys\b|"
    r"before\s+we\s+start\b"
    r")",
    re.IGNORECASE,
)

# Strong hook opening patterns that immediately engage
_HOOK_OPENING_PATTERNS = re.compile(
    r"^(?:"
    r"why\b|how\b|what\s+if\b|have\s+you\s+ever\b|did\s+you\s+know\b|can\s+you\s+believe\b|"
    r"the\s+(?:biggest|real|secret|only|truth|worst|number\s+one)\b|"
    r"nobody\s+(?:knows|talks\s+about|realizes)\b|"
    r"stop\s+(?:doing|wasting|making)\b|"
    r"here(?:'s|\s+is)\s+(?:why|the|how|what)\b|"
    r"i\s+(?:realized|discovered|almost|never|decided|found\s+out)\b|"
    r"what\s+happens\s+when\b|this\s+is\s+why\b"
    r")",
    re.IGNORECASE,
)

# Hanging closing words indicating an incomplete sentence or dangling thought
_HANGING_TAIL_WORDS = {
    "and", "but", "or", "so", "because", "if", "when", "though", "although",
    "like", "that", "which", "where", "while", "then", "with", "to", "as",
    "than", "whether", "since", "until", "unless",
}

# Payoff and resolution phrases near the ending
_PAYOFF_PATTERNS = re.compile(
    r"\b(?:"
    r"turns\s+out|"
    r"that(?:'s|\s+is)\s+why|"
    r"and\s+that(?:'s|\s+is)\s+how|"
    r"the\s+point\s+is|"
    r"the\s+lesson\s+(?:is|was)|"
    r"in\s+the\s+end|"
    r"at\s+the\s+end\s+of\s+the\s+day|"
    r"it\s+actually\s+worked|"
    r"the\s+result\s+(?:is|was)|"
    r"and\s+finally|"
    r"which\s+means\s+that|"
    r"that\s+is\s+the\s+secret|"
    r"that\s+is\s+how|"
    r"we\s+finally|"
    r"and\s+that\s+changed\s+everything"
    r")\b",
    re.IGNORECASE,
)

# Narrative progression and concrete detail markers
_NARRATIVE_PATTERNS = re.compile(
    r"\b(?:"
    r"i\s+(?:realized|noticed|decided|discovered|learned|failed|found|felt)|"
    r"we\s+(?:discovered|decided|found|noticed|realized)|"
    r"for\s+the\s+first\s+time|"
    r"what\s+happened\s+was|"
    r"the\s+problem\s+was|"
    r"suddenly|unexpectedly|"
    r"years\s+ago|months\s+ago"
    r")\b",
    re.IGNORECASE,
)

_CONCRETE_NUMBERS_PATTERN = re.compile(
    r"(?:\$\d+(?:,\d+)*(?:\.\d+)?|\b\d+(?:\.\d+)?%|\b\d+\s*(?:dollars|years|months|days|hours|minutes|seconds|miles|km|percent|people|times)\b)",
    re.IGNORECASE,
)

# ── Ollama configuration ──────────────────────────────────────────────────────
_OLLAMA_URL = os.environ.get("OLLAMA_URL", "http://localhost:11434")
_OLLAMA_MODEL = os.environ.get("OLLAMA_MODEL", "llama3")
OLLAMA_MIN_CANDIDATES = 8         # Skip LLM if fewer candidates exist
OLLAMA_MAX_SHORTLIST = 20          # Evaluate at most top 20 candidates
OLLAMA_TOTAL_TIMEOUT = 35.0        # Max total wall-clock budget for LLM pass
OLLAMA_PER_REQUEST_TIMEOUT = 6.0   # Max per-candidate timeout


# --------------------------------------------------------------------------- #
# Public API
# --------------------------------------------------------------------------- #
def _sanitize_segments(segments: list) -> list[dict]:
    clean = []
    for s in (segments or []):
        if not s:
            continue
        if isinstance(s, dict):
            try:
                st = float(s.get("start") or 0.0)
            except (ValueError, TypeError):
                st = 0.0
            try:
                en = float(s.get("end") or st + 1.0)
            except (ValueError, TypeError):
                en = st + 1.0
            txt = str(s.get("text") or "").strip()
            item = {
                "id": s.get("id", len(clean)),
                "start": max(0.0, st),
                "end": max(st, en),
                "text": txt,
            }
            if "avg_logprob" in s:
                item["avg_logprob"] = s["avg_logprob"]
            if "words" in s and isinstance(s["words"], list):
                item["words"] = s["words"]
            clean.append(item)
        elif isinstance(s, (list, tuple)):
            if len(s) >= 4 and isinstance(s[1], (int, float)):
                st = float(s[1])
                en = float(s[2]) if isinstance(s[2], (int, float)) else st + 1.0
                txt = str(s[3] or "").strip()
            elif len(s) >= 3 and isinstance(s[0], (int, float)):
                st = float(s[0])
                en = float(s[1]) if isinstance(s[1], (int, float)) else st + 1.0
                txt = str(s[2] or "").strip()
            elif len(s) >= 2 and isinstance(s[1], (int, float)):
                txt = str(s[0] or "").strip()
                st = float(s[1])
                en = st + 1.0
            else:
                txt = str(s[0] or "").strip() if len(s) > 0 else ""
                st = 0.0
                en = 1.0
            clean.append({"id": len(clean), "start": max(0.0, st), "end": max(st, en), "text": txt})
    return clean


def select_clips(
    transcript: dict,
    num_clips: int,
    clip_length: float | None = None,
    progress_cb: Optional[Callable[[float, str], None]] = None,
    source_duration: float | None = None,
) -> List[dict]:
    """Return up to `num_clips` non-overlapping {start, end, title} windows.

    Combines the Phase 1 heuristic scoring with optional Phase 2 local Ollama
    reranking when available.
    """
    if not isinstance(transcript, dict):
        return []
    segments = _sanitize_segments(transcript.get("segments") or [])
    last_seg_end = max((s["end"] for s in segments), default=0.0)
    try:
        duration = float(transcript.get("duration") or last_seg_end)
    except (ValueError, TypeError):
        duration = last_seg_end
    if not math.isfinite(duration) or duration <= 0:
        duration = last_seg_end
    if source_duration is not None:
        try:
            video_duration = float(source_duration)
        except (ValueError, TypeError):
            video_duration = 0.0
        if math.isfinite(video_duration) and video_duration > 0:
            duration = min(duration, video_duration) if duration > 0 else video_duration
    if duration <= 0:
        return []

    # Audio timestamps and edited transcripts can extend beyond the actual
    # video. Never select a window that the renderer cannot fully produce.
    bounded_segments = []
    for segment in segments:
        start, end = segment["start"], segment["end"]
        if not math.isfinite(start) or not math.isfinite(end) or start >= duration:
            continue
        end = min(end, duration)
        if end > start:
            bounded_segments.append({**segment, "end": end})
    segments = bounded_segments
    bounded_transcript = {**transcript, "duration": duration}
    if not segments:
        return _fallback_even_split(bounded_transcript, num_clips, clip_length)

    if clip_length and clip_length > 0:
        target_len = float(clip_length)
        candidates = _build_candidate_windows(
            segments, target_len=target_len, user_fixed_len=True
        )
    else:
        target_len = IDEAL_CLIP_LEN
        candidates = _build_candidate_windows(
            segments, target_len=target_len, user_fixed_len=False
        )

    if not candidates:
        return _fallback_even_split(bounded_transcript, num_clips, clip_length)

    if progress_cb:
        progress_cb(0.4, f"Scored {len(candidates)} candidate moments...")

    # Phase 2: Optional local Ollama scoring
    # Only triggered if explicitly enabled, local server is up, and enough candidates exist
    if os.environ.get("USE_OLLAMA") == "1":
        if len(candidates) < OLLAMA_MIN_CANDIDATES:
            logger.info(
                "Ollama enabled but candidate count (%d) < %d; using heuristic.",
                len(candidates),
                OLLAMA_MIN_CANDIDATES,
            )
        elif _ollama_available():
            try:
                if progress_cb:
                    progress_cb(0.6, "AI ranking candidate moments...")
                return _select_with_ollama(candidates, num_clips, progress_cb=progress_cb)
            except Exception as exc:  # noqa: BLE001 - always degrade gracefully
                logger.warning("Ollama reranking failed (%s); falling back to heuristic.", exc)

    return _select_heuristic(candidates, num_clips)


# --------------------------------------------------------------------------- #
# Heuristic selection
# --------------------------------------------------------------------------- #
def _build_candidate_windows(
    segments: List[dict],
    target_len: float = IDEAL_CLIP_LEN,
    max_len: float | None = None,
    exact_len: float | None = None,
    user_fixed_len: bool = False,
) -> List[dict]:
    """Scan transcript using multi-anchor starting points, snapping cleanly to sentence ends.

    Rather than rigid contiguous brick-tiling (which skips intermediate hooks) or blunt
    fixed-second cuts (which sever speech mid-word), this generator evaluates every
    plausible starting point in the speech, accumulates segments toward ``target_len``,
    and snaps to the best sentence completion or topic pause within tolerance bounds.

    - Auto mode (user_fixed_len=False): evaluates several natural endings in
      the 25-55s short-form range for every promising start. Duration is only a
      soft preference; hook, pacing, payoff, and thought completeness decide.
    - Fixed length mode (user_fixed_len=True or exact_len): target_len=clip_length, range=[0.78*T, 1.22*T].
      Snaps to the closest natural sentence/thought boundary within ±22% of target.
    """
    n = len(segments)
    if n == 0:
        return []

    # Support legacy exact_len parameter if passed
    if exact_len is not None and exact_len > 0:
        target_len = float(exact_len)
        user_fixed_len = True

    if user_fixed_len:
        min_len = max(8.0, target_len * 0.78)
        upper_limit = target_len * 1.22
    else:
        min_len = MIN_CLIP_LEN
        upper_limit = MAX_CLIP_LEN

    if max_len is not None:
        upper_limit = max(upper_limit, max_len)

    # 1. Identify valid starting anchors across the video
    anchors: List[int] = []
    last_anchor = -999
    for i in range(n):
        seg = segments[i]
        seg_text = (seg.get("text") or "").strip()
        if not seg_text:
            continue

        is_anchor = False
        if i == 0:
            is_anchor = True
        else:
            prev_seg = segments[i - 1]
            prev_text = (prev_seg.get("text") or "").strip()
            pause = float(seg.get("start", 0)) - float(prev_seg.get("end", 0))
            if prev_text.endswith(_SENT_END) or pause >= 0.4:
                is_anchor = True
            elif seg_text[0].isupper() and not any(
                seg_text.lower().startswith(c + " ")
                for c in ("and", "but", "because", "so", "which", "while", "then", "or", "though")
            ):
                is_anchor = True
            elif i - last_anchor >= 3:
                # Stagger guard: ensure dense coverage across the video
                is_anchor = True

        if is_anchor:
            anchors.append(i)
            last_anchor = i

    if not anchors:
        anchors = list(range(0, n, 2)) if n > 1 else [0]

    # 2. Build candidate windows from each anchor
    candidates: List[dict] = []
    seen_ranges: set[tuple[float, float]] = set()

    for i in anchors:
        start = float(segments[i]["start"])
        text_parts: List[str] = []
        best_j: int | None = None
        best_diff = 9999.0
        fallback_j: int | None = None
        fallback_diff = 9999.0
        natural_ends: List[tuple[int, float]] = []

        for j in range(i, n):
            seg = segments[j]
            end = float(seg["end"])
            seg_text = (seg.get("text") or "").strip()
            text_parts.append(seg_text)
            length = end - start

            if length < min_len:
                continue

            # Auto mode is a true bounded range. Do not admit a long Whisper
            # segment that jumps beyond the short-form ceiling.
            if not user_fixed_len and length > upper_limit:
                break

            diff_to_target = abs(length - target_len)
            ends_sentence = seg_text.endswith(_SENT_END)
            is_pause = False
            if j + 1 < n:
                next_start = float(segments[j + 1]["start"])
                if next_start - end >= TOPIC_PAUSE_GAP:
                    is_pause = True
            else:
                is_pause = True

            topic_boundary = _is_topic_boundary(segments, j + 1, text_parts)
            is_natural_end = ends_sentence or is_pause or topic_boundary

            # Check if this segment end forms a complete thought or topic boundary
            if is_natural_end:
                if user_fixed_len:
                    if diff_to_target < best_diff:
                        best_diff = diff_to_target
                        best_j = j + 1
                else:
                    # Prefer a real pause/topic change and avoid stopping just
                    # before a connective that clearly continues the thought.
                    boundary_bonus = 0.0
                    if j + 1 >= n:
                        boundary_bonus += 0.18
                    else:
                        gap = float(segments[j + 1]["start"]) - end
                        if gap >= 1.2:
                            boundary_bonus += 0.24
                        elif gap >= TOPIC_PAUSE_GAP:
                            boundary_bonus += 0.14
                        if topic_boundary:
                            boundary_bonus += 0.08
                        next_text = (segments[j + 1].get("text") or "").strip().lower()
                        if re.match(
                            r"^(?:and|but|because|so|then|which|that|therefore|however|or|though)\b",
                            next_text,
                        ):
                            boundary_bonus -= 0.35
                    natural_ends.append((j + 1, boundary_bonus))

            if diff_to_target < fallback_diff:
                fallback_diff = diff_to_target
                fallback_j = j + 1

            # Stop scanning from this anchor once we exceed upper_limit
            if length >= upper_limit:
                break

        if user_fixed_len:
            chosen_ends = [(best_j or fallback_j, 0.0)]
        elif natural_ends:
            chosen_ends = natural_ends
        else:
            chosen_ends = [(fallback_j, 0.0)]

        local_candidates: List[dict] = []
        for chosen_end_j, boundary_bonus in chosen_ends:
            if chosen_end_j is None or chosen_end_j <= i:
                continue
            cand_segs = segments[i:chosen_end_j]
            cand_start = round(float(cand_segs[0]["start"]), 2)
            cand_end = round(float(cand_segs[-1]["end"]), 2)
            cand_len = cand_end - cand_start

            if cand_len >= min_len * 0.85:
                range_key = (cand_start, cand_end)
                if range_key not in seen_ranges:
                    cand_text = " ".join((s.get("text") or "").strip() for s in cand_segs).strip()
                    if cand_text:
                        score = _score_window(
                            cand_text,
                            cand_len,
                            target_len,
                            cand_segs,
                            adaptive_duration=not user_fixed_len,
                        ) + boundary_bonus
                        local_candidates.append({
                            "start": cand_start,
                            "end": cand_end,
                            "text": cand_text,
                            "window_segs": cand_segs,
                            "score": score,
                        })

        # Retain several meaningfully different endings per start in Auto mode
        # while keeping candidate growth bounded on very long recordings.
        if not user_fixed_len:
            local_candidates.sort(key=lambda c: c["score"], reverse=True)
            local_candidates = local_candidates[:AUTO_CANDIDATES_PER_ANCHOR]
        for candidate in local_candidates:
            range_key = (candidate["start"], candidate["end"])
            if range_key not in seen_ranges:
                seen_ranges.add(range_key)
                candidates.append(candidate)

    return candidates


def _is_topic_boundary(segments: List[dict], j: int, window_text_parts: List[str]) -> bool:
    """Local heuristic: is the cut at ``segments[j]`` a genuine story boundary?

    True at the end of the transcript, across a real pause, or when the next
    line's vocabulary is mostly NEW relative to everything said in the window
    so far (the topic likely moved on) — as opposed to a sentence that's
    merely grammatically complete but still mid-thought (e.g. "...and that's
    when I realized"). Comparing against the WHOLE window (not just the one
    adjacent line) avoids false positives from short lines that just happen
    to phrase the same idea differently.
    """
    if j >= len(segments):
        return True
    prev_end = float(segments[j - 1]["end"])
    nxt = segments[j]
    if float(nxt["start"]) - prev_end >= TOPIC_PAUSE_GAP:
        return True
    window_words = set(re.findall(r"\b\w+\b", " ".join(window_text_parts).lower()))
    next_words = set(re.findall(r"\b\w+\b", (nxt["text"] or "").lower()))
    if not window_words or not next_words:
        return False
    # What fraction of the NEXT line's words are already-familiar (heard in
    # this window)? Low -> mostly new vocabulary -> topic likely shifted.
    familiar = len(window_words & next_words) / max(1, len(next_words))
    return familiar < TOPIC_OVERLAP_MAX


def _score_window(
    text: str,
    length: float,
    target_len: float | List[dict] | None = IDEAL_CLIP_LEN,
    window_segs: Optional[List[dict]] = None,
    adaptive_duration: bool = False,
) -> float:
    """Score a candidate window using comprehensive local signals.

    Signals evaluated:
    1. Base Word Density & Cadence
    2. Opening / First-Seconds Quality (hook vs. filler vs. mid-sentence continuation)
    3. Payoff / Completeness (conclusion vs. hanging thought)
    4. Pacing & Speech Flow (smooth rhythm, penalizing dead air)
    5. Substantive Content (story markers, concrete details, non-spammed keywords)
    6. Duration Fit to requested target length
    7. Whisper Confidence (supporting signal only)
    """
    if isinstance(target_len, list):
        window_segs = target_len
        target_len = IDEAL_CLIP_LEN
    elif target_len is None:
        target_len = IDEAL_CLIP_LEN

    words = re.findall(r"\b[\w'-]+\b", text.lower())
    word_count = len(words)
    if word_count == 0:
        return 0.0

    length = max(length, 1.0)
    wps = word_count / length

    # 1) Base Word Density: spoken-heavy windows are more engaging than silence.
    density_score = min(wps / 3.0, 1.0)

    # 2) Opening Quality: Reward immediate hook; penalize filler introductions and mid-sentence conjunctions.
    opening_score = 0.0
    first_words = words[:14]
    opening_snippet = " ".join(first_words)
    first_word = words[0] if words else ""

    if first_word in ("and", "but", "because", "so", "which", "while", "then", "or", "though"):
        opening_score -= 0.35  # Starts mid-sentence on a conjunction
    elif _FILLER_OPENING_PATTERNS.search(opening_snippet):
        opening_score -= 0.40  # Sluggish filler opening
    else:
        if _HOOK_OPENING_PATTERNS.search(opening_snippet):
            opening_score += 0.45  # Direct curiosity hook
        if "?" in opening_snippet:
            opening_score += 0.35  # Opening question hook

    # 3) Payoff & Completeness: Reward decisive conclusions; penalize hanging sentences.
    payoff_score = 0.0
    clean_text = text.rstrip()

    # Check for trailing punctuation
    has_terminal_punct = clean_text.endswith((".", "!", "?", "।"))
    has_trailing_ellipsis = clean_text.endswith(("...", "…", "--", ","))

    last_words = words[-8:] if len(words) >= 8 else words
    last_word = last_words[-1] if last_words else ""

    if has_trailing_ellipsis or last_word in _HANGING_TAIL_WORDS:
        payoff_score -= 0.55  # Cuts off mid-thought or on conjunction
    elif not has_terminal_punct:
        payoff_score -= 0.30  # Incomplete ending
    else:
        payoff_score += 0.35  # Clean sentence completion

    # Extra bonus for resolution phrases in the final ~20 words
    closing_snippet = " ".join(words[-20:]) if len(words) >= 20 else text
    if _PAYOFF_PATTERNS.search(closing_snippet):
        payoff_score += 0.40

    # 4) Pacing & Speech Flow: Reward natural conversational rhythm; penalize dead air.
    pacing_score = 1.0
    if 2.0 <= wps <= 3.8:
        pacing_score = 1.0  # Optimal energetic pace
    elif wps < 1.3:
        pacing_score = 0.4  # Sluggish or draggy
    elif wps > 4.5:
        pacing_score = 0.7  # Frantic runaway monologue

    # Check for internal dead air gaps between segments if available
    if window_segs and len(window_segs) > 1:
        dead_air_seconds = 0.0
        for k in range(len(window_segs) - 1):
            gap = float(window_segs[k + 1]["start"]) - float(window_segs[k]["end"])
            if gap > 1.8:
                dead_air_seconds += gap
        if dead_air_seconds > 3.0:
            pacing_score = max(0.2, pacing_score - 0.40)
        elif dead_air_seconds > 1.8:
            pacing_score = max(0.3, pacing_score - 0.20)

    # 5) Substantive Content & Narrative Structure
    content_score = 0.0

    # Lexical diversity: substantive storytelling has varied vocabulary
    unique_ratio = len(set(words)) / word_count
    if unique_ratio > 0.65:
        content_score += 0.25
    elif unique_ratio < 0.40:
        content_score -= 0.25  # Repetitive stuttering or filler loops

    # Narrative realization markers ("I realized", "we discovered", etc.)
    if _NARRATIVE_PATTERNS.search(text):
        content_score += 0.35

    # Concrete details (specific numbers, dollars, statistics)
    if _CONCRETE_NUMBERS_PATTERN.search(text):
        content_score += 0.25

    # Capped trigger-words score: prevent keyword stuffing from dominating
    strong_hits = sum(1 for w in words if w in STRONG_WORDS)
    content_score += min(strong_hits * 0.07, 0.35)

    # Question anywhere in the clip
    if "?" in text:
        content_score += 0.20

    # 6) Length Fit. Manual presets strongly favor the requested duration.
    # Auto mode uses a broad plateau so a complete 31s idea can beat an
    # incomplete 40s cut, and a 50s story can keep its payoff.
    if adaptive_duration:
        if AUTO_SWEET_MIN <= length <= AUTO_SWEET_MAX:
            length_fit = 1.0
        elif length < AUTO_SWEET_MIN:
            span = max(1.0, AUTO_SWEET_MIN - MIN_CLIP_LEN)
            length_fit = 0.72 + 0.28 * max(0.0, (length - MIN_CLIP_LEN) / span)
        else:
            span = max(1.0, MAX_CLIP_LEN - AUTO_SWEET_MAX)
            length_fit = 1.0 - 0.28 * min(1.0, (length - AUTO_SWEET_MAX) / span)
        length_weight = 0.25
    else:
        effective_target = max(10.0, float(target_len))
        length_fit = 1.0 - min(abs(length - effective_target) / effective_target, 1.0)
        length_weight = 0.8

    # 7) Transcription Confidence (supporting signal only)
    confidence_score = 0.0
    if window_segs:
        logprobs = [
            s["avg_logprob"]
            for s in window_segs
            if "avg_logprob" in s and isinstance(s["avg_logprob"], (int, float))
        ]
        if logprobs:
            avg_lp = sum(logprobs) / len(logprobs)
            # Map typical Whisper logprob range [-1.5, -0.2] to [0.0, 1.0]
            confidence_score = max(0.0, min(1.0, (avg_lp + 1.5) / 1.3))

    # Balanced total score combination
    final_score = (
        1.5 * density_score
        + 1.5 * (0.5 + opening_score)
        + 1.5 * (0.5 + payoff_score)
        + 1.0 * pacing_score
        + 1.2 * (0.5 + content_score)
        + length_weight * length_fit
        + 0.3 * confidence_score
    )

    return max(0.0, round(final_score, 3))


def _select_heuristic(candidates: List[dict], num_clips: int) -> List[dict]:
    """Pick the best non-overlapping windows, ensuring diversity."""
    ranked = sorted(candidates, key=lambda c: c["score"], reverse=True)
    chosen: List[dict] = []

    # Pass 1 — Highest scoring non-overlapping, non-duplicate windows
    for cand in ranked:
        if len(chosen) >= num_clips:
            break
        if any(_overlaps(cand, c) for c in chosen):
            continue
        if any(_is_near_duplicate(cand, c) for c in chosen):
            continue
        chosen.append(cand)

    # Pass 2 — Fill if still needed (relaxed near-duplicate check)
    if len(chosen) < num_clips:
        for cand in ranked:
            if len(chosen) >= num_clips:
                break
            if any(_overlaps(cand, c) for c in chosen):
                continue
            if cand not in chosen:
                chosen.append(cand)

    # Pass 3 — Fill in chronological order if still needed
    if len(chosen) < num_clips:
        for cand in sorted(candidates, key=lambda c: c["start"]):
            if len(chosen) >= num_clips:
                break
            if any(_overlaps(cand, c) for c in chosen):
                continue
            if cand not in chosen:
                chosen.append(cand)

    chosen.sort(key=lambda c: c["start"])
    return [
        {
            "start": c["start"],
            "end": c["end"],
            "title": _derive_title(c["text"]),
        }
        for c in chosen
    ]


def _overlaps(a: dict, b: dict) -> bool:
    """Return True if windows a and b share any timestamp interval."""
    return a["start"] < b["end"] and b["start"] < a["end"]


def _is_near_duplicate(a: dict, b: dict, threshold: float = 0.65) -> bool:
    """Check if two candidates share a majority of identical vocabulary."""
    words_a = set(re.findall(r"\b\w+\b", a.get("text", "").lower()))
    words_b = set(re.findall(r"\b\w+\b", b.get("text", "").lower()))
    if not words_a or not words_b:
        return False
    intersection = len(words_a & words_b)
    union = len(words_a | words_b)
    return (intersection / union) >= threshold if union else False


def _derive_title(text: str, max_words: int = 7) -> str:
    """Build a short, human-readable title from the window's leading words."""
    cleaned = re.sub(r"\s+", " ", text).strip()
    words = cleaned.split(" ")
    title = " ".join(words[:max_words]).strip(" ,.;:-")
    if not title:
        return "Clip"
    if title.islower() or title.isupper():
        title = title.capitalize()
    return title


def _fallback_even_split(
    transcript: dict, num_clips: int, clip_length: float | None = None
) -> List[dict]:
    """Last resort: split the duration into even windows (no segments available)."""
    duration = float(transcript.get("duration") or 0.0)
    if duration <= 0:
        return []

    if clip_length and clip_length > 0:
        # Honour the requested clip length; fit as many as asked for into the video.
        clip_len = float(clip_length)
        n = max(1, min(num_clips, int(duration // clip_len) or 1))
    else:
        n = max(1, min(num_clips, 10))
        clip_len = min(45.0, max(MIN_CLIP_LEN, min(MAX_CLIP_LEN, duration / n)))
    clips: List[dict] = []
    cursor = 0.0
    idx = 1
    while cursor < duration and len(clips) < n:
        end = min(cursor + clip_len, duration)
        if end - cursor < 3.0:  # skip a tiny tail
            break
        clips.append(
            {"start": round(cursor, 2), "end": round(end, 2), "title": f"Clip {idx}"}
        )
        cursor = end
        idx += 1
    return clips


# --------------------------------------------------------------------------- #
# Phase 2: Optional LOCAL Ollama Reranking (OFF by default; localhost only)
# --------------------------------------------------------------------------- #
def _local_ollama_url() -> Optional[str]:
    """Validate the optional endpoint without DNS; never send transcripts off-device."""
    try:
        raw_url = os.environ.get("OLLAMA_URL", _OLLAMA_URL)
        url = urlsplit(raw_url)
        if (url.scheme not in ("http", "https") or
                url.hostname not in ("localhost", "127.0.0.1", "::1") or
                url.username or url.password or url.query or url.fragment or
                url.path not in ("", "/")):
            return None
        host = "[::1]" if url.hostname == "::1" else "127.0.0.1"
        port = f":{url.port}" if url.port is not None else ""
        return f"{url.scheme}://{host}{port}"
    except ValueError:
        return None


def _ollama_available() -> bool:
    """Return True if a local Ollama server answers on localhost."""
    endpoint = _local_ollama_url()
    if endpoint is None:
        return False
    try:
        import requests

        resp = requests.get(f"{endpoint}/api/tags", timeout=1.5,
                            allow_redirects=False, proxies={"http": "", "https": ""})
        return resp.status_code == 200
    except Exception:  # noqa: BLE001
        return False


def _select_with_ollama(
    candidates: List[dict],
    num_clips: int,
    progress_cb: Optional[Callable[[float, str], None]] = None,
) -> List[dict]:
    """Rerank shortlist of candidates with a local Ollama model.

    Evaluates:
    1. Standalone quality (0-100)
    2. Entertainment / interest (0-100)
    3. Completeness / payoff (0-100)
    4. Overall short-form potential (0-100)

    Safety guards:
    - Bounded wall-clock budget (OLLAMA_TOTAL_TIMEOUT)
    - Shortlist capped at OLLAMA_MAX_SHORTLIST
    - Combines heuristic score (50%) + AI score (50%)
    - AI never modifies timestamps
    - Any failure gracefully falls back to Phase 1 heuristic.
    """
    import requests

    endpoint = _local_ollama_url()
    if endpoint is None:
        return _select_heuristic(candidates, num_clips)

    def _safe_float(val, default: float = 50.0) -> float:
        try:
            return float(val)
        except (ValueError, TypeError):
            return default

    # Pre-rank with the Phase 1 heuristic
    ranked_pre = sorted(candidates, key=lambda c: c["score"], reverse=True)
    shortlist_size = min(len(candidates), max(num_clips * 3, OLLAMA_MAX_SHORTLIST))
    shortlist = ranked_pre[:shortlist_size]

    # Calculate min/max heuristic scores for 0-100 normalization
    h_scores = [c["score"] for c in shortlist]
    min_h = min(h_scores) if h_scores else 0.0
    max_h = max(h_scores) if h_scores else 1.0
    h_range = max_h - min_h

    scored_candidates: List[dict] = []
    start_time = time.time()
    total_shortlist = len(shortlist)

    for idx, cand in enumerate(shortlist):
        # Enforce global wall-clock budget
        elapsed = time.time() - start_time
        if elapsed > OLLAMA_TOTAL_TIMEOUT:
            logger.info("Ollama budget (%.1fs) reached; finishing with current scores.", OLLAMA_TOTAL_TIMEOUT)
            # Use heuristic for the remaining un-evaluated items
            for rem in shortlist[idx:]:
                norm_h = ((rem["score"] - min_h) / h_range * 100.0) if h_range > 0.001 else 50.0
                scored_candidates.append({**rem, "final_score": norm_h})
            break

        if progress_cb:
            progress_cb(
                0.6 + (idx / total_shortlist) * 0.35,
                f"AI ranking moment {idx + 1} of {total_shortlist}...",
            )

        clean_snippet = cand["text"][:900].replace('"', "'")
        prompt = (
            "You are an expert short-form video editor evaluating candidate clips for YouTube Shorts, Reels, and TikTok.\n"
            "Evaluate the transcript snippet on 4 criteria (each an integer from 0 to 100):\n"
            "1. standalone: Can a viewer fully understand it without seeing the rest of the video?\n"
            "2. interest: Is it engaging, curious, surprising, funny, or insightful?\n"
            "3. completeness: Does it reach a clear punchline, takeaway, conclusion, or completed thought?\n"
            "4. overall: Would this perform well as a standalone short video?\n\n"
            "Reply ONLY with a compact JSON object in this exact format:\n"
            '{"standalone": 80, "interest": 85, "completeness": 75, "overall": 82}\n\n'
            f'Transcript snippet:\n"{clean_snippet}"'
        )

        ai_score = 50.0  # Neutral fallback
        try:
            resp = requests.post(
                f"{endpoint}/api/generate",
                json={
                    "model": _OLLAMA_MODEL,
                    "prompt": prompt,
                    "stream": False,
                    "format": "json",
                },
                timeout=OLLAMA_PER_REQUEST_TIMEOUT,
                allow_redirects=False, proxies={"http": "", "https": ""},
            )
            if resp.status_code == 200:
                raw = resp.json().get("response", "")
                match = re.search(r"\{.*\}", raw, re.DOTALL)
                if match:
                    data = json.loads(match.group(0))
                    s_standalone = _safe_float(data.get("standalone"), 50.0)
                    s_interest = _safe_float(data.get("interest"), 50.0)
                    s_complete = _safe_float(data.get("completeness"), 50.0)
                    s_overall = _safe_float(data.get("overall"), 50.0)

                    # Clamp all to 0-100
                    s_standalone = max(0.0, min(100.0, s_standalone))
                    s_interest = max(0.0, min(100.0, s_interest))
                    s_complete = max(0.0, min(100.0, s_complete))
                    s_overall = max(0.0, min(100.0, s_overall))

                    # Weighted composite AI score
                    ai_score = (
                        0.30 * s_standalone
                        + 0.35 * s_interest
                        + 0.20 * s_complete
                        + 0.15 * s_overall
                    )
        except Exception as cand_exc:
            logger.debug("Failed Ollama eval for candidate %s: %s", cand.get("start"), cand_exc)
            ai_score = 50.0  # Safe default on per-candidate failure

        norm_heuristic = ((cand["score"] - min_h) / h_range * 100.0) if h_range > 0.001 else 50.0
        # 50% heuristic + 50% semantic AI score
        combined_score = 0.50 * norm_heuristic + 0.50 * ai_score

        scored_candidates.append(
            {
                **cand,
                "final_score": round(combined_score, 2),
            }
        )

    # Rank by combined score
    scored_candidates.sort(key=lambda c: c.get("final_score", 0.0), reverse=True)

    chosen: List[dict] = []
    for cand in scored_candidates:
        if len(chosen) >= num_clips:
            break
        if any(_overlaps(cand, c) for c in chosen):
            continue
        if any(_is_near_duplicate(cand, c) for c in chosen):
            continue
        chosen.append(cand)

    # If more clips are needed, backfill with remaining non-overlapping candidates
    if len(chosen) < num_clips:
        for cand in scored_candidates:
            if len(chosen) >= num_clips:
                break
            if any(_overlaps(cand, c) for c in chosen):
                continue
            if cand not in chosen:
                chosen.append(cand)

    # If still needed, backfill from the full candidate pool by heuristic score
    if len(chosen) < num_clips:
        for cand in sorted(candidates, key=lambda c: c["score"], reverse=True):
            if len(chosen) >= num_clips:
                break
            if any(_overlaps(cand, c) for c in chosen):
                continue
            if cand not in chosen:
                chosen.append(cand)

    chosen.sort(key=lambda c: c["start"])
    return [
        {
            "start": c["start"],
            "end": c["end"],
            "title": _derive_title(c["text"]),
        }
        for c in chosen
    ]
