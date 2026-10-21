// Architecture diagram as HTML (docs/adr/0001: facts live in the DOM). The request path
// reads left to right on wide screens and top to bottom on narrow ones; side services
// hang off the node that calls them.

export type ArchNode = { name: string; detail: string; services?: string[] };

export function Architecture({ title, path }: { title: string; path: ArchNode[] }) {
  return (
    <figure className="mt-10">
      <figcaption className="text-[14px] font-medium text-ink-muted">{title}</figcaption>
      <ol className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-stretch lg:gap-0">
        {path.map((n, i) => (
          <li key={n.name} className="flex flex-col lg:flex-1 lg:flex-row lg:items-stretch">
            {i > 0 && (
              <span
                aria-hidden
                className="mx-auto h-5 w-px bg-hairline lg:mx-0 lg:my-auto lg:h-px lg:w-5 lg:shrink-0"
              />
            )}
            <div className="flex flex-1 flex-col rounded-2xl bg-graphite p-4">
              <p className="text-[15px] font-semibold tracking-[-0.01em] text-ink">{n.name}</p>
              <p className="mt-1 text-[13px] leading-snug text-ink-muted">{n.detail}</p>
              {n.services && (
                <ul aria-label={`${n.name} talks to`} className="mt-4 space-y-1 border-t border-hairline pt-3 text-[12px] text-ink-muted">
                  {n.services.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ol>
    </figure>
  );
}
