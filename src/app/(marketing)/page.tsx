import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { StatsBar } from "@/components/sections/StatsBar";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { AppShowcase } from "@/components/sections/AppShowcase";
import { BlogTeaser } from "@/components/sections/BlogTeaser";
import { InvestTeaser } from "@/components/sections/InvestTeaser";
import { CTAStrip } from "@/components/sections/CTAStrip";

export const metadata: Metadata = {
  title: "TechAgency — Digital Product Studio for African Businesses",
  description:
    "We engineer scalable web apps, mobile products, fintech integrations and DevOps systems for Nigerian and African businesses. Lagos-based, NDPR-compliant, built to last.",
  keywords: [
    "web development Nigeria", "software agency Lagos",
    "mobile app development Africa", "fintech developer Nigeria",
    "tech startup MVP Africa", "NDPR compliant software",
  ],
  openGraph: {
    title: "TechAgency — Digital Product Studio for African Businesses",
    description:
      "End-to-end engineering for businesses that want to grow. Web · Mobile · Fintech · DevOps.",
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <ServicesGrid />
      <AppShowcase />
      <BlogTeaser />
      <InvestTeaser />
      <CTAStrip />
    </>
  );
}
