// Mock cross-source corpus used by Aan's Universal Workspace Search.
export interface WorkspaceItem {
  id: string;
  source: "Slack" | "Email" | "Meeting" | "Amazon" | "Walmart" | "Doc";
  title: string;
  snippet: string;
  who: string;
  when: string;
  keywords: string[];
}

export const WORKSPACE_CORPUS: WorkspaceItem[] = [
  { id: "w1", source: "Slack", title: "#ops-mount-it — MI-212 OOS", snippet: "Dorothy: MI-212 dropped to zero units overnight. Warehouse ETA is 48h.", who: "Dorothy", when: "38m ago", keywords: ["mount-it", "mi-212", "out of stock", "inventory"] },
  { id: "w2", source: "Email", title: "Dorothy — Prime Day prep", snippet: "Can we make sure Bamboo Queen and MI-311/312 are supported from day one for Prime Day?", who: "Dorothy Chen", when: "Tue", keywords: ["prime day", "mount-it", "launch", "bamboo"] },
  { id: "w3", source: "Meeting", title: "Monday QBR — Retail Sync", snippet: "Decision: any product-quality signals from reviews must be flagged same-day.", who: "Bharath (host)", when: "Mon", keywords: ["quality", "reviews", "escalation", "sop"] },
  { id: "w4", source: "Meeting", title: "Staples Review — 10 AM", snippet: "Action item: relist SKU X by Fri (Mike). Risk: Q3 forecast miss.", who: "Team", when: "Today 10:00", keywords: ["staples", "sku x", "relist", "forecast"] },
  { id: "w5", source: "Amazon", title: "Search Term Report — SP | Bamboo Auto", snippet: "'bamboo bed sheets queen' converted 8 times at ACoS 19% over 14d.", who: "Amazon Ads", when: "This morning", keywords: ["bamboo", "keyword", "search term", "auto"] },
  { id: "w6", source: "Walmart", title: "Unified P&L — MI-088 margin", snippet: "MI-088 posted −12.4% net margin for 12 consecutive days.", who: "Anarix P&L", when: "This morning", keywords: ["mi-088", "margin", "loss", "cogs", "walmart"] },
  { id: "w7", source: "Slack", title: "#retail-pricing — MI-101/107 Buy Box", snippet: "FastShipDeals is undercutting us by $0.42 on both SKUs.", who: "Priya", when: "3h ago", keywords: ["buy box", "mi-101", "mi-107", "pricing", "competitor"] },
  { id: "w8", source: "Doc", title: "SOP — Listing Suppression Playbook", snippet: "Compliance issues with a compliant gallery image should be auto-swapped and resubmitted.", who: "Ops Handbook", when: "Updated Jun", keywords: ["suppression", "listing", "compliance", "sop", "playbook"] },
];
