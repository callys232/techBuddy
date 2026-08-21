"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { IconRefresh } from "@tabler/icons-react";
import { TabGroup } from "@/components/ui/TabGroup";
import { TemplateCard, ExternalTemplateCard } from "@/components/ui/TemplateCard";
import {
  TEMPLATE_TABS, ALL_TEMPLATES, THEMEFOREST_TEMPLATES, FALLBACK_GITHUB_TEMPLATES,
  type ExternalTemplate,
} from "@/mock/templates";

const SOURCE_TABS = [
  { id: "ours",     label: "Our designs" },
  { id: "external", label: "External references" },
];

export function TemplatesContent() {
  const [sourceTab, setSourceTab]   = useState("ours");
  const [filterTab, setFilterTab]   = useState("all");
  const router                      = useRouter();

  const [githubTemplates, setGithubTemplates] = useState<ExternalTemplate[]>(FALLBACK_GITHUB_TEMPLATES);
  const [ghLoading, setGhLoading]              = useState(true);
  const [ghLive, setGhLive]                    = useState(false);

  const fetchGithub = useCallback(async () => {
    setGhLoading(true);
    try {
      const res = await fetch("/api/templates");
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const data: { templates: ExternalTemplate[] } = await res.json();
      if (data.templates?.length) {
        setGithubTemplates(data.templates);
        setGhLive(true);
      }
    } catch {
      // keep fallback list — silent, matches the news feed's degrade-gracefully pattern
    } finally {
      setGhLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGithub();
  }, [fetchGithub]);

  const externalTemplates = [...THEMEFOREST_TEMPLATES, ...githubTemplates];

  const filteredOwn = filterTab === "all"
    ? ALL_TEMPLATES
    : ALL_TEMPLATES.filter((t) => t.type === filterTab);

  const filteredExt = filterTab === "all"
    ? externalTemplates
    : externalTemplates.filter((t) => t.type === filterTab);

  const handleSelect = (name: string) =>
    router.push(`/quote?template=${encodeURIComponent(name)}`);

  return (
    <>
      {/* ── Source switcher ──────────────────────────────────────────── */}
      <div className="flex gap-2 mb-6">
        {SOURCE_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSourceTab(t.id)}
            className={[
              "h-9 px-5 rounded-full text-sm font-semibold transition-all",
              sourceTab === t.id
                ? "bg-[var(--brand)] text-[var(--page)]"
                : "border border-[var(--border)] text-[var(--ink)]/60 hover:border-[var(--brand)] hover:text-[var(--ink)]",
            ].join(" ")}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Context note for external ────────────────────────────────── */}
      {sourceTab === "external" && (
        <div className="mb-6 glass rounded-xl border border-[var(--border)] px-5 py-3.5 text-sm text-[var(--ink)]/55 leading-relaxed">
          <div className="flex items-start justify-between gap-4">
            <p>
              These are curated references from <strong className="text-[var(--ink)]">ThemeForest</strong> and <strong className="text-[var(--ink)]">GitHub</strong> (MIT-licensed). We use them as starting points — we build a fully custom version for your brand, stack and requirements. Prices shown are our customisation fee.
            </p>
            <button
              type="button"
              onClick={fetchGithub}
              disabled={ghLoading}
              className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-1 text-[11px] font-semibold text-[var(--ink)]/50 hover:border-[var(--brand)] hover:text-[var(--brand)] transition-all disabled:opacity-40"
            >
              <IconRefresh size={11} className={ghLoading ? "animate-spin" : ""} />
              {ghLive ? "Live from GitHub" : "Refresh"}
            </button>
          </div>
        </div>
      )}

      {/* ── Type filter ──────────────────────────────────────────────── */}
      <TabGroup tabs={TEMPLATE_TABS} activeTab={filterTab} onChange={setFilterTab} />

      {/* ── Grid ─────────────────────────────────────────────────────── */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sourceTab === "ours" ? (
          <>
            {filteredOwn.map((t) => (
              <TemplateCard
                key={t.name}
                {...t}
                onSelect={() => handleSelect(t.name)}
              />
            ))}
            {/* Custom build slot */}
            <div className="flex flex-col items-center justify-center rounded-[var(--radius-card)] border border-dashed border-[var(--border)] p-10 text-center">
              <p className="font-display text-lg font-bold text-[var(--ink)] mb-2">Build From Scratch</p>
              <p className="text-sm text-[var(--ink)]/50 mb-6">Custom design for unique requirements.</p>
              <a
                href="/quote"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-[var(--brand)] px-6 text-sm font-semibold text-[var(--brand)] hover:bg-[var(--brand)] hover:text-[var(--page)] transition-all"
              >
                Start custom build
              </a>
            </div>
          </>
        ) : (
          <>
            {filteredExt.map((t) => (
              <ExternalTemplateCard
                key={t.name}
                {...t}
                onSelect={() => handleSelect(t.name)}
              />
            ))}
          </>
        )}
      </div>

      {/* ── Disclaimer ───────────────────────────────────────────────── */}
      {sourceTab === "external" && (
        <p className="mt-8 text-center text-xs text-[var(--ink)]/25 max-w-xl mx-auto leading-relaxed">
          ThemeForest items are sold under Envato license — purchase of the original theme is the client&apos;s responsibility. GitHub templates are MIT-licensed. We charge only for our customisation and development work.
        </p>
      )}
    </>
  );
}
