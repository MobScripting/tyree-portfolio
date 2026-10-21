"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useState, type ReactNode } from "react";
import Lenis from "lenis";

const Stage = dynamic(() => import("@/scene/Stage"), { ssr: false });

// The head probe only checks for the WebGL API. If the real context fails (blocked GPU,
// driver blocklist), switch the stage off so the slots collapse and the page reads as text.
class StageBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    delete document.documentElement.dataset.stage;
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

// Mounts the 3D Stage only when html[data-stage="on"], and adds smooth scrolling
// unless the visitor prefers reduced motion.
export function StageLoader() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    // Wait for idle time so WebGL setup never competes with first paint.
    const mount = () => setOn(document.documentElement.dataset.stage === "on");
    const idle = "requestIdleCallback" in window;
    const id = idle ? requestIdleCallback(mount, { timeout: 1200 }) : window.setTimeout(mount, 300);
    const cancel = () => (idle ? cancelIdleCallback(id) : clearTimeout(id));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return cancel;
    const lenis = new Lenis({ autoRaf: true, anchors: true });
    return () => {
      cancel();
      lenis.destroy();
    };
  }, []);

  return on ? (
    <StageBoundary>
      <Stage />
    </StageBoundary>
  ) : null;
}
