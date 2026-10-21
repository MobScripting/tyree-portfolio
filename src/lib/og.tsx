import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Social share cards in the stage world: near-black ground, aluminium type, one indigo mark.
// Satori cannot read the woff2 that next/font serves, so Geist comes from the `geist` package.

export const ogSize = { width: 1200, height: 630 };

const font = (file: string) => readFile(join(process.cwd(), "node_modules/geist/dist/fonts/geist-sans", file));

export async function ogCard({ title, line, footer }: { title: string; line: string; footer: string }) {
  const [semibold, regular] = await Promise.all([font("Geist-SemiBold.ttf"), font("Geist-Regular.ttf")]);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#050507",
          color: "#f5f5f7",
          fontFamily: "Geist",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 28, color: "#8e8e95" }}>
          <div style={{ width: 12, height: 12, borderRadius: 6, background: "#6366f1" }} />
          {footer}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 92, fontWeight: 600, letterSpacing: "-0.035em", lineHeight: 1.02 }}>{title}</div>
          <div style={{ marginTop: 28, fontSize: 38, color: "#a1a1a6", lineHeight: 1.25, maxWidth: 940 }}>{line}</div>
        </div>
        <div style={{ fontSize: 26, color: "#8e8e95" }}>tyree-portfolio.vercel.app</div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Geist", data: semibold, weight: 600, style: "normal" },
        { name: "Geist", data: regular, weight: 400, style: "normal" },
      ],
    },
  );
}
