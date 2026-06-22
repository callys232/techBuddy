export interface BlogAuthor {
  name: string;
  avatar: string;
}

export interface BlogPost {
  image: string;
  category: string;
  title: string;
  excerpt: string;
  body: string[];
  author: BlogAuthor;
  readTime: number;
  slug: string;
  date: string;
}

export interface BlogTab {
  id: string;
  label: string;
}

export const BLOG_TABS: BlogTab[] = [
  { id: "all", label: "All" },
  { id: "web-dev", label: "Web Dev" },
  { id: "security", label: "Security" },
  { id: "devops", label: "DevOps" },
  { id: "startup-tech", label: "Startup Tech" },
  { id: "nigeria-tech", label: "Nigeria Tech" },
  { id: "tools", label: "Tools" },
];

export const ALL_POSTS: BlogPost[] = [
  {
    image: "/placeholder.png",
    category: "Web Dev",
    title: "Building Offline-First Apps for Low-Bandwidth Markets",
    excerpt: "Most Nigerian users are on 3G or intermittent WiFi. Here's how to architect apps that feel fast regardless of network conditions — using service workers, background sync, and optimistic UI.",
    body: [
      "Nigeria has the largest internet user base in Africa, yet average mobile data speeds still hover around 10–15 Mbps on 4G and drop to 2–5 Mbps in semi-urban areas. For most users, connections are unpredictable — a two-second lag feels acceptable, but a thirty-second white screen causes churn. Offline-first architecture isn't a premium feature in this market; it's table stakes.",
      "The core pattern is optimistic UI combined with a local data store. When a user submits a form or places an order, you write to IndexedDB immediately and update the UI as if the action succeeded. A background sync worker then flushes pending operations to your server when connectivity resumes. Libraries like Workbox make the service worker boilerplate manageable, but the harder design question is conflict resolution: what happens when two devices make conflicting changes while offline?",
      "For content-heavy apps, choose a CDN-first caching strategy. Pre-cache your app shell (HTML, CSS, JS) on first load so subsequent visits render instantly from cache. For dynamic data, a stale-while-revalidate approach shows cached content immediately and refreshes in the background. The user never waits for a network round-trip on the critical rendering path.",
      "Finally, compress aggressively. WebP images cut file sizes by 40–60% over JPEG. Use brotli compression on your server responses. Lazy-load everything below the fold. In our testing across markets including Lagos, Kano, and Port Harcourt, apps optimised this way felt twice as fast on 3G despite having similar feature sets to unoptimised competitors.",
    ],
    author: { name: "TechAgency Team", avatar: "/placeholder.png" },
    readTime: 7,
    slug: "offline-first-low-bandwidth",
    date: "2026-05-14",
  },
  {
    image: "/placeholder.png",
    category: "Security",
    title: "NDPR Compliance Checklist for Nigerian SaaS Products",
    excerpt: "The Nigeria Data Protection Regulation has real teeth. This 12-point checklist covers data residency, consent capture, breach notification timelines, and what your privacy policy must contain.",
    body: [
      "The Nigeria Data Protection Regulation (NDPR) was issued by NITDA in 2019 and updated with the Data Protection Act (NDPA) in 2023. Non-compliance now carries fines of up to 2% of annual gross revenue or ₦10 million — whichever is higher. The regulation applies to any organisation that processes the personal data of Nigerian citizens, regardless of where the company is incorporated.",
      "Start with a data audit. Map every data point you collect: name, phone, BVN, location, device fingerprint, IP address. Classify each one by sensitivity and document your lawful basis for processing it — consent, contract, or legitimate interest. This audit becomes the spine of your privacy policy, which must be written in plain English (not legalese) and presented before you collect any data.",
      "Consent must be freely given, specific, and easy to withdraw. Pre-ticked checkboxes don't qualify. Users must be able to request data deletion and receive a response within 30 days. Store consent records — timestamp, IP, policy version — so you can prove consent was obtained if challenged.",
      "For data storage, sensitive personal data must be encrypted at rest and in transit. If you process payment data, do not store card numbers — let Paystack or Flutterwave handle that via tokenisation. Breach notification timelines are strict: 72 hours to NITDA, 7 days to affected users. Build your incident response playbook before you need it, not during a crisis.",
    ],
    author: { name: "TechAgency Team", avatar: "/placeholder.png" },
    readTime: 5,
    slug: "ndpr-compliance-checklist",
    date: "2026-05-07",
  },
  {
    image: "/placeholder.png",
    category: "DevOps",
    title: "Zero-Downtime Deploys with GitHub Actions on Vercel",
    excerpt: "Rolling deployments, feature flags, and blue-green switching — a practical guide to shipping to production without a maintenance window, using only GitHub Actions and Vercel's API.",
    body: [
      "A maintenance window is a liability. Every minute your product is down costs trust — and in Nigerian e-commerce or fintech, it can cost real transactions. The good news is that zero-downtime deploys are achievable on Vercel without a Kubernetes cluster or a dedicated DevOps engineer.",
      "Vercel's atomic deployment model makes this straightforward: each push creates an immutable preview URL. Your custom domain only switches over to the new deployment after it passes a health check. The risk window is near-zero for static and edge-rendered content. The challenge comes with database migrations — if your schema change is destructive, no deployment strategy saves you.",
      "The rule is: always deploy backwards-compatible migrations first, then deploy the code that uses the new schema, then clean up old columns in a third deploy. Never drop a column in the same deploy as the code change that removes it from your queries. Tools like Atlas or Flyway enforce this discipline automatically.",
      "For feature flags, a simple approach is environment variables read at runtime. A more scalable approach is a dedicated flags service like Unleash or LaunchDarkly. Either way, flags let you deploy code that's switched off, turn it on for 5% of users, monitor error rates, and roll forward — or turn it back off — without a new deployment. This is the real lever for safe, continuous delivery.",
    ],
    author: { name: "TechAgency Team", avatar: "/placeholder.png" },
    readTime: 6,
    slug: "zero-downtime-vercel",
    date: "2026-04-28",
  },
  {
    image: "/placeholder.png",
    category: "Startup Tech",
    title: "How to Launch an MVP in Nigeria for Under ₦2M",
    excerpt: "We've scoped hundreds of Nigerian startup builds. This is the exact budget breakdown — stack choices, hosting, payments, and what to cut — to get a real product live for under ₦2 million.",
    body: [
      "The average first-time Nigerian founder overbuilds their MVP. They want the admin dashboard, the mobile app, the web app, social login, push notifications, and multi-currency support — all before a single paying user. We've seen this pattern hundreds of times, and it consistently leads to blown budgets and six-month delays. The discipline of a ₦2M budget is a feature, not a constraint.",
      "Stack choices matter enormously at this budget. Next.js on Vercel eliminates a separate server; Supabase replaces a custom backend for auth, database, and real-time; Paystack handles payments with almost no custom code; Resend handles transactional email for pennies. You're buying engineering hours, so every managed service you use converts infrastructure time into product time.",
      "Typical budget split for a web SaaS MVP: ₦900k for core engineering (6–8 weeks of one senior and one mid-level engineer), ₦300k for UI/UX design (screens + a Figma prototype that stakeholders can click through), ₦200k for QA and a staging environment, ₦150k contingency, ₦200k first 3 months of hosting/services, ₦250k for a soft launch (social, beta outreach). That hits ₦2M exactly.",
      "What to cut ruthlessly: mobile app (ship a responsive web app first), multi-language support, complex admin dashboards, social login (email + password is fine), and any feature you can't explain in one sentence. Validate the core loop first — the question is whether anyone will pay, not whether the product is feature-complete.",
    ],
    author: { name: "TechAgency Team", avatar: "/placeholder.png" },
    readTime: 8,
    slug: "mvp-nigeria-budget",
    date: "2026-04-15",
  },
  {
    image: "/placeholder.png",
    category: "Nigeria Tech",
    title: "The State of Fintech Infrastructure in West Africa 2026",
    excerpt: "From Paystack's API evolution to the CBN's open banking framework and M-Pesa's westward expansion — a technical look at where the rails are being laid for the next decade of African fintech.",
    body: [
      "West Africa's payment infrastructure has matured faster in the last three years than in the previous decade. The CBN's open banking framework, now in phase two, mandates that licensed banks expose customer data APIs to accredited fintechs. This is the same regulatory wedge that created neobanking booms in the UK and Brazil — and Nigeria is now in that window.",
      "Paystack's API surface has grown significantly: virtual accounts, dedicated NUBAN generation, business verification, and bulk disbursements are all production-ready. The developer experience rivals Stripe in several respects, which matters because most Nigerian startups are built by engineers who benchmark against global tooling. Flutterwave has pushed harder into cross-border corridors — if your use case involves GHS, XOF, or USD payouts, Flutterwave's rails are often superior.",
      "M-Pesa's westward expansion is the most strategically interesting development. Its success in East Africa was built on USSD infrastructure that worked on feature phones without data — a pattern that maps directly onto Nigeria's lower-income demographics. If Safaricom executes well in West Africa, it creates both a new payment rail and competitive pressure on incumbent banks to accelerate their API programmes.",
      "For builders: the opportunity is in infrastructure abstraction. The payment rails are fragmenting — bank transfers, cards, USSD, QR, crypto — and businesses need a unified API that handles all of them with one integration. BaaS (Banking-as-a-Service) providers like Anchor and Bloc are attacking this layer. Whoever wins developer mindshare here will define the next decade of Nigerian fintech the way Paystack defined the last one.",
    ],
    author: { name: "TechAgency Team", avatar: "/placeholder.png" },
    readTime: 10,
    slug: "fintech-west-africa-2026",
    date: "2026-04-01",
  },
  {
    image: "/placeholder.png",
    category: "Tools",
    title: "Top Dev Tools for Remote African Engineering Teams",
    excerpt: "Linear over Jira, Supabase over Firebase, Vercel over AWS for most teams — the tools that actually work for distributed African engineering teams in 2026, ranked by adoption in our network.",
    body: [
      "Running a distributed engineering team across Lagos, Accra, Nairobi, and Cape Town introduces specific tooling challenges: intermittent internet connections, latency-sensitive collaboration, time-zone spread of up to three hours, and the cost sensitivity that comes from paying in USD while earning in local currencies. The right toolchain accounts for all of these.",
      "For project management, Linear wins handily over Jira. It's fast even on 3G (Jira is painfully slow on mobile data), its keyboard shortcuts make it usable without a fast connection, and its opinionated structure forces good habits around issue sizing and cycle planning. The free tier is genuinely useful for teams up to 20 people.",
      "Supabase over Firebase is the call we make consistently for new projects. Postgres is portable — if you outgrow Supabase, you export a standard dump and migrate to RDS or Neon with minimal friction. Firebase locks you into a proprietary data model that becomes expensive to migrate away from. Supabase's row-level security, real-time subscriptions, and auth are all excellent and the self-hostable option matters for NDPR compliance.",
      "For deployment, Vercel dominates for Next.js projects and the DX is unmatched. Railway is worth considering for backend services where you need more control. Avoid managing raw EC2 or Compute Engine instances unless your team has dedicated DevOps capacity — the opportunity cost of infrastructure management is too high for a small product team.",
    ],
    author: { name: "TechAgency Team", avatar: "/placeholder.png" },
    readTime: 6,
    slug: "dev-tools-african-teams",
    date: "2026-03-20",
  },
  {
    image: "/placeholder.png",
    category: "AI",
    title: "Integrating Claude & GPT-4 into Nigerian Business Workflows",
    excerpt: "Document extraction, WhatsApp bots, invoice parsing, customer support — real AI use cases we've deployed for Nigerian businesses, with architecture notes and cost breakdowns.",
    body: [
      "AI integration in Nigerian businesses is past the hype phase. We're deploying real systems now — not demos. The use cases that actually generate ROI are narrower than the marketing suggests: document processing, customer support deflection, data extraction from unstructured sources, and WhatsApp-based conversational interfaces. Everything else is still mostly experimental at the SME level.",
      "The most ROI-positive deployment we've done is invoice and receipt parsing. Nigerian SMEs receive invoices in every format imaginable: PDFs, photos of paper invoices, screenshots of WhatsApp messages. A multi-modal LLM with a structured extraction prompt can parse all of these into a consistent data schema with 90%+ accuracy. This replaces 2–3 hours of daily manual data entry and has paid back our integration cost within weeks in every deployment.",
      "WhatsApp bots deserve special mention because WhatsApp is the primary business communication channel in Nigeria — not email, not Slack. An AI-powered WhatsApp bot can handle order status, FAQs, appointment booking, and complaint intake. The architecture is: WhatsApp Business API → webhook → your server → LLM → response. Latency is manageable (1–3 seconds) and users consistently rate these interactions positively.",
      "Cost management is critical. GPT-4 costs 10–30× more per token than Claude Haiku for comparable outputs on most structured tasks. Our standard approach is to route simple, repetitive queries to Haiku and complex reasoning tasks to Sonnet or GPT-4. With smart routing and caching of common responses, you can serve most Nigerian SME use cases for under ₦50,000/month in API costs.",
    ],
    author: { name: "TechAgency Team", avatar: "/placeholder.png" },
    readTime: 9,
    slug: "ai-integration-nigerian-business",
    date: "2026-03-10",
  },
  {
    image: "/placeholder.png",
    category: "Web Dev",
    title: "Paystack vs Flutterwave: Which API Should You Integrate in 2026?",
    excerpt: "A technical comparison from engineers who've integrated both. We cover SDK quality, webhook reliability, international payouts, sandbox fidelity, and which to pick for your specific use case.",
    body: [
      "We've shipped payment integrations with both Paystack and Flutterwave across more than 20 products. The honest answer is: for most Nigerian consumer products, Paystack is the better choice. For cross-border or multi-currency products, Flutterwave is often worth the extra complexity.",
      "Paystack's SDK quality is excellent. The Node.js and Python libraries are well-maintained, the webhook signature verification is straightforward, and the sandbox environment closely mirrors production. The dashboard is clean and developer-friendly. Most importantly, conversion rates on Nigerian cards are consistently higher on Paystack — we attribute this to their relationships with local banks and their optimised 3DS flow.",
      "Flutterwave's strength is breadth. GHS, UGX, KES, XOF, USD payouts are all production-ready. If your product serves customers across West and East Africa, or if you need international card acceptance without a US business, Flutterwave unlocks corridors that Paystack doesn't. The tradeoff is a more complex API surface and webhooks that have historically been less reliable, though this has improved significantly in 2025.",
      "Our recommendation: start with Paystack if your market is Nigeria-only. Abstract your payment layer from day one (an adapter pattern around a PaymentProvider interface) so you can add Flutterwave later without touching business logic. Don't integrate both simultaneously — the complexity is rarely justified until you have concrete international revenue.",
    ],
    author: { name: "TechAgency Team", avatar: "/placeholder.png" },
    readTime: 7,
    slug: "paystack-vs-flutterwave-2026",
    date: "2026-02-25",
  },
  {
    image: "/placeholder.png",
    category: "Startup Tech",
    title: "How to Hire and Manage Remote Engineers in Nigeria",
    excerpt: "Equity vs salary, async communication, code review culture, and how to run a productive remote engineering team when your talent is spread across Lagos, Abuja, Accra and Nairobi.",
    body: [
      "Nigeria has one of the fastest-growing software engineering talent pools on the continent. Average salaries have risen 30–40% since 2022 as remote opportunities from US and European companies increased competition for senior talent. For a Nigerian startup competing with international remote roles, the winning strategy is not to match dollar salaries — it's to offer meaningful equity, strong mentorship, and interesting technical problems.",
      "For junior to mid-level engineers, the going market rate in Lagos is ₦300k–₦700k/month for full-time roles. Senior engineers with 5+ years of experience command ₦800k–₦1.5M/month, and tech leads for product teams can reach ₦2M+. These numbers move fast — calibrate quarterly, not annually.",
      "Async-first communication is non-negotiable for distributed teams. Your team cannot depend on being available simultaneously when Lagos, Accra, and Nairobi have a two-to-three hour spread and varying power and connectivity situations. Write decisions as Notion pages or GitHub discussions, not Slack threads that disappear. Loom videos for context-heavy explanations save everyone time. Weekly video standups are sufficient for alignment; daily synchronous standups are usually theatre.",
      "Code review culture is where remote teams win or lose. Every PR should have a clear description, a test plan, and screenshots for UI changes. Reviewers should prioritise turnaround — a PR sitting unreviewed for 48 hours kills momentum. If your team averages more than 24 hours to first review, that's the bottleneck to fix before anything else.",
    ],
    author: { name: "TechAgency Team", avatar: "/placeholder.png" },
    readTime: 8,
    slug: "hiring-remote-engineers-nigeria",
    date: "2026-02-10",
  },
  {
    image: "/placeholder.png",
    category: "Security",
    title: "WhatsApp Business API Security: What Most Developers Get Wrong",
    excerpt: "Message signing, webhook validation, session token storage, and how to avoid the top 5 security mistakes we see in Nigerian WhatsApp bot implementations — with corrected code examples.",
    body: [
      "WhatsApp Business API bots handle sensitive data — customer orders, OTPs, account details, complaint records. Yet security is consistently the weakest part of Nigerian WhatsApp bot implementations we review. The five mistakes below account for 80% of the vulnerabilities we find.",
      "First: not validating webhook signatures. Meta sends an X-Hub-Signature-256 header with every webhook payload. If you don't verify it, anyone can POST a fake message to your endpoint and trigger your bot's actions. The fix is one function: compute HMAC-SHA256 of the raw body using your app secret and compare it to the header value. Reject requests that don't match — before any other processing.",
      "Second: storing access tokens in environment variables that end up in client-side code. Your WhatsApp access token must only ever live on your server. Never expose it in a front-end config, a React Native bundle, or a browser-accessible API response. Rotate tokens immediately if you suspect exposure.",
      "Third: logging full message content. Your server logs will capture every message your bot receives — phone numbers, financial figures, personal complaints. If your logging platform stores these unencrypted or transmits them to a third-party service, you have a data handling problem under NDPR. Redact sensitive fields in your logging middleware before the data leaves your server.",
    ],
    author: { name: "TechAgency Team", avatar: "/placeholder.png" },
    readTime: 6,
    slug: "whatsapp-api-security",
    date: "2026-01-28",
  },
];

/** Home page teaser — first 3 posts */
export const FEATURED_POSTS: BlogPost[] = ALL_POSTS.slice(0, 3);
