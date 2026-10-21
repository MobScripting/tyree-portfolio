// Prints the resume page(s) to PDFs in public/: node scripts/resume-pdf.mjs [baseUrl]
// Run against a production server (npm run build && npx next start -p 3100).
// Refuses to write a PDF whose text looks like it contains a phone number (docs/adr/0004).
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:3100";
const variants = [
  ["/resume", "public/Tyree-Chappell-Resume-FullStack.pdf"],
  ["/resume/ai", "public/Tyree-Chappell-Resume-AI.pdf"],
];

const browser = await chromium.launch();
for (const [route, out] of variants) {
  // Lay out at US Letter width (8.5in at 96 dpi) so wrapping matches the printed page.
  const page = await browser.newPage({ viewport: { width: 816, height: 1056 } });
  const res = await page.goto(base + route, { waitUntil: "networkidle" });
  if (!res?.ok()) throw new Error(`${route}: HTTP ${res?.status()}`);
  await page.emulateMedia({ media: "print" });

  const text = await page.locator(".resume-sheet").innerText();
  if (/\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/.test(text)) throw new Error(`${route}: phone-like number in resume text`);

  // US Letter at 96 dpi is 1056 px tall; a resume that spills onto page two is a failed build.
  const height = await page.locator(".resume-sheet").evaluate((el) => el.getBoundingClientRect().height);
  if (height > 1056) throw new Error(`${route}: sheet is ${Math.round(height)}px, over one Letter page`);
  await page.pdf({ path: out, format: "Letter", preferCSSPageSize: true, printBackground: false });
  console.log(out, { heightPx: Math.round(height), pages: Math.ceil(height / 1056) });
  await page.close();
}
await browser.close();
