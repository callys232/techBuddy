import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { AppShowcase } from "@/components/sections/AppShowcase";
import { FAQSection } from "@/components/sections/FAQSection";
import { FAQS } from "@/mock/faqs";
import { HomeCostEstimator } from "@/components/sections/HomeCostEstimator";
import { ToolsTeaser } from "@/components/sections/ToolsTeaser";
import { BlogTeaser } from "@/components/sections/BlogTeaser";
import { RevealSection } from "@/components/ui/ScrollReveal";
import { InvestTeaser } from "@/components/sections/InvestTeaser";
import { CTAStrip } from "@/components/sections/CTAStrip";
import { AffiliateProducts } from "@/components/sections/AffiliateProducts";

export const metadata: Metadata = {
  title: "Software Development Company in Nigeria — Web, Mobile, AI & Fintech",
  description:
    "Founder-led software development in Nigeria for web apps, mobile apps, AI tools, fintech platforms, DevOps, and product design. Explore our portfolio or get a project estimate.",
  keywords: [
    "digital product studio", "software agency",
    "mobile app development", "fintech developer",
    "tech startup MVP", "NDPR compliant software",
    "software development company Nigeria", "Lagos software developer",
    "AI development Nigeria", "fintech app development",
  ],
  openGraph: {
    title: "Software Development in Nigeria | TechAgency",
    description:
      "Web, mobile, AI, fintech, and DevOps engineering from a founder-led technology studio in Lagos, Nigeria.",
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
      <RevealSection delay={0.05}><ServicesGrid /></RevealSection>
      <RevealSection delay={0.05}><AppShowcase /></RevealSection>
      <RevealSection delay={0.05}><AffiliateProducts /></RevealSection>
      <RevealSection delay={0.05}><HomeCostEstimator /></RevealSection>
      <RevealSection delay={0.05}><ToolsTeaser /></RevealSection>
      <RevealSection delay={0.05}><FAQSection /></RevealSection>
      <RevealSection delay={0.05}><BlogTeaser /></RevealSection>
      <RevealSection delay={0.05}><InvestTeaser /></RevealSection>
      <RevealSection delay={0.05}><CTAStrip /></RevealSection>
    </>
  );
}
