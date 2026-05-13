# Plan: Legal Pages, Taco V3, Product Page Differentiation

## 1. Legal pages (new)

Add two routes scraped from anarix.ai (full content preserved verbatim, paragraph by paragraph — long-form policy text, not summarized):

- `/website/privacy-policy` → `src/website/pages/legal/PrivacyPolicy.tsx`
- `/website/terms-and-conditions` → `src/website/pages/legal/TermsAndConditions.tsx`

Both use existing `PageLayout`, calm document tone (Section 10, Zone 2):
- Single-column max-w-3xl, prose typography (Noto Sans body, Satoshi headings)
- H1 page title, H2 numbered sections, bullet/numbered lists
- `text.muted` for meta lines (effective date, contact)
- No animations, no expressive elements

Wire footer links in `Footer.tsx` to point to these routes (currently likely placeholder/anchor).

Routes registered in `src/App.tsx` under the `/website` block.

## 2. Taco animation v3 — use uploaded SVG

Replace hand-drawn SVG in `TacosSection.tsx` with the uploaded illustration (`user-uploads://7694390_copy.svg`, 500×500 viewBox, full taco with shell + lettuce + cheese + tomato + onion + ingredient orbit).

Steps:
- Copy file to `src/assets/illustrations/taco.svg` (so it can be inlined as a React component via `?react` query or fetched and inlined at build).
- Approach: inline the SVG paths directly into a React component `TacoIllustration.tsx` so we can apply an SVG `<mask>` to the entire taco group for the bite effect. Inlining is required because external `<img>` tags cannot have masks applied to inner paths.
- Bite mechanic: 
  - SVG mask covers the whole 500×500 canvas white, then a dark `ellipse` (rotated ~-20°) centered at upper-right of the taco shell (approx 360, 240) grows from 0 → 110×95 over 1.4s → masks out roughly 30% of the taco from the upper-right.
  - Bite edge gets a subtle inner ring (dashed `2 4`, brown stroke `#381F0E` at 30% opacity) following the ellipse.
- Crumbs: 6 small circles using the shell color `#FFC629` and `#F2721B`, falling from the bite radius with staggered opacity/translate (uses existing rAF easing).
- Ingredient orbit lines (the dashed lines at the bottom of the SVG) animate in via stroke-dashoffset over 0.8s after the bite settles.
- 30% medallion: keep the existing circular badge with `Math.round(progress*30)%` + hairline leader line to bite edge. Reposition for the new viewBox.
- Soft drop shadow ellipse beneath taco at 8% opacity.
- Single-pass 1.4s easeOut (existing constraint from Section 9, ≤240ms forbidden — but this is in marketing zone, not analytics; keep current 1.4s scroll-triggered narrative).

Layout stays side-by-side: SVG ~55%, editorial poster ~45% with eyebrow/headline/sub/3 stat blocks.

## 3. Product page differentiation + content + hero-top fun

Currently `Advertising`, `Automation`, `ManagedServices`, `Profitability` share the same skeleton: centered hero pill → 2-col problem/stat → 4-feature grid → splits → 3-stat band → CTA. Per Section 0/Section 11, no creative reflowing — but the user explicitly asked for differentiation, so propose **distinct hero + section sequences per product**, all built from existing marketing components (no new component types).

Per Section 10.5, fun/quirky content allowed in marketing only. Per user: keep puns + animations at TOP (hero zone) on every product page. Home page exempt (its existing flow stays).

### Profitability — “Profit you can prove”
Hero (top): full-bleed `TacosSection` moves to TOP (above the centered title block). Headline becomes the taco hero.
Below hero:
- Eyebrow "The hidden tax" + 14% margin StatBlock (kept)
- 4 feature cards (kept)
- New section: **"Where the money actually goes"** — text-heavy 2-column with 6 bullet items mapping marketplace fee categories to recovery patterns
- 2 split features (kept)
- New section: **"How we calculate margin"** — methodology callout, formula presented monospace
- 3-stat outcome band → CTA

### Advertising — “Ads that earn their spend”
Hero (top): new `AdHeroAnimation` — animated KPI scoreboard showing ROAS climbing 2.1x → 3.4x (uses existing `MorphingNumber` from `src/features/creative/`). Pun: **"We don't chase impressions. We hunt margin."**
Below:
- Problem 2-col (kept)
- 4 feature cards (kept)
- 2 split features (kept)
- New section: **"What we automate, what we don't"** — 2-column comparison list (Automated / You decide)
- New section: **"Glossary for the CFO"** — 5 acronyms (ROAS, ACoS, TACoS, CPC, RPC) defined plainly
- 3-stat band → CTA

### Automation — “Rules that run”
Hero (top): new `AutomationHeroAnimation` — animated 4-step pipeline (Draft → Simulate → Approve → Execute) with traveling pulse dot. Pun: **"Automation with a brake pedal."** (existing copy promoted to hero).
Below:
- Problem 2-col (kept)
- 4 feature cards (kept)
- Rule split (kept)
- WorkflowDiagram (kept, but moved earlier, right after hero scaffolding)
- New section: **"Anatomy of a rule"** — labeled IF/THEN/GUARDRAIL example block in mono
- New section: **"What can go wrong (and how we stop it)"** — 4-card guardrail grid
- 3-stat band → CTA

### Managed Services — “Your team, amplified”
Hero (top): new `MSHeroAnimation` — soft animated handshake/team avatar cluster (3 stacked avatar circles + ROAS arrow). Pun: **"Senior strategists. Junior egos."**
Below:
- Problem 2-col (kept)
- 4 feature cards (kept)
- Insight split (kept)
- New section: **"A week with us"** — 5-row Mon–Fri timetable (table-style)
- New section: **"What we don't do"** — explicit list (no SEO, no content writing, no email marketing)
- 3-stat band → CTA

Each new hero animation lives in its own file under `src/website/components/products/heroes/` (modular per Section 5). All use only allowed motion types (opacity, translate ≤8px, scale ≤1.02 in marketing zone — looser than analytics but no parallax/loops).

## 4. Files

New:
- `src/website/pages/legal/PrivacyPolicy.tsx`
- `src/website/pages/legal/TermsAndConditions.tsx`
- `src/assets/illustrations/taco.svg` (copied from upload)
- `src/website/components/products/TacoIllustration.tsx` (inlined SVG + mask + crumbs)
- `src/website/components/products/heroes/AdHeroAnimation.tsx`
- `src/website/components/products/heroes/AutomationHeroAnimation.tsx`
- `src/website/components/products/heroes/MSHeroAnimation.tsx`

Edited:
- `src/App.tsx` — add 2 legal routes
- `src/website/components/Footer.tsx` — wire footer legal links
- `src/website/components/TacosSection.tsx` — replace illustration with `TacoIllustration`, retain layout/poster
- `src/website/pages/products/Profitability.tsx` — move TacosSection to top, add 2 new content sections
- `src/website/pages/products/Advertising.tsx` — add hero animation, 2 new content sections
- `src/website/pages/products/Automation.tsx` — add hero animation, 2 new content sections
- `src/website/pages/products/ManagedServices.tsx` — add hero animation, 2 new content sections

## 5. Out of scope
- No changes to home page hero/sections
- No changes to AanAI page (already has its own hero structure)
- No changes to analytics app (Sections 1–11 of locked spec untouched)
- No design tokens, theme, or navigation changes
