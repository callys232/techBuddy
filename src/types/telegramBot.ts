export interface TelegramCommand {
  id: string;
  command: string; // e.g. "/start", "/services", "/pricing"
  description: string;
  reply: string;
}

export interface TelegramInlineButton {
  id: string;
  label: string; // e.g. "💼 View Services"
  callbackData: string; // e.g. "cb_services"
  reply: string;
}

export interface TelegramBotFlow {
  botName: string;
  botUsername: string;
  botToken?: string;
  welcomeMessage: string;
  commands: TelegramCommand[];
  inlineButtons: TelegramInlineButton[];
  fallbackMessage: string;
  notificationsEnabled: boolean;
  notificationChannels?: {
    telegram: boolean;
    email: boolean;
  };
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

export const DEFAULT_TG_BOT_FLOW: TelegramBotFlow = {
  botName: "TechBuddy Assistant",
  botUsername: "@techbuddy_assistant_bot",
  welcomeMessage:
    "👋 Hello! Welcome to *{botName}*.\n\nI am your automated 24/7 assistant. Choose an option below or send a command to get started.",
  commands: [
    {
      id: uid(),
      command: "/start",
      description: "Start the bot & show the main menu",
      reply: "Welcome to TechBuddy! 🚀 We build custom web apps, mobile solutions, and high-performance bots.",
    },
    {
      id: uid(),
      command: "/services",
      description: "Explore our tech capabilities & solutions",
      reply: "🛠️ *Our Core Services:*\n1. Web & SaaS Development\n2. Mobile Apps (iOS & Android)\n3. Cloud & DevOps Architecture\n4. WhatsApp & Telegram Bots",
    },
    {
      id: uid(),
      command: "/pricing",
      description: "View pricing packages & custom quotes",
      reply: "💰 *Transparent Pricing:*\n• Starter MVP: From $1,200\n• Full Stack Web/App: From $2,500\n• Enterprise Bot Infrastructure: From $600\n\nNeed an exact figure? Tap /contact to speak with a solutions engineer.",
    },
    {
      id: uid(),
      command: "/contact",
      description: "Connect with our engineering team",
      reply: "👨‍💻 *Speak with an Engineer:*\n• WhatsApp: https://wa.me/2347070994391\n• Email: team@techbuddy.ng\n• Response Time: Under 15 minutes",
    },
  ],
  inlineButtons: [
    {
      id: uid(),
      label: "⚡ Request a Quote",
      callbackData: "btn_quote",
      reply: "You can request a free instant estimate anytime at https://techbuddy.ng/tools/cost-estimator or chat with us on WhatsApp!",
    },
    {
      id: uid(),
      label: "🚀 View Portfolio",
      callbackData: "btn_portfolio",
      reply: "Check out our featured work & case studies at https://techbuddy.ng/portfolio",
    },
    {
      id: uid(),
      label: "💬 Talk to Human",
      callbackData: "btn_human",
      reply: "An engineer has been alerted and will reach out to you directly in this chat.",
    },
  ],
  fallbackMessage: "🤔 Sorry, I didn't recognize that command. Send /help or /start to see what I can do!",
  notificationsEnabled: true,
  notificationChannels: {
    telegram: true,
    email: true,
  },
};

