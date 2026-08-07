"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { SiteHeader } from "./_components/SiteHeader";
import { SiteFooter } from "./_components/SiteFooter";

const APP_STORE_URL =
  "https://apps.apple.com/us/app/count-dojo-bj-card-counting/id6760961014";
const GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.countdojo.app&utm_source=na_Med";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * Hydration-safe reduced-motion preference.
 *
 * motion's own useReducedMotion() resolves to null on the server and on the
 * first client render, so branching a component's *tree* on it makes the
 * server emit one structure and the client another. useSyncExternalStore lets
 * React hydrate against the server snapshot and then re-render with the real
 * value, which is a normal update rather than a mismatch.
 */
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
}

/**
 * Middot separator with non-breaking glue. U+00A0 binds the dot to the token
 * before it; U+2002 is the only breakable space in the run. A wrapped line can
 * therefore end with a separator but can never begin with one.
 */
const DOT = " · ";

type Unit = {
  numeral: string;
  title: string;
  synopsis: string;
  lessons: number;
  sideBranches?: number;
  tier: "Free" | "Free → Premium" | "Premium";
  samples: string[];
};

type CountingSystem = {
  name: string;
  values: string;
  note: string;
  rank: string;
  level: string;
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
type DrillCategory = { label: string; drills: { name: string; note?: string }[] };
type Screenshot = { src: string; alt: string };
type CasinoPreset = { name: string; decks: string; rules: string[]; pen: string };
type ReferenceTool = { label: string; desc: string };
type AchievementCat = { label: string; count: number; examples: string[] };
type ComparisonRow = { approach: string; gaps: string; emphasis?: boolean };

const proofStats = [
  { number: "6", label: "Units" },
  { number: "30+", label: "Lessons" },
  { number: "19", label: "Drill types" },
  { number: "7", label: "Counting systems" },
  { number: "65", label: "Achievements" },
  { number: "120+", label: "Glossary terms" },
];

const curriculum: Unit[] = [
  {
    numeral: "I",
    title: "Blackjack Foundations",
    synopsis:
      "Card values, hard and soft totals, pairs. Basic strategy mastered to the boss test.",
    lessons: 17,
    sideBranches: 2,
    tier: "Free",
    samples: [
      "1.1 · The Real Objective",
      "1.3 · Hard Totals Fundamentals",
      "1.5 · Pair Splitting — the Decision Tree",
    ],
  },
  {
    numeral: "II",
    title: "Learning to Count",
    synopsis:
      "Hi-Lo, running count, full-shoe endurance. Side branches on history, alternative systems, and the math behind counting.",
    lessons: 10,
    sideBranches: 3,
    tier: "Free → Premium",
    samples: [
      "2.1 · Why Blackjack Can Be Beaten",
      "2.3 · The Hi-Lo System",
      "2.5 · Counting Through a Full Shoe",
    ],
  },
  {
    numeral: "III",
    title: "True Count & Bet Sizing",
    synopsis:
      "The TC formula, bet spreads from 1-4 to 1-20, linear versus Kelly, bankroll and risk of ruin.",
    lessons: 12,
    sideBranches: 2,
    tier: "Premium",
    samples: [
      "3.1 · The True Count Formula",
      "3.5 · Linear vs Kelly Sizing",
      "3.9 · Risk of Ruin",
    ],
  },
  {
    numeral: "IV",
    title: "Playing Deviations",
    synopsis:
      "The Illustrious 18 and Fab 4 surrenders, extended indices, insurance — the number-one deviation.",
    lessons: 11,
    tier: "Premium",
    samples: [
      "4.2 · Insurance — the #1 Deviation",
      "4.4 · The Big Four Standing Plays",
      "4.8 · The Fab 4 Surrenders",
    ],
  },
  {
    numeral: "V",
    title: "Casino Readiness",
    synopsis:
      "Game selection, penetration, table scouting. Cover play, heat, backoffs. How to stay welcome.",
    lessons: 11,
    tier: "Premium",
    samples: [
      "5.1 · Game Selection Fundamentals",
      "5.6 · Disguise and Cover",
      "5.7 · Heat Management",
    ],
  },
  {
    numeral: "VI",
    title: "Advanced Advantage Play",
    synopsis:
      "Extended deviations, shuffle tracking overview, team play, side bets, hole carding, comp hustling.",
    lessons: 4,
    sideBranches: 5,
    tier: "Premium",
    samples: [
      "6.1 · Extended Deviations",
      "SB-6A · Shuffle Tracking",
      "SB-6C · Team Play",
    ],
  },
];

const drillCategories: DrillCategory[] = [
  {
    label: "Basic Strategy",
    drills: [
      { name: "Hard totals" },
      { name: "Soft totals" },
      { name: "Pairs" },
      { name: "Mixed" },
      { name: "Speed strategy", note: "Timed · 2–4s per hand" },
    ],
  },
  {
    label: "Counting Foundations",
    drills: [
      { name: "Card flash" },
      { name: "Single-hand count" },
      { name: "Pair cancellation" },
      { name: "Running count" },
      { name: "Count interruptions" },
      { name: "Speed counting", note: "Timed · burst count 6–10 cards" },
      { name: "Deck countdown", note: "Legend · under 20 seconds" },
    ],
  },
  {
    label: "True Count & Betting",
    drills: [
      { name: "True count conversion" },
      { name: "Deck estimation" },
      { name: "True count flow" },
      { name: "Bet sizing" },
      { name: "Realistic chips" },
    ],
  },
  {
    label: "Strategy & Deviations",
    drills: [
      { name: "Illustrious 18", note: "Easy · Medium · Hard" },
      { name: "Fab 4 surrenders", note: "Easy · Medium · Hard" },
      { name: "Extended deviations" },
      { name: "Game quality scenarios" },
    ],
  },
  {
    label: "Integrated Practice",
    drills: [
      { name: "Casino simulator" },
      { name: "Personalized practice", note: "AI · spaced repetition" },
    ],
  },
];

const countingSystems: CountingSystem[] = [
  {
    name: "Hi-Lo",
    rank: "Primary",
    level: "Level I",
    values: "2-6 → +1    7-9 → 0    10-A → −1",
    note: "The gold standard. Taught first, practiced deepest, and the one 99% of players should use.",
  },
  {
    name: "KO",
    rank: "Alternate",
    level: "Level I · unbalanced",
    values: "2-7 → +1    8-9 → 0    10-A → −1",
    note: "Unbalanced — skips the true-count conversion step. Slight trade in accuracy for simplicity.",
  },
  {
    name: "Hi-Opt I",
    rank: "Alternate",
    level: "Level I · balanced",
    values: "3-6 → +1    2, 7-9, A → 0    10 → −1",
    note: "Slightly more accurate than Hi-Lo at the cost of a separate side ace-count.",
  },
  {
    name: "Hi-Opt II",
    rank: "Technical",
    level: "Level II · balanced",
    values: "2-3, 6-7 → +1    4-5 → +2    8-9 → 0    10 → −2",
    note: "High ceiling, unforgiving in practice. Side ace-count recommended.",
  },
  {
    name: "Omega II",
    rank: "Technical",
    level: "Level II · balanced",
    values: "2-3, 7 → +1    4-6 → +2    8 → 0    9 → −1    10 → −2",
    note: "Highest practical power. For Schlesinger loyalists who lift weights for fun.",
  },
  {
    name: "Zen Count",
    rank: "Technical",
    level: "Level II · balanced",
    values: "2-3, 7 → +1    4-6 → +2    8-9 → 0    10 → −2    A → −1",
    note: "Balanced level-2. Trades simplicity for correlation. Popular in academic circles.",
  },
  {
    name: "Wong Halves",
    rank: "Obsessive",
    level: "Level III · fractional",
    values: "2 → +0.5    3-4 → +1    5 → +1.5    6 → +1    7 → +0.5    8 → 0    9 → −0.5    10-A → −1",
    note: "Theoretical perfection, practical nightmare. Included for completeness.",
  },
];

const simulatorFeatures = [
  "H17 or S17 dealer rule",
  "Double after split",
  "Resplit aces, late surrender",
  "1 to 8 deck shoes",
  "Configurable penetration (50–90%)",
  "Realistic chip spreads (1-4 through 1-20)",
  "Discard tray visualization",
  "Multi-player AI tables",
  "Distraction overlays",
  "Heat and surveillance grading",
  "Count checkpoints mid-shoe",
  "Multi-axis performance scoring",
];

const casinoPresets: CasinoPreset[] = [
  {
    name: "Vegas Strip Standard",
    decks: "6 decks",
    rules: ["S17", "DAS", "RSA", "LS", "3:2"],
    pen: "75% penetration",
  },
  {
    name: "Downtown Vegas",
    decks: "2 decks",
    rules: ["H17", "DAS", "3:2"],
    pen: "65% penetration",
  },
  {
    name: "Atlantic City",
    decks: "8 decks",
    rules: ["S17", "DAS", "RSA", "LS", "3:2"],
    pen: "67% penetration",
  },
  {
    name: "Tough Vegas",
    decks: "6 decks",
    rules: ["H17", "DAS", "3:2"],
    pen: "70% penetration",
  },
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
    title: "Grand Sensei",
    desc: "Advanced advantage play. Mastery of every drill.",
    color: "#34d399",
  },
];

const referenceTools: ReferenceTool[] = [
  {
    label: "Strategy Charts",
    desc: "Interactive and rule-aware. Flip H17/S17, DAS, RSA, surrender — the table rewrites itself.",
  },
  {
    label: "Deviation Indices",
    desc: "The Illustrious 18, the Fab 4, and the Extended list with their index numbers.",
  },
  {
    label: "Bet Spread Tables",
    desc: "Single and two-hand ramps from 1-4 through 1-20. Linear or Kelly-weighted.",
  },
  {
    label: "Edge Calculator",
    desc: "Enter the rules and penetration. Get base house edge, player edge per true count, and break-even TC.",
  },
  {
    label: "Bankroll Planner",
    desc: "Full Kelly, fractional Kelly, risk of ruin. Across session length and spread.",
  },
  {
    label: "Variance Projection",
    desc: "Monte-Carlo swing simulator over 4 to 200 shoes. Drawdown and confidence bands plotted.",
  },
  {
    label: "Dealer Bust Chart",
    desc: "Dealer bust frequency by upcard (2–A) across true counts −5 to +8.",
  },
  {
    label: "Per-TC Edge Curve",
    desc: "The edge-vs-count line itself. See where it turns positive.",
  },
  {
    label: "Casino Database",
    desc: "Player-submitted game conditions. Search by property, city, or stake.",
  },
  {
    label: "120+ Glossary",
    desc: "Ace Side Count to Wong Halves. Every term linked at its first appearance in lessons.",
  },
];

const achievementCategories: AchievementCat[] = [
  {
    label: "Curriculum",
    count: 13,
    examples: ["Foundation Laid", "Side Quest Scholar", "Dojo Graduate"],
  },
  {
    label: "Practice",
    count: 9,
    examples: ["Drill Sergeant · 100 drills", "Sharpshooter · 90% avg", "Weak Spot Closer"],
  },
  {
    label: "Mastery",
    count: 8,
    examples: [
      "Inhuman Speed · deck countdown < 20s",
      "Deviation Master · 90%+",
      "Flawless Round · 100% accuracy",
    ],
  },
  {
    label: "Streak",
    count: 6,
    examples: ["Three-Peat · 3 days", "Fortnight Focus · 14 days", "Centurion · 100 days"],
  },
  {
    label: "Milestone",
    count: 8,
    examples: [
      "Blue Belt → Dojo Legend",
      "Thousand-Hand Warrior",
      "XP Titan · 10,000 XP",
    ],
  },
  {
    label: "Behavioral",
    count: 5,
    examples: ["Midnight Grinder", "Early Bird", "Speed Reader · 3 lessons in a day"],
  },
];

const comparisons: ComparisonRow[] = [
  {
    approach: "YouTube videos",
    gaps: "Scattered. No structure. No progress. No way to grade your running count.",
  },
  {
    approach: "Thorp, Wong, Schlesinger",
    gaps: "The canon. Essential reading. A book cannot time your deck countdown.",
  },
  {
    approach: "Drill-only apps",
    gaps: "Assume you already know how to count. Skip the education.",
  },
  {
    approach: "Count Dojo",
    gaps: "Curriculum, drills, simulator, reference. One stack, from beginner to Grand Sensei.",
    emphasis: true,
  },
];

const pricingFree = {
  label: "Free",
  headline: "Start training. No card required.",
  items: [
    "All 17 lessons of Unit I — Blackjack Foundations",
    "First five lessons of Unit II — Hi-Lo basics",
    "Five unlimited practice drills · Hard, Soft, Pairs, Mixed, Card Flash",
    "Every reference — strategy charts, edge calculator, 120+ glossary",
    "Placement tests for skip-ahead",
  ],
};

const pricingPremium = {
  label: "Premium",
  headline: "The full dojo.",
  items: [
    "Units II through VI — true count, deviations, readiness, advanced play",
    "All 19 drill types on adaptive difficulty with medal tiers",
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
    a: "No. Counting gives you a mathematical edge over time — typically half a percent to two percent at a favorable true count. Variance means short-term losses are normal. You are building an advantage, not a certainty.",
  },
  {
    q: "How long does it take to learn?",
    a: "Most players finish the foundations in thirty to sixty days with daily practice. Casino-ready performance takes longer — weeks of speed work on the drills, plus focused sessions in the simulator.",
  },
  {
    q: "Do I need to be good at math?",
    a: "No. Hi-Lo only requires adding and subtracting one. True-count conversion is dividing a small integer by another small integer. Every bit of arithmetic is taught step by step.",
  },
  {
    q: "What is the difference between Free and Premium?",
    a: "Free gives you all seventeen lessons of Unit I, the first five lessons of Unit II, five unlimited practice drills, and every reference tool. Premium opens Units II through VI, the casino simulator, personalized practice, and the full nineteen-drill library.",
  },
  {
    q: "Which counting system should I learn?",
    a: "Hi-Lo. It is the best practical balance of accuracy and ease of use, and every serious player's first system. Six other systems are available in the app for the curious or the obsessed.",
  },
  {
    q: "Can I use Count Dojo offline?",
    a: "Yes. Every lesson, drill, and reference tool works offline. Progress syncs to the cloud when you are back online.",
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
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
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

function ChapterMark({
  roman,
  title,
  centered = false,
  className = "",
}: {
  roman: string;
  title: string;
  centered?: boolean;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <p className={`text-chapter ${centered ? "text-center" : ""} ${className}`}>
      <span aria-hidden>§ </span>
      <motion.span
        initial={reduced ? false : { rotateY: 90, opacity: 0 }}
        whileInView={reduced ? undefined : { rotateY: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 110, damping: 16, mass: 0.8 }}
        viewport={{ once: true, amount: 0.6 }}
        style={{
          display: "inline-block",
          transformStyle: "preserve-3d",
          transformOrigin: "center",
        }}
      >
        {roman}
      </motion.span>
      <span aria-hidden> · {title}</span>
    </p>
  );
}

type PlayingCardFace = {
  rank: string;
  suit: "s" | "h" | "d" | "c";
};

const PIP_LAYOUTS: Record<string, Array<[number, number, boolean?]>> = {
  "2": [[50, 12], [50, 88, true]],
  "3": [[50, 12], [50, 50], [50, 88, true]],
  "4": [
    [25, 14], [75, 14],
    [25, 86, true], [75, 86, true],
  ],
  "5": [
    [25, 14], [75, 14],
    [50, 50],
    [25, 86, true], [75, 86, true],
  ],
  "6": [
    [25, 14], [75, 14],
    [25, 50], [75, 50],
    [25, 86, true], [75, 86, true],
  ],
  "7": [
    [25, 14], [75, 14],
    [50, 32],
    [25, 50], [75, 50],
    [25, 86, true], [75, 86, true],
  ],
  "8": [
    [25, 14], [75, 14],
    [50, 32],
    [25, 50], [75, 50],
    [50, 68, true],
    [25, 86, true], [75, 86, true],
  ],
  "9": [
    [25, 14], [75, 14],
    [25, 36], [75, 36],
    [50, 50],
    [25, 64, true], [75, 64, true],
    [25, 86, true], [75, 86, true],
  ],
  "10": [
    [25, 14], [75, 14],
    [50, 26],
    [25, 38], [75, 38],
    [25, 62, true], [75, 62, true],
    [50, 74, true],
    [25, 86, true], [75, 86, true],
  ],
};

function PlayingCardVisual({ rank, suit }: PlayingCardFace) {
  const glyph = SUIT_GLYPH[suit];
  const pips = PIP_LAYOUTS[rank];
  return (
    <div className="playing-card" data-suit={suit} aria-hidden>
      <span className="playing-card__corner">
        <span>{rank}</span>
        <span className="playing-card__suit">{glyph}</span>
      </span>
      {pips ? (
        <div className="playing-card__pips">
          {pips.map(([x, y, flip], i) => (
            <span
              key={i}
              className={`playing-card__pip ${flip ? "playing-card__pip--flip" : ""}`}
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              {glyph}
            </span>
          ))}
        </div>
      ) : (
        <span className="playing-card__center">{glyph}</span>
      )}
      <span className="playing-card__corner playing-card__corner--bottom">
        <span>{rank}</span>
        <span className="playing-card__suit">{glyph}</span>
      </span>
    </div>
  );
}

const HERO_FAN: Array<PlayingCardFace & { rotate: number; x: number; y: number; delay: number }> = [
  { rank: "A", suit: "s", rotate: -20, x: -120, y: 30, delay: 0.05 },
  { rank: "10", suit: "h", rotate: -10, x: -60, y: 5, delay: 0.18 },
  { rank: "K", suit: "c", rotate: 0, x: 0, y: -6, delay: 0.31 },
  { rank: "Q", suit: "d", rotate: 10, x: 60, y: 5, delay: 0.44 },
  { rank: "J", suit: "s", rotate: 20, x: 120, y: 30, delay: 0.57 },
];

function HeroCardFan() {
  const reduced = useReducedMotion();
  return (
    <div
      className="hidden md:flex justify-center items-center relative min-h-[360px] w-full"
      aria-hidden
    >
      {HERO_FAN.map((card, i) => (
        <motion.div
          key={`${card.rank}${card.suit}`}
          className="absolute"
          initial={
            reduced
              ? { opacity: 1, x: card.x, y: card.y, rotate: card.rotate }
              : { opacity: 0, y: card.y + 120, rotate: card.rotate - 15, x: card.x * 0.4 }
          }
          animate={{ opacity: 1, y: card.y, x: card.x, rotate: card.rotate }}
          transition={{
            type: "spring",
            stiffness: 90,
            damping: 14,
            mass: 1,
            delay: reduced ? 0 : card.delay,
          }}
          whileHover={reduced ? undefined : { y: card.y - 12, rotate: card.rotate, transition: { type: "spring", stiffness: 260, damping: 18 } }}
          style={{ zIndex: i }}
        >
          <PlayingCardVisual rank={card.rank} suit={card.suit} />
        </motion.div>
      ))}
    </div>
  );
}

type CinematicCardData = { rank: string; suit: Card["suit"] };

const CINEMATIC_CARDS: CinematicCardData[] = [
  { rank: "A", suit: "s" },
  { rank: "2", suit: "h" },
  { rank: "3", suit: "d" },
  { rank: "4", suit: "c" },
  { rank: "5", suit: "s" },
  { rank: "6", suit: "h" },
  { rank: "7", suit: "d" },
  { rank: "8", suit: "c" },
  { rank: "9", suit: "s" },
  { rank: "10", suit: "h" },
  { rank: "J", suit: "d" },
  { rank: "Q", suit: "c" },
  { rank: "K", suit: "s" },
];

type Pose = {
  x: number;
  y: number;
  z: number;
  rotateY: number;
  rotateZ: number;
  opacity: number;
};

function fanPose(i: number, total: number): Pose {
  const center = (total - 1) / 2;
  const offset = i - center;
  const spread = 62;
  return {
    x: offset * spread,
    y: Math.abs(offset) * 6,
    z: -Math.abs(offset) * 26,
    rotateY: offset * 3.5,
    rotateZ: offset * 4,
    opacity: 1,
  };
}

function helixPose(i: number, total: number): Pose {
  const angle = (i / total) * Math.PI * 2;
  const radius = 300;
  const verticalSpan = 340;
  return {
    x: Math.cos(angle) * radius,
    y: (i - (total - 1) / 2) * (verticalSpan / total),
    z: Math.sin(angle) * radius,
    rotateY: -(angle * 180) / Math.PI,
    rotateZ: 0,
    opacity: 1,
  };
}

function convergePose(i: number, total: number): Pose {
  if (i === 0) {
    return { x: 0, y: -16, z: 260, rotateY: 0, rotateZ: 0, opacity: 1 };
  }
  const side = i % 2 === 0 ? 1 : -1;
  const rank = i;
  return {
    x: side * rank * 1.6,
    y: (i - total / 2) * 1.4,
    z: -rank * 22 - 40,
    rotateY: (i - total / 2) * 2.4,
    rotateZ: side * Math.min(rank * 0.8, 6),
    opacity: Math.max(0.06, 0.4 - rank * 0.025),
  };
}

function HelixCard({
  index,
  card,
  progress,
  sceneRotateY,
  reduced,
}: {
  index: number;
  card: CinematicCardData;
  progress: MotionValue<number>;
  sceneRotateY: MotionValue<number>;
  reduced: boolean;
}) {
  const total = CINEMATIC_CARDS.length;
  const s1 = fanPose(index, total);
  const s2 = helixPose(index, total);
  const s3 = convergePose(index, total);
  const flyInOffset = (index - total / 2) * 14;

  const x = useTransform(
    progress,
    [0, 0.1, 0.32, 0.58, 0.82, 1],
    [s1.x - 900 + flyInOffset, s1.x, s1.x, s2.x, s3.x, s3.x],
  );
  const y = useTransform(
    progress,
    [0, 0.1, 0.32, 0.58, 0.82, 1],
    [s1.y + 220, s1.y, s1.y, s2.y, s3.y, s3.y],
  );
  const z = useTransform(
    progress,
    [0, 0.1, 0.32, 0.58, 0.82, 1],
    [s1.z - 400, s1.z, s1.z, s2.z, s3.z, s3.z],
  );
  const rotateY = useTransform(
    progress,
    [0, 0.1, 0.32, 0.58, 0.82, 1],
    [s1.rotateY - 30, s1.rotateY, s1.rotateY, s2.rotateY, s3.rotateY, s3.rotateY],
  );
  const rotateZ = useTransform(
    progress,
    [0, 0.1, 0.32, 0.58, 0.82, 1],
    [s1.rotateZ - 20, s1.rotateZ, s1.rotateZ, s2.rotateZ, s3.rotateZ, s3.rotateZ],
  );
  const [act3Fade, setAct3Fade] = useState(false);
  useMotionValueEvent(progress, "change", (v) => {
    setAct3Fade(v > 0.78);
  });

  const worldRotY = useTransform<number, number>(
    [rotateY, sceneRotateY],
    ([cardR, sceneR]) => {
      const total = cardR + sceneR;
      return ((total % 360) + 360) % 360;
    },
  );
  const faceOpacity = useTransform<number, number>(worldRotY, (r) =>
    r < 90 || r > 270 ? 1 : 0,
  );
  const backOpacity = useTransform<number, number>(worldRotY, (r) =>
    r >= 90 && r <= 270 ? 1 : 0,
  );

  if (reduced) {
    return (
      <div
        className="helix-card"
        style={{
          transform: `translate3d(${s1.x}px, ${s1.y}px, ${s1.z}px) rotateY(${s1.rotateY}deg) rotateZ(${s1.rotateZ}deg)`,
          opacity: s1.opacity,
        }}
      >
        <HelixCardFaces card={card} faceOpacity={1} backOpacity={0} />
      </div>
    );
  }

  return (
    <motion.div
      className="helix-card"
      data-act3={act3Fade ? "true" : "false"}
      style={{
        x,
        y,
        z,
        rotateY,
        rotateZ,
        ["--helix-fade-target" as string]: s3.opacity,
      }}
    >
      <HelixCardFaces card={card} faceOpacity={faceOpacity} backOpacity={backOpacity} />
    </motion.div>
  );
}

function HelixCardFaces({
  card,
  faceOpacity,
  backOpacity,
}: {
  card: CinematicCardData;
  faceOpacity: MotionValue<number> | number;
  backOpacity: MotionValue<number> | number;
}) {
  return (
    <>
      <motion.div className="helix-card-face" style={{ opacity: faceOpacity }}>
        <PlayingCardVisual rank={card.rank} suit={card.suit} />
      </motion.div>
      <motion.div className="helix-card-back" style={{ opacity: backOpacity }} aria-hidden>
        <span className="helix-card-back__glyph">♠</span>
        <span className="helix-card-back__mono">Count Dojo</span>
      </motion.div>
    </>
  );
}

function CinematicSuit({
  glyph,
  top,
  left,
  size,
  rotateFrom,
  rotateTo,
  progress,
}: {
  glyph: string;
  top: string;
  left: string;
  size: string;
  rotateFrom: number;
  rotateTo: number;
  progress: MotionValue<number>;
}) {
  const rotate = useTransform(progress, [0, 1], [rotateFrom, rotateTo]);
  const y = useTransform(progress, [0, 1], [0, -40]);
  const o = useTransform(progress, [0, 0.3, 0.65, 1], [0.025, 0.09, 0.12, 0.04]);
  return (
    <motion.span
      className="cinematic-suit"
      style={{
        top,
        left,
        fontSize: size,
        rotate,
        y,
        opacity: o,
      }}
      aria-hidden
    >
      {glyph}
    </motion.span>
  );
}

function CinematicSequence() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const sceneRotateY = useTransform(
    scrollYProgress,
    [0.32, 0.58, 0.82],
    [0, 360, 360],
  );
  const sceneRotateX = useTransform(
    scrollYProgress,
    [0, 0.32, 0.58, 0.82, 1],
    [6, 0, -4, -8, -8],
  );
  const sceneScale = useTransform(
    scrollYProgress,
    [0, 0.15, 0.45, 0.82, 1],
    [0.82, 1, 1.05, 1, 1.02],
  );

  const scrollHintOpacity = useTransform(
    scrollYProgress,
    [0, 0.08, 0.18],
    [0.8, 0.8, 0],
  );

  const [activeStage, setActiveStage] = useState(0);
  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      if (v < 0.32) setActiveStage(0);
      else if (v < 0.66) setActiveStage(1);
      else setActiveStage(2);
    });
    return () => unsub();
  }, [scrollYProgress]);

  if (reduced) {
    return (
      <section className="cinematic-section" aria-hidden>
        <div className="cinematic-sticky">
          <div className="cinematic-perspective">
            <div className="cinematic-scene" style={{ transform: "rotateX(4deg)" }}>
              {CINEMATIC_CARDS.map((card, i) => (
                <HelixCard
                  key={`${card.rank}${card.suit}`}
                  index={i}
                  card={card}
                  progress={scrollYProgress}
                  sceneRotateY={sceneRotateY}
                  reduced
                />
              ))}
            </div>
          </div>
          <div className="cinematic-stages">
            <div className="cinematic-stage" style={{ opacity: 1 }}>
              <p className="cinematic-chapter">Act I · II · III</p>
              <h2 className="cinematic-headline">
                Thirteen ranks, <em>one legal edge.</em>
              </h2>
              <p className="cinematic-sub">
                The count lives in what remains. The math is simple. The work is yours.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="cinematic-section" aria-label="Cinematic intro">
      <div className="cinematic-sticky">
        <CinematicSuit
          glyph="♠"
          top="12%"
          left="8%"
          size="clamp(8rem, 18vw, 18rem)"
          rotateFrom={-8}
          rotateTo={40}
          progress={scrollYProgress}
        />
        <CinematicSuit
          glyph="♥"
          top="62%"
          left="82%"
          size="clamp(6rem, 14vw, 14rem)"
          rotateFrom={12}
          rotateTo={-28}
          progress={scrollYProgress}
        />
        <CinematicSuit
          glyph="♦"
          top="68%"
          left="10%"
          size="clamp(6rem, 13vw, 13rem)"
          rotateFrom={-18}
          rotateTo={24}
          progress={scrollYProgress}
        />
        <CinematicSuit
          glyph="♣"
          top="14%"
          left="80%"
          size="clamp(8rem, 16vw, 16rem)"
          rotateFrom={10}
          rotateTo={-34}
          progress={scrollYProgress}
        />

        <div className="cinematic-perspective">
          <motion.div
            className="cinematic-scene"
            style={{
              rotateY: sceneRotateY,
              rotateX: sceneRotateX,
              scale: sceneScale,
            }}
          >
            {CINEMATIC_CARDS.map((card, i) => (
              <HelixCard
                key={`${card.rank}${card.suit}`}
                index={i}
                card={card}
                progress={scrollYProgress}
                sceneRotateY={sceneRotateY}
                reduced={false}
              />
            ))}
          </motion.div>
        </div>

        <div className="cinematic-stages">
          <div
            className="cinematic-stage"
            data-active={activeStage === 0}
          >
            <p className="cinematic-chapter">Act I · The Deal</p>
            <h2 className="cinematic-headline">
              Thirteen ranks.
              <br />
              Four suits.
            </h2>
            <p className="cinematic-sub">
              One legal edge worth mastering — hidden in the patterns the cards leave behind.
            </p>
          </div>

          <div
            className="cinematic-stage"
            data-active={activeStage === 1}
          >
            <p className="cinematic-chapter">Act II · The Helix</p>
            <h2 className="cinematic-headline">
              The count lives in
              <br />
              <em>what remains.</em>
            </h2>
            <p className="cinematic-sub">
              Not in the card you just saw. In every card that has not come yet.
            </p>
          </div>

          <div
            className="cinematic-stage"
            data-active={activeStage === 2}
          >
            <p className="cinematic-chapter">Act III · The Edge</p>
            <h2 className="cinematic-headline">
              The edge is legal.
              <br />
              <em>The work is yours.</em>
            </h2>
            <p className="cinematic-sub">
              The math is simple. Everything below this line is how we teach it.
            </p>
          </div>
        </div>

        <div className="cinematic-progress" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="cinematic-progress__dot"
              data-active={activeStage === i}
            />
          ))}
        </div>

        <motion.div
          className="cinematic-scroll-hint"
          style={{ opacity: scrollHintOpacity }}
          aria-hidden
        >
          Scroll
        </motion.div>
      </div>
    </section>
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

type Card = { rank: string; suit: "s" | "h" | "d" | "c" };
const SUIT_GLYPH: Record<Card["suit"], string> = { s: "♠", h: "♥", d: "♦", c: "♣" };

const liveDemo: Card[] = [
  { rank: "K", suit: "c" },
  { rank: "9", suit: "s" },
  { rank: "J", suit: "h" },
  { rank: "3", suit: "c" },
  { rank: "5", suit: "s" },
  { rank: "2", suit: "h" },
  { rank: "4", suit: "d" },
  { rank: "6", suit: "c" },
  { rank: "5", suit: "d" },
  { rank: "A", suit: "s" },
  { rank: "10", suit: "c" },
  { rank: "Q", suit: "h" },
  { rank: "7", suit: "d" },
  { rank: "K", suit: "d" },
  { rank: "6", suit: "h" },
  { rank: "8", suit: "c" },
];

function hiLoValue(rank: string): number {
  if (["2", "3", "4", "5", "6"].includes(rank)) return 1;
  if (["7", "8", "9"].includes(rank)) return 0;
  return -1;
}

function tagLabel(n: number): string {
  if (n > 0) return `+${n}`;
  if (n < 0) return `${n}`;
  return "0";
}

function LiveCountDemoSection() {
  const [dealt, setDealt] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setDealt((d) => {
        if (d >= liveDemo.length) {
          return 0;
        }
        return d + 1;
      });
    }, 720);
    return () => clearInterval(id);
  }, [playing]);

  const runningCount = useMemo(
    () =>
      liveDemo
        .slice(0, dealt)
        .reduce((acc, c) => acc + hiLoValue(c.rank), 0),
    [dealt],
  );

  const currentIndex = dealt > 0 ? dealt - 1 : -1;

  return (
    <section className="border-b border-rule bg-ink-1">
      <div className="site-shell py-20 md:py-28">
        <div className="grid md:grid-cols-[1fr_2fr] gap-10 md:gap-16 items-start mb-12">
          <div>
            <p className="text-chapter mb-5">Demonstration</p>
            <h2
              className="font-display text-display-md text-paper text-balance"
            >
              This is what counting looks like.
            </h2>
          </div>
          <p className="text-lg text-paper-muted max-w-xl text-pretty self-end">
            Every card has a Hi-Lo tag. Low cards (2–6) add one. Tens and aces subtract one. Sevens
            through nines are zero. Keep the running total in your head. That is the entire idea.
            Now watch the count drift as the shoe reveals itself.
          </p>
        </div>

        <div className="border border-rule rounded-md bg-ink-0 overflow-hidden">
          <div className="px-5 py-3 border-b border-rule flex items-center justify-between gap-4 flex-wrap">
            <span className="text-label">Hi-Lo · running count</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="demo-control"
                onClick={() => {
                  setDealt(0);
                  setPlaying(true);
                }}
              >
                Reset
              </button>
              <button
                type="button"
                className="demo-control"
                onClick={() => setPlaying((p) => !p)}
                aria-pressed={!playing}
              >
                {playing ? "Pause" : "Play"}
              </button>
              <button
                type="button"
                className="demo-control"
                onClick={() => {
                  setPlaying(false);
                  setDealt((d) => (d >= liveDemo.length ? d : d + 1));
                }}
                disabled={dealt >= liveDemo.length}
                aria-label="Deal next card"
              >
                Next →
              </button>
            </div>
          </div>

          <div className="relative px-5 md:px-10 pt-16 pb-8 overflow-x-auto">
            <div className="flex gap-3 md:gap-4 min-w-max items-end">
              {liveDemo.map((card, i) => {
                const state =
                  i < dealt
                    ? i === currentIndex
                      ? "current"
                      : "dealt"
                    : "pending";
                const tag = hiLoValue(card.rank);
                return (
                  <div key={i} className="relative">
                    {state === "current" && (
                      <span className="count-card__tag">
                        tag {tagLabel(tag)}
                      </span>
                    )}
                    <div
                      className={`count-card count-card--${state}`}
                      data-suit={card.suit}
                    >
                      <span className="count-card__rank">
                        {card.rank}
                        {SUIT_GLYPH[card.suit]}
                      </span>
                      <span className="count-card__suit">{SUIT_GLYPH[card.suit]}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-rule px-5 md:px-10 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-label mb-1">Cards dealt</p>
              <p className="text-stat text-3xl tabular-nums text-paper">
                {dealt}/{liveDemo.length}
              </p>
            </div>
            <div>
              <p className="text-label mb-1">Running count</p>
              <p
                className="text-stat text-3xl tabular-nums"
                style={{
                  color:
                    runningCount > 0
                      ? "var(--emerald)"
                      : runningCount < 0
                        ? "var(--amber)"
                        : "var(--paper)",
                }}
              >
                {tagLabel(runningCount)}
              </p>
            </div>
            <div>
              <p className="text-label mb-1">Current tag</p>
              <p className="text-stat text-3xl tabular-nums text-paper">
                {currentIndex >= 0 ? tagLabel(hiLoValue(liveDemo[currentIndex].rank)) : "—"}
              </p>
            </div>
            <div>
              <p className="text-label mb-1">Six decks remain</p>
              <p className="text-stat text-3xl tabular-nums text-paper">
                {runningCount === 0
                  ? "0"
                  : `${(runningCount / 6 >= 0 ? "+" : "")}${(runningCount / 6).toFixed(2)}`}
              </p>
            </div>
          </div>
        </div>

        <p className="text-paper-muted text-sm mt-6 max-w-2xl text-pretty">
          Count Dojo teaches this from the first lesson, then accelerates it — through speed flashes,
          distractions, and the deck countdown drill. Legend tier is a full deck in under twenty
          seconds.
        </p>
      </div>
    </section>
  );
}

function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  // Playback starts here rather than via `autoPlay` so that reduced-motion
  // users never fetch the film at all. Markup is byte-identical on server and
  // client — swapping the element on a hook value would mount the video and
  // start the download before the swap resolved.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    v.preload = "auto";
    v.play().then(() => setPlaying(true)).catch(() => {});
  }, []);

  const toggleFilm = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.preload = "auto";
      v.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <section className="relative overflow-hidden hero-media border-b border-rule">
      <video
        ref={videoRef}
        className="hero-video absolute inset-0 w-full h-full object-cover"
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        poster="/images/hero-poster.jpg"
      >
        <source src="/videos/blackjack-hero.mp4" type="video/mp4" />
      </video>
      <div className="relative z-10 site-shell pt-32 pb-24 md:pt-40 md:pb-32 min-h-[88svh] flex items-end">
        <div className="grid md:grid-cols-[1.5fr_1fr] gap-16 w-full items-end">
          <div className="hero-stagger max-w-2xl">
            <ChapterMark roman="I" title="An education in advantage play" />
            <h1 className="font-display text-display-xl text-paper text-balance mt-6">
              A serious craft.
              <br />
              <span className="italic">
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
              {["Free to start", "No math skill required", "Works offline"].join(DOT)}
              <span aria-hidden="true">{DOT}</span>
              <button
                type="button"
                onClick={toggleFilm}
                className="link-mono align-baseline underline decoration-dotted underline-offset-4 py-3 -my-3"
              >
                {playing ? "Pause film" : "Play film"}
              </button>
            </p>
          </div>
          <HeroCardFan />
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
              <span className="text-stat text-5xl md:text-6xl tabular-nums text-paper">
                {s.number}
              </span>
              <span className="text-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ThorpEpigraph() {
  return (
    <section className="border-b border-rule bg-ink-0">
      <div className="site-shell py-20 md:py-28">
        <div className="max-w-4xl">
          <p className="text-chapter mb-6">Epigraph</p>
          <blockquote
            className="font-display text-display-md text-paper text-pretty leading-[1.05]"
          >
            &ldquo;Blackjack can be beaten. Not with luck or hunches or betting systems.{" "}
            <span className="italic">
              With mathematics.
            </span>
            &rdquo;
          </blockquote>
          <figcaption className="mt-8 font-mono text-[0.72rem] tracking-[0.22em] uppercase text-paper-faint">
            after Edward O. Thorp · Beat the Dealer · 1962
          </figcaption>
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
        <div className="grid md:grid-cols-[1fr_2.1fr] gap-10 md:gap-16 mb-16">
          <div>
            <ChapterMark roman="II" title="The Path" className="mb-5" />
            <h2 className="font-display text-display-lg text-paper text-balance">
              Six units,
              <br />
              charted from zero.
            </h2>
          </div>
          <p className="text-lg text-paper-muted self-end max-w-xl text-pretty">
            A structured curriculum from card values to advanced advantage play. Placement tests
            let experienced players skip directly to the unit that suits them — with every lesson
            grounded in math, not hype.
          </p>
        </div>
        <div className="editorial-list">
          {curriculum.map((unit, i) => (
            <Reveal key={unit.numeral} delay={i * 50}>
              <div className="editorial-row items-start">
                <span className="chapter-mark w-12 self-start mt-1">{unit.numeral}</span>
                <div className="min-w-0">
                  <h3
                    className="font-display title-md text-paper mb-2"
                  >
                    {unit.title}
                  </h3>
                  <p className="text-paper-muted max-w-2xl text-pretty mb-4">{unit.synopsis}</p>
                  <ul className="flex flex-wrap gap-x-6 gap-y-1.5 font-mono text-[0.72rem] tracking-[0.12em] text-paper-faint">
                    {unit.samples.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div className="text-right flex flex-col items-end gap-2 whitespace-nowrap mt-1">
                  <span className="text-label tabular-nums">
                    {unit.lessons} lessons
                    {unit.sideBranches ? ` · ${unit.sideBranches} SB` : ""}
                  </span>
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
        <div className="grid md:grid-cols-[1fr_2.1fr] gap-10 md:gap-16 mb-16">
          <div>
            <ChapterMark roman="III" title="The Repetition" className="mb-5" />
            <h2 className="font-display text-display-lg text-paper text-balance">
              Nineteen drills. Adaptive. Graded.
            </h2>
          </div>
          <p className="text-lg text-paper-muted self-end max-w-xl text-pretty">
            Every drill scores against accuracy and speed gates. Bronze, silver, gold, legend. A
            personalized-practice engine reads your history and builds weak-scenario review
            sessions using spaced repetition.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-x-10 md:gap-x-14 gap-y-12 md:gap-y-16">
          {drillCategories.map((cat, i) => (
            <Reveal key={cat.label} delay={i * 70}>
              <div>
                <p className="text-label mb-5 flex items-center gap-3">
                  <span className="font-mono text-paper-faint tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {cat.label}
                </p>
                <ul className="flex flex-col">
                  {cat.drills.map((d) => (
                    <li
                      key={d.name}
                      className="border-t border-rule py-3 first:border-t-0 first:pt-0"
                    >
                      <p
                        className="font-display text-xl md:text-2xl text-paper"
                      >
                        {d.name}
                      </p>
                      {d.note && (
                        <p className="font-mono text-[0.7rem] tracking-[0.16em] uppercase text-emerald-accent mt-1.5">
                          {d.note}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-20 pt-10 border-t border-rule grid md:grid-cols-[auto_1fr] gap-8 md:gap-12 items-center">
          <p className="text-label">Medal thresholds</p>
          <div className="flex flex-wrap gap-x-10 gap-y-3 font-mono text-sm tabular-nums text-paper">
            <span>
              <span className="text-paper-faint">Bronze</span>  70%
            </span>
            <span>
              <span className="text-paper-faint">Silver</span>  80%
            </span>
            <span>
              <span className="text-paper-faint">Gold</span>  90%
            </span>
            <span className="text-emerald-accent">
              <span className="text-paper-faint">Legend</span>  98%
            </span>
            <span className="text-paper-muted ml-auto">
              Timed drills require perfect accuracy under time.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function CountingSystemsSection() {
  return (
    <section id="systems" className="section-rhythm">
      <div className="site-shell">
        <div className="grid md:grid-cols-[1fr_2.1fr] gap-10 md:gap-16 mb-16">
          <div>
            <ChapterMark roman="IV" title="The Languages" className="mb-5" />
            <h2 className="font-display text-display-lg text-paper text-balance">
              Seven systems.
              <br />
              Fluent in one, literate in six.
            </h2>
          </div>
          <p className="text-lg text-paper-muted self-end max-w-xl text-pretty">
            Hi-Lo is the gold standard and our default. Side branches cover six alternatives —
            for history, curiosity, and the players who benefit from specialized systems.
          </p>
        </div>
        <div className="editorial-list">
          {countingSystems.map((s, i) => (
            <Reveal key={s.name} delay={i * 35}>
              <div className="editorial-row editorial-row--stack items-start">
                <div className="flex flex-col gap-1">
                  <span className="text-label">{s.rank}</span>
                  <span className="font-mono text-[0.62rem] tracking-[0.2em] uppercase text-paper-faint">
                    {s.level}
                  </span>
                </div>
                <div className="min-w-0">
                  <h3
                    className="font-display title-md text-paper mb-2"
                  >
                    {s.name}
                  </h3>
                  <p className="text-paper-muted mb-3 max-w-2xl text-pretty">{s.note}</p>
                  <p className="font-mono text-xs md:text-sm text-paper-faint tabular-nums tracking-wider">
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

type EdgePoint = { tc: number; edge: number };

const edgeCurve: EdgePoint[] = [
  { tc: -5, edge: -3.0 },
  { tc: -4, edge: -2.5 },
  { tc: -3, edge: -2.0 },
  { tc: -2, edge: -1.5 },
  { tc: -1, edge: -1.0 },
  { tc: 0, edge: -0.55 },
  { tc: 1, edge: -0.05 },
  { tc: 2, edge: 0.45 },
  { tc: 3, edge: 0.95 },
  { tc: 4, edge: 1.4 },
  { tc: 5, edge: 1.9 },
  { tc: 6, edge: 2.4 },
  { tc: 7, edge: 2.95 },
  { tc: 8, edge: 3.5 },
];

function EdgeChart() {
  const reduced = useReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<EdgePoint | null>(null);
  const [tooltipXY, setTooltipXY] = useState<{ x: number; y: number } | null>(null);

  const W = 640;
  const H = 340;
  const P = { top: 28, right: 28, bottom: 48, left: 56 };
  const xD: [number, number] = [-5, 8];
  const yD: [number, number] = [-3.5, 3.5];

  const xScale = (tc: number) =>
    P.left + ((tc - xD[0]) / (xD[1] - xD[0])) * (W - P.left - P.right);
  const yScale = (edge: number) =>
    P.top + (1 - (edge - yD[0]) / (yD[1] - yD[0])) * (H - P.top - P.bottom);

  const zeroCrossTc = 1.1;
  const zeroY = yScale(0);

  const negPoints = [...edgeCurve.filter((p) => p.edge < 0), { tc: zeroCrossTc, edge: 0 }];
  const posPoints = [{ tc: zeroCrossTc, edge: 0 }, ...edgeCurve.filter((p) => p.edge >= 0)];

  const buildPath = (pts: EdgePoint[]) =>
    pts
      .map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(p.tc).toFixed(1)} ${yScale(p.edge).toFixed(1)}`)
      .join(" ");

  const negPath = buildPath(negPoints);
  const posPath = buildPath(posPoints);

  const negArea = `${negPath} L ${xScale(edgeCurve[0].tc).toFixed(1)} ${zeroY.toFixed(1)} Z`;
  const posArea = `${posPath} L ${xScale(edgeCurve[edgeCurve.length - 1].tc).toFixed(1)} ${zeroY.toFixed(1)} Z`;

  const visibleMarkers: EdgePoint[] = edgeCurve.filter((p) =>
    [-5, -3, -1, 1, 3, 5, 8].includes(p.tc),
  );

  const handleMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || !wrapRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const wrapRect = wrapRef.current.getBoundingClientRect();
    const scaleX = rect.width / W;
    const scaleY = rect.height / H;
    const x = (e.clientX - rect.left) / scaleX;
    const tcApprox = xD[0] + ((x - P.left) / (W - P.left - P.right)) * (xD[1] - xD[0]);
    const nearest = edgeCurve.reduce((best, p) =>
      Math.abs(p.tc - tcApprox) < Math.abs(best.tc - tcApprox) ? p : best,
    );
    setHovered(nearest);
    setTooltipXY({
      x: xScale(nearest.tc) * scaleX + (rect.left - wrapRect.left),
      y: yScale(nearest.edge) * scaleY + (rect.top - wrapRect.top),
    });
  };

  return (
    <div ref={wrapRef} className="edge-chart edge-chart-wrap">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        onMouseMove={handleMove}
        onMouseLeave={() => {
          setHovered(null);
          setTooltipXY(null);
        }}
        role="img"
        aria-label="Player edge by true count — player edge grows roughly linearly with true count, crossing zero near TC +1"
      >
        <defs>
          <linearGradient id="edge-fill-pos" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="edge-fill-neg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.16" />
          </linearGradient>
        </defs>

        {[-3, -2, -1, 1, 2, 3].map((y) => (
          <g key={`grid-${y}`}>
            <line
              x1={P.left}
              x2={W - P.right}
              y1={yScale(y)}
              y2={yScale(y)}
              className="edge-chart__grid"
            />
            <text
              x={P.left - 10}
              y={yScale(y) + 4}
              textAnchor="end"
              className="edge-chart__tick-label"
            >
              {y > 0 ? `+${y}%` : `${y}%`}
            </text>
          </g>
        ))}

        <line
          x1={P.left}
          x2={W - P.right}
          y1={zeroY}
          y2={zeroY}
          className="edge-chart__axis"
          strokeWidth={1.2}
        />
        <text
          x={P.left - 10}
          y={zeroY + 4}
          textAnchor="end"
          className="edge-chart__tick-label"
          style={{ fill: "var(--paper-muted)" }}
        >
          0%
        </text>

        {[-5, -3, 0, 3, 5, 8].map((x) => (
          <g key={`xt-${x}`}>
            <line
              x1={xScale(x)}
              x2={xScale(x)}
              y1={H - P.bottom}
              y2={H - P.bottom + 6}
              className="edge-chart__axis"
            />
            <text
              x={xScale(x)}
              y={H - P.bottom + 22}
              textAnchor="middle"
              className="edge-chart__tick-label"
            >
              {x > 0 ? `TC +${x}` : `TC ${x}`}
            </text>
          </g>
        ))}

        <path d={negArea} fill="url(#edge-fill-neg)" />
        <path d={posArea} fill="url(#edge-fill-pos)" />

        <motion.path
          d={negPath}
          fill="none"
          stroke="#f59e0b"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduced ? undefined : { pathLength: 0 }}
          whileInView={reduced ? undefined : { pathLength: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
        <motion.path
          d={posPath}
          fill="none"
          stroke="#34d399"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduced ? undefined : { pathLength: 0 }}
          whileInView={reduced ? undefined : { pathLength: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.1, ease: "easeOut", delay: 0.55 }}
        />

        {visibleMarkers.map((p) => {
          const isHovered = hovered?.tc === p.tc;
          return (
            <motion.circle
              key={`m-${p.tc}`}
              cx={xScale(p.tc)}
              cy={yScale(p.edge)}
              r={isHovered ? 6 : 3.5}
              fill={p.edge >= 0 ? "#34d399" : "#f59e0b"}
              stroke="var(--ink-1)"
              strokeWidth={2}
              initial={reduced ? undefined : { scale: 0, opacity: 0 }}
              whileInView={reduced ? undefined : { scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.3,
                delay: (reduced ? 0 : 1.4) + (p.tc + 5) * 0.04,
                ease: "easeOut",
              }}
              style={{ transition: "r 200ms ease" }}
            />
          );
        })}

        {hovered && (
          <line
            x1={xScale(hovered.tc)}
            x2={xScale(hovered.tc)}
            y1={P.top}
            y2={H - P.bottom}
            stroke="var(--paper-faint)"
            strokeDasharray="3 4"
            strokeWidth={1}
          />
        )}
      </svg>

      {hovered && tooltipXY && (
        <div
          className="edge-chart__tooltip"
          style={{ left: `${tooltipXY.x}px`, top: `${tooltipXY.y - 12}px` }}
        >
          <div className="edge-chart__tooltip-tc">
            TC {hovered.tc > 0 ? `+${hovered.tc}` : hovered.tc}
          </div>
          <div
            className="edge-chart__tooltip-edge"
            style={{
              color: hovered.edge >= 0 ? "var(--emerald)" : "var(--amber)",
            }}
          >
            {hovered.edge > 0 ? "+" : ""}
            {hovered.edge.toFixed(2)}%
          </div>
        </div>
      )}
    </div>
  );
}

function MathSection() {
  return (
    <section className="section-rhythm bg-ink-1 border-y border-rule">
      <div className="site-shell">
        <div className="grid md:grid-cols-[1fr_2.1fr] gap-10 md:gap-16 mb-16">
          <div>
            <ChapterMark roman="V" title="The Math" className="mb-5" />
            <h2 className="font-display text-display-lg text-paper text-balance">
              Where the edge actually lives.
            </h2>
          </div>
          <p className="text-lg text-paper-muted self-end max-w-xl text-pretty">
            Running count measures what has left the shoe. True count scales it by what remains.
            Each TC point shifts your edge by roughly half a percent. That is the entire
            thesis — quantified.
          </p>
        </div>

        <div className="grid md:grid-cols-[1.05fr_1fr] gap-10 md:gap-16 items-stretch">
          <div className="formula-card flex flex-col justify-between">
            <div>
              <p className="text-label mb-6">True count formula</p>
              <div className="flex items-baseline gap-4 md:gap-6 flex-wrap">
                <span className="formula-glyph text-paper">TC</span>
                <span className="formula-glyph text-paper-faint">=</span>
                <div>
                  <div className="text-center font-display text-xl md:text-2xl text-paper pb-1 border-b border-rule-strong px-2">
                    Running Count
                  </div>
                  <div className="text-center font-display text-xl md:text-2xl text-paper pt-1 px-2">
                    Decks Remaining
                  </div>
                </div>
              </div>
              <p className="text-paper-muted text-pretty mt-10 max-w-md">
                Running count of +10 with five decks left behind the cut card is a true count of
                +2. That +2 is a bet-sizing and deviation signal — one the casino cannot see.
              </p>
            </div>
            <p className="font-mono text-[0.68rem] tracking-[0.22em] uppercase text-paper-faint mt-10">
              Truncate toward zero. No rounding up.
            </p>
          </div>

          <div className="border border-rule-strong rounded-md bg-ink-0 p-6 md:p-8">
            <div className="flex items-baseline justify-between mb-6">
              <p className="text-label">Edge by true count</p>
              <p className="font-mono text-[0.62rem] tracking-[0.2em] uppercase text-paper-faint">
                6 deck · S17 · DAS
              </p>
            </div>
            <EdgeChart />
            <p className="text-paper-muted text-sm mt-6 text-pretty">
              Below zero, the house owns the table. Above zero, you do. The crossover sits
              just above TC +1 — bet-sizing territory begins there.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function SimulatorSection() {
  return (
    <section id="simulator" className="section-rhythm">
      <div className="site-shell">
        <div className="grid md:grid-cols-[1.1fr_1fr] gap-16 items-center">
          <div>
            <ChapterMark roman="VI" title="The Dojo Floor" className="mb-5" />
            <h2 className="font-display text-display-lg text-paper text-balance mb-8">
              A casino, calibrated.
            </h2>
            <p className="text-lg text-paper-muted mb-10 max-w-xl text-pretty">
              The simulator models the rules that matter: dealer stand, double after split, shoe
              size, penetration, distractions, surveillance. Your bet sizing, true-count reads,
              and play decisions are graded in real time.
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

        <div className="mt-20 pt-10 border-t border-rule">
          <div className="flex items-baseline justify-between mb-6">
            <p className="text-label">Built-in presets</p>
            <p className="font-mono text-[0.62rem] tracking-[0.2em] uppercase text-paper-faint">
              Or build your own
            </p>
          </div>
          <div className="preset-grid">
            {casinoPresets.map((p) => (
              <div key={p.name} className="preset-cell">
                <p
                  className="font-display text-lg md:text-xl text-paper"
                >
                  {p.name}
                </p>
                <p className="font-mono text-[0.68rem] tracking-[0.14em] uppercase text-paper-muted tabular-nums">
                  {p.decks}
                </p>
                <p className="font-mono text-[0.72rem] tracking-[0.08em] text-paper-faint">
                  {p.rules.join(DOT)}
                </p>
                <p className="font-mono text-[0.68rem] tracking-[0.14em] uppercase text-paper-faint tabular-nums mt-auto">
                  {p.pen}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BeltsSection() {
  return (
    <section className="section-rhythm bg-ink-1 border-y border-rule">
      <div className="site-shell">
        <div className="grid md:grid-cols-[1fr_2.1fr] gap-10 md:gap-16 mb-16">
          <div>
            <ChapterMark roman="VII" title="The Journey" className="mb-5" />
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
                <p className="text-label mb-2 tabular-nums">{b.range}</p>
                <h3
                  className="font-display title-md text-paper"
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

function ReferenceSection() {
  return (
    <section className="section-rhythm">
      <div className="site-shell">
        <div className="grid md:grid-cols-[1fr_2.1fr] gap-10 md:gap-16 mb-16">
          <div>
            <ChapterMark roman="VIII" title="The Reference Library" className="mb-5" />
            <h2 className="font-display text-display-lg text-paper text-balance">
              Ten tools.
              <br />
              Always one tap away.
            </h2>
          </div>
          <p className="text-lg text-paper-muted self-end max-w-xl text-pretty">
            The drills build the reflex. The reference library keeps the math honest. Everything
            is live, rule-aware, and works offline.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-x-14 md:gap-x-20">
          {referenceTools.map((t, i) => (
            <div
              key={t.label}
              className="py-5 border-t border-rule flex gap-6 items-start"
            >
              <span className="font-mono text-[0.7rem] tracking-[0.22em] text-paper-faint tabular-nums w-8 pt-1">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <h3
                  className="font-display title-sm text-paper mb-1"
                >
                  {t.label}
                </h3>
                <p className="text-paper-muted text-sm md:text-base text-pretty">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BadgesSection() {
  return (
    <section className="section-rhythm bg-ink-1 border-y border-rule">
      <div className="site-shell">
        <div className="grid md:grid-cols-[1fr_2.1fr] gap-10 md:gap-16 mb-16">
          <div>
            <ChapterMark roman="IX" title="The Badges" className="mb-5" />
            <h2 className="font-display text-display-lg text-paper text-balance">
              Sixty-five ways
              <br />
              to be caught trying.
            </h2>
          </div>
          <p className="text-lg text-paper-muted self-end max-w-xl text-pretty">
            Some are earned by finishing units, some by hitting speed gates, a few by showing up at
            strange hours. Centurion is the hundred-day streak. Inhuman Speed is a full deck
            counted down in under twenty seconds.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-px bg-rule border border-rule">
          {achievementCategories.map((cat) => (
            <div
              key={cat.label}
              className="bg-ink-0 p-8 md:p-10 flex flex-col gap-5"
            >
              <div className="flex items-baseline justify-between">
                <h3
                  className="font-display title-sm text-paper"
                >
                  {cat.label}
                </h3>
                <span className="text-stat text-2xl md:text-3xl tabular-nums text-emerald-accent">
                  {cat.count}
                </span>
              </div>
              <ul className="flex flex-col gap-2">
                {cat.examples.map((ex) => (
                  <li
                    key={ex}
                    className="font-mono text-[0.74rem] tracking-[0.08em] text-paper-muted"
                  >
                    — {ex}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ComparisonSection() {
  return (
    <section className="section-rhythm">
      <div className="site-shell">
        <div className="grid md:grid-cols-[1fr_2.1fr] gap-10 md:gap-16 mb-16">
          <div>
            <ChapterMark roman="X" title="vs The Usual Path" className="mb-5" />
            <h2 className="font-display text-display-lg text-paper text-balance">
              A short, honest comparison.
            </h2>
          </div>
          <p className="text-lg text-paper-muted self-end max-w-xl text-pretty">
            Count Dojo is not the only way to learn. It is the only way that treats the stack —
            curriculum, drills, simulator, and reference — as one thing.
          </p>
        </div>
        <div className="editorial-list">
          {comparisons.map((row, i) => (
            <div
              key={row.approach}
              className={`editorial-row items-start ${row.emphasis ? "border-rule-strong" : ""}`}
            >
              <span className="font-mono text-[0.72rem] tracking-[0.2em] text-paper-faint tabular-nums w-10 mt-1">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <h3
                  className={`font-display title-md mb-2 ${
                    row.emphasis ? "text-emerald-accent" : "text-paper"
                  }`}
                >
                  {row.approach}
                </h3>
                <p
                  className={`${row.emphasis ? "text-paper" : "text-paper-muted"} max-w-2xl text-pretty`}
                >
                  {row.gaps}
                </p>
              </div>
              <span className="hidden md:inline-block" aria-hidden />
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
        <div className="grid md:grid-cols-[1fr_2.1fr] gap-10 md:gap-16 mb-16">
          <div>
            <ChapterMark roman="XI" title="Tuition" className="mb-5" />
            <h2 className="font-display text-display-lg text-paper text-balance">
              Free where it should be.
              <br />
              Paid where it should be.
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
              >
                {pricingFree.label}
              </h3>
              <span className="text-label text-emerald-accent">Forever</span>
            </div>
            <p className="text-paper-muted mb-8 text-pretty">{pricingFree.headline}</p>
            <ul className="space-y-3 mb-10 flex-1">
              {pricingFree.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm md:text-base text-paper"
                >
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
              >
                {pricingPremium.label}
              </h3>
            </div>
            <p className="text-paper-muted mb-2 text-pretty">{pricingPremium.headline}</p>
            <p className="font-mono text-[0.65rem] tracking-[0.22em] uppercase text-paper-faint mb-8">
              {pricingPremium.plans.join(DOT)}
            </p>
            <ul className="space-y-3 mb-10 flex-1">
              {pricingPremium.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm md:text-base text-paper"
                >
                  <span className="font-mono text-emerald-accent mt-1 shrink-0">—</span>
                  <span className="text-pretty">{item}</span>
                </li>
              ))}
            </ul>
            <StoreButtons primary />
            <p className="font-mono text-[0.66rem] tracking-[0.18em] uppercase text-paper-faint mt-5">
              Subscriptions via App Store or Google Play. Cancel anytime.
            </p>
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
        <div className="grid md:grid-cols-[1fr_2.1fr] gap-10 md:gap-16 mb-16">
          <div>
            <ChapterMark roman="XII" title="Surfaces" className="mb-5" />
            <h2 className="font-display text-display-lg text-paper text-balance">
              See where the reps happen.
            </h2>
          </div>
          <p className="text-lg text-paper-muted self-end max-w-xl text-pretty">
            Skill tree, drills, references, the casino floor, stats. The app, uncropped.
          </p>
        </div>
        <div className="grid md:grid-cols-[1fr_auto_1fr] items-center gap-6 md:gap-12">
          <div className="hidden md:flex flex-col gap-4 items-end text-right">
            <span className="text-label">{current.alt}</span>
            <span className="font-mono text-xs text-paper-faint tabular-nums">
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
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden
              >
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next screenshot"
              className="h-11 w-11 rounded-full border border-rule-strong flex items-center justify-center text-paper hover:border-paper hover:text-emerald-accent transition-colors"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden
              >
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <span className="md:hidden text-label">
              {current.alt}{DOT}{String(index + 1).padStart(2, "0")} / {String(screenshots.length).padStart(2, "0")}
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
        <ChapterMark roman="XIII" title="Voices" className="mb-10" />
        <div className="grid md:grid-cols-2 gap-x-14 md:gap-x-20 gap-y-14 md:gap-y-16">
          {testimonials.map((t, i) => (
            <Reveal key={t.author} delay={i * 80}>
              <figure className="border-t border-rule pt-8">
                <blockquote
                  className="font-display text-2xl md:text-[1.75rem] text-paper leading-[1.2] text-pretty"
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
        <span className="font-mono text-[0.7rem] tracking-[0.22em] uppercase text-paper-faint w-10 shrink-0 tabular-nums">
          {number}
        </span>
        <span
          className="font-display text-xl md:text-2xl text-paper flex-1"
        >
          {item.q}
        </span>
        <span className="faq-toggle-icon text-paper-muted">
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16M4 12h16" />
          </svg>
        </span>
      </button>
      <div className="faq-body" data-open={open}>
        <div>
          <p className="text-paper-muted text-pretty pl-14 pr-10 pt-4 pb-6 max-w-3xl">
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
          <ChapterMark roman="XIV" title="Questions" className="mb-5" />
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
    <section className="section-rhythm bg-ink-1 border-y border-rule">
      <div className="site-shell">
        <div className="py-16 md:py-24 text-center">
          <ChapterMark roman="XV" title="Take the first rep" centered className="mb-6" />
          <h2 className="font-display text-display-xl text-paper text-balance max-w-4xl mx-auto">
            The edge is legal.
            <br />
            The math is simple.
            <br />
            <span className="italic">
              The work is yours.
            </span>
          </h2>
          <div className="flex justify-center mt-10 md:mt-12">
            <StoreButtons primary />
          </div>
          <p className="text-label mt-8">
            {["Free to start", "No credit card", "Offline-first"].join(DOT)}
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
        <CinematicSequence />
        <LiveCountDemoSection />
        <ProofStrip />
        <ThorpEpigraph />
        <CurriculumSection />
        <DrillsSection />
        <CountingSystemsSection />
        <MathSection />
        <SimulatorSection />
        <BeltsSection />
        <ReferenceSection />
        <BadgesSection />
        <ComparisonSection />
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
