## Goal
Fix the in-progress generation loader inside the Aan conversation:
1. Give the bar-shaped Aan mascot eyes (matching the reference image).
2. Remove the duplicated separate progress bar — the mascot bar itself is the loader.
3. Re-align and re-center the loader card so it sits prominently inside the report area.

## Problems today
- Two progress indicators visible: the morphing **bar mascot** (which already fills with progress) AND a separate gradient progress bar below the text. Redundant.
- Bar mascot has no eyes (`shape !== "bar"` blocks eye render).
- Anchor slot is `w-14 h-14` (56×56), but the bar body is `size*1.8 = ~100px` wide → it overflows the slot, throwing the card alignment off.
- Card is left-aligned in the conversation flow instead of being centered/prominent.

## Changes

### 1. `src/components/aan/AanMascot.tsx` — eyes on the bar
- Relax eye gating: allow eyes on the bar shape when state is `working` (and on static eyes / idle / listening / speaking as today).
  - `showEyes` becomes: `tier !== "micro" && !reduceMotion && (state === "idle" || "listening" || "speaking" || "working")` — no longer excludes bar.
  - `staticEyes` branch already allowed; keep but still exclude bar there to avoid weirdness in static glyphs (sidebar diamonds only).
- Add bar-specific eye geometry inside the existing eye block so eyes sit centered on the pill:
  - When `shape === "bar"`: `eyeSize = size * 0.11`, `eyeOffsetX = size * 0.10` (tight cluster near center), `eyeY = 0`.
  - Eyes render on top of the gradient progress fill (existing z-stack already supports this — eyes are rendered after the body element).
- No other behavior changes.

### 2. `src/components/aan/AanConversation.tsx` — single, well-aligned loader
- **Remove** the separate progress bar (`<div className="h-1 w-full rounded-full bg-muted ...">` and inner gradient div). The bar mascot is the only progress indicator.
- Re-layout the card vertically and center it in the conversation:
  - Outer wrapper: `flex justify-center` (instead of `flex`).
  - Card: `flex flex-col items-center gap-3 px-6 py-5 rounded-2xl border border-border bg-card shadow-sm w-fit min-w-[280px]`.
  - Anchor slot sized for the bar: `w-[110px] h-12 flex items-center justify-center` (was `w-14 h-14`). This stops the bar from overflowing.
  - Text block centered below: title `text-sm font-medium text-foreground` + meta `text-xs text-muted-foreground`.
- Keep `registerAnchor("generation", el, 56)` — bar dims (size 56) become ~100×19, fits perfectly in the new 110×48 slot.

### 3. No changes elsewhere
- `AanPresencePortal` already routes to the generation anchor and passes `progress` — bar fill keeps working.
- Other mascots (idle/listening/speaking) untouched.

## Visual outcome
A single centered card inside the conversation: large coral pill with two eyes on the left side, gradient fill animating to the right showing real progress, and below it: "Generating Report" + "Ns remaining". No second progress bar.