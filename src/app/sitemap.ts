import type { MetadataRoute } from "next";
import { featured } from "@/content/projects";
import { resumeRoute } from "@/content/resume";
import { profile } from "@/content/profile";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = profile.links.site;
  return [
    { url: base, priority: 1 },
    ...featured.map((p) => ({ url: `${base}/work/${p.slug}`, priority: 0.8 })),
    ...Object.values(resumeRoute).map((route) => ({ url: `${base}${route}`, priority: 0.6 })),
  ];
}
