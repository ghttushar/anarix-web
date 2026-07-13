
# Living OS — Re-authoring around the PDF philosophy

We keep every capability that the duplicated Aan Alerts system already provides (decisions, approvals, meetings, bundles, questions, undo, keyboard shortcuts, bulk, search/filter/sort). Nothing gets deleted. We change the *interaction model* around it so it stops feeling like "Alerts, restyled" and starts feeling like an operating layer that is already running the business.

All work stays inside `src/livingos/`. No Anarix files change.

---

## North star (from the PDF)

- Home answers *"What deserves my judgment?"* not *"What do you want to ask?"*
- Money-first, then reason, then evidence, then action.
- Standing is the **state**, not the interface. The interface is Inbox + Workspace + Tools + Actions + Memory.
- The user supervises. Aan works. Everything is explainable and reversible.
- One measurable metric: **time to confident decision**.

## The seven layers we build toward

```text
1  Ambient Strip     Standing sentence, time, search, avatar, running-agents pulse
2  Standing panel    "You're standing well" + counts (proposals / agents / opportunities)
3  Operational Inbox Requires judgment · Requires review · AI waiting · Cooling · Running · Completed · Watching
4  Workspace         One fluid surface. Selecting an inbox item expands it here in place.
5  Tools             Inspect · Compare · Replay · Simulate · Present · Share · Watch · Bookmark
6  Actions           Approve · Modify · Reject · Delegate · Undo (with cooling window)
7  Memory / Context  Timeline, related domains, evidence chain, prior decisions
```

Constellation of Domains is **demoted** to a "Spatial view" tool, not the home.

---

## Phase 1 — Shell + Home + Inbox (usable product)

Goal: opening `/livingos` immediately answers *what changed, what needs me, what is already handled, what can I do*.

### 1.1 Ambient Strip (rebuild)
Top 48px band. Contents, left→right:
- Day + short standing sentence, generated from current decisions (e.g. *"Tuesday · You're standing well. Advertising needs one decision. Inventory recovered overnight."*).
- Middle: `RunningAgents` pulse — 3–6 tiny dots with labels on hover (*"Watching Buy Box", "Reading meeting", "Preparing QBR"*). Sourced from open decisions + meetings.
- Right: `⌘K` search hint, avatar.

No numbers, no charts, no chrome. Text only.

### 1.2 Standing panel (new, replaces empty canvas)
Directly under the strip, a single quiet block:
- One-line standing verdict.
- A row of muted counts derived from `actionsStore`: *N need judgment · N in cooling · N running · N settled today · $X protected · $Y at risk*.
- No cards. Editorial spacing, Fraunces headline, Plex Sans body.

### 1.3 Operational Inbox (replaces current Registers/tabs)
Same data as today, re-grouped by **operational state**, not by source category:
- Requires judgment (open, actionable, non-fyi)
- Requires review (fyi + questions)
- AI waiting / cooling (in_flight + cooling window)
- Running (custom actions set)
- Settled today (completed, rejected — collapsed by default)
- Watching (meetings + bundles)

Rendering: reuse `StackRow` / `GridCard` verbatim; only the tab layer + counts change. Money value stays the leading token per row. Tabs become quiet register labels, not pill buttons.

### 1.4 Workspace in place (replaces right-side `AlertDetailPanel`)
Selecting a row no longer opens a right sheet. It expands the row into a **workspace block** that pushes the list down. Inside the block:
- Narrative (`ExpandedAlertBody` reused).
- Evidence chain, source, related decisions.
- Action rail (Approve · Modify · Reject · Delegate · Simulate · Compare) with the 12s cooling window we already have.
- Close returns to the inbox without losing scroll.

The right sheet is kept only for `Ask Aan` invoked from `⌥Space`.

### 1.5 Universal Command (`⌘K`)
Centered palette. Natural-language input plus grouped results: Domains · Proposals · Memory · Signals · People. Phase 1 delivers the palette shell + local search across current decisions/meetings/questions and view/sort/filter commands. LLM routing is out of scope for phase 1.

### 1.6 Context Dock (bottom, 72px)
Persistent dock:
- Recently opened decisions/meetings
- Pinned items (bookmark from row menu)
- Running agents (mirrors ambient strip, expanded)
- Notifications become **state changes** here, not toasts.

### 1.7 Cleanups inside `src/livingos/`
- Remove Anarix-styled taskbar/date-picker leftovers in `AlertsToolbar` (already partially done).
- `EmptyState` uses Fraunces/Plex, no Sparkles.
- Drop `Aan: Assisted` badge, "Last synced" chip, mascot header — the Standing sentence is the identity.
- Keep `actionsStore`, `selectionStore`, keyboard shortcuts, undo, mock data files untouched.

---

## Phase 2 — Domains, Tools, Memory, Delegation

Goal: turn the inbox item into a real operating object with the universal behaviors the PDF requires.

### 2.1 Domain surface
Each decision belongs to a Domain (Advertising / Inventory / Cash / Customers / Operations). Derive from `decision.domain` field already present in mock data. Domain view is a full-workspace mode reachable from any row or `⌘K`:
- Top: Standing for that domain (one sentence + counts).
- Body: proposal list, running actions, running agents, evidence.
- Right rail (integrated, no sidebar chrome): Relationships, Delegations, Recent memory.

### 2.2 Tools bar (universal, inside any Domain / open item)
Row of quiet verbs: **Inspect · Compare · Replay · Simulate · Present · Share · Watch · Bookmark**. Implemented as small overlays over the workspace:
- **Replay**: dissolve current state, step through prior versions of the same domain/decision using `actionsStore` history.
- **Compare**: pick two decisions or two moments; workspace splits adaptively.
- **Simulate**: renders projected Standing + tradeoffs; nothing executes.
- **Present**: read-only, typography scaled up, chrome hidden.
- **Inspect**: click any value/sentence → opens reasoning inline (no navigation).
- **Watch / Bookmark / Share**: persistent flags on the decision.

### 2.3 Proposal object (upgrade of current row action)
Every actionable decision is a Proposal supporting: Accept · Modify · Reject · Simulate · Explain · Compare Alternatives · Delegate · Cooling · Undo. Rebuild `ActionChoiceRow` into a `ProposalRail` component used both inline and inside Domain view.

### 2.4 Memory / Timeline
`DomainTimeline` component driven by decision + meeting history. Not always visible; opens via Replay tool or `⌘K → "history of …"`. Vertical list of past decisions, meetings, executions, learnings.

### 2.5 Delegation face
"Flip" on a Domain/Proposal: front = business, back = delegation rules, authority, confidence, history, undo. Persists to `actionsStore`.

### 2.6 Constellation (demoted)
Small "Spatial view" tool inside the Tools bar. Not the home. Purely visual — grouped domains + gravity between related ones. Read-only.

### 2.7 Motion & language rules (enforced project-wide inside `[data-livingos]`)
- Motion only communicates thinking, working, confidence. No decorative animation.
- 120–240ms max. Fade + subtle translate/scale. No bounce, parallax, or persistent glow (except one Aan breathing dot in the strip).
- Copy tone: authored, terse, first-person from Aan when explaining. Never marketing.

---

## Explicitly not doing

- No new pages in `src/pages/`; single `/livingos` route stays.
- No changes to Anarix Alerts, sidebar entry text, or any file outside `src/livingos/` and `src/pages/livingos/`.
- No new mock data; derive everything from existing `mockDecisions/mockMeetings/mockQuestions`.
- No backend, no AI calls in phase 1. `⌘K` search is local. LLM standing-sentence generation is deferred.

## Deliverable checkpoints

- **End of Phase 1**: open `/livingos` → strip + standing + operational inbox + inline workspace expand + `⌘K` + context dock, all working over existing store.
- **End of Phase 2**: any inbox item can be opened as a Domain with the full Tools bar, Proposal rail, Replay, Compare, Simulate, Delegation face, Memory timeline.
