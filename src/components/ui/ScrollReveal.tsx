"use client";

import { motion, useInView, type TargetAndTransition } from "framer-motion";
import { useRef, type ReactNode } from "react";

type Dir = "up" | "down" | "left" | "right" | "scale" | "fade";

interface Props {
  children:   ReactNode;
  delay?:     number;
  duration?:  number;
  dir?:       Dir;
  className?: string;
  once?:      boolean;
  margin?:    string;
}

const HIDDEN: Record<Dir, TargetAndTransition> = {
  up:    { opacity: 0, y: 36   },
  down:  { opacity: 0, y: -36  },
  left:  { opacity: 0, x: -36  },
  right: { opacity: 0, x: 36   },
  scale: { opacity: 0, scale: 0.90 },
  fade:  { opacity: 0 },
};

const SHOWN: Record<Dir, TargetAndTransition> = {
  up:    { opacity: 1, y: 0 },
  down:  { opacity: 1, y: 0 },
  left:  { opacity: 1, x: 0 },
  right: { opacity: 1, x: 0 },
  scale: { opacity: 1, scale: 1 },
  fade:  { opacity: 1 },
};

export function ScrollReveal({
  children,
  delay    = 0,
  duration = 0.55,
  dir      = "up",
  className,
  once     = true,
  margin   = "-72px",
}: Props) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: margin as `${number}px` });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={HIDDEN[dir]}
      animate={inView ? SHOWN[dir] : HIDDEN[dir]}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Drop-in wrapper for homepage sections — server components work as children */
export function RevealSection({
  children,
  delay = 0,
  className,
}: {
  children:   ReactNode;
  delay?:     number;
  className?: string;
}) {
  return (
    <ScrollReveal delay={delay} dir="up" duration={0.6} margin="-60px" className={className}>
      {children}
    </ScrollReveal>
  );
}
