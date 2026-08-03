export interface Connector {
  name: string;
  category: string;
  icon:
    | "credit-card"
    | "wallet"
    | "database"
    | "mail"
    | "whatsapp"
    | "openai"
    | "brain"
    | "vercel"
    | "aws"
    | "google"
    | "slack"
    | "github";
}

export const CONNECTORS: Connector[] = [
  { name: "Paystack",         category: "Payments",              icon: "credit-card" },
  { name: "Flutterwave",      category: "Payments",              icon: "wallet"       },
  { name: "Supabase",         category: "Database & auth",       icon: "database"     },
  { name: "Resend",           category: "Transactional email",   icon: "mail"         },
  { name: "WhatsApp Business",category: "Messaging",             icon: "whatsapp"     },
  { name: "OpenAI",           category: "AI / LLM",               icon: "openai"       },
  { name: "Claude",           category: "AI / LLM",               icon: "brain"        },
  { name: "Vercel",           category: "Hosting & deploys",      icon: "vercel"       },
  { name: "AWS",              category: "Cloud infrastructure",   icon: "aws"          },
  { name: "Google Cloud",     category: "Cloud infrastructure",   icon: "google"       },
  { name: "Slack",            category: "Team notifications",     icon: "slack"        },
  { name: "GitHub",           category: "CI/CD & version control",icon: "github"       },
];
