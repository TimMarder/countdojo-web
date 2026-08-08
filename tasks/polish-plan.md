# Count Dojo — Consolidated Implementation Plan

**91 verified findings → 26 items.** Ordered for safe landing. Tier tags are priority; the numbering is the sequence.

---

## The one theme

**The site is not under-designed. It is under-delivered — the intended design is authored correctly and then discarded at the last mile.** Seventeen `grid-cols-[1fr,2.1fr]` declarations are invalid CSS and get dropped, so the signature editorial masthead (mono chapter mark + Fraunces headline left, deck right) has *never rendered anywhere on the site*. Every hand-written class in `globals.css` sits outside `@layer`, so it silently beats the Tailwind utility written next to it — the two emerald pricing badges render grey, `max-w-4xl` never constrains, `leading-[1.2]` is ignored. `font-optical-sizing: auto` is cancelled on the next line by a literal `"opsz" 144`. The carousel's 520ms transition is overridden by a class applied in the same string. Fraunces Italic is never downloaded, so the 128px hero headline is a browser-synthesized fake oblique.

That is why it reads "janky and not as professional as it could be": the reader is looking at the *fallback* of a good design, not the design. Roughly 60% of the perceived improvement is in items 1–3 below, and none of them change a single design decision. Fix delivery first, then craft.

---

## PHASE A — Delivery failures (do these before anything else)

### 1. Fix the comma-separated arbitrary grid columns
**Tier 1 · Effort XS · `src/app/page.tsx`, `src/app/_components/SiteFooter.tsx`**

**Root cause:** Tailwind v4 passes arbitrary values through verbatim; `_` becomes a space, a comma does not. All 17 arbitrary grid values compile to `grid-template-columns:1fr,2.1fr` — invalid, dropped at parse time, element falls back to one implicit column. Confirmed in the built chunk `.next/static/chunks/6ba28d2c21d1ff49.css`. Because all 17 carry `md:`, the site renders its *mobile* stacking at every desktop width.

**Change:** mechanical, commit on its own so the layout diff is reviewable.
```
perl -0pi -e 's/grid-cols-\[([^\]]*)\]/"grid-cols-[".($1=~s|,|_|gr)."]"/ge' \
  src/app/page.tsx src/app/_components/SiteFooter.tsx
grep -rn 'grid-cols-\[[^]]*,' src   # must be empty
```
Lines: page.tsx 1290 `[1fr_2fr]`, 1441 `[1.5fr_1fr]`, 1647 `[auto_1fr]`, 2018 `[1.05fr_1fr]`, 2067 `[1.1fr_1fr]`, 2445 `[1fr_auto_1fr]`, `[1fr_2.1fr]` at 1545/1599/1676/2004/2140/2192/2236/2290/2339/2434, SiteFooter.tsx:8 `[1.4fr_1fr_1fr]`.

**Then re-check at 1440px** (these shapes have never existed): the hero card fan returns to the right column and the hero should drop back toward its `min-h-[88vh]` floor (currently 1371px); the ten section heads get `self-end max-w-xl` decks *beside* the headline for the first time — confirm the bottom-alignment still reads; the carousel arrow column lands in track 3; the footer becomes 1.4/1/1.

**Subsumes:** `broken-arbitrary-grid-columns` (design-system), `grid-cols-comma-invalid-css` (components), `broken-arbitrary-grid-columns` (architecture).

**Blocks:** items 14 (pricing), 16 (two-panel ground), 24 (SectionHead), and the visual review of 15 (footer underline).

---

### 2. Put `globals.css` in cascade layers, and free the sub-display line-height
**Tier 1 · Effort M · `src/app/globals.css`**

**Root cause:** `@import "tailwindcss"` puts all utilities in `@layer utilities`. Unlayered CSS outranks *any* layered CSS regardless of specificity. Every hand-written rule in globals.css is unlayered, so wherever a component class and a utility set the same property, the utility is dead markup.

**Change:**
- Wrap globals.css:53–85 (`html`, `body`, `::selection`, `:focus-visible`, `button,a`) in `@layer base { … }`.
- Wrap 87–1352 in `@layer components { … }`.
- Leave `:root` (3–31) and `@theme inline` (33–51) unlayered.
- Delete the entire `@layer utilities` block at 1357–1374 (item 3 covers why it is safe).
- Remove `line-height: 0.95` from `.font-display` (globals.css:95). It belongs to the hero, not to every h3. The three `.text-display-*` steps declare their own leading and are unaffected.
- Add two sub-display steps after `.text-display-md` (line 127):
```css
.title-md { font-size: clamp(1.375rem, 1.6vw + 1rem, 1.75rem); line-height: 1.15; letter-spacing: -0.015em; }
.title-sm { font-size: 1.25rem; line-height: 1.2; letter-spacing: -0.01em; }
```
  Apply `.title-md` to the section h3s (page.tsx 1567, 1701, 2312, 2172, 2358, 2384) replacing `text-2xl md:text-3xl`; `.title-sm` to reference-tool titles (2217) and preset names (2113) replacing `text-xl md:text-2xl`.
- Optionally strip the baked-in `color` from `.text-label`, `.link-mono`, `.text-chapter` so colour is always an explicit utility decision (item 12 depends on this).

**Four consequences repaired at once — all are visible changes, review each:**
| Before | After |
|---|---|
| Pricing "Forever" / "Recommended" render grey (`.text-label` hard-codes `--paper-muted`) | They render emerald — the two places emerald genuinely signals something |
| Header nav + demo RESET/PAUSE/NEXT render full paper white (`.link-mono` hard-codes `--paper`) | They render `text-paper-muted` with a `hover:text-paper` that finally works |
| FAQ + all three legal pages run body copy the full 1280px (`.site-shell` hard-codes `max-width`) | `max-w-4xl` / `max-w-3xl` constrain the measure |
| A 24px h3 sets at 22.8px leading; descenders collide on every wrapped mobile title | h3s set at 1.15 via `.title-md` |

Do **not** add a `--shell` custom property — once layered, `max-w-4xl` beats `.site-shell` on its own.

**Subsumes:** `unlayered-css-beats-every-tailwind-utility`, `display-line-height-too-tight-for-sub-display`, `redundant-utilities-layer-shadows-type-system`.

**Blocks:** 12 (label scale), 13 (emerald discipline), 17 (demo controls), and anything relying on a `leading-*` or colour utility.

---

### 3. Delete dead code, dead tokens and the shadow utilities layer
**Tier 3 by impact, but sequenced here · Effort XS**

**Root cause:** unreferenced rules get "consolidated" into new scales and become permanent. Do this *before* the radius and label passes.

**page.tsx** (delete by symbol, not line — earlier items shift lines): `edgeTable` (411) + `type EdgeRow` (54), `ArrowIcon` (589–602), `EdgeRowLine` (1969–1998).
**globals.css:** `.edge-row` / `.edge-bar` / `.edge-bar__mid` / `.edge-bar__fill` (1272–1311 — 40 lines styling a component nobody renders), `.rule-v` (207–211), `.rule-strong` (201–205, the bare class; `border-rule-strong` is a different Tailwind-generated utility and stays), `.eyebrow-rule` + `::before` (167–179), `.text-eyebrow` (129–135), `.font-display-soft` (98–104 — item 11 replaces its value with a `--soft` binding), `--surface-1` (25), `--emerald-deep` (21). **`--surface-2` is live** at globals.css:283 — leave it.

**The `@layer utilities` block (1357–1374) is provably redundant:** `bg-rule` and `hover:border-paper` are used in TSX, absent from that block, and present in the compiled chunk — so `@theme inline` really is generating the colour utilities. `.text-balance`/`.text-pretty` are Tailwind core. `.font-display`/`.font-mono` there declare only `font-family` and never win against the real rules at 90/106.

If item 19 needs a `border-control-edge` utility, do **not** re-add a hand-written utilities block — add `--color-control-edge: var(--control-edge);` to `@theme inline` and let Tailwind generate it.

Verify: `npx eslint .` clean; `grep -rn 'edge-row\|edge-bar\|eyebrow-rule\|rule-v\|text-eyebrow\|font-display-soft' src` empty; rebuild and confirm `.text-paper`, `.bg-ink-1`, `.border-rule`, `.text-amber-accent`, `.text-balance`, `.font-display` all still resolve.

**Subsumes:** `dead-tokens-classes-and-components`, `dead-code-ts-and-css`, `redundant-utilities-layer-shadows-type-system` (deletion half).

---

### 4. Declare the missing token layer
**Tier 2 · Effort XS · `globals.css:3–31`**

**Root cause:** there is no radius rule, no control-boundary token, and no label scale, which is *why* the pill CTAs and the ten ad-hoc radii were able to happen. Declare first, apply in items 10–12 and 19.

```css
:root {
  /* radius — roundness means "this is a physical object" */
  --r-ui: 0;          /* chrome: buttons, tags, focus ring, tooltips, panels */
  --r-card: 10px;     /* objects that ARE playing cards */

  /* control boundary — 3:1 non-text contrast, unlike --rule-strong's 1.89:1 */
  --control-edge: #64646f;

  /* Fraunces SOFT axis, bound to type role */
  --soft: 50;

  --paper-faint: #8a827c;  /* was #78716c — see item 5 */
}
```
`--r-ui: 0` and `--r-card: 10px` is a rule an implementer can apply and a reader can feel. Everything else in the file's radius inventory (4/6/8/12/26/40/999px) collapses into one of the two, with two deliberate exceptions: `.phone-mock` (40px outer / 26px screen with 14px padding is already correctly concentric — the only real-world device on the page) and the circular dots.

---

## PHASE B — Tier 1 defects

### 5. Lift `--paper-faint` above AA, and stop using `--paper-ghost` as text
**Tier 1 · Effort XS**

`#78716c` measures 4.12:1 / 3.93:1 / 3.69:1 on ink-0/1/2. Every one of its ~30 uses is small text (0.62–0.9rem), so the 3:1 large-text allowance never applies, and the site has no light surface — it fails on 100% of its uses. `#8a827c` is the same hue (25.7° vs 25.0°) and saturation (10.1% vs 10.0%), value lifted 47%→54%: **5.24 / 5.00 / 4.69**. Because `@theme inline` dereferences the same custom property, the single edit at globals.css:13 propagates to every `text-paper-faint`, both raw `var()` uses in the SVG chart (page.tsx 1939/1975), and both globals.css rules.

Separately, `page.tsx:1617` uses `text-paper-ghost` (#44403c) as live text for the drill numerals at **1.93:1** — under half the requirement. Change to `text-paper-faint`. `--paper-ghost` then survives only as two 28×1px decorative hairlines (globals.css:989–996), where 1.4.3 does not apply; leave the token.

**Subsumes:** `paper-faint-token-fails-aa`.

---

### 6. Hero: load the real italic, fix the poster, gate and shrink the video, add the scrim floor
**Tier 1 · Effort M · `layout.tsx`, `page.tsx:1427–1472`, `globals.css:486`**

Five separate defects in the first 900px of the site. Land them together.

**(a) Fraunces Italic is never downloaded.** `layout.tsx:5–10` omits `style`, so next/font defaults to `["normal"]`; the production CSS contains three Fraunces `@font-face` rules, all `font-style:normal`. Meanwhile `className="italic"` is on Fraunces text at page.tsx 1448 (the 128px hero h1), 1508, 2625, plus `.cinematic-headline em`. The rendered `a` is double-storey and the `g` binocular — it is the roman skeleton mechanically sheared. Fix: add `style: ["normal","italic"]` to the `Fraunces({…})` call. Verify: `grep -o '@font-face{[^}]*}' .next/static/chunks/*.css | grep -i fraunces` must list a `font-style:italic` face, and the hero `a` must become single-storey.

**(b) The poster is an in-app menu screenshot with a dev artifact in it.** `/images/IMG_6360.jpg` is a 1320×2705 portrait screenshot of the app's unit list whose back button still reads the Expo Router placeholder `‹ (tabs)`. Under `object-fit: cover` on a 1440×1371 landscape box it scales to 1440×2950 and crops to a ~790px band of cool navy against the warm-black canvas. It is also what renders permanently wherever autoplay is blocked. Fix: `ffmpeg -ss 3 -i public/videos/blackjack-hero.mp4 -frames:v 1 -vf scale=1600:900 -q:v 3 public/images/hero-poster.jpg`, point page.tsx:1436 at it, add `<link rel="preload" as="image" href="/images/hero-poster.jpg" fetchPriority="high">` in layout.tsx, `git rm public/images/IMG_6360.jpg`.

**(c) 10.28 MB / 1920×1080 / 60fps / 7.47 Mbps** shipped identically to a 390px phone, under a 0.35→0.98 black scrim. Re-encode: `ffmpeg -i … -vf scale=1280:720,fps=30 -c:v libx264 -crf 28 -preset slow -profile:v main -pix_fmt yuv420p -an -movflags +faststart` (expect 600 KB–1.1 MB; defocused footage compresses hard). Do **not** use `<source media="…">` — that attribute is ignored inside `<video>` by every shipping browser.

**(d) No reduced-motion gate, no pause control.** HeroSection is the only motion-bearing component in the file that never calls `useReducedMotion`, while globals.css carries five `prefers-reduced-motion` blocks elsewhere. Give the video a `ref`, drop `autoPlay`, set `preload="none"`, and start playback from an effect: `if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; v.preload = "auto"; v.play().catch(() => {});`. This renders byte-identical markup on server and client (a `reduced ? <Image/> : <video/>` swap does not — the hook returns `null` on first render and the video mounts and fetches before the swap resolves). For SC 2.2.2, append one mono toggle to the existing bottom strip at page.tsx:1463–1465 as `· Pause film` / `· Play film` using `.link-mono` so it reads as editorial microcopy rather than a media widget — and give it the same hit-area treatment as item 8.

**(e) Scrim floor.** The eyebrow's effective alpha is only ~0.50 over a *looping* video, so its contrast is whatever frame is playing. Measured from mobile-00.png, the background behind the eyebrow hits #594b17 at p90 → emerald at **4.47:1**, 3.87:1 at p95, 3.26:1 at p99. globals.css:486: replace `rgba(10,10,11,0.35) 0%, rgba(10,10,11,0.85) 65%, rgba(10,10,11,0.98) 100%` with `rgba(10,10,11,0.55) 0%, rgba(10,10,11,0.88) 55%, rgba(10,10,11,0.98) 100%` — effective 0.62 at the desktop eyebrow, 0.66 at the mobile one, clearing 4.5:1 on every frame. Leave the radial emerald wash (485) and the film grain (491–500) untouched. **This is the one change in the plan that alters a photograph; eyeball it against desktop-00.png.**

**Subsumes:** `fraunces-italic-never-loaded`, `hero-poster-is-app-menu-screenshot`, `hero-video-10mb-unresponsive`, `hero-video-autoplay-ungated`, `hero-video-no-pause-no-reduced-motion`, `hero-scrim-frame-dependent-contrast`.

---

### 7. Mobile hero typography: kill the clamp floor, the orphans and the middot breaks
**Tier 1 · Effort S**

**Root cause:** `.text-display-xl`'s clamp preferred term only overtakes its 56px floor at 571px viewport, so the hero H1 renders at a fixed 56px across the entire phone range while the viewport is 27% of desktop width. "Finally taught like" ends at exactly the content-box edge with zero slack and "one." orphans onto a third line.

- `globals.css:112` → `font-size: clamp(2.5rem, 7vw + 1rem, 8rem);`. Desktop is bit-identical (only the MIN changes). At 390px the hero drops to 43.3px, "Finally taught like one." measures ~319px against a 350px box, and the hero collapses to a clean two lines. 2.75rem is *not* enough — it still orphans. **Do not touch `.text-display-lg` or `.text-display-md`** — verified healthy at every mobile width; changing them is the aesthetic change the brief forbids.
- Chapter eyebrow wrap ("PLAY" orphaning): add after globals.css:143 — `@media (max-width: 480px) { .text-chapter { font-size: 0.66rem; letter-spacing: 0.2em; } }`. Brings the longest mark, `§ I · AN EDUCATION IN ADVANTAGE PLAY`, from ~403px to ~304px. Do **not** apply the same treatment to `.text-label` — the 54-char hero bottom strip still overflows at 0.62rem/0.16em and shrinking `.text-label` sitewide buys nothing.
- The hero bottom strip clipping is a wrapping problem, not a sizing one. Glue every middot to the token before it with U+00A0 so a line can only break *after* the dot (line-ends-with-dot is standard practice; line-begins-with-dot is the defect — visible in mobile-09.png as `· LS · 3:2` starting a line). Sites: page.tsx 1464, 2635 (the strips), 2122 (`p.rules.join`), 2393 (`plans.join`), 2501 (carousel label). Write the nbsp as a literal U+00A0 immediately preceding each `·`.
- Achievement list, page.tsx:2270–2276: the `—` is a bare text node, so wrapped continuations return to the marker's x and read as an empty second item (mobile-11.png). Give it a real marker column: `grid grid-cols-[0.9rem_1fr] gap-x-1` with `<span aria-hidden>—</span>` and `<span>{ex}</span>`. Bind `< 20s` with an nbsp in the source data.

**Subsumes:** `display-clamp-floors-freeze-mobile-type`, `chapter-mark-eyebrow-wraps`, `middot-separators-break-badly`, `badge-list-no-hanging-indent`; extends already-confirmed problem 3.

---

### 8. Give every control a real hit area and a real cursor
**Tier 1 · Effort S**

**Root cause:** padding lives on wrappers instead of buttons, and Tailwind v4's Preflight no longer sets `button { cursor: pointer }` — the compiled sheet contains exactly two `cursor:pointer` rules, one of them the unused utility.

- `globals.css:82–85` → add `button:not(:disabled) { cursor: pointer; }`. Anchors get the pointer from the UA sheet, so `.btn-store`/`.btn-ghost` are unaffected, and the `disabled:cursor-not-allowed` on demo NEXT still wins. Delete the now-redundant `cursor: pointer` from `.faq-toggle` (568).
- **FAQ:** move `padding-block: 1.25rem` from `.faq-item` (555) to `.faq-toggle`, and add `min-height: 44px`. Hit area goes 25px → ~65px with **zero visual change**. Compensate the lost bottom padding on open rows: page.tsx:2578 `pb-2` → `pb-6`. Add `.faq-toggle:focus-visible { outline-offset: -2px; }` so the ring hugs the row instead of drawing a 1206×31 rectangle across the content width. Add the missing hover in the site's own idiom, mirroring `.editorial-row:hover`: `.faq-toggle:hover .faq-toggle-icon { color: var(--emerald); }` and `.faq-item:has(.faq-toggle:hover) { border-top-color: var(--rule-strong); }`.
- **Hamburger (24×24, the only nav control on every phone):** `SiteHeader.tsx:149` → `className="md:hidden text-paper -mr-3 p-3"` → 48×48, negative margin keeps the glyph optically flush.
- **Logo:** `SiteHeader.tsx:125` → add `py-1.5 -my-1.5` (36 → 48px tall, still inside `h-16`).
- **Footer:** drop `space-y-3` from the `<ul>` at SiteFooter.tsx:26 and give each of the seven links `inline-block py-3` (20 → 44px, 44px pitch). Email link (66) → `inline-block py-2.5 -my-2.5`. Social row (73) → `flex gap-1 items-center -ml-3` with each anchor `inline-flex h-11 w-11 items-center justify-center`. **Known tradeoff:** the footer nav column grows ~84px. That is correct and unavoidable.
- Carousel arrows are already `h-11 w-11` — leave the sizing alone.

**Subsumes:** `mobile-tap-targets`, `faq-hit-area-dead-padding`, `faq-hit-area-excludes-padding`, `buttons-missing-cursor-pointer`; implements already-confirmed problem 4.

---

### 9. Stop the hairlines doubling
**Tier 1 · Effort XS**

**Root cause:** `.editorial-row:last-child { border-bottom }` is written for a flat list, but in curriculum (page.tsx:1562) and counting systems (1692) each row is the sole child of its own `<Reveal>` wrapper, so `:last-child` matches *every* row and adjacent borders stack to 2px. Comparison (2303) renders flat siblings and gets clean 1px. Measured on the screenshots: FAQ separators (no Reveal) are a uniform 58.0 ink units ×7; curriculum separators are 54, 54, **101**, 45.

- Delete `globals.css:408–414` (`:last-child` and `:last-child:hover`). Keep `border-top` on `.editorial-row`.
- Add `.editorial-list { border-bottom: 1px solid var(--rule); }` and apply it to the three map-wrapper `<div>`s (page.tsx 1560, 1690, 2301 — confirmed present).
- Delete the `group` class at page.tsx:1563 — `grep group-hover` returns zero hits repo-wide.
- **Same bug in `.proof-strip`:** globals.css:601 sets `border-block` on the container and the ≤900px override at 608–610 adds `border-top` to *every* child, doubling the first row's rule — and the section above it is a full-bleed `border-b`, so you get three coincident hairlines across the shell-inset span. Change `.proof-strip > *` to `.proof-strip > :nth-child(n+3)` inside that media block. `.preset-cell` at 1342–1352 already does exactly this correctly — copy it.
- **Land with the `will-change` removal (item 25a):** `.reveal`'s permanent layer promotion is why some seams rasterize at 1px and others at 2px. Delete `will-change` from `.reveal` (457) in this same commit.

**Subsumes:** `editorial-row-doubled-rules`, `reveal-wrapper-doubles-hairlines`, `proof-strip-doubled-hairline`.

---

### 10. Make `.editorial-row` collapse on mobile
**Tier 1 · Effort S**

**Root cause:** `.editorial-row { grid-template-columns: auto 1fr auto }` has no breakpoint anywhere in the file (all ten `@media` blocks verified). At 390px curriculum spends 246 of 350px on the numeral and the `whitespace-nowrap` meta block, leaving ~104px for title, synopsis and lesson list; counting systems' auto first track absorbs ~176px for `LEVEL III · FRACTIONAL`.

Two conflicting fixes were proposed (a 2.5rem gutter at 720px vs. full single-column at 767px). **Resolution: gutter for curriculum, stack for counting systems**, at 767px so it matches the `md:` breakpoint the JSX already uses.

```css
@media (max-width: 767px) {
  .editorial-row { grid-template-columns: 2.5rem minmax(0,1fr); gap: 0 1rem; align-items: start; }
  .editorial-row > *:nth-child(3) { grid-column: 2; margin-top: .75rem; text-align: left; align-items: flex-start; }
  .editorial-row--stack { grid-template-columns: minmax(0,1fr); }
  .editorial-row--stack > * { grid-column: 1; }
}
```
- Curriculum keeps its roman numeral in a 2.5rem gutter (`w-12` still works inside it), content full width, `11 LESSONS · PREMIUM` dropping under the content as one left-aligned mono line — change page.tsx:1579 to `flex flex-row items-baseline gap-4 md:flex-col md:items-end md:text-right whitespace-nowrap md:mt-1`.
- Counting systems gets `editorial-row--stack` and **must drop `min-w-[7rem]` at page.tsx:1694** (112px will not fit a 40px track); change that div to `flex flex-row gap-3 md:flex-col md:gap-1 md:min-w-[7rem]` so rank/level set as one mono caption above the system name.
- Comparison is a no-op — its third child is already `hidden md:inline-block`, so it is not a grid item at mobile.

**Also fix the values string** (page.tsx:1708–1710): `s.values` is one flat string with 4-space separators, and HTML collapses every run to a single break opportunity — including the ones *inside* a mapping, so Wong Halves renders as `2 → +0.5 3-4 →` / `+1 5 → +1.5 6`. The reader cannot tell which tag belongs to which rank.
```jsx
<p className="font-mono text-xs md:text-sm text-paper-faint tabular-nums tracking-wider flex flex-wrap gap-x-4 gap-y-1 md:gap-x-6">
  {s.values.split(/\s{2,}/).map((v) => <span key={v} className="whitespace-nowrap">{v}</span>)}
</p>
```
No data change; verified no mapping contains an internal double space. Note this **does** change desktop — collapsed spacing is ~7px today, `md:gap-x-6` is 24px. That is deliberate.

**Subsumes:** `editorial-row-does-not-collapse-on-mobile`, `editorial-row-never-stacks`, `counting-system-values-break-mid-pair`.

---

### 11. Make the cinematic sequence fit a phone and stop it snapping
**Tier 1 · Effort M · `page.tsx:789–815, 853–923, 989–1170`**

Four coupled defects in one section. **Do them as one atomic pass** — the keyframe map, the Act III fade window and the act thresholds must move together or the captions desync from the choreography.

**(a) Fixed-pixel poses.** `fanPose` hard-codes `spread = 62` and `helixPose` hard-codes `radius = 300`, with no viewport term; the mobile query only shrinks `.helix-card` to 74px. Act I spans 12×62+74 = **818px** and Act II 674px inside a 390px stage masked by `overflow: hidden` — about five of the thirteen cards are inside the mask, contradicting the headline's own claim ("Thirteen ranks. Four suits."). Fix: derive `compact` from `matchMedia("(max-width: 768px)")` in `CinematicSequence`, change the signatures to `fanPose(i, total, spread)` / `helixPose(i, total, radius)`, and pass `compact ? 22 : 62` and `compact ? 130 : 300`. That gives 338px and 334px — inside the stage with margin, with card size and the `perspective: 1800px` projection math untouched. Do **not** wrap the stage in a CSS `scale()` — scaling a descendant of the perspective element rescales the projection space, not just the layout.

**(b) Rotation rate.** 360° of scene rotation is mapped to 26% of a 1440px scrub = **0.96°/px** desktop and **1.37°/px** mobile — one flick spins it past two revolutions, and the revolution happens while the cards are still travelling from fan to helix, so the formation and the camera fight each other. Fix: remap the whole keyframe set together, **without lengthening the section** (see "deliberately not doing"): card transforms (853–877) input `[0, 0.1, 0.32, 0.58, 0.82, 1]` → `[0, 0.09, 0.24, 0.50, 0.84, 1]`; `sceneRotateY` → `useTransform(progress, [0.28, 0.70, 0.84], [0, 360, 360])`; `sceneRotateX` input → `[0, 0.24, 0.50, 0.84, 1]`; `sceneScale` input → `[0, 0.14, 0.42, 0.84, 1]`; act thresholds (1023–1025) → `v < 0.24` / `v < 0.70`. The revolution now spans 0.42 of the scrub and happens while the cards *hold* the helix.

**(c) Unsmoothed, uneased scrub.** All eleven `useTransform` calls take three arguments, so every segment moves at constant velocity and every keyframe boundary is a velocity discontinuity — x/y/z hold at zero velocity from 0.10 to 0.32 and then jump to full speed. And `scrollYProgress` is consumed raw, so a wheel advances the sequence in discrete ~100px steps. Fix: `const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.0005 })` and feed `progress` to the four `CinematicSuit`s, both `HelixCard` call sites, and the three scene transforms. **Leave `scrollHintOpacity` and the `activeStage` subscription on raw `scrollYProgress`** so the act thresholds do not lag the captions. Add per-segment easing as the 4th argument: `{ ease: [easeOut, easeInOut, easeInOut, easeInOut, easeOut] }` on the five 6-stop transforms (the array must be one shorter than the ranges), `{ ease: easeInOut }` on the 2-stop suit transforms.

**(d) The Act III fade runs on a different clock.** Each of 13 cards calls `setAct3Fade(v > 0.78)` to toggle `data-act3`, which globals.css:707 fades over a 520ms wall-clock CSS transition — while the same element's positions are scroll-scrubbed. Scrub across 0.78 and the transition restarts; flick past and the cards land converged while opacity is still catching up. Fix: replace 878–881 with `const opacity = useTransform(progress, [0.76, 0.88], [1, s3.opacity])` (window shifted to match the new keyframe map), add `opacity` to the style object at 915–922, delete `data-act3` (914) and the `["--helix-fade-target"]` line (921). **Then delete globals.css:706–712 — both the `transition: opacity 520ms` and the `[data-act3]` rule** — or the CSS transition will tween Motion's per-frame inline writes. The reduced-motion block at 714–718 goes with it.

**(e) Hand-rolled backface culling.** 39 per-frame motion values reimplement what the compositor does free, and less correctly — the flip is a step function, and under `perspective-origin: 50% 48%` an off-centre card still has visible width at local 90°. Fix: add `backface-visibility: hidden; -webkit-backface-visibility: hidden;` to `.helix-card-face, .helix-card-back` (globals.css:720–726) and delete its `will-change: opacity`; delete `worldRotY`/`faceOpacity`/`backOpacity` (883–895); make `HelixCardFaces` (929–949) plain divs with no style prop; **update the reduced-motion branch call at page.tsx:906 too or the build breaks**; drop the `sceneRotateY` prop from HelixCard's signature (838, 844) and both call sites (1042, 1119). **Verify in Safari through a full 360°** — nested `preserve-3d` + `backface-visibility` is the one case WebKit has historically flattened; if both faces show, separate them with `translateZ(±0.5px)` rather than reverting.

**(f) Act captions double-expose.** All three `.cinematic-stage` blocks are absolute in the same box; `activeStage` flips at a hard threshold and both stages run identical 520ms fades, so for ~260ms two serif headlines sit superimposed at 50% and their blurred `::before` scrims stack. Fix: globals.css:856–858 → `transition: opacity 220ms cubic-bezier(0.25,0.46,0.45,0.94), transform 220ms …`, and add to the `[data-active="true"]` rule (884–887) `transition-duration: 380ms; transition-delay: 240ms;`. CSS reads timing from the after-change style, so entering picks up the delay and leaving does not — the outgoing headline is gone before the incoming one starts.

**Subsumes:** `cinematic-scene-fixed-px-poses`, `cinematic-rotation-rate`, `cinematic-linear-uneased-scrub`, `helix-setstate-per-scroll-frame` (×2), `helix-hand-rolled-backface`, `stage-crossfade-double-exposure`.

---

### 12. Make the live demo work
**Tier 1 · Effort M · `page.tsx:1260–1413`**

- **The interval never idles.** A 720ms `setInterval` starts on mount with `playing` defaulting true and loops forever — off-screen, in background tabs, and for reduced-motion users. Beyond the waste, it is why a visitor who scrolls to "This is what counting looks like." arrives mid-deal at an arbitrary running count instead of watching it build from zero. Fix: add a ref on the `<section>` (1285) plus an `IntersectionObserver` (`rootMargin: "200px"`, same shape as `Reveal` at 543–560), a `visibilitychange`-driven `tabVisible` state, and change the guard at 1263 to `if (!playing || !onScreen || !tabVisible) return;`. Separately, a mount-only effect: `if (matchMedia("(prefers-reduced-motion: reduce)").matches) { setDealt(liveDemo.length); setPlaying(false); }` — reduced-motion users land on the finished shoe with Play still available. `useReducedMotion()` returns `null` on first render, so read `matchMedia` in an effect, not the hook. Add `@media (prefers-reduced-motion: reduce) { .count-card { transition: none } }`.
- **On mobile the strip never follows the deal.** 16 cards × 54px + gaps = ~1044px inside a 350px `overflow-x-auto` container with no ref and no scroll effect. After the fifth card the "current" card with its emerald glow and `tag +1` is permanently off-screen; the visible cards stop changing while the stat row keeps ticking for eight seconds, so it looks frozen. Fix: `stripRef` on 1344, `data-idx={i}` per card, effect on `currentIndex` calling `scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'nearest', inline: 'center' })`. Add an edge affordance: `.count-strip { mask-image: linear-gradient(90deg, transparent 0, #000 24px, #000 calc(100% - 24px), transparent 100%) }`. Do **not** add scroll-snap — snap points fight programmatic smooth scrolling during a 720ms loop.
- **The shoe has no ending.** When `dealt` hits 16 the interval returns 0 on the very next tick, so all sixteen cards flip back to pending on the same beat as a normal deal. Replace the fixed interval with a self-scheduling `setTimeout` whose delay is `dealt >= liveDemo.length ? 1800 : 720`; store the id in a ref and clear it on cleanup.
- **The `tag +1` chip hard-pops 16× a cycle** while the card it labels glides over 400ms — two halves of one gesture on different clocks, and the jankiest single element on the page. Render it unconditionally with `data-shown={state === "current"} aria-hidden`, and in globals.css:1236–1250 **replace** the bare `transform: translateX(-50%)` at 1240 with `transform: translate(-50%, 4px); opacity: 0; transition: opacity 200ms cubic-bezier(0.2,0.7,0.2,1), transform 200ms cubic-bezier(0.2,0.7,0.2,1);` plus `.count-card__tag[data-shown="true"] { opacity: 1; transform: translate(-50%, 0); }`. Folding the existing X-centring into both states is load-bearing.
- **RESET silently overrides PAUSE:** page.tsx:1316–1319 calls `setPlaying(true)` unconditionally. Change to `setDealt(0)` only.
- **Contradictory ARIA:** delete `aria-pressed={!playing}` at 1325 — with a swapping label a screen reader announces "Play, pressed". The label alone is unambiguous. It is the file's only `aria-pressed`.
- **AT:** put `aria-hidden="true"` on the **inner** `min-w-max` div (1345) — not the scroll container, which becomes focusable — so the ten undealt ranks are not announced and the demonstration is not spoiled. Restore the meaning as one status line after the stat grid: `<p className="sr-only" role="status">{dealt} of {liveDemo.length} cards dealt. Running count {tagLabel(runningCount)}.</p>` (`.sr-only` is already in use at page.tsx:1477). Add `tabIndex={0}` to the scroller (1344) for Safari/Firefox. **Do not remove the suit glyph** from the rank span — corner index + centre pip is standard card anatomy.

**Subsumes:** `live-demo-ignores-reduced-motion`, `demo-interval-never-idles`, `demo-strip-no-autoscroll`, `count-tag-and-restart-snap`, `demo-deal-mechanical`, `demo-controls-state-jank` (state half), `pause-button-contradictory-aria-pressed`, `demo-card-strip-keyboard-and-at`.

---

### 13. Fix the carousel's dead transition and preload its neighbours
**Tier 1 · Effort S · `page.tsx:2417–2461`, `globals.css:531–548`**

`.carousel-slide.enter-left`/`.enter-right` (535/540) and `.carousel-slide.active` (545) have identical specificity and `.active` is declared last — and page.tsx:2454 applies `active` unconditionally alongside the phase class. The authored 520ms transition is unreachable. The actual UX is 180ms of nothing followed by a hard cut, and rapid clicks stack overlapping timeouts and can double-advance.

`motion` is already imported. Delete `.carousel-slide` / `.enter-left` / `.enter-right` / `.active` (531–548) and the `phase` state plus the 180ms `setTimeout` (2419–2427). Track direction with the index: `const [[index, dir], setState] = useState<[number, 1|-1]>([0,1]); const go = (d) => setState(([i]) => [(i + d + screenshots.length) % screenshots.length, d]);`. Wrap the slide in `<AnimatePresence mode="wait" initial={false}>` with `<motion.div key={index} initial={{opacity:0, x: dir*24}} animate={{opacity:1,x:0}} exit={{opacity:0, x: dir*-24}} transition={{duration:0.22, ease:[0.2,0.7,0.2,1]}}>`. `mode="wait"` sequences exit-then-enter with no timer. Add `aria-live="polite"` to the `{current.alt} · 01 / 10` label (2447–2451). Do **not** add a container `onKeyDown` — both arrows are already focusable buttons.

**Also:** only one `<Image>` is ever mounted, so the next slide is not requested until after the transition commits, and it renders into `.phone-mock__screen` which is `background: #000` — a black rectangle in the bezel on every first-pass advance. Mount `prevIndex` and `nextIndex` images absolutely positioned with `aria-hidden` and `style={{opacity:0, pointerEvents:'none'}}` (**not** `display:none` or `hidden`, which suppress the fetch), and add `sizes="320px"` to all three. Do **not** add `placeholder="blur"` — `screenshots` holds string paths, not static imports, so Next cannot generate a `blurDataURL` and the prop throws.

**Subsumes:** `carousel-transition-is-dead-code` (×2), `carousel-no-adjacent-preload`.

---

### 14. Fix the header logo's declared aspect ratio
**Tier 1 · Effort XS**

The source PNG is 911×288 (ratio 3.1632). `SiteHeader.tsx:132–133` declares `220×60` (3.667) and `SiteFooter.tsx:14–15` declares `320×90` (3.556), while the class is `h-9 w-auto`. The browser reserves 132px from the attribute ratio and then paints 114px — an 18px collapse inside a `justify-between` row, which nudges the entire desktop nav on every cold load, in the most-looked-at 64px of the page.

`SiteHeader.tsx:132–133` → `width={114} height={36}`. `SiteFooter.tsx:14–15` → `width={177} height={56}`. Two traps: do **not** use `911×288` (next/image derives its srcset from the `width` prop — that jumps from `w=256/640` to `w=1080/1920`), and do **not** add `sizes` (supplying it switches Next from `imageSizes` to `deviceSizes`, whose smallest entry is 640px). Ratio error at 114/36 vs. true is 0.13px.

**Subsumes:** `logo-declared-aspect-ratio-wrong`.

---

### 15. Accessibility and navigation defects (batch)
**Tier 1 · Effort M · several files, all small and independent**

Root cause across all of these: the structure is right and the last wiring step is missing.

| # | Defect | Fix |
|---|---|---|
| a | **`ChapterMark` hides the wrong half.** page.tsx:632 is `<span aria-hidden> · {title}</span>` — the separator *and* the title. All fifteen chapter titles are silently dropped; AT users hear a bare roman numeral. | `<span aria-hidden> · </span><span>{title}</span>`. Byte-identical rendering. |
| b | **No skip link; `<main>` has no id.** `grep skip src` → 0 hits. | Add `id="main" tabIndex={-1}` to all four `<main>`s (page.tsx:2654, privacy:9, terms:8, delete-account:8) — `tabIndex={-1}` is required or Safari moves scroll but not focus. Add `<a href="#main" className="skip-link">Skip to content</a>` as the first child of `<body>` (layout.tsx:56). Style with `:focus` (not `:focus-visible`) in the site's idiom: mono, wide-tracked, `--ink-0` ground, hairline emerald border. |
| c | **No `scroll-padding-top`** anywhere, with `scroll-behavior: smooth` and a 64px sticky header. On mobile `.section-rhythm` resolves to its 4rem floor — exactly the header height — so chapter marks land pinned against the header. Also fails SC 2.4.11 for backward-tabbed focus. | One line in the `html` block (globals.css:53–57): `scroll-padding-top: 5rem;`. Pairs with (b). |
| d | **Header breakpoint collision.** The Download pill is `hidden sm:block` (≥640) and the hamburger `md:hidden` (<768), so between 640–767px both render while the primary nav is still hidden — and the drawer offers the same action twice more. | `SiteHeader.tsx:144` → `hidden md:block`. Do **not** move the hamburger to `sm:hidden` — that leaves 640–767px with no navigation at all. |
| e | **Mobile drawer has no dismiss, no scroll lock, no animation**, while `DownloadDropdown` sixty lines above implements both dismiss paths. Two behaviourally different disclosures in one 211-line component. | Extract the effect at 57–71 into a `useDismiss(open, setOpen, ref)` and call it from both. Add `toggleRef` + `focus()` on Escape, `aria-controls="mobile-nav"` / `id="mobile-nav"`, `onClick={() => setOpen(false)}` on the two store links (186–204), and `document.body.style.overflow` lock. Animate by rendering the drawer unconditionally with `data-open` and the site's own `.faq-body` grid-rows technique — **and `inert` when closed**, or five links and two CTAs live permanently in the mobile tab order. |
| f | **`DownloadDropdown` claims `role="menu"` it does not implement.** No arrow-key handling, no focus move; NVDA/JAWS switch to application mode and hand arrows to a widget that ignores them. Escape also unmounts the focused element, dropping focus to `<body>`. | Downgrade to the disclosure it already is: delete `aria-haspopup="menu"` (78), `role="menu"` (87), both `role="menuitem"` (91, 102); add `id="download-trigger"` + `aria-labelledby`; add `triggerRef` and `.focus()` in the Escape branch. Do not build a menu widget for two links. |
| g | **Three cinematic `<h2>`s in the a11y tree at once** — `opacity: 0` does not hide. Two phantom top-level headings land in the outline before any real section. | `aria-hidden={activeStage !== N}` and `inert={activeStage !== N}` on the three stage divs (1127, 1142, 1157). React 19.2 takes `inert` as a real boolean — do not write `inert=""`. |
| h | **FAQ answers stay in the a11y tree when collapsed**, contradicting `aria-expanded="false"`; toggle and panel have no programmatic link. | After globals.css:592: `.faq-body > div { visibility: hidden; transition: visibility 0s linear 400ms; }` and `.faq-body[data-open="true"] > div { visibility: visible; transition-delay: 0s; }` — 400ms exactly matches the existing grid-rows transition. Wire `id`/`aria-controls`/`aria-labelledby` using the existing zero-padded `number` prop. Do **not** add `role="region"` (seven landmarks of noise). |
| i | **All three legal pages inherit the homepage `<title>`.** `export const metadata` appears once, in layout.tsx:24, with no `title.template`. | Add a `metadata` export to privacy, terms and delete-account. All three are server components (verified — no `"use client"`). **Do not touch page.tsx**, which *is* `"use client"` and would break the build. |
| j | **Footer column labels are `<p>`; two sections have no heading at all.** report.json independently flags desktop sections 4 and 16 with `"heading": ""`. | SiteFooter 25/65/72 `<p>` → `<h2>` keeping classes verbatim (Preflight resets heading size/weight/margins and `.text-label` sets everything explicitly, so it is pixel-identical); add ids + `aria-labelledby` on the `<ul>` and social row; wrap the nav list in `<nav aria-labelledby="footer-navigate">`. page.tsx:1501 `<p className="text-chapter">Epigraph</p>` → `<h2>` (promote, don't duplicate). TestimonialsSection: `aria-labelledby="voices-heading"` on the `<section>` + `<h2 id="voices-heading" className="sr-only">What students say</h2>`, matching the ProofStrip pattern at 1475–1479. |

**Subsumes:** `chaptermark-hides-the-wrong-half`, `no-skip-link`, `sticky-header-obscures-focus-and-anchors`, `anchor-scroll-margin-missing`, `header-breakpoint-collision-640-767`, `mobile-drawer-unfinished`, `mobile-drawer-no-dismiss`, `download-dropdown-fake-menu-role`, `download-dropdown-incomplete-menu`, `cinematic-three-h2-in-a11y-tree`, `faq-collapsed-answers-still-announced`, `legal-pages-share-homepage-title`, `footer-group-labels-not-headings`, `sections-without-headings`.

---

## PHASE C — Tier 2: the janky→professional upgrade

### 16. De-pill the buttons, apply the radius tokens, fix the control borders
**Tier 2 · Effort M**

**Root cause:** no radius rule existed, so ten values accumulated and the CTAs landed on 999px. Fixing the pills without declaring the scale just adds an eleventh number.

Apply `--r-ui: 0` (from item 4) to: `.btn-primary` (252), `.btn-ghost` (276), `.btn-store` (321), `:focus-visible` (79), `.edge-chart__tooltip` (1152), `.count-card__tag` (1248), `.formula-card` (1257); and in TSX replace `rounded-md` (page.tsx 1307, 2044), `rounded-lg` (SiteHeader.tsx:88), `rounded-full` (page.tsx 2470, 2487 — the carousel arrows become sharp-cornered squares matching the buttons they sit beside).

Apply `--r-card: 10px` to `.playing-card` (1034, was 12), `.count-card` (1180, was 8), `.helix-card-face/back` (724, already 10), and set `.helix-card-back::before` (752) to **5px** so it is concentric with its 5px inset (currently 6px).

Leave alone: `.phone-mock` (40/26 with 14px padding is already correctly concentric — the only real-world device on the page) and the two circular dots.

**Control borders (SC 1.4.11).** For `.btn-ghost` and `.btn-store`, the 1px border *is* the component — `.btn-store`'s fill is `--ink-1` at 1.06:1 against ink-0, so strip the border and the control vanishes. `--rule-strong` (#3f3f46) measures 1.89 / 1.81 / 1.70:1. Swap to `var(--control-edge)` (#64646f → 3.39 / 3.23 / 3.03:1, same hue 240° and saturation, value only) at globals.css:277 and 322. For the carousel arrows, which use the Tailwind class `border-rule-strong` and not a raw var, add `--color-control-edge` to `@theme inline` and change the className. **Leave `--rule` and `--rule-strong` untouched on every decorative hairline** (globals.css 201–203, 405, 413, 518, 1128, 1150, 1246, 1256, 1302; page.tsx 2026, 2044, 2306) — 1.4.11 exempts them and lifting them would collapse the editorial character.

**Store button sizing.** `.btn-store` sets `display: inline-flex; gap: .75rem` but no `justify-content`, and page.tsx:1197 is `flex flex-col sm:flex-row gap-3` — so below 640px each badge stretches to the full 350px column with its content pinned hard-left and half the capsule empty. The cream `btn-store-primary` is the brightest and emptiest object in the mobile hero. Fix: page.tsx:1196 → `flex flex-col items-start sm:flex-row sm:items-center gap-3` (shrink to content — `flex-wrap` does *not* work, two badges need ~180px each at 390px), add `justify-content: center` to `.btn-store` for the pricing-card case where the parent legitimately stretches them, and `min-width: 11rem` so App Store and Google Play match each other exactly (their natural widths are ~172px; 11rem is a ~4px nudge, not an enlargement).

**Add press states.** The compiled sheet contains **zero** `:active` rules, while `-webkit-tap-highlight-color: transparent` removes the only press affordance mobile browsers provide. Declare each `:active` *after* its matching `:hover` (equal specificity — source order decides): `.btn-primary:active, .btn-ghost:active, .btn-store:active { transform: translateY(0) scale(0.985); transition-duration: 90ms; }`, `.download-menu-item:active { background: var(--ink-2); }`, `.faq-toggle:active .faq-toggle-icon { color: var(--emerald); }`, and `active:border-paper` on the carousel arrows. No new colours.

**Animate the download chevron** in the pattern already sitting eleven lines away in the same file (`.faq-toggle[aria-expanded="true"] .faq-toggle-icon`): wrap the chevron and add `.btn-primary[aria-expanded="true"] .btn-primary__chevron { transform: rotate(180deg) }` with a 200ms house-bezier transition. Animate the panel with `data-open` + `opacity`/`translateY(-4px)` instead of `{open && …}`.

**Subsumes:** `radius-language-fragmented`, `radius-scale-undefined`, `store-buttons-full-width-pills-on-mobile`, `store-badges-stretch-on-mobile`, `no-active-press-state-anywhere`, `control-borders-fail-non-text-contrast`, `download-dropdown-incomplete-menu` (visual half); implements already-confirmed problem 1.

---

### 17. Give the demo controls a body
**Tier 2 · Effort S**

RESET / PAUSE / NEXT are bare `link-mono` text measuring 49×19, 49×19, 68×19 at both viewports — visually indistinguishable from the non-interactive `HI-LO · RUNNING COUNT` label opposite them. And the middle label swaps between 5 and 4 characters at 0.78rem/0.18em inside a right-aligned group, so RESET jumps sideways on every toggle.

```css
.demo-control {
  display: inline-flex; align-items: center; justify-content: center;
  min-height: 2.75rem; padding: 0.55rem 0.85rem;
  border: 1px solid var(--rule); color: var(--paper-muted);
  border-radius: var(--r-ui);
  transition: border-color 200ms ease, color 200ms ease;
}
.demo-control:hover { border-color: var(--rule-strong); color: var(--paper); }
.demo-control:active { background: var(--ink-2); }
```
`min-height: 2.75rem` must be in the base rule with `inline-flex` + `align-items: center` — 0.55rem padding on a 12.48px font only reaches ~35px. Add `min-width: 8ch` to the Pause/Play button **only**, so the label swap cannot move its neighbours; padding RESET and NEXT to 8ch over-widens them. A hairline-boxed control is native to this vocabulary. (State fixes for these buttons are in item 12.)

**Subsumes:** `demo-controls-state-jank` (visual half); implements already-confirmed problem 2.

---

### 18. Collapse the micro-label sprawl into three roles
**Tier 2 · Effort M · requires item 2**

The mono label is the most repeated element on the page and has no token: ten distinct micro sizes (0.58–0.78rem) and eleven letter-spacings (0.08–0.30em) across nine classes plus eighteen hand-rolled `font-mono text-[…] tracking-[…] uppercase` triples in JSX. The one instance a reader can actually perceive: `.text-chapter` (0.78rem) and `.cinematic-chapter` (0.72rem) are the *same semantic element* — the chapter/act eyebrow, same 0.30em tracking, same emerald — rendered at two sizes in one document.

```css
.label-lg { font-family: var(--font-mono-stack); font-size: .75rem; letter-spacing: .28em; text-transform: uppercase; }
.label    { font-family: var(--font-mono-stack); font-size: .6875rem; letter-spacing: .2em; text-transform: uppercase; }
.label-sm { font-family: var(--font-mono-stack); font-size: .625rem;  letter-spacing: .2em; text-transform: uppercase; }
.mono-data{ font-family: var(--font-mono-stack); font-size: .75rem;  letter-spacing: .04em; font-variant-numeric: tabular-nums; }
```
`.label-lg` absorbs `.text-chapter` (139) and `.cinematic-chapter` (911) so `§ VII · THE JOURNEY` and `Act II · The Helix` finally match. `.label` absorbs `.text-label`, `.link-mono`, `.download-menu-item`, `.count-card__tag` and most JSX instances. `.label-sm` takes `.btn-store__meta`, `.edge-chart__tooltip-tc` and fine print. `.mono-data` (non-uppercase) takes count values and Hi-Lo rule strings. **Set no `color` on any of them** — colour stays a utility decision, which is only possible after item 2. Then delete the inline triples in page.tsx and SiteFooter.tsx.

**Subsumes:** `micro-label-type-sprawl`.

---

### 19. Bind the Fraunces SOFT axis to type role; delete all 17 inline overrides
**Tier 2 · Effort M**

**Root cause:** `.font-display` sets `font-optical-sizing: auto` on line 92 and cancels it on line 93 with a literal `"opsz" 144` — per spec an explicit `opsz` in `font-variation-settings` overrides the property. Every display element renders at Fraunces' 144pt optical master regardless of size, so `.text-display-xl` at its mobile floor gets 144pt hairlines and reads thin and fragile. Downstream, thirteen distinct `(SOFT, opsz)` pairs are pasted inline across 17 call sites with no relationship to rendered size — three h3s with the *identical* size class carry SOFT 70 / 75 / 80, rendering as three slightly different faces for one role.

Two competing fixes were proposed (fixed `.fv-*` classes vs. a `--soft` custom property). **Take the `--soft` version** — it also repairs the optical-sizing bug, which the class version does not.

- `globals.css:90–96` → `font-variation-settings: "SOFT" var(--soft, 50);` — drop `"opsz" 144` entirely so `font-optical-sizing: auto` functions and tracks the fluid `clamp()` at every viewport. This is the load-bearing edit.
- Set `--soft: 50` on `.text-display-xl/lg/md` and `.playing-card`; `--soft: 80` on `.title-md` / `.title-sm` (from item 2), which is where all ten subheads land; `--soft: 100` on `.text-stat`, `.formula-glyph` and `.font-display em`.
- Delete every `style={{ fontVariationSettings: … }}` in page.tsx (1295, 1448, 1504, 1509, 1568, 1630, 1703, 2114, 2171, 2218, 2260, 2316, 2359, 2386, 2521, 2560, 2626) and in privacy:196 / terms:224 / delete-account:116.
- `.font-display-soft` is deleted in item 3; `--soft: 100` replaces it.

The axes are genuinely loaded (`layout.tsx:8` requests `["SOFT","opsz"]`), so this is not a no-op. Diff the drill names, reference labels and badge categories at 1440px — they should now match.

**Subsumes:** `fraunces-axis-uncontrolled`, `inline-font-variation-settings`.

---

### 20. Return emerald to being an accent
**Tier 2 · Effort S**

**Root cause:** `.text-chapter` colours the entire chapter line, so all fifteen `§ VII · THE JOURNEY` marks are full emerald mono strings — the largest emerald surface on the page by a wide margin — plus three act marks. On top of that, drill metadata at page.tsx:1635 renders `TIMED · 2–4S PER HAND`, `EASY · MEDIUM · HARD` etc. in emerald; desktop-04.png shows six emerald strings in one viewport, none of them marking emphasis. When the accent carries the structure it has nothing left to signal — which is why the pricing badges do not read as special even after item 2 makes them emerald.

- In `ChapterMark` (617–633): leave the `§` glyph and the roman `motion.span` inheriting emerald, add `text-paper-faint` to the trailing `<span aria-hidden> · </span><span>{title}</span>` from item 15a. Reads as a printer's section mark, not a highlighted line. Same split on `.cinematic-chapter` (1131/1146/1161).
- page.tsx:1635 → `text-paper-faint`. Difficulty and timing metadata is not emphasis.
- **Leave alone:** the medal `Legend 98%` (1659), `TierBadge` (1524–1531 — amber at 1529 marks the distinct Free→Premium state and *does* carry meaning), the comparison emphasis row (2314), and the achievement counts (2264). Emerald there marks real state.

**Subsumes:** `emerald-is-the-default-not-the-accent`.

---

### 21. Fix the four composition defects the grid fix exposes
**Tier 2 · Effort S · requires item 1**

- **Pricing cards are not peers.** Premium's heading carries `mt-2` (2381) to clear an absolutely-positioned "Recommended" badge (2380), so the titles do not share a baseline; Premium has a plan line Free lacks, so the lists start ~45px apart; Free uses `<StoreButtons />` and Premium `<StoreButtons primary />`, so the CTAs differ in colour and the badge rows are ~50px out of register; and Premium is `bg-ink-2` while Free is `bg-ink-0` — a surface split that appears in none of the site's other three `gap-px bg-rule` grids. Fix: move "Recommended" into the same `flex items-baseline justify-between` row the "Forever" badge occupies (2363) and delete `mt-2` + `relative`; add a plan line to Free in Premium's slot (`No subscription`); move Premium's footnote (2407–2409) *above* `StoreButtons` (`mt-5`→`mb-5`) so `StoreButtons` is the last flex child in both and the badge rows land on one baseline with no spacer hack; set Premium to `bg-ink-0` and signal it with the `--rule-strong` border the system already reserves for emphasis. Use `primary` on both or neither.
- **The two Math panels are peers on different papers.** Left is `.formula-card` (`--ink-1` fill + a 4%-alpha emerald radial wash); right is flat `--ink-0`. Currently latent because their container is one of the comma-broken grids. Set `.formula-card` (globals.css:1255–1263) to `background: var(--ink-0)` and delete the radial layer — a 4% wash on one of two adjacent panels is invisible as an effect and visible as an inconsistency. Radius is handled by item 16.
- **The footer email underline spans the column.** `.link-underline` paints `background-size: 100% 1px` — correct inline, wrong the moment the element is `display: block`. report.json measures the anchor at 1200×24 desktop / 350×24 mobile (so this is *not* contingent on the grid fix), producing a full-width emerald hairline that reads as a section divider. `SiteFooter.tsx:68` → `inline-block`, move `mb-6` to a wrapper. Optionally harden: `width: fit-content` on `.link-underline` (216).
- **Counting-systems titles start at a different x on every row.** `auto` is resolved per row because every `.editorial-row` is its own grid container, and the first track is `max(7rem, widest label in that row)`. Measured drift in desktop-05.png: 424 / 399 / 411 / 410 / 411 / 445. Fix: `.editorial-row { grid-template-columns: var(--row-gutter, auto) minmax(0,1fr) var(--row-meta, auto) }`, set `--row-gutter: 11rem` on the counting-systems wrapper (1690), delete `min-w-[7rem]` (1694 — item 10 also requires this). 11rem clears `LEVEL III · FRACTIONAL` (~172px). **Curriculum and comparison need nothing** — their gutters are already fixed (`w-12`, `w-10`) and their third track is right-flush or hidden.

**Subsumes:** `pricing-cards-not-peers`, `pricing-cards-misaligned`, `two-panel-treatments-side-by-side`, `link-underline-spans-container-on-block-elements`, `footer-email-underline-spans-page`, `editorial-row-columns-ragged`.

---

### 22. Draw a belt as a belt
**Tier 2 · Effort S**

`page.tsx:302/309` hard-code `#60a5fa` and `#a78bfa` as raw hex literals — two hues declared nowhere in globals.css and present nowhere in the product's world (there is no reason Card Disciple is violet). The markup renders them as a 48px `rounded-full` ring around a 14px dot with `boxShadow: 0 0 20px ${color}55`. It is the only coloured glow on the page, the only circle outside the demo progress dots, and the most generic-SaaS element in the design (mobile-09.png).

Replace the medallion (2153–2166) with the object the rank is literally named after: `<div className="h-2 w-12" style={{ background: b.color }} />` at `--r-ui: 0` — no ring, no `boxShadow`. Map the ranks onto tokens that already exist: Blue Belt → `--paper-ghost`, Card Disciple → `--paper-faint`, Advantage Player → `--paper-muted`, Dojo Legend → `--emerald`. The progression then reads as "the belt gets brighter". **This is not a palette change** — it removes two hues the palette never declared. If you want to keep the literal blue of "Blue Belt", keep it; the violet and the glow have no defence.

**Subsumes:** `off-palette-belt-colors-and-glow`.

---

### 23. Edge chart: legibility, timing, pointer
**Tier 2 · Effort S**

- **Axis labels render at ~5.2px on a phone.** The SVG is `viewBox="0 0 640 340"` at `width: 100%` inside a `p-6` card in the 350px shell → render box ~300px → uniform scale 0.469, and `.edge-chart__tick-label { font-size: 11px }` is in viewBox user units. The axis annotations of the section carrying the site's central claim are physically unreadable. Fix: `@media (max-width: 767px) { .edge-chart__tick-label { font-size: 23px; } }` → 10.8 CSS px, matching desktop.
- **The entrance takes 2.2s and paints the fills ahead of the lines that bound them.** desktop-06.png captures a fully-shaded green wedge reaching TC +8 with the green line drawn only to TC +3, an amber wedge to the left edge with its line stopping near TC 0, and no markers anywhere. It reads as broken, not as animated. Fix: convert the two area paths (1881–1882) to `motion.path` with `initial/whileInView` opacity, `viewport={{ once: true, amount: 0.25 }}`, `duration: 0.5, delay: 0.4`; retime the strokes to `duration: 0.75, ease: "easeOut"` with the second at `delay: 0.18` so the curve reads as one continuous stroke crossing zero; markers at `delay: (reduced ? 0 : 0.7) + (p.tc + 5) * 0.03`. Loosen `amount: 0.4` → `0.25` at 1893/1905/1922. Guard the fills with `reduced` like everything else in this chart.
- **Touch tooltip never clears.** Only `onMouseMove`/`onMouseLeave` are bound; mobile browsers synthesize mouse events on tap, so the tooltip appears and stays. Switch to `onPointerMove` / `onPointerLeave` / `onPointerCancel` (the handler reads `e.clientX` identically). Do **not** add `touch-action: none` — it would swallow vertical pan over a full-width chart and trap the user's scroll.

**Subsumes:** `edge-chart-illegible-at-mobile`, `edge-chart-entrance-too-slow`.

---

### 24. Move the hero fan's entrance to the viewport
**Tier 2 · Effort XS**

`HeroCardFan` springs five cards in on mount with 0.05–0.57s stagger, but the fan sits at roughly y 948–1308 in a 1371px hero at 1440×900 — entirely below the fold, confirmed in desktop-00.png. The entrance fires on load where nobody can see it, competing with video decode and hydration, and by the time a visitor scrolls there the cards are settled. Change `animate={…}` (page.tsx:745) to `whileInView={…}` and add `viewport={{ once: true, amount: 0.35 }}`, matching `ChapterMark` and `EdgeChart`. The existing `initial` already resolves to the settled pose under reduced motion. **Do not** cap the hero at the fold or shrink its padding — that recomposes the hero and risks clipping the fan.

**Subsumes:** `hero-fan-entrance-below-fold`.

---

## PHASE D — Tier 3: craft and maintainability

### 25. Performance and hygiene
**Tier 3 · Effort S**

- **(a) `will-change` never released** on ten selectors, ~100 elements promoted for the whole session. Delete it from `.reveal` (457 — 22 one-shot text blocks whose observer calls `io.disconnect()` after the single transition; this also fixes the uneven hairline rasterization in item 9), `.btn-primary` (255), `.btn-store` (326), `.playing-card` (1049 — its transform lives on the parent `motion.div`), and `.helix-card-face/back` (725, removed by item 11e anyway). **Keep** it on `.count-card` (genuinely animates 16 elements per tick, and item 12 now gates that to on-screen) and on the scroll-driven cinematic set (`.cinematic-scene`, `.helix-card`, `.cinematic-suit`, `.cinematic-stage`). Optionally scope the cinematic four to `.cinematic-section[data-active="true"]` using an IntersectionObserver on the ref the component already holds at page.tsx:993.
- **(b) Re-export the ten carousel screenshots.** 1284×2778 PNGs totalling 9,744,472 bytes on disk (one is 2.6 MB) rendering into a 320px phone mock. `cwebp -q 80 -resize 640 0` → well under 1 MB total with no visible difference.

**Subsumes:** `will-change-permanently-on`, `will-change-over-applied`, `permanent-will-change-112-layers`, `carousel-no-adjacent-preload` (asset half).

---

### 26. Structural refactors — do these LAST
**Tier 3 · Effort L**

All of these rewrite large parts of `page.tsx`. Landing any of them before Phase A–C turns every other item into a merge conflict.

- **`SectionHead` component.** The 12-line head block is copy-pasted verbatim ten times (`grep -c` confirms 10 and 10), which is why LiveCountDemoSection drifted to `[1fr,2fr]` / `mb-12` / `text-display-md` with nothing holding it to the pattern. Create `src/app/_components/SectionHead.tsx` (no `"use client"` — a server component may render the client leaf `ChapterMark`) with `{ roman, eyebrow, heading, lede }`, and a `.section-head` class in globals.css carrying the grid. Promote LiveCountDemo's heading to `text-display-lg` so the display scale has one size for section heads. **Deliberately do not add a `size` prop** — a prop is how the drift got in.
- **Content extraction to `src/content/`.** ~470 lines of marketing claims live as module constants inside the component file, and AGENTS.md §2 requires every claim to be auditable against the app source — there is no file a copy reviewer can open. Move each array with its type beside it, `as const satisfies T[]`. Include `cards.ts` resolving the three overlapping card types (`PlayingCardFace` 637–640, `Card` 1226, `CinematicCardData` 763 — one shape, three names, with the suit union spelled twice), and type `PIP_LAYOUTS` as `Partial<Record<…>>` so the existing runtime guard at 698 becomes type-required.
- **Deduplicate constants, icons and nav.** `APP_STORE_URL`/`GOOGLE_PLAY_URL` declared twice; both store SVGs declared twice with byte-identical 340-char path data under two names; the nav list in three places, already drifted (`#curriculum` in page.tsx:2645 vs `/#curriculum` in SiteHeader.tsx:15, plus seven hardcoded `<li>`s in the footer). Create `src/content/site.ts` (use the `/#anchor` form — it works from the legal pages), `src/app/_components/StoreIcons.tsx` with a `className` default of `w-5 h-5` and SiteHeader passing `w-4 h-4` at its four call sites, and **delete the `links` prop from SiteHeader** — that prop exists only to inject a second copy of the list.
- **Split `page.tsx`.** 2678 lines, 25 components, 14 data arrays, pose math, an SVG chart and the cinematic engine, with `type Card` declared at 1226 and read at 690. One file per section into `src/app/_sections/`, shared leaves into `_components/`. Push `"use client"` down to the five stateful components (CinematicSequence, LiveCountDemo, EdgeChart, ScreenshotsSection, FaqItem) plus the Reveal/ChapterMark/HeroCardFan leaves; every other section becomes an RSC. Move `CinematicSequence` and `EdgeChart` as whole files — splitting them would export `Pose`, three pose functions and MotionValue-typed props across a boundary for no gain. **This pass must be pixel-identical**: verify with `npx tsc --noEmit`, `npm run test:cinematic`, and full-page screenshot diffs at 1440px and 390px.
- **Chapter renumbering** — see "deliberately not doing", item 3.
- **Tests.** Delete `tests/cinematic-screenshots.mjs` (48 lines, zero assertions, no exit code, output hardcoded to `/tmp/cinematic`, duplicates `scrollToProgress` with a different wait). Add the cheap guard that would have caught item 1 at edit time: `"lint:classes": "! grep -rnE 'grid-cols-\\[[^]]*,' src"` in CI. Add `tests/layout.mjs` asserting `getComputedStyle(el).gridTemplateColumns !== "none"` for `.section-head`, the hero grid and the footer grid, plus `document.documentElement.scrollWidth <= window.innerWidth` at 1440 and 390. **Assert on `"none"`, not on commas** — computed `grid-template-columns` resolves to used pixel values and never contains a comma, so the obvious test would pass on the broken page.
- **AGENTS.md is stale.** It states "no server routes, no middleware, no databases" and lists four routes; the repo now has `/admin/intel`, two `/api/admin/*` routes and `src/lib/supabase.ts`, added in the last five commits. The file's own preamble says "if something is no longer true, fix it in the same PR."

**Subsumes:** `section-head-duplicated-ten-times`, `content-mixed-into-presentation`, `duplicated-store-constants-icons-and-nav`, `page-tsx-file-split`, `tests-abandoned-and-blind-to-layout`, `agents-md-stale-about-server-routes`.

---

## Collision map — pairs that break if done out of order

| Must land first | Must land after | Why |
|---|---|---|
| **1** (grid commas) | 21 (pricing, two-panel, ragged gutter), 24/26 (SectionHead), 13 (carousel arrow column) | Those layouts have never rendered; tuning them against the broken single-column fallback wastes the work twice. |
| **2** (layering) | 18 (label scale), 20 (emerald split), 17 (`.demo-control` colour) | Until layered, `.text-label`/`.link-mono` hard-coded colours beat every utility, so any colour work silently no-ops. |
| **2** (remove `.font-display` line-height + add `.title-*`) | — | Layering *alone* leaves h3s at `text-2xl`'s 1.33 leading, too loose for display serif. The two halves must ship together. |
| **3** (delete dead code) | 16 (radius), 18 (labels), 19 (SOFT) | Dead rules otherwise get folded into the new scales and become permanent. |
| **3** (delete `@layer utilities`) | 16 (`border-control-edge`) | Add the token to `@theme inline`; do not re-create a hand-written utilities block. |
| **4** (declare tokens) | 16, 17, 19 | Otherwise the de-pilling introduces an eleventh ad-hoc radius. |
| **8** (FAQ padding move) | — | Must include the `pb-2` → `pb-6` compensation in the same edit or every open answer tightens against the next rule. |
| **9** (hairlines) | — | Must include the `.reveal` `will-change` deletion from 25a, or seams still rasterize at 1px/2px. |
| **10** (`.editorial-row` mobile) | 21 (`--row-gutter`) | Both edit the same rule and both require deleting `min-w-[7rem]` at page.tsx:1694. Do 10 first. |
| **11a–f** (cinematic) | — | Atomic. The keyframe remap, the Act III fade window (0.78 → 0.76), the act thresholds and the `will-change`/backface edits all reference the same numbers. |
| **11d** (fade → motion value) | — | Deleting the CSS `transition: opacity 520ms` is load-bearing; leaving it makes a 520ms tween fight per-frame inline writes. |
| **12** (demo state) | 17 (demo control styling) | Same three buttons; do state then chrome, or re-edit. |
| **13** (AnimatePresence) | — | Deletes `.carousel-slide` CSS *and* the `phase`/`setTimeout` machinery. Half-doing it leaves a hard cut. |
| **All of A–C** | **26** (file split, content extraction) | The split must be move-only and pixel-identical. Any behavioural edit landing during it is unreviewable. |

**Recommended commit boundaries:** (1) grid commas alone. (2) layering + line-height + `.title-*` + dead code + tokens. (3) each Tier 1 item as its own commit. (4) Tier 2 grouped by file region. (5) refactors last, each with a screenshot diff.

---

## Deliberately not doing — where the audit overreached

The user said they like the look. These would change it without a defect to justify the change.

1. **Squaring the dots.** The radius proposal wanted `.dot-emerald` (50%) and `.cinematic-progress__dot` (999px) moved to `--r-ui: 0`. A bullet and a progress indicator are *marks*, not chrome; circular is correct and universally legible. The pill problem is about button-shaped things being lozenges, not about every curve on the page. Keep them round.
2. **Re-sizing `.phone-mock`.** One lens proposed a `--r-device: 34px`. It is already correctly concentric at 40px outer / 26px screen with 14px padding, and it is the only real-world device on the page. Gratuitous.
3. **Renumbering the chapter sequence.** The audit found that `Demonstration` (page.tsx:1292) and `Epigraph` (1501) wear the chapter eyebrow style with no `§` and no numeral, and proposed converting both to `ChapterMark` and bumping all fifteen existing numerals. The observation is real. But "two deliberate unnumbered interludes between numbered chapters" is a completely legitimate editorial choice, and renumbering fifteen sections is content surgery on a device the author clearly designed. **Author's call — do not do it unilaterally.** If the answer is "they should have been numbered", the fix is exactly as specified in the finding.
4. **Lengthening the cinematic section from 260vh → 340vh (mobile 220 → 300vh).** Proposed to slow the helix rotation. But that adds 80vh of scroll to one decorative interlude — a real cost to every visitor for a section they must scroll *through*. Item 11b achieves the same effect by redistributing the rotation across more of the existing scrub (0.26 → 0.42 of the window, 0.96°/px → ~0.6°/px desktop) without changing how long the page is. If it still strobes after the remap, add 40vh, not 80.
5. **Lowering `.text-display-lg` and `.text-display-md` clamp floors.** One lens claimed the whole display scale is broken on mobile. It is not — measured against the actual renders, "Where the edge / actually lives." occupies 248 of 350px and "A casino, calibrated." 310px. Only `.text-display-xl` has evidence of harm. Shrinking the others is the aesthetic change the brief forbids.
6. **Removing the suit glyph from the demo count cards.** Proposed as "visual redundancy". It is the corner index against the centre pip — standard playing-card anatomy, and a design decision.
7. **Adopting `.eyebrow-rule`** (the 1.75rem emerald hairline before the eyebrow) into `ChapterMark`. It is dead code. Adopting it adds a new design device to fifteen sections. Delete it.
8. **Building a real ARIA menu widget** for the download dropdown. Two links do not need roving focus, arrow-key handling and application mode. Downgrade the roles instead (item 15f) — correct *and* less code.
9. **`role="region"` on the seven FAQ panels.** Seven landmarks of noise; the APG disclosure pattern makes it optional.
10. **Scroll-snap on the demo card strip** and **`touch-action: none` on the edge chart.** Both actively make things worse: snap points fight the 720ms programmatic scroll, and killing touch-action traps the user's vertical scroll over a full-width chart.
11. **Capping the hero at the fold** (`min-h-[88vh]` → `h-[88vh]` + `overflow-hidden`, or shrinking `md:pt-40 md:pb-32`). Recomposes the hero and risks clipping the card fan. Item 24 solves the actual problem in two lines.
12. **Adding a `size` prop to `SectionHead`.** A prop is the mechanism that let LiveCountDemo drift to a smaller display step in the first place.

**One thing that is not overreach but does add a visible element:** the hero "Pause film" toggle (item 6d). It is a Level A requirement for autoplaying motion longer than five seconds presented alongside other content, and it is the only new visible control in the entire plan. It is specified as two words of mono microcopy appended to the existing bottom strip with the separator already used there — no new layout, no media widget. If you reject exactly one item on aesthetic grounds, this is the one to argue about; the reduced-motion gate in the same item stands regardless.