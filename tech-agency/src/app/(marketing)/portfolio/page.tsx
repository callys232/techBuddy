import type { Metadata } from "next";
import { AppCard } from "@/components/ui/AppCard";
import { TabGroup } from "@/components/ui/TabGroup";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Real products built for real businesses across Africa.",
};

const FILTER_TABS = [
  { id: "all", label: "All" },
  { id: "web", label: "Web App" },
  { id: "mobile", label: "Mobile" },
  { id: "saas", label: "SaaS" },
  { id: "fintech", label: "Fintech" },
  { id: "ecommerce", label: "E-commerce" },
  { id: "internal", label: "Internal Tools" },
];

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <section className="px-[var(--container-px)] py-[var(--section-y)] text-center">
        <h1 className="font-display text-[var(--text-display)] font-extrabold text-[var(--fg)] leading-none">
          Projects We&apos;ve Built
        </h1>
        <p className="mt-6 text-lg text-[var(--fg)]/60 max-w-xl mx-auto">
          From Lagos to Nairobi — products that move the needle.
        </p>
      </section>

      <section className="px-[var(--container-px)] pb-[var(--section-y)]">
        <TabGroup tabs={FILTER_TABS} activeTab="all" onChange={() => {}} />
        <div className="mt-10 columns-1 gap-6 sm:columns-2 lg:columns-3 space-y-6">
          {/* Masonry grid — populated from Sanity in production */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="break-inside-avoid">
              <AppCard
                image="/placeholder.png"
                name={`Project ${i + 1}`}
                tags={["Next.js", "Tailwind"]}
                stack={["Next.js", "TypeScript", "Supabase"]}
                liveUrl="#"
                caseStudy
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
