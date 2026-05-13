
# Rework: Home + Products + Aan AI

Hybrid pacing: editorial hero → dense middle (data, embeds, diagrams) → editorial close. Real Anarix tone (analytical, calm). All visuals use Periwinkle tokens. No new business logic.

## 1. Shared building blocks (new)

Create `src/website/components/marketing/`:
- `StatBlock.tsx` — oversized number + label + delta (e.g. "$200M+ / managed ad spend / +38% YoY"). Uses Satoshi 600, 64–96px.
- `SectionHeader.tsx` — eyebrow chip + H2 + lead paragraph, consistent across pages.
- `SplitFeature.tsx` — 50/50 text + visual slot, alternating left/right.
- `WorkflowDiagram.tsx` — framer-motion node-and-edge diagram (Connect → Diagnose → Draft → Approve → Execute), animated stroke draw.
- `AppEmbedFrame.tsx` — chrome wrapper (faux toolbar dots + label) for read-only app screenshots/components, `pointer-events-none`, `scale-[0.92]`.

Create `src/website/components/embeds/` (read-only, mock data, no app context required):
- `EmbedKpiStrip.tsx` — 4 KPI cards (Revenue, ROAS, TACoS, Orders) styled like `KPICard`.
- `EmbedCampaignTable.tsx` — 6-row campaign table with sticky first col, status badges, sparkline column.
- `EmbedScatterMargin.tsx` — SVG scatter (margin vs spend) with quadrant guides.
- `EmbedDayparting.tsx` — 7×24 heatmap grid with Periwinkle scale.
- `EmbedRuleCard.tsx` — rule definition card (IF/THEN block + guardrail chips + Preview/Approve buttons).
- `EmbedInsightCard.tsx` — Aan insight card (severity dot + title + 2-line diagnosis + "Open in Aan" link).

Create `src/assets/website/` illustrations via imagegen (4 abstract Periwinkle visuals: data lattice, signal flow, decision tree, calm waveform). Used as section accents only.

## 2. Home (`src/website/pages/Home.tsx`)

New section order (replacing current flat stack):

1. **HeroSection** (existing, kept)
2. **SocialProofSection** (existing, kept — tightened)
3. **StatBand** (new) — 4 oversized StatBlocks in a single row: $200M+ ad spend, $1.2B GMV, 4.2x median ROAS, 12.8% TACoS.
4. **ProblemSection** (new) — editorial: "Most ad platforms tell you what happened. None tell you what to do." 2-column with illustration.
5. **SolutionsSection** (existing, kept)
6. **ProductPreviewBand** (new, dense) — 3 `AppEmbedFrame` cards side-by-side (KPI strip, campaign table, dayparting heatmap) with caption underneath each.
7. **WorkflowDiagram** section — "How Aan works alongside your team" with the 5-node animated diagram.
8. **ImpactSection** (existing, kept)
9. **TestimonialsSection** (existing, kept)
10. **IntegrationOrbit** (existing component, re-used) — "Plugs into your stack"
11. **AuditCTASection** (existing, kept as editorial close)

## 3. Aan AI (`src/website/pages/AanAI.tsx`)

1. **Hero** — keep mascot, enlarge to 180px, add subtitle line "Anarix Analytical Neural — your second analyst." Add 3 inline stat chips below ("Reads 47 data sources", "Drafts in <8s", "100% auditable").
2. **What Aan does** (new) — `SectionHeader` + 5 capability cards in 2-row grid (existing capabilities, expanded copy 60–80 words each).
3. **WorkflowDiagram** — "From question to approved action" (5-step animated).
4. **Aan in your workflow** (new) — 3 `SplitFeature` blocks alternating, each with `EmbedInsightCard`, `EmbedRuleCard`, then Aan chat snippet on the right.
5. **Live chat** (existing `WebsiteAanChat`) — full width, taller (h-[560px]), with 4 suggested-prompt chips above.
6. **Safety section** (new) — "Aan suggests. You approve. Always." 3-column: Preview-first, Full audit log, Versioned drafts. Periwinkle illustration accent.
7. **CycloneScrollSection** (existing, kept)
8. CTA close.

## 4. Product pages

Common new structure for each (`Profitability`, `Advertising`, `Automation`, `ManagedServices`):

1. Hero (existing, kept).
2. **Problem statement** — 1 editorial paragraph + supporting StatBlock.
3. **Feature grid** (existing, kept — copy expanded).
4. **AppEmbedFrame deep-dive** — page-specific embed:
   - Profitability → `EmbedKpiStrip` + `EmbedScatterMargin`.
   - Advertising → `EmbedCampaignTable` + `EmbedDayparting`.
   - Automation → `EmbedRuleCard` + WorkflowDiagram (mini, 3 nodes).
   - ManagedServices → `EmbedInsightCard` triplet + team illustration.
5. **SplitFeature** (new) — 2 alternating blocks with longer prose (120–150 words each) covering "How it works" and "What you'll see in week 1".
6. **Outcome stat band** — 3 StatBlocks per page (page-specific metrics).
7. **Existing tail sections** kept (TacosSection on Profitability).
8. CTA close.

## 5. Visual + motion rules

- All motion: opacity + ≤8px translate, 180–240ms, `cubic-bezier(0.2,0,0,1)`.
- WorkflowDiagram: single SVG path draw on inView (once), 600ms.
- StatBlock numbers: count-up on inView (once, 800ms, ease-out).
- Embeds: `pointer-events-none`, no live data fetching, mock arrays inline.
- All colors via tokens (`bg-card`, `text-foreground`, `text-primary`, `border-border`).

## 6. Files

Create:
- `src/website/components/marketing/{StatBlock,SectionHeader,SplitFeature,WorkflowDiagram,AppEmbedFrame}.tsx`
- `src/website/components/embeds/{EmbedKpiStrip,EmbedCampaignTable,EmbedScatterMargin,EmbedDayparting,EmbedRuleCard,EmbedInsightCard}.tsx`
- `src/website/components/home/{StatBand,ProblemSection,ProductPreviewBand}.tsx`
- 4 illustrations in `src/assets/website/` via imagegen.

Edit:
- `src/website/pages/Home.tsx`
- `src/website/pages/AanAI.tsx`
- `src/website/pages/products/Profitability.tsx`
- `src/website/pages/products/Advertising.tsx`
- `src/website/pages/products/Automation.tsx`
- `src/website/pages/products/ManagedServices.tsx`

No backend changes. No route changes. No nav changes.
