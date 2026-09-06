import type { Metadata } from "next";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { PostHogProvider } from "@/components/providers/PostHogProvider";
import { CurrencyProvider } from "@/components/providers/CurrencyProvider";
import "./globals.css";

/* ── Root Metadata ──────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: {
    default: "TechAgency — Software Development Company in Nigeria",
    template: "%s | TechAgency",
  },
  description:
    "Founder-led software development company in Lagos, Nigeria building web apps, mobile apps, AI tools, fintech platforms, and reliable cloud systems.",
  keywords: [
    "digital product studio",
    "software agency",
    "mobile app development",
    "fintech developer",
    "tech startup MVP",
    "NDPR compliant software",
    "web development Nigeria",
    "React Next.js development",
    "software development company Nigeria",
    "Lagos software developer",
    "AI development services",
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
    title: "TechAgency — Software Development Company in Nigeria",
    description:
      "Founder-led web, mobile, AI, fintech, and DevOps engineering for ambitious businesses in Nigeria and worldwide.",
    images: [{ url: "/og-image.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TechAgency — Software Development Company in Nigeria",
    description:
      "Web, mobile, AI, fintech, and DevOps engineering from Lagos, Nigeria.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://techbuddy.ng";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "TechAgency",
  url: SITE_URL,
  logo: `${SITE_URL}/logo-mark.png`,
  description:
    "Founder-led software development company in Lagos building web applications, mobile apps, AI integrations, fintech platforms, and cloud systems.",
  areaServed: ["Nigeria", "Africa", "Worldwide"],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: process.env.TEAM_EMAIL ?? "team@techbuddy.ng",
    availableLanguage: ["en"],
  },
};

/* Applied before paint so there's never a light→dark flash. Light is the
   default for new visitors — dark only activates on an explicit saved choice,
   it does not follow the OS preference. */
const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    if (stored === "dark") document.documentElement.classList.add("dark");
  } catch (e) {}
})();
`;

/* ── Root Layout ────────────────────────────────────────────────────────────── */

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      </head>
      <body>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <PostHogProvider>
          <ThemeProvider>
            <CurrencyProvider>{children}</CurrencyProvider>
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
