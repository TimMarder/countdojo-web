import type { Metadata } from "next";
import { VsPage, type VsContent } from "../../_components/VsPage";

export const metadata: Metadata = {
  title: "Count Dojo vs Blackjack Theory — an honest comparison",
  description:
    "Blackjack Theory is an announced iPhone app for basic strategy and Hi-Lo drills. Count Dojo is a six-unit card-counting course with 21 drill types, a real-shoe simulator, and bankroll tools. Where each one is better.",
  alternates: { canonical: "/vs/blackjack-theory" },
};

// Competitor facts verified on blackjacktheory.app, 2026-11-15. At that date
// the app was announced but not in either store — re-check its status and
// pricing before editing, and drop the status note once it ships.
const content: VsContent = {
  competitor: "Blackjack Theory",
  intro:
    "Blackjack Theory is a focused iPhone trainer for basic strategy and Hi-Lo: drill every decision until it is automatic, watch a skill rating climb. Count Dojo covers that ground and keeps going — true count and bet sizing, deviations beyond the Illustrious 18, casino readiness, and the tools you use to plan a real session.",
  status:
    "As of 15 November 2026, Blackjack Theory is listed as coming soon on iPhone and is not yet in the App Store or Google Play. This comparison uses its announced features.",
  whoThem:
    "Players who want basic strategy and Hi-Lo drilled to automatic in a minimal app, with a clear skill rating and nothing collected about them.",
  whoUs:
    "Players who want the whole path in one app — from card values through deviations, bet sizing, and casino readiness — with a simulator built to the rules of the table they will actually sit at.",
  rows: [
    {
      label: "Availability",
      us: "iPhone and Android, available now",
      them: "iPhone, announced (coming soon)",
    },
    {
      label: "Price",
      us: "Free to start. Premium $9.99/month, $59.99/year, or $119.99 once",
      them: "Free to start. Pro $7.99/month or $39.99/year, 7-day trial, or $99.99 once",
    },
    {
      label: "Free option",
      us: "All of Unit I; every other unit paced by hearts; seven drills",
      them: "Strategy charts, 20 drill hands a day, counting lessons 1–2",
    },
    {
      label: "Counting course",
      us: "89 lessons in six units, through casino readiness and advanced play",
      them: "Five short Hi-Lo lessons, card values to true-count betting",
    },
    {
      label: "Deviations",
      us: "Illustrious 18, Fab 4, and an extended list",
      them: "Illustrious 18 and Fab 4",
    },
    {
      label: "Table rules",
      us: "1–8 decks, H17 or S17, DAS, RSA, surrender, penetration, 3:2 or 6:5; six presets",
      them: "Six decks, dealer hits soft 17, DAS, 3:2; surrender optional",
    },
    {
      label: "Cover and heat",
      us: "Graded in the simulator; taught in Unit V",
      them: "Not listed on its site",
    },
    {
      label: "Tools",
      us: "Edge Calculator, Bankroll Planner, 842-casino database, Results Tracker",
      them: "Not listed on its site",
    },
    {
      label: "Progress",
      us: "Medal tiers, 20 levels, 72 achievements",
      them: "Elo-style skill rating with a 20-hand Skill Test",
    },
  ],
  themBetter: [
    "Price. Pro is $39.99 a year against Count Dojo Premium's $59.99, with a seven-day free trial.",
    "Privacy. No account, no ads, no analytics: progress stays on the phone. If collecting nothing matters most to you, its stated policy is stricter than ours.",
    "The skill rating. A single Elo-style number, updated every ten hands, is a clean way to see whether you are improving.",
    "Explanations. A plain-English reason for every basic strategy play.",
  ],
  usDifferent: [
    "It is available today, on both iPhone and Android.",
    "Depth. Eighty-nine lessons against five, including true-count betting, bankroll and risk of ruin, deviations past the Fab 4, and how to play without getting backed off.",
    "Configurable rules. Practice the game you will actually face — two-deck H17, eight-deck 6:5 — not one fixed table.",
    "The planning tools: look up a casino, load its rules into the simulator, and size your bankroll before the trip.",
  ],
  closing:
    "If all you want is basic strategy and Hi-Lo drilled hard, with no account and a lower price, Blackjack Theory is worth watching for. If you want the full path from first lesson to casino floor — and the tools to plan a real session — Count Dojo has it today, and the first unit is free.",
  sources: [
    { label: "blackjacktheory.app", href: "https://blackjacktheory.app/" },
    { label: "pricing", href: "https://blackjacktheory.app/#pricing" },
    { label: "privacy policy", href: "https://blackjacktheory.app/privacy" },
  ],
  checked: "15 November 2026",
};

export default function VsBlackjackTheory() {
  return <VsPage c={content} />;
}
