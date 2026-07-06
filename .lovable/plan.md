## Redesign `AanEventCard` for clearer hierarchy

Scope: `src/components/aan/autonomous/AanInboxCard.tsx` only. No logic, routing, or data changes.

### Problem
Currently Insight / Value / Action all render at the same weight (`text-[13px]` body, `line-clamp-2`, 86px label column). The Accept/Reject buttons visually dominate. Value (the money/impact) is the least legible piece even though it's the reason to act.

### New hierarchy (top → bottom)

```text
┌─────────────────────────────────────────────────────┐
│ • OVERNIGHT · Advertising                    Auto   │  meta strip (unchanged)
│                                                     │
│ Sponsored Brands CTR dropped 38%                    │  INSIGHT — title, 15px semibold
│ Last 6h vs 7-day baseline                           │  subtitle, 12px muted
│                                                     │
│ ┌───────────────────────────────────────────────┐   │
│ │ VALUE                                         │   │  VALUE — highlighted band
│ │ +$1,240/wk recoverable  ·  -0.6 ACOS pts     │   │  bg-primary/5, left accent bar
│ └───────────────────────────────────────────────┘   │  17px semibold foreground number
│                                                     │
│ ACTION  Pause 3 keywords, shift budget to SP-Brand  │  ACTION — 12px label + 13px text
│                                                     │
│ ─────────────────────────────────────────────────── │
│ [Accept] [Reject]                       View more → │  footer (buttons de-emphasized)
└─────────────────────────────────────────────────────┘
```

### Concrete changes in `AanInboxCard.tsx`

1. **Drop the 3-row `Zone` grid.** Replace with three distinct blocks so each has its own visual treatment.

2. **Insight block**
   - Title `text-[15px] font-semibold text-foreground leading-snug`
   - Subtitle on its own line, `text-[12px] text-muted-foreground`
   - Remove `line-clamp-2` on the title; clamp subtitle to 2.

3. **Value block (the highlight)**
   - Wrapper: `mt-3 rounded-md border-l-2 border-primary bg-primary/[0.04] px-3 py-2`
   - Label: `text-[9.5px] uppercase tracking-wider font-semibold text-primary`
   - Value text: `text-[14px] font-semibold text-foreground` (numbers stay black per the table-first rule)
   - For fulfilled/rejected states, swap accent to `border-success` / muted and keep the same shape so the eye lands in the same place.

4. **Action block**
   - Inline label + text on one row: `<span class="text-[9.5px] uppercase tracking-wider font-semibold text-muted-foreground mr-2">Action</span><span class="text-[13px] text-foreground/80">…</span>`
   - No background — action is instruction, not the payoff.

5. **Footer / buttons — de-emphasize**
   - Keep Accept as primary but shrink weight: `h-7 px-2.5 text-[11.5px]` (already), remove any implicit shadow, ensure it's not full-width.
   - Reject stays `variant="ghost"`.
   - Add `text-muted-foreground` to the divider line so buttons don't compete with the value band.

6. **Verification state (fulfilled)** — reuse the Value band shape with success accent so completed cards still read as "here's what you got" rather than a plain line of text.

7. **Delete** the `Zone` helper component (no longer used).

### What stays the same
- Severity left border, meeting-blue override, meta strip, icons, Auto/Executing pills.
- All props, event handlers, `approve`/`reject` calls, `onOpenDetails` behavior.
- No changes to `Alerts.tsx`, context, or any other file.

### Verification
- Visual check on `/alerts` at desktop viewport: Value band should be the first thing the eye lands on after the title; buttons should feel secondary.
- Fulfilled and rejected cards still render without layout shift.
- No TS/type changes.