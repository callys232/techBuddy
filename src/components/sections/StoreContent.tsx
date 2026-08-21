"use client";

import { useState, useEffect, useCallback } from "react";
import {
  IconDownload,
  IconLockOpen,
  IconLoader2,
  IconAlertCircle,
  IconCheck,
  IconStarFilled,
  IconShoppingCart,
} from "@tabler/icons-react";
import { getSupabase } from "@/lib/supabase/client";
import { authFetch } from "@/lib/authFetch";

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  type: "download" | "unlock";
  price_points: number;
  category: string | null;
}

function EmailGate() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = async () => {
    if (!email.trim()) { setError("Enter your email."); return; }
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
      setError(err instanceof Error ? err.message : "Something went wrong.");
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
        <p className="text-sm text-[var(--ink-muted)]">We sent a magic link to <strong>{email}</strong>. Click it, then come back here to shop.</p>
      </div>
    );
  }

  return (
    <div className="card max-w-sm mx-auto p-8">
      <p className="eyebrow mb-3">Sign in to shop</p>
      <h2 className="font-heading font-bold text-[var(--ink)] text-lg mb-2">One email, no password</h2>
      <p className="text-sm text-[var(--ink-muted)] leading-relaxed mb-5">Sign in to fund your account and buy from the store — same account as your dashboard.</p>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        type="email"
        className="w-full bg-[var(--page)] border border-[var(--border)] rounded-lg text-sm text-[var(--ink)] placeholder:text-[var(--ink-faint)] py-2.5 px-3.5 mb-3 focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]/30 transition-colors"
      />
      {error && <div className="flex items-center gap-2 text-[var(--bad)] text-xs mb-3"><IconAlertCircle size={14} className="shrink-0" /><span>{error}</span></div>}
      <button onClick={send} disabled={busy} className="btn-primary w-full h-11 text-sm">
        {busy ? <IconLoader2 size={16} className="animate-spin" /> : null}
        {busy ? "Sending…" : "Send magic link"}
      </button>
    </div>
  );
}

export function StoreContent() {
  const [email, setEmail] = useState<string | null | undefined>(undefined);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [owned, setOwned] = useState<Set<string>>(new Set());
  const [buyingSlug, setBuyingSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

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

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/store/products");
      const json = await res.json();
      setProducts(json.products ?? []);
    } catch {
      setProducts([]);
    }
    if (email) {
      try {
        const res = await authFetch("/api/account/summary");
        const json = await res.json();
        setBalance(json.points?.balance ?? 0);
        setOwned(new Set((json.purchases ?? []).map((p: { slug: string }) => p.slug)));
      } catch {
        setBalance(0);
      }
    }
  }, [email]);

  useEffect(() => { load(); }, [load]);

  const buy = async (product: Product) => {
    if (!email) return;
    setBuyingSlug(product.slug);
    setError(null);
    setMessage(null);
    try {
      const res = await authFetch("/api/store/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: product.slug }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Purchase failed");

      if (product.type === "download") {
        const dlRes = await authFetch("/api/store/download", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug: product.slug }),
        });
        const dlJson = await dlRes.json();
        if (dlRes.ok && dlJson.url) window.open(dlJson.url, "_blank");
      }

      setMessage(`${product.name} unlocked!`);
      setBalance(json.balance);
      setOwned((prev) => new Set(prev).add(product.slug));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBuyingSlug(null);
    }
  };

  const download = async (product: Product) => {
    if (!email) return;
    try {
      const res = await authFetch("/api/store/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: product.slug }),
      });
      const json = await res.json();
      if (res.ok && json.url) window.open(json.url, "_blank");
    } catch {
      // silent — the buy button's error path already covers the common failure surface
    }
  };

  if (email === undefined) {
    return <div className="flex items-center justify-center py-24 text-[var(--ink-faint)]"><IconLoader2 size={20} className="animate-spin" /></div>;
  }

  if (!email) return <EmailGate />;

  const categories = [...new Set((products ?? []).map((p) => p.category ?? "Other"))];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 card p-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-amber-400/15 flex items-center justify-center">
            <IconStarFilled size={19} className="text-amber-400" />
          </div>
          <div>
            <p className="font-heading font-semibold text-[var(--ink)] text-lg leading-tight">{balance ?? "…"} points</p>
            <p className="text-xs text-[var(--ink-muted)]">Signed in as {email}</p>
          </div>
        </div>
        <a href="/dashboard" className="btn-secondary h-10 px-4 text-sm">Fund your account →</a>
      </div>

      {error && <div className="flex items-center gap-2 text-[var(--bad)] text-sm mb-4"><IconAlertCircle size={15} className="shrink-0" /><span>{error}</span></div>}
      {message && <div className="flex items-center gap-2 text-[var(--good)] text-sm mb-4"><IconCheck size={15} className="shrink-0" /><span>{message}</span></div>}

      {products === null ? (
        <div className="flex items-center justify-center py-16 text-[var(--ink-faint)]"><IconLoader2 size={20} className="animate-spin" /></div>
      ) : products.length === 0 ? (
        <div className="card p-8 text-center text-sm text-[var(--ink-muted)]">
          Nothing in the store yet — check back soon.
        </div>
      ) : (
        categories.map((cat) => (
          <div key={cat} className="mb-8">
            <p className="eyebrow mb-4">{cat}</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.filter((p) => (p.category ?? "Other") === cat).map((product) => {
                const isOwned = owned.has(product.slug);
                const canAfford = balance !== null && balance >= product.price_points;
                return (
                  <div key={product.id} className="card-quiet p-5 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-heading font-semibold text-[var(--ink)] text-sm">{product.name}</p>
                      {product.type === "download" ? <IconDownload size={15} className="text-[var(--ink-faint)] shrink-0" /> : <IconLockOpen size={15} className="text-[var(--ink-faint)] shrink-0" />}
                    </div>
                    <p className="text-xs text-[var(--ink-muted)] leading-relaxed flex-1">{product.description}</p>
                    {isOwned ? (
                      product.type === "download" ? (
                        <button onClick={() => download(product)} className="btn-ghost h-9 text-xs">
                          <IconDownload size={13} />Download again
                        </button>
                      ) : (
                        <span className="inline-flex items-center justify-center gap-1.5 h-9 text-xs font-semibold text-[var(--good)]">
                          <IconCheck size={13} />Owned
                        </span>
                      )
                    ) : (
                      <button
                        onClick={() => buy(product)}
                        disabled={!canAfford || buyingSlug === product.slug}
                        className="btn-primary h-9 text-xs disabled:opacity-40"
                      >
                        {buyingSlug === product.slug ? <IconLoader2 size={13} className="animate-spin" /> : <IconShoppingCart size={13} />}
                        {product.price_points} points
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
