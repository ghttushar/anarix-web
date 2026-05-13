## Scope

Frontend-only edits to website pages, product pages, the TACoS section, and the website's Aan panel. No backend / route / data changes.

Note on the "two numbers section": there are two on the Home page — `StatBand` (compact 4-stat strip) and `ImpactSection` ("Real impact. By the numbers." — 6 large cards). I can't see the attached image, so I'm assuming you want `StatBand` removed and `ImpactSection` promoted right after the hero. If it's the reverse, say so before approving.

---

## Home page (`src/website/pages/Home.tsx`)

New section order:

1. `HeroSection`
2. `ImpactSection` ("Real impact. By the numbers." — moved up, becomes the post-hero impact block)
3. `TestimonialsSection` (third section as requested)
4. `ProblemSection`
5. `SolutionsSection`
6. `ProductPreviewBand` (enhanced — see below)
7. `WorkflowSection`
8. `AuditCTASection`
9. `Footer`

Removed from Home:
- `SocialProofSection` ("Connects to every channel you sell on")
- `IntegrationOrbit` ("Connects With Your Entire Stack")
- The original `StatBand` placement (the smaller of the two number strips)

## Enhance "Built like a trading desk, not a dashboard." (`ProductPreviewBand`)

Upgrade from a static preview band to a higher-fidelity, denser composition while staying inside Section 9 motion limits:

- Editorial split: left column = bolder eyebrow + 56–64px headline + supporting copy + 3 trust chips (Latency, Audit log, Reversible). Right column = layered "trading-desk" mock built from real tokens — sticky-column data table, mini KPI ticker strip with monospaced numbers, and a thin sparkline rail.
- Replace flat bg with `bg-card` panel + 1px `ui.secondary` border + 1px hairline grid overlay at 4% opacity.
- One controlled motion: ticker numbers `MorphingNumber` count-up on `whileInView` (≤220ms, ease per Section 9). No loops, no parallax.
- Mobile: stack columns; mock collapses to KPI ticker + 4-row table.

## Remove "Connects With Your Entire Stack"

Delete `IntegrationOrbit` from Home. Keep the file for now (not used elsewhere — confirm before deleting source).

## TACoS section — refine shadow/glow (`TacoIllustration.tsx`)

Replace the current crude radial glow with a calmer, layered ground shadow:

- Drop the orange `taco-floor-glow` radial gradient entirely.
- Replace the contact ellipse with a 3-layer shadow stack, all using `hsl(var(--foreground))`:
  1. Tight contact: `rx=120 ry=6 opacity 0.28 blur 2`
  2. Mid soft: `rx=170 ry=14 opacity 0.14 blur 8`
  3. Wide ambient: `rx=220 ry=22 opacity 0.06 blur 18`
- Use `<filter id="taco-shadow-blur">` with `feGaussianBlur`.
- Anchor the stack 6px below the taco baseline; no warm color, no halo.
- Result: a clean editorial drop-shadow consistent with token system.

## "From scattered spreadsheets to one source of truth" (`CycloneScrollSection`)

Remove this section from the AanAI page and place it on the Home page **between** `WorkflowSection` and `AuditCTASection`. Its scroll-driven typography belongs in the Home narrative, not on the Aan product page.

## Product pages — add "big bold number" cards

For each of: `Advertising.tsx`, `Automation.tsx`, `ManagedServices.tsx`, `Profitability.tsx`.

Insertion point: immediately after the hero animation / pun block, before the next section.

New shared component `src/website/components/products/BigNumberStrip.tsx`:

- 3 oversized number cards in a `grid-cols-1 md:grid-cols-3` layout.
- Each card: 72–96px Satoshi number (tabular-nums), 11px uppercase tracked label, one-line supporting fact.
- `bg-card`, 1px border, 16px padding, no gradient blobs, hover `-translate-y-0.5` (≤1.02 scale rule respected).
- `MorphingNumber` count-up on `whileInView`, single pass.

Per-page numbers (placeholder, easy to edit later):
- Advertising: `4.2x` Median ROAS · `−38%` Wasted spend · `<8s` Time to draft a rule
- Automation: `1,200+` Rules running · `99.4%` Reversible · `24/7` Guardrailed
- Managed Services: `120+` Brands · `7d` Onboarding · `1` Dedicated pod
- Profitability: `30%` TACoS reduction · `$1.2B` GMV tracked · `100%` SKU-level P&L

## AanAI page (`src/website/pages/AanAI.tsx`)

- Add pun line under the hero subhead, in muted Allura accent: *"Because our AI glows."* (single line, italic, `text-muted-foreground`).
- Add second pun line near the "What else do you need?" / capabilities header: *"Okayyy… here are the other boring things Aan also does."*
- **Delete** the entire "Try it now / Ask Aan anything" section (the inline `WebsiteAanChat` block, lines ~135–149). The Action Island remains the single Ask-Aan entry point.
- Remove the `WebsiteAanChat` import.

## AanWebsitePanel — parity with app Copilot

Update `src/website/components/AanWebsitePanel.tsx` so Aan's placement, interactions, motion, and reactions match `AanCopilotPanel`:

- **Header**: replace the custom `AanMascot + Aan / Anarix Assistant` block with the app's `AanLogo` component. Use the same header chrome: 4px vertical padding, border-bottom, context bar below header showing `Context: Anarix.ai · <current page>`.
- **Mascot states**: drive `AanMascot` (or whatever `AanLogo` already wraps) with the app's `AanPresenceProvider` so idle / thinking / responding states fire identically. Wrap the panel in `<AanPresenceProvider>` and render `<AanPresencePortal />` like the app does.
- **Conversation surface**: use `<ScrollArea>` from `@/components/ui/scroll-area` instead of a raw scroll div, matching Copilot's `flex-1 min-h-0` setup.
- **Input**: swap the bespoke input form for the app's `AanInput` component (chatbot mode — file upload + model selector hidden via a `mode="chatbot"` prop passthrough; no rule drafts, no app actions). Reuse the same key handlers, send animation, and disabled states.
- **Motion**: panel open/close keeps the existing 220ms slide+fade (within Section 9 limits). Typing-dots animation replaced with the app's standard "thinking" presence so the mascot reacts the same way.
- **Position**: keep fixed right-rail on desktop (`right-4 top-4 bottom-4 w-[400px]`) and bottom-sheet on mobile — unchanged.
- **No app actions**: chatbot mode strictly Q&A. Any tool/action calls returned by the edge function are rendered as plain text only.

---

## Technical notes

Files edited:
- `src/website/pages/Home.tsx` (reorder + remove)
- `src/website/components/home/ProductPreviewBand.tsx` (enhance)
- `src/website/components/products/TacoIllustration.tsx` (shadow rework)
- `src/website/pages/AanAI.tsx` (remove chat, add pun lines, remove CycloneScrollSection)
- `src/website/pages/products/Advertising.tsx`, `Automation.tsx`, `ManagedServices.tsx`, `Profitability.tsx` (insert `BigNumberStrip`)
- `src/website/components/AanWebsitePanel.tsx` (Copilot parity refactor)

Files added:
- `src/website/components/products/BigNumberStrip.tsx`

Files no longer used on Home (kept on disk unless you say delete):
- `SocialProofSection.tsx`
- `IntegrationOrbit.tsx`
- `home/StatBand.tsx`
- `WebsiteAanChat.tsx` (no other consumers — safe to delete; will delete)

Tokens / motion: all changes stay within Periwinkle System 01 tokens and Section 9 motion limits (≤240ms, ≤1.02 scale, no loops, no parallax).

## Open question (please confirm before I build)

Which of the two Home number sections should be removed — the small 4-stat `StatBand` (my assumption) or the large 6-card `ImpactSection`? If it's `ImpactSection`, I'll promote `StatBand` after the hero instead.
