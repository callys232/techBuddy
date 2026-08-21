"use client";

import { useEffect } from "react";
import { IconX, IconCheck, IconAlertCircle, IconInfoCircle } from "@tabler/icons-react";

type ToastType = "success" | "error" | "info";

interface ToastProps {
  type: ToastType;
  message: string;
  duration?: number;
  onClose: () => void;
}

const CONFIG: Record<ToastType, { icon: React.ComponentType<{ size?: number; className?: string }>; colors: string }> = {
  success: {
    icon: IconCheck,
    colors: "border-[var(--good)] bg-[var(--good)]/10 text-[var(--good)]",
  },
  error: {
    icon: IconAlertCircle,
    colors: "border-[var(--bad)] bg-[var(--bad)]/10 text-[var(--bad)]",
  },
  info: {
    icon: IconInfoCircle,
    colors: "border-[var(--brand)] bg-[var(--brand)]/10 text-[var(--brand)]",
  },
};

export function ToastNotification({ type, message, duration = 4000, onClose }: ToastProps) {
  const { icon: Icon, colors } = CONFIG[type];

  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);

  return (
    <div
      role="alert"
      className={[
        "pointer-events-auto flex items-center gap-3 rounded-[var(--radius-card)] border px-4 py-3 shadow-lg",
        "animate-in slide-in-from-right-full duration-300",
        colors,
      ].join(" ")}
    >
      <Icon size={18} className="shrink-0" />
      <p className="flex-1 text-sm font-medium text-[var(--ink)]">{message}</p>
      <button
        onClick={onClose}
        className="ml-2 text-[var(--ink)]/40 hover:text-[var(--ink)] transition-colors"
        aria-label="Dismiss"
      >
        <IconX size={14} />
      </button>
    </div>
  );
}

export function ToastContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 w-80 pointer-events-none">
      {children}
    </div>
  );
}
