import {
  templates, palettes, paletteOverrides, fontFamilies, captionFont, ensureFonts,
  planStates, layoutPhrase, drawState, drawBlocks, compositionById, composeLines,
} from "./engine.mjs";
import catalog from "./catalog.json" with { type: "json" };

export { palettes };
const byId = new Map(templates.map(t => ["studio:" + t.id, t]));
const metadata = new Map(catalog.map(t => [t.id, t]));
export function overridesFromConfig(id, config) {
  const defaults = metadata.get(id) || {};
  return Object.fromEntries(Object.entries(config).filter(([k,v]) => v != null && defaults[k] !== v));
}
const finite = (n, fallback) => Number.isFinite(Number(n)) ? Number(n) : fallback;
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
export function scriptFor(language, words = []) {
  const text = words.map(w => w.word || "").join(" ");
  if (["ur", "ar", "fa"].includes(language) || /[\u0600-\u06ff]/.test(text)) return "nastaliq";
  if (["hi", "mr", "ne"].includes(language) || /[\u0900-\u097f]/.test(text)) return "devanagari";
  return "latin";
}
export function adaptedTemplate(id, overrides = {}) {
  const original = byId.get(id), defaults = metadata.get(id);
  if (!original || !defaults) throw Error("Unknown recovered caption style: " + id);
  const cfg = Object.fromEntries(Object.entries(overrides).filter(([,v]) => v != null));
  const t = { ...original };
  const palette = palettes.find(p => p.id === cfg.native_palette)?.palette;
  if (palette) Object.assign(t, paletteOverrides(palette, t));
  if (cfg.primary_color) t.colour = cfg.primary_color;
  if (cfg.highlight_color) t.highlightColour = cfg.highlight_color;
  if (cfg.font_size != null && cfg.font_size !== defaults.font_size) t.fontScale = clamp(finite(cfg.font_size, defaults.font_size), 10, 500) / 1920;
  if (cfg.font_scale != null) t.sizeScale *= clamp(finite(cfg.font_scale, 1), .4, 2.5);
  if (cfg.bold != null) t.weight = cfg.bold ? 800 : 600;
  if (cfg.font_family) {
    const key = "bmg-" + cfg.font_family;
    fontFamilies[key] = JSON.stringify(cfg.font_family) + ", sans-serif";
    t.fontFamily = key;
  }
  if (cfg.uppercase != null) t.uppercase = cfg.uppercase;
  if (cfg.tracking != null && cfg.tracking !== defaults.tracking)
    t.letterSpacing = cfg.tracking / Math.max(10, t.fontScale * 1920 * (t.sizeScale || 1));
  if (cfg.pos_x != null) t.anchorX = clamp(finite(cfg.pos_x, 50), 0, 100) / 100;
  t.bmgFreeX = cfg.pos_x != null;
  if (cfg.pos_y != null) t.anchorY = clamp(finite(cfg.pos_y, defaults.pos_y), 0, 100) / 100;
  else if (cfg.position && cfg.position !== defaults.position) t.anchorY = cfg.position === "top" ? .16 : cfg.position === "center" ? .5 : .84;
  if (cfg.native_motion != null) t.motion = cfg.native_motion;
  if (cfg.native_pacing != null) t.pacing = cfg.native_pacing;
  if (cfg.native_max_width != null) t.maxWidth = clamp(finite(cfg.native_max_width, 84), 20, 100) / 100;
  if (cfg.animation != null && cfg.animation !== defaults.animation) {
    if (cfg.animation === "one_word") { t.wordsPerWindow = 1; t.pacing = "word"; }
    else if (cfg.animation === "word_reveal") { t.reveal = "words"; t.pacing = "word"; }
    else if (cfg.animation === "karaoke") { t.motion = "karaoke"; t.pacing = "word"; }
    else if (cfg.animation === "highlight") t.pacing = "word";
    else { t.motion = "none"; t.animation = "none"; }
  }
  if (cfg.karaoke === true) { t.motion = "karaoke"; t.pacing = "word"; }
  if (cfg.outline_width != null) t.strokeWidth = finite(cfg.outline_width, 0) / Math.max(10, t.fontScale * 1920);
  if (cfg.outline_color) t.strokeColour = cfg.outline_color;
  if (cfg.shadow_enabled === false) { t.shadowBlur = 0; t.shadowOffsetY = 0; }
  else if (cfg.shadow_enabled === true || cfg.shadow_color != null || cfg.shadow_opacity != null || cfg.shadow_distance != null) {
    const opacity = clamp(finite(cfg.shadow_opacity, 75), 0, 100) / 100;
    const hex = /^#[0-9a-f]{6}$/i.test(cfg.shadow_color || "") ? cfg.shadow_color : "#000000";
    t.shadowColour = `rgba(${parseInt(hex.slice(1,3),16)},${parseInt(hex.slice(3,5),16)},${parseInt(hex.slice(5,7),16)},${opacity})`;
    t.shadowBlur = .12;
    t.shadowOffsetY = finite(cfg.shadow_distance, 6) / Math.max(10, t.fontScale * 1920);
  }
  if (cfg.glow_enabled != null) {
    t.glowStrength = cfg.glow_enabled ? finite(cfg.glow_intensity, 10) / Math.max(10, t.fontScale * 1920) : 0;
    t.glowIntensity = cfg.glow_enabled ? 2 : 0;
    t.glowColour = cfg.glow_color || "#7C4DFF";
  }
  if (cfg.glow_color) t.glowColour = cfg.glow_color;
  if (cfg.glow_intensity != null && cfg.glow_enabled !== false)
    t.glowStrength = cfg.glow_intensity / Math.max(10, t.fontScale * 1920);
  if (cfg.background_enabled != null && cfg.background_enabled !== defaults.background_enabled) {
    t.backgroundColour = cfg.background_enabled ? cfg.background_color || "#000000" : null;
    t.backgroundPadding = cfg.background_enabled ? .16 : 0;
  } else if (cfg.background_color && defaults.background_enabled) t.backgroundColour = cfg.background_color;
  if (cfg.background_opacity != null && t.backgroundColour) {
    const rgba = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)$/.exec(t.backgroundColour);
    if (rgba) t.backgroundColour = "#" + rgba.slice(1,4).map(n=>Number(n).toString(16).padStart(2,"0")).join("");
  }
  if (t.backgroundColour && /^#[0-9a-f]{6}$/i.test(t.backgroundColour)) {
    const h = t.backgroundColour;
    t.backgroundColour = `rgba(${parseInt(h.slice(1,3),16)},${parseInt(h.slice(3,5),16)},${parseInt(h.slice(5,7),16)},${clamp(finite(cfg.background_opacity,defaults.background_opacity ?? 100),0,100)/100})`;
  }
  if (cfg.background_radius != null) t.bmgRadius = Math.max(0, finite(cfg.background_radius,10));
  t.bmgUnderline = cfg.underline === true;
  t.bmgStrike = cfg.strikethrough === true;
  return { template: t, defaults, cfg, original, palette };
}

export async function createCaptionRenderer(canvas, { style, overrides = {}, words, language = "auto", duration, fps = 30 }) {
  const adapted = adaptedTemplate(style, overrides);
  const { template: t, cfg, original } = adapted;
  const context = canvas.getContext("2d", { alpha: true });
  if (!context) throw Error("Caption canvas has no drawing context");
  const script = scriptFor(language, words), direction = script === "nastaliq" ? "rtl" : "ltr";
  const fontPx = canvas.height * t.fontScale * (t.sizeScale || 1);
  await ensureFonts(script, fontPx, t);
  const states = planStates(words, t.wordsPerWindow, duration, {
    pacing: t.pacing, motion: t.motion, motionSeconds: t.motionSeconds, fps,
  });
  let lastIndex = -2;
  async function draw(time) {
    const index = states.findIndex(s => time >= s.startSeconds && time < s.endSeconds);
    if (index === lastIndex) return false;
    lastIndex = index;
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    const state = states[index];
    if (!state || !state.phrase.length) return true;
    context.direction = direction;
    context.font = captionFont(t, script, fontPx);
    context.save();
    if (cfg.rotation) {
      const x = t.anchorX * canvas.width, y = t.anchorY * canvas.height;
      context.translate(x,y); context.rotate(-Number(cfg.rotation) * Math.PI / 180); context.translate(-x,-y);
    }
    if (t.compositionId) {
      const composition = { ...compositionById(t.compositionId), anchorY: t.anchorY, maxWidth: t.maxWidth };
      const scale = t.fontScale / original.fontScale * (t.sizeScale || 1);
      const effects = {};
      if (cfg.outline_width != null) Object.assign(effects, {strokeWidth:t.strokeWidth,strokeColour:t.strokeColour});
      if (cfg.shadow_enabled != null) Object.assign(effects,{shadowBlur:t.shadowBlur,shadowColour:t.shadowColour,shadowOffsetY:t.shadowOffsetY});
      if (cfg.glow_enabled != null) Object.assign(effects,{glowStrength:t.glowStrength,glowIntensity:t.glowIntensity,glowColour:t.glowColour});
      if (cfg.background_enabled != null && cfg.background_enabled !== adapted.defaults.background_enabled)
        Object.assign(effects,{backgroundColour:t.backgroundColour,backgroundPadding:t.backgroundPadding,bmgRadius:t.bmgRadius});
      Object.assign(effects,{bmgUnderline:t.bmgUnderline,bmgStrike:t.bmgStrike});
      const blocks = composeLines(composition, state.phrase.map(w => w.word), canvas.height,
        { text: t.colour, keyword: t.highlightColour }, state.activeWord).map(block => ({
          ...block, scale: block.scale * scale, shiftX: t.anchorX - .5,
          bmgEffects: effects,
          ...(cfg.bold != null ? {weight:t.weight} : {}),
          ...(cfg.tracking != null && cfg.tracking !== adapted.defaults.tracking ? {letterSpacing:t.letterSpacing} : {}),
          ...(cfg.native_max_width != null ? {maxWidth:t.maxWidth} : {}),
          uppercase: cfg.uppercase ?? block.uppercase,
          ...(cfg.font_family ? { fontFamily: t.fontFamily } : {}),
        }));
      const phase = state.phase ?? 1;
      if (cfg.native_motion && cfg.native_motion !== "none") {
        context.globalAlpha *= phase;
        const zoom = cfg.native_motion === "fade-in" ? 1 : .9 + .1*phase;
        context.translate(t.anchorX*canvas.width,t.anchorY*canvas.height);
        context.scale(zoom,zoom);
        context.translate(-t.anchorX*canvas.width,-t.anchorY*canvas.height);
      }
      await drawBlocks(context, blocks, { id: composition.id, script, width: canvas.width, height: canvas.height,
        progress: 1, rise: 0, stackAnchorY: t.anchorY, stackGap: composition.gap });
    } else {
      const lines = layoutPhrase(context, state.phrase, t, script, direction, canvas.width, canvas.height, fontPx, state.activeWord);
      drawState(canvas, context, { ...state, lines }, t, script, fontPx);
    }
    context.restore();
    return true;
  }
  return { draw, states, template: t };
}
