"use client";

import { useState } from "react";
import Image from "next/image";
import {
  IconRocket,
  IconStack2,
  IconShoppingCart,
  IconBriefcase,
  IconArticle,
  IconLayoutDashboard,
  IconDeviceMobile,
  IconTemplate,
} from "@tabler/icons-react";

const TYPE_ICON: Record<string, typeof IconRocket> = {
  landing: IconRocket,
  saas: IconStack2,
  ecommerce: IconShoppingCart,
  portfolio: IconBriefcase,
  blog: IconArticle,
  dashboard: IconLayoutDashboard,
  mobile: IconDeviceMobile,
};

const GRADIENTS = [
  "linear-gradient(135deg, #0369A1 0%, #38BDF8 100%)",
  "linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)",
  "linear-gradient(135deg, #0C4A6E 0%, #0EA5E9 100%)",
  "linear-gradient(135deg, #1D4ED8 0%, #7DD3FC 100%)",
  "linear-gradient(135deg, #075985 0%, #38BDF8 100%)",
  "linear-gradient(135deg, #0F172A 0%, #0284C7 100%)",
];

function hashSeed(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

function GeneratedPreview({ name, type }: { name: string; type: string }) {
  const Icon = TYPE_ICON[type] ?? IconTemplate;
  const gradient = GRADIENTS[hashSeed(name) % GRADIENTS.length];

  return (
    <div
      aria-hidden
      className="absolute inset-0 flex flex-col items-center justify-center gap-3 overflow-hidden"
      style={{ background: gradient }}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 1px, transparent 14px)",
        }}
      />
      <Icon size={32} className="relative text-white/90" strokeWidth={1.6} />
      <p className="relative font-display text-base font-extrabold text-white text-center px-6 leading-snug">
        {name}
      </p>
      <span className="relative font-mono text-[10px] uppercase tracking-widest text-white/65">
        {type}
      </span>
    </div>
  );
}

interface TemplatePreviewProps {
  image: string;
  name: string;
  type: string;
}

/** Fills its (relatively-positioned) parent — drop-in replacement for a bare `<Image fill />`.
 *  Falls back to a generated branded preview when there's no real image or it fails to load. */
export function TemplatePreview({ image, name, type }: TemplatePreviewProps) {
  const [broken, setBroken] = useState(!image || image === "/placeholder.png");

  if (broken) return <GeneratedPreview name={name} type={type} />;

  return (
    <Image
      src={image}
      alt={name}
      fill
      unoptimized={image.startsWith("http")}
      className="object-cover transition-transform duration-500 group-hover:scale-105"
      onError={() => setBroken(true)}
    />
  );
}
