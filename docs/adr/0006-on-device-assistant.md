---
status: accepted (supersedes 0005)
---

# The Assistant runs on the visitor's device, not on a paid API

There was no budget for a hosted LLM API, and hosting a model on Tyree's own PC would make the demo depend on his machine being on and exposed to the internet. So "Ask Tyree" retrieves passages from the site's own content with BM25 in the browser, then, only if the visitor opts in to a one-time ~1.8 GB download, answers with Llama 3.2 3B through WebLLM on their GPU, citing the passages it used. Without WebGPU the same retrieval answers with the passages and their links. The site stays a static deployment with no server route, no API key and no cost; questions never leave the visitor's device.

## Consequences

- Model size was chosen by measuring with `npm run eval:answers`. Llama 3.2 1B (700 MB) passed 13/20 but stated false things about the work, for example that he had not built client websites. Qwen2.5 3B refused 7 answerable questions. Llama 3.2 3B passed 16/20, with every answer citing a source and none materially false. The cost is a larger one-time download (~1.8 GB, ~2.3 GB of VRAM). Answers are still weaker than a hosted frontier model's, so the panel tells visitors to check the linked sources.
- `npm run eval:retrieval` guards retrieval quality (recall@4 over `src/assistant/eval-set.json`). Answer quality needs a WebGPU browser to measure.
- Llama 3.2's community license requires "Built with Llama" wherever the model is used. The panel shows it.
- If budget appears later, a hosted model can sit behind the same retrieval and citation UI. ADR 0005's rate-limit and spend-cap requirements would apply again.
