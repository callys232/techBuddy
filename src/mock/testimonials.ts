export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  industry: string;
  rating: number;
  avatar: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "TechAgency built our fintech platform in 14 weeks — Paystack integration, NDPR-compliant data handling, everything. We went from idea to 5,000 users without a single critical bug in production. The team genuinely understands the Nigerian financial system.",
    name: "Adaeze Okoye",
    role: "Co-founder & CEO",
    company: "FinTrack Pro",
    industry: "Fintech",
    rating: 5,
    avatar: "/placeholder.png",
  },
  {
    quote:
      "We needed an e-commerce marketplace that worked for farmers with feature phones AND buyers using desktop. TechAgency delivered a progressive web app that handles both, plus offline sync. Our GMV hit ₦800M in year one.",
    name: "Emeka Nwosu",
    role: "Head of Product",
    company: "AgriMarket NG",
    industry: "AgriTech",
    rating: 5,
    avatar: "/placeholder.png",
  },
  {
    quote:
      "I've worked with three dev agencies before. TechAgency is the only one that pushed back when I had a bad idea and explained why. That honesty saved us months of rebuilding. The fleet SaaS they built is now our biggest competitive advantage.",
    name: "Biodun Fashola",
    role: "CTO",
    company: "LogiSync",
    industry: "Logistics",
    rating: 5,
    avatar: "/placeholder.png",
  },
  {
    quote:
      "They reduced our insurance claims processing from 14 days to 24 hours. Our enrollees used to call to complain every week — now they're referring their friends. TechAgency didn't just build software, they redesigned our operations.",
    name: "Dr. Chioma Eze",
    role: "COO",
    company: "HealthPay",
    industry: "Healthtech",
    rating: 5,
    avatar: "/placeholder.png",
  },
  {
    quote:
      "The AI chatbot they integrated handles 70% of our customer inquiries automatically. Our support team now focuses on complex issues only. ROI was positive within 3 months — something I didn't think was possible for a Nigerian SME our size.",
    name: "Tunde Afolabi",
    role: "Managing Director",
    company: "RetailMax NG",
    industry: "E-commerce",
    rating: 5,
    avatar: "/placeholder.png",
  },
  {
    quote:
      "180 schools on our platform and we've never had a major outage. The architecture TechAgency designed scales perfectly — same codebase handles a 10-pupil nursery and a 3,000-student secondary school. That's not easy to build.",
    name: "Ngozi Obialo",
    role: "Founder",
    company: "SchoolKit Nigeria",
    industry: "EdTech",
    rating: 5,
    avatar: "/placeholder.png",
  },
];
