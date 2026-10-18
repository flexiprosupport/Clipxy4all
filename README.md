# Clipxy4all — Windows quick start

Clipxy4all turns a video file or YouTube link into short, captioned clips. The AI model, caption fonts, Python runtime, and FFmpeg are included in the installer. No API key, separate Python installation, or model download is required.

## Download

### Windows

**[Download Clipxy4all Setup 3.6.1](../../releases/latest)** — 1.94 GB · Windows 10 or 11, 64-bit.

That one file contains everything: the app, the Python runtime, FFmpeg, the Whisper model, Node and the caption fonts. There is nothing else to download or install.

To check the file you downloaded, run this in PowerShell and compare the result:

```
Get-FileHash "Clipxy4all Setup 3.6.1.exe" -Algorithm SHA256

F6050395CE55D57B6EEF8D28EA8B0272E904CCEB2E541BC5C5E1597836F632FA
```

### macOS

**[Download Clipxy4all-macOS-bundle.zip](../../releases/latest)** — 595 MB · macOS 12 or newer, Apple Silicon or Intel.

There is no macOS installer. The zip carries the app, the Whisper model, the
fonts and the caption renderer. Unzip it, install [Homebrew](https://brew.sh) if
you do not have it, then right-click **SETUP-MAC.command** and choose Open. It
installs Python, FFmpeg and Node, and writes a `Clipxy4all.command` you
double-click to start.

Macs have no CUDA, so transcription runs on the CPU and is slower than on an
NVIDIA machine; rendering speed is unchanged. See [docs/MACOS.md](docs/MACOS.md).

---

This repository holds the source only, about 1.4 MB. The bundled runtimes and the AI model are deliberately not in Git — they ship inside the installer. See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) to work on the code.

## Install and open

1. Run `Clipxy4all Setup 3.6.1.exe` and complete the Windows installer.
2. Open **Clipxy4all** from the desktop or Start menu. The app opens your browser at a local address such as `http://127.0.0.1:8000`.
3. Upload a video file or paste a YouTube link, choose your clip settings, and select **Generate**. Your finished clips appear in **Library**.

Uploads and local AI processing work without internet. A YouTube link requires internet to download that source video. Clipxy4all does not send uploads or transcripts to an external AI service. The optional local Ollama integration is off by default.

## Computer requirements

- Windows 10 or 11, 64-bit.
- 8 GB RAM and about 10 GB free disk space are recommended, especially for longer videos.
- An Intel Core i3 8th generation or comparable CPU is a practical starting point. Processing time depends on video length and the computer's hardware.
- A dedicated GPU is optional. Auto mode uses a compatible NVIDIA GPU when available and falls back to CPU when GPU loading or transcription fails.

## Your files

Generated clips and library data are stored in the `clips` folder inside the location where you installed Clipxy4all (by default, `%LOCALAPPDATA%\Programs\Clipxy4all\clips`). Keep a separate copy of clips you want to preserve before uninstalling or changing computers. An earlier Clipxy4all installation has its own folder; its clips are not automatically moved into v3.6.

Use the **Stop Clipxy4all** Start menu item to stop the local server when you are done. Closing the browser tab alone does not stop it.

## If something goes wrong

- If the app does not open, try its desktop shortcut again. The launcher checks ports 8000–8015. If the server stops early, the dialog shows its last error; the full diagnostic log is at `%LOCALAPPDATA%\Clipxy4all\logs\startup.stderr.log`. Send that log with a support request.
- Install Clipxy4all in a folder your Windows account can write to. Its temporary work and completed clips are stored inside the installation folder.
