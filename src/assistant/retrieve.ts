import type { Chunk } from "./types";

// BM25 retrieval over the site corpus. The corpus is a few thousand tokens, so lexical
// ranking finds the right passages without shipping an embedding model to the browser.
// Shared by the assistant (browser) and the retrieval eval (scripts/eval-retrieval.ts).

const STOP = new Set(
  "a an and are as at be by can did do does for from has have he his how i in is it its me my of on or so that the their them they this to was what when where which who why will with you your tyree".split(
    " ",
  ),
);

// Light suffix stemming so "installed", "installing" and "installer" all meet at "install".
// The minimum stem length keeps short words ("user", "uses") from collapsing.
const SUFFIXES = ["ations", "ation", "ings", "ing", "ers", "er", "ed", "es", "s"];
// Common irregular past forms, which suffix rules can't reach ("caught" should meet "catch").
const IRREGULAR: Record<string, string> = {
  caught: "catch", built: "build", found: "find", made: "make", wrote: "write", written: "write",
  ran: "run", chose: "choose", chosen: "choose", taught: "teach", bought: "buy", brought: "bring",
  thought: "think", sent: "send", spent: "spend", kept: "keep", led: "lead",
};
function stem(w: string): string {
  if (IRREGULAR[w]) return IRREGULAR[w];
  if (w.endsWith("ss")) return w;
  for (const suf of SUFFIXES) if (w.endsWith(suf) && w.length - suf.length >= 4) return w.slice(0, -suf.length);
  return w;
}

// Lowercase words, drop stopwords, stem.
export function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/[a-z0-9]+/g) ?? []).filter((w) => !STOP.has(w)).map(stem);
}

const K1 = 1.4;
const B = 0.75;
const TITLE_WEIGHT = 2; // a match in the passage title counts double
// Bonus for covering a passage's whole title, so "What is FlowPulse?" lands on the overview
// passage (title "FlowPulse") rather than a detail passage that also mentions the product.
const TITLE_COVERAGE_BONUS = 2;

export type Hit = { chunk: Chunk; score: number };

export function createRetriever(chunks: Chunk[]) {
  const docs = chunks.map((c) => {
    const terms = [...tokenize(c.text), ...Array(TITLE_WEIGHT).fill(tokenize(c.title)).flat()];
    const tf = new Map<string, number>();
    for (const t of terms) tf.set(t, (tf.get(t) ?? 0) + 1);
    return { chunk: c, tf, len: terms.length, title: new Set(tokenize(c.title)) };
  });
  const avgLen = docs.reduce((n, d) => n + d.len, 0) / docs.length;
  const df = new Map<string, number>();
  for (const d of docs) for (const t of d.tf.keys()) df.set(t, (df.get(t) ?? 0) + 1);
  const idf = (t: string) => {
    const n = df.get(t) ?? 0;
    return Math.log(1 + (docs.length - n + 0.5) / (n + 0.5));
  };

  return function retrieve(query: string, k = 4): Hit[] {
    const q = [...new Set(tokenize(query))];
    return docs
      .map((d) => {
        const bm25 = q.reduce((s, t) => {
          const f = d.tf.get(t) ?? 0;
          return f ? s + (idf(t) * f * (K1 + 1)) / (f + K1 * (1 - B + (B * d.len) / avgLen)) : s;
        }, 0);
        const covered = [...d.title].filter((t) => q.includes(t)).length / (d.title.size || 1);
        return { chunk: d.chunk, score: bm25 > 0 ? bm25 + TITLE_COVERAGE_BONUS * covered : 0 };
      })
      .filter((h) => h.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, k);
  };
}
