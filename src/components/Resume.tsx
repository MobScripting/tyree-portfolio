import { profile, type Track } from "@/content/profile";
import { experience } from "@/content/experience";
import { featured } from "@/content/projects";
import { education, resumeProjects, resumeTitle, skills } from "@/content/resume";

// The printed resume: one US Letter sheet, dark ink on white, real text for ATS parsers.
// Track tags choose which bullets each variant includes (docs/adr/0002).

const strip = (url: string) => url.replace(/^https?:\/\//, "");

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-[14px] border-b border-[#d2d2d7] pb-1 text-[11px] font-semibold tracking-[0.08em] text-[#1d1d1f] uppercase">
      {children}
    </h2>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-1 list-disc space-y-[2px] pl-4 marker:text-[#86868b]">
      {items.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  );
}

export function Resume({ track }: { track: Track }) {
  const pick = <T extends { tracks: Track[] }>(xs: T[]) => xs.filter((x) => x.tracks.includes(track));

  return (
    <article className="resume-sheet mx-auto w-full max-w-[8.5in] bg-white px-6 py-8 text-[12px] sm:px-[0.5in] sm:py-[0.45in] leading-[1.35] text-[#3a3a3c] shadow-[0_24px_60px_rgba(0,0,0,0.5)] [font-feature-settings:'tnum']">
      <header>
        <h1 className="text-[26px] leading-none font-semibold tracking-[-0.02em] text-[#1d1d1f]">{profile.name}</h1>
        <p className="mt-1.5 text-[14px] font-medium text-[#1d1d1f]">{resumeTitle[track]}</p>
        <p className="mt-1.5 text-[12px]">
          {profile.location} · {profile.relocation} ·{" "}
          <a href={`mailto:${profile.email}`} className="text-[#3a3a3c] no-underline">
            {profile.email}
          </a>{" "}
          ·{" "}
          <a href={profile.links.github} className="text-[#3a3a3c] no-underline">
            {strip(profile.links.github)}
          </a>{" "}
          ·{" "}
          <a href={profile.links.site} className="text-[#3a3a3c] no-underline">
            {strip(profile.links.site)}
          </a>
        </p>
      </header>

      <Heading>Summary</Heading>
      <p className="mt-1.5">{profile.summary}</p>

      <Heading>Projects</Heading>
      {resumeProjects.map((p) => {
        const name = featured.find((f) => f.slug === p.slug)?.name ?? p.slug;
        return (
          <section key={p.slug} className="mt-2.5 break-inside-avoid">
            <h3 className="flex flex-wrap items-baseline justify-between gap-x-3">
              <span className="text-[13px] font-semibold text-[#1d1d1f]">
                {name}
                <span className="font-normal text-[#3a3a3c]"> · {p.role}</span>
              </span>
              <span className="text-[11.5px]">{[p.dates, p.meta].filter(Boolean).join(" · ")}</span>
            </h3>
            <Bullets items={pick(p.bullets).map((b) => b.text)} />
          </section>
        );
      })}

      <Heading>Experience</Heading>
      {experience.map((job) => {
        const bullets = pick(job.bullets).map((b) => b.text);
        return (
          <section key={job.company} className="mt-2.5 break-inside-avoid">
            <h3 className="flex flex-wrap items-baseline justify-between gap-x-3">
              <span className="text-[13px] font-semibold text-[#1d1d1f]">
                {job.role}
                <span className="font-normal text-[#3a3a3c]">
                  {" "}
                  · {job.company}, {job.place}
                </span>
              </span>
              <span className="text-[11.5px]">
                {job.start} to {job.end}
              </span>
            </h3>
            {bullets.length > 0 && <Bullets items={bullets} />}
          </section>
        );
      })}

      <Heading>Skills</Heading>
      <dl className="mt-1.5 grid grid-cols-[7.5em_1fr] gap-x-3 gap-y-[3px]">
        {skills.map((s) => (
          <div key={s.label} className="contents">
            <dt className="font-semibold text-[#1d1d1f]">{s.label}</dt>
            <dd>{s.items.join(", ")}</dd>
          </div>
        ))}
      </dl>

      <Heading>Education and certifications</Heading>
      <p className="mt-1.5">
        {education.school}, {education.place} · {education.year} · {education.certifications.join(", ")}{" "}
        certification · {education.authorization}
      </p>
    </article>
  );
}
