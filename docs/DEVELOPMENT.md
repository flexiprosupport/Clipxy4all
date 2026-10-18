# Working on Clipxy4all from this repository

`README.md` is the end-user Windows guide that ships with the installer. This
file is for whoever is editing the code.

## What is in here, and what is not

This repository holds the **source-level files only** — the Python backend, the
frontend sources, the caption renderer and the tests. Everything the installer
bundles is deliberately absent, because it is third-party and large:

| Not in the repo | Size | Where it comes from |
|---|---|---|
| `python/` | ~2.4 GB | Embedded CPython plus site-packages, laid down by the installer |
| `downloads/`, `clips/`, `transcripts/`, `temp/` | varies | Created at runtime |
| `models/` | ~464 MB | Bundled faster-whisper weights |
| `ffmpeg/` | ~140 MB | Bundled FFmpeg build |
| `assets/` | ~130 MB | Fonts, b-roll, masks, the YuNet face model |
| `node/` | ~90 MB | Bundled Node runtime for the caption renderer |
| `node_modules/` | ~52 MB | `npm install` in `web/` and `caption_renderer/` |
| `web/dist/assets/` | ~500 KB | Output of `npm run build` in `web/` |

To get a working tree, clone this repo over an installed copy of the app, or
copy the missing folders in from one.

Two honest caveats about the frontend:

* `web/src/dashboard.js` is a single large bundled file, not a hand-written
  module tree. Edits to it are surgical, which is why the features added here
  live in `web/src/enhancements.jsx` and are mounted from `dashboard.js` at a
  handful of named points.
* `web/dist/index.html` also references `assets/index-*.css`, a stylesheet from
  the original upstream build that `web/build.mjs` does not regenerate. Keep that
  file from an installed copy.

## Running it

```
# backend (from the app root, with the bundled runtime present)
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000

# frontend bundle, after editing anything under web/src/
cd web && npm install && npm run build
```

On Windows, `Clipxy4all.vbs` / `Launch.ps1` do both of these plus the port and
browser handling.

## Tests

```
python tests/test_queue.py        # queue, concurrency, cancellation, restart
python tests/test_persistence.py  # SQLite history: throttling, pruning, recovery
python tests/test_render.py       # black/white canvas in the exported mp4
node   tests/test_captions.mjs    # every caption style draws visible pixels
```

`test_queue.py` and `test_persistence.py` are pure standard library and run
anywhere Python 3.9+ and the app's imports are available. `test_render.py` needs
FFmpeg; `test_captions.mjs` needs `caption_renderer/node_modules` installed for
the current platform.

## Configuration

| Variable | Default | Effect |
|---|---|---|
| `CLIPXY4ALL_MAX_JOBS` | `2` | How many clips render at once (clamped 1–8) |
| `CLIPXY4ALL_HISTORY_LIMIT` | `200` | How many finished tasks the Processing list remembers |
| `CLIPXY4ALL_JOB_DB` | `data/processing.sqlite3` | Where the task history lives |

## How background processing fits together

`app/jobs.py` owns a single daemon dispatcher thread. Submitting a video creates
a `Job`, writes a snapshot to SQLite and wakes the dispatcher, which starts work
only while fewer than `CLIPXY4ALL_MAX_JOBS` are running; the rest sit in
`queued` and start as slots free. Each job renders into its own
`clips/<clip_id>/` directory with per-render temp names, so concurrent FFmpeg
runs cannot overwrite each other.

`app/job_store.py` persists each job's request and latest snapshot. In-flight
progress is rate limited so a download's chunk-by-chunk progress does not hammer
the disk; terminal states are always written immediately. On startup,
`jobs.initialize()` restores the history and marks anything still `queued` or
`running` as `interrupted`, since the process that owned it is gone.

The frontend polls `GET /api/jobs`, which returns the snapshots plus the current
concurrency limit. `ProcessingPanel` in `web/src/enhancements.jsx` renders that
as a collapsible panel mounted outside the page router, so it survives
navigation and collapsing it never stops any work.

See `docs/verification-2026-10-18.md` for the change set and its test results.
