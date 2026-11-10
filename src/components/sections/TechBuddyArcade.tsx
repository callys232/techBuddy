"use client";

import { useState } from "react";
import Link from "next/link";
import {
  IconDeviceGamepad2,
  IconBrandWhatsapp,
  IconArrowRight,
  IconSparkles,
  IconTrophy,
} from "@tabler/icons-react";

export function TechBuddyArcade() {
  const [rolling, setRolling] = useState(false);
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [rewardCode, setRewardCode] = useState<string | null>(null);
  const [discountTitle, setDiscountTitle] = useState<string | null>(null);

  const handleRoll = () => {
    if (rolling) return;
    setRolling(true);

    let counter = 0;
    const interval = setInterval(() => {
      setDiceResult(Math.floor(Math.random() * 6) + 1);
      counter++;
      if (counter > 8) {
        clearInterval(interval);
        const finalRoll = Math.floor(Math.random() * 6) + 1;
        setDiceResult(finalRoll);

        if (finalRoll === 6) {
          setDiscountTitle("JACKPOT ROLL! ₦15,000 Off Project Kickoff");
          setRewardCode("JACKPOT15");
        } else if (finalRoll >= 4) {
          setDiscountTitle("BIG WIN! 10% Off Any Web, Mobile or Bot Build");
          setRewardCode("LUCKY10");
        } else {
          setDiscountTitle("5% Builder Discount Unlocked");
          setRewardCode("BUDDY5");
        }
        setRolling(false);
      }
    }, 70);
  };

  return (
    <section className="relative overflow-hidden bg-[var(--surface)] py-[var(--section-y)] border-b border-[var(--border)]">
      <div className="shell relative z-10 max-w-4xl mx-auto">
        <div className="rounded-3xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/[0.04] via-[var(--surface)] to-[var(--page)] p-6 sm:p-10 shadow-lg relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left Column: Intro */}
            <div className="max-w-md text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-500 text-xs font-mono font-bold mb-3 border border-amber-500/30">
                <IconDeviceGamepad2 size={15} />
                <span>TECHBUDDY ARCADE</span>
              </div>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[var(--ink)] leading-tight">
                Roll the Dice. Win an Instant Project Discount!
              </h2>
              <p className="text-xs sm:text-sm text-[var(--ink-muted)] mt-2.5 leading-relaxed">
                Test our interactive gamification engine live. Roll the virtual dice to unlock up to ₦15,000 off your next web, mobile, or WhatsApp bot kickoff.
              </p>

              <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center justify-center md:justify-start gap-4 text-[11px] text-[var(--ink-muted)]">
                <span>✓ 100% Free to Play</span>
                <span>•</span>
                <span>✓ Redeemable on WhatsApp</span>
              </div>
            </div>

            {/* Right Column: Interactive Dice Box */}
            <div className="w-full md:w-auto flex flex-col items-center">
              <div className="p-6 rounded-2xl bg-[var(--surface-raised)] border-2 border-[var(--border-strong)] shadow-card flex flex-col items-center min-w-[260px] text-center">
                {/* Dice Display */}
                <div
                  className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-[var(--brand)] to-blue-500 text-white shadow-lg text-4xl font-extrabold transition-transform duration-200 ${
                    rolling ? "animate-spin" : "scale-100"
                  }`}
                >
                  {diceResult ? `🎲 ${diceResult}` : "🎲"}
                </div>

                {/* Roll Action Button */}
                <button
                  type="button"
                  onClick={handleRoll}
                  disabled={rolling}
                  className="mt-5 btn-primary h-11 px-7 text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0 shadow-md transition-all active:scale-95"
                >
                  {rolling ? "Rolling..." : diceResult ? "Roll Again" : "Roll the Dice!"}
                </button>

                {/* Result Display */}
                {rewardCode && (
                  <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs animate-in fade-in zoom-in-95 duration-200">
                    <p className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                      <IconTrophy size={14} />
                      <span>{discountTitle}</span>
                    </p>
                    <p className="font-mono text-sm font-extrabold text-[var(--ink)] mt-1 bg-[var(--surface)] py-1 px-2.5 rounded border border-[var(--border)]">
                      {rewardCode}
                    </p>
                    <a
                      href={`https://wa.me/2347070994391?text=${encodeURIComponent(
                        `Hi TechBuddy! I just rolled the dice on your site and unlocked voucher code "${rewardCode}". I want to claim this discount for my project.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2.5 inline-flex items-center justify-center gap-1.5 text-[11px] font-bold text-white bg-[#25D366] hover:bg-[#1ebd5a] py-1.5 px-3 rounded-lg w-full transition-colors"
                    >
                      <IconBrandWhatsapp size={14} />
                      <span>Claim on WhatsApp</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Bot builder link */}
              <Link
                href="/tools/whatsapp-bot-builder"
                className="mt-3 text-[11px] font-semibold text-[var(--brand)] hover:underline inline-flex items-center gap-1"
              >
                <span>Add viral games like this to your WhatsApp bot</span>
                <IconArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

