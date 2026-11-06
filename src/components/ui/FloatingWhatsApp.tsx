"use client";

import { useState, useEffect } from "react";
import { IconBrandWhatsapp, IconX } from "@tabler/icons-react";

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2347070994391";

export function FloatingWhatsApp() {
  const [mounted, setMounted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  useEffect(() => {
    setMounted(true);
    // Hide initial tooltip after 8 seconds so it doesn't distract
    const timer = setTimeout(() => setShowTooltip(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  const defaultMessage = encodeURIComponent(
    "Hi TechBuddy! I saw your website and would like to discuss a project / software idea."
  );
  const waUrl = `https://wa.me/${WA_NUMBER}?text=${defaultMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Tooltip speech bubble */}
      {showTooltip && (
        <div className="relative hidden sm:flex items-center gap-2 rounded-2xl bg-[var(--page)] border border-[var(--border)] px-4 py-2.5 shadow-xl text-xs text-[var(--ink)] animate-in fade-in slide-in-from-right-4 duration-300">
          <span>
            💬 <strong>Need software?</strong> Chat with us on WhatsApp
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setShowTooltip(false);
            }}
            aria-label="Dismiss message"
            className="text-[var(--ink-faint)] hover:text-[var(--ink)] ml-1 transition-colors"
          >
            <IconX size={13} />
          </button>
        </div>
      )}

      {/* WhatsApp Button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with TechBuddy on WhatsApp"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-[#25D366]/40 active:scale-95"
      >
        {/* Pulse ring animation */}
        <span className="absolute -inset-1 -z-10 animate-ping rounded-full bg-[#25D366]/30 duration-1000" />

        <IconBrandWhatsapp size={30} className="transition-transform duration-300 group-hover:rotate-6" />

        {/* Status indicator dot */}
        <span className="absolute top-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-[var(--page)] bg-emerald-400" />
      </a>
    </div>
  );
}

