## New Branding System — Phased Rollout

A "New Branding" toggle in Preferences gates everything. When OFF, the app looks identical to today. When ON, the new Anarix logo + new Aan coral-diamond mascot replace existing branding everywhere, progressively across phases.

We'll ship this in **5 phases**, one prompt per phase, so each layer is verified before the next.

---

### Phase 0 — Foundation (this prompt)

**Toggle infrastructure**

- New `BrandingContext` (`src/contexts/BrandingContext.tsx`) with `newBranding: boolean`, persisted to `localStorage` under `anarix-new-branding`.
- Wrap app in `<BrandingProvider>` in `src/main.tsx`.
- Add a "New Branding" switch section in `src/pages/settings/Preferences.tsx` (above Visual Effects), with description: "Enables the new Anarix logo system and Aan mascot across the app."

**Asset import**

- Copy uploaded SVGs into `src/assets/branding/`:
  - `anarix-full-light.svg` (from `full_logo_light_mode.svg`)
  - `anarix-full-dark.svg` (from `full_logo_dark_mode.svg`)
  - `anarix-symbol.svg` (from `logo_symbol.svg` — same in light & dark)
- Copy `loader_2.json` to `public/animations/aan-loader.json` (used for Aan idle).

**Brand component**

- New `src/components/branding/AnarixLogo.tsx`:
  - Reads `useBranding()` + `useTheme()`.
  - If `newBranding` ON → renders new SVGs (full = theme-aware, symbol = same).
  - If OFF → renders existing logo path (no behavior change).
  - Variants: `variant="full" | "symbol"`, sizing via className.

**Wire-in points (Phase 0)**

- `MiniSidebar`, `AppSidebar` header, `AppSidebar` collapsed state — replace inline logo refs with `<AnarixLogo />`.
- That's it for Phase 0 — proves the toggle gates the swap end-to-end.

---

### Phase 1 — Anarix logo everywhere

Sweep remaining surfaces: login page, NotFound, Aan workspace top bar, any PDF/report headers, favicon. All gated behind `newBranding`.

---

### Phase 2 — Aan mascot core (idle + cursor-aware + thinking)

**New component: `src/components/aan/AanMascot.tsx**`

- SVG coral diamond (extracted from `logo_symbol.svg`, fill `#F26E77`) inside a wrapper.
- Built with **Framer Motion** (already need to add `framer-motion` dep).
- Props: `state: "idle" | "listening" | "thinking" | "anchor"`, `size`, `interactive` (cursor-aware on/off).
- Eyes: two small dark dots inside the diamond, animated with `useMotionValue` to track pointer subtly (max 2px offset).
- States:
  - **idle** — gentle Y bob (`y: [0, -3, 0]`, 2.4s ease-in-out, infinite).
  - **listening** — scale 1 → 1.08, soft coral glow (box-shadow on wrapper).
  - **thinking** — diamond morphs (rotate 0 → 45 → 0, scale pulse 1.0 / 0.92 / 1.0, 1.2s loop). Optionally swap fill to Anarix blue `#4A62D9` mid-loop.
  - **anchor** — static, slightly above its container, no motion.
- All motion respects `prefers-reduced-motion` and the existing `VisualEffectsContext.numberAnimations`/`floatingIsland` flags.

**Showcase route: `/brand/aan**` (only visible when `newBranding` ON)

- Sequential sections demonstrating: still → meaning/fullform → idle loader → listening → thinking → cursor-aware playground.
- Used as proof + handoff reference; no app surfaces touched yet in this phase.

---

### Phase 3 — Aan in chat surfaces

Replace `Sparkles` icon usage with `<AnarixMascot size="sm" state={...} />` inside:

- `AanInput` (state: `listening` while focused, `thinking` while awaiting response).
- `AanConversation` assistant message avatar.
- `AanCopilotPanel` header.
- `AanWorkspaceSidebar` brand area.
- `AanTrigger` / `AskAanTooltip`.

All gated by `newBranding`. When OFF, current `Sparkles` icon stays.

---

### Phase 4 — Aan in app chrome

Final sweep, gated by `newBranding`:

- `FloatingActionIsland` "Ask Aan" pill — mascot replaces icon, idle bob.
- `AppSidebar` "Ask Aan" pill — mascot in `listening` state on hover.
- `AppTaskbar` Ask Aan fallback button.
- Loading skeletons in Aan-owned areas use the Lottie loader (`aan-loader.json`) at small size.

---

### Files & contracts


| Phase | New files                                                                | Edited files                                                                                                                   |
| ----- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| 0     | `BrandingContext.tsx`, `AnarixLogo.tsx`, 3 SVG assets, `aan-loader.json` | `main.tsx`, `Preferences.tsx`, `MiniSidebar.tsx`, `AppSidebar.tsx`                                                             |
| 1     | —                                                                        | `Login.tsx`, `NotFound.tsx`, `AanWorkspace.tsx`, `index.html` (favicon)                                                        |
| 2     | `AanMascot.tsx`, `pages/brand/AanMascotShowcase.tsx`, route in `App.tsx` | `package.json` (framer-motion)                                                                                                 |
| 3     | —                                                                        | `AanInput.tsx`, `AanConversation.tsx`, `AanCopilotPanel.tsx`, `AanWorkspaceSidebar.tsx`, `AanTrigger.tsx`, `AskAanTooltip.tsx` |
| 4     | —                                                                        | `FloatingActionIsland.tsx`, `AppSidebar.tsx` (Ask Aan pill), `AppTaskbar.tsx`, `loading-skeletons.tsx`                         |


### What this prompt builds

**Only Phase 0.** After you approve, I'll implement the toggle, asset import, the `AnarixLogo` component, and swap it into the two sidebars. You verify the toggle works (logo flips in sidebar when toggled), then prompt me with "Phase 1" / "Phase 2" / etc. to advance.   
  
Yes. The plan is strong, but a few **important states are missing** that will matter once this ships in real UI.

## The missing states I would add

### 1. **Hydrating / unresolved branding state**

When the app first loads, `localStorage` has not been read yet. Without a temporary state, you can get a flash of the wrong logo or mascot.

Use:

- `hydrating`
- render nothing or a neutral placeholder until branding is resolved

This is the biggest one to add.

---

### 2. **Legacy / fallback state**

You already have ON/OFF, but in implementation it helps to treat OFF as an explicit state, not just “default.”

Use:

- `legacy`
- `newBranding`
- `transitioning`

This makes the rollout logic clearer.

---

### 3. **Asset failure state**

SVG or Lottie can fail to load, especially in PDF/report surfaces or during network issues.

Use:

- `assetFallback`

Fallbacks should be:

- logo → text wordmark
- mascot → simple geometric diamond
- loader → static dot or pulse

---

### 4. **Reduced motion state**

You mention `prefers-reduced-motion`, which is good, but it should be treated as a full state branch, not just a flag.

Use:

- `motionReduced`

This should disable:

- bobbing
- cursor tracking
- morph loops
- glow pulses

Keep only opacity or instant swaps.

---

### 5. **Hover / focus / pressed states for mascot and logo**

You have the mascot’s behavioral states, but not its interaction states.

Add:

- `hover`
- `focus`
- `pressed`

These matter for:

- Ask Aan pills
- sidebar brand area
- launch triggers

Even if subtle, they make the system feel intentional.

---

### 6. **Speaking / responding state**

For the mascot, `thinking` is not enough if the assistant is actively generating or replying.

Add:

- `speaking`
- or `responding`

Useful when the mascot is acting as a conversational avatar rather than a passive loader.

Suggested distinction:

- `thinking` = computation in progress
- `responding` = output is being delivered
- `listening` = user input received

---

### 7. **Success / confirmation state**

When a user toggles branding on, or a brand action completes, you need a positive acknowledgment state.

Add:

- `success`
- `confirmed`

This can be a brief mascot bounce, glow, or check-like emphasis.

---

### 8. **Disabled / unavailable state**

For places where the mascot or new branding should not be interactive.

Add:

- `disabled`
- `unavailable`

This is useful for:

- restricted surfaces
- export contexts
- locked beta areas
- admin-only previews

---

### 9. **Collapsed / compact variants**

You already mention sidebar collapsed state, but the brand system should formally include compact variants.

Add:

- `compact`
- `mini`
- `iconOnly`

This is especially important for:

- app chrome
- favicon-like zones
- mobile
- narrow sidebars

---

### 10. **Print / export / static media state**

If your brand manual, PDFs, reports, or screenshots use these assets, you need a static-safe version.

Add:

- `static`
- `print`
- `export`

No motion, no glow, no interactive cursor behavior.

---

## For the mascot specifically, I would expand the state machine to this:

- `idle`
- `hover`
- `listening`
- `thinking`
- `responding`
- `anchor`
- `success`
- `disabled`
- `error`
- `reducedMotion`

That is a more complete production set.

---

## For the branding system itself, I would add these global states:

- `hydrating`
- `legacy`
- `newBranding`
- `transitioning`
- `assetFallback`
- `motionReduced`
- `staticExport`

---

## One more important thing

You should also define a **brand transition state** between OFF and ON.

That is separate from either endpoint.

Example:

- `legacy → transitioning → newBranding`

This matters because logo swaps, mascot swaps, and sidebar chrome should not snap abruptly. Even a 180–240ms crossfade makes the system feel designed.

---

## My recommendation

Add these before Phase 1:

1. `hydrating`
2. `transitioning`
3. `assetFallback`
4. `reducedMotion`
5. `hover/focus/pressed`
6. `responding`
7. `disabled`
8. `staticExport`

Those eight will save you from most real-world edge cases.  
  
also create a new tab in design system where you'll put all the states of aan and all its related components 

No existing layouts, colors, spacing, or behavior change when the toggle is OFF.