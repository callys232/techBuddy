import dns from "node:dns/promises";
import net from "node:net";

export interface AuditFinding {
  category: "security" | "seo" | "performance" | "best-practices";
  label: string;
  passed: boolean;
  detail: string;
}

export interface AuditReport {
  url: string;
  score: number;
  grade: string;
  latencyMs: number;
  findings: AuditFinding[];
}

const SECURITY_HEADERS: { header: string; label: string; detail: string }[] = [
  { header: "strict-transport-security", label: "HSTS enabled", detail: "Forces browsers to always use HTTPS for this domain." },
  { header: "content-security-policy", label: "Content-Security-Policy set", detail: "Restricts what scripts/resources can load, mitigating XSS." },
  { header: "x-frame-options", label: "X-Frame-Options set", detail: "Prevents the site from being embedded in a clickjacking iframe." },
  { header: "x-content-type-options", label: "X-Content-Type-Options set", detail: "Stops browsers from MIME-sniffing responses." },
  { header: "referrer-policy", label: "Referrer-Policy set", detail: "Controls how much referrer data leaks to other sites." },
];

function grade(score: number): string {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 65) return "C";
  if (score >= 50) return "D";
  return "F";
}

function extractMeta(html: string, name: string): string | null {
  const re = new RegExp(`<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']*)["']`, "i");
  return html.match(re)?.[1] ?? null;
}

/** Blocks the classic SSRF trick of pointing a "audit my site" tool at an
 *  internal address (localhost, cloud metadata endpoints, RFC1918 ranges). */
function isPrivateIp(address: string, family: number): boolean {
  if (family === 4) {
    const [a, b] = address.split(".").map(Number);
    if (a === 10) return true;
    if (a === 127) return true;
    if (a === 169 && b === 254) return true; // link-local + cloud metadata (169.254.169.254)
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 0) return true;
    return false;
  }
  const lower = address.toLowerCase();
  if (lower === "::1") return true; // loopback
  if (lower.startsWith("fe80:")) return true; // link-local
  if (lower.startsWith("fc") || lower.startsWith("fd")) return true; // unique local (fc00::/7)
  if (lower.startsWith("::ffff:")) return isPrivateIp(lower.slice(7), 4); // IPv4-mapped
  return false;
}

async function assertPublicHost(urlString: string): Promise<void> {
  const url = new URL(urlString);
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Only http/https URLs can be audited");
  }
  if (net.isIP(url.hostname)) {
    if (isPrivateIp(url.hostname, net.isIP(url.hostname))) {
      throw new Error("This URL points at a private/internal address and can't be audited");
    }
    return;
  }
  const addresses = await dns.lookup(url.hostname, { all: true });
  if (addresses.length === 0) throw new Error("Could not resolve this hostname");
  for (const { address, family } of addresses) {
    if (isPrivateIp(address, family)) {
      throw new Error("This URL resolves to a private/internal address and can't be audited");
    }
  }
}

async function checkExists(base: string, path: string): Promise<boolean> {
  try {
    const res = await fetch(new URL(path, base).toString(), { method: "GET", signal: AbortSignal.timeout(5000) });
    return res.ok;
  } catch {
    return false;
  }
}

const MAX_REDIRECTS = 5;

/** Manually follows redirects (rather than `redirect: "follow"`) so every hop
 *  — not just the original URL — gets the private-address check. Otherwise a
 *  public URL that 302s to an internal address would sail through. */
async function fetchWithGuardedRedirects(startUrl: string, init: RequestInit): Promise<{ res: Response; finalUrl: string }> {
  let url = startUrl;
  for (let i = 0; i <= MAX_REDIRECTS; i++) {
    await assertPublicHost(url);
    const res = await fetch(url, { ...init, redirect: "manual" });
    if (res.status >= 300 && res.status < 400 && res.headers.has("location")) {
      url = new URL(res.headers.get("location")!, url).toString();
      continue;
    }
    return { res, finalUrl: url };
  }
  throw new Error("Too many redirects");
}

export async function runAudit(targetUrl: string): Promise<AuditReport> {
  const findings: AuditFinding[] = [];
  const start = Date.now();

  const { res, finalUrl } = await fetchWithGuardedRedirects(targetUrl, { signal: AbortSignal.timeout(10000) });
  const latencyMs = Date.now() - start;
  const html = await res.text();

  // ── Security ────────────────────────────────────────────────────────────
  findings.push({ category: "security", label: "Served over HTTPS", passed: targetUrl.startsWith("https://"), detail: "All traffic should be encrypted in transit." });
  for (const { header, label, detail } of SECURITY_HEADERS) {
    findings.push({ category: "security", label, passed: res.headers.has(header), detail });
  }

  // ── SEO ─────────────────────────────────────────────────────────────────
  const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim();
  const description = extractMeta(html, "description");
  const ogTitle = extractMeta(html, "og:title");
  const ogImage = extractMeta(html, "og:image");
  const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i)?.[1];
  const hasStructuredData = /application\/ld\+json/i.test(html);

  findings.push({ category: "seo", label: "Has a <title> tag", passed: Boolean(title), detail: title ? `"${title.slice(0, 60)}"` : "No title tag found — every indexable page needs one." });
  findings.push({ category: "seo", label: "Has a meta description", passed: Boolean(description), detail: description ? `${description.length} characters` : "Missing — search engines write their own snippet without it." });
  findings.push({ category: "seo", label: "Has Open Graph tags", passed: Boolean(ogTitle && ogImage), detail: "Controls how the page looks when shared on social media." });
  findings.push({ category: "seo", label: "Has a canonical URL", passed: Boolean(canonical), detail: "Prevents duplicate-content issues across URL variants." });
  findings.push({ category: "seo", label: "Has structured data (JSON-LD)", passed: hasStructuredData, detail: "Helps search engines understand rich content (products, articles, etc)." });
  findings.push({ category: "seo", label: "robots.txt present", passed: await checkExists(targetUrl, "/robots.txt"), detail: "Tells crawlers what they can and can't index." });
  findings.push({ category: "seo", label: "sitemap.xml present", passed: await checkExists(targetUrl, "/sitemap.xml"), detail: "Helps search engines discover every page on the site." });

  // ── Performance ─────────────────────────────────────────────────────────
  const sizeKb = Buffer.byteLength(html, "utf8") / 1024;
  findings.push({ category: "performance", label: "Fast time-to-first-byte", passed: latencyMs < 800, detail: `${latencyMs}ms — under 800ms is considered fast.` });
  findings.push({ category: "performance", label: "Reasonable HTML payload size", passed: sizeKb < 150, detail: `${sizeKb.toFixed(0)}KB of HTML — under 150KB keeps first paint fast.` });
  findings.push({ category: "performance", label: "Compression enabled", passed: res.headers.has("content-encoding"), detail: "gzip/brotli compression cuts transfer size significantly." });

  // ── Best practices ──────────────────────────────────────────────────────
  const hasViewport = /<meta[^>]+name=["']viewport["']/i.test(html);
  const hasCharset = /<meta[^>]+charset=/i.test(html);
  findings.push({ category: "best-practices", label: "Mobile viewport meta tag", passed: hasViewport, detail: "Required for the page to render correctly on mobile." });
  findings.push({ category: "best-practices", label: "Character encoding declared", passed: hasCharset, detail: "Prevents text rendering issues across browsers." });
  findings.push({ category: "best-practices", label: "No mixed content risk", passed: !targetUrl.startsWith("https://") || !/src=["']http:\/\//i.test(html), detail: "HTTP resources on an HTTPS page get blocked or trigger warnings." });

  const score = Math.round((findings.filter((f) => f.passed).length / findings.length) * 100);

  return { url: targetUrl, score, grade: grade(score), latencyMs, findings };
}
