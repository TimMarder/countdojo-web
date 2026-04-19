"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { SiteHeader } from "./_components/SiteHeader";
import { SiteFooter } from "./_components/SiteFooter";

const APP_STORE_URL =
  "https://apps.apple.com/us/app/count-dojo-bj-card-counting/id6760961014";
const GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.countdojo.app&utm_source=na_Med";

type Unit = {
  numeral: string;
  title: string;
  synopsis: string;
  lessons: number;
  tier: "Free" | "Free → Premium" | "Premium";
};

type CountingSystem = {
  name: string;
  values: string;
  note: string;
  rank: string;
};

type Belt = {
  belt: string;
  range: string;
  title: string;
  desc: string;
  color: string;
};

type Testimonial = { quote: string; author: string };
type FaqItem = { q: string; a: string };
type DrillCategory = { label: string; drills: string[] };
type Screenshot = { src: string; alt: string };

const proofStats = [
  { number: "6", label: "Units" },
  { number: "30+", label: "Lessons" },
  { number: "19", label: "Drill types" },
  { number: "7", label: "Counting systems" },
  { number: "65", label: "Achievements" },
  { number: "20", label: "Belt levels" },
];

const curriculum: Unit[] = [
  {
    numeral: "I",
    title: "Blackjack Foundations",
    synopsis:
      "Card values, hard and soft totals, pairs. Basic strategy mastery to the boss test.",
    lessons: 8,
    tier: "Free",
  },
  {
    numeral: "II",
    title: "Learning to Count",
    synopsis:
      "Hi-Lo, running count, deck counting, handling distractions. Optional side branches on history and alternative systems.",
    lessons: 7,
    tier: "Free → Premium",
  },
  {
    numeral: "III",
    title: "True Count & Bet Sizing",
    synopsis:
      "True count conversion, bet spreads from 1-8 to 1-16, bankroll mechanics and risk of ruin.",
    lessons: 3,
    tier: "Premium",
  },
  {
    numeral: "IV",
    title: "Playing Deviations",
    synopsis:
      "The Illustrious 18 and Fab 4 late surrenders, with an extended-deviations module for the committed.",
    lessons: 5,
    tier: "Premium",
  },
  {
    numeral: "V",
    title: "Casino Readiness",
    synopsis:
      "Game selection, cover play, heat and backoffs, how to stay welcome at the tables.",
    lessons: 5,
    tier: "Premium",
  },
  {
    numeral: "VI",
    title: "Advanced Advantage Play",
    synopsis:
      "Hole carding, shuffle tracking overview, side bets, team play, and an honest look at comp hustling.",
    lessons: 6,
    tier: "Premium",
  },
];

const drillCategories: DrillCategory[] = [
  {
    label: "Basic Strategy",
    drills: ["Hard totals", "Soft totals", "Pairs", "Mixed", "Speed strategy"],
  },
  {
    label: "Counting Foundations",
    drills: [
      "Card flash",
      "Single-hand count",
      "Pair cancellation",
      "Running count",
      "Count interruptions",
      "Speed counting",
      "Deck countdown",
    ],
  },
  {
    label: "True Count & Betting",
    drills: [
      "True count conversion",
      "Deck estimation",
      "True count flow",
      "Bet sizing",
      "Realistic chips",
    ],
  },
  {
    label: "Strategy & Deviations",
    drills: [
      "Illustrious 18",
      "Fab 4 surrenders",
      "Extended deviations",
      "Game quality scenarios",
    ],
  },
  {
    label: "Integrated Practice",
    drills: ["Simulator", "Personalized practice"],
  },
];

const countingSystems: CountingSystem[] = [
  {
    name: "Hi-Lo",
    rank: "Primary",
    values: "2-6 → +1    7-9 → 0    10-A → −1",
    note: "The gold standard. Taught first, practiced deepest, and the one 99% of players should use.",
  },
  {
    name: "KO",
    rank: "Alternate",
    values: "2-7 → +1    8-9 → 0    10-A → −1",
    note: "Unbalanced. Skips the true-count conversion step entirely.",
  },
  {
    name: "Hi-Opt I",
    rank: "Alternate",
    values: "3-6 → +1    2, 7-9, A → 0    10 → −1",
    note: "Slightly more accurate than Hi-Lo at the cost of a side ace-count.",
  },
  {
    name: "Hi-Opt II",
    rank: "Level II",
    values: "2-3, 6-7 → +1    4-5 → +2    8-9 → 0    10 → −2",
    note: "Level-2 count with a side ace-count. High ceiling, unforgiving in practice.",
  },
  {
    name: "Omega II",
    rank: "Level II",
    values: "2-3, 7 → +1    4-6 → +2    8 → 0    9 → −1    10 → −2",
    note: "Highest power for Schlesinger loyalists. A commitment.",
  },
  {
    name: "Zen Count",
    rank: "Level II",
    values: "2-3, 7 → +1    4-6 → +2    8-9 → 0    10 → −2    A → −1",
    note: "Balanced level 2. Trades simplicity for correlation.",
  },
  {
    name: "Wong Halves",
    rank: "Level III",
    values: "Fractional values across all ranks",
    note: "Maximum accuracy. For obsessives.",
  },
];

const simulatorFeatures = [
  "H17 or S17 dealer rule",
  "Double after split (DAS)",
  "1 to 8 deck shoes",
  "Configurable penetration",
  "Realistic chip spreads",
  "Discard tray visualization",
  "Multi-player AI tables",
  "Heat and surveillance overlay",
  "Count checkpoints mid-shoe",
  "Multi-axis performance grading",
];

const belts: Belt[] = [
  {
    belt: "Blue Belt",
    range: "Levels 1–5",
    title: "Student",
    desc: "Basic strategy, card values, first running counts.",
    color: "#60a5fa",
  },
  {
    belt: "Card Disciple",
    range: "Levels 6–10",
    title: "Counter",
    desc: "Running count, deck estimation, true count conversion.",
    color: "#a78bfa",
  },
  {
    belt: "Advantage Player",
    range: "Levels 11–15",
    title: "Player",
    desc: "Playing deviations, bet spreads, casino readiness.",
    color: "#f59e0b",
  },
  {
    belt: "Dojo Legend",
    range: "Levels 16–20",
    title: "Master",
    desc: "Advanced advantage play. Grand Sensei.",
    color: "#34d399",
  },
];

const pricingFree = {
  label: "Free",
  headline: "Start training. No card required.",
  items: [
    "All of Unit I — Blackjack Foundations",
    "First three lessons of Unit II",
    "Seven unlimited practice drills",
    "One daily-limited drill (running count, five minutes a day)",
    "Every reference: strategy charts, edge calculator, glossary",
    "Placement tests for skip-ahead",
  ],
};

const pricingPremium = {
  label: "Premium",
  headline: "The full dojo.",
  items: [
    "Units II through VI — true count, deviations, readiness, advanced play",
    "Every drill on adaptive difficulty with medal tiers",
    "The casino simulator with full rule configuration",
    "Personalized practice via spaced-repetition review",
    "65 achievements, 20 levels, four belt ranks",
    "Cloud sync across devices",
  ],
  plans: ["Weekly", "Monthly", "Annual"],
};

const testimonials: Testimonial[] = [
  {
    quote:
      "I went from knowing nothing about card counting to being able to count down a deck in 30 seconds. This app is legit.",
    author: "Michael S.",
  },
  {
    quote:
      "Most apps just assume you already know how to count and give you drills with no actual education. Count Dojo actually starts from zero — and if you don't need it, you can advance faster.",
    author: "Ariel M.",
  },
  {
    quote:
      "Finally, a structured way to learn card counting. No more YouTube videos or books.",
    author: "Brian Z.",
  },
  {
    quote:
      "Went to Vegas last month and felt confident at the tables for the first time.",
    author: "Tyler V.",
  },
];

const faq: FaqItem[] = [
  {
    q: "Is card counting legal?",
    a: "Yes. Completely legal. It is a mental skill; you are keeping track of information already visible to you. A casino can ask you to leave their property, but cannot arrest or charge you.",
  },
  {
    q: "Will this app guarantee I win?",
    a: "No. Counting gives you a mathematical edge over time — typically half a percent to one and a half percent. Variance means short-term losses are normal. You are building an advantage, not a certainty.",
  },
  {
    q: "How long does it take to learn?",
    a: "Most players finish the foundations in thirty to sixty days with daily practice. Casino-ready performance takes longer — weeks of speed work on the drills, plus focused sessions in the simulator.",
  },
  {
    q: "Do I need to be good at math?",
    a: "No. Hi-Lo only requires adding and subtracting one. True-count conversion is dividing by a whole number. Every bit of arithmetic is taught step by step.",
  },
  {
    q: "What is the difference between Free and Premium?",
    a: "Free gives you all of Unit I, the first three lessons of Unit II, seven unlimited practice drills, and every reference. Premium opens Units II through VI, the casino simulator, personalized practice, and the full nineteen-drill library.",
  },
];

const screenshots: Screenshot[] = [
  { src: "/images/IMG_6959.PNG", alt: "Skill Tree" },
  { src: "/images/IMG_6960.PNG", alt: "Practice" },
  { src: "/images/IMG_6961.PNG", alt: "Drills" },
  { src: "/images/IMG_6962.PNG", alt: "Counting" },
  { src: "/images/IMG_6963.PNG", alt: "Reference" },
  { src: "/images/IMG_6964.PNG", alt: "Casino Simulator" },
  { src: "/images/IMG_6965.PNG", alt: "Simulator" },
  { src: "/images/IMG_6966.PNG", alt: "Profile" },
  { src: "/images/IMG_6967.PNG", alt: "Settings" },
  { src: "/images/IMG_6968.PNG", alt: "Stats" },
];

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function AppStoreIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.21-1.96 1.07-3.11-1.05.05-2.31.72-3.06 1.61-.68.79-1.26 2.08-1.1 3.23 1.18.09 2.39-.59 3.09-1.73z" />
    </svg>
  );
}

function PlayStoreIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H9M17 7V15" />
    </svg>
  );
}

function StoreButtons({ primary = false }: { primary?: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <a
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`btn-store ${primary ? "btn-store-primary" : ""}`}
      >
        <AppStoreIcon />
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
        <PlayStoreIcon />
        <span className="btn-store__label">
          <span className="btn-store__meta">Get it on</span>
          <span className="btn-store__primary-text">Google Play</span>
        </span>
      </a>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden hero-media border-b border-rule">
      <video
        className="hero-video absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster="/images/IMG_6360.jpg"
      >
        <source src="/videos/blackjack-hero.mp4" type="video/mp4" />
      </video>
      <div className="relative z-10 site-shell pt-32 pb-24 md:pt-40 md:pb-32 min-h-[88vh] flex items-end">
        <div className="grid md:grid-cols-[1.5fr,1fr] gap-16 w-full items-end">
          <div className="hero-stagger max-w-2xl">
            <p className="text-chapter">§ I · An education in advantage play</p>
            <h1 className="font-display text-display-xl text-paper text-balance mt-6">
              A serious craft.
              <br />
              <span
                className="italic"
                style={{ fontVariationSettings: '"SOFT" 100, "opsz" 144' }}
              >
                Finally taught
              </span>{" "}
              like one.
            </h1>
            <p className="text-lg md:text-xl text-paper-muted mt-8 max-w-xl text-pretty">
              Six units. Thirty lessons. Nineteen drill types. A casino simulator calibrated to
              real table rules. Count Dojo is the training ground for players who treat card
              counting as what it is — a disciplined, legal, learnable skill.
            </p>
            <div className="mt-10">
              <StoreButtons primary />
            </div>
            <p className="text-label mt-8">
              Free to start    ·    No math skill required    ·    Works offline
            </p>
          </div>
          <div className="hidden md:flex justify-end">
            <div className="phone-mock rotate-3 w-full max-w-[280px]">
              <div className="phone-mock__screen">
                <Image
                  src="/images/IMG_6959.PNG"
                  alt="Count Dojo skill tree"
                  width={360}
                  height={780}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProofStrip() {
  return (
    <section aria-labelledby="proof-heading" className="bg-ink-0">
      <h2 id="proof-heading" className="sr-only">
        The curriculum at a glance
      </h2>
      <div className="site-shell">
        <div className="proof-strip">
          {proofStats.map((s) => (
            <div key={s.label} className="proof-cell">
              <span className="text-stat text-5xl md:text-6xl text-paper">{s.number}</span>
              <span className="text-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TierBadge({ tier }: { tier: Unit["tier"] }) {
  const color =
    tier === "Free"
      ? "var(--emerald)"
      : tier === "Free → Premium"
        ? "var(--amber)"
        : "var(--paper-muted)";
  return (
    <span
      className="font-mono text-[0.65rem] tracking-[0.22em] uppercase"
      style={{ color }}
    >
      {tier}
    </span>
  );
}

function CurriculumSection() {
  return (
    <section id="curriculum" className="section-rhythm">
      <div className="site-shell">
        <div className="grid md:grid-cols-[1fr,2.1fr] gap-10 md:gap-16 mb-16">
          <div>
            <p className="text-chapter mb-5">§ II · The Path</p>
            <h2 className="font-display text-display-lg text-paper text-balance">
              Six units,
              <br />
              charted from zero.
            </h2>
          </div>
          <p className="text-lg text-paper-muted self-end max-w-xl text-pretty">
            A structured curriculum that starts at card values and ends at advanced advantage
            play. Placement tests let experienced players skip directly to the unit that suits
            them.
          </p>
        </div>
        <div>
          {curriculum.map((unit, i) => (
            <Reveal key={unit.numeral} delay={i * 60}>
              <div className="editorial-row group">
                <span className="chapter-mark w-12 self-start mt-1">{unit.numeral}</span>
                <div className="min-w-0">
                  <h3
                    className="font-display text-2xl md:text-3xl text-paper mb-2"
                    style={{ fontVariationSettings: '"SOFT" 80, "opsz" 48' }}
                  >
                    {unit.title}
                  </h3>
                  <p className="text-paper-muted max-w-2xl text-pretty">{unit.synopsis}</p>
                </div>
                <div className="text-right flex flex-col items-end gap-2 whitespace-nowrap">
                  <span className="text-label">{unit.lessons} lessons</span>
                  <TierBadge tier={unit.tier} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function DrillsSection() {
  return (
    <section id="drills" className="section-rhythm bg-ink-1 border-y border-rule">
      <div className="site-shell">
        <div className="grid md:grid-cols-[1fr,2.1fr] gap-10 md:gap-16 mb-16">
          <div>
            <p className="text-chapter mb-5">§ III · The Repetition</p>
            <h2 className="font-display text-display-lg text-paper text-balance">
              Nineteen drills. Adaptive. Graded.
            </h2>
          </div>
          <p className="text-lg text-paper-muted self-end max-w-xl text-pretty">
            Every drill awards Bronze, Silver, Gold, or Legend against accuracy and speed
            gates. A personalized-practice engine generates weak-scenario review sessions using
            spaced repetition.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-x-10 md:gap-x-14 gap-y-12 md:gap-y-16">
          {drillCategories.map((cat, i) => (
            <Reveal key={cat.label} delay={i * 80}>
              <div>
                <p className="text-label mb-5 flex items-center gap-3">
                  <span className="font-mono text-paper-ghost">{String(i + 1).padStart(2, "0")}</span>
                  {cat.label}
                </p>
                <ul className="flex flex-col">
                  {cat.drills.map((d) => (
                    <li
                      key={d}
                      className="font-display text-xl md:text-2xl text-paper border-t border-rule py-3 first:border-t-0 first:pt-0"
                      style={{ fontVariationSettings: '"SOFT" 70, "opsz" 48' }}
                    >
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CountingSystemsSection() {
  return (
    <section id="systems" className="section-rhythm">
      <div className="site-shell">
        <div className="grid md:grid-cols-[1fr,2.1fr] gap-10 md:gap-16 mb-16">
          <div>
            <p className="text-chapter mb-5">§ IV · The Languages</p>
            <h2 className="font-display text-display-lg text-paper text-balance">
              Seven systems.
              <br />
              Fluent in one, literate in six.
            </h2>
          </div>
          <p className="text-lg text-paper-muted self-end max-w-xl text-pretty">
            Hi-Lo is the gold standard and our default. Side branches cover six alternatives —
            for history, curiosity, and the small set of players who benefit from specialized
            systems.
          </p>
        </div>
        <div>
          {countingSystems.map((s, i) => (
            <Reveal key={s.name} delay={i * 40}>
              <div className="editorial-row">
                <span className="text-label w-24">{s.rank}</span>
                <div className="min-w-0">
                  <h3
                    className="font-display text-2xl md:text-3xl text-paper mb-2"
                    style={{ fontVariationSettings: '"SOFT" 80, "opsz" 48' }}
                  >
                    {s.name}
                  </h3>
                  <p className="text-paper-muted mb-3 max-w-2xl text-pretty">{s.note}</p>
                  <p className="font-mono text-xs md:text-sm text-paper-faint tracking-wider">
                    {s.values}
                  </p>
                </div>
                <span className="hidden md:inline-block" aria-hidden />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SimulatorSection() {
  return (
    <section id="simulator" className="section-rhythm bg-ink-1 border-y border-rule">
      <div className="site-shell">
        <div className="grid md:grid-cols-[1.1fr,1fr] gap-16 items-center">
          <div>
            <p className="text-chapter mb-5">§ V · The Dojo Floor</p>
            <h2 className="font-display text-display-lg text-paper text-balance mb-8">
              A casino, calibrated.
            </h2>
            <p className="text-lg text-paper-muted mb-10 max-w-xl text-pretty">
              The simulator models the rules that actually matter: dealer stand, double after
              split, shoe size, penetration. Your bet sizing, true-count reads, and play
              decisions are graded in real time.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              {simulatorFeatures.map((f) => (
                <li key={f} className="flex items-start gap-3 text-paper">
                  <span className="dot-emerald mt-2 shrink-0" aria-hidden />
                  <span className="text-sm md:text-base">{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center md:justify-end">
            <div className="phone-mock w-full max-w-[300px] -rotate-3">
              <div className="phone-mock__screen">
                <Image
                  src="/images/IMG_6964.PNG"
                  alt="Count Dojo casino simulator"
                  width={360}
                  height={780}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BeltsSection() {
  return (
    <section className="section-rhythm">
      <div className="site-shell">
        <div className="grid md:grid-cols-[1fr,2.1fr] gap-10 md:gap-16 mb-16">
          <div>
            <p className="text-chapter mb-5">§ VI · The Journey</p>
            <h2 className="font-display text-display-lg text-paper text-balance">
              From student to Grand Sensei.
            </h2>
          </div>
          <p className="text-lg text-paper-muted self-end max-w-xl text-pretty">
            Four ranks. Twenty levels. Sixty-five achievements. Dojo Legend is not a time-on-app
            reward — it is earned by mastering every drill, unit, and simulator scenario.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-px bg-rule border border-rule">
          {belts.map((b) => (
            <div key={b.belt} className="bg-ink-0 p-8 md:p-10 flex flex-col gap-6">
              <div
                className="h-12 w-12 rounded-full border flex items-center justify-center"
                style={{
                  background: `${b.color}14`,
                  borderColor: `${b.color}55`,
                }}
              >
                <div
                  className="h-3.5 w-3.5 rounded-full"
                  style={{ background: b.color, boxShadow: `0 0 20px ${b.color}55` }}
                />
              </div>
              <div>
                <p className="text-label mb-2">{b.range}</p>
                <h3
                  className="font-display text-2xl md:text-3xl text-paper"
                  style={{ fontVariationSettings: '"SOFT" 80, "opsz" 48' }}
                >
                  {b.belt}
                </h3>
                <p className="font-mono text-[0.68rem] tracking-[0.25em] uppercase text-paper-faint mt-2 mb-5">
                  {b.title}
                </p>
                <p className="text-sm text-paper-muted text-pretty">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section id="pricing" className="section-rhythm bg-ink-1 border-y border-rule">
      <div className="site-shell">
        <div className="grid md:grid-cols-[1fr,2.1fr] gap-10 md:gap-16 mb-16">
          <div>
            <p className="text-chapter mb-5">§ VII · Tuition</p>
            <h2 className="font-display text-display-lg text-paper text-balance">
              Free where it should be. Paid where it should be.
            </h2>
          </div>
          <p className="text-lg text-paper-muted self-end max-w-xl text-pretty">
            The foundations are free forever. True count, deviations, the casino simulator, and
            the personalized-practice engine sit behind a single subscription — weekly, monthly,
            or annual.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-px bg-rule border border-rule">
          <div className="bg-ink-0 p-8 md:p-10 flex flex-col">
            <div className="flex items-baseline justify-between mb-4">
              <h3
                className="font-display text-3xl md:text-4xl text-paper"
                style={{ fontVariationSettings: '"SOFT" 80, "opsz" 72' }}
              >
                {pricingFree.label}
              </h3>
              <span className="text-label text-emerald-accent">Forever</span>
            </div>
            <p className="text-paper-muted mb-8 text-pretty">{pricingFree.headline}</p>
            <ul className="space-y-3 mb-10 flex-1">
              {pricingFree.items.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm md:text-base text-paper">
                  <span className="font-mono text-emerald-accent mt-1 shrink-0">—</span>
                  <span className="text-pretty">{item}</span>
                </li>
              ))}
            </ul>
            <StoreButtons />
          </div>
          <div className="bg-ink-2 p-8 md:p-10 flex flex-col relative">
            <span className="absolute top-6 right-6 text-label text-emerald-accent">
              Recommended
            </span>
            <div className="flex items-baseline justify-between mb-4 mt-2">
              <h3
                className="font-display text-3xl md:text-4xl text-paper"
                style={{ fontVariationSettings: '"SOFT" 80, "opsz" 72' }}
              >
                {pricingPremium.label}
              </h3>
            </div>
            <p className="text-paper-muted mb-2 text-pretty">{pricingPremium.headline}</p>
            <p className="font-mono text-[0.65rem] tracking-[0.22em] uppercase text-paper-faint mb-8">
              {pricingPremium.plans.join("   ·   ")}
            </p>
            <ul className="space-y-3 mb-10 flex-1">
              {pricingPremium.items.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm md:text-base text-paper">
                  <span className="font-mono text-emerald-accent mt-1 shrink-0">—</span>
                  <span className="text-pretty">{item}</span>
                </li>
              ))}
            </ul>
            <StoreButtons primary />
          </div>
        </div>
      </div>
    </section>
  );
}

function ScreenshotsSection() {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"" | "enter-left" | "enter-right">("");

  const go = (dir: 1 | -1) => {
    setPhase(dir === 1 ? "enter-right" : "enter-left");
    setTimeout(() => {
      setIndex((prev) => (prev + dir + screenshots.length) % screenshots.length);
      setPhase("");
    }, 180);
  };

  const current = screenshots[index];

  return (
    <section id="screenshots" className="section-rhythm">
      <div className="site-shell">
        <div className="grid md:grid-cols-[1fr,2.1fr] gap-10 md:gap-16 mb-16">
          <div>
            <p className="text-chapter mb-5">§ VIII · Surfaces</p>
            <h2 className="font-display text-display-lg text-paper text-balance">
              See where the reps happen.
            </h2>
          </div>
          <p className="text-lg text-paper-muted self-end max-w-xl text-pretty">
            Skill tree, drills, references, the casino floor, stats. The app, uncropped.
          </p>
        </div>
        <div className="grid md:grid-cols-[1fr,auto,1fr] items-center gap-6 md:gap-12">
          <div className="hidden md:flex flex-col gap-4 items-end text-right">
            <span className="text-label">{current.alt}</span>
            <span className="font-mono text-xs text-paper-faint">
              {String(index + 1).padStart(2, "0")}  /  {String(screenshots.length).padStart(2, "0")}
            </span>
          </div>
          <div className="phone-mock w-full max-w-[320px] mx-auto">
            <div className="phone-mock__screen">
              <div className={`carousel-slide ${phase} active w-full h-full`}>
                <Image
                  src={current.src}
                  alt={current.alt}
                  width={360}
                  height={780}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          <div className="flex md:flex-col items-center md:items-start gap-4">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous screenshot"
              className="h-11 w-11 rounded-full border border-rule-strong flex items-center justify-center text-paper hover:border-paper hover:text-emerald-accent transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next screenshot"
              className="h-11 w-11 rounded-full border border-rule-strong flex items-center justify-center text-paper hover:border-paper hover:text-emerald-accent transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <span className="md:hidden text-label">
              {current.alt}    ·    {String(index + 1).padStart(2, "0")} / {String(screenshots.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="section-rhythm bg-ink-1 border-y border-rule">
      <div className="site-shell">
        <p className="text-chapter mb-10">§ IX · What players say</p>
        <div className="grid md:grid-cols-2 gap-x-14 md:gap-x-20 gap-y-14 md:gap-y-16">
          {testimonials.map((t, i) => (
            <Reveal key={t.author} delay={i * 80}>
              <figure className="border-t border-rule pt-8">
                <blockquote
                  className="font-display text-2xl md:text-[1.75rem] text-paper leading-[1.2] text-pretty"
                  style={{ fontVariationSettings: '"SOFT" 60, "opsz" 48' }}
                >
                  <span className="text-emerald-accent mr-1">&ldquo;</span>
                  {t.quote}
                  <span className="text-emerald-accent ml-1">&rdquo;</span>
                </blockquote>
                <figcaption className="text-label mt-8">— {t.author}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQItem({
  item,
  number,
  defaultOpen = false,
}: {
  item: FaqItem;
  number: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="faq-item">
      <button
        type="button"
        className="faq-toggle"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="font-mono text-[0.7rem] tracking-[0.22em] uppercase text-paper-faint w-10 shrink-0">
          {number}
        </span>
        <span
          className="font-display text-xl md:text-2xl text-paper flex-1"
          style={{ fontVariationSettings: '"SOFT" 70, "opsz" 48' }}
        >
          {item.q}
        </span>
        <span className="faq-toggle-icon text-paper-muted">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16M4 12h16" />
          </svg>
        </span>
      </button>
      <div className="faq-body" data-open={open}>
        <div>
          <p className="text-paper-muted text-pretty pl-14 pr-10 pt-4 pb-2 max-w-3xl">
            {item.a}
          </p>
        </div>
      </div>
    </div>
  );
}

function FAQSection() {
  return (
    <section id="faq" className="section-rhythm">
      <div className="site-shell max-w-4xl mx-auto">
        <div className="mb-12">
          <p className="text-chapter mb-5">§ X · Questions</p>
          <h2 className="font-display text-display-lg text-paper text-balance">
            Common doubts, straight answers.
          </h2>
        </div>
        <div>
          {faq.map((item, i) => (
            <FAQItem
              key={item.q}
              item={item}
              number={String(i + 1).padStart(2, "0")}
              defaultOpen={i === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="section-rhythm">
      <div className="site-shell">
        <div className="border-y border-rule py-16 md:py-24">
          <p className="text-chapter mb-6 text-center">§ XI · Take the first rep</p>
          <h2 className="font-display text-display-xl text-paper text-balance text-center max-w-4xl mx-auto">
            The edge is legal.
            <br />
            The math is simple.
            <br />
            <span
              className="italic"
              style={{ fontVariationSettings: '"SOFT" 100, "opsz" 144' }}
            >
              The work is yours.
            </span>
          </h2>
          <div className="flex justify-center mt-10 md:mt-12">
            <StoreButtons primary />
          </div>
          <p className="text-label text-center mt-8">
            Free to start    ·    No credit card    ·    Offline-first
          </p>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const homeLinks = [
    { label: "Curriculum", href: "#curriculum" },
    { label: "Drills", href: "#drills" },
    { label: "Simulator", href: "#simulator" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ];
  return (
    <div className="min-h-screen">
      <SiteHeader links={homeLinks} />
      <main>
        <HeroSection />
        <ProofStrip />
        <CurriculumSection />
        <DrillsSection />
        <CountingSystemsSection />
        <SimulatorSection />
        <BeltsSection />
        <PricingSection />
        <ScreenshotsSection />
        <TestimonialsSection />
        <FAQSection />
        <FinalCTA />
      </main>
      <SiteFooter />
    </div>
  );
}
