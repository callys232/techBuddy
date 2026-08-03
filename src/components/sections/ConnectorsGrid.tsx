import {
  IconCreditCard,
  IconWallet,
  IconDatabase,
  IconMail,
  IconBrandWhatsapp,
  IconBrandOpenai,
  IconBrain,
  IconBrandVercel,
  IconBrandAws,
  IconBrandGoogle,
  IconBrandSlack,
  IconBrandGithub,
} from "@tabler/icons-react";
import { CONNECTORS, type Connector } from "@/mock/connectors";

const ICON_MAP: Record<Connector["icon"], typeof IconCreditCard> = {
  "credit-card": IconCreditCard,
  wallet:        IconWallet,
  database:      IconDatabase,
  mail:          IconMail,
  whatsapp:      IconBrandWhatsapp,
  openai:        IconBrandOpenai,
  brain:         IconBrain,
  vercel:        IconBrandVercel,
  aws:           IconBrandAws,
  google:        IconBrandGoogle,
  slack:         IconBrandSlack,
  github:        IconBrandGithub,
};

export function ConnectorsGrid() {
  return (
    <section className="relative overflow-hidden py-16">
      <div className="gradient-line mb-16" />
      <div className="mx-auto max-w-6xl px-[var(--container-px)]">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="eyebrow-pill mb-5 inline-flex">
            <span className="pulse-dot" />
            Third-party connectors
          </span>
          <h2 className="mt-5 font-display font-extrabold text-[var(--fg)] leading-[1.1] mb-4 tracking-[-0.02em]
                         text-[clamp(1.75rem,3vw,2.5rem)]">
            Built With <span className="gradient-text">Tools You Already Trust</span>
          </h2>
          <p className="text-[var(--fg)]/50 leading-relaxed text-[14.5px]">
            Every build plugs into the payments, infrastructure, and AI APIs your business already runs on — wired up, tested, and documented.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {CONNECTORS.map((c) => {
            const Icon = ICON_MAP[c.icon];
            return (
              <div key={c.name} className="lm-card lm-card-hover flex items-center gap-3 p-4">
                <span className="icon-square shrink-0">
                  <Icon size={20} />
                </span>
                <div className="min-w-0">
                  <p className="font-heading text-sm font-semibold text-[var(--fg)] truncate">{c.name}</p>
                  <p className="text-[11px] text-[var(--fg)]/40 truncate">{c.category}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
