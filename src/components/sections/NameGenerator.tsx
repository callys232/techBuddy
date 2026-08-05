"use client";

import { useState } from "react";
import { IconSparkles, IconLoader2, IconAlertCircle, IconCheck, IconX, IconHelpCircle } from "@tabler/icons-react";
import { captureToolLead } from "@/lib/captureToolLead";

type Style = "modern" | "playful" | "professional" | "local";

const STYLES: { id: Style; label: string }[] = [
  { id: "modern", label: "Modern & sleek" },
  { id: "playful", label: "Playful & friendly" },
  { id: "professional", label: "Professional & serious" },
  { id: "local", label: "Rooted in local language" },
];

interface NameIdea {
  name: string;
  tagline: string;
  domains: { com: boolean | null; ng: boolean | null; io: boolean | null };
}

function DomainBadge({ tld, available }: { tld: string; available: boolean | null }) {
  if (available === null) {
    return <span className="inline-flex items-center gap-1 text-[11px] text-[var(--ink-faint)]"><IconHelpCircle size={11} />.{tld} unknown</span>;
  }
  return available ? (
    <span className="inline-flex items-center gap-1 text-[11px] text-[var(--good)]"><IconCheck size={11} />.{tld} likely free</span>
  ) : (
    <span className="inline-flex items-center gap-1 text-[11px] text-[var(--ink-faint)]"><IconX size={11} />.{tld} taken</span>
  );
}

export function NameGenerator() {
  const [description, setDescription] = useState("");
  const [style, setStyle] = useState<Style>("modern");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ideas, setIdeas] = useState<NameIdea[] | null>(null);

  const generate = async () => {
    if (!description.trim()) { setError("Describe your business idea first."); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tools/name-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, style }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Could not generate names");
      setIdeas(json.ideas);
      captureToolLead({
        tool: "name-generator",
        source: "quote-click",
        selections: { style, description },
        result: { count: json.ideas.length },
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="card p-6 mb-8">
        <label className="block text-xs font-medium text-[var(--ink-muted)] mb-1.5">Describe your business idea</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="A logistics app that helps small vendors deliver goods across Lagos same-day"
          className="w-full bg-[var(--page)] border border-[var(--border)] rounded-lg text-sm text-[var(--ink)] placeholder:text-[var(--ink-faint)] py-2.5 px-3.5 resize-none focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]/30 transition-colors mb-4"
        />

        <p className="text-xs font-medium text-[var(--ink-muted)] mb-2">Style</p>
        <div className="flex flex-wrap gap-2 mb-5">
          {STYLES.map((s) => (
            <button
              key={s.id}
              onClick={() => setStyle(s.id)}
              className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                style === s.id ? "border-[var(--brand)] bg-[var(--brand)]/8 text-[var(--brand)]" : "border-[var(--border)] text-[var(--ink-muted)] hover:border-[var(--brand)]/40"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {error && <div className="flex items-center gap-2 text-[var(--bad)] text-sm mb-4"><IconAlertCircle size={15} className="shrink-0" /><span>{error}</span></div>}

        <button onClick={generate} disabled={loading} className="btn-primary h-11 px-6 text-sm">
          {loading ? <IconLoader2 size={16} className="animate-spin" /> : <IconSparkles size={16} />}
          {loading ? "Generating names…" : "Generate 12 names"}
        </button>
      </div>

      {ideas && (
        <div className="space-y-3">
          <p className="text-xs text-[var(--ink-faint)] mb-1">
            Domain checks are a DNS heuristic, not a registrar lookup — always verify availability before you buy.
          </p>
          {ideas.map((idea) => (
            <div key={idea.name} className="card-quiet p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="font-heading font-semibold text-[var(--ink)]">{idea.name}</p>
                <p className="text-sm text-[var(--ink-muted)]">{idea.tagline}</p>
              </div>
              <div className="flex gap-3 shrink-0">
                <DomainBadge tld="com" available={idea.domains.com} />
                <DomainBadge tld="ng" available={idea.domains.ng} />
                <DomainBadge tld="io" available={idea.domains.io} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
