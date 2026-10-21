import { ogCard, ogSize } from "@/lib/og";
import { profile } from "@/content/profile";

export const alt = `${profile.name}: ${profile.headline}`;
export const size = ogSize;
export const contentType = "image/png";

export default async function Image() {
  return ogCard({
    title: profile.headline,
    line: "Full-stack and AI engineer. FlowPulse, a multi-tenant SaaS I build and self-host, plus IT automation and agent-driven development.",
    footer: profile.name,
  });
}
