"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  IconBallFootball,
  IconBallBasketball,
  IconCalendarEvent,
  IconMapPin,
  IconAlertCircle,
  IconArrowRight,
  IconRefresh,
} from "@tabler/icons-react";
import { SPORT_LEAGUES, generatePrediction, type SportPrediction, type FormResult } from "@/mock/sportsPredictor";
import { captureToolLead } from "@/lib/captureToolLead";
import { validateEmail } from "@/lib/validate";
import type { Fixture } from "@/types/sports";

/* ── Small pieces ─────────────────────────────────────────────────────────── */

function FormBadge({ result }: { result: FormResult }) {
  const map = {
    W: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    D: "bg-[var(--fg)]/10 text-[var(--fg)]/60 border-[var(--border)]",
    L: "bg-rose-500/15 text-rose-400 border-rose-500/30",
  } as const;
  return (
    <span className={`flex h-6 w-6 items-center justify-center rounded-md border font-mono text-[10px] font-bold ${map[result]}`}>
      {result}
    </span>
  );
}

function ProbBar({ homePct, drawPct, awayPct }: { homePct: number; drawPct: number; awayPct: number }) {
  return (
    <div className="w-full h-3 rounded-full overflow-hidden flex bg-[var(--border)]">
      <motion.div className="bg-[var(--primary)] h-full" initial={{ width: 0 }} animate={{ width: `${homePct}%` }} transition={{ duration: 0.7, ease: "easeOut" }} />
      <motion.div className="bg-[var(--fg)]/25 h-full" initial={{ width: 0 }} animate={{ width: `${drawPct}%` }} transition={{ duration: 0.7, ease: "easeOut", delay: 0.05 }} />
      <motion.div className="bg-amber-400 h-full" initial={{ width: 0 }} animate={{ width: `${awayPct}%` }} transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }} />
    </div>
  );
}

function fixtureDateLabel(fixture: Fixture): string {
  const d = new Date(fixture.date);
  const dateStr = d.toLocaleDateString("en-NG", { weekday: "short", day: "numeric", month: "short" });
  return fixture.time ? `${dateStr} · ${fixture.time.slice(0, 5)}` : dateStr;
}

/* ── Component ────────────────────────────────────────────────────────────── */

export function SportPredictor() {
  const [league, setLeague] = useState(SPORT_LEAGUES[0]);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Fixture | null>(null);

  const [showEmailGate, setShowEmailGate] = useState(false);
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const isEmailValid = !validateEmail(email);

  const [prediction, setPrediction] = useState<SportPrediction | null>(null);

  const fetchFixtures = async (l: typeof league) => {
    setLoading(true);
    setLoadError(null);
    setSelected(null);
    setPrediction(null);
    try {
      const res = await fetch(`/api/sports?league=${l.id}&name=${encodeURIComponent(l.name)}`);
      const data = await res.json();
      if (data.error) setLoadError(data.error);
      setFixtures(data.fixtures ?? []);
    } catch {
      setLoadError("Unable to load fixtures right now.");
      setFixtures([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFixtures(league);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [league.id]);

  function pickFixture(f: Fixture) {
    setSelected(f);
    setShowEmailGate(true);
  }

  function unlockPrediction() {
    const err = validateEmail(email);
    setEmailTouched(true);
    setEmailError(err);
    if (err || !selected) {
      emailRef.current?.focus();
      return;
    }
    const result = generatePrediction(selected.homeTeam, selected.awayTeam, selected.date, league.sport);
    captureToolLead({
      tool: "sport-predictor",
      source: "email-capture",
      email,
      selections: { league: league.name, sport: league.sport, homeTeam: selected.homeTeam, awayTeam: selected.awayTeam, date: selected.date },
      result: { predictedScore: result.predictedScore, homeWinPct: result.homeWinPct, drawPct: result.drawPct, awayWinPct: result.awayWinPct, confidence: result.confidence },
    });
    setPrediction(result);
    setShowEmailGate(false);
  }

  function reset() {
    setSelected(null);
    setPrediction(null);
    setShowEmailGate(false);
    setEmail("");
    setEmailTouched(false);
    setEmailError(null);
  }

  /* ── Result view ──────────────────────────────────────────────────────── */
  if (prediction && selected) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="lm-card p-8 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--primary)] mb-4">
            {league.name} · Match Analysis
          </p>
          <h2 className="font-display text-xl font-extrabold text-[var(--fg)] mb-1">
            {prediction.homeTeam} <span className="text-[var(--fg)]/30">vs</span> {prediction.awayTeam}
          </h2>
          <p className="text-xs text-[var(--fg)]/40 mb-8">{fixtureDateLabel(selected)}</p>

          <p className="gradient-text font-display text-5xl font-extrabold mb-2">{prediction.predictedScore}</p>
          <p className="text-xs text-[var(--fg)]/40 mb-8">Projected scoreline</p>

          <ProbBar homePct={prediction.homeWinPct} drawPct={prediction.drawPct} awayPct={prediction.awayWinPct} />
          <div className="flex justify-between text-[11px] mt-2 text-[var(--fg)]/50">
            <span><strong className="text-[var(--primary)]">{prediction.homeWinPct}%</strong> {prediction.homeTeam}</span>
            <span>{prediction.drawPct}% Draw</span>
            <span><strong className="text-amber-400">{prediction.awayWinPct}%</strong> {prediction.awayTeam}</span>
          </div>

          <span className={[
            "inline-flex items-center mt-6 rounded-full border px-3 py-1 text-[11px] font-semibold font-mono uppercase tracking-wide",
            prediction.confidence === "High" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              : prediction.confidence === "Medium" ? "border-amber-400/30 bg-amber-400/10 text-amber-400"
              : "border-[var(--border)] bg-[var(--fg)]/5 text-[var(--fg)]/50",
          ].join(" ")}>
            {prediction.confidence} confidence
          </span>
        </div>

        {/* Form guides */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="lm-card p-5">
            <p className="text-xs font-semibold text-[var(--fg)] mb-3">{prediction.homeTeam} · last 5</p>
            <div className="flex gap-1.5">
              {prediction.homeForm.map((r, i) => <FormBadge key={i} result={r} />)}
            </div>
          </div>
          <div className="lm-card p-5">
            <p className="text-xs font-semibold text-[var(--fg)] mb-3">{prediction.awayTeam} · last 5</p>
            <div className="flex gap-1.5">
              {prediction.awayForm.map((r, i) => <FormBadge key={i} result={r} />)}
            </div>
          </div>
        </div>

        {/* Key factors */}
        <div className="lm-card p-6">
          <h3 className="font-heading font-bold text-[var(--fg)] mb-4 text-sm">Analysis factors</h3>
          <div className="space-y-2.5">
            {prediction.keyFactors.map((f, i) => (
              <p key={i} className="text-xs text-[var(--fg)]/55 leading-relaxed flex gap-2">
                <span className="text-[var(--primary)] shrink-0">•</span>{f}
              </p>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-[var(--fg)]/30 text-center leading-relaxed px-4">
          For entertainment and informational purposes only — a rule-based form &amp; head-to-head read, not betting advice or verified odds. Please gamble responsibly.
        </p>

        <div className="lm-card p-6 text-center">
          <p className="font-heading font-bold text-[var(--fg)] mb-1">Want a tool like this built for your product?</p>
          <p className="text-sm text-[var(--fg)]/45 mb-5">Full analysis sent to <strong>{email}</strong>.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/quote" className="group relative inline-flex h-11 items-center gap-2 overflow-hidden rounded-full bg-[var(--primary)] px-7 font-semibold text-sm text-[var(--bg)] btn-glow transition-all active:scale-95">
              <span aria-hidden className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/18 to-transparent skew-x-12" />
              Talk to our team <IconArrowRight size={14} className="relative" />
            </Link>
            <button type="button" onClick={reset} className="inline-flex h-11 items-center gap-2 px-5 text-sm text-[var(--fg)]/40 hover:text-[var(--fg)] transition-colors">
              <IconRefresh size={14} /> Predict another match
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Email gate ───────────────────────────────────────────────────────── */
  if (showEmailGate && selected) {
    return (
      <div className="max-w-xl mx-auto">
        <div className="lm-card p-8">
          <p className="font-mono text-[var(--primary)] text-[10px] uppercase tracking-[0.25em] mb-3">Almost there</p>
          <h2 className="font-display text-2xl font-extrabold text-[var(--fg)] mb-2">
            Unlock the full analysis
          </h2>
          <p className="text-sm text-[var(--fg)]/45 mb-6 leading-relaxed">
            {selected.homeTeam} vs {selected.awayTeam} — win probability, form guide, head-to-head record and projected scoreline.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block font-heading text-sm font-semibold text-[var(--fg)] mb-1.5">
                Email address <span className="text-[var(--primary)]">*</span>
              </label>
              <input
                ref={emailRef} type="email" value={email} autoFocus
                onChange={(e) => { setEmail(e.target.value); if (emailTouched) setEmailError(validateEmail(e.target.value)); }}
                onBlur={() => { setEmailTouched(true); setEmailError(validateEmail(email)); }}
                placeholder="you@example.com"
                className={[
                  "w-full rounded-xl border px-4 py-3 text-sm text-[var(--fg)] bg-[var(--surface)] placeholder:text-[var(--fg)]/30 focus:outline-none focus:ring-1 transition-colors",
                  emailTouched && emailError ? "border-rose-400 focus:border-rose-400 focus:ring-rose-400/20"
                    : isEmailValid && emailTouched ? "border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                    : "border-[var(--border)] focus:border-[var(--primary)] focus:ring-[var(--primary)]/20",
                ].join(" ")}
              />
              {emailTouched && emailError && (
                <span className="flex items-center gap-1 text-[11px] text-rose-400 mt-1.5">
                  <IconAlertCircle size={11} />{emailError}
                </span>
              )}
              <p className="text-xs text-[var(--fg)]/30 mt-2">Added to our newsletter — unsubscribe anytime.</p>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <button type="button" onClick={unlockPrediction}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-[var(--primary)] px-7 font-semibold text-sm text-[var(--bg)] hover:opacity-90 transition-all active:scale-95">
                Show my prediction →
              </button>
              <button type="button" onClick={() => setShowEmailGate(false)} className="text-sm text-[var(--fg)]/40 hover:text-[var(--fg)] transition-colors">← Back</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── League + fixture picker ─────────────────────────────────────────── */
  return (
    <div className="max-w-4xl mx-auto">
      {/* League pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {SPORT_LEAGUES.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => setLeague(l)}
            className={[
              "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold transition-all",
              league.id === l.id
                ? "bg-[var(--primary)] text-[var(--bg)] border-[var(--primary)]"
                : "border-[var(--border)] text-[var(--fg)]/55 hover:border-[var(--primary)]/50 hover:text-[var(--primary)]",
            ].join(" ")}
          >
            {l.sport === "Basketball" ? <IconBallBasketball size={13} /> : <IconBallFootball size={13} />}
            {l.name}
          </button>
        ))}
      </div>

      {/* States */}
      {loading && (
        <div className="grid gap-3 sm:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="lm-card p-5 h-24 animate-pulse" />
          ))}
        </div>
      )}

      {!loading && loadError && fixtures.length === 0 && (
        <div className="lm-card p-8 text-center">
          <p className="text-sm text-[var(--fg)]/60 mb-4">{loadError}</p>
          <button onClick={() => fetchFixtures(league)}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[var(--primary)] text-[var(--primary)] text-sm font-semibold hover:bg-[var(--primary)] hover:text-[var(--bg)] transition-colors">
            <IconRefresh size={14} /> Retry
          </button>
        </div>
      )}

      {!loading && !loadError && fixtures.length === 0 && (
        <div className="lm-card p-8 text-center">
          <p className="text-sm text-[var(--fg)]/50">No upcoming fixtures found for {league.name} right now.</p>
        </div>
      )}

      {!loading && fixtures.length > 0 && (
        <AnimatePresence mode="wait">
          <motion.div
            key={league.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="grid gap-3 sm:grid-cols-2"
          >
            {fixtures.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => pickFixture(f)}
                className="lm-card lm-card-hover p-5 text-left"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="flex items-center gap-1.5 text-[11px] text-[var(--fg)]/40">
                    <IconCalendarEvent size={12} />{fixtureDateLabel(f)}
                  </span>
                  {f.venue && (
                    <span className="hidden sm:flex items-center gap-1 text-[10px] text-[var(--fg)]/30 truncate max-w-[120px]">
                      <IconMapPin size={11} />{f.venue}
                    </span>
                  )}
                </div>
                <p className="font-heading font-bold text-sm text-[var(--fg)]">
                  {f.homeTeam} <span className="text-[var(--fg)]/30 font-normal">vs</span> {f.awayTeam}
                </p>
                <span className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-[var(--primary)]">
                  Get prediction <IconArrowRight size={12} />
                </span>
              </button>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
