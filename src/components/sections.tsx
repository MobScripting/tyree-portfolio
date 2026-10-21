import { profile } from "@/content/profile";
import { featured, lab, type FeaturedProject } from "@/content/projects";
import { experience } from "@/content/experience";
import { CopyEmail } from "./CopyEmail";

const shell = "mx-auto w-full max-w-[1200px] px-5 sm:px-8";

function Pill({
  href,
  children,
  primary = false,
}: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <a
      href={href}
      className={
        "inline-flex items-center rounded-full px-6 py-3 text-[17px] font-medium no-underline transition-[background-color,transform] duration-200 ease-out-expo active:scale-[0.97] " +
        (primary
          ? "bg-accent text-white hover:bg-accent-bright"
          : "bg-graphite text-ink hover:bg-hairline")
      }
    >
      {children}
    </a>
  );
}

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-stage/80 backdrop-blur-xl backdrop-saturate-150">
      <nav
        aria-label="Primary"
        className={`${shell} flex h-14 items-center justify-between text-[14px]`}
      >
        <a href="#top" className="font-semibold tracking-tight text-ink no-underline">
          {profile.name}
        </a>
        <ul className="flex items-center gap-5 text-ink-muted sm:gap-7">
          {[
            ["#work", "Work"],
            ["#ai", "AI"],
            ["#experience", "Experience"],
            ["#contact", "Contact"],
          ].map(([href, label]) => (
            <li key={href}>
              <a href={href} className="no-underline transition-colors hover:text-ink">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className={`${shell} flex min-h-svh flex-col items-center justify-center pt-24 pb-20 text-center`}
    >
      <p className="text-[19px] font-medium text-ink-muted">{profile.name}</p>
      <h1
        id="hero-title"
        className="mt-3 text-[clamp(2.5rem,6.4vw,5.5rem)] leading-[1.02] font-semibold tracking-[-0.035em] text-balance"
      >
        {profile.headline.split(/(?<=\.) /).map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h1>
      <div
        data-stage-slot="hero"
        aria-hidden
        className="mt-10 h-[clamp(220px,40svh,480px)] w-full max-w-[820px]"
      />
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Pill href="#flowpulse" primary>
          See FlowPulse
        </Pill>
        <Pill href="#contact">Get in touch</Pill>
      </div>
      <p className="mt-12 max-w-[56ch] text-[clamp(1.0625rem,1.6vw,1.3125rem)] leading-relaxed text-ink-muted text-pretty">
        {profile.summary}
      </p>
      <p className="mt-6 text-[14px] text-ink-muted">
        {profile.location} · {profile.relocation}
      </p>
    </section>
  );
}

export function Proof() {
  const fp = featured[0];
  return (
    <section aria-label="FlowPulse at a glance" className="border-y border-hairline bg-stage-raised">
      <p
        className={`${shell} py-14 text-[clamp(1.375rem,2.6vw,2.125rem)] leading-snug font-medium tracking-[-0.02em] text-ink-muted text-balance`}
      >
        <span className="text-ink">FlowPulse</span> runs in production with{" "}
        {fp.stats.slice(0, 3).map((s, i) => (
          <span key={s.label}>
            <span className="tabular font-mono text-ink">{s.value}</span> {s.label}
            {i < 2 ? ", " : " "}
          </span>
        ))}
        and one engineer who also runs the servers it lives on.
      </p>
    </section>
  );
}

function Project({ project }: { project: FeaturedProject }) {
  return (
    <section
      id={project.slug}
      aria-labelledby={`${project.slug}-title`}
      className={`${shell} py-28 lg:py-40`}
    >
      <div
        data-stage-slot={project.slug}
        aria-hidden
        className="mx-auto mb-20 h-[clamp(260px,62svh,640px)] w-full max-w-[1000px] lg:mb-28"
      />
      <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <h2
          id={`${project.slug}-title`}
          className="text-[clamp(2.5rem,5vw,4rem)] leading-[1.02] font-semibold tracking-[-0.035em]"
        >
          {project.name}
        </h2>
        <p className="mt-4 text-[clamp(1.25rem,2vw,1.625rem)] leading-snug text-ink text-balance">
          {project.tagline}
        </p>
        <p className="mt-5 max-w-[52ch] text-[17px] leading-relaxed text-ink-muted text-pretty">
          {project.summary}
        </p>
        <p className="mt-6 inline-flex items-center gap-2 text-[14px] text-accent-ink">
          <span aria-hidden className="size-1.5 rounded-full bg-accent-bright" />
          {project.status}
        </p>
        <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-hairline pt-6">
          {project.stats.map((s) => (
            <div key={s.label}>
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="tabular block font-mono text-[22px] text-ink">{s.value}</span>
                <span className="text-[13px] text-ink-muted">{s.label}</span>
              </dd>
            </div>
          ))}
        </dl>
        {project.link && (
          <a
            href={project.link.href}
            className="mt-8 inline-block text-[15px] font-medium text-accent-ink hover:underline"
          >
            {project.link.label}
          </a>
        )}
      </div>

      <div>
        <ol className="space-y-14 lg:space-y-20">
          {project.beats.map((b) => (
            <li key={b.title}>
              <h3 className="text-[clamp(1.375rem,2.4vw,1.875rem)] leading-tight font-semibold tracking-[-0.02em] text-balance">
                {b.title}
              </h3>
              <p className="mt-4 max-w-[60ch] text-[17px] leading-relaxed text-ink-muted text-pretty">
                {b.body}
              </p>
            </li>
          ))}
        </ol>
        <ul aria-label={`${project.name} stack`} className="mt-16 flex flex-wrap gap-2">
          {project.stack.map((t) => (
            <li
              key={t}
              className="rounded-full bg-stage-raised px-3.5 py-1.5 text-[13px] text-ink-muted"
            >
              {t}
            </li>
          ))}
        </ul>
      </div>
      </div>
    </section>
  );
}

export function Work() {
  return (
    <div id="work">
      {featured.map((p) => (
        <Project key={p.slug} project={p} />
      ))}
    </div>
  );
}

const practices = [
  {
    title: "Requirements, interrogated",
    body: "Before code, an agent interviews me one round at a time until every decision is made. Then the answers are written down as decision records and a glossary that later sessions must follow.",
  },
  {
    title: "Tickets with blocking edges",
    body: "Work is cut into vertical slices that each name what blocks them, so independent tickets run in parallel agent sessions and hand off through written notes rather than memory.",
  },
  {
    title: "Agents with real tools",
    body: "On Tended Earth, Claude Code drives the Godot editor over MCP: it builds scenes, runs the game and reads its errors, while more than forty numbered decisions keep it on course.",
  },
];

export function AiSection() {
  return (
    <section
      id="ai"
      aria-labelledby="ai-title"
      className="border-t border-hairline bg-stage-raised"
    >
      <div className={`${shell} py-28 lg:py-40`}>
        <h2
          id="ai-title"
          className="max-w-[18ch] text-[clamp(2.5rem,5vw,4rem)] leading-[1.02] font-semibold tracking-[-0.035em] text-balance"
        >
          I build with AI agents in the loop.
        </h2>
        <p className="mt-6 max-w-[60ch] text-[clamp(1.0625rem,1.6vw,1.25rem)] leading-relaxed text-ink-muted text-pretty">
          Agents work best with a process, not a prompt. This site was built that way: planned in
          recorded interview rounds, tracked as fifteen tickets, and built by agents following the
          decision records in its repository.
        </p>
        <ul className="mt-16 grid gap-12 md:grid-cols-3 md:gap-10">
          {practices.map((p) => (
            <li key={p.title} className="border-t border-hairline pt-6">
              <h3 className="text-[21px] leading-tight font-semibold tracking-[-0.015em]">
                {p.title}
              </h3>
              <p className="mt-3 text-[16px] leading-relaxed text-ink-muted text-pretty">
                {p.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Experience() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className={`${shell} py-28 lg:py-40`}
    >
      <h2
        id="experience-title"
        className="text-[clamp(2.5rem,5vw,4rem)] leading-[1.02] font-semibold tracking-[-0.035em]"
      >
        Six years keeping systems up.
      </h2>
      <ol className="mt-16 space-y-16">
        {experience.map((job) => (
          <li
            key={job.company}
            className="grid gap-6 border-t border-hairline pt-8 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] md:gap-12"
          >
            <div>
              <h3 className="text-[21px] font-semibold tracking-[-0.015em]">{job.role}</h3>
              <p className="mt-1 text-[16px] text-ink">{job.company}</p>
              <p className="tabular mt-1 text-[14px] text-ink-muted">
                {job.start} to {job.end} · {job.place}
              </p>
            </div>
            <ul className="space-y-3 text-[16px] leading-relaxed text-ink-muted">
              {job.bullets.map((b) => (
                <li key={b.text} className="max-w-[64ch] text-pretty">
                  {b.text}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Lab() {
  return (
    <section
      id="lab"
      aria-labelledby="lab-title"
      className="border-t border-hairline"
    >
      <div className={`${shell} py-28 lg:py-36`}>
        <h2
          id="lab-title"
          className="text-[clamp(2rem,4vw,3rem)] leading-[1.05] font-semibold tracking-[-0.03em]"
        >
          Also built
        </h2>
        <ul className="mt-12 grid gap-12 md:grid-cols-2 md:gap-16">
          {lab.map((item) => (
            <li key={item.name}>
              <h3 className="text-[24px] font-semibold tracking-[-0.02em]">{item.name}</h3>
              <p className="mt-1 text-[14px] text-accent-ink">{item.kind}</p>
              <p className="mt-4 max-w-[58ch] text-[16px] leading-relaxed text-ink-muted text-pretty">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="border-t border-hairline bg-stage-raised"
    >
      <div className={`${shell} py-28 text-center lg:py-40`}>
        <h2
          id="contact-title"
          className="text-[clamp(2.75rem,7vw,6rem)] leading-[1.02] font-semibold tracking-[-0.035em]"
        >
          Let&apos;s talk.
        </h2>
        <p className="mx-auto mt-6 max-w-[48ch] text-[clamp(1.0625rem,1.6vw,1.25rem)] leading-relaxed text-ink-muted text-pretty">
          Hiring for full-stack, platform or AI engineering? I&apos;d like to hear about it. A
          code walkthrough of FlowPulse is available on request.
        </p>
        <a
          href={`mailto:${profile.email}`}
          className="mt-10 inline-block text-[clamp(1.25rem,3vw,2rem)] font-medium tracking-[-0.02em] text-ink break-all hover:text-accent-ink"
        >
          {profile.email}
        </a>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <CopyEmail email={profile.email} />
          <Pill href={profile.links.github}>GitHub</Pill>
          {profile.links.linkedin && <Pill href={profile.links.linkedin}>LinkedIn</Pill>}
        </div>
      </div>
      <footer className={`${shell} flex flex-wrap justify-between gap-4 border-t border-hairline py-8 text-[13px] text-ink-muted`}>
        <p>
          {profile.name} · {profile.location} · {profile.relocation}
        </p>
        <p>Built with Next.js and three.js.</p>
      </footer>
    </section>
  );
}
