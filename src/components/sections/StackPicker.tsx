"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { IconAlertCircle, IconCheck } from "@tabler/icons-react";
import { STACK_RECOMMENDATIONS } from "@/mock/tools";
import { captureToolLead } from "@/lib/captureToolLead";
import { validateEmail } from "@/lib/validate";

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
      { id: "webapp",    label: "Web application",   hint: "SaaS, portal, internal tool" },
      { id: "mobile",    label: "Mobile app",         hint: "iOS + Android" },
      { id: "ecommerce", label: "E-commerce store",  hint: "Catalog, cart, checkout" },
      { id: "api",       label: "API / Backend only", hint: "Microservice or data platform" },
    ],
  },
  {
    id: "scale",
    q: "Expected users in year 1?",
    options: [
      { id: "small",  label: "< 1,000",        hint: "MVP / internal" },
      { id: "medium", label: "1,000 – 50,000",  hint: "Growth-stage" },
      { id: "large",  label: "50,000+",         hint: "Scale from day 1" },
    ],
  },
  {
    id: "payments",
    q: "Do you need payment processing?",
    options: [
      { id: "nigeria", label: "Yes — Nigerian payments", hint: "Paystack / Flutterwave" },
      { id: "global",  label: "Yes — International",     hint: "Stripe + Paystack" },
      { id: "none",    label: "No payments needed" },
    ],
  },
  {
    id: "offline",
    q: "Do users need offline access?",
    options: [
      { id: "yes", label: "Yes — offline-first", hint: "Field ops, low-bandwidth areas" },
      { id: "no",  label: "No — always online" },
    ],
  },
];

function pickStack(answers: Record<string, string>) {
  if (answers.product === "mobile")
    return STACK_RECOMMENDATIONS.find((s) => s.id === "react-native")!;
  if (answers.scale === "large" || answers.product === "api")
    return STACK_RECOMMENDATIONS.find((s) => s.id === "nextjs-node")!;
  if (answers.payments === "global" || answers.product === "ecommerce")
    return STACK_RECOMMENDATIONS.find((s) => s.id === "nextjs-django")!;
  return STACK_RECOMMENDATIONS.find((s) => s.id === "nextjs-supabase")!;
}

/* Total steps: 4 questions + 1 email gate = 5 before result */
const TOTAL = QUESTIONS.length + 1; // +1 for email step

export function StackPicker() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [step,    setStep]    = useState(0);
  const [result,  setResult]  = useState<(typeof STACK_RECOMMENDATIONS)[0] | null>(null);

  /* Email gate state */
  const [email,        setEmail]        = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [emailError,   setEmailError]   = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const isEmailValid = !validateEmail(email);

  const answer = (optId: string) => {
    const next = { ...answers, [QUESTIONS[step].id]: optId };
    setAnswers(next);
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      /* Last question answered — move to email gate */
      setStep(QUESTIONS.length); // email step
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateEmail(email);
    setEmailTouched(true);
    setEmailError(err);
    if (err) { emailRef.current?.focus(); return; }

    const rec = pickStack(answers);
    /* Capture lead */
    captureToolLead({
      tool:    "stack-picker",
      source:  "email-capture",
      email,
      selections: Object.entries(answers).reduce<Record<string, string>>((acc, [k, v]) => {
        const q = QUESTIONS.find((q) => q.id === k);
        const o = q?.options.find((o) => o.id === v);
        return { ...acc, [q?.q ?? k]: o?.label ?? v };
      }, {}),
      result: { stack: rec.name, tagline: rec.tagline },
    });
    setResult(rec);
  };

  const back = () => setStep((s) => Math.max(0, s - 1));

  const reset = () => { setAnswers({}); setStep(0); setResult(null); setEmail(""); setEmailTouched(false); setEmailError(null); };

  /* ── Result view ─────────────────────────────────────────────────────────── */
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

          <p className="text-sm text-[var(--fg)]/60 leading-relaxed mb-4">{result.why}</p>

          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-xs text-emerald-400 mb-6">
            <IconCheck size={13} className="shrink-0" />
            Full stack recommendation sent to <strong className="ml-1">{email}</strong>
          </div>

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

  /* ── Email gate (step === QUESTIONS.length) ──────────────────────────────── */
  if (step === QUESTIONS.length) {
    return (
      <div className="max-w-xl mx-auto">
        {/* Progress */}
        <div className="flex gap-1.5 mb-8">
          {Array.from({ length: TOTAL }, (_, i) => (
            <div key={i} className={["h-1 flex-1 rounded-full transition-all duration-300", i < step ? "bg-[var(--primary)]" : i === step ? "bg-[var(--primary)]/50" : "bg-[var(--border)]"].join(" ")} />
          ))}
        </div>

        <p className="font-mono text-[var(--primary)] text-[10px] uppercase tracking-[0.25em] mb-3">
          Almost done
        </p>
        <h2 className="font-display text-2xl font-bold text-[var(--fg)] mb-2">
          Where should we send your recommendation?
        </h2>
        <p className="text-sm text-[var(--fg)]/45 mb-8 leading-relaxed">
          We&apos;ll email you the full stack breakdown with setup guides. Free, no spam.
        </p>

        <form onSubmit={handleEmailSubmit} noValidate className="space-y-4">
          <div>
            <label className="block font-heading text-sm font-semibold text-[var(--fg)] mb-1.5">
              Email address <span className="text-[var(--primary)]">*</span>
            </label>
            <input
              ref={emailRef}
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

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-[var(--primary)] px-7 font-semibold text-sm text-[var(--bg)] hover:opacity-90 transition-all active:scale-95"
            >
              Show my recommendation →
            </button>
            <button type="button" onClick={back}
              className="text-sm text-[var(--fg)]/40 hover:text-[var(--fg)] transition-colors">
              ← Back
            </button>
          </div>
        </form>
      </div>
    );
  }

  /* ── Questions ───────────────────────────────────────────────────────────── */
  const current = QUESTIONS[step];

  return (
    <div className="max-w-xl mx-auto">
      {/* Progress */}
      <div className="flex gap-1.5 mb-8">
        {Array.from({ length: TOTAL }, (_, i) => (
          <div key={i} className={["h-1 flex-1 rounded-full transition-all duration-300", i < step ? "bg-[var(--primary)]" : i === step ? "bg-[var(--primary)]" : "bg-[var(--border)]"].join(" ")} />
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
              {opt.hint && <span className="block text-xs text-[var(--fg)]/40 mt-0.5">{opt.hint}</span>}
            </span>
            <span className="text-[var(--fg)]/20 group-hover:text-[var(--primary)] transition-colors text-lg">→</span>
          </button>
        ))}
      </div>

      {step > 0 && (
        <button type="button" onClick={back}
          className="mt-6 text-xs text-[var(--fg)]/30 hover:text-[var(--fg)]/60 transition-colors">
          ← Back
        </button>
      )}
    </div>
  );
}
