// Answer eval for the on-device assistant (ticket 13): npm run eval:answers [baseUrl]
// Drives the real "Ask Tyree" panel in headless Chromium with WebGPU, loads the model, asks every
// question in src/assistant/eval-set.json, and checks each answer (a) cites a source and (b)
// mentions the expected facts. Needs a WebGPU-capable GPU and downloads the model (~695 MB for the
// default) into a reusable profile. Run against a production build (next start -p 3100).
//   EVAL_MODEL=<WebLLM model id>  evaluate a candidate model instead of the default
//   --clean                       delete the profile (and its cached models) afterwards
import { chromium } from "playwright";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const base = process.argv.find((a) => a.startsWith("http")) ?? "http://localhost:3100";
const evalSet = JSON.parse(await readFile("src/assistant/eval-set.json", "utf8"));
const model = process.env.EVAL_MODEL;
const profile = join(tmpdir(), "ask-tyree-eval-profile");
await mkdir(profile, { recursive: true });
// A full browser build: Playwright's headless shell lacks dxcompiler.dll, so Dawn can't create a
// D3D12 WebGPU device on Windows. Installed Edge (or Chrome via EVAL_BROWSER_CHANNEL=chrome) works.
const ctx = await chromium.launchPersistentContext(profile, {
  channel: process.env.EVAL_BROWSER_CHANNEL ?? "msedge",
  args: ["--enable-unsafe-webgpu"],
  viewport: { width: 1280, height: 900 },
});

try {
  const page = await ctx.newPage();
  if (model) await page.addInitScript((m) => (globalThis.__ASK_TYREE_MODEL = m), model);
  await page.goto(base, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Ask Tyree" }).click();
  const loadButton = page.getByRole("button", { name: /Load the AI model/ });
  await loadButton.waitFor({ timeout: 30000 });
  const t0 = Date.now();
  await loadButton.click();
  page.on("console", (m) => m.text().startsWith("[Ask Tyree]") && console.error(m.text()));
  const ready = page.getByPlaceholder("Ask about Tyree's work").waitFor({ timeout: 15 * 60 * 1000 });
  const failed = page.getByText("The model couldn't load").waitFor({ timeout: 15 * 60 * 1000 }).then(() => {
    throw new Error("model failed to load (see the [Ask Tyree] console error above)");
  });
  await Promise.race([ready, failed]);
  console.log(`${model ?? "default model"}: ready in ${((Date.now() - t0) / 1000).toFixed(0)} s\n`);

  const rows = [];
  for (const { q, mention } of evalSet) {
    const input = page.getByPlaceholder("Ask about Tyree's work");
    const turns = page.locator('[role="dialog"] [data-turn]');
    const n = await turns.count();
    await input.fill(q);
    const t = Date.now();
    await input.press("Enter");
    // Wait for this question's own turn to appear and finish; earlier turns are already done.
    const turn = turns.nth(n);
    await turn.and(page.locator('[data-turn="done"]')).waitFor({ timeout: 120000 });
    const answer = (await turn.locator("p").nth(1).innerText().catch(() => "")).trim();
    const cited = /\[\d+\]/.test(answer);
    const lower = answer.toLowerCase();
    const missing = mention.filter((m) => !lower.includes(m));
    const pass = cited && missing.length === 0;
    rows.push({ q, pass, cited, missing, ms: Date.now() - t, answer });
    console.log(`${pass ? "pass" : "FAIL"}  ${q}\n      ${answer.replace(/\s+/g, " ").slice(0, 220)}${missing.length ? `\n      missing: ${missing.join(", ")}` : ""}${cited ? "" : "\n      no citation"}`);
  }

  const passed = rows.filter((r) => r.pass).length;
  const cited = rows.filter((r) => r.cited).length;
  const avg = rows.reduce((n, r) => n + r.ms, 0) / rows.length / 1000;
  console.log(`\nanswers ${passed}/${rows.length} pass · cited ${cited}/${rows.length} · avg ${avg.toFixed(1)} s per answer`);
  await writeFile(`.impeccable/review/eval-answers${model ? "-" + model : ""}.json`, JSON.stringify(rows, null, 1));
} finally {
  await ctx.close();
  if (process.argv.includes("--clean")) await rm(profile, { recursive: true, force: true });
}
