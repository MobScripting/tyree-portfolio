# Tyree Chappell · Portfolio

**Live:** [tyree-portfolio.vercel.app](https://tyree-portfolio.vercel.app) · **Resumes:** [Full-stack](https://tyree-portfolio.vercel.app/resume) · [AI](https://tyree-portfolio.vercel.app/resume/ai)

I build the software, and I run the servers it lives on. This is the site I use to show that: a keynote-style scroll story with a 3D laptop that presents my production work, plus case studies and two resumes generated from the same content.

## What's here

- **[FlowPulse case study](https://tyree-portfolio.vercel.app/work/flowpulse):** a multi-tenant SaaS I designed, built and self-host (Node.js, PostgreSQL, Stripe, SAML, Docker on Proxmox).
- **[AD Account Manager case study](https://tyree-portfolio.vercel.app/work/ad-manager):** an internal tool that turned my own Active Directory runbook into templates and a typed PowerShell bridge.
- **The 3D stage:** procedural laptops built in react-three-fiber, each locked to a placeholder in the page layout and posed by scroll progress.
- **Resumes as code:** one typed content source tagged by track (`fullstack` / `ai`) renders the site, both resume pages and both one-page PDFs.

## How it was built

This project is also a case study in building with AI agents. I planned it in recorded interview rounds with Claude Code, turned the answers into decision records, and built it ticket by ticket in agent sessions:

- [`PRODUCT.md`](PRODUCT.md): who the site is for, its positioning, and what evidence it may claim.
- [`GLOSSARY.md`](GLOSSARY.md): the project's vocabulary (Track, Case study, Stage, Device, Proof stat…).
- [`docs/adr/`](docs/adr/): the hard-to-reverse decisions. Two examples: HTML owns every fact and the 3D is decoration; only verifiable claims and no phone number go public.
- [`.scratch/portfolio/issues/`](.scratch/portfolio/issues/): the 15 tickets, with their blocking edges, acceptance checklists and notes on what changed.

Every number on the site was checked against the source repositories before publishing, and that checking caught several wrong claims before they could mislead anyone.

## Stack

Next.js 16 (App Router, Cache Components), React 19, TypeScript, Tailwind CSS 4, three.js with react-three-fiber, Lenis, MDX. Hosted on Vercel with Web Analytics. Playwright drives screenshot checks, Lighthouse runs and PDF generation.

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npx next start -p 3100   # production build, used by the scripts below
npm run resume:pdf   # regenerate both resume PDFs (fails past one page)
node scripts/capture.mjs http://localhost:3100     # desktop and mobile screenshots
node scripts/lighthouse.mjs http://localhost:3100  # Lighthouse, mobile preset
```

Lint and type-check with `npm run lint` and `npm run typecheck`. [`CLAUDE.md`](CLAUDE.md) has the architecture notes that agents (and people) working on the code should read first.

## Contact

[t.chappell0222@gmail.com](mailto:t.chappell0222@gmail.com) · [GitHub](https://github.com/MobScripting) · Johnson City, TN, open to relocate
