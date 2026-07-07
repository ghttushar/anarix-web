// Meeting bundles (Flow B) — a meeting happens, Aan produces a bundle
// of action items. Each task carries the same value/insight/action grammar
// as a Decision, but lives inside a bundle and uses completion-language
// (Mark completed / Not completed / You take care of it).

import type { ValueKind, Cadence } from "@/lib/decisions/valueFormat";
import type { DecisionDomain } from "@/data/mockDecisions";

export type MeetingTaskStatus = "open" | "completed" | "not_completed" | "with_aan";

export interface MeetingAttendee {
  name: string;
  role?: string;
}

export interface MeetingTask {
  id: string;
  bundleId: string;
  valueCents: number;
  valueKind: ValueKind;
  cadence?: Cadence;
  valueBasis: string;
  insight: string;
  actionVerb: string;
  owner?: string;
  domain: DecisionDomain;
  status: MeetingTaskStatus;
  transcriptExcerpt?: string;
  createdAt: number;
  updatedAt: number;
}

export interface MeetingBundle {
  id: string;
  title: string;
  ts: number;             // meeting start (unix ms)
  durationMin: number;
  attendees: MeetingAttendee[];
  summary: string;        // 1-2 sentences, Aan-written
  transcriptExcerpt: string;
  taskIds: string[];      // ordered
}

const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const now = Date.now();

export const MOCK_MEETING_BUNDLES: MeetingBundle[] = [
  {
    id: "mtg-staples-qbr",
    title: "Staples QBR — Q4 Planning",
    ts: now - 2 * HOUR,
    durationMin: 47,
    attendees: [
      { name: "Dorothy Chen", role: "Staples buyer" },
      { name: "Mike Reyes", role: "Portal ops" },
      { name: "Priya Shah", role: "Anarix account lead" },
      { name: "You Own", role: "You" },
    ],
    summary:
      "Buyer confirmed Q4 hero-SKU commitment and asked us to relist SKU-X before Friday. Pricing memo and forecast refresh due same week.",
    transcriptExcerpt:
      "Dorothy: We're holding the Q4 tier if you can get SKU-X back on shelf before Friday.\nMike: Portal ticket #48291 is open — needs compliance docs from your side.\nPriya: We'll send a competitor pricing memo across the 20 hero SKUs before EOW.\nDorothy: Also want the refreshed forecast so we can lock the buyer commit.",
    taskIds: ["mt-staples-1", "mt-staples-2", "mt-staples-3", "mt-staples-4", "mt-staples-5"],
  },
  {
    id: "mtg-weekly-perf",
    title: "Weekly Performance Review",
    ts: now - 26 * HOUR,
    durationMin: 32,
    attendees: [
      { name: "Priya Shah", role: "Anarix account lead" },
      { name: "Rahul Menon", role: "Growth" },
      { name: "You Own", role: "You" },
    ],
    summary:
      "Winter Push efficiency has slipped 3 weeks running; team aligned on reallocating to Launch S4 and tightening evergreen day-parting.",
    transcriptExcerpt:
      "Priya: Winter Push TACoS is 41% over target — three weeks in a row.\nRahul: Launch S4 has headroom, ROAS ceiling is 4.1×.\nYou: Let's shift budget and tighten day-parting on Evergreen.",
    taskIds: ["mt-perf-1", "mt-perf-2"],
  },
];

export const MOCK_MEETING_TASKS: MeetingTask[] = [
  // Staples QBR tasks
  {
    id: "mt-staples-1",
    bundleId: "mtg-staples-qbr",
    valueCents: 1_200_000,
    valueKind: "at_risk",
    valueBasis: "SKU-X ran $12k/mo before suppression on Oct 12; buyer wants it back on shelf.",
    insight: "Relist SKU-X on Staples before Friday.",
    actionVerb: "Relist SKU-X",
    owner: "Mike Reyes",
    domain: "retail",
    status: "open",
    transcriptExcerpt: "Dorothy: We're holding the Q4 tier if you can get SKU-X back on shelf before Friday.",
    createdAt: now - 2 * HOUR,
    updatedAt: now - 2 * HOUR,
  },
  {
    id: "mt-staples-2",
    bundleId: "mtg-staples-qbr",
    valueCents: 0,
    valueKind: "info",
    valueBasis: "Buyer asked for competitor pricing memo across 20 hero SKUs by EOW.",
    insight: "Draft competitor pricing memo (20 hero SKUs).",
    actionVerb: "Draft memo",
    owner: "You Own",
    domain: "buyer",
    status: "open",
    transcriptExcerpt: "Priya: We'll send a competitor pricing memo across the 20 hero SKUs before EOW.",
    createdAt: now - 2 * HOUR,
    updatedAt: now - 2 * HOUR,
  },
  {
    id: "mt-staples-3",
    bundleId: "mtg-staples-qbr",
    valueCents: 220_000,
    valueKind: "gain",
    cadence: "monthly",
    valueBasis: "Unlocks Q4 buyer commit at the 220k/mo tier once forecast is refreshed.",
    insight: "Send Q4 unit forecast refresh to Dorothy.",
    actionVerb: "Send forecast",
    owner: "Priya Shah",
    domain: "profitability",
    status: "open",
    createdAt: now - 2 * HOUR,
    updatedAt: now - 2 * HOUR,
  },
  {
    id: "mt-staples-4",
    bundleId: "mtg-staples-qbr",
    valueCents: 48_000,
    valueKind: "cost",
    cadence: "one_time",
    valueBasis: "Compliance docs pack for portal ticket #48291.",
    insight: "Attach compliance docs to portal ticket #48291.",
    actionVerb: "Attach docs",
    owner: "Mike Reyes",
    domain: "retail",
    status: "completed",
    createdAt: now - 2 * HOUR,
    updatedAt: now - 30 * MIN,
  },
  {
    id: "mt-staples-5",
    bundleId: "mtg-staples-qbr",
    valueCents: 15_000,
    valueKind: "info",
    valueBasis: "Recap and next steps for internal circulation.",
    insight: "Circulate meeting recap to internal Slack.",
    actionVerb: "Circulate recap",
    owner: "You Own",
    domain: "cs",
    status: "open",
    createdAt: now - 2 * HOUR,
    updatedAt: now - 2 * HOUR,
  },
  // Weekly perf tasks
  {
    id: "mt-perf-1",
    bundleId: "mtg-weekly-perf",
    valueCents: 482_000,
    valueKind: "gain",
    cadence: "monthly",
    valueBasis: "Reclaims 22% wasted spend on Winter Push; Launch S4 has 4.1× ROAS ceiling.",
    insight: "Reallocate Winter Push budget → Launch S4.",
    actionVerb: "Reallocate",
    owner: "You Own",
    domain: "campaign",
    status: "with_aan",
    createdAt: now - 26 * HOUR,
    updatedAt: now - 5 * HOUR,
  },
  {
    id: "mt-perf-2",
    bundleId: "mtg-weekly-perf",
    valueCents: 180_000,
    valueKind: "gain",
    cadence: "monthly",
    valueBasis: "Cuts post-10pm spend on 8 evergreen campaigns; preserves 96% of conversions.",
    insight: "Tighten Evergreen day-parting after 10pm.",
    actionVerb: "Tighten day-parting",
    owner: "Rahul Menon",
    domain: "campaign",
    status: "open",
    createdAt: now - 26 * HOUR,
    updatedAt: now - 26 * HOUR,
  },
];
