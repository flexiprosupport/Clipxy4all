// Caption drawing/layout helpers recovered from the user-supplied ClipShlip 1.4.0 build.
// Original author: Ai-Haris. This is a private adaptation, not a grant of redistribution rights.
// No Electron, IPC, account, network, filesystem, or application startup code is included.

const i3 = [["money", "💰"], ["rich", "💰"], ["million", "💰"], ["dollar", "💵"], ["profit", "📈"], ["revenue", "📈"], ["grow", "📈"], ["scale", "📈"], ["invest", "📊"], ["business", "💼"], ["fire", "🔥"], ["crazy", "🤯"], ["insane", "🤯"], ["mind", "🧠"], ["think", "🧠"], ["idea", "💡"], ["learn", "📚"], ["book", "📚"], ["work", "💪"], ["hard", "💪"], ["win", "🏆"], ["best", "🏆"], ["fail", "❌"], ["wrong", "❌"], ["right", "✅"], ["love", "❤️"], ["heart", "❤️"], ["time", "⏰"], ["fast", "⚡"], ["quick", "⚡"], ["stop", "🛑"], ["listen", "👂"], ["look", "👀"], ["see", "👀"], ["big", "🚀"], ["launch", "🚀"], ["start", "🚀"], ["people", "👥"], ["team", "🤝"], ["world", "🌍"], ["space", "🚀"], ["star", "⭐"], ["question", "❓"], ["secret", "🤫"], ["truth", "💯"], ["hundred", "💯"], ["percent", "💯"], ["problem", "⚠️"], ["danger", "⚠️"], ["happy", "😄"], ["excite", "🤩"], ["amazing", "🤩"], ["beautiful", "✨"], ["magic", "✨"], ["dream", "💭"]];

function s3(n) {
  const e = String(n ?? "").toLowerCase().replace(/[^a-z]/g, "");
  if (e.length < 3) return null;
  for (const [t, a] of i3) if (e.startsWith(t)) return a;
  return null;
}

function r3(n, e) {
  if (e !== "latin") return n;
  for (let t = n.length - 1; t >= 0; t--) {
    const a = s3(n[t].word);
    if (!a) continue;
    const r = n.slice();
    return r[t] = {
      ...n[t],
      word: `${n[t].word} ${a}`
    }, r;
  }
  return n;
}

function iE(n) {
  return `cf-${n}`;
}

const lb = "custom:";

function o3(n) {
  return typeof n == "string" && n.startsWith(lb);
}

function zf(n) {
  return o3(n) ? n.slice(lb.length) : null;
}

const l3 = {
  sizeScale: 1,
  highlightStyle: "colour",
  highlightBoxColour: "#C6F32F",
  highlightBoxRadius: .18,
  glowStrength: 0,
  glowIntensity: 1,
  glowColour: "#000000",
  gradientHeight: 0,
  gradientOpacity: .75,
  gradientStrength: 1.6,
  emoji: !1,
  reveal: "none",
  wordPlate: null,
  supportingOpacity: 1,
  supportingColour: "",
  italic: !1,
  motion: "none",
  motionSeconds: .3,
  supportingBlur: 0,
  echo: 0,
  glitch: 0,
  lineSpacing: 1,
  anchorX: .5,
  compositionId: null,
  travelScope: "word",
  emphasisMechanism: "fillAccent",
  highlightFontFamily: null,
  highlightItalic: !1,
  wordRotate: 0,
  lineStyles: [],
  wordPlateColours: [],
  fillGradient: null,
  letterSpacing: 0,
  backdropOpacity: 0,
  backdropBlur: .35,
  backdropColour: "#000000",
  fontFamily: "inter",
  pacing: "chunk"
};

function wa(n) {
  return {
    ...l3,
    ...n
  };
}

const Hf = {
  inter: "'Inter', sans-serif",
  montserrat: "'Montserrat', 'Inter', sans-serif",
  anton: "'Anton', 'Inter', sans-serif",
  playfair: "'Playfair Display', Georgia, serif",
  caveat: "'Caveat', 'Segoe Script', cursive",
  oswald: "'Oswald', 'Inter', sans-serif",
  mono: "'JetBrains Mono', ui-monospace, monospace"
};

function Gf(n, e) {
  if (e !== "latin") return rE[e];
  const t = zf(n.fontFamily);
  return t ? `'${iE(t)}', 'Inter', sans-serif` : Hf[n.fontFamily ?? "inter"] ?? Hf.inter;
}

const rE = {
  nastaliq: "'Noto Nastaliq Urdu', serif",
  devanagari: "'Noto Sans Devanagari', sans-serif",
  latin: "'Inter', sans-serif"
};

const Wf = {
  nastaliq: 1.9,
  devanagari: 1.6,
  latin: 1.4
};

async function as(n, e, t) {
  const a = new Set([rE[n], Gf(t ?? {}, n)]);
  for (const r of a) await document.fonts.load(`${e}px ${r}`, "اردو हिन्दी test");
  await document.fonts.ready;
}

function Wn(n, e, t) {
  return `${n.italic && e === "latin" ? "italic " : ""}${n.weight} ${t}px ${Gf(n, e)}`;
}

function lE(n, e, t) {
  return e !== "latin" || !n.highlightFontFamily ? Wn(n, e, t) : Wn({
    ...n,
    fontFamily: n.highlightFontFamily,
    italic: n.highlightItalic
  }, e, t);
}

const Yf = .16;

const $_ = .1;

function pr(n, e, t) {
  return e !== "latin" || n.letterSpacing === 0 ? "0px" : `${(n.letterSpacing * t).toFixed(2)}px`;
}

function ts(n, e, t, a, r, l, u, d, h = -1) {
  if (e.length === 0) return [];
  const f = t.emoji ? r3(e, a) : e,
    m = K => t.uppercase && a === "latin" ? K.toLocaleUpperCase() : K;
  n.letterSpacing = pr(t, a, d);
  const g = n.measureText(" ").width,
    x = l * t.maxWidth,
    y = f,
    w = [[]];
  let M = 0,
    _ = -1;
  const v = t.animation === "scale" ? Math.max(1, t.animationScale) : 1,
    A = t.highlightStyle === "box" ? d * Yf : 0,
    N = t.wordPlate ? d * Yf : 0,
    E = n.font,
    F = lE(t, a, d),
    k = y.map(K => m(K.word.trim())),
    L = K => k.indexOf(K);
  for (const [K, G] of y.entries()) {
    const X = m(G.word.trim());
    n.font = K === h ? F : E;
    const oe = n.measureText(X).width,
      Ce = kg(n.font, n.letterSpacing, X, d),
      ye = t.wordRotate > 0 ? d * 1.06 * Math.sin(Math.abs(t.wordRotate) * Math.PI / 180) / 2 : 0,
      V = Math.max(Ce.left, Ce.right),
      te = Math.max(N + ye + (N > 0 || A > 0 ? V : 0), K === h ? ((oe + 2 * A) * v - oe) / 2 + ye + V : 0),
      Ne = oe,
      se = (w[w.length - 1].length === 0 ? Ne : g + Ne) + te * 2;
    M + se > x && w[w.length - 1].length > 0 ? (w.push([]), M = Ne + te * 2) : M += se, K === h && (_ = w.length - 1), w[w.length - 1].push({
      text: X,
      start: G.start,
      end: G.end,
      width: Ne,
      pad: te
    });
  }
  n.font = E;
  const C = d * Wf[a] * t.lineSpacing,
    j = K => K === _ ? v : 1,
    P = K => t.lineStyles?.[K]?.fontScale ?? 1,
    H = w.map((K, G) => C * j(G) * P(G)),
    $ = H.reduce((K, G) => K + G, 0),
    le = u * t.anchorY - $ / 2,
    q = K => le + H.slice(0, K).reduce((G, X) => G + X, 0);
  return w.map((K, G) => {
    const X = t.lineStyles?.[G],
      oe = d * (X?.fontScale ?? 1),
      Ce = X === void 0 ? null : Wn({
        weight: X.weight ?? t.weight,
        fontFamily: X.fontFamily ?? t.fontFamily,
        italic: X.italic ?? t.italic
      }, a, oe);
    let ye = oe,
      V = Ce,
      te = g;
    if (V !== null) {
      const Ke = (ft, xt) => {
          n.font = xt, n.letterSpacing = pr(t, a, ft);
          let ot = 0;
          for (const _t of K) {
            _t.width = n.measureText(_t.text).width;
            const Ft = kg(n.font, n.letterSpacing, _t.text, ft);
            _t.pad = Math.max(_t.pad, Math.max(Ft.left, Ft.right)), ot += _t.width + _t.pad * 2;
          }
          return ot + n.measureText(" ").width * Math.max(0, K.length - 1);
        },
        gt = Ke(ye, V);
      gt > x && (ye = Math.max(1, ye * (x / gt)), V = Wn({
        weight: X.weight ?? t.weight,
        fontFamily: X.fontFamily ?? t.fontFamily,
        italic: X.italic ?? t.italic
      }, a, ye), Ke(ye, V)), te = n.measureText(" ").width;
    }
    n.font = E, n.letterSpacing = pr(t, a, d);
    const Ne = K.reduce((Ke, gt) => Ke + gt.width + gt.pad * 2, 0) + te * Math.max(0, K.length - 1),
      se = q(G) + ye * .8 * j(G),
      we = Ne / 2,
      J = l * t.anchorX - we;
    let he = t.bmgFreeX ? J : Math.min(Math.max(J, 0), Math.max(0, l - Ne));
    const ze = (r === "rtl" ? [...K].reverse() : K).map(Ke => {
        const gt = L(Ke.text) === h ? F : V ?? E,
          ft = kg(gt, pr(t, a, ye), Ke.text, ye),
          xt = {
            text: Ke.text,
            start: Ke.start,
            end: Ke.end,
            x: he + Ke.pad,
            y: se,
            width: Ke.width,
            inkAscent: ft.ascent,
            inkDescent: ft.descent,
            inkLeft: ft.left,
            inkRight: ft.right
          };
        return he += Ke.width + Ke.pad * 2 + te, xt;
      }),
      nt = r === "rtl" ? ze.reverse() : ze;
    return X === void 0 ? {
      words: nt,
      y: se,
      width: Ne
    } : {
      words: nt,
      y: se,
      width: Ne,
      style: {
        ...X,
        fontScale: ye / d
      }
    };
  });
}

function Rg(n, e, t, a, r = 0) {
  const l = n.measureText(e.text),
    u = e.y - t * .82,
    d = u + t * 1.06,
    h = e.inkAscent ?? l.actualBoundingBoxAscent ?? 0,
    f = e.inkDescent ?? l.actualBoundingBoxDescent ?? 0,
    m = e.y - h - r,
    g = e.y + f + r,
    x = Math.min(u, m) - a,
    y = Math.max(d, g) + a;
  return {
    top: x,
    height: y - x,
    left: (e.inkLeft ?? 0) + r,
    right: (e.inkRight ?? 0) + r
  };
}

const Vi = n => 1 - Math.pow(1 - n, 3);

function q_(n, e) {
  return n >= 1 ? 1 : Vi(n) + Math.sin(n * Math.PI) * e * (1 - n);
}

function Vl(n, e) {
  const t = Math.sin(n * 12.9898 + e * 78.233) * 43758.5453;
  return (t - Math.floor(t)) * 2 - 1;
}

function g3(n, e) {
  const t = [...n],
    a = Math.max(1, Math.ceil(t.length * Math.min(1, Math.max(0, e))));
  return t.slice(0, a).join("");
}

function Fg(n, e) {
  return e?.colour ? e.colour : n.supportingColour || n.colour;
}

function K_(n) {
  const e = n.replace("#", ""),
    t = e.length === 3 ? e.split("").map(h => h + h).join("") : e,
    a = parseInt(t.slice(0, 2), 16) / 255,
    r = parseInt(t.slice(2, 4), 16) / 255,
    l = parseInt(t.slice(4, 6), 16) / 255,
    u = h => h <= .04045 ? h / 12.92 : Math.pow((h + .055) / 1.055, 2.4);
  return .2126 * u(a) + .7152 * u(r) + .0722 * u(l) > .4 ? "#111111" : "#FFFFFF";
}

function Z_(n, e, t, a, r = 0, l = 1, u = -1) {
  let d = 1 / 0,
    h = -1 / 0,
    f = -1;
  for (const m of e) {
    d = Math.min(d, m.y - t * .85), h = Math.max(h, m.y + t * .3);
    for (const g of m.words) {
      f += 1;
      const x = f === u ? l : 1,
        y = n.measureText(g.text),
        w = ((g.inkAscent ?? y.actualBoundingBoxAscent ?? 0) + r) * x,
        M = ((g.inkDescent ?? y.actualBoundingBoxDescent ?? 0) + r) * x;
      d = Math.min(d, m.y - w), h = Math.max(h, m.y + M);
    }
  }
  return {
    top: d - a,
    bottom: h + a
  };
}

let xs = null;

const J_ = new Map();

function kg(n, e, t, a) {
  const r = `${n}|${e}|${t}`,
    l = J_.get(r);
  if (l) return l;
  xs || (xs = document.createElement("canvas"));
  const u = Math.ceil(a * 1.5),
    d = xs.getContext("2d", {
      willReadFrequently: !0
    });
  if (!d) return {
    ascent: a * .82,
    descent: a * .24,
    left: 0,
    right: 0
  };
  d.font = n, d.letterSpacing = e;
  const h = Math.ceil(d.measureText(t).width) + u * 2,
    f = Math.ceil(a * 4);
  xs.width = Math.max(8, h), xs.height = f, d.font = n, d.letterSpacing = e, d.textBaseline = "alphabetic", d.clearRect(0, 0, xs.width, f), d.fillStyle = "#FFFFFF";
  const m = Math.round(f * .65);
  d.fillText(t, u, m);
  const g = d.getImageData(0, 0, xs.width, f).data,
    x = h - u * 2;
  let y = -1,
    w = -1,
    M = xs.width,
    _ = -1;
  for (let A = 0; A < f; A++) {
    let N = !1;
    for (let E = 0; E < xs.width; E++) g[(A * xs.width + E) * 4 + 3] > 8 && (N = !0, E < M && (M = E), E > _ && (_ = E));
    N && (y < 0 && (y = A), w = A);
  }
  const v = y < 0 ? {
    ascent: a * .82,
    descent: a * .24,
    left: 0,
    right: 0
  } : {
    ascent: m - y,
    descent: w - m,
    left: Math.max(0, u - M),
    right: Math.max(0, _ - (u + x))
  };
  return J_.set(r, v), v;
}

function Dh(n, e) {
  return n.strokeWidth > 0 ? Math.ceil(e * n.strokeWidth / 2) : 0;
}

const Q_ = new Map();

function x3(n, e, t, a, r) {
  const l = Math.max(1, Math.round(e * t)),
    u = `${n}x${l}:${a.toFixed(4)}:${r.toFixed(4)}`,
    d = Q_.get(u);
  if (d) return d;
  const h = document.createElement("canvas");
  h.width = n, h.height = l;
  const f = h.getContext("2d", {
    alpha: !0
  });
  if (!f) return h;
  const m = f.createImageData(n, l),
    g = m.data,
    x = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  for (let y = 0; y < l; y += 1) {
    const w = l === 1 ? 1 : y / (l - 1),
      M = a * Math.pow(w, r) * 255;
    for (let _ = 0; _ < n; _ += 1) {
      const v = (x[(y & 3) * 4 + (_ & 3)] + .5) / 16,
        A = Math.max(0, Math.min(255, Math.floor(M + v))),
        N = (y * n + _) * 4;
      g[N + 3] = A;
    }
  }
  return f.putImageData(m, 0, 0), Q_.set(u, h), h;
}

function Mo(n, e, t, a, r, l) {
  if (e.clearRect(0, 0, n.width, n.height), a.gradientHeight > 0 && a.gradientOpacity > 0) {
    const d = x3(n.width, n.height, a.gradientHeight, a.gradientOpacity, a.gradientStrength);
    e.drawImage(d, 0, n.height - d.height);
  }
  if (t.lines.length > 0 && a.backgroundColour) {
    const d = l * a.backgroundPadding;
    e.font = Wn(a, r, l), e.letterSpacing = pr(a, r, l);
    const {
        top: h,
        bottom: f
      } = Z_(e, t.lines, l, d, Dh(a, l), a.animation === "scale" ? Math.max(1, a.animationScale) : 1, t.activeWord),
      m = Math.max(...t.lines.map(g => g.width));
    e.fillStyle = a.backgroundColour;
    const boxX = n.width * a.anchorX - m / 2 - d;
    if (a.bmgRadius != null) {
      e.beginPath();
      e.roundRect(boxX, h, m + d * 2, f - h, Math.min(l * a.bmgRadius / 90, (f-h)/2));
      e.fill();
    } else e.fillRect(boxX, h, m + d * 2, f - h);
  }
  if (t.lines.length > 0 && a.backdropOpacity > 0) {
    const d = l * .5,
      h = l * .42;
    e.font = Wn(a, r, l), e.letterSpacing = pr(a, r, l);
    const {
        top: f,
        bottom: m
      } = Z_(e, t.lines, l, h, Dh(a, l), a.animation === "scale" ? Math.max(1, a.animationScale) : 1, t.activeWord),
      g = Math.max(...t.lines.map(_ => _.width)),
      x = l * a.backdropBlur;
    e.save(), e.globalAlpha = Math.min(1, a.backdropOpacity), x > 0 && (e.filter = `blur(${x.toFixed(1)}px)`), e.fillStyle = a.backdropColour;
    const y = g + d * 2,
      w = m - f,
      M = Math.min(l * .5, w / 2, y / 2);
    e.beginPath(), e.roundRect((n.width - y) / 2, f, y, w, M), e.fill(), e.restore();
  }
  if (a.wordPlate) {
    const d = l * Yf,
      h = l * $_;
    let f = -1;
    e.save(), e.font = Wn(a, r, l), e.letterSpacing = pr(a, r, l), e.fillStyle = a.wordPlate;
    for (const m of t.lines) {
      const g = m.words.map(w => Rg(e, w, l, h)),
        x = Math.min(...g.map(w => w.top)),
        y = Math.max(...g.map(w => w.top + w.height));
      for (const w of m.words) {
        if (f += 1, a.reveal === "words" && t.activeWord >= 0 && f > t.activeWord) continue;
        const M = Rg(e, w, l, h, Dh(a, l)),
          _ = {
            top: x,
            height: y - x
          },
          v = _.height,
          A = w.width + d * 2 + M.left + M.right,
          N = Math.min(l * a.highlightBoxRadius, v / 2, A / 2);
        if (a.wordPlateColours.length > 0 && (e.fillStyle = a.wordPlateColours[f % a.wordPlateColours.length]), e.save(), a.wordRotate > 0) {
          const E = f % 2 === 0 ? 1 : -1,
            F = .6 + .4 * Math.abs(Vl(f + 1, 5)),
            k = E * a.wordRotate * F * Math.PI / 180,
            L = w.x + w.width / 2;
          e.translate(L, w.y), e.rotate(k), e.translate(-L, -w.y);
        }
        e.globalAlpha = t.activeWord >= 0 && f !== t.activeWord ? a.supportingOpacity : 1, e.beginPath(), e.roundRect(w.x - d - M.left, _.top, A, v, N), e.fill(), e.restore();
      }
    }
    e.restore();
  }
  if (a.highlightStyle !== "colour" && t.activeWord >= 0) {
    let d = -1;
    for (const h of t.lines) for (const f of h.words) {
      if (d += 1, d !== t.activeWord) continue;
      const m = l * Yf,
        g = l * $_;
      e.fillStyle = a.highlightBoxColour;
      const x = a.animation === "scale" ? Math.max(1, a.animationScale) : 1;
      if (e.save(), x !== 1) {
        const y = f.x + f.width / 2;
        e.translate(y, f.y), e.scale(x, x), e.translate(-y, -f.y);
      }
      if (a.highlightStyle === "box") {
        e.font = Wn(a, r, l), e.letterSpacing = pr(a, r, l);
        const y = Rg(e, f, l, g, Dh(a, l)),
          w = f.x - m - y.left,
          M = y.top,
          _ = f.width + m * 2 + y.left + y.right,
          v = y.height,
          A = Math.min(l * a.highlightBoxRadius, v / 2, _ / 2);
        e.beginPath(), e.roundRect(w, M, _, v, A), e.fill();
      } else {
        const y = Math.max(2, l * .1);
        e.beginPath(), e.roundRect(f.x, f.y + l * .16, f.width, y, y / 2), e.fill();
      }
      e.restore();
    }
  }
  let u = -1;
  for (const d of t.lines) for (const h of d.words) {
    u += 1;
    const f = u === t.activeWord;
    if ((a.reveal === "words" || a.motion === "typewriter" && r === "nastaliq") && t.activeWord >= 0 && u > t.activeWord) continue;
    e.save(), e.textBaseline = "alphabetic", e.textAlign = "left";
    const g = d.style,
      x = l * (g?.fontScale ?? 1);
    e.letterSpacing = pr(a, r, x);
    const y = f && a.animation === "scale" ? a.animationScale : 1;
    if (t.activeWord >= 0 && !f ? e.globalAlpha = (a.animation === "fade" ? .72 : 1) * a.supportingOpacity : f && a.animation === "fade" && (e.globalAlpha = 1), e.font = f ? lE(a, r, l) : Wn({
      weight: g?.weight ?? a.weight,
      fontFamily: g?.fontFamily ?? a.fontFamily,
      italic: g?.italic ?? a.italic
    }, r, x), g?.glow && (e.shadowColor = g.colour ?? a.colour, e.shadowBlur = x * .55 * g.glow), a.wordRotate > 0) {
      const _ = u % 2 === 0 ? 1 : -1,
        v = .6 + .4 * Math.abs(Vl(u + 1, 5)),
        A = _ * a.wordRotate * v * Math.PI / 180,
        N = h.x + h.width / 2;
      e.translate(N, h.y), e.rotate(A), e.translate(-N, -h.y);
    }
    if (y !== 1) {
      const _ = h.x + h.width / 2;
      e.translate(_, h.y), e.scale(y, y), e.translate(-_, -h.y);
    }
    const w = t.phase ?? 1,
      M = a.travelScope === "block" || f || t.activeWord < 0;
    if (M && a.motion === "elastic") {
      const _ = 1 + Math.sin(w * Math.PI * 3) * .18 * (1 - w) ** 2,
        v = h.x + h.width / 2;
      e.translate(v, h.y), e.scale(_, _), e.translate(-v, -h.y);
    } else if (M && a.motion === "shake") {
      const _ = l * .05 * (1 - w);
      e.translate(_ * Vl(t.index + 1, u + 7), _ * .6 * Vl(t.index + 1, u + 19));
    } else if (M && a.motion === "pulse") {
      const _ = 1 + Math.sin(w * Math.PI) * .12,
        v = h.x + h.width / 2;
      e.translate(v, h.y), e.scale(_, _), e.translate(-v, -h.y);
    } else if (M && a.motion === "fade-in") e.globalAlpha *= Vi(w);else if (M && a.motion === "pop") {
      const v = .55 + .45 * q_(w, .7),
        A = h.x + h.width / 2;
      e.translate(A, h.y), e.scale(v, v), e.translate(-A, -h.y);
    } else if (M && a.motion === "zoom") {
      const _ = .6 + .4 * Vi(w),
        v = h.x + h.width / 2;
      e.translate(v, h.y), e.scale(_, _), e.translate(-v, -h.y), e.globalAlpha *= Vi(w);
    } else if (M && a.motion === "slide-up") e.translate(0, l * .28 * (1 - Vi(w))), e.globalAlpha *= Math.min(1, Vi(w) * 1.3);else if (M && a.motion === "slide") e.translate(l * .9 * (1 - Vi(w)), 0), e.globalAlpha *= Vi(w);else if (M && a.motion === "bounce-soft") e.translate(0, l * .35 * (1 - Vi(w)));else if (M && a.motion === "bounce-hard") e.translate(0, l * .55 * (1 - q_(w, .35)));else if (a.motion === "blur-scroll" && f) {
      e.translate(l * 1.4 * (1 - Vi(w)), 0);
      const _ = l * .22 * (1 - Vi(w));
      _ > .4 && (e.filter = `blur(${_.toFixed(2)}px)`);
    }
    if (a.glitch > 0 && e.translate(l * a.glitch * Vl(t.index + 1, u + 1), l * a.glitch * .4 * Vl(t.index + 1, u + 31)), a.supportingBlur > 0 && t.activeWord >= 0 && !f && (e.filter = `blur(${(l * a.supportingBlur).toFixed(2)}px)`), a.echo > 0) {
      e.save();
      const _ = r === "nastaliq" ? 1 : -1;
      for (let v = a.echo; v >= 1; v--) e.globalAlpha = .14 * (1 - (v - 1) / (a.echo + 1)), e.fillStyle = f ? a.emphasisMechanism === "boxAccent" && a.highlightStyle === "box" ? K_(a.highlightBoxColour) : a.highlightColour : Fg(a, g), e.fillText(h.text, h.x + _ * v * l * .16, h.y);
      e.restore();
    }
    if (a.glowStrength > 0 && a.glowIntensity > 0) {
      e.save(), e.shadowColor = a.glowColour, e.shadowBlur = l * a.glowStrength, e.fillStyle = a.glowColour;
      for (let _ = 0; _ < Math.min(6, Math.round(a.glowIntensity)); _++) e.fillText(h.text, h.x, h.y);
      e.restore();
    }
    if ((a.shadowBlur > 0 || a.shadowOffsetY !== 0) && (e.shadowBlur = l * a.shadowBlur, e.shadowColor = a.shadowColour, e.shadowOffsetY = l * a.shadowOffsetY), a.strokeWidth > 0 && (e.lineWidth = l * a.strokeWidth, e.strokeStyle = a.strokeColour, e.lineJoin = "round", e.strokeText(h.text, h.x, h.y)), e.shadowBlur = 0, e.shadowOffsetY = 0, f && a.emphasisMechanism === "glowWord") {
      e.save(), e.shadowColor = a.highlightColour, e.shadowBlur = l * .32, e.fillStyle = a.highlightColour;
      for (let _ = 0; _ < 3; _++) e.fillText(h.text, h.x, h.y);
      e.restore();
    }
    if (a.bmgUnderline || a.bmgStrike) {
      e.save();
      e.strokeStyle = f ? a.highlightColour : Fg(a, g);
      e.lineWidth = Math.max(1, x * .045);
      for (const lineY of [a.bmgUnderline ? h.y + x*.12 : null, a.bmgStrike ? h.y - x*.28 : null]) {
        if (lineY == null) continue;
        e.beginPath(); e.moveTo(h.x,lineY); e.lineTo(h.x+h.width,lineY); e.stroke();
      }
      e.restore();
    }
    if (f && a.emphasisMechanism === "gradientText") {
      const _ = h.y - l * .78,
        v = e.createLinearGradient(0, _, 0, h.y + l * .12);
      v.addColorStop(0, a.highlightColour), v.addColorStop(1, a.fillGradient?.[1] ?? a.colour), e.fillStyle = v, e.fillText(h.text, h.x, h.y), e.restore();
      continue;
    }
    if (a.wordPlateColours.length > 0) {
      e.fillStyle = K_(a.wordPlateColours[u % a.wordPlateColours.length]), e.fillText(h.text, h.x, h.y), e.restore();
      continue;
    }
    if (a.fillGradient && !f) {
      const _ = h.y - l * .78,
        v = e.createLinearGradient(0, _, 0, h.y + l * .1);
      v.addColorStop(0, a.fillGradient[0]), v.addColorStop(1, a.fillGradient[1]), e.fillStyle = v;
    } else e.fillStyle = f ? a.highlightColour : Fg(a, g);
    if (a.motion === "karaoke" && f) {
      const _ = h.width * Math.min(1, Math.max(0, w));
      e.save(), e.fillStyle = Fg(a, g), e.globalAlpha *= a.supportingOpacity, e.fillText(h.text, h.x, h.y), e.restore(), e.save(), e.beginPath();
      const v = r === "nastaliq" ? h.x + h.width - _ : h.x;
      e.rect(v, h.y - l * 1.4, _, l * 2.2), e.clip(), e.fillStyle = a.highlightColour, e.fillText(h.text, h.x, h.y), e.restore();
    } else a.motion === "typewriter" && f && r !== "nastaliq" ? e.fillText(g3(h.text, w), h.x, h.y) : e.fillText(h.text, h.x, h.y);
    e.restore();
  }
}

const uE = {
  gapSeconds: .7,
  maxPhraseSeconds: 4,
  sentenceEnd: /[.!?۔؟।]$/u,
  minStateSeconds: .12,
  chunkMinWords: 2,
  chunkMaxWords: 4,
  chunkTargetSeconds: .75,
  chunkMinSeconds: .6,
  chunkMaxSeconds: 1.1
};

function b3(n) {
  let e = 0,
    t = -1;
  for (const [a, r] of n.entries()) {
    const l = r.word.replace(/[^\p{L}\p{N}]/gu, "").length;
    l >= t && (t = l, e = a);
  }
  return e;
}

function y3(n, e) {
  const t = [];
  let a = 0;
  for (; a < n.length;) {
    let r = e.chunkMinWords;
    for (; r < e.chunkMaxWords && a + r < n.length && n[Math.min(a + r, n.length - 1)].end - n[a].start < e.chunkTargetSeconds;) r += 1;
    const l = n.length - a;
    l - r === 1 && r < e.chunkMaxWords + 1 && (r = l), t.push(n.slice(a, a + r)), a += r;
  }
  return t;
}

function v3(n, e, t = {}) {
  const a = {
      ...uE,
      ...t
    },
    r = [];
  let l = [];
  const u = () => {
    l.length > 0 && r.push(l), l = [];
  };
  for (const [d, h] of n.entries()) {
    l.push(h);
    const f = n[d + 1],
      m = l.length >= e,
      g = l.length > 0 && h.end - l[0].start >= a.maxPhraseSeconds,
      x = a.sentenceEnd.test(h.word.trim()),
      y = f ? f.start - h.end >= a.gapSeconds : !0;
    (m || g || x || y) && u();
  }
  return u(), r;
}

function cb(n, e, t, a = {}) {
  const r = {
      ...uE,
      ...a
    },
    l = (n ?? []).filter(g => g && typeof g.start == "number" && g.end > g.start && g.word.trim().length > 0);
  if (l.length === 0) return [];
  const u = r.pacing ?? "chunk",
    d = v3(l, Math.max(1, e), r),
    h = [];
  let f = 0;
  for (const g of d) {
    const x = g[0].start,
      y = g[g.length - 1].end;
    if (x > f + .01 && h.push({
      startSeconds: f,
      endSeconds: x,
      activeWord: -1,
      phrase: []
    }), u === "chunk") {
      const w = y3(g, r);
      for (const [M, _] of w.entries()) {
        const v = w[M + 1],
          A = M === 0 ? x : _[0].start,
          N = v ? v[0].start : y;
        h.push({
          startSeconds: A,
          endSeconds: Math.max(A + .01, N),
          activeWord: b3(_),
          phrase: _
        });
      }
    } else for (const [w, M] of g.entries()) {
      const _ = g[w + 1],
        v = w === 0 ? x : M.start,
        A = _ ? _.start : y;
      h.push({
        startSeconds: v,
        endSeconds: Math.max(v + .01, A),
        activeWord: w,
        phrase: g
      });
    }
    f = y;
  }
  f < t - .01 && h.push({
    startSeconds: f,
    endSeconds: t,
    activeWord: -1,
    phrase: []
  });
  const m = [];
  for (const g of h) {
    const x = m[m.length - 1];
    if (x && g.endSeconds - g.startSeconds < r.minStateSeconds) {
      x.endSeconds = g.endSeconds;
      continue;
    }
    m.push(g);
  }
  return _3(m, r).map((g, x) => ({
    ...g,
    index: x
  }));
}

const S3 = new Set(["karaoke", "typewriter", "blur-scroll"]);

function _3(n, e) {
  const t = e.motion ?? "none";
  if (t === "none") return n.map(d => ({
    ...d,
    phase: 1
  }));
  const a = Math.max(1, e.fps ?? 30),
    r = S3.has(t),
    l = Math.max(.05, e.motionSeconds ?? .3),
    u = [];
  for (const d of n) {
    const h = d.endSeconds - d.startSeconds;
    if (d.activeWord < 0 || d.phrase.length === 0 || h <= 0) {
      u.push({
        ...d,
        phase: 1
      });
      continue;
    }
    const f = r ? h : Math.min(l, h),
      m = Math.max(1, Math.round(f * a));
    for (let g = 0; g < m; g++) {
      const x = d.startSeconds + f * g / m,
        y = d.startSeconds + f * (g + 1) / m;
      u.push({
        ...d,
        startSeconds: x,
        endSeconds: y,
        phase: (g + 1) / m
      });
    }
    !r && f < h && u.push({
      ...d,
      startSeconds: d.startSeconds + f,
      phase: 1
    });
  }
  return u;
}

function w3(n) {
  const e = n.trim();
  return e === "" ? !1 : !!(/^[@#]\S+$/.test(e) || /^[A-Za-z0-9][A-Za-z0-9._/-]*\.[A-Za-z0-9][A-Za-z0-9._/-]*$/.test(e));
}

const at = n => n;

const ud = [{
  id: "composition-opportunity",
  name: "Opportunity",
  anchorY: .72,
  maxWidth: .82,
  gap: .012,
  lines: [{
    weight: at(2),
    scale: .03,
    fontWeight: 400,
    colour: "#4DE1FF",
    uppercase: !1
  }, {
    weight: at(2),
    scale: .062,
    fontWeight: 800,
    colour: "#FFFFFF",
    uppercase: !1
  }, {
    weight: at(1),
    scale: .03,
    fontWeight: 400,
    colour: "#FFFFFF",
    uppercase: !1
  }]
}, {
  id: "composition-one-move",
  name: "One Move",
  anchorY: .72,
  maxWidth: .82,
  gap: .01,
  lines: [{
    weight: at(1),
    scale: .032,
    fontWeight: 500,
    colour: "#FFFFFF",
    uppercase: !1
  }, {
    weight: at(1),
    scale: .078,
    fontWeight: 800,
    colour: "#4DE1FF",
    uppercase: !0
  }, {
    weight: at(2),
    scale: .032,
    fontWeight: 500,
    colour: "#FFFFFF",
    uppercase: !1
  }]
}, {
  id: "composition-difference",
  name: "The Difference",
  anchorY: .7,
  maxWidth: .8,
  gap: .008,
  lines: [{
    weight: at(1),
    scale: .026,
    fontWeight: 400,
    colour: "#FFFFFF",
    uppercase: !1
  }, {
    weight: at(2),
    scale: .052,
    fontWeight: 800,
    colour: "#FFD400",
    uppercase: !1
  }, {
    weight: at(1),
    scale: .026,
    fontWeight: 400,
    colour: "#FFFFFF",
    uppercase: !1
  }, {
    weight: at(2),
    scale: .03,
    fontWeight: 600,
    colour: "#FFFFFF",
    uppercase: !1
  }]
}, {
  id: "composition-learn",
  name: "Learn",
  anchorY: .71,
  maxWidth: .8,
  gap: .01,
  lines: [{
    weight: at(1),
    scale: .028,
    fontWeight: 400,
    colour: "#FFFFFF",
    uppercase: !1
  }, {
    weight: at(1),
    scale: .064,
    fontWeight: 500,
    colour: "#FFD400",
    uppercase: !1,
    fontFamily: "playfair",
    italic: !0
  }, {
    weight: at(2),
    scale: .034,
    fontWeight: 700,
    colour: "#FFFFFF",
    uppercase: !1
  }, {
    weight: at(2),
    scale: .026,
    fontWeight: 400,
    colour: "#CFCFCF",
    uppercase: !1
  }]
}, {
  id: "composition-missing",
  name: "Missing",
  anchorY: .72,
  maxWidth: .8,
  gap: .01,
  lines: [{
    weight: at(2),
    scale: .03,
    fontWeight: 400,
    colour: "#FFFFFF",
    uppercase: !1
  }, {
    weight: at(1),
    scale: .074,
    fontWeight: 800,
    colour: "#FFD400",
    uppercase: !0
  }, {
    weight: at(1),
    scale: .03,
    fontWeight: 400,
    colour: "#FFFFFF",
    uppercase: !1
  }, {
    weight: at(1),
    scale: .03,
    fontWeight: 400,
    colour: "#FFFFFF",
    uppercase: !1
  }]
}, {
  id: "composition-shorter",
  name: "Shorter",
  anchorY: .72,
  maxWidth: .8,
  gap: .01,
  lines: [{
    weight: at(2),
    scale: .032,
    fontWeight: 400,
    colour: "#FFFFFF",
    uppercase: !1
  }, {
    weight: at(1),
    scale: .08,
    fontWeight: 800,
    colour: "#4DE1FF",
    uppercase: !0
  }, {
    weight: at(2),
    scale: .032,
    fontWeight: 400,
    colour: "#FFFFFF",
    uppercase: !1
  }]
}, {
  id: "composition-logic",
  name: "The Logic",
  anchorY: .72,
  maxWidth: .78,
  gap: .01,
  lines: [{
    weight: at(1),
    scale: .03,
    fontWeight: 500,
    colour: "#4DE1FF",
    uppercase: !1
  }, {
    weight: at(2),
    scale: .056,
    fontWeight: 500,
    colour: "#FFFFFF",
    uppercase: !1,
    fontFamily: "playfair",
    italic: !0
  }, {
    weight: at(2),
    scale: .038,
    fontWeight: 800,
    colour: "#FFFFFF",
    uppercase: !1
  }]
}, {
  id: "composition-nobody",
  name: "Nobody Talks",
  anchorY: .7,
  maxWidth: .78,
  gap: .008,
  lines: [{
    weight: at(1),
    scale: .03,
    fontWeight: 400,
    colour: "#FFFFFF",
    uppercase: !1
  }, {
    weight: at(1),
    scale: .072,
    fontWeight: 800,
    colour: "#FFD400",
    uppercase: !0
  }, {
    weight: at(1),
    scale: .03,
    fontWeight: 400,
    colour: "#FFFFFF",
    uppercase: !1
  }, {
    weight: at(1),
    scale: .042,
    fontWeight: 800,
    colour: "#FFFFFF",
    uppercase: !1
  }]
}, {
  id: "composition-simplify",
  name: "Simplify",
  anchorY: .71,
  maxWidth: .8,
  gap: .01,
  lines: [{
    weight: at(2),
    scale: .03,
    fontWeight: 500,
    colour: "#FFFFFF",
    uppercase: !1
  }, {
    weight: at(1),
    scale: .058,
    fontWeight: 800,
    colour: "#FFD400",
    uppercase: !1
  }, {
    weight: at(1),
    scale: .04,
    fontWeight: 700,
    colour: "#FFFFFF",
    uppercase: !1
  }, {
    weight: at(3),
    scale: .028,
    fontWeight: 400,
    colour: "#DDDDDD",
    uppercase: !1
  }]
}, {
  id: "composition-look",
  name: "Look At",
  anchorY: .72,
  maxWidth: .78,
  gap: .01,
  lines: [{
    weight: at(1),
    scale: .03,
    fontWeight: 400,
    colour: "#FFFFFF",
    uppercase: !1
  }, {
    weight: at(2),
    scale: .058,
    fontWeight: 500,
    colour: "#FFD400",
    uppercase: !1,
    fontFamily: "playfair",
    italic: !0
  }, {
    weight: at(2),
    scale: .034,
    fontWeight: 600,
    colour: "#FFFFFF",
    uppercase: !1
  }, {
    weight: at(1),
    scale: .034,
    fontWeight: 600,
    colour: "#FFFFFF",
    uppercase: !1
  }]
}, {
  id: "composition-explain",
  name: "Explain",
  anchorY: .72,
  maxWidth: .8,
  gap: .01,
  lines: [{
    weight: at(2),
    scale: .03,
    fontWeight: 500,
    colour: "#FFFFFF",
    uppercase: !1
  }, {
    weight: at(2),
    scale: .066,
    fontWeight: 800,
    colour: "#E23744",
    uppercase: !0
  }, {
    weight: at(3),
    scale: .03,
    fontWeight: 400,
    colour: "#FFFFFF",
    uppercase: !1
  }]
}, {
  id: "composition-numeral",
  name: "Numeral",
  anchorY: .7,
  maxWidth: .8,
  gap: .006,
  lines: [{
    weight: at(1),
    scale: .11,
    fontWeight: 700,
    colour: "#FFFFFF",
    uppercase: !1,
    fontFamily: "playfair"
  }, {
    weight: at(2),
    scale: .03,
    fontWeight: 500,
    colour: "#CFCFCF",
    uppercase: !1
  }, {
    weight: at(3),
    scale: .036,
    fontWeight: 700,
    colour: "#FFD400",
    uppercase: !1
  }]
}, {
  id: "composition-wrong-place",
  name: "Wrong Place",
  anchorY: .7,
  maxWidth: .78,
  gap: .008,
  lines: [{
    weight: at(1),
    scale: .034,
    fontWeight: 700,
    colour: "#FFD400",
    uppercase: !1
  }, {
    weight: at(1),
    scale: .034,
    fontWeight: 400,
    colour: "#FFFFFF",
    uppercase: !1
  }, {
    weight: at(1),
    scale: .034,
    fontWeight: 400,
    colour: "#FFFFFF",
    uppercase: !1
  }, {
    weight: at(3),
    scale: .056,
    fontWeight: 800,
    colour: "#E23744",
    uppercase: !1
  }]
}, {
  id: "composition-beginners",
  name: "Beginners",
  anchorY: .71,
  maxWidth: .78,
  gap: .01,
  lines: [{
    weight: at(1),
    scale: .03,
    fontWeight: 400,
    colour: "#FFFFFF",
    uppercase: !1
  }, {
    weight: at(1),
    scale: .068,
    fontWeight: 800,
    colour: "#4DE1FF",
    uppercase: !1
  }, {
    weight: at(1),
    scale: .03,
    fontWeight: 400,
    colour: "#FFFFFF",
    uppercase: !1
  }, {
    weight: at(1),
    scale: .038,
    fontWeight: 700,
    colour: "#FFFFFF",
    uppercase: !1
  }]
}, {
  id: "composition-founders",
  name: "Founders",
  anchorY: .72,
  maxWidth: .8,
  gap: .01,
  lines: [{
    weight: at(2),
    scale: .03,
    fontWeight: 400,
    colour: "#FFFFFF",
    uppercase: !1
  }, {
    weight: at(1),
    scale: .034,
    fontWeight: 400,
    colour: "#FFFFFF",
    uppercase: !1
  }, {
    weight: at(1),
    scale: .062,
    fontWeight: 800,
    colour: "#4DE1FF",
    uppercase: !1
  }, {
    weight: at(1),
    scale: .038,
    fontWeight: 700,
    colour: "#FFFFFF",
    uppercase: !1
  }]
}];

function T3(n) {
  const e = n.replace("#", "");
  if (e.length < 6) return !1;
  const [t, a, r] = [0, 2, 4].map(l => parseInt(e.slice(l, l + 2), 16));
  return Math.min(t, a, r) > 200;
}

const Ui = "#FFFFFF";

const Yl = "#FF6A1F";

const db = [{
  id: "premium-open",
  name: "Premium Open",
  anchorY: .72,
  maxWidth: .84,
  gap: .01,
  lines: [{
    weight: at(1),
    scale: .082,
    fontWeight: 800,
    colour: Yl,
    uppercase: !1
  }, {
    weight: at(3),
    scale: .03,
    fontWeight: 600,
    colour: Ui,
    uppercase: !1
  }]
}, {
  id: "premium-centre",
  name: "Premium Centre",
  anchorY: .71,
  maxWidth: .84,
  gap: .008,
  lines: [{
    weight: at(1),
    scale: .03,
    fontWeight: 600,
    colour: Ui,
    uppercase: !1
  }, {
    weight: at(1),
    scale: .086,
    fontWeight: 800,
    colour: Yl,
    uppercase: !1
  }, {
    weight: at(2),
    scale: .03,
    fontWeight: 600,
    colour: Ui,
    uppercase: !1
  }]
}, {
  id: "premium-land",
  name: "Premium Land",
  anchorY: .72,
  maxWidth: .84,
  gap: .01,
  lines: [{
    weight: at(3),
    scale: .03,
    fontWeight: 600,
    colour: Ui,
    uppercase: !1
  }, {
    weight: at(1),
    scale: .084,
    fontWeight: 800,
    colour: Yl,
    uppercase: !1
  }]
}, {
  id: "premium-shout",
  name: "Premium Shout",
  anchorY: .71,
  maxWidth: .86,
  gap: .008,
  lines: [{
    weight: at(1),
    scale: .028,
    fontWeight: 600,
    colour: Ui,
    uppercase: !1
  }, {
    weight: at(1),
    scale: .09,
    fontWeight: 800,
    colour: Yl,
    uppercase: !0
  }, {
    weight: at(2),
    scale: .028,
    fontWeight: 600,
    colour: Ui,
    uppercase: !1
  }]
}, {
  id: "premium-anton",
  name: "Premium Impact",
  anchorY: .72,
  maxWidth: .86,
  gap: .008,
  lines: [{
    weight: at(1),
    scale: .03,
    fontWeight: 600,
    colour: Ui,
    uppercase: !1
  }, {
    weight: at(1),
    scale: .098,
    fontWeight: 400,
    colour: Yl,
    uppercase: !0,
    fontFamily: "anton"
  }, {
    weight: at(2),
    scale: .03,
    fontWeight: 600,
    colour: Ui,
    uppercase: !1
  }]
}, {
  id: "premium-stack",
  name: "Premium Stack",
  anchorY: .7,
  maxWidth: .82,
  gap: .008,
  lines: [{
    weight: at(1),
    scale: .028,
    fontWeight: 500,
    colour: Ui,
    uppercase: !1
  }, {
    weight: at(1),
    scale: .078,
    fontWeight: 800,
    colour: Yl,
    uppercase: !1
  }, {
    weight: at(1),
    scale: .032,
    fontWeight: 700,
    colour: Ui,
    uppercase: !1
  }, {
    weight: at(2),
    scale: .026,
    fontWeight: 500,
    colour: Ui,
    uppercase: !1
  }]
}];

function dp(n) {
  return [...ud, ...db].find(e => e.id === n) ?? ud[0];
}

function hp(n, e, t, a, r) {
  const l = e.filter(y => y.trim());
  if (l.length === 0) return [];
  const u = n.lines.reduce((y, w) => y + w.weight, 0),
    d = n.lines.map(y => Math.max(0, Math.round(l.length * y.weight / u)));
  let h = d.reduce((y, w) => y + w, 0);
  const f = n.lines.reduce((y, w, M) => w.scale > n.lines[y].scale ? M : y, 0);
  for (; h < l.length;) d[f] += 1, h += 1;
  for (; h > l.length;) {
    const y = d.findIndex((w, M) => w > 0 && M !== f);
    y < 0 ? d[f] -= 1 : d[y] -= 1, h -= 1;
  }
  const m = f;
  if (r !== void 0 && r >= 0 && r < l.length && n.lines.length > 1) {
    const y = m,
      w = n.lines.length - m - 1,
      M = (A, N) => {
        if (N <= 0) return [];
        const E = Math.floor(A / N),
          F = Array.from({
            length: N
          }, () => E);
        for (let k = 0; k < A - E * N; k += 1) F[N - 1 - k] = (F[N - 1 - k] ?? 0) + 1;
        return F;
      },
      _ = M(r, y),
      v = M(l.length - r - 1, w);
    for (let A = 0; A < d.length; A += 1) d[A] = A < y ? _[A] ?? 0 : A === y ? 1 : v[A - y - 1] ?? 0;
  }
  let g = 0;
  return n.lines.map((y, w) => ({
    line: y,
    text: l.slice(g, g += d[w]).join(" ")
  })).filter(y => y.text.trim().length > 0).map(y => ({
    text: y.text,
    scale: y.line.scale,
    weight: y.line.fontWeight,
    colour: a ? T3(y.line.colour) ? a.text : a.keyword : y.line.colour,
    anchorY: n.anchorY,
    maxWidth: n.maxWidth,
    uppercase: y.line.uppercase,
    fontFamily: y.line.fontFamily,
    italic: y.line.italic,
    letterSpacing: y.line.letterSpacing
  }));
}

const C3 = [{
  id: "cinematic",
  name: "Cinematic",
  fontScale: .045,
  weight: 600,
  colour: "#ffffff",
  highlightColour: "#c6f32f",
  strokeWidth: 0,
  strokeColour: "#000000",
  shadowBlur: .35,
  shadowColour: "rgba(0,0,0,0.75)",
  shadowOffsetY: .04,
  anchorY: .78,
  maxWidth: .86,
  wordsPerWindow: 5,
  animation: "fade",
  animationScale: 1,
  backgroundColour: null,
  backgroundPadding: 0,
  uppercase: !1
}, {
  id: "karaoke-pop",
  name: "Karaoke pop",
  fontScale: .05,
  weight: 700,
  colour: "#f2f2f2",
  highlightColour: "#ffd400",
  strokeWidth: .06,
  strokeColour: "#101010",
  shadowBlur: .2,
  shadowColour: "rgba(0,0,0,0.55)",
  shadowOffsetY: .02,
  anchorY: .74,
  maxWidth: .84,
  wordsPerWindow: 4,
  animation: "scale",
  animationScale: 1.16,
  backgroundColour: null,
  backgroundPadding: 0,
  uppercase: !1
}, {
  id: "bold-impact",
  name: "Bold impact",
  fontScale: .062,
  weight: 800,
  colour: "#ffffff",
  highlightColour: "#ff3b30",
  strokeWidth: .09,
  strokeColour: "#000000",
  shadowBlur: 0,
  shadowColour: "transparent",
  shadowOffsetY: 0,
  anchorY: .7,
  maxWidth: .94,
  wordsPerWindow: 3,
  animation: "none",
  animationScale: 1,
  backgroundColour: "rgba(0,0,0,0.35)",
  backgroundPadding: .28,
  uppercase: !0
}, {
  id: "punch-box",
  name: "Punch Box",
  fontScale: .072,
  weight: 900,
  colour: "#ffffff",
  highlightColour: "#000000",
  strokeWidth: .05,
  strokeColour: "#000000",
  shadowBlur: .18,
  shadowColour: "rgba(0,0,0,0.85)",
  shadowOffsetY: .02,
  anchorY: .72,
  maxWidth: .82,
  wordsPerWindow: 3,
  animation: "none",
  animationScale: 1,
  backgroundColour: null,
  backgroundPadding: 0,
  uppercase: !0,
  highlightStyle: "box",
  highlightBoxColour: "#C6F32F",
  highlightBoxRadius: .16,
  glowStrength: 0,
  glowIntensity: 1,
  glowColour: "#000000",
  gradientHeight: .34,
  gradientOpacity: .7,
  gradientStrength: 1.8,
  emoji: !1
}, {
  id: "clean-yellow",
  name: "Clean Yellow",
  fontScale: .052,
  weight: 800,
  colour: "#ffffff",
  highlightColour: "#FFD400",
  strokeWidth: .035,
  strokeColour: "#000000",
  shadowBlur: .22,
  shadowColour: "rgba(0,0,0,0.8)",
  shadowOffsetY: .03,
  anchorY: .76,
  maxWidth: .86,
  wordsPerWindow: 4,
  animation: "none",
  animationScale: 1,
  backgroundColour: null,
  backgroundPadding: 0,
  uppercase: !1,
  highlightStyle: "colour",
  highlightBoxColour: "#FFD400",
  highlightBoxRadius: .15,
  glowStrength: 0,
  glowIntensity: 1,
  glowColour: "#000000",
  gradientHeight: .28,
  gradientOpacity: .6,
  gradientStrength: 1.6,
  emoji: !1
}, {
  id: "neon-glow",
  name: "Neon Glow",
  fontScale: .058,
  weight: 800,
  colour: "#ffffff",
  highlightColour: "#FFE14D",
  strokeWidth: .026,
  strokeColour: "#06121A",
  shadowBlur: 0,
  shadowColour: "rgba(0,0,0,0)",
  shadowOffsetY: 0,
  anchorY: .74,
  maxWidth: .84,
  wordsPerWindow: 4,
  animation: "none",
  animationScale: 1,
  backgroundColour: null,
  backgroundPadding: 0,
  uppercase: !1,
  highlightStyle: "colour",
  highlightBoxColour: "#37F5FF",
  highlightBoxRadius: .15,
  glowStrength: .3,
  glowIntensity: 3,
  glowColour: "#37F5FF",
  gradientHeight: .3,
  gradientOpacity: .55,
  gradientStrength: 1.5,
  emoji: !1
}, {
  id: "underline-pop",
  name: "Underline Pop",
  fontScale: .055,
  weight: 800,
  colour: "#ffffff",
  highlightColour: "#ffffff",
  strokeWidth: .03,
  strokeColour: "#000000",
  shadowBlur: .2,
  shadowColour: "rgba(0,0,0,0.8)",
  shadowOffsetY: .025,
  anchorY: .75,
  maxWidth: .86,
  wordsPerWindow: 4,
  animation: "none",
  animationScale: 1,
  backgroundColour: null,
  backgroundPadding: 0,
  uppercase: !1,
  highlightStyle: "underline",
  highlightBoxColour: "#FF4D6D",
  highlightBoxRadius: .1,
  glowStrength: 0,
  glowIntensity: 1,
  glowColour: "#000000",
  gradientHeight: .26,
  gradientOpacity: .6,
  gradientStrength: 1.6,
  emoji: !1
}, {
  id: "documentary",
  name: "Documentary",
  fontScale: .038,
  weight: 600,
  colour: "#F2F2F2",
  highlightColour: "#FFFFFF",
  strokeWidth: 0,
  strokeColour: "#000000",
  shadowBlur: .3,
  shadowColour: "rgba(0,0,0,0.7)",
  shadowOffsetY: .03,
  anchorY: .86,
  maxWidth: .8,
  wordsPerWindow: 7,
  animation: "none",
  animationScale: 1,
  backgroundColour: null,
  backgroundPadding: 0,
  uppercase: !1,
  highlightStyle: "colour",
  highlightBoxColour: "#FFFFFF",
  highlightBoxRadius: .12,
  glowStrength: 0,
  glowIntensity: 1,
  glowColour: "#000000",
  gradientHeight: .22,
  gradientOpacity: .5,
  gradientStrength: 1.4,
  emoji: !1
}, {
  id: "hormozi",
  name: "Hormozi",
  fontFamily: "montserrat",
  fontScale: .068,
  weight: 800,
  colour: "#FFFFFF",
  highlightColour: "#FFD400",
  strokeWidth: .095,
  strokeColour: "#000000",
  shadowBlur: 0,
  shadowColour: "rgba(0,0,0,0)",
  shadowOffsetY: 0,
  anchorY: .7,
  maxWidth: .84,
  wordsPerWindow: 4,
  animation: "scale",
  animationScale: 1.06,
  backgroundColour: null,
  backgroundPadding: 0,
  uppercase: !1,
  highlightStyle: "colour",
  pacing: "chunk",
  gradientHeight: 0
}, {
  id: "creator-white",
  name: "Creator White",
  fontFamily: "montserrat",
  fontScale: .058,
  weight: 700,
  colour: "#FFFFFF",
  highlightColour: "#FFFFFF",
  strokeWidth: .07,
  strokeColour: "#000000",
  shadowBlur: 0,
  shadowColour: "rgba(0,0,0,0)",
  shadowOffsetY: 0,
  anchorY: .7,
  maxWidth: .82,
  wordsPerWindow: 4,
  animation: "none",
  animationScale: 1,
  backgroundColour: null,
  backgroundPadding: 0,
  uppercase: !1,
  highlightStyle: "colour",
  pacing: "chunk",
  gradientHeight: 0
}, {
  id: "anton-impact",
  name: "Anton Impact",
  fontFamily: "anton",
  fontScale: .082,
  weight: 400,
  colour: "#FFFFFF",
  highlightColour: "#FFD400",
  strokeWidth: .06,
  strokeColour: "#000000",
  shadowBlur: 0,
  shadowColour: "rgba(0,0,0,0)",
  shadowOffsetY: 0,
  anchorY: .68,
  maxWidth: .86,
  wordsPerWindow: 3,
  animation: "none",
  animationScale: 1,
  backgroundColour: null,
  backgroundPadding: 0,
  uppercase: !0,
  highlightStyle: "colour",
  pacing: "chunk",
  gradientHeight: 0
}, {
  id: "block-brand",
  name: "Brand Block",
  fontFamily: "montserrat",
  fontScale: .05,
  weight: 700,
  colour: "#0B0B0D",
  highlightColour: "#0B0B0D",
  strokeWidth: 0,
  strokeColour: "#000000",
  shadowBlur: 0,
  shadowColour: "rgba(0,0,0,0)",
  shadowOffsetY: 0,
  anchorY: .7,
  maxWidth: .7,
  wordsPerWindow: 4,
  animation: "none",
  animationScale: 1,
  backgroundColour: "#C6F32F",
  backgroundPadding: .42,
  uppercase: !1,
  highlightStyle: "colour",
  pacing: "chunk",
  gradientHeight: 0
}, {
  id: "keyword-pop",
  name: "Keyword Pop",
  fontFamily: "montserrat",
  fontScale: .06,
  weight: 800,
  colour: "rgba(255,255,255,0.55)",
  highlightColour: "#7CF77C",
  strokeWidth: .055,
  strokeColour: "#04140A",
  shadowBlur: 0,
  shadowColour: "rgba(0,0,0,0)",
  shadowOffsetY: 0,
  anchorY: .7,
  maxWidth: .82,
  wordsPerWindow: 4,
  animation: "none",
  animationScale: 1,
  backgroundColour: null,
  backgroundPadding: 0,
  uppercase: !1,
  highlightStyle: "colour",
  pacing: "chunk",
  gradientHeight: 0
}, {
  id: "outline-punch",
  name: "Outline Punch",
  fontScale: .072,
  weight: 900,
  colour: "#FFFFFF",
  highlightColour: "#FFE14D",
  strokeWidth: .11,
  strokeColour: "#000000",
  shadowBlur: 0,
  shadowColour: "rgba(0,0,0,0)",
  shadowOffsetY: 0,
  anchorY: .72,
  maxWidth: .82,
  wordsPerWindow: 3,
  animation: "scale",
  animationScale: 1.12,
  backgroundColour: null,
  backgroundPadding: 0,
  uppercase: !0,
  highlightStyle: "colour",
  gradientHeight: .3,
  gradientOpacity: .5,
  gradientStrength: 1.6
}, {
  id: "reveal",
  name: "Word Reveal",
  fontScale: .058,
  weight: 800,
  colour: "#FFFFFF",
  highlightColour: "#FFFFFF",
  strokeWidth: .03,
  strokeColour: "rgba(0,0,0,0.9)",
  shadowBlur: .2,
  shadowColour: "rgba(0,0,0,0.6)",
  shadowOffsetY: .02,
  anchorY: .74,
  maxWidth: .8,
  wordsPerWindow: 4,
  animation: "none",
  animationScale: 1,
  backgroundColour: null,
  backgroundPadding: 0,
  uppercase: !1,
  highlightStyle: "colour",
  reveal: "words",
  pacing: "word",
  gradientHeight: .28,
  gradientOpacity: .55,
  gradientStrength: 1.5
}, {
  id: "word-tiles",
  name: "Word Tiles",
  fontScale: .055,
  weight: 800,
  colour: "#FFFFFF",
  highlightColour: "#0A0A0A",
  strokeWidth: 0,
  strokeColour: "#000000",
  shadowBlur: 0,
  shadowColour: "rgba(0,0,0,0)",
  shadowOffsetY: 0,
  anchorY: .74,
  maxWidth: .8,
  wordsPerWindow: 4,
  animation: "none",
  animationScale: 1,
  backgroundColour: null,
  backgroundPadding: 0,
  uppercase: !1,
  wordPlate: "rgba(10,10,12,0.86)",
  highlightStyle: "box",
  highlightBoxColour: "#C6F32F",
  highlightBoxRadius: .2,
  gradientHeight: 0
}, {
  id: "sunset",
  name: "Sunset",
  fontScale: .066,
  weight: 900,
  colour: "#FFB37A",
  highlightColour: "#FFFFFF",
  strokeWidth: .045,
  strokeColour: "#2A0E33",
  shadowBlur: .18,
  shadowColour: "rgba(40,10,50,0.7)",
  shadowOffsetY: .02,
  anchorY: .73,
  maxWidth: .82,
  wordsPerWindow: 3,
  animation: "scale",
  animationScale: 1.08,
  backgroundColour: null,
  backgroundPadding: 0,
  uppercase: !0,
  highlightStyle: "colour",
  fillGradient: ["#FFD86B", "#FF4D8D"],
  gradientHeight: .32,
  gradientOpacity: .55,
  gradientStrength: 1.6
}, {
  id: "sticker",
  name: "Sticker",
  fontScale: .07,
  weight: 900,
  colour: "#FFFFFF",
  highlightColour: "#FF4D6D",
  strokeWidth: .075,
  strokeColour: "#111114",
  shadowBlur: 0,
  shadowColour: "#111114",
  shadowOffsetY: .075,
  anchorY: .72,
  maxWidth: .82,
  wordsPerWindow: 3,
  animation: "scale",
  animationScale: 1.1,
  backgroundColour: null,
  backgroundPadding: 0,
  uppercase: !0,
  highlightStyle: "colour",
  gradientHeight: .26,
  gradientOpacity: .45,
  gradientStrength: 1.5
}, {
  id: "editorial-scale",
  name: "Editorial Scale",
  fontFamily: "montserrat",
  fontScale: .034,
  weight: 300,
  colour: "#FFFFFF",
  highlightColour: "#FFFFFF",
  strokeWidth: 0,
  strokeColour: "#000000",
  shadowBlur: .18,
  shadowColour: "rgba(0,0,0,0.55)",
  shadowOffsetY: .012,
  anchorY: .76,
  maxWidth: .8,
  wordsPerWindow: 4,
  animation: "scale",
  animationScale: 2.1,
  backgroundColour: null,
  backgroundPadding: 0,
  uppercase: !1,
  highlightStyle: "colour",
  letterSpacing: .06,
  supportingOpacity: .7,
  pacing: "chunk",
  gradientHeight: .3
}, {
  id: "broadsheet",
  name: "Broadsheet",
  fontFamily: "inter",
  fontScale: .03,
  weight: 400,
  colour: "#F2F2F2",
  highlightColour: "#FFFFFF",
  strokeWidth: 0,
  strokeColour: "#000000",
  shadowBlur: .18,
  shadowColour: "rgba(0,0,0,0.55)",
  shadowOffsetY: .012,
  anchorY: .76,
  maxWidth: .82,
  wordsPerWindow: 4,
  animation: "scale",
  animationScale: 2.4,
  backgroundColour: null,
  backgroundPadding: 0,
  uppercase: !0,
  highlightStyle: "colour",
  letterSpacing: .16,
  supportingOpacity: .65,
  pacing: "chunk",
  gradientHeight: .3
}, {
  id: "plate-keyword",
  name: "Plate Keyword",
  fontFamily: "montserrat",
  fontScale: .032,
  weight: 600,
  colour: "#FFFFFF",
  highlightColour: "#111111",
  highlightBoxColour: "#FFE14D",
  highlightBoxRadius: .06,
  strokeWidth: 0,
  strokeColour: "#000000",
  shadowBlur: .16,
  shadowColour: "rgba(0,0,0,0.5)",
  shadowOffsetY: .012,
  anchorY: .76,
  maxWidth: .78,
  wordsPerWindow: 4,
  animation: "scale",
  animationScale: 1.8,
  backgroundColour: null,
  backgroundPadding: 0,
  uppercase: !1,
  highlightStyle: "box",
  letterSpacing: .03,
  supportingOpacity: .7,
  pacing: "chunk",
  gradientHeight: .3
}, {
  id: "editorial-column",
  name: "Editorial Column",
  fontFamily: "montserrat",
  fontScale: .032,
  weight: 300,
  colour: "#FFFFFF",
  highlightColour: "#FFFFFF",
  strokeWidth: 0,
  strokeColour: "#000000",
  shadowBlur: .18,
  shadowColour: "rgba(0,0,0,0.55)",
  shadowOffsetY: .012,
  anchorY: .7,
  maxWidth: .46,
  wordsPerWindow: 4,
  animation: "scale",
  animationScale: 2.2,
  backgroundColour: null,
  backgroundPadding: 0,
  uppercase: !1,
  highlightStyle: "colour",
  letterSpacing: .05,
  supportingOpacity: .62,
  pacing: "chunk",
  gradientHeight: .34
}, {
  id: "editorial-mono",
  name: "Editorial Mono",
  fontFamily: "inter",
  fontScale: .028,
  weight: 500,
  colour: "#FFFFFF",
  highlightColour: "#FFFFFF",
  highlightBoxColour: "#101010",
  highlightBoxRadius: .04,
  strokeWidth: 0,
  strokeColour: "#000000",
  shadowBlur: .14,
  shadowColour: "rgba(0,0,0,0.45)",
  shadowOffsetY: .01,
  anchorY: .78,
  maxWidth: .76,
  wordsPerWindow: 4,
  animation: "scale",
  animationScale: 2,
  backgroundColour: null,
  backgroundPadding: 0,
  uppercase: !0,
  highlightStyle: "box",
  letterSpacing: .12,
  supportingOpacity: .58,
  pacing: "chunk",
  gradientHeight: .28
}, {
  id: "editorial-serif",
  name: "Editorial Serif",
  fontFamily: "playfair",
  italic: !0,
  fontScale: .036,
  weight: 500,
  colour: "#FFFFFF",
  highlightColour: "#FFFFFF",
  strokeWidth: 0,
  strokeColour: "#000000",
  shadowBlur: .18,
  shadowColour: "rgba(0,0,0,0.55)",
  shadowOffsetY: .012,
  anchorY: .76,
  maxWidth: .78,
  wordsPerWindow: 4,
  animation: "scale",
  animationScale: 1.9,
  backgroundColour: null,
  backgroundPadding: 0,
  uppercase: !1,
  highlightStyle: "colour",
  letterSpacing: .02,
  supportingOpacity: .66,
  pacing: "chunk",
  gradientHeight: .3
}, {
  id: "editorial-masthead",
  name: "Editorial Masthead",
  fontFamily: "playfair",
  italic: !1,
  fontScale: .03,
  weight: 700,
  colour: "#F5F0E8",
  highlightColour: "#FFFFFF",
  strokeWidth: 0,
  strokeColour: "#000000",
  shadowBlur: .2,
  shadowColour: "rgba(0,0,0,0.6)",
  shadowOffsetY: .012,
  anchorY: .74,
  maxWidth: .8,
  wordsPerWindow: 4,
  animation: "scale",
  animationScale: 2.2,
  backgroundColour: null,
  backgroundPadding: 0,
  uppercase: !0,
  highlightStyle: "colour",
  letterSpacing: .12,
  supportingOpacity: .62,
  pacing: "chunk",
  gradientHeight: .3
}, {
  id: "blur-switch",
  name: "Blur Switch",
  fontFamily: "montserrat",
  fontScale: .052,
  weight: 700,
  colour: "#FFFFFF",
  highlightColour: "#FFFFFF",
  strokeWidth: 0,
  strokeColour: "#000000",
  shadowBlur: .16,
  shadowColour: "rgba(0,0,0,0.55)",
  shadowOffsetY: .012,
  anchorY: .74,
  maxWidth: .82,
  wordsPerWindow: 4,
  animation: "none",
  animationScale: 1,
  backgroundColour: null,
  backgroundPadding: 0,
  uppercase: !1,
  highlightStyle: "colour",
  supportingBlur: .06,
  supportingOpacity: .8,
  pacing: "chunk",
  gradientHeight: .3
}, {
  id: "fade-stack",
  name: "Fade Stack",
  fontFamily: "montserrat",
  fontScale: .052,
  weight: 700,
  colour: "#FFFFFF",
  highlightColour: "#FFE14D",
  strokeWidth: .07,
  strokeColour: "#000000",
  shadowBlur: 0,
  shadowColour: "rgba(0,0,0,0)",
  shadowOffsetY: 0,
  anchorY: .74,
  maxWidth: .84,
  wordsPerWindow: 4,
  animation: "fade",
  animationScale: 1,
  backgroundColour: null,
  backgroundPadding: 0,
  uppercase: !1,
  highlightStyle: "colour",
  supportingOpacity: .5,
  pacing: "chunk",
  gradientHeight: .3
}, {
  id: "echo-trail",
  name: "Echo Trail",
  fontFamily: "anton",
  fontScale: .06,
  weight: 400,
  colour: "#FFFFFF",
  highlightColour: "#FF4D6D",
  strokeWidth: 0,
  strokeColour: "#000000",
  shadowBlur: 0,
  shadowColour: "rgba(0,0,0,0)",
  shadowOffsetY: 0,
  anchorY: .74,
  maxWidth: .84,
  wordsPerWindow: 3,
  animation: "none",
  animationScale: 1,
  backgroundColour: null,
  backgroundPadding: 0,
  uppercase: !0,
  highlightStyle: "colour",
  echo: 4,
  supportingOpacity: .85,
  pacing: "chunk",
  gradientHeight: .3
}, {
  id: "glitch",
  name: "Glitch",
  fontFamily: "anton",
  fontScale: .058,
  weight: 400,
  colour: "#FFFFFF",
  highlightColour: "#4DE1FF",
  strokeWidth: .05,
  strokeColour: "#101010",
  shadowBlur: 0,
  shadowColour: "rgba(0,0,0,0)",
  shadowOffsetY: 0,
  anchorY: .74,
  maxWidth: .84,
  wordsPerWindow: 3,
  animation: "none",
  animationScale: 1,
  backgroundColour: null,
  backgroundPadding: 0,
  uppercase: !0,
  highlightStyle: "colour",
  glitch: .03,
  supportingOpacity: .9,
  pacing: "chunk",
  gradientHeight: .3
}, {
  id: "karaoke-fill",
  name: "Karaoke Fill",
  fontFamily: "montserrat",
  fontScale: .054,
  weight: 800,
  colour: "#FFFFFF",
  highlightColour: "#FFE14D",
  strokeWidth: .07,
  strokeColour: "#000000",
  shadowBlur: 0,
  shadowColour: "rgba(0,0,0,0)",
  shadowOffsetY: 0,
  anchorY: .74,
  maxWidth: .84,
  wordsPerWindow: 4,
  animation: "none",
  animationScale: 1,
  backgroundColour: null,
  backgroundPadding: 0,
  uppercase: !1,
  highlightStyle: "colour",
  motion: "karaoke",
  supportingOpacity: .55,
  pacing: "chunk",
  gradientHeight: .3
}, {
  id: "typewriter",
  name: "Typewriter",
  fontFamily: "inter",
  fontScale: .046,
  weight: 600,
  colour: "#FFFFFF",
  highlightColour: "#FFFFFF",
  strokeWidth: 0,
  strokeColour: "#000000",
  shadowBlur: .16,
  shadowColour: "rgba(0,0,0,0.6)",
  shadowOffsetY: .012,
  anchorY: .76,
  maxWidth: .8,
  wordsPerWindow: 4,
  animation: "none",
  animationScale: 1,
  backgroundColour: null,
  backgroundPadding: 0,
  uppercase: !1,
  highlightStyle: "colour",
  motion: "typewriter",
  reveal: "words",
  pacing: "word",
  letterSpacing: .02,
  supportingOpacity: 1,
  gradientHeight: .3
}, {
  id: "bounce-soft",
  name: "Bounce Soft",
  fontFamily: "montserrat",
  fontScale: .056,
  weight: 800,
  colour: "#FFFFFF",
  highlightColour: "#FFE14D",
  strokeWidth: .07,
  strokeColour: "#000000",
  shadowBlur: 0,
  shadowColour: "rgba(0,0,0,0)",
  shadowOffsetY: 0,
  anchorY: .74,
  maxWidth: .84,
  wordsPerWindow: 4,
  animation: "none",
  animationScale: 1,
  backgroundColour: null,
  backgroundPadding: 0,
  uppercase: !1,
  highlightStyle: "colour",
  motion: "bounce-soft",
  motionSeconds: .28,
  supportingOpacity: .75,
  pacing: "chunk",
  gradientHeight: .3
}, {
  id: "bounce-hard",
  name: "Bounce Hard",
  fontFamily: "anton",
  fontScale: .062,
  weight: 400,
  colour: "#FFFFFF",
  highlightColour: "#FFD400",
  strokeWidth: .06,
  strokeColour: "#000000",
  shadowBlur: 0,
  shadowColour: "rgba(0,0,0,0)",
  shadowOffsetY: 0,
  anchorY: .74,
  maxWidth: .86,
  wordsPerWindow: 3,
  animation: "none",
  animationScale: 1,
  backgroundColour: null,
  backgroundPadding: 0,
  uppercase: !0,
  highlightStyle: "colour",
  motion: "bounce-hard",
  motionSeconds: .32,
  supportingOpacity: .8,
  pacing: "chunk",
  gradientHeight: .3
}, {
  id: "slide-in",
  name: "Slide In",
  fontFamily: "montserrat",
  fontScale: .05,
  weight: 700,
  colour: "#FFFFFF",
  highlightColour: "#6FE3C4",
  strokeWidth: 0,
  strokeColour: "#000000",
  shadowBlur: .16,
  shadowColour: "rgba(0,0,0,0.55)",
  shadowOffsetY: .012,
  anchorY: .76,
  maxWidth: .8,
  wordsPerWindow: 4,
  animation: "none",
  animationScale: 1,
  backgroundColour: null,
  backgroundPadding: 0,
  uppercase: !1,
  highlightStyle: "colour",
  motion: "slide",
  motionSeconds: .26,
  supportingOpacity: .7,
  pacing: "chunk",
  gradientHeight: .3
}, {
  id: "blur-scroll",
  name: "Blur Scroller",
  fontFamily: "montserrat",
  fontScale: .052,
  weight: 700,
  colour: "#FFFFFF",
  highlightColour: "#FFFFFF",
  strokeWidth: 0,
  strokeColour: "#000000",
  shadowBlur: .18,
  shadowColour: "rgba(0,0,0,0.6)",
  shadowOffsetY: .012,
  anchorY: .76,
  maxWidth: .8,
  wordsPerWindow: 4,
  animation: "none",
  animationScale: 1,
  backgroundColour: null,
  backgroundPadding: 0,
  uppercase: !1,
  highlightStyle: "colour",
  motion: "blur-scroll",
  supportingOpacity: .6,
  pacing: "chunk",
  gradientHeight: .3
}, {
  id: "pop-in",
  name: "Pop",
  fontFamily: "montserrat",
  fontScale: .05,
  weight: 800,
  colour: "#FFFFFF",
  highlightColour: "#FFE14D",
  strokeWidth: .07,
  strokeColour: "#000000",
  shadowBlur: 0,
  shadowColour: "rgba(0,0,0,0)",
  shadowOffsetY: 0,
  anchorY: .74,
  maxWidth: .84,
  wordsPerWindow: 4,
  animation: "scale",
  animationScale: 1.22,
  backgroundColour: null,
  backgroundPadding: 0,
  uppercase: !1,
  highlightStyle: "colour",
  supportingOpacity: .72,
  pacing: "chunk",
  gradientHeight: .3
}, {
  id: "word-boxes",
  name: "Word Boxes",
  fontFamily: "anton",
  fontScale: .052,
  weight: 400,
  colour: "#FFFFFF",
  highlightColour: "#111111",
  strokeWidth: 0,
  strokeColour: "#000000",
  shadowBlur: 0,
  shadowColour: "rgba(0,0,0,0)",
  shadowOffsetY: 0,
  anchorY: .72,
  maxWidth: .78,
  wordsPerWindow: 3,
  animation: "none",
  animationScale: 1,
  backgroundColour: null,
  backgroundPadding: 0,
  uppercase: !0,
  highlightStyle: "colour",
  wordPlate: "#111111",
  wordPlateColours: ["#E6007A", "#FFD400", "#111111"],
  wordRotate: 5,
  highlightBoxRadius: .02,
  supportingOpacity: 1,
  pacing: "chunk",
  gradientHeight: .3
}, {
  id: "word-boxes-mono",
  name: "Word Boxes Mono",
  fontFamily: "montserrat",
  fontScale: .048,
  weight: 800,
  colour: "#FFFFFF",
  highlightColour: "#FFD400",
  strokeWidth: 0,
  strokeColour: "#000000",
  shadowBlur: 0,
  shadowColour: "rgba(0,0,0,0)",
  shadowOffsetY: 0,
  anchorY: .74,
  maxWidth: .8,
  wordsPerWindow: 4,
  animation: "none",
  animationScale: 1,
  backgroundColour: null,
  backgroundPadding: 0,
  uppercase: !1,
  highlightStyle: "colour",
  wordPlate: "#101010",
  highlightBoxRadius: .06,
  supportingOpacity: 1,
  pacing: "chunk",
  gradientHeight: .3
}, {
  id: "panel-quote",
  name: "Panel",
  fontFamily: "montserrat",
  fontScale: .04,
  weight: 600,
  colour: "#F2F2F2",
  highlightColour: "#111111",
  highlightBoxColour: "#FFD400",
  highlightBoxRadius: .08,
  strokeWidth: 0,
  strokeColour: "#000000",
  shadowBlur: 0,
  shadowColour: "rgba(0,0,0,0)",
  shadowOffsetY: 0,
  anchorY: .74,
  maxWidth: .72,
  wordsPerWindow: 5,
  animation: "none",
  animationScale: 1,
  backgroundColour: null,
  backgroundPadding: 0,
  uppercase: !1,
  highlightStyle: "box",
  backdropOpacity: .72,
  backdropBlur: 0,
  backdropColour: "#0E0E12",
  supportingOpacity: 1,
  pacing: "chunk",
  gradientHeight: 0
}, {
  id: "sans-serif-pair",
  name: "Sans + Serif",
  fontFamily: "anton",
  fontScale: .054,
  weight: 400,
  colour: "#FFFFFF",
  highlightColour: "#FFD400",
  highlightFontFamily: "playfair",
  highlightItalic: !0,
  strokeWidth: 0,
  strokeColour: "#000000",
  shadowBlur: .16,
  shadowColour: "rgba(0,0,0,0.55)",
  shadowOffsetY: .012,
  anchorY: .74,
  maxWidth: .82,
  wordsPerWindow: 4,
  animation: "scale",
  animationScale: 1.5,
  backgroundColour: null,
  backgroundPadding: 0,
  uppercase: !0,
  highlightStyle: "colour",
  supportingOpacity: .85,
  pacing: "chunk",
  gradientHeight: .3
}, {
  id: "panel-serif",
  name: "Panel Serif",
  fontFamily: "montserrat",
  fontScale: .038,
  weight: 300,
  colour: "#F0EDE8",
  highlightColour: "#FFFFFF",
  highlightFontFamily: "playfair",
  highlightItalic: !1,
  strokeWidth: 0,
  strokeColour: "#000000",
  shadowBlur: 0,
  shadowColour: "rgba(0,0,0,0)",
  shadowOffsetY: 0,
  anchorY: .76,
  maxWidth: .7,
  wordsPerWindow: 5,
  animation: "scale",
  animationScale: 1.6,
  backgroundColour: null,
  backgroundPadding: 0,
  uppercase: !1,
  highlightStyle: "colour",
  backdropOpacity: .6,
  backdropBlur: 0,
  backdropColour: "#12100E",
  letterSpacing: .03,
  supportingOpacity: .8,
  pacing: "chunk",
  gradientHeight: 0
}, {
  id: "hero-clean-impact",
  name: "Clean Impact",
  fontFamily: "anton",
  fontScale: .058,
  weight: 400,
  uppercase: !0,
  colour: "#FFFFFF",
  highlightColour: "#FFD400",
  strokeWidth: .075,
  strokeColour: "#000000",
  shadowBlur: 0,
  shadowColour: "rgba(0,0,0,0)",
  shadowOffsetY: 0,
  anchorY: .74,
  maxWidth: .84,
  wordsPerWindow: 4,
  animation: "none",
  animationScale: 1,
  motion: "pop",
  motionSeconds: .34,
  emphasisMechanism: "fillAccent",
  highlightStyle: "colour",
  backgroundColour: null,
  backgroundPadding: 0,
  pacing: "chunk",
  gradientHeight: .3
}, {
  id: "hero-neon-punch",
  name: "Neon Punch",
  fontFamily: "oswald",
  fontScale: .062,
  weight: 600,
  uppercase: !0,
  colour: "#EAFBFF",
  highlightColour: "#4DE1FF",
  strokeWidth: 0,
  strokeColour: "#000000",
  shadowBlur: .1,
  shadowColour: "rgba(0,0,0,0.55)",
  shadowOffsetY: .008,
  glowStrength: .3,
  glowIntensity: 3,
  glowColour: "#2AB6FF",
  anchorY: .74,
  maxWidth: .86,
  wordsPerWindow: 3,
  animation: "scale",
  animationScale: 1.14,
  motion: "zoom",
  motionSeconds: .3,
  emphasisMechanism: "glowWord",
  highlightStyle: "colour",
  backgroundColour: null,
  backgroundPadding: 0,
  pacing: "chunk",
  gradientHeight: .3
}, {
  id: "hero-hormozi",
  name: "Boxed Punch",
  fontFamily: "montserrat",
  fontScale: .06,
  weight: 800,
  uppercase: !0,
  colour: "#FFFFFF",
  highlightColour: "#111111",
  highlightBoxColour: "#FFD400",
  highlightBoxRadius: .05,
  strokeWidth: .06,
  strokeColour: "#000000",
  shadowBlur: 0,
  shadowColour: "rgba(0,0,0,0)",
  shadowOffsetY: 0,
  anchorY: .72,
  maxWidth: .52,
  wordsPerWindow: 3,
  animation: "none",
  animationScale: 1,
  motion: "pop",
  motionSeconds: .32,
  emphasisMechanism: "boxAccent",
  highlightStyle: "box",
  backgroundColour: null,
  backgroundPadding: 0,
  pacing: "chunk",
  gradientHeight: .3
}, {
  id: "hero-bold-duo",
  name: "Bold Duo",
  fontFamily: "anton",
  fontScale: .058,
  weight: 400,
  uppercase: !0,
  colour: "#FFFFFF",
  highlightColour: "#FF4D6D",
  strokeWidth: .05,
  strokeColour: "#0A0A0A",
  shadowBlur: 0,
  shadowColour: "rgba(0,0,0,0)",
  shadowOffsetY: 0,
  anchorY: .72,
  maxWidth: .56,
  wordsPerWindow: 3,
  animation: "none",
  animationScale: 1,
  motion: "karaoke",
  emphasisMechanism: "fillAccent",
  highlightStyle: "colour",
  supportingOpacity: .62,
  backgroundColour: null,
  backgroundPadding: 0,
  pacing: "chunk",
  gradientHeight: .3
}, {
  id: "hero-golden-frame",
  name: "Golden Frame",
  fontFamily: "playfair",
  fontScale: .05,
  weight: 600,
  uppercase: !1,
  colour: "#F4EDDF",
  highlightColour: "#E8B21A",
  fillGradient: null,
  strokeWidth: 0,
  strokeColour: "#000000",
  shadowBlur: .16,
  shadowColour: "rgba(0,0,0,0.6)",
  shadowOffsetY: .01,
  anchorY: .74,
  maxWidth: .74,
  wordsPerWindow: 4,
  letterSpacing: .03,
  animation: "scale",
  animationScale: 1.18,
  motion: "fade-in",
  motionSeconds: .2,
  emphasisMechanism: "gradientText",
  highlightStyle: "colour",
  backgroundColour: null,
  backgroundPadding: 0,
  pacing: "chunk",
  gradientHeight: .28
}, {
  id: "hero-signature-flow",
  name: "Signature Flow",
  fontFamily: "oswald",
  fontScale: .05,
  weight: 500,
  uppercase: !1,
  colour: "#FFFFFF",
  highlightColour: "#FFD9A0",
  highlightFontFamily: "caveat",
  highlightItalic: !1,
  strokeWidth: 0,
  strokeColour: "#000000",
  shadowBlur: .18,
  shadowColour: "rgba(0,0,0,0.6)",
  shadowOffsetY: .012,
  anchorY: .75,
  maxWidth: .78,
  wordsPerWindow: 4,
  animation: "scale",
  animationScale: 1.45,
  motion: "fade-in",
  motionSeconds: .2,
  emphasisMechanism: "italicScript",
  highlightStyle: "colour",
  supportingOpacity: .82,
  backgroundColour: null,
  backgroundPadding: 0,
  pacing: "chunk",
  gradientHeight: .3
}, {
  id: "hero-aqua-edge",
  name: "Aqua Edge",
  fontFamily: "montserrat",
  fontScale: .056,
  weight: 800,
  uppercase: !0,
  colour: "#FFFFFF",
  highlightColour: "#37E8FF",
  fillGradient: null,
  strokeWidth: .045,
  strokeColour: "#062430",
  shadowBlur: 0,
  shadowColour: "rgba(0,0,0,0)",
  shadowOffsetY: 0,
  glowStrength: .22,
  glowIntensity: 2,
  glowColour: "#1FB8E8",
  anchorY: .73,
  maxWidth: .82,
  wordsPerWindow: 3,
  animation: "scale",
  animationScale: 1.12,
  motion: "zoom",
  motionSeconds: .28,
  emphasisMechanism: "gradientText",
  highlightStyle: "colour",
  backgroundColour: null,
  backgroundPadding: 0,
  pacing: "chunk",
  gradientHeight: .3
}, {
  id: "hero-purple-wave",
  name: "Purple Wave",
  fontFamily: "montserrat",
  fontScale: .048,
  weight: 800,
  uppercase: !1,
  colour: "#F3EBFF",
  highlightColour: "#C9A6FF",
  strokeWidth: 0,
  strokeColour: "#000000",
  shadowBlur: 0,
  shadowColour: "rgba(0,0,0,0)",
  shadowOffsetY: 0,
  backdropOpacity: .62,
  backdropBlur: 0,
  backdropColour: "#2A0B45",
  anchorY: .75,
  maxWidth: .74,
  wordsPerWindow: 4,
  animation: "none",
  animationScale: 1,
  motion: "slide-up",
  motionSeconds: .3,
  travelScope: "block",
  emphasisMechanism: "italicScript",
  highlightStyle: "colour",
  highlightFontFamily: "playfair",
  highlightItalic: !0,
  backgroundColour: null,
  backgroundPadding: 0,
  pacing: "chunk",
  gradientHeight: 0
}, {
  id: "hero-flame-bold",
  name: "Flame Bold",
  fontFamily: "anton",
  fontScale: .06,
  weight: 400,
  uppercase: !0,
  colour: "#FFF1E4",
  highlightColour: "#FF7A1A",
  fillGradient: null,
  strokeWidth: .04,
  strokeColour: "#2A0C00",
  shadowBlur: 0,
  shadowColour: "rgba(0,0,0,0)",
  shadowOffsetY: 0,
  glowStrength: .26,
  glowIntensity: 3,
  glowColour: "#FF3D00",
  anchorY: .73,
  maxWidth: .84,
  wordsPerWindow: 3,
  animation: "scale",
  animationScale: 1.14,
  motion: "pop",
  motionSeconds: .34,
  emphasisMechanism: "gradientText",
  highlightStyle: "colour",
  backgroundColour: null,
  backgroundPadding: 0,
  pacing: "chunk",
  gradientHeight: .3
}, {
  id: "hero-comic-burst",
  name: "Comic Burst",
  fontFamily: "anton",
  fontScale: .05,
  weight: 400,
  uppercase: !0,
  colour: "#FFFFFF",
  highlightColour: "#111111",
  strokeWidth: .035,
  strokeColour: "#0A0A0A",
  shadowBlur: 0,
  shadowColour: "rgba(0,0,0,0)",
  shadowOffsetY: 0,
  wordPlate: "#FFD400",
  wordPlateColours: ["#FFD400", "#37E8FF", "#FF4D6D"],
  wordRotate: 4,
  highlightBoxRadius: .03,
  anchorY: .72,
  maxWidth: .78,
  wordsPerWindow: 3,
  animation: "none",
  animationScale: 1,
  motion: "bounce-hard",
  motionSeconds: .32,
  emphasisMechanism: "boxAccent",
  highlightStyle: "colour",
  backgroundColour: null,
  backgroundPadding: 0,
  pacing: "chunk",
  gradientHeight: .3
}, {
  id: "hero-karaoke",
  name: "Karaoke",
  fontFamily: "oswald",
  fontScale: .054,
  weight: 600,
  uppercase: !1,
  colour: "#C9CDD2",
  highlightColour: "#FFD400",
  strokeWidth: .03,
  strokeColour: "#101010",
  shadowBlur: 0,
  shadowColour: "rgba(0,0,0,0)",
  shadowOffsetY: 0,
  anchorY: .74,
  maxWidth: .84,
  wordsPerWindow: 4,
  animation: "none",
  animationScale: 1,
  motion: "karaoke",
  emphasisMechanism: "fillAccent",
  highlightStyle: "colour",
  supportingOpacity: .55,
  backgroundColour: null,
  backgroundPadding: 0,
  pacing: "chunk",
  gradientHeight: .3
}, {
  id: "hero-clean-card",
  name: "Clean Card",
  fontFamily: "inter",
  fontScale: .04,
  weight: 800,
  uppercase: !1,
  colour: "#FFFFFF",
  highlightColour: "#FFD400",
  strokeWidth: 0,
  strokeColour: "#000000",
  shadowBlur: 0,
  shadowColour: "rgba(0,0,0,0)",
  shadowOffsetY: 0,
  backdropOpacity: .74,
  backdropBlur: 0,
  backdropColour: "#0E1013",
  anchorY: .76,
  maxWidth: .72,
  wordsPerWindow: 5,
  animation: "none",
  animationScale: 1,
  motion: "slide-up",
  motionSeconds: .28,
  travelScope: "block",
  emphasisMechanism: "fillAccent",
  highlightStyle: "colour",
  backgroundColour: null,
  backgroundPadding: 0,
  pacing: "chunk",
  gradientHeight: 0
}, {
  id: "pack-podcast",
  name: "Podcast",
  fontFamily: "inter",
  fontScale: .03,
  weight: 500,
  uppercase: !1,
  colour: "#F2F2F2",
  highlightColour: "#FFFFFF",
  highlightBoxColour: "#FFD400",
  strokeWidth: 0,
  strokeColour: "#000000",
  shadowBlur: .16,
  shadowColour: "rgba(0,0,0,0.55)",
  shadowOffsetY: .01,
  anchorY: .8,
  maxWidth: .82,
  wordsPerWindow: 8,
  letterSpacing: .02,
  animation: "none",
  animationScale: 1,
  motion: "none",
  emphasisMechanism: "fillAccent",
  highlightStyle: "underline",
  supportingOpacity: .88,
  backgroundColour: null,
  backgroundPadding: 0,
  pacing: "chunk",
  gradientHeight: .26
}, {
  id: "pack-documentary",
  name: "Documentary",
  fontFamily: "inter",
  fontScale: .028,
  weight: 400,
  uppercase: !1,
  colour: "#F5F5F5",
  highlightColour: "#F5F5F5",
  strokeWidth: 0,
  strokeColour: "#000000",
  shadowBlur: 0,
  shadowColour: "rgba(0,0,0,0)",
  shadowOffsetY: 0,
  backdropOpacity: .55,
  backdropBlur: 0,
  backdropColour: "#000000",
  anchorY: .86,
  maxWidth: .78,
  wordsPerWindow: 7,
  letterSpacing: .05,
  animation: "none",
  animationScale: 1,
  motion: "fade-in",
  motionSeconds: .22,
  emphasisMechanism: "fillAccent",
  highlightStyle: "colour",
  supportingOpacity: 1,
  backgroundColour: null,
  backgroundPadding: 0,
  pacing: "chunk",
  gradientHeight: 0
}, {
  id: "pack-gaming",
  name: "Gaming",
  fontFamily: "anton",
  fontScale: .054,
  weight: 400,
  uppercase: !0,
  colour: "#FFFFFF",
  highlightColour: "#4DE1FF",
  strokeWidth: .045,
  strokeColour: "#0A0A12",
  shadowBlur: 0,
  shadowColour: "rgba(0,0,0,0)",
  shadowOffsetY: 0,
  anchorY: .74,
  maxWidth: .84,
  wordsPerWindow: 3,
  animation: "none",
  animationScale: 1,
  motion: "none",
  glitch: .022,
  echo: 3,
  emphasisMechanism: "fillAccent",
  highlightStyle: "colour",
  supportingOpacity: .9,
  backgroundColour: null,
  backgroundPadding: 0,
  pacing: "chunk",
  gradientHeight: .3
}, {
  id: "pack-tiktok-viral",
  name: "TikTok Viral",
  fontFamily: "montserrat",
  fontScale: .052,
  weight: 800,
  uppercase: !1,
  colour: "#FFFFFF",
  highlightColour: "#FFD400",
  strokeWidth: .07,
  strokeColour: "#000000",
  shadowBlur: 0,
  shadowColour: "rgba(0,0,0,0)",
  shadowOffsetY: 0,
  anchorY: .72,
  maxWidth: .82,
  wordsPerWindow: 4,
  animation: "scale",
  animationScale: 1.16,
  motion: "bounce-soft",
  motionSeconds: .26,
  reveal: "words",
  emoji: !0,
  emphasisMechanism: "fillAccent",
  highlightStyle: "colour",
  supportingOpacity: .85,
  backgroundColour: null,
  backgroundPadding: 0,
  pacing: "word",
  gradientHeight: .3
}, {
  id: "pack-instagram-viral",
  name: "Instagram Viral",
  fontFamily: "montserrat",
  fontScale: .044,
  weight: 700,
  uppercase: !1,
  colour: "#111111",
  highlightColour: "#111111",
  wordPlate: "#FFFFFF",
  highlightBoxRadius: .09,
  strokeWidth: 0,
  strokeColour: "#000000",
  shadowBlur: 0,
  shadowColour: "rgba(0,0,0,0)",
  shadowOffsetY: 0,
  anchorY: .76,
  maxWidth: .78,
  wordsPerWindow: 4,
  animation: "none",
  animationScale: 1,
  motion: "fade-in",
  motionSeconds: .2,
  emphasisMechanism: "fillAccent",
  highlightStyle: "colour",
  supportingOpacity: 1,
  backgroundColour: null,
  backgroundPadding: 0,
  pacing: "chunk",
  gradientHeight: .3
}, {
  id: "pack-capcut",
  name: "CapCut Trending",
  fontFamily: "montserrat",
  fontScale: .05,
  weight: 800,
  uppercase: !1,
  colour: "#FFFFFF",
  highlightColour: "#00E5A0",
  strokeWidth: 0,
  strokeColour: "#000000",
  shadowBlur: .3,
  shadowColour: "rgba(0,0,0,0.85)",
  shadowOffsetY: .022,
  anchorY: .74,
  maxWidth: .8,
  wordsPerWindow: 4,
  animation: "scale",
  animationScale: 1.2,
  motion: "bounce-soft",
  motionSeconds: .3,
  emphasisMechanism: "fillAccent",
  highlightStyle: "colour",
  supportingOpacity: .78,
  backgroundColour: null,
  backgroundPadding: 0,
  pacing: "chunk",
  gradientHeight: .3
}, {
  id: "pack-cinema",
  name: "Cinema",
  fontFamily: "inter",
  fontScale: .026,
  weight: 400,
  uppercase: !0,
  colour: "#EDEDED",
  highlightColour: "#EDEDED",
  strokeWidth: 0,
  strokeColour: "#000000",
  shadowBlur: .14,
  shadowColour: "rgba(0,0,0,0.7)",
  shadowOffsetY: .008,
  anchorY: .88,
  maxWidth: .74,
  wordsPerWindow: 7,
  letterSpacing: .24,
  animation: "none",
  animationScale: 1,
  motion: "fade-in",
  motionSeconds: .24,
  emphasisMechanism: "fillAccent",
  highlightStyle: "colour",
  supportingOpacity: 1,
  backgroundColour: null,
  backgroundPadding: 0,
  pacing: "chunk",
  gradientHeight: .52
}, {
  id: "pack-minimal",
  name: "Minimal",
  fontFamily: "inter",
  fontScale: .026,
  weight: 300,
  uppercase: !1,
  colour: "#FFFFFF",
  highlightColour: "#FFD400",
  strokeWidth: 0,
  strokeColour: "#000000",
  shadowBlur: 0,
  shadowColour: "rgba(0,0,0,0)",
  shadowOffsetY: 0,
  anchorY: .82,
  maxWidth: .7,
  wordsPerWindow: 5,
  letterSpacing: .01,
  animation: "none",
  animationScale: 1,
  motion: "none",
  emphasisMechanism: "fillAccent",
  highlightStyle: "colour",
  supportingOpacity: 1,
  backgroundColour: null,
  backgroundPadding: 0,
  pacing: "chunk",
  gradientHeight: 0
}, {
  id: "editorial",
  name: "Editorial",
  fontScale: .038,
  weight: 500,
  colour: "#F5F5F5",
  highlightColour: "#FFFFFF",
  strokeWidth: 0,
  strokeColour: "#000000",
  shadowBlur: .22,
  shadowColour: "rgba(0,0,0,0.6)",
  shadowOffsetY: .02,
  anchorY: .84,
  maxWidth: .78,
  wordsPerWindow: 6,
  animation: "fade",
  animationScale: 1,
  backgroundColour: null,
  backgroundPadding: 0,
  uppercase: !0,
  highlightStyle: "colour",
  letterSpacing: .09,
  gradientHeight: .3,
  gradientOpacity: .62,
  gradientStrength: 1.8
}, {
  id: "stacked",
  name: "Stacked",
  fontScale: .062,
  weight: 900,
  colour: "#FFFFFF",
  highlightColour: "#111114",
  strokeWidth: 0,
  strokeColour: "#000000",
  shadowBlur: 0,
  shadowColour: "rgba(0,0,0,0)",
  shadowOffsetY: 0,
  anchorY: .7,
  maxWidth: .76,
  wordsPerWindow: 3,
  animation: "none",
  animationScale: 1,
  backgroundColour: null,
  backgroundPadding: 0,
  uppercase: !0,
  wordPlate: "rgba(8,8,10,0.9)",
  highlightStyle: "box",
  highlightBoxColour: "#FFE14D",
  highlightBoxRadius: .14,
  reveal: "words",
  pacing: "word",
  gradientHeight: 0
}, {
  id: "whisper",
  name: "Whisper",
  fontScale: .042,
  weight: 400,
  colour: "rgba(255,255,255,0.94)",
  highlightColour: "#FFFFFF",
  strokeWidth: 0,
  strokeColour: "#000000",
  shadowBlur: .3,
  shadowColour: "rgba(0,0,0,0.55)",
  shadowOffsetY: .015,
  anchorY: .8,
  maxWidth: .72,
  wordsPerWindow: 5,
  animation: "fade",
  animationScale: 1,
  backgroundColour: null,
  backgroundPadding: 0,
  uppercase: !1,
  highlightStyle: "underline",
  highlightBoxColour: "rgba(255,255,255,0.85)",
  letterSpacing: .02,
  gradientHeight: .34,
  gradientOpacity: .5,
  gradientStrength: 2
}];

const hb = "cinematic";

const A3 = ud.map(n => wa({
  id: n.id,
  name: n.name,
  compositionId: n.id,
  fontFamily: "montserrat",
  fontScale: n.lines.reduce((e, t) => Math.max(e, t.scale), .04),
  weight: 700,
  colour: "#FFFFFF",
  highlightColour: n.lines.find(e => e.colour !== "#FFFFFF")?.colour ?? "#FFD400",
  strokeWidth: 0,
  strokeColour: "#000000",
  shadowBlur: .18,
  shadowColour: "rgba(0,0,0,0.55)",
  shadowOffsetY: .012,
  anchorY: n.anchorY,
  maxWidth: n.maxWidth,
  wordsPerWindow: 8,
  animation: "none",
  animationScale: 1,
  backgroundColour: null,
  backgroundPadding: 0,
  uppercase: !1,
  highlightStyle: "colour",
  pacing: "chunk",
  gradientHeight: .3
}));

const N3 = db.map(n => wa({
  id: n.id,
  name: n.name,
  compositionId: n.id,
  fontFamily: "montserrat",
  fontScale: n.lines.reduce((e, t) => Math.max(e, t.scale), .04),
  weight: 800,
  colour: "#FFFFFF",
  highlightColour: "#FF6A1F",
  strokeWidth: 0,
  strokeColour: "#000000",
  shadowBlur: .22,
  shadowColour: "rgba(0,0,0,0.6)",
  shadowOffsetY: .012,
  anchorY: n.anchorY,
  maxWidth: n.maxWidth,
  wordsPerWindow: 8,
  animation: "scale",
  animationScale: 1.14,
  backgroundColour: null,
  backgroundPadding: 0,
  uppercase: !1,
  highlightStyle: "colour",
  pacing: "chunk",
  reveal: "none",
  gradientHeight: .32,
  gradientOpacity: .45
}));

const js = [...C3.map(wa), ...N3, ...A3];

function $i(n) {
  return js.find(e => e.id === n) ?? js.find(e => e.id === hb);
}

function I0(n) {
  return n.split(/\s+/).filter(Boolean).map((e, t) => ({
    word: e,
    start: t,
    end: t + 1
  }));
}

function B0(n, e) {
  return wa({
    id: `overlay-${n}`,
    name: n,
    fontScale: e.scale,
    weight: e.weight,
    colour: e.colour,
    highlightColour: e.colour,
    strokeWidth: 0,
    strokeColour: "#000000",
    shadowBlur: 0,
    shadowColour: "rgba(0,0,0,0)",
    shadowOffsetY: 0,
    anchorY: e.anchorY,
    maxWidth: e.maxWidth,
    wordsPerWindow: 99,
    animation: "none",
    animationScale: 1,
    backgroundColour: null,
    backgroundPadding: 0,
    uppercase: e.uppercase,
    highlightStyle: "colour",
    gradientHeight: 0,
    fontFamily: e.fontFamily,
    italic: e.italic ?? !1,
    letterSpacing: e.letterSpacing ?? 0,
    pacing: "chunk",
    ...(e.bmgEffects || {})
  });
}

async function cl(n, e, t) {
  const {
      width: a,
      height: r,
      progress: l
    } = t,
    u = document.createElement("canvas");
  u.width = a, u.height = r;
  const d = u.getContext("2d", {
    alpha: !0
  });
  if (!d) return;
  const h = (1 - l) * r * (t.rise ?? .04);
  let f = e;
  try {
    t.stackAnchorY !== void 0 && (f = await Md(d, e, t)), await P4(n, d, u, f, t, h);
  } finally {
    // The pixels have already been composited. Release temporary native Skia
    // surfaces now, rather than retaining full-frame backing stores until GC.
    u.width = 1; u.height = 1;
  }
}

function vT(n, e) {
  return n.forceLtr || w3(n.text) ? "ltr" : e === "nastaliq" ? "rtl" : "ltr";
}

async function Md(n, e, t) {
  const {
    script: a,
    width: r,
    height: l
  } = t;
  {
    const u = Wf[a],
      d = e.filter(x => x.text.trim());
    for (const x of d) await as(a, l * x.scale, B0(t.id, x));
    const h = d.map(x => {
        const y = B0(t.id, x),
          w = l * x.scale;
        n.setTransform(1, 0, 0, 1, 0, 0);
        const M = vT(x, a);
        n.direction = M, n.font = Wn(y, a, w);
        const _ = ts(n, I0(x.text), x.noWrap ? {
          ...y,
          maxWidth: 1
        } : y, a, M, r, l, w, -1).length;
        return {
          block: x,
          height: Math.max(1, _) * x.scale * u
        };
      }),
      f = t.stackGap ?? .008,
      m = h.reduce((x, y) => x + y.height, 0) + f * Math.max(0, h.length - 1);
    let g = (t.stackAnchorY ?? .5) - m / 2;
    return h.map(x => {
      const y = g + x.height / 2;
      return g += x.height + f, {
        ...x.block,
        anchorY: y
      };
    });
  }
}

async function P4(n, e, t, a, r, l) {
  const {
    script: u,
    width: d,
    height: h,
    progress: f
  } = r;
  for (const m of a) {
    if (!m.text.trim()) continue;
    const g = B0(r.id, m),
      x = h * m.scale;
    await as(u, x, g);
    const y = vT(m, u);
    e.setTransform(1, 0, 0, 1, 0, 0), e.direction = y, e.font = Wn(g, u, x);
    let w = x;
    const M = m.noWrap ? {
      ...g,
      maxWidth: 1
    } : g;
    let _ = ts(e, I0(m.text), M, u, y, d, h, x, -1);
    const v = Math.max(0, ..._.map(N => N.width)),
      A = d * m.maxWidth;
    if (v > A && v > 0) {
      w = x * (A / v);
      const N = {
        ...M,
        fontScale: w / h
      };
      e.font = Wn(N, u, w), _ = ts(e, I0(m.text), N, u, y, d, h, w, -1);
    }
    Mo(t, e, {
      index: 0,
      activeWord: -1,
      lines: _
    }, {
      ...g,
      fontScale: w / h
    }, u, w), n.save(), n.globalAlpha *= f, n.drawImage(t, (m.shiftX ?? 0) * d, l), n.restore();
  }
}

function yd(n, e) {
  const t = {
    colour: n.text,
    highlightColour: n.keyword
  };
  return e.strokeWidth > 0 && (t.strokeColour = n.outline), e.highlightStyle !== "colour" && (t.highlightBoxColour = n.plate), e.wordPlate && (t.wordPlate = n.plate), e.backdropOpacity > 0 && (t.backdropColour = n.plate), t;
}

const U1 = [{
  id: "classic",
  name: "Classic",
  palette: {
    text: "#FFFFFF",
    keyword: "#FFD400",
    plate: "#111111",
    outline: "#000000"
  }
}, {
  id: "mono",
  name: "Mono",
  palette: {
    text: "#FFFFFF",
    keyword: "#FFFFFF",
    plate: "#101010",
    outline: "#000000"
  }
}, {
  id: "mint",
  name: "Mint",
  palette: {
    text: "#FFFFFF",
    keyword: "#6FE3C4",
    plate: "#0E1A16",
    outline: "#000000"
  }
}, {
  id: "coral",
  name: "Coral",
  palette: {
    text: "#F4EDE3",
    keyword: "#FF7A4D",
    plate: "#1A0F0A",
    outline: "#000000"
  }
}, {
  id: "cyan",
  name: "Cyan",
  palette: {
    text: "#FFFFFF",
    keyword: "#4DE1FF",
    plate: "#08131A",
    outline: "#000000"
  }
}, {
  id: "alert",
  name: "Alert",
  palette: {
    text: "#FFFFFF",
    keyword: "#E23744",
    plate: "#1A0A0C",
    outline: "#000000"
  }
}, {
  id: "magenta",
  name: "Magenta",
  palette: {
    text: "#FFFFFF",
    keyword: "#E6007A",
    plate: "#17040E",
    outline: "#000000"
  }
}, {
  id: "cream",
  name: "Cream",
  palette: {
    text: "#F5F0E8",
    keyword: "#E8B21A",
    plate: "#141210",
    outline: "#000000"
  }
}, {
  id: "ink",
  name: "Ink",
  palette: {
    text: "#101010",
    keyword: "#E23744",
    plate: "#FFFFFF",
    outline: "#FFFFFF"
  }
}];

export { js as templates, Mo as drawState, ts as layoutPhrase, cl as drawBlocks,
Md as stackBlocks, dp as compositionById, hp as composeLines, yd as paletteOverrides,
U1 as palettes, Wn as captionFont, cb as planStates, as as ensureFonts, Hf as fontFamilies };
