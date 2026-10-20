#!/usr/bin/env bash
# Start/stop the single Clipxy4all server for this installation only.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd -P)"
PY="$ROOT/.venv-macos/bin/python"
PID_FILE="$ROOT/.clipxy4all.pid"
LOCK_DIR="$ROOT/.clipxy4all.launch.lock"

is_our_server() {
  local pid="$1" command_line
  [[ "$pid" =~ ^[0-9]+$ ]] || return 1
  command_line="$(ps -p "$pid" -o command= 2>/dev/null)" || return 1
  # Never use a generic 'pkill uvicorn': another app may run uvicorn too.
  [[ "$command_line" == *"$PY -m uvicorn app.main:app --host 127.0.0.1 --port "* ]]
}

tracked_server() {
  TRACKED_PID='' TRACKED_PORT=''
  if [[ -f "$PID_FILE" ]]; then
    read -r TRACKED_PID TRACKED_PORT < "$PID_FILE" || true
  fi
}

clear_tracked_pid() {
  local expected="$1"
  tracked_server
  if [[ "$TRACKED_PID" == "$expected" ]]; then
    rm -f "$PID_FILE"
  fi
}

healthy() {
  local pid="$1" port="$2"
  curl -fsS --max-time 1 "http://127.0.0.1:$port/health" 2>/dev/null |
    "$PY" -c 'import json,sys; j=json.load(sys.stdin); sys.exit(0 if j.get("app")=="clipxy4all-v3" and j.get("pid")==int(sys.argv[1]) else 1)' "$pid" 2>/dev/null
}

case "${1:-start}" in
  stop)
    tracked_server
    if is_our_server "$TRACKED_PID"; then
      kill "$TRACKED_PID"
      echo "Stopped Clipxy4all server (PID $TRACKED_PID)."
    else
      echo "No matching Clipxy4all server is running. No other process was stopped."
    fi
    clear_tracked_pid "$TRACKED_PID"
    exit 0
    ;;
  start) ;;
  *) echo "Usage: bash scripts/macos/server.sh [start|stop]" >&2; exit 2 ;;
esac

[[ -x "$PY" ]] || { echo 'Run bash scripts/macos/setup.sh first (Python environment missing).' >&2; exit 1; }
# Serialize concurrent double-clicks; removing a stale lock is a manual recovery
# action rather than a reason to start two servers in one installation.
if ! mkdir "$LOCK_DIR" 2>/dev/null; then
  echo "Another Clipxy4all launch is in progress. If none is running, remove $LOCK_DIR." >&2
  exit 1
fi
trap 'rmdir "$LOCK_DIR" 2>/dev/null || true' EXIT

tracked_server
if is_our_server "$TRACKED_PID"; then
  if [[ "$TRACKED_PORT" =~ ^80(0[0-9]|1[0-5])$ ]] && healthy "$TRACKED_PID" "$TRACKED_PORT"; then
    echo "Clipxy4all already running: http://127.0.0.1:$TRACKED_PORT"
    open "http://127.0.0.1:$TRACKED_PORT"
    exit 0
  fi
  echo "Clipxy4all process $TRACKED_PID is still starting or unhealthy. Stop it before relaunching." >&2
  exit 1
fi
# A PID can be reused by another application; never kill it on the basis of an
# old file. Remove the stale file without touching the unrelated process.
rm -f "$PID_FILE"

PORT=''
for candidate in {8000..8015}; do
  if ! lsof -nP -iTCP:"$candidate" -sTCP:LISTEN >/dev/null 2>&1; then
    PORT="$candidate"
    break
  fi
done
[[ -n "$PORT" ]] || { echo 'All ports 8000-8015 are in use.' >&2; exit 1; }

mkdir -p "$ROOT/data"
LOG="$ROOT/data/macos-server.log"
export CLIPXY4ALL_MAX_JOBS="${CLIPXY4ALL_MAX_JOBS:-2}"
cd "$ROOT"
"$PY" -m uvicorn app.main:app --host 127.0.0.1 --port "$PORT" >> "$LOG" 2>&1 &
SERVER_PID=$!
printf '%s %s\n' "$SERVER_PID" "$PORT" > "$PID_FILE"

READY=false
for ((attempt=0; attempt<40; attempt++)); do
  if ! kill -0 "$SERVER_PID" 2>/dev/null; then break; fi
  if healthy "$SERVER_PID" "$PORT"; then READY=true; break; fi
  sleep 0.25
done
if [[ "$READY" != true ]]; then
  echo "Clipxy4all failed to start. Check $LOG" >&2
  if is_our_server "$SERVER_PID"; then kill "$SERVER_PID" 2>/dev/null || true; fi
  wait "$SERVER_PID" 2>/dev/null || true
  clear_tracked_pid "$SERVER_PID"
  exit 1
fi

# Release the launch lock before waiting for the server so a second double-click
# opens the already running app rather than creating another instance.
rmdir "$LOCK_DIR"
trap 'clear_tracked_pid "$SERVER_PID"' EXIT
echo "Clipxy4all running on http://127.0.0.1:$PORT (PID $SERVER_PID)"
open "http://127.0.0.1:$PORT"
wait "$SERVER_PID" || true
