"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  IconX,
  IconSend,
  IconRobot,
  IconBrandWhatsapp,
  IconMail,
  IconCheck,
  IconArrowRight,
} from "@tabler/icons-react";

/* ── Types ───────────────────────────────────────────────────────────────── */

interface Message {
  role: "user" | "assistant";
  content: string;
  pending?: boolean;
}

interface QuoteSummary {
  businessNeed:        string;
  targetUser:          string;
  coreFeature:         string;
  recommendedServices: string[];
  phase1:              string[];
  phase2:              string[];
  estimatedRange:      { min: number; max: number };
  timeline:            string;
  africanContextNotes: string;
  nextStep:            string;
  /* legacy compat */
  notes?:              string;
}

/* ── Helpers ─────────────────────────────────────────────────────────────── */

const SCOPE_RE = /---SCOPE_START---\s*([\s\S]*?)\s*---SCOPE_END---/;
/* Keep backward-compat with old QUOTE format */
const QUOTE_RE = /---QUOTE_START---\s*([\s\S]*?)\s*---QUOTE_END---/;

function parseScope(text: string): { clean: string; quote: QuoteSummary | null } {
  const scopeMatch = SCOPE_RE.exec(text);
  if (scopeMatch) {
    try {
      const quote = JSON.parse(scopeMatch[1]) as QuoteSummary;
      return { clean: text.replace(SCOPE_RE, "").trim(), quote };
    } catch {
      return { clean: text, quote: null };
    }
  }
  const quoteMatch = QUOTE_RE.exec(text);
  if (quoteMatch) {
    try {
      const raw = JSON.parse(quoteMatch[1]) as Omit<QuoteSummary, "targetUser" | "coreFeature" | "phase1" | "phase2" | "africanContextNotes" | "nextStep"> & { notes?: string };
      const quote: QuoteSummary = {
        ...raw,
        targetUser:          "",
        coreFeature:         "",
        phase1:              raw.recommendedServices ?? [],
        phase2:              [],
        africanContextNotes: raw.notes ?? "",
        nextStep:            "Book a discovery call",
      };
      return { clean: text.replace(QUOTE_RE, "").trim(), quote };
    } catch {
      return { clean: text, quote: null };
    }
  }
  return { clean: text, quote: null };
}

function fmt(n: number) {
  return n >= 1_000_000
    ? `₦${(n / 1_000_000).toFixed(1)}M`
    : `₦${(n / 1_000).toFixed(0)}k`;
}

function buildWaText(q: QuoteSummary, wa: string) {
  const phase1Lines = q.phase1.length
    ? `\n\n📋 *Phase 1:*\n${q.phase1.map((f) => `• ${f}`).join("\n")}`
    : "";
  const phase2Lines = q.phase2.length
    ? `\n\n🔜 *Phase 2:*\n${q.phase2.map((f) => `• ${f}`).join("\n")}`
    : "";

  const lines = [
    `Hi TechBuddy! Here's my project brief:\n`,
    `💼 *Need:* ${q.businessNeed}`,
    q.targetUser ? `👤 *For:* ${q.targetUser}` : "",
    q.coreFeature ? `⚡ *Core feature:* ${q.coreFeature}` : "",
    `\n🛠️ *Services:*\n${q.recommendedServices.map((s) => `• ${s}`).join("\n")}`,
    phase1Lines,
    phase2Lines,
    `\n💰 *Estimate:* ${fmt(q.estimatedRange.min)} – ${fmt(q.estimatedRange.max)}`,
    `⏱️ *Timeline:* ${q.timeline}`,
    q.africanContextNotes ? `\n📝 *Notes:* ${q.africanContextNotes}` : "",
    `\nI'd love to discuss this further!`,
  ].filter(Boolean).join("\n");

  return `https://wa.me/${wa}?text=${encodeURIComponent(lines)}`;
}

function buildEmailBody(q: QuoteSummary) {
  return [
    `Hi TechBuddy team,\n`,
    `Here's my project brief:\n`,
    `Business need: ${q.businessNeed}`,
    q.targetUser    ? `Target user: ${q.targetUser}` : "",
    q.coreFeature   ? `Core feature: ${q.coreFeature}` : "",
    `Services needed: ${q.recommendedServices.join(", ")}`,
    q.phase1.length ? `Phase 1: ${q.phase1.join(", ")}` : "",
    q.phase2.length ? `Phase 2: ${q.phase2.join(", ")}` : "",
    `Estimated range: ${fmt(q.estimatedRange.min)} – ${fmt(q.estimatedRange.max)}`,
    `Timeline: ${q.timeline}`,
    q.africanContextNotes ? `Notes: ${q.africanContextNotes}` : "",
    `\nPlease get back to me.\n\nThanks`,
  ].filter(Boolean).join("\n");
}

function buildQuoteFormUrl(q: QuoteSummary) {
  const params = new URLSearchParams({
    need:      q.businessNeed,
    user:      q.targetUser ?? "",
    feature:   q.coreFeature ?? "",
    services:  q.recommendedServices.join(", "),
    min:       String(q.estimatedRange.min),
    max:       String(q.estimatedRange.max),
    timeline:  q.timeline,
  });
  return `/quote?${params.toString()}`;
}

type Stage = "Discovery" | "Scoping" | "Estimating" | "Done";

function getStage(messageCount: number, hasScope: boolean): Stage {
  if (hasScope)          return "Done";
  if (messageCount >= 5) return "Estimating";
  if (messageCount >= 3) return "Scoping";
  return "Discovery";
}

const STAGE_COLORS: Record<Stage, string> = {
  Discovery:  "text-sky-400",
  Scoping:    "text-violet-400",
  Estimating: "text-amber-400",
  Done:       "text-emerald-400",
};

const STAGE_DOT_BG: Record<Stage, string> = {
  Discovery:  "bg-sky-400",
  Scoping:    "bg-violet-400",
  Estimating: "bg-amber-400",
  Done:       "bg-emerald-400",
};

const STAGE_DOTS: Record<Stage, number> = {
  Discovery:  1,
  Scoping:    2,
  Estimating: 3,
  Done:       4,
};

/* ── Component ───────────────────────────────────────────────────────────── */

const GREETING: Message = {
  role: "assistant",
  content:
    "Hi! I'm your project scoping assistant 🎯\n\nTell me: what problem are you trying to solve for your customers? (Don't tell me the solution yet — start with the problem.)",
};

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2348000000000";

export function AgentWidget() {
  const [open,      setOpen]      = useState(false);
  const [messages,  setMessages]  = useState<Message[]>([GREETING]);
  const [input,     setInput]     = useState("");
  const [loading,   setLoading]   = useState(false);
  const [quote,     setQuote]     = useState<QuoteSummary | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  /* User message count (excludes greeting) */
  const userMsgCount = messages.filter((m) => m.role === "user").length;
  const stage        = getStage(userMsgCount, !!quote);

  /* Open widget on custom event dispatched from navbar */
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-agent-widget", handler);
    return () => window.removeEventListener("open-agent-widget", handler);
  }, []);

  /* Scroll to bottom on new messages */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* Focus input when widget opens */
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    const history = [...messages, userMsg].filter((m) => !m.pending);

    setMessages((prev) => [...prev, userMsg, { role: "assistant", content: "", pending: true }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/agent/chat", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          messages: history.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!res.ok || !res.body) throw new Error("Stream failed");

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let   buffer  = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: "assistant", content: buffer };
          return next;
        });
      }

      /* Parse scope out of final buffer */
      const { clean, quote: parsedQuote } = parseScope(buffer);
      if (parsedQuote) {
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: "assistant", content: clean };
          return next;
        });
        setQuote(parsedQuote);
      }
    } catch {
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          role:    "assistant",
          content: "Sorry, something went wrong. Please try again or chat with us on WhatsApp.",
        };
        return next;
      });
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const sendQuoteEmail = async () => {
    if (!quote) return;
    await fetch("/api/contact", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        name:       "AI Scope",
        email:      "noreply@techbuddy.ng",
        department: "General",
        message:    buildEmailBody(quote),
      }),
    }).catch(() => null);
    setEmailSent(true);
  };

  return (
    <>
      {/* ── Floating trigger button ──────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open project scoping assistant"
        className="fixed bottom-4 right-4 z-50 relative flex h-14 w-14 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--bg)] shadow-[var(--shadow-glow-sky)] hover:scale-105 active:scale-95 transition-transform"
      >
        <span className="absolute inset-0 rounded-full bg-[var(--primary)] animate-ping opacity-25" />
        {open ? <IconX size={22} /> : <IconRobot size={22} />}
      </button>

      {/* ── Chat panel ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{   opacity: 0, scale: 0.92, y: 16  }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="fixed bottom-20 right-4 z-50 flex flex-col w-[400px] max-h-[600px] glass rounded-[24px] border border-[var(--border)] shadow-[0_24px_60px_rgba(0,0,0,0.4)] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border)] shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary)]/15">
                <IconRobot size={17} className="text-[var(--primary)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading font-semibold text-[var(--fg)] text-sm leading-none">
                  Project Scoping Assistant
                </p>

                {/* Progress indicator */}
                <div className="flex items-center gap-1.5 mt-1">
                  {(["Discovery", "Scoping", "Estimating", "Done"] as Stage[]).map((s, idx) => {
                    const active  = STAGE_DOTS[stage] > idx;
                    const current = stage === s;
                    return (
                      <span
                        key={s}
                        className={[
                          "h-1 rounded-full transition-all duration-500",
                          current ? "w-8" : "w-2",
                          active
                            ? current
                              ? STAGE_DOT_BG[stage]
                              : "bg-[var(--primary)]/40"
                            : "bg-[var(--fg)]/10",
                        ].join(" ")}
                      />
                    );
                  })}
                  <span className={`font-mono text-[9px] ml-0.5 ${STAGE_COLORS[stage]}`}>
                    {stage}
                  </span>
                </div>
              </div>

              <span className="flex h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="ml-1 flex h-7 w-7 items-center justify-center rounded-full text-[var(--fg)]/40 hover:bg-[var(--surface)] hover:text-[var(--fg)] transition-colors"
              >
                <IconX size={15} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={[
                      "max-w-[82%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap",
                      msg.role === "user"
                        ? "bg-[var(--primary)] text-[var(--bg)] rounded-br-sm"
                        : "bg-[var(--surface)] text-[var(--fg)] rounded-bl-sm border border-[var(--border)]",
                      msg.pending ? "opacity-60" : "",
                    ].join(" ")}
                  >
                    {msg.pending && !msg.content ? (
                      <span className="flex gap-1 items-center py-0.5">
                        {[0, 1, 2].map((d) => (
                          <span
                            key={d}
                            className="h-1.5 w-1.5 rounded-full bg-[var(--fg)]/40 animate-bounce"
                            style={{ animationDelay: `${d * 150}ms` }}
                          />
                        ))}
                      </span>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}

              {/* Scope card */}
              {quote && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-[var(--primary)]/40 bg-[var(--primary)]/5 p-4 space-y-3"
                >
                  {/* Label */}
                  <p className="font-mono text-[var(--primary)] text-[10px] uppercase tracking-[0.2em]">
                    Project Scope
                  </p>

                  {/* Business need headline */}
                  <p className="text-[14px] text-[var(--fg)] leading-snug font-bold">
                    {quote.businessNeed}
                  </p>

                  {/* Target user + core feature */}
                  {quote.targetUser && (
                    <p className="text-[12px] text-[var(--fg)]/70 leading-snug">
                      <span className="text-[var(--fg)]/40">For: </span>
                      {quote.targetUser}
                    </p>
                  )}
                  {quote.coreFeature && (
                    <p className="text-[12px] text-[var(--fg)]/70 leading-snug">
                      <span className="text-[var(--fg)]/40">Core: </span>
                      {quote.coreFeature}
                    </p>
                  )}

                  {/* Phase 1 */}
                  {quote.phase1.length > 0 && (
                    <div className="space-y-1">
                      <p className="font-mono text-[9px] uppercase tracking-widest text-[var(--fg)]/35 mb-1">
                        Phase 1 — Build first
                      </p>
                      {quote.phase1.map((f) => (
                        <div key={f} className="flex items-start gap-2 text-[12px] text-[var(--fg)]/80">
                          <IconCheck size={11} className="text-sky-400 shrink-0 mt-0.5" />
                          {f}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Phase 2 */}
                  {quote.phase2.length > 0 && (
                    <div className="space-y-1">
                      <p className="font-mono text-[9px] uppercase tracking-widest text-[var(--fg)]/25 mb-1">
                        Coming next — Phase 2
                      </p>
                      {quote.phase2.map((f) => (
                        <div key={f} className="flex items-start gap-2 text-[12px] text-[var(--fg)]/40">
                          <IconCheck size={11} className="text-[var(--fg)]/25 shrink-0 mt-0.5" />
                          {f}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* African context notes */}
                  {quote.africanContextNotes && (
                    <p className="text-[11px] text-amber-400/80 leading-relaxed border-l-2 border-amber-400/30 pl-2">
                      {quote.africanContextNotes}
                    </p>
                  )}

                  {/* Estimate + timeline */}
                  <div className="flex items-center justify-between pt-1 border-t border-[var(--border)]">
                    <span className="font-display text-lg font-extrabold text-[var(--primary)]">
                      {fmt(quote.estimatedRange.min)} – {fmt(quote.estimatedRange.max)}
                    </span>
                    <span className="font-mono text-[10px] text-[var(--fg)]/35">{quote.timeline}</span>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col gap-2 pt-1">
                    {/* WhatsApp + Email row */}
                    <div className="flex gap-2">
                      <a
                        href={buildWaText(quote, WA)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex h-9 items-center justify-center gap-1.5 rounded-full bg-emerald-500 text-white text-[12px] font-semibold hover:bg-emerald-600 transition-colors active:scale-95"
                      >
                        <IconBrandWhatsapp size={14} />
                        WhatsApp brief
                      </a>
                      <button
                        type="button"
                        onClick={sendQuoteEmail}
                        disabled={emailSent}
                        className={[
                          "flex-1 flex h-9 items-center justify-center gap-1.5 rounded-full text-[12px] font-semibold transition-all active:scale-95",
                          emailSent
                            ? "bg-emerald-500/10 text-emerald-400 cursor-default"
                            : "border border-[var(--border)] text-[var(--fg)]/70 hover:border-[var(--primary)] hover:text-[var(--primary)]",
                        ].join(" ")}
                      >
                        {emailSent ? (
                          <><IconCheck size={13} /> Sent!</>
                        ) : (
                          <><IconMail size={14} /> Email team</>
                        )}
                      </button>
                    </div>

                    {/* Start quote form CTA */}
                    <a
                      href={buildQuoteFormUrl(quote)}
                      className="flex h-9 w-full items-center justify-center gap-1.5 rounded-full bg-[var(--primary)] text-[var(--bg)] text-[12px] font-semibold hover:opacity-90 transition-opacity active:scale-95"
                    >
                      Start quote form
                      <IconArrowRight size={13} />
                    </a>
                  </div>
                </motion.div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input bar */}
            <div className="shrink-0 border-t border-[var(--border)] px-4 py-3 flex gap-2 items-center">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                disabled={loading}
                placeholder={loading ? "Thinking…" : "Describe your problem…"}
                className="flex-1 bg-[var(--surface)] rounded-full px-4 py-2 text-[13px] text-[var(--fg)] placeholder:text-[var(--fg)]/30 border border-[var(--border)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]/20 transition-colors disabled:opacity-40"
              />
              <button
                type="button"
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--bg)] disabled:opacity-30 hover:opacity-90 active:scale-90 transition-all"
              >
                <IconSend size={15} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
