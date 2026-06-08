import type { Metadata } from "next";
import { BlogContent } from "@/components/sections/BlogContent";

export const metadata: Metadata = {
  title: "Blog — Tech Insights for African Founders & Builders",
  description:
    "Practical guides on building digital products, Nigerian fintech integration, DevOps on African infrastructure, startup strategy and engineering best practices for the African market.",
  keywords: [
    "Nigerian tech blog", "African startup insights",
    "fintech Nigeria tutorial", "web development blog Africa",
    "startup engineering Nigeria",
  ],
  openGraph: {
    title: "Tech Insights for African Founders & Builders | TechAgency Blog",
    description:
      "Practical engineering guides, startup strategy and fintech deep-dives for the African market.",
  },
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <section className="px-[var(--container-px)] py-[var(--section-y)] text-center">
        <h1 className="font-display text-[var(--text-display)] font-extrabold text-[var(--fg)] leading-none">
          Built by Builders,<br />for Builders
        </h1>
      </section>
      <section className="px-[var(--container-px)] pb-[var(--section-y)]">
        <BlogContent />
      </section>
    </div>
  );
}
