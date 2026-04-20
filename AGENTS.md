# Count Dojo — Marketing Site

This file is auto-loaded by Claude Code, Cursor, Codex, Amp, and other AI
coding agents. Read it before touching the repo. Keep it short, concrete,
and honest — if something is no longer true, fix it in the same PR.

`CLAUDE.md` is a symlink to this file. Don't duplicate — edit this one.

---

## 1. What this repo is

A Next.js 16 / React 19 marketing site for **Count Dojo**, published at
<https://countdojo.com>.

**This repo ships only the marketing site.** The mobile app lives in a
sibling repo at `/Users/tim/Developer/count-dojo/app/release/countdojo`
(not part of this tree — do not try to import from it).

Tech:
- Next.js `16.1.6` (Turbopack)
- React `19.2.3`
- Tailwind CSS `4` (via `@tailwindcss/postcss`)
- Typography via `next/font/google`: **Fraunces** (display, variable with
  `SOFT` + `opsz` axes), **Inter Tight** (body), **JetBrains Mono**
  (technical labels)
- Static site. Every route is `prerendered as static content` — no server
  routes, no middleware, no databases.

Routes:
- `/` — homepage (the big one)
- `/privacy` — privacy policy
- `/terms` — terms of service
- `/delete-account` — App-Store-required account-deletion instructions

Hosting: Vercel. `trigger deployment` commits in the log exist because
the CI setup was finicky at one point; they are empty commits and not
meaningful history.

---

## 2. What the app does — marketing-relevant truth

Everything the site claims about the app must be true against the app
source. **When in doubt, re-read the app repo before writing copy.** The
site's voice is anti-hype. Do not invent feature counts, download
numbers, or star ratings.

### Scope of the app

Count Dojo is a serious card-counting education platform. Not a toy, not
a gambling app. It teaches blackjack basic strategy and card counting as
a disciplined craft, from absolute beginner to casino-ready.

### Curriculum — six units, ~30 core lessons plus side branches

| # | Unit | Core lessons | Side branches | Tier |
|---|------|---|---|---|
| I | Blackjack Foundations | 17 | 2 | Free |
| II | Learning to Count | 10 | 3 | Free (first 5) → Premium |
| III | True Count & Bet Sizing | 12 | 2 | Premium |
| IV | Playing Deviations | 11 | — | Premium |
| V | Casino Readiness | 11 | — | Premium |
| VI | Advanced Advantage Play | 4 | 5 | Premium |

**Placement tests** let experienced players skip ahead by passing a
10-question quiz (90%) plus 1–3 drill thresholds (85%).

### Drills — nineteen types, five categories, four medal tiers

Basic Strategy (5): Hard totals · Soft totals · Pairs · Mixed · Speed
strategy (timed 2–4s/hand).
Counting Foundations (7): Card flash · Single-hand count · Pair
cancellation · Running count · Count interruptions · Speed counting
(burst 6–10 cards) · Deck countdown (Legend &lt; 20 seconds).
True Count & Betting (5): True count conversion · Deck estimation ·
True count flow · Bet sizing · Realistic chips.
Strategy & Deviations (4): Illustrious 18 · Fab 4 surrenders · Extended
deviations · Game quality scenarios. All three-mode (Easy/Medium/Hard).
Integrated (2): Casino simulator · Personalized practice (AI spaced
repetition).

**Medal thresholds**: Bronze 70% · Silver 80% · Gold 90% · Legend 98%.
Timed drills require perfect accuracy under time.

### Counting systems — seven

Hi-Lo (primary, balanced level-1), KO (unbalanced level-1), Hi-Opt I
(balanced level-1 with ace side-count), Hi-Opt II (balanced level-2),
Omega II (balanced level-2), Zen Count (balanced level-2), Wong Halves
(balanced level-3 fractional). The site treats **Hi-Lo as the default**
and the other six as literacy.

### Casino simulator

Configurable rules: H17/S17, DAS, RSA, late surrender, 1–8 decks,
50–90% penetration, 3:2 or 6:5 payout. Bet spreads 1-4 through 1-20 or
custom. Skill toggles for counting, true count, bet sizing, realistic
chips, deviations (I18 / Fab 4 / Extended as sub-toggles), distractions,
heat.

Four built-in presets: **Vegas Strip Standard** (6D S17 DAS RSA LS 75%),
**Downtown Vegas** (2D H17 DAS 65%), **Atlantic City** (8D S17 DAS RSA
LS 67%), **Tough Vegas** (6D H17 DAS 70%).

### Reference library — ten tools

Strategy Charts (rule-aware), Deviation Indices (I18 + Fab 4 +
Extended), Bet Spread Tables (1-4 through 1-20), Edge Calculator,
Bankroll Planner (Kelly / fractional / risk of ruin), Variance
Projection (Monte-Carlo 4–200 shoes), Dealer Bust Chart (by upcard × TC),
Per-TC Edge Curve, Casino Database (user-submitted), 120+ term Glossary
(auto-linked at first appearance in lessons).

### Gamification

Twenty levels. Four belt ranks: **Blue Belt** (L1–5, Student), **Card
Disciple** (L6–10, Counter), **Advantage Player** (L11–15, Player),
**Dojo Legend** (L16–20, Grand Sensei). Sixty-five achievements across
six categories (Curriculum, Practice, Mastery, Streak, Milestone,
Behavioral). Daily-streak system (Three-Peat 3d → Centurion 100d).

### Free vs Premium

**Free forever**: All of Unit I (17 lessons), first 5 lessons of Unit
II, five unlimited drills (Hard / Soft / Pairs / Mixed / Card Flash),
every reference tool, placement tests.
**Premium**: Everything else. Subscriptions via App Store / Google Play
through RevenueCat — weekly, monthly, annual. **Price is server-side;
do not hard-code dollar amounts in the site.**

### Store URLs (canonical — these must be correct)

```
APP_STORE_URL   = https://apps.apple.com/us/app/count-dojo-bj-card-counting/id6760961014
GOOGLE_PLAY_URL = https://play.google.com/store/apps/details?id=com.countdojo.app&utm_source=na_Med
```

Both are declared as constants in `src/app/page.tsx`.

---

## 3. Design language — Editorial Dojo

The full spec is committed at
`docs/superpowers/specs/2026-04-19-site-redesign-design.md`. Read it
before making any visual change. The short version:

**Aesthetic**: trade-publication-meets-modern-dojo. Confident,
typography-forward, disciplined grid, generous whitespace, content
density where it earns it. Not glassmorphism, not floating particles,
not magnetic buttons, not animated-gradient headlines. The product is a
serious craft; the site looks like one.

**Chapter marks**: sections are numbered `§ I` through `§ XV` using Roman
numerals in mono. Marks are continuous — when inserting or removing a
section, **renumber every subsequent mark.** A fifteen-section site
currently reads I→XV with three un-numbered interludes (live count
demo, proof strip, Thorp epigraph).

**Palette** (tokens in `globals.css`):
```
--ink-0: #0a0a0b   -- canvas (warm black, not slate)
--ink-1: #111113   -- raised
--ink-2: #18181b   -- elevated
--paper: #f5f1e8   -- cream body text
--paper-muted: #a8a29e
--paper-faint: #78716c
--paper-ghost: #44403c
--rule: #27272a
--rule-strong: #3f3f46
--emerald: #34d399  -- sole brand accent, sparse use
--amber:   #f59e0b  -- reserved for warnings / negative-edge states
```

Emerald is the **only** accent. Do not scatter emeralds everywhere. Use
it for chapter numerals, the single primary CTA, status dots, positive
data, and interactive highlights. Amber is reserved for negative edge
(TC &lt; 0) and warnings. Never pink, purple, or rainbow gradients.

**Type**:
- Display: Fraunces (variable). Use SOFT 50 for stern, SOFT 100 for
  warm/italic. opsz responds to size. Two standout italic moments
  currently exist: hero "Finally taught" and final CTA "The work is
  yours". Do not multiply them.
- Body: Inter Tight.
- Mono: JetBrains Mono. Used for labels, stats, drill notes, chapter
  marks, formulas, and anything numeric. `tabular-nums` on every stat.

**Motion**: subtle reveals only, respect `prefers-reduced-motion`. One
orchestrated hero-stagger on load. No page-loader curtain.

**Accessibility**:
- `:focus-visible` emerald ring is globally applied in `globals.css`.
  Do not suppress it.
- All store buttons are `<a target="_blank" rel="noopener noreferrer">`.
  See §4 below — this is load-bearing.
- Reduced-motion respected on `.reveal`, `.hero-stagger`.

---

## 4. Store buttons — read this before editing

The store buttons (`btn-store`, `btn-store-primary`) **must stay plain
`<a>` elements with `href`, `target="_blank"`, and
`rel="noopener noreferrer"`.** No custom "magnetic" hover components.
There is a commit (`6681b75 fixing app store button`) that records a
previous bug: a MagneticButton wrapper was rendering as `<button>` when
the `href` was `"#"` or missing, and the App Store link did not work in
production. The fix is to keep the element an anchor and point it at
the canonical URL.

Both `AppStoreIcon` and `PlayStoreIcon` are inline SVGs inside
`page.tsx`. Both buttons appear in these places on the homepage: hero,
pricing free, pricing premium, final CTA. Header has only the Apple
Download.

If you are changing the layout and worry you broke something, curl the
rendered HTML and confirm:
```bash
curl -s http://localhost:3000/ | grep -oE '<a[^>]*(apps\.apple\.com|play\.google\.com)[^>]*>'
```
You should see at minimum 5 Apple + 4 Google anchors on `/`, plus 1
Apple (header) on each subpage.

---

## 5. Repo layout

```
src/app/
  layout.tsx             -- Loads Fraunces / Inter Tight / JetBrains Mono via next/font
  globals.css            -- Design tokens, primitives, animations. Source of truth for colors.
  page.tsx               -- Homepage. Single large client component (deliberate).
  privacy/page.tsx       -- Privacy policy
  terms/page.tsx         -- Terms of service
  delete-account/page.tsx-- App Store account-deletion instructions
  _components/
    SiteHeader.tsx       -- Sticky top nav with mobile menu. Client component.
    SiteFooter.tsx       -- Footer. Server component.
docs/
  superpowers/specs/
    2026-04-19-site-redesign-design.md   -- Editorial Dojo spec
public/
  images/                -- Logos, hero poster frames, app screenshots
  videos/blackjack-hero.mp4 -- hero video backdrop
```

**Conventions**
- Do not create new route files unless the user asks.
- Do not introduce a component library (shadcn, HeadlessUI, etc.). The
  entire site is primitive Tailwind + custom CSS in `globals.css`. The
  product is small; the code stays flat.
- `_components/` is the Next convention for private components — use it
  for anything shared across `layout.tsx` / routes.
- `page.tsx` is ~1,000+ lines on purpose. It is read top-to-bottom:
  constants → types → helpers → section components → `Home()`. Adding
  a new section = a new section component declared above `Home()`.

### Data flow for site content
All marketing data (curriculum, drills, counting systems, belts,
pricing, testimonials, FAQ, reference tools, achievement categories,
edge table, comparisons, casino presets) is declared as plain TypeScript
constants at the top of `page.tsx`. **When app features change, update
these constants.** There is no CMS, no fetch, no remote source.

---

## 6. Commands

```bash
npm run dev    # Turbopack dev server on :3000
npm run build  # Static production build
npm run start  # Serve the built output
npm run lint   # ESLint
```

Static build output is in `.next/`. Nothing to deploy manually — Vercel
picks up on push.

---

## 7. What happened in the session of 2026-04-19

Three back-to-back working sessions on the site. Branches off `main`:

### `feature/google-play-link` — PR #3 (superseded by #4)
- The Play Store build went live. Two Google Play buttons on the
  homepage (hero, final CTA) were disabled placeholders with "Coming
  Soon" badges and `href="#"`. Activated both, pointed at the real
  Play Store URL with the `utm_source=na_Med` parameter, removed the
  Coming Soon badges and the disabled styling.
- PR #3 open against `main`. Will auto-close when #4 merges since #4
  is branched off it.

### `feature/site-redesign` — PR #4
Current working branch. Full site redesign plus content expansion.

**Commit `fd8fa9c` — design spec.** Wrote the Editorial Dojo spec to
`docs/superpowers/specs/`.

**Commit `55c25e8` — aesthetic reset.** Removed glassmorphism, floating
card-suit particles, magnetic buttons, animated-gradient hero headline,
page-loader curtain, marquee ticker with unverified claims ("100+
Downloads", "#1 Card Counting App"), bento grid with arbitrary spans,
universal scroll-reveal. Rebuilt around 11 numbered chapter sections
with Fraunces + Inter Tight + JetBrains Mono loaded via `next/font`.
Extracted `SiteHeader` / `SiteFooter` to `_components/` so all four
routes share chrome. Restyled privacy / terms / delete-account with
numbered legal sections and the new typographic system.

**Commit `5fdb0dc` — content expansion + live demo.** Added six new
sections: a live auto-playing Hi-Lo count demo with running-count
ticker and "TC for six decks" readout; a Thorp 1962 epigraph; "The
Math" (TC formula set in display + edge-by-TC table with divergent
bars); "The Reference Library" (all 10 in-app tools enumerated); "The
Badges" (65 achievements across 6 categories with named standouts); "vs
The Usual Path" (honest comparison against YouTube / Thorp-Wong-
Schlesinger / drill-only apps). Enriched existing sections with real
lesson titles per unit, drill mode/speed notes, a medal-thresholds row,
a simulator preset grid, and a corrected free-tier list. A11y pass:
global `:focus-visible` emerald ring, `tabular-nums` on all numerics,
new primitives (`count-card`, `formula-card`, `edge-row`, `preset-grid`)
all respecting `prefers-reduced-motion`.

### External actions
- Installed the `ui-ux-pro-max` skill at user scope
  (`~/.agents/skills/ui-ux-pro-max/`), along with its six bundled
  design helpers (`ckm-*`). These power the design-system generator via
  `python3 ~/.agents/skills/ui-ux-pro-max/scripts/search.py`.
- Registered the `@21st-dev/magic` MCP server at user scope. Requires
  reload to become callable in-session. API key stored in
  `~/.claude.json` (plaintext — keep the file out of dotfiles repos).

### Not done / deliberately deferred
- No preview deploy has been eyeballed yet. Visual QA on the hero video
  treatment, phone-mock rotations, Fraunces SOFT-axis italic rendering,
  and the FAQ accordion animation is still open.
- The 15-section numbering is intentional but dense. If a future pass
  removes or adds a section, **renumber the chapter marks.**
- No CMS migration. Content remains as TS constants in `page.tsx`. If
  the curriculum or drill list changes in the app, update those
  constants.
- No tests. The site has no test suite. For visual regressions, rely on
  `npm run build` + the `curl` sweep described in §4.

---

## 8. Things to avoid

- Do not add floating particles, glassmorphism cards, or animated
  gradient headlines. The redesign explicitly rejected these and every
  future pass should too.
- Do not use emoji as structural icons. Use SVG.
- Do not invent statistics. If the site needs a new number, read the
  app source or ask. "100+ Downloads", "5.0★ rating", "#1 Card Counting
  App", and "90 days to casino-ready" are all examples of claims the
  redesign removed for being unverified.
- Do not hard-code subscription prices. RevenueCat handles them
  server-side.
- Do not replace the inline SVG icons with an icon library without
  discussing first. The site uses ten inline SVGs total; adding a
  Heroicons/Lucide dependency for ten icons is not worth it.
- Do not add `next/dynamic` or route splitting. Every route is static
  and small.
- Do not change the `MagneticButton` pattern back. It was removed for a
  reason. See §4.

---

## 9. Pointers for future agents

- Reading the Editorial Dojo spec (`docs/superpowers/specs/2026-04-19-
  site-redesign-design.md`) will save you real time before any visual
  change.
- When asked to "make it better", prefer: more specific app content
  over new visual flourishes. The user's feedback has been consistent
  — richness of truthful detail beats motion/effect.
- When adding a section, copy an existing section's structure
  (eyebrow `text-chapter` → Fraunces `text-display-lg` headline →
  supporting paragraph → content). Maintain the `§ ROMAN · Title`
  pattern.
- The live count demo (`LiveCountDemoSection`) is the one piece of
  interactivity on the site. If you are tempted to add another, ask
  first — over-interactivity is the kind of thing the redesign fought
  against.
