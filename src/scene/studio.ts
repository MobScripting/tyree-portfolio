import * as THREE from "three";

// Studio surfaces for the Device, painted once on canvases (like the matcap) so the Stage keeps
// unlit materials: a matcap can't shade a flat face, so the deck's light falloff, the keys, the
// contact shadow, the floor light pool and the screen's spill are drawn instead of lit.

const cache = new Map<string, THREE.CanvasTexture>();

function paint(key: string, w: number, h: number, draw: (c: CanvasRenderingContext2D) => void, srgb = true) {
  const hit = cache.get(key);
  if (hit) return hit;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  draw(canvas.getContext("2d")!);
  const tex = new THREE.CanvasTexture(canvas);
  if (srgb) tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  cache.set(key, tex);
  return tex;
}

function rr(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  c.beginPath();
  c.roundRect(x, y, w, h, r);
}

// Deck top, laid out in the deck's own proportions (3 x 2.05 units). Top of the canvas is the
// hinge (back), bottom is the front edge nearest the viewer.
export function deckTexture() {
  return paint("deck", 1500, 1025, (c) => {
    const W = 1500;
    const H = 1025;
    const metal = c.createLinearGradient(0, 0, 0, H);
    metal.addColorStop(0, "#8e9198");
    metal.addColorStop(0.55, "#b4b7bd");
    metal.addColorStop(1, "#c9ccd1");
    c.fillStyle = metal;
    c.fillRect(0, 0, W, H);

    // Keyboard well: graphite keycaps on a near-black bed, each key with a lighter top edge.
    const kx = 90;
    const ky = 110;
    const kw = W - 2 * kx;
    const kh = 470;
    rr(c, kx, ky, kw, kh, 18);
    c.fillStyle = "#0e0e10";
    c.fill();
    const rows = 6;
    const gap = 9;
    const rowH = (kh - gap * (rows + 1)) / rows;
    for (let r = 0; r < rows; r++) {
      const y = ky + gap + r * (rowH + gap);
      // Bottom row: a long space bar flanked by shorter keys; other rows: an even grid.
      const keys = r === rows - 1 ? [1.2, 1.2, 1.2, 6.2, 1.2, 1.2, 1.2, 1.2] : r === 0 ? Array(14).fill(1) : Array(13).fill(1.07);
      const unit = (kw - gap * (keys.length + 1)) / keys.reduce((a, b) => a + b, 0);
      let x = kx + gap;
      for (const k of keys) {
        const w = k * unit;
        rr(c, x, y, w, r === 0 ? rowH * 0.62 : rowH, 7);
        c.fillStyle = "#1d1d1f";
        c.fill();
        c.fillStyle = "rgba(255,255,255,0.09)";
        c.fillRect(x + 4, y + 1, w - 8, 1.5);
        x += w + gap;
      }
    }

    // Trackpad: a slightly darker inset with a soft edge, centered below the keyboard.
    const tw = 560;
    const th = 330;
    const tx = (W - tw) / 2;
    const ty = ky + kh + 70;
    rr(c, tx, ty, tw, th, 22);
    const pad = c.createLinearGradient(0, ty, 0, ty + th);
    pad.addColorStop(0, "#a8abb1");
    pad.addColorStop(1, "#bfc2c7");
    c.fillStyle = pad;
    c.fill();
    c.strokeStyle = "rgba(0,0,0,0.18)";
    c.lineWidth = 2;
    c.stroke();
  });
}

// Soft contact shadow under the base: a blurred rounded rectangle, black with alpha. Used as a
// plain map (not an alphaMap) so it shares the shader program of the other unlit surfaces.
export function shadowTexture() {
  return paint(
    "shadow",
    512,
    384,
    (c) => {
      c.filter = "blur(26px)";
      rr(c, 70, 60, 372, 264, 40);
      c.fillStyle = "rgba(0,0,0,0.85)";
      c.fill();
    },
    false,
  );
}

// The studio light pool on the floor: graphite at the center falling off into the stage.
export function poolTexture() {
  return paint("pool", 512, 512, (c) => {
    const g = c.createRadialGradient(256, 256, 0, 256, 256, 256);
    g.addColorStop(0, "rgba(34,35,42,0.95)");
    g.addColorStop(0.45, "rgba(26,27,32,0.55)");
    g.addColorStop(1, "rgba(26,27,32,0)");
    c.fillStyle = g;
    c.fillRect(0, 0, 512, 512);
  });
}

// Light the display throws onto the deck: brightest at the hinge, fading toward the viewer.
export function glowTexture() {
  return paint("glow", 256, 256, (c) => {
    const g = c.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0, "rgba(190,198,255,0.9)");
    g.addColorStop(0.5, "rgba(150,160,255,0.25)");
    g.addColorStop(1, "rgba(150,160,255,0)");
    c.fillStyle = g;
    c.fillRect(0, 0, 256, 256);
    // Fade the sides so the spill reads as cast by the screen, not a stripe.
    c.globalCompositeOperation = "destination-in";
    const side = c.createLinearGradient(0, 0, 256, 0);
    side.addColorStop(0, "rgba(0,0,0,0)");
    side.addColorStop(0.2, "rgba(0,0,0,1)");
    side.addColorStop(0.8, "rgba(0,0,0,1)");
    side.addColorStop(1, "rgba(0,0,0,0)");
    c.fillStyle = side;
    c.fillRect(0, 0, 256, 256);
  });
}
