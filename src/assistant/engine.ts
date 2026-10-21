import type { WebWorkerMLCEngine, InitProgressReport } from "@mlc-ai/web-llm";
import type { Hit } from "./retrieve";

// The on-device model (docs/adr/0006). Llama 3.2 3B, 4-bit: ~1.8 GB of weights fetched once
// from Hugging Face into the browser cache, then everything runs locally on the visitor's GPU.
// Devices without the WebGPU shader-f16 feature get the f32 build of the same weights.
// Chosen by npm run eval:answers: the 1B build stated false things about the work; 3B didn't.
const MODEL_F16 = "Llama-3.2-3B-Instruct-q4f16_1-MLC";
const MODEL_F32 = "Llama-3.2-3B-Instruct-q4f32_1-MLC";
export const DOWNLOAD_LABEL = "about 1.8 GB";

type GPUAdapterLike = { features: Set<string> };
type NavigatorGPU = { gpu?: { requestAdapter(): Promise<GPUAdapterLike | null> } };

export async function webgpuModel(): Promise<string | null> {
  // Lets scripts/eval-answers.mjs compare candidate models without a code change.
  const override = (globalThis as { __ASK_TYREE_MODEL?: string }).__ASK_TYREE_MODEL;
  const gpu = (navigator as Navigator & NavigatorGPU).gpu;
  if (!gpu) return null;
  try {
    const adapter = await gpu.requestAdapter();
    if (!adapter) return null;
    return override ?? (adapter.features.has("shader-f16") ? MODEL_F16 : MODEL_F32);
  } catch {
    return null;
  }
}

export async function isCached(model: string): Promise<boolean> {
  const { hasModelInCache } = await import("@mlc-ai/web-llm");
  return hasModelInCache(model).catch(() => false);
}

export async function loadEngine(model: string, onProgress: (r: InitProgressReport) => void): Promise<WebWorkerMLCEngine> {
  const { CreateWebWorkerMLCEngine } = await import("@mlc-ai/web-llm");
  const worker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });
  return CreateWebWorkerMLCEngine(worker, model, { initProgressCallback: onProgress });
}

// Sources are numbered so answers can cite them.
// Tuned against npm run eval:answers: answer first, copy wording from the sources, no per-source lists.
const SYSTEM = `You answer a recruiter's question about Tyree Chappell. Use only facts stated in the sources.
Write one or two sentences that answer the question directly, then the number of the source you used, like [2].
Reuse the sources' own words. Do not add details, guesses or general knowledge.
Do not list the sources one by one.
If no source answers the question, write exactly: I don't know from this site's content.`;

export function buildMessages(question: string, hits: Hit[]) {
  const sources = hits.map((h, i) => `[${i + 1}] ${h.chunk.title}: ${h.chunk.text}`).join("\n\n");
  return [
    { role: "system" as const, content: SYSTEM },
    { role: "user" as const, content: `Sources:\n${sources}\n\nQuestion: ${question}\nAnswer in one or two sentences with a source number.` },
  ];
}

export async function* answer(engine: WebWorkerMLCEngine, question: string, hits: Hit[]) {
  const stream = await engine.chat.completions.create({
    messages: buildMessages(question, hits),
    stream: true,
    temperature: 0,
    max_tokens: 160,
  });
  for await (const part of stream) {
    const delta = part.choices[0]?.delta?.content;
    if (delta) yield delta;
  }
}
