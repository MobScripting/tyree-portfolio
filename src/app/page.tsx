import {
  AiSection,
  Contact,
  Experience,
  Hero,
  Lab,
  Nav,
  Proof,
  Work,
} from "@/components/sections";
import { StageLoader } from "@/components/StageLoader";
import { profile } from "@/content/profile";
import { experience } from "@/content/experience";
import { resumeTitle } from "@/content/resume";

// Structured data for search engines and AI crawlers. Only public profile facts (docs/adr/0004).
const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: resumeTitle.ai,
  description: profile.summary,
  url: profile.links.site,
  email: `mailto:${profile.email}`,
  address: { "@type": "PostalAddress", addressLocality: "Johnson City", addressRegion: "TN", addressCountry: "US" },
  worksFor: { "@type": "Organization", name: experience[0].company },
  sameAs: [profile.links.github, profile.links.linkedin].filter(Boolean),
  knowsAbout: ["Full-stack development", "SaaS", "TypeScript", "React", "Node.js", "PostgreSQL", "IT infrastructure", "AI agent workflows"],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person).replace(/</g, "\\u003c") }}
      />
      <Nav />
      <main id="main">
        <Hero />
        <Proof />
        <Work />
        <AiSection />
        <Experience />
        <Lab />
        <Contact />
      </main>
      <StageLoader />
    </>
  );
}
