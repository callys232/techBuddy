"use client";

import { useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { IconCheck, IconBrandWhatsapp, IconAlertCircle } from "@tabler/icons-react";
import { HIRE_ROLES, HIRE_SENIORITY, HIRE_RATE_BANDS } from "@/mock/tools";
import { captureToolLead } from "@/lib/captureToolLead";
import { validateEmail } from "@/lib/validate";
import { CurrencyApprox } from "@/components/ui/CurrencyApprox";

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2347070994391";

function fmt(n: number) {
  return "₦" + Math.round(n).toLocaleString("en-NG");
}

function FieldError({ msg }: { msg: string | null }) {
  if (!msg) return null;
  return (
    <span className="flex items-center gap-1 text-[11px] text-rose-400 mt-1">
      <IconAlertCircle size={11} className="shrink-0" />{msg}
    </span>
  );
}

export function HireRateCalculator() {
  const router   = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);
  const emailId  = useId();

  const [role,      setRole]      = useState(HIRE_ROLES[0].id);
  const [seniority, setSeniority] = useState(HIRE_SENIORITY[1].id);
  const [email,        setEmail]        = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [emailError,   setEmailError]   = useState<string | null>(null);
  const [captured,     setCaptured]     = useState(false);
  const [capBusy,      setCapBusy]      = useState(false);

  const roleObj = HIRE_ROLES.find((r) => r.id === role) ?? HIRE_ROLES[0];
  const seniorityObj = HIRE_SENIORITY.find((s) => s.id === seniority) ?? HIRE_SENIORITY[1];
  const [min, max] = HIRE_RATE_BANDS[role]?.[seniority] ?? [0, 0];
  const annualMin = min * 12;
  const annualMax = max * 12;

  const selectionsSummary = () => ({ role: roleObj.label, seniority: seniorityObj.label });
  const resultSummary = () => ({ min, max, annualMin, annualMax });

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

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkEmail() || capBusy) return;
    setCapBusy(true);
    captureToolLead({ tool: "hire-rate-calculator", source: "email-capture", email, selections: selectionsSummary(), result: resultSummary() });
    await new Promise((r) => setTimeout(r, 500));
    setCaptured(true);
    setCapBusy(false);
  };

  const handleTalent = () => {
    if (!checkEmail()) return;
    captureToolLead({ tool: "hire-rate-calculator", source: "quote-click", email, selections: selectionsSummary(), result: resultSummary() });
    router.push("/talent");
  };

  const handleWhatsApp = () => {
    if (!checkEmail()) return;
    captureToolLead({ tool: "hire-rate-calculator", source: "whatsapp-click", email, selections: selectionsSummary(), result: resultSummary() });
    const msg = [
      `Hi TechBuddy! Hire Rate Calculator result:`,
      `${seniorityObj.label} ${roleObj.label}: ${fmt(min)} – ${fmt(max)}/month`,
      `I'd like to talk about hiring through your talent network.`,
    ].join("\n");
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const isEmailValid = !validateEmail(email);

  return (
    <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">

      {/* ── Left: inputs ─────────────────────────────────────────────────── */}
      <div className="space-y-8">

        <div>
          <p className="font-heading font-semibold text-[var(--ink)] mb-3">Role</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {HIRE_ROLES.map((r) => (
              <button key={r.id} type="button" onClick={() => setRole(r.id)}
                className={[
                  "rounded-xl border px-4 py-3 text-sm font-medium text-left transition-all active:scale-[0.97]",
                  role === r.id
                    ? "border-[var(--brand)] bg-[var(--brand)]/10 text-[var(--brand)]"
                    : "border-[var(--border)] text-[var(--ink)]/60 hover:border-[var(--brand)]/50 hover:text-[var(--ink)]",
                ].join(" ")}>
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="font-heading font-semibold text-[var(--ink)] mb-3">Seniority</p>
          <div className="grid grid-cols-3 gap-2.5">
            {HIRE_SENIORITY.map((s) => (
              <button key={s.id} type="button" onClick={() => setSeniority(s.id)}
                className={[
                  "rounded-xl border px-3 py-3 text-xs font-medium text-left transition-all",
                  seniority === s.id
                    ? "border-[var(--brand)] bg-[var(--brand)]/10 text-[var(--brand)]"
                    : "border-[var(--border)] text-[var(--ink)]/55 hover:border-[var(--brand)]/40",
                ].join(" ")}>
                {s.label}
                <span className="block text-[10px] mt-1 opacity-60">{s.yearsRange}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: result card ──────────────────────────────────────────────── */}
      <div className="card p-6 sticky top-24 space-y-5">
        <div>
          <p className="font-mono text-[var(--brand)] text-[10px] uppercase tracking-[0.25em] mb-4">
            Typical monthly rate
          </p>
          <p className="font-display text-2xl font-extrabold text-[var(--ink)] leading-none mb-1">{fmt(min)}</p>
          <p className="font-display text-lg text-[var(--ink)]/40">– {fmt(max)}</p>
          <CurrencyApprox ngn={min} ngnMax={max} className="block text-xs text-[var(--ink-faint)] mt-1.5" />
        </div>

        <div className="space-y-2 text-xs text-[var(--ink)]/50">
          <div className="flex justify-between">
            <span>{seniorityObj.label} {roleObj.label}</span>
            <span>{seniorityObj.yearsRange}</span>
          </div>
          <div className="border-t border-[var(--border)] pt-2 flex justify-between font-semibold text-[var(--ink)]/70">
            <span>Annual equivalent</span>
            <span>{fmt(annualMin)} – {fmt(annualMax)}</span>
          </div>
        </div>

        {/* Email */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--page)] p-4">
          {captured ? (
            <div className="flex items-center gap-2 text-sm text-emerald-400">
              <IconCheck size={15} />
              <span>Sent to {email} — check your inbox.</span>
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit} noValidate>
              <label htmlFor={emailId} className="block text-xs font-semibold text-[var(--ink)]/70 mb-2">
                Your email <span className="text-[var(--brand)]">*</span>
                <span className="font-normal text-[var(--ink)]/35 ml-1">— required to get a copy</span>
              </label>
              <div className="flex gap-2">
                <div className="flex-1 min-w-0">
                  <input
                    id={emailId} ref={emailRef} type="email" value={email}
                    onChange={(e) => { setEmail(e.target.value); if (emailTouched) setEmailError(validateEmail(e.target.value)); }}
                    onBlur={() => { setEmailTouched(true); setEmailError(validateEmail(email)); }}
                    placeholder="you@company.ng"
                    className={[
                      "w-full rounded-lg border bg-[var(--surface)] px-3 py-2 text-xs text-[var(--ink)]",
                      "placeholder:text-[var(--ink)]/30 focus:outline-none focus:ring-1 transition-colors",
                      emailTouched && emailError
                        ? "border-rose-400 focus:border-rose-400 focus:ring-rose-400/20"
                        : isEmailValid && emailTouched
                        ? "border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                        : "border-[var(--border)] focus:border-[var(--brand)] focus:ring-[var(--brand)]/20",
                    ].join(" ")}
                  />
                  <FieldError msg={emailTouched ? emailError : null} />
                </div>
                <button type="submit" disabled={capBusy}
                  className="rounded-lg bg-[var(--brand)] px-3 py-2 text-xs font-semibold text-[var(--page)] hover:opacity-90 disabled:opacity-40 transition-opacity shrink-0 self-start">
                  {capBusy ? "…" : "Send"}
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="text-[10px] text-[var(--ink)]/30 leading-relaxed">
          General Lagos/Abuja market estimate, 2026 — not a survey result. Actual offers vary by company stage, exact skill set, and whether the role pays in a foreign currency.
        </p>

        <div className="space-y-2">
          <button type="button" onClick={handleTalent} className="btn-primary h-11 text-sm w-full">
            Browse our talent network →
          </button>
          <button type="button" onClick={handleWhatsApp}
            className="flex h-10 items-center justify-center gap-2 rounded-full border border-[var(--border)] text-xs font-semibold text-[var(--ink-muted)] hover:border-[#25D366] hover:text-[#25D366] transition-all w-full">
            <IconBrandWhatsapp size={14} />
            Send this to WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
