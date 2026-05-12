## Goal

Give Aan a single, continuous travel motion tied to the generation lifecycle:

1. **Rest** — Aan sits as a diamond above the input box (current behavior, unchanged).
2. **Send** — User presses Enter → Aan morphs into a **ball (circle)** and travels from the input slot down into the in-progress generation card.
3. **Generate** — While docked in the generation card, Aan stays as a ball and a **floating-dots thinking indicator** plays next to it.
4. **Return** — When generation completes, Aan travels back up to the input slot and re-morphs to its resting diamond. The completed assistant message remains in the conversation as a normal bubble (the existing empty/box-only style stays as it is now).

No new components, no new libraries — this builds on the existing `AanPresencePortal` + `layoutId="aan-presence"` system, which already animates a single mascot between registered anchors.

## Files to change

### 1. `src/components/aan/AanPresencePortal.tsx`
- Force the mascot's `shape` to `"circle"` (ball) whenever `activeAnchor === "generation"`, regardless of state. This is the visual "morph into ball" the user described.
- Keep `state="working"` so internal timing/aura still reads as active.
- Keep `state="idle"` (diamond) when anchor is `"input"` so it returns to its resting diamond shape automatically.

### 2. `src/components/aan/AanConversation.tsx` (generation card only — lines 105–142)
- Inside the loader card, place the mascot anchor on the **left** and a new **floating dots indicator** on the **right**, in a single horizontal row (instead of the current vertically stacked layout).
- Replace the current "Xs remaining" text with a calmer "Aan is generating your report…" line and the three-dot animation underneath/next to it. Keep `CircularProgress` as the legacy fallback when `newBranding` is false (unchanged).
- Anchor slot stays sized for a ~44–48px ball so the morph lands cleanly inside the card.

### 3. New: `src/components/aan/FloatingDots.tsx`
- Tiny presentational component: three dots that fade/translate in sequence using existing Tailwind keyframes (or a small inline framer-motion stagger). Uses `text-muted-foreground`. No new dependencies.

### How the travel itself works (already in place — no change needed)
- `AanPresenceContext` priority order is `["generation", "pending", "lastMessage", "input"]`.
- When `isGenerating` flips true, `AanConversation` registers the `generation` anchor → `activeAnchor` switches → `AanPresencePortal` re-portals the **same** `<AanMascot layoutId="aan-presence">` into the new DOM node. Framer Motion's shared layout animates position + size between the two anchors automatically. That is the "ball shifting" motion the screenshots show.
- When `isGenerating` flips false, the `generation` anchor unregisters → priority falls back to `input` → the same mascot animates back up to the input slot.

## Out of scope
- No changes to `AanInput.tsx`, `AanContext.tsx`, message bubble styles, or anchor-priority logic.
- No new loader assets, no Lottie, no extra progress bar.
- No backend / data changes.

## Acceptance check (manual)
1. Open `/aan`, focus input, press Enter on a prompt that triggers generation.
2. Watch the diamond above the input morph to a circle and glide down into the generation card.
3. Floating dots animate next to the docked ball; "Generating…" copy is visible.
4. When generation finishes, the ball glides back up to the input slot and re-morphs to the resting diamond.
5. The newly added assistant message sits in the conversation as a normal bubble (unchanged styling).