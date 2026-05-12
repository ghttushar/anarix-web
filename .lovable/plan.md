# Website Completion Plan

Goal: Bring every `/website` page to the same fidelity as Home, using the reference site (retail-growth-engine.vercel.app) as the structural baseline but populated with real Anarix product content, real screenshots/components from the app, a working light/dark toggle, the real Aan mascot/motion, and a live Aan chat powered by Lovable AI.

---

## 1. Global chrome fixes

- **Hide app chrome on `/website/*`**: Confirm `FloatingActionIsland`, command palette, and any global toasters (sonner/Toaster) are suppressed inside `WebsiteLayout`. Render a website-only layout with no `<Toaster />`, no FloatingActionIsland, no AanPresencePortal.
- **Navbar**:
  - Add a **light/dark toggle** (sun/moon icon) using the app's existing `ThemeContext` so colors match the product (Periwinkle System 01 light + dark tokens).
  - Wire all nav links to `/website/...` routes (currently several point to `/about`, `/pricing`, `/login` which collide with the app).
  - Logo → `/website`.

## 2. Real Aan presence on the site

- Reuse the actual `AanMascot` component (`src/components/aan/AanMascot.tsx`) — diamond/circle/cube/anchor states, cursor tracking, idle/listening/thinking transitions — instead of the generic "glowing orb".
- Use it in:
  - Hero of `AanAI` page (idle → listening → thinking).
  - Floating "Talk to Aan" launcher bottom-right on every website page (replaces the hidden app island).
  - Inline anchors next to AI-related copy on Home, Documentation, Product pages.

## 3. Live Talk-to-Aan (real chat, not canned)

- Edge function `supabase/functions/website-aan/index.ts` calling Lovable AI Gateway (`google/gemini-3-flash-preview`, streaming SSE).
- System prompt grounds Aan in Anarix product knowledge: products (Profitability, Advertising, Automation, Managed Services), Aan capabilities, pricing tiers, supported channels (Amazon, Walmart, Shopify, TikTok), tone rules from project knowledge (confident, lightly witty, never sarcastic).
- Frontend: `WebsiteAanChat.tsx` panel — token-by-token streaming, markdown rendering, suggested prompts, handles 429/402 with friendly inline messages (no toasts).
- Mounted as:
  - Floating launcher on every `/website` page.
  - Embedded chat surface on `AanAI` page (replaces canned-response block).
  - Embedded chat on `Documentation` page (scoped system prompt: "answer questions about Anarix docs").

## 4. Page-by-page build

Each page mirrors the reference site's section rhythm (hero → proof → feature panels → motion section → CTA) but with real Anarix content + real product UI screenshots/embeds.

### Home (already exists — light polish)
- Verify all sections render; swap any placeholder copy with real product positioning.

### Products (4 pages)
For each: hero with product name + one-line value prop, animated feature panels, **embedded real UI snippet** from the app (read-only, scaled), KPI strip, "How it works" 3-step, testimonial, CTA.

- **Profitability** → embed read-only `ProfitabilityHeroCard` + `ScatterPlotChart` + `ProductsPnLTable` (mock data already in `mockProfitability.ts`).
- **Advertising** → embed `CampaignTable` + `KPICardsRow` + `PerformanceChart`.
- **Automation** → embed `RuleAgents` snippet + rule-builder mock; explain rule lifecycle (suggest → preview → approve → run).
- **Managed Services** → no embed; team/process timeline, deliverables, SLA grid, case studies.

### Aan AI
- Replace canned chat with **live streaming chat** (section 3).
- Add `AanMascot` hero with state cycling.
- Capability grid stays.
- Add `CycloneScrollSection` + new "Aan in your workflow" section showing screenshots of Aan inside the app (Insights panel, AanCopilotPanel, AskAanTooltip).

### Pricing
- 3 tiers (Starter / Growth / Enterprise) with real feature matrices pulled from product capability list.
- Annual/monthly toggle.
- FAQ accordion (8 Qs) with real answers.
- Comparison table to alternatives (channel coverage, AI included, managed option).

### Documentation
- Left sidebar: Getting Started, Connecting Accounts (Amazon/Walmart/Shopify/TikTok), Profitability, Advertising, Automation, Aan, API, Changelog.
- Each section is a real article (300–600 words) with code blocks and screenshots from the app.
- Right side: **embedded Aan doc-chat** scoped to docs.

### Company
- **About**: mission, story, values (3), team grid (placeholder photos), Hall of Fame section reused from `HallOfFame.tsx`.
- **Career**: open roles list, perks, hiring process timeline, "Why Anarix" panel, application CTA → mailto.
- **Contact**: contact form (no backend; email link), office locations, support tiers, response-time SLA.

### Demo
- Real "Schedule a Demo" form (name, work email, company, channels, monthly ad spend, message). Posts to an edge function `website-demo-request` that stores into a `demo_requests` Cloud table. Confirmation inline (no toast).

## 5. Light/Dark theme on website

- `WebsiteLayout` wraps in `.website-scope` and consumes `ThemeContext`. Toggle in navbar flips `data-theme="light|dark"`.
- `website.css` defines both palettes mapped to the app's Periwinkle tokens (`#F5F6FA / #FFFFFF / #4A62D9` light, `#0E1020 / #171A2E / #6E82F5` dark).
- All website components use semantic tokens, not hard-coded hex.

## 6. Motion fidelity

- Keep ported reference-site motion components (`CycloneScrollSection`, `KaleidoscopeSection`, `TypographyTransition`, `FeaturePanels`, `IntegrationOrbit`, `Reveal`).
- Add real Aan motion: mascot state transitions on scroll/hover, gradient shimmer on Aan-only sections (≤400ms, single pass — per project knowledge rules).

## 7. No toasts, no action island

- Remove all `toast()` calls under `src/website/**`; replace with inline status (small text under form, red/green icon).
- Confirm `FloatingActionIsland` `hiddenRoutes` includes `/website` prefix match (not just exact `/website`).

---

## Technical notes

- **New files**:
  - `supabase/functions/website-aan/index.ts` (streaming Lovable AI chat)
  - `supabase/functions/website-demo-request/index.ts` + `demo_requests` table migration
  - `src/website/components/WebsiteAanChat.tsx` (streaming chat UI w/ markdown)
  - `src/website/components/WebsiteAanLauncher.tsx` (floating launcher)
  - `src/website/components/WebsiteThemeToggle.tsx`
  - `src/website/components/AppUIEmbed/*` (read-only wrappers around real product components for marketing use)
  - `src/website/pages/docs/*` (article pages + sidebar)
- **Edited**:
  - `src/website/WebsiteLayout.tsx` (theme scope, no toaster, mount launcher)
  - `src/website/components/Navbar.tsx` (theme toggle, route fixes)
  - `src/features/creative/FloatingActionIsland.tsx` (prefix-based hiddenRoutes)
  - `src/website/website.css` (full light+dark token map)
  - All product/company/pricing/docs/demo pages rebuilt with real content
- **Lovable Cloud** must be enabled for the live Aan chat + demo form. If not yet enabled, I'll enable it as the first build step.

## Open questions before I build

1. For "real UI screenshots" in product pages — do you want me to **embed the actual live components** (read-only, scaled-down, using mock data) or **PNG screenshots** of the running app? Live embed feels more impressive but heavier; screenshots are lighter and safer.
2. Demo form: store submissions in Lovable Cloud DB only, or also email them somewhere (needs Resend + a verified sender)?
3. Documentation depth — short overview articles (~300 words each), or full guides (~800–1500 words each, takes longer)?

Reply with answers (or "you decide") and I'll execute the full build in one pass.