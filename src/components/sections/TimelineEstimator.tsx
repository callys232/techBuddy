"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { IconCheck, IconClock, IconArrowRight, IconCalendar, IconAlertCircle, IconBrandWhatsapp } from "@tabler/icons-react";
import { captureToolLead } from "@/lib/captureToolLead";
import { validateEmail } from "@/lib/validate";

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2348000000000";
import {
  TIMELINE_PROJECT_TYPES,
  TIMELINE_FEATURES,
  TIMELINE_READINESS,
  TIMELINE_FEEDBACK,
  TIMELINE_INTEGRATIONS,
} from "@/mock/tools";

/* ── Types ──────────────────────────────────────────────────────────────────── */

interface Selections {
  projectType: string;
  features:    string[];
  readiness:   string;
  feedback:    string;
  integration: string;
}

const EMPTY: Selections = {
  projectType: "",
  features:    [],
  readiness:   "",
  feedback:    "",
  integration: "",
};

const STEPS = ["Project type", "Features", "Design readiness", "Feedback speed", "Integrations", "Your email", "Your timeline"];

/* ── Helpers ────────────────────────────────────────────────────────────────── */

function addWeeks(date: Date, weeks: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + Math.round(weeks * 7));
  return d;
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function clamp(v: number, min: number, max: number) { return Math.min(max, Math.max(min, v)); }

/* ── Phase Bar ──────────────────────────────────────────────────────────────── */

const PHASE_COLORS: Record<string, string> = {
  Discovery:   "bg-violet-500/70",
  Design:      "bg-sky-500/70",
  Development: "bg-emerald-500/70",
  "QA & Test": "bg-amber-500/70",
  Launch:      "bg-rose-400/70",
};

function PhaseBar({
  phases,
}: {
  phases: { name: string; min: number; max: number }[];
}) {
  const total = phases.reduce((s, p) => s + p.max, 0);
  return (
    <div className="space-y-3">
      {phases.map((p, i) => {
        const widthPct = (p.max / total) * 100;
        const color    = PHASE_COLORS[p.name] ?? "bg-[var(--primary)]/60";
        return (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex items-center gap-3"
          >
            <span className="w-28 shrink-0 text-xs text-[var(--fg)]/45 text-right">{p.name}</span>
            <div className="flex-1 h-5 bg-[var(--bg)] rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${color}`}
                initial={{ width: 0 }}
                animate={{ width: `${widthPct}%` }}
                transition={{ delay: i * 0.08 + 0.1, duration: 0.5, ease: "easeOut" }}
              />
            </div>
            <span className="w-20 text-xs font-mono text-[var(--fg)]/55">
              {p.min === p.max ? `${p.min}w` : `${p.min}–${p.max}w`}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────────────── */

export function TimelineEstimator() {
  const [step, setStep]       = useState(0);
  const [sel,  setSel]        = useState<Selections>(EMPTY);

  /* Email — required at step 5 before results reveal */
  const [email,        setEmail]        = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [emailError,   setEmailError]   = useState<string | null>(null);
  const [captured,     setCaptured]     = useState(false);
  const [capBusy,      setCapBusy]      = useState(false);

  const set = <K extends keyof Selections>(k: K, v: Selections[K]) =>
    setSel((s) => ({ ...s, [k]: v }));

  const toggleFeature = (id: string) =>
    set("features", sel.features.includes(id)
      ? sel.features.filter((f) => f !== id)
      : [...sel.features, id]);

  /* ── Compute timeline from selections ───────── */
  const result = useMemo(() => {
    const pt = TIMELINE_PROJECT_TYPES.find((t) => t.id === sel.projectType);
    if (!pt) return null;

    /* Feature weeks */
    const featureWeeks = TIMELINE_FEATURES
      .filter((f) => sel.features.includes(f.id))
      .reduce((s, f) => s + f.weeks, 0);

    /* Modifier deltas */
    const readinessDelta = TIMELINE_READINESS.find((r) => r.id === sel.readiness)?.weeksDelta ?? 0;
    const feedbackDelta  = TIMELINE_FEEDBACK.find((f) => f.id === sel.feedback)?.weeksDelta ?? 0;
    const integDelta     = TIMELINE_INTEGRATIONS.find((i) => i.id === sel.integration)?.weeksDelta ?? 0;
    const totalDelta     = readinessDelta + feedbackDelta + integDelta;

    /* Phases with feature weeks distributed proportionally (bulk goes to dev) */
    const devExtra = featureWeeks * 0.8;
    const qaExtra  = featureWeeks * 0.2;

    const phases = [
      { name: "Discovery",   min: pt.phases.discovery[0],           max: pt.phases.discovery[1] },
      { name: "Design",      min: clamp(pt.phases.design[0]   + (readinessDelta < 0 ? readinessDelta : 0), 0, 99),
                             max: clamp(pt.phases.design[1]   + Math.max(0, readinessDelta), 0, 99) },
      { name: "Development", min: pt.phases.dev[0] + devExtra,      max: pt.phases.dev[1] + devExtra },
      { name: "QA & Test",   min: pt.phases.qa[0]  + qaExtra,       max: pt.phases.qa[1]  + qaExtra  },
      { name: "Launch",      min: pt.phases.launch[0],              max: pt.phases.launch[1] },
    ].map((p) => ({ ...p, min: Math.max(0.5, Math.round(p.min * 2) / 2), max: Math.max(0.5, Math.round(p.max * 2) / 2) }));

    /* Adjust dev phase for feedback/integration delta */
    phases[2].min = Math.max(0.5, phases[2].min + Math.max(0, totalDelta) * 0.6);
    phases[2].max = Math.max(0.5, phases[2].max + Math.max(0, totalDelta));

    const totalMin = phases.reduce((s, p) => s + p.min, 0);
    const totalMax = phases.reduce((s, p) => s + p.max, 0);

    const today = new Date();
    const normalLaunch = addWeeks(today, totalMax);
    const fastLaunch   = addWeeks(today, Math.round(totalMin * 0.85));
    const relaxedLaunch = addWeeks(today, totalMax * 1.15);

    return { phases, totalMin: Math.round(totalMin), totalMax: Math.round(totalMax), normalLaunch, fastLaunch, relaxedLaunch };
  }, [sel]);

  /* ── Steps ────────────────────────────────────────────────────── */

  const stepValid = () => {
    if (step === 0) return !!sel.projectType;
    if (step === 2) return !!sel.readiness;
    if (step === 3) return !!sel.feedback;
    if (step === 4) return !!sel.integration;
    if (step === 5) {
      const err = validateEmail(email);
      if (err) { setEmailTouched(true); setEmailError(err); return false; }
      return true;
    }
    return true;
  };

  const isEmailValid = !validateEmail(email);

  const next = () => {
    if (!stepValid()) return;
    /* When advancing past email step, fire the lead capture */
    if (step === 5 && result) {
      captureToolLead({
        tool: "timeline-estimator", source: "email-capture",
        email,
        selections: {
          projectType:  TIMELINE_PROJECT_TYPES.find((t) => t.id === sel.projectType)?.label ?? sel.projectType,
          features:     TIMELINE_FEATURES.filter((f) => sel.features.includes(f.id)).map((f) => f.label),
          readiness:    TIMELINE_READINESS.find((r) => r.id === sel.readiness)?.label ?? sel.readiness,
          feedback:     TIMELINE_FEEDBACK.find((f) => f.id === sel.feedback)?.label ?? sel.feedback,
          integration:  TIMELINE_INTEGRATIONS.find((i) => i.id === sel.integration)?.label ?? sel.integration,
        },
        result: {
          totalMin: result.totalMin, totalMax: result.totalMax,
          normalLaunch: result.normalLaunch.toLocaleDateString("en-GB"),
          phases: result.phases,
        },
      });
      setCaptured(true);
    }
    setStep((s) => Math.min(6, s + 1));
  };
  const back = () => setStep((s) => Math.max(0, s - 1));
  const reset = () => { setSel(EMPTY); setStep(0); };

  return (
    <div className="max-w-3xl mx-auto">

      {/* Progress */}
      <div className="flex items-center gap-2 mb-10 flex-wrap">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => i < step && setStep(i)}
              className={[
                "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all",
                i < step  ? "bg-[var(--primary)] text-[var(--bg)] cursor-pointer" :
                i === step ? "bg-[var(--primary)]/20 text-[var(--primary)] border border-[var(--primary)]" :
                            "bg-[var(--border)] text-[var(--fg)]/30",
              ].join(" ")}
            >
              {i < step ? <IconCheck size={12} /> : i + 1}
            </button>
            <span className={`hidden sm:block text-xs font-medium ${i === step ? "text-[var(--fg)]" : "text-[var(--fg)]/30"}`}>
              {label}
            </span>
            {i < STEPS.length - 1 && <span className="text-[var(--border)] text-xs">›</span>}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >

          {/* ── Step 0: Project type ──────────────────────────────────── */}
          {step === 0 && (
            <div>
              <h2 className="font-display text-2xl font-extrabold text-[var(--fg)] mb-2">What are you building?</h2>
              <p className="text-sm text-[var(--fg)]/45 mb-6">Select the type that best matches your product.</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {TIMELINE_PROJECT_TYPES.map((pt) => (
                  <button
                    key={pt.id}
                    type="button"
                    onClick={() => { set("projectType", pt.id); }}
                    className={[
                      "flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition-all",
                      sel.projectType === pt.id
                        ? "border-[var(--primary)] bg-[var(--primary)]/8 shadow-[0_0_16px_rgba(56,189,248,0.12)]"
                        : "border-[var(--border)] hover:border-[var(--primary)]/40 bg-[var(--surface)]",
                    ].join(" ")}
                  >
                    <span className="font-heading font-semibold text-[var(--fg)] text-sm">{pt.label}</span>
                    <span className="text-xs text-[var(--fg)]/40">{pt.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 1: Features ──────────────────────────────────────── */}
          {step === 1 && (
            <div>
              <h2 className="font-display text-2xl font-extrabold text-[var(--fg)] mb-2">Which features do you need?</h2>
              <p className="text-sm text-[var(--fg)]/45 mb-6">Select all that apply. Each adds to the development phase.</p>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {TIMELINE_FEATURES.map((f) => {
                  const on = sel.features.includes(f.id);
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => toggleFeature(f.id)}
                      className={[
                        "flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all",
                        on
                          ? "border-[var(--primary)] bg-[var(--primary)]/8"
                          : "border-[var(--border)] hover:border-[var(--primary)]/40 bg-[var(--surface)]",
                      ].join(" ")}
                    >
                      <span className={[
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-all",
                        on ? "bg-[var(--primary)] border-[var(--primary)]" : "border-[var(--border)]",
                      ].join(" ")}>
                        {on && <IconCheck size={11} className="text-[var(--bg)]" />}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[var(--fg)] leading-snug">{f.label}</p>
                        <p className="text-xs text-[var(--fg)]/35">+{f.weeks < 1 ? `${f.weeks * 2} days` : `~${f.weeks} week${f.weeks !== 1 ? "s" : ""}`}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="mt-4 text-xs text-[var(--fg)]/30">
                {sel.features.length === 0
                  ? "No features selected — skipping adds to the base timeline only."
                  : `${sel.features.length} feature${sel.features.length > 1 ? "s" : ""} selected`}
              </p>
            </div>
          )}

          {/* ── Step 2: Design readiness ─────────────────────────────── */}
          {step === 2 && (
            <div>
              <h2 className="font-display text-2xl font-extrabold text-[var(--fg)] mb-2">How ready are your designs?</h2>
              <p className="text-sm text-[var(--fg)]/45 mb-6">Design work is one of the biggest timeline variables.</p>
              <div className="space-y-3">
                {TIMELINE_READINESS.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => set("readiness", r.id)}
                    className={[
                      "flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all",
                      sel.readiness === r.id
                        ? "border-[var(--primary)] bg-[var(--primary)]/8"
                        : "border-[var(--border)] hover:border-[var(--primary)]/40 bg-[var(--surface)]",
                    ].join(" ")}
                  >
                    <span className={[
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all",
                      sel.readiness === r.id ? "bg-[var(--primary)] border-[var(--primary)]" : "border-[var(--border)]",
                    ].join(" ")}>
                      {sel.readiness === r.id && <span className="block h-2 w-2 rounded-full bg-[var(--bg)]" />}
                    </span>
                    <div>
                      <div className="flex items-baseline gap-3">
                        <span className="font-heading font-semibold text-[var(--fg)] text-sm">{r.label}</span>
                        <span className={`font-mono text-xs ${r.weeksDelta < 0 ? "text-emerald-400" : r.weeksDelta > 0 ? "text-amber-400" : "text-[var(--fg)]/30"}`}>
                          {r.weeksDelta < 0 ? `saves ${Math.abs(r.weeksDelta)} weeks` : r.weeksDelta > 0 ? `+${r.weeksDelta} weeks` : "no change"}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--fg)]/40 mt-0.5">{r.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 3: Feedback speed ───────────────────────────────── */}
          {step === 3 && (
            <div>
              <h2 className="font-display text-2xl font-extrabold text-[var(--fg)] mb-2">How fast can your team give feedback?</h2>
              <p className="text-sm text-[var(--fg)]/45 mb-6">Slow feedback cycles are the #1 cause of project overruns.</p>
              <div className="space-y-3">
                {TIMELINE_FEEDBACK.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => set("feedback", f.id)}
                    className={[
                      "flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all",
                      sel.feedback === f.id
                        ? "border-[var(--primary)] bg-[var(--primary)]/8"
                        : "border-[var(--border)] hover:border-[var(--primary)]/40 bg-[var(--surface)]",
                    ].join(" ")}
                  >
                    <span className={[
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all",
                      sel.feedback === f.id ? "bg-[var(--primary)] border-[var(--primary)]" : "border-[var(--border)]",
                    ].join(" ")}>
                      {sel.feedback === f.id && <span className="block h-2 w-2 rounded-full bg-[var(--bg)]" />}
                    </span>
                    <div>
                      <div className="flex items-baseline gap-3">
                        <span className="font-heading font-semibold text-[var(--fg)] text-sm">{f.label}</span>
                        <span className={`font-mono text-xs ${f.weeksDelta <= 0 ? "text-emerald-400" : "text-amber-400"}`}>
                          {f.weeksDelta < 0 ? `saves ${Math.abs(f.weeksDelta)} week` : f.weeksDelta > 0 ? `+${f.weeksDelta} weeks` : "baseline"}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--fg)]/40 mt-0.5">{f.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 4: Integrations ─────────────────────────────────── */}
          {step === 4 && (
            <div>
              <h2 className="font-display text-2xl font-extrabold text-[var(--fg)] mb-2">Any complex integrations?</h2>
              <p className="text-sm text-[var(--fg)]/45 mb-6">Third-party APIs with slow onboarding or poor documentation add weeks.</p>
              <div className="space-y-3">
                {TIMELINE_INTEGRATIONS.map((intg) => (
                  <button
                    key={intg.id}
                    type="button"
                    onClick={() => set("integration", intg.id)}
                    className={[
                      "flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all",
                      sel.integration === intg.id
                        ? "border-[var(--primary)] bg-[var(--primary)]/8"
                        : "border-[var(--border)] hover:border-[var(--primary)]/40 bg-[var(--surface)]",
                    ].join(" ")}
                  >
                    <span className={[
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all",
                      sel.integration === intg.id ? "bg-[var(--primary)] border-[var(--primary)]" : "border-[var(--border)]",
                    ].join(" ")}>
                      {sel.integration === intg.id && <span className="block h-2 w-2 rounded-full bg-[var(--bg)]" />}
                    </span>
                    <div>
                      <div className="flex items-baseline gap-3">
                        <span className="font-heading font-semibold text-[var(--fg)] text-sm">{intg.label}</span>
                        <span className={`font-mono text-xs ${intg.weeksDelta === 0 ? "text-emerald-400" : "text-amber-400"}`}>
                          {intg.weeksDelta === 0 ? "no impact" : `+${intg.weeksDelta} weeks`}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--fg)]/40 mt-0.5">{intg.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 5: Email gate ───────────────────────────────────── */}
          {step === 5 && (
            <div className="max-w-md">
              <h2 className="font-display text-2xl font-extrabold text-[var(--fg)] mb-2">
                Almost there — where should we send your timeline?
              </h2>
              <p className="text-sm text-[var(--fg)]/45 mb-8 leading-relaxed">
                We&apos;ll email you a full copy of your estimate, phase breakdown, and possible launch dates. Free, no spam.
              </p>

              <div>
                <label className="block font-heading text-sm font-semibold text-[var(--fg)] mb-1.5">
                  Email address <span className="text-[var(--primary)]">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailTouched) setEmailError(validateEmail(e.target.value));
                  }}
                  onBlur={() => { setEmailTouched(true); setEmailError(validateEmail(email)); }}
                  placeholder="you@company.ng"
                  autoFocus
                  className={[
                    "w-full rounded-xl border px-4 py-3 text-sm text-[var(--fg)] bg-[var(--surface)]",
                    "placeholder:text-[var(--fg)]/30 focus:outline-none focus:ring-1 transition-colors",
                    emailTouched && emailError
                      ? "border-rose-400 focus:border-rose-400 focus:ring-rose-400/20"
                      : isEmailValid && emailTouched
                      ? "border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                      : "border-[var(--border)] focus:border-[var(--primary)] focus:ring-[var(--primary)]/20",
                  ].join(" ")}
                />
                {emailTouched && emailError && (
                  <span className="flex items-center gap-1 text-[11px] text-rose-400 mt-1.5">
                    <IconAlertCircle size={11} className="shrink-0" />{emailError}
                  </span>
                )}
                <p className="text-xs text-[var(--fg)]/30 mt-2">
                  We&apos;ll also add you to our newsletter — unsubscribe anytime.
                </p>
              </div>
            </div>
          )}

          {/* ── Step 6: Results ──────────────────────────────────────── */}
          {step === 6 && result && (
            <div className="space-y-8">
              {/* Headline */}
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--primary)] mb-2">Your estimate</p>
                <h2 className="font-display text-4xl font-extrabold text-[var(--fg)] mb-1">
                  {result.totalMin === result.totalMax
                    ? `${result.totalMin} weeks`
                    : `${result.totalMin}–${result.totalMax} weeks`}
                </h2>
                <p className="text-[var(--fg)]/45 text-sm">
                  {TIMELINE_PROJECT_TYPES.find((t) => t.id === sel.projectType)?.label} ·{" "}
                  {sel.features.length} feature{sel.features.length !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Phase bar */}
              <div>
                <h3 className="font-heading font-semibold text-[var(--fg)] text-sm mb-4">Phase breakdown</h3>
                <PhaseBar phases={result.phases} />
              </div>

              {/* Possible launch dates */}
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { label: "Rushed", icon: "⚡", date: result.fastLaunch,    note: "All parties move fast, designs ready",   color: "border-amber-400/30 bg-amber-500/5" },
                  { label: "Normal", icon: "📅", date: result.normalLaunch,  note: "Standard delivery at our recommended pace", color: "border-[var(--primary)]/40 bg-[var(--primary)]/5" },
                  { label: "Relaxed", icon: "🌿", date: result.relaxedLaunch, note: "Flexible scope, no rush, lower cost",    color: "border-emerald-400/30 bg-emerald-500/5" },
                ].map(({ label, icon, date, note, color }) => (
                  <div key={label} className={`rounded-xl border p-4 ${color}`}>
                    <p className="text-lg mb-1">{icon}</p>
                    <p className="font-heading font-semibold text-[var(--fg)] text-sm">{label}</p>
                    <p className="font-mono text-xs text-[var(--primary)] mt-1">{formatDate(date)}</p>
                    <p className="text-[11px] text-[var(--fg)]/35 mt-1.5 leading-snug">{note}</p>
                  </div>
                ))}
              </div>

              {/* What speeds it up / slows it down */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/5 p-4">
                  <p className="font-heading font-semibold text-emerald-400 text-xs mb-3 uppercase tracking-wide">What speeds it up</p>
                  <ul className="space-y-1.5">
                    {["Figma designs ready on day one", "Responsive within 24 hours on reviews", "All content ready before dev starts", "One clear decision-maker on your side", "Standard integrations only (Paystack etc.)"].map((t) => (
                      <li key={t} className="flex items-start gap-2 text-xs text-[var(--fg)]/60">
                        <IconCheck size={11} className="text-emerald-400 shrink-0 mt-0.5" />{t}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-amber-400/20 bg-amber-500/5 p-4">
                  <p className="font-heading font-semibold text-amber-400 text-xs mb-3 uppercase tracking-wide">What adds weeks</p>
                  <ul className="space-y-1.5">
                    {["Scope changes mid-development", "Slow feedback or committee sign-offs", "Government / CBN API onboarding", "Unclear requirements at discovery", "Third-party delays (app store, banks)"].map((t) => (
                      <li key={t} className="flex items-start gap-2 text-xs text-[var(--fg)]/60">
                        <IconAlertCircle size={11} className="text-amber-400 shrink-0 mt-0.5" />{t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Email confirmation — already collected at step 5 */}
              <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-400">
                <IconCheck size={14} className="shrink-0" />
                <span>A full copy of this timeline is being sent to <strong>{email}</strong></span>
              </div>

              {/* CTA row */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    captureToolLead({
                      tool:    "timeline-estimator",
                      source:  "quote-click",
                      email:   email || undefined,
                      selections: {
                        projectType: TIMELINE_PROJECT_TYPES.find((t) => t.id === sel.projectType)?.label ?? sel.projectType,
                        features:    TIMELINE_FEATURES.filter((f) => sel.features.includes(f.id)).map((f) => f.label),
                        readiness:   TIMELINE_READINESS.find((r) => r.id === sel.readiness)?.label ?? sel.readiness,
                        feedback:    TIMELINE_FEEDBACK.find((f) => f.id === sel.feedback)?.label ?? sel.feedback,
                        integration: TIMELINE_INTEGRATIONS.find((i) => i.id === sel.integration)?.label ?? sel.integration,
                      },
                      result: { totalMin: result.totalMin, totalMax: result.totalMax, normalLaunch: result.normalLaunch.toLocaleDateString("en-GB") },
                    });
                    window.location.href = `/quote?timeline=${result.totalMin}-${result.totalMax}`;
                  }}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-[var(--primary)] px-7 font-heading font-semibold text-sm text-[var(--bg)] hover:opacity-90 transition-opacity"
                >
                  Get a firm quote with this scope <IconArrowRight size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    captureToolLead({
                      tool:    "timeline-estimator",
                      source:  "whatsapp-click",
                      email:   email || undefined,
                      selections: {
                        projectType: TIMELINE_PROJECT_TYPES.find((t) => t.id === sel.projectType)?.label ?? sel.projectType,
                        features:    TIMELINE_FEATURES.filter((f) => sel.features.includes(f.id)).map((f) => f.label),
                      },
                      result: { totalMin: result.totalMin, totalMax: result.totalMax },
                    });
                    const msg = [
                      `Hi TechAgency! I just used the timeline estimator:`,
                      `Project: ${TIMELINE_PROJECT_TYPES.find((t) => t.id === sel.projectType)?.label}`,
                      `Timeline: ${result.totalMin}–${result.totalMax} weeks`,
                      `Launch: ${result.normalLaunch.toLocaleDateString("en-GB")}`,
                      `I'd like to get a proper quote.`,
                    ].join("\n");
                    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, "_blank");
                  }}
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-[var(--border)] px-6 font-heading font-semibold text-sm text-[var(--fg)]/60 hover:border-[#25D366] hover:text-[#25D366] transition-colors"
                >
                  <IconBrandWhatsapp size={14} /> Chat on WhatsApp
                </button>
                <Link
                  href="/tools/cost-estimator"
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-[var(--border)] px-6 font-heading font-semibold text-sm text-[var(--fg)]/60 hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
                >
                  <IconClock size={14} /> See cost estimate
                </Link>
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex h-11 items-center px-5 text-sm text-[var(--fg)]/30 hover:text-[var(--fg)] transition-colors"
                >
                  Start over
                </button>
              </div>

              {/* Disclaimer */}
              <p className="text-[11px] text-[var(--fg)]/25 leading-relaxed">
                These timelines are based on our median delivery data across 35+ shipped products. Actual timelines depend on scope clarity, third-party dependencies, and stakeholder availability. A signed scope from our quote wizard will include contractual milestone dates.
              </p>
            </div>
          )}

        </motion.div>
      </AnimatePresence>

      {/* Nav buttons */}
      {step < 6 && (
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-[var(--border)]">
          <button
            type="button"
            onClick={back}
            disabled={step === 0}
            className="text-sm text-[var(--fg)]/40 hover:text-[var(--fg)] disabled:opacity-0 transition-all"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={next}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-[var(--primary)] px-7 font-heading font-semibold text-sm text-[var(--bg)] hover:opacity-90 transition-all active:scale-95"
          >
            {step === 5 ? (
              <><IconCalendar size={14} /> Show my timeline</>
            ) : step === 4 ? (
              "Next →"
            ) : step === 1 ? (
              sel.features.length === 0 ? "Skip features →" : `Continue with ${sel.features.length} feature${sel.features.length > 1 ? "s" : ""} →`
            ) : "Continue →"}
          </button>
        </div>
      )}
    </div>
  );
}
