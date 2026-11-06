import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { StatsBar } from "@/components/sections/StatsBar";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { AppShowcase } from "@/components/sections/AppShowcase";
import { ToolsTeaser } from "@/components/sections/ToolsTeaser";
import { HomeCostEstimator } from "@/components/sections/HomeCostEstimator";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { FAQS } from "@/mock/faqs";
import { LeadMagnet } from "@/components/ui/LeadMagnet";
import { RevealSection } from "@/components/ui/ScrollReveal";
import { CTAStrip } from "@/components/sections/CTAStrip";
import { OG_IMAGE } from "@/lib/og";

export const metadata: Metadata = {
  title: "Software That Makes Growing Businesses Easier to Run",
  description:
    "TechBuddy plans and builds web and mobile software that replaces manual work, improves customer experience, and gives growing businesses a reliable path to launch.",
  keywords: [
    "digital product studio", "software agency",
    "mobile app development", "fintech developer",
    "tech startup MVP", "NDPR compliant software",
    "software development company Nigeria", "Lagos software developer",
    "AI development Nigeria", "fintech app development",
  ],
  openGraph: {
    images: [OG_IMAGE],
    title: "Software for Growing Businesses | TechBuddy",
    description:
      "A direct software partner for businesses replacing manual work or launching a better digital product.",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Hero />
      <StatsBar />
      <RevealSection delay={0.05}><ServicesGrid /></RevealSection>
      <RevealSection delay={0.05}><AppShowcase /></RevealSection>
      <RevealSection delay={0.05}><ToolsTeaser /></RevealSection>
      <RevealSection delay={0.05}><HomeCostEstimator /></RevealSection>
      <RevealSection delay={0.05}><TestimonialsSection /></RevealSection>
      <RevealSection delay={0.05}><FAQSection /></RevealSection>
      <RevealSection delay={0.05}><div className="shell my-12"><LeadMagnet /></div></RevealSection>
      <RevealSection delay={0.05}><CTAStrip /></RevealSection>
    </>
  );
}
