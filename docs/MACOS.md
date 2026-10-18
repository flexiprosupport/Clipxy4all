# Running Clipxy4all on macOS

There is no macOS installer. The Windows build is a bundle: it ships its own
CPython, FFmpeg, Node and a Windows-only native canvas module, and it is
packaged with Inno Setup, which only produces `.exe` files. None of that
crosses to a Mac.

The application code does. Every platform-specific branch in `app/` is guarded
(`os.name`, `sys.platform`), the POSIX paths are already written, and the whole
backend test suite — queue, concurrency, cancellation, restart recovery and the
black/white canvas render — runs green on Linux, which takes the same code path
macOS does. So the work on a Mac is supplying the runtimes, not porting.

**Not yet run on a real Mac.** The steps below follow from the code and from a
verified Linux run. Expect to debug a dependency or two the first time, and
please open an issue with what you hit.

## Setup

Requires [Homebrew](https://brew.sh). From a clone of this repository:

```bash
bash scripts/macos/setup.sh
```

It installs `python@3.11`, `ffmpeg` and `node` if missing, creates a
`.venv-macos` virtual environment, installs the Python dependencies, fetches
the macOS build of the caption renderer's native canvas, and writes two
double-clickable launchers.

## The AI model is not in this repository

`app/paths.py` sets `HF_HUB_OFFLINE=1`, so the app never downloads anything at
runtime — the Whisper weights have to be present before first use. They are not
in Git because they are about 464 MB of third-party files.

Copy the whole `models` folder out of a Windows install of Clipxy4all (it sits
beside `app/`, `ffmpeg/` and `python/`) into the root of your clone. The weights
are platform-neutral — the same files load on macOS.

`assets/` (fonts, b-roll, the face-detection model) is likewise not in Git.
Copy it the same way if you want captions in the bundled fonts, b-roll for
split-screen, or face tracking.

## Running

Double-click **Clipxy4all.command** in the project root. It picks a free port
from 8000–8015, starts the server and opens your browser at it.
**Stop Clipxy4all.command** stops it. Closing the browser tab does not.

## What differs from Windows

| | Windows | macOS |
|---|---|---|
| Transcription | NVIDIA GPU, float16 | CPU, int8 — there is no CUDA on macOS |
| Rendering | FFmpeg, same filters | FFmpeg, same filters |
| Install | one `.exe` | Homebrew + this script |
| Launcher | `.vbs` / `Launch.ps1` | `.command` scripts |

Leave the **Compute** setting on Auto. `load_model('auto')` tries the GPU, finds
none, and falls back to CPU int8 on its own. Transcription will be noticeably
slower than on an NVIDIA machine; rendering speed is roughly the same, since
that is FFmpeg either way. Apple Silicon is not used for transcription —
CTranslate2 has no Metal backend.

## Known rough edges

- **Apple Silicon vs Intel.** CTranslate2 publishes wheels for both, but the
  arm64 ones are newer. If `pip install faster-whisper` fails, check which
  CTranslate2 version resolved and pin an older one.
- **Gatekeeper.** macOS will refuse to run a downloaded `.command` on first
  double-click. Right-click it and choose Open, or run
  `xattr -d com.apple.quarantine Clipxy4all.command`.
- **Background processing is unaffected.** The queue is plain `threading` and
  `sqlite3` from the standard library, with no platform-specific code.

## Building a macOS bundle

Not done here. If you want a drag-to-Applications `.app`, the pieces are a
`py2app` or PyInstaller build of `app/`, a copy of `models/` and `assets/`,
Homebrew's FFmpeg and Node binaries relocated into the bundle, and a signed and
notarised `.dmg`. That is a separate project from this script.
