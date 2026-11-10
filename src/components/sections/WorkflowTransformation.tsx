"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconX,
  IconCheck,
  IconArrowRight,
  IconSparkles,
  IconBolt,
  IconBrandWhatsapp,
  IconCreditCard,
  IconClock,
  IconTrendingUp,
} from "@tabler/icons-react";

export function WorkflowTransformation() {
  const [activeTab, setActiveTab] = useState<"before" | "after" | "both">("both");

  return (
    <section className="relative overflow-hidden bg-[var(--page)] py-[var(--section-y)] border-b border-[var(--border)]">
      <div className="shell relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="eyebrow">The TechBuddy Transformation</span>
          <h2 className="h-section mt-2 text-balance">
            Stop the manual grind. Run your business on autopilot.
          </h2>
          <p className="lead mt-4 text-[var(--ink-muted)] leading-relaxed">
            See the exact difference between running operations manually versus deploying TechBuddy&apos;s automated web, mobile, and WhatsApp systems.
          </p>

          {/* Toggle Pills */}
          <div className="mt-8 inline-flex items-center gap-1.5 bg-[var(--surface)] p-1.5 rounded-2xl border border-[var(--border)] shadow-xs">
            <button
              type="button"
              onClick={() => setActiveTab("before")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "before"
                  ? "bg-rose-500/15 text-rose-500 shadow-xs border border-rose-500/30"
                  : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
              }`}
            >
              ❌ The Manual Grind
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("both")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "both"
                  ? "bg-[var(--brand)] text-white shadow-xs"
                  : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
              }`}
            >
              ⇄ Side-by-Side
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("after")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "after"
                  ? "bg-emerald-500/15 text-emerald-500 shadow-xs border border-emerald-500/30"
                  : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
              }`}
            >
              ✅ Automated with TechBuddy
            </button>
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="grid md:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">
          {/* ❌ BEFORE CARD */}
          {(activeTab === "before" || activeTab === "both") && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className={`rounded-2xl border border-rose-500/30 bg-rose-500/[0.02] p-6 sm:p-8 flex flex-col justify-between shadow-xs ${
                activeTab === "before" ? "md:col-span-2 max-w-2xl mx-auto" : ""
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-rose-500/20 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/15 text-rose-500">
                      <IconX size={16} />
                    </span>
                    <h3 className="font-heading font-bold text-base text-[var(--ink)]">
                      The Manual Nightmare
                    </h3>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-500 font-bold">
                    Before TechBuddy
                  </span>
                </div>

                <div className="space-y-5">
                  <div className="flex gap-3.5">
                    <span className="text-rose-500 font-bold text-base mt-0.5">✕</span>
                    <div>
                      <h4 className="font-heading font-semibold text-sm text-[var(--ink)]">
                        Chasing Payment Screenshots at 11 PM
                      </h4>
                      <p className="text-xs text-[var(--ink-muted)] mt-1 leading-relaxed">
                        Customers send fuzzy bank transfer slips on WhatsApp. You waste hours cross-checking bank mobile apps to see if money actually arrived.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3.5">
                    <span className="text-rose-500 font-bold text-base mt-0.5">✕</span>
                    <div>
                      <h4 className="font-heading font-semibold text-sm text-[var(--ink)]">
                        Lost Leads from Delayed Replies
                      </h4>
                      <p className="text-xs text-[var(--ink-muted)] mt-1 leading-relaxed">
                        Buyers ask &quot;How much?&quot; or request catalog pricing. Because your team replies 2 hours later, they have already bought from a competitor.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3.5">
                    <span className="text-rose-500 font-bold text-base mt-0.5">✕</span>
                    <div>
                      <h4 className="font-heading font-semibold text-sm text-[var(--ink)]">
                        Clunky Spreadsheets &amp; Manual Data Entry
                      </h4>
                      <p className="text-xs text-[var(--ink-muted)] mt-1 leading-relaxed">
                        Copy-pasting customer phone numbers, tracking orders in disconnected Excel sheets, and sending bank details manually 50 times a day.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3.5">
                    <span className="text-rose-500 font-bold text-base mt-0.5">✕</span>
                    <div>
                      <h4 className="font-heading font-semibold text-sm text-[var(--ink)]">
                        Silent Downtime During Promo Campaigns
                      </h4>
                      <p className="text-xs text-[var(--ink-muted)] mt-1 leading-relaxed">
                        Website chokes when you run Facebook/Instagram ads, leaving visitors frustrated with broken buttons and failed checkouts.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-rose-500/20 text-xs text-rose-500 font-medium flex items-center gap-2">
                <IconClock size={15} />
                <span>Result: Exhausted teams, high customer drop-off, and lost revenue.</span>
              </div>
            </motion.div>
          )}

          {/* ✅ AFTER CARD */}
          {(activeTab === "after" || activeTab === "both") && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className={`rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/[0.03] p-6 sm:p-8 flex flex-col justify-between shadow-md relative overflow-hidden ${
                activeTab === "after" ? "md:col-span-2 max-w-2xl mx-auto" : ""
              }`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              <div>
                <div className="flex items-center justify-between pb-4 border-b border-emerald-500/20 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-500">
                      <IconCheck size={16} />
                    </span>
                    <h3 className="font-heading font-bold text-base text-[var(--ink)]">
                      The Automated Machine
                    </h3>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 font-bold border border-emerald-500/30">
                    With TechBuddy
                  </span>
                </div>

                <div className="space-y-5">
                  <div className="flex gap-3.5">
                    <span className="text-emerald-500 font-bold text-base mt-0.5">✓</span>
                    <div>
                      <h4 className="font-heading font-semibold text-sm text-[var(--ink)]">
                        Automated In-Chat Payment Links &amp; Instant Verification
                      </h4>
                      <p className="text-xs text-[var(--ink-muted)] mt-1 leading-relaxed">
                        Bot generates dynamic Paystack &amp; Flutterwave checkout links. Real-time webhooks verify receipts instantly—zero screenshot chasing.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3.5">
                    <span className="text-emerald-500 font-bold text-base mt-0.5">✓</span>
                    <div>
                      <h4 className="font-heading font-semibold text-sm text-[var(--ink)]">
                        2-Second Automated Responses 24/7
                      </h4>
                      <p className="text-xs text-[var(--ink-muted)] mt-1 leading-relaxed">
                        Interactive WhatsApp menus answer pricing, share catalogs, and qualify buyer leads within 2 seconds, even while you sleep.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3.5">
                    <span className="text-emerald-500 font-bold text-base mt-0.5">✓</span>
                    <div>
                      <h4 className="font-heading font-semibold text-sm text-[var(--ink)]">
                        Centralized Cloud Database &amp; Instant Notifications
                      </h4>
                      <p className="text-xs text-[var(--ink-muted)] mt-1 leading-relaxed">
                        Every order, invoice, and conversation logs automatically into Supabase. High-value buyers trigger instant admin WhatsApp alerts.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3.5">
                    <span className="text-emerald-500 font-bold text-base mt-0.5">✓</span>
                    <div>
                      <h4 className="font-heading font-semibold text-sm text-[var(--ink)]">
                        99.9% Cloud Uptime Built for African Networks
                      </h4>
                      <p className="text-xs text-[var(--ink-muted)] mt-1 leading-relaxed">
                        Ultra-lightweight web apps and offline-first mobile architecture engineered to convert smoothly even on slow 3G network connections.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-emerald-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                  <IconTrendingUp size={16} />
                  <span>3× more revenue with 90% less manual effort</span>
                </span>
                <Link
                  href="/quote"
                  className="btn-primary h-8 px-3.5 text-xs inline-flex items-center gap-1 shadow-sm"
                >
                  <span>Build Your System</span>
                  <IconArrowRight size={13} />
                </Link>
              </div>
            </motion.div>
          )}
        </div>

        {/* Live Transformation Metric Strip */}
        <div className="mt-12 max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            <p className="font-heading font-extrabold text-2xl text-[var(--brand)]">&lt; 2s</p>
            <p className="text-[11px] text-[var(--ink-muted)] mt-0.5">WhatsApp Reply Speed</p>
          </div>
          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            <p className="font-heading font-extrabold text-2xl text-emerald-500">0</p>
            <p className="text-[11px] text-[var(--ink-muted)] mt-0.5">Hours Spent Chasing Slips</p>
          </div>
          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            <p className="font-heading font-extrabold text-2xl text-[var(--ink)]">24/7</p>
            <p className="text-[11px] text-[var(--ink-muted)] mt-0.5">Automated Sales &amp; Leads</p>
          </div>
          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            <p className="font-heading font-extrabold text-2xl text-amber-500">100%</p>
            <p className="text-[11px] text-[var(--ink-muted)] mt-0.5">Verified Paystack Payments</p>
          </div>
        </div>
      </div>
    </section>
  );
}

