# Clipxy4all — background processing, multi-task management, video background colour

**Date:** 18 October 2026
**Application root:** `C:\Users\osama\Documents\Codex\2026-10-17\i-want-from-in-to-out-3\outputs\Clipxy4all`
**This folder:** the changed source files, diffs, tests and captured test output.

Nothing was redesigned. The navigation sidebar, the Dark/Light theme, the clip
selection algorithm, the ffmpeg render graph and every existing screen are
untouched. The work is three additions and one bug fix, all inside the existing
FastAPI + React structure.

---

## 1. Where the features live

| Concern | File | What was added |
|---|---|---|
| Canvas colour in the render | `app/clipper.py` | `ClipOptions.video_background`; the two places that paint canvas/padding take the colour instead of a hard-coded `black` |
| Colour in the API contract | `app/models.py`, `app/main.py` | `GenerateRequest.video_background`, `ReframeRequest.video_background`, returned by `GET /api/clip/{id}/{i}/reframe` |
| Colour through the pipeline | `app/jobs.py` | Passes `req.video_background` into `ClipOptions` and into the saved reframe recipe |
| Queue, concurrency, cancellation | `app/jobs.py` | Dispatcher thread, `MAX_JOBS`, `_RUNNING`, `initialize()`, `shutdown()`, `_trim_history()` |
| Durable task history | `app/job_store.py` *(new)* | SQLite snapshot store with write throttling, pruning and tolerant restore |
| Job list endpoint | `app/main.py` | `GET /api/jobs` → `{jobs: [...], max_concurrent: n}`; `jobs.initialize()` on startup, `jobs.shutdown()` on exit |
| Processing sidebar, colour control | `web/src/enhancements.jsx`, `web/src/enhancements.css` | `ProcessingPanel`, `CanvasControl`, `ReframeBackground`, `EnhancementShell` |
| Wiring into the shipped dashboard | `web/src/dashboard.js` | Mount points only — the existing components are reused, not replaced |

### Video background colour

Only two places in the whole render graph ever produce empty canvas, and both now
read the option:

```
app/clipper.py:461   color=c={opts.video_background}:s={width}x{height}[v_bg]   # rounded-corner backdrop
app/clipper.py:488   drawbox=0:0:iw:ih:{opts.video_background}:t=fill[bg]       # square-reel 9:16 canvas
```

Crop mode scales to *cover* and centre-crops, so it has no padding at all and is
unaffected. Split-screen fills both halves and is likewise unaffected. The video
itself is never cropped, scaled or covered to apply a colour, and the default
stays `black`, so existing behaviour is unchanged unless the user picks White.

The control appears in the existing editing workflow (Settings step) and again in
the Reframe editor, and the phone preview repaints immediately — it is bound to
the same state the request sends. This is the **video** canvas only; the app's
Dark/Light theme was not touched.

### Background processing

`app/jobs.py` keeps the original `Job` object and pipeline. What changed is who
starts them: a single daemon dispatcher thread takes queued jobs in creation
order and starts at most `MAX_JOBS` at a time.

```
MAX_JOBS = max(1, min(8, int(os.environ.get("CLIPXY4ALL_MAX_JOBS", "2"))))
```

Default 2, configurable by environment variable, hard-capped at 8. Everything
beyond the limit waits as `queued` and starts the moment a slot frees. Each job
already had its own id and its own `clips/<clip_id>/` directory; per-render
temp files are namespaced by a render token, and the one piece of shared state
left — the cached rounded-corner mask — is now built under a lock, so two
simultaneous ffmpeg runs cannot see a half-written mask.

Cancellation is per job (`POST /api/cancel/{id}`), and a crashing job is caught
in the worker and turned into `error` without touching anything else.

### Durable history

`app/job_store.py` writes each job's request and latest snapshot to
`data/processing.sqlite3` (standard-library `sqlite3`, WAL, no new dependency and
no service to run). On startup `jobs.initialize()` reloads them; anything left
`queued` or `running` becomes **interrupted** with an explanatory message, since
the process that owned it is gone. Finished clips stay in the Library because the
files on disk are untouched.

Three things were tightened during this pass (see `patch_hardening.py`):

* **Write throttling.** yt-dlp fires its progress hook per chunk, so a download
  produced thousands of SQLite writes. In-flight snapshots are now written at
  most every 0.4 s; terminal states, the first write and published clips always
  go to disk immediately. 400 progress updates now cost fewer than 50 writes.
* **Bounded history.** `prune()` keeps the newest 200 jobs
  (`CLIPXY4ALL_HISTORY_LIMIT`), in the table and in memory, so the list and the
  startup scan cannot grow without limit.
* **Tolerant restore.** A row this build cannot parse is skipped with a warning
  instead of raising during startup.

### Collapsible processing sidebar

`ProcessingPanel` renders a fixed panel plus a toggle button, outside the page
router, so it survives navigation between Create / Captions / Library and never
replaces the existing navigation sidebar. It polls `GET /api/jobs` every second
and shows name, status, progress percentage, progress bar, message, a Cancel
button for queued/running work and an Open Library link once clips exist.
Statuses rendered: Queued, Processing, Completed, Failed, Cancelled, Interrupted.
Collapsing only hides the panel — nothing is cancelled — and the open/closed
choice is remembered in `localStorage`.

### Bug fix: caption style previews were cut in half

Reported during this session. The style-picker tile is a short wide strip
(~166 × 62 CSS px), but the thumbnail canvas was 360 × 270 with
`height: 100%`, which resolves to `auto` inside a parent with no definite
height. The canvas rendered 124 px tall inside a 70 px clipping box, so the
lower half of every sample — including the text — was hidden behind the tile
label. The thumbnail now renders at the tile's own aspect ratio with
`max-height: 100%`, and uses an absolute `font_size` because the engine derives
glyph size from canvas height, which made a relative scale unreadable in a short
strip. Samples are now fully visible, legible and the same size on every tile.

---

## 2. Test results (actually run, not predicted)

Two environments were used: the app **running live on this Windows machine**
(`127.0.0.1:8027`, CUDA, real renders) for the end-to-end behaviour, and a
headless Python run of the test suite for the deterministic cases.

### Live, on Windows — real jobs, real ffmpeg output

| # | Test | Result |
|---|---|---|
| 6 | Start Video A → processing begins | **PASS** — `running`, stage `rendering` |
| 7 | Start Video B while A runs | **PASS** — both `running` together |
| 8 | Start Video C with both slots busy | **PASS** — `queued`, started automatically when a slot freed |
| 9 | Navigate to another page while processing | **PASS** — moved to Library; job stayed `running`, panel stayed visible |
| 10 | Cancel one job mid-render | **PASS** — "Video D" → `cancelled`, "Video E" kept running and finished with 2 clips |
| 11 | Simulate a failure | **PASS** — "Video F" → `error` ("The uploaded file could not be found."); other jobs unaffected |
| — | Collapse the sidebar while a job runs | **PASS** — panel hidden, job advanced from 0.74 → done; reopened intact |
| 13 | Black and white selection | **PASS** — A and C rendered black, B rendered white |
| 14 | Colour present in the exported clip | **PASS** — see pixel probes below |

Pixel probe of the three exported files (top and bottom padding, plus the centre
of the picture, read straight out of the mp4s):

```
Video A (black)  1080x1920 24fps  pad #000000 / #000000   centre rgb(22,34,58)
Video B (white)  1080x1920 24fps  pad #ffffff / #ffffff   centre rgb(22,34,58)
Video C (black)  1080x1920 24fps  pad #000000 / #000000   centre rgb(22,34,58)
```

Same dimensions, same frame rate, identical picture pixels — only the padding
changed. Frames are in `evidence/`.

### Headless suite

`tests/test_queue.py` — **PASS**

```
two concurrent jobs · third queued · cancel isolated · queue advances ·
failure isolated · history survives restart · active and queued become interrupted
history: A=cancelled  B=done  C=done  Failure=error
         Restart=interrupted  Restart2=interrupted  QueuedRestart=interrupted
```

Test 12 (restart) is covered here properly: the test starts jobs, then reads the
history back **in a fresh interpreter**, exactly as after an abrupt exit. Finished
outcomes survive and everything that was running or queued comes back as
`interrupted`.

`tests/test_persistence.py` (new) — **PASS**

```
progress_updates: 400          snapshots_written: <50 (throttled to one per 0.4s)
terminal_state_persisted: done clip_published_immediately: true
history_rows: 32 → 10 after prune(keep=10)
unreadable_row: skipped, 10 good rows still loaded
```

`tests/test_render.py` background section — **PASS**

```
black: padding rgb(0,0,0)      video rgb(0,0,254)    1080x1920 h264
white: padding rgb(255,255,255) video rgb(0,0,254)   1080x1920 h264
```

Full captured output is in `test-output/`.

### 15. Windows and macOS

* **Windows** — verified live on this machine: the running server handled the
  concurrency, cancellation, failure and colour tests above.
* **Linux/POSIX** — the whole headless suite runs on Linux, which exercises the
  same non-Windows code path macOS takes (`os.name != "nt"`): POSIX ffmpeg and
  node lookups, `creationflags=0`, forward-slash paths.
* **macOS** — not executed; no Mac was reachable from this session. The new code
  is standard-library `threading`, `sqlite3` and `pathlib` with no Windows-only
  calls, and every platform branch it touches is the one Linux just ran, but that
  is reasoning, not a test result.

---

## 3. What you need to do

1. **Restart Clipxy4all.** The running server still has the old modules in
   memory. The queue hardening and the refreshed caption catalog only take effect
   after a restart. The frontend changes are already live (static files).
2. After the restart the **Animated** caption category will fill up (64 styles) —
   it currently shows empty only because the running process loaded the catalog
   before it was updated.
3. Optional: `set CLIPXY4ALL_MAX_JOBS=3` before launching to raise the
   concurrency limit (1–8), and `CLIPXY4ALL_HISTORY_LIMIT` to change how many
   jobs are remembered.

Two small notes:

* `web/dist/assets/` has accumulated superseded bundles from earlier builds
  (`clipxy4all-KD2F6B6K.js`, `clipxy4all-RE52SE7D.js`, `clipxy4all-bbcc946079.js`
  and two old CSS files). `index.html` points only at the current one; the rest
  can be deleted. I could not remove them myself — deleting files on this machine
  is not permitted to this session.
* With a white canvas, white caption presets sitting in the padding band are low
  contrast. That is a styling choice, not a defect; the caption colour control is
  unchanged.

---

## 4. Folder contents

```
modified/      the changed source files, at their paths under the app root
diffs/         unified diffs against work/baseline (pre-feature snapshot)
               note: clipper.py / captions.py hunks also contain the earlier
               canvas-caption work that was already in this build
tests/         (under modified/) the three test scripts
test-output/   captured output of each test run
evidence/      frames pulled from the exported clips, black vs white
patch_hardening.py   the reproducible script for this session's backend changes
```
