import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../_components/SiteHeader";
import { SiteFooter } from "../_components/SiteFooter";

export const metadata: Metadata = {
  title: "About — Count Dojo",
  description:
    "Count Dojo is built by Tim, an advantage player who wanted the card-counting course he could not find: a curriculum from zero, graded drills, and a simulator dealt from a real shoe.",
  alternates: { canonical: "/about" },
};

/*
 * FOUNDER REVIEW NEEDED (audit D3.3). First name only, by request. The story
 * below is drafted from what the site and the App Store listing already say —
 * edit it into your own words before merging. A photo and a personal profile
 * link would strengthen this page further; add them here when ready.
 */
export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="section-rhythm">
        <div className="site-shell max-w-3xl">
          <p className="text-chapter mb-5">About — The Founder</p>
          <h1 className="font-display text-display-lg text-paper mb-8 text-balance">
            Built by a counter who wanted a real course.
          </h1>
          <p className="text-lg text-paper-muted mb-16 text-pretty">
            I&rsquo;m Tim. I play blackjack as an advantage player, and I build Count Dojo.
          </p>

          <div className="space-y-10 text-paper">
            <AboutSection number="01" title="Why I built it">
              <p className="text-paper-muted mb-5 text-pretty">
                Every card-counting app I tried assumed I already knew how to count. They handed
                me drills with no education behind them, and nowhere to practice the part that
                actually matters: keeping the count over full hands at a real table. The real
                education lived in books — Thorp, Wong, Schlesinger — and a book cannot time your
                deck countdown.
              </p>
              <p className="text-paper-muted text-pretty">
                So I built the course I wanted: a curriculum that starts at card values, drills
                that grade you against hard thresholds, and a simulator that deals from a real
                shuffled shoe.
              </p>
            </AboutSection>

            <AboutSection number="02" title="Why six units">
              <p className="text-paper-muted text-pretty">
                Counting is several skills stacked on each other, and each one has to be
                automatic before the next one fits on top: basic strategy, then the running
                count, then the true count and the bet, then the deviations. Those are Units I to
                IV. Unit V teaches what most material underweights — playing in a real casino
                without getting backed off. Unit VI is for the players who want to go further.
              </p>
            </AboutSection>

            <AboutSection number="03" title="Why heat and cover play are graded">
              <p className="text-paper-muted text-pretty">
                A perfect count that gets you asked to leave after twenty minutes is not worth
                much. So the simulator grades more than accuracy: it watches your bet spread,
                adds distractions, and brings the pit boss over when your play gives you away.
              </p>
            </AboutSection>

            <AboutSection number="04" title="How the numbers are checked">
              <p className="text-paper-muted text-pretty">
                Every strategy chart, EV figure, and deviation index is checked against the
                published work of the Wizard of Odds, Stanford Wong, and Don Schlesinger. If you
                find one that is wrong, tell me and I will fix it.
              </p>
            </AboutSection>

            <AboutSection number="05" title="What it will never do">
              <p className="text-paper-muted text-pretty">
                Promise you winnings, or let you gamble real money. Count Dojo is a training app.
                Counting is a legal skill that gives a small edge over a long run, with real
                variance along the way — and the app says so.
              </p>
            </AboutSection>

            <AboutSection number="06" title="Get in touch">
              <p className="text-paper-muted text-pretty">
                Email{" "}
                <a
                  href="mailto:support@countdojo.com"
                  className="link-underline text-emerald-accent"
                >
                  support@countdojo.com
                </a>{" "}
                or find Count Dojo on{" "}
                <a
                  href="https://x.com/TheCountDojo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline text-paper"
                >
                  X
                </a>
                . Or start with the{" "}
                <Link href="/#curriculum" className="link-underline text-paper">
                  curriculum
                </Link>
                .
              </p>
            </AboutSection>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function AboutSection({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-rule pt-10">
      <div className="flex items-baseline gap-4 mb-6">
        <span className="font-mono text-[0.72rem] tracking-[0.22em] uppercase text-paper-faint">
          {number}
        </span>
        <h2 className="font-display text-2xl md:text-3xl text-paper">{title}</h2>
      </div>
      <div>{children}</div>
    </section>
  );
}
