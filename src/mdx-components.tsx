import type { MDXComponents } from "mdx/types";
import { Architecture } from "@/components/Architecture";

// Read-mode typography for case studies. Headings and measure follow the craft floor:
// body at 65-75ch, more space above a heading than below it.
const components: MDXComponents = {
  h2: (p) => (
    <h2
      className="mt-24 mb-6 text-[clamp(1.75rem,3.4vw,2.5rem)] leading-[1.08] font-semibold tracking-[-0.03em] text-balance"
      {...p}
    />
  ),
  h3: (p) => (
    <h3 className="mt-14 mb-3 text-[21px] leading-tight font-semibold tracking-[-0.015em] text-balance" {...p} />
  ),
  p: (p) => <p className="mt-5 max-w-[68ch] text-[17px] leading-[1.7] text-ink-muted text-pretty" {...p} />,
  ul: (p) => <ul className="mt-5 max-w-[68ch] list-disc space-y-2.5 pl-5 text-[17px] leading-[1.65] text-ink-muted marker:text-hairline" {...p} />,
  ol: (p) => <ol className="mt-5 max-w-[68ch] list-decimal space-y-2.5 pl-5 text-[17px] leading-[1.65] text-ink-muted marker:text-ink-muted" {...p} />,
  strong: (p) => <strong className="font-semibold text-ink" {...p} />,
  a: (p) => <a className="text-accent-ink underline hover:text-ink" {...p} />,
  code: (p) => <code className="rounded-md bg-graphite px-1.5 py-0.5 font-mono text-[0.88em] text-ink" {...p} />,
  // Wide code scrolls inside its box on phones; tabIndex lets keyboard users scroll it.
  pre: (p) => (
    <pre
      tabIndex={0}
      className="mt-7 max-w-[76ch] overflow-x-auto rounded-2xl bg-stage-raised p-6 font-mono text-[13.5px] leading-[1.7] text-ink [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-[1em]"
      {...p}
    />
  ),
  Architecture,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
