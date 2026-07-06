// Aan Feed — chronological log of the autonomous coworker's day.
export interface FeedEntry {
  id: string;
  time: string; // "9:02 AM"
  kind: "attended" | "listened" | "detected" | "recommended" | "executed" | "policy" | "briefing" | "captured";
  headline: string;
  detail?: string;
  scenarioId?: string; // links to a scenario if relevant
  source?: string; // "Slack", "Calendar", "Amazon Ads", ...
}

export const FEED_ENTRIES: FeedEntry[] = [
  { id: "f1", time: "7:00 AM", kind: "briefing", headline: "Prepared morning briefing", detail: "5 critical, 3 opportunities, 6 emails to review" },
  { id: "f2", time: "8:12 AM", kind: "listened", headline: "Scanning #ops-mount-it and #retail-pricing", detail: "12 new messages picked up overnight", source: "Slack" },
  { id: "f3", time: "8:41 AM", kind: "detected", headline: "Buy Box lost on MI-101 and MI-107", scenarioId: "buybox", source: "SP-API" },
  { id: "f4", time: "8:45 AM", kind: "recommended", headline: "Recommended price match for MI-101, MI-107", scenarioId: "buybox" },
  { id: "f5", time: "9:02 AM", kind: "attended", headline: "Joined Staples Review meeting", detail: "Listening + note-taking. Will produce summary at end.", source: "Calendar" },
  { id: "f6", time: "9:14 AM", kind: "captured", headline: "Captured decision from Staples Review", detail: "Relist SKU X by Fri — owner Mike" },
  { id: "f7", time: "9:31 AM", kind: "detected", headline: "SKU MI-212 out of stock", detail: "Sponsored campaigns automatically stopped serving", source: "SP-API" },
  { id: "f8", time: "10:14 AM", kind: "detected", headline: "Listing MI-041 suppressed (image compliance)", scenarioId: "suppression", source: "SP-API" },
  { id: "f9", time: "10:22 AM", kind: "recommended", headline: "Recommended auto-fix for MI-041 listing", scenarioId: "suppression" },
  { id: "f10", time: "11:03 AM", kind: "detected", headline: "SP | Bamboo Queen approaching daily budget cap", scenarioId: "budget-optimization", source: "Amazon Ads API" },
  { id: "f11", time: "11:20 AM", kind: "executed", headline: "Auto-applied +$50 budget under policy 'Peak-hour top-up'", detail: "Policy: budget < $75, ROAS > 3.5x", scenarioId: "budget-optimization" },
  { id: "f12", time: "11:47 AM", kind: "captured", headline: "Meeting summary ready — Staples Review", detail: "3 decisions • 5 action items • 1 risk" },
  { id: "f13", time: "12:04 PM", kind: "detected", headline: "3 auto-campaign search terms ready to graduate", scenarioId: "keyword-promotion", source: "Amazon Ads API" },
  { id: "f14", time: "1:16 PM", kind: "listened", headline: "Dorothy emailed about Prime Day prep", detail: "Reviewing thread for eligible SKUs", source: "Gmail" },
  { id: "f15", time: "1:38 PM", kind: "recommended", headline: "Prepared Prime Day campaign draft (12 SKUs)", scenarioId: "event-campaign" },
];

export const CONNECTED_SYSTEMS = [
  { id: "amazon-ads", name: "Amazon Ads API", status: "active", pulse: true },
  { id: "amazon-sp", name: "Amazon SP-API", status: "active", pulse: true },
  { id: "walmart-ads", name: "Walmart Advertising", status: "active", pulse: false },
  { id: "walmart-mp", name: "Walmart Marketplace", status: "active", pulse: false },
  { id: "slack", name: "Slack", status: "active", pulse: true },
  { id: "teams", name: "Microsoft Teams", status: "idle", pulse: false },
  { id: "gmail", name: "Gmail", status: "active", pulse: true },
  { id: "calendar", name: "Google Calendar", status: "active", pulse: false },
  { id: "seventh-gear", name: "7thGear (meetings)", status: "active", pulse: true },
  { id: "powerbi", name: "PowerBI", status: "active", pulse: false },
  { id: "anarix", name: "Anarix Internal", status: "active", pulse: false },
] as const;
