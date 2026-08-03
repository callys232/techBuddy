"use client";

import { useRef, useState, useEffect } from "react";

interface Tab {
  id: string;
  label: string;
}

interface TabGroupProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: "default" | "pill";
}

export function TabGroup({ tabs, activeTab, onChange, variant = "default" }: TabGroupProps) {
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const el = tabRefs.current[activeTab];
    if (!el) return;
    setIndicatorStyle({ left: el.offsetLeft, width: el.offsetWidth });
  }, [activeTab]);

  if (variant === "pill") {
    return (
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={[
                "rounded-full px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-widest transition-all duration-200 border",
                active
                  ? "bg-[var(--primary)] text-[var(--bg)] border-[var(--primary)] shadow-[0_0_16px_rgba(56,189,248,0.35)]"
                  : "border-[var(--border)] text-[var(--fg)]/55 hover:border-[var(--primary)]/50 hover:text-[var(--primary)]",
              ].join(" ")}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="relative flex gap-1 overflow-x-auto border-b border-[var(--border)]">
      {tabs.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            ref={(el) => { tabRefs.current[tab.id] = el; }}
            onClick={() => onChange(tab.id)}
            className={[
              "relative shrink-0 rounded-t-lg px-5 py-3 font-heading text-sm font-semibold transition-colors duration-200",
              active
                ? "text-[var(--primary)]"
                : "text-[var(--fg)]/40 hover:text-[var(--fg)]/70 hover:bg-[var(--surface)]/50",
            ].join(" ")}
          >
            {tab.label}
          </button>
        );
      })}
      {/* Sliding bottom indicator */}
      <span
        className="absolute bottom-0 h-0.5 rounded-full bg-[var(--primary)] shadow-[0_0_8px_rgba(56,189,248,0.6)] transition-all duration-250 ease-in-out"
        style={indicatorStyle}
      />
    </div>
  );
}
