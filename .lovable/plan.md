## Fix Sync State: Copy Mismatch + Dynamic Card

### Problem
1. **Copy/illustration mismatch** — headline says "Grab a coffee while we grab your data" but the illustration is a taco.
2. **Empty card** — `DataSyncingState` is a static card with a thin top shimmer. Feels lifeless for what should signal "intelligent work is happening."

### Fix Scope
Single file: `src/components/billing/DataSyncingState.tsx`. No route/layout changes — `/_state/syncing/*` URLs already render this component everywhere.

### 1. Copy alignment
Match the taco illustration with food/taco-themed copy (consistent with the existing §10.5 sanctioned "taco moment"):

- Headline: **"Hold tight — we're assembling your taco."**
- Sub: **"Crunching numbers, layering insights, and adding the good stuff. Your dashboard will fill in as the first sync wraps up."**

(Or alternate: "Building your data, one layer at a time." — will pick the taco-forward one unless told otherwise.)

### 2. Dynamic, "intelligent work" card background
Keep the card token-driven (Periwinkle, no gradients outside Aan zone — this is a sanctioned onboarding moment, but I'll stay restrained: opacity + position only, ≤220ms per §9.2). Layered ambient motion inside the card:

- **Scanning sweep line** — a 1px horizontal line in `brand.primary/30` that travels top→bottom every ~3.2s, like a data scanner passing over the surface. Single-axis, opacity-eased at the edges.
- **Pulsing data dots grid** — a faint 6×4 grid of 2px dots in `text.muted/15`. Dots light up to `brand.primary/60` in a staggered, sequential pattern (left→right wave), suggesting cells of data being processed. ~2.5s loop.
- **Existing top shimmer** — keep, lower opacity to 0.4 so it layers cleanly.
- **Live status ticker** — below the sub-copy, a small `text-xs text-muted-foreground` line that cycles through 3 messages every 2.4s with a fade (opacity only, 180ms):
  - "Fetching campaign performance…"
  - "Reconciling orders and ad spend…"
  - "Calibrating profitability signals…"
  Adds the "something intelligent is happening" signal without noise.
- **Progress hairline** — a 2px bar at the bottom edge of the card filling 0→85% over ~12s then holding (indeterminate-feel without lying about completion).

All animations are CSS keyframes (opacity + transform translateY/X only). Respects `prefers-reduced-motion` → disables sweep, dot pulse, and progress bar; keeps static state with ticker fade only.

### Layout (unchanged structure)
```
[top shimmer]
[scanning sweep — absolute]
[dot grid — absolute, low z]
   [taco illustration]
   [headline]
   [sub copy]
   [status ticker]
[progress hairline — bottom]
```

Card stays `min-h-[420px]`, `rounded-lg border border-border bg-card`, `overflow-hidden`.

### Out of scope
- Expired state (already prominent per prior work).
- Route changes.
- Any settings/profile pages.
- New tokens or theme changes.
