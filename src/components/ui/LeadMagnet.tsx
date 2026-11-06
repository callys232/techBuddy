"use client";

import { useState } from "react";
import { IconCheck, IconMail, IconArrowRight, IconSparkles } from "@tabler/icons-react";
import { captureToolLead } from "@/lib/captureToolLead";
import { validateEmail } from "@/lib/validate";

export function LeadMagnet({ className = "" }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateEmail(email);
    if (err) {
      setErrorMsg(err);
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      captureToolLead({
        tool: "lead-magnet",
        source: "email-capture",
        email,
        selections: { guide: "2026 Tech Founder Launch Guide & Cost Breakdown" },
        result: { subscribed: true },
      });
      await new Promise((r) => setTimeout(r, 600));
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  };

  return (
    <section className={`rounded-2xl border border-[var(--border)] bg-gradient-to-r from-[var(--surface)] via-[var(--page)] to-[var(--surface)] p-6 sm:p-10 shadow-sm ${className}`}>
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-lg">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] text-xs font-semibold uppercase tracking-wider mb-3">
            <IconSparkles size={13} />
            <span>Free Founder Resource</span>
          </div>
          <h3 className="font-heading font-extrabold text-2xl text-[var(--ink)] leading-snug mb-2">
            Get the 2026 Tech Founder Launch Checklist &amp; Cost Guide
          </h3>
          <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
            Avoid costly mistakes when planning your web or mobile app. Includes technical scopes, vendor negotiation tips, and realistic budget benchmarks for Africa and global markets.
          </p>
        </div>

        <div className="w-full md:w-auto md:min-w-[340px]">
          {status === "success" ? (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm">
              <IconCheck size={20} className="shrink-0" />
              <div>
                <p className="font-semibold">Check your inbox!</p>
                <p className="text-xs text-emerald-500/80">We&apos;ve sent the 2026 Launch Guide to {email}.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <IconMail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--ink-faint)]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === "error") setStatus("idle");
                    }}
                    placeholder="Enter your work email"
                    className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-[var(--border)] bg-[var(--page)] text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]/30 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn-primary py-3 px-6 text-sm shrink-0 whitespace-nowrap inline-flex items-center justify-center gap-2"
                >
                  {status === "loading" ? "Sending..." : "Get Guide"}
                  <IconArrowRight size={15} />
                </button>
              </div>
              {status === "error" && (
                <p className="text-xs text-rose-500 pl-1">{errorMsg}</p>
              )}
              <p className="text-[11px] text-[var(--ink-faint)] pl-1">
                Zero spam. Free technical insights twice a month. Unsubscribe anytime.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
