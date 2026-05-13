
## 1. Aan Website Copilot — match in-app behavior

Rewrite `src/website/components/AanWebsitePanel.tsx` so the chrome mirrors `AanCopilotPanel` + `AanInput`:

- Move the morphing `AanMascot` out of the chat bubbles and into a **fixed slot directly above the input field** (left-aligned, 52×52, same `pl-3 mb-2 h-[52px]` slot used in `AanInput`).
- Wrap the panel in `AanPresenceProvider`; register the new slot as the `"input"` anchor via `useAanPresence().registerAnchor("input", el, 44)`.
- Render `<AanPresencePortal />` inside the panel so the same shape-morphing mascot travels between idle/listening/thinking states (circle ↔ blob) exactly like the app.
- States wire-up: `inputFocused → listening`, while loading → `thinking`, after assistant reply → `speaking` briefly. Use the existing `useAan()` setters (`setInputFocused`, plus a local `isGenerating` flag passed via context state).
- Remove the per-message mascot avatars in conversation bubbles (chat in app doesn't render mascot per message either — only the persistent one).
- Keep the suggestion chip pattern from `AanInput` (small "Suggested" pill animating in next to the mascot).
- Input chrome stays identical: rounded card, paperclip + textarea + gradient send.

This makes the website panel visually and behaviorally a 1:1 thin-client of the app's copilot, except it talks to `website-aan` edge function and never executes app actions.

## 2. Teams section on About page

New file: `src/website/components/company/TeamsSection.tsx`. Mounted inside `src/website/pages/company/About.tsx` (between existing intro and footer regions).

Structure:

```text
[Eyebrow] The People
[H2] One team. Five departments. Zero silos.
[Lead] Short paragraph (~2 lines) about culture.

  Leadership          [Sunil — CEO]
  Account Management  [Bharath, Naveen, Rakesh C, Tarun Kumar, Nishith]
  Service             [Milu, Venky, Kartik, Vardhan]
  Tech                [Aman, Rajveer, Samarth, Samim, Vikas, Mohan, Rohit, Ben, Lipsa, Archana, Loges, Sam]
  Design              [Anubhav, Tushar]
  Marketing           [Jasleen, Devyanshi, Nandan]
```

Card behavior (per attached layout reference):
- Default: small square card, initials monogram on a soft `bg-card` tile, name underneath, role under name in muted text.
- Hover/focus (and tap on mobile): card scales `1.0 → 1.08`, raises shadow, swaps the monogram for a **caricature mockup** (placeholder SVG component `CaricatureMockup.tsx` that draws a stylized head silhouette with a department-tinted background — easy to swap for real art later), and reveals a one-line bio chip.
- Grid: `grid-cols-2 sm:grid-cols-3 md:grid-cols-5` per department row, dept heading is a sticky-ish left rail on `md+` and a stacked H3 on mobile.
- Motion: `framer-motion` `whileHover={{ scale: 1.08 }}`, 180ms cubic-bezier(0.2,0,0,1) — within design system limits.

Data lives inline in `TeamsSection.tsx` as a typed array; each member `{ name, role, dept, bioLine }`.

## 3. Testimonials — 3 quotes + 1 video

Update `src/website/components/TestimonialsSection.tsx`:

- Replace existing copy with the three real quotes:
  1. **Firat Ozkan** — Co-Founder & CMO/CSO, Mount-It! (Walmart full-funnel quote).
  2. **James Ellington** — Sr. Director of Sales, Retail Division, Drive Medical.
  3. **Video testimonial** card paired with the third quote — renders a `<video>` element with `poster` and `controls`; src defaults to `/testimonials/video.mp4` (placeholder path) so the user can drop the file later. Tile shows a "Play" overlay until clicked.
- Layout: 2-column grid on desktop with the video card spanning a wider tile; stacked on mobile.
- Add an "Important voices, not many — but the ones that matter" eyebrow line per the user's framing.

## 4. Creative website background

New `src/website/components/AmbientBackdropV2.tsx` replacing/upgrading the current `AmbientBackdrop`:

- Layered, low-opacity composition: 
  - Soft periwinkle radial bloom in the upper-left, drifting via `framer-motion` (240ms ease, ≤8px motion per system rules — drift is via slow CSS transform with very low amplitude).
  - Hairline grid overlay (1px `currentColor` at 4% opacity) for analytical texture.
  - Floating geometric "data shards" (3–5 thin SVG chevrons / sparkline fragments) parked in negative space, fading in on scroll with `useScrollReveal`.
  - Dotted "constellation" pattern in the footer band.
- All effects are CSS/SVG only — no `backdrop-filter`, no infinite pulse, no parallax > 8px. Respects motion rules in section 9 of project knowledge.
- Mounted once in `WebsiteLayout.tsx` behind `<main>` with `pointer-events-none`.

## 5. App-accurate visuals + more copy

Audit pass across product pages (`Advertising.tsx`, `Automation.tsx`, `ManagedServices.tsx`, `Profitability.tsx`) and `Home.tsx`:

- Replace generic chart placeholders with **distinct, page-appropriate mocks** that mirror the actual app components:
  - Advertising: campaign table mock (uses real column headers from the Advertising module memory: Campaign / Spend / Sales / ROAS / TACoS) + a small bid-history sparkline.
  - Automation: rule-card mock (matches `EmbedRuleCard` styling) + a guardrail diagram.
  - Managed Services: pod-roster card + onboarding timeline.
  - Profitability: scatter-chart preview (margin vs units) + nested P&L row mock — both already exist conceptually in app, ports a static SVG version.
- Add 1–2 paragraphs of supporting body copy under each section header (currently many sections are headline-only). Tone follows zone rules: Core/Reports = clinical, Aan page = lightly witty.

## 6. Files

**New**
- `src/website/components/company/TeamsSection.tsx`
- `src/website/components/company/CaricatureMockup.tsx`
- `src/website/components/AmbientBackdropV2.tsx`
- `src/website/components/products/mocks/CampaignTableMock.tsx`
- `src/website/components/products/mocks/RuleCardMock.tsx`
- `src/website/components/products/mocks/PodRosterMock.tsx`
- `src/website/components/products/mocks/PnlScatterMock.tsx`

**Edited**
- `src/website/components/AanWebsitePanel.tsx` — full rewrite for app parity.
- `src/website/components/TestimonialsSection.tsx` — new content + video tile.
- `src/website/pages/company/About.tsx` — mount `TeamsSection`.
- `src/website/WebsiteLayout.tsx` — swap to `AmbientBackdropV2`.
- `src/website/pages/products/*.tsx` (4 files) — drop in mocks + body copy.
- `src/website/pages/Home.tsx` — add supporting paragraphs to thin sections.

**Deleted**
- `src/website/components/AmbientBackdrop.tsx` (replaced).

## Open questions

1. **Testimonial video file** — should I leave a placeholder path (`/testimonials/firat.mp4`) and a poster image slot for you to upload later, or do you want to attach the file now?
2. **Caricatures** — confirm placeholder monogram/silhouette is fine for now (real art swapped later by replacing `CaricatureMockup.tsx`)?
