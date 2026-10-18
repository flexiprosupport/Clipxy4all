// Only this wrapper accesses the filesystem/stdout. The recovered drawing
// module has no Node, Electron, network, filesystem or account capabilities.
import fs from "node:fs";
import path from "node:path";
import { once } from "node:events";
import { createCanvas, GlobalFonts } from "@napi-rs/canvas";
import { createCaptionRenderer } from "./adapter.mjs";

const requestPath = process.argv[2];
if (!requestPath) throw Error("A caption request JSON file is required");
const request = JSON.parse(fs.readFileSync(requestPath, "utf8"));
const width = Number(request.width), height = Number(request.height), fps = Number(request.fps || 30);
if (![width,height,fps].every(Number.isFinite) || width < 2 || height < 2 || width > 4096 || height > 4096 ||
    fps < 1 || fps > 60 || request.duration <= 0 || request.duration > 600)
  throw Error("Unsupported caption canvas dimensions, duration or frame rate");
for (const name of fs.readdirSync(request.fonts_dir)) {
  if (!/\.(ttf|otf)$/i.test(name)) continue;
  const filename = path.join(request.fonts_dir, name);
  if (fs.statSync(filename).isFile()) GlobalFonts.registerFromPath(filename);
}
globalThis.document = {
  createElement(tag) { if (tag !== "canvas") throw Error("Unexpected DOM element"); return createCanvas(1,1); },
  fonts: { load: async () => [], ready: Promise.resolve() },
};
const canvas = createCanvas(width,height);
const renderer = await createCaptionRenderer(canvas, request);
let frame, changedFrames = 0;
const count = Math.ceil(request.duration * fps) + 1;
for (let index = 0; index < count; index++) {
  if (await renderer.draw(index / fps) || !frame) {
    frame = canvas.data();
    if (++changedFrames % 10 === 0) globalThis.gc?.();
  }
  if (!process.stdout.write(frame)) await once(process.stdout, "drain");
  if (index % 15 === 0 || index === count - 1) {
    process.stderr.write("CLIPXY_PROGRESS " + ((index + 1) / count).toFixed(6) + "\n");
  }
}
