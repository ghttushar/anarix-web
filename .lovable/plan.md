
# Phase 5 — Mobile parity + alignment fixes

Goal: bring mobile to true desktop parity (no invented controls), fix table/toolbar/metric-bar alignment, and enforce semi-rigid layout (cards/rows expand-contract but never reflow into multiple lines).

## 1. Shell & navigation

**AppLevelBar (`MobileTaskbar.tsx`)**
- Remove Marketplace pill and Account pill from the bar.
- Remove "Switch to desktop" button (drawer footer too).
- Keep, in fixed order, single 44px row, no horizontal scroll:
  `[← Back] [Date chip] · · · [Home] [Aan] [Insights] [Alerts]`
- Right-side icon buttons get visible text labels next to icon: "Aan", "Insights", "Alerts" (Home stays icon-only). Min-width per button; icons 16px, label 12px Noto Sans.
- Bar layout uses `grid-cols-[auto_1fr_auto]` so left (back), center (date), right (action cluster) are fixed zones — they expand/contract but never wrap.
- Quick date chips: render under the bar only when date chip is tapped (sheet), not inline.

**TopBar (`MobileTopBar.tsx`)**
- Layout: `[Hamburger] [AnarixLogo] · · · [Theme icon] [Profile avatar]`
- Theme = small 32px icon button (Sun/Moon), adjacent to profile avatar. No "Dark" text button anywhere else.
- Profile avatar opens the same Profile dropdown as desktop (Profile / Billing / Settings / Preferences / Team / Sign out) via Radix DropdownMenu.

**Drawer (`MobileDrawerNav.tsx`)**
- Remove top "Anarix / Acme Brands / PRO" profile header band entirely (desktop drawer has no such header — parity).
- Header becomes: `[AnarixLogo (full)]                [X]` — one close icon only.
- Add Marketplace + Account selector at the top of the drawer body (same component used in desktop sidebar — `MarketplaceSelector` / `AccountSelector`). Two stacked dropdowns: Marketplace → then Accounts under it (no "Connect new" affordance).
- Remove bottom profile tile, theme toggle, and Desktop button from drawer footer (now lives in TopBar).
- Keep Super-sections (Analyze / Operate / Discover) and nav rows — these match desktop sidebar grouping.

**Delete files:** `MobileMarketplacePill.tsx`, `MobileAccountPill.tsx` (moved into drawer).

## 2. Metric selector bar (Profitability hero strip)

Current: 4 KPI cards in horizontal scroll → text clipped ("$4,…", "$1,…").
Fix in `MobileProfitabilityHero.tsx` (replaces forced CSS grid override):
- Layout: **2×2 CSS grid** (`grid-cols-2 gap-2`), no scroll.
- Each tile: 12px label / 18px value / 11px delta, `tabular-nums`, `truncate` only on label, value uses smaller font on <360px via `clamp(14px, 4.2vw, 18px)`.
- Currency abbreviation helper: `$1.2M`, `₹3.7Cr` so values never clip.
- Remove `.grid-cols-5` override from `src/index.css`.
- Wire into `Profitability/Dashboard.tsx` via `useViewport() === 'mobile'`.

## 3. Table toolbar (`MobileTableToolbar.tsx`)

- Two fixed rows, never wraps:
  - Row 1: `[Search (flex-1)] [Delta toggle] [Filter] [Columns]`
  - Row 2 (chip strip): `[Group By] [Date] [Saved view] [Export]`
- All buttons 32px height, icon+label, `shrink-0`, `gap-1.5`.
- "Delta" becomes an actual toggle (same component contract as desktop `DeltaToggle`) — not a separate icon. On = brand bg, Off = outline. Removes the broken icon+label overlap shown in screenshots.

## 4. Data tables (mobile)

Fix overlapping headers + "Tap to expand" sprawl in `MobileDataTable.tsx`:
- Render the **real desktop table** (current approach) but enforce:
  - All header cells `h-11`, `px-3`, `whitespace-nowrap`, `text-[12px] font-semibold`, single line.
  - First column sticky-left `bg-card` with right shadow, min-width 160px, max-width 200px, truncate product name to 2 lines max.
  - Numeric columns right-aligned, `tabular-nums`, min-width 72px each, no truncation of numbers.
  - Remove all "Tap to expand" placeholder cells. Every column always visible — user pans horizontally inside the table container (only tables may scroll-x, per memory).
  - Row expand chevron stays in column 0; expanded sub-rows render inline with same column grid (no separate "More / Open" links).
- Header row gets `sticky top-0 z-10 bg-muted/40` so it never overlaps content while scrolling.

## 5. Delta feature parity

- Use the same `useDeltaMode()` context the desktop tables use.
- When Delta ON: numeric cells render value + delta pill below (same component as desktop), green/red per design tokens.
- Remove the standalone "Delta" pseudo-button visual; bind to the shared toggle in step 3.

## 6. Audit & polish pass

After above:
- Sweep all mobile pages for: bottom-bar leftover offsets, duplicate close icons, `overflow-x-auto` on non-table containers (remove), `min-w-0` on flex parents.
- Verify no horizontal page scroll at 320 / 360 / 390 / 414 widths via preview.
- Verify AppLevelBar and TopBar icon clusters do not wrap at 320px (drop labels to icon-only below 360px as the only fluidity concession — formation preserved).

## Files

**Edit:** `MobileTaskbar.tsx`, `MobileTopBar.tsx`, `MobileDrawerNav.tsx`, `MobileTableToolbar.tsx`, `MobileDataTable.tsx`, `MobileProfitabilityHero.tsx`, `Profitability/Dashboard.tsx`, `src/index.css`.

**Delete:** `MobileMarketplacePill.tsx`, `MobileAccountPill.tsx`.

**No changes to:** desktop, tablet, data, auth, business logic.

## Out of scope
- New features, new icons, new copy beyond the 3 button labels (Aan/Insights/Alerts).
- Touching desktop `MarketplaceSelector` / `AccountSelector` internals (reused as-is).

Approve and I'll execute top-to-bottom in this order.
