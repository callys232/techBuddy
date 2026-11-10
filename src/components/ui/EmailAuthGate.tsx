"use client";

import { useState, useEffect } from "react";
import { IconMail, IconLoader2, IconAlertCircle, IconCheck } from "@tabler/icons-react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";

/**
 * Real magic-link sign-in, not a trust-me email text field. Several premium
 * tools used to just take an `email` input and send it straight to the API —
 * anyone could type a victim's address and use their subscription. This gate
 * requires an actual verified Supabase session before rendering children, and
 * hands back the session's real email (never client-editable after sign-in).
 */
export function EmailAuthGate({ children }: { children: (email: string) => React.ReactNode }) {
  const [email, setEmail] = useState<string | null | undefined>(undefined);
  const [inputEmail, setInputEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const send = async () => {
    if (!inputEmail.trim()) { setError("Enter your email."); return; }
    if (!isSupabaseConfigured()) {
      setError("Account verification service is temporarily unavailable. Please reach out to support on WhatsApp (+234 707 099 4391).");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const { error: signInError } = await getSupabase().auth.signInWithOtp({
        email: inputEmail.trim(),
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

  if (email === undefined) {
    return <div className="flex items-center justify-center py-16 text-[var(--ink-faint)]"><IconLoader2 size={20} className="animate-spin" /></div>;
  }

  if (email) return <>{children(email)}</>;

  if (sent) {
    return (
      <div className="card max-w-sm mx-auto p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-[var(--brand)]/12 flex items-center justify-center mx-auto mb-4">
          <IconCheck size={22} className="text-[var(--brand)]" />
        </div>
        <p className="font-heading font-semibold text-[var(--ink)] mb-2">Check your email</p>
        <p className="text-sm text-[var(--ink-muted)]">We sent a magic link to <strong>{inputEmail}</strong>. Click it, then come back here.</p>
      </div>
    );
  }

  return (
    <div className="card max-w-sm mx-auto p-8">
      <p className="eyebrow mb-3">Sign in required</p>
      <h2 className="font-heading font-bold text-[var(--ink)] text-lg mb-2">One email, no password</h2>
      <p className="text-sm text-[var(--ink-muted)] leading-relaxed mb-5">This tool checks your subscription and points balance, so we verify your email first.</p>
      <div className="relative mb-3">
        <IconMail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--brand)]" />
        <input
          type="email"
          value={inputEmail}
          onChange={(e) => setInputEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full bg-[var(--page)] border border-[var(--border)] rounded-lg text-sm text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]/30 transition-colors py-2.5 pl-9 pr-3"
        />
      </div>
      {error && <div className="flex items-center gap-2 text-[var(--bad)] text-xs mb-3"><IconAlertCircle size={14} className="shrink-0" /><span>{error}</span></div>}
      <button onClick={send} disabled={busy} className="btn-primary w-full h-11 text-sm">
        {busy ? <IconLoader2 size={16} className="animate-spin" /> : <IconMail size={16} />}
        {busy ? "Sending…" : "Send magic link"}
      </button>
    </div>
  );
}
