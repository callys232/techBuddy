import { createHmac, timingSafeEqual } from "crypto";

/** Minimum seconds a "watch ad" session must run before it's accepted as real. */
export const MIN_WATCH_SECONDS = 15;
/** Max ad-watch rewards per email per calendar day — keeps this from being a free-points faucet. */
export const MAX_WATCHES_PER_DAY = 5;

function secret(): string {
  const s = process.env.AD_TOKEN_SECRET;
  if (!s) throw new Error("AD_TOKEN_SECRET is not configured");
  return s;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

/** Issues an opaque, tamper-evident token binding an email to a start timestamp. */
export function issueWatchToken(email: string): string {
  const payload = JSON.stringify({ email: email.toLowerCase().trim(), startedAt: Date.now() });
  const encoded = Buffer.from(payload, "utf8").toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

/** Verifies signature + minimum elapsed watch time. Returns the bound email or null. */
export function verifyWatchToken(token: string): { email: string } | null {
  const [encoded, sig] = token.split(".");
  if (!encoded || !sig) return null;

  const expected = sign(encoded);
  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expected);
  if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) return null;

  let parsed: { email: string; startedAt: number };
  try {
    parsed = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
  } catch {
    return null;
  }

  const elapsedSeconds = (Date.now() - parsed.startedAt) / 1000;
  if (elapsedSeconds < MIN_WATCH_SECONDS) return null;
  // A stale token (e.g. > 1 hour old) is rejected too — closes the loophole of
  // stockpiling start tokens and replaying them all at once.
  if (elapsedSeconds > 60 * 60) return null;

  return { email: parsed.email };
}
