## Goal

Add a user preference in Aan settings that controls where Aan's generated drafts (email to Vendor Manager, Amazon Support ticket, listing modification) appear:

- **Side** (default, current behavior): draft appears in the right-side Aan Copilot side panel.
- **Main**: draft replaces the strategy area inside the Review Workspace's right column — no side panel opens. User edits and sends/chats directly there.

Scope: Signals page only. No other pages/behaviors touched.

## Changes

### 1. New preference context
Create `frontend/src/contexts/AanPanelContext.tsx`:
- `mode: "side" | "main"` (default `"side"`), persisted in `localStorage` (`aan:panel-mode`).
- Provider wrapped in `App.tsx` alongside existing Aan providers.
- Hook `useAanPanel()`.

### 2. Settings toggle
In `frontend/src/pages/settings/AanTriggers.tsx` (Aan settings page), add a new card section "AI Panel":
- Segmented control with two options: **Side panel** / **Main view**.
- Short description under each explaining behavior.
- Wired to `useAanPanel()`.

### 3. Wire ReviewWorkspace to honor the toggle
In `frontend/src/components/actions/ReviewWorkspace.tsx`:
- In `onExecute()` for `notify-vm`, `draft-ticket`, and the recommended `Analyze Listing` strategy (`:recommended` on the CRITICAL_ONLY decision — this is the "Modify" flow):
  - If `mode === "side"` → keep current behavior (`openCopilot()` + `addMessage()`).
  - If `mode === "main"` → do NOT open copilot. Set new local state `inlineDraft = { kind: "email" | "chat", seed }` which replaces the strategy picker/execute button with an inline draft card.

### 4. New inline draft components (rendered in the right column of Signals only)
Create under `frontend/src/components/actions/review/inline/`:

- **`InlineEmailCompose.tsx`** (for `notify-vm`):
  - Pre-filled fields: To, Cc, Bcc, Subject, Body — all from the existing `AAN_SEEDS["notify-vm"]` (parsed from the drafted markdown; to keep it simple, split the seed into `subject` and `body` constants stored alongside the component).
  - Editable inputs, "Send" (primary) and "Cancel" (returns to strategy view) buttons.
  - Send → toast success + reset workspace (same auto-close as current execute path).

- **`InlineDraftChat.tsx`** (for `draft-ticket` and `Analyze Listing`/modify):
  - Shows the initial Aan draft as an assistant message bubble.
  - Editable textarea at the bottom for the user to reply / iterate.
  - Simple local echo assistant response (matches the existing seed pattern — no backend calls; this is a mock/demo app).
  - "Approve & file" / "Approve & apply" primary button + "Cancel" button.

Styling: reuse existing tokens (`bg-card`, `border-border`, `Button`, `Textarea`, `Input` from `@/components/ui`). No new visuals invented — matches AlertDetailPanel's chat/email patterns.

### 5. Render inline draft inside ReviewWorkspace body
In the body ScrollArea of `ReviewWorkspace.tsx`, add a branch:
- If `inlineDraft` set → render `<InlineEmailCompose />` or `<InlineDraftChat />` in place of the "Choose your strategy" Block (evidence/current-state blocks above remain visible).
- Cancel clears `inlineDraft`; Send/Approve triggers the same post-execute confirmation card that already exists.

## Files touched

- **New:** `frontend/src/contexts/AanPanelContext.tsx`
- **New:** `frontend/src/components/actions/review/inline/InlineEmailCompose.tsx`
- **New:** `frontend/src/components/actions/review/inline/InlineDraftChat.tsx`
- **Edit:** `frontend/src/App.tsx` — mount `AanPanelProvider`.
- **Edit:** `frontend/src/pages/settings/AanTriggers.tsx` — add "AI Panel" toggle card.
- **Edit:** `frontend/src/components/actions/ReviewWorkspace.tsx` — branch on `mode` in `onExecute()`, render inline draft.

No other files, pages, or flows change. Side-panel behavior is fully preserved when the toggle is "Side".

## Verification

After build: switch toggle to Main → open the critical signal → click each of Notify Vendor Manager / Draft Amazon Support Ticket / Analyze Listing → confirm draft appears inline in the right column and the Aan side panel does NOT open. Switch back to Side → confirm original behavior.
