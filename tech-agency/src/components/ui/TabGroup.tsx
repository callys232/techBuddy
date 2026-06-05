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
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={[
              "rounded-full px-4 py-1.5 text-sm font-semibold transition-all duration-200",
              activeTab === tab.id
                ? "bg-[var(--primary)] text-[var(--bg)]"
                : "border border-[var(--border)] text-[var(--fg)]/60 hover:border-[var(--primary)] hover:text-[var(--fg)]",
            ].join(" ")}
          >
            {tab.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="relative flex overflow-x-auto border-b border-[var(--border)]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          ref={(el) => { tabRefs.current[tab.id] = el; }}
          onClick={() => onChange(tab.id)}
          className={[
            "relative shrink-0 px-5 py-3 text-sm font-semibold transition-colors duration-200",
            activeTab === tab.id
              ? "text-[var(--fg)]"
              : "text-[var(--fg)]/40 hover:text-[var(--fg)]/70",
          ].join(" ")}
        >
          {tab.label}
        </button>
      ))}
      {/* Sliding bottom indicator */}
      <span
        className="absolute bottom-0 h-0.5 bg-[var(--primary)] transition-all duration-250 ease-in-out"
        style={indicatorStyle}
      />
    </div>
  );
}
