# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

Personal portfolio for Tyree Chappell, aimed at full-stack/SaaS and AI/LLM engineering roles. It uses Next.js 16 (App Router, Turbopack, Cache Components), React 19, Tailwind 4, react-three-fiber (no drei), Lenis and MDX, and deploys to Vercel. Next 16 breaks older conventions: read `node_modules/next/dist/docs/` before using a Next API you haven't checked.

## Commands

- `npm run dev`: dev server on :3000. In the desktop app, start it with the `portfolio` preview config in `.claude/launch.json`.
- `npm run build`: production build.
- `npm run lint`: ESLint.
- `npm run eval:answers [url]`: answer eval through the real panel in Edge with WebGPU. It downloads the model into a reusable temp profile (`--clean` removes it); `EVAL_MODEL=<WebLLM id>` tries another model. Read the answers in `.impeccable/review/eval-answers*.json`, not just the score: a keyword pass doesn't prove an answer is true.
- `npm run eval:retrieval`: retrieval eval for the Assistant. After content changes, rebuild the corpus with `npm run corpus`.
- `npm run typecheck`: runs `next typegen` then `tsc`. `LayoutProps`/`PageProps` are generated types, so plain `tsc` fails without typegen.
- `node scripts/capture.mjs [baseUrl]`: headless Playwright captures with SwiftShader WebGL into `.impeccable/review/`: desktop 1440 and mobile 390, full page, first viewport, each stage slot, and the hero intro. It also prints stage state, horizontal overflow and console errors. Use it when the browser pane can't screenshot.
- `npm run resume:pdf`: prints `/resume` and `/resume/ai` to `public/Tyree-Chappell-Resume-{FullStack,AI}.pdf` via Playwright. Run it against `npx next start -p 3100` after `npm run build`, and rerun it whenever `src/content/` changes. It fails if a sheet passes one Letter page or the text contains a phone-like number. Commit the regenerated PDFs. `next start` serves only `public/` files that existed at build time, so rebuild before testing downloads locally.
- `scripts/capture/{flowpulse,ad-manager}.mjs`: re-capture the Device footage in `public/footage/` from scratch copies of those apps with sample data. Never point them at production or at the real repos. See tickets 08 and 09 for setup (embedded Postgres, PowerShell disabled).
- `node scripts/lighthouse.mjs [url]`: Lighthouse mobile run through Playwright's Chromium (the Lighthouse CLI's own launcher fails here). Run it against `npx next start -p 3100` after `npm run build`. It uses SwiftShader, the software-GL worst case; for the real-GPU number, swap the flags for `--use-angle=d3d11 --ignore-gpu-blocklist --enable-gpu`.

## Where decisions live (read before changing direction)

- `PRODUCT.md`: product truth, positioning, and the evidence that may be claimed.
- `GLOSSARY.md`: canonical terms (Track, Case study, Lab item, Proof stat, Stage, Device, Scene keyframe, Footage loop, Assistant). Use them in code and copy.
- `docs/adr/`: hard-to-reverse decisions. The most important ones:
  - 0001: HTML owns every fact; the 3D Stage is aria-hidden decoration.
  - 0002: one content source drives the site and both resume variants.
  - 0004: verifiable claims only, and no phone number or street address in anything public.
  - 0006 (supersedes 0005): the Assistant runs on the visitor's device. There's no API and no server route.
- `.impeccable/surfaces/src-app-page-tsx.md`: the home page's direction contract (Apple keynote, dark stage, one indigo accent). DESIGN.md gets written at the end of the build by impeccable's documenter.
- `.scratch/portfolio/issues/NN-*.md`: tickets with blocking edges and acceptance checklists. Mark checkboxes and Status as work lands.

## Architecture

- `src/content/*.ts` is the single source of truth: `profile`, `projects` (featured projects with proof stats and beats, plus lab items), and `experience`. Every bullet and project carries `tracks` role tags (`fullstack` | `ai`), which decide what goes into each resume variant. Proof stats were verified against the source repos (`f:\saasbusiness\flowpulse`, `f:\saasbusiness\Autocreate AD Account`); re-verify before changing a number.
- `src/components/sections.tsx` holds the home page's server-rendered sections in scroll-story order. Only small interactive pieces are client components (`CopyEmail`).
- `src/scene/` is the Stage. Empty `[data-stage-slot="<id>"]` divs in the DOM reserve space, and `Stage.tsx` mounts one Device per slot, locked to that slot's on-screen box every frame (layout owns placement). The pose (tilt, turn, lid) interpolates enter, rest, exit across the slot's scroll progress, from `keyframes.ts`. Rendering is `frameloop="demand"`: scroll and resize invalidate, and Devices keep invalidating only while settling. Materials are unlit (a canvas-painted matcap in `matcap.ts`). Screens show real stills from `public/footage/` (`footage.ts` caches them; `screens.ts` holds the canvas placeholders shown until they load). They're listed per slot in `keyframes.ts`, cross-faded by scroll progress, and requested only when a Device first comes into view. The Laptop takes its display as children. Every Device has a sample-data caption (`data-stage-caption`), gated like the slots. Don't show footage without one: the screens contain dollar figures. Do not add an Environment, lights or PBR without re-measuring blocking time on software GL: the environment bake alone cost about 2.9s.
- Stage gating: an inline head script sets `html[data-stage="on"]` when the WebGL2 API exists. CSS shows slots only in that state, so no-JS and no-GPU visitors get a closed-up text layout. `StageLoader` mounts the Stage at idle time and turns it off again if context creation throws. Reduced motion snaps poses and skips Lenis and the lid intro.
- Dev-server caveat: Turbopack's dev server once served a stale `globals.css` chunk (missing the slot rules). Verify CSS-dependent behavior on `next build` + `next start`, or restart dev.
- `/work/[slug]` renders case studies. Header, stats, stack and the walkthrough CTA come from `projects.ts`; the body is `src/content/case-studies/<slug>.mdx`, registered in the page's `studies` map. MDX elements are styled in `src/mdx-components.tsx`, which also provides `<Architecture>` (an HTML diagram, kept in the DOM per ADR 0001). Cache Components forbids `dynamicParams`, so unknown slugs call `notFound()`.
- `StageLoader` mounts from the home page, not the layout: other routes have no slots.
- `FeaturedProject.section` puts a case study in the Work list (default) or the AI section (the agentic-workflow study). `publicRepo` switches the case page's "see the code" wording. Any button can open Ask Tyree by dispatching `ask-tyree:open` (`AskTyreeButton`). There are two "Ask Tyree" buttons on the home page, so scripts target the floating trigger with `button[aria-controls]`.
- Ask Tyree treats any generation error as a lost engine (usually the GPU running out of VRAM). It drops the engine and answers with passages for the rest of the visit.
- `/resume` (full-stack) and `/resume/ai` render `components/ResumeScreen.tsx` around `components/Resume.tsx`. Content comes from `content/resume.ts` (per-track title, summary, project order, tagged bullets and skills) plus `profile` and `experience`, where `Job.tracks` can limit a job to one variant. Each is a white Letter sheet, and print CSS in `globals.css` hides the toolbar. Both sheets are nearly full (full-stack 1039 and AI 1051 of 1056px): new wording must replace something. AI wording claims no RAG, evals or LLM APIs until the Assistant ships.
- Metadata: `app/opengraph-image.tsx` and `app/work/[slug]/opengraph-image.tsx` render through `lib/og.tsx`, which reads Geist TTFs from the `geist` package; `next.config.ts` traces them into the functions, so keep the two in sync if you move fonts. Satori draws some word gaps slightly wide; that's known and accepted. `app/icon.tsx`, `sitemap.ts` and `robots.ts` derive URLs from `profile.links.site`, and JSON-LD Person is on the home page.
- The Assistant (`components/Assistant.tsx`, mounted in the layout) works like this: `scripts/build-corpus.ts` (run by predev/prebuild) turns `src/content/` and the case-study MDX into `src/assistant/corpus.json` (gitignored). Each chunk has a deep link, and case-study headings get matching ids via `lib/slug.ts`. `assistant/retrieve.ts` does BM25 with stemming and a title-coverage bonus. `assistant/engine.ts` loads WebLLM (Llama 3.2 3B, f16 or f32 by GPU; picked with `npm run eval:answers`, which needs a WebGPU GPU and runs in Edge) in `assistant/worker.ts`, and only after the visitor opts in. Without WebGPU it answers with passages. Add new site content to `src/content/` so it's retrievable, and keep `src/assistant/eval-set.json` passing with `npm run eval:retrieval` (fails under 90% recall@4).

## Constraints

- Design: impeccable's craft floor applies. No eyebrow/kicker labels above headings, no gradient text, display type ≤ 6rem, monospace only for data and numbers. The `impeccable` design hook scans UI files on write.
- The AD Account Manager may only appear with sanitized sample data. Never run its PowerShell scripts.
- The FlowPulse repo is private, so link the live site, never the code.
