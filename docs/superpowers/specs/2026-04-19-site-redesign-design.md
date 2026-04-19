# Count Dojo — Editorial Dojo Redesign

Date: 2026-04-19
Branch: `feature/site-redesign`
Supersedes visual direction of current homepage.

## Why this redesign

The current site reads as "2024 SaaS template" — glassmorphism on every card, animated
gradient headline, floating card-suit particles, magnetic buttons, scroll-reveal on every
block, a marquee ticker with unverified claims, a 1.5s page-loader curtain. The execution
is clean but the decisions are paint-by-numbers. It does not reflect what the product
actually is: a serious education platform for a specialized craft.

The app's own voice is confident, anti-hype, and dojo-metaphorical ("Blue Belt →
Card Disciple → Advantage Player → Dojo Legend"; "this isn't gambling, it is a skill").
The site should match that voice, not fight it.

## Aesthetic direction

**Editorial Dojo** — a trade-publication-meets-modern-dojo aesthetic. Confident
typography-forward design. Refined minimalism with intentional bursts of density
(ranked lists, taxonomies, tables). Numbered sections (roman numerals) treated as
chapter marks. Disciplined grid, generous whitespace, left-aligned type.

**What we keep**
- Dark background with emerald accent (user requirement)
- Store buttons from `feature/google-play-link`
- Core content (features, testimonials, FAQ, privacy/terms/delete-account)
- Screenshots, hero video, logo assets

**What we remove**
- Glassmorphism (all `.glass-card` styling)
- Floating card suit particles
- Magnetic buttons (regular anchors/buttons instead)
- Animated-gradient headline
- Page loader curtain (1.5s upfront friction)
- Marquee ticker with generic "100+ Downloads" / "#1 Card Counting App"
- Bento feature grid with arbitrary spans
- `.nav-link:hover` tilt + glow
- Universal scroll-reveal on every block

## Color system

```
--ink-0: #0a0a0b   /* canvas */
--ink-1: #111113   /* raised */
--ink-2: #18181b   /* elevated */
--paper: #f5f1e8   /* warm cream, body text */
--paper-muted: #a8a29e
--paper-faint: #57534e
--rule: #27272a    /* hairlines */
--emerald: #34d399 /* sole accent, sparse use */
--amber:  #f59e0b  /* warning/heat only */
```

Emerald is the single accent — used on: chapter numerals, status dots, one CTA,
interactive highlights. Not on every section heading. Not on gradient backdrops.

## Typography

- **Display**: Fraunces (variable, optical-size + SOFT axes). Used for H1/H2 and pull quotes.
- **Body**: Inter Tight. Paragraphs and UI labels.
- **Mono**: JetBrains Mono. Technical labels, numerals, card values, drill names,
  footnotes.

All loaded via `next/font/google` in `layout.tsx` with CSS variables.

## Layout

- Max-width 1280px, 12-col editorial grid.
- Section rhythm: 160px vertical padding at section boundaries on desktop, 96px on mobile.
- Roman-numeral section marks (I–XII) rendered in mono, muted color.
- Default left-aligned typography (not centered).

## Page structure

| § | Title | Purpose |
|---|---|---|
| I | Hero | Confident headline + video backdrop + store buttons. |
| II | Proof strip | Real stats: 30+ lessons · 19 drill types · 6 systems · 65 achievements · 4 belts · 20 levels. |
| III | The Path (Curriculum) | 6 units, real titles, lesson counts, Free/Premium. |
| IV | The Repetition (Drills) | 19 drills, 5 categories (Strategy / Counting / True Count & Betting / Deviations / Integrated). |
| V | The Languages (Counting Systems) | Hi-Lo + 6 alternatives, card values, one-line notes. |
| VI | The Dojo Floor (Casino Simulator) | H17/S17, DAS, 1–8 decks, penetration, heat, chip UI, grading. |
| VII | The Journey (Belt Ranks) | Blue Belt / Card Disciple / Advantage Player / Dojo Legend. |
| VIII | Pricing | Free vs Premium; weekly/monthly/annual. |
| IX | Screenshots | Carousel, cleaner frame. |
| X | What Players Say | Editorial pull quotes. |
| XI | Questions (FAQ) | Numbered accordion. |
| XII | Final CTA | Confident sendoff + store buttons. |
| — | Footer | Links, socials, legal. |

## Motion

Restraint. No scroll-reveal on every block. Keep:
- One staggered hero reveal on page load (headline letters).
- Hover states: subtle color shift on links; no translate + rotate.
- Screenshot carousel slide.

## Accessibility

- Respect `prefers-reduced-motion`.
- Store buttons remain `<a target="_blank" rel="noopener noreferrer">` (preserves the
  6681b75 fix).
- Headings maintain semantic hierarchy (H1 hero → H2 sections → H3 subsections).
- Focus-visible rings in emerald.

## Content corrections (truth-in-advertising)

The redesign surfaces the real app feature set, as inventoried from
`/Users/tim/Developer/count-dojo/app/release/countdojo`:

- 6 units, 30+ lessons, 19 drill types, 65 achievements, 20 levels, 4 belt ranks
- 7 counting systems (Hi-Lo primary; KO, Hi-Opt I, Hi-Opt II, Omega II, Zen, Wong Halves)
- Casino simulator with configurable rules (H17/S17, DAS, 1–8 decks, penetration)
- Personalized practice via spaced-repetition AI
- Free tier: Unit 1 + first 3 lessons of Unit 2 + 7 unlimited drills + 1 daily
- Premium tiers: Weekly / Monthly / Annual via RevenueCat

Claims we remove because they are unsourced: "100+ Downloads", "5.0★ App Store Rating"
(if we cannot cite), "#1 Card Counting App", "90 days to casino-ready" in the metadata
description.

## Implementation phases

1. **Design tokens** — fonts in `layout.tsx`, rewrite `globals.css`.
2. **Page skeleton** — new `page.tsx` with nav + hero + proof strip.
3. **Curriculum + Drill + Systems** sections.
4. **Simulator + Belt** sections.
5. **Pricing + Screenshots + Testimonials + FAQ + CTA + Footer**.
6. **Subpage visual consistency** — privacy, terms, delete-account.
7. **Build + dev server verification**.
8. **Commit, push, PR.**
