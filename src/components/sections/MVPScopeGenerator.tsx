"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { IconCheck, IconX, IconAlertCircle, IconArrowRight, IconClock, IconBulb } from "@tabler/icons-react";
import { MVP_QUESTIONS, generateMVPScope } from "@/mock/mvp-scope";
import { captureToolLead } from "@/lib/captureToolLead";
import { validateEmail } from "@/lib/validate";
import { CategoryPicker, type Category } from "@/components/ui/CategoryPicker";

/* ── Questions are steps 0…N-1, then email step, then results ─────────────── */
const Q_COUNT    = MVP_QUESTIONS.length;
const EMAIL_STEP = Q_COUNT;

/* ── Phase badge ─────────────────────────────────────────────────────────── */

function PhaseBadge({ phase }: { phase: 1 | 2 | "never" }) {
  const map = {
    1:       "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    2:       "bg-sky-500/10 text-sky-400 border-sky-500/20",
    never:   "bg-rose-500/10 text-rose-400 border-rose-500/20",
  } as const;
  const label = { 1: "Phase 1", 2: "Phase 2", never: "Skip" } as const;
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[10px] font-semibold shrink-0 ${map[phase]}`}>
      {label[phase]}
    </span>
  );
}

/* ── Selected answers sidebar ─────────────────────────────────────────────── */

function AnswersSidebar({ answers, questions, step }: {
  answers: Record<string, string | string[]>;
  questions: typeof MVP_QUESTIONS;
  step: number;
}) {
  const filled = questions.slice(0, step).filter((q) => answers[q.id]);
  if (!filled.length) return null;
  return (
    <div className="hidden lg:block w-56 shrink-0">
      <div className="sticky top-24 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-4">
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--fg)]/35 mb-3">Your answers</p>
        <div className="space-y-2.5">
          {filled.map((q) => {
            const val = answers[q.id];
            const display = Array.isArray(val)
              ? val.map((v) => q.options?.find((o) => o.id === v)?.label ?? v).join(", ")
              : q.options?.find((o) => o.id === val)?.label ?? val;
            return (
              <div key={q.id}>
                <p className="text-[10px] text-[var(--fg)]/35 leading-snug">{q.question}</p>
                <p className="text-[11px] font-semibold text-[var(--primary)] leading-snug mt-0.5 line-clamp-2">{display}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Component ─────────────────────────────────────────────────────────────── */

export function MVPScopeGenerator() {
  const [step,    setStep]    = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [result,  setResult]  = useState<ReturnType<typeof generateMVPScope> | null>(null);

  /* Email gate */
  const [email,        setEmail]        = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [emailError,   setEmailError]   = useState<string | null>(null);
  const [category,     setCategory]     = useState<Category>("");
  const emailRef = useRef<HTMLInputElement>(null);
  const isEmailValid = !validateEmail(email);

  const isEmailStep = step === EMAIL_STEP;
  const currentQ    = !isEmailStep ? MVP_QUESTIONS[step] : null;
  const isText      = currentQ?.type === "text";
  const isMulti     = currentQ?.type === "multiselect";

  /* ── Answer handlers ───────────────────────────────────────────────────── */

  const setAnswer = (val: string | string[]) =>
    setAnswers((prev) => ({ ...prev, [currentQ!.id]: val }));

  const toggleMulti = (optId: string) => {
    const current = (answers[currentQ!.id] as string[] | undefined) ?? [];
    setAnswer(current.includes(optId) ? current.filter((v) => v !== optId) : [...current, optId]);
  };

  const currentVal = currentQ ? answers[currentQ.id] : undefined;
  const canAdvance =
    isEmailStep          ? isEmailValid && emailTouched === false ? false : isEmailValid :
    isText               ? !!(currentVal as string)?.trim() :
    isMulti              ? !!(currentVal as string[])?.length :
                           !!currentVal;

  /* ── Navigation ─────────────────────────────────────────────────────────── */

  const next = () => {
    if (isEmailStep) {
      const err = validateEmail(email);
      setEmailTouched(true);
      setEmailError(err);
      if (err) { emailRef.current?.focus(); return; }

      const flatAnswers: Record<string, string> = {};
      MVP_QUESTIONS.forEach((q) => {
        const v = answers[q.id];
        flatAnswers[q.id] = Array.isArray(v) ? v.join(", ") : (v as string) ?? "";
      });
      const gen = generateMVPScope(flatAnswers);

      captureToolLead({
        tool:    "mvp-scope",
        source:  "email-capture",
        email,
        selections: { ...flatAnswers, category },
        result:  { phase1Count: gen.phase1.length, phase2Count: gen.phase2.length, weekRange: gen.weekRange },
      });
      setResult(gen);
    } else {
      setStep((s) => Math.min(EMAIL_STEP, s + 1));
    }
  };

  const back  = () => setStep((s) => Math.max(0, s - 1));
  const reset = () => { setAnswers({}); setStep(0); setResult(null); setEmail(""); setEmailTouched(false); setEmailError(null); };

  /* ── Results ──────────────────────────────────────────────────────────────── */
  if (result) {
    const flatAnswers: Record<string, string> = {};
    MVP_QUESTIONS.forEach((q) => {
      const v = answers[q.id];
      flatAnswers[q.id] = Array.isArray(v) ? v.join(", ") : (v as string) ?? "";
    });

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="glass rounded-[var(--radius-card)] border border-[var(--primary)]/30 p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--primary)] mb-1">Your MVP Scope</p>
          <h2 className="font-display text-2xl font-extrabold text-[var(--fg)] mb-1">
            {flatAnswers.description || "Your product"}
          </h2>
          <p className="text-sm text-[var(--fg)]/45 mb-4">
            {flatAnswers["core-action"] ? `Core feature: ${flatAnswers["core-action"]}` : ""}
          </p>
          <div className="flex flex-wrap gap-3 text-xs">
            <span className="flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-1 text-[var(--fg)]/55">
              <IconClock size={11} /> {result.weekRange} weeks estimated
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-1 text-[var(--fg)]/55">
              Stack: {result.stackHint}
            </span>
          </div>
        </div>

        {/* Insights */}
        {result.insights.length > 0 && (
          <div className="rounded-[var(--radius-card)] border border-amber-400/25 bg-amber-500/5 p-5">
            <p className="flex items-center gap-2 font-heading font-semibold text-amber-400 text-sm mb-3">
              <IconBulb size={14} /> Strategic insight{result.insights.length > 1 ? "s" : ""} for your build
            </p>
            <div className="space-y-3">
              {result.insights.map((ins, i) => (
                <p key={i} className="text-sm text-[var(--fg)]/60 leading-relaxed pl-4 border-l-2 border-amber-400/30">{ins}</p>
              ))}
            </div>
          </div>
        )}

        {/* Phase 1 */}
        <div className="rounded-[var(--radius-card)] border border-emerald-500/25 bg-emerald-500/5 p-6">
          <h3 className="font-display font-bold text-emerald-400 mb-1 flex items-center gap-2">
            <IconCheck size={16} /> Build in Phase 1 ({result.phase1.length} features)
          </h3>
          <p className="text-xs text-[var(--fg)]/40 mb-4">These are the features without which your product cannot deliver its core value.</p>
          <div className="space-y-3">
            {result.phase1.map((f) => (
              <div key={f.feature} className="flex items-start gap-3">
                <PhaseBadge phase={1} />
                <div>
                  <p className="font-heading font-semibold text-[var(--fg)] text-sm leading-snug">{f.feature}</p>
                  <p className="text-xs text-[var(--fg)]/40 mt-0.5 leading-relaxed">{f.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Phase 2 */}
        <div className="rounded-[var(--radius-card)] border border-sky-500/20 bg-sky-500/5 p-6">
          <h3 className="font-display font-bold text-sky-400 mb-1 flex items-center gap-2">
            <IconArrowRight size={16} /> Build after you have paying users ({result.phase2.length} features)
          </h3>
          <p className="text-xs text-[var(--fg)]/40 mb-4">
            These are real features your users will want — just not before you&apos;ve validated the core.
          </p>
          <div className="space-y-2">
            {result.phase2.map((f) => (
              <div key={f.feature} className="flex items-start gap-3">
                <PhaseBadge phase={2} />
                <p className="text-sm text-[var(--fg)]/55 leading-snug">{f.feature}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Never build */}
        <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-5">
          <h3 className="font-heading font-semibold text-[var(--fg)]/60 text-sm mb-3 flex items-center gap-2">
            <IconX size={14} className="text-rose-400" /> Do NOT build in Phase 1
          </h3>
          <div className="space-y-1.5">
            {result.neverBuild.map((item) => (
              <div key={item} className="flex items-start gap-2 text-xs text-[var(--fg)]/45">
                <IconX size={10} className="text-rose-400 shrink-0 mt-0.5" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
          <p className="font-display font-bold text-[var(--fg)] mb-1">Ready to build Phase 1?</p>
          <p className="text-sm text-[var(--fg)]/50 mb-5">
            Full scope sent to <strong>{email}</strong>. Get an exact cost and timeline for your Phase 1 feature set.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href={`/quote?scope=${encodeURIComponent(flatAnswers.description ?? "")}&features=${result.phase1.length}`}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-[var(--primary)] px-7 font-semibold text-sm text-[var(--bg)] hover:opacity-90 transition-opacity"
            >
              Get a quote for Phase 1 <IconArrowRight size={14} />
            </Link>
            <Link href="/tools/cost-estimator"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-[var(--border)] px-6 text-sm font-semibold text-[var(--fg)]/60 hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors">
              Estimate the cost
            </Link>
            <button type="button" onClick={reset}
              className="text-sm text-[var(--fg)]/30 hover:text-[var(--fg)] transition-colors px-4">
              Start over
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Email gate ──────────────────────────────────────────────────────────── */
  if (isEmailStep) {
    return (
      <div className="flex gap-8 max-w-3xl mx-auto">
        <AnswersSidebar answers={answers} questions={MVP_QUESTIONS} step={step} />
        <div className="flex-1 min-w-0">
          <div className="w-full bg-[var(--border)] rounded-full h-1.5 mb-8">
            <div className="bg-[var(--primary)] h-1.5 rounded-full w-[90%]" />
          </div>
          <p className="font-mono text-[var(--primary)] text-[10px] uppercase tracking-[0.25em] mb-3">Almost done</p>
          <h2 className="font-display text-2xl font-extrabold text-[var(--fg)] mb-2">
            Where should we send your scope?
          </h2>
          <p className="text-sm text-[var(--fg)]/45 mb-8 leading-relaxed">
            You&apos;ll receive a full Phase 1 / Phase 2 feature list, strategic notes, and a stack recommendation — ready to share with your co-founders or investors.
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
                  emailTouched && emailError
                    ? "border-rose-400 focus:border-rose-400 focus:ring-rose-400/20"
                    : isEmailValid && emailTouched
                    ? "border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/20"
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
                Generate my MVP scope →
              </button>
              <button type="button" onClick={back}
                className="text-sm text-[var(--fg)]/40 hover:text-[var(--fg)] transition-colors">
                ← Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Question step ───────────────────────────────────────────────────────── */
  const progress = (step / (Q_COUNT + 1)) * 100;

  return (
    <div className="flex gap-8 max-w-3xl mx-auto">
      <AnswersSidebar answers={answers} questions={MVP_QUESTIONS} step={step} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[var(--primary)] text-[10px] uppercase tracking-[0.2em]">
            Question {step + 1} of {Q_COUNT}
          </span>
          {isMulti && (
            <span className="text-[10px] font-mono text-[var(--fg)]/30 bg-[var(--surface)] border border-[var(--border)] px-2 py-0.5 rounded-full">
              Select all that apply
            </span>
          )}
        </div>
        <div className="w-full bg-[var(--border)] rounded-full h-1.5 mb-8">
          <motion.div className="bg-[var(--primary)] h-1.5 rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="font-display text-xl font-extrabold text-[var(--fg)] mb-1 leading-snug">
              {currentQ?.question}
            </h2>
            <p className="text-sm text-[var(--fg)]/40 mb-6 leading-relaxed">{currentQ?.subtitle}</p>

            {/* Text input */}
            {isText && (
              <div>
                <textarea
                  autoFocus
                  value={(currentVal as string) ?? ""}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder={currentQ?.placeholder}
                  maxLength={currentQ?.maxLength}
                  rows={3}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--fg)] placeholder:text-[var(--fg)]/25 focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]/20 transition-colors resize-none"
                />
                <div className="flex justify-end mt-1">
                  <span className="text-[10px] text-[var(--fg)]/25">
                    {(currentVal as string)?.length ?? 0} / {currentQ?.maxLength}
                  </span>
                </div>
              </div>
            )}

            {/* Single select */}
            {!isText && !isMulti && (
              <div className="space-y-2.5">
                {currentQ?.options?.map((opt) => {
                  const sel = currentVal === opt.id;
                  return (
                    <button key={opt.id} type="button"
                      onClick={() => setAnswer(opt.id)}
                      className={[
                        "flex items-center justify-between w-full rounded-xl border px-5 py-3.5 text-left transition-all group active:scale-[0.98]",
                        sel
                          ? "border-[var(--primary)] bg-[var(--primary)]/8 text-[var(--primary)]"
                          : "border-[var(--border)] hover:border-[var(--primary)]/50 hover:bg-[var(--primary)]/4",
                      ].join(" ")}>
                      <span>
                        <span className="block font-heading font-semibold text-[var(--fg)] text-sm group-hover:text-[var(--primary)] transition-colors">{opt.label}</span>
                        {opt.hint && <span className="block text-xs text-[var(--fg)]/40 mt-0.5">{opt.hint}</span>}
                      </span>
                      <span className={["flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all",
                        sel ? "bg-[var(--primary)] border-[var(--primary)]" : "border-[var(--border)]",
                      ].join(" ")}>
                        {sel && <IconCheck size={10} className="text-[var(--bg)]" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Multi-select */}
            {isMulti && (
              <div className="space-y-2.5">
                {currentQ?.options?.map((opt) => {
                  const sel = ((currentVal as string[]) ?? []).includes(opt.id);
                  return (
                    <button key={opt.id} type="button"
                      onClick={() => toggleMulti(opt.id)}
                      className={[
                        "flex items-center gap-3 w-full rounded-xl border px-5 py-3.5 text-left transition-all active:scale-[0.98]",
                        sel
                          ? "border-[var(--primary)] bg-[var(--primary)]/8"
                          : "border-[var(--border)] hover:border-[var(--primary)]/50 hover:bg-[var(--primary)]/4",
                      ].join(" ")}>
                      <span className={["flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-all",
                        sel ? "bg-[var(--primary)] border-[var(--primary)]" : "border-[var(--border)]",
                      ].join(" ")}>
                        {sel && <IconCheck size={10} className="text-[var(--bg)]" />}
                      </span>
                      <span>
                        <span className="block font-heading font-semibold text-[var(--fg)] text-sm">{opt.label}</span>
                        {opt.hint && <span className="block text-xs text-[var(--fg)]/40 mt-0.5">{opt.hint}</span>}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Nav */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-[var(--border)]">
          <button type="button" onClick={back} disabled={step === 0}
            className="text-sm text-[var(--fg)]/40 hover:text-[var(--fg)] disabled:opacity-0 transition-all">
            ← Back
          </button>
          <button type="button" onClick={next} disabled={!canAdvance}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-[var(--primary)] px-7 font-heading font-semibold text-sm text-[var(--bg)] hover:opacity-90 disabled:opacity-30 transition-all active:scale-95">
            {step === Q_COUNT - 1 ? "Continue →" : isMulti && !(currentVal as string[])?.length ? "Skip →" : "Continue →"}
          </button>
        </div>
      </div>
    </div>
  );
}
