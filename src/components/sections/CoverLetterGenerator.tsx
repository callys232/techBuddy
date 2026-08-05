"use client";

import { useState } from "react";
import { IconSparkles, IconLoader2, IconAlertCircle, IconDownload, IconRefresh } from "@tabler/icons-react";
import { captureToolLead } from "@/lib/captureToolLead";

type Tone = "professional" | "warm" | "confident" | "concise";

const TONES: { id: Tone; label: string }[] = [
  { id: "professional", label: "Professional" },
  { id: "warm", label: "Warm" },
  { id: "confident", label: "Confident" },
  { id: "concise", label: "Concise" },
];

function Field({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-[var(--ink-muted)] mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[var(--page)] border border-[var(--border)] rounded-lg text-sm text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]/30 transition-colors py-2 px-3"
      />
    </div>
  );
}

export function CoverLetterGenerator() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [strengths, setStrengths] = useState("");
  const [tone, setTone] = useState<Tone>("professional");

  const [letter, setLetter] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    if (!name.trim() || !role.trim() || !strengths.trim()) {
      setError("Fill in your name, the role, and at least one strength or achievement.");
      return;
    }
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/tools/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role, company, strengths, tone }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Could not generate letter");
      setLetter(json.letter);
      captureToolLead({
        tool: "cover-letter-generator",
        source: "email-capture",
        email: email || undefined,
        selections: { role, company, tone },
        result: { generated: true },
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setGenerating(false);
    }
  };

  const download = async () => {
    if (!letter) return;
    setDownloading(true);
    try {
      const res = await fetch("/api/tools/cover-letter-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, letter }),
      });
      if (!res.ok) throw new Error("Could not generate PDF");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${name.replace(/\s+/g, "_") || "cover_letter"}.pdf`;
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
        <div className="grid grid-cols-2 gap-3">
          <Field label="Full name" value={name} onChange={setName} placeholder="Adaeze Okafor" />
          <Field label="Email (optional)" value={email} onChange={setEmail} type="email" />
        </div>
        <Field label="Phone (optional)" value={phone} onChange={setPhone} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Role you're applying for" value={role} onChange={setRole} placeholder="Product Designer" />
          <Field label="Company (optional)" value={company} onChange={setCompany} />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--ink-muted)] mb-1">Key strengths / achievements</label>
          <textarea
            value={strengths}
            onChange={(e) => setStrengths(e.target.value)}
            rows={5}
            placeholder="Led redesign of checkout flow, improving conversion by 18%. 4 years at a fintech startup. Strong in Figma and user research."
            className="w-full bg-[var(--page)] border border-[var(--border)] rounded-lg text-sm text-[var(--ink)] placeholder:text-[var(--ink-faint)] py-2.5 px-3.5 resize-none focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]/30 transition-colors"
          />
        </div>

        <div>
          <p className="text-xs font-medium text-[var(--ink-muted)] mb-2">Tone</p>
          <div className="flex flex-wrap gap-2">
            {TONES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTone(t.id)}
                className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                  tone === t.id ? "border-[var(--brand)] bg-[var(--brand)]/8 text-[var(--brand)]" : "border-[var(--border)] text-[var(--ink-muted)] hover:border-[var(--brand)]/40"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="flex items-center gap-2 text-[var(--bad)] text-sm"><IconAlertCircle size={15} className="shrink-0" /><span>{error}</span></div>}

        <button onClick={generate} disabled={generating} className="btn-primary w-full h-11 text-sm">
          {generating ? <IconLoader2 size={16} className="animate-spin" /> : letter ? <IconRefresh size={16} /> : <IconSparkles size={16} />}
          {generating ? "Writing…" : letter ? "Regenerate" : "Generate cover letter"}
        </button>
      </div>

      {/* ── Result ───────────────────────────────────────────────────────── */}
      <div className="card p-8 lg:sticky lg:top-24 min-h-[300px]">
        {letter ? (
          <>
            <div className="whitespace-pre-wrap text-sm text-[var(--ink)] leading-relaxed font-body mb-6">
              {letter}
            </div>
            <button onClick={download} disabled={downloading} className="btn-secondary w-full h-11 text-sm">
              {downloading ? <IconLoader2 size={16} className="animate-spin" /> : <IconDownload size={16} />}
              {downloading ? "Preparing…" : "Download as PDF"}
            </button>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center py-12">
            <IconSparkles size={28} className="text-[var(--ink-faint)] mb-3" />
            <p className="text-sm text-[var(--ink-faint)] max-w-xs">Your generated cover letter will appear here — fully editable and ready to download.</p>
          </div>
        )}
      </div>
    </div>
  );
}
