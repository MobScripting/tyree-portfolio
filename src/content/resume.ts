import { profile, type Track } from "./profile";

// Resume-only content. Profile, experience and project names come from their own modules
// (docs/adr/0002); this file holds what only the printed resume says.
// Wording approved by the user on 2026-10-21: full-stack (ticket 07), AI (ticket 15).
// AI claims stop at what has shipped: no RAG, evals or LLM APIs until the Assistant exists.

export type ResumeProject = {
  slug: string;
  // Defaults to the featured project's name for slugs in projects.ts.
  name?: string;
  role: string;
  dates: string;
  meta: string;
  bullets: { text: string; tracks: Track[] }[];
};

const both: Track[] = ["fullstack", "ai"];
const fullstack: Track[] = ["fullstack"];
const ai: Track[] = ["ai"];

export const resumeTitle: Record<Track, string> = {
  fullstack: "Full-stack engineer",
  ai: "AI and full-stack engineer",
};

export const resumeSummary: Record<Track, string> = {
  fullstack: profile.summary,
  ai: "Full-stack engineer who builds with AI agents daily. I run Claude Code with real tools, decision records and ticketed plans to ship production software and games, backed by over four years of IT infrastructure and a self-hosted SaaS in production.",
};

// Each track lists its projects in the order its resume shows them.
export const projectOrder: Record<Track, string[]> = {
  fullstack: ["flowpulse", "ad-manager"],
  ai: ["tended-earth", "portfolio", "flowpulse", "ad-manager"],
};

export const resumeProjects: ResumeProject[] = [
  {
    slug: "tended-earth",
    name: "Tended Earth",
    role: "Creative director and programmer",
    dates: "Oct 2026 to present",
    meta: "Godot 4, Claude Code, MCP",
    bullets: [
      {
        text: "Build a 3D survival game with Claude Code operating the Godot editor through an MCP server: it creates scenes, writes GDScript, runs the game and reads runtime errors.",
        tracks: ai,
      },
      {
        text: "Keep the agent consistent with a written process: 45 numbered design decisions and question rounds I answer before each milestone.",
        tracks: ai,
      },
      {
        text: "70 commits in five days: enemy AI driven by noise events, procedural audio, fire spread on a 2 m grid with wind, fuel and moisture, save and load, and a homestead build mode.",
        tracks: ai,
      },
    ],
  },
  {
    slug: "portfolio",
    name: "This portfolio",
    role: "Director",
    dates: "Oct 2026",
    meta: "Next.js 16, react-three-fiber",
    bullets: [
      {
        text: "Planned in recorded interview rounds that became architecture decision records, a domain glossary and 15 tickets with blocking edges, then built ticket by ticket in Claude Code agent sessions.",
        tracks: ai,
      },
      {
        text: "Verification is part of the loop: Playwright captures, Lighthouse runs, a PDF check that fails on overflow or a phone number, and every claim fact-checked against its source repo before publishing.",
        tracks: ai,
      },
    ],
  },
  {
    slug: "flowpulse",
    role: "Creator and operator",
    dates: "Feb 2026 to present",
    meta: "flowpulseapp.org",
    bullets: [
      {
        text: "Designed, built and operate a multi-tenant SaaS for small-business cash flow: invoicing, expenses, time tracking, budgets, bank reconciliation, a client portal and approval workflows.",
        tracks: both,
      },
      {
        text: "Node.js and Express API on PostgreSQL with Prisma (33 data models, 190 route handlers, 32 migrations); React and Vite front end.",
        tracks: fullstack,
      },
      {
        text: "Stripe subscriptions with signature-verified webhooks and plan limits enforced in middleware; SAML single sign-on, TOTP two-factor login, and hashed refresh tokens rotated on every use.",
        tracks: fullstack,
      },
      {
        text: "Deployed with Docker Compose (production and staging) behind nginx on a self-hosted Proxmox server; scheduled jobs generate recurring invoices, send reminders and email reports.",
        tracks: fullstack,
      },
      {
        text: "Node.js, Express, PostgreSQL and Prisma (33 data models, 190 route handlers); Stripe billing, SAML single sign-on and TOTP two-factor login; Docker Compose on a self-hosted Proxmox server.",
        tracks: ai,
      },
    ],
  },
  {
    slug: "ad-manager",
    role: "Internal IT tool",
    dates: "",
    meta: "Next.js 14, TypeScript",
    bullets: [
      {
        text: "Automated my own IT runbook: provisions Active Directory accounts from role templates or spreadsheets through a typed PowerShell bridge, with live job status and an audit log.",
        tracks: ai,
      },
      {
        text: "Provisions Active Directory accounts from role templates, singly or in bulk from CSV/XLSX, with duplicate checks against the directory.",
        tracks: fullstack,
      },
      {
        text: "Typed bridge to PowerShell (JSON over stdin, one process per batch); live job status over Server-Sent Events, outgoing webhooks and an audit log.",
        tracks: fullstack,
      },
      {
        text: "One-script installer sets up Node.js, the RSAT tools, the build, the database and an auto-start scheduled task.",
        tracks: fullstack,
      },
    ],
  },
];

export const skills: { label: string; items: string[]; tracks: Track[] }[] = [
  {
    label: "AI tooling",
    tracks: ai,
    items: [
      "Claude Code",
      "Model Context Protocol (MCP)",
      "agent skills and subagents",
      "ticket-driven agent workflows",
    ],
  },
  { label: "Languages", tracks: fullstack, items: ["TypeScript", "JavaScript", "SQL", "PowerShell", "C#", "Lua"] },
  { label: "Languages", tracks: ai, items: ["TypeScript", "JavaScript", "GDScript", "SQL", "PowerShell", "C#"] },
  { label: "Front end", tracks: fullstack, items: ["React", "Next.js", "Tailwind CSS", "three.js"] },
  {
    label: "Back end",
    tracks: fullstack,
    items: ["Node.js", "Express", "Prisma", "PostgreSQL", "SQLite", "REST", "Server-Sent Events", "Stripe", "SAML"],
  },
  {
    label: "Web",
    tracks: ai,
    items: ["React", "Next.js", "three.js", "Node.js", "Express", "PostgreSQL", "Prisma", "Stripe"],
  },
  {
    label: "Infrastructure",
    tracks: fullstack,
    items: [
      "Docker",
      "nginx",
      "Proxmox",
      "Linux containers",
      "Windows Server",
      "Active Directory",
      "Microsoft 365 and Azure AD",
      "networking and firewalls",
      "VoIP",
    ],
  },
  {
    label: "Infrastructure",
    tracks: ai,
    items: ["Docker", "nginx", "Proxmox", "Windows Server", "Active Directory", "Microsoft 365 and Azure AD"],
  },
  { label: "Tools", tracks: fullstack, items: ["Git and GitHub", "Claude Code"] },
];

export const education = {
  school: "John S. Battle High School",
  place: "Bristol, VA",
  year: "2020",
  certifications: ["IT Fundamentals"],
  authorization: "Authorized to work in the US for any employer",
};

export const resumePdf: Record<Track, string> = {
  fullstack: "/Tyree-Chappell-Resume-FullStack.pdf",
  ai: "/Tyree-Chappell-Resume-AI.pdf",
};

export const resumeRoute: Record<Track, string> = {
  fullstack: "/resume",
  ai: "/resume/ai",
};
