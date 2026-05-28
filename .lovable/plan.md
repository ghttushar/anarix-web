## Goal

Introduce three distinct viewport variants of the app — **Desktop** (current build, untouched), **Tablet** (touch-optimized, no feature/layout changes), and **Mobile** (scaffold only, empty for now). User picks the variant explicitly from Preferences; choice persists and forces routing into that view's URL prefix. Each variant lives in its own folder for clean Figma-frame mapping.

## Locked decisions (from Q&A)

- **Folder structure:** sibling `src/views/desktop`, `src/views/tablet`, `src/views/mobile`.
- **Routing:** path-prefix per view — every existing route mirrored under `/desktop/*`, `/tablet/*`, `/mobile/*`. Root `/` redirects to the user's saved choice (default desktop).
- **Switching:** Hard override from Preferences. No auto device detection. Persisted per user. Small badge in the taskbar shows active view.
- **Touch targets:** min 44×44, primary actions 48×48.
- **Hover removal:** all hover-only affordances become persistent (icons always visible, no hover-reveal).
- **Tooltips:** long-press 500ms; native `title` retained for stylus.
- **Gestures:** swipe-left on table rows = row actions; swipe-right from left edge of right-side panels = close.
- **Aan on tablet:** tap-driven core + stylus hover allowed (pointerType=pen) + persistent bottom-right Aan FAB replaces pointer-follow.
- **Keyboard:** use `h-dvh` and `visualViewport` API. Keyboard overlays; input scrolls into view; layout doesn't shrink.
- **Orientation:** single responsive tablet layout. Sidebar = icon rail in portrait, expanded in landscape.

## Architecture

```text
src/
  app/              ← shared business logic (contexts, hooks, data, types) — single source of truth
  views/
    desktop/        ← current shell + screens (moved/re-exported from existing src/)
      AppLayout.tsx
      pages/...
    tablet/         ← new touch-first shell + screens
      AppLayout.tsx
      shell/ (Sidebar, Taskbar, FloatingAanFab, PanelHost)
      pages/...
      primitives/ (TouchButton, LongPressTooltip, SwipeRow, KeyboardSafeArea)
    mobile/         ← stub only; placeholder route
  contexts/
    ViewportContext.tsx   ← exposes 'desktop' | 'tablet' | 'mobile', persisted
  App.tsx           ← top-level router with /desktop, /tablet, /mobile prefixes + root redirect
```

Existing `src/pages/*` and `src/components/*` stay in place for Phase 1; the desktop view re-exports them. Tablet screens import the same containers/hooks from `src/app` / existing data layer — only the **presentational shell and primitives** fork.

## Routing model

- `/` → redirects to `/<savedView>` (default `/desktop`).
- `/desktop/*` → mounts current router tree (unchanged behavior).
- `/tablet/*` → mounts tablet router tree, same route paths under it.
- `/mobile/*` → renders an "Mobile view coming soon" placeholder.
- A tiny `<ViewBadge>` in the AppTaskbar shows the active view and links to Preferences.
- Switching view in Preferences: rewrites the current URL prefix in place (preserves the remainder of the path + query + state).

## Tablet-specific interaction rules

| Concern | Desktop today | Tablet rule |
|---|---|---|
| Tap target min | ~32–36px | 44×44, primary 48×48 |
| Hover reveals | Row actions, pin/sort icons, edit pencils | Always visible |
| Tooltips | Radix hover | `LongPressTooltip` (500ms) + native `title` for stylus |
| Right-side panels | Click outside / X | Same + swipe-right from left edge |
| Table row actions | Hover row → buttons appear | Swipe-left → action drawer |
| Aan mascot | Follows cursor, reacts to hover | No follow; tap-driven; stylus hover via pointerType=pen; persistent bottom-right Aan FAB |
| Dropdowns / menus | Open on click, dense items | Same logic, items padded to 44px, scrollable |
| Date range picker | Hover preview | Tap to select, explicit Apply/Cancel (already present) |
| Keyboard | n/a | `h-dvh` shell; `visualViewport` listener auto-scrolls focused input above keyboard; layout fixed |
| Orientation | n/a | Portrait: sidebar rail (56px); landscape: expanded sidebar |

No features added, no features removed, no information architecture changes — only the input layer changes.

## Phases

**Phase 1 — Scaffold**
- Create `src/views/{desktop,tablet,mobile}` + `src/contexts/ViewportContext.tsx`.
- Move/re-export current shell under `views/desktop` (zero behavior change).
- Add `/desktop`, `/tablet`, `/mobile` prefix routing in `App.tsx` + root redirect.
- Add three view buttons (Desktop / Tab / Mobile) in **Preferences**; persist choice; clicking rewrites prefix.
- Add `ViewBadge` in `AppTaskbar`.
- Mobile shows a placeholder.

**Phase 2 — Tablet shell + Aan**
- Build `views/tablet/AppLayout.tsx`, tablet `AppSidebar` (rail + expanded modes by orientation), tablet `AppTaskbar`, panel host.
- Build touch primitives: `TouchButton` (44/48), `LongPressTooltip`, `SwipeRow`, `SwipePanel`, `KeyboardSafeArea`.
- Add tablet `FloatingAanFab` (bottom-right), wire it to existing `AanContext`.
- Disable hover-only states inside tablet shell via a `data-view="tablet"` attribute on `<html>` + Tailwind variant override.
- Implement `visualViewport` listener for keyboard.

**Phase 3 — Tables, filters, date picker, dropdowns**
- Tablet-tuned wrappers around shared table components: persistent row actions, swipe-left drawer, 44px row min-tap on action cells (keeps dense numeric rows visually unchanged), padded menu items, larger hit areas on pin/sort icons.
- Tablet date range picker layout (same logic).
- Filter builder with touch-padded chips/inputs.

**Phase 4 — Advertising module screens** (Campaign Manager, Campaign / Ad Group / Product detail, Impact Analysis + drill-downs, Targeting Actions, Rule Creation, Anomaly Alerts, Budget Pacing, Search Harvesting, Creative Analyzer, Applied Rules, Rule Agents).

**Phase 5 — Profitability module** (Dashboard, Trends, P&L, Geographical, Unified P&L, Period/Product detail panels).

**Phase 6 — Reports + Aan workspace** (Reports list, Client Portal, full-screen `/aan` workspace, Aan copilot panel, AskAan tooltip → long-press text-selection on tablet).

**Phase 7 — BI / Catalog / AMC / Settings** (Brand SOV, Keyword/Product SOV, Keyword Tracker, Competitor Pricing, Day Parting heatmap with finger-friendly cells, Catalog Products + Inventory Ads, AMC Instances/Queries/Audiences/Schedules, Settings pages).

**Phase 8 — Orientation, keyboard, gesture polish**
- Portrait vs landscape sidebar rail/expanded.
- Keyboard overlay verified across all input-heavy screens (Rule Creation, Filter Builder, Aan input, Auth).
- Gesture conflicts audited (horizontal table scroll vs swipe-row).
- Stylus pointerType=pen hover states enabled where it adds clarity.

**Phase 9 — QA pass**
- Walk every tablet route in both orientations on a real tablet viewport (1024×768 and 1366×1024).
- Verify no hover-only affordance anywhere.
- Verify Aan FAB opens panel and mascot behavior is tap/stylus only.
- Verify view-switcher round-trip preserves filters/date range.
- Verify keyboard never hides focused input.

## Out of scope (this project)

- Mobile screens (folder exists, route exists, content is a placeholder).
- Any feature, layout, hierarchy, or data change for desktop or tablet.
- Auto device detection.

## Deliverable for next message

If approved, I'll execute **Phase 1 only** (scaffold + Preferences switcher + routing + ViewBadge + Mobile placeholder). Phases 2+ proceed one at a time on your approval after each.