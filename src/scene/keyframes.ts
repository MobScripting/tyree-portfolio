// Scene keyframes: one Device per stage slot. A slot's scroll progress t runs from -1
// (slot entering at the bottom) through 0 (centered) to 1 (leaving at the top), and the
// Device pose interpolates enter -> rest -> exit across it.

export type Pose = { rx: number; ry: number; lid: number };
export type ScreenId = "flowpulse" | "ad";

export type SlotDef = {
  // Canvas placeholder shown until footage loads, and with no footage at all.
  screen: ScreenId;
  // Screenshots shown in order across the slot's scroll progress, cross-fading between them.
  stills: string[];
  enter: Pose;
  rest: Pose;
  exit: Pose;
  // The hero Device opens its lid on load instead of on scroll.
  intro?: boolean;
};

const fp = (name: string) => `/footage/flowpulse/${name}`;
const ad = (name: string) => `/footage/ad-manager/${name}`;
const ask = (name: string) => `/footage/ask-tyree/${name}`;

export const slots: Record<string, SlotDef> = {
  hero: {
    screen: "flowpulse",
    stills: [fp("invoices.jpg")],
    intro: true,
    enter: { rx: 0.32, ry: 0, lid: 1.9 },
    rest: { rx: 0.32, ry: 0, lid: 1.9 },
    exit: { rx: 0.62, ry: 0, lid: 1.15 },
  },
  flowpulse: {
    screen: "flowpulse",
    stills: [fp("invoices.jpg"), fp("reports.jpg"), fp("reconcile.jpg")],
    enter: { rx: 0.5, ry: -0.95, lid: 1.2 },
    rest: { rx: 0.26, ry: -0.38, lid: 1.9 },
    exit: { rx: 0.2, ry: 0.15, lid: 1.9 },
  },
  ai: {
    screen: "flowpulse",
    stills: [ask("answer.jpg")],
    enter: { rx: 0.5, ry: -0.8, lid: 1.3 },
    rest: { rx: 0.24, ry: -0.3, lid: 1.9 },
    exit: { rx: 0.2, ry: 0.1, lid: 1.9 },
  },
  "ad-manager": {
    screen: "ad",
    stills: [ad("jobs.jpg"), ad("job-partial.jpg"), ad("templates.jpg")],
    enter: { rx: 0.5, ry: 0.95, lid: 1.2 },
    rest: { rx: 0.26, ry: 0.38, lid: 1.9 },
    exit: { rx: 0.2, ry: -0.15, lid: 1.9 },
  },
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function poseAt(def: SlotDef, t: number): Pose {
  const [from, to, u] = t < 0 ? [def.enter, def.rest, t + 1] : [def.rest, def.exit, t];
  // Ease the outer half so the Device settles into its rest pose near center.
  const e = 1 - Math.pow(1 - Math.min(Math.max(u, 0), 1), 2);
  const k = t < 0 ? e : u * u;
  return { rx: lerp(from.rx, to.rx, k), ry: lerp(from.ry, to.ry, k), lid: lerp(from.lid, to.lid, k) };
}

// Which two stills to show at scroll progress t, and how far to fade from the first to the
// second. Each still holds for most of its share, then cross-fades quickly into the next.
export function screenAt(count: number, t: number): { a: number; b: number; mix: number } {
  if (count < 2) return { a: 0, b: 0, mix: 0 };
  const f = ((Math.min(Math.max(t, -1), 1) + 1) / 2) * (count - 1);
  const a = Math.min(Math.floor(f), count - 2);
  const frac = f - a;
  const s = Math.min(Math.max((frac - 0.4) / 0.2, 0), 1);
  return { a, b: a + 1, mix: s * s * (3 - 2 * s) };
}
