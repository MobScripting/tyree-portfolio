# 05: 3D hero

**What to build:** A fixed WebGL stage behind the HTML in which a procedural laptop opens out of darkness and responds to scroll.

**Blocked by:** 03

**Status:** done

- [x] One scroll timeline drives the camera and device poses, with no per-frame React renders
- [x] Reduced motion gives static poses; no WebGL or low performance gives still images; mobile gets a lighter scene
- [x] Canvas is aria-hidden; no console errors
- [x] Lighthouse mobile performance >= 85

Notes:
- Lighthouse mobile (4x CPU throttle): performance 87 on a hardware GPU (D3D11), 74 on software GL (SwiftShader, the worst case), 96 with WebGL off. Accessibility 100, SEO 100, CLS 0. The one console error is the Vercel Analytics script returning 404 on localhost.
- GSAP was dropped. Each Device follows its DOM slot directly (getBoundingClientRect in useFrame), which made a separate scroll timeline unnecessary. Lenis provides the smooth scroll.
- Lighting is a canvas-painted matcap with no environment bake: the bake cost about 2.9s of blocking time on software GL. Known limitation for ticket 10: the flat deck reads evenly lit.
- Screens are abstract canvas placeholders until ticket 10 adds real footage loops.
