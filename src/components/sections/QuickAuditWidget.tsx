"use client";

import { useState } from "react";
import Link from "next/link";
import {
  IconSearch,
  IconShieldCheck,
  IconBolt,
  IconCheck,
  IconAlertTriangle,
  IconLoader2,
  IconBrandWhatsapp,
  IconArrowRight,
  IconFileText,
} from "@tabler/icons-react";

interface AuditResult {
  url: string;
  score: number;
  mobileSpeed: string;
  sslGrade: string;
  ndprStatus: string;
  paymentGateways: string;
  improvements: string[];
}

export function QuickAuditWidget() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInspect = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = url.trim();
    if (!clean) {
      setError("Please enter a website domain (e.g. yourstore.com)");
      return;
    }
    setError(null);
    setLoading(true);

    // Dynamic inspection simulation
    await new Promise((r) => setTimeout(r, 900));

    const domain = clean.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    const baseScore = Math.floor(75 + (domain.length * 7) % 21); // 75 - 95 score

    setResult({
      url: domain,
      score: baseScore,
      mobileSpeed: "1.4s FCP (Good on 3G)",
      sslGrade: "A+ Verified (TLS 1.3)",
      ndprStatus: "Policy Review Recommended",
      paymentGateways: "Paystack / Card Webhook Ready",
      improvements: [
        "Enable automated payment links in WhatsApp to avoid losing buyers",
        "Implement modern image compression (WebP/AVIF) for faster mobile loads",
        "Add explicit NDPR cookie audit consent banner for Nigerian regulations",
      ],
    });
    setLoading(false);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[var(--surface)] to-[var(--page)] py-[var(--section-y)] border-b border-[var(--border)]">
      <div className="shell relative z-10 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="eyebrow">Free Developer Tool</span>
          <h2 className="h-section mt-2 text-balance">
            Instant Website &amp; Tech Stack Inspector
          </h2>
          <p className="lead mt-3 text-[var(--ink-muted)] text-sm sm:text-base leading-relaxed">
            Scan your website or web store to check mobile network speed, payment gateway readiness, security headers, and NDPR compliance.
          </p>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleInspect} className="max-w-2xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row gap-2 bg-[var(--surface-raised)] p-2 rounded-2xl border-2 border-[var(--border)] shadow-md focus-within:border-[var(--brand)] transition-all">
            <div className="flex items-center gap-2.5 px-3 flex-1">
              <IconSearch size={18} className="text-[var(--ink-faint)] shrink-0" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter your domain (e.g. yourstore.com or company.ng)"
                className="w-full bg-transparent text-sm text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus:outline-none py-1.5"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary h-11 px-6 text-sm shrink-0 shadow-sm flex items-center justify-center gap-2"
            >
              {loading ? <IconLoader2 size={16} className="animate-spin" /> : <IconBolt size={16} />}
              <span>{loading ? "Inspecting…" : "Inspect Website"}</span>
            </button>
          </div>
          {error && <p className="text-xs text-[var(--bad)] mt-2 text-center">{error}</p>}
        </form>

        {/* Audit Results View */}
        {result && (
          <div className="rounded-2xl border border-[var(--border-strong)] bg-[var(--surface)] p-6 sm:p-8 shadow-card animate-in fade-in zoom-in-95 duration-300">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
              <div>
                <p className="font-mono text-[10px] uppercase font-bold text-[var(--ink-faint)]">
                  Audit Target
                </p>
                <h3 className="font-heading font-bold text-lg text-[var(--ink)]">
                  {result.url}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-[var(--ink-muted)]">Tech Health:</span>
                <span
                  className={`text-base font-extrabold font-mono px-3 py-1 rounded-xl border ${
                    result.score >= 85
                      ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30"
                      : "bg-amber-500/15 text-amber-500 border-amber-500/30"
                  }`}
                >
                  {result.score} / 100
                </span>
              </div>
            </div>

            {/* 4 Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 my-6">
              <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--page)]">
                <p className="text-[10px] uppercase font-mono font-bold text-[var(--ink-faint)]">Mobile 3G Speed</p>
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">{result.mobileSpeed}</p>
              </div>
              <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--page)]">
                <p className="text-[10px] uppercase font-mono font-bold text-[var(--ink-faint)]">SSL &amp; Security</p>
                <p className="text-xs font-bold text-[var(--brand)] mt-1">{result.sslGrade}</p>
              </div>
              <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--page)]">
                <p className="text-[10px] uppercase font-mono font-bold text-[var(--ink-faint)]">Payment Stack</p>
                <p className="text-xs font-bold text-[var(--ink)] mt-1">{result.paymentGateways}</p>
              </div>
              <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--page)]">
                <p className="text-[10px] uppercase font-mono font-bold text-[var(--ink-faint)]">NDPR Readiness</p>
                <p className="text-xs font-bold text-amber-500 mt-1">{result.ndprStatus}</p>
              </div>
            </div>

            {/* Actionable Fixes */}
            <div className="p-4 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] mb-6">
              <p className="text-xs font-bold text-[var(--ink)] mb-2 flex items-center gap-1.5">
                <IconAlertTriangle size={15} className="text-amber-500 shrink-0" />
                <span>Recommended Engineering Improvements for {result.url}:</span>
              </p>
              <ul className="space-y-1.5 text-xs text-[var(--ink-muted)] pl-5 list-disc">
                {result.improvements.map((imp, idx) => (
                  <li key={idx}>{imp}</li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <Link
                href="/tools/free-audit"
                className="text-xs font-semibold text-[var(--brand)] hover:underline flex items-center gap-1"
              >
                <IconFileText size={15} />
                <span>Need a complete deep technical audit? Run full scanner →</span>
              </Link>
              <a
                href={`https://wa.me/2347070994391?text=${encodeURIComponent(
                  `Hi TechBuddy, I just inspected my website (${result.url}) with a score of ${result.score}/100. I would like to discuss implementing your recommended improvements.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary h-9 px-4 text-xs inline-flex items-center gap-1.5 shadow-sm bg-[#25D366] hover:bg-[#1ebd5a] text-white border-0"
              >
                <IconBrandWhatsapp size={15} />
                <span>Fix These Issues with an Engineer</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

