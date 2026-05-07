## What's wrong today

1. The blue "circle" behind the coral diamond comes from `src/components/aan/AanMascot.tsx` — an old gradient/glow version unrelated to the official brand manual. The user's reference (https://anarix-brand-manual.vercel.app/) uses a coral rounded-square mascot that morphs between four shapes (diamond / circle / bar / cube) — no blue ring, no diamond outline icon.
2. The Design System page (`src/pages/settings/DesignSystem.tsx`) has tabs for Colors, Typography, Spacing, Icons, Components, States, Layout — but **no Aan tab**.

## Source of truth

The brand manual GitHub repo (`ghttushar/anarix-brand-manual-`) ships:
- `src/components/Aan.tsx` — the mascot (4 shapes, eye tracking, aura blur, sparkle)
- `src/components/Diamond.tsx` — flat coral diamond reference
- `src/components/AnarixLoader.tsx` — official Lottie loader (already on disk as `public/animations/aan-loader.json`)
- Brand hues: Coral `#F26E77`, Blue `#4A62D9`, Ink `#1D252D`

We will port the `Aan.tsx` mascot exactly (radial coral gradient, soft glow, sparkle, eye tracking, shape morph), drop the blue circle, and wire its `state` prop to the existing `AanMascotState` so all current call sites keep working.

## Plan

### 1. Rewrite `src/components/aan/AanMascot.tsx` to the official brand-manual mascot

- 1:1 port of `Aan.tsx` from the brand-manual repo using `framer-motion` (already installed).
- Coral radial gradient body, soft coral aura (no blue), white sparkle, two ink eyes that track cursor.
- Map our existing `state` prop to a shape:
  - `idle` → `diamond` (rotate 45°, gentle bob)
  - `listening` → `circle`
  - `thinking` → `cube`
  - `anchor` → `diamond` static (no bob, no eye tracking)
- Honor `prefers-reduced-motion` and `VisualEffectsContext` (disable bob/aura pulse).
- Keep API: `{ state, size, interactive, className }` so `AanGlyph.tsx` and all 10 call sites need zero changes.
- Inline the small extra CSS (`.aan-character`, `.aan-character-aura`, `.aan-character-sheen`) inside the component using inline styles to keep the file self-contained — no global CSS edits.

### 2. Update `AanMascotShowcase` (`src/pages/brand/AanMascotShowcase.tsx`)

- Refresh the state catalog to label them `Diamond idle`, `Circle listening`, `Bar loading`, `Cube thinking` (matches brand manual copy).
- Remove any leftover hint about the old blue glow.
- (No route change.)

### 3. Add an Aan tab to Design System (`src/pages/settings/DesignSystem.tsx`)

- New `AanTab()` section, inserted as a new `TabsTrigger value="aan"` after `layout` (or before `colors` — see below).
- Add `"aan"` to `validTabs` so `/settings/design-system/aan` deep-links work.
- Tab content (sectioned, matches brand-manual chapter):
  1. **Philosophy** — short copy: "Aan is the Anarix diamond made intelligent." + name meaning (Hindi/Sanskrit / English / full-form: Anarix Analytical Nural).
  2. **Brand hues used by Aan** — Coral `#F26E77`, Blue `#4A62D9`, Ink `#1D252D` swatches.
  3. **States & morphs** — 4 live mascot tiles: `Diamond idle`, `Circle listening`, `Bar loading` (rendered as the same `<AanMascot>` with a temporary `bar` shape — added as a 5th internal shape but still mapped to `state="listening"` is wrong, so we expose an optional `shape` override prop on `AanMascot` for the showcase only; default behavior unchanged).
  4. **When Aan appears / stays absent** — two bullet lists (chat dock, copilot, action island, insights vs. static decoration, repeated branding, noisy moments).
  5. **Tone rule** — "Serious, calm, and helpful."
  6. **Asset handoff** — links to `/animations/aan-loader.json`, `/anarix-symbol.svg`, full logo SVG (already on disk in `src/assets/branding/`).
- All copy lifted verbatim from the brand-manual `#aan` section.

### 4. Tiny `AanMascot` API addition

Add an optional `shape?: "diamond" | "circle" | "bar" | "cube"` prop. When present, it overrides the state→shape mapping. Used only by the showcase + Design System tab. All existing call sites (which only pass `state`) are unaffected.

## Files touched

- Rewrite: `src/components/aan/AanMascot.tsx`
- Edit: `src/pages/brand/AanMascotShowcase.tsx` (label refresh only)
- Edit: `src/pages/settings/DesignSystem.tsx` (new Aan tab + validTabs entry)

No new dependencies. No changes to `AanGlyph`, `AnarixLogo`, `BrandingContext`, routes, or any of the 10 existing Sparkles→AanGlyph swaps.

## Acceptance

- The mascot anywhere in the app shows the coral rounded-diamond with eye-tracking and a small white sparkle — **no blue ring, no blue circle behind it**.
- `/settings/design-system/aan` exists, is reachable from the Design System tab strip, and renders the 6 sections above with live mascots.
- Toggle "New Branding" OFF in Preferences → all Aan touchpoints fall back to `Sparkles` icon as before (unchanged behavior, gated by `AanGlyph`).
