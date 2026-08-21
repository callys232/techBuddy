"use client";

import Image from "next/image";
import { IconBrandLinkedin, IconBrandX } from "@tabler/icons-react";

interface TeamCardProps {
  photo: string;
  name: string;
  role: string;
  linkedin?: string;
  twitter?: string;
}

export function TeamCard({ photo, name, role, linkedin, twitter }: TeamCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] transition-all duration-300 hover:border-[var(--brand)]/50">
      {/* Front */}
      <div className="p-5">
        <div className="relative h-16 w-16 overflow-hidden rounded-full mb-4 border-2 border-[var(--border)] group-hover:border-[var(--brand)] transition-colors">
          <Image src={photo} alt={name} fill className="object-cover" />
        </div>
        <p className="font-display font-bold text-[var(--ink)]">{name}</p>
        <p className="text-sm text-[var(--ink)]/50 mt-0.5">{role}</p>
        <div className="mt-3 flex items-center gap-3">
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--ink)]/40 hover:text-[var(--brand)] transition-colors"
              aria-label={`${name} LinkedIn`}
            >
              <IconBrandLinkedin size={18} />
            </a>
          )}
          {twitter && (
            <a
              href={twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--ink)]/40 hover:text-[var(--brand)] transition-colors"
              aria-label={`${name} X/Twitter`}
            >
              <IconBrandX size={18} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
