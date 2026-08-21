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
                  ? "bg-[var(--brand)] text-[var(--brand-ink)] border-[var(--brand)]"
                  : "border-[var(--border)] text-[var(--ink-muted)] hover:border-[var(--brand)]/50 hover:text-[var(--brand)]",
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
                ? "text-[var(--brand)]"
                : "text-[var(--ink-faint)] hover:text-[var(--ink-muted)] hover:bg-[var(--surface)]/50",
            ].join(" ")}
          >
            {tab.label}
          </button>
        );
      })}
      {/* Sliding bottom indicator */}
      <span
        className="absolute bottom-0 h-0.5 rounded-full bg-[var(--brand)] transition-all duration-250 ease-in-out"
        style={indicatorStyle}
      />
    </div>
  );
}
