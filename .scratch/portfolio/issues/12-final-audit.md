# 12: Final audit

**What to build:** A quality pass across design, accessibility, performance and content accuracy.

**Blocked by:** 04, 06, 07, 10, 11, 13, 14, 15

**Status:** in-progress (code done; production Lighthouse and the answer eval remain)

- [x] impeccable finish review; fixes applied (rebuild → fix; all material fixes applied, DESIGN.md recorded)
- [x] web-design-guidelines review
- [ ] Lighthouse targets met on the preview URL
- [ ] verify-and-stop against all acceptance lists
- [ ] `npm run eval:answers` (22 questions) passes on a free GPU

Notes:
- Local GPU Lighthouse (mobile, `next start`): TBT went from ~700 ms (ticket 14) to ~1,300 ms after the Device material rebuild; shader warm-up via `compileAsync` and shared material programs brought it to 300–690 ms. LCP is noisy locally (2.8–4.4 s on both builds); judge it on production.
- Hero laptop is ~42vw at 1440x900, not the contract's original 60vw (amended in the surface brief).
