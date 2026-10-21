# 06: Case study pages

**What to build:** Full readable case studies for FlowPulse and the AD Account Manager: problem, architecture diagram, key decisions, stack, and a walkthrough CTA.

**Blocked by:** 03

**Status:** done

- [x] /work/flowpulse and /work/ad-manager render from MDX
- [x] Every claim can be checked against the repos; AD content is sanitized
- [x] Per-page metadata

Notes:
- Lighthouse mobile on both pages: performance 98, accessibility 100, SEO 100.
- Verifying claims caught four mistakes that had already shipped on the home page or in PRODUCT.md, now fixed:
  - The AD installer registers a scheduled task, not a Windows service.
  - An expired trial blocks new records; it does not make the workspace read-only.
  - Zod covers half the route modules, not every write.
  - The route module without org scoping is `public.js`.
- An unknown /work slug renders the 404 page with noindex but HTTP 200, because of streamed partial prerendering (documented Next 16 behavior).
- On phones, code excerpts scroll inside a focusable box.
