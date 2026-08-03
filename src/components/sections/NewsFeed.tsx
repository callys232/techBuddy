"use client";

import { useEffect, useState, useCallback } from "react";
import type { NormalizedArticle, NewsCategory, NewsApiResponse } from "@/types/news";

// ─── Types ──────────────────────────────────────────────────────────────────

type FilterLabel = "All" | "Crypto" | "Africa" | "Global" | "Fintech" | "AI";

interface FilterOption {
  label: FilterLabel;
  category: NewsCategory | null;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const FILTERS: FilterOption[] = [
  { label: "All", category: null },
  { label: "Crypto", category: "Crypto" },
  { label: "Africa", category: "Africa" },
  { label: "Global", category: "Global" },
  { label: "Fintech", category: "Fintech" },
  { label: "AI", category: "AI" },
];

const PAGE_SIZE = 12;

// ─── Utilities ───────────────────────────────────────────────────────────────

function relativeTime(isoString: string): string {
  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay === 1) return "Yesterday";
  if (diffDay < 7) return `${diffDay}d ago`;

  return new Date(isoString).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
  });
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div
      className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-4 animate-pulse"
      aria-hidden="true"
    >
      <div className="h-3 w-24 rounded bg-[var(--border)] mb-4" />
      <div className="space-y-2 mb-3">
        <div className="h-4 rounded bg-[var(--border)]" />
        <div className="h-4 rounded bg-[var(--border)] w-4/5" />
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 rounded bg-[var(--border)] w-full" />
        <div className="h-3 rounded bg-[var(--border)] w-3/4" />
        <div className="h-3 rounded bg-[var(--border)] w-1/2" />
      </div>
      <div className="h-3 w-16 rounded bg-[var(--border)]" />
    </div>
  );
}

// ─── News Card ────────────────────────────────────────────────────────────────

function NewsCard({ article }: { article: NormalizedArticle }) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] overflow-hidden transition-all duration-200 hover:-translate-y-[2px] hover:border-[var(--primary)] hover:shadow-md"
    >
      {/* Thumbnail */}
      {article.imageUrl && (
        <div className="h-36 overflow-hidden bg-[var(--border)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.imageUrl}
            alt=""
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget.parentElement as HTMLElement).style.display = "none";
            }}
          />
        </div>
      )}

      <div className="flex flex-col flex-1 p-4">
        {/* Source badge */}
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--primary)] border border-[var(--primary)]/30 bg-[var(--primary)]/8 rounded-full px-2.5 py-0.5">
            <SourceIcon />
            {article.sourceName}
          </span>
          <span className="text-[11px] text-[var(--fg)]/40">{relativeTime(article.publishedAt)}</span>
        </div>

        {/* Title */}
        <p className="font-bold text-sm text-[var(--fg)] leading-snug line-clamp-2 mb-2 group-hover:text-[var(--primary)] transition-colors">
          {article.title}
        </p>

        {/* Summary */}
        {article.summary && (
          <p className="text-xs text-[var(--fg)]/55 leading-relaxed line-clamp-3 flex-1">
            {article.summary}
          </p>
        )}

        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-[var(--border)] flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--fg)]/35">
            {article.category}
          </span>
          <ExternalLinkIcon />
        </div>
      </div>
    </a>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function SourceIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-[var(--primary)] flex-shrink-0"
      aria-hidden="true"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-[var(--primary)]"
      aria-hidden="true"
    >
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function NewsFeed() {
  const [articles, setArticles] = useState<NormalizedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterLabel>("All");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/news");
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const data: NewsApiResponse = await res.json();
      setArticles(data.articles);
    } catch {
      setError("Unable to load news right now.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const filtered =
    activeFilter === "All"
      ? articles
      : articles.filter((a) => a.category === activeFilter);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  function handleFilterChange(label: FilterLabel) {
    setActiveFilter(label);
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Filter news by category">
        {FILTERS.map((f) => (
          <button
            key={f.label}
            role="tab"
            aria-selected={activeFilter === f.label}
            onClick={() => handleFilterChange(f.label)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold font-mono uppercase tracking-widest transition-all duration-150 border ${
              activeFilter === f.label
                ? "bg-[var(--primary)] text-[var(--bg)] border-[var(--primary)]"
                : "bg-transparent text-[var(--fg)]/60 border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* States */}
      {loading && (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Loading news articles">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {!loading && error && (
        <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
          <p className="text-sm text-[var(--fg)]/60 mb-4">{error}</p>
          <button
            onClick={fetchNews}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[var(--primary)] text-[var(--primary)] text-sm font-semibold hover:bg-[var(--primary)] hover:text-[var(--bg)] transition-colors"
          >
            <RefreshIcon />
            Retry
          </button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
          <p className="text-sm text-[var(--fg)]/50">No articles found for this filter.</p>
        </div>
      )}

      {!loading && !error && visible.length > 0 && (
        <>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>

          {hasMore && (
            <div className="mt-10 text-center">
              <button
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-[var(--border)] bg-[var(--surface)] text-sm font-semibold text-[var(--fg)]/70 hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
              >
                Load more articles
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
