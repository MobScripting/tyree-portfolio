# 12: Final audit

**What to build:** A quality pass across design, accessibility, performance and content accuracy.

**Blocked by:** 04, 06, 07, 10, 11, 13, 14, 15

**Status:** in-progress (only the answer eval remains; needs free GPU memory)

- [x] impeccable finish review; fixes applied (rebuild → fix; all material fixes applied, DESIGN.md recorded)
- [x] web-design-guidelines review
- [x] Lighthouse targets met on the preview URL (production, mobile, real GPU: Perf 84/91/91, A11y 100, Best practices 100, SEO 100; software GL worst case Perf 70)
- [x] verify-and-stop against all acceptance lists (tickets 01-11 and 13-15 closed; no phone number in src, public or the PDFs)
- [ ] `npm run eval:answers` (22 questions) passes on a free GPU

Notes:
- Local GPU Lighthouse (mobile, `next start`): TBT went from ~700 ms (ticket 14) to ~1,300 ms after the Device material rebuild; shader warm-up via `compileAsync` and shared material programs brought it to 300–690 ms. LCP is noisy locally (2.8–4.4 s on both builds); judge it on production.
- Hero laptop is ~42vw at 1440x900, not the contract's original 60vw (amended in the surface brief).
