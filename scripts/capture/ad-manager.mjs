// AD Account Manager footage (ticket 09): stills and one loop from a scratch copy that has
// sample data and every PowerShell spawn disabled. Pages that query AD on load are not visited.
//   AD_CAPTURE_EMAIL=… AD_CAPTURE_PASSWORD=… node scripts/capture/ad-manager.mjs [http://localhost:3300]
// Credentials are the copy's own seed values, passed in at run time and never stored here.
import { chromium } from "playwright";
import { mkdir, rename, readdir, rm } from "node:fs/promises";

const base = process.argv[2] ?? "http://localhost:3300";
const { AD_CAPTURE_EMAIL: email, AD_CAPTURE_PASSWORD: password } = process.env;
if (!email || !password) throw new Error("set AD_CAPTURE_EMAIL and AD_CAPTURE_PASSWORD");
const out = "public/footage/ad-manager";
const viewport = { width: 1280, height: 800 };
const forbidden = ["/admin/ad-users", "/admin/password-reset"]; // these call PowerShell on load

const browser = await chromium.launch();

async function signIn(page) {
  page.on("request", (r) => {
    if (r.url().includes("/api/ad/")) throw new Error(`refusing AD call: ${r.url()}`);
  });
  await page.goto(base + "/login", { waitUntil: "networkidle" });
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);
  await page.locator('button[type="submit"]').click();
  await page.waitForURL((u) => !u.pathname.startsWith("/login"), { timeout: 30000 });
  await page.waitForLoadState("networkidle");
}

async function jobUrl(page, fileName) {
  await page.goto(base + "/jobs", { waitUntil: "networkidle" });
  const link = page.locator("a", { hasText: fileName }).first();
  return (await link.count()) ? new URL(await link.getAttribute("href"), base).pathname : null;
}

await mkdir(out, { recursive: true });
{
  const page = await browser.newPage({ viewport, colorScheme: "dark" });
  await signIn(page);
  const partial = await jobUrl(page, "finance-onboarding.csv");
  const stills = [
    ["dashboard", "/dashboard"],
    ["templates", "/templates"],
    ["jobs", "/jobs"],
    ["job-partial", partial],
    ["import", "/import"],
    ["audit", "/admin/audit"],
    ["settings", "/settings"],
  ].filter(([, p]) => p && !forbidden.includes(p));
  for (const [name, path] of stills) {
    await page.goto(base + path, { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${out}/${name}.jpg`, type: "jpeg", quality: 82 });
    console.log("still", name, path);
  }
  await page.close();
}

// Loop: the jobs list, then the running job's live detail page.
{
  const tmp = `${out}/.video`;
  const context = await browser.newContext({ viewport, colorScheme: "dark", recordVideo: { dir: tmp, size: viewport } });
  const page = await context.newPage();
  await signIn(page);
  const running = await jobUrl(page, "it-contractors.csv");
  await page.waitForTimeout(1800);
  if (running) {
    await page.goto(base + running, { waitUntil: "networkidle" });
    await page.waitForTimeout(3200);
  }
  await page.goto(base + "/templates", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  await context.close();
  const [file] = await readdir(tmp);
  await rename(`${tmp}/${file}`, `${out}/loop.webm`);
  await rm(tmp, { recursive: true, force: true });
  console.log("loop", `${out}/loop.webm`);
}

await browser.close();
