# 07: Full-stack resume

**What to build:** A developer-focused resume rendered from the same content source as the site, as a print page and a downloadable PDF.

**Blocked by:** 03

**Status:** done

- [x] Draft reframes the IT bullets toward automation and infrastructure and adds a Projects section
- [x] User approved the wording
- [x] PDF generated, with no phone number and no street address

Notes:
- The user approved the wording on 2026-10-21, keeping the Day Stocker role.
- The user also corrected the years claim: "six years" became "over four years" (IT roles start Mar 2022) on the site, the resume and PRODUCT.md.
- `npm run resume:pdf` (against `next start -p 3100`) writes `public/Tyree-Chappell-Resume-FullStack.pdf`. It lays out at Letter width and fails if the sheet runs past one page or the text contains a phone-like number. The current sheet is 1048 of 1056 px, so any wording added later has to replace something.
- The PDF text extracts cleanly in reading order for ATS parsers. One known quirk: a line break at "two-factor" extracts as "twofactor".
