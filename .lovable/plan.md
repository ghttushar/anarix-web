
## Goals

1. Fix the broken navbar on the website.
2. One AI surface on the website: the Floating Action Island, with an "Ask Aan" button that opens the same Copilot-style panel used in the app — but in chatbot mode (no app actions).
3. Remove all other live chat surfaces from the app and website.
4. Add background graphics (non-chart) and mobile-first polish.
5. Repair animations broken in the last edit.
6. Propose 10 new sections, 10 creative animations, and additional Action Island features.

---

## Part A — Fixes (deterministic, will implement on approval)

### A1. Navbar repair (`src/website/components/Navbar.tsx`)
- Current route prefix in `App.tsx` is `/website/...`, but Profitability page renders at `/products/profitability` (the user's current route), meaning some product pages are mounted **outside** `WebsiteLayout`. Audit `App.tsx` route table and either:
  - Move all product pages under `/website/products/*` (preferred, single source of truth), **or**
  - Render `<Navbar />` + `<Footer />` inside the affected pages.
- Add `min-w-0` to the centered nav container to stop overflow on mid-width viewports.
- Mobile drawer: anchor inside header (`absolute top-full left-4 right-4`) so it doesn't push layout.
- Replace gradient text in logo with token color (Section 3 forbids gradient on text).

### A2. Action Island on website
- Remove `"/website"` from `hiddenRoutes` in `src/features/creative/FloatingActionIsland.tsx`.
- Add a **website mode** prop: when on website routes, show only:
  - Ask Aan (primary)
  - Theme toggle
  - Book a demo
  - Help / Docs
  - Drag handle
- Hide app-only actions (Refresh, Export, Screenshot, Insights, Alerts) on website routes.

### A3. Unify Aan into one chatbot
- Delete `src/website/components/WebsiteAanLauncher.tsx` from `WebsiteLayout`.
- Reuse `AanCopilotPanel` as the single right-side panel, opened by Action Island "Ask Aan".
- Add a `mode: "chatbot" | "copilot"` flag in `AanContext`. In chatbot mode:
  - Hide artifact creation / rule drafting tools.
  - Route messages to the existing `website-aan` edge function instead of the app gateway.
  - Header label: "Aan — Anarix Assistant".
- Remove any remaining floating chat buttons inside the app (audit `WebsiteAanChat` usage; keep the component only for embedded sections like `/aan-ai` page).

### A4. Animation repairs (from last edit)
- `TacosSection`: bite mask uses ellipse rx/ry tied to scroll progress — verify `useScrollReveal(0.3)` returns `0..1` not boolean (current bug suspect). Replace with a controlled progress hook driven by `IntersectionObserver` + `requestAnimationFrame` 0→1 over 1400ms once visible. Crumbs and medallion read same progress.
- `AdHeroAnimation`, `AutomationHeroAnimation`, `MSHeroAnimation`: wrap each in `motion.div` with `whileInView` + `viewport={{ once: true, amount: 0.4 }}` so they trigger on mobile scroll, not just desktop hero load.
- Honor `prefers-reduced-motion` in all three.

### A5. Background graphics (non-chart, on-brand)
Add a shared `<AmbientBackdrop variant="grid|orbits|noise|topography">` component used behind hero sections:
- Subtle dotted grid (SVG, 6% opacity)
- Periwinkle orbit rings (SVG, parallax ≤8px)
- Soft noise texture (SVG turbulence, 4% opacity)
- Topographic contour lines (SVG paths, 5% opacity)
All token-driven, no decorative loops, respect Section 9 motion limits.

### A6. Mobile polish
- All hero animations: cap SVG viewBox so they scale to 100% width; stack illustration above copy under `md:`.
- Touch target ≥44px on Action Island; island docks bottom-center on `<sm` with safe-area padding.
- Section paddings: `py-16 md:py-24` everywhere; remove fixed `min-h-screen` heroes on mobile.

---

## Part B — Suggestions (need your pick before building)

### B1. Ten new sections (proposed)

| # | Section | Best page |
|---|---------|-----------|
| 1 | "Anatomy of a TACoS" interactive breakdown | Profitability |
| 2 | Live ROI calculator (sliders → savings) | Pricing / Home |
| 3 | "A day in the life of Aan" timeline | Aan AI |
| 4 | Marketplace coverage map (Amazon/Walmart regions) | Home |
| 5 | Comparison table: Anarix vs in-house vs agency | Pricing |
| 6 | Customer story carousel with metric deltas | Home |
| 7 | Security & compliance trust strip (SOC2, GDPR) | Footer-of-every-page |
| 8 | "Built for operators" workflow gallery | Products |
| 9 | Changelog / "Shipped this month" feed | Home + Docs |
| 10 | FAQ accordion grouped by persona | Pricing + Products |

### B2. Ten creative animations (on-brand, Section 9 compliant)

1. Cursor-follow periwinkle spotlight on hero (radial gradient, 12% opacity).
2. Scroll-driven horizontal "campaign timeline" reveal.
3. Number count-up on KPIs entering viewport.
4. SVG line-draw on section dividers (stroke-dashoffset).
5. Magnetic hover on CTAs (≤4px pull, easing 180ms).
6. Ingredient-orbit rings around the taco that ease in on scroll.
7. Card tilt on hover (≤2°, no parallax).
8. Marquee logo strip with hover-pause.
9. Word-by-word fade-in for hero headline.
10. Section-enter "ink wash" mask reveal (clip-path, single pass).

### B3. Additional Action Island ideas (website)

- **Ask Aan** (default open chat)
- **Book a demo** (deep-link to `/website/demo`)
- **Theme toggle** (light/dark)
- **Currency / region** (USD/EUR/INR display only)
- **Pricing calculator** quick-open
- **Changelog** popover ("What's new")
- **Status indicator** (green dot → uptime page)
- **Share this page** (copy link / X / LinkedIn)
- **Keyboard shortcuts** overlay (⌘K)
- **Back to top** when scrolled >800px

---

## Files affected (Part A only)

- edit: `src/App.tsx` (route consolidation under `/website`)
- edit: `src/website/WebsiteLayout.tsx` (remove launcher)
- edit: `src/features/creative/FloatingActionIsland.tsx` (website mode)
- edit: `src/components/aan/AanContext.tsx` + `AanCopilotPanel.tsx` (chatbot mode)
- edit: `src/website/components/Navbar.tsx` (overflow + token logo)
- edit: `src/website/components/TacosSection.tsx` + 3 hero animations (progress hook + reduced-motion)
- new: `src/website/components/AmbientBackdrop.tsx`
- delete: `src/website/components/WebsiteAanLauncher.tsx`

Out of scope: app analytics screens, design tokens, edge function logic.

---

## Questions before I build

1. For Part B1 (sections) and B2 (animations) — pick any subset to include in this build, or say "all" / "skip for now".
2. For Part B3 (island additions) — which extras beyond Ask Aan + Demo + Theme should ship?
3. Confirm: chatbot mode should **not** be able to navigate the user or trigger any app action — purely Q&A. Correct?
