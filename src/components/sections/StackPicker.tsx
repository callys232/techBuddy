"use client";

import { useState } from "react";
import Link from "next/link";
import { STACK_RECOMMENDATIONS } from "@/mock/tools";

interface Question {
  id: string;
  q: string;
  options: { id: string; label: string; hint?: string }[];
}

const QUESTIONS: Question[] = [
  {
    id: "product",
    q: "What are you building?",
    options: [
      { id: "webapp",    label: "Web application",    hint: "SaaS, portal, internal tool" },
      { id: "mobile",    label: "Mobile app",          hint: "iOS + Android" },
      { id: "ecommerce", label: "E-commerce store",   hint: "Catalog, cart, checkout" },
      { id: "api",       label: "API / Backend only",  hint: "Microservice or data platform" },
    ],
  },
  {
    id: "scale",
    q: "Expected users in year 1?",
    options: [
      { id: "small",    label: "< 1,000",       hint: "MVP / internal" },
      { id: "medium",   label: "1,000 – 50,000", hint: "Growth-stage" },
      { id: "large",    label: "50,000+",        hint: "Scale from day 1" },
    ],
  },
  {
    id: "payments",
    q: "Do you need payment processing?",
    options: [
      { id: "nigeria",  label: "Yes — Nigerian payments",      hint: "Paystack / Flutterwave" },
      { id: "global",   label: "Yes — International",          hint: "Stripe + Paystack" },
      { id: "none",     label: "No payments needed" },
    ],
  },
  {
    id: "offline",
    q: "Do users need offline access?",
    options: [
      { id: "yes",  label: "Yes — offline-first",   hint: "Field ops, low-bandwidth areas" },
      { id: "no",   label: "No — always online" },
    ],
  },
];

function pickStack(answers: Record<string, string>) {
  if (answers.product === "mobile") return STACK_RECOMMENDATIONS.find((s) => s.id === "react-native")!;
  if (answers.scale === "large" || answers.product === "api")
    return STACK_RECOMMENDATIONS.find((s) => s.id === "nextjs-node")!;
  if (answers.payments === "global" || answers.product === "ecommerce")
    return STACK_RECOMMENDATIONS.find((s) => s.id === "nextjs-django")!;
  return STACK_RECOMMENDATIONS.find((s) => s.id === "nextjs-supabase")!;
}

export function StackPicker() {
  const [answers,  setAnswers]  = useState<Record<string, string>>({});
  const [step,     setStep]     = useState(0);
  const [result,   setResult]   = useState<(typeof STACK_RECOMMENDATIONS)[0] | null>(null);

  const current = QUESTIONS[step];

  const answer = (optId: string) => {
    const next = { ...answers, [current.id]: optId };
    setAnswers(next);
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setResult(pickStack(next));
    }
  };

  const reset = () => { setAnswers({}); setStep(0); setResult(null); };

  if (result) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="glass rounded-[var(--radius-card)] p-8 border border-[var(--primary)]/30">
          <p className="font-mono text-[var(--primary)] text-[10px] uppercase tracking-[0.25em] mb-3">
            Recommended stack
          </p>
          <h2 className="font-display text-3xl font-extrabold text-[var(--fg)] mb-1">{result.name}</h2>
          <p className="text-[var(--fg)]/50 mb-6">{result.tagline}</p>

          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            {result.stack.map((s) => (
              <div key={s.role} className="flex items-center gap-3 glass rounded-xl px-4 py-3 border border-[var(--border)]">
                <span className="text-xs text-[var(--fg)]/40 w-20 shrink-0">{s.role}</span>
                <span className="font-mono text-xs text-[var(--primary)]">{s.tech}</span>
              </div>
            ))}
          </div>

          <p className="text-sm text-[var(--fg)]/60 leading-relaxed mb-8">{result.why}</p>

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/quote?stack=${encodeURIComponent(result.name)}`}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-[var(--primary)] px-7 font-semibold text-sm text-[var(--bg)] hover:opacity-90 hover:shadow-[var(--shadow-glow-sky)] transition-all active:scale-95"
            >
              Build this with us →
            </Link>
            <button
              type="button"
              onClick={reset}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-[var(--border)] px-7 text-sm font-semibold text-[var(--fg)]/60 hover:border-[var(--primary)] hover:text-[var(--fg)] transition-all"
            >
              Start over
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      {/* Progress */}
      <div className="flex gap-1.5 mb-8">
        {QUESTIONS.map((_, i) => (
          <div
            key={i}
            className={[
              "h-1 flex-1 rounded-full transition-all duration-300",
              i <= step ? "bg-[var(--primary)]" : "bg-[var(--border)]",
            ].join(" ")}
          />
        ))}
      </div>

      <p className="font-mono text-[var(--primary)] text-[10px] uppercase tracking-[0.25em] mb-3">
        Question {step + 1} of {QUESTIONS.length}
      </p>
      <h2 className="font-display text-2xl font-bold text-[var(--fg)] mb-6">{current.q}</h2>

      <div className="flex flex-col gap-3">
        {current.options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => answer(opt.id)}
            className="flex items-center justify-between glass rounded-xl border border-[var(--border)] px-5 py-4 text-left hover:border-[var(--primary)]/60 hover:bg-[var(--primary)]/5 transition-all group active:scale-[0.98]"
          >
            <span>
              <span className="block font-heading font-semibold text-[var(--fg)] group-hover:text-[var(--primary)] transition-colors">
                {opt.label}
              </span>
              {opt.hint && (
                <span className="block text-xs text-[var(--fg)]/40 mt-0.5">{opt.hint}</span>
              )}
            </span>
            <span className="text-[var(--fg)]/20 group-hover:text-[var(--primary)] transition-colors text-lg">→</span>
          </button>
        ))}
      </div>

      {step > 0 && (
        <button
          type="button"
          onClick={() => setStep(step - 1)}
          className="mt-6 text-xs text-[var(--fg)]/30 hover:text-[var(--fg)]/60 transition-colors"
        >
          ← Back
        </button>
      )}
    </div>
  );
}
