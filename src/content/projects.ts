import type { Track } from "./profile";

// Proof stats must be checkable against the source repo (PRODUCT.md "Evidence on Hand").
// Re-verify before changing a number; never add usage or revenue figures.

export type ProofStat = { value: string; label: string };

export type Beat = { title: string; body: string };

export type FeaturedProject = {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  tracks: Track[];
  status: string;
  stats: ProofStat[];
  beats: Beat[];
  stack: string[];
  link?: { href: string; label: string };
};

export type LabItem = {
  name: string;
  kind: string;
  body: string;
  tracks: Track[];
  link?: { href: string; label: string };
};

export const featured: FeaturedProject[] = [
  {
    slug: "flowpulse",
    name: "FlowPulse",
    tagline: "Cash flow, invoicing and approvals for small businesses.",
    summary:
      "A multi-tenant SaaS I designed, built and operate alone: invoices, expenses, time tracking, budgets, bank reconciliation, a client portal and approval workflows, all on infrastructure I run myself.",
    tracks: ["fullstack"],
    status: "Live at flowpulseapp.org",
    stats: [
      { value: "33", label: "data models" },
      { value: "190", label: "API route handlers" },
      { value: "32", label: "schema migrations" },
      { value: "128", label: "commits, Feb to Sep 2026" },
    ],
    beats: [
      {
        title: "Multi-tenant from the schema up",
        body: "Organizations, memberships and custom roles are modeled in Postgres, and the API scopes its data access to the active organization. An audit log records who changed what.",
      },
      {
        title: "Billing that enforces itself",
        body: "Stripe subscriptions and webhooks drive Free, Starter and Professional plans. Plan limits live in one table, and an expired trial blocks new records until the workspace subscribes. Paying workspaces are never blocked.",
      },
      {
        title: "Security a finance team would ask for",
        body: "SAML single sign-on, TOTP two-factor login with QR enrollment, refresh-token rotation, rate limiting, hardened HTTP headers and Zod input validation.",
      },
      {
        title: "Shipped and operated by me",
        body: "Docker Compose for production and staging behind nginx, self-hosted on Proxmox. Scheduled jobs send reports and reminders, and invoice PDFs are rendered server-side.",
      },
    ],
    stack: [
      "Node.js",
      "Express",
      "PostgreSQL",
      "Prisma",
      "React",
      "Vite",
      "Tailwind",
      "Stripe",
      "SAML",
      "Docker",
      "nginx",
      "Proxmox",
    ],
    link: { href: "https://flowpulseapp.org", label: "Visit flowpulseapp.org" },
  },
  {
    slug: "ad-manager",
    name: "AD Account Manager",
    tagline: "Active Directory provisioning without the PowerShell console.",
    summary:
      "An internal web app that turns the account work I used to do by hand into templates. A technician picks a role, or drops in a spreadsheet, and the app provisions the Active Directory accounts while streaming progress live.",
    tracks: ["fullstack", "ai"],
    status: "Internal tool, shown with sample data",
    stats: [
      { value: "5", label: "PowerShell automations" },
      { value: "7", label: "data models" },
      { value: "1", label: "installer from bare server to running app" },
    ],
    beats: [
      {
        title: "Templates instead of checklists",
        body: "Role templates carry groups, OUs and attributes. Single or bulk creation from CSV or XLSX, with duplicate checks before anything touches the directory.",
      },
      {
        title: "A typed bridge to PowerShell",
        body: "The Next.js server spawns PowerShell scripts for create, search, reset and duplicate detection, and parses their JSON output back into typed results.",
      },
      {
        title: "Live progress, full trail",
        body: "Bulk jobs run in one PowerShell process per batch and stream progress to the browser over Server-Sent Events. Outgoing webhooks notify other systems, and every action lands in an audit log.",
      },
    ],
    stack: [
      "Next.js",
      "TypeScript",
      "NextAuth",
      "Prisma",
      "SQLite",
      "PowerShell",
      "Server-Sent Events",
      "Tailwind",
    ],
  },
];

export const lab: LabItem[] = [
  {
    name: "Tended Earth",
    kind: "3D survival game · Godot 4",
    body: "A painterly survival game set in the world of the novel Ash and Bloom. I direct and program it with Claude Code driving the Godot editor over MCP: scenes, scripts, test runs and error reading, with every design call recorded as a numbered decision.",
    tracks: ["ai"],
  },
  {
    name: "Lawn Titans Services",
    kind: "Client website",
    body: "A marketing site for a licensed lawn care company in Augusta, GA. Search-optimized pages, sitemap and structured metadata, shipped as a Docker container behind nginx.",
    tracks: ["fullstack"],
  },
];
