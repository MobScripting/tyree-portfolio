# 13: Ask Tyree assistant

**What to build:** A visitor can ask questions about Tyree's work and get answers grounded in the case studies and resume, with citations that link to the passage they came from.

**Blocked by:** 04, 06

**Status:** done

- [x] Retrieval over content chunks built from `src/content/` (BM25, built at predev/prebuild)
- [x] Answers stay on portfolio topics; out-of-scope questions get "I don't know from this site's content"
- [x] Rate limit and spend cap: not needed. The user had no API budget, so the design changed to run fully on the visitor's device (ADR 0006 supersedes 0005): no server route, no key, no cost.
- [x] Eval set of 20 Q&A pairs: `npm run eval:retrieval` (recall@4, runs anywhere) and `npm run eval:answers` (real panel, WebGPU, Edge)

Notes:
- Retrieval: 100% recall@4, MRR 0.91. Stemming and a title-coverage bonus were added after the first run scored 85%.
- Model choice, measured on the same 20 questions:
  - Llama 3.2 1B: 13/20, with several false statements about the work.
  - Qwen2.5 3B: 13/20, over-refuses.
  - Llama 3.2 3B: 18/20 after fixing a corpus gap; 20/20 answers cited; ~2.1 s per answer on an RTX 3060; no materially false answers when read by hand.
- Visitors opt in to a ~1.8 GB one-time download from Hugging Face (needs ~2.3 GB VRAM). Without WebGPU, or if loading fails, the panel answers with the retrieved passages and links.
- The panel shows "Built with Llama", as the Llama 3.2 license requires.
- Caveat: the eval questions were written by someone who knew the corpus. Real visitors will phrase things differently. Re-run both evals whenever `src/content/` changes.
