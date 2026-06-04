# Tablet Portrait — Sidebar Fix, Toolbar Responsiveness, UX Pass & 20 Ideas

## 1. Sidebar collapse/expand not working (Portrait)

**Root cause:** `useIsMobile` in `src/hooks/use-mobile.tsx` flips at `<768px`. Tablet portrait widths (≤820 incl. the 777-px preview) fall in or near that band, so shadcn's `Sidebar` switches into **Sheet (offcanvas)** mode. Our `AppSidebar` still tries to render its custom icon-rail + `PanelLeft` toggle, but the toggle calls `toggleSidebar`, which in mobile mode mutates `openMobile` (Sheet) — not `open` (rail). Net effect: rail stays frozen, expand button does nothing.

Additionally, `LayoutInner` auto-forces `setOpen(false)` on every `(orientation: portrait)` match, so even a successful expand can be re-collapsed by the orientation effect when it re-runs.

**Fix:**
- Force the shadcn `Sidebar` out of mobile/Sheet behavior on tablet portrait by switching the `useIsMobile` consumer used by `SidebarProvider` to respect `data-view="tablet"` (treat tablet as desktop-rail, never Sheet). Cleanest: add an internal `useIsMobileForSidebar` that returns `false` when `document.documentElement.dataset.view === "tablet"`.
- Make `LayoutInner`'s portrait auto-collapse fire **once on first portrait entry only** (guard with a ref), so user toggles aren't clobbered.
- Ensure `AppSidebar`'s collapsed-rail expand button is reachable in portrait: keep `AnarixLogo` symbol button as the expand trigger (already wired) and add a small floating `PanelLeft` chip pinned to the rail's top-right edge so the affordance is obvious on touch.
- When expanding in portrait, the sidebar should overlay the content (absolute-positioned) with a backdrop, not push, to preserve table width. Use `data-view=tablet][data-orientation=portrait]` CSS to switch `Sidebar` from `relative` → `absolute inset-y-0 left-0 z-40` while expanded; tap backdrop or nav-link to collapse.

## 2. Table toolbar not responsive (Portrait)

The toolbar row (`Products | Orders | Search | Upload Cogs | Delta | Group By | Filter | Columns | Export`) overflows horizontally because every control is `shrink-0` in a single flex row.

**Fix (in the shared Products/Orders table toolbar component used by Profitability Dashboard):**
- Wrap the toolbar in a responsive 2-zone layout: **Primary zone** (mode toggle + search, always visible, search becomes `flex-1`) and **Secondary zone** (Upload, Delta, Group By, Filter, Columns, Export).
- In portrait (`html[data-view=tablet][data-orientation=portrait]`), collapse the Secondary zone into a single **"Tools" overflow `DropdownMenu`** with a `SlidersHorizontal` icon. Each action becomes a menu item; toggle states (Delta active, filters count) show as trailing badges.
- Search input gets `min-w-0 flex-1` and an icon-only collapse at `<360px` toolbar width (button expands to a Popover with the input).
- Mode toggle (Products/Orders) stays as a segmented control but switches to icon-only labels in portrait.

## 3. Tablet Portrait UX Optimization Pass

Scoped, deterministic improvements (no creative reinterpretation):

1. **KPI cards** — current 2-col period grid in portrait is fine; tighten internal padding from `p-4` → `p-3`, reduce label size to 11px, keep numbers 14px bold black. Show only 4 of 6 metrics by default; "View More" expands inline.
2. **Forecast card** — already full width; add horizontal scroll-snap for the metric chip row to handle overflow cleanly.
3. **Performance Trend chart** — reduce y-axis label density (4 ticks max), drop the legend-row metric chips below into a horizontally scrollable strip with snap.
4. **Date picker + Run button** — stack vertically in portrait: date pill full-width row 1, Run button full-width row 2. Marketplace badge moves into AppTaskbar overflow.
5. **Breadcrumb** — truncate middle segments with ellipsis; only show last 2 levels in portrait.
6. **Right-side panels** (Insights/Notifications/Aan/ProductDetail/PeriodBreakdown) — already drawer-style in portrait per existing memory; verify backdrop tap-to-close works and width = `min(420px, 92vw)`.
7. **Floating Action Island** — shrink to icon-only pill in portrait, hide "Ask Aan" text label; ensure it doesn't overlap the table pagination row (bottom inset += 16px in portrait).
8. **Table body** — enable horizontal scroll with sticky first column (already designed); add an "edge-hint" gradient on the right edge to signal scrollable content.
9. **Pagination** — collapse "1-5 of 5" + page-size + arrows into a single compact group, page-size becomes `25` chip with popover.

All changes gated behind `html[data-view="tablet"][data-orientation="portrait"]` — desktop and landscape untouched.

## 4. 20 Tablet-View Ideas (for future selection)

1. **Split-view multitasking** — pin a secondary page (e.g. Campaign Manager) to a right rail while browsing Dashboard.
2. **Pull-to-refresh** on tables to re-run the current query.
3. **Long-press row → contextual radial menu** (Edit, Compare, Add to Watchlist, Ask Aan).
4. **Two-finger pinch on charts** to zoom date range; ties into existing GestureContext.
5. **Stylus annotations** layer over charts/screenshots that auto-save to the Aan thread.
6. **Picture-in-picture KPI** — drag a KPI card to detach as a floating, always-on-top mini widget.
7. **Edge-swipe drawer** for filters (left edge) and Aan (right edge) — discoverable, dismissable.
8. **Bottom action bar** in portrait that mirrors the Floating Island for thumb-reach.
9. **Tabbed workspaces** — keep multiple table states (filters/dates) as tabs at the bottom.
10. **Snap-to-grid dashboard re-layout** specifically tuned for 1024×768 / 820×1180.
11. **Live comparison mode** — drag one period card onto another to spawn a diff panel.
12. **Pen-mode for Aan** — handwritten prompts converted to text with stylus.
13. **Offline read-only cache** of last-viewed reports for travel.
14. **Voice query bar** — push-to-talk on the Aan FAB.
15. **Tablet-native onboarding** — guided cards using device tilt/gesture detection.
16. **Magnifier loupe** on dense table cells via long-press.
17. **Apple Pencil hover preview** for KPI deltas and chart points.
18. **Quick-glance lockscreen widget** spec (PWA) for ROAS/TACoS today.
19. **Drag-to-export** — drag a chart/table to the dock to generate a snapshot in `/mnt/documents`.
20. **Adaptive density auto-switch** — detect portrait → Compact density automatically with a one-tap revert toast.

## Files to touch (Phase 1 implementation)

- `src/hooks/use-mobile.tsx` — add tablet-aware variant
- `src/components/ui/sidebar.tsx` — consume tablet-aware mobile hook
- `src/components/layout/AppLayout.tsx` — guard portrait auto-collapse with first-run ref; add overlay mode CSS in portrait
- `src/components/layout/AppSidebar.tsx` — touch-friendly expand affordance
- `src/components/profitability/*Toolbar*` (the Products/Orders toolbar component) — primary/secondary zone refactor + overflow menu
- `src/index.css` — portrait-scoped overrides for KPI padding, chart, FAB, pagination
- `src/features/creative/FloatingActionIsland.tsx` — portrait icon-only mode

Out of scope: new business logic, desktop changes, ideas 1-20 (catalogued for later selection).