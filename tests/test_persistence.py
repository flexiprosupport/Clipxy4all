"""Durability behaviour of the processing history (app/job_store.py).

Covers the three things the SQLite snapshot layer has to get right:
  1. a running job's chatty progress updates must not hammer the disk,
  2. a terminal state must always be written, throttle window or not,
  3. the stored history is bounded, and a row this build cannot parse is
     skipped instead of blocking startup.

Run from the application root:  python tests/test_persistence.py
"""
import json
import os
import sqlite3
import sys
import tempfile
import time
from pathlib import Path

root = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(root))
os.environ["CLIPXY4ALL_JOB_DB"] = str(Path(tempfile.mkdtemp()) / "persistence.sqlite3")

from app import job_store  # noqa: E402
from app.models import GenerateRequest  # noqa: E402
from app.jobs import Job  # noqa: E402

job_store.initialize()
results = {}


def row_count():
    with job_store.connection() as db:
        return db.execute("SELECT count(*) FROM jobs").fetchone()[0]


def stored(job_id):
    with job_store.connection() as db:
        row = db.execute("SELECT snapshot FROM jobs WHERE id=?", (job_id,)).fetchone()
    return json.loads(row[0]) if row else None


# 1. Progress spam is throttled -------------------------------------------- #
job = Job(GenerateRequest(upload_id="u", upload_name="Throttled"))
job_store.save(job, force=True)
writes_before = stored(job.id)["rev"]
for i in range(400):
    job.set_stage("downloading", i / 400, f"Downloading... {i}")
persisted = stored(job.id)
assert job._rev == 400, job._rev
assert persisted["rev"] < 50, f"too many disk writes: rev {persisted['rev']} persisted"
results["progress_updates"] = job._rev
results["snapshots_written"] = "<50 (throttled to one per %.1fs)" % job_store.MIN_WRITE_INTERVAL

# 2. The terminal state always lands, immediately --------------------------- #
job.finish([{"index": 0, "url": "/clips/x/0.mp4"}])
final = stored(job.id)
assert final["status"] == "done", final["status"]
assert final["clips"] and final["finished_at"], final
results["terminal_state_persisted"] = final["status"]

# A clip published mid-run is never dropped by the throttle.
job2 = Job(GenerateRequest(upload_id="u", upload_name="Clips"))
job_store.save(job2, force=True)
job2.set_stage("rendering", 0.1, "Rendering...")
job2.add_clip({"index": 0, "url": "/clips/y/0.mp4"})
assert len(stored(job2.id)["clips"]) == 1, stored(job2.id)
results["clip_published_immediately"] = True

# 3. History is bounded ----------------------------------------------------- #
for i in range(30):
    extra = Job(GenerateRequest(upload_id="u", upload_name=f"Old {i}"))
    extra.created_at = time.time() - (10_000 - i)
    job_store.save(extra, force=True)
before_prune = row_count()
job_store.prune(keep=10)
after_prune = row_count()
assert after_prune == 10, after_prune
results["history_rows"] = {"before_prune": before_prune, "after_prune": after_prune, "keep": 10}

# 4. A row this build cannot read is skipped, not fatal --------------------- #
with job_store.connection() as db:
    db.execute("INSERT INTO jobs VALUES(?,?,?,?)", ("corrupt", time.time(), "{not json", "{also not json"))
loaded = job_store.load()
assert all(isinstance(req, dict) for req, _ in loaded), loaded
assert not any(snap.get("id") == "corrupt" for _, snap in loaded)
results["unreadable_row"] = "skipped, %d good rows still loaded" % len(loaded)

# 5. forget() drops specific jobs ------------------------------------------- #
victim = loaded[0][1]["id"]
job_store.forget([victim])
assert stored(victim) is None
results["forget"] = "ok"

print(json.dumps({"result": "PASS", "checks": results}, indent=2))
