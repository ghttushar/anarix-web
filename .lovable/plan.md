
# Action Items v2 — Value-First Decision Surface

We're throwing out the current cards, tabs, sort bar, artifact panel and meeting bundle UI. We rebuild from first principles around one idea:

> **Every item earns its row by naming a dollar number and one decision.**

If it can't do that, it doesn't get a row — it gets rolled into a digest.

---

## The core mental model

Aan is a teammate that watches Anarix, meetings, Slack, Teams and email in the background. It produces **Decisions** the user has to approve, reject, or hand back ("you take care of it"). Everything in the UI is a Decision.

A Decision has three lines the eye reads in order:

1. **Value line** — dollars gained or saved, signed, in one glance
   `+ $4,820 / mo`   ·   `− $1,240 one-time`   ·   `Protect $12k at risk`
2. **Insight line** — one sentence: what happened + where
3. **Action line** — one verb: "Reallocate", "Pause", "Relist", "Reply to buyer"

Everything else is behind a click.

---

## Why the current design breaks (and how v2 answers each)

| Break | v2 answer |
|---|---|
| 1000 alerts/day is unreadable | **Auto-digest rule**: anything under a user-set $ threshold collapses into one row per source per hour ("Aan handled 84 low-value items · +$310"). User sets threshold in Preferences. |
| Cards feel claustrophobic | **Row layout, not cards.** 56px tall rows. Whitespace comes from vertical rhythm, not padding around boxes. Card mode only appears when a row is expanded inline. |
| Everything shown at once | **Progressive disclosure everywhere.** Sort → dropdown. Share → icon → popover. Filters → single "Filter" pill that opens a sheet. Reasoning, evidence, transcripts → collapsed by default. |
| Value not quantified | **$ is mandatory.** Every scenario template gets `valueCents`, `valueKind` (`recurring`/`one_time`/`at_risk`), `valueBasis` (short "how we got this number"). No $ = no row (goes to digest). |
| Meetings CTA on overview clutter | **Meeting overview has no buttons.** Only the row (title · time · avatars · #items · total $). Actions live inside expanded view. |
| "Live" label is not a source | Replaced with **source glyph** (Anarix / Aan / Meeting / Slack / Teams / Email / Buyer email) as a 14px icon at the row's leading edge. |
| Confidence is noise | Removed everywhere. Aan speaks with commitment; if it's not sure, it doesn't file a Decision — it files a **Question** (separate tab). |
| Tabs are lifecycle-mixed | Rebuilt around **user intent**, not lifecycle (see Tab model below). |

---

## Tab model (rebuilt around what the user is trying to do)

Left rail, always visible, count badges only when > 0:

| Tab | What lives here |
|---|---|
| **Decide** | Everything waiting on the user, sorted by $ desc by default. Default landing tab. |
| **From meetings** | Meeting-derived task bundles (Flow B). Grouped by meeting. |
| **Questions** | Things Aan isn't sure about and wants the user to clarify (new — replaces "confidence"). |
| **In flight** | Aan is executing an approved item; shows progress. |
| **Handled** | Everything closed in the last 14 days — completed, rejected, delegated, expired. |
| **Digest** | The auto-rolled low-value stream. One row per source per hour. |

No "Everything", no "Live", no "Morning brief" — those become **filters inside Decide** (see below).

---

## The Decide surface (the main screen)

```text
┌───────────────────────────────────────────────────────────────────────────┐
│  Hi Tushar — 6 decisions today worth $18,240.       [Filter] [Sort ▾] [⋮] │
├───────────────────────────────────────────────────────────────────────────┤
│ ▲ TODAY                                                                    │
│ 🅐  + $4,820/mo   Reallocate Winter Push → Launch S4         [You]  [Aan] │
│ 🅜  Protect $12k  Relist SKU-X on Staples (buyer waiting)    [You]  [Aan] │
│ 🅢  − $1,240 1×   Refund escalation from Slack #cs-urgent    [You]  [Aan] │
│ 🅐  + $610/mo    Pause 3 keywords bleeding ACOS > 90%       [You]  [Aan] │
│ ─── Aan handled 84 low-value items this morning · +$310 ▸                 │
│ ▲ YESTERDAY                                                                │
│ ...                                                                        │
└───────────────────────────────────────────────────────────────────────────┘
```

Row anatomy (left → right, fixed grid):

- **Source glyph** (14px, one of: Anarix `🅐`, Meeting `🅜`, Slack `🅢`, Teams `🅣`, Email `✉`, Aan `✦`) with tooltip naming the exact source ("Slack · #cs-urgent · 11:04")
- **Value pill** — colored by kind: green `+$`, amber `Protect $` (at-risk), slate `− $` (cost), grey `Info`. Monospace digits, no decimals above $100. Suffix `/mo` `/wk` `1×` or `at risk`.
- **Insight** — one sentence, truncated with tooltip on overflow.
- Trailing:
  - **[You]** primary button — the one CTA verb ("Approve", "Pause", "Reply", "Relist")
  - **[Aan]** secondary — "You take care of it" delegates back to Aan; Aan drafts, executes, and reports back. Renders as `Handed to Aan` in Handled.
  - Overflow `⋮` — Reject, Snooze 1h/tomorrow/next week, Share, Open source, Copy $ rationale.

Row click = **inline expand** (pushes rows below down, no side panel for 90% of cases). Expanded row shows:

- **Why this number** — one-line basis + `[See math ▾]` collapsible with the calc.
- **Evidence** — mini sparkline / delta bar / 3-row mini-table depending on domain. One visual, not four.
- **What Aan will do** — 2-4 numbered steps, each with an ETA.
- **From meeting** (if any) — chip, collapsed; expands to transcript excerpt + attendees.
- Action bar sticks to the bottom of the expansion: Approve · Hand to Aan · Reject · Snooze ▾ · Share ⇗ · Open in Anarix ↗

Only very heavy artifacts (multi-tab audits, rule diff review, campaign-tree preview) open the **side sheet**. The side sheet is the exception, not the rule.

---

## Value formatting rules

- One canonical formatter `formatValue({cents, kind, cadence})`.
- Green for gains, amber for at-risk protection, slate for costs, grey for info-only.
- Round: `< $1k` show whole dollars, `$1k–$100k` show `$4.8k`, `> $100k` show `$1.2M`.
- Signed always (`+`, `−`, `Protect`, `Info`).
- Cadence suffix always present when known.
- Rationale is **required** in the data model (`valueBasis: string`). If missing → item goes to Digest, not Decide.

---

## Scale strategy (the 1000-a-day problem)

1. **Auto-digest threshold** (default $250, user-editable in Preferences). Anything below rolls up.
2. **Digest rows are one line** — "Aan handled 84 items · +$310 · mostly bid tweaks ▸". Expand to a compact table (source · time · $ · what · undo).
3. **Hard cap on Decide**: max 25 rows visible. Above that, an inline banner "42 more decisions below the fold — [Filter] to narrow or [Sort by $]".
4. **Duplicate collapsing**: identical scenario keys within 6h merge into one row with a `×N` chip; expansion lists them.
5. **Silent bulk actions**: shift+click selects a range, gives a floating "Approve N (+$X)" bar. Keyboard: `j/k` move, `a` approve, `d` delegate to Aan, `r` reject, `s` snooze, `x` select, `?` help.
6. **Snooze first-class** — most "not now" reactions become snooze, not reject; snoozed items return with the same $ still valid.

---

## Meetings (Flow B) redesign

Overview row (in **From meetings** tab):

```text
🅜  Staples QBR — Q4 Planning       Today · 10:00 AM · 47m
    [DC][MR][PS][YO]  4 attendees   5 tasks · $18k committed        ▸
```

- No buttons on the overview row.
- Attendee initials in **individually colored 22px pills** (deterministic hue from name hash — DC blue, MR amber, PS violet, YO teal, etc.). Tooltip = full name + role.
- `$X committed` = sum of value of all action items in the bundle.
- Row expands (or opens sheet if > 6 items) into the meeting workspace:
  - **Summary** (2 sentences), **Transcript excerpt** (collapsed).
  - **Action items** as a checklist. Each item is its own Decision row with the same value/insight/action grammar as Decide.
  - Per-item CTAs use **completion language**, not approval: `Mark completed` · `Not completed` · `You take care of it` (delegates to Aan). No "Approve/Reject" verbs in this surface.
  - Status column shows `Completed` / `Not completed` / `With Aan` / `Open`.

---

## Questions tab (new)

For anything Aan would previously have filed with low confidence. Question row:

```text
🅐  ?  Should I treat "back-in-stock" traffic spike as organic or paid?   [Answer]
```

Answering feeds the policy engine so Aan stops asking that class of question.

---

## Handled tab

Read-only ledger. Each row shows resolution glyph (✓ completed · ✕ rejected · ↩ delegated to Aan · ⏱ expired), the $ that landed, and a `Undo` if within 30s or `Revert` if a rule can back it out. Filter by source / date / resolution.

---

## Interaction & motion rules (kept tight per project system)

- Row hover: background tint only, no scale.
- Row expand: height animate 200ms, cubic-bezier(0.2,0,0,1).
- 30-second **Undo** stays: `sonner` toast with countdown ring. Approved items only commit after 30s.
- No confetti, no pulsing, no gradient sweeps. Aan-only motion budget stays inside the Aan mascot and the Questions tab source glyph.

---

## Preferences additions

New section **"How I work for you"** in Preferences (mobile + desktop):

- Digest threshold ($ slider, default $250)
- Snooze defaults (1h / tomorrow / next week windows)
- Delegation policy per source (Aan may auto-execute below $ / below policy risk)
- Quiet hours (Aan batches into Morning brief instead of live rows)
- Question tolerance (how often Aan is allowed to ask vs guess safely)

---

## Files to delete

- `src/components/aan/autonomous/AanInboxCard.tsx`
- `src/components/aan/autonomous/ExecutionArtifact.tsx`
- `src/components/aan/autonomous/MeetingBundleCard.tsx`
- `src/components/aan/autonomous/MeetingBundleArtifact.tsx`
- Any card/artifact-specific helpers only they use.

`AanEventsContext.tsx` is **rewritten**, not extended (new fields, new lifecycle vocabulary, `valueCents` mandatory).

## Files to create

- `src/components/actions/DecisionRow.tsx` — the 56px row
- `src/components/actions/DecisionExpansion.tsx` — inline expand body
- `src/components/actions/ValuePill.tsx` + `formatValue.ts`
- `src/components/actions/SourceGlyph.tsx` (Anarix/Meeting/Slack/Teams/Email/Aan)
- `src/components/actions/AttendeePill.tsx` (colored initials)
- `src/components/actions/DigestRow.tsx`
- `src/components/actions/MeetingRow.tsx` + `MeetingWorkspace.tsx`
- `src/components/actions/QuestionRow.tsx`
- `src/components/actions/FilterSheet.tsx`, `SortMenu.tsx`, `ShareMenu.tsx`, `SnoozeMenu.tsx`
- `src/components/actions/UndoToast.tsx`
- `src/components/actions/EmptyState.tsx`
- `src/components/actions/HandledLedger.tsx`
- `src/state/actionsStore.tsx` — replaces `AanEventsContext`
- `src/data/mockDecisions.ts`, `src/data/mockQuestions.ts`, `src/data/mockDigest.ts`
- `src/lib/decisions/valueFormat.ts`, `sourceRegistry.ts`, `attendeeColor.ts`

## Data model highlights

```ts
type DecisionSource = "anarix" | "aan" | "meeting" | "slack" | "teams" | "email";
type ValueKind = "gain" | "cost" | "at_risk" | "info";
type Cadence   = "one_time" | "daily" | "weekly" | "monthly";

interface Decision {
  id: string;
  source: DecisionSource;
  sourceRef: { label: string; url?: string; ts: number };
  valueCents: number;          // signed; 0 only for `info`
  valueKind: ValueKind;
  cadence?: Cadence;
  valueBasis: string;          // required — short "how we got this"
  insight: string;             // ≤ 90 chars
  actionVerb: string;          // "Reallocate", "Pause"...
  domain: "campaign" | "retail" | "profitability" | "inventory" | "cs" | "buyer";
  status: "open" | "with_aan" | "in_flight" | "completed" | "rejected" | "snoozed" | "expired";
  createdAt: number; updatedAt: number;
  snoozedUntil?: number;
  meetingRef?: { bundleId: string; title: string };
  evidence?: { kind: "sparkline" | "delta" | "table"; payload: any };
  steps?: { label: string; etaSec: number }[];
}
```

`Question`, `MeetingBundle`, `MeetingTask`, `DigestBucket` are separate types — no shared union with `Decision` beyond source/value formatting utilities.

---

## Phasing

**Phase 1 — Foundation & Decide tab (this is the demo-critical slice)**
- Delete old files; add new store + mocks.
- Build DecisionRow, ValuePill, SourceGlyph, inline Expansion, digest row, snooze/undo, filter sheet, sort dropdown, share popover, keyboard nav.
- Rewrite Alerts page as the new left-rail tab shell; wire Decide + Digest + Handled.
- Preferences: digest threshold + delegation defaults.

**Phase 2 — Meetings & Questions**
- MeetingRow + MeetingWorkspace with completion-language CTAs and colored attendee pills.
- Bundle → per-task Decision integration.
- Questions tab + Aan question data model + policy write-back stub.

**Phase 3 — Scale polish & edge cases**
- Duplicate collapsing (×N chip).
- Range-select bulk bar + full keyboard set + `?` overlay.
- "In flight" progress rows with live step ETAs.
- Empty / overload / offline / stale-source states.
- Handled ledger filters, undo/revert affordances.
- Mobile pass (rows already stack; verify sheet-vs-inline rules on `/mobile/alerts`).

---

## Edge cases explicitly covered

- **Item with no dollar value** → Digest, never Decide.
- **Item value changes between filing and approval** (price/inventory moved) → row shows `was $4.8k → now $3.1k` and requires re-confirm.
- **Duplicate signals from Slack + Anarix for same event** → merged by scenario key + entity id; source glyph becomes a stacked cluster.
- **Meeting ends mid-day, produces 20 tasks** → bundle appears in From meetings; only tasks above digest threshold also mirror into Decide, tagged with meeting glyph.
- **Aan is asked a Question but user never answers** → auto-expires in 72h, filed to Handled as `expired`, Aan records the guess it made.
- **Snoozed item's underlying data goes stale** → returns with a `Stale` badge and refreshed $ or is auto-closed with a Handled entry.
- **Bulk approve across mixed sources** → confirmation summarises "12 items · +$8,420 · 3 sources · undo window 30s".
- **User rejects same class 3× in a row** → Aan surfaces a Question: "Should I stop filing this class?"
- **1000+ items in one burst** (Prime Day) → Decide caps at top 25 by $; a banner surfaces the digest; Aan proactively raises digest threshold and asks in Questions tab.
- **Offline / source disconnected** → source glyph greys out, tooltip says "Slack last synced 12m ago"; new items from that source are held, not silently lost.

---

Approving this plan means: nothing from the current Action Items surface survives except the Aan mascot, the app shell, and the Preferences page (extended). Everything else is rewritten in the three phases above.

