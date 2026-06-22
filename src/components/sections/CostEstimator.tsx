"use client";

import { useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { IconCheck, IconBrandWhatsapp, IconAlertCircle } from "@tabler/icons-react";
import { PROJECT_TYPES, FEATURE_ADDONS, TIMELINE_MULTIPLIERS } from "@/mock/tools";
import { captureToolLead } from "@/lib/captureToolLead";
import { validateEmail } from "@/lib/validate";

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2348000000000";

function fmt(n: number) {
  return "₦" + Math.round(n).toLocaleString("en-NG");
}

/* ── Reusable inline error ──────────────────────────────────────────────────── */
function FieldError({ msg }: { msg: string | null }) {
  if (!msg) return null;
  return (
    <span className="flex items-center gap-1 text-[11px] text-rose-400 mt-1">
      <IconAlertCircle size={11} className="shrink-0" />{msg}
    </span>
  );
}

export function CostEstimator() {
  const router     = useRouter();
  const emailRef   = useRef<HTMLInputElement>(null);
  const emailId    = useId();

  const [projectType, setProjectType] = useState(PROJECT_TYPES[0].id);
  const [features,    setFeatures]    = useState<string[]>([]);
  const [timeline,    setTimeline]    = useState(TIMELINE_MULTIPLIERS[1].id);
  const [email,       setEmail]       = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [emailError,  setEmailError]  = useState<string | null>(null);
  const [captured,    setCaptured]    = useState(false);
  const [capBusy,     setCapBusy]     = useState(false);

  /* ── Computed estimate ──────────────────────────────────────────────────── */
  const base         = PROJECT_TYPES.find((p) => p.id === projectType)?.base ?? 0;
  const featureTotal = FEATURE_ADDONS.filter((f) => features.includes(f.id)).reduce((s, f) => s + f.cost, 0);
  const mult         = TIMELINE_MULTIPLIERS.find((t) => t.id === timeline)?.mult ?? 1;
  const raw          = (base + featureTotal) * mult;
  const low          = raw * 0.85;
  const high         = raw * 1.2;

  const selectionsSummary = () => ({
    projectType:  PROJECT_TYPES.find((p) => p.id === projectType)?.label ?? projectType,
    features:     FEATURE_ADDONS.filter((f) => features.includes(f.id)).map((f) => f.label),
    timeline:     TIMELINE_MULTIPLIERS.find((t) => t.id === timeline)?.label ?? timeline,
  });
  const resultSummary = () => ({ low: Math.round(low), high: Math.round(high), mid: Math.round(raw) });

  const toggleFeature = (id: string) =>
    setFeatures((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));

  /* ── Validate + guard CTAs ──────────────────────────────────────────────── */
  const checkEmail = (): boolean => {
    const err = validateEmail(email);
    setEmailError(err);
    setEmailTouched(true);
    if (err) {
      emailRef.current?.focus();
      emailRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return !err;
  };

  /* ── Email submit (send copy) ───────────────────────────────────────────── */
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkEmail() || capBusy) return;
    setCapBusy(true);
    captureToolLead({
      tool: "cost-estimator", source: "email-capture",
      email, selections: selectionsSummary(), result: resultSummary(),
    });
    await new Promise((r) => setTimeout(r, 500));
    setCaptured(true);
    setCapBusy(false);
  };

  /* ── CTA handlers ───────────────────────────────────────────────────────── */
  const handleQuote = () => {
    if (!checkEmail()) return;
    captureToolLead({
      tool: "cost-estimator", source: "quote-click",
      email, selections: selectionsSummary(), result: resultSummary(),
    });
    const p = new URLSearchParams({ service: projectType, features: features.join(","), budget: String(Math.round(raw)) });
    router.push(`/quote?${p}`);
  };

  const handleWhatsApp = () => {
    if (!checkEmail()) return;
    captureToolLead({
      tool: "cost-estimator", source: "whatsapp-click",
      email, selections: selectionsSummary(), result: resultSummary(),
    });
    const msg = [
      `Hi TechAgency! Cost Estimator result:`,
      `Project: ${PROJECT_TYPES.find((p) => p.id === projectType)?.label}`,
      features.length ? `Features: ${FEATURE_ADDONS.filter((f) => features.includes(f.id)).map((f) => f.label).join(", ")}` : null,
      `Timeline: ${TIMELINE_MULTIPLIERS.find((t) => t.id === timeline)?.label}`,
      `Estimate: ${fmt(low)} – ${fmt(high)}`,
      `I'd like to get an exact quote.`,
    ].filter(Boolean).join("\n");
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const isEmailValid = !validateEmail(email);

  return (
    <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">

      {/* ── Left: inputs ─────────────────────────────────────────────────── */}
      <div className="space-y-8">

        {/* Project type */}
        <div>
          <p className="font-heading font-semibold text-[var(--fg)] mb-3">What are you building?</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {PROJECT_TYPES.map((p) => (
              <button key={p.id} type="button" onClick={() => setProjectType(p.id)}
                className={[
                  "rounded-xl border px-4 py-3 text-sm font-medium text-left transition-all active:scale-[0.97]",
                  projectType === p.id
                    ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                    : "border-[var(--border)] text-[var(--fg)]/60 hover:border-[var(--primary)]/50 hover:text-[var(--fg)]",
                ].join(" ")}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Feature addons */}
        <div>
          <p className="font-heading font-semibold text-[var(--fg)] mb-1">Features you need</p>
          <p className="text-xs text-[var(--fg)]/40 mb-3">Select all that apply</p>
          <div className="flex flex-wrap gap-2">
            {FEATURE_ADDONS.map((f) => (
              <button key={f.id} type="button" onClick={() => toggleFeature(f.id)}
                className={[
                  "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all active:scale-95",
                  features.includes(f.id)
                    ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                    : "border-[var(--border)] text-[var(--fg)]/55 hover:border-[var(--primary)]/40",
                ].join(" ")}>
                {f.label}
                <span className="ml-1.5 opacity-50 text-[10px]">+{(f.cost / 1000).toFixed(0)}k</span>
              </button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div>
          <p className="font-heading font-semibold text-[var(--fg)] mb-3">Timeline</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {TIMELINE_MULTIPLIERS.map((t) => (
              <button key={t.id} type="button" onClick={() => setTimeline(t.id)}
                className={[
                  "rounded-xl border px-3 py-3 text-xs font-medium text-left transition-all",
                  timeline === t.id
                    ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                    : "border-[var(--border)] text-[var(--fg)]/55 hover:border-[var(--primary)]/40",
                ].join(" ")}>
                {t.label}
                {t.id === "asap"    && <span className="block text-[10px] mt-1 opacity-60">+40% urgency fee</span>}
                {t.id === "relaxed" && <span className="block text-[10px] mt-1 opacity-60">12% discount</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: result card ──────────────────────────────────────────────── */}
      <div className="glass rounded-[var(--radius-card)] p-6 border border-[var(--border)] sticky top-24 space-y-5">

        {/* Estimate */}
        <div>
          <p className="font-mono text-[var(--primary)] text-[10px] uppercase tracking-[0.25em] mb-4">
            Estimated range
          </p>
          <p className="font-display text-3xl font-extrabold text-[var(--fg)] leading-none mb-1">{fmt(low)}</p>
          <p className="font-display text-lg text-[var(--fg)]/40">– {fmt(high)}</p>
        </div>

        {/* Breakdown */}
        <div className="space-y-2 text-xs text-[var(--fg)]/50">
          <div className="flex justify-between">
            <span>Base ({PROJECT_TYPES.find((p) => p.id === projectType)?.label})</span>
            <span>{fmt(base)}</span>
          </div>
          {features.length > 0 && (
            <div className="flex justify-between">
              <span>Features ({features.length})</span>
              <span>+{fmt(featureTotal)}</span>
            </div>
          )}
          {timeline !== "short" && (
            <div className="flex justify-between">
              <span>Timeline adjustment</span>
              <span>{mult > 1 ? "+" : ""}{Math.round((mult - 1) * 100)}%</span>
            </div>
          )}
          <div className="border-t border-[var(--border)] pt-2 flex justify-between font-semibold text-[var(--fg)]/70">
            <span>Midpoint</span>
            <span>{fmt(raw)}</span>
          </div>
        </div>

        {/* ── Email (required) ──────────────────────────────────────────── */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4">
          {captured ? (
            <div className="flex items-center gap-2 text-sm text-emerald-400">
              <IconCheck size={15} />
              <span>Sent to {email} — check your inbox.</span>
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit} noValidate>
              <label htmlFor={emailId}
                className="block text-xs font-semibold text-[var(--fg)]/70 mb-2">
                Your email <span className="text-[var(--primary)]">*</span>
                <span className="font-normal text-[var(--fg)]/35 ml-1">— required to get your quote</span>
              </label>
              <div className="flex gap-2">
                <div className="flex-1 min-w-0">
                  <input
                    id={emailId}
                    ref={emailRef}
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailTouched) setEmailError(validateEmail(e.target.value));
                    }}
                    onBlur={() => { setEmailTouched(true); setEmailError(validateEmail(email)); }}
                    placeholder="you@company.ng"
                    className={[
                      "w-full rounded-lg border bg-[var(--surface)] px-3 py-2 text-xs text-[var(--fg)]",
                      "placeholder:text-[var(--fg)]/30 focus:outline-none focus:ring-1 transition-colors",
                      emailTouched && emailError
                        ? "border-rose-400 focus:border-rose-400 focus:ring-rose-400/20"
                        : isEmailValid && emailTouched
                        ? "border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                        : "border-[var(--border)] focus:border-[var(--primary)] focus:ring-[var(--primary)]/20",
                    ].join(" ")}
                  />
                  <FieldError msg={emailTouched ? emailError : null} />
                </div>
                <button type="submit" disabled={capBusy}
                  className="rounded-lg bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-[var(--bg)] hover:opacity-90 disabled:opacity-40 transition-opacity shrink-0 self-start">
                  {capBusy ? "…" : "Send"}
                </button>
              </div>
              <p className="text-[10px] text-[var(--fg)]/25 mt-2">
                We&apos;ll email you a copy of this estimate and add you to our newsletter.
              </p>
            </form>
          )}
        </div>

        <p className="text-[10px] text-[var(--fg)]/30 leading-relaxed">
          Ballpark estimate based on average project complexity. Your actual quote may vary.
        </p>

        {/* CTAs — require valid email */}
        <div className="space-y-2">
          <button type="button" onClick={handleQuote}
            className="flex h-11 items-center justify-center gap-2 rounded-full bg-[var(--primary)] text-sm font-semibold text-[var(--bg)] hover:opacity-90 hover:shadow-[var(--shadow-glow-sky)] transition-all active:scale-95 w-full">
            Get exact quote →
          </button>
          <button type="button" onClick={handleWhatsApp}
            className="flex h-10 items-center justify-center gap-2 rounded-full border border-[var(--border)] text-xs font-semibold text-[var(--fg)]/60 hover:border-[#25D366] hover:text-[#25D366] transition-all w-full">
            <IconBrandWhatsapp size={14} />
            Send this to WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
