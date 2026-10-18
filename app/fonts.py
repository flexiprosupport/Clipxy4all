"""Bundled and user-uploaded caption fonts; no runtime network access.

Fonts are supplied in assets/fonts and matched by their embedded family name.
Missing fonts use libass's local fallback. URLs below record asset provenance
only; repairing an installation never triggers a download.
"""

from __future__ import annotations

import json
import logging
import os
import re
import struct
import tempfile
import threading
from pathlib import Path
from typing import BinaryIO, Optional

from .models import InvalidVideoURLError
from .paths import FONTS_DIR

logger = logging.getLogger(__name__)
_FONT_SAVE_LOCK = threading.Lock()
_MAX_UPLOAD_BYTES = 64 * 1024 * 1024

_GF = "https://raw.githubusercontent.com/google/fonts/main"

# Core bundled fonts used by default captions and square titles.
_CORE_FONTS = {
    "Roboto-Regular.ttf": (
        "https://github.com/googlefonts/roboto-2/raw/main/src/hinted/Roboto-Regular.ttf"
    ),
    "Roboto-Bold.ttf": (
        "https://github.com/googlefonts/roboto-2/raw/main/src/hinted/Roboto-Bold.ttf"
    ),
}

# Trending display fonts: family name (as embedded / used in the ASS Fontname) ->
# (local filename, download url). Verified to resolve from the google/fonts repo.
TRENDING_FONTS: dict[str, tuple[str, str]] = {
    "Anton": ("Anton-Regular.ttf", f"{_GF}/ofl/anton/Anton-Regular.ttf"),
    "Bebas Neue": ("BebasNeue-Regular.ttf", f"{_GF}/ofl/bebasneue/BebasNeue-Regular.ttf"),
    "Archivo Black": ("ArchivoBlack-Regular.ttf", f"{_GF}/ofl/archivoblack/ArchivoBlack-Regular.ttf"),
    "Poppins": ("Poppins-Bold.ttf", f"{_GF}/ofl/poppins/Poppins-Bold.ttf"),
    "Montserrat": ("Montserrat.ttf", f"{_GF}/ofl/montserrat/Montserrat%5Bwght%5D.ttf"),
    "Oswald": ("Oswald.ttf", f"{_GF}/ofl/oswald/Oswald%5Bwght%5D.ttf"),
    "Teko": ("Teko.ttf", f"{_GF}/ofl/teko/Teko%5Bwght%5D.ttf"),
    "Changa": ("Changa.ttf", f"{_GF}/ofl/changa/Changa%5Bwght%5D.ttf"),
    "Bangers": ("Bangers-Regular.ttf", f"{_GF}/ofl/bangers/Bangers-Regular.ttf"),
    "Luckiest Guy": ("LuckiestGuy-Regular.ttf", f"{_GF}/apache/luckiestguy/LuckiestGuy-Regular.ttf"),
    "Permanent Marker": ("PermanentMarker-Regular.ttf", f"{_GF}/apache/permanentmarker/PermanentMarker-Regular.ttf"),
    "Alfa Slab One": ("AlfaSlabOne-Regular.ttf", f"{_GF}/ofl/alfaslabone/AlfaSlabOne-Regular.ttf"),
    "Russo One": ("RussoOne-Regular.ttf", f"{_GF}/ofl/russoone/RussoOne-Regular.ttf"),
    "Titan One": ("TitanOne-Regular.ttf", f"{_GF}/ofl/titanone/TitanOne-Regular.ttf"),
    "Paytone One": ("PaytoneOne-Regular.ttf", f"{_GF}/ofl/paytoneone/PaytoneOne-Regular.ttf"),
    "Lilita One": ("LilitaOne-Regular.ttf", f"{_GF}/ofl/lilitaone/LilitaOne-Regular.ttf"),
    "Passion One": ("PassionOne-Bold.ttf", f"{_GF}/ofl/passionone/PassionOne-Bold.ttf"),
    "Sigmar One": ("SigmarOne-Regular.ttf", f"{_GF}/ofl/sigmarone/SigmarOne-Regular.ttf"),
    "Bowlby One SC": ("BowlbyOneSC-Regular.ttf", f"{_GF}/ofl/bowlbyonesc/BowlbyOneSC-Regular.ttf"),
    "Concert One": ("ConcertOne-Regular.ttf", f"{_GF}/ofl/concertone/ConcertOne-Regular.ttf"),
    "Bungee": ("Bungee-Regular.ttf", f"{_GF}/ofl/bungee/Bungee-Regular.ttf"),
    "Shrikhand": ("Shrikhand-Regular.ttf", f"{_GF}/ofl/shrikhand/Shrikhand-Regular.ttf"),
    "DM Serif Display": ("DMSerifDisplay-Regular.ttf", f"{_GF}/ofl/dmserifdisplay/DMSerifDisplay-Regular.ttf"),
}

# Multilingual fonts for non-Latin captions. These ship with the app so caption
# rendering never depends on fonts installed on the customer's PC or a download.
# Family name (as embedded / used in the ASS Fontname) -> (file, provenance URL).
MULTILINGUAL_FONTS: dict[str, tuple[str, str]] = {
    # --- Urdu / Arabic ---
    "Noto Nastaliq Urdu": (
        "NotoNastaliqUrdu-Regular.ttf",
        f"{_GF}/ofl/notonastaliqurdu/NotoNastaliqUrdu%5Bwght%5D.ttf",
    ),
    "Noto Naskh Arabic": (
        "NotoNaskhArabic-Regular.ttf",
        f"{_GF}/ofl/notonaskharabic/NotoNaskhArabic%5Bwght%5D.ttf",
    ),
    "Noto Sans Arabic": (
        "NotoSansArabic-Regular.ttf",
        f"{_GF}/ofl/notosansarabic/NotoSansArabic%5Bwdth%2Cwght%5D.ttf",
    ),
    # --- Hindi (Devanagari) ---
    "Noto Sans Devanagari": (
        "NotoSansDevanagari-Regular.ttf",
        f"{_GF}/ofl/notosansdevanagari/NotoSansDevanagari%5Bwdth%2Cwght%5D.ttf",
    ),
    "Noto Serif Devanagari": (
        "NotoSerifDevanagari-Regular.ttf",
        f"{_GF}/ofl/notoserifdevanagari/NotoSerifDevanagari%5Bwdth%2Cwght%5D.ttf",
    ),
    # --- Indian regional scripts ---
    "Noto Sans Telugu": (
        "NotoSansTelugu-Regular.ttf",
        f"{_GF}/ofl/notosanstelugu/NotoSansTelugu%5Bwdth%2Cwght%5D.ttf",
    ),
    "Noto Sans Tamil": (
        "NotoSansTamil-Regular.ttf",
        f"{_GF}/ofl/notosanstamil/NotoSansTamil%5Bwdth%2Cwght%5D.ttf",
    ),
    "Noto Sans Kannada": (
        "NotoSansKannada-Regular.ttf",
        f"{_GF}/ofl/notosanskannada/NotoSansKannada%5Bwdth%2Cwght%5D.ttf",
    ),
    "Noto Sans Malayalam": (
        "NotoSansMalayalam-Regular.ttf",
        f"{_GF}/ofl/notosansmalayalam/NotoSansMalayalam%5Bwdth%2Cwght%5D.ttf",
    ),
    "Noto Sans Gujarati": (
        "NotoSansGujarati-Regular.ttf",
        f"{_GF}/ofl/notosansgujarati/NotoSansGujarati%5Bwdth%2Cwght%5D.ttf",
    ),
    "Noto Sans Bengali": (
        "NotoSansBengali-Regular.ttf",
        f"{_GF}/ofl/notosansbengali/NotoSansBengali%5Bwdth%2Cwght%5D.ttf",
    ),
    "Noto Sans Gurmukhi": (
        "NotoSansGurmukhi-Regular.ttf",
        f"{_GF}/ofl/notosansgurmukhi/NotoSansGurmukhi%5Bwdth%2Cwght%5D.ttf",
    ),
}

# A sensible default caption font per non-Latin language code, so picking the
# language can auto-swap the typeface to one that can actually render the script
# (avoids tofu boxes when the user leaves the Latin default selected).
LANG_DEFAULT_FONT: dict[str, str] = {
    "ur": "Noto Nastaliq Urdu",   # Urdu
    "ar": "Noto Sans Arabic",     # Arabic
    "fa": "Noto Naskh Arabic",    # Persian
    "hi": "Noto Sans Devanagari",  # Hindi
    "mr": "Noto Sans Devanagari",  # Marathi
    "ne": "Noto Sans Devanagari",  # Nepali
    "te": "Noto Sans Telugu",  # Telugu
    "ta": "Noto Sans Tamil",  # Tamil
    "kn": "Noto Sans Kannada",  # Kannada
    "ml": "Noto Sans Malayalam",  # Malayalam
    "gu": "Noto Sans Gujarati",  # Gujarati
    "bn": "Noto Sans Bengali",  # Bengali
    "as": "Noto Sans Bengali",  # Assamese uses the Bengali-Assamese script
    "pa": "Noto Sans Gurmukhi",  # Punjabi
}


def with_language_font(overrides: Optional[dict], language: Optional[str]) -> Optional[dict]:
    """Use a bundled script font when the user has not chosen a font.

    This also covers auto-detected languages: the browser cannot pick a script
    font before Whisper has identified the speech, but the render worker can.
    """
    default = LANG_DEFAULT_FONT.get((language or "").strip().lower())
    if not default or (overrides or {}).get("font_family"):
        return overrides
    return {**(overrides or {}), "font_family": default}

# Always-offered core families -> their file (so the UI can @font-face them too).
_CORE_FAMILY_FILES = {"Roboto": "Roboto-Regular.ttf", "Inter": "Inter.ttf",
    "Caveat": "Caveat.ttf", "JetBrains Mono": "JetBrainsMono.ttf",
    "Playfair Display": "PlayfairDisplay.ttf"}

ALLOWED_FONT_EXTS = {".ttf", ".otf"}
_USER_REGISTRY = FONTS_DIR / "user_fonts.json"


# --------------------------------------------------------------------------- #
# Local availability
# --------------------------------------------------------------------------- #
def _font_available(filename: str) -> bool:
    """Check the local font only, including empty or unreadable files."""
    target = FONTS_DIR / filename
    try:
        return target.is_file() and _family_from_sfnt(target.read_bytes()) is not None
    except OSError:
        return False


def ensure_core_fonts() -> None:
    """Check bundled core fonts; libass uses a local fallback if unavailable."""
    FONTS_DIR.mkdir(parents=True, exist_ok=True)
    for filename in _CORE_FONTS:
        if not _font_available(filename):
            logger.warning("Bundled font %s is missing or invalid; using a local font fallback.", filename)


def ensure_trending_fonts() -> None:
    """Check bundled display and multilingual fonts without network access."""
    FONTS_DIR.mkdir(parents=True, exist_ok=True)
    for filename, _url in (*TRENDING_FONTS.values(), *MULTILINGUAL_FONTS.values()):
        if not _font_available(filename):
            logger.warning("Bundled font %s is missing or invalid; using a local font fallback.", filename)


def ensure_fonts() -> None:
    """Validate local assets; never probe connectivity or download fonts."""
    ensure_core_fonts()
    ensure_trending_fonts()


# --------------------------------------------------------------------------- #
# Font family extraction (for user uploads) — minimal sfnt 'name' table reader
# --------------------------------------------------------------------------- #
def _family_from_sfnt(data: bytes) -> Optional[str]:
    """Read the family name from a TTF/OTF byte string, or None on any problem.

    Prefers the Typographic Family (nameID 16), falling back to Family (nameID 1).
    Handles TrueType collections by reading the first font.
    """
    try:
        offset = 0
        if data[:4] == b"ttcf":
            offset = struct.unpack(">I", data[12:16])[0]
        num_tables = struct.unpack(">H", data[offset + 4 : offset + 6])[0]
        name_off = None
        rec = offset + 12
        for _ in range(num_tables):
            tag = data[rec : rec + 4]
            toff = struct.unpack(">I", data[rec + 8 : rec + 12])[0]
            if tag == b"name":
                name_off = toff
                break
            rec += 16
        if name_off is None:
            return None
        count, string_off = struct.unpack(">HH", data[name_off + 2 : name_off + 6])
        strings = name_off + string_off
        family_1 = None
        for i in range(count):
            r = name_off + 6 + i * 12
            platform, _enc, _lang, name_id, length, off = struct.unpack(
                ">HHHHHH", data[r : r + 12]
            )
            if name_id not in (1, 16):
                continue
            raw = data[strings + off : strings + off + length]
            try:
                text = (
                    raw.decode("utf-16-be") if platform in (0, 3) else raw.decode("latin-1")
                ).strip()
            except Exception:  # noqa: BLE001
                continue
            if not text:
                continue
            if name_id == 16:
                return text  # typographic family wins outright
            if family_1 is None:
                family_1 = text
        return family_1
    except Exception:  # noqa: BLE001
        return None


# --------------------------------------------------------------------------- #
# User font registry + listing
# --------------------------------------------------------------------------- #
def _read_user_registry() -> list[dict]:
    if not _USER_REGISTRY.exists():
        return []
    try:
        data = json.loads(_USER_REGISTRY.read_text(encoding="utf-8"))
        return data if isinstance(data, list) else []
    except Exception:  # noqa: BLE001
        return []


def _write_user_registry(entries: list[dict]) -> None:
    temporary = None
    try:
        with tempfile.NamedTemporaryFile(
            mode="w", encoding="utf-8", dir=FONTS_DIR,
            prefix=".user_fonts.", suffix=".tmp", delete=False,
        ) as out:
            temporary = Path(out.name)
            json.dump(entries, out, indent=2)
            out.flush()
            os.fsync(out.fileno())
        os.replace(temporary, _USER_REGISTRY)
        temporary = None
    finally:
        if temporary is not None:
            temporary.unlink(missing_ok=True)


def _unused_font_name(name: str) -> str:
    candidate = Path(name)
    index = 2
    while (FONTS_DIR / candidate.name).exists():
        candidate = Path(f"{Path(name).stem}_{index}{Path(name).suffix}")
        index += 1
    return candidate.name


def save_user_font(filename: str, fileobj: BinaryIO) -> dict:
    """Save an uploaded font into FONTS_DIR and register its family name.

    Returns ``{"family": <name>, "file": <stored filename>}``.

    Raises:
        InvalidVideoURLError: unsupported extension, empty file, or unreadable font.
    """
    ext = Path(filename or "").suffix.lower()
    if ext not in ALLOWED_FONT_EXTS:
        raise InvalidVideoURLError(
            f"Unsupported font type '{ext or 'unknown'}'. Upload a .ttf or .otf file."
        )
    try:
        data = fileobj.read(_MAX_UPLOAD_BYTES + 1)
    except (OSError, ValueError) as exc:
        raise InvalidVideoURLError(f"Could not read the uploaded font: {exc}") from exc
    if not data:
        raise InvalidVideoURLError("The uploaded font file was empty.")
    if len(data) > _MAX_UPLOAD_BYTES:
        raise InvalidVideoURLError("The uploaded font is too large (64 MB maximum).")

    family = _family_from_sfnt(data)
    if not family:
        raise InvalidVideoURLError(
            "Could not read a font family name from that file. Is it a valid font?"
        )

    safe = re.sub(r"[^A-Za-z0-9._-]", "_", Path(filename).name) or f"font{ext}"
    temporary = None
    dest = None
    try:
        with tempfile.NamedTemporaryFile(
            mode="wb", dir=FONTS_DIR, prefix=".clipxy4all-font-",
            suffix=".uploading", delete=False,
        ) as out:
            temporary = Path(out.name)
            out.write(data)
        with _FONT_SAVE_LOCK:
            # A user's filename may match a bundled font. Never overwrite a
            # working caption font or a previous customer upload.
            dest = FONTS_DIR / _unused_font_name(safe)
            os.replace(temporary, dest)
            temporary = None
            try:
                entries = [e for e in _read_user_registry() if e.get("file") != dest.name]
                entries.append({"family": family, "file": dest.name})
                _write_user_registry(entries)
            except OSError:
                try:
                    dest.unlink(missing_ok=True)
                except OSError:
                    logger.warning("Could not remove unregistered font %s", dest, exc_info=True)
                raise
    except OSError as exc:
        raise InvalidVideoURLError(f"Could not save the font: {exc}") from exc
    finally:
        if temporary is not None:
            temporary.unlink(missing_ok=True)

    logger.info("Saved user font %s -> family '%s'", dest.name, family)
    return {"family": family, "file": dest.name}


def list_fonts() -> dict:
    """Return the fonts the UI can offer, split into bundled and user-uploaded.

    Each entry is ``{"family", "file"}`` so the frontend can register a matching
    ``@font-face`` (served from ``/fonts/<file>``) and preview the real typeface.
    """
    bundled = [{"family": fam, "file": fn} for fam, fn in _CORE_FAMILY_FILES.items()]
    bundled += [{"family": fam, "file": fn} for fam, (fn, _url) in TRENDING_FONTS.items()]
    multilingual = [
        {"family": fam, "file": fn} for fam, (fn, _url) in MULTILINGUAL_FONTS.items()
    ]
    return {
        "bundled": [f for f in bundled if _font_available(f["file"])],
        "multilingual": [f for f in multilingual if _font_available(f["file"])],
        "user": [f for f in _read_user_registry() if _font_available(f["file"])],
    }
