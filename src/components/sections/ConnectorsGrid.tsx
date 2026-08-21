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
      <div className="mx-auto max-w-6xl px-[var(--container-px)]">
        <div className="text-center max-w-xl mx-auto mb-12">
          <p className="eyebrow justify-center mb-5">Third-party connectors</p>
          <h2 className="mt-5 font-heading font-extrabold text-[var(--ink)] leading-[1.1] mb-4 tracking-[-0.02em]
                         text-[clamp(1.75rem,3vw,2.5rem)]">
            Built With <span className="text-[var(--brand)]">Tools You Already Trust</span>
          </h2>
          <p className="text-[var(--ink-muted)] leading-relaxed text-[14.5px]">
            Every build plugs into the payments, infrastructure, and AI APIs your business already runs on — wired up, tested, and documented.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {CONNECTORS.map((c) => {
            const Icon = ICON_MAP[c.icon];
            return (
              <div key={c.name} className="card-interactive flex items-center gap-3 p-4">
                <span className="icon-square shrink-0">
                  <Icon size={20} />
                </span>
                <div className="min-w-0">
                  <p className="font-heading text-sm font-semibold text-[var(--ink)] truncate">{c.name}</p>
                  <p className="text-[11px] text-[var(--ink)]/40 truncate">{c.category}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
