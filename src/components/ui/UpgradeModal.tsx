"use client";

import { useState, useEffect } from "react";
import { authFetch } from "@/lib/authFetch";
import {
  IconX,
  IconCheck,
  IconCrown,
  IconLoader2,
  IconAlertCircle,
  IconBrandPaypal,
  IconBrandStripe,
  IconCurrencyBitcoin,
  IconCreditCard,
  IconStarFilled,
} from "@tabler/icons-react";

type PaymentProvider = "paystack" | "stripe" | "paypal" | "crypto";

const PAYMENT_PROVIDERS: { id: PaymentProvider; label: string; price: string; endpoint: string; icon: React.ReactNode }[] = [
  { id: "paystack", label: "Card / Bank (Paystack)", price: "₦2,500/mo", endpoint: "/api/payments/subscribe", icon: <IconCreditCard size={16} /> },
  { id: "stripe", label: "Card (Stripe)", price: "$5/mo", endpoint: "/api/payments/stripe/checkout", icon: <IconBrandStripe size={16} /> },
  { id: "paypal", label: "PayPal", price: "$5/mo", endpoint: "/api/payments/paypal/checkout", icon: <IconBrandPaypal size={16} /> },
  { id: "crypto", label: "Crypto", price: "$5 / 1 month", endpoint: "/api/payments/crypto/checkout", icon: <IconCurrencyBitcoin size={16} /> },
];

const POINTS_REWARD_ID = "all-tools-premium-month";

export interface UpgradeFeatureCopy {
  title: string;
  description: string;
  benefits: string[];
}

/** Ecosystem-wide premium upsell — one active TechBuddy Premium subscription
 *  unlocks every gated tool, so this modal (and the checkout it triggers) is
 *  shared across all of them rather than re-implemented per feature. */
export function UpgradeModal({ email, onClose, feature }: { email: string; onClose: () => void; feature: UpgradeFeatureCopy }) {
  const [provider, setProvider] = useState<PaymentProvider>("paystack");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pointsBalance, setPointsBalance] = useState<number | null>(null);
  const [pointsCost, setPointsCost] = useState<number | null>(null);
  const [redeeming, setRedeeming] = useState(false);
  const [redeemed, setRedeemed] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch("/api/points/balance");
        const json = await res.json();
        setPointsBalance(json.balance ?? 0);
        const reward = (json.rewards as { id: string; cost: number }[] | undefined)?.find((r) => r.id === POINTS_REWARD_ID);
        setPointsCost(reward?.cost ?? null);
      } catch {
        setPointsBalance(null);
      }
    })();
  }, [email]);

  const handleUpgrade = async () => {
    setBusy(true);
    setError(null);
    try {
      const endpoint = PAYMENT_PROVIDERS.find((p) => p.id === provider)!.endpoint;
      const res = await authFetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Could not start checkout");
      window.location.href = json.authorizationUrl;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  };

  const handleRedeem = async () => {
    setRedeeming(true);
    setError(null);
    try {
      const res = await authFetch("/api/points/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": crypto.randomUUID() },
        body: JSON.stringify({ rewardId: POINTS_REWARD_ID }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Could not redeem points");
      setPointsBalance(json.balance);
      setRedeemed(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setRedeeming(false);
    }
  };

  const canRedeem = pointsBalance !== null && pointsCost !== null && pointsBalance >= pointsCost;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="card max-w-sm w-full p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-[var(--ink-faint)] hover:text-[var(--ink)] transition-colors" aria-label="Close"><IconX size={18} /></button>
        <div className="w-12 h-12 rounded-full bg-amber-400/15 flex items-center justify-center mb-4"><IconCrown size={22} className="text-amber-400" /></div>
        <h2 className="font-heading font-bold text-[var(--ink)] text-lg mb-1">{feature.title}</h2>
        <p className="text-sm text-[var(--ink-muted)] leading-relaxed mb-4">{feature.description}</p>
        <ul className="space-y-2 mb-5">
          {feature.benefits.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-[var(--ink)]/80"><IconCheck size={14} className="text-[var(--good)] shrink-0" />{f}</li>
          ))}
        </ul>

        {redeemed ? (
          <div className="flex items-center gap-2 text-[var(--good)] text-sm mb-3"><IconCheck size={16} className="shrink-0" /><span>1 month of TechBuddy Premium unlocked with points. Refresh to use it.</span></div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {PAYMENT_PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setProvider(p.id)}
                  className={`flex flex-col items-start gap-1 rounded-lg border px-3 py-2 text-left transition-colors ${
                    provider === p.id ? "border-amber-400 bg-amber-400/10" : "border-[var(--border)] hover:border-[var(--ink-faint)]"
                  }`}
                >
                  <span className="flex items-center gap-1.5 text-xs font-medium text-[var(--ink)]">{p.icon}{p.label}</span>
                  <span className="text-[11px] text-[var(--ink-faint)]">{p.price}</span>
                </button>
              ))}
            </div>

            {error && <div className="flex items-center gap-2 text-[var(--bad)] text-xs mb-3"><IconAlertCircle size={14} className="shrink-0" /><span>{error}</span></div>}

            <button
              onClick={handleUpgrade}
              disabled={busy}
              className="w-full bg-amber-400 hover:bg-amber-300 disabled:opacity-60 text-[#1a1200] font-semibold text-sm py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {busy ? <IconLoader2 size={16} className="animate-spin" /> : <IconCrown size={16} />}
              {busy ? "Redirecting to checkout…" : `Upgrade — ${PAYMENT_PROVIDERS.find((p) => p.id === provider)!.price}`}
            </button>

            {pointsCost !== null && (
              <>
                <div className="flex items-center gap-2 my-4"><div className="h-px flex-1 bg-[var(--border)]" /><span className="text-[11px] text-[var(--ink-faint)]">or</span><div className="h-px flex-1 bg-[var(--border)]" /></div>
                <button
                  onClick={handleRedeem}
                  disabled={!canRedeem || redeeming}
                  className="w-full border border-[var(--border)] disabled:opacity-50 text-[var(--ink)] font-medium text-sm py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 hover:border-[var(--ink-faint)]"
                >
                  {redeeming ? <IconLoader2 size={16} className="animate-spin" /> : <IconStarFilled size={15} className="text-amber-400" />}
                  {redeeming ? "Redeeming…" : `Redeem ${pointsCost} points for 1 month`}
                </button>
                <p className="text-center text-[11px] text-[var(--ink-faint)] mt-1.5">
                  {pointsBalance !== null ? `You have ${pointsBalance} points` : "Loading your points…"}
                  {pointsBalance !== null && !canRedeem ? ` — need ${pointsCost - pointsBalance} more` : ""}
                </p>
              </>
            )}

            <p className="text-center text-[11px] text-[var(--ink-faint)] mt-3">One TechBuddy Premium subscription unlocks every premium tool. Cancel anytime.</p>
          </>
        )}
      </div>
    </div>
  );
}
