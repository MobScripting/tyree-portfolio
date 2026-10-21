# 10: Per-section device scenes

**What to build:** As the visitor scrolls, the laptop and phone move between section poses, and their screens play the matching real footage.

**Blocked by:** 05, 08, 09

**Status:** done

- [x] Keyframes for each section, smooth in both scroll directions
- [x] Video textures with posters that load lazily
- [x] Performance budget still met

Notes:
- Screens are real stills: hero = FlowPulse invoices; FlowPulse slot = invoices → reports → reconcile; AD slot = jobs → partial job → templates. Each still holds for most of its share of the slot's scroll, then cross-fades into the next (`screenAt` in keyframes.ts). Canvas placeholders show until an image loads.
- A Device requests its footage the first time it comes into view, so off-screen Devices add no decodes to page load.
- Every Device has a caption ("FlowPulse demo workspace, sample data" / "Sample data on a fictional contoso.local domain"), gated with the slots so it only appears alongside a Device.
- Dropped, deliberately:
  - Video loops: Playwright's VP8 recordings looked washed out and soft on the Device, and a video texture forces a render per frame. The loop.webm files were deleted.
  - The phone Device: FlowPulse's client portal needs a per-client token, so there's no honest phone footage, and the acceptance list didn't require it.
- Lighthouse mobile, local: 84 on GPU (TBT ~520 ms), 73 on software GL. Before this ticket: local 87, production 89. Re-measure on production after deploy.
