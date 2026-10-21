// Captures review screenshots of a running site: node scripts/capture.mjs [baseUrl]
// Desktop 1440 and mobile 390: full page, first viewport, and each stage slot centered.
// Reduced motion keeps Device poses deterministic; one extra shot checks the hero intro.
import { chromium } from "playwright";
import sharp from "sharp";

const base = process.argv[2] ?? "http://localhost:3000";

// Full-page shot, stitched from viewport screenshots taken while scrolling. A single fullPage
// capture stretches the fixed Stage canvas to the whole page, and past SwiftShader's 8192 px
// texture limit the image wraps back to the top. Resizing the viewport instead would change the
// layout (the hero and slots are sized in svh). Scrolling at the real viewport size shows each
// Device exactly as a visitor sees it. Fixed chrome (nav, the Ask Tyree pill) is hidden after the
// first frame so it isn't stamped down the page.
async function fullPage(page, path) {
  const { width, height: view } = page.viewportSize();
  // Sticky columns would repeat in every frame they span; render them in normal flow instead.
  await page.addStyleTag({ content: "[class*='sticky'] { position: static !important; }" });
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  const parts = [];
  for (let y = 0; y < total; y += view) {
    const top = Math.min(y, total - view);
    if (y === view) await page.addStyleTag({ content: "header, button[aria-controls] { visibility: hidden !important; }" });
    await page.evaluate((t) => window.scrollTo(0, t), top);
    await page.waitForTimeout(400);
    parts.push({ input: await page.screenshot(), top, left: 0 });
  }
  await sharp({ create: { width, height: total, channels: 3, background: "#050507" } }).composite(parts).png().toFile(path);
  return total;
}
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
  const total = await fullPage(page, `${out}/${name}.png`);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  console.log(name, { stage, height: total, overflow, errors });
  await page.close();
}

// Hero intro: one frame mid-way through the lid opening, one after it settles.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference" });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(base, { waitUntil: "load" });
  await page.waitForFunction(() => document.querySelector("canvas"), null, { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${out}/desktop-intro-mid.png` });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${out}/desktop-intro.png` });
  console.log("intro", { errors });
  await page.close();
}

// No-WebGL fallback: the head probe should leave the stage off and the layout closed up.
{
  const nogl = await chromium.launch({ args: ["--disable-webgl", "--disable-3d-apis"] });
  for (const [name, width, height] of [["desktop", 1440, 900], ["mobile", 390, 844]]) {
    const page = await nogl.newPage({ viewport: { width, height }, reducedMotion: "reduce" });
    await page.goto(base, { waitUntil: "networkidle" });
    await page.screenshot({ path: `${out}/${name}-nogl.png` });
    const stage = await page.evaluate(() => document.documentElement.dataset.stage ?? "off");
    const total = await fullPage(page, `${out}/${name}-nogl-full.png`);
    console.log(`${name} no-WebGL`, { stage, height: total });
    await page.close();
  }
  await nogl.close();
}

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
