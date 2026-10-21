import type { Metadata } from "next";
import Link from "next/link";
import { Resume } from "@/components/Resume";
import { Pill } from "@/components/sections";
import { resumePdf } from "@/content/resume";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: "Resume",
  description: `Resume of ${profile.name}, full-stack engineer. ${profile.location}, ${profile.relocation.toLowerCase()}.`,
};

export default function ResumePage() {
  return (
    <main className="resume-page px-4 py-10 sm:py-16">
      <div className="resume-toolbar mx-auto mb-8 flex max-w-[8.5in] flex-wrap items-center justify-between gap-4">
        <Link href="/" className="text-[14px] text-ink-muted no-underline hover:text-ink">
          {profile.name}
        </Link>
        <Pill href={resumePdf.fullstack} primary>
          Download PDF
        </Pill>
      </div>
      <Resume track="fullstack" />
    </main>
  );
}
