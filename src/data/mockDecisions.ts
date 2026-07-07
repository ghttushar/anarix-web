// Mock Decision seed data for the new Action Items v2 surface.
// Each Decision names its dollar impact + a single verb the user takes.
// Items are chosen to demonstrate the full source mix (Anarix / Aan /
// Meeting / Slack / Teams / Email) and the full value-kind mix
// (gain / cost / at_risk / info).

import type { DecisionSource } from "@/lib/decisions/sourceRegistry";
import type { ValueKind, Cadence } from "@/lib/decisions/valueFormat";

export type DecisionStatus =
  | "open"
  | "with_aan"
  | "in_flight"
  | "completed"
  | "rejected"
  | "snoozed"
  | "expired";

export type DecisionDomain =
  | "campaign"
  | "retail"
  | "profitability"
  | "inventory"
  | "cs"
  | "buyer";

export interface DecisionEvidence {
  kind: "delta" | "sparkline" | "table";
  /** For delta: [beforeLabel, before, afterLabel, after]. */
  delta?: { beforeLabel: string; before: number; afterLabel: string; after: number; unit?: string };
  /** For sparkline: series of numbers, latest last. */
  sparkline?: { series: number[]; label: string };
  /** For table: up to 4 rows × 3 cols. */
  table?: { headers: string[]; rows: string[][] };
}

export interface DecisionStep {
  label: string;
  etaSec: number;
}

export interface Decision {
  id: string;
  source: DecisionSource;
  sourceRef: { label: string; url?: string; ts: number };
  valueCents: number; // signed magnitude in cents; 0 only for `info`
  valueKind: ValueKind;
  cadence?: Cadence;
  valueBasis: string; // required — short "how we got this number"
  insight: string; // ≤ 90 chars, one sentence
  actionVerb: string; // "Reallocate", "Pause", "Reply"...
  domain: DecisionDomain;
  severity: "critical" | "opportunity" | "fyi";
  status: DecisionStatus;
  createdAt: number;
  updatedAt: number;
  snoozedUntil?: number;
  /** Set when Aan started executing (for live ETA). */
  startedAt?: number;
  /** Items that share a `dupeKey` within ~6h collapse into one row with a ×N chip. */
  dupeKey?: string;
  meetingRef?: { bundleId: string; title: string; excerpt: string };
  evidence?: DecisionEvidence;
  steps: DecisionStep[];
  deepLink?: { label: string; href: string };
}

const HOUR = 60 * 60 * 1000;
const MIN = 60 * 1000;
const now = Date.now();

export const MOCK_DECISIONS: Decision[] = [
  {
    id: "d-realloc-winter",
    source: "anarix",
    sourceRef: { label: "Campaign monitor · Winter Push", ts: now - 45 * MIN },
    valueCents: 482_000,
    valueKind: "gain",
    cadence: "monthly",
    valueBasis: "Reclaims 22% wasted spend at current ROAS ceiling on Launch S4.",
    insight: "Winter Push is 41% over TACoS target; Launch S4 is under-pacing efficiency.",
    actionVerb: "Reallocate",
    domain: "campaign",
    severity: "critical",
    status: "open",
    createdAt: now - 45 * MIN,
    updatedAt: now - 45 * MIN,
    evidence: {
      kind: "delta",
      delta: { beforeLabel: "Winter TACoS", before: 25.4, afterLabel: "Launch S4 TACoS", after: 12.1, unit: "%" },
    },
    steps: [
      { label: "Pause Winter Push", etaSec: 4 },
      { label: "Shift $2.4k/day to Launch S4", etaSec: 6 },
      { label: "Set 72h watch alert", etaSec: 2 },
    ],
    deepLink: { label: "Open in Campaign Manager", href: "/advertising/campaigns" },
  },
  {
    id: "d-relist-skux",
    source: "meeting",
    sourceRef: { label: "Staples QBR · Q4 Planning", ts: now - 2 * HOUR },
    valueCents: 1_200_000,
    valueKind: "at_risk",
    valueBasis: "SKU-X ran $12k/mo before suppression on Oct 12; buyer wants it back on shelf.",
    insight: "SKU-X still suppressed on Staples portal — buyer flagged in QBR.",
    actionVerb: "Relist",
    domain: "retail",
    severity: "critical",
    status: "open",
    createdAt: now - 2 * HOUR,
    updatedAt: now - 2 * HOUR,
    meetingRef: {
      bundleId: "mtg-staples-qbr",
      title: "Staples QBR — Q4 Planning",
      excerpt: "Dorothy: Buyer wants SKU-X back on shelf before Friday. Mike: Portal ticket #48291 open — needs compliance docs.",
    },
    evidence: {
      kind: "delta",
      delta: { beforeLabel: "Suppressed for", before: 26, afterLabel: "Days lost revenue", after: 26, unit: " days" },
    },
    steps: [
      { label: "Attach compliance docs to ticket #48291", etaSec: 8 },
      { label: "Confirm portal push with Mike", etaSec: 4 },
    ],
    deepLink: { label: "Open Staples portal", href: "#" },
  },
  {
    id: "d-refund-cs",
    source: "slack",
    sourceRef: { label: "#cs-urgent · @maria", ts: now - 18 * MIN },
    valueCents: 124_000,
    valueKind: "cost",
    cadence: "one_time",
    valueBasis: "3 refund claims from same batch; approve now or escalate to buyer complaint.",
    insight: "Maria escalated 3 refund claims from batch #B-2214 in #cs-urgent.",
    actionVerb: "Approve refunds",
    domain: "cs",
    severity: "critical",
    status: "open",
    createdAt: now - 18 * MIN,
    updatedAt: now - 18 * MIN,
    dupeKey: "cs-refund-batch-B2214",
    evidence: {
      kind: "table",
      table: {
        headers: ["Order", "Reason", "Amount"],
        rows: [
          ["#20244-A", "Damaged in transit", "$412"],
          ["#20251-C", "Damaged in transit", "$389"],
          ["#20258-B", "Damaged in transit", "$439"],
        ],
      },
    },
    steps: [
      { label: "Refund 3 orders", etaSec: 6 },
      { label: "Notify Maria in #cs-urgent", etaSec: 2 },
    ],
  },
  // Duplicate signal for the same batch — same dupeKey, arrives from anarix
  {
    id: "d-refund-cs-dup",
    source: "anarix",
    sourceRef: { label: "CS monitor · batch #B-2214", ts: now - 14 * MIN },
    valueCents: 124_000,
    valueKind: "cost",
    cadence: "one_time",
    valueBasis: "Anarix CS monitor flagged the same batch independently.",
    insight: "CS monitor flagged batch #B-2214 (same as Slack escalation).",
    actionVerb: "Approve refunds",
    domain: "cs",
    severity: "critical",
    status: "open",
    createdAt: now - 14 * MIN,
    updatedAt: now - 14 * MIN,
    dupeKey: "cs-refund-batch-B2214",
    steps: [
      { label: "Refund 3 orders", etaSec: 6 },
      { label: "Notify Maria in #cs-urgent", etaSec: 2 },
    ],
  },
  {
    id: "d-pause-kw",
    source: "aan",
    sourceRef: { label: "Aan — nightly keyword sweep", ts: now - 3 * HOUR },
    valueCents: 61_000,
    valueKind: "gain",
    cadence: "monthly",
    valueBasis: "3 keywords bleeding ACOS > 90% with < 4 conversions over 21 days.",
    insight: "3 keywords on Evergreen are bleeding ACOS > 90% with almost no conversions.",
    actionVerb: "Pause keywords",
    domain: "campaign",
    severity: "opportunity",
    status: "open",
    createdAt: now - 3 * HOUR,
    updatedAt: now - 3 * HOUR,
    evidence: {
      kind: "table",
      table: {
        headers: ["Keyword", "ACOS", "Conv"],
        rows: [
          ["\"mount for tv\"", "112%", "2"],
          ["\"tv mount full motion\"", "98%", "3"],
          ["\"corner tv mount\"", "94%", "1"],
        ],
      },
    },
    steps: [
      { label: "Add 3 negatives", etaSec: 4 },
      { label: "Pause matching ad-group targets", etaSec: 3 },
    ],
    deepLink: { label: "Open Evergreen", href: "/advertising/campaigns" },
  },
  {
    id: "d-buyer-memo",
    source: "email",
    sourceRef: { label: "buyer@staples.com · re: pricing", ts: now - 4 * HOUR },
    valueCents: 0,
    valueKind: "info",
    valueBasis: "Buyer asked for a competitor pricing memo before Friday sync.",
    insight: "Staples buyer wants a pricing memo across 20 hero SKUs before Friday.",
    actionVerb: "Draft memo",
    domain: "buyer",
    severity: "opportunity",
    status: "open",
    createdAt: now - 4 * HOUR,
    updatedAt: now - 4 * HOUR,
    steps: [
      { label: "Pull last-14-day competitor pricing", etaSec: 20 },
      { label: "Compose memo (Aan drafts)", etaSec: 14 },
      { label: "Send for your review", etaSec: 2 },
    ],
  },
  {
    id: "d-inventory-riser",
    source: "anarix",
    sourceRef: { label: "Inventory monitor · SKU-B12", ts: now - 6 * HOUR },
    valueCents: 340_000,
    valueKind: "at_risk",
    valueBasis: "17 days of cover left at current velocity; lead time is 21 days.",
    insight: "SKU-B12 will stock out in 17 days; lead time is 21.",
    actionVerb: "Reorder now",
    domain: "inventory",
    severity: "critical",
    status: "open",
    createdAt: now - 6 * HOUR,
    updatedAt: now - 6 * HOUR,
    evidence: {
      kind: "delta",
      delta: { beforeLabel: "Days cover", before: 17, afterLabel: "Lead time", after: 21, unit: " days" },
    },
    steps: [
      { label: "Raise PO for 800 units", etaSec: 10 },
      { label: "Notify supply chain", etaSec: 2 },
    ],
  },
  {
    id: "d-teams-forecast",
    source: "teams",
    sourceRef: { label: "Teams · Q4 Forecast thread", ts: now - 5 * HOUR },
    valueCents: 220_000,
    valueKind: "gain",
    cadence: "monthly",
    valueBasis: "Dorothy asked for a forecast refresh; unlocks buyer commit for 220k/mo tier.",
    insight: "Dorothy needs a refreshed Q4 unit forecast to lock the buyer commit.",
    actionVerb: "Send forecast",
    domain: "profitability",
    severity: "opportunity",
    status: "open",
    createdAt: now - 5 * HOUR,
    updatedAt: now - 5 * HOUR,
    steps: [
      { label: "Aan pulls units × price × velocity", etaSec: 12 },
      { label: "Post to Teams thread", etaSec: 2 },
    ],
  },
  // In-flight (Aan is executing an approved item)
  {
    id: "d-daypart-tighten",
    source: "aan",
    sourceRef: { label: "Aan — day-parting", ts: now - 90 * MIN },
    valueCents: 180_000,
    valueKind: "gain",
    cadence: "monthly",
    valueBasis: "Cuts spend after 10pm on 8 campaigns; preserves 96% of conversions.",
    insight: "Tightening day-parting after 10pm on 8 Amazon campaigns.",
    actionVerb: "In flight",
    domain: "campaign",
    severity: "opportunity",
    status: "in_flight",
    createdAt: now - 90 * MIN,
    updatedAt: now - 4 * MIN,
    startedAt: now - 8 * 1000, // 8s ago — puts us in the middle of step 2
    steps: [
      { label: "Snapshot current schedules", etaSec: 6 },
      { label: "Push new bid modifiers", etaSec: 14 },
      { label: "Verify 24h delta", etaSec: 8 },
    ],
  },
  // Handled — completed
  {
    id: "d-budget-auto",
    source: "aan",
    sourceRef: { label: "Aan — budget rule (policy p1)", ts: now - 8 * HOUR },
    valueCents: 42_000,
    valueKind: "gain",
    cadence: "monthly",
    valueBasis: "Auto-approved under budget policy p1.",
    insight: "Rebalanced 3 campaign budgets to hit daily pacing.",
    actionVerb: "Rebalance",
    domain: "campaign",
    severity: "fyi",
    status: "completed",
    createdAt: now - 8 * HOUR,
    updatedAt: now - 7 * HOUR,
    steps: [{ label: "Shift $600/day across 3 campaigns", etaSec: 4 }],
  },
  // Handled — rejected
  {
    id: "d-rejected-bid-lift",
    source: "aan",
    sourceRef: { label: "Aan — bid ceiling proposal", ts: now - 10 * HOUR },
    valueCents: 88_000,
    valueKind: "gain",
    cadence: "monthly",
    valueBasis: "Would lift placement modifier +85% on 3 hero SKUs.",
    insight: "Proposed lifting bid ceiling on 3 hero SKUs — you passed.",
    actionVerb: "Lift ceiling",
    domain: "campaign",
    severity: "opportunity",
    status: "rejected",
    createdAt: now - 10 * HOUR,
    updatedAt: now - 9 * HOUR,
    steps: [{ label: "Apply +85% modifier", etaSec: 4 }],
  },
  // Handled — expired
  {
    id: "d-expired-flash",
    source: "anarix",
    sourceRef: { label: "Flash promo · window closed", ts: now - 26 * HOUR },
    valueCents: 32_000,
    valueKind: "gain",
    cadence: "one_time",
    valueBasis: "24h flash promo window closed before you decided.",
    insight: "Flash promo window closed before you had a chance to weigh in.",
    actionVerb: "Enroll",
    domain: "campaign",
    severity: "fyi",
    status: "expired",
    createdAt: now - 30 * HOUR,
    updatedAt: now - 6 * HOUR,
    steps: [{ label: "Enroll in flash promo", etaSec: 4 }],
  },
];

// A big pile of small stuff that goes into the Digest tab. Illustrates
// the "1000 alerts/day" case: many items, each small, rolled up.
export interface DigestItem {
  id: string;
  source: DecisionSource;
  ts: number;
  what: string;
  valueCents: number;
  valueKind: ValueKind;
}

function d(id: string, source: DecisionSource, ago: number, what: string, cents: number, kind: ValueKind): DigestItem {
  return { id, source, ts: now - ago, what, valueCents: cents, valueKind: kind };
}

export const MOCK_DIGEST_ITEMS: DigestItem[] = [
  d("g-1", "aan", 30 * MIN, "Bid tweak · SKU-B44 · +8%", 1200, "gain"),
  d("g-2", "aan", 40 * MIN, "Bid tweak · SKU-C09 · −4%", 900, "gain"),
  d("g-3", "anarix", 50 * MIN, "Negative added · \"cheap tv mount\"", 1800, "gain"),
  d("g-4", "aan", 55 * MIN, "Placement cut · rest-of-search on SKU-A02", 2100, "gain"),
  d("g-5", "aan", 65 * MIN, "Budget shift · $60 to Series 4", 800, "gain"),
  d("g-6", "aan", 70 * MIN, "Bid tweak · SKU-B12 · +6%", 1400, "gain"),
  d("g-7", "aan", 80 * MIN, "Bid tweak · SKU-B22 · +3%", 700, "gain"),
  d("g-8", "anarix", 95 * MIN, "Negative added · \"broken bracket\"", 2200, "gain"),
  d("g-9", "aan", 110 * MIN, "Bid tweak · SKU-D01 · −7%", 1100, "gain"),
  d("g-10", "aan", 130 * MIN, "Placement cut · top-of-search on SKU-B44", 2900, "gain"),
];
