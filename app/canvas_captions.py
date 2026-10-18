"""Shared browser/Node Canvas caption export, with bounded streaming memory."""
from __future__ import annotations

import json
import os
import shutil
import subprocess
import tempfile
import time
import uuid
from pathlib import Path
from typing import Callable, Optional

from .models import ClipGenerationError
from .paths import FONTS_DIR, ROOT_DIR, get_ffmpeg_bin


def write_recipe(path: Path, *, style: str, words: list[dict], start: float,
                 end: float, overrides: Optional[dict], language: str) -> Path:
    duration = max(.1, end - start)
    relative = [
        {"word": str(w["word"]), "start": max(0, float(w["start"]) - start),
         "end": min(duration, float(w["end"]) - start)}
        for w in words if w.get("word") and float(w["end"]) > start and float(w["start"]) < end
    ]
    path.write_text(json.dumps({"style": style, "words": relative,
        "duration": duration, "overrides": overrides or {}, "language": language},
        ensure_ascii=False), encoding="utf-8")
    return path


def find_node() -> Optional[str]:
    bundled = ROOT_DIR / "node" / ("node.exe" if os.name == "nt" else "bin/node")
    if bundled.is_file(): return str(bundled)
    candidate = shutil.which("node")
    if candidate:
        return candidate
    for variable in ("ProgramFiles", "LOCALAPPDATA"):
        base = os.environ.get(variable)
        if base:
            for suffix in ("nodejs/node.exe", "Programs/nodejs/node.exe"):
                location = Path(base) / suffix
                if location.is_file():
                    return str(location)
    return None


def render_layer(recipe: Path, output: Path, width: int, height: int,
                 cancelled: Optional[Callable[[], bool]] = None,
                 progress: Optional[Callable] = None) -> Optional[Path]:
    node = find_node()
    if not node:
        raise ClipGenerationError("Caption export needs Node.js 22+. Install Node.js 22 or newer.")
    request = json.loads(recipe.read_text(encoding="utf-8"))
    request.update(width=width, height=height, fps=30, fonts_dir=str(FONTS_DIR.resolve()))
    token = uuid.uuid4().hex[:10]
    request_path = output.with_name(output.stem + f".request.{token}.json")
    temporary = output.with_name(output.stem + f".tmp.{token}.mov")
    request_path.write_text(json.dumps(request, ensure_ascii=False), encoding="utf-8")
    processes = []
    node_log_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False) as node_log, tempfile.TemporaryFile() as ffmpeg_log:
            node_log_path = Path(node_log.name)
            producer = subprocess.Popen(
                [node, "--expose-gc", str(ROOT_DIR / "caption_renderer" / "driver.mjs"), str(request_path)],
                stdout=subprocess.PIPE, stderr=node_log, cwd=str(ROOT_DIR), creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0),
            )
            processes.append(producer)
            encoder = subprocess.Popen([
                get_ffmpeg_bin(), "-hide_banner", "-loglevel", "error", "-y",
                "-f", "rawvideo", "-pix_fmt", "rgba", "-video_size", f"{width}x{height}",
                "-framerate", "30", "-i", "pipe:0", "-an", "-c:v", "qtrle",
                "-pix_fmt", "argb", "-threads", "2", str(temporary),
            ], stdin=producer.stdout, stdout=subprocess.DEVNULL, stderr=ffmpeg_log, creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0))
            processes.append(encoder)
            producer.stdout.close()
            offset=0
            while producer.poll() is None or encoder.poll() is None:
                if progress:
                    with node_log_path.open("rb") as reader:
                        reader.seek(offset)
                        text=reader.read().decode("utf-8","replace")
                        offset=reader.tell()
                    for line in text.splitlines():
                        if line.startswith("CLIPXY_PROGRESS "):
                            progress(float(line.split()[1]))
                if cancelled and cancelled():
                    return None
                if encoder.poll() not in (None, 0):
                    break
                time.sleep(.05)
            if producer.poll() is None:
                producer.terminate()
            producer.wait(timeout=10)
            encoder.wait(timeout=10)
            if producer.returncode or encoder.returncode or not temporary.is_file():
                logs = []
                for log in (node_log, ffmpeg_log):
                    log.seek(0, 2)
                    log.seek(max(0, log.tell() - 5000))
                    logs.append(log.read().decode("utf-8", "replace"))
                raise ClipGenerationError("Caption rendering failed. Run Setup to check caption dependencies.\n" + "\n".join(logs))
            os.replace(temporary, output)
            return output
    except (OSError, subprocess.TimeoutExpired) as exc:
        raise ClipGenerationError(f"Could not start or finish caption rendering: {exc}") from exc
    finally:
        for process in processes:
            if process.poll() is None:
                process.kill()
            process.wait()
        request_path.unlink(missing_ok=True)
        temporary.unlink(missing_ok=True)
        if node_log_path:
            node_log_path.unlink(missing_ok=True)
