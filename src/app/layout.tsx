import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Plus_Jakarta_Sans,
  Inter,
  JetBrains_Mono,
} from "next/font/google";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { PostHogProvider } from "@/components/providers/PostHogProvider";
import "./globals.css";

/* ── Fonts ──────────────────────────────────────────────────────────────────── */

/* Hero / display titles */
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

/* Section headers, nav, UI labels */
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

/* Body copy, paragraphs, form inputs */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

/* Code, labels, monospace accents */
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500", "700"],
});

/* ── Root Metadata ──────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: {
    default: "TechAgency — Digital Product Studio, Built in Africa for the World",
    template: "%s | TechAgency",
  },
  description:
    "We build scalable web apps, mobile products, fintech integrations and DevOps systems for ambitious businesses everywhere. Born in Lagos, engineered for global standards.",
  keywords: [
    "digital product studio",
    "software agency",
    "mobile app development",
    "fintech developer",
    "tech startup MVP",
    "NDPR compliant software",
    "web development Nigeria",
    "React Next.js development",
  ],
  authors: [{ name: "TechAgency", url: "https://techagency.africa" }],
  creator: "TechAgency",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "TechAgency",
    title: "TechAgency — Digital Product Studio, Built in Africa for the World",
    description:
      "End-to-end engineering for ambitious businesses that want to grow. Web, mobile, fintech, DevOps.",
    images: [{ url: "/og-image.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TechAgency — Digital Product Studio, Built in Africa for the World",
    description:
      "End-to-end engineering for ambitious businesses. Web · Mobile · Fintech · DevOps.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

/* ── Root Layout ────────────────────────────────────────────────────────────── */

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${bricolage.variable} ${jakarta.variable} ${inter.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <PostHogProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
