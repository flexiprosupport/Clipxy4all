"""Personal preference image watermark management for 1:1 square clips.

Allows users to upload custom JPG, JPEG, or PNG logos / watermarks,
store them securely under assets/watermarks/, and resolve them safely
for live preview and FFmpeg burning.
"""

from __future__ import annotations

import logging
import re
import shutil
import uuid
from pathlib import Path
from typing import BinaryIO

from .paths import WATERMARKS_DIR

logger = logging.getLogger(__name__)

ALLOWED_IMAGE_EXTS = {".png", ".jpg", ".jpeg"}
_ID_RE = re.compile(r"^[0-9a-f]{32}$")


def _validate_image_bytes(fileobj: BinaryIO) -> str:
    """Validate image magic bytes from file stream header."""
    pos = fileobj.tell()
    try:
        header = fileobj.read(16)
        if header.startswith(b"\x89PNG\r\n\x1a\n"):
            return ".png"
        if header.startswith(b"\xff\xd8\xff"):
            return ".jpg"
        raise ValueError("Invalid image format. Supported formats: JPG, JPEG, PNG.")
    finally:
        fileobj.seek(pos)


def save_watermark(filename: str, fileobj: BinaryIO) -> dict:
    """Save an uploaded image watermark to assets/watermarks/ and return its descriptor.

    Args:
        filename: original filename from user machine.
        fileobj: open binary file stream.

    Returns:
        dict with watermark_id, filename, ext, url, width, and height.

    Raises:
        ValueError on unsupported format or corrupted image.
    """
    raw_ext = Path(filename or "").suffix.lower()
    if raw_ext not in ALLOWED_IMAGE_EXTS:
        raise ValueError(
            f"Unsupported watermark file type '{raw_ext or 'unknown'}'. "
            f"Please upload a PNG, JPG, or JPEG image."
        )

    # Validate header magic bytes
    detected_type = _validate_image_bytes(fileobj)
    ext = ".jpg" if raw_ext in {".jpg", ".jpeg"} and detected_type == ".jpg" else detected_type

    watermark_id = uuid.uuid4().hex
    dest = WATERMARKS_DIR / f"{watermark_id}{ext}"

    try:
        with dest.open("wb") as out:
            shutil.copyfileobj(fileobj, out, length=1024 * 1024)
    except OSError as exc:
        dest.unlink(missing_ok=True)
        logger.exception("Failed to write watermark %s", filename)
        raise ValueError(f"Could not save the watermark file: {exc}") from exc

    if not dest.exists() or dest.stat().st_size == 0:
        dest.unlink(missing_ok=True)
        raise ValueError("The uploaded watermark image was empty.")

    # Validate that image is decodable and obtain dimensions
    width, height = 0, 0
    try:
        import av
        with av.open(str(dest.resolve())) as container:
            if not container.streams.video:
                raise ValueError("No decodable video/image stream found.")
            for frame in container.decode(video=0):
                width, height = frame.width, frame.height
                break
    except Exception as exc:
        dest.unlink(missing_ok=True)
        logger.warning("Decodability check failed for watermark %s: %s", filename, exc)
        raise ValueError(f"Uploaded file is not a valid decodable image: {exc}") from exc

    logger.info("Saved watermark %s -> %s (%dx%d, %d bytes)", filename, dest.name, width, height, dest.stat().st_size)
    return {
        "watermark_id": watermark_id,
        "filename": Path(filename or "watermark").name,
        "ext": ext,
        "width": width,
        "height": height,
        "url": f"/watermarks/{dest.name}",
    }


def resolve_watermark(watermark_id: str) -> Path:
    """Safely map a 32-char hex watermark_id back to its filesystem path.

    Raises:
        ValueError if watermark_id is invalid or file missing.
    """
    if not watermark_id or not _ID_RE.match(watermark_id):
        raise ValueError("Invalid watermark reference.")

    matches = [
        path for path in sorted(WATERMARKS_DIR.glob(f"{watermark_id}.*"))
        if path.is_file() and path.stem == watermark_id
        and path.suffix.lower() in ALLOWED_IMAGE_EXTS and path.stat().st_size > 0
    ]
    if not matches:
        raise ValueError("The requested watermark image was not found.")
    return matches[0]


def list_watermarks() -> list[dict]:
    """Return all available uploaded watermarks sorted by recent modification time."""
    results = []
    if not WATERMARKS_DIR.exists():
        return results

    files = sorted(
        [p for p in WATERMARKS_DIR.glob("*.*") if p.is_file() and p.suffix.lower() in ALLOWED_IMAGE_EXTS and _ID_RE.match(p.stem)],
        key=lambda p: p.stat().st_mtime,
        reverse=True,
    )
    for p in files:
        results.append({
            "watermark_id": p.stem,
            "filename": p.name,
            "ext": p.suffix.lower(),
            "url": f"/watermarks/{p.name}",
            "size": p.stat().st_size,
        })
    return results
