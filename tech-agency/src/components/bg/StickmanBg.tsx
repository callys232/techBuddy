"use client";

import { StickmanScene } from "./StickmanScene";

export function StickmanBg() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* Scene fills the bottom portion */}
      <div className="absolute inset-x-0 bottom-0 h-[340px] sm:h-[380px]">
        <StickmanScene />
      </div>

      {/* Top fade so hero text reads cleanly */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, var(--bg) 0%, var(--bg) 45%, transparent 75%)",
        }}
      />

      {/* Radial trust-blue glow at top-left */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 15% 35%, rgba(56,189,248,0.07) 0%, transparent 60%)," +
            "radial-gradient(ellipse 50% 40% at 85% 60%, rgba(30,58,138,0.1) 0%, transparent 60%)",
        }}
      />
    </div>
  );
}
