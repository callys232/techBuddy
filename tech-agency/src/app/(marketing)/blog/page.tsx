import type { Metadata } from "next";
import { BlogCard } from "@/components/ui/BlogCard";
import { TabGroup } from "@/components/ui/TabGroup";

export const metadata: Metadata = {
  title: "Blog",
  description: "Built by builders, for builders. Deep dives on web, security, DevOps, and African tech.",
};

const CATEGORY_TABS = [
  { id: "all", label: "All" },
  { id: "web-dev", label: "Web Dev" },
  { id: "security", label: "Security" },
  { id: "devops", label: "DevOps" },
  { id: "startup-tech", label: "Startup Tech" },
  { id: "nigeria-tech", label: "Nigeria Tech" },
  { id: "tools", label: "Tools" },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <section className="px-[var(--container-px)] py-[var(--section-y)] text-center">
        <h1 className="font-display text-[var(--text-display)] font-extrabold text-[var(--fg)] leading-none">
          Built by Builders,<br />for Builders
        </h1>
      </section>

      <section className="px-[var(--container-px)] pb-[var(--section-y)]">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main content */}
          <div className="flex-1">
            <TabGroup tabs={CATEGORY_TABS} activeTab="all" onChange={() => {}} />
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <BlogCard
                  key={i}
                  image="/placeholder.png"
                  category="Web Dev"
                  title={`How We Built a Production-Grade Next.js App in 2 Weeks (${i + 1})`}
                  author={{ name: "Tech Team", avatar: "/placeholder.png" }}
                  readTime={5}
                  slug={`sample-post-${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-72 space-y-8">
            <div className="glass rounded-[var(--radius-card)] p-6">
              <h3 className="font-display text-lg font-bold text-[var(--fg)] mb-3">
                Newsletter
              </h3>
              <p className="text-sm text-[var(--fg)]/60 mb-4">
                Weekly digest: Nigerian tech news + original articles.
              </p>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full rounded-lg border border-[var(--border)] bg-transparent px-4 py-2 text-sm text-[var(--fg)] placeholder:text-[var(--fg)]/30 focus:border-[var(--primary)] focus:outline-none"
              />
              <button className="mt-3 w-full rounded-lg bg-[var(--primary)] py-2 text-sm font-semibold text-[var(--bg)] hover:opacity-90 transition-opacity">
                Subscribe
              </button>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
