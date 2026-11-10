"use client";

import { useState } from "react";
import Link from "next/link";
import {
  IconBrandWhatsapp,
  IconCreditCard,
  IconRocket,
  IconCheck,
  IconArrowRight,
  IconSparkles,
  IconLock,
  IconBolt,
} from "@tabler/icons-react";

type Tab = "whatsapp" | "fintech" | "mvp";

export function HeroPlayground() {
  const [tab, setTab] = useState<Tab>("whatsapp");

  // WhatsApp demo state
  const [waState, setWaState] = useState<"menu" | "quote" | "paid">("menu");

  // Fintech demo state
  const [volume, setVolume] = useState<number>(2500000); // ₦2.5M

  // MVP demo state
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    "auth",
    "payments",
    "whatsapp",
  ]);

  const toggleFeature = (id: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  // Calculations
  const paystackFee = Math.min(volume * 0.015 + 100, 2000);
  const flutterwaveFee = Math.min(volume * 0.014, 2000);

  const mvpWeeks = Math.max(2, Math.min(8, 2 + selectedFeatures.length * 1.2));
  const mvpMinNaira = (800000 + selectedFeatures.length * 350000).toLocaleString();

  return (
    <div className="rounded-2xl border border-[var(--border-strong)] bg-gradient-to-b from-[var(--surface)] to-[var(--surface-soft)]/60 p-5 sm:p-7 shadow-xl backdrop-blur-md relative overflow-hidden">
      {/* Top Header & Live Interactive Badges */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[var(--border)] gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--ink)]">
            Live Architecture Playground
          </span>
        </div>
        <span className="text-[10px] font-mono text-[var(--brand)] bg-[var(--brand)]/10 px-2 py-0.5 rounded-full font-semibold border border-[var(--brand)]/20">
          Try It Below ⚡
        </span>
      </div>

      {/* Mode Tabs */}
      <div className="mt-4 grid grid-cols-3 gap-1.5 bg-[var(--surface-soft)] p-1 rounded-xl border border-[var(--border)] text-xs font-semibold">
        <button
          type="button"
          onClick={() => setTab("whatsapp")}
          className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg transition-all ${
            tab === "whatsapp"
              ? "bg-[var(--surface)] text-[#25D366] shadow-sm font-bold"
              : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
          }`}
        >
          <IconBrandWhatsapp size={15} />
          <span className="hidden sm:inline">WhatsApp Bot</span>
          <span className="sm:hidden">Bot</span>
        </button>

        <button
          type="button"
          onClick={() => setTab("fintech")}
          className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg transition-all ${
            tab === "fintech"
              ? "bg-[var(--surface)] text-[var(--brand)] shadow-sm font-bold"
              : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
          }`}
        >
          <IconCreditCard size={15} />
          <span className="hidden sm:inline">Fintech Links</span>
          <span className="sm:hidden">Pay</span>
        </button>

        <button
          type="button"
          onClick={() => setTab("mvp")}
          className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg transition-all ${
            tab === "mvp"
              ? "bg-[var(--surface)] text-amber-500 shadow-sm font-bold"
              : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
          }`}
        >
          <IconRocket size={15} />
          <span className="hidden sm:inline">MVP Build</span>
          <span className="sm:hidden">MVP</span>
        </button>
      </div>

      {/* Tab 1: WhatsApp Bot Interactive Demo */}
      {tab === "whatsapp" && (
        <div className="mt-4 space-y-3">
          <div className="rounded-xl border border-[var(--border)] bg-[#075E54]/5 p-3.5 space-y-2.5">
            <div className="flex items-center justify-between text-xs text-[var(--ink-muted)]">
              <span className="font-semibold text-[#075E54] dark:text-emerald-400 flex items-center gap-1.5">
                <IconBrandWhatsapp size={14} /> TechBuddy Assistant · Online
              </span>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">Response: 0.8s</span>
            </div>

            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3 text-xs text-[var(--ink)] shadow-xs leading-relaxed">
              👋 Hi Chief! Welcome to our store. Tap an option below to proceed:
            </div>

            {waState === "menu" && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setWaState("quote")}
                  className="bg-[var(--surface)] hover:bg-[#25D366]/15 hover:border-[#25D366] border border-[var(--border)] rounded-lg p-2 text-[11px] font-semibold text-[var(--ink)] text-left transition-colors flex items-center justify-between"
                >
                  <span>1. Instant Quote</span>
                  <span className="text-[var(--brand)]">→</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWaState("paid")}
                  className="bg-[var(--surface)] hover:bg-emerald-500/15 hover:border-emerald-500 border border-[var(--border)] rounded-lg p-2 text-[11px] font-semibold text-[var(--ink)] text-left transition-colors flex items-center justify-between"
                >
                  <span>2. Pay via WhatsApp</span>
                  <span className="text-emerald-500">₦</span>
                </button>
              </div>
            )}

            {waState === "quote" && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-xs text-[var(--ink)] space-y-2">
                <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                  ⚡ Instant Quote Generated:
                </p>
                <p className="text-[11px] text-[var(--ink-muted)]">
                  MVP Build: ₦850k · Timeline: 2.5 weeks · Includes Auth, Paystack &amp; Admin Dashboard.
                </p>
                <button
                  type="button"
                  onClick={() => setWaState("menu")}
                  className="text-[10px] text-[var(--brand)] font-semibold hover:underline"
                >
                  ← Reset Simulator
                </button>
              </div>
            )}

            {waState === "paid" && (
              <div className="bg-[#25D366]/10 border border-[#25D366]/30 rounded-xl p-3 text-xs text-[var(--ink)] space-y-2">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                  <IconCheck size={14} /> Auto-Payment Link Dispatched
                </div>
                <p className="text-[11px] text-[var(--ink-muted)]">
                  <code>paystack.com/pay/tb-9241</code> · Instant bank transfer verification active. No screenshot chasing!
                </p>
                <button
                  type="button"
                  onClick={() => setWaState("menu")}
                  className="text-[10px] text-[var(--brand)] font-semibold hover:underline"
                >
                  ← Reset Simulator
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-[var(--ink-muted)]">Zero code needed to build this.</span>
            <Link
              href="/tools/whatsapp-bot-builder"
              className="font-semibold text-[#25D366] hover:underline flex items-center gap-1"
            >
              <span>Build This Bot Free</span>
              <IconArrowRight size={13} />
            </Link>
          </div>
        </div>
      )}

      {/* Tab 2: Fintech & Payments Calculator Demo */}
      {tab === "fintech" && (
        <div className="mt-4 space-y-3.5">
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-medium text-[var(--ink-muted)]">Monthly Sales Volume:</span>
              <span className="font-mono font-bold text-[var(--ink)]">
                ₦{(volume / 1000000).toFixed(1)}M / month
              </span>
            </div>
            <input
              type="range"
              min={500000}
              max={10000000}
              step={250000}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full accent-[var(--brand)] h-1.5 bg-[var(--border)] rounded-lg cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 space-y-1">
              <p className="text-[10px] uppercase font-mono font-bold text-[var(--ink-faint)]">Paystack Capped</p>
              <p className="font-heading font-extrabold text-base text-[var(--brand)]">
                ₦{paystackFee.toLocaleString()}
              </p>
              <p className="text-[10px] text-[var(--ink-muted)]">Virtual NUBAN + 3DS Cards</p>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 space-y-1">
              <p className="text-[10px] uppercase font-mono font-bold text-[var(--ink-faint)]">Flutterwave Capped</p>
              <p className="font-heading font-extrabold text-base text-amber-500">
                ₦{flutterwaveFee.toLocaleString()}
              </p>
              <p className="text-[10px] text-[var(--ink-muted)]">Cross-border + Bank USSD</p>
            </div>
          </div>

          <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/25 p-2.5 text-xs text-[var(--ink)] flex items-center gap-2">
            <IconCheck size={16} className="text-emerald-500 shrink-0" />
            <span>Automated transfer verification eliminates 100% of fake screenshot fraud.</span>
          </div>

          <div className="text-right">
            <Link
              href="/tools/fintech-fees-calculator"
              className="text-xs font-semibold text-[var(--brand)] hover:underline inline-flex items-center gap-1"
            >
              <span>Full Side-by-Side Fee Breakdown</span>
              <IconArrowRight size={13} />
            </Link>
          </div>
        </div>
      )}

      {/* Tab 3: MVP Scope & Stack Picker */}
      {tab === "mvp" && (
        <div className="mt-4 space-y-3.5">
          <p className="text-xs text-[var(--ink-muted)]">Select target features to size your build:</p>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: "auth", label: "User Auth & Roles" },
              { id: "payments", label: "Paystack/Stripe" },
              { id: "whatsapp", label: "WhatsApp Bot Sync" },
              { id: "admin", label: "Admin CRM Dashboard" },
              { id: "ai", label: "AI Recommendations" },
            ].map((f) => {
              const active = selectedFeatures.includes(f.id);
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => toggleFeature(f.id)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                    active
                      ? "bg-[var(--brand)] text-white border-[var(--brand)] font-semibold shadow-xs"
                      : "bg-[var(--surface)] text-[var(--ink-muted)] border-[var(--border)] hover:border-[var(--brand)]"
                  }`}
                >
                  {active ? "✓ " : "+ "}
                  {f.label}
                </button>
              );
            })}
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3.5 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-mono font-bold text-[var(--ink-faint)]">Estimated Kickoff</p>
              <p className="font-heading font-bold text-sm text-[var(--ink)]">
                {mvpWeeks.toFixed(0)} Weeks to Launch
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-mono font-bold text-[var(--ink-faint)]">Starting Range</p>
              <p className="font-heading font-bold text-sm text-[var(--brand)]">
                from ₦{mvpMinNaira}
              </p>
            </div>
          </div>

          <div className="text-right">
            <Link
              href="/tools/cost-estimator"
              className="text-xs font-semibold text-[var(--brand)] hover:underline inline-flex items-center gap-1"
            >
              <span>Detailed Cost Estimator</span>
              <IconArrowRight size={13} />
            </Link>
          </div>
        </div>
      )}

      {/* Bottom CTA & Trust strip */}
      <div className="mt-5 pt-3.5 border-t border-[var(--border)] flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] text-[var(--ink-faint)]">
          <IconLock size={12} className="text-emerald-500" />
          <span>NDA &amp; Full IP Guarantee</span>
        </div>
        <Link
          href="/quote"
          className="btn-primary h-8 px-3.5 text-xs inline-flex items-center gap-1.5 shadow-sm"
        >
          <IconSparkles size={13} />
          <span>Kick Off Project</span>
        </Link>
      </div>
    </div>
  );
}

