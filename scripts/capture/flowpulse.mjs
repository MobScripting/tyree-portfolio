// FlowPulse footage (ticket 08): stills and one screen loop from a local copy seeded with
// FlowPulse's own demo data. Run against the copy's Vite dev server, never production:
//   node scripts/capture/flowpulse.mjs [http://localhost:5173]
// Signs in through the demo button, so no credentials are entered.
import { chromium } from "playwright";
import { mkdir, rename, readdir, rm } from "node:fs/promises";

const base = process.argv[2] ?? "http://localhost:5173";
const out = "public/footage/flowpulse";
const viewport = { width: 1280, height: 800 }; // matches the Device screen texture (16:10)
const stills = [
  ["dashboard", "/"],
  ["invoices", "/invoices"],
  ["expenses", "/expenses"],
  ["reports", "/reports"],
  ["reconcile", "/reconcile"],
  ["time", "/time"],
  ["budgets", "/budgets"],
  ["security", "/security"],
];

await mkdir(out, { recursive: true });
const browser = await chromium.launch();

async function signIn(page) {
  await page.goto(base + "/login", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Try Demo/ }).click();
  await page.waitForURL((u) => !u.pathname.startsWith("/login"), { timeout: 20000 });
  await page.waitForLoadState("networkidle");
}

// Stills
{
  const page = await browser.newPage({ viewport, colorScheme: "dark" });
  await signIn(page);
  for (const [name, path] of stills) {
    await page.goto(base + path, { waitUntil: "networkidle" });
    await page.waitForTimeout(900); // let charts finish animating
    await page.screenshot({ path: `${out}/${name}.jpg`, type: "jpeg", quality: 82 });
    console.log("still", name, page.url());
  }
  await page.close();
}

// Loop: dashboard, then a slow scroll, then the invoice list. Recorded as webm by Playwright.
{
  const tmp = `${out}/.video`;
  const context = await browser.newContext({ viewport, colorScheme: "dark", recordVideo: { dir: tmp, size: viewport } });
  const page = await context.newPage();
  await signIn(page);
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1800);
  await page.mouse.move(640, 400);
  for (let i = 0; i < 12; i++) {
    await page.mouse.wheel(0, 60);
    await page.waitForTimeout(120);
  }
  await page.waitForTimeout(900);
  await page.goto(base + "/invoices", { waitUntil: "networkidle" });
  await page.waitForTimeout(2200);
  await context.close();
  const [file] = await readdir(tmp);
  await rename(`${tmp}/${file}`, `${out}/loop.webm`);
  await rm(tmp, { recursive: true, force: true });
  console.log("loop", `${out}/loop.webm`);
}

await browser.close();
