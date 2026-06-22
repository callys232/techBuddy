"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { IconCheck, IconAlertCircle, IconArrowRight, IconAlertTriangle } from "@tabler/icons-react";
import { PMF_QUESTIONS, PMF_SECTIONS, scorePMF } from "@/mock/pmf-score";
import { captureToolLead } from "@/lib/captureToolLead";
import { validateEmail } from "@/lib/validate";
import { CategoryPicker, type Category } from "@/components/ui/CategoryPicker";

const TOTAL = PMF_QUESTIONS.length + 1; /* questions + email */

/* ── Score ring ─────────────────────────────────────────────────────────── */

function ScoreRing({ score, color }: { score: number; color: string }) {
  const r    = 52;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const strokeClass = color
    .replace("text-emerald-400", "stroke-emerald-400")
    .replace("text-sky-400",     "stroke-sky-400")
    .replace("text-amber-400",   "stroke-amber-400")
    .replace("text-rose-400",    "stroke-rose-400");

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
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      <text x="65" y="60" textAnchor="middle" fontSize={28} fontWeight={800} className="fill-current">{score}</text>
      <text x="65" y="78" textAnchor="middle" fontSize={11} className="fill-current opacity-40">/ 100</text>
    </svg>
  );
}

/* ── Section bar ─────────────────────────────────────────────────────────── */

function SectionBar({ name, score, color }: { name: string; score: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-32 shrink-0 text-xs text-[var(--fg)]/45 text-right">{name}</span>
      <div className="flex-1 h-4 bg-[var(--bg)] rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
      <span className="w-10 text-xs font-mono text-[var(--fg)]/45 text-right">{score}%</span>
    </div>
  );
}

/* ── Component ─────────────────────────────────────────────────────────── */

export function PMFScorer() {
  const [step,     setStep]    = useState(0);
  const [answers,  setAnswers] = useState<Record<string, string>>({});
  const [result,   setResult]  = useState<ReturnType<typeof scorePMF> | null>(null);

  const [email,        setEmail]        = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [emailError,   setEmailError]   = useState<string | null>(null);
  const [industry,     setIndustry]     = useState<Category>("");
  const emailRef = useRef<HTMLInputElement>(null);
  const isEmailValid = !validateEmail(email);

  const isEmailStep = step === PMF_QUESTIONS.length;
  const currentQ    = !isEmailStep ? PMF_QUESTIONS[step] : null;
  const sectionIdx  = currentQ ? PMF_SECTIONS.indexOf(currentQ.section) : -1;
  const currentSel  = currentQ ? answers[currentQ.id] : undefined;

  const next = () => {
    if (isEmailStep) {
      const err = validateEmail(email);
      setEmailTouched(true); setEmailError(err);
      if (err) { emailRef.current?.focus(); return; }
      const scored = scorePMF(answers);
      captureToolLead({
        tool: "pmf-score", source: "email-capture", email,
        selections: { ...answers, industry },
        result: { score: scored.score, grade: scored.grade, gapCount: scored.gaps.length },
      });
      setResult(scored);
    } else {
      if (!currentSel) return;
      setStep((s) => Math.min(TOTAL - 1, s + 1));
    }
  };

  const back  = () => setStep((s) => Math.max(0, s - 1));
  const reset = () => { setStep(0); setAnswers({}); setResult(null); setEmail(""); setEmailTouched(false); setEmailError(null); };
  const canAdvance = isEmailStep ? isEmailValid : !!currentSel;

  /* ── Results ─────────────────────────────────────────────────────────── */
  if (result) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Score card */}
        <div className="glass rounded-[var(--radius-card)] border border-[var(--border)] p-8 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--primary)] mb-5">Your PMF Score</p>
          <ScoreRing score={result.score} color={result.gradeColor} />
          <p className={`font-display text-xl font-bold mt-4 ${result.gradeColor}`}>{result.gradeLabel}</p>
        </div>

        {/* Section breakdown */}
        <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-6">
          <h3 className="font-heading font-bold text-[var(--fg)] mb-5">Score by dimension</h3>
          <div className="space-y-3">
            {result.sections.map((s) => (
              <SectionBar key={s.name} name={s.name} score={s.score} color={s.color} />
            ))}
          </div>
        </div>

        {/* Top action */}
        <div className="rounded-[var(--radius-card)] border border-[var(--primary)]/30 bg-[var(--primary)]/5 p-6">
          <p className="font-heading font-bold text-[var(--primary)] mb-2 flex items-center gap-2">
            <IconArrowRight size={15} /> Your single most important next action
          </p>
          <p className="text-sm text-[var(--fg)]/65 leading-relaxed">{result.topAction}</p>
        </div>

        {/* Gaps */}
        {result.gaps.length > 0 && (
          <div className="rounded-[var(--radius-card)] border border-amber-400/25 bg-amber-500/5 p-6">
            <h3 className="font-heading font-bold text-amber-400 mb-4 flex items-center gap-2">
              <IconAlertTriangle size={15} />
              {result.gaps.length} gap{result.gaps.length > 1 ? "s" : ""} holding you back
            </h3>
            <div className="space-y-4">
              {result.gaps.map(({ q, score, advice }) => (
                <div key={q.id} className="border-l-2 border-amber-400/40 pl-4">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-heading font-semibold text-[var(--fg)] text-sm">{q.question}</p>
                    <span className="font-mono text-xs text-amber-400 shrink-0">{score}/100</span>
                  </div>
                  <p className="text-xs text-[var(--fg)]/50 leading-relaxed">{advice}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Strengths */}
        {result.strengths.length > 0 && (
          <div className="rounded-[var(--radius-card)] border border-emerald-500/20 bg-emerald-500/5 p-5">
            <h3 className="font-heading font-semibold text-emerald-400 text-sm mb-3">
              ✓ {result.strengths.length} strong signal{result.strengths.length > 1 ? "s" : ""}
            </h3>
            <div className="space-y-1">
              {result.strengths.map(({ q }) => (
                <div key={q.id} className="flex items-center gap-2 text-xs text-[var(--fg)]/55">
                  <IconCheck size={11} className="text-emerald-400 shrink-0" />
                  {q.question}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
          <p className="font-heading font-bold text-[var(--fg)] mb-1">
            {result.grade === "achieved" ? "Ready to scale? Let's build the infrastructure." : "Want help addressing these gaps?"}
          </p>
          <p className="text-sm text-[var(--fg)]/45 mb-5">Full report sent to <strong>{email}</strong>.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/contact"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-[var(--primary)] px-7 font-semibold text-sm text-[var(--bg)] hover:opacity-90 transition-opacity">
              Talk to our team <IconArrowRight size={14} />
            </Link>
            <button type="button" onClick={reset}
              className="inline-flex h-11 items-center px-5 text-sm text-[var(--fg)]/30 hover:text-[var(--fg)] transition-colors">
              Retake
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Email gate ──────────────────────────────────────────────────────── */
  if (isEmailStep) {
    return (
      <div className="max-w-xl mx-auto">
        <div className="w-full bg-[var(--border)] rounded-full h-1.5 mb-8">
          <div className="bg-[var(--primary)] h-1.5 rounded-full w-[95%]" />
        </div>
        <p className="font-mono text-[var(--primary)] text-[10px] uppercase tracking-[0.25em] mb-3">Almost done</p>
        <h2 className="font-display text-2xl font-extrabold text-[var(--fg)] mb-2">
          Where should we send your PMF report?
        </h2>
        <p className="text-sm text-[var(--fg)]/45 mb-8 leading-relaxed">
          You&apos;ll receive your score, a section-by-section breakdown, your specific gaps, and the single most important action to take this week.
        </p>
        <div className="space-y-4">
          <div>
            <label className="block font-heading text-sm font-semibold text-[var(--fg)] mb-1.5">
              Email address <span className="text-[var(--primary)]">*</span>
            </label>
            <input
              ref={emailRef} type="email" value={email} autoFocus
              onChange={(e) => { setEmail(e.target.value); if (emailTouched) setEmailError(validateEmail(e.target.value)); }}
              onBlur={() => { setEmailTouched(true); setEmailError(validateEmail(email)); }}
              placeholder="you@startup.ng"
              className={[
                "w-full rounded-xl border px-4 py-3 text-sm text-[var(--fg)] bg-[var(--surface)] placeholder:text-[var(--fg)]/30 focus:outline-none focus:ring-1 transition-colors",
                emailTouched && emailError ? "border-rose-400 focus:border-rose-400 focus:ring-rose-400/20"
                  : isEmailValid && emailTouched ? "border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                  : "border-[var(--border)] focus:border-[var(--primary)] focus:ring-[var(--primary)]/20",
              ].join(" ")}
            />
            {emailTouched && emailError && (
              <span className="flex items-center gap-1 text-[11px] text-rose-400 mt-1.5">
                <IconAlertCircle size={11} />{emailError}
              </span>
            )}
            <p className="text-xs text-[var(--fg)]/30 mt-2">Added to our newsletter — unsubscribe anytime.</p>
          </div>
          <CategoryPicker value={industry} onChange={setIndustry} />
          <div className="flex items-center gap-3 pt-1">
            <button type="button" onClick={next}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-[var(--primary)] px-7 font-semibold text-sm text-[var(--bg)] hover:opacity-90 transition-all active:scale-95">
              Show my PMF score →
            </button>
            <button type="button" onClick={back} className="text-sm text-[var(--fg)]/40 hover:text-[var(--fg)] transition-colors">← Back</button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Questions ─────────────────────────────────────────────────────────── */
  const progress = (step / TOTAL) * 100;

  return (
    <div className="max-w-xl mx-auto">
      {/* Section progress */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[var(--primary)] text-[10px] uppercase tracking-[0.2em]">
          {currentQ?.section}
        </span>
        <span className="text-xs text-[var(--fg)]/30">{step + 1} / {PMF_QUESTIONS.length}</span>
      </div>
      <div className="w-full bg-[var(--border)] rounded-full h-1.5 mb-2">
        <motion.div className="bg-[var(--primary)] h-1.5 rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
      </div>

      {/* Section dots */}
      <div className="flex gap-1.5 mb-8">
        {PMF_SECTIONS.map((s, i) => (
          <div key={s} className={["h-1 flex-1 rounded-full transition-all duration-300",
            i < sectionIdx ? "bg-[var(--primary)]" : i === sectionIdx ? "bg-[var(--primary)]/60" : "bg-[var(--border)]",
          ].join(" ")} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
          <h2 className="font-display text-xl font-extrabold text-[var(--fg)] mb-2 leading-snug">
            {currentQ?.question}
          </h2>
          <p className="text-sm text-[var(--fg)]/45 mb-6 leading-relaxed">{currentQ?.subtitle}</p>

          <div className="space-y-3">
            {currentQ?.options.map((opt) => {
              const on = currentSel === opt.id;
              return (
                <button key={opt.id} type="button"
                  onClick={() => setAnswers((prev) => ({ ...prev, [currentQ.id]: opt.id }))}
                  className={[
                    "flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all",
                    on ? "border-[var(--primary)] bg-[var(--primary)]/8" : "border-[var(--border)] hover:border-[var(--primary)]/40 bg-[var(--surface)]",
                  ].join(" ")}>
                  <span className={["flex h-5 w-5 shrink-0 mt-0.5 items-center justify-center rounded-full border transition-all",
                    on ? "bg-[var(--primary)] border-[var(--primary)]" : "border-[var(--border)]"].join(" ")}>
                    {on && <span className="block h-2 w-2 rounded-full bg-[var(--bg)]" />}
                  </span>
                  <div>
                    <span className="block font-heading font-semibold text-[var(--fg)] text-sm">{opt.label}</span>
                    {opt.hint && <span className="block text-xs text-[var(--fg)]/40 mt-0.5">{opt.hint}</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between mt-10 pt-6 border-t border-[var(--border)]">
        <button type="button" onClick={back} disabled={step === 0}
          className="text-sm text-[var(--fg)]/40 hover:text-[var(--fg)] disabled:opacity-0 transition-all">← Back</button>
        <button type="button" onClick={next} disabled={!canAdvance}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-[var(--primary)] px-7 font-heading font-semibold text-sm text-[var(--bg)] hover:opacity-90 disabled:opacity-30 transition-all active:scale-95">
          {step === PMF_QUESTIONS.length - 1 ? "Continue →" : "Continue →"}
        </button>
      </div>
    </div>
  );
}
