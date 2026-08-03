import type { Metadata } from "next";
import { NewsFeed } from "@/components/sections/NewsFeed";
import { PageVectors } from "@/components/bg/PageVectors";

export const metadata: Metadata = {
  title: "Tech News — Global & African",
  description:
    "Live tech news aggregated from TechCrunch, BBC Technology, The Next Web, Techpoint Africa, and Disrupt Africa. Stay ahead of what's shaping the African tech ecosystem.",
  keywords: [
    "african tech news",
    "nigeria tech news",
    "techcrunch africa",
    "techpoint africa",
    "disrupt africa",
    "fintech news africa",
    "AI news africa",
  ],
  openGraph: {
    title: "Tech News — Global & African | TechAgency",
    description:
      "Live-aggregated tech headlines covering Africa, fintech, AI, and global technology — curated for builders and founders.",
  },
};

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Page header */}
      <section className="relative overflow-hidden px-[var(--container-px)] py-[var(--section-y)] text-center">
        <PageVectors variant="scattered" intensity={0.28} />
        <div className="relative z-10 max-w-2xl mx-auto">
          <span className="font-mono text-xs text-[var(--primary)] uppercase tracking-widest">
            Live from around the world
          </span>
          <h1 className="mt-3 font-display text-[var(--text-display)] font-extrabold text-[var(--fg)] leading-none">
            News that moves<br />builders, everywhere
          </h1>
          <p className="mt-5 text-[var(--fg)]/55 text-base max-w-lg mx-auto leading-relaxed">
            Headlines from TechCrunch, BBC, The Next Web, Techpoint Africa, and Disrupt Africa — updated every 30 minutes.
          </p>
        </div>
      </section>

      {/* Feed */}
      <section className="px-[var(--container-px)] pb-[var(--section-y)]">
        <NewsFeed />
      </section>
    </div>
  );
}
