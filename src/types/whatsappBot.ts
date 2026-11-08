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
  notificationsEnabled: boolean;
  notificationChannels?: {
    whatsapp: boolean;
    email: boolean;
  };
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
  notificationsEnabled: true,
  notificationChannels: {
    whatsapp: true,
    email: true,
  },
};

export interface BotTemplate {
  id: string;
  name: string;
  icon: string;
  category: "Business" | "Free Game" | "Paid Game";
  isPaid: boolean;
  tag: string;
  description: string;
  flow: BotFlow;
}

export const BOT_TEMPLATES: BotTemplate[] = [
  {
    id: "standard-business",
    name: "Business & Services",
    icon: "💼",
    category: "Business",
    isPaid: false,
    tag: "Free Standard",
    description: "Classic multi-option welcome menu with quotes, services overview, and human agent routing.",
    flow: DEFAULT_BOT_FLOW,
  },
  {
    id: "trivia-challenge",
    name: "Trivia Quiz Challenge",
    icon: "🧠",
    category: "Free Game",
    isPaid: false,
    tag: "Free Game",
    description: "Daily interactive quiz with automated scoring, answer explanations, and viral friend challenges.",
    flow: {
      businessName: "Daily Tech Trivia 🧠",
      welcomeMessage: "🎮 Welcome to *{business}*!\n\nTest your knowledge, earn points, and climb the leaderboard! Reply with your answer number:",
      options: [
        { id: uid(), label: "What does HTTP stand for?", reply: "✅ Correct! *HyperText Transfer Protocol*. You earned +10 points! Reply 4 to see leaderboard." },
        { id: uid(), label: "Which port does HTTPS default to?", reply: "🎯 Spot on! *Port 443*. Secure SSL encryption enabled. +10 points!" },
        { id: uid(), label: "Who created Linux in 1991?", reply: "🐧 Bingo! *Linus Torvalds*. Open-source mastermind! +10 points!" },
        { id: uid(), label: "🏆 View Leaderboard & Score", reply: "👑 *Today's Top Scorers:*\n1. Caleb J. — 30 pts\n2. Sarah M. — 20 pts\n3. You — 30 pts! 🎉\n\nShare this bot with friends to challenge them!" },
      ],
      fallbackMessage: "Reply with a number (1-4) to pick your trivia answer or check your score!",
      notificationsEnabled: true,
      notificationChannels: { whatsapp: true, email: true },
    },
  },
  {
    id: "lucky-dice",
    name: "Lucky Dice Roll & Win",
    icon: "🎲",
    category: "Free Game",
    isPaid: false,
    tag: "Free Game",
    description: "Gamified instant-win dice game delivering randomized promo codes and vouchers.",
    flow: {
      businessName: "Lucky Dice & Rewards 🎲",
      welcomeMessage: "🎲 Welcome to *{business}*!\n\nRoll the virtual dice to win instant discounts on your next project. Reply with an action:",
      options: [
        { id: uid(), label: "Roll 1 Die (Instant 10% Off)", reply: "🎲 *Rolling...* You rolled a *5*! 🎉 Congratulations! Your 10% discount promo code is: *LUCKY10*. Valid for 48 hours." },
        { id: uid(), label: "Roll Double Dice (Jackpot ₦10,000 Off)", reply: "🎲🎲 *Double Six! JACKPOT!* 🏆 You unlocked ₦10,000 off any web/mobile project. Use voucher code: *JACKPOT66*." },
        { id: uid(), label: "Claim My Prize with an Engineer", reply: "👨‍💻 An engineer has been notified! Send your winning voucher to claim your discount: https://wa.me/2347070994391" },
      ],
      fallbackMessage: "Reply with 1 or 2 to roll the dice, or 3 to speak with an engineer!",
      notificationsEnabled: true,
      notificationChannels: { whatsapp: true, email: true },
    },
  },
  {
    id: "whatsapp-wordle",
    name: "WhatsApp Wordle Challenge",
    icon: "🟩",
    category: "Paid Game",
    isPaid: true,
    tag: "Paid Layer",
    description: "The viral 5-letter word puzzle game directly on WhatsApp with emoji tiles (🟩🟨⬛) and daily streaks.",
    flow: {
      businessName: "WhatsApp Wordle 🟩",
      welcomeMessage: "🟩 Welcome to *{business}*!\n\nGuess the secret 5-letter tech word in 6 attempts. Reply with an option to start:",
      options: [
        { id: uid(), label: "Attempt 1: Guess 'REACT'", reply: "🟩 🟨 ⬛ ⬛ ⬛\n\n• 'R' is in the exact right spot!\n• 'E' is in the word but wrong spot.\n• 5 attempts remaining!" },
        { id: uid(), label: "Attempt 2: Guess 'RESET'", reply: "🟩 🟩 🟩 🟩 🟩\n\n🎉 *SOLVED IN 2 ATTEMPTS!* 🏆\nWord was: *RESET*\n\nYour streak: 7 days 🔥 Share your grid with friends!" },
        { id: uid(), label: "View Today's Leaderboard", reply: "📊 *Today's Global Top Players:*\n🥇 Alex K. (2 tries)\n🥈 Caleb J. (2 tries)\n🥉 Chidi E. (3 tries)\n\nNew puzzle refreshes at midnight UTC!" },
      ],
      fallbackMessage: "Send your 5-letter guess or type 3 to view the leaderboard!",
      notificationsEnabled: true,
      notificationChannels: { whatsapp: true, email: true },
    },
  },
  {
    id: "cyber-rpg",
    name: "Cyberpunk Quest RPG",
    icon: "⚔️",
    category: "Paid Game",
    isPaid: true,
    tag: "Paid Layer",
    description: "Branching choose-your-own-adventure interactive story game with hacker quests and inventory.",
    flow: {
      businessName: "Neo-Lagos Cyber Quest ⚔️",
      welcomeMessage: "🌃 Welcome to *{business}*!\n\nYou are an ethical hacker in Neo-Lagos. An urgent terminal alert flashes: 'CRITICAL INTRUSION IN MAINFRAME'. What is your move?",
      options: [
        { id: uid(), label: "Trace Intrusion IP", reply: "🔍 *Tracing...* Packet routed through an offshore proxy. You deploy a reverse traceroute and locate the server! Reply 2 to counter-attack." },
        { id: uid(), label: "Deploy Zero-Day Countermeasure", reply: "⚡ *Countermeasure fired!* The adversary's tunnel collapsed. You recovered 2.4 GB of stolen encrypted credentials! (+150 XP, Level 3 Secured 🛡️)" },
        { id: uid(), label: "Call HQ Emergency Backup", reply: "📞 Dispatch contacted. Heavy cybersecurity reinforcement deployed to protect the cloud infrastructure!" },
      ],
      fallbackMessage: "Your terminal is waiting for instructions. Reply 1, 2, or 3 to make your choice!",
      notificationsEnabled: true,
      notificationChannels: { whatsapp: true, email: true },
    },
  },
  {
    id: "airtime-giveaway",
    name: "Airtime Scratch & Win",
    icon: "🎟️",
    category: "Paid Game",
    isPaid: true,
    tag: "Paid Layer",
    description: "Gamified reward mechanism where players complete brand challenges to reveal single-use airtime PINs.",
    flow: {
      businessName: "Airtime Scratch & Win 🎟️",
      welcomeMessage: "🎁 Welcome to *{business}*!\n\nAnswer our brand spotlight to scratch and reveal an instant ₦1,000 Airtime PIN! Pick a card below:",
      options: [
        { id: uid(), label: "Scratch MTN Voucher Card", reply: "🎫 *Scratching Card #1...*\n[▓▓▓▓▓▓▓▓▓▓] 100%\n\n🎉 Revealed PIN: *7492-3810-5829-1940*\nNetwork: MTN Nigeria (₦1,000)\nStatus: Single-Use Claimed ✅" },
        { id: uid(), label: "Scratch Airtel Voucher Card", reply: "🎫 *Scratching Card #2...*\n[▓▓▓▓▓▓▓▓▓▓] 100%\n\n🎉 Revealed PIN: *9102-4820-1940-5829*\nNetwork: Airtel Nigeria (₦1,000)\nStatus: Single-Use Claimed ✅" },
        { id: uid(), label: "Confirm Redemption on WhatsApp", reply: "📲 Click here to confirm your voucher with our support desk: https://wa.me/2347070994391" },
      ],
      fallbackMessage: "Reply with 1 or 2 to scratch a card, or 3 to chat with customer support!",
      notificationsEnabled: true,
      notificationChannels: { whatsapp: true, email: true },
    },
  },
];
