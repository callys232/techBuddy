import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IconCheck, IconArrowRight, IconBrandWhatsapp } from "@tabler/icons-react";
import { ALL_SERVICES } from "@/mock/services";
import { ALL_PROJECTS } from "@/mock/portfolio";
import { AppCard } from "@/components/ui/AppCard";
import { PageVectors } from "@/components/bg/PageVectors";

interface Props {
  params: Promise<{ slug: string }>;
}

/* Map slug → service data */
const SLUG_MAP: Record<string, string> = {
  "web-development":    "Web Development",
  "mobile-apps":        "Mobile Apps",
  "devops":             "DevOps & CI/CD",
  "security-pentesting":"Security & Pentesting",
  "cloud-scaling":      "Cloud & Scaling",
  "fintech-payments":   "Fintech & Payments",
  "tech-audit":         "Tech Audit",
  "maintenance":        "Maintenance Plans",
  "ai-integration":     "AI & LLM Integration",
  "whatsapp-api":       "WhatsApp Business API",
  "ui-ux-design":       "UI/UX Design",
  "data-analytics":     "Data & Analytics",
  "seo-growth":         "SEO & Growth",
  "training":           "Training & Tech Transfer",
};

/* Per-service detail content */
const SERVICE_DETAIL: Record<string, {
  tagline: string;
  problem: string;
  deliverables: string[];
  whoFor: string[];
  faqs: { q: string; a: string }[];
  relatedCategories: string[];
}> = {
  "web-development": {
    tagline: "Fast, offline-ready web apps built for the African market",
    problem: "Most web agencies build for a fibre connection. We build for the 3G reality of Nigerian users — fast initial loads, offline fallbacks, and Paystack payments that actually convert.",
    deliverables: ["Full-stack Next.js application", "Mobile-responsive design (all screen sizes)", "CMS for non-technical content updates", "Authentication (email, Google, phone OTP)", "SEO-optimised architecture", "Deployment on Vercel + CI/CD pipeline", "3 months post-launch support"],
    whoFor: ["Startups launching an MVP", "SMEs replacing an outdated website", "Businesses launching an e-commerce store", "SaaS founders building their first platform"],
    faqs: [
      { q: "How long does a web project take?", a: "A landing page takes 2–4 weeks. A full web app with auth and payments takes 8–14 weeks. We give you a staging URL every sprint so you always know where things stand." },
      { q: "Do you use templates or build custom?", a: "We build custom from a well-tested boilerplate — you get a unique product, not a Squarespace reskin. We also offer launch-ready templates if budget is tight." },
      { q: "What happens after launch?", a: "Every project includes a post-launch support period. We also offer monthly maintenance plans from ₦200k/mo to keep your product updated and monitored." },
    ],
    relatedCategories: ["fintech", "saas", "ecommerce"],
  },
  "mobile-apps": {
    tagline: "One codebase. iOS + Android. Built to work on 2G.",
    problem: "Nigerian users download apps on slow connections and use them on devices with limited RAM. We build React Native apps that are lightweight, offline-capable, and feel native on both platforms.",
    deliverables: ["React Native app (iOS + Android)", "Offline-first data sync", "Biometric authentication", "Push notifications (FCM + APNs)", "App store submission (both stores)", "USSD fallback option for low-connectivity users", "3 months post-launch support"],
    whoFor: ["Fintech startups needing a mobile product", "Logistics companies managing field agents", "Healthcare platforms serving remote areas", "E-commerce businesses wanting a native shopping experience"],
    faqs: [
      { q: "React Native or Flutter?", a: "We default to React Native because it shares code with our web stack, reducing cost and maintenance overhead. We use Flutter for projects that need GPU-intensive UI." },
      { q: "What about app store approval?", a: "App store submission and the first round of review fixes are included. Apple rejections (rare with our review process) are handled as part of the scope." },
      { q: "Can the app work without internet?", a: "Yes — offline-first is our default, not an add-on. We use local SQLite with background sync to Supabase." },
    ],
    relatedCategories: ["fintech", "mobile"],
  },
  "fintech-payments": {
    tagline: "Accept money the way Nigerians actually pay",
    problem: "Card payments, bank transfers, USSD, and mobile money — Nigerian users pay in every format. We integrate all of them cleanly, handle CBN compliance, and keep your checkout conversion high.",
    deliverables: ["Paystack or Flutterwave integration", "Virtual account / NUBAN generation", "USSD payment flow", "Webhook handling + reconciliation", "Transaction dashboard + reporting", "CBN/PCI-DSS compliance consultation", "Refund and dispute workflows"],
    whoFor: ["E-commerce platforms accepting customer payments", "SaaS companies billing Nigerian subscribers", "Marketplaces handling seller payouts", "Fintech startups building payment products"],
    faqs: [
      { q: "Paystack or Flutterwave?", a: "Paystack for Nigeria-only products (better conversion rates, cleaner DX). Flutterwave for multi-country or international payouts. We can integrate both." },
      { q: "Can you handle subscription billing?", a: "Yes — recurring charges, failed payment retries, dunning emails, and pause/cancel flows are all in scope." },
      { q: "What about fraud prevention?", a: "We implement 3DS, velocity checks, IP geolocation, and device fingerprinting. We can also integrate Smile Identity for KYC." },
    ],
    relatedCategories: ["fintech"],
  },
  "ai-integration": {
    tagline: "Automate the work eating your team's time",
    problem: "Document extraction, customer support, invoice processing, WhatsApp bots — AI can eliminate 60–70% of manual tasks for most Nigerian SMEs. We build the integration that connects these tools to your actual workflow.",
    deliverables: ["LLM integration (Claude, GPT-4, Gemini)", "Document / PDF extraction pipeline", "Custom chatbot with business context", "WhatsApp AI bot (via Business API)", "RAG system for company knowledge base", "Cost-optimised routing (Haiku for simple, Sonnet for complex)", "Analytics dashboard for AI usage"],
    whoFor: ["Operations teams drowning in manual document work", "Customer support teams handling repetitive queries", "HR teams processing applications at volume", "Any business with a WhatsApp customer-facing channel"],
    faqs: [
      { q: "How much does AI cost to run monthly?", a: "Most SME use cases cost ₦20k–₦80k/month in API fees. We implement smart caching and model routing to minimise cost without sacrificing quality." },
      { q: "Is our data safe when sent to an LLM?", a: "We use API calls (not the AI company's training pipeline) and can set up data anonymisation before sending to the model. NDPR-compliant architecture by default." },
      { q: "How accurate is document extraction?", a: "90–97% accuracy on most structured Nigerian document types (invoices, IDs, bank statements). We build human-review fallbacks for the edge cases." },
    ],
    relatedCategories: ["saas", "fintech"],
  },
  "devops": {
    tagline: "Ship daily. Never go down. Know when something breaks.",
    problem: "Most Nigerian engineering teams deploy manually and find out about outages from customer complaints. We set up automated pipelines, monitoring, and alerting so problems are caught before they cost you clients.",
    deliverables: ["GitHub Actions / GitLab CI pipelines", "Docker containerisation", "Kubernetes (for scale) or simpler orchestration", "Vercel / Railway / AWS / GCP deployment", "Grafana + Prometheus monitoring", "PagerDuty / Slack alerting", "Disaster recovery runbooks"],
    whoFor: ["Engineering teams deploying manually more than once a week", "Products that have had an outage in the last 6 months", "Startups preparing for a major growth event (launch, PR, investor demo)", "Companies moving from a monolith to microservices"],
    faqs: [
      { q: "Do I need Kubernetes?", a: "Probably not until you're handling 50k+ daily active users. We right-size the infrastructure to your actual load — not your aspirations." },
      { q: "What cloud provider do you recommend?", a: "Vercel for Next.js apps. Railway for backend services. AWS/GCP for high-throughput or compliance-sensitive workloads. We're cloud-agnostic." },
      { q: "How long does a DevOps setup take?", a: "A standard CI/CD pipeline with monitoring is 2–4 weeks. A full cloud migration or Kubernetes setup is 6–10 weeks." },
    ],
    relatedCategories: ["saas", "internal"],
  },
  "whatsapp-api": {
    tagline: "Serve customers where they already are",
    problem: "Nigerians don't download apps for every business they interact with. They use WhatsApp. A well-built WhatsApp bot handles order updates, support queries, OTP, and even payments — without an app download.",
    deliverables: ["WhatsApp Business API setup (Meta-approved)", "Custom conversation flows", "OTP and 2FA integration", "Order tracking notifications", "AI-powered FAQ handling", "Webhook security (HMAC validation)", "Analytics and conversation dashboard"],
    whoFor: ["E-commerce businesses sending order updates", "Healthcare providers handling appointment booking", "Banks and fintechs sending OTP", "Any business with a high-volume customer support load"],
    faqs: [
      { q: "How long does WhatsApp API approval take?", a: "Meta's review takes 3–7 business days for most businesses. We handle the application and guide you through the verification." },
      { q: "Can the bot handle complex conversations?", a: "Yes — we integrate Claude or GPT-4 for open-ended queries, with handoff to a human agent when the bot isn't confident." },
      { q: "What does it cost per message?", a: "Meta charges per conversation window (24-hour sessions). Most Nigerian businesses pay ₦15k–₦60k/month in platform fees at reasonable volume. We don't mark this up." },
    ],
    relatedCategories: ["ecommerce", "fintech"],
  },
  "security-pentesting": {
    tagline: "Find your vulnerabilities before attackers do",
    problem: "NDPR fines can reach ₦10M or 2% of annual revenue. A data breach is worse. We run structured penetration tests against your product, report every finding with a severity rating and a fix, and verify that the fixes work.",
    deliverables: ["OWASP Top 10 assessment", "API security review", "Authentication & session management audit", "Database exposure check", "NDPR compliance gap analysis", "Severity-rated findings report (PDF)", "Re-test after fixes are applied"],
    whoFor: ["Fintech companies handling user funds", "Healthcare platforms storing patient data", "Any product about to launch publicly", "Companies that have never had a security review"],
    faqs: [
      { q: "How long does a pentest take?", a: "A standard web application pentest is 5–10 business days including report writing. Larger platforms with multiple APIs take 2–3 weeks." },
      { q: "Do you do continuous security monitoring?", a: "Yes — our Growth and Enterprise maintenance plans include quarterly security audits. We can also set up Dependabot and automated SAST tooling." },
      { q: "Will this disrupt our production system?", a: "We test against a staging environment by default. If you want production testing, we schedule it during low-traffic hours with your team on standby." },
    ],
    relatedCategories: ["fintech", "saas"],
  },
  "ui-ux-design": {
    tagline: "Users figure out your product in 30 seconds, not 30 minutes",
    problem: "Bad UX doesn't just frustrate users — it kills conversion. We do research-led design that accounts for the specific behaviours and constraints of African users: feature phone fallbacks, low-literacy flows, and data-cost sensitivity.",
    deliverables: ["User research & persona development", "Information architecture", "Low-fidelity wireframes", "High-fidelity Figma prototype (clickable)", "Design system + component library", "Handoff to engineering (Figma with tokens)", "Usability testing with real users"],
    whoFor: ["Founders building their first product and need to validate before coding", "Engineering teams that built something but users are confused", "Companies redesigning an existing product", "Anyone launching a public-facing consumer product"],
    faqs: [
      { q: "Do you do UX research or just design?", a: "Both. Research is how we know the design is right before we build it. We run user interviews, review support tickets, and test prototypes before handing off to engineering." },
      { q: "Can you design for both web and mobile?", a: "Yes — our design system covers responsive web and native mobile screens from the same token set." },
      { q: "What does handoff to engineering look like?", a: "Figma file with named components, spacing tokens, and exported assets. We also document interaction states (hover, focus, error, empty) that engineers often miss." },
    ],
    relatedCategories: ["web", "mobile"],
  },
  "tech-audit": {
    tagline: "Know what's wrong with your product before it costs you clients",
    problem: "Slow load times, security holes, accessibility failures, SEO gaps — most products have all of these and don't know it until a client complains or a competitor overtakes them on Google. We surface them all in 5 business days.",
    deliverables: ["Performance audit (Core Web Vitals, Lighthouse)", "Security scan (OWASP, exposed credentials check)", "SEO technical audit (crawl errors, indexability)", "Code quality review (architecture, dead code, tech debt)", "Accessibility audit (WCAG 2.1)", "Prioritised PDF report with fix difficulty ratings", "30-minute debrief call"],
    whoFor: ["Products that feel slow but you don't know why", "Businesses that want to rank higher on Google", "Teams before a major refactor or rewrite", "Anyone inheriting a codebase and wanting to understand its health"],
    faqs: [
      { q: "Do you fix the issues or just report them?", a: "The audit scope is findings and recommendations. Most clients then hire us to fix the high-priority items, or handle them internally with our guidance." },
      { q: "How long does an audit take?", a: "5 business days from when we get access to your codebase and staging URL. Report delivered on day 5, debrief call day 6." },
      { q: "Can I get just one type of audit (e.g. security only)?", a: "Yes — we can scope a focused security, performance, or SEO audit if you know specifically what you need." },
    ],
    relatedCategories: ["web", "saas"],
  },
  "cloud-scaling": {
    tagline: "Handle 10× your current traffic without a rewrite",
    problem: "Most products are not architected for scale from day one — and that's fine. When you need to scale, we do it surgically: identifying the actual bottlenecks instead of over-engineering everything.",
    deliverables: ["Load testing and bottleneck identification", "CDN setup and optimisation", "Database query optimisation", "Horizontal scaling configuration", "Auto-scaling policies", "Cost audit (finding over-provisioned resources)", "99.9% uptime SLA architecture"],
    whoFor: ["Products approaching capacity limits", "Businesses preparing for a traffic spike (launch, PR, ad campaign)", "Teams that are spending too much on cloud infrastructure", "Companies that need to demonstrate uptime SLAs to enterprise clients"],
    faqs: [
      { q: "How do you find the bottleneck?", a: "We instrument your application with distributed tracing (Sentry, Datadog, or open-source equivalents), run load tests, and identify the slowest database queries and API calls before touching any code." },
      { q: "Can you reduce our cloud bill?", a: "Usually yes. Most startups have over-provisioned VMs and pay for features they don't use. We typically identify 20–40% cost reduction opportunities in a standard cloud audit." },
    ],
    relatedCategories: ["saas", "internal"],
  },
  "maintenance": {
    tagline: "Your product keeps running while you focus on growth",
    problem: "Dependency updates, security patches, uptime monitoring, and small feature requests pile up fast. Our retainer plans handle all of this for a predictable monthly fee.",
    deliverables: ["Security patches & dependency updates", "Uptime monitoring + incident response", "Monthly performance and SEO reports", "Bug fixes included (hours vary by plan)", "Feature additions (Growth + Enterprise)", "Quarterly security assessments (Growth +)", "Dedicated account manager (Growth +)"],
    whoFor: ["Products that have launched and need ongoing support", "Founders who want engineering peace of mind", "Companies between development cycles", "Any team that doesn't have in-house engineering capacity"],
    faqs: [
      { q: "What's the minimum commitment?", a: "3 months. After that, month-to-month with 30 days notice to cancel." },
      { q: "What if I need something outside the plan hours?", a: "Additional hours are billed at our standard rate. We always tell you before starting work that would exceed your plan." },
      { q: "Can I upgrade between plans?", a: "Yes — you can move up any time. Moving down requires 30 days notice." },
    ],
    relatedCategories: ["saas", "web"],
  },
  "data-analytics": {
    tagline: "Make decisions based on what's actually happening",
    problem: "Most Nigerian businesses make product decisions based on gut feel because they have no visibility into what users actually do. We build the infrastructure to see everything — and dashboards your team will actually check.",
    deliverables: ["Event tracking implementation (PostHog / Mixpanel)", "Custom BI dashboard (Metabase / custom React)", "Data pipeline (ETL from your sources)", "KPI definition and reporting framework", "Cohort and funnel analysis", "Automated weekly/monthly reports", "Data team training"],
    whoFor: ["Founders making product decisions without data", "Marketing teams spending on channels without knowing ROI", "Operations teams managing large volumes without visibility", "Businesses scaling and needing investor-ready metrics"],
    faqs: [
      { q: "What analytics tools do you use?", a: "PostHog for product analytics (self-hostable, NDPR-compliant). Metabase for business intelligence. Supabase or Postgres as the data warehouse for most projects." },
      { q: "How long before we see insights?", a: "Instrumentation takes 1–2 weeks. Your first meaningful data typically appears within a month of tracking implementation." },
    ],
    relatedCategories: ["saas", "ecommerce"],
  },
  "seo-growth": {
    tagline: "Get found by the businesses that can actually afford to hire you",
    problem: "Most Nigerian businesses rank for nothing because their site is slow, has thin content, or isn't indexed properly. We fix the technical foundation first, then build the content strategy that drives qualified traffic.",
    deliverables: ["Technical SEO audit + fix implementation", "Core Web Vitals optimisation", "Keyword research (Nigerian + African market)", "Content strategy and brief creation", "Schema markup implementation", "Google Search Console + Analytics setup", "Monthly ranking reports"],
    whoFor: ["B2B businesses whose ideal clients search Google before buying", "E-commerce stores losing to competitors in search", "Service businesses with a local Lagos / Nigerian audience", "SaaS companies wanting organic acquisition"],
    faqs: [
      { q: "How long until we see results?", a: "Technical fixes show impact in 4–8 weeks. Content-driven ranking takes 3–6 months. We set honest expectations upfront — no promises of 'page 1 in 30 days'." },
      { q: "Do you write the content?", a: "We create the strategy and briefs. For content production, we work with your team or refer vetted Nigerian tech writers." },
    ],
    relatedCategories: ["web", "ecommerce"],
  },
  "training": {
    tagline: "Your team ships faster and makes fewer expensive mistakes",
    problem: "Hiring senior engineers is expensive and competitive. Upskilling your existing team is faster, cheaper, and builds loyalty. We run practical workshops — no PowerPoints, all code.",
    deliverables: ["Custom curriculum designed for your team's stack", "Hands-on workshops (not lectures)", "Code review of real team PRs as exercises", "Take-home reference materials + video recordings", "Post-workshop 30-day Q&A support", "Certificate of completion for team members"],
    whoFor: ["Engineering teams moving to a new framework or stack", "Companies whose juniors are slowing down seniors", "Teams that want to implement DevOps or security practices", "Founders who want to understand what their engineers are building"],
    faqs: [
      { q: "In-person or remote?", a: "Both. In-person in Lagos; remote via Zoom with recorded sessions shared after each day." },
      { q: "What's the minimum team size?", a: "We run workshops for teams of 3 to 30. For 1–2 people, 1-on-1 mentorship sessions are more cost-effective." },
      { q: "What topics do you cover?", a: "React / Next.js, React Native, Node.js, DevOps / CI/CD, Security (OWASP), System Design, and custom curricula on request." },
    ],
    relatedCategories: [],
  },
};

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2348000000000";

export async function generateStaticParams() {
  return Object.keys(SLUG_MAP).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title = SLUG_MAP[slug];
  if (!title) return { title: "Service not found" };
  const detail = SERVICE_DETAIL[slug];
  return {
    title: `${title} — TechAgency Africa`,
    description: detail?.tagline ?? `Professional ${title} services for African businesses.`,
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const title = SLUG_MAP[slug];
  if (!title) notFound();

  const service = ALL_SERVICES.find((s) => s.title === title);
  const detail  = SERVICE_DETAIL[slug];
  const related = detail?.relatedCategories?.length
    ? ALL_PROJECTS.filter((p) => detail.relatedCategories.includes(p.category)).slice(0, 3)
    : ALL_PROJECTS.slice(0, 3);

  return (
    <div className="min-h-screen bg-[var(--bg)]">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-[var(--section-y)] pb-16 border-b border-[var(--border)]">
        <PageVectors variant="top-right" intensity={0.35} />
        <div className="relative z-10 mx-auto max-w-7xl px-[var(--container-px)]">
          <div className="max-w-3xl">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--primary)]">
              {service?.tag ?? "Service"}
            </span>
            <h1 className="mt-3 font-display text-4xl md:text-5xl font-extrabold text-[var(--fg)] leading-[1.1] mb-4">
              {title}
            </h1>
            {detail && (
              <p className="text-xl text-[var(--fg)]/55 leading-relaxed mb-3">
                {detail.tagline}
              </p>
            )}
            {service && (
              <p className="font-mono text-sm text-[var(--primary)]">{service.startingFrom}</p>
            )}
            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                href={`/quote?service=${encodeURIComponent(title)}`}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-[var(--primary)] px-7 font-heading font-semibold text-sm text-[var(--bg)] hover:opacity-90 transition-opacity"
              >
                Get a quote for {title}
              </Link>
              <a
                href={`https://wa.me/${WA}?text=${encodeURIComponent(`Hi! I'm interested in ${title} services.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-[var(--border)] px-7 font-heading font-semibold text-sm text-[var(--fg)] hover:border-[#25D366] hover:text-[#25D366] transition-colors"
              >
                <IconBrandWhatsapp size={16} />
                Ask on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Problem + Deliverables ────────────────────────────────────────── */}
      {detail && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-[var(--container-px)]">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Problem */}
              <div>
                <h2 className="font-display text-2xl font-extrabold text-[var(--fg)] mb-4">
                  The problem we solve
                </h2>
                <p className="text-[var(--fg)]/65 leading-[1.85] text-[15px]">{detail.problem}</p>

                <h3 className="font-display text-lg font-bold text-[var(--fg)] mt-8 mb-3">
                  Who is this for?
                </h3>
                <ul className="space-y-2">
                  {detail.whoFor.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-[var(--fg)]/65">
                      <IconArrowRight size={13} className="text-[var(--primary)] shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Deliverables */}
              <div>
                <h2 className="font-display text-2xl font-extrabold text-[var(--fg)] mb-4">
                  What you get
                </h2>
                <ul className="space-y-3">
                  {detail.deliverables.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--primary)]/12 mt-0.5">
                        <IconCheck size={11} className="text-[var(--primary)]" />
                      </span>
                      <span className="text-sm text-[var(--fg)]/70 leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Related work ─────────────────────────────────────────────────── */}
      <section className="py-16 bg-[var(--surface)]">
        <div className="mx-auto max-w-7xl px-[var(--container-px)]">
          <h2 className="font-display text-2xl font-extrabold text-[var(--fg)] mb-2">Related work</h2>
          <p className="text-sm text-[var(--fg)]/45 mb-8">Projects where we applied this service.</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((project) => (
              <AppCard key={project.name} {...project} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/portfolio" className="text-sm font-semibold text-[var(--primary)] hover:underline">
              View all projects →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQs ─────────────────────────────────────────────────────────── */}
      {detail?.faqs.length && (
        <section className="py-16">
          <div className="mx-auto max-w-3xl px-[var(--container-px)]">
            <h2 className="font-display text-2xl font-extrabold text-[var(--fg)] mb-8">
              Common questions
            </h2>
            <div className="space-y-6">
              {detail.faqs.map(({ q, a }) => (
                <div key={q} className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-6">
                  <p className="font-heading font-semibold text-[var(--fg)] mb-2">{q}</p>
                  <p className="text-sm text-[var(--fg)]/60 leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-[var(--surface)] text-center">
        <div className="mx-auto max-w-xl px-[var(--container-px)]">
          <h2 className="font-display text-3xl font-extrabold text-[var(--fg)] mb-3">
            Ready to get started?
          </h2>
          <p className="text-[var(--fg)]/50 mb-8 text-sm">
            Tell us what you&apos;re building. We&apos;ll reply with a realistic scope, timeline, and Naira range within 24 hours.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href={`/quote?service=${encodeURIComponent(title)}`}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-[var(--primary)] px-7 font-heading font-semibold text-sm text-[var(--bg)] hover:opacity-90 transition-opacity"
            >
              Get a free quote
            </Link>
            <Link href="/pricing" className="inline-flex h-11 items-center gap-2 rounded-full border border-[var(--border)] px-7 font-heading font-semibold text-sm text-[var(--fg)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors">
              View pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
