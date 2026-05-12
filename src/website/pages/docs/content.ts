import type { ReactNode } from "react";

export interface DocSection {
  heading: string;
  body: string | ReactNode;
  steps?: string[];
}

export interface Doc {
  slug: string;
  title: string;
  category: "Getting Started" | "Modules" | "Aan AI" | "Power Tools" | "Preferences";
  intro: string;
  topicHint: string; // seeds AskAan widget
  sections: DocSection[];
}

export const DOCS: Doc[] = [
  {
    slug: "getting-started",
    title: "Getting Started",
    category: "Getting Started",
    intro:
      "Anarix takes about three minutes to connect and ten minutes to get value from. This guide walks you through your first session.",
    topicHint: "getting started, onboarding, login, connect accounts",
    sections: [
      {
        heading: "Create your account",
        body: "Sign up with your work email at /login. We'll verify the email and drop you into onboarding.",
        steps: [
          "Go to /login",
          "Enter work email + password (or use Google sign-in)",
          "Verify your email via the magic link",
          "Land in /onboarding/connect",
        ],
      },
      {
        heading: "Connect your first account",
        body: "Onboarding asks you to link Amazon (OAuth) or Walmart (API key). Both take ~3 minutes.",
        steps: [
          "Pick Amazon or Walmart",
          "Authorize via OAuth, or paste your Walmart Marketplace API key + secret",
          "We pull last 90 days of orders, ads, and catalog in the background",
          "You're redirected to the Profitability dashboard while data syncs",
        ],
      },
      {
        heading: "Tour the workspace",
        body: "The collapsible sidebar groups every module: Workspace, Profitability, Advertising, Catalog, BI, AMC, Day Parting, Reports, Aan, Settings. The top App Taskbar shows breadcrumbs, account, marketplace, and the active date range.",
      },
    ],
  },
  {
    slug: "profitability",
    title: "Profitability",
    category: "Modules",
    intro:
      "Profitability is your unified P&L surface across Amazon and Walmart. Dashboard, Trends, P&L, Geographical, Unified P&L.",
    topicHint: "profitability, P&L, COGS, margin, unified pnl",
    sections: [
      {
        heading: "The five surfaces",
        body: "Dashboard (current state + scatter), Trends (time series), P&L (line items), Geographical (state-level map), Unified P&L (cross-marketplace).",
      },
      {
        heading: "Editing COGS and fees",
        body: "Open the COGS Edit modal from any SKU row in P&L. Changes are versioned — you can roll back any value at any time. Aan flags SKUs where COGS hasn't been updated in 90+ days.",
      },
      {
        heading: "Drilling down",
        body: "Click any metric pill to open the Period Breakdown panel on the right. Click any SKU to open the Product Detail panel with full order line history.",
      },
    ],
  },
  {
    slug: "advertising",
    title: "Advertising",
    category: "Modules",
    intro:
      "The Advertising module gives you a 3-level analytical hierarchy plus seven specialized surfaces.",
    topicHint: "advertising, campaigns, ad groups, targeting, rules, impact analysis",
    sections: [
      {
        heading: "Hierarchy",
        body: "Campaign → Ad Group → Product Ad / Targeting. Each level has its own table with inline edit, multi-rule filter builder, and column-group expansion.",
      },
      {
        heading: "Specialized surfaces",
        body: "Impact Analysis (Base → Impact deltas), Search Term Harvesting, Budget Pacing, Anomaly Alerts, Creative Analyzer, Rule Agents, Applied Rules.",
      },
      {
        heading: "Adding a target",
        body: "Use Add Keyword Target or Add Product Ads from the right-side panel on any Ad Group. Multi-match-type selection in a single dialog.",
      },
    ],
  },
  {
    slug: "aan",
    title: "Aan AI",
    category: "Aan AI",
    intro:
      "Aan is your decision-support AI. It diagnoses, explains, and drafts — but never executes silently.",
    topicHint: "aan, ai, copilot, rules, draft, safety",
    sections: [
      {
        heading: "How Aan thinks",
        body: "Aan reads the same data you see, runs diagnostic chains for the active context, and produces a structured response: diagnosis, evidence, draft, expected impact.",
      },
      {
        heading: "Approving a draft",
        body: "When Aan drafts a rule, audience, or report, the right-side Aan panel shows a preview card. You either Apply, Edit, or Discard. Applied items appear in the Audit log with a one-click revert.",
      },
      {
        heading: "Where Aan lives",
        body: "Everywhere. The mascot is anchored above the input bar at rest and travels (morphing into a ball) to the generation surface while it's working.",
      },
    ],
  },
  {
    slug: "rules",
    title: "Rule Agents",
    category: "Modules",
    intro:
      "Rule Agents are reusable automation drafts that Aan creates and you approve.",
    topicHint: "rules, automation, agents, applied rules, templates",
    sections: [
      {
        heading: "Templates vs custom",
        body: "Start from a template (negative-keyword harvester, bid floor enforcer, budget pacer) or describe a rule in natural language and let Aan structure it.",
      },
      {
        heading: "Apply, pause, revert",
        body: "Every applied rule is reversible. Pausing stops execution; reverting undoes the last batch of changes the rule made.",
      },
    ],
  },
  {
    slug: "bi-amc",
    title: "BI &amp; AMC",
    category: "Modules",
    intro:
      "Business Intelligence and Amazon Marketing Cloud surfaces for share-of-voice, competitor, and audience work.",
    topicHint: "BI, SOV, competitor pricing, AMC, audiences, queries",
    sections: [
      {
        heading: "BI surfaces",
        body: "Brand SOV, Keyword Tracker, Keyword SOV, Product SOV, Competitor Pricing — all daily-refresh.",
      },
      {
        heading: "AMC",
        body: "Queries, Executed Queries, Schedules, Audiences, Created Audiences, Instances. Build audiences with a visual query editor or paste raw SQL.",
      },
    ],
  },
  {
    slug: "reports",
    title: "Reports",
    category: "Modules",
    intro:
      "Document-grade summaries you can generate, version, and share.",
    topicHint: "reports, exports, client portal, automated reports",
    sections: [
      {
        heading: "Templates",
        body: "Weekly performance, monthly P&L, ad efficiency, competitor watch. Customize sections per template.",
      },
      {
        heading: "Client Portal",
        body: "Agencies can publish reports to a white-labeled portal, scoped per client.",
      },
    ],
  },
  {
    slug: "power-tools",
    title: "Power Tools",
    category: "Power Tools",
    intro:
      "Anarix is built for keyboard-first operators.",
    topicHint: "command palette, shortcuts, keyboard, vim",
    sections: [
      {
        heading: "Command palette",
        body: "Press ⌘K (or Ctrl+K) anywhere. Search pages, campaigns, products, actions, or ask Aan directly.",
      },
      {
        heading: "Vim-like navigation",
        body: "j/k to move rows, Enter to open, Space to select, gg/G for first/last. Press ? anywhere for the full overlay.",
      },
    ],
  },
  {
    slug: "preferences",
    title: "Preferences",
    category: "Preferences",
    intro:
      "Theme, density, visual effects, and feature toggles.",
    topicHint: "preferences, theme, density, feature toggles, visual effects",
    sections: [
      {
        heading: "Theme &amp; density",
        body: "Light or dark (Periwinkle System 01). Compact or Comfortable density. Persists per user.",
      },
      {
        heading: "Feature toggles",
        body: "Hide modules you don't use to keep the sidebar clean. Toggle visual effects globally.",
      },
    ],
  },
];

export const DOCS_BY_CATEGORY = DOCS.reduce<Record<string, Doc[]>>((acc, d) => {
  (acc[d.category] ||= []).push(d);
  return acc;
}, {});
