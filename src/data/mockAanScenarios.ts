// Aan autonomous scenarios — all 10 automation templates plus morning briefing,
// meeting summary, and workspace search. Every scenario carries a full lifecycle
// payload (Input → Value → Action → Execution → Fulfillment) so the mockup can
// render a complete story without any backend.

export type ScenarioSeverity = "critical" | "opportunity" | "fyi";
export type ScenarioDomain = "campaign" | "retail" | "workspace" | "briefing";

export interface EvidenceRow {
  label: string;
  value: string;
  delta?: string;
  deltaTone?: "positive" | "negative" | "neutral";
}

export interface ExecutionStep {
  label: string;
  detail?: string;
  durationMs: number;
}

export interface DiffField {
  field: string;
  before: string;
  after: string;
}

export interface ScenarioTemplate {
  id: string;
  domain: ScenarioDomain;
  severity: ScenarioSeverity;
  icon: string; // lucide name
  title: string;
  subtitle: string;
  marketplace: string;
  impact: string; // e.g. "+$180 projected sales"
  confidence: number; // 0-100
  // Input
  signal: string;
  evidence: EvidenceRow[];
  sources: string[]; // ["Amazon Ads API", "PowerBI", "Slack"]
  // Value
  reasoning: string[];
  workspaceContext?: {
    kind: "slack" | "email" | "meeting" | "doc";
    who: string;
    when: string;
    quote: string;
  };
  // Action
  recommendation: string;
  actionLabel: string; // "Approve +$45 budget"
  editable?: { label: string; kind: "number" | "text" | "select"; current: string; options?: string[] };
  // Execution
  steps: ExecutionStep[];
  // Fulfillment
  diff: DiffField[];
  fulfillmentNote: string;
}

export const SCENARIOS: ScenarioTemplate[] = [
  {
    id: "budget-optimization",
    domain: "campaign",
    severity: "opportunity",
    icon: "TrendingUp",
    title: "Budget approaching cap on SP | Bamboo Queen",
    subtitle: "90% of daily budget spent by 2:00 PM",
    marketplace: "Amazon US",
    impact: "+$180 projected sales",
    confidence: 92,
    signal: "Campaign 'SP | Bamboo Queen' has consumed $135 of $150 daily budget (90%) with 4 hours of peak traffic remaining.",
    evidence: [
      { label: "Spend so far", value: "$135.00 / $150.00", delta: "90%", deltaTone: "negative" },
      { label: "ROAS today", value: "4.2x", delta: "+18% vs 7d avg", deltaTone: "positive" },
      { label: "Remaining peak hours", value: "4h 12m" },
      { label: "Historical hourly spend (2–6 PM)", value: "~$52" },
    ],
    sources: ["Amazon Ads API", "PowerBI"],
    reasoning: [
      "Campaign is a top-quartile ROAS performer this week (4.2x vs 2.9x account avg).",
      "Peak conversion window (2–6 PM) has been consistent for 14 days.",
      "Projected shortfall of ~$52 in unserved impressions.",
      "Increasing budget by $45 keeps daily ACoS within target while capturing tail traffic.",
    ],
    workspaceContext: {
      kind: "slack",
      who: "#ops-mount-it",
      when: "38 min ago",
      quote: "Dorothy: 'Push Bamboo Queen hard through the weekend if it holds ROAS.'",
    },
    recommendation: "Increase daily budget from $150 to $195 (+$45) for today only.",
    actionLabel: "Approve +$45 budget",
    editable: { label: "New daily budget", kind: "number", current: "195" },
    steps: [
      { label: "Validate ad-account permissions", detail: "OAuth token, scope campaigns:write", durationMs: 400 },
      { label: "Call Amazon Ads API — updateCampaignBudget", detail: "PUT /v2/sp/campaigns/8827441726", durationMs: 900 },
      { label: "Verify budget change reflected", detail: "GET /v2/sp/campaigns/8827441726", durationMs: 500 },
      { label: "Record change in audit log", durationMs: 200 },
    ],
    diff: [
      { field: "Daily budget", before: "$150.00", after: "$195.00" },
      { field: "Scope", before: "Recurring", after: "Today only (auto-revert 12 AM)" },
      { field: "Bid strategy", before: "Dynamic – down only", after: "Dynamic – down only" },
    ],
    fulfillmentNote: "Budget increased. Aan will monitor and auto-revert at midnight local time.",
  },
  {
    id: "keyword-promotion",
    domain: "campaign",
    severity: "opportunity",
    icon: "Sparkles",
    title: "3 search terms ready to graduate from Auto → Manual",
    subtitle: "Sustained conversion in Auto campaign 'SP | Bamboo Auto'",
    marketplace: "Amazon US",
    impact: "+$310/wk projected sales",
    confidence: 88,
    signal: "3 customer search terms in 'SP | Bamboo Auto' converted 6+ times each over 14 days at ACoS < 22%.",
    evidence: [
      { label: "bamboo bed sheets queen", value: "8 orders • ACoS 19%", deltaTone: "positive" },
      { label: "bamboo cooling sheets", value: "6 orders • ACoS 21%", deltaTone: "positive" },
      { label: "bamboo sheet set queen", value: "7 orders • ACoS 18%", deltaTone: "positive" },
      { label: "Suggested bid range", value: "$0.82 – $1.14" },
    ],
    sources: ["Amazon Ads API", "Search Term Report"],
    reasoning: [
      "All 3 terms exceed 5-order threshold with ACoS below 25% target.",
      "Migrating to Manual campaign 'SP | Bamboo Manual' allows independent bidding and negative harvest.",
      "Historical uplift on similar migrations: +23% impressions, +14% orders.",
    ],
    recommendation: "Create Exact match keywords in SP | Bamboo Manual at $0.98 default bid, then add as negative Exact in SP | Bamboo Auto.",
    actionLabel: "Approve keyword promotion",
    editable: { label: "Default bid", kind: "number", current: "0.98" },
    steps: [
      { label: "Create 3 Exact-match keywords in Manual campaign", detail: "POST /v2/sp/keywords (batch)", durationMs: 1100 },
      { label: "Add negative Exact matches in Auto campaign", detail: "POST /v2/sp/negativeKeywords", durationMs: 700 },
      { label: "Verify keyword statuses = ENABLED", durationMs: 500 },
      { label: "Record change in audit log", durationMs: 200 },
    ],
    diff: [
      { field: "New keywords (Manual)", before: "—", after: "3 × Exact @ $0.98" },
      { field: "New negatives (Auto)", before: "—", after: "3 × Negative Exact" },
    ],
    fulfillmentNote: "Migration complete. Aan will report first-week performance in the morning brief.",
  },
  {
    id: "event-campaign",
    domain: "campaign",
    severity: "opportunity",
    icon: "Calendar",
    title: "Prime Day campaign draft ready (12 SKUs)",
    subtitle: "Event window: Jul 8–9 • Draft ready to schedule",
    marketplace: "Amazon US",
    impact: "+$14,200 projected event sales",
    confidence: 84,
    signal: "12 SKUs match Prime Day eligibility: in-stock, ≥ 4.2 star rating, historical event lift > 60%.",
    evidence: [
      { label: "Eligible SKUs", value: "12 (of 47 catalog)" },
      { label: "Projected uplift vs baseline", value: "+3.4x sessions" },
      { label: "Recommended daily budget", value: "$680" },
      { label: "Suggested bid multiplier", value: "+35% top-of-search" },
    ],
    sources: ["Amazon Ads API", "SP-API", "Catalog"],
    reasoning: [
      "All 12 SKUs performed above baseline in the last 3 events (Big Deal Days, Prime Day '25, BF '25).",
      "Recommended budget covers projected 4x traffic without breaching account ACoS target.",
      "Campaign scheduled to auto-pause 11:59 PM PT Jul 9.",
    ],
    recommendation: "Schedule 'SP | Prime Day '26 — Hero SKUs' with 12 SKUs, $680/day budget, Jul 8 00:00 → Jul 9 23:59 PT.",
    actionLabel: "Schedule Prime Day campaign",
    steps: [
      { label: "Create scheduled campaign", detail: "POST /v2/sp/campaigns (state=SCHEDULED)", durationMs: 1200 },
      { label: "Create ad group + 12 product ads", detail: "POST /v2/sp/adGroups + productAds batch", durationMs: 1500 },
      { label: "Apply +35% top-of-search placement modifier", durationMs: 600 },
      { label: "Set auto-pause trigger for Jul 9 23:59 PT", durationMs: 400 },
      { label: "Record change in audit log", durationMs: 200 },
    ],
    diff: [
      { field: "Campaign", before: "—", after: "SP | Prime Day '26 — Hero SKUs" },
      { field: "Status", before: "—", after: "SCHEDULED (Jul 8 00:00 PT)" },
      { field: "SKUs", before: "—", after: "12 product ads" },
      { field: "Daily budget", before: "—", after: "$680.00" },
    ],
    fulfillmentNote: "Prime Day campaign scheduled. Aan will send a pre-event checklist Jul 7 at 9 AM.",
  },
  {
    id: "launch-coverage",
    domain: "campaign",
    severity: "critical",
    icon: "Rocket",
    title: "2 newly-launched SKUs have zero ad coverage",
    subtitle: "MI-311, MI-312 launched 4 days ago • no campaigns attached",
    marketplace: "Amazon US",
    impact: "$840/wk sales opportunity",
    confidence: 79,
    signal: "SKUs MI-311 and MI-312 went live in the catalog 4 days ago and have received 0 sponsored impressions.",
    evidence: [
      { label: "MI-311 organic sessions", value: "42 (last 4d)" },
      { label: "MI-312 organic sessions", value: "38 (last 4d)" },
      { label: "Category avg ad-attributed share", value: "68%" },
      { label: "Similar SKU 30d ad-sales", value: "$3,600" },
    ],
    sources: ["SP-API", "Amazon Ads API", "Anarix catalog"],
    reasoning: [
      "Launch coverage gap is the #1 predictor of slow-ramp SKUs in this category.",
      "Baseline SP campaign covers hero terms while Auto campaign harvests long-tail.",
      "Estimated payback period: 11 days at target ACoS.",
    ],
    workspaceContext: {
      kind: "email",
      who: "Dorothy — Mount-It Product Launches",
      when: "Tue",
      quote: "Please make sure MI-311 and MI-312 are supported from day one.",
    },
    recommendation: "Create 1 SP Manual + 1 SP Auto campaign covering both SKUs, $60/day combined.",
    actionLabel: "Create launch campaigns",
    steps: [
      { label: "Create SP Manual 'Launch — MI-311/312'", durationMs: 1100 },
      { label: "Create SP Auto 'Launch harvest — MI-311/312'", durationMs: 900 },
      { label: "Attach 8 seed keywords (Broad + Exact)", durationMs: 700 },
      { label: "Enable both campaigns", durationMs: 400 },
      { label: "Record change in audit log", durationMs: 200 },
    ],
    diff: [
      { field: "New campaigns", before: "—", after: "2 (Manual + Auto)" },
      { field: "Coverage", before: "0 SKUs", after: "2 SKUs (100%)" },
      { field: "Combined daily budget", before: "—", after: "$60.00" },
    ],
    fulfillmentNote: "Launch coverage restored. First performance snapshot in 48h.",
  },
  {
    id: "loss-making",
    domain: "campaign",
    severity: "critical",
    icon: "TrendingDown",
    title: "SKU MI-088 unprofitable for 12 days straight",
    subtitle: "Net margin −12% • Ad spend still driving sales",
    marketplace: "Walmart US",
    impact: "$430/wk margin recovery",
    confidence: 91,
    signal: "MI-088 has posted negative net contribution for 12 consecutive days despite continued ad-attributed sales.",
    evidence: [
      { label: "Net margin (12d)", value: "−12.4%", deltaTone: "negative" },
      { label: "COGS increase", value: "+18% vs Q1", deltaTone: "negative" },
      { label: "Ad spend / product", value: "$14.20", delta: "34% of AOV", deltaTone: "negative" },
      { label: "Competitor price gap", value: "−$3.10" },
    ],
    sources: ["Unified P&L", "Walmart Advertising API", "SP-API"],
    reasoning: [
      "COGS jumped 18% after supplier change on Jun 12.",
      "Ad-attributed sales are driving losses (each ad-attributed order loses ~$4.60).",
      "Two paths: (a) pause advertising, sustain organic; (b) raise price $2.99 and retain ads.",
    ],
    recommendation: "Pause SKU MI-088 in all Walmart advertising campaigns until pricing review is complete.",
    actionLabel: "Pause MI-088 ads",
    editable: {
      label: "Action",
      kind: "select",
      current: "Pause advertising",
      options: ["Pause advertising", "Raise price +$2.99, keep ads", "Do nothing, flag weekly"],
    },
    steps: [
      { label: "Locate MI-088 across 6 active campaigns", durationMs: 600 },
      { label: "Set item state = PAUSED (batch)", durationMs: 1100 },
      { label: "Verify state changes", durationMs: 500 },
      { label: "Notify pricing team via Slack #retail-pricing", durationMs: 300 },
      { label: "Record change in audit log", durationMs: 200 },
    ],
    diff: [
      { field: "MI-088 ad state", before: "ENABLED (6 campaigns)", after: "PAUSED (6 campaigns)" },
      { field: "Escalation", before: "—", after: "Slack thread opened with pricing team" },
    ],
    fulfillmentNote: "MI-088 paused across all Walmart campaigns. Pricing review scheduled with Mike for Thu 11 AM.",
  },
  {
    id: "placement-opt",
    domain: "campaign",
    severity: "opportunity",
    icon: "Target",
    title: "Top-of-search delivering +32% ROAS on 4 campaigns",
    subtitle: "Rest-of-search and product pages underperforming",
    marketplace: "Amazon US",
    impact: "+9% ROAS lift projected",
    confidence: 87,
    signal: "Top-of-search placement is delivering 32% higher ROAS than the account average across 4 SP campaigns.",
    evidence: [
      { label: "Top-of-search ROAS", value: "5.4x", delta: "+32%", deltaTone: "positive" },
      { label: "Product page ROAS", value: "2.1x", delta: "−48%", deltaTone: "negative" },
      { label: "Current TOS modifier", value: "+0%" },
      { label: "Suggested TOS modifier", value: "+18%" },
    ],
    sources: ["Amazon Ads API"],
    reasoning: [
      "TOS placement consistently outperforms other placements over 21-day window.",
      "Modest +18% modifier balances win-rate uplift with cost.",
      "Product-page placement should be reduced by 20% to reallocate spend.",
    ],
    recommendation: "Apply +18% TOS bid modifier and −20% product-page modifier across 4 campaigns.",
    actionLabel: "Apply placement modifiers",
    steps: [
      { label: "Update placement modifiers on 4 campaigns", durationMs: 1200 },
      { label: "Verify modifiers applied", durationMs: 500 },
      { label: "Record change in audit log", durationMs: 200 },
    ],
    diff: [
      { field: "Top-of-search modifier", before: "+0%", after: "+18%" },
      { field: "Product-page modifier", before: "+0%", after: "−20%" },
      { field: "Campaigns updated", before: "—", after: "4" },
    ],
    fulfillmentNote: "Placement modifiers live. 7-day performance report will be sent Fri morning.",
  },
  {
    id: "daypart",
    domain: "campaign",
    severity: "fyi",
    icon: "Clock",
    title: "Wasted spend detected: 2–5 AM window",
    subtitle: "$120/day in low-converting overnight impressions",
    marketplace: "Amazon US",
    impact: "$840/wk saved",
    confidence: 90,
    signal: "Between 2 AM and 5 AM, spend continues at 68% of daily-peak rate but converts at 11% of daily-peak rate.",
    evidence: [
      { label: "Avg 2–5 AM spend", value: "$120/day" },
      { label: "Avg 2–5 AM CVR", value: "0.4%", delta: "−82% vs peak", deltaTone: "negative" },
      { label: "Avg 2–5 AM ROAS", value: "0.9x", deltaTone: "negative" },
    ],
    sources: ["Amazon Ads API", "Day Parting analytics"],
    reasoning: [
      "3-hour graveyard window is a consistent CVR trough across 30 days.",
      "Pausing this window saves ~$840/wk without measurable revenue loss.",
      "Schedule can auto-resume 5:00 AM PT daily.",
    ],
    recommendation: "Add daypart schedule pausing all campaigns 02:00–05:00 PT.",
    actionLabel: "Apply overnight pause schedule",
    steps: [
      { label: "Create schedule 'Overnight pause 02–05 PT'", durationMs: 900 },
      { label: "Attach to 18 eligible SP campaigns", durationMs: 1100 },
      { label: "Verify schedule active", durationMs: 400 },
      { label: "Record change in audit log", durationMs: 200 },
    ],
    diff: [
      { field: "Schedule", before: "—", after: "Overnight pause 02:00–05:00 PT (daily)" },
      { field: "Campaigns attached", before: "0", after: "18" },
    ],
    fulfillmentNote: "Overnight pause active. Projected savings: $840/wk. Aan will report actual savings after 7 days.",
  },
  {
    id: "suppression",
    domain: "retail",
    severity: "critical",
    icon: "AlertTriangle",
    title: "Listing suppressed: MI-041 (image compliance)",
    subtitle: "Went live suppressed at 06:14 AM PT",
    marketplace: "Amazon US",
    impact: "$220/day revenue at risk",
    confidence: 96,
    signal: "SKU MI-041 detail page returned to search results as SUPPRESSED with reason 'Main image contains prohibited text overlay'.",
    evidence: [
      { label: "Suppression code", value: "IMG_COMPLIANCE_005" },
      { label: "Estimated daily revenue", value: "$220" },
      { label: "Time suppressed", value: "3h 22m" },
      { label: "Auto-fix available", value: "Yes (crop overlay via SP-API)" },
    ],
    sources: ["SP-API", "Amazon Seller Central"],
    reasoning: [
      "Rejection triggered by 'SALE 40% OFF' overlay on main image.",
      "Existing gallery image #3 meets compliance requirements.",
      "Auto-fix swaps main image with gallery image #3 via SP-API.",
    ],
    recommendation: "Replace main image with gallery image #3 (compliant) and resubmit for review.",
    actionLabel: "Auto-fix listing",
    editable: {
      label: "Fix approach",
      kind: "select",
      current: "Auto-swap to gallery image #3",
      options: ["Auto-swap to gallery image #3", "Open marketplace support case", "Do nothing, flag to catalog team"],
    },
    steps: [
      { label: "Fetch current image manifest", durationMs: 500 },
      { label: "Swap main image → gallery image #3", detail: "PUT /listings/2020-09-01/items", durationMs: 1300 },
      { label: "Submit for compliance re-review", durationMs: 900 },
      { label: "Notify catalog team via Slack", durationMs: 300 },
      { label: "Record change in audit log", durationMs: 200 },
    ],
    diff: [
      { field: "Main image", before: "IMG_MAIN_v4 (with overlay)", after: "IMG_MAIN_v5 (compliant)" },
      { field: "Listing state", before: "SUPPRESSED", after: "PENDING_REVIEW" },
    ],
    fulfillmentNote: "Fix submitted. Amazon typically re-reviews within 4 hours. Aan will notify on state change.",
  },
  {
    id: "buybox",
    domain: "retail",
    severity: "critical",
    icon: "ShoppingCart",
    title: "Buy Box lost on 2 hero SKUs",
    subtitle: "Competitor priced $0.42 lower on both",
    marketplace: "Amazon US",
    impact: "$1,120/day revenue at risk",
    confidence: 94,
    signal: "MI-101 and MI-107 lost Buy Box between 04:30 and 05:00 AM PT. Winning offer is 'FastShipDeals' at −$0.42.",
    evidence: [
      { label: "MI-101 our price", value: "$34.99" },
      { label: "MI-101 competitor price", value: "$34.57", deltaTone: "negative" },
      { label: "MI-107 our price", value: "$28.99" },
      { label: "MI-107 competitor price", value: "$28.57", deltaTone: "negative" },
      { label: "Our margin at match price", value: "22.4% (still above floor)" },
    ],
    sources: ["SP-API", "Competitor Pricing", "Anarix pricing rules"],
    reasoning: [
      "Both SKUs sit well above their configured price floor even after matching.",
      "Buy-Box recovery historically restored within 15 minutes of price match.",
      "Matching + $0.01 undercut avoids race-to-bottom without margin risk.",
    ],
    recommendation: "Reprice MI-101 to $34.56 and MI-107 to $28.56 (match competitor − $0.01).",
    actionLabel: "Apply price match",
    steps: [
      { label: "Validate against price floors", durationMs: 400 },
      { label: "Update MI-101 price → $34.56", durationMs: 800 },
      { label: "Update MI-107 price → $28.56", durationMs: 800 },
      { label: "Verify offer submissions accepted", durationMs: 700 },
      { label: "Record change in audit log", durationMs: 200 },
    ],
    diff: [
      { field: "MI-101 price", before: "$34.99", after: "$34.56" },
      { field: "MI-107 price", before: "$28.99", after: "$28.56" },
      { field: "Buy Box status", before: "LOST (2 SKUs)", after: "RECOVERING (typically < 15 min)" },
    ],
    fulfillmentNote: "Prices updated. Aan will notify when Buy Box is recovered.",
  },
  {
    id: "reviews",
    domain: "retail",
    severity: "opportunity",
    icon: "Star",
    title: "Rating trend down on hero SKU MI-101",
    subtitle: "4.5★ → 3.8★ over 21 days • 7 negative reviews",
    marketplace: "Amazon US",
    impact: "Conversion rate protection",
    confidence: 76,
    signal: "MI-101 rating dropped from 4.5★ to 3.8★ (21d). Recent 7 negatives cluster around 'thin cushioning' and 'squeaky arm'.",
    evidence: [
      { label: "Rating (21d)", value: "3.8★", delta: "−0.7", deltaTone: "negative" },
      { label: "Negative reviews", value: "7 (of last 12)" },
      { label: "Top theme", value: "'thin cushioning' (4 mentions)" },
      { label: "Secondary theme", value: "'squeaky arm' (2 mentions)" },
    ],
    sources: ["SP-API reviews", "Voice-of-customer analysis"],
    reasoning: [
      "Themes are consistent and product-quality-related (not shipping/packaging).",
      "Recommend escalation to product team rather than automated response.",
      "Slack escalation is standard workflow for quality signals per SOP.",
    ],
    workspaceContext: {
      kind: "meeting",
      who: "Monday QBR — Retail Sync",
      when: "Mon",
      quote: "Bharath: 'Any product-quality signals from reviews need to be flagged same-day.'",
    },
    recommendation: "Create Slack thread in #quality-mi-101 with review summary + trend chart + owner tag @Priya.",
    actionLabel: "Create quality escalation",
    steps: [
      { label: "Summarize 7 negative reviews", durationMs: 700 },
      { label: "Generate trend chart image", durationMs: 900 },
      { label: "Post to #quality-mi-101 with @Priya", durationMs: 600 },
      { label: "Create action-item card 'Investigate MI-101 quality'", durationMs: 400 },
      { label: "Record change in audit log", durationMs: 200 },
    ],
    diff: [
      { field: "Slack thread", before: "—", after: "#quality-mi-101 (7 messages)" },
      { field: "Owner", before: "—", after: "@Priya (Product)" },
      { field: "Due date", before: "—", after: "Fri 5 PM" },
    ],
    fulfillmentNote: "Quality escalation posted. Priya acknowledged. Aan will follow up Fri 3 PM if no update.",
  },
];

export function getScenario(id: string) {
  return SCENARIOS.find((s) => s.id === id);
}
