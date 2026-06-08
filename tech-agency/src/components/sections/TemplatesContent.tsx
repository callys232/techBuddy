"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TabGroup } from "@/components/ui/TabGroup";
import { TemplateCard } from "@/components/ui/TemplateCard";
import { TEMPLATE_TABS, ALL_TEMPLATES } from "@/mock/templates";

export function TemplatesContent() {
  const [activeTab, setActiveTab] = useState("all");
  const router = useRouter();

  const filtered =
    activeTab === "all"
      ? ALL_TEMPLATES
      : ALL_TEMPLATES.filter((t) => t.type === activeTab);

  const handleSelect = (name: string) => {
    router.push(`/quote?template=${encodeURIComponent(name)}`);
  };

  return (
    <>
      <TabGroup tabs={TEMPLATE_TABS} activeTab={activeTab} onChange={setActiveTab} />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((t) => (
          <TemplateCard key={t.name} {...t} onSelect={() => handleSelect(t.name)} />
        ))}
        <div className="flex flex-col items-center justify-center rounded-[var(--radius-card)] border border-dashed border-[var(--border)] p-10 text-center">
          <p className="font-display text-lg font-bold text-[var(--fg)] mb-2">Build From Scratch</p>
          <p className="text-sm text-[var(--fg)]/50 mb-6">Custom design for unique requirements.</p>
          <a
            href="/quote"
            className="inline-flex h-10 items-center gap-2 rounded-full border border-[var(--primary)] px-6 text-sm font-semibold text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--bg)] transition-all"
          >
            Start custom build
          </a>
        </div>
      </div>
    </>
  );
}
