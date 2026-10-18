# Third-party licences

## Why this file exists

ClipShlip bundles FFmpeg. FFmpeg can be built under **LGPL** or **GPL**
depending on which libraries are compiled in. Bundling a GPL build — most
commonly one containing `libx264` or `libx265` — would place the **entire
application** under the GPL and require ClipShlip's own source to be released.

**Only LGPL FFmpeg builds may be bundled.** Anything carrying `--enable-gpl`,
`--enable-nonfree`, `libx264` or `libx265` is disqualified.

Because H.264 encoding cannot come from x264, it comes from the platform's
hardware encoder instead:

| Platform | Encoder                                                     |
| -------- | ----------------------------------------------------------- |
| macOS    | `h264_videotoolbox`                                         |
| Windows  | `h264_nvenc` (NVIDIA), `h264_qsv` (Intel), `h264_amf` (AMD) |
| Fallback | `mpeg4` — LGPL-safe, built in, noticeably lower quality     |

The fallback is surfaced in the UI rather than hidden, so a user on a machine
with no hardware encoder knows why their exports look worse.

---

## FFmpeg — Windows (win32-x64)

- **Source:** [BtbN/FFmpeg-Builds](https://github.com/BtbN/FFmpeg-Builds), `win64-lgpl` variant
- **Pinned release:** `autobuild-2026-07-30-13-32`
- **Asset:** `ffmpeg-N-125856-g2ae2413488-win64-lgpl.zip`
- **Licence:** LGPL-2.1-or-later
- **SHA-256:** `f92dea748d595e095e1a9c75176877263c10d047941000674608ab5d1ee49e4e`
- **Verification:** the checksum above was computed from the downloaded archive
  and is pinned in `scripts/download-binaries.ts`. `ffmpeg.exe`'s embedded
  configuration string was read directly and contains **no** `--enable-gpl` and
  **no** `--enable-nonfree`, with these explicit exclusions:

  ```
  --disable-libx264 --disable-libx265 --disable-libxvid --disable-libfdk-aac
  --disable-libdavs2 --disable-libxavs2 --disable-avisynth --disable-frei0r
  --disable-librubberband --disable-libvidstab
  ```

  Hardware encoders confirmed enabled: `--enable-ffnvcodec` + `--enable-cuda-llvm`
  (NVENC), `--enable-libvpl` (Intel Quick Sync), `--enable-amf` (AMD).

  Note `--enable-version3`: some bundled components are LGPL **v3** rather than
  v2.1. Still LGPL, still not GPL.

An immutable `autobuild-*` tag is used deliberately. The `latest` tag is
rebuilt daily, so a pinned checksum against it would break within a day.

## FFmpeg — macOS (darwin-arm64)

**Built from source** by `scripts/build-ffmpeg-macos.sh`, not downloaded.

No reputable static, self-contained, LGPL macOS arm64 build appears to exist.
Every mainstream distributor was checked and rejected:

| Distributor                                                                               | Verdict                                                                                                                                         |
| ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| [osxexperts.net](http://www.osxexperts.net/)                                              | GPL — `--enable-gpl --enable-libx264`                                                                                                           |
| [ffmpeg.martin-riedl.de](https://ffmpeg.martin-riedl.de/)                                 | GPL — ships `libx264` and `libx265`                                                                                                             |
| [evermeet.cx](https://evermeet.cx/ffmpeg/)                                                | GPL                                                                                                                                             |
| `eugeneware/ffmpeg-static`                                                                | GPL, plus `--enable-nonfree`                                                                                                                    |
| [descriptinc/ffmpeg-ffprobe-static](https://github.com/descriptinc/ffmpeg-ffprobe-static) | Repackages osxexperts → GPL                                                                                                                     |
| conda-forge `ffmpeg=*=lgpl_*`                                                             | Genuinely LGPL (`--disable-gpl`), but dynamically linked against 31 external dylibs (openvino, librsvg, cairo, glib, shaderc…) — not bundleable |

The build therefore uses upstream FFmpeg source with GPL explicitly disabled:

```
--disable-gpl
--disable-nonfree
--disable-version3
--enable-videotoolbox
--enable-audiotoolbox
--disable-shared --enable-static
--disable-doc --disable-ffplay
```

No external libraries are linked, so the result depends only on macOS system
frameworks and is self-contained. The build script re-reads the binary's own
`configuration:` line afterwards and **fails** if any GPL or nonfree component
appears, so this cannot silently regress.

- **Upstream:** <https://ffmpeg.org/releases/> — `ffmpeg-8.1.2.tar.xz`
- **Licence:** LGPL-2.1-or-later

## ⚠️ The two platforms run different FFmpeg builds

| Platform | Build | Source |
| -------- | ----- | ------ |
| macOS (darwin-arm64) | **8.1.2** release, compiled from source | `scripts/build-ffmpeg-macos.sh` |
| Windows (win32-x64)  | **N-125856-g2ae2413488**, a master snapshot | BtbN `autobuild-2026-07-30-13-32` |

**This divergence has already caused one production failure.** `-vsync 0` is
deprecated-but-present on 8.1.2 and REMOVED from the master snapshot, so face
detection died on Windows with `Unrecognized option 'vsync'` — after the
worker had started, the model had loaded and the handshake had completed. The
flag is now `-fps_mode passthrough`, which both accept, and
`electron/services/ffmpegCapabilities.ts` probes real invocations at startup so
the next one is caught in a second rather than mid-run.

**Converging them is one asset name.** The pinned immutable tag already carries
a release-branch build:

```
autobuild-2026-07-30-13-32
  ffmpeg-N-125856-g2ae2413488-win64-lgpl.zip        ← pinned today (master)
  ffmpeg-n8.1.2-32-gcfa62de001-win64-lgpl-8.1.zip   ← 8.1.2, matches macOS
```

Switching `scripts/download-binaries.mjs` to the second asset would put both
platforms on 8.1.2. It has not been done here because it needs a SHA-256
computed from a real download and a run on an actual Windows machine to confirm
the encoder set is unchanged — neither of which can be faked from macOS. Until
then the divergence is at least visible: the capability probe records the
resolved version string in `ffmpeg-capabilities.json` and logs it at startup.

## LGPL obligations

FFmpeg is distributed as a **separate executable** invoked via `spawn()`. It is
not linked into ClipShlip's own binary. Obligations we meet:

1. This notice, identifying FFmpeg and its licence.
2. The exact upstream source URL and build flags recorded above, so the
   bundled binary can be reproduced.
3. No modification to FFmpeg itself.

A copy of the LGPL-2.1 text ships with each build under
`resources/binaries/<platform>/` where the upstream archive provides one.

## H.264 encoders, and why there is no libx264

| Encoder             | Where it comes from        | Licence          | Used when                          |
| ------------------- | -------------------------- | ---------------- | ---------------------------------- |
| `h264_nvenc`        | NVIDIA driver              | vendor driver    | an NVIDIA card that opens it       |
| `h264_qsv`          | Intel Media SDK / driver   | vendor driver    | Intel Quick Sync works             |
| `h264_amf`          | AMD driver (`amfrt64.dll`) | vendor driver    | AMD AMF works                      |
| `h264_mf`           | Windows Media Foundation   | part of Windows  | any Windows 10/11 machine          |
| `h264_videotoolbox` | macOS                      | part of macOS    | any Mac                            |
| `libopenh264`       | Cisco OpenH264, in FFmpeg  | BSD-2-Clause     | no hardware encoder opens          |
| `mpeg4`             | FFmpeg, built in           | LGPL             | last resort                        |

Each is TRIED, in that order, and the first that really encodes is used — see
`electron/services/encoders.ts`. None of them is libx264, and none may ever be:
libx264 is GPL, and bundling it would make ClipShlip GPL.

`libopenh264` is BSD-2-Clause and therefore raises no copyleft question. Note
that H.264 is a patented format regardless of which encoder produces it; that is
equally true of every hardware encoder above, all of which are licensed by their
vendors, and is not altered by this file.

## Microsoft Visual C++ runtime (Windows only)

| File                  | Ships? | Size    |
| --------------------- | ------ | ------- |
| `vcruntime140.dll`    | yes    | ~180 KB |
| `vcruntime140_1.dll`  | yes    | ~50 KB  |
| `msvcp140.dll`        | yes    | ~640 KB |

whisper.cpp's official Windows binaries link the Microsoft C runtime
dynamically, so `whisper-cli.exe` cannot start on a Windows machine where the
Visual C++ Redistributable has never been installed — the process dies at image
load with `0xC0000135` before any of its own code runs.

These three files are therefore carried beside `whisper-cli.exe` and staged by
`scripts/download-binaries.mjs`. This is **app-local deployment**, the form of
redistribution Microsoft documents for exactly this case; they are unmodified
copies taken from the machine that builds the release. Windows resolves an
app-local DLL ahead of the system copy, so on a machine that already has the
runtime these files change nothing.

Deliberately NOT done: downloading and running `vc_redist.x64.exe`. That is a
machine-wide install requiring administrator rights, and ClipShlip's installer
is per-user specifically so that it never asks for them (see RELEASE.md,
"Signing").

## YouTube import — yt-dlp

| Component | Licence | Ships in the installer? | Size |
| --------- | ------- | ----------------------- | ---- |
| `yt-dlp`  | Unlicense (public domain) | **no** | ~18 MB |

⚠️ **Not bundled, and that is a technical decision rather than a licensing one.**
The Unlicense would permit bundling. yt-dlp is fetched by the user's own machine
on first import instead because YouTube deliberately breaks downloaders and
yt-dlp answers with releases every few weeks — a copy frozen into an installer
is stale before most people run it.

The initial download is pinned to a specific release and verified against a
SHA-256, exactly as FFmpeg and whisper.cpp are, so what lands on disk is
reproducible. Afterwards, **Settings → YouTube import → Update** runs yt-dlp's
own `-U`, which is how the feature survives between ClipShlip releases.

Pinned in `electron/services/youtube.ts`:

```
yt-dlp 2026.07.04
  win32  https://github.com/yt-dlp/yt-dlp/releases/download/2026.07.04/yt-dlp.exe
         sha256 52fe3c26dcf71fbdc85b528589020bb0b8e383155cfa81b64dd447bbe35e24b8
  darwin https://github.com/yt-dlp/yt-dlp/releases/download/2026.07.04/yt-dlp_macos
         sha256 498bd0dae17855c599d371d68ec5bafc439a9d8640e838be25c765a9792f261b
```

**On terms of service.** Downloading from YouTube is against YouTube's Terms of
Service. ClipShlip offers it for one case — a video the user made, or holds the
rights to — and requires an explicit attestation to that effect before every
import. The attestation is enforced at the IPC boundary as well as in the UI,
and is deliberately not remembered between imports. Nothing here is a legal
opinion, and the honest position is stated in the app: for anything you did not
make, download it through YouTube Studio instead.

## Face detection — MediaPipe

| Component                                    | Licence    | Ships? | Size     |
| -------------------------------------------- | ---------- | ------ | -------- |
| `@mediapipe/tasks-vision` (JS + SIMD WASM)   | Apache-2.0 | yes    | 11.5 MB  |
| `blaze_face_full_range.tflite`               | Apache-2.0 | yes    | 1.03 MB  |
| `blaze_face_short_range.tflite`              | Apache-2.0 | yes    | 0.22 MB  |

Apache-2.0 is permissive: it imposes no copyleft and nothing about it obliges
ClipShlip to release source. Attribution here satisfies it.

**Ultralytics YOLOv8/v11 was rejected on licence grounds, not technical ones.**
It is AGPL-3.0 — strong copyleft that reaches across a network boundary. Using
it would force ClipShlip itself to be AGPL or require a paid commercial licence
from Ultralytics. It must not be added, in any form, at any later step.

The package ships three WASM variants (SIMD, no-SIMD, and a module build)
totalling roughly 36 MB unpacked. Only the SIMD build is copied into
`src/public/mediapipe/`, because every platform ClipShlip targets has SIMD.
Note that MediaPipe *probes* for SIMD by instantiating a small WebAssembly
module, so a Content-Security-Policy without `'wasm-unsafe-eval'` makes it
conclude the machine has no SIMD and reach for the variant we do not ship —
see the CSP comment in `src/index.html`.

MediaPipe also attempts to POST usage telemetry to
`https://odml.pa.googleapis.com/v1/log`. The renderer CSP `connect-src` blocks
it, and the block was confirmed in the log rather than assumed. ClipShlip sends
nothing to Google.

## Active speaker detection — LR-ASD and onnxruntime-web

| Component                          | Licence | Ships? | Size    |
| ---------------------------------- | ------- | ------ | ------- |
| LR-ASD weights → `lrasd.onnx`      | MIT     | yes    | 3.37 MB |
| `onnxruntime-web` (SIMD WASM)      | MIT     | yes    | 12.9 MB |

LR-ASD is [github.com/Junhua-Liao/LR-ASD](https://github.com/Junhua-Liao/LR-ASD),
MIT, © 2025 Liao Junhua — the IJCV 2025 successor to Light-ASD (CVPR 2023).
`resources/models/lrasd.onnx` is converted from that repository's
`weight/finetuning_TalkSet.model` by `scripts/export-lrasd.py`, which documents
the two source substitutions the conversion needs and proves both numerically
identical to the original. MIT permits redistribution of the converted weights
with attribution, which this section is.

The repo also vendors an S3FD face detector. ClipShlip does **not** use it —
face tracks come from MediaPipe (P14) — so none of that code or its weights is
in this build.

onnxruntime-web is Microsoft's, MIT. Only `ort-wasm-simd-threaded.wasm` ships;
the package's WebGPU, asyncify and JSPI variants total another 62 MB and are
never referenced.

**Rejected on licence grounds:** nothing here required it, but for the record,
pyannote's speaker-diarization models are gated behind Hugging Face terms
acceptance, which is not a licence a shipped desktop app can satisfy on a
user's behalf.

## The phone in the preview — 3D model

The handset the Compose preview is drawn inside is a third-party model, not our
artwork.

  **Phone 17 Pro Max** — by **Ranguel**
  https://sketchfab.com/3d-models/phone-17-pro-max-66809964eff043a39d553c3795995008
  Licence: **Creative Commons Attribution (CC-BY 4.0)**
  https://creativecommons.org/licenses/by/4.0/

Shipped as `models/phone_17_pro_max.glb` (the 1k-texture GLB conversion,
9.4 MB), loaded by `src/components/organisms/PhoneModel.tsx`.

⚠️ **CC-BY PERMITS COMMERCIAL USE AND REQUIRES CREDIT, WHICH IS WHY THIS
SECTION EXISTS.** The licence is satisfied by naming the author and the licence
and linking to both — which this does, in a file that ships inside the app (see
the `files` allowlist in electron-builder.yml). Removing this section while
still shipping the model would be a breach, not an oversight.

The model is decoration: it draws the chassis around the preview and nothing
else. It is not used to compute anything about the exported file, so replacing
it with different artwork is a self-contained change.

Also under `models/`: `README.txt`, which records which of Sketchfab's five
downloads was taken and why. It is a few hundred bytes and ships with the
model deliberately, so the provenance travels with the file.

## Fonts

| Font                 | Licence                   | Used for                    |
| -------------------- | ------------------------- | --------------------------- |
| Inter                | SIL Open Font License 1.1 | UI, and the default captions |
| Montserrat           | SIL Open Font License 1.1 | Caption styles              |
| Anton                | SIL Open Font License 1.1 | Caption styles              |
| Playfair Display     | SIL Open Font License 1.1 | Editorial captions, outro cards |
| Caveat               | SIL Open Font License 1.1 | Script lower thirds, banners |
| Oswald               | SIL Open Font License 1.1 | Condensed title cards       |
| JetBrains Mono       | SIL Open Font License 1.1 | Typewriter title card       |
| Noto Nastaliq Urdu   | SIL Open Font License 1.1 | Urdu captions               |
| Noto Sans Devanagari | SIL Open Font License 1.1 | Hindi captions              |

Montserrat and Anton were added because they are the faces short-form
creators actually use, and a captioning tool that cannot produce the look
people are copying is missing its own point.

Playfair Display was added for the editorial caption family and the outro
cards, which had no serif face at all. It ships **two files**, the upright and
the italic, because its italic is a separate design rather than a slanted
upright: measured from the font's own tables, `PlayfairDisplay-Italic[wght].ttf`
reports an italic angle of −14° and sets the italic bit in `head.macStyle`,
while the upright reports 0°. Declaring only the upright and letting the
browser synthesise an italic would shear the upright and lose the thick/thin
contrast that is the whole reason the face was chosen.

Copyright 2017 The Playfair Display Project Authors, **with Reserved Font Name
"Playfair Display"** — so the name may not be used for a modified version.
ClipShlip ships it unmodified.

All three were taken from the Google Fonts repository and **the licence text was
read, not assumed from the folder name**: each declares "This Font Software is
licensed under the SIL Open Font License, Version 1.1". The full text of each
ships beside the font file as `resources/fonts/Montserrat-OFL.txt`,
`resources/fonts/Anton-OFL.txt` and `resources/fonts/PlayfairDisplay-OFL.txt`,
which is what OFL clause 2 requires of a redistributor.

Caveat, Oswald and JetBrains Mono were added for the timed overlays, where
the face IS the style: a handwritten lower third is handwritten because of
Caveat, and a typewriter title card is a typewriter because of JetBrains Mono.
Each licence was read the same way — all three declare "This Font Software is
licensed under the SIL Open Font License, Version 1.1" — and none of the three
carries a Reserved Font Name. JetBrains Mono was checked to be genuinely
monospaced rather than assumed from its name: `post.isFixedPitch` is set.

⚠️ **THE SCRIPT AND MONOSPACE FACES CANNOT DO THEIR JOB IN URDU OR HINDI.**
Verified from each `cmap`: Caveat, Oswald and JetBrains Mono each report **0
codepoints** in Arabic (U+0600–U+06FF) and **0** in Devanagari
(U+0900–U+097F). So a "handwritten script name" lower third rendered in Urdu
is not handwritten — it falls back to Noto Nastaliq and becomes a plain lower
third. That is stated on the template itself
(`OverlayTemplate.latinOnlyNote`) and surfaced in the UI, because a user
choosing "Signature Script" for an Urdu video should be told before they
export, not after.

⚠️ None of the Latin caption faces contains Arabic or Devanagari glyphs. This was checked
against each font's own `cmap` rather than assumed: Playfair Display reports
**0 codepoints** in the Arabic block (U+0600–U+06FF) and **0** in Devanagari
(U+0900–U+097F), in both the upright and the italic. A template that asks for one
of them still renders Urdu and Hindi in the Noto faces — see `fontFor` in
`shared/captions.ts`. Letting the request through would substitute a system
font, which renders *something* and therefore looks like a working caption
rather than a broken one.

## Verifying a build yourself

The app surfaces FFmpeg's full `configuration:` line on the **Settings**
screen, alongside a parsed verdict computed in the main process by
`shared/license.ts`.

The check matches **whole configure flags**, never substrings:
`--enable-gpl`, `--enable-nonfree`, `--enable-libx264`, `--enable-libx265`.
An earlier version substring-matched `libx264` and therefore flagged
`--disable-libx264` — declaring an LGPL-clean build GPL. That false positive
matters more than it sounds: a badge that cries wolf trains you to ignore it,
and a genuinely GPL build would then sail through.

The list is short on purpose. FFmpeg's own `configure` refuses to build when a
GPL-only library is enabled without `--enable-gpl`, so that flag is the
authoritative signal — everything else a build enables is LGPL-compatible by
construction. Enumerating GPL libraries by name is what produces false
positives: BtbN's LGPL build legitimately enables `libzvbi` and `libaribb24`.

The same whole-flag check runs inside `scripts/build-ffmpeg-macos.sh`, which
**fails the build** if a forbidden flag appears.

---

## Audio — background music

**Nothing is bundled.** ClipShlip ships no music tracks, and the Compose
screen says so where a library would otherwise sit.

A mood-categorised library was specified, with the constraint that every
bundled track be verifiably clear for commercial redistribution inside a paid
app — the same standard FFmpeg and the fonts are held to above. That standard
is not met by a "royalty-free" label on a download page: that is a claim by an
uploader, it is frequently wrong, and the liability follows whoever ships the
binary rather than whoever uploaded the file.

Track provenance cannot be verified from inside the build, so the upload path
ships instead: the user chooses a file from their own disk, which is
**referenced, never copied** — the same rule the source video follows. Volume
and speech-ducking work on any file.

When tracks can be verified they become rows in the music panel and entries
here, each with its source, licence and a link to the licence text. Nothing
else about the feature has to change.
