import type { Track } from "./profile";

// Reframed from the source resume (Downloads/Resume-1.pdf). Wording awaits the user's approval (ticket 07).

export type Bullet = { text: string; tracks: Track[] };

export type Job = {
  role: string;
  company: string;
  place: string;
  start: string;
  end: string;
  bullets: Bullet[];
};

const both: Track[] = ["fullstack", "ai"];

export const experience: Job[] = [
  {
    role: "Field Engineer",
    company: "Unbound Digital",
    place: "Johnson City, TN",
    start: "Mar 2025",
    end: "Present",
    bullets: [
      {
        text: "Deploy and maintain infrastructure for business clients across industries: servers, virtualization, routers, switches, firewalls, wireless, VoIP and cloud services.",
        tracks: both,
      },
      {
        text: "Administer Microsoft 365 tenants, including Exchange Online, Azure Active Directory and endpoint management.",
        tracks: both,
      },
      {
        text: "Run backup monitoring, disaster recovery, RMM and security tooling across many client environments at once, prioritizing critical incidents.",
        tracks: ["fullstack"],
      },
      {
        text: "Document procedures and network configurations so other technicians can repeat the work, the habit that led to automating it.",
        tracks: ["ai"],
      },
    ],
  },
  {
    role: "Help Desk Technician",
    company: "K-VA-T Food Stores",
    place: "Abingdon, VA",
    start: "Mar 2022",
    end: "Mar 2025",
    bullets: [
      {
        text: "First-line support for a regional grocery chain's store systems: registers and self-checkout, EFT and pin pads, pharmacy, fuel, scales and back-office software.",
        tracks: both,
      },
      {
        text: "Monitored store communications and security and refrigeration alarms, then dispatched technicians and vendors and followed each call to resolution.",
        tracks: both,
      },
      {
        text: "Pushed price changes to stores and scales, and managed associate email and network account unlocks.",
        tracks: ["fullstack"],
      },
    ],
  },
];
