## Make Ask Aan mascot truly live in the Action Island

The Action Island already renders an `AanMascot` for the Ask Aan button, but at `size={18}` it falls into the **micro tier** (`size < 24`) — which strips out eyes, blinking, cursor tracking, hover-petting, breathing float, and the floor shadow. So it looks alive in the screenshot but is actually a static morph shape.

### Change
In `src/features/creative/FloatingActionIsland.tsx`, swap the Ask Aan mascot props from:
```tsx
<AanMascot size={18} state="idle" interactive={false} />
```
to:
```tsx
<AanMascot size={26} state="idle" interactive floating />
```

This crosses the `size >= 24` threshold so the **full-tier** behavior activates:
- Eyes render and gaze toward the cursor
- Random blinks (4–8s interval)
- Body lean + tilt as the cursor moves
- Hover-petting tilt when hovered
- Slow vertical float
- Soft floor shadow under the diamond
- Coral aura pulse

### Layout safety
- Button height is `h-8` (32px). A 26px mascot fits with ~3px headroom; the existing `floating` adds 14px to container height — verify the row doesn't grow. If it visually grows, drop `floating` and keep size 26 (still full-tier).
- Keep `state="idle"` so it stays a diamond (matches the brand-manual rest state). Live state morphing is already handled globally by `AanPresencePortal`, not by this anchor.

### Files touched
- `src/features/creative/FloatingActionIsland.tsx` — one-line prop change on the Ask Aan mascot.

No other components, no API/state changes.
