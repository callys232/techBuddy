"use client";

import { useState } from "react";
import { TabGroup } from "@/components/ui/TabGroup";
import { AppCard } from "@/components/ui/AppCard";
import { PORTFOLIO_TABS, ALL_PROJECTS } from "@/mock/portfolio";

export function PortfolioContent() {
  const [activeTab, setActiveTab] = useState("all");

  const filtered =
    activeTab === "all"
      ? ALL_PROJECTS
      : ALL_PROJECTS.filter((p) => p.category === activeTab);

  return (
    <>
      <TabGroup tabs={PORTFOLIO_TABS} activeTab={activeTab} onChange={setActiveTab} />
      <div className="mt-10 columns-1 gap-6 sm:columns-2 lg:columns-3 space-y-6">
        {filtered.map((project) => (
          <div key={project.name} className="break-inside-avoid">
            <AppCard {...project} />
          </div>
        ))}
      </div>
    </>
  );
}
