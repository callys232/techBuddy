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
  IconLoader2,
} from "@tabler/icons-react";
import { SPORT_LEAGUES } from "@/mock/sportsPredictor";
import type { SportPrediction, FormResult } from "@/lib/sportsEngine/predict";
import { captureToolLead } from "@/lib/captureToolLead";
import { validateEmail } from "@/lib/validate";
import type { Fixture } from "@/types/sports";

/* ── Small pieces ─────────────────────────────────────────────────────────── */

function FormBadge({ result }: { result: FormResult }) {
  const map = {
    W: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    D: "bg-[var(--ink)]/10 text-[var(--ink-muted)] border-[var(--border)]",
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
      <motion.div className="bg-[var(--brand)] h-full" initial={{ width: 0 }} animate={{ width: `${homePct}%` }} transition={{ duration: 0.7, ease: "easeOut" }} />
      <motion.div className="bg-[var(--ink)]/25 h-full" initial={{ width: 0 }} animate={{ width: `${drawPct}%` }} transition={{ duration: 0.7, ease: "easeOut", delay: 0.05 }} />
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
  const [predicting, setPredicting] = useState(false);
  const [predictError, setPredictError] = useState<string | null>(null);

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

  async function unlockPrediction() {
    const err = validateEmail(email);
    setEmailTouched(true);
    setEmailError(err);
    if (err || !selected) {
      emailRef.current?.focus();
      return;
    }

    setPredicting(true);
    setPredictError(null);
    try {
      const res = await fetch("/api/sports/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leagueId: league.id, homeTeam: selected.homeTeam, awayTeam: selected.awayTeam }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Could not build a prediction right now");

      const result = json.prediction as SportPrediction;
      captureToolLead({
        tool: "sport-predictor",
        source: "email-capture",
        email,
        selections: { league: league.name, sport: league.sport, homeTeam: selected.homeTeam, awayTeam: selected.awayTeam, date: selected.date },
        result: { predictedScore: result.predictedScore, homeWinPct: result.homeWinPct, drawPct: result.drawPct, awayWinPct: result.awayWinPct, confidence: result.confidence },
      });
      setPrediction(result);
      setShowEmailGate(false);
    } catch (err: unknown) {
      setPredictError(err instanceof Error ? err.message : "Could not build a prediction right now — try again.");
    } finally {
      setPredicting(false);
    }
  }

  function reset() {
    setSelected(null);
    setPrediction(null);
    setShowEmailGate(false);
    setEmail("");
    setEmailTouched(false);
    setEmailError(null);
    setPredictError(null);
  }

  /* ── Result view ──────────────────────────────────────────────────────── */
  if (prediction && selected) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="card p-8 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--brand)] mb-4">
            {league.name} · Match Analysis
          </p>
          <h2 className="font-heading text-xl font-extrabold text-[var(--ink)] mb-1">
            {prediction.homeTeam} <span className="text-[var(--ink-faint)]">vs</span> {prediction.awayTeam}
          </h2>
          <p className="text-xs text-[var(--ink-faint)] mb-8">{fixtureDateLabel(selected)}</p>

          <p className="text-[var(--brand)] font-heading text-5xl font-extrabold mb-2">{prediction.predictedScore}</p>
          <p className="text-xs text-[var(--ink-faint)] mb-8">Projected scoreline</p>

          <ProbBar homePct={prediction.homeWinPct} drawPct={prediction.drawPct} awayPct={prediction.awayWinPct} />
          <div className="flex justify-between text-[11px] mt-2 text-[var(--ink-muted)]">
            <span><strong className="text-[var(--brand)]">{prediction.homeWinPct}%</strong> {prediction.homeTeam}</span>
            <span>{prediction.drawPct}% Draw</span>
            <span><strong className="text-amber-400">{prediction.awayWinPct}%</strong> {prediction.awayTeam}</span>
          </div>

          <span className={[
            "inline-flex items-center mt-6 rounded-full border px-3 py-1 text-[11px] font-semibold font-mono uppercase tracking-wide",
            prediction.confidence === "High" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              : prediction.confidence === "Medium" ? "border-amber-400/30 bg-amber-400/10 text-amber-400"
              : "border-[var(--border)] bg-[var(--ink)]/5 text-[var(--ink-muted)]",
          ].join(" ")}>
            {prediction.confidence} confidence
          </span>
        </div>

        {/* Form guides */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="card p-5">
            <p className="text-xs font-semibold text-[var(--ink)] mb-3">{prediction.homeTeam} · last {prediction.homeForm.length || 5}</p>
            <div className="flex gap-1.5">
              {prediction.homeForm.length > 0
                ? prediction.homeForm.map((r, i) => <FormBadge key={i} result={r} />)
                : <span className="text-xs text-[var(--ink-faint)]">No completed matches yet this season</span>}
            </div>
          </div>
          <div className="card p-5">
            <p className="text-xs font-semibold text-[var(--ink)] mb-3">{prediction.awayTeam} · last {prediction.awayForm.length || 5}</p>
            <div className="flex gap-1.5">
              {prediction.awayForm.length > 0
                ? prediction.awayForm.map((r, i) => <FormBadge key={i} result={r} />)
                : <span className="text-xs text-[var(--ink-faint)]">No completed matches yet this season</span>}
            </div>
          </div>
        </div>

        {/* Key factors */}
        <div className="card p-6">
          <h3 className="font-heading font-bold text-[var(--ink)] mb-4 text-sm">Analysis factors</h3>
          <div className="space-y-2.5">
            {prediction.keyFactors.map((f, i) => (
              <p key={i} className="text-xs text-[var(--ink-muted)] leading-relaxed flex gap-2">
                <span className="text-[var(--brand)] shrink-0">•</span>{f}
              </p>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-[var(--ink-faint)] text-center leading-relaxed px-4">
          Built from this season&apos;s real results (Elo + statistical modeling) — for entertainment and informational purposes only, not betting advice or verified odds. Please gamble responsibly.
        </p>

        <div className="card p-6 text-center">
          <p className="font-heading font-bold text-[var(--ink)] mb-1">Want a tool like this built for your product?</p>
          <p className="text-sm text-[var(--ink-muted)] mb-5">Full analysis sent to <strong>{email}</strong>.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/quote" className="btn-primary h-11 px-7 text-sm">
              Talk to our team <IconArrowRight size={14} />
            </Link>
            <button type="button" onClick={reset} className="inline-flex h-11 items-center gap-2 px-5 text-sm text-[var(--ink-faint)] hover:text-[var(--ink)] transition-colors">
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
        <div className="card p-8">
          <p className="font-mono text-[var(--brand)] text-[10px] uppercase tracking-[0.25em] mb-3">Almost there</p>
          <h2 className="font-heading text-2xl font-extrabold text-[var(--ink)] mb-2">
            Unlock the full analysis
          </h2>
          <p className="text-sm text-[var(--ink-muted)] mb-6 leading-relaxed">
            {selected.homeTeam} vs {selected.awayTeam} — win probability, form guide, head-to-head record and projected scoreline, built from this season&apos;s real results.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block font-heading text-sm font-semibold text-[var(--ink)] mb-1.5">
                Email address <span className="text-[var(--brand)]">*</span>
              </label>
              <input
                ref={emailRef} type="email" value={email} autoFocus
                onChange={(e) => { setEmail(e.target.value); if (emailTouched) setEmailError(validateEmail(e.target.value)); }}
                onBlur={() => { setEmailTouched(true); setEmailError(validateEmail(email)); }}
                placeholder="you@example.com"
                className={[
                  "w-full rounded-xl border px-4 py-3 text-sm text-[var(--ink)] bg-[var(--surface)] placeholder:text-[var(--ink-faint)] focus:outline-none focus:ring-1 transition-colors",
                  emailTouched && emailError ? "border-rose-400 focus:border-rose-400 focus:ring-rose-400/20"
                    : isEmailValid && emailTouched ? "border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                    : "border-[var(--border)] focus:border-[var(--brand)] focus:ring-[var(--brand)]/20",
                ].join(" ")}
              />
              {emailTouched && emailError && (
                <span className="flex items-center gap-1 text-[11px] text-rose-400 mt-1.5">
                  <IconAlertCircle size={11} />{emailError}
                </span>
              )}
              {predictError && (
                <span className="flex items-center gap-1 text-[11px] text-rose-400 mt-1.5">
                  <IconAlertCircle size={11} />{predictError}
                </span>
              )}
              <p className="text-xs text-[var(--ink-faint)] mt-2">Added to our newsletter — unsubscribe anytime.</p>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <button type="button" onClick={unlockPrediction} disabled={predicting} className="btn-primary h-11 px-7 text-sm disabled:opacity-60">
                {predicting ? <IconLoader2 size={15} className="animate-spin" /> : null}
                {predicting ? "Building your analysis…" : "Show my prediction →"}
              </button>
              <button type="button" onClick={() => setShowEmailGate(false)} className="text-sm text-[var(--ink-faint)] hover:text-[var(--ink)] transition-colors">← Back</button>
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
                ? "bg-[var(--brand)] text-[var(--brand-ink)] border-[var(--brand)]"
                : "border-[var(--border)] text-[var(--ink-muted)] hover:border-[var(--brand)]/50 hover:text-[var(--brand)]",
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
            <div key={i} className="card p-5 h-24 animate-pulse" />
          ))}
        </div>
      )}

      {!loading && loadError && fixtures.length === 0 && (
        <div className="card p-8 text-center">
          <p className="text-sm text-[var(--ink-muted)] mb-4">{loadError}</p>
          <button onClick={() => fetchFixtures(league)} className="btn-secondary h-10 px-5 text-sm">
            <IconRefresh size={14} /> Retry
          </button>
        </div>
      )}

      {!loading && !loadError && fixtures.length === 0 && (
        <div className="card p-8 text-center">
          <p className="text-sm text-[var(--ink-muted)]">No upcoming fixtures found for {league.name} right now.</p>
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
                className="card-interactive p-5 text-left"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="flex items-center gap-1.5 text-[11px] text-[var(--ink-faint)]">
                    <IconCalendarEvent size={12} />{fixtureDateLabel(f)}
                  </span>
                  {f.venue && (
                    <span className="hidden sm:flex items-center gap-1 text-[10px] text-[var(--ink-faint)] truncate max-w-[120px]">
                      <IconMapPin size={11} />{f.venue}
                    </span>
                  )}
                </div>
                <p className="font-heading font-bold text-sm text-[var(--ink)]">
                  {f.homeTeam} <span className="text-[var(--ink-faint)] font-normal">vs</span> {f.awayTeam}
                </p>
                <span className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-[var(--brand)]">
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
