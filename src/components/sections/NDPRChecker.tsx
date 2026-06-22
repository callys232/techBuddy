"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { IconCheck, IconAlertCircle, IconAlertTriangle, IconShieldCheck, IconArrowRight } from "@tabler/icons-react";
import { NDPR_QUESTIONS, NDPR_SECTIONS, scoreNDPR, type NDPRAnswer } from "@/mock/ndpr";
import { captureToolLead } from "@/lib/captureToolLead";
import { validateEmail } from "@/lib/validate";
import { CategoryPicker, type Category } from "@/components/ui/CategoryPicker";

/* ── Answer button ─────────────────────────────────────────────────────────── */

function AnswerBtn({
  value, label, hint, selected, onClick,
}: { value: NDPRAnswer; label: string; hint?: string; selected: boolean; onClick: () => void }) {
  const colors = {
    yes:     selected ? "border-emerald-500 bg-emerald-500/8 text-emerald-400"   : "border-[var(--border)] hover:border-emerald-500/50",
    partial: selected ? "border-amber-400 bg-amber-400/8 text-amber-400"         : "border-[var(--border)] hover:border-amber-400/50",
    no:      selected ? "border-rose-400 bg-rose-400/8 text-rose-400"            : "border-[var(--border)] hover:border-rose-400/50",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex items-start gap-3 rounded-xl border p-4 text-left transition-all w-full",
        colors[value as "yes" | "partial" | "no"],
      ].join(" ")}
    >
      <span className={[
        "flex h-5 w-5 shrink-0 mt-0.5 items-center justify-center rounded-full border transition-all",
        selected
          ? value === "yes"     ? "bg-emerald-500 border-emerald-500"
          : value === "partial" ? "bg-amber-400 border-amber-400"
          :                       "bg-rose-400 border-rose-400"
          : "border-[var(--border)]",
      ].join(" ")}>
        {selected && <IconCheck size={10} className="text-[var(--bg)]" />}
      </span>
      <span>
        <span className="block font-heading font-semibold text-[var(--fg)] text-sm">{label}</span>
        {hint && <span className="block text-xs text-[var(--fg)]/40 mt-0.5">{hint}</span>}
      </span>
    </button>
  );
}

/* ── Score ring ────────────────────────────────────────────────────────────── */

function ScoreRing({ score, color }: { score: number; color: string }) {
  const r   = 52;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <svg width="130" height="130" viewBox="0 0 130 130" className="mx-auto">
      <circle cx="65" cy="65" r={r} fill="none" stroke="currentColor" strokeWidth="8" className="text-[var(--border)]" />
      <motion.circle
        cx="65" cy="65" r={r}
        fill="none" strokeWidth="8"
        strokeLinecap="round"
        className={color.replace("text-", "stroke-")}
        strokeDasharray={`${dash} ${circ}`}
        transform="rotate(-90 65 65)"
        initial={{ strokeDasharray: `0 ${circ}` }}
        animate={{ strokeDasharray: `${dash} ${circ}` }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      <text x="65" y="60" textAnchor="middle" fontSize={28} fontWeight={800} className="fill-current">
        {score}
      </text>
      <text x="65" y="78" textAnchor="middle" fontSize={11} className="fill-current opacity-40">
        / 100
      </text>
    </svg>
  );
}

/* ── Component ─────────────────────────────────────────────────────────────── */

const TOTAL_STEPS = NDPR_QUESTIONS.length + 1; /* +1 for email gate */

export function NDPRChecker() {
  const [step,     setStep]    = useState(0);
  const [answers,  setAnswers] = useState<Record<string, NDPRAnswer>>({});
  const [result,   setResult]  = useState<ReturnType<typeof scoreNDPR> | null>(null);

  /* Email gate */
  const [email,        setEmail]        = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [emailError,   setEmailError]   = useState<string | null>(null);
  const [category,     setCategory]     = useState<Category>("");
  const emailRef = useRef<HTMLInputElement>(null);
  const isEmailValid = !validateEmail(email);

  const isEmailStep = step === NDPR_QUESTIONS.length;
  const currentQ    = !isEmailStep ? NDPR_QUESTIONS[step] : null;
  const currentAns  = currentQ ? answers[currentQ.id] ?? null : null;
  const sectionIdx  = currentQ ? NDPR_SECTIONS.indexOf(currentQ.section) : -1;

  const answerQ = (val: NDPRAnswer) => {
    if (!currentQ) return;
    setAnswers((prev) => ({ ...prev, [currentQ.id]: val }));
  };

  const next = () => {
    if (isEmailStep) {
      const err = validateEmail(email);
      setEmailTouched(true);
      setEmailError(err);
      if (err) { emailRef.current?.focus(); return; }

      const scored = scoreNDPR(answers);
      captureToolLead({
        tool:    "ndpr-checker",
        source:  "email-capture",
        email,
        selections: { ...Object.fromEntries(NDPR_QUESTIONS.map((q) => [q.question, answers[q.id] ?? "no"])), category },
        result:  { score: scored.score, grade: scored.grade, criticalGaps: scored.critical.length },
      });
      setResult(scored);
    } else {
      setStep((s) => s + 1);
    }
  };

  const back  = () => setStep((s) => Math.max(0, s - 1));
  const reset = () => { setAnswers({}); setStep(0); setResult(null); setEmail(""); setEmailTouched(false); setEmailError(null); };

  /* ── Results ──────────────────────────────────────────────────────────── */
  if (result) {
    const gIcon =
      result.grade === "compliant"    ? <IconShieldCheck size={22} className="text-emerald-400" /> :
      result.grade === "progressing"  ? <IconAlertCircle size={22} className="text-sky-400"     /> :
      result.grade === "at-risk"      ? <IconAlertTriangle size={22} className="text-amber-400" /> :
                                        <IconAlertTriangle size={22} className="text-rose-400"  />;

    return (
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Score card */}
        <div className="glass rounded-[var(--radius-card)] border border-[var(--border)] p-8 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--primary)] mb-6">
            Your NDPR Compliance Score
          </p>
          <ScoreRing score={result.score} color={result.gradeColor} />
          <div className="flex items-center justify-center gap-2 mt-4">
            {gIcon}
            <span className={`font-display text-lg font-bold ${result.gradeColor}`}>{result.gradeLabel}</span>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-[var(--border)] text-sm">
            <div><p className="font-bold text-emerald-400">{result.passed.length}</p><p className="text-[var(--fg)]/40 text-xs">Passing</p></div>
            <div><p className="font-bold text-amber-400">{result.partial.length}</p><p className="text-[var(--fg)]/40 text-xs">Partial</p></div>
            <div><p className="font-bold text-rose-400">{result.failed.length}</p><p className="text-[var(--fg)]/40 text-xs">Failing</p></div>
          </div>
        </div>

        {/* Critical gaps first */}
        {result.critical.length > 0 && (
          <div className="rounded-[var(--radius-card)] border border-rose-400/30 bg-rose-500/5 p-6">
            <h3 className="font-display font-bold text-rose-400 mb-4 flex items-center gap-2">
              <IconAlertTriangle size={16} />
              {result.critical.length} Critical Gap{result.critical.length > 1 ? "s" : ""} — Fix These First
            </h3>
            <div className="space-y-4">
              {result.critical.map((q) => (
                <div key={q.id} className="border-l-2 border-rose-400/40 pl-4">
                  <p className="font-heading font-semibold text-[var(--fg)] text-sm">{q.question}</p>
                  <p className="text-xs text-[var(--fg)]/50 mt-1 leading-relaxed">{q.failAdvice}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Partial items */}
        {result.partial.length > 0 && (
          <div className="rounded-[var(--radius-card)] border border-amber-400/25 bg-amber-500/5 p-6">
            <h3 className="font-display font-bold text-amber-400 mb-4 flex items-center gap-2">
              <IconAlertCircle size={16} />
              {result.partial.length} Partial — Needs Strengthening
            </h3>
            <div className="space-y-4">
              {result.partial.map((q) => (
                <div key={q.id} className="border-l-2 border-amber-400/40 pl-4">
                  <p className="font-heading font-semibold text-[var(--fg)] text-sm">{q.question}</p>
                  <p className="text-xs text-[var(--fg)]/50 mt-1 leading-relaxed">{q.failAdvice}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other failed */}
        {result.failed.filter((q) => q.weight < 3).length > 0 && (
          <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-6">
            <h3 className="font-heading font-bold text-[var(--fg)]/70 mb-4">
              {result.failed.filter((q) => q.weight < 3).length} Additional Gaps
            </h3>
            <div className="space-y-4">
              {result.failed.filter((q) => q.weight < 3).map((q) => (
                <div key={q.id} className="border-l-2 border-[var(--border)] pl-4">
                  <p className="font-heading font-semibold text-[var(--fg)] text-sm">{q.question}</p>
                  <p className="text-xs text-[var(--fg)]/50 mt-1 leading-relaxed">{q.failAdvice}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* What's passing */}
        {result.passed.length > 0 && (
          <div className="rounded-[var(--radius-card)] border border-emerald-500/20 bg-emerald-500/5 p-5">
            <h3 className="font-heading font-semibold text-emerald-400 text-sm mb-3">
              ✓ {result.passed.length} requirement{result.passed.length > 1 ? "s" : ""} you&apos;re meeting
            </h3>
            <div className="space-y-1">
              {result.passed.map((q) => (
                <div key={q.id} className="flex items-center gap-2 text-xs text-[var(--fg)]/55">
                  <IconCheck size={11} className="text-emerald-400 shrink-0" />
                  {q.question}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTAs */}
        <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
          <p className="font-display font-bold text-[var(--fg)] mb-2">
            {result.grade === "compliant" ? "Maintain your compliance posture" : "Need help fixing these gaps?"}
          </p>
          <p className="text-sm text-[var(--fg)]/50 mb-5">
            A full report has been sent to <strong>{email}</strong>. Our team can implement every fix listed above.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/quote?service=NDPR+Compliance"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-[var(--primary)] px-7 font-semibold text-sm text-[var(--bg)] hover:opacity-90 transition-opacity"
            >
              Get a compliance quote <IconArrowRight size={14} />
            </Link>
            <Link
              href="/services/security-pentesting"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-[var(--border)] px-6 text-sm font-semibold text-[var(--fg)]/60 hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
            >
              See our security services
            </Link>
            <button type="button" onClick={reset}
              className="text-sm text-[var(--fg)]/30 hover:text-[var(--fg)] transition-colors px-4">
              Retake
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Email gate ─────────────────────────────────────────────────────────── */
  if (isEmailStep) {
    return (
      <div className="max-w-xl mx-auto">
        {/* Progress */}
        <div className="w-full bg-[var(--border)] rounded-full h-1.5 mb-8">
          <div className="bg-[var(--primary)] h-1.5 rounded-full transition-all duration-500 w-[95%]" />
        </div>
        <p className="font-mono text-[var(--primary)] text-[10px] uppercase tracking-[0.25em] mb-3">Almost done</p>
        <h2 className="font-display text-2xl font-extrabold text-[var(--fg)] mb-2">
          Where should we send your compliance report?
        </h2>
        <p className="text-sm text-[var(--fg)]/45 mb-8 leading-relaxed">
          You&apos;ll receive a full breakdown of every gap, the legal requirement behind it, and what to do next — ready to share with your team or legal counsel.
        </p>
        <div className="space-y-4">
          <div>
            <label className="block font-heading text-sm font-semibold text-[var(--fg)] mb-1.5">
              Email address <span className="text-[var(--primary)]">*</span>
            </label>
            <input
              ref={emailRef}
              type="email"
              value={email}
              autoFocus
              onChange={(e) => { setEmail(e.target.value); if (emailTouched) setEmailError(validateEmail(e.target.value)); }}
              onBlur={() => { setEmailTouched(true); setEmailError(validateEmail(email)); }}
              placeholder="you@company.ng"
              className={[
                "w-full rounded-xl border px-4 py-3 text-sm text-[var(--fg)] bg-[var(--surface)]",
                "placeholder:text-[var(--fg)]/30 focus:outline-none focus:ring-1 transition-colors",
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
          <div className="mt-1">
            <CategoryPicker value={category} onChange={setCategory} />
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={next}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-[var(--primary)] px-7 font-semibold text-sm text-[var(--bg)] hover:opacity-90 transition-all active:scale-95">
              Show my compliance score →
            </button>
            <button type="button" onClick={back}
              className="text-sm text-[var(--fg)]/40 hover:text-[var(--fg)] transition-colors">
              ← Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Question ────────────────────────────────────────────────────────────── */
  const progress = (step / TOTAL_STEPS) * 100;

  return (
    <div className="max-w-xl mx-auto">
      {/* Section label + progress */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[var(--primary)] text-[10px] uppercase tracking-[0.2em]">
          {currentQ?.section}
        </span>
        <span className="text-xs text-[var(--fg)]/30">{step + 1} / {NDPR_QUESTIONS.length}</span>
      </div>
      <div className="w-full bg-[var(--border)] rounded-full h-1.5 mb-8">
        <motion.div
          className="bg-[var(--primary)] h-1.5 rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Section breadcrumb dots */}
      <div className="flex items-center gap-1.5 mb-6">
        {NDPR_SECTIONS.map((s, i) => (
          <div key={s} className={["h-1 rounded-full transition-all duration-300 flex-1",
            i < sectionIdx ? "bg-[var(--primary)]"
            : i === sectionIdx ? "bg-[var(--primary)]/60"
            : "bg-[var(--border)]",
          ].join(" ")} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          <h2 className="font-display text-xl font-extrabold text-[var(--fg)] mb-2 leading-snug">
            {currentQ?.question}
          </h2>
          {currentQ?.weight === 3 && (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-rose-400 bg-rose-400/10 px-2 py-0.5 rounded-full mb-3">
              <IconAlertCircle size={9} /> Critical NDPR requirement
            </span>
          )}
          <p className="text-sm text-[var(--fg)]/45 mb-6 leading-relaxed">{currentQ?.guidance}</p>

          <div className="space-y-3">
            <AnswerBtn value="yes" selected={currentAns === "yes"} onClick={() => answerQ("yes")}
              label="Yes — fully in place"
              hint="We have this implemented and documented" />
            <AnswerBtn value="partial" selected={currentAns === "partial"} onClick={() => answerQ("partial")}
              label="Partial"
              hint={currentQ?.partialLabel} />
            <AnswerBtn value="no" selected={currentAns === "no"} onClick={() => answerQ("no")}
              label="No — not yet in place"
              hint="We haven't addressed this requirement" />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Nav */}
      <div className="flex items-center justify-between mt-10 pt-6 border-t border-[var(--border)]">
        <button type="button" onClick={back} disabled={step === 0}
          className="text-sm text-[var(--fg)]/40 hover:text-[var(--fg)] disabled:opacity-0 transition-all">
          ← Back
        </button>
        <button type="button" onClick={next} disabled={!currentAns}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-[var(--primary)] px-7 font-semibold text-sm text-[var(--bg)] hover:opacity-90 disabled:opacity-30 transition-all active:scale-95">
          {step === NDPR_QUESTIONS.length - 1 ? "Continue to your score →" : "Next →"}
        </button>
      </div>
    </div>
  );
}
