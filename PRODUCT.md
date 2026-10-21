# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Delegated, then confirmed by the user: Next.js (App Router, TypeScript), react-three-fiber, Lenis, Tailwind, MDX, WebLLM. Deployed on Vercel as a static site; the Assistant runs on the visitor's device (docs/adr/0006).

## Users

Recruiters, hiring managers and interviewers screening Tyree Chappell for two Tracks:
- **Full-stack:** SaaS/product engineering, with DevOps/platform roles kept open.
- **AI:** LLM application engineering, with IT-ops automation as a supporting angle.

Recruiters typically skim for under a minute before deciding whether to read a case study or download a resume.

## Product Purpose

Get Tyree hired by proving he builds and runs real software. Success means a recruiter leaves convinced, opens a case study or the Assistant, and makes contact or downloads a resume variant.

## Positioning

He owns the stack from the database to the server rack. That rests on 4+ years (since Mar 2022) of hands-on IT infrastructure (Field Engineer at Unbound Digital; Help Desk at K-VA-T Food Stores) plus a self-built, self-hosted, multi-tenant SaaS in production (FlowPulse) and an Active Directory automation tool that automates his own day job. Most developer portfolios can't truthfully claim both halves.

## Operating Context

Recruiters visit from a link in an application, a LinkedIn profile or a resume, on desktop or phone, often between other tasks. ATS parsers and search crawlers read the HTML. Some visitors use reduced motion, have no capable GPU, or use a screen reader.

## Capabilities and Constraints

- Every fact lives in HTML; the 3D Stage is decoration (docs/adr/0001).
- The site and both resume variants come from one content source (docs/adr/0002).
- The FlowPulse repo is private: there are no code links, only a "request a walkthrough" contact.
- Personal details shown publicly: name, email (mobhater02@gmail.com, the user's choice), "Johnson City, TN · open to relocate", GitHub (MobScripting). No phone number or street address anywhere public.
- The Assistant runs entirely in the visitor's browser (docs/adr/0006): BM25 retrieval over site content, plus an opt-in on-device Llama 3.2 3B through WebLLM. It has no server cost and no API key, and answers only from the site's content, with citations.
- Open: LinkedIn URL (hidden until provided), custom domain (later).

## Brand Commitments

The user explicitly chose an Apple-design direction: dark, keynote-style product reveal. Name as shown: Tyree Chappell.

## Evidence on Hand

- **FlowPulse:** `f:\saasbusiness\flowpulse` — 128 commits, 33 Prisma models, ~190 route handlers, Stripe billing, SAML SSO, TOTP 2FA, audit log, approvals, Docker Compose prod/staging, nginx, self-hosted on Proxmox. Live at flowpulseapp.org. Marketing site with SEO pages and free tools.
- **AD Account Manager:** `f:\saasbusiness\Autocreate AD Account` — Next.js 14 + TS, NextAuth, Prisma, PowerShell bridge, SSE job progress, webhooks, one-click PowerShell installer (Node, RSAT, build, auto-start scheduled task). Shown only with sanitized data.
- **Lab:** TendedEarth (Godot, `F:\GodotGames\tendedearth`, 70 commits), Lawn Titans client site (`F:\lawntitans`).
- **Resume source:** `C:\Users\mobha\Downloads\Resume-1.pdf`.
- **Absent, never to be fabricated:** user counts, revenue, testimonials, employer endorsements, certifications beyond "IT Fundamentals".

## Product Principles

1. Truth over polish: every claim can be traced to a repo or the resume.
2. Skimmable first: the 30-second read must land even with no 3D.
3. Show running software, not adjectives.
4. One story serves both Tracks; the resume variants carry the emphasis.

## Accessibility & Inclusion

WCAG 2.2 AA. Full reduced-motion alternative. Content complete without WebGL or JS. The Stage is aria-hidden.
