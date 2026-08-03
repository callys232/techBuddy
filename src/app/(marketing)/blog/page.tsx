import type { Metadata } from "next";
import { BlogContent } from "@/components/sections/BlogContent";
import { NewsFeed } from "@/components/sections/NewsFeed";
import { PageVectors } from "@/components/bg/PageVectors";

export const metadata: Metadata = {
  title: "Blog — Tech Insights for Founders & Builders Everywhere",
  description:
    "Practical guides on building digital products, fintech integration, DevOps on emerging-market infrastructure, startup strategy and engineering best practices — grounded in Africa, useful anywhere.",
  keywords: [
    "African tech blog", "startup insights",
    "fintech tutorial", "web development blog",
    "startup engineering",
  ],
  openGraph: {
    title: "Tech Insights for Founders & Builders Everywhere | TechAgency Blog",
    description:
      "Practical engineering guides, startup strategy and fintech deep-dives — from a team building across Africa and beyond.",
  },
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <section className="relative overflow-hidden px-[var(--container-px)] py-[var(--section-y)] text-center">
        <PageVectors variant="scattered" intensity={0.35} />
        <div className="relative z-10">
        <h1 className="font-display text-[var(--text-display)] font-extrabold text-[var(--fg)] leading-none">
          Built by Builders,<br />for Builders
        </h1>
        </div>
      </section>
      <section className="px-[var(--container-px)] pb-[var(--section-y)]">
        <BlogContent />
      </section>

      {/* Live news feed */}
      <section className="px-[var(--container-px)] pb-[var(--section-y)]">
        <div className="mb-10">
          <span className="font-mono text-xs text-[var(--primary)] uppercase tracking-widest">
            Live from around the world
          </span>
          <h2 className="mt-2 font-display text-3xl md:text-4xl font-extrabold text-[var(--fg)]">
            News that moves African builders
          </h2>
        </div>
        <NewsFeed />
      </section>
    </div>
  );
}
