## Aan v3 — Restore the four canonical morphs and propagate Aan presence everywhere

The brand manual ([anarix-brand-manual.vercel.app](https://anarix-brand-manual.vercel.app/)) is explicit about Aan's identity:

**Four shape morphs = states** (not aesthetic variants — they ARE the state language):
| State | Shape | Manual quote |
|---|---|---|
| `idle` | **Diamond** | "The inherited Anarix form at rest: calm, ready, structurally tied to the brand." |
| `listening` | **Circle** | "Aan opens into a softer listening state when it receives human intent." |
| `working` | **Bar** | "The form stretches into a bridge between prompt and output while work is being processed." |
| `thinking` | **Cube** | "Aan condenses into a tighter analytical state when reasoning becomes focused." |

**Where Aan appears** (manual): bottom dock, copilot panels, split view, action island, quick actions, insight notices, generated artifacts, navbar (compact + serious), Ask Aan button family, tooltip trigger.

**Where Aan stays absent**: static decoration in empty chrome, repeated branding where no AI is active, filler motion.

The current code keeps `shape` as a legacy/ignored prop and renders only the diamond. We restore the morph, then propagate live mascots to the surfaces above.

---

### A. `AanMascot.tsx` — re-couple state to shape

Bring back **shape morphing**, but driven by `state` (not a separate prop). Reference impl: `src/components/Aan.tsx` in the brand-manual repo.

- `idle` / `anchor` → **diamond** (rotate 45°, radius 18%) — current behavior
- `listening` → **circle** (rotate 0°, radius 50%) — ground for two eyes side-by-side
- `thinking` → **cube** (rotate 0°, radius 18%, slight inward scale 0.96) + the existing internal liquid-swirl
- `working` → **bar** (horizontal pill, width = `size * 1.6`, height = `size * 0.5`, radius 999px). Progress fills horizontally inside the bar (replaces the rim-arc on diamond — semantically correct for a progress bar). Eyes hide during `working`.
- `speaking` → **diamond** + outward ripple (kept)

**Animation**: a single Framer Motion `animate={{ width, height, borderRadius, rotate }}` block does the morph as a tween — spring stiffness 140 / damping 20. Eyes counter-rotate per-shape (already wired for diamond; extend to handle 0° for circle/cube/bar).

**Tier rules unchanged** (<24 micro / 24–40 compact / >40 full). Eyes only render at full tier and are hidden on `working` (bar) since bar is process, not presence.

**Hover-petting + blink + gaze** — kept as-is on diamond/circle/cube. Disabled on bar.

---

### B. `AanPresencePortal.tsx` + `AanContext.tsx` + `AanInput.tsx` — wire states to events

Right now the portal hardcodes anchor → state. Tighten it so the morph reflects what Aan is actually doing:

- Add `inputFocused: boolean` to `AanContext` (set from `AanInput` `onFocus`/`onBlur`/typing).
- Portal state mapping:
  - `input` anchor → **`listening`** when `inputFocused || input.length > 0`, else **`idle`**
  - `pending` anchor → **`thinking`** (cube)
  - `generation` anchor → **`working`** (bar) with `progress`
  - `lastMessage` anchor → **`speaking`** for ~1.5s then **`idle`**

Result: when the user clicks the textarea, Aan opens into a circle. When they hit send, Aan condenses into a cube and travels into the conversation. When generation starts, Aan stretches into a bar. On completion, Aan ripples and settles back to a diamond at the input. **Exactly the brand-manual choreography.**

---

### C. `AanActionButton.tsx` — new unified Ask Aan button family

The manual shows three sibling buttons: **Ask Aan**, **Copilot Mode**, **Generate Section**. Create one component with these variants. Each shows a live mini-mascot (size 16, state = `idle`, non-interactive) on the left + label.

```tsx
<AanActionButton variant="ask">Ask Aan</AanActionButton>
<AanActionButton variant="copilot">Copilot Mode</AanActionButton>
<AanActionButton variant="generate">Generate Report</AanActionButton>
```

Visual: pill, 1px border in `brand.primary` at 40%, label in `brand.primary`, `aan-gradient-text` retained for "Ask Aan" only (matches manual's hierarchy).

---

### D. Propagate live mascot into Aan-active surfaces

Replace the static `<AanGlyph />` icon in **Aan-active** locations with a live mini-mascot (size 16–22, state="idle", non-interactive — the micro/compact tier has no animation noise, but it now morphs if state changes):

| File | Change |
|---|---|
| `src/components/layout/AppSidebar.tsx` (Ask Aan row) | `AanGlyph` → mini live mascot, size 18 |
| `src/components/layout/AppTaskbar.tsx` (Ask Aan trigger) | same, size 16 |
| `src/features/creative/FloatingActionIsland.tsx` (Ask Aan chip) | same, size 18 |
| `src/components/aan/AskAanTooltip.tsx` | mini mascot in pill |
| `src/components/aan/AanLogo.tsx` | size 20 |
| `src/components/aan/AanBreadcrumb.tsx` | size 18 |
| `src/components/aan/AanWorkspaceSidebar.tsx` (header + collapsed) | size 22 |
| `src/components/aan/AanCopilotPanel.tsx` (header) | size 24, **state morphs live** with portal |
| `src/components/aan/AanConversation.tsx` per-message avatar | already mini mascot — keep |

**Untouched** (per manual's "stays absent" rule): `Sparkles` icons inside feature page headers that are decorative, not AI-active (`SearchHarvesting`, `RuleAgents`, `CreativeAnalyzer`, `AnomalyAlerts`, `ProfitabilityHeroCard`, `ComponentLibrary`, `DesignSystem`). These remain `Sparkles`. They're brand decoration, not Aan presence.

---

### E. Action Island — quick action chips (manual: "Aan's highest-readiness surface")

Manual shows the action island with three live chips: **Summarize**, **Build report**, **Explain drop**. Today the island only shows "Ask Aan."

Add a quick-actions row inside `FloatingActionIsland` (only when `newBranding` is on) with three chips that prefill the input and open Copilot:
- Summarize → `setPendingPrompt("Summarize the current view")` + `openCopilot()`
- Build report → `setPendingPrompt("Generate a report for the last 7 days")` + `openCopilot()`
- Explain drop → `setPendingPrompt("Explain the drop in the highlighted metric")` + `openCopilot()`

Each chip: small pill, mini-mascot icon (size 14, idle), text-primary label, hover lifts. Sits to the right of the existing "Ask Aan" entry.

---

### F. Cleanup

- `AanMascot.tsx` keeps the `shape` prop **deprecated but still accepted** for `DesignSystem.tsx` line 414 demo purposes — drives the visual without overriding state. (Or refactor that demo to use state instead. Proposing the latter.)
- `AanMascotShowcase.tsx` — refresh the "States" grid to show **Diamond idle / Circle listening / Bar loading / Cube thinking** with the manual's exact copy.
- `DesignSystem.tsx` — Aan section refactored to four state cards (no more `shape` prop).

---

### Files

**Create**
- `src/components/aan/AanActionButton.tsx`

**Edit**
- `src/components/aan/AanMascot.tsx` — restore shape morphing tied to state
- `src/components/aan/AanPresenceContext.tsx` — no schema change; portal logic in portal file
- `src/components/aan/AanPresencePortal.tsx` — state mapping uses `inputFocused`, `lastMessage` ripple-then-idle
- `src/components/aan/AanContext.tsx` — add `inputFocused` flag
- `src/components/aan/AanInput.tsx` — set focused/typing state
- `src/components/aan/AanCopilotPanel.tsx` — live mascot in header
- `src/components/aan/AanWorkspaceSidebar.tsx` — live mascot in header
- `src/components/aan/AskAanTooltip.tsx` — mini mascot
- `src/components/aan/AanLogo.tsx`, `AanBreadcrumb.tsx` — mini mascot
- `src/components/layout/AppSidebar.tsx`, `AppTaskbar.tsx` — mini mascot
- `src/features/creative/FloatingActionIsland.tsx` — mini mascot + quick-action chips
- `src/pages/brand/AanMascotShowcase.tsx` — refreshed state demos
- `src/pages/settings/DesignSystem.tsx` — drop `shape` demo, switch to state demo

**Untouched**
- All `Sparkles` outside Aan-active surfaces (decorative brand sparkle).
- Core analytics, tables, charts (manual: Aan stays absent there).

---

### Open questions before I build

1. **Bar progress fill direction** — left-to-right (reads as "processing forward") or center-out ("growing bridge")? Proposing **left-to-right**.
2. **Quick-action chips on the Floating Action Island** — show always, or only when an insight/anomaly is active? Proposing **always**, since the manual treats the island as Aan's highest-readiness surface.
3. **Sparkles in feature page headers** labeled "Aan Creative Insights" / "Aan noticed" — swap to live mini-mascot, or keep as Sparkles? The manual's rule is "Aan appears when intelligence is active" — these headers DO indicate AI is active. Proposing **swap to mini mascot** at size 14, state="idle".
