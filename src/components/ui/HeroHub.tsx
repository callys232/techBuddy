"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconNews,
  IconTrendingUp,
  IconBallFootball,
  IconTools,
  IconChevronLeft,
  IconChevronRight,
  IconArrowRight,
  IconExternalLink,
} from "@tabler/icons-react";
import type { NormalizedArticle } from "@/types/news";
import type { Fixture } from "@/types/sports";
import { INVEST_SCHEMES } from "@/mock/invest";
import { FREE_TOOLS } from "@/mock/tools";
import { SPORT_LEAGUES } from "@/mock/sportsPredictor";

type TabId = "articles" | "investments" | "predictions" | "tools";

const TABS: { id: TabId; label: string; icon: typeof IconNews }[] = [
  { id: "articles",    label: "Articles",    icon: IconNews },
  { id: "investments", label: "Investments", icon: IconTrendingUp },
  { id: "predictions", label: "Predictions", icon: IconBallFootball },
  { id: "tools",       label: "Free tools",  icon: IconTools },
];

function relativeTime(iso: string): string {
  const diffMin = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.floor(diffHr / 24)}d ago`;
}

function fixtureDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-NG", { weekday: "short", day: "numeric", month: "short" });
}

/* ── Row primitives ───────────────────────────────────────────────────────── */

function RowSkeleton() {
  return (
    <div className="px-5 py-4 space-y-2 animate-pulse">
      <div className="h-3 w-3/4 rounded bg-[var(--border)]" />
      <div className="h-2.5 w-1/2 rounded bg-[var(--border)]" />
    </div>
  );
}

function EmptyRow({ label }: { label: string }) {
  return <p className="px-5 py-6 text-center text-xs faint">{label}</p>;
}

/* ── Component ────────────────────────────────────────────────────────────── */

export function HeroHub() {
  const [collapsed, setCollapsed] = useState(false);
  const [tab, setTab]             = useState<TabId>("articles");

  const [articles, setArticles]   = useState<NormalizedArticle[] | null>(null);
  const [fixtures, setFixtures]   = useState<Fixture[] | null>(null);

  const loadArticles = useCallback(async () => {
    try {
      const res = await fetch("/api/news");
      const data = await res.json();
      setArticles((data.articles ?? []).slice(0, 4));
    } catch {
      setArticles([]);
    }
  }, []);

  const loadFixtures = useCallback(async () => {
    const league = SPORT_LEAGUES[0];
    try {
      const res = await fetch(`/api/sports?league=${league.id}&name=${encodeURIComponent(league.name)}`);
      const data = await res.json();
      setFixtures((data.fixtures ?? []).slice(0, 4));
    } catch {
      setFixtures([]);
    }
  }, []);

  useEffect(() => {
    if (tab === "articles" && articles === null) loadArticles();
    if (tab === "predictions" && fixtures === null) loadFixtures();
  }, [tab, articles, fixtures, loadArticles, loadFixtures]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0, width: collapsed ? 60 : 400 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="hidden lg:flex flex-col card overflow-hidden shrink-0"
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--border)]">
        {!collapsed && (
          <span className="text-[10px] font-bold uppercase tracking-[0.28em] faint">
            What&apos;s happening
          </span>
        )}
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand panel" : "Collapse panel"}
          className="flex h-6 w-6 items-center justify-center rounded-full border border-[var(--border)] text-[var(--ink-muted)] hover:border-[var(--brand)] hover:text-[var(--brand)] transition-colors shrink-0"
        >
          {collapsed ? <IconChevronLeft size={12} /> : <IconChevronRight size={12} />}
        </button>
      </div>

      {/* ── Tab rail ───────────────────────────────────────────────────── */}
      <div className={collapsed ? "flex flex-col gap-1 p-2" : "flex border-b border-[var(--border)]"}>
        {TABS.map((t) => {
          const active = tab === t.id;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => { setTab(t.id); if (collapsed) setCollapsed(false); }}
              title={t.label}
              className={[
                collapsed
                  ? "flex h-10 w-10 items-center justify-center rounded-lg transition-colors"
                  : "flex-1 flex items-center justify-center gap-1.5 px-2 py-2.5 text-[11px] font-semibold transition-colors border-b-2",
                active
                  ? collapsed
                    ? "bg-[var(--brand)]/10 text-[var(--brand)]"
                    : "border-[var(--brand)] text-[var(--brand)]"
                  : collapsed
                    ? "text-[var(--ink-faint)] hover:bg-[var(--surface)] hover:text-[var(--ink)]"
                    : "border-transparent text-[var(--ink-muted)] hover:text-[var(--ink)]",
              ].join(" ")}
            >
              <Icon size={collapsed ? 16 : 13} />
              {!collapsed && <span>{t.label}</span>}
            </button>
          );
        })}
      </div>

      {/* ── Content ────────────────────────────────────────────────────── */}
      {!collapsed && (
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.18 }}
              className="divide-y divide-[var(--border)]"
            >
              {tab === "articles" && (
                articles === null ? (
                  <>{Array.from({ length: 3 }).map((_, i) => <RowSkeleton key={i} />)}</>
                ) : articles.length === 0 ? (
                  <EmptyRow label="Unable to load articles right now." />
                ) : articles.map((a) => (
                  <a key={a.id} href={a.url} target="_blank" rel="noopener noreferrer"
                     className="group block px-5 py-4 hover:bg-[var(--brand)]/4 transition-colors">
                    <p className="text-xs font-semibold text-[var(--ink)] leading-snug line-clamp-2 group-hover:text-[var(--brand)] transition-colors">
                      {a.title}
                    </p>
                    <p className="text-[10px] faint mt-1.5">{a.sourceName} · {relativeTime(a.publishedAt)}</p>
                  </a>
                ))
              )}

              {tab === "investments" && INVEST_SCHEMES.slice(0, 4).map((s) => (
                <Link key={s.name} href="/invest"
                      className="group block px-5 py-4 hover:bg-[var(--brand)]/4 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-[var(--ink)] group-hover:text-[var(--brand)] transition-colors">{s.name}</p>
                    <span className="shrink-0 text-[9px] font-bold uppercase tracking-wider muted">{s.type}</span>
                  </div>
                  <p className="text-[11px] muted mt-1 line-clamp-2 leading-relaxed">{s.description}</p>
                </Link>
              ))}

              {tab === "predictions" && (
                fixtures === null ? (
                  <>{Array.from({ length: 3 }).map((_, i) => <RowSkeleton key={i} />)}</>
                ) : fixtures.length === 0 ? (
                  <EmptyRow label="No upcoming fixtures right now." />
                ) : fixtures.map((f) => (
                  <Link key={f.id} href="/tools/sport-predictor"
                        className="group block px-5 py-4 hover:bg-[var(--brand)]/4 transition-colors">
                    <p className="text-xs font-semibold text-[var(--ink)] group-hover:text-[var(--brand)] transition-colors">
                      {f.homeTeam} <span className="faint font-normal">vs</span> {f.awayTeam}
                    </p>
                    <p className="text-[10px] faint mt-1">{fixtureDate(f.date)}{f.time ? ` · ${f.time.slice(0, 5)}` : ""}</p>
                  </Link>
                ))
              )}

              {tab === "tools" && FREE_TOOLS.slice(0, 5).map((t) => (
                <Link key={t.slug} href={t.href}
                      className="group flex items-center gap-3 px-5 py-3.5 hover:bg-[var(--brand)]/4 transition-colors">
                  <span className="text-lg shrink-0">{t.icon}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-semibold text-[var(--ink)] group-hover:text-[var(--brand)] transition-colors truncate">
                      {t.title}
                    </span>
                  </span>
                  <IconArrowRight size={12} className="shrink-0 opacity-0 group-hover:opacity-60 transition-opacity" />
                </Link>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      {!collapsed && (
        <div className="px-5 py-3 border-t border-[var(--border)]">
          <Link
            href={tab === "tools" ? "/tools" : tab === "investments" ? "/invest" : tab === "predictions" ? "/tools/sport-predictor" : "/news"}
            className="link-underline flex items-center justify-between text-xs font-semibold"
          >
            <span>
              {tab === "tools" ? "See all free tools" : tab === "investments" ? "Explore investment schemes" : tab === "predictions" ? "Open sport predictor" : "See all news"}
            </span>
            <IconExternalLink size={12} />
          </Link>
        </div>
      )}
    </motion.div>
  );
}
