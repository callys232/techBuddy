"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface StatCardProps {
  value: number;
  label: string;
  suffix?: string;
  color?: "teal" | "amber" | "coral";
}

const COLOR_MAP = {
  teal: "text-[var(--color-accent-teal)]",
  amber: "text-[var(--color-accent-amber)]",
  coral: "text-[var(--color-accent-coral)]",
};

function useCountUp(target: number, duration = 1800, active: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      setCount(Math.floor(start));
      if (start >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, active]);

  return count;
}

export function StatCard({ value, label, suffix = "", color = "teal" }: StatCardProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const count = useCountUp(value, 1800, inView);

  return (
    <div ref={ref} className="flex flex-col items-center gap-1 py-6">
      <span className={`font-display text-5xl font-extrabold ${COLOR_MAP[color]}`}>
        {count}
        {suffix}
      </span>
      <span className="text-sm text-[var(--fg)]/50 text-center">{label}</span>
    </div>
  );
}
