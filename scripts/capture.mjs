// Captures review screenshots of a running site: node scripts/capture.mjs [baseUrl]
// Desktop 1440 and mobile 390: full page, first viewport, and each stage slot centered.
// Reduced motion keeps Device poses deterministic; one extra shot checks the hero intro.
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:3000";
const out = ".impeccable/review";
const slots = ["flowpulse", "ai", "ad-manager"];
// SwiftShader gives the headless shell a software WebGL context.
const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });

async function shoot(name, width, height, reducedMotion) {
  const page = await browser.newPage({ viewport: { width, height }, reducedMotion });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto(base, { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  return { page, errors };
}

for (const [name, width, height] of [["desktop", 1440, 900], ["mobile", 390, 844]]) {
  const { page, errors } = await shoot(name, width, height, "reduce");
  const stage = await page.evaluate(() => document.documentElement.dataset.stage ?? "off");
  await page.screenshot({ path: `${out}/${name}-first.png` });
  for (const id of slots) {
    await page.evaluate((id) => {
      const el = document.querySelector(`[data-stage-slot="${id}"]`);
      if (el) window.scrollTo(0, el.getBoundingClientRect().top + scrollY - (innerHeight - el.offsetHeight) / 2);
    }, id);
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${out}/${name}-${id}.png` });
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${out}/${name}.png`, fullPage: true });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  console.log(name, { stage, overflow, errors });
  await page.close();
}

const { page, errors } = await shoot("intro", 1440, 900, "no-preference");
await page.screenshot({ path: `${out}/desktop-intro.png` });
console.log("intro", { errors });
await page.close();

// Case study pages: full page at both widths.
for (const route of ["/work/flowpulse", "/work/ad-manager", "/work/agentic-workflow"]) {
  for (const [name, width, height] of [["desktop", 1440, 900], ["mobile", 390, 844]]) {
    const p = await browser.newPage({ viewport: { width, height }, reducedMotion: "reduce" });
    const errs = [];
    p.on("pageerror", (e) => errs.push(e.message));
    p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
    const res = await p.goto(base + route, { waitUntil: "networkidle" });
    const slug = route.split("/").pop();
    await p.screenshot({ path: `${out}/${name}-case-${slug}.png`, fullPage: true });
    const overflow = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    console.log(route, name, { status: res?.status(), overflow, errors: errs });
    await p.close();
  }
}
await browser.close();
