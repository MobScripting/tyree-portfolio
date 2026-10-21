import * as THREE from "three";

// Studio-lit aluminium as a matcap: a sphere painted once on a canvas. It replaces an
// environment bake, whose cube render and PMREM passes cost seconds on software GL.

let cached: THREE.CanvasTexture | null = null;

export function aluminiumMatcap() {
  if (cached) return cached;
  const s = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = s;
  const c = canvas.getContext("2d")!;
  const r = s / 2;

  c.save();
  c.beginPath();
  c.arc(r, r, r, 0, Math.PI * 2);
  c.clip();

  // Key light from above, falling off to graphite at the floor.
  const body = c.createLinearGradient(0, 0, 0, s);
  body.addColorStop(0, "#e4e6ea");
  body.addColorStop(0.22, "#aeb2b9");
  body.addColorStop(0.48, "#8a8e96");
  body.addColorStop(0.74, "#565960");
  body.addColorStop(1, "#1f2126");
  c.fillStyle = body;
  c.fillRect(0, 0, s, s);

  // Tight soft-box highlight and two side strips, like the keynote stage.
  const key = c.createRadialGradient(r, s * 0.14, 2, r, s * 0.14, s * 0.24);
  key.addColorStop(0, "rgba(255,255,255,0.9)");
  key.addColorStop(1, "rgba(255,255,255,0)");
  c.fillStyle = key;
  c.fillRect(0, 0, s, s);
  for (const x of [s * 0.1, s * 0.9]) {
    const strip = c.createRadialGradient(x, r, 2, x, r, s * 0.22);
    strip.addColorStop(0, "rgba(235,238,245,0.55)");
    strip.addColorStop(1, "rgba(235,238,245,0)");
    c.fillStyle = strip;
    c.fillRect(0, 0, s, s);
  }
  c.restore();

  cached = new THREE.CanvasTexture(canvas);
  cached.colorSpace = THREE.SRGBColorSpace;
  return cached;
}
