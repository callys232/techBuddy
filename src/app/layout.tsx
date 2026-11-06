import type { Metadata } from "next";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { PostHogProvider } from "@/components/providers/PostHogProvider";
import { CurrencyProvider } from "@/components/providers/CurrencyProvider";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://techbuddy.ng";

/* ── Root Metadata ──────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: {
    default: "TechBuddy — Software Development Company",
    template: "%s | TechBuddy",
  },
  description:
    "Founder-led software development company in Lagos, Nigeria, building web apps, mobile apps, AI tools, fintech platforms, and reliable cloud systems.",
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
  authors: [{ name: "TechBuddy", url: SITE_URL }],
  creator: "TechBuddy",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "TechBuddy",
    title: "TechBuddy — Software Development Company",
    description:
      "Founder-led web, mobile, AI, fintech, and DevOps engineering for ambitious businesses in Nigeria and worldwide.",
  },
  twitter: {
    card: "summary_large_image",
    title: "TechBuddy — Software Development Company",
    description:
      "Web, mobile, AI, fintech, and DevOps engineering from Lagos, Nigeria.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "TechBuddy",
  url: SITE_URL,
  logo: `${SITE_URL}/logo-mark.png`,
  description:
    "Founder-led software development company in Lagos building web applications, mobile apps, AI integrations, fintech platforms, and cloud systems.",
  areaServed: ["Nigeria", "Africa", "Worldwide"],
  priceRange: "$$",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "48",
  },
  sameAs: [
    "https://twitter.com/techbuddy_ng",
    "https://linkedin.com/company/techbuddy-ng",
    "https://github.com/techbuddy-ng"
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: process.env.TEAM_EMAIL ?? "calebjella82@gmail.com",
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
            <CurrencyProvider>
              {children}
              <FloatingWhatsApp />
            </CurrencyProvider>
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
