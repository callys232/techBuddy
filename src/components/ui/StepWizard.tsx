"use client";

import { AnimatePresence, motion } from "framer-motion";

interface Step {
  label: string;
}

interface StepWizardProps {
  steps: Step[];
  currentStep: number;
  onStepChange?: (step: number) => void;
  children: React.ReactNode;
}

export function StepWizard({ steps, currentStep, onStepChange, children }: StepWizardProps) {
  const progress = ((currentStep) / (steps.length - 1)) * 100;

  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="h-1 w-full rounded-full bg-[var(--border)]">
          <div
            className="h-full rounded-full bg-[var(--primary)] transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step dots */}
        <div className="mt-4 flex justify-between">
          {steps.map((step, i) => (
            <button
              key={step.label}
              onClick={() => onStepChange?.(i)}
              disabled={i > currentStep}
              className="flex flex-col items-center gap-1.5 group"
              aria-label={`Step ${i + 1}: ${step.label}`}
            >
              <span
                className={[
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all duration-300",
                  i < currentStep
                    ? "bg-[var(--primary)] text-[var(--bg)]"
                    : i === currentStep
                    ? "border-2 border-[var(--primary)] text-[var(--primary)]"
                    : "border border-[var(--border)] text-[var(--fg)]/30",
                ].join(" ")}
              >
                {i < currentStep ? "✓" : i + 1}
              </span>
              <span className={`hidden sm:block text-xs ${i === currentStep ? "text-[var(--fg)]" : "text-[var(--fg)]/40"}`}>
                {step.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Step panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
