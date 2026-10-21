import type { Metadata } from "next";
import { ResumeScreen } from "@/components/ResumeScreen";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: "AI resume",
  description: `Resume of ${profile.name}, AI and full-stack engineer. ${profile.location}, ${profile.relocation.toLowerCase()}.`,
};

export default function AiResumePage() {
  return <ResumeScreen track="ai" />;
}
