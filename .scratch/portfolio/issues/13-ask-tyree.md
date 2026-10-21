# 13: Ask Tyree assistant

**What to build:** A visitor can ask questions about Tyree's work and get streamed answers grounded in the case studies and resume, with citations and a link to the relevant section.

**Blocked by:** 04, 06

**Status:** needs-user (Anthropic API key entered in Vercel)

- [ ] Retrieval over content chunks that are embedded at build time
- [ ] Streaming route; system prompt keeps it to portfolio topics
- [ ] Per-IP rate limit and a monthly spend cap
- [ ] Eval set of about 20 Q&A pairs, runnable in CI
