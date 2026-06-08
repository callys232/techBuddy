"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconX, IconSend, IconSparkles, IconBrandWhatsapp, IconMail, IconCheck } from "@tabler/icons-react";

/* ── Types ───────────────────────────────────────────────────────────────── */

interface Message {
  role: "user" | "assistant";
  content: string;
  pending?: boolean;
}

interface QuoteSummary {
  businessNeed:        string;
  recommendedServices: string[];
  estimatedRange:      { min: number; max: number };
  timeline:            string;
  notes:               string;
}

/* ── Helpers ─────────────────────────────────────────────────────────────── */

const QUOTE_RE = /---QUOTE_START---\s*([\s\S]*?)\s*---QUOTE_END---/;

function parseQuote(text: string): { clean: string; quote: QuoteSummary | null } {
  const match = QUOTE_RE.exec(text);
  if (!match) return { clean: text, quote: null };
  try {
    const quote = JSON.parse(match[1]) as QuoteSummary;
    return { clean: text.replace(QUOTE_RE, "").trim(), quote };
  } catch {
    return { clean: text, quote: null };
  }
}

function fmt(n: number) {
  return n >= 1_000_000
    ? `₦${(n / 1_000_000).toFixed(1)}M`
    : `₦${(n / 1_000).toFixed(0)}k`;
}

function buildWaText(q: QuoteSummary, wa: string) {
  const lines = [
    `Hi TechBuddy! Here's my project brief:\n`,
    `💼 *Need:* ${q.businessNeed}`,
    `\n🛠️ *Services:*\n${q.recommendedServices.map((s) => `• ${s}`).join("\n")}`,
    `\n💰 *Estimate:* ${fmt(q.estimatedRange.min)} – ${fmt(q.estimatedRange.max)}`,
    `⏱️ *Timeline:* ${q.timeline}`,
    q.notes ? `\n📝 *Notes:* ${q.notes}` : "",
    `\nI'd love to discuss this further!`,
  ].filter(Boolean).join("\n");

  return `https://wa.me/${wa}?text=${encodeURIComponent(lines)}`;
}

function buildEmailBody(q: QuoteSummary) {
  return [
    `Hi TechBuddy team,\n`,
    `Here's my project brief:\n`,
    `Business need: ${q.businessNeed}`,
    `Services needed: ${q.recommendedServices.join(", ")}`,
    `Estimated range: ${fmt(q.estimatedRange.min)} – ${fmt(q.estimatedRange.max)}`,
    `Timeline: ${q.timeline}`,
    q.notes ? `Notes: ${q.notes}` : "",
    `\nPlease get back to me.\n\nThanks`,
  ].filter(Boolean).join("\n");
}

/* ── Component ───────────────────────────────────────────────────────────── */

const GREETING: Message = {
  role: "assistant",
  content: "Hey! I'm TechBuddy's AI advisor 👋\n\nWhat are you trying to build — or what problem are you trying to solve? Tell me in plain terms and I'll help figure out the best approach.",
};

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2348000000000";

export function AgentWidget() {
  const [open,     setOpen]     = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input,    setInput]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [quote,    setQuote]    = useState<QuoteSummary | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

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

      /* Parse quote out of final buffer */
      const { clean, quote: parsedQuote } = parseQuote(buffer);
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
        name:       "AI Quote",
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
        aria-label="Open AI advisor"
        className="fixed bottom-6 right-6 z-50 relative flex h-14 w-14 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--bg)] shadow-[var(--shadow-glow-sky)] hover:scale-105 active:scale-95 transition-transform"
      >
        <span className="absolute inset-0 rounded-full bg-[var(--primary)] animate-ping opacity-25" />
        {open ? <IconX size={22} /> : <IconSparkles size={22} />}
      </button>

      {/* ── Chat panel ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{   opacity: 0, scale: 0.92, y: 16  }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="fixed bottom-24 right-6 z-50 flex flex-col w-[370px] max-h-[580px] glass rounded-[24px] border border-[var(--border)] shadow-[0_24px_60px_rgba(0,0,0,0.4)] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border)] shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary)]/15">
                <IconSparkles size={17} className="text-[var(--primary)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading font-semibold text-[var(--fg)] text-sm leading-none">TechBuddy AI</p>
                <p className="font-mono text-[10px] text-[var(--fg)]/35 mt-0.5">Product advisor · usually responds instantly</p>
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

              {/* Quote card */}
              {quote && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-[var(--primary)]/40 bg-[var(--primary)]/5 p-4 space-y-3"
                >
                  <p className="font-mono text-[var(--primary)] text-[10px] uppercase tracking-[0.2em]">
                    Quote Summary
                  </p>
                  <p className="text-[13px] text-[var(--fg)] leading-snug font-medium">
                    {quote.businessNeed}
                  </p>
                  <div className="space-y-1">
                    {quote.recommendedServices.map((s) => (
                      <div key={s} className="flex items-center gap-2 text-[12px] text-[var(--fg)]/70">
                        <IconCheck size={11} className="text-[var(--primary)] shrink-0" />
                        {s}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-display text-lg font-extrabold text-[var(--primary)]">
                      {fmt(quote.estimatedRange.min)} – {fmt(quote.estimatedRange.max)}
                    </span>
                    <span className="font-mono text-[10px] text-[var(--fg)]/35">{quote.timeline}</span>
                  </div>
                  {quote.notes && (
                    <p className="text-[11px] text-[var(--fg)]/40 leading-relaxed">{quote.notes}</p>
                  )}

                  {/* Share actions */}
                  <div className="flex gap-2 pt-1">
                    <a
                      href={buildWaText(quote, WA)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex h-9 items-center justify-center gap-1.5 rounded-full bg-emerald-500 text-white text-[12px] font-semibold hover:bg-emerald-600 transition-colors active:scale-95"
                    >
                      <IconBrandWhatsapp size={14} />
                      Send to WhatsApp
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
                      {emailSent ? <><IconCheck size={13} /> Sent!</> : <><IconMail size={14} /> Email team</>}
                    </button>
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
                placeholder={loading ? "Thinking…" : "Describe what you need…"}
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
