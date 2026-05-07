## Goal

Match Aria's pattern from the reference video/screenshots:
- The mascot is a **bare** floating character (no circular avatar background, no gradient ring) sitting in whitespace.
- It lives **above the input box** as a persistent presence, with a small status line ("Your prompt is ready.", "Planning your site…", etc.).
- It **moves and reacts** — drifts gently, leans toward the cursor, and shifts shape/spin while Aan is thinking.
- In the conversation, assistant messages also drop the round avatar chip — the mascot itself is the avatar (smaller, no background).

This applies only when New Branding is ON. Legacy mode keeps the existing Sparkles + circle avatar untouched.

## Scope (3 files only)

### 1. `src/components/aan/AanMascot.tsx` — add real motion

Currently the mascot only floats up/down 3px and tracks the cursor with its eyes. Add:
- **Drift**: slow x/y wander (±4px, 6–8s loop) so it feels alive when idle.
- **Cursor lean**: whole body tilts ~6° and shifts ~4px toward the pointer (in addition to eye tracking) when `interactive` and not `anchor`.
- **Thinking spin**: when `state="thinking"`, the body slowly rotates (diamond → cube morph already there) and the aura pulses faster.
- **Listening bob**: when `state="listening"`, slightly faster floating + brighter aura.
- New optional prop `floating?: boolean` (default false) — when true, adds a soft drop shadow ellipse beneath the mascot (matches Aria's grounded look in the screenshots). Used by the input-bar presence.
- Keep the existing API and all 10 call sites unchanged. No new dependencies.

### 2. `src/components/aan/AanConversation.tsx` — remove the circle behind the mascot

Replace the assistant avatar chip:

```text
Before:  [⬤ gradient circle 32px] containing <AanGlyph h-4>
After (newBranding ON):  bare <AanMascot size={22} state="idle"> floating in 32px slot, no bg, no rounded-full
After (newBranding OFF): unchanged — keep the gradient circle + Sparkles
```

Same change for the "thinking" avatar shown next to the CircularProgress card — bare mascot with `state="thinking"`, no circle.

User avatar (the right-side `<User />` chip) stays exactly as it is.

### 3. `src/components/aan/AanInput.tsx` — add the persistent Aan presence above the input

Add a new block rendered **above** the existing prompt-suggestion notch and input container, only when `newBranding` is ON:

```text
┌──────────────────────────────────────────┐
│   (whitespace)                           │
│        [Aan mascot, floating]            │
│        Your prompt is ready.             │   ← status line (12px, muted)
│   ┌──────────────────────────────────┐   │
│   │ Ask Aan anything...           ➤ │   │
│   └──────────────────────────────────┘   │
└──────────────────────────────────────────┘
```

Behavior:
- **State derives from existing context**: `state="thinking"` when `isGenerating || isLoading`, `state="listening"` when `input.length > 0` and focused, otherwise `state="idle"`.
- **Status line text**:
  - idle → "Ready when you are."
  - input typed → "Your prompt is ready."
  - generating report → "Working on your report…"
  - generating audit → "Running the audit…"
  - loading reply → "Thinking…"
- Mascot size 28px, `floating` shadow on, no background, sits in a 56px-tall flex row with bottom padding 8px.
- The whole presence row fades + slides 4px on state change (Section 9 motion budget: 180ms, opacity + translateY only — no bounce).
- Hidden when the prompt-suggestion notch is showing (avoid stacking two hints).
- Hidden when New Branding is OFF — input layout reverts to current behavior with zero visual change.

## What we are NOT doing

- No changes to `AanGlyph`, `AanLogo`, `AanBreadcrumb`, `AanWorkspaceSidebar`, `FloatingActionIsland`, `AppSidebar`, `AppTaskbar`, `AskAanTooltip` — those Sparkles→AanGlyph swaps stay as is.
- No new routes, no new context, no new dependencies.
- No copy changes outside the new status line.
- Legacy branding mode is byte-identical to today.

## Files changed

- edit `src/components/aan/AanMascot.tsx` (add drift, cursor lean, thinking spin, `floating` prop with shadow ellipse)
- edit `src/components/aan/AanConversation.tsx` (drop avatar circle for assistant when newBranding ON)
- edit `src/components/aan/AanInput.tsx` (add persistent mascot + status line above input when newBranding ON)
