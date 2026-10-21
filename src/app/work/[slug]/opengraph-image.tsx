import { notFound } from "next/navigation";
import { ogCard, ogSize } from "@/lib/og";
import { featured } from "@/content/projects";
import { profile } from "@/content/profile";

export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return featured.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = featured.find((p) => p.slug === slug);
  if (!project) notFound();
  return ogCard({ title: project.name, line: project.tagline, footer: `Case study · ${profile.name}` });
}
