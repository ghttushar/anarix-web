## Aan v2 — A Living Diamond

Keep Aan's shape exactly as defined: the coral diamond/cube echoing the Anarix logo symbol. Take from Aria only the **behavior** — a single, fluid, mature presence that travels through the chat surface, morphs subtly between states, and never appears twice at once. No sparkle dot. Fix the small-size diamond. Move to top-left of the input. One Aan, always at the point of action.

---

### 1. Mascot stays a diamond — refined, not replaced

`AanMascot.tsx` keeps its identity. We refine it, we don't redesign it.

**Visual changes**
- **Remove the white sparkle dot** entirely (`shapeStyles[*].sparkLeft/sparkTop` + the `<motion.span>` sparkle block).
- **Remove the eyes.** Aria has no face; Aan shouldn't either at this scale. Personality moves into shape morph + motion.
- Keep the coral gradient + soft aura + ground shadow.
- Add a faint inner highlight (top-left, white at 8% opacity) so the diamond reads dimensional without a sparkle.
- Add a very subtle rim-light using `brand.accent` (#A7AEF2) at 15% — ties Aan to the periwinkle palette without breaking the coral.

**State system (Aria-inspired morphing — diamond is always the base)**
| State | Behavior |
|---|---|
| `idle` | Diamond, slow breathe (scale 1 → 1.015, 4s), drift ±1px |
| `listening` | Diamond softens corners (radius 16% → 28%), gentle horizontal stretch (1.04 / 0.97), aura brightens — like Aria opening up |
| `thinking` | Corners tighten back, internal slow rotation (one full turn over 5s, linear), eyes-area replaced by a subtle liquid-swirl SVG path that morphs between 3 keyframes (Aria's "processing" feel) |
| `working` | Same as thinking + a thin progress arc traces around the rim (stroke-dasharray driven by `generationProgress`) |
| `speaking` | Single soft outward ring ripple every ~2s |
| `anchor` | Static diamond, no motion — used as inline avatar in past assistant messages |

All transitions: Framer Motion spring (stiffness 180, damping 22), ≤240ms per project motion spec. No bounce, no elastic.

**Small-size fix (nav, FAB, suggestion chip, breadcrumb)**
The diamond looks ugly when it's tiny because the rotation + aura + ground shadow are all visible at 16px. Fix:
- **Below 24px**: render a flat filled "soft-diamond" — the same coral gradient but with rounded corners (radius 30%), no aura, no ground shadow, no internal motion, no rotation. Reads as a confident brand mark, not a wobbly toy.
- **24–40px**: diamond with breathe only, no swirl, no rotation.
- **40px+**: full state behavior.

A single `size` prop on `AanMascot` decides which tier renders — consumers don't change.

---

### 2. One travelling Aan in the chat (`AanPresence` controller)

Only **one** animated diamond exists in the conversation surface at a time. It physically moves between anchor points using Framer Motion `layoutId="aan-presence"` so the same DOM element animates between locations.

**Anchor points (priority order)**
1. **Input top-left** — resting position. Replaces today's centered mascot above the input.
2. **Pending-reply slot** — placeholder row inserted on send, where the next assistant message will land.
3. **Generation card slot** — inside the "Generating Report / Running Audit" card, replacing the current `CircularProgress` puck.
4. **Latest assistant message avatar** — once a response finishes, the diamond settles there as the row avatar.

**Choreography on Send**
1. User hits Send → input clears.
2. Diamond at input-top-left morphs to `thinking`.
3. It animates (layoutId) down into the new pending-assistant row in ~220ms.
4. While the assistant is "typing": diamond stays in pending row in `thinking` state.
5. If response is a **report/audit**: diamond animates into the Generation Card slot, morphs to `working`, the rim arc tracks `generationProgress`.
6. When generation completes: diamond animates back up to the input anchor and returns to `idle`. The completed message shows a static `anchor`-state mini-diamond as its row avatar.
7. **Never two animated diamonds.** Past assistant messages get the small static variant only.

**Implementation**
- New `AanPresenceContext` exposes `currentAnchor: 'input' | 'pending' | 'generation' | 'lastMessage'` and `setAnchor()`.
- A single `<AanMascot layoutId="aan-presence" />` is portalled (`createPortal`) into whichever anchor slot is registered as active.
- Each anchor slot renders an empty `data-aan-anchor` div sized to reserve space; the portal injects the live diamond there. Layout stays stable as Aan moves.

---

### 3. Specific placement changes

**`AanInput.tsx`**
- Remove the centered presence block above the textarea (lines 268–276), including the `presenceLabel` micro-copy ("Ready when you are.", etc.) — it's noise; the diamond communicates state.
- Add a `data-aan-anchor="input"` slot at the **top-left** corner of the input container. Diamond size: 24px.
- Paperclip moves down to bottom-left, beside the model selector.

**`AanConversation.tsx`**
- Per-message assistant avatars: switch from animated `AanMascot` to the small static variant (`size={20}`, `state="anchor"`, `interactive={false}`) — the "soft-diamond" tier.
- The `isGenerating` block: replace the avatar + `CircularProgress` puck with a single `data-aan-anchor="generation"` slot. The `AanPresence` controller drops the live diamond here, and the rim arc reflects `generationProgress`. Keep the "Generating Report / 18s remaining" copy beside it.
- Insert a `data-aan-anchor="pending"` row after the user's message while `isLoading` is true (before the assistant reply lands).

**Other small-size surfaces (sparkle/diamond fix)**
- `AanWorkspaceSidebar`, `AanTrigger`, `MiniSidebar`, `FloatingActionIsland`, prompt suggestion chip, breadcrumb — all keep `<AanMascot />` but at sizes 16–20px, which now auto-render the flat soft-diamond variant. No diamond rotation/aura at these sizes.

---

### 4. Cleanup

- **Keep** `AanMascot.tsx` (it remains the diamond identity); refactor internals.
- **Remove**: sparkle motion span; eyes block; `shape: circle | bar | cube` API (only `diamond` remains, with size-tier-driven rendering).
- **Remove** the `AanGlyph` fallback in `AanConversation` for the new-branding path — single source of truth is `AanMascot`.
- Update `AanMascotShowcase` page to demo the refined diamond + the travelling presence.

---

### 5. What stays the same

- Aan's role, copy, gating, the `newBranding` toggle.
- Coral diamond identity (matches Anarix logo).
- Periwinkle palette, motion budget (≤240ms), no decorative loops outside Aan.
- All chat logic in `AanInput.handleSend` (report/audit detection, mock responses, generation timers).

---

### Files to touch

**Create**
- `src/components/aan/AanPresenceContext.tsx` — anchor state
- `src/components/aan/AanPresencePortal.tsx` — single travelling diamond, portalled to active anchor

**Edit**
- `src/components/aan/AanMascot.tsx` — remove sparkle + eyes, add size tiers, refine states
- `src/components/aan/AanInput.tsx` — orb at top-left input slot, remove centered block + label
- `src/components/aan/AanConversation.tsx` — pending anchor, generation anchor, static row avatars
- `src/pages/aan/Workspace.tsx` — wrap with `AanPresenceProvider`, mount `AanPresencePortal`
- Small-size consumers (sidebar/trigger/island/suggestion/breadcrumb) — no API change, sizes already correct
- `src/pages/brand/AanMascotShowcase.tsx` — refresh demos

**Delete**
- None (we're refining, not replacing)

---

### Open questions before I build

1. **Past assistant message avatars** — keep a small static diamond on every past row, or remove avatars entirely once "the" presence has moved on (more Aria-like minimalism)? Proposing: keep small static diamonds — provides scan-ability without competing with the live presence.
2. **Travel motion** — straight line via `layoutId` spring (snappy, ~220ms), or a slight arc? Proposing: straight + spring; arcs feel decorative and break the 240ms budget.
3. **Color** — keep the current coral, or shift slightly toward the Anarix logo's exact coral hex if it differs? If you have the logo's exact hex, drop it and I'll match.