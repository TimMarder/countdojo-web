# Tasks — Todo

Plan and progress for the current session. Per the global CLAUDE.md workflow:

1. **Plan first** — write checkable items here before implementing
2. **Track progress** — mark items complete as you go
3. **Document results** — append a review section per completed batch

## Active — heycatch audit fixes (branch `feature/audit-fixes`, 2026-11-15)

Source: heycatch site audit (D1 20/25 · D2 20/25 · D3 4/20 · D4 8.5/15 · D5 9.5/15 · FIT 6/10).
Truth source: live App Store listing (v1.18.0) + app clone `count-dojo/app/countdojo` @ `release/1.18.0`.

Decisions (user, 2026-11-15): show US prices with as-of note · store-refund line + value
anchor (no own guarantee) · founder = first name only, generic info · proof = dated App Store
rating badge only.

### Quick wins
- [x] Pro Tools tier card in pricing (FIT, D4.2)
- [x] Reconcile every count with the app — hero, proof strip, badges, reference, meta, captions (FIT, D2.1)
- [x] Concrete US prices + annual savings under each tier (D4.3, D4.4)
- [x] Quantity proof block near pricing — dated App Store rating (D3.1, D3.5)
- [x] Refund/billing line + value anchor under Premium CTA (D3.4, D4.3)
- [x] FAQ: finite-shoe realism + hearts questions (D1.4); rewrite stale free/premium answer
- [x] Hero h1 names card counting (D1.1, D2.1)
- [x] sitemap.xml + robots.txt (D5.3, D5.5)
- [x] Alt text on every screenshot (D5.5)
- [x] 375px pass on hero + pricing (D2.5, D2.2)

### Do this quarter
- [x] /about page (first name, generic) + footer credit (D3.3) — story is a draft for founder edit
- [x] Dated third-party strip near testimonials (D3.5)
- [x] Testimonials — identity fields stubbed; needs re-sourcing by founder (D3.2)
- [x] /vs/blackjack-theory + /vs/blackjack-apprenticeship, linked from § X (D5.3, D1.4)

### Plan-silent findings
- [x] D1.2 name the buyer's pain in their words · D1.3 "hold the count at a real table" outcome
- [x] D2.2 low-commitment hero secondary CTA · D2.B say who it's not for
- [x] D5.5 JSON-LD (MobileApplication + Organization + FAQPage) + llms.txt

### Review (2026-11-15)
- Verified: `npm run build` (all routes static), `tsc`, `lint`, `test:cinematic` 9/9,
  `audit:a11y` clean, `audit:gallery` 0 errors, Playwright pass at 375×812 / 375×667 /
  1440×900 — no horizontal overflow, no sub-40px tap targets, hero CTA above the fold
  at 375×667 (top 584px). Store anchors: 7 Apple / 5 Google on `/`, all `_blank` + `noopener`.
- Found while reconciling: the site was far behind the app (30 vs 89 lessons, 19 vs 21
  drills, 65 vs 72 achievements, 10 vs 8 tools, 4 vs 6 presets, old free/premium model,
  "7 systems" when only Hi-Lo is trainable, no Pro Tools).
- Bonus fix: chapter numerals never appeared for reduced-motion users (pre-existing).

### Skipped (Bigger bets / deprioritized by plan)
- D2.3 cinematic section, D5.4 page weight — plan says "no change now"
