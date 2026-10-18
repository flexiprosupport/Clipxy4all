# Recovered caption renderer

The user supplied ClipShlip 1.4.0 as the source of the missing caption styles.
Its verified catalog has 85 styles (64 regular, 15 multiline and 6 Premium).
These are added to BMG.CLIP-V3's existing 19 styles, giving 104 without changing
any legacy style IDs or saved presets. Imported IDs use the `studio:` prefix.

`engine.mjs` contains only the recovered pure caption drawing, layout, timing,
composition and palette helpers, extracted by static dependency analysis.
It excludes Electron, IPC, accounts, licensing, updater, network, filesystem,
application startup and bundled executable code. It is not a payment/license
bypass. The original application is marked UNLICENSED, author Ai-Haris; this
private adaptation does not imply general redistribution rights. The user
confirmed written permission to reuse the code in BMG.CLIP-V3. Source notices
are retained here; the visible app interface uses BMG.CLIP-V3 branding only.

`adapter.mjs` is shared by the browser preview and Node export driver. Export
uses Skia Canvas through the pinned `@napi-rs/canvas` dependency. Browser Canvas
and Skia can differ slightly in rasterization/font metrics; pixel-identical
output to the original Electron build is not claimed.

The backend streams raw transparent frames to FFmpeg as a temporary QTRLE alpha
overlay, then composites it after video effects. Legacy presets still use ASS.
Raw frames are streamed with backpressure, never accumulated for a whole clip.
The same path is used when reframing. Node 22+ and renderer dependencies are
installed by the Windows setup; no uploaded executable is run to recover styles.
