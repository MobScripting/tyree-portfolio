"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { usePathname } from "next/navigation";
import type { WebWorkerMLCEngine } from "@mlc-ai/web-llm";
import type { Hit } from "@/assistant/retrieve";
import { DOWNLOAD_LABEL } from "@/assistant/engine";
import { OPEN_ASK_TYREE } from "./AskTyreeButton";
import { flyTo, samePageTarget } from "@/lib/scroll";

// "Ask Tyree" (ticket 13, docs/adr/0006): retrieval over the site's own content, answered by a
// small model that runs on the visitor's GPU. Nothing downloads until the visitor opts in, and
// without WebGPU the same retrieval still answers with the matching passages and links.

type Status = "idle" | "checking" | "unsupported" | "loading" | "ready" | "error" | "lost";
type Turn = { id: number; q: string; hits: Hit[]; text: string; done: boolean };

let retrieverPromise: Promise<(q: string, k?: number) => Hit[]> | null = null;
const getRetriever = () =>
  (retrieverPromise ??= Promise.all([import("@/assistant/corpus.json"), import("@/assistant/retrieve")]).then(
    ([corpus, { createRetriever }]) => createRetriever(corpus.default),
  ));

// Turn "[2]" markers into links to the cited passage; unknown numbers stay as plain text.
function Cited({ text, hits, onFollow }: { text: string; hits: Hit[]; onFollow: (e: React.MouseEvent<HTMLAnchorElement>) => void }) {
  const parts = text.split(/(\[\d+\])/g);
  return (
    <>
      {parts.map((p, i) => {
        const n = /^\[(\d+)\]$/.exec(p);
        const hit = n ? hits[Number(n[1]) - 1] : undefined;
        return hit ? (
          <a key={i} href={hit.chunk.url} onClick={onFollow} className="text-ink underline underline-offset-4 hover:text-ink-muted" title={hit.chunk.title}>
            {p}
          </a>
        ) : (
          <span key={i}>{p}</span>
        );
      })}
    </>
  );
}

export function Assistant() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState({ pct: 0, text: "" });
  const [turns, setTurns] = useState<Turn[]>([]);
  const [question, setQuestion] = useState("");
  const [announce, setAnnounce] = useState("");
  const [model, setModel] = useState<string | null>(null);
  const engine = useRef<WebWorkerMLCEngine | null>(null);
  const busy = useRef(false);
  const loading = useRef(false);
  const nextId = useRef(0);
  const trigger = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const titleId = useId();

  // On first open: check WebGPU support, and whether the model is already cached.
  useEffect(() => {
    if (!open) return;
    input.current?.focus();
    if (status !== "idle" || model) return;
    let live = true;
    void (async () => {
      setStatus("checking");
      const { webgpuModel, isCached } = await import("@/assistant/engine");
      const m = await webgpuModel();
      if (!live) return;
      if (!m) return setStatus("unsupported");
      setModel(m);
      setStatus("idle");
      if (await isCached(m)) void load(m);
    })();
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once per first open
  }, [open]);

  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight });
  }, [turns]);

  // Other buttons on the page (the AI section's "Ask Tyree") open the panel with this event.
  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener(OPEN_ASK_TYREE, show);
    return () => window.removeEventListener(OPEN_ASK_TYREE, show);
  }, []);

  function close() {
    setOpen(false);
    trigger.current?.focus();
  }

  // Following a citation: on this page, close the panel and fly there (the scroll scrubs the
  // Devices); on another page, close the panel and let the link navigate.
  function follow(e: React.MouseEvent<HTMLAnchorElement>) {
    const target = samePageTarget(e.currentTarget.href);
    setOpen(false);
    if (!target) return;
    e.preventDefault();
    flyTo(target);
  }

  // The hero and the AI section have their own Ask Tyree buttons, so the floating one stays out
  // of the way while either is on screen (on phones it would also cover the hero lede).
  // The panel lives in the root layout, so re-observe after each client-side navigation.
  const pathname = usePathname();
  const [heroInView, setHeroInView] = useState(false);
  useEffect(() => {
    const els = [document.getElementById("top"), ...document.querySelectorAll("main [data-ask-tyree]")].filter(
      (el): el is HTMLElement => el instanceof HTMLElement,
    );
    if (!els.length) return;
    const visible = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target);
          else visible.delete(e.target);
        }
        setHeroInView(visible.size > 0);
      },
      { threshold: 0.25 },
    );
    els.forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      setHeroInView(false);
    };
  }, [pathname]);

  async function load(m = model) {
    // One load at a time: the cached-model auto-load and a Load click can otherwise race
    // and start two engines on the same GPU.
    if (!m || engine.current || loading.current) return;
    loading.current = true;
    setStatus("loading");
    try {
      const { loadEngine } = await import("@/assistant/engine");
      engine.current = await loadEngine(m, (r) => setProgress({ pct: Math.round(r.progress * 100), text: r.text }));
      setStatus("ready");
      setAnnounce("The assistant is ready.");
    } catch (err) {
      console.error("[Ask Tyree] model failed to load", err);
      setStatus("error");
      setAnnounce("The assistant couldn't load. Search still works.");
    } finally {
      loading.current = false;
    }
  }

  async function ask(e: FormEvent) {
    e.preventDefault();
    const q = question.trim();
    if (!q || busy.current) return;
    busy.current = true;
    setQuestion("");
    const hits = (await getRetriever())(q, 4);
    const id = nextId.current++;
    const patch = (p: Partial<Turn>) => setTurns((ts) => ts.map((x) => (x.id === id ? { ...x, ...p } : x)));
    setTurns((ts) => [...ts, { id, q, hits, text: "", done: false }]);

    let text = "";
    if (engine.current && hits.length > 0) {
      try {
        const { answer } = await import("@/assistant/engine");
        for await (const delta of answer(engine.current, q, hits)) {
          text += delta;
          patch({ text });
        }
      } catch (err) {
        console.error("[Ask Tyree] answer generation failed", err);
        // A lost GPU device (usually out of memory) kills the engine for good. Stop using it, so
        // later questions answer with passages instead of failing one by one.
        engine.current = null;
        setStatus("lost");
        text = "The AI model stopped. Here's what the site says instead.";
        patch({ text });
      }
    }
    patch({ done: true });
    setAnnounce(text ? `Answer: ${text}` : hits.length ? `${hits.length} matching passages found.` : "Nothing on this site matches that question.");
    busy.current = false;
  }

  const generating = turns.some((t) => !t.done);

  return (
    <>
      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => (open ? close() : setOpen(true))}
        className={`fixed right-5 bottom-5 z-40 inline-flex items-center gap-2 rounded-full bg-graphite px-5 py-3 text-[15px] font-medium text-ink shadow-[0_8px_24px_rgba(0,0,0,0.45)] transition-[opacity,background-color] duration-300 hover:bg-hairline active:scale-[0.97] print:hidden ${heroInView && !open ? "pointer-events-none opacity-0" : "opacity-100"}`}
        tabIndex={heroInView && !open ? -1 : 0}
      >
        <span aria-hidden className="size-2 rounded-full bg-accent-bright" />
        Ask Tyree
      </button>

      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
          onKeyDown={(e) => e.key === "Escape" && close()}
          className="fixed inset-x-3 bottom-20 z-40 flex max-h-[min(72svh,640px)] flex-col overflow-hidden rounded-3xl bg-stage-raised shadow-[0_24px_60px_rgba(0,0,0,0.6)] sm:inset-x-auto sm:right-5 sm:w-[400px] print:hidden"
        >
          <header className="flex items-start justify-between gap-4 border-b border-hairline px-5 py-4">
            <div>
              <h2 id={titleId} className="text-[17px] font-semibold tracking-[-0.01em]">
                Ask Tyree
              </h2>
              <p className="mt-0.5 text-[12px] text-ink-muted">
                Answers come only from this site, with sources. Runs on your device.
              </p>
            </div>
            <button type="button" onClick={close} className="rounded-full px-2 py-1 text-[13px] text-ink-muted hover:text-ink">
              Close
            </button>
          </header>

          <div ref={log} className="flex-1 space-y-6 overflow-y-auto overscroll-contain px-5 py-4 text-[14px] leading-relaxed break-words" aria-busy={generating}>
            {turns.length === 0 && (
              <p className="text-ink-muted">
                Try: &ldquo;How does FlowPulse handle billing?&rdquo; or &ldquo;How does Tyree work with AI agents?&rdquo;
              </p>
            )}
            {turns.map((t) => (
              <div key={t.id} data-turn={t.done ? "done" : "streaming"}>
                <p className="font-medium text-ink">{t.q}</p>
                {t.text && (
                  <p className="mt-2 text-ink">
                    <Cited text={t.text} hits={t.hits} onFollow={follow} />
                  </p>
                )}
                {t.done && t.hits.length === 0 && <p className="mt-2 text-ink-muted">Nothing on this site matches that question.</p>}
                {t.hits.length > 0 && (t.done || t.text) && (
                  <ol className="mt-3 space-y-1.5 text-[13px]">
                    {t.hits.map((h, n) => (
                      <li key={h.chunk.id}>
                        <a href={h.chunk.url} onClick={follow} className="text-ink underline underline-offset-4 hover:text-ink-muted">
                          [{n + 1}] {h.chunk.title}
                        </a>
                        {!t.text && <span className="mt-0.5 block text-ink-muted">{h.chunk.text.slice(0, 160)}…</span>}
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            ))}
          </div>

          <div className="border-t border-hairline px-5 py-4">
            {status !== "ready" && (
              <div className="mb-3 text-[12px] text-ink-muted">
                {status === "checking" && "Checking your browser…"}
                {status === "unsupported" &&
                  "Your browser can't run the on-device model (it needs WebGPU), so answers show the matching passages instead."}
                {status === "idle" && model && (
                  <button type="button" onClick={() => void load()} className="font-medium text-accent-ink hover:underline">
                    Load the AI model ({DOWNLOAD_LABEL}, one time) for written answers
                  </button>
                )}
                {status === "loading" && (
                  <div>
                    <div
                      role="progressbar"
                      aria-label="Loading the model"
                      aria-valuenow={progress.pct}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      className="h-1.5 overflow-hidden rounded-full bg-graphite"
                    >
                      <div className="h-full bg-accent-bright transition-[width]" style={{ width: `${progress.pct}%` }} />
                    </div>
                    <p className="mt-1.5">Loading the model: {progress.pct}%</p>
                  </div>
                )}
                {status === "error" && "The model couldn't load. Search still works."}
                {status === "lost" &&
                  "The AI model stopped, usually because the GPU ran out of memory. Answers now show the matching passages."}
              </div>
            )}
            <form onSubmit={ask} className="flex gap-2">
              <label htmlFor={`${panelId}-q`} className="sr-only">
                Your question
              </label>
              <input
                ref={input}
                id={`${panelId}-q`}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={status === "ready" ? "Ask about Tyree's work…" : "Search Tyree's work…"}
                name="question"
                autoComplete="off"
                maxLength={300}
                className="min-w-0 flex-1 rounded-full bg-stage px-4 py-2.5 text-[14px] text-ink placeholder:text-ink-muted focus:outline-none focus-visible:outline-2 focus-visible:outline-accent-ink"
              />
              <button
                type="submit"
                disabled={generating || !question.trim()}
                className="rounded-full bg-accent px-4 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-accent-bright disabled:opacity-50"
              >
                {status === "ready" ? "Ask" : "Search"}
              </button>
            </form>
            <p className="mt-2.5 text-[11px] text-ink-muted">
              {status === "ready" ? "Small on-device model: check the linked sources. " : ""}
              Your questions stay on your device. Built with Llama.
            </p>
          </div>
          <p aria-live="polite" className="sr-only">
            {announce}
          </p>
        </div>
      )}
    </>
  );
}

