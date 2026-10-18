"""Durable snapshots for the single-process local job queue (standard-library SQLite)."""
from contextlib import contextmanager
import json
import logging
import os
import sqlite3
import threading
import time
from pathlib import Path
from .paths import ROOT_DIR

DB_PATH = Path(os.environ.get("CLIPXY4ALL_JOB_DB", str(ROOT_DIR / "data" / "processing.sqlite3")))

# A running job reports progress many times a second (yt-dlp fires its hook per
# chunk). Persisting every one of those would mean thousands of pointless disk
# writes per download, so in-flight snapshots are rate limited. Terminal states
# and the first write for a job always go to disk immediately, which is all the
# restart path actually reads back.
MIN_WRITE_INTERVAL = 0.4
# Keep the Processing list useful without letting the table grow forever.
HISTORY_LIMIT = int(os.environ.get("CLIPXY4ALL_HISTORY_LIMIT", "200"))
TERMINAL_STATES = ("done", "error", "cancelled", "interrupted")

_WRITE_LOCK = threading.Lock()
_LAST_WRITE: dict[str, float] = {}
logger = logging.getLogger("clipxy4all.job_store")

@contextmanager
def connection():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    db = sqlite3.connect(str(DB_PATH), timeout=20)
    db.execute("PRAGMA busy_timeout=20000")
    try:
        with db:
            yield db
    finally:
        db.close()

def initialize():
    with connection() as db:
        db.execute("PRAGMA journal_mode=WAL")
        db.execute("CREATE TABLE IF NOT EXISTS jobs (id TEXT PRIMARY KEY, created REAL NOT NULL, request TEXT NOT NULL, snapshot TEXT NOT NULL)")

def save(job, force: bool = False):
    # Caller holds the job's reentrant lock; snapshot and request are one revision.
    snapshot = job.snapshot()
    if not force and snapshot["status"] not in TERMINAL_STATES:
        now = time.monotonic()
        with _WRITE_LOCK:
            last = _LAST_WRITE.get(job.id)
            if last is not None and now - last < MIN_WRITE_INTERVAL:
                return
            _LAST_WRITE[job.id] = now
    else:
        with _WRITE_LOCK:
            _LAST_WRITE[job.id] = time.monotonic()
    with connection() as db:
        db.execute("INSERT INTO jobs VALUES(?,?,?,?) ON CONFLICT(id) DO UPDATE SET snapshot=excluded.snapshot",
                   (job.id, job.created_at, job.req.model_dump_json(), json.dumps(snapshot, ensure_ascii=False)))

def load():
    """Stored (request, snapshot) pairs, oldest first. Unreadable rows are skipped
    so a history file written by an older build can never block startup."""
    rows = []
    with connection() as db:
        for req, snap in db.execute("SELECT request,snapshot FROM jobs ORDER BY created"):
            try:
                rows.append((json.loads(req), json.loads(snap)))
            except (TypeError, ValueError):
                logger.warning("Skipping an unreadable processing-history row.")
    return rows


def prune(keep: int = HISTORY_LIMIT):
    """Drop everything older than the newest ``keep`` jobs."""
    with connection() as db:
        db.execute(
            "DELETE FROM jobs WHERE id NOT IN (SELECT id FROM jobs ORDER BY created DESC LIMIT ?)",
            (max(1, keep),),
        )


def forget(job_ids):
    """Delete specific jobs (used when trimming the in-memory registry)."""
    job_ids = list(job_ids)
    if not job_ids:
        return
    with connection() as db:
        db.executemany("DELETE FROM jobs WHERE id=?", [(i,) for i in job_ids])
    with _WRITE_LOCK:
        for job_id in job_ids:
            _LAST_WRITE.pop(job_id, None)
