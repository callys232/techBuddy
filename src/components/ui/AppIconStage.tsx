"use client";

import { useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import gsap from "gsap";

const AppIconOrb = dynamic(() => import("@/components/three/AppIconOrb").then((m) => m.AppIconOrb), {
  ssr: false,
  loading: () => null,
});

/**
 * Interactive hero icon: a soft 3D orb (desktop only) turns toward the
 * cursor behind the icon, while the icon card itself tilts toward the
 * pointer on hover — two independent "reacts to the mouse" layers that read
 * as one cohesive, modern interactive stage rather than a flat icon-in-a-box.
 */
export function AppIconStage({ src, alt }: { src: string; alt: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springX = useSpring(mouseX, { stiffness: 150, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 18 });
  const rotateX = useTransform(springY, [0, 1], [10, -10]);
  const rotateY = useTransform(springX, [0, 1], [-10, 10]);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };
  const handleLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  useEffect(() => {
    const el = glowRef.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tween = gsap.to(el, {
        scale: 1.12,
        opacity: 0.32,
        duration: 2.6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
      return () => tween.kill();
    });
    return () => mm.revert();
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="relative inline-flex mb-6"
      style={{ perspective: 800 }}
    >
      {/* Ambient interactive 3D backdrop — desktop only */}
      <div className="absolute -inset-16 hidden lg:block" aria-hidden="true">
        <AppIconOrb />
      </div>

      {/* Soft pulsing glow */}
      <div
        ref={glowRef}
        className="absolute inset-0 rounded-[28px] bg-[var(--brand)]/20 blur-2xl"
        style={{ opacity: 0.22 }}
        aria-hidden="true"
      />

      {/* Icon card — tilts toward the cursor */}
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative h-24 w-24 rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
      >
        <Image src={src} alt={alt} width={56} height={56} className="h-full w-full" />
      </motion.div>
    </div>
  );
}
