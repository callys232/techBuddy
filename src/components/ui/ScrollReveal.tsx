"use client";

import { useRef, useLayoutEffect, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Dir = "up" | "down" | "left" | "right" | "scale" | "fade";

interface Props {
  children:   ReactNode;
  delay?:     number;
  duration?:  number;
  dir?:       Dir;
  className?: string;
  once?:      boolean;
  /** Kept for call-site compatibility; GSAP uses a fixed 88%-of-viewport trigger instead. */
  margin?:    string;
}

const FROM: Record<Dir, gsap.TweenVars> = {
  up:    { y: 36 },
  down:  { y: -36 },
  left:  { x: -36 },
  right: { x: 36 },
  scale: { scale: 0.9 },
  fade:  {},
};

export function ScrollReveal({
  children,
  delay    = 0,
  duration = 0.55,
  dir      = "up",
  className,
  once     = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(el, { opacity: 0, ...FROM[dir] });
        const tween = gsap.to(el, {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: once ? "play none none none" : "play reverse play reverse",
          },
        });
        return () => { tween.scrollTrigger?.kill(); tween.kill(); };
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(el, { opacity: 1, x: 0, y: 0, scale: 1 });
      });
    }, el);

    return () => ctx.revert();
  }, [dir, delay, duration, once]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** Drop-in wrapper for page sections — server components work as children */
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
    <ScrollReveal delay={delay} dir="up" duration={0.6} className={className}>
      {children}
    </ScrollReveal>
  );
}
