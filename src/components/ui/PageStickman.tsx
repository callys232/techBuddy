"use client";

import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

type Pose = "run-right" | "run-left" | "climb" | "jump" | "idle";

const S    = 1.7;
const EDGE = 52;

/* ── SVG poses ─────────────────────────────────────────────────────────────── */

function IdlePose() {
  return (
    <svg width="32" height="52" viewBox="0 0 32 52" fill="none">
      <circle cx="16" cy="8"  r="7"  stroke="currentColor" strokeWidth={S} />
      <line x1="16" y1="15" x2="16" y2="33" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <line x1="16" y1="21" x2="6"  y2="29" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <line x1="16" y1="21" x2="26" y2="29" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <line x1="16" y1="33" x2="9"  y2="49" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <line x1="16" y1="33" x2="23" y2="49" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
    </svg>
  );
}

function RunA() {
  return (
    <svg width="32" height="52" viewBox="0 0 32 52" fill="none">
      <circle cx="16" cy="8"  r="7"  stroke="currentColor" strokeWidth={S} />
      <line x1="17" y1="15" x2="16" y2="33" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <line x1="16" y1="21" x2="6"  y2="15" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <line x1="16" y1="21" x2="26" y2="27" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <line x1="16" y1="33" x2="8"  y2="47" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <line x1="16" y1="33" x2="26" y2="23" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
    </svg>
  );
}

function RunB() {
  return (
    <svg width="32" height="52" viewBox="0 0 32 52" fill="none">
      <circle cx="16" cy="8"  r="7"  stroke="currentColor" strokeWidth={S} />
      <line x1="17" y1="15" x2="16" y2="33" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <line x1="16" y1="21" x2="26" y2="15" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <line x1="16" y1="21" x2="6"  y2="27" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <line x1="16" y1="33" x2="24" y2="47" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <line x1="16" y1="33" x2="8"  y2="23" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
    </svg>
  );
}

function ClimbA() {
  return (
    <svg width="32" height="52" viewBox="0 0 32 52" fill="none">
      <circle cx="16" cy="8"  r="7"  stroke="currentColor" strokeWidth={S} />
      <line x1="16" y1="15" x2="16" y2="33" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <line x1="16" y1="21" x2="24" y2="11" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <line x1="16" y1="21" x2="8"  y2="26" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <line x1="16" y1="33" x2="22" y2="24" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <line x1="16" y1="33" x2="9"  y2="45" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
    </svg>
  );
}

function ClimbB() {
  return (
    <svg width="32" height="52" viewBox="0 0 32 52" fill="none">
      <circle cx="16" cy="8"  r="7"  stroke="currentColor" strokeWidth={S} />
      <line x1="16" y1="15" x2="16" y2="33" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <line x1="16" y1="21" x2="8"  y2="11" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <line x1="16" y1="21" x2="24" y2="26" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <line x1="16" y1="33" x2="10" y2="24" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <line x1="16" y1="33" x2="23" y2="45" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
    </svg>
  );
}

function JumpPose() {
  return (
    <svg width="40" height="52" viewBox="0 0 40 52" fill="none">
      <circle cx="20" cy="8"  r="7"  stroke="currentColor" strokeWidth={S} />
      <line x1="20" y1="15" x2="20" y2="32" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <line x1="20" y1="21" x2="3"  y2="13" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <line x1="20" y1="21" x2="37" y2="13" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <line x1="20" y1="32" x2="10" y2="29" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <line x1="20" y1="32" x2="30" y2="29" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
    </svg>
  );
}

function Figure({ pose, frame }: { pose: Pose; frame: 0 | 1 }) {
  const body =
    pose === "idle"  ? <IdlePose /> :
    pose === "jump"  ? <JumpPose /> :
    pose === "climb" ? (frame ? <ClimbB /> : <ClimbA />) :
    (frame ? <RunB /> : <RunA />);

  return pose === "run-left"
    ? <div className="[transform:scaleX(-1)]">{body}</div>
    : <>{body}</>;
}

/* ── Component ─────────────────────────────────────────────────────────────── */

export function PageStickman() {
  const controls = useAnimation();
  const [pose,  setPose]  = useState<Pose>("idle");
  const [frame, setFrame] = useState<0 | 1>(0);

  /* Limb cycling */
  useEffect(() => {
    const ms = pose === "run-right" || pose === "run-left" ? 250
             : pose === "climb" ? 440 : 1000;
    const id = setInterval(() => setFrame((f) => (f === 0 ? 1 : 0)), ms);
    return () => clearInterval(id);
  }, [pose]);

  /* Circuit */
  useEffect(() => {
    let live = true;
    const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

    type E = "linear" | "easeIn" | "easeOut" | "easeInOut";
    const move = (
      x: number | undefined,
      y: number | undefined,
      duration: number,
      ease: E = "easeInOut"
    ) => controls.start({
      ...(x !== undefined ? { x } : {}),
      ...(y !== undefined ? { y } : {}),
      transition: { duration, ease },
    });

    const run = async () => {
      await sleep(600);
      if (!live) return;

      const W     = window.innerWidth;
      const H     = window.innerHeight;
      const TOP   = 90;
      const BOT   = H - 70;
      const MID   = Math.round(H * 0.48);
      const LEFT  = EDGE;
      const RIGHT = W - EDGE;

      /* Place at bottom-left instantly, then fade in */
      controls.set({ x: LEFT, y: BOT, opacity: 0 });
      await controls.start({ opacity: 0.11, transition: { duration: 0.6 } });

      while (live) {
        /* ① Run right along the bottom */
        setPose("run-right");
        await move(RIGHT, undefined, 7, "linear");
        if (!live) break;

        /* ② Climb up right side */
        setPose("climb");
        await move(undefined, TOP, 5.5);
        if (!live) break;

        /* ③ Look around */
        setPose("idle");
        await sleep(650);
        if (!live) break;

        /* ④ Run left across the top */
        setPose("run-left");
        await move(LEFT, undefined, 7.5, "linear");
        if (!live) break;

        /* ⑤ Pause top-left */
        setPose("idle");
        await sleep(400);
        if (!live) break;

        /* ⑥ Jump — fall to mid */
        setPose("jump");
        await move(undefined, MID, 0.55, "easeIn");
        if (!live) break;

        /* ⑦ Land */
        setPose("idle");
        await sleep(350);
        if (!live) break;

        /* ⑧ Run right at mid-height */
        setPose("run-right");
        await move(RIGHT, undefined, 5, "linear");
        if (!live) break;

        /* ⑨ Climb down right side */
        setPose("climb");
        await move(undefined, BOT, 4);
        if (!live) break;

        /* ⑩ Pause bottom-right */
        setPose("idle");
        await sleep(500);
        if (!live) break;

        /* ⑪ Run left home */
        setPose("run-left");
        await move(LEFT, undefined, 6.5, "linear");
        if (!live) break;

        /* ⑫ Breathe */
        setPose("idle");
        await sleep(700);
      }
    };

    run();
    return () => { live = false; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <motion.div
      aria-hidden
      animate={controls}
      initial={{ x: EDGE, y: 600, opacity: 0 }}
      className="fixed top-0 left-0 pointer-events-none z-10 hidden lg:block text-[var(--fg)]"
    >
      <Figure pose={pose} frame={frame} />
    </motion.div>
  );
}
