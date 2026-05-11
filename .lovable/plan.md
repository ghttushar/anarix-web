## Goal
Polish the Aan generation loader, propagate the polished AanInput mascot to the Floating Action Island and the Ask Aan selection tooltip, switch the navbar/Aan-header glyph to a static diamond-with-eyes, and delete legacy Aan files.

---

## 1. Generation loader card — `AanConversation.tsx`

Current: bare 56px presence anchor + two text lines, no progress bar, looks like a coral pill (per screenshot).

Fix the card to a proper, well-designed loader:

- Card layout: `flex items-center gap-4 p-4 rounded-2xl border border-border bg-card w-fit min-w-[280px]`.
- Left slot: keep the live presence anchor (size 56) — Aan is in `working` state, so it morphs to the bar shape via `AanPresencePortal`. Render the bar against a faint coral track so the progress is legible.
- Right slot, two lines:
  - Line 1 (title): `font-medium text-foreground text-sm` — "Generating Report" / "Running Audit".
  - Line 2 (sub): `text-xs text-muted-foreground` — `{seconds}s remaining` (existing math kept).
- Add a thin 2-line progress bar **below the text** (full card width, `h-1 rounded-full bg-muted overflow-hidden`) with an inner `bg-gradient-to-r from-primary to-accent` whose width = `generationProgress%`. This gives a clear deterministic progress signal in addition to the morphing bar mascot.
- Remove the empty 8×8 avatar div on the left of the row (it created the awkward gap shown in the screenshot). The presence mascot inside the card is enough.

No changes to `AanContext` or progress timing.

---

## 2. Floating Action Island — `FloatingActionIsland.tsx`

Replace the current `<AanMascot size={26} state="idle" interactive floating />` Ask Aan icon with the **same configuration used at the top of the AanInput** (the one anchored above the chat input on `/aan`):

- Use a registered presence anchor pattern locally OR just render `<AanMascot size={32} state="idle" interactive floating />` directly so it crosses the full-tier (≥24) and benefits from full eyes/blink/gaze/floor-shadow.
- To fit inside the `h-8` button row, change the Ask Aan button's height to `h-10` (only this button, not the others) and `px-2.5` so the 32 px mascot sits centred without clipping. Other action buttons stay at `h-8`.
- Keep `state="idle"` (diamond). Live morphing is still handled globally by `AanPresencePortal` for the input/generation/lastMessage anchors — the island stays a stable Ask Aan entry point.

---

## 3. Ask Aan selection tooltip — `AskAanTooltip.tsx`

User reference image-181 shows: red mascot circle with eyes + three trailing dots + "Ask AAN" label.

- Replace `<AanGlyph className="h-3 w-3" />` with `<AanMascot size={20} state="listening" interactive={false} />` so it renders the circle shape with eyes (size 20 is compact tier — eyes are gated to full-tier today, so we extend `AanMascot` to allow eyes at compact when an explicit `forceEyes` prop is set; OR simpler: bump `size={26}` so it auto-qualifies for full-tier eyes).
- Decision: bump to `size={24}` and switch tooltip pill to `py-1` so the mascot fits. No mascot-component changes needed.
- Add the three trailing dots between the mascot and the label using three `h-1.5 w-1.5 rounded-full bg-primary-foreground/70` spans with a staggered `animate-pulse` (150ms delays) — matches the reference.
- Keep gradient pill background + "Ask Aan" label.

---

## 4. Static diamond-with-eyes for navbar + Aan header

The `AanGlyph` today renders a tiny mascot (12–20 px) which falls into micro/compact tier — no eyes. The brief is: in the **Anarix navbar Ask Aan link** and the **Aan workspace sidebar header**, render a **diamond with eyes but no motion**.

Component change in `AanMascot.tsx`:
- Add a new prop `staticEyes?: boolean`. When true:
  - `showEyes` evaluates true for compact tier as well (size ≥ 16).
  - All animations are suppressed exactly like `state==="anchor"` (cursor tracking off, blink off, body lean = 0, float = 0, no aura pulse, no spin).
  - Eyes render as static black dots, gaze = 0.
- This is purely additive; existing usages unaffected.

Component change in `AanGlyph.tsx`:
- Add `staticEyes?: boolean` pass-through to `AanMascot`.

Call-sites updated to `staticEyes`:
- `AppSidebar.tsx` line 235 and 245 (Ask Aan nav item, expanded + collapsed variants) — pass `staticEyes`.
- `AppTaskbar.tsx` lines 355 and 380 (Ask Aan icon in taskbar) — pass `staticEyes`.
- `AanWorkspaceSidebar.tsx` lines 67 and 122 (collapsed + expanded sidebar header logo) — pass `staticEyes`. Bump from `h-5 w-5` to `h-6 w-6` so the eyes are legible at the header size.
- `AanLogo.tsx` line 12 — pass `staticEyes` (used in Component Library only, kept for consistency).

Diamond shape is already the default for `state="idle"`, so no shape override needed.

---

## 5. Remove legacy / unused Aan files

The `/aan` route's `Workspace.tsx` is the final canonical full-screen experience. The following pre-existing components are now superseded:

Delete:
- `src/components/aan/AanPanel.tsx` (wrapper for the two below)
- `src/components/aan/AanWorkspace.tsx` (old global overlay; replaced by `pages/aan/Workspace.tsx`)
- `src/components/aan/AanSplitView.tsx` (mode `"split"` is never actually entered — `openSplit` opens the copilot panel instead)
- `src/components/aan/AanTrigger.tsx` (no external consumer)
- `src/components/aan/AanBreadcrumb.tsx` (no external consumer)
- `src/components/aan/AanDraftPreview.tsx` (no external consumer)
- `src/components/aan/AanLogo.tsx` (only referenced in `ComponentLibrary` showcase — references will be removed)

Update:
- `src/components/aan/index.ts` — drop the deleted exports; keep `AanProvider`, `useAan`, types, `AanCopilotPanel`, `AanWorkspaceSidebar`, `ArtifactCard`, `AanArtifactViewer`.
- `src/App.tsx` — remove `AanPanel` import and `<AanPanel />` from the tree.
- `src/pages/settings/ComponentLibrary.tsx` — remove the `AanLogo` import and the two AanLogo demo blocks (lines ~772–775 and ~822). Keep the `ArtifactCard` showcase (still in use).

Files kept (still in active use): `AanContext`, `AanConversation`, `AanCopilotPanel`, `AanInput`, `AanMascot`, `AanGlyph`, `AanPresenceContext`, `AanPresencePortal`, `AanWorkspaceSidebar`, `ArtifactCard`, `AanArtifactViewer`, `AskAanTooltip`.

---

## Files touched

Edit: `AanMascot.tsx`, `AanGlyph.tsx`, `AanConversation.tsx`, `FloatingActionIsland.tsx`, `AskAanTooltip.tsx`, `AppSidebar.tsx`, `AppTaskbar.tsx`, `AanWorkspaceSidebar.tsx`, `App.tsx`, `components/aan/index.ts`, `pages/settings/ComponentLibrary.tsx`.

Delete: `AanPanel.tsx`, `AanWorkspace.tsx`, `AanSplitView.tsx`, `AanTrigger.tsx`, `AanBreadcrumb.tsx`, `AanDraftPreview.tsx`, `AanLogo.tsx`.

No context/state-shape changes, no routing changes.
