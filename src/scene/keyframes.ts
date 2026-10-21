// Scene keyframes: one Device per stage slot. A slot's scroll progress t runs from -1
// (slot entering at the bottom) through 0 (centered) to 1 (leaving at the top), and the
// Device pose interpolates enter -> rest -> exit across it.

export type Pose = { rx: number; ry: number; lid: number };
export type ScreenId = "flowpulse" | "ad";

export type SlotDef = {
  screen: ScreenId;
  enter: Pose;
  rest: Pose;
  exit: Pose;
  // The hero Device opens its lid on load instead of on scroll.
  intro?: boolean;
};

export const slots: Record<string, SlotDef> = {
  hero: {
    screen: "flowpulse",
    intro: true,
    enter: { rx: 0.32, ry: 0, lid: 1.9 },
    rest: { rx: 0.32, ry: 0, lid: 1.9 },
    exit: { rx: 0.62, ry: 0, lid: 1.15 },
  },
  flowpulse: {
    screen: "flowpulse",
    enter: { rx: 0.5, ry: -0.95, lid: 1.2 },
    rest: { rx: 0.26, ry: -0.38, lid: 1.9 },
    exit: { rx: 0.2, ry: 0.15, lid: 1.9 },
  },
  "ad-manager": {
    screen: "ad",
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
