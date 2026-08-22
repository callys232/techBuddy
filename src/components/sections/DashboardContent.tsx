"use client";

import { useState, useEffect, useCallback } from "react";
import {
  IconMail,
  IconLoader2,
  IconAlertCircle,
  IconCheck,
  IconCrown,
  IconStarFilled,
  IconPlayerPlay,
  IconGift,
  IconClock,
  IconArrowUpRight,
  IconArrowDownRight,
  IconCurrencyBitcoin,
  IconDownload,
  IconLockOpen,
  IconShoppingBag,
} from "@tabler/icons-react";
import { getSupabase } from "@/lib/supabase/client";
import { authFetch } from "@/lib/authFetch";
import type { RewardId } from "@/lib/points";
import { TOPUP_PRESETS_USD, POINTS_PER_USD } from "@/lib/points";
import { RewardedAdSlot, AD_NETWORK_CONFIGURED } from "@/components/ui/RewardedAdSlot";

interface Subscription {
  status: string;
  plan: string;
  current_period_end: string | null;
}

interface Reward {
  id: RewardId;
  label: string;
  cost: number;
}

interface Transaction {
  delta: number;
  reason: string;
  created_at: string;
}

interface OwnedProduct {
  purchaseId: string;
  purchasedAt: string;
  pricePaidPoints: number;
  slug: string;
  name: string;
  type: "download" | "unlock";
  category: string | null;
}

interface Summary {
  subscription: Subscription | null;
  points: { balance: number; rewards: Reward[]; transactions: Transaction[] };
  purchases: OwnedProduct[];
}

const MIN_WATCH_SECONDS = 15;

/* ─────────────────────────────────────────────────────────────────────────────
   Sign-in gate — reuses the same magic-link OTP flow as Resume Maker
───────────────────────────────────────────────────────────────────────────── */

function SignInGate({ onSignedIn }: { onSignedIn: (email: string) => void }) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError("Enter your email address."); return; }
    setBusy(true);
    setError(null);
    try {
      const { error: signInError } = await getSupabase().auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: typeof window !== "undefined" ? window.location.href : undefined },
      });
      if (signInError) throw signInError;
      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <div className="card max-w-sm mx-auto p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-[var(--brand)]/12 flex items-center justify-center mx-auto mb-4">
          <IconCheck size={22} className="text-[var(--brand)]" />
        </div>
        <p className="font-heading font-semibold text-[var(--ink)] mb-2">Check your email</p>
        <p className="text-sm text-[var(--ink-muted)]">We sent a magic link to <strong>{email}</strong>. Click it to open your dashboard.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card max-w-sm mx-auto p-8">
      <p className="eyebrow mb-3">Your account</p>
      <h1 className="font-heading font-bold text-[var(--ink)] text-xl mb-2">Sign in to your dashboard</h1>
      <p className="text-sm text-[var(--ink-muted)] leading-relaxed mb-5">
        Track your subscription, points balance, and rewards. Free — no password needed.
      </p>
      <div className="relative mb-3">
        <IconMail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--brand)]" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full bg-[var(--page)] border border-[var(--border)] rounded-lg text-sm text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]/30 transition-colors py-2.5 pl-9 pr-3"
        />
      </div>
      {error && <div className="flex items-center gap-2 text-[var(--bad)] text-xs mb-3"><IconAlertCircle size={14} className="shrink-0" /><span>{error}</span></div>}
      <button type="submit" disabled={busy} className="btn-primary w-full h-11 text-sm">
        {busy ? <IconLoader2 size={16} className="animate-spin" /> : <IconMail size={16} />}
        {busy ? "Sending…" : "Send magic link"}
      </button>
    </form>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Watch-ad flow — self-verified timed watch (no ad-network credentials yet)
───────────────────────────────────────────────────────────────────────────── */

function WatchAdModal({ onClose, onEarned }: { onClose: () => void; onEarned: (balance: number) => void }) {
  const [token, setToken] = useState<string | null>(null);
  const [remaining, setRemaining] = useState(MIN_WATCH_SECONDS);
  const [error, setError] = useState<string | null>(null);
  const [claiming, setClaiming] = useState(false);
  const [earned, setEarned] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch("/api/points/earn/watch-ad/start", { method: "POST" });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Could not start");
        setToken(json.token);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    })();
  }, []);

  useEffect(() => {
    if (!token || remaining <= 0) return;
    const id = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(id);
  }, [token, remaining]);

  const claim = async () => {
    if (!token) return;
    setClaiming(true);
    setError(null);
    try {
      const res = await fetch("/api/points/earn/watch-ad/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Could not claim points");
      setEarned(json.earned);
      onEarned(json.balance);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="card max-w-sm w-full p-6 text-center">
        {earned !== null ? (
          <>
            <div className="w-12 h-12 rounded-full bg-[var(--good)]/12 flex items-center justify-center mx-auto mb-4"><IconCheck size={22} className="text-[var(--good)]" /></div>
            <p className="font-heading font-semibold text-[var(--ink)] mb-1">+{earned} points earned</p>
            <p className="text-sm text-[var(--ink-muted)] mb-5">Thanks for supporting free tools on TechBuddy.</p>
            <button onClick={onClose} className="btn-primary w-full h-10 text-sm">Done</button>
          </>
        ) : (
          <>
            {AD_NETWORK_CONFIGURED ? (
              <RewardedAdSlot className="mb-4 min-h-[120px] rounded-xl overflow-hidden bg-[var(--page)] border border-[var(--border)]" />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-[var(--page)] border border-[var(--border)] flex items-center justify-center mx-auto mb-4">
                <IconPlayerPlay size={26} className="text-[var(--brand)]" />
              </div>
            )}
            <p className="font-heading font-semibold text-[var(--ink)] mb-1">Sponsored break</p>
            <p className="text-sm text-[var(--ink-muted)] mb-5">Stay on this screen for {remaining}s to earn points.</p>
            <div className="h-1.5 rounded-full bg-[var(--border)] overflow-hidden mb-5">
              <div
                className="h-full bg-[var(--brand)] transition-all duration-1000 ease-linear"
                style={{ width: `${((MIN_WATCH_SECONDS - remaining) / MIN_WATCH_SECONDS) * 100}%` }}
              />
            </div>
            {error && <div className="flex items-center gap-2 text-[var(--bad)] text-xs mb-3"><IconAlertCircle size={14} className="shrink-0" /><span>{error}</span></div>}
            <div className="flex gap-2">
              <button onClick={onClose} className="btn-ghost flex-1 h-10 text-sm">Cancel</button>
              <button onClick={claim} disabled={remaining > 0 || claiming} className="btn-primary flex-1 h-10 text-sm">
                {claiming ? <IconLoader2 size={15} className="animate-spin" /> : <IconGift size={15} />}
                {remaining > 0 ? `Wait ${remaining}s` : "Claim points"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Fund account — buy points with crypto (100 points = $1)
───────────────────────────────────────────────────────────────────────────── */

function FundAccountModal({ onClose }: { onClose: () => void }) {
  const [amount, setAmount] = useState<number>(TOPUP_PRESETS_USD[0]);
  const [custom, setCustom] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const effectiveAmount = custom ? Number(custom) || 0 : amount;
  const points = Math.round(effectiveAmount * POINTS_PER_USD);

  const fund = async () => {
    if (effectiveAmount < 1) { setError("Minimum top-up is $1."); return; }
    setBusy(true);
    setError(null);
    try {
      const res = await authFetch("/api/points/topup/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountUsd: effectiveAmount }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Could not start checkout");
      window.location.href = json.authorizationUrl;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="card max-w-sm w-full p-6">
        <div className="w-12 h-12 rounded-full bg-[var(--brand)]/12 flex items-center justify-center mb-4">
          <IconCurrencyBitcoin size={22} className="text-[var(--brand)]" />
        </div>
        <h2 className="font-heading font-bold text-[var(--ink)] text-lg mb-1">Fund your account</h2>
        <p className="text-sm text-[var(--ink-muted)] leading-relaxed mb-5">Pay with crypto — 100 points per $1, credited automatically once the payment confirms.</p>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {TOPUP_PRESETS_USD.map((usd) => (
            <button
              key={usd}
              onClick={() => { setAmount(usd); setCustom(""); }}
              className={`h-11 rounded-lg border text-sm font-semibold transition-colors ${
                !custom && amount === usd ? "border-[var(--brand)] bg-[var(--brand)]/8 text-[var(--brand)]" : "border-[var(--border)] text-[var(--ink-muted)] hover:border-[var(--brand)]/40"
              }`}
            >
              ${usd}
            </button>
          ))}
        </div>
        <input
          value={custom}
          onChange={(e) => setCustom(e.target.value.replace(/[^0-9.]/g, ""))}
          placeholder="Custom amount (USD)"
          className="w-full bg-[var(--page)] border border-[var(--border)] rounded-lg text-sm text-[var(--ink)] placeholder:text-[var(--ink-faint)] py-2.5 px-3.5 mb-4 focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]/30 transition-colors"
        />

        <div className="flex items-center justify-between text-sm mb-4 px-1">
          <span className="text-[var(--ink-muted)]">You&apos;ll receive</span>
          <span className="font-heading font-bold text-[var(--brand)]">{points.toLocaleString()} points</span>
        </div>

        {error && <div className="flex items-center gap-2 text-[var(--bad)] text-xs mb-3"><IconAlertCircle size={14} className="shrink-0" /><span>{error}</span></div>}

        <button onClick={fund} disabled={busy} className="btn-primary w-full h-11 text-sm mb-2">
          {busy ? <IconLoader2 size={16} className="animate-spin" /> : <IconCurrencyBitcoin size={16} />}
          {busy ? "Redirecting…" : `Pay $${effectiveAmount || 0} with crypto`}
        </button>
        <button onClick={onClose} className="w-full h-9 text-sm text-[var(--ink-faint)] hover:text-[var(--ink)] transition-colors">Cancel</button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Dashboard body — subscription status, points balance, rewards, ledger
───────────────────────────────────────────────────────────────────────────── */

const REASON_LABEL: Record<string, string> = {
  watch_ad: "Watched an ad",
  tool_use: "Used a free tool",
  referral: "Referred a friend",
  subscribe: "Subscribed to Premium",
};

function reasonLabel(reason: string): string {
  if (reason.startsWith("redeem:")) return `Redeemed — ${reason.slice(7).replace(/-/g, " ")}`;
  return REASON_LABEL[reason] ?? reason;
}

function DashboardBody({ email }: { email: string }) {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showWatchAd, setShowWatchAd] = useState(false);
  const [showFund, setShowFund] = useState(false);
  const [redeemingId, setRedeemingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await authFetch("/api/account/summary");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Could not load your account");
      setSummary(json);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const redeem = async (rewardId: RewardId) => {
    setRedeemingId(rewardId);
    setError(null);
    try {
      const res = await authFetch("/api/points/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rewardId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Could not redeem");
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setRedeemingId(null);
    }
  };

  if (!summary) {
    return (
      <div className="flex items-center justify-center py-24 text-[var(--ink-faint)]">
        <IconLoader2 size={20} className="animate-spin" />
      </div>
    );
  }

  const sub = summary.subscription;
  const active = sub && (sub.status === "active" || sub.status === "non-renewing");

  return (
    <div className="space-y-6">
      {error && <div className="flex items-center gap-2 text-[var(--bad)] text-sm"><IconAlertCircle size={15} className="shrink-0" /><span>{error}</span></div>}

      {/* Subscription card */}
      <div className="card p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${active ? "bg-[var(--brand)]/12" : "bg-[var(--page)] border border-[var(--border)]"}`}>
              <IconCrown size={20} className={active ? "text-[var(--brand)]" : "text-[var(--ink-faint)]"} />
            </div>
            <div>
              <p className="font-heading font-semibold text-[var(--ink)]">{active ? sub!.plan : "Free plan"}</p>
              <p className="text-xs text-[var(--ink-muted)]">
                {active
                  ? sub!.current_period_end
                    ? `Renews ${new Date(sub!.current_period_end).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}`
                    : "Active"
                  : "Upgrade from any premium tool to unlock AI features"}
              </p>
            </div>
          </div>
          {active && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--good)] bg-[var(--good)]/10 rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--good)]" />
              {sub!.status === "active" ? "Active" : "Ending soon"}
            </span>
          )}
        </div>
      </div>

      {/* Points balance + earn */}
      <div className="card p-6">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-400/15 flex items-center justify-center">
              <IconStarFilled size={19} className="text-amber-400" />
            </div>
            <div>
              <p className="font-heading font-semibold text-[var(--ink)] text-lg leading-tight">{summary.points.balance} points</p>
              <p className="text-xs text-[var(--ink-muted)]">Earned across the TechBuddy ecosystem — spend on rewards below or in the store</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setShowFund(true)} className="btn-primary h-10 px-4 text-sm">
              <IconCurrencyBitcoin size={14} />
              Fund with crypto
            </button>
            <button onClick={() => setShowWatchAd(true)} className="btn-secondary h-10 px-4 text-sm">
              <IconPlayerPlay size={14} />
              Watch an ad — earn 10
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <p className="eyebrow mb-0">Redeem points</p>
          <a href="/store" className="text-xs font-semibold text-[var(--brand)] hover:underline flex items-center gap-1">
            <IconShoppingBag size={12} />Browse the full store →
          </a>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          {summary.points.rewards.map((r) => {
            const canAfford = summary.points.balance >= r.cost;
            return (
              <div key={r.id} className="card-quiet p-4 flex flex-col gap-3">
                <p className="text-sm text-[var(--ink)] leading-snug flex-1">{r.label}</p>
                <button
                  onClick={() => redeem(r.id)}
                  disabled={!canAfford || redeemingId === r.id}
                  className="btn-ghost h-9 text-xs disabled:opacity-40"
                >
                  {redeemingId === r.id ? <IconLoader2 size={13} className="animate-spin" /> : <IconGift size={13} />}
                  {r.cost} pts
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* My purchases */}
      {summary.purchases.length > 0 && (
        <div className="card p-6">
          <p className="eyebrow mb-4">My purchases</p>
          <div className="space-y-1">
            {summary.purchases.map((p) => (
              <div key={p.purchaseId} className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
                <div className="flex items-center gap-2.5 text-sm text-[var(--ink)]">
                  {p.type === "download" ? <IconDownload size={14} className="text-[var(--ink-faint)]" /> : <IconLockOpen size={14} className="text-[var(--ink-faint)]" />}
                  {p.name}
                </div>
                <span className="text-xs text-[var(--ink-faint)] font-mono tabular-nums">{p.pricePaidPoints} pts</span>
              </div>
            ))}
          </div>
          <a href="/store" className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--brand)] hover:underline mt-4">
            <IconShoppingBag size={12} />Visit the store for re-downloads →
          </a>
        </div>
      )}

      {/* Recent activity */}
      {summary.points.transactions.length > 0 && (
        <div className="card p-6">
          <p className="eyebrow mb-4">Recent activity</p>
          <div className="space-y-1">
            {summary.points.transactions.map((t, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
                <div className="flex items-center gap-2.5 text-sm text-[var(--ink)]">
                  {t.delta > 0 ? <IconArrowUpRight size={14} className="text-[var(--good)]" /> : <IconArrowDownRight size={14} className="text-[var(--ink-faint)]" />}
                  {reasonLabel(t.reason)}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-[var(--ink-faint)] flex items-center gap-1"><IconClock size={11} />{new Date(t.created_at).toLocaleDateString()}</span>
                  <span className={`text-sm font-mono tabular-nums ${t.delta > 0 ? "text-[var(--good)]" : "text-[var(--ink-muted)]"}`}>
                    {t.delta > 0 ? "+" : ""}{t.delta}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showWatchAd && (
        <WatchAdModal
          onClose={() => setShowWatchAd(false)}
          onEarned={() => { setShowWatchAd(false); load(); }}
        />
      )}

      {showFund && <FundAccountModal onClose={() => setShowFund(false)} />}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Root — resolves session, then hands off to the sign-in gate or dashboard body
───────────────────────────────────────────────────────────────────────────── */

export function DashboardContent() {
  const [email, setEmail] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getSupabase().auth.getSession();
        setEmail(data.session?.user.email ?? null);
      } catch {
        setEmail(null);
      }
    })();
  }, []);

  if (email === undefined) {
    return (
      <div className="flex items-center justify-center py-24 text-[var(--ink-faint)]">
        <IconLoader2 size={20} className="animate-spin" />
      </div>
    );
  }

  if (!email) return <SignInGate onSignedIn={setEmail} />;

  return <DashboardBody email={email} />;
}
