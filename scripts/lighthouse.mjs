// Lighthouse (mobile preset) through Playwright's Chromium: node scripts/lighthouse.mjs [url]
// The Lighthouse CLI's own launcher cannot open a debug port in this environment.
import { chromium } from "playwright";
import lighthouse from "lighthouse";
import { writeFileSync } from "node:fs";

const url = process.argv[2] ?? "http://localhost:3100";
const port = 9333;
const browser = await chromium.launch({
  args: [`--remote-debugging-port=${port}`, "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
const { lhr } = await lighthouse(url, {
  port,
  output: "json",
  onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
});
writeFileSync(".impeccable/review/lh-mobile.json", JSON.stringify(lhr));
for (const [k, v] of Object.entries(lhr.categories)) console.log(k, Math.round(v.score * 100));
for (const id of ["first-contentful-paint", "largest-contentful-paint", "total-blocking-time", "cumulative-layout-shift", "speed-index"])
  console.log(id, lhr.audits[id].displayValue);
for (const [c, cat] of Object.entries(lhr.categories))
  for (const ref of cat.auditRefs) {
    const a = lhr.audits[ref.id];
    if (ref.weight > 0 && a.score !== null && a.score < 0.9) console.log("LOW", c, a.id, a.displayValue ?? "");
  }
await browser.close();
