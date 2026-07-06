
## Goals
Reduce cognitive load on the Aan Inbox, restore Insights access in the AppTaskbar as a fallback when the Floating Action Island is off, and give every right-side panel state its own URL so it can be exported to Figma via html-to-figma.

## 1. Strip the two top bars from the Aan side panel
- Remove `AanPresenceStrip` from `AanInboxPanel.tsx` (the "AAN · Scanning 4,231 SKUs · LIVE" bar).
- Remove the `INPUT → VALUE → ACTION → EXECUTION → FULFILLMENT` lifecycle stepper from `ExecutionArtifact.tsx` header.
- Both concepts are preserved elsewhere: live-mode toggle stays in the Trigger Console; lifecycle is still implicit in per-step status chips inside the artifact body.

## 2. Insights + island actions in the AppTaskbar
- Add a compact utility cluster to the right side of `AppTaskbar`: Insights, Aan Inbox (with unread badge), Refresh, Export, Theme toggle, Screenshot. Icon-only, tooltips on hover, same handlers the Floating Action Island uses today.
- These render always (not only when the island is off) so the taskbar becomes the canonical entry, and the island can be dismissed without losing access.
- Insights button opens the existing `InsightsPanel` via `setDataPanel("insights")`; it currently has no trigger outside the island.

## 3. Simplify the Aan Inbox (reduce cognitive load)
Redesign `AanInboxPanel` around grouped, collapsible sections with progressive disclosure inside each:

Sections (collapsed by default except the first two):
1. **Morning briefing** — expanded. Big type headline + 3-item at-a-glance. Adds a nested collapsed sub-tab **"Action items from your last meeting"** (uses `mockAanFeed` meeting summary data, otherwise a seeded 3-item list).
2. **Needs your approval** — expanded. Shows top 2 cards in full, remaining behind a "Show N more" link.
3. **Executing now** — collapsed, count in header.
4. **Recently fulfilled** — collapsed, count in header.
5. **Watching** — collapsed, low-priority FYI items.

Card-level changes to reduce density:
- Larger base font (13px → 14px body, 15px title).
- More vertical padding (`py-3` → `py-4`), thinner dividers.
- Hide metadata chips (confidence %, domain tag) behind a "Details" toggle on each card.
- Quick-approve stays inline; secondary actions collapse into a `⋯` menu.

## 4. Dedicated `/panels/*` routes for every right-side panel
New route tree so each panel state has a shareable URL and renders as a standalone page (still using the panel component, wrapped in a minimal shell for Figma export):

```
/panels/aan-inbox                        → full inbox
/panels/aan-inbox/:scenarioId            → inbox with card expanded
/panels/aan-inbox/:scenarioId/details    → artifact viewer for that scenario
/panels/aan-inbox/morning                → morning briefing only
/panels/aan-inbox/meeting-actions        → action-items-from-last-meeting card
/panels/insights                         → InsightsPanel standalone
/panels/insights/:insightId              → InsightsPanel with card open
/panels/notifications                    → NotificationsPanel standalone
```

Implementation:
- New `src/pages/panels/PanelRoute.tsx` — reads params, wraps the existing panel component in a fixed-width figma-friendly frame (`w-[420px]`, plain background, no app chrome).
- Register routes in `App.tsx` under a new `<Route path="/panels/*">` group, outside `AppLayout`.
- Existing in-app opens (island / taskbar) keep using `setDataPanel` — no behavior change. The `/panels/*` URLs are additive for Figma export and deep links.

## 5. Persist the "independent URL" rule as project memory
Save `mem://architecture/routing/independent-panel-urls` and add a one-liner to `mem://index.md` Core so every future right-side panel, sheet, or artifact gets both an in-app trigger AND a dedicated `/panels/...` route by default.

## Files
- edit: `src/components/aan/autonomous/AanInboxPanel.tsx` (remove strip, add collapsible sections, meeting-actions sub-tab, progressive disclosure)
- edit: `src/components/aan/autonomous/AanInboxCard.tsx` (density, details toggle, ⋯ menu)
- edit: `src/components/aan/autonomous/ExecutionArtifact.tsx` (remove lifecycle stepper)
- delete usage of: `src/components/aan/autonomous/AanPresenceStrip.tsx` (file kept for Trigger Console)
- edit: `src/components/layout/AppTaskbar.tsx` (utility cluster with Insights + island actions)
- new: `src/pages/panels/PanelRoute.tsx` + small index/registry
- edit: `src/App.tsx` (register `/panels/*` routes)
- new memory: `mem://architecture/routing/independent-panel-urls`, updated `mem://index.md`

## Out of scope
No changes to data, scenarios, execution logic, or the Aan chat surface itself.
