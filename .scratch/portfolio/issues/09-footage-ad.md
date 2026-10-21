# 09: AD Manager footage

**What to build:** Sanitized UI captures of the AD Account Manager using SQLite and fake data.

**Blocked by:** 02

**Status:** done

- [x] PowerShell AD scripts never run
- [x] Only fake names and domains (e.g. contoso.local)
- [x] Captures of templates, bulk import preview, live job progress, audit log

Notes:
- Output: `public/footage/ad-manager/`, seven 1280×800 JPEG stills (dashboard, templates, jobs, job-partial, import, audit, settings) and `loop.webm` (1.2 MB).
- Scratchpad copy with SQLite. Every `spawn("powershell.exe")` in `src` was renamed to a nonexistent binary, the capture script aborts on any `/api/ad/*` request, and the AD Users and Password Reset pages were never visited. No PowerShell ran.
- Data: the app's own seed (templates, the `admin@company.com` admin) plus `scripts/capture/ad-sample-data.mjs`, which adds 12 fictional people on contoso.local, three jobs (completed, partial with one duplicate-name failure, running), an audit trail, and a `hooks.contoso.example` webhook.
- Re-run: `AD_CAPTURE_EMAIL=… AD_CAPTURE_PASSWORD=… node scripts/capture/ad-manager.mjs`, with the copy's seed values passed at run time and never stored.
- Cosmetic bug in the real AD Manager: `src/lib/utils.ts` styles PARTIAL as `text-orange-600 bg-orange-50` with no `dark:` variant, so the job badge renders as a blank light pill in dark mode (visible in job-partial.jpg).
