"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { IconCheck, IconX, IconAlertCircle, IconLoader2, IconBrandGithub, IconStarFilled } from "@tabler/icons-react";
import { captureToolLead } from "@/lib/captureToolLead";

interface RepoHealthFlag {
  ok: boolean;
  label: string;
}

interface RepoHealthResult {
  name: string;
  fullName: string;
  url: string;
  description: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  license: string | null;
  score: number;
  flags: RepoHealthFlag[];
}

function scoreColor(score: number): string {
  if (score >= 75) return "text-emerald-400";
  if (score >= 50) return "text-sky-400";
  if (score >= 30) return "text-amber-400";
  return "text-rose-400";
}

function ScoreRing({ score }: { score: number }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const strokeClass = scoreColor(score).replace("text-", "stroke-");

  return (
    <svg width="130" height="130" viewBox="0 0 130 130" className="mx-auto">
      <circle cx="65" cy="65" r={r} fill="none" stroke="currentColor" strokeWidth="8" className="text-[var(--border)]" />
      <motion.circle
        cx="65" cy="65" r={r} fill="none" strokeWidth="8" strokeLinecap="round"
        className={strokeClass}
        strokeDasharray={`${dash} ${circ}`}
        transform="rotate(-90 65 65)"
        initial={{ strokeDasharray: `0 ${circ}` }}
        animate={{ strokeDasharray: `${dash} ${circ}` }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
      <text x="65" y="60" textAnchor="middle" fontSize={28} fontWeight={800} className="fill-current">{score}</text>
      <text x="65" y="78" textAnchor="middle" fontSize={11} className="fill-current opacity-40">/ 100</text>
    </svg>
  );
}

export function RepoHealthScan() {
  const [url,     setUrl]     = useState("");
  const [busy,    setBusy]    = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [result,  setResult]  = useState<RepoHealthResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || busy) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/tools/repo-health", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Something went wrong.");
      setResult(json);
      captureToolLead({
        tool: "repo-health-scan", source: "email-capture",
        selections: { url: url.trim() },
        result: { fullName: json.fullName, score: json.score },
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <IconBrandGithub size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink)]/30" />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="github.com/owner/repo"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] pl-11 pr-4 py-3.5 text-sm text-[var(--ink)] placeholder:text-[var(--ink)]/30 focus:outline-none focus:border-[var(--brand)]"
          />
        </div>
        <button type="submit" disabled={busy || !url.trim()} className="btn-primary h-[50px] px-7 text-sm shrink-0">
          {busy ? <IconLoader2 size={16} className="animate-spin" /> : "Scan repo"}
        </button>
      </form>

      {error && (
        <div className="flex items-center gap-2 text-sm text-rose-400 mb-6">
          <IconAlertCircle size={15} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="card p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="font-heading font-bold text-[var(--ink)] text-lg">{result.fullName}</p>
              {result.description && <p className="text-sm text-[var(--ink)]/50 mt-1">{result.description}</p>}
              <div className="flex items-center gap-4 mt-2 text-xs text-[var(--ink)]/40">
                <span className="flex items-center gap-1"><IconStarFilled size={11} className="text-amber-400" />{result.stars.toLocaleString()}</span>
                <span>{result.forks.toLocaleString()} forks</span>
                <span>{result.openIssues.toLocaleString()} open issues</span>
              </div>
            </div>
            <ScoreRing score={result.score} />
          </div>

          <div className="border-t border-[var(--border)] pt-5 space-y-2.5">
            {result.flags.map((f) => (
              <div key={f.label} className="flex items-start gap-2.5 text-sm">
                {f.ok ? (
                  <IconCheck size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <IconX size={15} className="text-rose-400 shrink-0 mt-0.5" />
                )}
                <span className="text-[var(--ink)]/70">{f.label}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-[var(--border)] pt-5 text-center">
            <a href="/quote?service=Tech%20Audit" className="btn-primary h-11 px-8 text-sm inline-flex">
              Get a full manual audit →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
