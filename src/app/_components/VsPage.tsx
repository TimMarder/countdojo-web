import Link from "next/link";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

const APP_STORE_URL =
  "https://apps.apple.com/us/app/count-dojo-bj-card-counting/id6760961014";
const GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.countdojo.app&utm_source=na_Med";

export type VsRow = { label: string; us: string; them: string };

export type VsContent = {
  competitor: string;
  /** One editorial paragraph: what each product is, without spin. */
  intro: string;
  /** Optional status note, e.g. an unreleased product. */
  status?: string;
  whoThem: string;
  whoUs: string;
  usDifferent: string[];
  themBetter: string[];
  rows: VsRow[];
  closing: string;
  /** Where every competitor fact came from, and when it was checked. */
  sources: { label: string; href: string }[];
  checked: string;
};

/**
 * Shared layout for /vs pages. Editorial model: the homepage's "§ X · vs The
 * Usual Path" — restrained, specific, and it says where the other side wins.
 */
export function VsPage({ c }: { c: VsContent }) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="section-rhythm">
        <div className="site-shell max-w-4xl">
          <p className="text-chapter mb-5">Comparison — An honest one</p>
          <h1 className="font-display text-display-lg text-paper mb-8 text-balance">
            Count Dojo vs {c.competitor}
          </h1>
          <p className="text-lg text-paper-muted text-pretty max-w-3xl">{c.intro}</p>
          {c.status && (
            <p className="mt-6 font-mono text-[0.72rem] tracking-[0.14em] uppercase text-amber-accent text-pretty">
              {c.status}
            </p>
          )}

          <div className="grid md:grid-cols-2 gap-px bg-rule border border-rule mt-14">
            <div className="bg-ink-0 p-8">
              <p className="text-label mb-4">{c.competitor} suits</p>
              <p className="text-paper text-pretty">{c.whoThem}</p>
            </div>
            <div className="bg-ink-1 p-8">
              <p className="text-label text-emerald-accent mb-4">Count Dojo suits</p>
              <p className="text-paper text-pretty">{c.whoUs}</p>
            </div>
          </div>

          <VsSection number="01" title="Side by side">
            {/* Phones: one stacked block per row instead of a sideways-scrolling table. */}
            <dl className="md:hidden border-t border-rule-strong">
              {c.rows.map((r) => (
                <div key={r.label} className="border-b border-rule py-4">
                  <dt className="font-mono text-[0.7rem] tracking-[0.14em] uppercase text-paper-faint mb-2">
                    {r.label}
                  </dt>
                  <dd className="text-paper text-pretty">
                    <span className="text-label text-emerald-accent mr-2">Count Dojo</span>
                    {r.us}
                  </dd>
                  <dd className="text-paper-muted text-pretty mt-1.5">
                    <span className="text-label mr-2">{c.competitor}</span>
                    {r.them}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="hidden md:block">
              <table className="w-full text-left text-base">
                <thead>
                  <tr className="border-b border-rule-strong">
                    <th scope="col" className="text-label py-3 pr-4 w-[28%] font-normal">
                      &nbsp;
                    </th>
                    <th scope="col" className="text-label text-emerald-accent py-3 pr-4 font-normal">
                      Count Dojo
                    </th>
                    <th scope="col" className="text-label py-3 font-normal">
                      {c.competitor}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {c.rows.map((r) => (
                    <tr key={r.label} className="border-b border-rule align-top">
                      <th
                        scope="row"
                        className="font-mono text-[0.7rem] tracking-[0.14em] uppercase text-paper-faint py-4 pr-4 font-normal"
                      >
                        {r.label}
                      </th>
                      <td className="py-4 pr-4 text-paper text-pretty">{r.us}</td>
                      <td className="py-4 text-paper-muted text-pretty">{r.them}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </VsSection>

          <VsSection number="02" title={`Where ${c.competitor} is better`}>
            <List items={c.themBetter} />
          </VsSection>

          <VsSection number="03" title="Where Count Dojo is different">
            <List items={c.usDifferent} accent />
          </VsSection>

          <VsSection number="04" title="The short version">
            <p className="text-paper-muted text-pretty mb-8">{c.closing}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-store btn-store-primary"
              >
                <span className="btn-store__label">
                  <span className="btn-store__meta">Download on</span>
                  <span className="btn-store__primary-text">App Store</span>
                </span>
              </a>
              <a
                href={GOOGLE_PLAY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-store"
              >
                <span className="btn-store__label">
                  <span className="btn-store__meta">Get it on</span>
                  <span className="btn-store__primary-text">Google Play</span>
                </span>
              </a>
            </div>
            <p className="mt-6">
              <Link href="/#pricing" className="link-mono py-2 inline-block">
                Count Dojo pricing →
              </Link>
            </p>
          </VsSection>

          <p className="mt-16 pt-8 border-t border-rule text-sm text-paper-faint text-pretty">
            {c.competitor} details are from its own site and the US app stores, checked{" "}
            {c.checked}:{" "}
            {c.sources.map((s, i) => (
              <span key={s.href}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="link-underline text-paper-muted"
                >
                  {s.label}
                </a>
                {i < c.sources.length - 1 ? ", " : "."}
              </span>
            ))}{" "}
            If anything here is out of date, email{" "}
            <a href="mailto:support@countdojo.com" className="link-underline text-paper-muted">
              support@countdojo.com
            </a>{" "}
            and it will be corrected.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function VsSection({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-rule pt-10 mt-14">
      <div className="flex items-baseline gap-4 mb-6">
        <span className="font-mono text-[0.72rem] tracking-[0.22em] uppercase text-paper-faint">
          {number}
        </span>
        <h2 className="font-display text-2xl md:text-3xl text-paper">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function List({ items, accent = false }: { items: string[]; accent?: boolean }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-paper">
          <span
            className={`font-mono mt-1 shrink-0 ${accent ? "text-emerald-accent" : "text-paper-faint"}`}
          >
            —
          </span>
          <span className="text-pretty">{item}</span>
        </li>
      ))}
    </ul>
  );
}
