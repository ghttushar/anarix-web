## Fixes

### 1. Action Island — remove new chips
In `src/features/creative/FloatingActionIsland.tsx`, delete the entire "Aan quick-action chips" block (lines 166–186): the Summarize / Build report / Explain drop trio. Also drop the now-unused `openCopilot` and `setPendingPrompt` from the `useAan()` destructure.

### 2. Action Island — dynamic Aan icon
Replace the static `AanGlyph` used for the "Ask Aan" action with a live `AanMascot`:
- Render `<AanMascot size={18} state="idle" interactive={false} />` inline (not via the `action.icon` slot, since it needs custom props).
- Special-case the first action in the map so it renders the mascot instead of `<action.icon />`. Keep the same button shell, label, and "alwaysShowLabel" behavior.
- The mascot will idle-float as a tiny diamond, matching the brand-manual "live presence" rule for Aan-active surfaces.

### 3. Generating loader — fix ugliness
The current generating card (in `src/components/aan/AanConversation.tsx`) renders the mascot in `working` state at 56px, which morphs to a flat coral pill bar with a subtle white sheen — it reads as a raw colored bar with no progress affordance and no label/percent inside. Two corrections in `AanMascot.tsx`:

a) **Make the bar feel like a progress bar, not a pill blob.**
   - Replace the current sheen-only `linear-gradient(90deg, rgba(255,255,255,0) → rgba(255,255,255,0.32))` fill with a real progress fill: a solid coral-deep gradient (`linear-gradient(90deg, ${CORAL.deep} 0%, ${CORAL.base} 100%)`) over a muted track.
   - Render the bar body itself with a lighter "track" background (coral at ~22% opacity over the existing radial), and overlay the progress fill at full opacity. This gives the unfilled portion a clearly empty look.
   - Add a soft inner highlight stripe (1px white at 35% opacity along the top edge of the fill) for depth, in line with the manual's "liquid coral" treatment.

b) **Smaller, more refined bar proportions.**
   - Change bar dimensions from `size*1.6 × size*0.5` to `size*1.8 × size*0.34` so it reads as a slim progress bar rather than a chunky pill.
   - Keep `borderRadius: 999px`.

c) **Aura tone-down for `working`.**
   - The 1.1× blurred coral aura behind the bar bleeds outside the card. Reduce aura scale to `1.02` and opacity to `0.55` when `shape === "bar"`.

No changes to the conversation card layout, the "Generating Report / Xs remaining" copy, or any other state. Pure visual polish on the `working` shape inside `AanMascot.tsx`.

### Files touched
- `src/features/creative/FloatingActionIsland.tsx` — remove chips, swap glyph for live mascot on Ask Aan.
- `src/components/aan/AanMascot.tsx` — refine `bar` geometry, real progress fill, dampened aura.
