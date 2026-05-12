## Goal

Tear down the current `/website` marketing site and rebuild it as a faithful replica of `https://retail-growth-engine.vercel.app/` — same brand mark, same floating pill navbar, same hero, same sections, same copy, same overall layout. Keep it mounted at `/website` and keep the profile-dropdown link. Reuse our real `AanMascot` for the Aan AI motion as the user wanted earlier, and add a light/dark theme toggle in the navbar (using the existing `ThemeContext`).

The reference site is a SPA — only `/` renders. Sub-pages (Products dropdown, Aan AI, Pricing, Documentation, Company) are client-side routes I'll mirror with thin pages so the navbar behaves identically.

## What gets removed

Delete the current marketing site files and start clean:

```text
src/website/WebsiteLayout.tsx
src/website/components/  (all)
src/website/pages/       (all)
src/website/aan/mockAanEngine.ts  (keep — reuse for Aan AI page widget)
```

The profile dropdown link in `src/components/layout/AppSidebar.tsx` stays as-is (already points to `/website`).

## Visual spec (from reference site)

- **Background**: very pale lavender `#F5F6FA`-ish, with a subtle dotted/grid pattern overlay
- **Navbar**: floating pill, white surface, soft shadow, centered, max-width ~1100px, top: 16px, rounded-full, padding 12-20px. Left = `Anarix.ai` wordmark (`.ai` in periwinkle/blue). Center = nav links (Products ▾, Aan AI, Pricing, Documentation, Company ▾). Right = "Sign In →" text + "Schedule Demo" pill (periwinkle solid).
- **Hero**: centered. Badge pill "✦ The Anarix Insight Engine" (light periwinkle bg, periwinkle text). H1 large serif (use existing Satoshi or fall back to a serif token already in project) — "Save 20+ hours a week on marketplace" + italic periwinkle "profitability" with underline swash. Lead paragraph centered. Two CTAs: "Schedule a Demo" (solid pill, periwinkle), "Explore Products" (outline pill). 4-stat strip below.
- **Channels marquee**: "Connects to every channel you sell on" + horizontally-scrolling logos row (Amazon, Walmart, Shopify, TikTok Shop, Meta Ads, Google Ads, HubSpot, Snowflake, Looker, Slack) — text pills, infinite scroll.
- **Real impact**: H2 "Real impact. By the numbers." + 6-stat grid ($200M+, $1.2B+, 3.2x, 30%, 500+, 12+).
- **Platform Capabilities**: H2 "The Anarix Operating System" + bento/feature grid of 9 cards (Profitability Dashboard with mini P&L mock, Advertising Intelligence, Rule Automation, Campaign Manager, Impact Analysis, Share of Voice, Master Dashboard, Enterprise Reporting, Aan Copilot).
- **Testimonials**: H2 "What Our Partners Say" + 6 quote cards in a grid with role + brand subtitle.
- **Bottom CTA**: H2 "Get your free margin audit" + supporting line + Schedule Demo pill.
- **Footer**: simple — wordmark, link columns, copyright.

All colors come from existing periwinkle tokens (`--primary`, `--background`, `--card`, `--muted`, `--border`). No new tokens. Light/dark via existing `ThemeContext`.

## Routes

```text
/website                     -> Home (full single-page replica)
/website/aan-ai              -> Aan AI page (reuse AanMascot + mockAanEngine for live demo widget)
/website/pricing             -> Pricing
/website/documentation       -> Documentation hub
/website/company             -> Company / About
/website/products/profitability    -> Product detail
/website/products/advertising      -> Product detail
/website/products/rule-automation  -> Product detail
/website/products/campaign-manager -> Product detail
/website/products/impact-analysis  -> Product detail
/website/products/share-of-voice   -> Product detail
/website/products/master-dashboard -> Product detail
/website/products/enterprise-reporting -> Product detail
/website/demo                -> Schedule demo form
```

Sub-pages use the same WebsiteLayout (floating pill navbar + dotted background + footer) and contain a hero + 1–2 content sections matching the reference site's tone. Not 9 fully-designed product pages — each is a clean themed shell with the relevant capability copy already on the home page, plus a CTA back to demo. The home page is the high-fidelity replica; sub-pages exist so the nav doesn't 404.

## File structure (new)

```text
src/website/
  WebsiteLayout.tsx          # bg + dotted pattern + nav + footer + Outlet
  components/
    PillNav.tsx              # floating pill navbar with dropdowns + theme toggle
    NavDropdown.tsx          # Products / Company dropdown menu
    ThemeToggle.tsx          # sun/moon, uses ThemeContext
    Hero.tsx                 # badge + serif H1 + italic accent + CTAs + stat row
    DottedBackground.tsx     # absolute dotted pattern overlay
    ChannelsMarquee.tsx      # infinite-scroll logo row
    StatsGrid.tsx            # 6-stat "Real impact" grid
    CapabilitiesGrid.tsx     # 9 feature cards with Profitability P&L mini
    MiniPnLCard.tsx          # the Revenue/Ad Spend/Fees/Margin card content
    Testimonials.tsx         # 6-card quote grid
    BottomCTA.tsx            # "Get your free margin audit"
    Footer.tsx
    SectionLabel.tsx         # small uppercase eyebrow used between sections
    AnarixWordmark.tsx       # "Anarix" + ".ai" in primary
  pages/
    Home.tsx
    AanAI.tsx                # uses real AanMascot + mockAanEngine chat
    Pricing.tsx
    Documentation.tsx
    Company.tsx
    Demo.tsx
    products/
      ProductTemplate.tsx    # shared shell
      Profitability.tsx
      Advertising.tsx
      RuleAutomation.tsx
      CampaignManager.tsx
      ImpactAnalysis.tsx
      ShareOfVoice.tsx
      MasterDashboard.tsx
      EnterpriseReporting.tsx
  aan/
    mockAanEngine.ts         # KEEP — used on AanAI page only
```

## Aan motion

The reference site has no Aan animation — it's a marketing surface. Per the user's earlier request to "bring in actual Aan's motion and ui and shape", we keep `AanMascot` + `FloatingDots` on **the dedicated `/website/aan-ai` page** (live demo with mock streaming). The home page does not auto-play Aan motion (matches the reference exactly).

## Theme toggle

A small sun/moon button placed in the navbar between "Sign In" and "Schedule Demo". Reuses `useTheme()` from `src/contexts/ThemeContext.tsx`. Tokens already work in dark mode, so the whole site flips correctly. The dotted background pattern uses `--border` opacity so it adapts.

## Out of scope

- No new color tokens, no new fonts beyond existing Satoshi/Noto/Allura.
- No backend, no real LLM, no Lovable Cloud.
- The italic underline swash on "profitability" — use an existing italic serif (system serif fallback or `font-serif italic`) styled with `text-primary` and an SVG underline. Not a custom font file.
- Sub-pages are themed shells, not 9 fully-designed product deep dives.

## Build order

1. Wipe old `src/website/components` + `src/website/pages` (keep `aan/`).
2. Build `WebsiteLayout`, `DottedBackground`, `PillNav` (with dropdowns + ThemeToggle), `Footer`.
3. Build Home: Hero → ChannelsMarquee → StatsGrid → CapabilitiesGrid (with MiniPnLCard) → Testimonials → BottomCTA.
4. Build AanAI page reusing `AanMascot` + `mockAanEngine`.
5. Build Pricing, Documentation, Company, Demo, and 8 product shells via `ProductTemplate`.
6. Update `src/App.tsx` routes.
7. QA in light + dark at 1463px (current viewport).

Approve and I'll build it.