# Power UX: Shortcuts, Gestures, Tutorial — Two-Phase Delivery

Goal: turn keyboard shortcuts editable from inside the app, restore the Floating Action Island toggle, add system-wide swipe + multi-finger gestures with user-configurable mappings, and ship a full onboarding tutorial that fires after login.

---

## Phase 1 — Shortcuts editor, Island toggle, Gestures

### 1.1 Keyboard shortcut icon → functional editor

- The `⌘K` chip in `FloatingActionIsland.tsx` becomes a real button.
- Click opens a new component `KeyboardShortcutsDialog` (Dialog from shadcn) that:
  - Lists every shortcut grouped by category (reads the same source as Preferences).
  - Inline rebind: click row → "Press keys…" → captures next keystroke → saves to `localStorage` under `anarix-custom-shortcuts` (same key Preferences already uses, so the two views stay in sync).
  - Reset per-category and reset-all buttons.
  - Footer link: "Open in Preferences" → navigates to `/settings/appearance#shortcuts`.
- Refactor: extract the shortcut list + capture logic from `Preferences.tsx` into `src/features/shortcuts/shortcutRegistry.ts` + `src/features/shortcuts/ShortcutEditor.tsx` so both Preferences and the new dialog render the same editor.
- `KeyboardNavigationProvider` already loads handlers; add a `useEffect` that re-reads `anarix-custom-shortcuts` on `storage` event and rebinds.

### 1.2 Floating Action Island toggle restored in Preferences

- New section "Interface" → "Floating Action Island" with a `Switch` bound to `useVisualEffects().effects.floatingIsland`.
- Description explains the fallback: "When off, all island actions (Insights, Notifications, Aan, Screenshot, Refresh, Theme, Scroll-to-top) move into the right side of the App Taskbar."
- AppTaskbar already has an `islandOff` branch that renders these actions; audit and ensure parity:
  - Add missing actions (Screenshot, Refresh, Scroll-to-top, Theme toggle, Calendar/CalendarPlus, Ask Aan FAB).
  - Group into a single overflow `⋯` dropdown when row width is constrained.

### 1.3 Hard swipe = back/forward navigation

- New context: `src/contexts/GestureContext.tsx` mounting a single window-level pointer/touch listener.
- Hard swipe rules (touch + trackpad):
  - Two-finger horizontal swipe gesture on touchpad → uses `wheel` event with `deltaX` accumulation; if `|deltaX| > threshold` (default 120px) over <250ms → fire `history.back()` (right→left swipe) / `history.forward()` (left→right).
  - On touchscreen: track single-finger pointer events with `pointerType==="touch"`; trigger only when swipe starts within 24px of left/right viewport edge (iOS-style edge swipe) and `velocity > 0.5 px/ms`.
  - Cooldown 600ms to prevent double-firing.
- Visual feedback: tiny edge ribbon ("← Back" / "Forward →") animated in via framer-motion `slide-in-right` on trigger; auto-hides 400ms.
- Respect input fields: ignore when `event.target` is inside `input|textarea|[contenteditable]`.

### 1.4 Two/three-finger gestures

- Detection via `pointercancel/pointermove` tracking concurrent active pointers, OR for touchpads: `wheel` with `e.ctrlKey===false` and known multi-touch heuristics (browsers expose these only on touchscreens; on trackpads we fall back to keyboard chord equivalents shown in the mapper).
- Default mappings (all rebindable):
  - 2-finger swipe up → Scroll to top
  - 2-finger swipe down → Open Notifications panel
  - 2-finger swipe left → History back
  - 2-finger swipe right → History forward
  - 3-finger swipe up → Toggle Aan Copilot
  - 3-finger swipe down → Toggle Insights panel
  - 3-finger swipe left → Previous tab (e.g. Profitability → Trends)
  - 3-finger swipe right → Next tab
- Stored under `anarix-gesture-bindings` in localStorage.

### 1.5 Preferences → new "Gestures" section

- Visual help card: 8 illustrated tiles (2F↑↓←→, 3F↑↓←→) using SVG hand glyphs + arrows.
- Each tile shows: gesture diagram, current binding (dropdown of available actions), reset link.
- Live "Test gesture" panel at bottom that detects gestures and shows the name/binding it matched (read-only feedback).
- "Enable gestures" master switch (default ON).

### 1.6 Files added/edited (Phase 1)

```
ADD: src/contexts/GestureContext.tsx
ADD: src/features/shortcuts/shortcutRegistry.ts
ADD: src/features/shortcuts/ShortcutEditor.tsx
ADD: src/components/shortcuts/KeyboardShortcutsDialog.tsx
ADD: src/components/gestures/GestureMapper.tsx
ADD: src/components/gestures/GestureFeedbackToast.tsx
EDIT: src/App.tsx (mount GestureProvider inside Router)
EDIT: src/features/creative/FloatingActionIsland.tsx (clickable kbd chip)
EDIT: src/features/creative/KeyboardNavigation.tsx (re-read storage on change)
EDIT: src/components/layout/AppTaskbar.tsx (island-off action parity + overflow menu)
EDIT: src/pages/settings/Preferences.tsx (Island toggle + Gestures section + refactor shortcut UI to ShortcutEditor)
```

---

## Phase 2 — Onboarding Tutorial

### 2.1 Tutorial toggle in Preferences

- New section "Tutorial" with:
  - `Switch`: "Show product tutorial after sign-in"
  - Button: "Replay tutorial now" (forces it to start on next route load)
  - Status line: "Last completed: <date>" or "Not completed yet"
- State stored in `localStorage` key `anarix-tutorial`: `{ enabled: bool, completed: bool, lastSeen: ISO, currentStep: number }`.

### 2.2 Trigger after sign-in

- In `Login.tsx` success handler (or auth state listener), if `anarix-tutorial.enabled && !completed` → on next route after `/login`, mount `<OnboardingTutorial />`.
- `OnboardingTutorial` is a portal-mounted overlay rendered from `AppLayout` (so it sits above all panels).

### 2.3 Tutorial UX

- 12-step guided tour with these targets (each step has a stable `data-tour-id` attribute we add to existing elements — no DOM moves):
  1. Anarix sidebar logo (intro card, no spotlight)
  2. Marketplace selector
  3. Sidebar nav groups (Profitability, Advertising, etc.)
  4. Ask Aan button
  5. Main content / KPI cards
  6. AppTaskbar date range
  7. AppTaskbar marketplace + sync chip
  8. Table toolbar (filter + columns)
  9. Insights panel button
  10. Notifications bell
  11. Floating Action Island
  12. Keyboard shortcuts chip → opens shortcut editor as the finale
- Each step renders:
  - A fixed full-viewport `<svg>` mask with a transparent hole cut around the target's bounding rect (compute via `getBoundingClientRect` + `ResizeObserver`).
  - A tooltip card anchored to the target's nearest edge, framer-motion `fade-in + scale-in`, contains:
    - Step counter "3 / 12"
    - Title (Satoshi Variable, 18px)
    - One-paragraph description (Noto Sans, 14px)
    - Buttons: "Back" (ghost), "Skip tour" (link), "Next" (primary) → "Finish" on last step.
  - Soft spotlight halo: 24px radius blur ring around the hole using `box-shadow: 0 0 0 9999px hsl(var(--foreground)/0.55), 0 0 64px hsl(var(--primary)/0.4)`.
  - Auto-scrolls target into view on step change.
  - Auto-opens dependent panels for steps 9, 10, 11 (e.g. clicks the Insights button programmatically so the spotlight has something to point at).
- Keyboard: `→`/`Enter` next, `←` back, `Esc` skip.
- Motion: respects `prefers-reduced-motion` — switches to instant transitions.

### 2.4 Tutorial state machine

- Implemented in `src/features/tutorial/TutorialContext.tsx`:
  - `start()`, `next()`, `prev()`, `skip()`, `complete()`, `restart()`.
  - Persists on every step change so a refresh resumes mid-tour.
- Anti-collision rules:
  - Suppress tutorial during `trial==="syncing"` or `trial==="expired"`.
  - Hide Floating Action Island bell animations and notification toasts while active.
  - Lock background scroll on `<body>` (`overflow: hidden`).

### 2.5 Visual polish

- Tooltip card uses `bg-card` with 1px primary-tinted border, 16px padding, 12px radius, subtle drop shadow (no backdrop blur per the design memory).
- Progress bar: thin 2px line under the card filling to current/total, periwinkle gradient.
- Step transitions: 220ms `cubic-bezier(0.2,0,0,1)` (matches design system motion spec).
- "Finish" step shows a celebratory mini-confetti burst (CSS only, 1s pass) + brand sentence.

### 2.6 Files added/edited (Phase 2)

```
ADD: src/features/tutorial/TutorialContext.tsx
ADD: src/features/tutorial/OnboardingTutorial.tsx
ADD: src/features/tutorial/TutorialStep.tsx
ADD: src/features/tutorial/TutorialMask.tsx
ADD: src/features/tutorial/steps.ts (step definitions: id, target selector, title, body, side, panelToOpen)
EDIT: src/components/layout/AppLayout.tsx (mount <OnboardingTutorial /> portal)
EDIT: src/components/layout/AppSidebar.tsx, AppTaskbar.tsx, FloatingActionIsland.tsx, MarketplaceSelector.tsx, ProfitabilityDashboard hero, InsightsPanel trigger, Notifications trigger (add data-tour-id="..." attributes)
EDIT: src/pages/auth/Login.tsx (trigger tutorial on successful sign-in)
EDIT: src/pages/settings/Preferences.tsx (Tutorial section)
EDIT: src/App.tsx (wrap with TutorialProvider)
```

---

## 3. Verification

- Phase 1:
  - Click `⌘K` chip on island → editor opens; rebind "Open command palette" to `⌘ ⇧ K` → reload → new binding works.
  - Toggle Floating Action Island off in Preferences → island disappears → bell/insights/Aan all reachable from taskbar.
  - Two-finger swipe-left on a trackpad (or simulated wheel deltaX=400 within 200ms) → previous page in history; ribbon shows.
  - Open Gestures section → change "2F↑" to "Refresh"; perform gesture; toast confirms binding fired.
- Phase 2:
  - Sign out / sign in with tutorial enabled → tour starts on first analytics page.
  - Skip → state marked complete; sign-in again won't relaunch unless "Replay tutorial now" pressed.
  - Reduced-motion OS setting → animations instant, content identical.

## 4. Out of scope

- Backend persistence (everything stays in `localStorage` for this build).
- Translating shortcut sets per OS beyond `⌘`/`Ctrl` swap already done.
- Mobile-view variants of the tutorial (tour is shipped for desktop + tablet; mobile placeholder unchanged).
- New analytics features — this work is shell + onboarding only.
