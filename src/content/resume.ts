import type { Track } from "./profile";

// Resume-only content. Profile, experience and project names come from their own modules
// (docs/adr/0002); this file holds what only the printed resume says.
// Full-stack wording approved by the user on 2026-10-21 (ticket 07).

export type ResumeProject = {
  slug: string;
  role: string;
  dates: string;
  meta: string;
  bullets: { text: string; tracks: Track[] }[];
};

const both: Track[] = ["fullstack", "ai"];

export const resumeTitle: Record<Track, string> = {
  fullstack: "Full-stack engineer",
  ai: "AI and full-stack engineer",
};

export const resumeProjects: ResumeProject[] = [
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
        tracks: both,
      },
      {
        text: "Stripe subscriptions with signature-verified webhooks and plan limits enforced in middleware; SAML single sign-on, TOTP two-factor login, and hashed refresh tokens rotated on every use.",
        tracks: both,
      },
      {
        text: "Deployed with Docker Compose (production and staging) behind nginx on a self-hosted Proxmox server; scheduled jobs generate recurring invoices, send reminders and email reports.",
        tracks: both,
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
        text: "Provisions Active Directory accounts from role templates, singly or in bulk from CSV/XLSX, with duplicate checks against the directory.",
        tracks: both,
      },
      {
        text: "Typed bridge to PowerShell (JSON over stdin, one process per batch); live job status over Server-Sent Events, outgoing webhooks and an audit log.",
        tracks: both,
      },
      {
        text: "One-script installer sets up Node.js, the RSAT tools, the build, the database and an auto-start scheduled task.",
        tracks: both,
      },
    ],
  },
];

export const skills: { label: string; items: string[] }[] = [
  { label: "Languages", items: ["TypeScript", "JavaScript", "SQL", "PowerShell", "C#", "Lua"] },
  { label: "Front end", items: ["React", "Next.js", "Tailwind CSS", "three.js"] },
  {
    label: "Back end",
    items: ["Node.js", "Express", "Prisma", "PostgreSQL", "SQLite", "REST", "Server-Sent Events", "Stripe", "SAML"],
  },
  {
    label: "Infrastructure",
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
  { label: "Tools", items: ["Git and GitHub", "Claude Code"] },
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
