## Scope

A batch of targeted edits across the marketing website. No new features, no layout reflows beyond what's listed.

---

## 1. Home page (`src/website/pages/Home.tsx`)

- Move the "From scattered spreadsheets to one source of truth" animation block (currently `CycloneScrollSection`) so it renders **above** `TestimonialsSection` instead of after `WorkflowSection`.
- Remove the duplicate stat strip in the hero ($200M+ / $1.2B+ / 3.2x / 30%) since `StatBand` / `ImpactSection` already shows the same numbers right after. Keep the second one. Edit `HeroSection.tsx` to drop that inline stat row only.

## 2. Testimonials (`src/website/components/TestimonialsSection.tsx`)

Enhance visual weight without breaking the analytical tone:
- Add a soft periwinkle gradient backdrop band (token-based, no hardcoded hex) and a subtle ring/shadow on cards.
- Add a small "logo wall" row (Mount-It!, Drive Medical + 4 muted brand wordmarks as text chips) under the header to add density.
- Larger pull-quote typography on the lead testimonial (Satoshi 28-32px), accent quote-mark in `brand.accent`.
- Add a metrics chip row inside each testimonial card (e.g. "+38% ROAS", "-22% TACoS") rendered from a small constant array.
- Tighten the video card: dark surface, gradient play button ring (Aan-style allowed since it's expressive marketing context), caption strip with author + role badge.
- Keep all 2 quotes + video; no copy invented beyond metric chips (which I'll mark as illustrative-safe numbers from existing site copy: 38% ROAS, 12.8% TACoS already used in `StatBand`).

## 3. Footer (`src/website/components/Footer.tsx`)

- Remove the SOC 2 / GDPR / AES-256 badge row entirely (delete `badges` array and its render block).

## 4. Navbar + Floating Action Island

- `src/website/components/Navbar.tsx`: remove `<WebsiteThemeToggle />` usage (light/dark toggle).
- `src/features/creative/FloatingActionIsland.tsx`: remove the "Documentation" entry. Add/keep "Documentation" link in the website Navbar primary nav (it already routes to `/website/documentation`).
- Verify Navbar still has Documentation link; if missing, add it next to existing primary items.

## 5. Platform Capabilities cards

Locate the "Platform Capabilities" section (likely `FeaturePanels.tsx` or `SolutionsSection.tsx` - will confirm during implementation). For each card, replace the current generic graphic with a small bespoke SVG that visually maps to the heading:
- Profitability -> mini P&L bar/line composite
- Advertising -> bid curve + keyword chips
- Automation -> rule node graph
- Managed Services -> headset + checklist
- (Match exact card set found in code; one SVG per card, all in one new file `src/website/components/home/CapabilityIcons.tsx`.)

## 6. "What's inside" section

Find the section (likely on Home or AanAI page) where Aan content repeats. Rewrite each card so each one describes a distinct capability:
1. Aan Copilot - contextual right-panel assistant
2. Ask Aan - inline text-selection Q&A
3. Action Island - persistent floating hub
4. Full-Screen Aan - dedicated `/aan` workspace

No duplicate "Aan understands your data" lines.

## 7. Product / Profitability page (`src/website/pages/products/Profitability.tsx` + `TacosSection.tsx`)

Reword the taco copy. New copy:

> **TACoS - Total Advertising Cost of Sales**
> We help you take a 30% bite out of yours.
> Less spend wasted. More margin on your plate.

(Keeps the taco metaphor but frames it as cost reduction for the customer, not commission for us.)

## 8. "The leaks" section (`Profitability.tsx`)

Rewrite the two broken/vague items with concrete, accurate descriptions:

- **FX & marketplace fees**: "Selling in multiple currencies hides margin drift. Marketplace commission rates also shift by category and program (FBA vs FBM, Brand Registry, Vine). We normalize FX daily and track every commission change so your true per-SKU margin reflects what actually landed in the bank."
- **Promo & coupon stacking**: "Lightning Deals, Subscribe & Save discounts, clip-coupons, and Vine credits often stack on the same order. The combined discount can quietly push a SKU below break-even. We unstack each promo, attribute it to the order, and flag SKUs whose effective margin turns negative under stacked promotions."

Other 4 items left as-is (already accurate).

## 9. Managed Services headline

`src/website/pages/products/ManagedServices.tsx`: replace "Senior strategists. Junior egos." with:

> **Senior strategists. Zero ego.**

(or "Senior strategists. Quietly relentless." - will use "Zero ego" as primary; one-line, same rhythm, non-offensive.)

---

## Files touched

Edited:
- `src/website/pages/Home.tsx`
- `src/website/components/HeroSection.tsx`
- `src/website/components/TestimonialsSection.tsx`
- `src/website/components/Footer.tsx`
- `src/website/components/Navbar.tsx`
- `src/features/creative/FloatingActionIsland.tsx`
- `src/website/components/FeaturePanels.tsx` (or whichever holds Platform Capabilities)
- `src/website/components/TacosSection.tsx`
- `src/website/pages/products/Profitability.tsx`
- `src/website/pages/products/ManagedServices.tsx`
- "What's inside" host file (confirmed during implementation)

Created:
- `src/website/components/home/CapabilityIcons.tsx`

No deletes, no route changes, no token changes.

---

## Out of scope

- Team section, caricature, Aan panel behavior - untouched.
- No new pages, no backend changes.
- No copy invention beyond the explicit rewrites above.
