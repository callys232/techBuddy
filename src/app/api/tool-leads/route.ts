import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL   ?? "",
  process.env.SUPABASE_SERVICE_ROLE_KEY  ?? ""
);
const resend     = new Resend(process.env.RESEND_API_KEY ?? "");
const TEAM_EMAIL = process.env.TEAM_EMAIL ?? "team@techbuddy.ng";
const SITE_URL   = process.env.NEXT_PUBLIC_SITE_URL ?? "https://techbuddy.ng";

/* ── Formatters ──────────────────────────────────────────────────────────────── */

function fmtNaira(n: number) {
  return "₦" + Math.round(n).toLocaleString("en-NG");
}

function selectionsSummaryHtml(tool: string, sel: Record<string, unknown>, res: Record<string, unknown>): string {
  if (tool === "cost-estimator") {
    const pt        = (sel.projectType as string) ?? "—";
    const features  = (sel.features   as string[]) ?? [];
    const timeline  = (sel.timeline   as string) ?? "—";
    const low       = res.low  as number;
    const high      = res.high as number;
    const mid       = res.mid  as number;
    return `
      <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px">
        <tr><td style="padding:6px 0;color:#666;width:160px">Project type</td><td style="padding:6px 0;font-weight:600">${pt}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Features</td><td style="padding:6px 0;font-weight:600">${features.length ? features.join(", ") : "None selected"}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Timeline</td><td style="padding:6px 0;font-weight:600">${timeline}</td></tr>
        <tr style="border-top:1px solid #e5e7eb">
          <td style="padding:10px 0;color:#666">Estimate range</td>
          <td style="padding:10px 0;font-size:20px;font-weight:800;color:#0ea5e9">${fmtNaira(low)} – ${fmtNaira(high)}</td>
        </tr>
        <tr><td style="padding:4px 0;color:#666">Midpoint</td><td style="padding:4px 0;font-weight:600">${fmtNaira(mid)}</td></tr>
      </table>`;
  }

  if (tool === "timeline-estimator") {
    const pt        = (sel.projectType as string) ?? "—";
    const features  = (sel.features   as string[]) ?? [];
    const readiness = (sel.readiness  as string) ?? "—";
    const feedback  = (sel.feedback   as string) ?? "—";
    const integ     = (sel.integration as string) ?? "—";
    const minW      = res.totalMin as number;
    const maxW      = res.totalMax as number;
    const launch    = (res.normalLaunch as string) ?? "—";
    const phases    = (res.phases as { name: string; min: number; max: number }[]) ?? [];

    const phaseRows = phases.map((p) =>
      `<tr><td style="padding:4px 0;color:#666">${p.name}</td><td style="padding:4px 0">${p.min}–${p.max} weeks</td></tr>`
    ).join("");

    return `
      <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px">
        <tr><td style="padding:6px 0;color:#666;width:160px">Project type</td><td style="padding:6px 0;font-weight:600">${pt}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Features</td><td style="padding:6px 0;font-weight:600">${features.length ? features.join(", ") : "None"}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Design readiness</td><td style="padding:6px 0;font-weight:600">${readiness}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Feedback speed</td><td style="padding:6px 0;font-weight:600">${feedback}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Integrations</td><td style="padding:6px 0;font-weight:600">${integ}</td></tr>
        <tr style="border-top:1px solid #e5e7eb">
          <td style="padding:10px 0;color:#666">Total timeline</td>
          <td style="padding:10px 0;font-size:20px;font-weight:800;color:#0ea5e9">${minW}–${maxW} weeks</td>
        </tr>
        <tr><td style="padding:4px 0;color:#666">Estimated launch</td><td style="padding:4px 0;font-weight:600">${launch}</td></tr>
        ${phaseRows ? `<tr style="border-top:1px solid #e5e7eb"><td colspan="2" style="padding:8px 0;color:#666;font-size:12px">Phase breakdown</td></tr>${phaseRows}` : ""}
      </table>`;
  }

  if (tool === "ndpr-checker") {
    const score    = (res.score    as number) ?? 0;
    const grade    = (res.grade    as string) ?? "—";
    const critical = (res.criticalGaps as number) ?? 0;
    const cat      = (sel.category as string) ?? "—";
    return `
      <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px">
        <tr><td style="padding:6px 0;color:#666;width:160px">Industry</td><td style="padding:6px 0;font-weight:600">${cat}</td></tr>
        <tr style="border-top:1px solid #e5e7eb">
          <td style="padding:10px 0;color:#666">Compliance score</td>
          <td style="padding:10px 0;font-size:22px;font-weight:800;color:#0ea5e9">${score} / 100</td>
        </tr>
        <tr><td style="padding:4px 0;color:#666">Grade</td><td style="padding:4px 0;font-weight:600">${grade}</td></tr>
        <tr><td style="padding:4px 0;color:#666">Critical gaps</td><td style="padding:4px 0;font-weight:600;color:#f87171">${critical}</td></tr>
      </table>`;
  }

  if (tool === "mvp-scope") {
    const desc   = (sel.description   as string) ?? "—";
    const user   = (sel.user          as string) ?? "—";
    const action = (sel["core-action"] as string) ?? "—";
    const rev    = (sel.revenue       as string) ?? "—";
    const cat    = (sel.category      as string) ?? "—";
    const p1     = (res.phase1Count   as number) ?? 0;
    const weeks  = (res.weekRange     as string) ?? "—";
    return `
      <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px">
        <tr><td style="padding:6px 0;color:#666;width:160px">Industry</td><td style="padding:6px 0;font-weight:600">${cat}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Idea</td><td style="padding:6px 0;font-weight:600">${desc}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Core user</td><td style="padding:6px 0">${user}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Core action</td><td style="padding:6px 0">${action}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Revenue model</td><td style="padding:6px 0">${rev}</td></tr>
        <tr style="border-top:1px solid #e5e7eb">
          <td style="padding:10px 0;color:#666">Phase 1 features</td>
          <td style="padding:10px 0;font-size:20px;font-weight:800;color:#0ea5e9">${p1} features · ${weeks} weeks</td>
        </tr>
      </table>`;
  }

  if (tool === "stack-picker") {
    const stack = (res.stack     as string) ?? "—";
    const why   = (res.tagline   as string) ?? "—";
    const cat   = (sel.category  as string) ?? "—";
    return `
      <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px">
        <tr><td style="padding:6px 0;color:#666;width:160px">Industry</td><td style="padding:6px 0;font-weight:600">${cat}</td></tr>
        ${Object.entries(sel).filter(([k]) => k !== "category").map(([k, v]) =>
          `<tr><td style="padding:4px 0;color:#666;text-transform:capitalize">${k.replace(/-/g," ")}</td><td style="padding:4px 0">${v}</td></tr>`
        ).join("")}
        <tr style="border-top:1px solid #e5e7eb">
          <td style="padding:10px 0;color:#666">Recommended stack</td>
          <td style="padding:10px 0;font-size:18px;font-weight:800;color:#0ea5e9">${stack}</td>
        </tr>
        <tr><td style="padding:4px 0;color:#666">Reason</td><td style="padding:4px 0">${why}</td></tr>
      </table>`;
  }

  return `<pre style="font-size:12px;color:#666">${JSON.stringify({ sel, res }, null, 2)}</pre>`;
}

/* ── Route ─────────────────────────────────────────────────────────────────── */

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const {
    tool       = "unknown",
    email      = null,
    source     = "unknown",
    selections = {},
    result     = {},
  } = body as {
    tool?: string;
    email?: string | null;
    source?: string;
    selections?: Record<string, unknown>;
    result?: Record<string, unknown>;
  };

  const toolLabel = tool === "cost-estimator"     ? "Cost Estimator"
                  : tool === "timeline-estimator" ? "Timeline Estimator"
                  : tool === "stack-picker"        ? "Stack Picker"
                  : tool === "ndpr-checker"        ? "NDPR Compliance Checker"
                  : tool === "mvp-scope"           ? "MVP Scope Generator"
                  : tool === "free-audit"          ? "Free Tech Audit"
                  : tool === "build-vs-buy"        ? "Build vs Buy Calculator"
                  : tool === "pmf-score"           ? "PMF Score"
                  : tool;

  const sourceLabel = source === "email-capture"    ? "submitted their email"
                    : source === "quote-click"       ? "clicked Get a Quote"
                    : source === "whatsapp-click"    ? "clicked WhatsApp"
                    : source;

  const summaryHtml = selectionsSummaryHtml(tool, selections, result);
  const subscribed  = source === "email-capture" && !!email;

  /* ── 1. Save to Supabase ──────────────────────────────────────── */
  await supabase.from("tool_leads").insert({
    tool,
    email:      email ?? null,
    source,
    selections,
    result,
    subscribed,
  }).then(() => null, () => null);

  /* ── 2. Subscribe to newsletter (email-capture source only) ───── */
  if (subscribed && email) {
    await supabase.from("newsletter_subs")
      .upsert({ email, tags: [tool], status: "active" }, { onConflict: "email" })
      .then(() => null, () => null);
  }

  /* ── 3. Team alert — always sent ─────────────────────────────── */
  const teamSubject = `🔧 ${toolLabel} lead — ${email ?? "anonymous"} (${sourceLabel})`;

  await resend.emails.send({
    from:    `TechAgency Tools <noreply@techbuddy.ng>`,
    to:      TEAM_EMAIL,
    subject: teamSubject,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#0ea5e9;margin-bottom:4px">${toolLabel} Lead</h2>
        <p style="color:#666;margin-top:0">Source: <strong>${sourceLabel}</strong></p>

        <p><strong>Email:</strong> ${email ? `<a href="mailto:${email}">${email}</a>` : "<em>Not provided (anonymous)</em>"}</p>
        <p><strong>Added to newsletter:</strong> ${subscribed ? "Yes ✅" : "No"}</p>

        <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0" />

        <h3 style="margin-bottom:12px">Their complete selections &amp; estimate</h3>
        ${summaryHtml}

        <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0" />

        ${email ? `<p><a href="mailto:${email}?subject=Following up on your ${toolLabel} estimate" style="background:#0ea5e9;color:#fff;padding:10px 20px;border-radius:20px;text-decoration:none;font-weight:600;font-size:14px">Reply to ${email} →</a></p>` : ""}
        <p style="color:#999;font-size:12px">Captured from ${SITE_URL}/tools/${tool} at ${new Date().toLocaleString("en-NG", { timeZone: "Africa/Lagos" })} WAT</p>
      </div>
    `,
  }).catch(() => null);

  /* ── 4. User confirmation email (only when email provided) ────── */
  if (email) {
    const quoteUrl = tool === "cost-estimator"
      ? `${SITE_URL}/quote?service=${encodeURIComponent((selections.projectType as string) ?? "")}&budget=${encodeURIComponent(String(result.mid ?? ""))}`
      : `${SITE_URL}/quote?timeline=${result.totalMin ?? ""}-${result.totalMax ?? ""}`;

    await resend.emails.send({
      from:    "TechAgency Africa <noreply@techbuddy.ng>",
      to:      email,
      subject: `Your ${toolLabel} estimate — keep it handy`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#111">
          <h2 style="color:#0ea5e9">Your estimate from TechAgency Africa</h2>
          <p style="color:#555">Here's a complete copy of the estimate you just built on our ${toolLabel}.</p>

          ${summaryHtml}

          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0" />

          <h3>What happens next?</h3>
          <ol style="color:#555;line-height:1.8">
            <li>Get a precise, signed scope from our quote wizard</li>
            <li>Our engineers review and reply within 24 hours with a Naira breakdown</li>
            <li>We align on timeline and start building</li>
          </ol>

          <p style="margin-top:24px">
            <a href="${quoteUrl}" style="background:#0ea5e9;color:#fff;padding:12px 24px;border-radius:24px;text-decoration:none;font-weight:700;font-size:15px">
              Get your exact quote →
            </a>
          </p>

          <p style="color:#999;font-size:12px;margin-top:32px">
            You're receiving this because you used our ${toolLabel}${subscribed ? " and subscribed to our newsletter" : ""}.<br/>
            Questions? Reply to this email or WhatsApp us directly.
          </p>
        </div>
      `,
    }).catch(() => null);
  }

  return NextResponse.json({ ok: true });
}
