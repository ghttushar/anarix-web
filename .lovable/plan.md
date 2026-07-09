## /alerts redesign v6

### Routing
- Add routes `/alerts/stack` and `/alerts/grid` in `src/App.tsx`. `/alerts` redirects to the last-used view (sessionStorage) or `/alerts/stack`.
- `Alerts.tsx` reads `viewMode` from the URL (`useParams`), replaces the `useViewMode` hook. `ViewSwitcher` navigates via `useNavigate` instead of setting state.

### Global action row (both views, everywhere)
- Reduce to exactly TWO controls: `[Action ▾]` split button + `[Dismiss]`.
- Remove the standalone "Write custom action / Discuss with Aan" outline button from `ActionChoiceRow`. Keep "Write custom action / Discuss with Aan" as the last item inside the dropdown (already there).
- Left-align the cluster in stack rows: replace the fixed right slot with a flex layout where `[value | insight | meta]` share the left, and actions sit in a fixed-width left-aligned zone immediately after meta (not pushed to the right edge). Concretely: remove `justify-start` inside a right-anchored slot; put actions in their own left-aligned column with `ml-0`, and move the chevron + more menu to the far right as separate right-anchored controls.
- Show the same 2-button action cluster in Grid **collapsed** overview (currently only visible when expanded). Place under the insight text, left-aligned, above meta.

### Expanded card redesign (non-meeting alerts)
Rebuild inline expansion for both Stack and Grid into a shared `ExpandedAlertBody` component with clear sections:
1. **Context** — `insightDetail` paragraph.
2. **Why this number** — `valueBasis` in a bordered callout with muted eyebrow.
3. **Evidence** — source chip row: source glyph, `sourceRef.label`, deep-link button, timestamp.
4. **Suggested actions** — vertical list of the alternate actions from `deriveAlternateActions` (each row: verb + hint + inline `Run` button). Custom/Discuss row at the bottom.
5. **Footer meta** — created/updated timestamps, agent name.

Denser than today (target ~1.6× collapsed height, down from ~2×). Remove the duplicate `MoreHorizontal` menu inside expanded body (kept in row header only).

### Expanded meeting card redesign
Rewrite `InlineMeetingWorkspace` to be compact and categorized:
- **Header**: `M` avatar + meeting title + datetime · duration. Small attendee row = initials-only pills (dc, mr, ps) using existing `AttendeePill`. Remove full names + role text + the rounded name chip wrapper.
- **Remove** the 3-stat grid entirely (Tasks / Open / Committed / $15k).
- **Summary + transcript** collapsible unchanged but tightened padding.
- **Action items** section: each row keeps its own independent `[Action ▾] [Dismiss]` cluster (same 2-button cluster as global). Owner shown as initials pill only.
- **Remove the bottom "Mark all completed" clubbed CTA** at the meeting level (per user: keep only independent CTAs per action item).
- Shorter overall vertical footprint (tighter paddings, smaller header block).

### Info density
- Non-meeting expanded cards get MORE info (context + why + evidence + suggested actions list) — currently sparse.
- Meeting expanded cards get LESS chrome (remove stat grid, remove bulk CTA, initials-only attendees).

### Consistency / polish sweep
- Uniform section eyebrows: `text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground`.
- Uniform button heights: `h-8` inside expanded bodies, `h-9` in row overview.
- Chevron + more menu column right-anchored consistently across Stack and Grid overview.
- Grid card gains the same overview action cluster as Stack for parity.

### Files
- edit `src/App.tsx` — routes + redirect
- edit `src/pages/Alerts.tsx` — URL-driven view mode
- edit `src/components/actions/ViewSwitcher.tsx` — navigate on change
- edit `src/components/actions/ActionChoiceRow.tsx` — remove standalone custom button
- edit `src/components/actions/StackRow.tsx` — left-align actions, use shared expanded body
- edit `src/components/actions/GridCard.tsx` — overview actions, use shared expanded body
- new `src/components/actions/ExpandedAlertBody.tsx` — shared categorized expanded view
- rewrite `src/components/actions/InlineMeetingWorkspace.tsx` — compact, no stats, no bulk CTA, initials-only attendees
- edit `src/components/actions/AttendeePill.tsx` if needed to guarantee initials-only mode

No data / business-logic changes; presentation only.
