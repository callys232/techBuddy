"use client";

import { useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { IconCheck, IconBrandWhatsapp, IconAlertCircle, IconTrendingDown } from "@tabler/icons-react";
import { FEE_PROVIDERS, computeProviderFee } from "@/mock/tools";
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

export function FintechFeesCalculator() {
  const router   = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);
  const emailId  = useId();

  const [amount,      setAmount]      = useState(50_000);
  const [cardType,    setCardType]    = useState<"local" | "intl">("local");
  const [txPerMonth,  setTxPerMonth]  = useState(200);
  const [email,       setEmail]       = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [emailError,  setEmailError]  = useState<string | null>(null);
  const [captured,    setCaptured]    = useState(false);
  const [capBusy,     setCapBusy]     = useState(false);

  const fees = FEE_PROVIDERS.map((p) => ({
    provider: p,
    perTx: computeProviderFee(p, amount, cardType),
  }));
  const cheapest = fees.reduce((a, b) => (b.perTx < a.perTx ? b : a), fees[0]);
  const priciest = fees.reduce((a, b) => (b.perTx > a.perTx ? b : a), fees[0]);
  const monthlySavings = (priciest.perTx - cheapest.perTx) * txPerMonth;

  const selectionsSummary = () => ({ amount, cardType, txPerMonth });
  const resultSummary = () => ({
    cheapest: cheapest.provider.name,
    cheapestFee: Math.round(cheapest.perTx),
    priciestFee: Math.round(priciest.perTx),
    monthlySavings: Math.round(monthlySavings),
  });

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
    captureToolLead({ tool: "fintech-fees-calculator", source: "email-capture", email, selections: selectionsSummary(), result: resultSummary() });
    await new Promise((r) => setTimeout(r, 500));
    setCaptured(true);
    setCapBusy(false);
  };

  const handleQuote = () => {
    if (!checkEmail()) return;
    captureToolLead({ tool: "fintech-fees-calculator", source: "quote-click", email, selections: selectionsSummary(), result: resultSummary() });
    router.push(`/quote?service=${encodeURIComponent("Fintech & Payments")}`);
  };

  const handleWhatsApp = () => {
    if (!checkEmail()) return;
    captureToolLead({ tool: "fintech-fees-calculator", source: "whatsapp-click", email, selections: selectionsSummary(), result: resultSummary() });
    const msg = [
      `Hi TechBuddy! Fintech Fees Calculator result:`,
      `Amount: ${fmt(amount)} (${cardType === "local" ? "local card" : "international card"})`,
      `Cheapest: ${cheapest.provider.name} at ${fmt(cheapest.perTx)}/tx`,
      `At ${txPerMonth} tx/month, that's ${fmt(monthlySavings)} saved vs ${priciest.provider.name}.`,
      `I'd like help integrating payments.`,
    ].join("\n");
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const isEmailValid = !validateEmail(email);

  return (
    <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">

      {/* ── Left: inputs ─────────────────────────────────────────────────── */}
      <div className="space-y-8">

        <div>
          <p className="font-heading font-semibold text-[var(--ink)] mb-3">Transaction amount</p>
          <input
            type="range" min={1000} max={2_000_000} step={1000}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            aria-label="Transaction amount"
            className="w-full accent-[var(--brand)]"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-[var(--ink)]/35">₦1k</span>
            <span className="font-display text-xl font-extrabold text-[var(--brand)]">{fmt(amount)}</span>
            <span className="text-xs text-[var(--ink)]/35">₦2M</span>
          </div>
        </div>

        <div>
          <p className="font-heading font-semibold text-[var(--ink)] mb-3">Card type</p>
          <div className="grid grid-cols-2 gap-2.5">
            {(["local", "intl"] as const).map((ct) => (
              <button key={ct} type="button" onClick={() => setCardType(ct)}
                className={[
                  "rounded-xl border px-4 py-3 text-sm font-medium text-left transition-all active:scale-[0.97]",
                  cardType === ct
                    ? "border-[var(--brand)] bg-[var(--brand)]/10 text-[var(--brand)]"
                    : "border-[var(--border)] text-[var(--ink)]/60 hover:border-[var(--brand)]/50 hover:text-[var(--ink)]",
                ].join(" ")}>
                {ct === "local" ? "Local (Verve/Naira card)" : "International (Visa/Mastercard)"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="font-heading font-semibold text-[var(--ink)] mb-3">Transactions per month</p>
          <input
            type="range" min={1} max={5000} step={1}
            value={txPerMonth}
            onChange={(e) => setTxPerMonth(Number(e.target.value))}
            aria-label="Transactions per month"
            className="w-full accent-[var(--brand)]"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-[var(--ink)]/35">1</span>
            <span className="font-display text-xl font-extrabold text-[var(--brand)]">{txPerMonth.toLocaleString()}</span>
            <span className="text-xs text-[var(--ink)]/35">5,000</span>
          </div>
        </div>

        {/* Side-by-side comparison */}
        <div className="grid sm:grid-cols-2 gap-4">
          {fees.map(({ provider, perTx }) => (
            <div key={provider.id}
              className={[
                "rounded-xl border p-5",
                provider.id === cheapest.provider.id ? "border-emerald-500/40 bg-emerald-500/5" : "border-[var(--border)]",
              ].join(" ")}>
              <div className="flex items-center justify-between mb-2">
                <p className="font-heading font-bold text-[var(--ink)]">{provider.name}</p>
                {provider.id === cheapest.provider.id && (
                  <span className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-wide rounded-full bg-emerald-500/15 text-emerald-500 px-2 py-0.5">
                    <IconTrendingDown size={10} />Cheaper
                  </span>
                )}
              </div>
              <p className="font-display text-2xl font-extrabold text-[var(--ink)]">{fmt(perTx)}</p>
              <p className="text-xs text-[var(--ink)]/40 mt-1">per transaction</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right: result card ──────────────────────────────────────────────── */}
      <div className="card p-6 sticky top-24 space-y-5">
        <div>
          <p className="font-mono text-[var(--brand)] text-[10px] uppercase tracking-[0.25em] mb-4">
            Monthly savings
          </p>
          <p className="font-display text-3xl font-extrabold text-[var(--ink)] leading-none mb-1">
            {fmt(Math.max(0, monthlySavings))}
          </p>
          <p className="text-xs text-[var(--ink)]/40 mt-1">using {cheapest.provider.name} over {priciest.provider.name} at {txPerMonth.toLocaleString()} tx/month</p>
          <CurrencyApprox ngn={Math.max(0, monthlySavings)} className="block text-xs text-[var(--ink-faint)] mt-1.5" />
        </div>

        <div className="space-y-2 text-xs text-[var(--ink)]/50">
          <div className="flex justify-between">
            <span>{cheapest.provider.name} — per tx</span>
            <span>{fmt(cheapest.perTx)}</span>
          </div>
          <div className="flex justify-between">
            <span>{priciest.provider.name} — per tx</span>
            <span>{fmt(priciest.perTx)}</span>
          </div>
          <div className="border-t border-[var(--border)] pt-2 flex justify-between font-semibold text-[var(--ink)]/70">
            <span>{cheapest.provider.name} — monthly total</span>
            <span>{fmt(cheapest.perTx * txPerMonth)}</span>
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
          Rates as publicly listed by each provider as of 2026 — confirm current pricing on paystack.com / flutterwave.com before deciding; providers change rates without much notice.
        </p>

        <div className="space-y-2">
          <button type="button" onClick={handleQuote} className="btn-primary h-11 text-sm w-full">
            Get help integrating payments →
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
