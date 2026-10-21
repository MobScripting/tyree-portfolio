# 15: AI resume variant

**What to build:** A second resume PDF that leads with AI/LLM engineering, generated from role-tagged content.

**Blocked by:** 07

**Status:** done

- [x] Role tags on bullets and projects choose what each variant shows
- [x] Both PDFs come from one source

Notes:
- The user approved the wording on 2026-10-21 with the bolder title "AI and full-stack engineer".
- Tended Earth facts verified against its repo: 45 numbered decisions, 70 commits (Oct 15–19, 2026), and milestones M1–M3.5.
- To fit one page, the user approved three wording trims (summary, Tended Earth bullet 2, AI tooling skill) and dropping the Day Stocker role from the AI variant only (`Job.tracks`). The sheet's vertical margin went from 0.45in to 0.4in for both variants.
- Heights: full-stack 1039 of 1056 px, AI 1051 of 1056 px. The AI sheet has about one line to spare.
- Deliberately absent until the Assistant ships (ticket 13): RAG, evals, LLM API claims.
- Gotcha: `next start` only serves `public/` files that existed at build time. Regenerate the PDFs, then rebuild before checking downloads locally.
