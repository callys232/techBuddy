import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { StatsBar } from "@/components/sections/StatsBar";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { AppShowcase } from "@/components/sections/AppShowcase";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { FAQS } from "@/mock/faqs";
import { HomeCostEstimator } from "@/components/sections/HomeCostEstimator";
import { BlogTeaser } from "@/components/sections/BlogTeaser";
import { RevealSection } from "@/components/ui/ScrollReveal";
import { WhyWebsiteSection } from "@/components/sections/WhyWebsiteSection";
import { InvestTeaser } from "@/components/sections/InvestTeaser";
import { CTAStrip } from "@/components/sections/CTAStrip";

export const metadata: Metadata = {
  title: "TechAgency — Digital Product Studio, Built in Africa for the World",
  description:
    "We engineer scalable web apps, mobile products, fintech integrations and DevOps systems for ambitious businesses everywhere. Born in Lagos, built to global standards.",
  keywords: [
    "digital product studio", "software agency",
    "mobile app development", "fintech developer",
    "tech startup MVP", "NDPR compliant software",
  ],
  openGraph: {
    title: "TechAgency — Digital Product Studio, Built in Africa for the World",
    description:
      "End-to-end engineering for businesses that want to grow. Web · Mobile · Fintech · DevOps.",
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
      <WhyWebsiteSection />
      <RevealSection><StatsBar /></RevealSection>
      <RevealSection delay={0.05}><ServicesGrid /></RevealSection>
      <RevealSection delay={0.05}><AppShowcase /></RevealSection>
      <RevealSection delay={0.05}><HomeCostEstimator /></RevealSection>
      <RevealSection delay={0.05}><TestimonialsSection /></RevealSection>
      <RevealSection delay={0.05}><FAQSection /></RevealSection>
      <RevealSection delay={0.05}><BlogTeaser /></RevealSection>
      <RevealSection delay={0.05}><InvestTeaser /></RevealSection>
      <RevealSection delay={0.05}><CTAStrip /></RevealSection>
    </>
  );
}
