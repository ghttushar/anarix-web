// Aan automation policies — user-approved rules that let Aan execute
// hands-free within specified guardrails.
export interface Policy {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  scenarioId: string; // which scenario type it automates
  guardrails: string[];
  timesTriggered: number;
  lastTriggered?: string;
}

export const POLICIES: Policy[] = [
  {
    id: "p1",
    name: "Peak-hour budget top-up",
    description: "Auto-approve budget increases up to +$50/day when a campaign exceeds 85% of daily budget before 4 PM and its 7-day ROAS is above 3.5x.",
    enabled: true,
    scenarioId: "budget-optimization",
    guardrails: ["Max +$50 per action", "Max +$200 per campaign per day", "ROAS floor: 3.5x", "Auto-revert at midnight"],
    timesTriggered: 12,
    lastTriggered: "Today, 11:20 AM",
  },
  {
    id: "p2",
    name: "Buy Box price-match (small deltas)",
    description: "Auto-approve competitor price match when gap is ≤ $0.50 AND resulting margin stays above configured price floor.",
    enabled: true,
    scenarioId: "buybox",
    guardrails: ["Max delta $0.50", "Never breach price floor", "Skip if margin < 18%"],
    timesTriggered: 34,
    lastTriggered: "Today, 8:47 AM",
  },
  {
    id: "p3",
    name: "Overnight pause 2–5 AM PT",
    description: "Keep the overnight-pause daypart schedule active on all SP campaigns tagged 'always-on'.",
    enabled: true,
    scenarioId: "daypart",
    guardrails: ["Scope: 'always-on' tag only", "Excludes event campaigns"],
    timesTriggered: 47,
    lastTriggered: "Today, 2:00 AM",
  },
  {
    id: "p4",
    name: "Listing suppression auto-fix",
    description: "Auto-apply image compliance fixes when a compliant gallery image is available. Fall back to opening a support case.",
    enabled: false,
    scenarioId: "suppression",
    guardrails: ["Requires compliant gallery image", "Never edits copy/title"],
    timesTriggered: 0,
  },
];
