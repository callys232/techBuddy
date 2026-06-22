"use client";

import { useEffect, useState } from "react";
import { useAnimate } from "framer-motion";

type Pose = "run-right" | "run-left" | "climb" | "jump" | "idle";

const S = 1.7; // stroke width

/* ── SVG poses ─────────────────────────────────────────────────────────────── */

function IdlePose() {
  return (
    <svg width="32" height="52" viewBox="0 0 32 52" fill="none" aria-hidden>
      <circle cx="16" cy="8" r="7" stroke="currentColor" strokeWidth={S} />
      <line x1="16" y1="15" x2="16" y2="33" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <line x1="16" y1="21" x2="6"  y2="29" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <line x1="16" y1="21" x2="26" y2="29" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <line x1="16" y1="33" x2="9"  y2="49" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <line x1="16" y1="33" x2="23" y2="49" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
    </svg>
  );
}

function RunA() {
  /* Left arm + right leg forward */
  return (
    <svg width="32" height="52" viewBox="0 0 32 52" fill="none" aria-hidden>
      <circle cx="16" cy="8" r="7" stroke="currentColor" strokeWidth={S} />
      <line x1="17" y1="15" x2="16" y2="33" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <line x1="16" y1="21" x2="6"  y2="15" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <line x1="16" y1="21" x2="26" y2="27" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <line x1="16" y1="33" x2="8"  y2="47" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <line x1="16" y1="33" x2="26" y2="23" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
    </svg>
  );
}

function RunB() {
  /* Right arm + left leg forward */
  return (
    <svg width="32" height="52" viewBox="0 0 32 52" fill="none" aria-hidden>
      <circle cx="16" cy="8" r="7" stroke="currentColor" strokeWidth={S} />
      <line x1="17" y1="15" x2="16" y2="33" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <line x1="16" y1="21" x2="26" y2="15" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <line x1="16" y1="21" x2="6"  y2="27" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <line x1="16" y1="33" x2="24" y2="47" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <line x1="16" y1="33" x2="8"  y2="23" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
    </svg>
  );
}

function ClimbA() {
  /* Right hand up, left foot braced */
  return (
    <svg width="32" height="52" viewBox="0 0 32 52" fill="none" aria-hidden>
      <circle cx="16" cy="8" r="7" stroke="currentColor" strokeWidth={S} />
      <line x1="16" y1="15" x2="16" y2="33" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <line x1="16" y1="21" x2="24" y2="11" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <line x1="16" y1="21" x2="8"  y2="26" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <line x1="16" y1="33" x2="22" y2="24" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <line x1="16" y1="33" x2="9"  y2="45" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
    </svg>
  );
}

function ClimbB() {
  /* Left hand up, right foot braced */
  return (
    <svg width="32" height="52" viewBox="0 0 32 52" fill="none" aria-hidden>
      <circle cx="16" cy="8" r="7" stroke="currentColor" strokeWidth={S} />
      <line x1="16" y1="15" x2="16" y2="33" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <line x1="16" y1="21" x2="8"  y2="11" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <line x1="16" y1="21" x2="24" y2="26" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <line x1="16" y1="33" x2="10" y2="24" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <line x1="16" y1="33" x2="23" y2="45" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
    </svg>
  );
}

function JumpPose() {
  /* Arms wide, legs tucked — mid-air exhilaration */
  return (
    <svg width="40" height="52" viewBox="0 0 40 52" fill="none" aria-hidden>
      <circle cx="20" cy="8" r="7" stroke="currentColor" strokeWidth={S} />
      <line x1="20" y1="15" x2="20" y2="32" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <line x1="20" y1="21" x2="3"  y2="13" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <line x1="20" y1="21" x2="37" y2="13" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <line x1="20" y1="32" x2="10" y2="29" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <line x1="20" y1="32" x2="30" y2="29" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
    </svg>
  );
}

/* ── Animated figure — flips horizontally for run-left ──────────────────────── */

function Figure({ pose, frame }: { pose: Pose; frame: 0 | 1 }) {
  const inner =
    pose === "idle"                             ? <IdlePose />     :
    pose === "jump"                             ? <JumpPose />     :
    pose === "climb"                            ? (frame ? <ClimbB /> : <ClimbA />) :
    /* run-right or run-left: same frames, mirrored for left */
    (frame ? <RunB /> : <RunA />);

  return pose === "run-left"
    ? <div className="[transform:scaleX(-1)]">{inner}</div>
    : <>{inner}</>;
}

/* ── Main component ─────────────────────────────────────────────────────────── */

const EDGE = 52; // px from screen edge

export function PageStickman() {
  const [ref, animate] = useAnimate();
  const [pose,    setPose]    = useState<Pose>("idle");
  const [frame,   setFrame]   = useState<0 | 1>(0);
  const [visible, setVisible] = useState(false);

  /* Limb animation — cycles faster when running */
  useEffect(() => {
    const ms = pose === "run-right" || pose === "run-left" ? 250
             : pose === "climb" ? 430 : 900;
    const id = setInterval(() => setFrame((f) => (f === 0 ? 1 : 0)), ms);
    return () => clearInterval(id);
  }, [pose]);

  /* Full-page circuit */
  useEffect(() => {
    let live = true;
    const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

    const run = async () => {
      await sleep(400);
      if (!live || !ref.current) return;

      const W    = window.innerWidth;
      const H    = window.innerHeight;
      const TOP  = 88;          // y when at the top
      const BOT  = H - 68;     // y when at the bottom
      const MID  = Math.round(H * 0.48);
      const LEFT = EDGE;
      const RIGHT = W - EDGE;

      /* Appear at bottom-left */
      await animate(ref.current, { x: LEFT, y: BOT }, { duration: 0 });
      setVisible(true);

      while (live && ref.current) {
        /* ① Bottom run → right ─────────────────────────────────── */
        setPose("run-right");
        await animate(ref.current, { x: RIGHT }, { duration: 7, ease: "linear" });
        if (!live) break;

        /* ② Climb up the right side ─────────────────────────────── */
        setPose("climb");
        await animate(ref.current, { y: TOP }, { duration: 5.5, ease: "easeInOut" });
        if (!live) break;

        /* ③ Pause — stickman looks around ──────────────────────── */
        setPose("idle");
        await sleep(650);
        if (!live) break;

        /* ④ Run left across the top ─────────────────────────────── */
        setPose("run-left");
        await animate(ref.current, { x: LEFT }, { duration: 7.5, ease: "linear" });
        if (!live) break;

        /* ⑤ Pause top-left ──────────────────────────────────────── */
        setPose("idle");
        await sleep(400);
        if (!live) break;

        /* ⑥ Jump / fall to mid-height ──────────────────────────── */
        setPose("jump");
        await animate(ref.current, { y: MID }, { duration: 0.55, ease: "easeIn" });
        if (!live) break;

        /* ⑦ Land — brief idle ───────────────────────────────────── */
        setPose("idle");
        await sleep(350);
        if (!live) break;

        /* ⑧ Run right at mid-height ─────────────────────────────── */
        setPose("run-right");
        await animate(ref.current, { x: RIGHT }, { duration: 5, ease: "linear" });
        if (!live) break;

        /* ⑨ Climb down right side ───────────────────────────────── */
        setPose("climb");
        await animate(ref.current, { y: BOT }, { duration: 4, ease: "easeInOut" });
        if (!live) break;

        /* ⑩ Idle at bottom-right ────────────────────────────────── */
        setPose("idle");
        await sleep(500);
        if (!live) break;

        /* ⑪ Run left back to start ──────────────────────────────── */
        setPose("run-left");
        await animate(ref.current, { x: LEFT }, { duration: 6.5, ease: "linear" });
        if (!live) break;

        /* ⑫ Reset / breathe before next loop ───────────────────── */
        setPose("idle");
        await sleep(700);
      }
    };

    run();
    return () => { live = false; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={ref}
      aria-hidden
      className={[
        "fixed pointer-events-none z-10 hidden lg:block",
        "text-[var(--fg)] transition-opacity duration-500",
        visible ? "opacity-[0.11]" : "opacity-0",
      ].join(" ")}
    >
      <Figure pose={pose} frame={frame} />
    </div>
  );
}
