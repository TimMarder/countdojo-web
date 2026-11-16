import type { Metadata } from "next";
import { VsPage, type VsContent } from "../../_components/VsPage";

export const metadata: Metadata = {
  title: "Count Dojo vs Blackjack Apprenticeship — an honest comparison",
  description:
    "Blackjack Apprenticeship is a $297+ yearly web membership with videos, community, and bootcamps. Count Dojo is a phone app with a graded 89-lesson course and a real-shoe simulator, free to start. Where each one is better.",
  alternates: { canonical: "/vs/blackjack-apprenticeship" },
};

// Competitor facts verified on the sources below, 2026-11-15. Re-check before
// changing any figure — membership prices differ between BJA's pricing page
// and its store, so this page quotes the pricing page and checkout.
const content: VsContent = {
  competitor: "Blackjack Apprenticeship",
  intro:
    "Blackjack Apprenticeship is the best-known name in card counting: a yearly web membership built around Colin Jones's video course, a community of working players, betting software, and in-person bootcamps. Count Dojo is a phone app that teaches the same skill as a graded course — every lesson quizzed, every drill scored, a simulator that deals from a real shoe. They suit different players, and plenty will use both.",
  whoThem:
    "Players who want to make counting a serious money project and want video instruction from a Blackjack Hall of Fame inductee, a forum of experienced counters, and the option of in-person training in Las Vegas.",
  whoUs:
    "Players who want to learn from zero on their phone, at their own pace, with every step graded — and find out whether counting is for them before spending hundreds of dollars on it.",
  rows: [
    {
      label: "Format",
      us: "iPhone and Android app",
      them: "Web membership, plus separate mobile trainer apps",
    },
    {
      label: "Price",
      us: "Free to start. Premium $9.99/month, $59.99/year, or $119.99 once",
      them: "$297, $497, or $897 for the first year, then $299/year",
    },
    {
      label: "Free option",
      us: "All of Unit I; every other unit paced by hearts; seven drills",
      them: "An email mini-course and free basic strategy and running-count drills",
    },
    {
      label: "Refunds",
      us: "Through Apple or Google",
      them: "14-day money-back guarantee for first-time members",
    },
    {
      label: "Teaching",
      us: "89 lessons in six units, each with a quiz",
      them: "Video course (70+ videos)",
    },
    {
      label: "Counting system",
      us: "Hi-Lo, with seven alternatives compared in one lesson",
      them: "Hi-Lo",
    },
    {
      label: "Drills",
      us: "21 drill types with medal thresholds",
      them: "Training Suite: counting, deviations, true count, betting",
    },
    {
      label: "Simulator",
      us: "Real-shoe casino simulator with heat, distractions, and graded cover play",
      them: "Bet-spread and risk software that simulates game conditions",
    },
    {
      label: "Casino data",
      us: "842-casino database with player intel (Premium or Pro Tools)",
      them: "Casino411, member-submitted reports (Apprentice and Elite tiers)",
    },
    {
      label: "Community",
      us: "None",
      them: "Members' forum and chatroom",
    },
    {
      label: "Live coaching",
      us: "None",
      them: "Vegas bootcamp, private training, phone consults (Elite)",
    },
  ],
  themBetter: [
    "Community. An active forum and chatroom of experienced counters. Count Dojo has no forum.",
    "The teacher. Colin Jones is a Blackjack Hall of Fame inductee who ran team play professionally.",
    "In-person training. A two-day Las Vegas bootcamp and private sessions, if you want a human to watch you count.",
    "The guarantee. Fourteen days, no questions asked, for first-time members. Count Dojo refunds go through Apple or Google.",
    "Track record. Its iOS trainer has over ten thousand App Store ratings. Count Dojo is new.",
  ],
  usDifferent: [
    "A course, not a video library: eighty-nine lessons in order, from card values to casino readiness, each one checked with a quiz before you move on.",
    "Free to start, and the whole curriculum is open on the free plan — paced by hearts, not paywalled.",
    "A casino simulator on your phone that deals from a real shuffled shoe and grades your spread, your heat, and your cover — not only your count.",
    "Price. A year of Premium costs $59.99, about a fifth of the cheapest first-year membership.",
  ],
  closing:
    "If you want a community and a famous teacher, and you are ready to spend a few hundred dollars, Blackjack Apprenticeship is the established choice. If you want a structured, graded course in your pocket — or want to find out whether counting suits you before committing — start with Count Dojo's free tier. The skills transfer either way: it is Hi-Lo on both sides.",
  sources: [
    { label: "pricing page", href: "https://www.blackjackapprenticeship.com/plans-and-pricing/" },
    { label: "features", href: "https://www.blackjackapprenticeship.com/features/" },
    { label: "FAQ", href: "https://www.blackjackapprenticeship.com/frequently-asked-questions/" },
    { label: "terms of use", href: "https://www.blackjackapprenticeship.com/terms-of-use/" },
    {
      label: "App Store listing",
      href: "https://apps.apple.com/us/app/blackjack-card-counting-pro/id388857410",
    },
  ],
  checked: "15 November 2026",
};

export default function VsBlackjackApprenticeship() {
  return <VsPage c={content} />;
}
