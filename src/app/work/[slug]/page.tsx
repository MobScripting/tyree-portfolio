import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { featured } from "@/content/projects";
import { profile } from "@/content/profile";
import { Nav, Pill, ProjectStats, shell } from "@/components/sections";

// Case study bodies are MDX; everything else on the page comes from content/projects.ts.
const studies = {
  flowpulse: () => import("@/content/case-studies/flowpulse.mdx"),
  "ad-manager": () => import("@/content/case-studies/ad-manager.mdx"),
} as const;

const find = (slug: string) => featured.find((p) => p.slug === slug);

export function generateStaticParams() {
  return featured.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const project = find((await params).slug);
  if (!project) return {};
  return {
    title: `${project.name} case study`,
    description: `${project.tagline} ${project.summary}`,
  };
}

export default async function CaseStudy({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = find(slug);
  const load = studies[slug as keyof typeof studies];
  if (!project || !load) notFound();
  const { default: Body } = await load();

  const walkthrough = `mailto:${profile.email}?subject=${encodeURIComponent(`${project.name} walkthrough`)}`;

  return (
    <>
      <Nav />
      <main className={`${shell} pt-32 pb-28`}>
        <article className="mx-auto max-w-[920px]">
          <Link href="/#work" className="text-[14px] text-ink-muted no-underline hover:text-ink">
            All work
          </Link>
          <header className="mt-8">
            <h1 className="text-[clamp(2.75rem,7vw,5.5rem)] leading-[1.02] font-semibold tracking-[-0.035em]">
              {project.name}
            </h1>
            <p className="mt-5 max-w-[30ch] text-[clamp(1.375rem,2.6vw,2rem)] leading-snug tracking-[-0.015em] text-ink text-balance">
              {project.tagline}
            </p>
            <p className="mt-6 inline-flex items-center gap-2 text-[14px] text-accent-ink">
              <span aria-hidden className="size-1.5 rounded-full bg-accent-bright" />
              {project.status}
            </p>
            <div className="max-w-[560px]">
              <ProjectStats project={project} />
            </div>
          </header>

          <Body />

          <section aria-labelledby="stack-title" className="mt-24 border-t border-hairline pt-10">
            <h2 id="stack-title" className="text-[21px] font-semibold tracking-[-0.015em]">
              Stack
            </h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {project.stack.map((t) => (
                <li key={t} className="rounded-full bg-stage-raised px-3.5 py-1.5 text-[13px] text-ink-muted">
                  {t}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="walkthrough-title" className="mt-20 rounded-3xl bg-stage-raised p-8 sm:p-12">
            <h2
              id="walkthrough-title"
              className="text-[clamp(1.75rem,3.4vw,2.5rem)] leading-[1.08] font-semibold tracking-[-0.03em] text-balance"
            >
              Want to see the code?
            </h2>
            <p className="mt-4 max-w-[56ch] text-[17px] leading-relaxed text-ink-muted text-pretty">
              The repository is private. I&apos;m glad to walk you through it on a call: the schema,
              the decisions above, and what I&apos;d change next.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Pill href={walkthrough} primary>
                Request a walkthrough
              </Pill>
              {project.link && <Pill href={project.link.href}>{project.link.label}</Pill>}
            </div>
          </section>
        </article>
      </main>
    </>
  );
}
