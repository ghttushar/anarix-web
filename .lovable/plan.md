## Source of truth

The uploaded `Retail_Growth_Engine.zip` is the reference. Its `src/` is a complete React + Tailwind + framer-motion site with ~24 animated section components. Current `/website` is a simplified rewrite that lost the motion. I will replace `/website` with a near-1:1 port of the zip.

## What gets ported (copy from zip → `src/website/`)

**Sections / animations (verbatim, only renamed imports):**
- `HeroSection.tsx` — animated headline, swash, gradient orbs
- `CycloneScrollSection.tsx` — scroll-driven cyclone
- `TypographyTransition.tsx` — large kinetic type
- `KaleidoscopeSection.tsx` — rotating kaleidoscope
- `StatementSection.tsx`
- `SolutionsSection.tsx` — pinned multi-panel
- `FeaturePanels.tsx` — 494-line feature reveal
- `ImpactSection.tsx`, `TrustScaleSection.tsx`, `SocialProofSection.tsx`
- `IntegrationOrbit.tsx` — orbiting logos
- `TacosSection.tsx` — taco visual / TACoS metric
- `HappyUsersSection.tsx`, `TestimonialsSection.tsx`, `HallOfFame.tsx`
- `AanIntroSection.tsx`, `AuditCTASection.tsx`
- `Footer.tsx`, `Navbar.tsx`, `NavLink.tsx`, `PageLayout.tsx`, `ScrollToTop.tsx`, `ScheduleDemoModal.tsx`

**Pages (verbatim):**
- `Index.tsx` (Home composition) → `Home.tsx`
- `AanAI.tsx`, `Pricing.tsx`, `Docs.tsx` (→ `Documentation.tsx`)
- `About.tsx`, `Careers.tsx`, `Contact.tsx`
- `ProductProfitability.tsx`, `ProductAdvertising.tsx`, `ProductAutomation.tsx`, `ProductManagedServices.tsx`
- `Demo.tsx`, `Login.tsx` (Login routes to existing `/login`)

## Integration plan

1. **Wipe current `src/website/`** (components + pages) — full reset, no half-merging.
2. **Copy the zip's `src/components/` → `src/website/components/`** and `src/pages/*` → `src/website/pages/` (keep filenames).
3. **CSS / tokens**: append zip's animation keyframes + utilities (Fraunces font import, gradient utilities, marquee, cyclone, kaleidoscope keyframes) into a new `src/website/website.css`, imported only by `WebsiteLayout`. Do **not** touch global `index.css` or `tailwind.config.ts` (preserves Periwinkle app theme).
4. **Fonts**: add Fraunces + Inter `<link>` to `index.html` (already there per upload). No change.
5. **WebsiteLayout**: render zip's `Navbar` + `Footer` + `<Outlet/>` + `ScrollToTop`. Remove current `PillNav`, `DottedBackground`.
6. **Routes** (`src/App.tsx`): keep `/website` parent, children:
   - `/website` → Home
   - `/website/aan-ai` → AanAI
   - `/website/pricing`, `/website/documentation`, `/website/demo`
   - `/website/products/{profitability,advertising,automation,managed-services}`
   - `/website/company/{about,career,contact}`
7. **Internal links** in copied files: rewrite `to="/about"` etc → `/website/...` via single sed pass (deterministic table).
8. **Floating Action Island** guard already excludes `/website` — leave as is.
9. **Aan AI page**: keep zip's `AanAI.tsx` exactly (it's the "mockup" surface user approved earlier).

## Out of scope

- No changes to app shell (`AppLayout`, sidebar, etc.).
- No new fonts beyond what the zip uses.
- No backend / form submission.
- No edits to Periwinkle tokens used by the analytical app.

## Risks / notes

- Zip components import `@/components/ui/*` (shadcn) — already present in this project, so they resolve unchanged.
- Zip uses `framer-motion` (already installed).
- A few zip components may reference assets in `public/` — I'll copy any referenced files from `/tmp/rge/public/` into this project's `public/` if missing.

Approve and I will execute the port in one pass.