# Phase 4 — Mobile Completion + Selected Enhancements + Shell Overhaul

One shipment. Three tracks. All inside the existing design system (Periwinkle, Satoshi/Noto, motion budget respected, no gradients outside Aan).

---

## Track 0 — Mobile Shell Overhaul (new, per latest message)

The mobile shell collapses to two tiers: **TopBar (hamburger + logo)** and **AppLevelBar (the only action surface)**. Bottom bar is removed entirely.

### 0.1 Remove MobileBottomBar
- Delete the 3-slot bottom nav. Home / Aan / Alerts move to the AppLevelBar.
- Remove the `pb-14` and `env(safe-area-inset-bottom)` reservation from `MobileShell.tsx`.
- Mobile gains back ~56px of vertical space.

### 0.2 Redesign AppLevelBar (mobile = "desktop with Floating Island off")
A single sticky bar directly under the TopBar. Layout, left → right:

```
[ ← Back ][ Breadcrumb ]  [ Date ]  [ Marketplace ][ Account ]  [ Home ][ Aan ][ Bell ]
```

- Height 44px, surface.card bg, 1px ui.secondary bottom border. Single horizontal scroll only if overflow.
- **Back + Breadcrumb pill** — single `← Parent` pill (per B1).
- **Date chip** — opens MobileRightSheet date picker (per A4) with Quick Date Chips row (per B5) at top.
- **Marketplace pill** — current `MobileMarketplacePill` moved here from TopBar.
- **Account pill** — new `MobileAccountPill` (see 0.3 below). Shown only when the selected marketplace has ≥1 connected account.
- **Home icon button** — navigates to `/profitability/dashboard`. Active state when on that route.
- **Aan icon button** — navigates to `/aan`. Uses `AanGlyph` with `aan-gradient-text`. The only place gradient is allowed.
- **Bell icon button** — opens notifications RightSheet. Shows red dot when `criticalCount > 0`.

### 0.3 Two-dropdown Marketplace + Account (no "Connect new")
Problem: each marketplace can have multiple connected accounts; user must pick both, and we must not surface "connect new".

Design: **two sequential pills**, not nested.

- **Pill 1 — Marketplace** (existing `MobileMarketplacePill`, no change to options): Amazon / Walmart / Shopify / TikTok.
- **Pill 2 — Account**: new `MobileAccountPill.tsx`. Opens a bottom sheet listing only accounts under the currently selected marketplace (from `useAccounts()` filtered by `marketplace === current`). Each row: merchantName (14px), `region · accountType · merchantId` (12px muted). Tap = select + close. No "+ Connect new" button anywhere. If the marketplace has 0 accounts, the Account pill renders disabled with label "No accounts".
- Switching marketplace auto-selects the first account for that marketplace (or clears Account pill if none).
- Persist `currentAccountId` per marketplace in `AccountContext` (already supported via `setCurrentAccount`).

### 0.4 TopBar cleanup
- Remove the bell from `MobileTopBar.tsx` (moved to AppLevelBar).
- Remove the marketplace pill from `MobileTopBar.tsx` (moved to AppLevelBar).
- TopBar becomes: `[Hamburger] [AnarixLogo]`. Nothing else. 56px tall.

### 0.5 Drawer (hamburger) redesign
Fix the listed issues and make it feel like a real product surface, not a stock sheet.

Concrete changes to `MobileDrawerNav.tsx`:
- **Single close affordance** — remove the duplicate X. Radix `Sheet` already renders a built-in close button in the top-right; our custom header X must go. One X only.
- **Remove currency switcher** from the drawer footer.
- **Theme = single icon button** (Sun ↔ Moon toggle), matching `WebsiteThemeToggle`. No 3-card Light/Dark/System grid in the drawer. (System theme remains available inside Preferences page.)
- **Profile tap** opens an inline expansion (not a separate route) listing: Profile, Billing, Settings, Preferences, Team, Sign out. Same items the desktop/tablet profile menu exposes. Tap on any item navigates to its existing route under `/settings/*` or `/profile`.
- **Creative redesign** (within design system — no gradient backgrounds, no parallax, no motion >220ms):
  - Header band: 96px tall, surface.card with a 1px ui.secondary divider, brand mark left + organization name + plan badge.
  - Nav grouped into 3 lettered sections with 11px uppercase muted labels: **Analyze** (Dashboard, Trends, Geographical, Unified P&L, Profit & Loss), **Operate** (Campaign Manager, Day Parting, AMC), **Discover** (BI suite, Catalog, Reports).
  - Each nav item: 44px row, 20px icon, 14px label, right-aligned chevron only on items that open a submenu. Active item: `brand.primary` left rail (2px) + 12% bg.
  - **Profile block at the bottom**: 64px tile with avatar + user name + email, tap to expand the inline submenu (see above). Below it: Theme icon button + Sign out icon button on a single row.
  - 16px page padding throughout, 8px gap between items, 16px gap between groups.

### 0.6 Aan FAB removal on `/aan`
Moot — bottom bar is gone entirely. Aan icon in AppLevelBar simply highlights when active route is `/aan`.

---

## Track A — Phase 1-3 Gap Closure

A1. **Stacked Profitability Hero** — real `MobileProfitabilityHero.tsx`, remove `.grid-cols-5` CSS override.
A2. **MobileTableToolbar wiring** — Catalog/Products, Profitability/Trends, Profitability/Geographical, BI/KeywordTracker, AMC/Queries, DayParting/HourlyData, Reports/ClientPortal, Advertising/CampaignManager.
A3. **Sticky first-column markers** — add `data-mobile-table` wrappers to Campaign Manager + P&L matrices + Day Parting hourly grid.
A4. **MobileRightSheet adoption** — Filter Builder, Column Visibility, Group By, Date Range Picker open as RightSheet on mobile (Filter Builder overridden to BottomSheet by B4).
A5. **AppTaskbar delegate** — forward `actions` slot into `MobileTaskbar`/AppLevelBar.
A6. ~~Aan FAB removal~~ — handled by Track 0.
A7. ~~Duplicate light/dark toggle removal~~ — handled by Track 0.5.

---

## Track B — 8 Selected Enhancements

B1. **Breadcrumb Back Pill** — replaces multi-segment breadcrumb on AppLevelBar.
B2. **Inline Delta Sparkbars** — `MobileDeltaSparkbar.tsx`, 24px bar + 11px value.
B3. **Cell expand-on-tap** — `MobileCellPopover.tsx`.
B4. **Bottom-sheet Filter Stack** — `MobileBottomSheet.tsx`, 70vh, drag-to-dismiss. Filter Builder routes here.
B5. **Quick Date Chips** — `MobileQuickDateChips.tsx`, top row of date sheet.
B6. **Compact KPI Stack** — `MobileKpiStack.tsx`, 2-col 64px tiles. Used by Profitability hero (overrides A1 layout to 2-col grid).
B7. **Chart Peek Mode** — `MobileChartPeek.tsx`, 64px sparkline → tap → full chart in BottomSheet. Solves "data viz in one screen, no horizontal scroll" for chart-heavy pages by collapsing chart real estate.
B8. **Aan Inline Answer Card** — extend `AskAanTooltip` to render answer inline on mobile.
B9. **Snack-Stack toasts** — sonner `position="bottom-center"`, `offset={16}` (now that bottom bar is gone), `visibleToasts={3}`.

---

## Data Viz "one screen, no horizontal scroll" enforcement

- All charts on mobile wrapped in `MobileChartFrame` (already exists) → forces `width: 100%`, fixed aspect.
- Audit `Profitability/Dashboard`, `Trends`, `Geographical`, `BI/KeywordTracker`, `Day Parting` to ensure every chart container has `min-w-0` and no fixed `min-width` style.
- Replace any side-by-side dual-chart layouts on mobile with vertically stacked `MobileChartPeek` cards.
- Tables remain the only surface allowed to scroll horizontally (per Phase 3 contract).

---

## File Map

**New**
```
src/views/mobile/
  MobileAccountPill.tsx
  MobileProfitabilityHero.tsx
  MobileDeltaSparkbar.tsx
  MobileCellPopover.tsx
  MobileBottomSheet.tsx
  MobileQuickDateChips.tsx
  MobileKpiStack.tsx
  MobileChartPeek.tsx
```

**Edited**
- `MobileShell.tsx` — drop bottom bar reservation
- `MobileTopBar.tsx` — strip bell + marketplace
- `MobileTaskbar.tsx` — becomes the AppLevelBar described in 0.2
- `MobileDrawerNav.tsx` — full redesign (0.5)
- `MobileBottomBar.tsx` — **deleted**
- `AppTaskbar.tsx` — forward `actions` slot
- `index.css` — remove `.grid-cols-5` override
- 8 table pages (toolbar wiring + sticky markers)
- Filter Builder, Column Visibility, Group By, Date Range Picker (sheet adoption)
- `Profitability/Dashboard.tsx` (hero swap)
- `AskAanTooltip.tsx` (inline answer on mobile)
- `main.tsx` or wherever `<Toaster />` mounts (sonner config)

---

## Order of execution

1. **Track 0 first** — shell overhaul (TopBar strip, AppLevelBar redesign, dual marketplace+account pills, drawer redesign, delete bottom bar).
2. A5 (taskbar slot forwarding) and A4 (sheet adoption) — unblocks panels.
3. A2 + A3 (toolbar + sticky markers across 8 pages).
4. A1 + B6 (Profitability hero + KPI stack).
5. B1 + B5 (back pill + quick date chips) in the new AppLevelBar.
6. B2 + B3 (sparkbars + cell popover) inside tables.
7. B4 (filter bottom sheet).
8. B7 (chart peek) across chart pages — completes "data viz in one screen" rule.
9. B8 + B9 (Aan inline + snack-stack).

---

## Out of scope
- Any desktop or tablet changes.
- Data, endpoints, auth, business logic.
- Adding a "Connect new account" affordance anywhere on mobile (explicit user constraint).
- The 7 unselected ideas from the earlier batch.

Approve and I'll execute top to bottom in build mode.