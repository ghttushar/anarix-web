## Goal
Restyle the "Ask Aan" button in the Floating Action Island to match the attached pill design, give the mascot inside it a live mouse-tracking sway like the full-screen Aan mascot, and make the button open the **Aan Copilot side panel** (not navigate to the full `/aan` page).

## Changes

### 1. `src/features/creative/FloatingActionIsland.tsx`
- Replace `navigate("/aan")` on the Ask Aan action with `openCopilot()` from `useAan()` (re-add the `useAan` import). All other buttons untouched.
- Restyle the Ask Aan button to match the attached image:
  - Render it as a separate, distinct pill (not a `ghost` Button) — `rounded-full bg-card border border-border shadow-sm h-10 pl-1.5 pr-3 gap-2 hover:shadow-md transition-shadow`.
  - Inside: the `AanMascot` (coral diamond with eyes) + "Ask Aan" label in body font, `text-sm font-medium text-foreground`.
  - Always visible label (no expand-on-hover for this button).
- Keep mascot at a size that activates the **full tier** so cursor tracking + body lean + eye gaze work the same as in `/aan`. Use `size={44}` with `interactive` and `floating` (matches the in-chat anchor behavior). The container pill height adjusts to `h-12` to accommodate.

### 2. `src/components/aan/AanMascot.tsx` (minor)
- No behavioral change needed — at `size={44}` the mascot is already tier `full`, so `trackCursor` is enabled automatically (mouse sway + eye gaze + blink). No prop additions.

### 3. No changes elsewhere
- `AppSidebar` Ask Aan buttons keep navigating to `/aan` (full screen) — unchanged. Only the Floating Action Island button switches to the Copilot side panel per the user's request.
- `AanCopilotPanel` is already wired through `ActivePanelContext` and opens via `openCopilot()`.

## Visual reference
Attached image: white rounded pill, coral diamond mascot with two eyes on the left, "Ask Aan" label on the right. The pill sits inline inside the existing Floating Action Island, between the drag handle and the other action icons.

## Out of scope
- No changes to other action island buttons.
- No changes to mascot states elsewhere in the app.
- No routing changes for the navbar/sidebar Ask Aan entries.