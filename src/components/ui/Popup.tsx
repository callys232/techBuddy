"use client";

import { useEffect } from "react";
import { IconX } from "@tabler/icons-react";

type PopupSize = "sm" | "md" | "lg" | "xl";

const SIZE_CLASSES: Record<PopupSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: PopupSize;
}

export function Popup({ isOpen, onClose, title, children, size = "md" }: PopupProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal
      aria-label={title}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 -webkit-backdrop-filter backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={[
          "relative z-10 w-full rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] shadow-2xl",
          "max-h-[90vh] overflow-y-auto",
          SIZE_CLASSES[size],
        ].join(" ")}
      >
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          {title && (
            <h2 className="font-display text-xl font-bold text-[var(--fg)]">{title}</h2>
          )}
          <button
            onClick={onClose}
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] text-[var(--fg)]/50 hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all"
            aria-label="Close"
          >
            <IconX size={15} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
