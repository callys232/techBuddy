"use client";

import { useState } from "react";
import { TabGroup } from "@/components/ui/TabGroup";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { SERVICE_TABS, ALL_SERVICES } from "@/mock/services";

export function ServicesContent() {
  const [activeTab, setActiveTab] = useState("all");

  const filtered =
    activeTab === "all"
      ? ALL_SERVICES
      : ALL_SERVICES.filter((s) => s.category === activeTab);

  return (
    <>
      <TabGroup tabs={SERVICE_TABS} activeTab={activeTab} onChange={setActiveTab} />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((s) => (
          <ServiceCard key={s.title} {...s} />
        ))}
      </div>
    </>
  );
}
