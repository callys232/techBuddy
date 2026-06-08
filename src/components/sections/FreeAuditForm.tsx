"use client";

import { useState } from "react";

const AUDIT_TYPES = [
  { id: "performance", label: "Performance",      hint: "Speed, Core Web Vitals, bundle size" },
  { id: "security",    label: "Security",         hint: "Headers, vulnerabilities, HTTPS" },
  { id: "seo",         label: "SEO",              hint: "Meta tags, sitemap, indexability" },
  { id: "code",        label: "Code quality",     hint: "Architecture, tech debt, patterns" },
  { id: "ux",          label: "UX & Accessibility", hint: "Usability, WCAG, mobile experience" },
];

type Status = "idle" | "loading" | "success" | "error";

export function FreeAuditForm() {
  const [name,       setName]       = useState("");
  const [email,      setEmail]      = useState("");
  const [url,        setUrl]        = useState("");
  const [types,      setTypes]      = useState<string[]>(["performance", "security"]);
  const [status,     setStatus]     = useState<Status>("idle");
  const [errorMsg,   setErrorMsg]   = useState("");

  const toggle = (id: string) =>
    setTypes((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (types.length === 0) { setErrorMsg("Select at least one audit type."); return; }
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/audit-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, url, auditTypes: types }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again or WhatsApp us.");
    }
  };

  if (status === "success") {
    return (
      <div className="glass rounded-[var(--radius-card)] border border-[var(--primary)]/30 p-10 text-center max-w-md mx-auto">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 mb-5">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
            <circle cx="14" cy="14" r="13" stroke="#38BDF8" strokeWidth="1.5" />
            <path d="M8 14.5l4 4 8-9" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="font-display text-2xl font-extrabold text-[var(--fg)] mb-2">Audit Request Received!</h2>
        <p className="text-[var(--fg)]/50 text-sm leading-relaxed mb-6">
          We&apos;ll manually audit <span className="text-[var(--primary)] font-mono break-all">{url}</span> and send your report within 48 hours.
        </p>
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2348000000000"}?text=${encodeURIComponent("Hi! I just submitted a free audit request.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center gap-2 rounded-full bg-emerald-500 px-6 text-sm font-semibold text-white hover:bg-emerald-600 transition-colors"
        >
          Chat on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[var(--fg)]/60" htmlFor="audit-name">
            Your name
          </label>
          <input
            id="audit-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Chidi Okafor"
            className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm text-[var(--fg)] placeholder:text-[var(--fg)]/25 focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]/30 transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[var(--fg)]/60" htmlFor="audit-email">
            Email address
          </label>
          <input
            id="audit-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="chidi@company.ng"
            className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm text-[var(--fg)] placeholder:text-[var(--fg)]/25 focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]/30 transition-colors"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-[var(--fg)]/60" htmlFor="audit-url">
          Website or app URL
        </label>
        <input
          id="audit-url"
          type="url"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://yourapp.com"
          className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm text-[var(--fg)] placeholder:text-[var(--fg)]/25 focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]/30 transition-colors font-mono"
        />
      </div>

      <div>
        <p className="text-xs font-semibold text-[var(--fg)]/60 mb-3">What should we audit?</p>
        <div className="flex flex-col gap-2">
          {AUDIT_TYPES.map((t) => (
            <label
              key={t.id}
              className={[
                "flex items-center gap-4 rounded-xl border px-4 py-3 cursor-pointer transition-all",
                types.includes(t.id)
                  ? "border-[var(--primary)]/60 bg-[var(--primary)]/5"
                  : "border-[var(--border)] hover:border-[var(--primary)]/30",
              ].join(" ")}
            >
              <input
                type="checkbox"
                checked={types.includes(t.id)}
                onChange={() => toggle(t.id)}
                className="accent-[var(--primary)] h-4 w-4 shrink-0"
              />
              <span className="flex-1">
                <span className="block text-sm font-medium text-[var(--fg)]">{t.label}</span>
                <span className="block text-xs text-[var(--fg)]/40">{t.hint}</span>
              </span>
              {types.includes(t.id) && (
                <span className="text-[var(--primary)] text-xs font-mono">✓</span>
              )}
            </label>
          ))}
        </div>
      </div>

      {errorMsg && (
        <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full h-12 rounded-full bg-[var(--primary)] font-semibold text-[var(--bg)] hover:opacity-90 hover:shadow-[var(--shadow-glow-sky)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "Submitting…" : "Request free audit →"}
      </button>

      <p className="text-center text-xs text-[var(--fg)]/25">
        No sign-up required. We&apos;ll email your report within 48 hours.
      </p>
    </form>
  );
}
