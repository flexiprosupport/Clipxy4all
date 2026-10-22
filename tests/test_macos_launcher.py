"""Smoke tests for macOS launcher safety without needing a Mac or app packages."""
import os
from pathlib import Path
import shutil
import signal
import subprocess
import sys
import tempfile
import time
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


# Homebrew's and python.org's macOS Python are framework builds: bin/python3.11
# is a launcher that re-execs Python.app and sets argv[0] to that path
# (CPython Mac/Tools/pythonw.c), keeping the PID. `ps` therefore shows
# ".../Python.app/Contents/MacOS/Python -m uvicorn ..." - never the venv path.
FRAMEWORK_ARGV0 = ("/opt/homebrew/Cellar/python@3.11/3.11.15/Frameworks/Python.framework/"
                   "Versions/3.11/Resources/Python.app/Contents/MacOS/Python")

# Stand-in for `python -m uvicorn app.main:app --host H --port P`: answers
# /health like Clipxy4all so server.sh's identity and health checks run for real.
FAKE_UVICORN = r'''
import http.server, json, os, signal, sys
args = sys.argv[1:]
port = int(args[args.index("--port") + 1])
class Health(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        body = json.dumps({"status": "ok", "app": "clipxy4all-v3", "pid": os.getpid()}).encode()
        self.send_response(200 if self.path == "/health" else 404)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(body)
    def log_message(self, *a):
        pass
signal.signal(signal.SIGTERM, lambda *a: sys.exit(0))
http.server.HTTPServer(("127.0.0.1", port), Health).serve_forever()
'''


@unittest.skipIf(os.name == "nt", "Bash launcher tests require POSIX")
@unittest.skipUnless(shutil.which("lsof") and shutil.which("curl"), "needs lsof and curl, as on macOS")
class FrameworkPythonLauncherTests(unittest.TestCase):
    def make_install(self, base, name="Clipxy4all Install"):
        """A fake installation (with a space in its path) whose venv Python rewrites argv[0]."""
        root = Path(base) / name
        (root / "scripts/macos").mkdir(parents=True)
        shutil.copy(ROOT / "scripts/macos/server.sh", root / "scripts/macos/server.sh")
        fake = Path(base) / "fake_modules" / "uvicorn"
        fake.mkdir(parents=True, exist_ok=True)
        (fake / "__init__.py").write_text("")
        (fake / "__main__.py").write_text(FAKE_UVICORN)
        real_python = os.path.realpath(sys.executable)
        venv_bin = root / ".venv-macos/bin"
        venv_bin.mkdir(parents=True)
        (venv_bin / "python").write_text(
            "#!/usr/bin/env bash\n"
            f'export PYTHONHOME="{sys.base_prefix}" PYTHONPATH="{fake.parent}"\n'
            f'exec -a "{FRAMEWORK_ARGV0}" "{real_python}" "$@"\n')
        (venv_bin / "python").chmod(0o755)
        stubs = Path(base) / "stubs"
        stubs.mkdir(exist_ok=True)
        (stubs / "open").write_text("#!/bin/sh\nexit 0\n")
        (stubs / "open").chmod(0o755)
        self.env = dict(os.environ, PATH=f"{stubs}{os.pathsep}{os.environ['PATH']}")
        return root

    def server(self, root, action, **kw):
        return subprocess.run(["bash", str(root / "scripts/macos/server.sh"), action],
                              env=self.env, text=True, capture_output=True, timeout=30, **kw)

    def start_in_background(self, root):
        launcher = subprocess.Popen(["bash", str(root / "scripts/macos/server.sh"), "start"],
                                    env=self.env, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
        self.addCleanup(self._reap, launcher)
        pid_file = root / ".clipxy4all.pid"
        deadline = time.monotonic() + 20
        while time.monotonic() < deadline:
            if pid_file.exists() and "running on" in (self._peek(launcher) or ""):
                break
            if launcher.poll() is not None:
                self.fail("launcher exited early:\n" + launcher.stdout.read())
            time.sleep(0.1)
        pid, port = pid_file.read_text().split()
        self.addCleanup(self._kill_quietly, int(pid))
        return launcher, int(pid), int(port)

    def _peek(self, launcher):
        # Non-blocking read of what the launcher printed so far.
        import select
        out = getattr(launcher, "_seen", "")
        while select.select([launcher.stdout], [], [], 0)[0]:
            line = launcher.stdout.readline()
            if not line:
                break
            out += line
        launcher._seen = out
        return out

    @staticmethod
    def _reap(launcher):
        if launcher.poll() is None:
            launcher.kill()
        launcher.wait(timeout=10)
        launcher.stdout.close()

    @staticmethod
    def _kill_quietly(pid):
        try:
            os.kill(pid, signal.SIGKILL)
        except OSError:
            pass

    @staticmethod
    def alive(pid):
        try:
            os.kill(pid, 0)
            return True
        except OSError:
            return False

    def wait_dead(self, pid, seconds=10):
        deadline = time.monotonic() + seconds
        while time.monotonic() < deadline and self.alive(pid):
            time.sleep(0.1)
        return not self.alive(pid)

    def test_rewritten_argv0_is_what_ps_reports(self):
        with tempfile.TemporaryDirectory() as base:
            root = self.make_install(base)
            launcher, pid, _ = self.start_in_background(root)
            shown = subprocess.check_output(["ps", "-p", str(pid), "-o", "command="], text=True)
            self.assertTrue(shown.startswith(FRAMEWORK_ARGV0), shown)
            self.assertNotIn(".venv-macos", shown)

    def test_stop_stops_server_started_by_framework_python(self):
        with tempfile.TemporaryDirectory() as base:
            root = self.make_install(base)
            launcher, pid, _ = self.start_in_background(root)
            result = self.server(root, "stop")
            self.assertIn(f"Stopped Clipxy4all server (PID {pid})", result.stdout, result.stdout + result.stderr)
            self.assertTrue(self.wait_dead(pid), "server still running after stop")
            launcher.wait(timeout=10)
            self.assertFalse((root / ".clipxy4all.pid").exists())

    def test_second_launch_reuses_running_server(self):
        with tempfile.TemporaryDirectory() as base:
            root = self.make_install(base)
            launcher, pid, port = self.start_in_background(root)
            second = self.server(root, "start")
            self.assertEqual(second.returncode, 0, second.stdout + second.stderr)
            self.assertIn(f"already running: http://127.0.0.1:{port}", second.stdout)
            self.assertEqual((root / ".clipxy4all.pid").read_text().split(), [str(pid), str(port)])

    def test_stop_ignores_identical_server_of_another_install(self):
        with tempfile.TemporaryDirectory() as base:
            mine = self.make_install(base, "Mine")
            other = self.make_install(base, "Other")
            launcher, other_pid, _ = self.start_in_background(other)
            # Point this install's PID file at the other install's server.
            (mine / ".clipxy4all.pid").write_text(f"{other_pid} 8000\n")
            result = self.server(mine, "stop")
            self.assertIn("No other process was stopped", result.stdout)
            time.sleep(0.5)
            self.assertTrue(self.alive(other_pid), "stopped another installation's server")


if __name__ == "__main__":
    unittest.main()
