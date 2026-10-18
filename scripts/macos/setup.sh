#!/usr/bin/env bash
# Clipxy4all - macOS setup.
#
# The Windows installer ships its own CPython, FFmpeg and Node. None of those
# binaries run on macOS, so this script puts the macOS equivalents in place and
# wires the app to them. The application code itself is unchanged.
#
#   bash scripts/macos/setup.sh

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

say()  { printf '\n==> %s\n' "$1"; }
die()  { printf '\nERROR: %s\n' "$1" >&2; exit 1; }

[ "$(uname -s)" = "Darwin" ] || die "This script is for macOS. On Windows use the installer."
say "Clipxy4all macOS setup  (macOS $(sw_vers -productVersion), $(uname -m))"

# ---------------------------------------------------------------- Homebrew --
command -v brew >/dev/null 2>&1 || die "Homebrew is required. Install it from https://brew.sh then run this again."

for pkg in python@3.11 ffmpeg node; do
  if brew list --versions "$pkg" >/dev/null 2>&1; then
    echo "    $pkg already installed"
  else
    say "Installing $pkg"
    brew install "$pkg"
  fi
done

PY="$(brew --prefix python@3.11)/bin/python3.11"
[ -x "$PY" ] || die "python3.11 not found at $PY"

# ------------------------------------------------------------ Python deps --
say "Creating the virtual environment (.venv-macos)"
[ -d .venv-macos ] || "$PY" -m venv .venv-macos
.venv-macos/bin/python -m pip install --quiet --upgrade pip wheel

say "Installing Python dependencies - this takes a few minutes"
.venv-macos/bin/python -m pip install -r requirements.txt

# ------------------------------------------------------- Caption renderer --
# @napi-rs/canvas is a native module; the committed lockfile was resolved on
# Windows, so the macOS binding has to be fetched here.
say "Installing the caption renderer's native canvas for macOS"
( cd caption_renderer && npm install --omit=dev --silent )

# --------------------------------------------------------------- AI model --
# paths.py sets HF_HUB_OFFLINE=1, so nothing is ever downloaded at runtime.
if [ -d models/hub ] && [ -n "$(find models/hub -name 'model.bin' -print -quit 2>/dev/null)" ]; then
  echo "    Whisper model found under models/hub"
else
  cat <<'MSG'

    The Whisper model is NOT present. It is not in this repository because it
    is ~464 MB of third-party weights.

    Copy the whole 'models' folder from a Windows install of Clipxy4all
    (it sits next to app/, ffmpeg/, python/) into this folder. The weights are
    platform-neutral - the same files work on macOS.

    Without it the app starts but transcription fails.

MSG
fi

# --------------------------------------------------------------- Launcher --
say "Writing launchers"

cat > 'Clipxy4all.command' <<'LAUNCH'
#!/usr/bin/env bash
cd "$(dirname "$0")"
source .venv-macos/bin/activate

# Two clips render at once by default; 1-8 is allowed.
export CLIPXY4ALL_MAX_JOBS="${CLIPXY4ALL_MAX_JOBS:-2}"

PORT=8000
while [ $PORT -le 8015 ] && lsof -nP -iTCP:$PORT -sTCP:LISTEN >/dev/null 2>&1; do
  PORT=$((PORT + 1))
done

echo "Starting Clipxy4all on http://127.0.0.1:$PORT"
python -m uvicorn app.main:app --host 127.0.0.1 --port "$PORT" &
SERVER_PID=$!
echo $SERVER_PID > .clipxy4all.pid

sleep 4 && open "http://127.0.0.1:$PORT" &

trap 'kill $SERVER_PID 2>/dev/null; rm -f .clipxy4all.pid' INT TERM
wait $SERVER_PID
LAUNCH

cat > 'Stop Clipxy4all.command' <<'STOP'
#!/usr/bin/env bash
cd "$(dirname "$0")"
if [ -f .clipxy4all.pid ] && kill "$(cat .clipxy4all.pid)" 2>/dev/null; then
  rm -f .clipxy4all.pid
  echo "Clipxy4all stopped."
else
  pkill -f 'uvicorn app.main:app' && echo "Clipxy4all stopped." || echo "Clipxy4all was not running."
fi
STOP

chmod +x 'Clipxy4all.command' 'Stop Clipxy4all.command'

say "Done"
cat <<'MSG'
    Double-click  Clipxy4all.command       to start (the browser opens itself)
    Double-click  Stop Clipxy4all.command  to stop

    Macs have no CUDA, so transcription runs on the CPU. Leave the Compute
    setting on Auto - it detects this and picks CPU int8 by itself. Expect
    transcription to be slower than on an NVIDIA machine; rendering speed is
    about the same.
MSG
