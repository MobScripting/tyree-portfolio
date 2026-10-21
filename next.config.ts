import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // OG images read Geist TTFs at request time (src/lib/og.tsx); make sure the functions ship them.
  outputFileTracingIncludes: {
    "/opengraph-image": ["./node_modules/geist/dist/fonts/geist-sans/Geist-{SemiBold,Regular}.ttf"],
    "/work/**/opengraph-image": ["./node_modules/geist/dist/fonts/geist-sans/Geist-{SemiBold,Regular}.ttf"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

// Case studies are MDX modules imported by /work/[slug]; no MDX pages or plugins.
export default createMDX({})(nextConfig);
