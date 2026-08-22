"use client";

import { useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { IconCheck, IconBrandWhatsapp, IconAlertCircle } from "@tabler/icons-react";
import { DOWNTIME_BUSINESS_TYPES } from "@/mock/tools";
import { captureToolLead } from "@/lib/captureToolLead";
import { validateEmail } from "@/lib/validate";
import { CurrencyApprox } from "@/components/ui/CurrencyApprox";

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2348000000000";

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

export function DowntimeCostCalculator() {
  const router   = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);
  const emailId  = useId();

  const [businessType, setBusinessType] = useState(DOWNTIME_BUSINESS_TYPES[0].id);
  const [monthlyRevenue, setMonthlyRevenue] = useState(5_000_000);
  const [hoursDown,    setHoursDown]    = useState(2);
  const [teamSize,     setTeamSize]     = useState(5);
  const [avgHourlyCost, setAvgHourlyCost] = useState(3_000);
  const [email,        setEmail]        = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [emailError,   setEmailError]   = useState<string | null>(null);
  const [captured,     setCaptured]     = useState(false);
  const [capBusy,      setCapBusy]      = useState(false);

  const bt = DOWNTIME_BUSINESS_TYPES.find((b) => b.id === businessType) ?? DOWNTIME_BUSINESS_TYPES[0];
  const hourlyRevenue = monthlyRevenue / (30 * 24);
  const revenueAtRisk = hourlyRevenue * bt.revenueFactor * hoursDown;
  const teamCost = teamSize * avgHourlyCost * hoursDown;
  const total = revenueAtRisk + teamCost;

  const selectionsSummary = () => ({ businessType: bt.label, monthlyRevenue, hoursDown, teamSize, avgHourlyCost });
  const resultSummary = () => ({ revenueAtRisk: Math.round(revenueAtRisk), teamCost: Math.round(teamCost), total: Math.round(total) });

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
    captureToolLead({ tool: "downtime-cost-calculator", source: "email-capture", email, selections: selectionsSummary(), result: resultSummary() });
    await new Promise((r) => setTimeout(r, 500));
    setCaptured(true);
    setCapBusy(false);
  };

  const handleQuote = () => {
    if (!checkEmail()) return;
    captureToolLead({ tool: "downtime-cost-calculator", source: "quote-click", email, selections: selectionsSummary(), result: resultSummary() });
    router.push(`/quote?service=${encodeURIComponent("Cloud & Scaling")}`);
  };

  const handleWhatsApp = () => {
    if (!checkEmail()) return;
    captureToolLead({ tool: "downtime-cost-calculator", source: "whatsapp-click", email, selections: selectionsSummary(), result: resultSummary() });
    const msg = [
      `Hi TechAgency! Downtime Cost Calculator result:`,
      `Business type: ${bt.label}`,
      `${hoursDown}h of downtime costs us ~${fmt(total)} (${fmt(revenueAtRisk)} revenue + ${fmt(teamCost)} team cost).`,
      `I'd like to talk about reducing this risk.`,
    ].join("\n");
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const isEmailValid = !validateEmail(email);

  return (
    <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">

      {/* ── Left: inputs ─────────────────────────────────────────────────── */}
      <div className="space-y-8">

        <div>
          <p className="font-heading font-semibold text-[var(--ink)] mb-3">What kind of business?</p>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {DOWNTIME_BUSINESS_TYPES.map((b) => (
              <button key={b.id} type="button" onClick={() => setBusinessType(b.id)}
                className={[
                  "rounded-xl border px-4 py-3 text-sm font-medium text-left transition-all active:scale-[0.97]",
                  businessType === b.id
                    ? "border-[var(--brand)] bg-[var(--brand)]/10 text-[var(--brand)]"
                    : "border-[var(--border)] text-[var(--ink)]/60 hover:border-[var(--brand)]/50 hover:text-[var(--ink)]",
                ].join(" ")}>
                {b.label}
                <span className="block text-[11px] mt-1 opacity-60 font-normal">{b.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="font-heading font-semibold text-[var(--ink)] mb-3">Monthly revenue</p>
          <input
            type="range" min={100_000} max={100_000_000} step={100_000}
            value={monthlyRevenue}
            onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
            aria-label="Monthly revenue"
            className="w-full accent-[var(--brand)]"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-[var(--ink)]/35">₦100k</span>
            <span className="font-display text-xl font-extrabold text-[var(--brand)]">{fmt(monthlyRevenue)}</span>
            <span className="text-xs text-[var(--ink)]/35">₦100M+</span>
          </div>
        </div>

        <div>
          <p className="font-heading font-semibold text-[var(--ink)] mb-3">Hours of downtime</p>
          <input
            type="range" min={0.5} max={24} step={0.5}
            value={hoursDown}
            onChange={(e) => setHoursDown(Number(e.target.value))}
            aria-label="Hours of downtime"
            className="w-full accent-[var(--brand)]"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-[var(--ink)]/35">30 min</span>
            <span className="font-display text-xl font-extrabold text-[var(--brand)]">{hoursDown}h</span>
            <span className="text-xs text-[var(--ink)]/35">24h</span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <p className="font-heading font-semibold text-[var(--ink)] mb-3">Team size affected</p>
            <input
              type="number" min={1} max={200} value={teamSize}
              onChange={(e) => setTeamSize(Math.max(1, Number(e.target.value)))}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--brand)]"
            />
          </div>
          <div>
            <p className="font-heading font-semibold text-[var(--ink)] mb-3">Avg. hourly cost per person</p>
            <input
              type="number" min={500} step={500} value={avgHourlyCost}
              onChange={(e) => setAvgHourlyCost(Math.max(0, Number(e.target.value)))}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--brand)]"
            />
          </div>
        </div>
      </div>

      {/* ── Right: result card ──────────────────────────────────────────────── */}
      <div className="card p-6 sticky top-24 space-y-5">
        <div>
          <p className="font-mono text-[var(--brand)] text-[10px] uppercase tracking-[0.25em] mb-4">
            Cost of this outage
          </p>
          <p className="font-display text-3xl font-extrabold text-[var(--ink)] leading-none mb-1">{fmt(total)}</p>
          <p className="text-xs text-[var(--ink)]/40 mt-1">for {hoursDown}h down, {bt.label.toLowerCase()}</p>
          <CurrencyApprox ngn={total} className="block text-xs text-[var(--ink-faint)] mt-1.5" />
        </div>

        <div className="space-y-2 text-xs text-[var(--ink)]/50">
          <div className="flex justify-between">
            <span>Revenue at risk</span>
            <span>{fmt(revenueAtRisk)}</span>
          </div>
          <div className="flex justify-between">
            <span>Team productivity cost</span>
            <span>{fmt(teamCost)}</span>
          </div>
          <div className="border-t border-[var(--border)] pt-2 flex justify-between font-semibold text-[var(--ink)]/70">
            <span>Total</span>
            <span>{fmt(total)}</span>
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
          A modelled estimate, not a measurement of your actual infrastructure. Useful for framing risk, not a guarantee.
        </p>

        <div className="space-y-2">
          <button type="button" onClick={handleQuote} className="btn-primary h-11 text-sm w-full">
            Talk to us about reliability →
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
