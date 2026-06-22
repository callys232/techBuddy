"use client";

import type { Metadata } from "next";
import { useState } from "react";
import Link from "next/link";
import { IconCheck, IconArrowLeft } from "@tabler/icons-react";

/* Can't export metadata from a client component — handled via route segment config */
export const dynamic = "force-dynamic";

const STAGES = ["Idea / pre-product", "MVP built", "Early revenue", "Scaling"];
const INVEST_TYPES = [
  { value: "equity-build",    label: "Equity Build",    desc: "We build your product in exchange for equity" },
  { value: "revenue-share",   label: "Revenue Share",   desc: "We build now, you pay from future revenue"    },
  { value: "incubation",      label: "Incubation",      desc: "Full support: product, ops, and fundraising"  },
  { value: "advisory",        label: "Advisory",        desc: "Strategic and technical advisory only"        },
];

type Status = "idle" | "loading" | "success" | "error";

export default function InvestApplyPage() {
  const [form, setForm] = useState({
    name: "", email: "", company: "", stage: "", investType: "",
    pitch: "", funding: "", url: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [err, setErr] = useState("");

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.pitch) {
      setErr("Name, email and pitch are required.");
      return;
    }
    setStatus("loading");
    setErr("");
    try {
      const res = await fetch("/api/invest-apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("submit failed");
      setStatus("success");
    } catch {
      setStatus("error");
      setErr("Something went wrong. Please try again or email us directly.");
    }
  };

  if (status === "success") {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-[var(--container-px)]">
        <div className="max-w-md text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 mx-auto mb-6">
            <IconCheck size={28} className="text-emerald-400" />
          </div>
          <h1 className="font-display text-3xl font-extrabold text-[var(--fg)] mb-3">Application received</h1>
          <p className="text-[var(--fg)]/55 mb-2">
            We&apos;ll review your pitch and get back to you within 5 business days. Check your email for a confirmation.
          </p>
          <p className="text-sm text-[var(--fg)]/35 mb-8">Sent to {form.email}</p>
          <Link
            href="/invest"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-[var(--primary)] px-7 font-semibold text-sm text-[var(--bg)] hover:opacity-90 transition-opacity"
          >
            Back to Invest
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="mx-auto max-w-2xl px-[var(--container-px)] py-[var(--section-y)]">

        {/* Back */}
        <Link
          href="/invest"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--fg)]/45 hover:text-[var(--fg)] transition-colors mb-8"
        >
          <IconArrowLeft size={14} /> Back to Investment
        </Link>

        {/* Header */}
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--primary)]">Apply</span>
        <h1 className="mt-2 font-display text-3xl md:text-4xl font-extrabold text-[var(--fg)] mb-2">
          Tell us about your idea
        </h1>
        <p className="text-[var(--fg)]/50 mb-10 text-sm leading-relaxed">
          No lengthy decks required. Just a clear brief. We review every application personally within 5 business days.
        </p>

        <form onSubmit={submit} className="space-y-6">

          {/* Personal */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-heading text-sm font-semibold text-[var(--fg)] mb-1.5">
                Full name <span className="text-[var(--primary)]">*</span>
              </label>
              <input
                type="text" value={form.name} onChange={set("name")} required
                placeholder="Amara Okafor"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--fg)] placeholder:text-[var(--fg)]/30 focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]/20 transition-colors"
              />
            </div>
            <div>
              <label className="block font-heading text-sm font-semibold text-[var(--fg)] mb-1.5">
                Email <span className="text-[var(--primary)]">*</span>
              </label>
              <input
                type="email" value={form.email} onChange={set("email")} required
                placeholder="amara@startup.ng"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--fg)] placeholder:text-[var(--fg)]/30 focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]/20 transition-colors"
              />
            </div>
          </div>

          {/* Company */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-heading text-sm font-semibold text-[var(--fg)] mb-1.5">
                Company / Startup name
              </label>
              <input
                type="text" value={form.company} onChange={set("company")}
                placeholder="FinPay Nigeria"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--fg)] placeholder:text-[var(--fg)]/30 focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]/20 transition-colors"
              />
            </div>
            <div>
              <label className="block font-heading text-sm font-semibold text-[var(--fg)] mb-1.5">
                Current stage
              </label>
              <select
                value={form.stage} onChange={set("stage")}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--fg)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]/20 transition-colors"
              >
                <option value="">Select stage…</option>
                {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Investment type */}
          <div>
            <label className="block font-heading text-sm font-semibold text-[var(--fg)] mb-3">
              What kind of partnership are you looking for?
            </label>
            <div className="grid sm:grid-cols-2 gap-3">
              {INVEST_TYPES.map(({ value, label, desc }) => (
                <label
                  key={value}
                  className={[
                    "flex flex-col gap-1 rounded-xl border p-4 cursor-pointer transition-colors",
                    form.investType === value
                      ? "border-[var(--primary)] bg-[var(--primary)]/5"
                      : "border-[var(--border)] hover:border-[var(--primary)]/40",
                  ].join(" ")}
                >
                  <input
                    type="radio" name="investType" value={value}
                    checked={form.investType === value}
                    onChange={set("investType")}
                    className="sr-only"
                  />
                  <span className="font-heading font-semibold text-[var(--fg)] text-sm">{label}</span>
                  <span className="text-xs text-[var(--fg)]/45">{desc}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Pitch */}
          <div>
            <label className="block font-heading text-sm font-semibold text-[var(--fg)] mb-1.5">
              Your pitch <span className="text-[var(--primary)]">*</span>
            </label>
            <p className="text-xs text-[var(--fg)]/40 mb-2">
              What problem are you solving? Who is the customer? Why are you the right team? (3–5 sentences)
            </p>
            <textarea
              value={form.pitch} onChange={set("pitch")} required rows={5}
              placeholder="We're building a B2B payment platform for logistics companies in Nigeria. Existing solutions require 48-hour bank transfers; ours settles in 2 minutes via Paystack…"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--fg)] placeholder:text-[var(--fg)]/30 focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]/20 transition-colors resize-none"
            />
          </div>

          {/* Optional extras */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-heading text-sm font-semibold text-[var(--fg)] mb-1.5">
                Funding raised to date
              </label>
              <input
                type="text" value={form.funding} onChange={set("funding")}
                placeholder="₦0 (bootstrapped)"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--fg)] placeholder:text-[var(--fg)]/30 focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]/20 transition-colors"
              />
            </div>
            <div>
              <label className="block font-heading text-sm font-semibold text-[var(--fg)] mb-1.5">
                Website or deck URL
              </label>
              <input
                type="url" value={form.url} onChange={set("url")}
                placeholder="https://pitch.com/v/your-deck"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--fg)] placeholder:text-[var(--fg)]/30 focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]/20 transition-colors"
              />
            </div>
          </div>

          {err && <p className="text-sm text-rose-400">{err}</p>}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full h-12 rounded-full bg-[var(--primary)] font-heading font-bold text-sm text-[var(--bg)] hover:opacity-90 disabled:opacity-40 transition-all active:scale-[0.98]"
          >
            {status === "loading" ? "Submitting…" : "Submit application"}
          </button>

          <p className="text-center text-xs text-[var(--fg)]/30">
            We review every application personally · No spam · Reply within 5 business days
          </p>
        </form>
      </div>
    </div>
  );
}
