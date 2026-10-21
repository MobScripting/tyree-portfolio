// Ask Tyree footage for the AI section's Device (ticket 14): a real answer from the on-device
// model, captured at the Device's 1280x800 screen size. Uses the answer eval's cached profile and
// Edge for WebGPU (see scripts/eval-answers.mjs):
//   node scripts/capture/ask-tyree.mjs [http://localhost:3100]
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

const base = process.argv[2] ?? "http://localhost:3100";
const question = "How does FlowPulse keep one customer's data away from another's?";
const out = "public/footage/ask-tyree";
await mkdir(out, { recursive: true });

const ctx = await chromium.launchPersistentContext(join(tmpdir(), "ask-tyree-eval-profile"), {
  channel: process.env.EVAL_BROWSER_CHANNEL ?? "msedge",
  args: ["--enable-unsafe-webgpu"],
  viewport: { width: 1280, height: 800 },
  reducedMotion: "reduce",
});
try {
  const page = await ctx.newPage();
  // A text page behind the panel: the home page would show the 3D laptop inside its own screen.
  await page.goto(base + "/work/flowpulse", { waitUntil: "networkidle" });
  await page.locator("button[aria-controls]", { hasText: "Ask Tyree" }).click();
  const input = page.getByPlaceholder("Ask about Tyree's work");
  const load = page.getByRole("button", { name: /Load the AI model/ });
  await Promise.race([input.waitFor({ timeout: 20000 }), load.waitFor({ timeout: 20000 }).then(() => load.click())]);
  await input.waitFor({ timeout: 10 * 60 * 1000 });
  await input.fill(question);
  await input.press("Enter");
  await page.locator('[data-turn="done"]').waitFor({ timeout: 120000 });
  await page.mouse.move(0, 0);
  await page.screenshot({ path: `${out}/answer.jpg`, type: "jpeg", quality: 82 });
  console.log("answer:", (await page.locator("[data-turn] p").nth(1).innerText()).trim());
} finally {
  await ctx.close();
}
