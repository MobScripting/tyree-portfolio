"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Laptop, LAPTOP } from "./Laptop";
import { poseAt, slots, type SlotDef } from "./keyframes";

// The Stage (docs/adr/0001): a fixed, aria-hidden canvas behind the page. Each
// [data-stage-slot] element in the DOM gets a Device locked to its on-screen box,
// so layout owns placement and the scene only adds depth and motion.

const damp = THREE.MathUtils.damp;

function Device({ el, def, reduced }: { el: HTMLElement; def: SlotDef; reduced: boolean }) {
  const root = useRef<THREE.Group>(null);
  const lid = useRef<THREE.Group>(null);
  const intro = useRef(def.intro && !reduced ? 0 : 1);
  const pose = useRef({ rx: def.rest.rx, ry: def.rest.ry, lid: 0, s: 0 });

  useFrame((state, delta) => {
    const g = root.current;
    if (!g || !lid.current) return;
    const { size, viewport } = state;
    const r = el.getBoundingClientRect();
    g.visible = r.bottom > -80 && r.top < size.height + 80;
    if (!g.visible) return;

    // Screen px -> world units on the z = 0 plane; position tracks layout 1:1.
    const k = viewport.height / size.height;
    // Fit the rest pose's turned footprint, not the flat width, so 3/4 views stay in the slot.
    const fitW = LAPTOP.w * Math.cos(def.rest.ry) + LAPTOP.d * Math.abs(Math.sin(def.rest.ry));
    const s = Math.min((r.width * k) / (fitW * 1.1), (r.height * k) / 2.6);
    g.position.set(
      (r.left + r.width / 2 - size.width / 2) * k,
      // Drop by roughly half the open laptop's height so the whole Device centers in the slot.
      -(r.top + r.height / 2 - size.height / 2) * k - s * 0.85,
      0,
    );

    const t = THREE.MathUtils.clamp((size.height / 2 - (r.top + r.height / 2)) / (size.height / 2 + r.height / 2), -1, 1);
    const target = poseAt(def, t);
    if (intro.current < 1) intro.current = Math.min(1, intro.current + delta / 1.6);
    const open = 1 - Math.pow(1 - intro.current, 4);

    const p = pose.current;
    // Springs-like damping keeps every change interruptible from the current value.
    const l = reduced ? Infinity : 7;
    p.rx = damp(p.rx, target.rx, l, delta);
    p.ry = damp(p.ry, target.ry, l, delta);
    p.lid = reduced ? target.lid : damp(p.lid, target.lid * open, intro.current < 1 ? 60 : l, delta);
    p.s = s;

    g.rotation.set(p.rx, p.ry, 0);
    g.scale.setScalar(p.s);
    lid.current.rotation.x = -p.lid;

    // Demand frameloop: keep rendering only while the Device is still settling.
    const moving =
      Math.abs(p.rx - target.rx) + Math.abs(p.ry - target.ry) + Math.abs(p.lid - target.lid * open) > 1e-3;
    if (moving || intro.current < 1) state.invalidate();
  });

  return (
    <group ref={root} visible={false}>
      <Laptop ref={lid} screen={def.screen} />
    </group>
  );
}

// Software-rendered WebGL turns every frame into a long main-thread task, so the
// Stage renders on demand: scroll and resize request frames, Devices request more
// only while their pose is still moving.
function ScrollInvalidator() {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    const on = () => invalidate();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, [invalidate]);
  return null;
}

export default function Stage() {
  const [els, setEls] = useState<{ id: string; el: HTMLElement }[]>([]);
  const [dpr, setDpr] = useState<number | [number, number]>([1, 1.75]);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const found = [...document.querySelectorAll<HTMLElement>("[data-stage-slot]")]
      .map((el) => ({ id: el.dataset.stageSlot!, el }))
      .filter((s) => s.id in slots);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    mq.addEventListener("change", sync);
    // Defer to the next frame: the stage mounts after the DOM it mirrors.
    const id = requestAnimationFrame(() => {
      setEls(found);
      sync();
      if (window.innerWidth < 768) setDpr([1, 1.5]);
    });
    return () => {
      cancelAnimationFrame(id);
      mq.removeEventListener("change", sync);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <Canvas
        dpr={dpr}
        frameloop="demand"
        camera={{ position: [0, 0, 14], fov: 30 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ScrollInvalidator />
        {els.map(({ id, el }) => (
          <Device key={id} el={el} def={slots[id]} reduced={reduced} />
        ))}
      </Canvas>
    </div>
  );
}
