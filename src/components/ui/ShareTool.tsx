"use client";

import { useState } from "react";
import {
  IconBrandWhatsapp,
  IconBrandX,
  IconBrandLinkedin,
  IconCopy,
  IconCheck,
  IconShare,
} from "@tabler/icons-react";

interface ShareToolProps {
  toolName: string;
  description?: string;
  className?: string;
}

export function ShareTool({ toolName, description, className = "" }: ShareToolProps) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.href;
    }
    return "https://techbuddy.ng/tools";
  };

  const shareText = `Check out this free ${toolName} on TechBuddy! ${description ? description + " " : ""}⚡`;

  const shareWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${getShareUrl()}`)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const shareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(getShareUrl())}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const shareLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl())}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <div
      className={`rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand)]/10 text-[var(--brand)]">
          <IconShare size={20} />
        </span>
        <div>
          <p className="font-heading font-semibold text-sm text-[var(--ink)]">
            Found this {toolName} helpful?
          </p>
          <p className="text-xs text-[var(--ink-muted)]">
            Share it with a founder, colleague, or team member.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={shareWhatsApp}
          aria-label="Share on WhatsApp"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all active:scale-95"
          title="Share on WhatsApp"
        >
          <IconBrandWhatsapp size={18} />
        </button>

        <button
          type="button"
          onClick={shareTwitter}
          aria-label="Share on X (Twitter)"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--page)] border border-[var(--border)] text-[var(--ink)] hover:border-[var(--brand)] hover:text-[var(--brand)] transition-all active:scale-95"
          title="Share on X"
        >
          <IconBrandX size={16} />
        </button>

        <button
          type="button"
          onClick={shareLinkedIn}
          aria-label="Share on LinkedIn"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white transition-all active:scale-95"
          title="Share on LinkedIn"
        >
          <IconBrandLinkedin size={18} />
        </button>

        <button
          type="button"
          onClick={copyToClipboard}
          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--page)] px-3 text-xs font-medium text-[var(--ink)] hover:border-[var(--brand)] transition-all active:scale-95"
        >
          {copied ? (
            <>
              <IconCheck size={14} className="text-emerald-500" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <IconCopy size={14} />
              <span>Copy Link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

