// Meeting-originated action bundles. These are Flow B: a meeting happened,
// decisions were made, and Aan surfaced a list of things the user needs to
// execute inside Anarix. Distinct from event-driven alerts (Flow A).

export type MeetingItemStatus = "pending" | "approved" | "rejected";

export interface MeetingParticipant {
  name: string;
  role: string;
}

export interface MeetingActionTask {
  id: string;
  title: string;
  owner: string;
  due: string;
  detail: string;
  status: MeetingItemStatus;
}

export interface MeetingTaskBundle {
  bundleId: string;
  meetingTitle: string;
  meetingWhen: string; // human label, e.g. "Today 10:00 AM"
  createdAt: number;
  duration: string; // "42m"
  participants: MeetingParticipant[];
  summary: string;
  transcriptExcerpt: string[]; // lines
  tags: string[];
  actionItems: MeetingActionTask[];
}

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const now = Date.now();

export const MEETING_TASK_BUNDLES: MeetingTaskBundle[] = [
  {
    bundleId: "mtg-staples-qbr",
    meetingTitle: "Staples QBR - Q4 Planning",
    meetingWhen: "Today · 10:00 AM",
    createdAt: now - 1.5 * HOUR,
    duration: "47m",
    participants: [
      { name: "Dorothy Chen", role: "Category Lead, Staples" },
      { name: "Mike Rivera", role: "Account Manager" },
      { name: "Priya Shah", role: "Founder, Anarix" },
      { name: "You", role: "Performance Lead" },
    ],
    summary:
      "Reviewed Q3 performance and locked Q4 priorities: relist the suppressed hero SKU on Staples portal, front-load Prime Day bids, and share a competitor pricing memo before Friday. Team agreed to hold TACoS at 18% while pushing new-to-brand growth.",
    transcriptExcerpt: [
      "Dorothy: Q3 came in 6% under plan on Staples - mostly from the SKU-X suppression.",
      "Mike: I'll get SKU-X relisted by Friday. Portal ticket already open.",
      "Priya: For Prime Day, let's front-load bids on the top 12 hero SKUs.",
      "You: Agreed. I'll have Aan draft the bid adjustments for review.",
      "Dorothy: Buyer wants a competitor pricing memo before the Friday sync.",
      "Priya: We should also refresh creative on the 3 lowest-CTR SKUs.",
      "Mike: I'll own the buyer forecast update - Monday.",
      "You: Aan can pull the pricing memo automatically. I'll approve before send.",
    ],
    tags: ["Staples", "Q4 Planning", "Prime Day"],
    actionItems: [
      {
        id: "t-1",
        title: "Relist SKU-X on Staples portal",
        owner: "Mike",
        due: "Fri",
        detail: "Suppressed since Oct 12. Portal ticket #48291 is open - needs updated compliance docs attached.",
        status: "pending",
      },
      {
        id: "t-2",
        title: "Draft Prime Day bid adjustments (12 hero SKUs)",
        owner: "Aan → You",
        due: "Wed",
        detail: "Front-load bids +18% for 72h window. Draft ready for your review before push.",
        status: "pending",
      },
      {
        id: "t-3",
        title: "Prepare competitor pricing memo",
        owner: "Aan → You",
        due: "Thu",
        detail: "Pull last-14-day pricing vs. top 4 competitors across 20 SKUs. Auto-generated draft.",
        status: "pending",
      },
      {
        id: "t-4",
        title: "Refresh creative on 3 lowest-CTR SKUs",
        owner: "You",
        due: "Next week",
        detail: "SKU-B12, SKU-B44, SKU-C09. Current CTR < 0.4%. New creative brief attached.",
        status: "pending",
      },
      {
        id: "t-5",
        title: "Share updated Q4 forecast with buyer",
        owner: "Dorothy",
        due: "Mon",
        detail: "Buyer requested revised units + revenue view after SKU-X relist.",
        status: "approved",
      },
    ],
  },
  {
    bundleId: "mtg-weekly-ads",
    meetingTitle: "Weekly Ads Sync",
    meetingWhen: "Yesterday · 4:00 PM",
    createdAt: now - 1 * DAY,
    duration: "28m",
    participants: [
      { name: "Priya Shah", role: "Founder, Anarix" },
      { name: "You", role: "Performance Lead" },
      { name: "Sam Ortiz", role: "Ads Strategist" },
    ],
    summary:
      "Discussed the past week's ad performance. TACoS crept up 2.1pt vs prior week driven by two under-performing campaigns. Agreed to pause the worst offender and reallocate budget to the launch campaign that's over-pacing on efficiency.",
    transcriptExcerpt: [
      "Sam: TACoS is up 2.1pt - the 'Winter Push' campaign is the main drag.",
      "Priya: Let's pause it and shift the budget to 'Launch - Series 4'.",
      "You: I'll get Aan to draft the reallocation.",
      "Sam: Also, the negative keyword list on 'Evergreen' hasn't been refreshed in 3 weeks.",
      "You: Adding to the list - Aan can propose negatives from search terms.",
    ],
    tags: ["Advertising", "TACoS", "Budget"],
    actionItems: [
      {
        id: "t-1",
        title: "Pause 'Winter Push' campaign",
        owner: "You",
        due: "Today",
        detail: "TACoS 41% over target. Pause and hold budget for reallocation.",
        status: "pending",
      },
      {
        id: "t-2",
        title: "Reallocate $2.4K/day to 'Launch - Series 4'",
        owner: "Aan → You",
        due: "Today",
        detail: "Launch campaign is pacing 22% under target ROAS ceiling. Room to scale.",
        status: "pending",
      },
      {
        id: "t-3",
        title: "Refresh negative keywords on 'Evergreen'",
        owner: "Aan → You",
        due: "Wed",
        detail: "142 candidate negatives identified from last-21-day search terms. Draft ready.",
        status: "pending",
      },
    ],
  },
  {
    bundleId: "mtg-founder-review",
    meetingTitle: "Founder + Agency Review",
    meetingWhen: "2 days ago · 11:00 AM",
    createdAt: now - 2 * DAY,
    duration: "1h 4m",
    participants: [
      { name: "Priya Shah", role: "Founder, Anarix" },
      { name: "Aisha Patel", role: "Agency Partner" },
      { name: "You", role: "Performance Lead" },
      { name: "Dorothy Chen", role: "Category Lead" },
    ],
    summary:
      "Monthly review with the agency. Agreed the Amazon business is on plan; Walmart is the miss. Decided to launch two new SB campaigns on Walmart, tighten day-parting on Amazon, and start a monthly profit-by-SKU report for the founder.",
    transcriptExcerpt: [
      "Aisha: Walmart is where we're bleeding - 34% under plan.",
      "Priya: Let's stand up two SB campaigns on Walmart this week.",
      "You: I'll draft them - Aan can pre-fill audiences from the Amazon setup.",
      "Aisha: On Amazon, day-parting is loose after 10pm. Tighten it.",
      "Priya: I want a monthly profit-by-SKU report from now on.",
    ],
    tags: ["Walmart", "Reporting", "Day-Parting"],
    actionItems: [
      {
        id: "t-1",
        title: "Launch 2 SB campaigns on Walmart",
        owner: "You + Aan",
        due: "Fri",
        detail: "Pre-filled from Amazon SB setup. Budget $400/day each. Ready for review.",
        status: "pending",
      },
      {
        id: "t-2",
        title: "Tighten Amazon day-parting after 10pm",
        owner: "Aan → You",
        due: "Wed",
        detail: "Reduce bids -40% between 10pm-6am on 8 campaigns. Preserves 96% of conversions.",
        status: "pending",
      },
      {
        id: "t-3",
        title: "Set up monthly profit-by-SKU report",
        owner: "Aan",
        due: "Auto",
        detail: "Recurring on the 1st of each month. Delivered to Priya via email + Slack.",
        status: "approved",
      },
      {
        id: "t-4",
        title: "Send agency the Q4 asset list",
        owner: "Dorothy",
        due: "Mon",
        detail: "Creative refresh briefs for 6 SKUs.",
        status: "pending",
      },
    ],
  },
];
