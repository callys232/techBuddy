export interface NavLink {
  label: string;
  href: string;
}

export interface FooterLinkGroup {
  [groupTitle: string]: NavLink[];
}

export interface SocialLink {
  iconName: "x" | "linkedin" | "github" | "instagram";
  href: string;
  label: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: "Services",  href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Tools",     href: "/tools" },
  { label: "Blog",      href: "/blog" },
  { label: "Templates", href: "/templates" },
  { label: "Invest",    href: "/invest" },
  { label: "Contact",   href: "/contact" },
];

export const FOOTER_LINKS: FooterLinkGroup = {
  Services: [
    { label: "Web Development", href: "/services/web-development" },
    { label: "Mobile Apps", href: "/services/mobile-apps" },
    { label: "DevOps & CI/CD", href: "/services/devops" },
    { label: "Security", href: "/services/security-pentesting" },
    { label: "Fintech", href: "/services/fintech-payments" },
    { label: "Tech Audit", href: "/services/tech-audit" },
  ],
  Company: [
    { label: "About",      href: "/about" },
    { label: "Portfolio",  href: "/portfolio" },
    { label: "Pricing",    href: "/pricing" },
    { label: "Blog",       href: "/blog" },
    { label: "Templates",  href: "/templates" },
    { label: "Free Tools", href: "/tools" },
    { label: "Invest",     href: "/invest" },
    { label: "Talent Hub", href: "/talent" },
    { label: "Contact",    href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "NDPR Compliance", href: "/ndpr" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

export const SOCIAL_LINKS: SocialLink[] = [
  { iconName: "x", href: "#", label: "X / Twitter" },
  { iconName: "linkedin", href: "#", label: "LinkedIn" },
  { iconName: "github", href: "#", label: "GitHub" },
  { iconName: "instagram", href: "#", label: "Instagram" },
];
