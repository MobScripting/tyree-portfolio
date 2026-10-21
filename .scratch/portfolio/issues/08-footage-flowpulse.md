# 08: FlowPulse footage

**What to build:** Stills and short loops of FlowPulse running locally with a fake demo organization.

**Blocked by:** 02

**Status:** done

- [x] Runs locally; seed script lives in the portfolio repo, nothing committed to FlowPulse
- [x] Captures of dashboard, invoices, billing/plans, 2FA/SSO settings, client portal
- [x] Each loop <= 1.5 MB, with a poster image

Notes:
- Output: `public/footage/flowpulse/`, eight 1280×800 JPEG stills (39–77 KB each: dashboard, invoices, expenses, reports, reconcile, time, budgets, security) and `loop.webm` (1.46 MB).
- Captured from a scratchpad copy, nothing touched in the FlowPulse repo. Postgres came from `embedded-postgres` because Docker couldn't start on this machine (virtualization error). Data is FlowPulse's own demo seeds (`prisma/seed.demo.js`, `scripts/seed-demo.js`): fictional companies and 555 phone numbers. Sign-in used the demo route, so no credentials were entered.
- Re-run: `node scripts/capture/flowpulse.mjs` against a copy's Vite server with `DEMO_ENABLED=true` (backend) and `VITE_DEMO_ENABLED=true` (frontend).
- Bug found in the real FlowPulse repo: `frontend/src/context/AuthContext.jsx` defines `demoLogin` but leaves it out of the Provider `value`, so "Try Demo" throws "demoLogin is not a function". Patched in the copy only.
- For ticket 10: the dashboard pie reads "Utilities 94%" because of demo-data weighting. Prefer invoices or reports as the hero screen, and label the footage as sample data on the site.
