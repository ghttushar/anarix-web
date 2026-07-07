
# Action Items v3 — Design Reset, Richer Content & All 20 Enhancements

Scope: UI/presentation + mock data only. All 20 enhancements from the previous plan are IN.

---

## 1. Content depth — richer value / insight / action

Today rows read as one-liners and the expanded panel is spartan. New content contract per Decision:

**Row (collapsed)**
- **Value line (headline):** the money pill + a caption + a short "why it matters" phrase.
  - e.g. `+ $482K/mo GAIN  ·  monthly reclaimable spend  ·  Winter Push burning 41% over target`
- **Insight line (2nd row inside the row):** full sentence, up to ~140 chars, not truncated with ellipsis on desktop.
  - e.g. `Winter Push has run 41% over TACoS for 3 straight weeks while Launch S4 sits under its 4.1× ROAS ceiling with $2.4k/day of headroom.`
- **Action cluster:** primary CTA = `actionVerb`, secondary = "You take care of it", overflow = snooze/reject/deep-link/copy rationale.
- **Meta strip (compact, muted):** source glyph + source label + domain + time-ago + severity dot + dupe/stale/from-meeting chips as plain text.

Row height grows from 56→80px to fit the 2-line body cleanly.

**Expanded ("Know more") panel — restructured into 5 clear sections**

1. **Value** — money pill (md), cadence caption, and a 2–3 sentence `valueBasis` paragraph (upgraded from one sentence). Includes a small "How I got here" bullet list (3 bullets) showing the calculation inputs.
2. **Insight** — 2–3 sentence narrative. Explains what changed, when, and the comparison baseline. Bolds the key numbers inline.
3. **Evidence** — existing delta/table/sparkline block, plus a new mini timeline (last 7 data points) when relevant.
4. **What I'll do if you approve** — step list with per-step ETA and a plain-language "why this step" tooltip. Live progress bar when in-flight.
5. **Context & source** — from-meeting excerpt (collapsed), duplicate signals (collapsed), source ref with deep-link, and share menu.

Mock data (`mockDecisions.ts`) is rewritten so every item has: a fuller `valueBasis` (2–3 sentences), a fuller `insight` (~120–140 chars), and a new optional `insightDetail` field (2–3 sentences shown in the expanded Insight section). Same for `mockMeetings.ts` tasks.

---

## 2. Global shell cleanup (Alerts.tsx)

- Remove the `?` shortcut hint in the greeting.
- Remove the `Digest` tab (content already surfaces as "Handled by me" strip inside Decide).
- Remove `<SourceStatusStrip />` and delete the file.
- Widen container `max-w-[1180px]` → `max-w-[1360px]`.
- Bump base type: primary text `text-sm` (14px), secondary meta `text-[13px]`, uppercase labels stay 11px — matches Noto Sans scale used elsewhere.
- Drop the redundant "N decisions" tail count on bucket headers.
- Aan voice: sweep to first-person across page copy, mock data, and empty states.

---

## 3. Source icon system — colorless + brand marks

- New `<AnarixMark />` component wrapping `anarix-symbol.svg`, force-filled `currentColor`.
- New `<AanMark />` component (small monochrome silhouette derived from AanMascot).
- External channels swap to generic monoline glyphs, all rendered `text-muted-foreground`:
  - Meeting → `Calendar`, Slack → `MessageSquare`, Teams → `Users`, Email → `Mail`.
- `SourceGlyph` now supports a `withLabel` variant used in the expanded "Context & source" section so first-time users learn what each glyph means.

---

## 4. DecisionRow redesign

- 2-line body (Value headline + Insight); action cluster on the right.
- Value pill is size-md and always wins the eye.
- Meta line replaces the row of micro-icons (Copy, AlertCircle, "from meeting" chip). Dupe/stale/meeting facts become plain-text meta.
- 30-second undo surfaces via new `<UndoToast />` (bottom-center) with a live 30s ring — works for approve/reject/delegate on Decide and mark-completed/reject on Meetings.
- Selection checkbox and keyboard nav unchanged behaviorally.

---

## 5. Meetings tab — consistent at any scale

- **List-first, drill-in:** meetings tab shows only bundle rows; clicking a row opens `MeetingWorkspace` in a **right-side Sheet** (`w-[600px]`), matching the project's right-panel workflow rule. Sheet header includes back-to-list, prev/next bundle nav, and a Share menu.
- **Attendee chips:** initials only (`DC`, `MR`), full name + role on hover tooltip. Remove the `Dorothy Chen · Staples buyer` text next to the pill in both the bundle row and workspace header.
- **Task CTA wording:** primary button is the task's action verb (`Send forecast`, `Approve refund`, `Pause keyword`, `Draft memo`, `Relist SKU-X`). Secondary is `You take care of it`. Tertiary is `Reject`. Store semantics unchanged (verb click → `markTaskCompleted`; Reject → `markTaskNotCompleted`).
- **Share in Meetings:** `<ShareMenu />` in workspace header and per-task footer.
- **Bundle row polish:** promote committed value into a real `ValuePill`; drop the purple "M" square in favor of the new colorless Calendar glyph.
- 2 additional bundles seeded so the tab holds 4 meetings for the scale demo.

---

## 6. Scale up scenarios (25–30 items visible)

`mockDecisions.ts` grows from 12 → **28 items**, richer copy, realistic mix:

- 12 critical / 10 opportunity / 6 fyi
- Sources: 8 Anarix, 6 Aan, 5 Meeting, 4 Slack, 3 Teams, 2 Email
- Kinds: 12 gain / 8 at_risk / 5 cost / 3 info
- 3 dupe clusters (2–3 items each), 2 in-flight, 4 completed, 2 rejected, 2 expired, 2 stale-after-snooze
- New scenarios include: Buy Box loss on hero SKU, Walmart bid-cap breach, S&S opt-in dip, review-velocity drop, Auto-campaign negative sweep, competitor undercut, OOS risk on 3 variations, policy suppression, coupon expiring in 6h, AMC incremental-ROAS validation, brand-defense keyword loss, weekend day-parting anomaly, glance-view dip, 2pm budget over-pace, listing-quality alert.

`mockMeetings.ts` → 4 bundles, 3–5 tasks each with richer `valueBasis` + `transcriptExcerpt`.
`mockQuestions.ts` → 6 questions with fuller context.

---

## 7. Sort defaults & persistence

Sort menu: `Latest`, `Highest value`, `Critical first`, `Source`. Selection persisted per tab in `sessionStorage`.

---

## 8. All 20 enhancements — build checklist

1. Collapse status/dupe/stale into a single meta line ✅ (§4)
2. Promote value to size-md with caption ✅ (§1, §4)
3. Colorless monoline source glyphs ✅ (§3)
4. Real Anarix + Aan brand marks ✅ (§3)
5. Meetings right-side sheet drill-in ✅ (§5)
6. Initials-only attendee chips ✅ (§5)
7. Task CTA = action verb ✅ (§5)
8. Share menu in Meetings ✅ (§5)
9. Drop Digest tab ✅ (§2)
10. Remove Source health strip ✅ (§2)
11. Remove `?` hint ✅ (§2)
12. `<UndoToast />` with 30s progress ring ✅ (§4)
13. Wider container + taller rows ✅ (§2, §4)
14. First-person Aan voice sweep ✅ (§2)
15. Persist sort per tab ✅ (§7)
16. Stale moves to meta line, neutral tone ✅ (§4)
17. 28 seeded scenarios + 4 meetings + 6 questions ✅ (§6)
18. Drop bucket "N decisions" tail count ✅ (§2)
19. MeetingWorkspace uses the right-side Sheet primitive ✅ (§5)
20. Overload banner rephrased to "I'm holding N more small items — [Show all]" ✅ (in `OverloadBanner.tsx`)

---

## Technical details

- New files: `src/components/branding/AnarixMark.tsx`, `src/components/branding/AanMark.tsx`, `src/components/actions/UndoToast.tsx`.
- Deleted: `src/components/actions/SourceStatusStrip.tsx`.
- `Decision` type gains optional `insightDetail?: string` for the expanded Insight section.
- `MeetingWorkspace` rendered inside shadcn `Sheet` (`side="right"`, width `w-[600px] sm:max-w-[600px]`).
- `actionsStore` exposes its existing 30s undo timers to the new `UndoToast` (no logic change).
- `SourceGlyph` colorClass becomes a shared `text-muted-foreground`; kept in registry for future theming.
- Anarix mark: wrapper overrides embedded `.st0`/`.st1` via CSS `fill: currentColor !important` on child `path, polygon`.

---

## Phased build

- **Phase A** — Shell cleanup (drop Digest, Source health, `?` hint), source icon reset, DecisionRow 2-line redesign, mock data rewrite (richer copy + 28 items), first-person sweep.
- **Phase B** — Meetings redesign to Sheet, initials-only attendees, action-verb CTAs, share menus, 2 new bundles, richer task copy.
- **Phase C** — UndoToast, sort persistence, overload banner rephrase, expanded-panel 5-section restructure, final QA.

