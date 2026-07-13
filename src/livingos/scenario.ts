// Living OS — the single authored scenario. Tuesday morning, 08:14.
// Every rendering across Phase 1 & Phase 2 reads from this file.

export type DomainState =
  | "holding"
  | "watching"
  | "firm"
  | "soft"
  | "silent"
  | "recovering";

export interface TimelineEvent {
  /** Human label, e.g. "Mon 14:20". */
  when: string;
  state: DomainState;
  /** What Aan wrote at that moment about this Domain. */
  narrative: string;
  /** Optional past proposal at that time. */
  pastProposal?: string;
}

export interface DelegationState {
  /** Short authority description. */
  scope: string;
  /** Minimum confidence Aan must have to act unattended (0-1). */
  confidenceFloor: number;
  /** Human duration, e.g. "until Friday 18:00". */
  duration: string;
  boundaries: string[];
  exceptions: string[];
  history: { when: string; text: string }[];
}

export interface Domain {
  id: string;
  name: string;
  state: DomainState;
  x: number;
  y: number;
  weight: number;
  leaning: boolean;
  narrative: string;
  relationships: string[];
  timeline: TimelineEvent[];
  delegation: DelegationState;
}

export interface ProposalAlternative {
  label: string;
  sentence: string;
  tradeoff: string;
}

export interface Proposal {
  domainId: string;
  sentence: string;
  why: string;
  evidence: string[];
  expectedImpact: string;
  projectedStanding: string;
  confidence: number;
  alternatives: ProposalAlternative[];
}

export interface RunningAgent {
  id: string;
  label: string;
  detail: string;
  remainingMinutes: number;
  domainId: string;
}

export interface Scenario {
  day: string;
  time: string;
  standing: string;
  greeting: string;
  domains: Domain[];
  proposal: Proposal;
  agent: RunningAgent;
}

const baseDelegation = (scope: string, floor: number): DelegationState => ({
  scope,
  confidenceFloor: floor,
  duration: "until Friday 18:00",
  boundaries: [
    "Never exceed authorised spend envelope",
    "Never touch delegated campaigns owned by Marketing",
  ],
  exceptions: ["Escalate on any single move > 8% budget shift"],
  history: [
    { when: "Fri", text: "Delegated bid-cap tuning · returned within window" },
    { when: "Mon", text: "Delegated pacing checks · no action needed" },
  ],
});

export const scenario: Scenario = {
  day: "Tuesday",
  time: "08:14",
  standing: "You're standing well. Advertising is watching. Inventory recovered overnight.",
  greeting:
    "Good morning. You're standing well — nothing requires judgment for another two hours. Advertising is leaning toward one.",
  domains: [
    {
      id: "advertising",
      name: "Advertising",
      state: "watching",
      x: 34,
      y: 42,
      weight: 1.35,
      leaning: true,
      narrative:
        "Sponsored Products is holding at 3.1× ROAS, but Q4 spend authority runs out Thursday. Aan is watching the last-72-hour pacing and has drafted one move — a 12% shift from SP into SB to protect brand share through the window's close.",
      relationships: [
        "3 running campaigns · 1 delegated",
        "watched by Marketing",
        "linked to Cash · Inventory",
      ],
      timeline: [
        { when: "Fri 09:00", state: "firm", narrative: "Q4 window opened; pacing well ahead of target." },
        { when: "Sat 18:00", state: "holding", narrative: "Weekend spend cooled; SoV steady." },
        { when: "Mon 11:00", state: "soft", narrative: "SB SoV drifted 3 points below trailing average.", pastProposal: "Lift SB bids by 6%." },
        { when: "Tue 07:40", state: "watching", narrative: "SP saturation confirmed; SB slippage widened to 4 points." },
      ],
      delegation: baseDelegation("Bid caps, pacing, and intra-day budget tuning on Sponsored Products (US only).", 0.8),
    },
    {
      id: "inventory",
      name: "Inventory",
      state: "recovering",
      x: 62,
      y: 30,
      weight: 1.05,
      leaning: false,
      narrative:
        "The West-coast fulfillment gap from last week has closed. Stock levels on the top 8 SKUs are back inside their guardrails. Aan is no longer proposing intervention here.",
      relationships: ["8 SKUs · firm", "linked to Advertising · Cash"],
      timeline: [
        { when: "Thu", state: "soft", narrative: "West-coast FC lag surfaced; 3 SKUs at risk." },
        { when: "Sun", state: "watching", narrative: "Recovery underway; buffer restored on 5 SKUs." },
        { when: "Tue 06:00", state: "recovering", narrative: "All top-8 SKUs back inside guardrails." },
      ],
      delegation: baseDelegation("Reorder recommendations on top-40 SKUs; alerts only.", 0.85),
    },
    {
      id: "cash",
      name: "Cash",
      state: "firm",
      x: 78,
      y: 55,
      weight: 1.0,
      leaning: false,
      narrative:
        "$412k runway with 47 days of cover on current burn. Two receivables clear Friday. Nothing to attend to.",
      relationships: ["47 days cover · firm", "linked to Advertising"],
      timeline: [
        { when: "Fri", state: "firm", narrative: "Runway extended after receivables cleared." },
        { when: "Tue", state: "firm", narrative: "Steady. No movement expected before Friday." },
      ],
      delegation: baseDelegation("Read-only. No autonomous cash movements.", 0.95),
    },
    {
      id: "customers",
      name: "Customers",
      state: "holding",
      x: 50,
      y: 68,
      weight: 0.95,
      leaning: false,
      narrative:
        "NPS steady at 62. Two enterprise conversations are in-flight — one closing this week, one on hold. No immediate signal.",
      relationships: ["2 open · 1 closing", "watched by Sales"],
      timeline: [
        { when: "Mon", state: "holding", narrative: "NPS held at 62. One enterprise thread reopened." },
        { when: "Tue", state: "holding", narrative: "No change." },
      ],
      delegation: baseDelegation("Draft follow-ups only; nothing sent without review.", 0.9),
    },
    {
      id: "operations",
      name: "Operations",
      state: "silent",
      x: 22,
      y: 66,
      weight: 0.9,
      leaning: false,
      narrative:
        "All pipelines green. Last incident was 11 days ago. Aan has nothing to say here today.",
      relationships: ["green · 11d since incident"],
      timeline: [
        { when: "11d ago", state: "watching", narrative: "Incident: warehouse sync lag. Resolved same day." },
        { when: "Tue", state: "silent", narrative: "All pipelines green." },
      ],
      delegation: baseDelegation("Auto-restart known-good jobs; escalate anything novel.", 0.9),
    },
    {
      id: "people",
      name: "People",
      state: "holding",
      x: 15,
      y: 30,
      weight: 0.9,
      leaning: false,
      narrative:
        "One hire closing Thursday. One 1:1 flagged for follow-up from last week's meeting notes. No urgency.",
      relationships: ["1 hire closing · 1 follow-up"],
      timeline: [
        { when: "Last wk", state: "holding", narrative: "Offer extended; 1:1 flagged for follow-up." },
        { when: "Tue", state: "holding", narrative: "Awaiting signature." },
      ],
      delegation: baseDelegation("Scheduling and reminders only. No comms sent unattended.", 0.95),
    },
  ],
  proposal: {
    domainId: "advertising",
    sentence:
      "Shift 12% of Sponsored Products budget into Sponsored Brands for the last three days of the Q4 window.",
    why: "SP is efficient but saturated at current spend. SB share-of-voice on branded terms has drifted 4 points below its trailing average, and Q4 competitor pressure typically peaks in the final 72 hours. Reallocation protects brand defensive share without adding net spend.",
    evidence: ["SP ROAS 3.1×", "SB SoV −4pts", "Q4 window · 03d left"],
    expectedImpact:
      "Standing holds. Brand SoV recovers to trailing average by Thursday close.",
    projectedStanding:
      "You'd still be standing well. Advertising moves from watching to holding by Thursday evening.",
    confidence: 0.78,
    alternatives: [
      {
        label: "Smaller shift",
        sentence: "Shift 6% instead of 12%.",
        tradeoff: "Softer SoV recovery; less exposure if SP cools further.",
      },
      {
        label: "Add net spend",
        sentence: "Hold SP; add 8% net budget to SB.",
        tradeoff: "Protects both channels; breaches Q4 spend envelope by ~2%.",
      },
    ],
  },
  agent: {
    id: "bid-cap-rebalance",
    label: "rebalancing US-Sponsored bid caps",
    detail:
      "Aan is walking the top-20 ad groups on US-Sponsored and easing bid caps where CPC has drifted more than 12% above the 14-day trailing median. No new budgets, no new keywords. Returns to standby when done.",
    remainingMinutes: 6,
    domainId: "advertising",
  },
};
