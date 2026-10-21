import * as THREE from "three";
import type { ScreenId } from "./keyframes";

// Illustrative screen placeholders until real footage loops land (ticket 10).
// Abstract shapes only: no figures, names or data a visitor could read as real.

const W = 1280;
const H = 800;

function rr(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, fill: string) {
  c.fillStyle = fill;
  c.beginPath();
  c.roundRect(x, y, w, h, r);
  c.fill();
}

function flowpulse(c: CanvasRenderingContext2D) {
  c.fillStyle = "#0e0f1d";
  c.fillRect(0, 0, W, H);
  rr(c, 0, 0, 230, H, 0, "#14152a");
  c.fillStyle = "#6366f1";
  c.beginPath();
  c.arc(44, 52, 10, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = "#f5f5f7";
  c.font = "600 26px system-ui, sans-serif";
  c.fillText("FlowPulse", 64, 61);
  for (let i = 0; i < 7; i++) rr(c, 32, 120 + i * 48, i === 0 ? 166 : 120 - (i % 3) * 18, 14, 7, i === 0 ? "#4f46e5" : "#2a2b45");

  rr(c, 270, 40, 360, 22, 11, "#2a2b45");
  rr(c, 1110, 32, 130, 38, 19, "#4f46e5");

  rr(c, 270, 100, 970, 360, 18, "#14152a");
  const g = c.createLinearGradient(0, 160, 0, 440);
  g.addColorStop(0, "rgba(99,102,241,0.55)");
  g.addColorStop(1, "rgba(99,102,241,0)");
  const pts = [0.62, 0.55, 0.6, 0.45, 0.5, 0.36, 0.42, 0.3, 0.33, 0.22, 0.26];
  const px = (i: number) => 300 + (i / (pts.length - 1)) * 910;
  const py = (v: number) => 140 + v * 300;
  c.beginPath();
  c.moveTo(px(0), py(pts[0]));
  pts.forEach((v, i) => c.lineTo(px(i), py(v)));
  c.lineTo(px(pts.length - 1), 440);
  c.lineTo(px(0), 440);
  c.closePath();
  c.fillStyle = g;
  c.fill();
  c.beginPath();
  pts.forEach((v, i) => (i ? c.lineTo(px(i), py(v)) : c.moveTo(px(i), py(v))));
  c.strokeStyle = "#818cf8";
  c.lineWidth = 4;
  c.stroke();

  for (let i = 0; i < 3; i++) {
    const x = 270 + i * 330;
    rr(c, x, 490, 310, 270, 18, "#14152a");
    rr(c, x + 24, 520, 120, 14, 7, "#2a2b45");
    for (let j = 0; j < 5; j++) rr(c, x + 24, 568 + j * 36, 262 - ((i + j) % 4) * 40, 12, 6, j === 0 ? "#6366f1" : "#24253d");
  }
}

function ad(c: CanvasRenderingContext2D) {
  c.fillStyle = "#f4f5f8";
  c.fillRect(0, 0, W, H);
  rr(c, 0, 0, W, 72, 0, "#ffffff");
  c.fillStyle = "#111827";
  c.font = "600 24px system-ui, sans-serif";
  c.fillText("AD Account Manager", 32, 45);
  rr(c, 1080, 18, 168, 36, 18, "#2563eb");

  rr(c, 32, 104, 1216, 120, 16, "#ffffff");
  rr(c, 60, 132, 220, 14, 7, "#d1d5db");
  rr(c, 60, 168, 1160, 18, 9, "#e5e7eb");
  rr(c, 60, 168, 740, 18, 9, "#2563eb");

  rr(c, 32, 252, 1216, 516, 16, "#ffffff");
  for (let i = 0; i < 9; i++) {
    const y = 290 + i * 52;
    rr(c, 60, y, 28, 28, 14, i % 3 === 2 ? "#fde68a" : "#bbf7d0");
    rr(c, 108, y + 7, 260 - (i % 4) * 30, 14, 7, "#d1d5db");
    rr(c, 460, y + 7, 300 - (i % 3) * 50, 14, 7, "#e5e7eb");
    rr(c, 880, y + 7, 160, 14, 7, "#e5e7eb");
    if (i < 8) {
      c.fillStyle = "#f1f2f5";
      c.fillRect(60, y + 40, 1160, 2);
    }
  }
}

const draw: Record<ScreenId, (c: CanvasRenderingContext2D) => void> = { flowpulse, ad };

export function makeScreenTexture(id: ScreenId) {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  draw[id](canvas.getContext("2d")!);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}
