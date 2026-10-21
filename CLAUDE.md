# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

Personal portfolio for Tyree Chappell, aimed at full-stack/SaaS and AI/LLM engineering roles. It uses Next.js 16 (App Router, Turbopack, Cache Components), React 19, Tailwind 4, react-three-fiber (no drei), Lenis and MDX, and deploys to Vercel. Next 16 breaks older conventions: read `node_modules/next/dist/docs/` before using a Next API you haven't checked.

## Commands

- `npm run dev`: dev server on :3000. In the desktop app, start it with the `portfolio` preview config in `.claude/launch.json`.
- `npm run build`: production build.
- `npm run lint`: ESLint.
- `npm run typecheck`: runs `next typegen` then `tsc`. `LayoutProps`/`PageProps` are generated types, so plain `tsc` fails without typegen.
- `node scripts/capture.mjs [baseUrl]`: headless Playwright captures with SwiftShader WebGL into `.impeccable/review/`: desktop 1440 and mobile 390, full page, first viewport, each stage slot, and the hero intro. It also prints stage state, horizontal overflow and console errors. Use it when the browser pane can't screenshot.
- `npm run resume:pdf`: prints `/resume` and `/resume/ai` to `public/Tyree-Chappell-Resume-{FullStack,AI}.pdf` via Playwright. Run it against `npx next start -p 3100` after `npm run build`, and rerun it whenever `src/content/` changes. It fails if a sheet passes one Letter page or the text contains a phone-like number. Commit the regenerated PDFs. `next start` serves only `public/` files that existed at build time, so rebuild before testing downloads locally.
- `node scripts/lighthouse.mjs [url]`: Lighthouse mobile run through Playwright's Chromium (the Lighthouse CLI's own launcher fails here). Run it against `npx next start -p 3100` after `npm run build`. It uses SwiftShader, the software-GL worst case; for the real-GPU number, swap the flags for `--use-angle=d3d11 --ignore-gpu-blocklist --enable-gpu`.

## Where decisions live (read before changing direction)

- `PRODUCT.md`: product truth, positioning, and the evidence that may be claimed.
- `GLOSSARY.md`: canonical terms (Track, Case study, Lab item, Proof stat, Stage, Device, Scene keyframe, Footage loop, Assistant). Use them in code and copy.
- `docs/adr/`: hard-to-reverse decisions. The most important ones:
  - 0001: HTML owns every fact; the 3D Stage is aria-hidden decoration.
  - 0002: one content source drives the site and both resume variants.
  - 0004: verifiable claims only, and no phone number or street address in anything public.
  - 0005: a server runtime (not static export) for the Assistant route.
- `.impeccable/surfaces/src-app-page-tsx.md`: the home page's direction contract (Apple keynote, dark stage, one indigo accent). DESIGN.md gets written at the end of the build by impeccable's documenter.
- `.scratch/portfolio/issues/NN-*.md`: tickets with blocking edges and acceptance checklists. Mark checkboxes and Status as work lands.

## Architecture

- `src/content/*.ts` is the single source of truth: `profile`, `projects` (featured projects with proof stats and beats, plus lab items), and `experience`. Every bullet and project carries `tracks` role tags (`fullstack` | `ai`), which decide what goes into each resume variant. Proof stats were verified against the source repos (`f:\saasbusiness\flowpulse`, `f:\saasbusiness\Autocreate AD Account`); re-verify before changing a number.
- `src/components/sections.tsx` holds the home page's server-rendered sections in scroll-story order. Only small interactive pieces are client components (`CopyEmail`).
- `src/scene/` is the Stage. Empty `[data-stage-slot="<id>"]` divs in the DOM reserve space, and `Stage.tsx` mounts one Device per slot, locked to that slot's on-screen box every frame (layout owns placement). The pose (tilt, turn, lid) interpolates enter, rest, exit across the slot's scroll progress, from `keyframes.ts`. Rendering is `frameloop="demand"`: scroll and resize invalidate, and Devices keep invalidating only while settling. Materials are unlit (a canvas-painted matcap in `matcap.ts`, screens in `screens.ts`). Do not add an Environment, lights or PBR without re-measuring blocking time on software GL: the environment bake alone cost about 2.9s.
- Stage gating: an inline head script sets `html[data-stage="on"]` when the WebGL2 API exists. CSS shows slots only in that state, so no-JS and no-GPU visitors get a closed-up text layout. `StageLoader` mounts the Stage at idle time and turns it off again if context creation throws. Reduced motion snaps poses and skips Lenis and the lid intro.
- Dev-server caveat: Turbopack's dev server once served a stale `globals.css` chunk (missing the slot rules). Verify CSS-dependent behavior on `next build` + `next start`, or restart dev.
- `/work/[slug]` renders case studies. Header, stats, stack and the walkthrough CTA come from `projects.ts`; the body is `src/content/case-studies/<slug>.mdx`, registered in the page's `studies` map. MDX elements are styled in `src/mdx-components.tsx`, which also provides `<Architecture>` (an HTML diagram, kept in the DOM per ADR 0001). Cache Components forbids `dynamicParams`, so unknown slugs call `notFound()`.
- `StageLoader` mounts from the home page, not the layout: other routes have no slots.
- `/resume` (full-stack) and `/resume/ai` render `components/ResumeScreen.tsx` around `components/Resume.tsx`. Content comes from `content/resume.ts` (per-track title, summary, project order, tagged bullets and skills) plus `profile` and `experience`, where `Job.tracks` can limit a job to one variant. Each is a white Letter sheet, and print CSS in `globals.css` hides the toolbar. Both sheets are nearly full (full-stack 1039 and AI 1051 of 1056px): new wording must replace something. AI wording claims no RAG, evals or LLM APIs until the Assistant ships.
- Planned (see tickets): the Assistant API route (ticket 13).

## Constraints

- Design: impeccable's craft floor applies. No eyebrow/kicker labels above headings, no gradient text, display type ≤ 6rem, monospace only for data and numbers. The `impeccable` design hook scans UI files on write.
- The AD Account Manager may only appear with sanitized sample data. Never run its PowerShell scripts.
- The FlowPulse repo is private, so link the live site, never the code.
