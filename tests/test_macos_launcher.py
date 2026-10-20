"""Smoke tests for macOS launcher safety without needing a Mac or app packages."""
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]


@unittest.skipIf(os.name == "nt", "Bash launcher tests require POSIX")
class MacLauncherTests(unittest.TestCase):
    def test_bash_syntax(self):
        for file in ("scripts/macos/setup.sh", "scripts/macos/server.sh"):
            subprocess.run(["bash", "-n", str(ROOT / file)], check=True)

    def test_stop_never_kills_unrelated_pid(self):
        with tempfile.TemporaryDirectory() as directory:
            temp = Path(directory)
            (temp / "scripts/macos").mkdir(parents=True)
            shutil.copy(ROOT / "scripts/macos/server.sh", temp / "scripts/macos/server.sh")
            unrelated = subprocess.Popen(["sleep", "60"])
            try:
                (temp / ".clipxy4all.pid").write_text(f"{unrelated.pid} 8000\n")
                result = subprocess.run(["bash", str(temp / "scripts/macos/server.sh"), "stop"],
                                        text=True, capture_output=True, check=True)
                self.assertIsNone(unrelated.poll(), result.stdout + result.stderr)
                self.assertFalse((temp / ".clipxy4all.pid").exists())
                self.assertIn("No other process was stopped", result.stdout)
            finally:
                unrelated.terminate()
                unrelated.wait(timeout=5)

    def test_start_refuses_missing_python_environment(self):
        with tempfile.TemporaryDirectory() as directory:
            temp = Path(directory)
            (temp / "scripts/macos").mkdir(parents=True)
            shutil.copy(ROOT / "scripts/macos/server.sh", temp / "scripts/macos/server.sh")
            result = subprocess.run(["bash", str(temp / "scripts/macos/server.sh"), "start"],
                                    text=True, capture_output=True)
            self.assertNotEqual(result.returncode, 0)
            self.assertIn("setup.sh", result.stderr)


if __name__ == "__main__":
    unittest.main()
