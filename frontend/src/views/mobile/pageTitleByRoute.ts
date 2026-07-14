// Resolves the page title shown in the mobile top bar from a route path.
// Order matters — first prefix match wins. Drill-down routes append a
// trailing label from the URL param so users can see which record they're on.

interface Entry {
  pattern: RegExp;
  title: string | ((m: RegExpMatchArray) => string);
  drilldown?: boolean;
}

const ENTRIES: Entry[] = [
  { pattern: /^\/aan$/, title: "Aan AI" },
  { pattern: /^\/profile$/, title: "Profile" },

  // Profitability
  { pattern: /^\/profitability\/dashboard/, title: "Profitability" },
  { pattern: /^\/profitability\/trends/, title: "Trends" },
  { pattern: /^\/profitability\/pnl/, title: "Profit & Loss" },
  { pattern: /^\/profitability\/geo/, title: "Geographical Data" },
  { pattern: /^\/profitability\/unified-pnl/, title: "Unified P&L" },

  // Advertising — drill-downs first
  { pattern: /^\/advertising\/impact\/campaign\/([^/]+)\/adgroup\/([^/]+)/, title: (m) => `Ad Group: ${decodeURIComponent(m[2])}`, drilldown: true },
  { pattern: /^\/advertising\/impact\/campaign\/([^/]+)/, title: (m) => `Campaign: ${decodeURIComponent(m[1])}`, drilldown: true },
  { pattern: /^\/advertising\/impact/, title: "Impact Analysis" },
  { pattern: /^\/advertising\/campaigns\/([^/]+)\/adgroups\/([^/]+)\/product-ads\/([^/]+)/, title: (m) => `Product Ad: ${decodeURIComponent(m[3])}`, drilldown: true },
  { pattern: /^\/advertising\/campaigns\/([^/]+)\/adgroups\/([^/]+)/, title: (m) => `Ad Group: ${decodeURIComponent(m[2])}`, drilldown: true },
  { pattern: /^\/advertising\/campaigns\/([^/]+)/, title: (m) => `Campaign: ${decodeURIComponent(m[1])}`, drilldown: true },
  { pattern: /^\/advertising\/campaigns/, title: "Campaign Manager" },
  { pattern: /^\/advertising\/targeting/, title: "Targeting Actions" },
  { pattern: /^\/advertising\/budget-pacing/, title: "Budget Pacing" },
  { pattern: /^\/advertising\/search-harvesting/, title: "Search Harvesting" },
  { pattern: /^\/advertising\/anomaly-alerts/, title: "Anomaly Alerts" },
  { pattern: /^\/advertising\/creative-analyzer/, title: "Creative Analyzer" },
  { pattern: /^\/advertising\/rules\/applied/, title: "Applied Rules" },
  { pattern: /^\/advertising\/rules\/agents/, title: "Rule Agents" },

  // Catalog
  { pattern: /^\/catalog\/products/, title: "Products" },
  { pattern: /^\/catalog\/inventory-ads/, title: "Inventory & Ads" },

  // AMC
  { pattern: /^\/amc\/instances/, title: "AMC Instances" },
  { pattern: /^\/amc\/queries/, title: "AMC Queries" },
  { pattern: /^\/amc\/executed/, title: "Executed Queries" },
  { pattern: /^\/amc\/schedules/, title: "Schedules" },
  { pattern: /^\/amc\/audiences/, title: "Audiences" },
  { pattern: /^\/amc\/created-audiences/, title: "Created Audiences" },

  // BI
  { pattern: /^\/bi\/brand-sov/, title: "Brand SOV" },
  { pattern: /^\/bi\/keyword-tracker/, title: "Keyword Tracker" },
  { pattern: /^\/bi\/keyword-sov/, title: "Keyword SOV" },
  { pattern: /^\/bi\/product-sov/, title: "Product SOV" },
  { pattern: /^\/bi\/competitor-pricing/, title: "Competitor Pricing" },

  // Day parting + reports
  { pattern: /^\/dayparting/, title: "Day Parting" },
  { pattern: /^\/reports/, title: "Reports" },

  // Settings
  { pattern: /^\/settings\/appearance/, title: "Preferences" },
  { pattern: /^\/settings\/accounts/, title: "Accounts" },
  { pattern: /^\/settings\/integrations/, title: "Integrations" },
  { pattern: /^\/settings\/team/, title: "Team" },
  { pattern: /^\/settings\/system/, title: "System" },
  { pattern: /^\/settings\/design-system/, title: "Design System" },
  { pattern: /^\/settings\/component-library/, title: "Component Library" },
  { pattern: /^\/settings\/billing/, title: "Billing" },
  { pattern: /^\/settings/, title: "Settings" },

  // Workspace
  { pattern: /^\/workspace\/health-score/, title: "Health Score" },
  { pattern: /^\/workspace/, title: "Workspace" },
];

export interface PageTitleInfo {
  title: string;
  isDrillDown: boolean;
}

export function resolvePageTitle(pathname: string): PageTitleInfo {
  for (const entry of ENTRIES) {
    const m = pathname.match(entry.pattern);
    if (m) {
      const title = typeof entry.title === "function" ? entry.title(m) : entry.title;
      return { title, isDrillDown: !!entry.drilldown };
    }
  }
  return { title: "Anarix", isDrillDown: false };
}
