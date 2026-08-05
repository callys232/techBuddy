"use client";

import { useState } from "react";
import { IconSparkles, IconLoader2, IconAlertCircle, IconDownload, IconCrown } from "@tabler/icons-react";
import { UpgradeModal } from "@/components/ui/UpgradeModal";

interface BusinessPlan {
  executiveSummary: string;
  problem: string;
  solution: string;
  marketAnalysis: string;
  businessModel: string;
  goToMarket: string;
  financialSummary: string;
  team: string;
  ask: string;
}

const SECTIONS: { key: keyof BusinessPlan; title: string }[] = [
  { key: "executiveSummary", title: "Executive Summary" },
  { key: "problem", title: "The Problem" },
  { key: "solution", title: "The Solution" },
  { key: "marketAnalysis", title: "Market Analysis" },
  { key: "businessModel", title: "Business Model" },
  { key: "goToMarket", title: "Go-to-Market Strategy" },
  { key: "financialSummary", title: "Financial Summary" },
  { key: "team", title: "Team" },
  { key: "ask", title: "The Ask" },
];

function Field({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-[var(--ink-muted)] mb-1">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[var(--page)] border border-[var(--border)] rounded-lg text-sm text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]/30 transition-colors py-2 px-3"
      />
    </div>
  );
}

export function BusinessPlanGenerator() {
  const [email, setEmail] = useState("");
  const [idea, setIdea] = useState("");
  const [industry, setIndustry] = useState("");
  const [targetMarket, setTargetMarket] = useState("");
  const [stage, setStage] = useState("");
  const [fundingAsk, setFundingAsk] = useState("");
  const [team, setTeam] = useState("");

  const [plan, setPlan] = useState<BusinessPlan | null>(null);
  const [generating, setGenerating] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const generate = async () => {
    if (!email.trim() || !idea.trim()) {
      setError("Enter your email and describe your business idea.");
      return;
    }
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/tools/business-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, input: { idea, industry, targetMarket, stage, fundingAsk, team } }),
      });
      const json = await res.json();
      if (res.status === 403) { setShowUpgrade(true); return; }
      if (!res.ok) throw new Error(json.error ?? "Could not generate business plan");
      setPlan(json.plan);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setGenerating(false);
    }
  };

  const download = async () => {
    if (!plan) return;
    setDownloading(true);
    try {
      const res = await fetch("/api/tools/business-plan-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, idea, plan }),
      });
      if (res.status === 403) { setShowUpgrade(true); return; }
      if (!res.ok) throw new Error("Could not generate PDF");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "business_plan.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-[1fr_1.1fr] gap-6 items-start">
      {/* ── Form ─────────────────────────────────────────────────────────── */}
      <div className="card p-6 space-y-4">
        <Field label="Your email" value={email} onChange={setEmail} placeholder="you@example.com" />
        <div>
          <label className="block text-xs font-medium text-[var(--ink-muted)] mb-1">Business idea</label>
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            rows={3}
            placeholder="A subscription box connecting small Nigerian farms directly to urban households"
            className="w-full bg-[var(--page)] border border-[var(--border)] rounded-lg text-sm text-[var(--ink)] placeholder:text-[var(--ink-faint)] py-2.5 px-3.5 resize-none focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]/30 transition-colors"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Industry" value={industry} onChange={setIndustry} placeholder="Agritech" />
          <Field label="Target market" value={targetMarket} onChange={setTargetMarket} placeholder="Urban Nigerian households" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Stage" value={stage} onChange={setStage} placeholder="Pre-seed / idea" />
          <Field label="Funding ask" value={fundingAsk} onChange={setFundingAsk} placeholder="$50,000 seed round" />
        </div>
        <Field label="Team (optional)" value={team} onChange={setTeam} placeholder="2 co-founders, ex-Flutterwave engineers" />

        {error && <div className="flex items-center gap-2 text-[var(--bad)] text-sm"><IconAlertCircle size={15} className="shrink-0" /><span>{error}</span></div>}

        <button onClick={generate} disabled={generating} className="btn-primary w-full h-11 text-sm">
          {generating ? <IconLoader2 size={16} className="animate-spin" /> : <IconSparkles size={16} />}
          {generating ? "Writing your plan…" : "Generate business plan"}
        </button>
        <p className="text-center text-[11px] text-[var(--ink-faint)] flex items-center justify-center gap-1"><IconCrown size={12} className="text-amber-400" />TechBuddy Premium feature</p>
      </div>

      {/* ── Result ───────────────────────────────────────────────────────── */}
      <div className="card p-8 lg:sticky lg:top-24 min-h-[300px]">
        {plan ? (
          <>
            <div className="space-y-5 mb-6">
              {SECTIONS.map(({ key, title }) => plan[key] && (
                <div key={key}>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--brand)] mb-1.5">{title}</p>
                  <p className="text-sm text-[var(--ink)] leading-relaxed">{plan[key]}</p>
                </div>
              ))}
            </div>
            <button onClick={download} disabled={downloading} className="btn-secondary w-full h-11 text-sm">
              {downloading ? <IconLoader2 size={16} className="animate-spin" /> : <IconDownload size={16} />}
              {downloading ? "Preparing…" : "Download as PDF"}
            </button>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center py-12">
            <IconSparkles size={28} className="text-[var(--ink-faint)] mb-3" />
            <p className="text-sm text-[var(--ink-faint)] max-w-xs">Your structured business plan — executive summary, market analysis, business model and more — will appear here.</p>
          </div>
        )}
      </div>

      {showUpgrade && (
        <UpgradeModal
          email={email}
          onClose={() => setShowUpgrade(false)}
          feature={{
            title: "AI Business Plan Generator",
            description: "Turn your idea into a structured, investor-ready business plan — powered by AI.",
            benefits: ["Executive summary, market analysis, business model & more", "Branded PDF export ready to share with investors", "Unlocks every other premium tool too"],
          }}
        />
      )}
    </div>
  );
}
