"use client";

import { useState } from "react";
import { IconRocket, IconLoader2, IconAlertCircle, IconDownload, IconCheck, IconX, IconCrown } from "@tabler/icons-react";
import { UpgradeModal } from "@/components/ui/UpgradeModal";
import { EmailAuthGate } from "@/components/ui/EmailAuthGate";
import { authFetch } from "@/lib/authFetch";
import { validateUrl } from "@/lib/validate";

interface AuditFinding {
  category: "security" | "seo" | "performance" | "best-practices";
  label: string;
  passed: boolean;
  detail: string;
}

interface AuditReport {
  url: string;
  score: number;
  grade: string;
  latencyMs: number;
  findings: AuditFinding[];
}

const CATEGORIES: { key: AuditFinding["category"]; label: string }[] = [
  { key: "security", label: "Security" },
  { key: "seo", label: "SEO" },
  { key: "performance", label: "Performance" },
  { key: "best-practices", label: "Best Practices" },
];

const GRADE_COLOR: Record<string, string> = {
  A: "text-[var(--good)]",
  B: "text-sky-500",
  C: "text-[var(--warn)]",
  D: "text-orange-500",
  F: "text-[var(--bad)]",
};

export function PremiumAudit() {
  return <EmailAuthGate>{(email) => <PremiumAuditInner email={email} />}</EmailAuthGate>;
}

function PremiumAuditInner({ email }: { email: string }) {
  const [url, setUrl] = useState("");
  const [report, setReport] = useState<AuditReport | null>(null);
  const [running, setRunning] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const run = async () => {
    const urlError = validateUrl(url);
    if (urlError) { setError(urlError); return; }

    setRunning(true);
    setError(null);
    setReport(null);
    try {
      const res = await authFetch("/api/tools/premium-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const json = await res.json();
      if (res.status === 403) { setShowUpgrade(true); return; }
      if (!res.ok) throw new Error(json.error ?? "Could not run the audit");
      setReport(json.report);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setRunning(false);
    }
  };

  const download = async () => {
    if (!report) return;
    setDownloading(true);
    try {
      const res = await authFetch("/api/tools/premium-audit-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ report }),
      });
      if (res.status === 403) { setShowUpgrade(true); return; }
      if (!res.ok) throw new Error("Could not generate PDF");
      const blob = await res.blob();
      const dlUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = dlUrl;
      a.download = "premium_audit_report.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(dlUrl);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="card p-6 mb-8">
        <div className="grid sm:grid-cols-[1fr_auto] gap-3 items-end">
          <div>
            <label className="block text-xs font-medium text-[var(--ink-muted)] mb-1">Website URL <span className="text-[var(--ink-faint)] font-normal">— auditing as {email}</span></label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://yoursite.com"
              className="w-full bg-[var(--page)] border border-[var(--border)] rounded-lg text-sm text-[var(--ink)] placeholder:text-[var(--ink-faint)] py-2.5 px-3.5 focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]/30 transition-colors"
            />
          </div>
          <button onClick={run} disabled={running} className="btn-primary h-11 px-6 text-sm whitespace-nowrap">
            {running ? <IconLoader2 size={16} className="animate-spin" /> : <IconRocket size={16} />}
            {running ? "Auditing…" : "Run audit"}
          </button>
        </div>
        {error && <div className="flex items-center gap-2 text-[var(--bad)] text-sm mt-3"><IconAlertCircle size={15} className="shrink-0" /><span>{error}</span></div>}
        <p className="text-center text-[11px] text-[var(--ink-faint)] mt-4 flex items-center justify-center gap-1"><IconCrown size={12} className="text-amber-400" />TechBuddy Premium feature — instant automated report, on top of the free 48-hour manual review</p>
      </div>

      {report && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-[var(--border)]">
            <div>
              <p className="text-xs text-[var(--ink-faint)] mb-1">{report.url}</p>
              <p className="text-sm text-[var(--ink-muted)]">{report.findings.filter((f) => f.passed).length} of {report.findings.length} checks passed · {report.latencyMs}ms response time</p>
            </div>
            <div className="text-center">
              <p className={`font-display text-4xl font-extrabold ${GRADE_COLOR[report.grade]}`}>{report.grade}</p>
              <p className="text-xs text-[var(--ink-faint)]">{report.score}/100</p>
            </div>
          </div>

          <div className="space-y-6">
            {CATEGORIES.map((cat) => {
              const items = report.findings.filter((f) => f.category === cat.key);
              if (items.length === 0) return null;
              return (
                <div key={cat.key}>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--ink-faint)] mb-2">{cat.label}</p>
                  <div className="space-y-1">
                    {items.map((f, i) => (
                      <div key={i} className="flex items-start gap-2.5 py-1.5">
                        {f.passed ? <IconCheck size={14} className="text-[var(--good)] mt-0.5 shrink-0" /> : <IconX size={14} className="text-[var(--bad)] mt-0.5 shrink-0" />}
                        <div>
                          <p className="text-sm font-medium text-[var(--ink)]">{f.label}</p>
                          <p className="text-xs text-[var(--ink-muted)]">{f.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <button onClick={download} disabled={downloading} className="btn-secondary w-full h-11 text-sm mt-6">
            {downloading ? <IconLoader2 size={16} className="animate-spin" /> : <IconDownload size={16} />}
            {downloading ? "Preparing…" : "Download full PDF report"}
          </button>
        </div>
      )}

      {showUpgrade && (
        <UpgradeModal
          email={email}
          onClose={() => setShowUpgrade(false)}
          feature={{
            title: "Premium Audit Report",
            description: "An instant, automated deep-dive on top of the free 48-hour manual review.",
            benefits: ["Security headers, SEO signals & performance — checked live", "Branded PDF report you can share with your team", "Unlocks every other premium tool too"],
          }}
        />
      )}
    </div>
  );
}
