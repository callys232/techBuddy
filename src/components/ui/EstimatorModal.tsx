"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconX } from "@tabler/icons-react";
import { CostEstimator } from "@/components/sections/CostEstimator";

interface Props {
  open:    boolean;
  onClose: () => void;
}

export function EstimatorModal({ open, onClose }: Props) {
  /* Close on Escape */
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  /* Lock body scroll while open */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--bg)] shadow-[0_32px_80px_rgba(0,0,0,0.6)]">

              {/* Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg)] px-8 py-5">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--primary)]">Free tool</p>
                  <h2 className="font-display text-xl font-extrabold text-[var(--fg)] mt-0.5">
                    What Will Your Build Cost?
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close estimator"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--fg)]/50 hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all"
                >
                  <IconX size={16} />
                </button>
              </div>

              {/* Body */}
              <div className="px-8 py-8">
                <CostEstimator />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
