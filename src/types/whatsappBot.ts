export interface BotOption {
  id: string;
  label: string;
  reply: string;
}

export interface BotFlow {
  businessName: string;
  welcomeMessage: string;
  options: BotOption[];
  fallbackMessage: string;
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

export const DEFAULT_BOT_FLOW: BotFlow = {
  businessName: "",
  welcomeMessage: "Hi! Welcome to {business}. Reply with a number to get started:",
  options: [
    { id: uid(), label: "Our services", reply: "We offer web development, mobile apps, and DevOps. Ask us anything!" },
    { id: uid(), label: "Get a quote", reply: "Great! Tell us a bit about your project and we'll get back to you within 24 hours." },
    { id: uid(), label: "Talk to a human", reply: "Sure — one of our team will join this chat shortly." },
  ],
  fallbackMessage: "Sorry, I didn't understand that. Reply with a number from the menu above.",
};
