
# Living OS v1.0 — Two-Phase Build Plan

First: **delete everything from the previous exploration.** The six-directions gallery is scrapped. Living OS is now a real product surface, entered from the profile menu, that behaves like a supervisory operating system built on the philosophy we've been converging on (Standing, Domains, Proposals, Understanding, Memory, Delegation, ambient Aan, no dashboards).

The build is deliberately split into two phases so we can evaluate the shell and the atmosphere *before* investing in behaviors. Each phase ends in something you can inhabit and criticize.

---

## Files deleted (before any new work)

- `src/pages/livingos/DirectionsIndex.tsx`
- `src/pages/livingos/directions/` (entire folder — all six prototypes)
- `src/livingos/shell/DirectionShell.tsx`
- `src/livingos/scenario.ts` (rewritten from scratch, not reused)
- Route registrations for `/livingos/directions*` in `src/App.tsx`
- The `livingos-fonts` `<link>` injection specific to the gallery
- `.lovable/visual-directions.md` and the mood images under `src/assets/livingos/moods/` **stay** — they're upstream research, not shipped code

The `/livingos/*` URL branch is fully reset. No trace of the gallery remains.

---

## Entry point (shared by both phases)

The **only** way into Living OS is the profile dropdown at the bottom of `AppSidebar.tsx`. A single new item is added between "Billing" and the "Toggle theme" separator:

```
Switch to Living OS
```

No icon. No badge. No "NEW" pill. It reads like a workspace switch, not a feature.

Clicking it does **not** navigate in the browser sense. It:

1. Fades the current Anarix chrome to 0 opacity over 260ms.
2. Applies a 200ms backdrop blur to the outgoing frame.
3. Pushes the route to `/livingos` (single route — no sub-pages in phase 1).
4. Fades in the Living OS shell over 320ms with a warm-light bloom from the top.

Returning to Anarix is the reverse: the avatar in the ambient strip → "Return to Anarix" → same animation reversed. State on the Anarix side is preserved (no reload).

---

## PHASE 1 — The Shell, the Standing, and the Constellation

Goal: **prove the environment.** No proposals, no delegation, no memory yet. Just the room, the sentence, and the objects.

### 1.1 Shell

One route: `/livingos`. Renders outside the Anarix layout entirely (like the gallery did), no sidebar, no taskbar, no floating island, no command palette. Four permanent regions only:

```
┌──────────────────────────────────────────────────────┐
│  Ambient Strip (48px)                                │
│  Tuesday · You're standing well · 08:14 · ○ Aan     │
├──────────────────────────────────────────────────────┤
│                                                      │
│                  Workspace (fluid)                   │
│                                                      │
│                                                      │
├──────────────────────────────────────────────────────┤
│  Context Dock (72px) — pinned Domains, recents      │
└──────────────────────────────────────────────────────┘
```

**Ambient Strip** (top, 48px): Standing sentence in a warm serif at 15px, day + time on the left in mono, on the right a small breathing dot (ambient Aan presence) + avatar. No numbers. No badges. The sentence is the entire signal.

**Workspace** (middle, fills viewport): warm off-white paper background with subtle grain (light mode) / warm graphite with faint noise (dark mode — inherits from existing ThemeContext). No borders. No cards. No grid.

**Context Dock** (bottom, 72px): a horizontal magnifying dock (mac-style) showing recently inhabited Domains + one small "○ agent running" indicator when applicable. Empty on first entry. Hover magnifies each object ~1.15×. Click returns focus.

Nothing else is permanent. No breadcrumbs, no search bar visible (Cmd+K opens it), no settings icon.

### 1.2 The Home Constellation

Below the ambient strip, in the workspace, the home view is a **constellation of Domains** — not a grid, not cards. Six Domain objects arranged in a loose, deliberately asymmetric composition:

- Advertising (weighted heavier, sits slightly left of center)
- Inventory
- Cash
- Customers
- Operations
- People

Each Domain is rendered as a soft organic shape (irregular blob / stone silhouette generated once and stable — same shape every session for spatial memory), ~140px, with:

- Name in the direction's serif, below the shape
- A tiny **state indicator**: `holding` / `watching` / `firm` / `soft` / `silent` / `recovering` — one word in mono, 10px, muted
- A subtle tilt indicator (2° rotation) when the Domain is "leaning" — meaning it's the one that will produce the next proposal

No numbers on the constellation. No KPIs. No charts. The user's eye reads: sentence → constellation → the one tilted Domain.

Above the constellation, one authored line from Aan in a large humanist serif (28px):

> "Good morning. You're standing well. Nothing requires judgment for another two hours — but Advertising is leaning toward one."

### 1.3 Domain Descent (semantic zoom, not navigation)

Clicking a Domain does **not** route. The Domain expands in place over 450ms:

- The clicked Domain scales from 1.0 → 1.06 → settles at ~80% of the workspace
- Other Domains blur (backdrop-blur 4px) and dim to 30% opacity
- The ambient strip stays put
- The Domain's interior fades in: name (large), state sentence, one-paragraph narrative from Aan (authored, 3–4 sentences of context), and a relationships strip on the right (children, watchers, delegations — as text, not chrome)

Escape or clicking outside collapses back over 320ms. Zero routing. This is Principle Three — objects outlive screens.

### 1.4 Cmd+K

Opens a centered command palette (glassy, single input, ~640px wide, floating at 30% viewport height). Placeholder: *"Ask, find, or investigate."* Static results in phase 1 — no real search — but the object grouping (Domains / Proposals / Memory / Signals) is shown so the interaction model is legible.

### 1.5 Shared scenario file

New `src/livingos/scenario.ts` — authored, hard-coded Tuesday morning. Includes: standing sentence, six Domains with state + tilt + one-paragraph narrative each, one proposal on Advertising (used in phase 2), one running agent (used in phase 2). All copy is written in the voice specced in the brief — chief-of-staff, not marketing.

### 1.6 Fonts loaded inside `/livingos`

Loaded only on this route via a `<link>` injection in the shell component so we don't pollute Anarix:

- **Fraunces** (serif — Standing sentence, Aan narrative, Domain names)
- **IBM Plex Sans** (body, sparingly)
- **IBM Plex Mono** (time, state indicators, mono affordances)

No accent font. No decoration.

### 1.7 Files touched — Phase 1

**Created:**
- `src/livingos/scenario.ts`
- `src/livingos/shell/LivingOSShell.tsx` — the four-region shell
- `src/livingos/shell/AmbientStrip.tsx`
- `src/livingos/shell/ContextDock.tsx`
- `src/livingos/shell/CommandPalette.tsx` — Cmd+K palette (static)
- `src/livingos/domains/DomainConstellation.tsx` — the home view
- `src/livingos/domains/DomainObject.tsx` — a single Domain silhouette
- `src/livingos/domains/DomainExpanded.tsx` — the expanded/inhabited state
- `src/pages/livingos/Workspace.tsx` — mounts the shell at `/livingos`
- `src/livingos/tokens.css` — Living OS-only color, spacing, motion tokens (scoped to `.livingos-scope`)

**Edited:**
- `src/App.tsx` — remove old `/livingos/directions*` routes, add single `/livingos` route
- `src/components/layout/AppSidebar.tsx` — add "Switch to Living OS" menu item + fade-out transition
- `src/features/creative/CreativeFeatures.tsx` — keep the existing "hide app chrome on /livingos/*" guard (already in place)

**Deleted:** as listed at the top of this plan.

---

## PHASE 2 — Judgment, Proposals, Memory, and Delegation

Goal: **prove the supervisory loop.** Now the user can actually *do* the thing Living OS is for — approve/modify/reject a proposal, replay a Domain, delegate, and see memory. Still one scenario, still one Tuesday, but the object model becomes real.

### 2.1 Proposals

When Advertising is expanded, a **Proposal Sheet** slides in from below the narrative — laid on top of the Domain surface with a slight elevation (not a modal, not a card). Contains:

- Aan's proposal in one sentence ("Shift 12% of SP budget to SB for the last three days of the Q4 window.")
- **Why** (one paragraph, evidence linked inline as small mono chips)
- **Expected impact** on Standing (small before/after sentence, no chart)
- **Confidence** (a horizontal line — 78% filled, not a percentage number front-and-center)
- Four affordances in the footer, evenly spaced: `Approve` · `Modify` · `Reject` · `Simulate`
- One secondary row: `Delegate this decision` · `Compare alternatives (2)`

Approve triggers the **cooling window** — a 12-second undo strip appears in the ambient strip: "Approved. Undo — 12s." Reject fades the sheet with a soft acknowledgment. Modify opens an inline editable version of the sentence.

### 2.2 Simulate

Simulate transforms the workspace into a **future mode**: Domain surface takes on a slightly cooler tint, the Standing sentence in the ambient strip shows a projected version prefixed with "If approved:", and the constellation Domains that would be affected pulse gently once. Exit returns to present. Nothing executes.

### 2.3 Delegate (flip the Domain)

Clicking `Delegate` on any expanded Domain **flips the Domain surface** (3D rotateY, 600ms) to reveal its delegation face: authority scope, confidence floor slider, duration, boundaries, exceptions, and a history of past delegations for this Domain. Flip back returns to the business face. This is the "objects have a back" principle made literal.

### 2.4 Memory & Replay

Below every expanded Domain, a thin horizontal timeline (initially collapsed to a single line) can be pulled up. Clicking a past moment rewinds *the Domain itself* — its state indicator changes, its narrative changes to what Aan wrote at that time, its previous proposal reappears in a muted style. Not a modal, not a new page. The Domain gently dissolves through time.

Scrub with drag. Snap points at every state change. `Compare with now` overlays the two states.

### 2.5 Running Agents (ambient)

One agent runs during the Tuesday scenario (bid-cap rebalance on US-Sponsored, ~6 min remaining). It appears:

- In the ambient strip as a slowly rotating dot next to the Aan presence
- In the Context Dock as a small orbiting body next to the Advertising Domain
- Inside the expanded Advertising Domain as one line: "○ Aan is rebalancing US-Sponsored bid caps · ~6m"

Clicking it opens a small ambient panel (not full-screen) showing what the agent is doing, why, and a `Stop` affordance. No progress bar. Just a sentence and a soft pulse.

### 2.6 Awareness (replaces notifications)

No notification center. No bell. Instead, a subtle change in the ambient strip's Standing sentence when something crosses a threshold, plus a one-time warm bloom from the top of the workspace. If it's critical (delegation exceeded, hard action, compliance), the sentence itself changes tone (kept in same serif, but color shifts to a warmer amber). Never red. Never a badge.

### 2.7 Universal behaviors bar (right-click / hover)

Every object (Standing, Domain, Proposal, Memory, Evidence) supports a common set of verbs revealed via a small circular affordance on hover: Share · Watch · Compare · Replay · Simulate · Pin · Inspect · Contest. Not a context menu — a satellite ring that fades in around the object.

### 2.8 Aan integration with existing Anarix Aan

Living OS's Aan **is** the same Aan. Reuse `AanProvider` and `useAan` from `src/components/aan/AanContext`. Living OS surfaces Aan differently (ambient presence, authored narratives, no chat panel by default), but a `⌥Space` shortcut opens the existing `AanCopilotPanel` as a right-edge sheet if the user wants to converse directly. This satisfies "use Aan's phases and interactions" without duplicating state.

### 2.9 Files touched — Phase 2

**Created:**
- `src/livingos/proposals/ProposalSheet.tsx`
- `src/livingos/proposals/CoolingWindow.tsx` — the 12s undo strip in the ambient strip
- `src/livingos/proposals/SimulationMode.tsx` — workspace tint + projected Standing overlay
- `src/livingos/delegation/DelegationFace.tsx` — the flipped back of a Domain
- `src/livingos/memory/DomainTimeline.tsx`
- `src/livingos/memory/ReplayController.tsx`
- `src/livingos/agents/RunningAgentIndicator.tsx`
- `src/livingos/agents/AgentAmbientPanel.tsx`
- `src/livingos/behaviors/SatelliteRing.tsx` — universal verbs affordance
- `src/livingos/awareness/AwarenessBloom.tsx` — the warm top-of-workspace signal

**Edited:**
- `src/livingos/scenario.ts` — extend with proposal, alternatives, delegation state, timeline events, agent
- `src/livingos/domains/DomainExpanded.tsx` — mount ProposalSheet, DomainTimeline, SatelliteRing
- `src/livingos/shell/AmbientStrip.tsx` — mount CoolingWindow, RunningAgentIndicator, AwarenessBloom
- `src/livingos/shell/LivingOSShell.tsx` — wrap in `AanProvider` if not already available at this route, wire ⌥Space shortcut

**Not touched:** all of Anarix (routes, sidebar, taskbar, panels, tokens, data, Aan implementation). Living OS lives in its own directory tree with its own tokens.

---

## Design commitments (locked before build)

- **Material**: warm paper (light) / warm graphite (dark). Never glass gradients, never neon.
- **Typography**: Fraunces for authored voice; Plex Sans for body; Plex Mono for time, state, evidence chips.
- **Motion**: 260–450ms, cubic-bezier(0.2, 0, 0, 1). Never elastic, never bouncing. Every animation resolves to stillness.
- **Color**: no red for alerts. Warm amber for critical. Muted graphite/ink for everything else. Standing is always the warmest thing on screen.
- **No dashboards, no KPI cards, no charts, no tables, no notification center, no marketing chrome — anywhere. Ever.**
- Aan is ambient by default. Chat is on-demand only.

---

## Evaluation loop

At the end of Phase 1, I'll ask:
- Does entering Living OS feel like *arriving somewhere* or like opening an app?
- Is the constellation legible without instruction?
- Is the Standing sentence carrying enough weight?

At the end of Phase 2, I'll ask:
- Does approving a proposal feel like supervising, or like clicking a button?
- Does replaying a Domain feel like memory, or like scrubbing a timeline widget?
- Where does the interface still feel like software instead of a place?

Only after Phase 2 evaluation do we decide whether Phase 3 (multi-user, live data, more Domains, cross-Domain relationships) is worth building.
