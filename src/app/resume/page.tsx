import type { Metadata } from "next";
import { ResumeScreen } from "@/components/ResumeScreen";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: "Resume",
  description: `Resume of ${profile.name}, full-stack engineer. ${profile.location}, ${profile.relocation.toLowerCase()}.`,
};

export default function ResumePage() {
  return <ResumeScreen track="fullstack" />;
}
