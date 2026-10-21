import * as THREE from "three";

// Real screen footage for Devices (tickets 08-10). Stills are cached per URL and shared by
// every Device; until an image arrives a Device keeps its canvas placeholder (screens.ts).
// Stills only: Playwright's screen recordings looked washed out and soft on the Device, and a
// video texture would force a render per frame, which software GL can't afford.

const stills = new Map<string, { tex: THREE.Texture; waiting: Set<() => void> | null }>();
const loader = new THREE.TextureLoader();

// Returns the shared texture at once; onLoad fires when its image is ready (now, if cached).
export function still(url: string, onLoad: () => void): THREE.Texture {
  let entry = stills.get(url);
  if (!entry) {
    const waiting = new Set([onLoad]);
    const tex = loader.load(url, () => {
      waiting.forEach((cb) => cb());
      entry!.waiting = null;
    });
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    entry = { tex, waiting };
    stills.set(url, entry);
  } else if (entry.waiting) entry.waiting.add(onLoad);
  else onLoad();
  return entry.tex;
}

export const ready = (tex: THREE.Texture) => {
  const img = tex.image as HTMLImageElement | undefined;
  return !!img && img.complete && img.naturalWidth > 0;
};
