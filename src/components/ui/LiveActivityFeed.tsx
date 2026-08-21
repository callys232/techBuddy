"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Activity {
  id:     number;
  name:   string;
  city:   string;
  tool:   string;
  detail: string;
  result: string;
  icon:   string;
  ago:    string;
}

const FEED: Omit<Activity, "id">[] = [
  { name: "Seun A.",   city: "Lagos",          tool: "Cost Estimator",    detail: "SaaS platform + Payments + AI", result: "₦2.1M – ₦3.8M",    icon: "💰", ago: "just now"  },
  { name: "Amara O.",  city: "Abuja",          tool: "Timeline Estimator",detail: "Mobile app + fintech API",      result: "14–20 weeks",        icon: "📅", ago: "1 min ago" },
  { name: "Emeka N.",  city: "Port Harcourt",  tool: "Free Audit",        detail: "Healthcare platform",           result: "Report in 48 hrs",   icon: "🔍", ago: "3 min ago" },
  { name: "Fatima B.", city: "Lagos",          tool: "MVP Scope",         detail: "Logistics marketplace",         result: "11 Phase 1 features", icon: "🗺️", ago: "5 min ago" },
  { name: "Kemi A.",   city: "Ibadan",         tool: "NDPR Checker",      detail: "Fintech mobile app",            result: "Score: 71/100",      icon: "🛡️", ago: "7 min ago" },
  { name: "Chidi U.",  city: "Lagos",          tool: "Stack Picker",      detail: "B2B SaaS platform",             result: "Next.js + Supabase", icon: "🛠️", ago: "9 min ago" },
  { name: "Tunde O.",  city: "Lagos",          tool: "Quote submitted",   detail: "E-commerce + WhatsApp bot",    result: "Scope call booked",  icon: "✅", ago: "12 min ago"},
  { name: "Ngozi A.",  city: "Enugu",          tool: "Build vs Buy",      detail: "Customer support system",      result: "Buy: Freshdesk",     icon: "⚖️", ago: "14 min ago"},
  { name: "Ade B.",    city: "Kano",           tool: "PMF Score",         detail: "AgriTech mobile app",          result: "Score: 61/100",      icon: "📈", ago: "16 min ago"},
  { name: "Biola A.",  city: "Lagos",          tool: "Cost Estimator",    detail: "Mobile app (iOS + Android)",  result: "₦1.5M – ₦4.2M",    icon: "💰", ago: "18 min ago"},
  { name: "Damilola S.", city: "Lekki",        tool: "Timeline Estimator",detail: "Admin dashboard + analytics", result: "6–10 weeks",         icon: "📅", ago: "20 min ago"},
  { name: "Yemi A.",   city: "Victoria Island", tool: "MVP Scope",        detail: "EdTech SaaS platform",        result: "9 Phase 1 features", icon: "🗺️", ago: "22 min ago"},
];

/* Give each a stable id */
const TAGGED: Activity[] = FEED.map((a, i) => ({ ...a, id: i }));

const VISIBLE_COUNT = 3;

export function LiveActivityFeed({ embedded = false }: { embedded?: boolean }) {
  const [startIdx, setStartIdx] = useState(0);

  /* Rotate one entry every 4 s */
  useEffect(() => {
    const id = setInterval(() => {
      setStartIdx((prev) => (prev + 1) % TAGGED.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const visible = Array.from({ length: VISIBLE_COUNT }, (_, i) =>
    TAGGED[(startIdx + i) % TAGGED.length]
  );

  const wrap = (content: React.ReactNode) => embedded
    ? <div className="h-full flex flex-col">{content}</div>
    : (
      <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border)]">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink)]/45">Recent activity</span>
          <span className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />Live
          </span>
        </div>
        {content}
        <div className="px-5 py-3 border-t border-[var(--border)] text-center">
          <span className="text-[10px] text-[var(--ink)]/25">Founders using our free tools right now</span>
        </div>
      </div>
    );

  const feedContent = (
    <div className="divide-y divide-[var(--border)]">
      <AnimatePresence mode="popLayout" initial={false}>
        {visible.map((a) => (
          <motion.div
            key={a.id}
            layout
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex items-start gap-3 px-5 py-4"
          >
            <span className="text-xl shrink-0 mt-0.5">{a.icon}</span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-heading font-semibold text-[var(--ink)] text-sm truncate">
                  {a.name}
                  <span className="font-normal text-[var(--ink)]/35 text-xs ml-1.5">· {a.city}</span>
                </span>
                <span className="font-mono text-[10px] text-[var(--ink)]/25 shrink-0">{a.ago}</span>
              </div>
              <p className="text-xs text-[var(--ink)]/45 mt-0.5">{a.tool} — {a.detail}</p>
              <p className="text-xs font-semibold text-[var(--brand)] mt-1">{a.result}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );

  return wrap(feedContent);
}
