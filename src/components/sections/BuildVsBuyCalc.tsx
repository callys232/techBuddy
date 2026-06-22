"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { IconCheck, IconAlertCircle, IconArrowRight, IconX } from "@tabler/icons-react";
import { BVB_CATEGORIES, BVB_QUESTIONS, computeBvB, type BvBCategory } from "@/mock/build-vs-buy";
import { captureToolLead } from "@/lib/captureToolLead";
import { validateEmail } from "@/lib/validate";
import { CategoryPicker, type Category } from "@/components/ui/CategoryPicker";

const fmt = (n: number) => "₦" + Math.round(n).toLocaleString("en-NG");

const TOTAL_STEPS = BVB_QUESTIONS.length + 1; /* questions + email gate */

function RecapChips({ answers }: { answers: Record<string, string> }) {
  const chips = BVB_QUESTIONS.slice(1)
    .filter((q) => answers[q.id] && q.type === "select")
    .map((q) => {
      const opt = q.options?.find((o) => o.id === answers[q.id]);
      return opt ? { label: q.question.split("?")[0].split(" ").slice(-3).join(" "), value: opt.label } : null;
    }).filter(Boolean);

  if (!chips.length) return null;
  return (
    <div className="flex flex-wrap gap-2 mb-5">
      {chips.map((c) => c && (
        <span key={c.label} className="flex items-center gap-1.5 text-[11px] rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-[var(--fg)]/50">
          <span className="text-[var(--fg)]/30">{c.label}:</span>
          <span className="font-medium text-[var(--fg)]/75 max-w-[120px] truncate">{c.value}</span>
        </span>
      ))}
    </div>
  );
}

export function BuildVsBuyCalc() {
  const [step,      setStep]     = useState(0);
  const [answers,   setAnswers]  = useState<Record<string, string>>({});
  const [selCat,    setSelCat]   = useState<BvBCategory | null>(null);
  const [result,    setResult]   = useState<ReturnType<typeof computeBvB> | null>(null);
  const [email,     setEmail]    = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [emailError, setEmailError]   = useState<string | null>(null);
  const [industry,  setIndustry] = useState<Category>("");
  const emailRef = useRef<HTMLInputElement>(null);
  const isEmailValid = !validateEmail(email);

  const isEmailStep = step === BVB_QUESTIONS.length;
  const currentQ    = !isEmailStep ? BVB_QUESTIONS[step] : null;

  const select = (key: string, val: string) =>
    setAnswers((prev) => ({ ...prev, [key]: val }));

  const next = () => {
    if (isEmailStep) {
      const err = validateEmail(email);
      setEmailTouched(true); setEmailError(err);
      if (err) { emailRef.current?.focus(); return; }

      if (!selCat) return;
      const computed = computeBvB(answers, selCat);
      captureToolLead({
        tool: "build-vs-buy", source: "email-capture", email,
        selections: { ...answers, category: selCat.label, industry },
        result: { verdict: computed.verdict, totalBuildCost: computed.totalBuildCost, totalSaaSCost: computed.totalSaaSCost },
      });
      setResult(computed);
    } else if (currentQ?.type === "category-grid") {
      if (!selCat) return;
      select("category", selCat.id);
      setStep((s) => s + 1);
    } else {
      if (!answers[currentQ!.id]) return;
      setStep((s) => Math.min(TOTAL_STEPS - 1, s + 1));
    }
  };

  const back  = () => setStep((s) => Math.max(0, s - 1));
  const reset = () => { setStep(0); setAnswers({}); setSelCat(null); setResult(null); setEmail(""); setEmailTouched(false); setEmailError(null); };
  const canAdvance = isEmailStep ? isEmailValid : currentQ?.type === "category-grid" ? !!selCat : !!answers[currentQ?.id ?? ""];

  /* ── Results ─────────────────────────────────────────────────────────── */
  if (result && selCat) {
    const { verdict, totalBuildCost, totalSaaSCost, monthlySaaS, cheapestSaaS, breakEvenMonths, years } = result;
    const winner = verdict === "buy" ? cheapestSaaS.name : verdict === "build" ? "Custom build" : "Depends";
    const verdictColors = { build: "text-sky-400", buy: "text-emerald-400", hybrid: "text-amber-400" };
    const verdictLabels = {
      build:  "Build it custom",
      buy:    `Buy — use ${cheapestSaaS.name}`,
      hybrid: "Lean toward buying, but evaluate",
    };

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Verdict card */}
        <div className="glass rounded-[var(--radius-card)] border border-[var(--border)] p-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--primary)] mb-4">Our recommendation</p>
          <h2 className={`font-display text-3xl font-extrabold mb-1 ${verdictColors[verdict]}`}>
            {verdictLabels[verdict]}
          </h2>
          <p className="text-sm text-[var(--fg)]/45 mb-6">
            For {selCat.label} — over {years} year{years > 1 ? "s" : ""}
          </p>

          {/* Cost comparison */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className={`rounded-xl border p-5 ${verdict !== "buy" ? "border-sky-500/30 bg-sky-500/5" : "border-[var(--border)]"}`}>
              <p className="font-mono text-xs uppercase tracking-wide text-[var(--fg)]/40 mb-1">Build custom</p>
              <p className="font-display text-2xl font-extrabold text-[var(--fg)]">{fmt(totalBuildCost)}</p>
              <p className="text-xs text-[var(--fg)]/35 mt-1">over {years} years (incl. maintenance)</p>
              <ul className="mt-3 space-y-1">
                {selCat.buildPros.map((p) => <li key={p} className="flex items-start gap-1.5 text-xs text-[var(--fg)]/55"><IconCheck size={10} className="text-sky-400 shrink-0 mt-0.5" />{p}</li>)}
              </ul>
            </div>
            <div className={`rounded-xl border p-5 ${verdict === "buy" ? "border-emerald-500/30 bg-emerald-500/5" : "border-[var(--border)]"}`}>
              <p className="font-mono text-xs uppercase tracking-wide text-[var(--fg)]/40 mb-1">Buy ({cheapestSaaS.name})</p>
              <p className="font-display text-2xl font-extrabold text-[var(--fg)]">{fmt(totalSaaSCost)}</p>
              <p className="text-xs text-[var(--fg)]/35 mt-1">
                {monthlySaaS === 0 ? "Free tier available" : `${fmt(monthlySaaS)}/mo × ${years * 12} months`}
              </p>
              <ul className="mt-3 space-y-1">
                {selCat.buyPros.map((p) => <li key={p} className="flex items-start gap-1.5 text-xs text-[var(--fg)]/55"><IconCheck size={10} className="text-emerald-400 shrink-0 mt-0.5" />{p}</li>)}
              </ul>
            </div>
          </div>

          {/* Break-even */}
          {breakEvenMonths && breakEvenMonths > 0 && monthlySaaS > 0 && (
            <p className="mt-4 text-sm text-[var(--fg)]/50 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
              📊 Break-even: building becomes cheaper than {cheapestSaaS.name} after{" "}
              <strong className="text-[var(--fg)]">{breakEvenMonths} months</strong>
              {breakEvenMonths > 36
                ? " — buying is more economical at your timeline."
                : " — building makes financial sense over 3+ years."}
            </p>
          )}
        </div>

        {/* When to build / when to buy */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-5">
            <p className="font-heading font-semibold text-sky-400 text-xs mb-3 uppercase tracking-wide">Build when</p>
            <p className="text-sm text-[var(--fg)]/60 leading-relaxed">{selCat.buildWhen}</p>
          </div>
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
            <p className="font-heading font-semibold text-emerald-400 text-xs mb-3 uppercase tracking-wide">Buy when</p>
            <p className="text-sm text-[var(--fg)]/60 leading-relaxed">{selCat.buyWhen}</p>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
          <p className="font-heading font-bold text-[var(--fg)] mb-1">
            {verdict === "buy" ? "Want us to set up the right SaaS tools for your stack?" : "Ready to build it properly?"}
          </p>
          <p className="text-sm text-[var(--fg)]/45 mb-5">
            Full analysis sent to <strong>{email}</strong>.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href={`/quote?service=${encodeURIComponent(selCat.label)}`}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-[var(--primary)] px-7 font-semibold text-sm text-[var(--bg)] hover:opacity-90 transition-opacity">
              {verdict === "buy" ? "Get setup help →" : "Get a build quote"} <IconArrowRight size={14} />
            </Link>
            <button type="button" onClick={reset}
              className="inline-flex h-11 items-center px-5 text-sm text-[var(--fg)]/30 hover:text-[var(--fg)] transition-colors">
              Start over
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Email gate ────────────────────────────────────────────────────────── */
  if (isEmailStep) {
    return (
      <div className="max-w-xl mx-auto">
        <div className="w-full bg-[var(--border)] rounded-full h-1.5 mb-8">
          <div className="bg-[var(--primary)] h-1.5 rounded-full w-[92%]" />
        </div>
        <p className="font-mono text-[var(--primary)] text-[10px] uppercase tracking-[0.25em] mb-3">Almost done</p>
        <h2 className="font-display text-2xl font-extrabold text-[var(--fg)] mb-2">
          Where should we send your analysis?
        </h2>
        <p className="text-sm text-[var(--fg)]/45 mb-8 leading-relaxed">
          You&apos;ll get the full 3-year cost comparison, break-even analysis, and a clear recommendation to share with your team.
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
              placeholder="you@company.ng"
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
              Show my analysis →
            </button>
            <button type="button" onClick={back} className="text-sm text-[var(--fg)]/40 hover:text-[var(--fg)] transition-colors">← Back</button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Questions ────────────────────────────────────────────────────────── */
  const progress = (step / TOTAL_STEPS) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[var(--primary)] text-[10px] uppercase tracking-[0.2em]">
          {step === 0 ? "Step 1 of 7" : `Step ${step + 1} of ${BVB_QUESTIONS.length + 1}`}
        </span>
      </div>
      <div className="w-full bg-[var(--border)] rounded-full h-1.5 mb-8">
        <motion.div className="bg-[var(--primary)] h-1.5 rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
      </div>

      {step > 0 && <RecapChips answers={answers} />}

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>

          {/* Category grid */}
          {currentQ?.type === "category-grid" && (
            <div>
              <h2 className="font-display text-2xl font-extrabold text-[var(--fg)] mb-2">{currentQ.question}</h2>
              <p className="text-sm text-[var(--fg)]/45 mb-6">{currentQ.subtitle}</p>
              <div className="grid sm:grid-cols-3 gap-3">
                {BVB_CATEGORIES.map((cat) => {
                  const on = selCat?.id === cat.id;
                  return (
                    <button key={cat.id} type="button" onClick={() => setSelCat(cat)}
                      className={[
                        "flex items-start gap-3 rounded-xl border p-4 text-left transition-all active:scale-[0.97]",
                        on ? "border-[var(--primary)] bg-[var(--primary)]/8" : "border-[var(--border)] hover:border-[var(--primary)]/40 bg-[var(--surface)]",
                      ].join(" ")}>
                      <span className="text-xl shrink-0">{cat.icon}</span>
                      <span>
                        <span className={`block font-heading font-semibold text-sm leading-snug ${on ? "text-[var(--primary)]" : "text-[var(--fg)]"}`}>{cat.label}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Single-select questions */}
          {currentQ?.type === "select" && (
            <div>
              <h2 className="font-display text-2xl font-extrabold text-[var(--fg)] mb-2">{currentQ.question}</h2>
              <p className="text-sm text-[var(--fg)]/45 mb-6">{currentQ.subtitle}</p>
              <div className="space-y-3">
                {currentQ.options?.map((opt) => {
                  const on = answers[currentQ.id] === opt.id;
                  return (
                    <button key={opt.id} type="button" onClick={() => select(currentQ.id, opt.id)}
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
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between mt-10 pt-6 border-t border-[var(--border)]">
        <button type="button" onClick={back} disabled={step === 0}
          className="text-sm text-[var(--fg)]/40 hover:text-[var(--fg)] disabled:opacity-0 transition-all">← Back</button>
        <button type="button" onClick={next} disabled={!canAdvance}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-[var(--primary)] px-7 font-heading font-semibold text-sm text-[var(--bg)] hover:opacity-90 disabled:opacity-30 transition-all active:scale-95">
          {step === BVB_QUESTIONS.length - 1 ? "Continue →" : "Continue →"}
        </button>
      </div>
    </div>
  );
}
