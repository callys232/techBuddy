"use client";

import { useState } from "react";
import { TabGroup } from "@/components/ui/TabGroup";
import { BlogCard } from "@/components/ui/BlogCard";
import { BLOG_TABS, ALL_POSTS } from "@/mock/blog";

export function BlogContent() {
  const [activeTab, setActiveTab] = useState("all");
  const [subEmail, setSubEmail] = useState("");
  const [subStatus, setSubStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subEmail) return;
    setSubStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: subEmail }),
      });
      if (!res.ok) throw new Error("Failed");
      setSubStatus("success");
      setSubEmail("");
    } catch {
      setSubStatus("error");
    }
  };

  const filtered =
    activeTab === "all"
      ? ALL_POSTS
      : ALL_POSTS.filter(
          (p) => p.category.toLowerCase().replace(/\s+/g, "-") === activeTab
        );

  return (
    <div className="flex flex-col lg:flex-row gap-10">
      <div className="flex-1">
        <TabGroup tabs={BLOG_TABS} activeTab={activeTab} onChange={setActiveTab} />
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {filtered.map((post) => (
            <BlogCard key={post.slug} {...post} />
          ))}
        </div>
      </div>

      <aside className="w-full lg:w-72 space-y-8">
        <div className="glass rounded-[var(--radius-card)] p-6">
          <h3 className="font-display text-lg font-bold text-[var(--fg)] mb-3">Newsletter</h3>
          <p className="text-sm text-[var(--fg)]/60 mb-4">
            Weekly digest: Nigerian tech news + original articles.
          </p>
          {subStatus === "success" ? (
            <p className="text-sm font-semibold text-[var(--primary)]">You&apos;re subscribed!</p>
          ) : (
            <form onSubmit={handleSubscribe}>
              <input
                type="email"
                required
                value={subEmail}
                onChange={(e) => setSubEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full rounded-lg border border-[var(--border)] bg-transparent px-4 py-2 text-sm text-[var(--fg)] placeholder:text-[var(--fg)]/30 focus:border-[var(--primary)] focus:outline-none"
              />
              {subStatus === "error" && (
                <p className="mt-1 text-xs text-red-400">Something went wrong. Try again.</p>
              )}
              <button
                type="submit"
                disabled={subStatus === "loading"}
                className="mt-3 w-full rounded-lg bg-[var(--primary)] py-2 text-sm font-semibold text-[var(--bg)] hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {subStatus === "loading" ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          )}
        </div>
      </aside>
    </div>
  );
}
