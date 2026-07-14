// Pricing plans for the redesigned Pricing page.
// Numbers are placeholders — confirm with finance before shipping live.

export type PricingMode = "monthly" | "yearly";

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthly: number | null; // null => "Custom" / contact sales
  yearly: number | null;
  features: string[];
  highlight?: boolean;
  cta?: string;
}

export interface ComparisonRow {
  feature: string;
  values: (string | boolean)[]; // aligned with plan order in the section
}

export interface PricingSection {
  id: string;
  label: string;
  plans: PricingPlan[];
  comparison: ComparisonRow[];
}

export interface PricingMajor {
  id: "advertising" | "profitability";
  label: string;
  blurb: string;
  sections: PricingSection[];
}

const adsSelfManaged: PricingPlan[] = [
  {
    id: "ads-self-growth",
    name: "Growth",
    description: "For growing brands running their own ads.",
    monthly: 499,
    yearly: 399,
    features: [
      "Up to $50K monthly ad spend",
      "Amazon + Walmart Ads",
      "Rule builder + automation",
      "Aan AI copilot (basic)",
      "Email support",
    ],
  },
  {
    id: "ads-self-premium",
    name: "Premium",
    description: "For scaling brands managing ads in-house.",
    monthly: 1499,
    yearly: 1199,
    highlight: true,
    features: [
      "Up to $500K monthly ad spend",
      "All channels + Day Parting",
      "Unlimited automation rules",
      "Aan AI copilot (full)",
      "Creative Analyzer",
      "Priority support",
    ],
  },
];

const adsExpertManaged: PricingPlan[] = [
  {
    id: "ads-expert-starter",
    name: "Starter",
    description: "Hands-on management for emerging brands.",
    monthly: 2500,
    yearly: 2000,
    features: [
      "Dedicated strategist (shared)",
      "Up to $100K monthly ad spend",
      "Weekly reviews",
      "Custom rule setup",
    ],
  },
  {
    id: "ads-expert-growth",
    name: "Growth",
    description: "Full-service growth team for scaling brands.",
    monthly: 5000,
    yearly: 4000,
    highlight: true,
    features: [
      "Dedicated strategist",
      "Up to $500K monthly ad spend",
      "Bi-weekly executive reviews",
      "Search harvesting + targeting",
      "Custom dashboards",
    ],
  },
  {
    id: "ads-expert-premium",
    name: "Premium",
    description: "White-glove operations for established brands.",
    monthly: 10000,
    yearly: 8000,
    features: [
      "Senior strategist + analyst",
      "Unlimited ad spend",
      "Weekly executive reviews",
      "Creative production support",
      "Quarterly business reviews",
    ],
  },
];

const profitabilityPlans: PricingPlan[] = [
  {
    id: "profit-growth",
    name: "Growth",
    description: "Marketplace P&L visibility for growing brands.",
    monthly: 299,
    yearly: 239,
    features: [
      "Unified P&L (Amazon + Walmart)",
      "COGS upload + tracking",
      "Daily/weekly/monthly views",
      "CSV export",
    ],
  },
  {
    id: "profit-pro",
    name: "Pro",
    description: "Deep profitability analytics for serious operators.",
    monthly: 799,
    yearly: 639,
    highlight: true,
    features: [
      "All Growth features",
      "Geographical P&L",
      "SKU-level trend analysis",
      "Period breakdown panels",
      "Aan-generated audits",
    ],
  },
  {
    id: "profit-premium",
    name: "Premium",
    description: "Enterprise-grade profitability intelligence.",
    monthly: 1999,
    yearly: 1599,
    features: [
      "All Pro features",
      "Multi-account consolidation",
      "Custom P&L parameters",
      "API access",
      "Dedicated success manager",
    ],
  },
];

export const pricingMajors: PricingMajor[] = [
  {
    id: "advertising",
    label: "Advertising",
    blurb: "Run, automate, and optimize ads across Amazon and Walmart.",
    sections: [
      {
        id: "self-managed",
        label: "Self-Managed",
        plans: adsSelfManaged,
        comparison: [
          { feature: "Ad Spend Limit", values: ["$50K", "$500K"] },
          { feature: "Channels", values: ["Amazon + Walmart", "All"] },
          { feature: "Automation Rules", values: ["Unlimited", "Unlimited"] },
          { feature: "Aan AI Copilot", values: ["Basic", "Full"] },
          { feature: "Creative Analyzer", values: [false, true] },
          { feature: "Day Parting", values: [false, true] },
          { feature: "Support", values: ["Email", "Priority"] },
        ],
      },
      {
        id: "expert-managed",
        label: "Expert-Managed",
        plans: adsExpertManaged,
        comparison: [
          { feature: "Ad Spend Limit", values: ["$100K", "$500K", "Unlimited"] },
          { feature: "Strategist", values: ["Shared", "Dedicated", "Senior + Analyst"] },
          { feature: "Reviews", values: ["Weekly", "Bi-weekly Exec", "Weekly Exec"] },
          { feature: "Custom Dashboards", values: [false, true, true] },
          { feature: "Creative Production", values: [false, false, true] },
          { feature: "QBRs", values: [false, false, true] },
        ],
      },
    ],
  },
  {
    id: "profitability",
    label: "Profitability",
    blurb: "Know exactly where every dollar of marketplace P&L is going.",
    sections: [
      {
        id: "profitability-default",
        label: "All Plans",
        plans: profitabilityPlans,
        comparison: [
          { feature: "Unified P&L", values: [true, true, true] },
          { feature: "COGS Tracking", values: [true, true, true] },
          { feature: "Geographical P&L", values: [false, true, true] },
          { feature: "SKU Trend Analysis", values: [false, true, true] },
          { feature: "Aan-generated Audits", values: [false, true, true] },
          { feature: "Multi-account Consolidation", values: [false, false, true] },
          { feature: "Custom P&L Parameters", values: [false, false, true] },
          { feature: "API Access", values: [false, false, true] },
          { feature: "Success Manager", values: [false, false, true] },
        ],
      },
    ],
  },
];
