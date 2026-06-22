"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { IconCheck, IconClock, IconArrowRight, IconCalendar, IconAlertCircle, IconBrandWhatsapp } from "@tabler/icons-react";
import { captureToolLead } from "@/lib/captureToolLead";
import { validateEmail } from "@/lib/validate";
import { CategoryPicker, type Category } from "@/components/ui/CategoryPicker";

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
  projectTypes: string[]; /* multi-select */
  features:     string[];
  readiness:    string;
  feedback:     string;
  integrations: string[];
}

const EMPTY: Selections = {
  projectTypes: [],
  features:     [],
  readiness:    "",
  feedback:     "",
  integrations: [],
};

/* ── Recap chips — shows previous answers above the current step ────────── */

function RecapChips({ step, sel }: { step: number; sel: Selections }) {
  if (step === 0) return null;
  const chips: { label: string; value: string }[] = [];
  if (step > 0 && sel.projectTypes.length)
    chips.push({ label: "Building", value: sel.projectTypes.map((id) => TIMELINE_PROJECT_TYPES.find((t) => t.id === id)?.label ?? id).join(", ") });
  if (step > 1 && sel.features.length)
    chips.push({ label: "Features", value: `${sel.features.length} selected` });
  if (step > 2 && sel.readiness)
    chips.push({ label: "Design", value: TIMELINE_READINESS.find((r) => r.id === sel.readiness)?.label ?? sel.readiness });
  if (step > 3 && sel.feedback)
    chips.push({ label: "Feedback", value: TIMELINE_FEEDBACK.find((f) => f.id === sel.feedback)?.label ?? sel.feedback });
  if (step > 4 && sel.integrations.length)
    chips.push({ label: "Integrations", value: `${sel.integrations.length} selected` });
  if (!chips.length) return null;
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {chips.map(({ label, value }) => (
        <span key={label} className="flex items-center gap-1.5 text-[11px] rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-[var(--fg)]/50">
          <span className="text-[var(--fg)]/30">{label}:</span>
          <span className="font-medium text-[var(--fg)]/75 max-w-[140px] truncate">{value}</span>
        </span>
      ))}
    </div>
  );
}

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
  const [category,     setCategory]     = useState<Category>("");
  const [captured,     setCaptured]     = useState(false);
  const [capBusy,      setCapBusy]      = useState(false);

  const set = <K extends keyof Selections>(k: K, v: Selections[K]) =>
    setSel((s) => ({ ...s, [k]: v }));

  const toggleProjectType = (id: string) =>
    set("projectTypes", sel.projectTypes.includes(id)
      ? sel.projectTypes.filter((t) => t !== id)
      : [...sel.projectTypes, id]);

  const toggleFeature = (id: string) =>
    set("features", sel.features.includes(id)
      ? sel.features.filter((f) => f !== id)
      : [...sel.features, id]);

  const toggleIntegration = (id: string) =>
    set("integrations", sel.integrations.includes(id)
      ? sel.integrations.filter((i) => i !== id)
      : [...sel.integrations, id]);

  /* ── Compute timeline from selections ───────── */
  const result = useMemo(() => {
    const selectedTypes = TIMELINE_PROJECT_TYPES.filter((t) => sel.projectTypes.includes(t.id));
    if (!selectedTypes.length) return null;

    /* Use the most complex selected type as the base (highest dev phase max) */
    const pt = selectedTypes.reduce((max, t) =>
      t.phases.dev[1] > max.phases.dev[1] ? t : max, selectedTypes[0]);

    /* Each additional selected type adds 35% of its dev time to the primary */
    const multiTypeExtra = selectedTypes
      .filter((t) => t.id !== pt.id)
      .reduce((sum, t) => sum + t.phases.dev[1] * 0.35, 0);

    /* Feature weeks */
    const featureWeeks = TIMELINE_FEATURES
      .filter((f) => sel.features.includes(f.id))
      .reduce((s, f) => s + f.weeks, 0);

    /* Modifier deltas */
    const readinessDelta = TIMELINE_READINESS.find((r) => r.id === sel.readiness)?.weeksDelta ?? 0;
    const feedbackDelta  = TIMELINE_FEEDBACK.find((f) => f.id === sel.feedback)?.weeksDelta ?? 0;
    /* Sum across all selected integrations (multi-select, [] = standard/zero) */
    const integDelta     = TIMELINE_INTEGRATIONS
      .filter((i) => sel.integrations.includes(i.id))
      .reduce((s, i) => s + i.weeksDelta, 0);
    const totalDelta     = readinessDelta + feedbackDelta + integDelta;

    /* Phases with feature weeks distributed proportionally (bulk goes to dev) */
    const devExtra = featureWeeks * 0.8;
    const qaExtra  = featureWeeks * 0.2;

    const phases = [
      { name: "Discovery",   min: pt.phases.discovery[0],           max: pt.phases.discovery[1] },
      { name: "Design",      min: clamp(pt.phases.design[0]   + (readinessDelta < 0 ? readinessDelta : 0), 0, 99),
                             max: clamp(pt.phases.design[1]   + Math.max(0, readinessDelta), 0, 99) },
      { name: "Development", min: pt.phases.dev[0] + devExtra + multiTypeExtra, max: pt.phases.dev[1] + devExtra + multiTypeExtra },
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
    if (step === 0) return sel.projectTypes.length > 0;
    if (step === 2) return !!sel.readiness;
    if (step === 3) return !!sel.feedback;
    if (step === 4) return true; /* integrations are multi-select — 0 = standard, always valid */
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
          projectTypes: TIMELINE_PROJECT_TYPES.filter((t) => sel.projectTypes.includes(t.id)).map((t) => t.label),
          features:     TIMELINE_FEATURES.filter((f) => sel.features.includes(f.id)).map((f) => f.label),
          readiness:    TIMELINE_READINESS.find((r) => r.id === sel.readiness)?.label ?? sel.readiness,
          feedback:     TIMELINE_FEEDBACK.find((f) => f.id === sel.feedback)?.label ?? sel.feedback,
          integrations: TIMELINE_INTEGRATIONS.filter((i) => sel.integrations.includes(i.id)).map((i) => i.label),
          category,
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

          {/* ── Step 0: Project type (multi-select) ──────────────────── */}
          {step === 0 && (
            <div>
              <RecapChips step={step} sel={sel} />
              <h2 className="font-display text-2xl font-extrabold text-[var(--fg)] mb-2">What are you building?</h2>
              <div className="flex items-center gap-3 mb-6">
                <p className="text-sm text-[var(--fg)]/45">Select everything that applies — combining types adjusts the timeline automatically.</p>
                <span className="shrink-0 text-[10px] font-mono text-[var(--fg)]/30 bg-[var(--surface)] border border-[var(--border)] px-2 py-0.5 rounded-full">
                  Select all that apply
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {TIMELINE_PROJECT_TYPES.map((pt) => {
                  const on = sel.projectTypes.includes(pt.id);
                  return (
                    <button
                      key={pt.id}
                      type="button"
                      onClick={() => toggleProjectType(pt.id)}
                      className={[
                        "flex items-start gap-3 rounded-xl border p-4 text-left transition-all active:scale-[0.98]",
                        on
                          ? "border-[var(--primary)] bg-[var(--primary)]/8 shadow-[0_0_16px_rgba(56,189,248,0.10)]"
                          : "border-[var(--border)] hover:border-[var(--primary)]/40 bg-[var(--surface)]",
                      ].join(" ")}
                    >
                      <span className={[
                        "flex h-5 w-5 shrink-0 mt-0.5 items-center justify-center rounded border transition-all",
                        on ? "bg-[var(--primary)] border-[var(--primary)]" : "border-[var(--border)]",
                      ].join(" ")}>
                        {on && <IconCheck size={11} className="text-[var(--bg)]" />}
                      </span>
                      <span>
                        <span className="block font-heading font-semibold text-[var(--fg)] text-sm">{pt.label}</span>
                        <span className="block text-xs text-[var(--fg)]/40 mt-0.5">{pt.desc}</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Live selection list */}
              {sel.projectTypes.length > 0 && (
                <div className="mt-4 rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/5 px-4 py-3">
                  <p className="text-xs font-semibold text-[var(--primary)] mb-2">
                    {sel.projectTypes.length} type{sel.projectTypes.length > 1 ? "s" : ""} selected
                    {sel.projectTypes.length > 1 && <span className="font-normal text-[var(--fg)]/40 ml-2">— timelines combined automatically</span>}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {sel.projectTypes.map((id) => {
                      const pt = TIMELINE_PROJECT_TYPES.find((t) => t.id === id);
                      return (
                        <span key={id}
                          className="inline-flex items-center gap-1.5 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 px-3 py-1 text-xs font-medium text-[var(--primary)]">
                          {pt?.label}
                          <button type="button" onClick={() => toggleProjectType(id)}
                            className="hover:text-[var(--fg)] transition-colors">×</button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Step 1: Features ──────────────────────────────────────── */}
          {step === 1 && (
            <div>
              <RecapChips step={step} sel={sel} />
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-display text-2xl font-extrabold text-[var(--fg)]">Which features do you need?</h2>
                {sel.features.length > 0 && (
                  <button type="button" onClick={() => set("features", [])}
                    className="text-xs text-[var(--fg)]/35 hover:text-rose-400 transition-colors shrink-0">
                    Clear all ({sel.features.length})
                  </button>
                )}
              </div>
              <p className="text-sm text-[var(--fg)]/45 mb-6">Select all that apply — click again to remove.</p>
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
              {sel.features.length === 0 ? (
                <p className="mt-4 text-xs text-[var(--fg)]/30">No features selected — skipping adds to the base timeline only.</p>
              ) : (
                <div className="mt-4 rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/5 px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {sel.features.map((id) => {
                      const f = TIMELINE_FEATURES.find((f) => f.id === id);
                      return (
                        <span key={id}
                          className="inline-flex items-center gap-1.5 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 px-3 py-1 text-xs font-medium text-[var(--primary)]">
                          {f?.label}
                          <button type="button" onClick={() => toggleFeature(id)}
                            className="font-bold opacity-60 hover:opacity-100 leading-none transition-opacity">×</button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Step 2: Design readiness ─────────────────────────────── */}
          {step === 2 && (
            <div>
              <RecapChips step={step} sel={sel} />
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
              <RecapChips step={step} sel={sel} />
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

          {/* ── Step 4: Integrations (multi-select) ─────────────────── */}
          {step === 4 && (
            <div>
              <RecapChips step={step} sel={sel} />
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-display text-2xl font-extrabold text-[var(--fg)]">Any complex integrations?</h2>
                {sel.integrations.length > 0 && (
                  <button type="button" onClick={() => set("integrations", [])}
                    className="text-xs text-[var(--fg)]/35 hover:text-rose-400 transition-colors shrink-0">
                    Clear all ({sel.integrations.length})
                  </button>
                )}
              </div>
              <p className="text-sm text-[var(--fg)]/45 mb-1">Select all that apply. If none apply, just continue — standard integrations add no extra time.</p>
              <span className="inline-block mb-6 text-[10px] font-mono text-[var(--fg)]/30 bg-[var(--surface)] border border-[var(--border)] px-2 py-0.5 rounded-full">
                Select all that apply
              </span>
              <div className="space-y-3">
                {TIMELINE_INTEGRATIONS.filter((i) => i.id !== "standard").map((intg) => {
                  const on = sel.integrations.includes(intg.id);
                  return (
                  <button
                    key={intg.id}
                    type="button"
                    onClick={() => toggleIntegration(intg.id)}
                    className={[
                      "flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all",
                      on
                        ? "border-[var(--primary)] bg-[var(--primary)]/8"
                        : "border-[var(--border)] hover:border-[var(--primary)]/40 bg-[var(--surface)]",
                    ].join(" ")}
                  >
                    <span className={[
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-all",
                      on ? "bg-[var(--primary)] border-[var(--primary)]" : "border-[var(--border)]",
                    ].join(" ")}>
                      {on && <IconCheck size={11} className="text-[var(--bg)]" />}
                    </span>
                    <div>
                      <div className="flex items-baseline gap-3">
                        <span className="font-heading font-semibold text-[var(--fg)] text-sm">{intg.label}</span>
                        <span className="font-mono text-xs text-amber-400">+{intg.weeksDelta} weeks</span>
                      </div>
                      <p className="text-xs text-[var(--fg)]/40 mt-0.5">{intg.desc}</p>
                    </div>
                  </button>
                  );
                })}
              </div>
              {sel.integrations.length === 0 ? (
                <p className="text-xs text-[var(--fg)]/30 mt-3">No selection = standard integrations only (Paystack, Supabase, etc.) — no extra time added.</p>
              ) : (
                <div className="mt-4 rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/5 px-4 py-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-[var(--primary)]">{sel.integrations.length} integration{sel.integrations.length > 1 ? "s" : ""} selected</p>
                    <button type="button" onClick={() => set("integrations", [])}
                      className="text-xs text-[var(--fg)]/35 hover:text-rose-400 transition-colors">
                      Clear all
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sel.integrations.map((id) => {
                      const intg = TIMELINE_INTEGRATIONS.find((i) => i.id === id);
                      return (
                        <span key={id}
                          className="inline-flex items-center gap-1.5 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 px-3 py-1 text-xs font-medium text-[var(--primary)]">
                          {intg?.label}
                          <button type="button" onClick={() => toggleIntegration(id)}
                            className="font-bold opacity-60 hover:opacity-100 leading-none transition-opacity">×</button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
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
                <div className="mt-4 pt-3 border-t border-[var(--border)]">
                  <CategoryPicker value={category} onChange={setCategory} />
                </div>
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
                  {TIMELINE_PROJECT_TYPES.filter((t) => sel.projectTypes.includes(t.id)).map((t) => t.label).join(" + ")} ·{" "}
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
                        projectTypes: TIMELINE_PROJECT_TYPES.filter((t) => sel.projectTypes.includes(t.id)).map((t) => t.label),
                        features:    TIMELINE_FEATURES.filter((f) => sel.features.includes(f.id)).map((f) => f.label),
                        readiness:   TIMELINE_READINESS.find((r) => r.id === sel.readiness)?.label ?? sel.readiness,
                        feedback:    TIMELINE_FEEDBACK.find((f) => f.id === sel.feedback)?.label ?? sel.feedback,
                        integrations: TIMELINE_INTEGRATIONS.filter((i) => sel.integrations.includes(i.id)).map((i) => i.label),
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
                        projectTypes: TIMELINE_PROJECT_TYPES.filter((t) => sel.projectTypes.includes(t.id)).map((t) => t.label),
                        features:    TIMELINE_FEATURES.filter((f) => sel.features.includes(f.id)).map((f) => f.label),
                      },
                      result: { totalMin: result.totalMin, totalMax: result.totalMax },
                    });
                    const msg = [
                      `Hi TechAgency! I just used the timeline estimator:`,
                      `Project: ${TIMELINE_PROJECT_TYPES.filter((t) => sel.projectTypes.includes(t.id)).map((t) => t.label).join(" + ")}`,
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
