---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: []
---

Scope: home scroll story (`/`). Visitor mode: Experience — the work leads from the first viewport.
Audience/job: recruiters deciding in under a minute whether Tyree builds and runs real software. Actions: open a case study, ask the Assistant, download a resume variant. Proof: running FlowPulse and AD Manager footage, proof stats. Constraints: see PRODUCT.md and docs/adr.
Build path: code-led (no image generation available).

## Direction contract
THESIS: A product keynote for one engineer. Real software gets unveiled on real hardware in a dark hall, the way Apple reveals a laptop. It refuses the category default of a centered name, a skill-badge grid and a row of project cards.
OWN-WORLD: The ground is a near-black stage (#050507), lit only by soft studio light falling off to graphite. Text is aluminium (#f5f5f7 primary, #86868b secondary). There is one accent, FlowPulse indigo (#6366f1), and it appears only on live state and the primary action. Type: Geist display, very large and tight-tracked; Geist Mono for proof stats only. Pill controls, no borders, no cards-on-cards. Depth comes from light, not shadows.
STORY: The recruiter understands that Tyree builds and runs SaaS, believes it because the software is visibly running on the Device, then opens FlowPulse, asks the Assistant, or takes a resume.
FIRST VIEWPORT: Full-bleed stage. The display line ("I build the software. I run the servers.") leads at about 6vw, capped at 6rem by the craft floor; the name lives in the nav, not in a kicker. The laptop is centered at about 42vw at 1440x900 (amended from 60vw: larger collides with the headline or pushes both pills below the fold) and about 90vw on phones, on a soft graphite light pool, and its lid opens within the first second to a glowing FlowPulse dashboard. Under it are a primary pill ("See FlowPulse", indigo) and a secondary pill ("Ask Tyree"). The nav is minimal: name on the left; Work, AI, Experience and Resume on the right.
FORM: Apple keynote product reveal. It was pinned by the user, so it's option 1 of 1. seed:e6f9725fc24d03c3 (the user-pinned direction stands; the roll is recorded for reference). Signature interaction: scroll scrubs the Device (lid, rotation, camera dolly), can be interrupted in either direction, and cross-fades the screen footage at each section. Assistant citations fly the camera to the section they cite.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
