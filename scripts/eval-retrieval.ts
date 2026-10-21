// Retrieval eval for the assistant (ticket 13): npm run eval:retrieval
// For each question in src/assistant/eval-set.json, does BM25's top 4 include a passage that
// answers it? Fails below the recall bar, so a content edit can't silently break retrieval.
import corpus from "../src/assistant/corpus.json";
import evalSet from "../src/assistant/eval-set.json";
import { createRetriever } from "../src/assistant/retrieve";

const K = 4;
const RECALL_BAR = 0.9;
const retrieve = createRetriever(corpus);
const ids = new Set(corpus.map((c) => c.id));

let hits = 0;
let rr = 0;
for (const { q, expect } of evalSet) {
  for (const e of expect) if (!ids.has(e)) throw new Error(`eval-set names unknown chunk "${e}"`);
  const ranked = retrieve(q, K).map((h) => h.chunk.id);
  const rank = ranked.findIndex((id) => expect.includes(id));
  if (rank >= 0) {
    hits++;
    rr += 1 / (rank + 1);
  }
  console.log(`${rank >= 0 ? "pass" : "MISS"}  @${rank >= 0 ? rank + 1 : "-"}  ${q}${rank < 0 ? `\n        got: ${ranked.join(", ")}` : ""}`);
}
const recall = hits / evalSet.length;
console.log(`\nrecall@${K} ${(recall * 100).toFixed(0)}%  MRR ${(rr / evalSet.length).toFixed(2)}  (${hits}/${evalSet.length})`);
if (recall < RECALL_BAR) process.exit(1);
