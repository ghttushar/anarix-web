## Reality check

The prior turn *claimed* to ship the Decision OS but only the plan doc was written. `src/pages/Alerts.tsx` is still the old AanMascot + ViewSwitcher + GridCard + AlertDetailPanel page. `GreetingHeader`, `QueueSection`, `ReviewWorkspace`, `chips/*`, `groupSituations` — none exist on disk. This pass actually builds it.

## Scope

Everything lives in `src/pages/Alerts.tsx`, `src/state/actionsStore.tsx`, `src/components/actions/**`, `src/lib/decisions/**`, `src/index.css`. No new routes, no backend, no new mock files, no Living OS edits, no sidebar/website/mobile changes. `/alerts/:viewMode` still resolves; `viewMode` is ignored.

## 1. Lifecycle model (store)

Add to `actionsStore.tsx`:
- `Lifecycle = "needs_me" | "reviewing" | "approved" | "undo_window" | "executing" | "waiting" | "delegated" | "snoozed" | "rejected" | "completed" | "archived" | "history"`
- Derive `lifecycle` per decision from existing `status` + `updatedAt` + snooze/delegate flags
- `transition(id, next)` — writes lifecycle + timestamp, drives auto-move between queue sections
- Selectors: `needsMe`, `needsReview`, `watching`, `aanWorking`, `completedToday`, `historical`, `groupBySituation`, `lastOutcomeFor(id)`, `relationsFor(id)`
- `savedViews`, `watchlist`, `pinned`, `density`, `notificationRules` persisted to `sessionStorage`
- Priority is separate from importance: `priority: "critical"|"high"|"medium"|"low"|"background"` derived from severity × valueCents × deadline
- Confidence relabeled `firm | soft | watching` (+ numeric % kept internally)

## 2. Page structure — new Alerts.tsx

```
GreetingHeader (name, "3 need your judgment · 24 handled automatically")
AlertsToolbar  (3 tabs · Search · ⌘K · Density · More filters ▾ · Saved Views)
BulkBar/SelectionToolbar (only when selection.size > 0)
┌── ≥1200px ────────────────────────────────────────┐
│ 34% QueueColumn         │ 66% ReviewWorkspace     │
│  QueueSection Needs You │  (in-page, not sheet)   │
│  QueueSection Needs Review                        │
│  QueueSection Watching (collapsed)                │
│  QueueSection Aan Working (collapsed)             │
│  QueueSection Completed Today (collapsed)         │
│  QueueSection History (link)                      │
└───────────────────────────────────────────────────┘
900–1199px: single column, Review = 520px overlay
<900px: Review = full-screen sheet
```

State persisted to `sessionStorage`: tab, query, density, section expansion, selected id, saved view, watchlist, pinned.

## 3. Situation grouping (`src/lib/decisions/groupSituations.ts`)

Merge decisions when any match: `campaign · sku · product · supplier · meeting · domain · marketplace · rootCause` (derived from `domain` + normalized `sourceRef.label` + 4h time bucket). Duplicates never appear standalone. Groups >7 render a `Show N more` tail. Needs You is never truncated.

## 4. Card model (StackRow rewrite)

Single CTA `Review →`. Body = title (natural language, one sentence) + supporting line ≤12 words + three chips: `ImpactChip · ConfidenceChip · IfIgnoredChip`. Card states: default · hover · selected · keyboard-focused · expanded · loading · processing · completed · undo-available · disabled — all animated ≤200ms.

Hover quick actions (right-aligned on hover only): Approve · Reject · Delegate · Archive — no Review open needed.

Universal overflow menu on every card: Open · Copy Link · Watch · Pin · Share · Archive · Replay · Compare · Audit.

## 5. Review Workspace (`review/ReviewWorkspace.tsx`)

Replaces `AlertDetailPanel`. Sections top-to-bottom:

1. `DecisionHeader` — title · situation · owner · lifecycle chip
2. `WhyThisMatters`
3. `RecommendationBlock` — Summary · Reason · Impact · Tradeoff · Risk · Undoability · Confidence
4. `AlternativeBlock` — compressed list, each with same structure
5. Impact · IfIgnored · Confidence chips row
6. `EvidenceRow[]` (collapsed by default)
7. `RelatedDecisionChip[]` — typed relationships: blocks · depends_on · duplicates · merged_into · caused_by · related
8. Previous Outcomes (`lastOutcomeFor`)
9. `DecisionTimeline` — multi-step progress (Approve → Waiting → Confirm → Executing → Completed)
10. `AuditTrail` — collapsed strip: who · when · why · previous → new · source · AI involvement
11. `ReviewFooter` — Approve ▾ · Modify · Reject · Delegate · Assign · Snooze · overflow (Watch · Pin · Share · Replay · Compare)

Approve → 30s `UndoBanner` in footer → auto-transition to `executing`.

Tabs inside workspace: **Decide · Replay · Compare · Audit** (Replay/Compare/Audit read-only, Replay only for completed).

## 6. Toolbar (`AlertsToolbar` rewrite)

Tabs: `Needs Me · Watching · Everything` (map old keys internally so store stays intact). Add: universal Search, ⌘K palette, `DensityToggle`, `SavedViewsMenu` (Finance · Marketing · Inventory · My Team · High Impact · Awaiting Approval), `More filters ▾` opens extended `FilterSheet` (Marketplace · Team · Owner · Revenue Impact · Risk · Confidence · Automation Status · Date · Meeting · Campaign · Product · Domain). Remove ViewSwitcher, ViewModeToggle, SortMenu, severity dots, raw timestamps, marketplace/category badge stack. Sort is fixed importance: `revenue*4 + deadline + risk + waitingOnYou*2 + info`. Times bucket to Now/Today/Yesterday/Earlier/Scheduled/Waiting/Paused/Expired/Recurring.

## 7. Keyboard model (extend `useDecideKeyboard`)

`J/K` next/prev · `Enter` open Review · `Esc` close · `Space` select · `Shift+Space` range · `A` approve · `M` modify · `R` reject · `D` delegate · `S` snooze · `/` or `⌘K` search. `KeyboardHelpOverlay` updated.

## 8. States

- **Empty** — one-sentence variants: no decisions · nothing needs review · nothing watching · search empty · no permissions · workspace disconnected · offline. No illustrations.
- **Loading** — skeletons at queue · situation · workspace · search · evidence · recommendation. Spinners only inside a committing button.
- **Error** — inline recovery card with next action for: Amazon unavailable · Meeting unavailable · Slack disconnected · connector timeout · permission denied · decision already resolved (`ConflictBanner`) · network failure. No raw strings.

## 9. Motion (`src/index.css` + `framer-motion` already present)

120–240ms `cubic-bezier(0.2,0,0,1)` for: queue reorder (`layout`) · section expand/collapse · review open/close · approval commit · undo rewind · completion slide · watching pulse (opacity) · Aan execution shimmer (one pass) · history archive slide-out. `prefers-reduced-motion` respected.

## 10. Search

Universal input searches decisions · situations · meetings · questions · campaigns · products · SKUs · keywords · people · teams from existing mock files. Ranked by relevance × recency. `SearchResultCard` per hit. Local only.

## 11. Bulk mode

`SelectionToolbar` (extends BulkBar) — Next · Prev · Approve Similar · Skip · Delegate · Archive · Review Individually. Only visible when selection.size > 0. `Smart Suggestions` banner: after 30 repeat approvals surface "Delegate these to Aan".

## 12. Reusable primitives (all created under `src/components/actions/`)

`chips/`: `ImpactChip · ConfidenceChip · IfIgnoredChip · LivingStatusChip · OutcomeBadge · KeyboardShortcutBadge`
`review/`: `ReviewWorkspace · DecisionHeader · SituationHeader · RecommendationBlock · AlternativeBlock · EvidenceRow · RelatedDecisionChip · SimilarDecisionRow · LearningBanner · ConflictBanner · UndoBanner · DecisionTimeline · ReviewFooter · AuditTrail · ReplayView · CompareView`
`queue/`: `GreetingHeader · QueueSection · QueueCounter · SectionCounter · SituationRow · SavedViewsMenu · DensityToggle · SelectionToolbar · SearchResultCard`

Locked component rules: chip 24px, button 32px (compact) / 40px (comfortable), row 48px/64px, radius 6/8, focus ring 2px `--ring`.

## 13. Design tokens (`src/index.css`)

Add token scales: `--space-{1..8}`, `--radius-{sm,md,lg}`, `--elev-{1,2,3}`, `--border-{hair,solid}`, `--motion-{fast,base,slow}`, `--opacity-{muted,disabled}`, `--blur-{soft}`, `--shadow-{card,pop}`, `--icon-{sm,md,lg}`, typography scale (Page/Section/Situation/DecisionTitle/Supporting/Meta/Evidence/System).

## 14. Files

**Edit**: `src/pages/Alerts.tsx` (full rewrite) · `src/state/actionsStore.tsx` (lifecycle + selectors + savedViews/watchlist/pinned/density) · `src/components/actions/AlertsToolbar.tsx` · `src/components/actions/tabs.ts` · `src/components/actions/StackRow.tsx` · `src/components/actions/ExpandedAlertBody.tsx` · `src/components/actions/ActionChoiceRow.tsx` → ReviewFooter host · `src/components/actions/FilterSheet.tsx` (extended filters) · `src/components/actions/BulkBar.tsx` → `SelectionToolbar` · `src/components/actions/EmptyState.tsx` (variants, no art) · `src/components/actions/KeyboardHelpOverlay.tsx` · `src/components/actions/useDecideKeyboard.ts` · `src/lib/decisions/valueFormat.ts` (add `formatImpact · formatIfIgnored · formatConfidence · livingStatusPhrase · bucketTime · priorityFor · confidenceLabel`) · `src/index.css` (tokens + motion).

**Create**: all primitives above + `src/lib/decisions/groupSituations.ts` + `src/lib/decisions/relationships.ts` + `src/lib/decisions/importance.ts` + `src/lib/decisions/search.ts` + `src/hooks/useLivingClock.ts` + `src/hooks/useAiSummary.ts`.

**Delete**: `src/components/actions/ViewSwitcher.tsx` · `src/components/actions/ViewModeToggle.tsx` · `src/components/actions/SortMenu.tsx` · `src/components/actions/GridCard.tsx` · `src/components/actions/AlertDetailPanel.tsx` (replaced by ReviewWorkspace).

## Acceptance

- `/alerts` renders GreetingHeader + 3-tab toolbar + lifecycle-grouped Queue + in-page ReviewWorkspace on desktop
- Every scan card = one CTA (`Review →`) + hover quick actions
- Approve triggers 30s Undo, then card auto-moves Needs Me → Executing → Completed Today with animation
- Reject → Archived → History; Delegate → Waiting → Executing
- Situations merge duplicates; groups >7 collapse with `Show N more`; Needs You never truncated
- Full keyboard model works with no mouse; `KeyboardHelpOverlay` lists it
- No ViewSwitcher, SortMenu, severity dots, raw timestamps, empty-state art, GridCard, or AanMascot header remain
- Review Workspace exposes Decide · Replay · Compare · Audit tabs
- Saved Views, Watchlist, Pinned, Density persist across reloads
- `prefers-reduced-motion` disables non-essential animation
