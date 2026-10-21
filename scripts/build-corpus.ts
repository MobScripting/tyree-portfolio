// Builds the assistant's retrieval corpus (ticket 13) from the same content the site renders
// (docs/adr/0002): npx tsx scripts/build-corpus.ts. Runs automatically before dev and build.
// Each chunk is one citable passage with a link to where it appears on the site.
import { readFileSync, writeFileSync } from "node:fs";
import { profile } from "../src/content/profile";
import { featured, lab } from "../src/content/projects";
import { experience } from "../src/content/experience";
import { practices } from "../src/content/ai";
import { education, skills } from "../src/content/resume";
import { slugify } from "../src/lib/slug";
import type { Chunk } from "../src/assistant/types";

const chunks: Chunk[] = [];
const add = (id: string, title: string, url: string, text: string) =>
  chunks.push({ id, title, url, text: text.replace(/\s+/g, " ").trim() });

const current = experience[0];
add("profile", `About ${profile.name}`, "/", `${profile.headline} ${profile.summary} Currently ${current.role} at ${current.company} (since ${current.start}). Based in ${profile.location}. ${profile.relocation}. Contact: ${profile.email}. GitHub: ${profile.links.github}.`);

for (const p of featured) {
  const base = `/#${p.slug}`;
  add(`${p.slug}`, p.name, base, `${p.name}: ${p.tagline} ${p.summary} Status: ${p.status}. ${p.stats.map((s) => `${s.value} ${s.label}`).join(", ")}. Stack: ${p.stack.join(", ")}.`);
  p.beats.forEach((b) => add(`${p.slug}/${slugify(b.title)}`, `${p.name}: ${b.title}`, base, b.body));

  // Case study: one chunk per heading section. JSX (diagrams) and MDX comments are dropped;
  // code fences stay, since excerpts are part of what a reader might ask about.
  const mdx = readFileSync(`src/content/case-studies/${p.slug}.mdx`, "utf8")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/<[A-Z][\s\S]*?\/>/g, "");
  let heading = "Overview";
  let body: string[] = [];
  const flush = () => {
    // Strip markdown markers only: list bullets at line start, emphasis and backticks.
    const text = body.map((l) => l.replace(/^\s*[-*]\s+/, "")).join(" ").replace(/[*_`>]+/g, " ");
    if (text.trim()) add(`work/${p.slug}/${slugify(heading)}`, `${p.name} case study: ${heading}`, `/work/${p.slug}#${slugify(heading)}`, text);
    body = [];
  };
  for (const line of mdx.split("\n")) {
    const h = /^#{2,3}\s+(.+)/.exec(line);
    if (h) {
      flush();
      heading = h[1].trim();
    } else body.push(line);
  }
  flush();
}

practices.forEach((p) => add(`ai/${slugify(p.title)}`, `AI workflow: ${p.title}`, "/#ai", p.body));
lab.forEach((l) => add(`lab/${slugify(l.name)}`, `${l.name} (${l.kind})`, "/#lab", l.body));
experience.forEach((j) =>
  add(`experience/${slugify(j.company)}`, `${j.role} at ${j.company}`, "/#experience", `${j.role}, ${j.company}, ${j.place}, ${j.start} to ${j.end}. ${j.bullets.map((b) => b.text).join(" ")}`),
);
// Both resume variants' skill rows, merged by label so no item is listed twice.
const skillRows = new Map<string, Set<string>>();
for (const s of skills) s.items.forEach((i) => (skillRows.get(s.label) ?? skillRows.set(s.label, new Set()).get(s.label)!).add(i));
add("skills", "Skills", "/resume", [...skillRows].map(([label, items]) => `${label}: ${[...items].join(", ")}.`).join(" "));
add("education", "Education and certifications", "/resume", `${education.school}, ${education.place}, ${education.year}. Certifications: ${education.certifications.join(", ")}. ${education.authorization}.`);

const seen = new Set<string>();
for (const c of chunks) {
  if (seen.has(c.id)) throw new Error(`duplicate chunk id ${c.id}`);
  seen.add(c.id);
}
writeFileSync("src/assistant/corpus.json", JSON.stringify(chunks, null, 1) + "\n");
console.log(`corpus: ${chunks.length} chunks, ${chunks.reduce((n, c) => n + c.text.length, 0)} chars`);
