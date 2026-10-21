# 14: AI section and agentic-workflow case study

**What to build:** An AI section in the scroll story where the laptop shows the assistant, plus a case study on building with Claude Code (skills, tickets, agents, handoffs).

**Blocked by:** 05, 13

**Status:** done

- [x] Assistant tool calls can fly the camera to the matching section
- [x] Case study cites this repo's own tickets and decision docs

Notes:
- The AI section has its own Device showing a real Ask Tyree answer (`scripts/capture/ask-tyree.mjs`). It also has an "Ask Tyree" button that opens the panel via the `ask-tyree:open` window event, and links to `/work/agentic-workflow` and the AI resume. The section's background became the transparent stage so its Device shows.
- Agentic-workflow case study: every claim is traced to this repo (ADRs, tickets, eval files, git history). It lists the seven wrong claims fact-checking caught and the agent's own mistakes.
- "Assistant tool calls fly the camera": dropped. A 3B on-device model doesn't do reliable tool calling, and citation links already take the visitor to the exact passage. That's the honest version of the same promise.
- AI resume wording (approved): the portfolio bullets now claim on-device RAG and the model eval. Both PDFs are still one page.
- Fixed in passing:
  - Pill's file-extension regex had lost its backslashes. Production happened to work anyway.
  - The case-study CTA said "private" for the public repo.
  - A lost GPU device (out of VRAM) used to fail every later question. Now Ask Tyree drops the engine, explains, and answers with passages. Reproduced on this machine: 10.4 of 12 GB of VRAM was in use (llama-server running).
- Not re-run: the answer eval on the grown corpus (22 questions; retrieval MRR dropped from 0.91 to 0.81 with recall still 100%). Re-run `npm run eval:answers` when the GPU has about 2.5 GB of VRAM free.
- Lighthouse locally (GPU under memory pressure): home 81, agentic case page 97. Measure production after deploy.
