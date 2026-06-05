import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { StatsBar } from "@/components/sections/StatsBar";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { AppShowcase } from "@/components/sections/AppShowcase";
import { BlogTeaser } from "@/components/sections/BlogTeaser";
import { InvestTeaser } from "@/components/sections/InvestTeaser";
import { CTAStrip } from "@/components/sections/CTAStrip";

export const metadata: Metadata = {
  title: "TechAgency — We Build What Africa Does Business With",
  description:
    "Web apps, mobile, DevOps, security — end-to-end digital products for serious African businesses.",
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
