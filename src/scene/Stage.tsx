"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Laptop, LAPTOP, SCREEN } from "./Laptop";
import { poseAt, screenAt, slots, type SlotDef } from "./keyframes";
import { makeScreenTexture } from "./screens";
import { ready, still } from "./footage";

// The Stage (docs/adr/0001): a fixed, aria-hidden canvas behind the page. Each
// [data-stage-slot] element in the DOM gets a Device locked to its on-screen box,
// so layout owns placement and the scene only adds depth and motion.

const damp = THREE.MathUtils.damp;

function Device({ el, def, reduced }: { el: HTMLElement; def: SlotDef; reduced: boolean }) {
  const root = useRef<THREE.Group>(null);
  const lid = useRef<THREE.Group>(null);
  const intro = useRef(def.intro && !reduced ? 0 : 1);
  const pose = useRef({ rx: def.rest.rx, ry: def.rest.ry, lid: 0, s: 0 });
  const invalidate = useThree((s) => s.invalidate);

  // Screen: plane A shows the current still, plane B fades in the next one on top of it.
  const placeholder = useMemo(() => makeScreenTexture(def.screen), [def.screen]);
  // Footage is requested the first time the Device comes into view, so off-screen Devices
  // add no image decodes or texture uploads to page load.
  const textures = useRef<THREE.Texture[] | null>(null);
  const matA = useRef<THREE.MeshBasicMaterial>(null);
  const matB = useRef<THREE.MeshBasicMaterial>(null);
  useEffect(() => () => placeholder.dispose(), [placeholder]);

  useFrame((state, delta) => {
    const g = root.current;
    const A = matA.current;
    const B = matB.current;
    if (!g || !lid.current || !A || !B) return;
    const { size, viewport } = state;
    const r = el.getBoundingClientRect();
    g.visible = r.bottom > -80 && r.top < size.height + 80;
    if (!g.visible) return;
    textures.current ??= def.stills.map((url) => still(url, invalidate));

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

    // Footage: stills cross-faded by scroll progress, placeholder until each one loads.
    const tex = textures.current;
    const pick = (i: number) => (tex[i] && ready(tex[i]) ? tex[i] : placeholder);
    const { a, b, mix } = screenAt(tex.length, t);
    A.map = pick(a);
    B.map = pick(b);
    B.opacity = b === a ? 0 : mix;

    // Demand frameloop: keep rendering only while the Device is still settling.
    const moving =
      Math.abs(p.rx - target.rx) + Math.abs(p.ry - target.ry) + Math.abs(p.lid - target.lid * open) > 1e-3;
    if (moving || intro.current < 1) state.invalidate();
  });

  return (
    <group ref={root} visible={false}>
      <Laptop ref={lid}>
        <mesh>
          <planeGeometry args={[SCREEN.w, SCREEN.h]} />
          <meshBasicMaterial ref={matA} map={placeholder} toneMapped={false} />
        </mesh>
        <mesh position-z={0.001}>
          <planeGeometry args={[SCREEN.w, SCREEN.h]} />
          <meshBasicMaterial ref={matB} toneMapped={false} transparent opacity={0} depthWrite={false} />
        </mesh>
      </Laptop>
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
