import { IconArrowUpRight, IconShieldLock } from "@tabler/icons-react";

const PRODUCTS = [
  {
    name: "Ledger hardware wallets",
    maker: "Ledger",
    href: process.env.NEXT_PUBLIC_LEDGER_AFFILIATE_URL ?? "https://www.ledger.com/",
  },
  {
    name: "Trezor hardware wallets",
    maker: "Trezor",
    href: process.env.NEXT_PUBLIC_TREZOR_AFFILIATE_URL ?? "https://trezor.io/",
  },
  {
    name: "SafePal hardware wallets",
    maker: "SafePal",
    href: process.env.NEXT_PUBLIC_SAFEPAL_AFFILIATE_URL ?? "https://www.safepal.com/",
  },
] as const;

export function AffiliateProducts() {
  return (
    <section aria-labelledby="recommended-security" className="border-y border-[var(--border)] bg-[var(--surface)]/45">
      <div className="mx-auto max-w-7xl px-[var(--container-px)] py-10">
        <div className="mb-5">
          <div>
            <p className="eyebrow mb-2">Recommended hardware</p>
            <h2 id="recommended-security" className="font-heading text-xl font-semibold text-[var(--ink)]">
              Keep digital assets offline
            </h2>
          </div>
        </div>

        <div className="grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--border)] sm:grid-cols-3">
          {PRODUCTS.map((product) => (
            <a
              key={product.maker}
              href={product.href}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="group flex min-h-24 items-center gap-4 bg-[var(--surface)] px-5 py-4 transition-colors duration-200 hover:bg-[var(--surface-soft)]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--page)] text-[var(--brand)] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-105">
                <IconShieldLock size={19} stroke={1.6} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--ink-faint)]">
                  {product.maker}
                </span>
                <span className="mt-1 block text-sm font-semibold text-[var(--ink)]">
                  {product.name}
                </span>
                <span className="mt-1 block text-[9px] text-[var(--ink-faint)]">
                  Paid link
                </span>
              </span>
              <span className="micro-arrow text-[var(--ink-faint)] group-hover:text-[var(--brand)]">
                <IconArrowUpRight size={15} />
              </span>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
