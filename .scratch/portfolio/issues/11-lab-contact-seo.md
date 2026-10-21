# 11: Lab, contact and SEO

**What to build:** A polished lab grid and contact section, plus discoverability (OG images, sitemap, JSON-LD Person).

**Blocked by:** 03

**Status:** done

- [x] Copy-email button works and its feedback is accessible
- [x] OG image, sitemap and robots in place; Lighthouse SEO 100

Notes:
- Added: OG cards (root plus one per case study) from `src/lib/og.tsx` using Geist TTFs from the `geist` package, kept in the function bundles by `outputFileTracingIncludes`.
- Added: a generated monogram icon (replaces Next's default favicon), sitemap.xml, robots.txt, `metadataBase`, OG/Twitter defaults, and JSON-LD Person on the home page.
- Lab: Lawn Titans links to https://www.lawntitans.org (URL from the user, verified live; the apex domain doesn't resolve). Tended Earth's repo is private, so it has no link.
- Added README.md.
- Known cosmetic issue: Satori renders some word gaps in the OG cards slightly wide. Tried kerning off, per-word flex layout and the built-in font; none changed it.
