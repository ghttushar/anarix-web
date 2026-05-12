# Anarix Website — Build Plan

A full marketing + docs site mounted inside the app at `/website`, linked from the user profile dropdown. Uses the same Periwinkle tokens, fonts, and Aan mascot/motion as the core app, but with a marketing-grade layout inspired by the referenced Lovable site and AttendFlow.

## 1. Entry point

- Add **"Anarix Website"** item in the existing user profile dropdown (top-right avatar menu in `AppTaskbar` / wherever the profile menu lives). Opens `/website` in the same tab.
- New public route `/website` (and nested routes) registered in `src/App.tsx`. Routes are wrapped in their own `WebsiteLayout` (no app sidebar/taskbar), so it feels like a real marketing site.

## 2. Routes

```text
/website              -> Home (hero, product pillars, live Aan demo, KPI strip, CTA)
/website/product      -> Product pages: Profitability, Advertising, Aan, Reports
/website/aan          -> Dedicated Aan page (mascot motion + mock chat)
/website/pricing      -> Pricing tiers (mock content)
/website/customers    -> Logos + 2-3 mock case study cards
/website/about        -> Mission, team, "Hall of Fame" strip
/website/docs         -> Documentation hub
/website/docs/:slug   -> Individual doc pages with embedded "Ask Aan" widget
/website/contact      -> Contact form (mock submit)
```

## 3. Layout / Nav

`WebsiteLayout` with:
- Sticky top nav: Anarix logo (left) | Product, Pricing, Customers, Docs, About (center) | Theme toggle + "Open App" button (right).
- Light/Dark toggle reuses existing `ThemeContext` so colors come straight from Periwinkle tokens. No new colors introduced.
- Footer: nav columns, social, small Aan glyph, copyright.

## 4. Reusing real app UI ("Mix" approach)

- **Live components on hero**: real `AanMascot` + `AanPresencePortal` motion (idle diamond → ball → return), and 1–2 real KPI cards from `src/components/cards/KPICard.tsx` populated with mock numbers.
- **Screenshots elsewhere**: capture the Profitability dashboard, Campaign Manager, Aan workspace via `browser--screenshot`, save to `src/assets/website/`, and embed in product/feature sections with subtle border + shadow.
- All fonts (Satoshi, Noto Sans, Allura) and tokens reused — no new design system.

## 5. Aan motion on the website

- Reuse `AanMascot`, `AanPresenceContext`, `FloatingDots` already in the codebase.
- Hero anchor: idle diamond floating above a CTA input ("Ask Aan anything…").
- When user submits a question, mascot morphs to ball, travels to the answer card, FloatingDots play, mock answer streams in, then mascot returns. Same logic as in-app `AanConversation`.

## 6. Mock "Talk to Aan" chat

Per your choice — **mockup, no LLM**. A small client-only module:

- `src/website/aan/mockAanEngine.ts` — keyword-matched canned responses about Anarix (Profitability, Advertising rules, Aan workspace, pricing, integrations, Amazon/Walmart, theme, etc.). Falls back to a generic "I'd love to show you that — book a demo" reply.
- Simulated streaming: split response into tokens, append every ~20ms to mimic real generation. Reuses Aan motion described above.
- Two mounts:
  1. **Home & /website/aan** — large hero chat surface.
  2. **Docs pages** — compact "Ask Aan about this page" widget in the right rail; pre-seeded with the doc's topic keywords for more relevant canned answers.

No backend, no Lovable Cloud, no edge function. Purely frontend mock.

## 7. Real content sources

Content drawn from your existing project memory + visible app modules so it matches reality:
- Profitability (Dashboard, Trends, P&L, Geo, Unified P&L)
- Advertising (Campaign Manager, Impact Analysis, Targeting, Rules, Budget Pacing, Search Harvesting, Anomaly Alerts)
- BI (Brand SOV, Keyword Tracker, Competitor Pricing)
- AMC, Day Parting, Reports, Sandbox, Aan
- Marketplaces: Amazon, Walmart (validation rules already in codebase)

Pricing, customer logos, and team members will be plausible mock content (clearly placeholder text where appropriate) — easy to swap later.

## 8. Documentation

`/website/docs` hub with grouped sections:
- Getting Started (Login, Connect Accounts, Onboarding walkthrough)
- Modules (one doc per app module above)
- Aan AI (capabilities, safety model, drafts vs apply)
- Power Tools (Cmd+K, vim shortcuts, `?` help overlay)
- Preferences (themes, density, visual effects, feature toggles)
- API / Integrations (placeholder)

Each doc is an MDX-like TSX page with: title, intro, screenshots from the app, step list, "Ask Aan about this page" widget at right.

## 9. File structure (new)

```text
src/website/
  WebsiteLayout.tsx
  components/
    WebsiteNav.tsx
    WebsiteFooter.tsx
    WebsiteThemeToggle.tsx
    HeroAanDemo.tsx          # live mascot + mock chat
    FeatureSection.tsx
    PricingTable.tsx
    CustomerLogos.tsx
    DocSidebar.tsx
    AskAanWidget.tsx         # compact docs version
  aan/
    mockAanEngine.ts
    useMockAanChat.ts
  pages/
    Home.tsx
    Product.tsx
    AanPage.tsx
    Pricing.tsx
    Customers.tsx
    About.tsx
    Contact.tsx
    docs/
      DocsHome.tsx
      DocPage.tsx
      content/
        getting-started.tsx
        profitability.tsx
        advertising.tsx
        aan.tsx
        ... (one per module)
src/assets/website/
  hero-profitability.png
  hero-advertising.png
  hero-aan.png
  ... (captured via browser--screenshot)
```

## 10. Profile dropdown change

In whichever component renders the avatar menu (likely `AppTaskbar.tsx` — will confirm by reading at build time), insert a new `DropdownMenuItem`:
- Label: "Anarix Website"
- Icon: Globe (lucide)
- Action: `navigate('/website')`
- Placed above "Account Settings".

## 11. Out of scope

- No real LLM, no Lovable Cloud, no auth changes.
- No new color tokens or fonts.
- No changes to existing app modules beyond the single dropdown item.
- No SEO/SSR work beyond `<title>`/meta tags per page (SPA only).
- No CMS — all content lives in TSX files, easy to edit later.

## 12. Build order

1. Route + profile dropdown link + empty `WebsiteLayout` skeleton.
2. Theme toggle, nav, footer.
3. Home page with live Aan hero + mock chat engine.
4. Capture app screenshots, build Product / Aan / Pricing / Customers / About / Contact pages.
5. Docs hub + 6–8 doc pages with `AskAanWidget`.
6. Polish pass: motion timing, mobile responsiveness, empty states.

Approve and I'll build it end-to-end.
