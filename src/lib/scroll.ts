import type Lenis from "lenis";

// The page's smooth scroller, registered by StageLoader on the home page. Scrolling through it
// (rather than jumping) is what scrubs the 3D Devices, so a citation can "fly the camera".
let lenis: Lenis | null = null;
export const setLenis = (l: Lenis | null) => {
  lenis = l;
};

// Scroll to a section or heading and move focus there. Reduced motion jumps instead.
export function flyTo(el: HTMLElement) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) el.scrollIntoView({ block: "start" });
  else if (lenis) lenis.scrollTo(el, { offset: -80, duration: 1.6 });
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
  if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
}

// For a link to this page with a hash: the target element, or null when it's another page.
export function samePageTarget(href: string): HTMLElement | null {
  const url = new URL(href, window.location.href);
  if (url.pathname !== window.location.pathname || !url.hash) return null;
  return document.getElementById(decodeURIComponent(url.hash.slice(1)));
}
