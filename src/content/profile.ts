// Single source of truth for personal details (docs/adr/0002, 0004).
// Never add a phone number or street address here: everything in this file ships publicly.

export const profile = {
  name: "Tyree Chappell",
  headline: "I build the software. I run the servers.",
  summary:
    "Full-stack engineer with over four years in hands-on IT infrastructure. I design, ship and self-host production SaaS, automate the IT work I do every day, and build with AI agents in the loop.",
  location: "Johnson City, TN",
  relocation: "Open to relocate",
  email: "mobhater02@gmail.com",
  links: {
    github: "https://github.com/MobScripting",
    site: "https://tyree-portfolio.vercel.app",
    // Hidden until provided.
    linkedin: null as string | null,
  },
} as const;

export type Track = "fullstack" | "ai";
