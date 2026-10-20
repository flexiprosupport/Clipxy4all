"""Regression checks for selecting yt-dlp's FFmpeg location without external deps.

Run: python -m unittest discover -s tests -p test_platform_ffmpeg.py
"""
import ast
import os
from pathlib import Path
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]


def load_discovery_logic(ffmpeg_dir):
    """Execute the actual small helper in isolation; avoid importing yt-dlp."""
    parsed = ast.parse((ROOT / "app/downloader.py").read_text(encoding="utf-8"))
    helper = next(n for n in parsed.body if isinstance(n, ast.FunctionDef)
                  and n.name == "_yt_dlp_ffmpeg_location")
    module = ast.Module(body=[helper], type_ignores=[])
    namespace = {"os": os, "FFMPEG_DIR": ffmpeg_dir, "Optional": __import__("typing").Optional}
    exec(compile(module, "app/downloader.py", "exec"), namespace)
    return namespace["_yt_dlp_ffmpeg_location"]


class FFmpegPlatformTests(unittest.TestCase):
    def test_empty_bundled_folder_uses_path(self):
        with tempfile.TemporaryDirectory() as directory:
            self.assertIsNone(load_discovery_logic(Path(directory))())

    def test_real_bundled_binary_is_preferred(self):
        with tempfile.TemporaryDirectory() as directory:
            folder = Path(directory)
            binary = folder / ("ffmpeg.exe" if os.name == "nt" else "ffmpeg")
            binary.write_bytes(b"test")
            self.assertEqual(load_discovery_logic(folder)(), str(folder))

    def test_other_files_do_not_imply_ffmpeg(self):
        with tempfile.TemporaryDirectory() as directory:
            folder = Path(directory)
            (folder / "ffprobe").write_bytes(b"test")
            self.assertIsNone(load_discovery_logic(folder)())


if __name__ == "__main__":
    unittest.main()
