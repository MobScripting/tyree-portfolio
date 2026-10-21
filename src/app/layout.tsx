import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { profile } from "@/content/profile";
import { Assistant } from "@/components/Assistant";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${profile.name} · Full-stack and AI engineer`,
    template: `%s · ${profile.name}`,
  },
  description: profile.summary,
  authors: [{ name: profile.name }],
  metadataBase: new URL(profile.links.site),
  openGraph: { type: "website", siteName: profile.name, locale: "en_US" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#050507",
  colorScheme: "dark",
};

// Runs before first paint so stage slots never shift layout after load. It only checks
// that the API exists: creating a real context here costs seconds on software GL.
// If context creation later fails, StageLoader turns the stage off again.
const stageProbe = `if("WebGL2RenderingContext"in window&&!(navigator.connection&&navigator.connection.saveData))document.documentElement.dataset.stage="on"`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: stageProbe }} />
      </head>
      <body className="min-h-svh">
        {children}
        <Assistant />
        <Analytics />
      </body>
    </html>
  );
}
