# Lessons

Patterns captured from user corrections and self-improvement loops. Per the global CLAUDE.md workflow:

- After ANY correction from the user, append the pattern here
- Write rules for yourself that prevent the same mistake
- Review at session start before starting new work

## Patterns

### Verify the app source is the *live* version before trusting it (2026-11-15)
- **What happened:** a fact-check agent read `count-dojo/app/release/countdojo`
  (frozen at v1.10.0) and reported "no Pro Tools tier, no hearts, 51
  achievements" — all wrong for the live v1.18.0 build. Caught only because
  the App Store listing contradicted it.
- **Rule:** before quoting any app fact, check the live store version
  (`itunes.apple.com/lookup?id=6760961014` → `version`), then read that exact
  release branch in `count-dojo/app/countdojo` via `git show release/X.Y.0:path`.
  Cross-check tiers/prices against the App Store listing's "In-App Purchases".
- **Rule:** when two sources disagree (agent report vs. store listing), find
  out *why* before picking one — the disagreement is usually the finding.
