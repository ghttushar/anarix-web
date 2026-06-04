## Scope

Five targeted fixes across the desktop app. UI/presentation only — no business logic changes.

---

### 1. Calendar / Date Range Picker design fix

File: `src/components/layout/AppTaskbar.tsx` (date range picker block) + reuse `src/components/ui/calendar.tsx`.

Issues in screenshot:
- Selected range "blob" overflows day cells creating a broken pill shape.
- Range end cell (11) sits on a misaligned darker square.
- Cancel/Apply footer feels detached.

Changes:
- Replace bespoke range styling with clean DayPicker range tokens: continuous `bg-primary/10` fill on middle days, solid `bg-primary text-primary-foreground` rounded squares for `day_range_start` / `day_range_end`, removing the oversized overlay rectangle.
- Normalize `cell` / `day` to equal 36px squares, remove `aria-selected:bg-accent` leak that caused the offset block under day 11.
- Tighten footer: single bordered bar, left-aligned range label in `text-muted-foreground`, right-aligned `Cancel` (secondary) + `Apply` (primary) with consistent 8px gap.
- Keep two-month layout, but add 16px gap between months and a faint divider.

### 2. Right-side panels must stay fixed to viewport

Affected: Profitability right rail (Sales Breakdown / Costs panel on Dashboard, Trends, P&L), Insights panel, Aan Copilot panel, Notifications panel, any workflow panel that currently lives in normal flow.

Change pattern (presentation only):
- Wrap each right panel root in `fixed top-[var(--taskbar-h)] right-0 h-[calc(100vh-var(--taskbar-h))] w-[var(--right-panel-w)]` with internal `<ScrollArea className="flex-1 min-h-0">`.
- Add `pr-[var(--right-panel-w)]` to the page main container when the panel is visible so content doesn't slide under it.
- Result: scrolling the main area never moves the panel; the panel scrolls independently only when the user scrolls inside it.

Files to touch: `src/pages/profitability/Dashboard.tsx`, `Trends.tsx`, `ProfitLoss.tsx`, `Geographical.tsx`, `UnifiedPnL.tsx`, plus the panel components under `src/components/profitability/` and `src/components/insights/InsightsPanel.tsx`, `src/components/aan/AanCopilotPanel.tsx`, `src/components/notifications/NotificationsPanel.tsx`.

### 3. Remove theme switcher from left nav

File: `src/components/layout/AppSidebar.tsx` (and `MiniSidebar.tsx` if mirrored).
- Delete the light/dark toggle row at the bottom of the sidebar.
- Keep the existing toggle in the Floating Action Island (already functional). No new code.

### 4. Opaque table backgrounds (fix horizontal-scroll bleed-through)

Files: `src/components/profitability/*Table*.tsx`, `src/components/tables/*.tsx` (Campaign, AdGroups, KeywordTargeting, ProductAds, etc.), plus `src/index.css` rules for sticky columns.

Changes:
- Replace any `bg-background/60`, `bg-card/80`, or implicit transparent on `<thead>`, sticky cells, expanded sub-rows, and Total rows with solid `bg-card` (light) / `bg-card` dark token.
- Sticky first column: `bg-card` on default rows, `bg-muted` on hover, `bg-primary/5` on selected — never `*/opacity` variants.
- Expanded detail row (screenshot shows "Premium Wireless Earbuds Pro Max" text overlapping the price column) → wrap in `bg-card` container with its own horizontal scroll synced to the parent; ensure expanded row's inner grid uses the same column widths so values don't overlap.
- Update the sticky-column opacity memory to: "Sticky cells must be 100% opaque using `bg-card`; never use `/opacity` modifiers."

### 5. Trends — convert performance graph to clustered scatter (zoomable)

File: `src/pages/profitability/Trends.tsx` + new `src/components/profitability/ClusteredScatterChart.tsx`.

Design (matches attached reference):
- Recharts `ScatterChart` with x = Profit Margin %, y = Ad Spend, bubble size = unit volume.
- Color bins by performance tier using reserved data-viz tokens: red (loss), amber (warning), green (healthy). No brand colors on dots.
- Cluster overlapping points: pre-process with a simple grid-bucket clustering at current zoom level; clusters render as larger circles with a count label ("5", "10"). On zoom-in, clusters split into individual points.
- Zoom controls (right edge, vertical stack): Fit, Zoom-in, Zoom-out, Reset — implemented via custom `viewBox` state on x/y domains.
- Hover tooltip card: product thumbnail, name, ID, SKU, "Ask Aan" chip, Profit Margin (green/red), Ad Sale value. Tooltip uses solid `bg-card` with `border-border`.
- Quadrant guides: dashed lines at x=0 and y=median spend.
- Animations limited to ≤200ms opacity/scale per project motion rules.

Existing line/bar/area toggle in Trends header stays; scatter becomes a new option in the chart-type selector.

---

## Out of scope
- No backend, no data shape changes, no new routes.
- Mobile/tablet variants untouched.

## Verification
- Calendar: open AppTaskbar date picker → range renders as clean filled band, Apply/Cancel aligned.
- Right panel: scroll main page on `/profitability/dashboard` → panel stays pinned; scroll inside panel works.
- Sidebar: theme toggle no longer present; Island toggle still flips theme.
- Tables: horizontal scroll on Products table → sticky Product column fully opaque, no text bleed.
- Trends: scatter renders clustered, zoom buttons split clusters, tooltip shows product card.
