## Goal
Shrink the Ask Aan mascot in the Floating Action Island pill, and fix the eye-to-body ratio across the entire app so the eyes scale evenly at every size — including the small mascots used in the left sidebar.

## Root cause of oversized eyes (sidebar)
In `AanMascot.tsx`:
```ts
const eyeSize = Math.max(4, size * 0.13);
```
The `Math.max(4, ...)` floor clamps the eyes to **4px** for any mascot ≤ ~30px. For the sidebar glyph (size 16) this means eyes are 25% of body — far too large. The proper proportional ratio (~13–16%) is overridden by the floor.

## Changes

### 1. `src/components/aan/AanMascot.tsx` — proportional eyes
- Remove the `Math.max(4, …)` floor. Use a single proportional ratio that holds across all sizes:
  - `eyeSize = size * 0.16` (slightly tighter at large sizes, but uniform).
  - `eyeOffsetX = (shape === "circle" ? size * 0.20 : size * 0.18)` (currently 0.18/0.16) — nudged so eyes sit symmetrically with the new eye size.
  - `eyeY = shape === "diamond" ? size * 0.04 : 0` (unchanged).
- Result by size:
  - 16px → eyes 2.56px (sidebar/navbar — small, proportional)
  - 24px → eyes 3.84px (Ask Aan tooltip)
  - 36px → eyes 5.76px (new pill mascot)
  - 64px → eyes 10.24px (workspace anchor)

- Also relax `trackCursor` so the mouse-sway works on compact tier when `interactive` is true:
  ```ts
  const trackCursor = interactive && !isStatic && tier !== "micro" && shape !== "bar";
  ```
  This lets the smaller pill mascot still sway toward the cursor.

- Allow `showEyes` for compact tier on idle/listening/speaking states (currently only full tier renders animated eyes). With proportional sizing this is now safe at small sizes.

### 2. `src/features/creative/FloatingActionIsland.tsx` — smaller pill mascot
- Drop mascot from `size={42}` to `size={32}`.
- Tighten pill: `h-9 pl-1 pr-3 gap-1.5` (was `h-11 pl-1 pr-3.5`).
- Cursor sway is preserved via the relaxed `trackCursor` rule above.

### 3. App-wide audit (no further edits required)
The fix is centralized in `AanMascot.tsx`, so all consumers automatically benefit:
- `AppSidebar` — `AanGlyph` at h-4 (size 16) → eyes now ~2.5px instead of 4px.
- `AppTaskbar` — same proportional improvement.
- `AanWorkspaceSidebar` — same.
- `AskAanTooltip` — size 24 mascot → eyes ~3.8px instead of 4px (small change, more harmonious).
- `AanLogo` — same.
- `AanConversation` generation loader, `AanPresencePortal` anchors — unchanged behavior, eyes scale proportionally.
- `AanMascotShowcase` — visual showcase reflects the new scaling automatically.

## Out of scope
- No changes to mascot shape morphing, aura, blink timing, or color tokens.
- No changes to mascot states or any other component logic.