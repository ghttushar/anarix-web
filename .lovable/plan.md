
# Tablet Touch Fixes — Plan

Scope: tablet only (`html[data-view="tablet"]`). No desktop visual or layout changes. No feature changes.

## Problems

1. **Tables don't scroll on touch.** Tapping a row triggers row click/expand (esp. PnL) instead of scrolling. Touch is being consumed by row handlers / pointer events. PnL row toggles on every tap.
2. **Marketplace selector requires hover.** Tapping an Amazon/Walmart/Shopify/TikTok pill only switches the marketplace; the account hover-popup never opens on touch, so accounts cannot be picked.
3. **Floating Action Island drag stops after ~1 cm.** The drag handle uses `onPointerDown` + `e.preventDefault()` but the browser still steals the gesture as a pan because `touch-action: manipulation` is applied globally to all buttons in tablet, and there is no `setPointerCapture`.
4. **Island expand behavior on tablet is undefined.** Today it is forced expanded permanently on tablet (no way to collapse), which eats horizontal space in portrait.

## Fixes

### 1. Table scroll vs tap (tablet)

- **CSS:** add `touch-action: pan-y` to table rows on tablet so the browser keeps vertical scrolling even when the row has a click handler.
  ```css
  html[data-view="tablet"] table tr,
  html[data-view="tablet"] [role="row"] { touch-action: pan-y; }
  ```
- **PnL expand row (and any "row click = expand" table):** require an explicit chevron tap on tablet. The row's `onClick` will be gated so it only fires when the tap originated on a `[data-row-toggle]` element (chevron). The chevron itself gets `min-h-11 min-w-11` via existing `h-8/h-9` rule.
  - Files: `src/components/profitability/ProductsPnLTable.tsx`, `src/components/tables/CampaignTable.tsx`, and any other table with a whole-row expand click. We will audit and apply only to ones that currently expand on row-body click.
- **Ensure scroll containers fill height** so finger drag on a row inside the container scrolls the container, not the page. Already covered by `-webkit-overflow-scrolling: touch` and `overscroll-behavior: contain`.

### 2. Marketplace selector — tap to open accounts

Convert hover behavior to tap-friendly without changing desktop hover.

- `src/components/layout/MarketplaceSelector.tsx`:
  - Add `onPointerDown` (with `pointerType === "touch"` or `"pen"`) that opens the `MarketplaceHoverPopup` for that marketplace instead of (or in addition to) selecting it.
  - First touch on a marketplace pill → opens the account popup (does **not** switch marketplace).
  - Tap on an account in the popup → selects account (existing `onSelectAccount`).
  - Tap on the marketplace pill again while popup is open → closes popup.
  - Tap outside (overlay) → closes popup. Add a transparent fixed overlay element while `hoveredMp` is set on tablet so we get a reliable dismiss target.
  - Mouse hover behavior on desktop is unchanged.
- `MarketplaceHoverPopup.tsx`: enlarge tap targets (account buttons get `min-h-11`), make sure portal popup ignores the global `touch-action: manipulation` rule blocking long press if any. No visual changes on desktop.

### 3. Floating Action Island drag

`src/features/creative/FloatingActionIsland.tsx`:
- Drag handle `<button>`: add inline `style={{ touchAction: "none" }}` and call `e.currentTarget.setPointerCapture(e.pointerId)` in `handleDragStart`. Switch global listeners to be attached only for the captured pointer (or simply use `pointermove`/`pointerup` on the captured element). This is the standard fix for "drag only moves 1 cm before the browser takes the gesture as a pan".
- Keep desktop behavior intact (already uses pointer events).

### 4. Island expand/collapse on tablet

Today: `isTabletView` forces `isExpanded = true` permanently. That hides the compact form.

- Default: **collapsed** on tablet (matches desktop default).
- Tap on the Aan mascot pill, the grip handle, or any action button area to toggle expand on tablet (use a dedicated 44×44 chevron-style expander button visible only on tablet, placed next to the grip). Hover-to-expand on desktop is unchanged.
- Tapping a visible action still fires that action — the chevron is the only toggle.
- Auto-collapse 4 seconds after the last action on tablet so it does not block content.

### 5. General tablet polish

- Add `touch-action: pan-x pan-y` to `[class*="overflow-auto"]` etc. on tablet (currently only momentum + overscroll). Belt-and-braces against any ancestor `touch-action: manipulation` interfering.
- `MarketplaceHoverPopup` portal: increase `max-h-[200px]` to `max-h-[60vh]` on tablet so long account lists are reachable with thumb scroll.
- `AccountSelector` (Settings) chevron rows already large enough; verify with audit, no visual change planned.

## Files touched

- `src/index.css` — add tablet rules for `table tr` touch-action, popup max-height override.
- `src/components/layout/MarketplaceSelector.tsx` — tap-to-open behavior + outside-tap dismiss overlay.
- `src/components/layout/MarketplaceHoverPopup.tsx` — larger tap targets, taller list on tablet.
- `src/features/creative/FloatingActionIsland.tsx` — drag capture + `touch-action: none` on handle, default-collapsed on tablet, chevron toggle, auto-collapse.
- `src/components/profitability/ProductsPnLTable.tsx` — gate row-click expand to chevron on tablet.
- `src/components/tables/CampaignTable.tsx` + any other whole-row-expand table found in audit — same gating pattern.

## Out of scope

- Mobile (`/mobile`).
- Any desktop visual, copy, layout, or feature change.
- Any new feature, new component, or restyling of tables, charts, sidebars, taskbar, KPI cards.
- Changing existing onClick semantics on desktop.

## Validation

- iPad 11 (834×1194 + 1194×834) and iPad Pro (1024×1366 + 1366×1024), portrait + landscape:
  - Scroll a long table by dragging on a row — page scrolls; row does not expand.
  - PnL: tap chevron → row expands; tap row body → nothing.
  - Tap Amazon pill → account popup opens; tap an account → selected; tap outside → closes.
  - Drag the action island by the grip across the screen — follows finger end-to-end, no 1cm cap.
  - Action island starts collapsed; tap chevron expands; auto-collapses after idle.
- Desktop unchanged: hover popup still opens on hover, island still expands on hover, drag still works with mouse.
