import Link from "next/link";
import { Resume } from "@/components/Resume";
import { Pill } from "@/components/sections";
import { resumePdf, resumeRoute, resumeTitle } from "@/content/resume";
import { profile, type Track } from "@/content/profile";

// On-screen frame around the printed sheet: switch variant, download the PDF.
// The toolbar is hidden in print (globals.css), so the PDF is the sheet alone.
export function ResumeScreen({ track }: { track: Track }) {
  const tracks = Object.keys(resumeRoute) as Track[];
  return (
    <main className="resume-page px-4 py-10 sm:py-16">
      <div className="resume-toolbar mx-auto mb-8 flex max-w-[8.5in] flex-wrap items-center justify-between gap-4">
        <Link href="/" className="text-[14px] text-ink-muted no-underline hover:text-ink">
          {profile.name}
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <nav aria-label="Resume variant" className="flex rounded-full bg-graphite p-1 text-[14px]">
            {tracks.map((t) => (
              <Link
                key={t}
                href={resumeRoute[t]}
                aria-current={t === track ? "page" : undefined}
                className={
                  "rounded-full px-4 py-2 no-underline transition-colors " +
                  (t === track ? "bg-stage text-ink" : "text-ink-muted hover:text-ink")
                }
              >
                {resumeTitle[t]}
              </Link>
            ))}
          </nav>
          <Pill href={resumePdf[track]} primary>
            Download PDF
          </Pill>
        </div>
      </div>
      <Resume track={track} />
    </main>
  );
}
