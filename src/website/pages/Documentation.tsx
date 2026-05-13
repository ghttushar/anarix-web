import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Rocket, Plug, BarChart3, Megaphone, Zap, Bot, Code2, GitBranch, ChevronRight } from "lucide-react";
import PageLayout from "@/website/components/PageLayout";
import WebsiteAanChat from "@/website/components/WebsiteAanChat";
import { cn } from "@/lib/utils";

type Article = {
  id: string;
  title: string;
  body: { h?: string; p?: string; code?: string; list?: string[] }[];
};

const sections: { icon: any; title: string; articles: Article[] }[] = [
  {
    icon: Rocket,
    title: "Getting Started",
    articles: [
      {
        id: "quickstart",
        title: "Quickstart",
        body: [
          { p: "Anarix gets you from raw marketplace data to a working profitability and advertising workspace in under 30 minutes." },
          { h: "1. Create your workspace" },
          { p: "Sign up with your work email. Pick a workspace name (typically your brand or agency name). Invite teammates from Settings → Team." },
          { h: "2. Connect a marketplace" },
          { p: "Open Settings → Integrations and pick Amazon, Walmart, Shopify, or TikTok Shop. OAuth flows take ~2 minutes per channel. Historical data syncs in the background - usually within an hour for the past 90 days." },
          { h: "3. Set spend guardrails" },
          { p: "Settings → Preferences → Guardrails. Default daily and monthly spend caps per campaign. These are enforced by the rule engine before any automation can apply." },
          { h: "4. Meet Aan" },
          { p: "Open the Aan workspace from the sidebar. Ask: \"What should I look at first?\" Aan generates an audit of your account in under 60 seconds." },
        ],
      },
      {
        id: "concepts",
        title: "Core concepts",
        body: [
          { h: "Marketplace" },
          { p: "A connected ad account on Amazon, Walmart, Shopify, TikTok, Meta, or Google. Switch between marketplaces using the Marketplace Selector at the top of every page." },
          { h: "Workspace" },
          { p: "Your team's container. Holds connected accounts, rules, reports, dashboards, and Aan history. Roles are managed separately from profile data for security." },
          { h: "Rule" },
          { p: "A condition + action pair. Example: \"If ACoS > 35% for 3 days, lower bid by 15%.\" Rules require explicit approval before activation. All runs are logged." },
          { h: "Audit" },
          { p: "An on-demand scan Aan runs across your account looking for waste, broken campaigns, or missed opportunities. Returns ranked findings with one-click drill-downs." },
        ],
      },
    ],
  },
  {
    icon: Plug,
    title: "Connect Accounts",
    articles: [
      {
        id: "connect-amazon",
        title: "Connect Amazon",
        body: [
          { p: "Anarix connects to Amazon Ads (Sponsored Products, Sponsored Brands, Sponsored Display) and AMC for advanced audience analysis." },
          { h: "Steps" },
          { list: [
            "Settings → Integrations → Amazon → Connect.",
            "Sign in to your Amazon Ads account in the popup.",
            "Select the profiles (regions/accounts) you want Anarix to manage.",
            "Pick a sync window: 30, 90, or 365 days of history.",
            "First sync completes in 5-60 minutes depending on volume.",
          ] },
          { h: "Permissions requested" },
          { p: "Read: campaigns, keywords, reports, search terms. Write: bids, budgets, campaign state. AMC: query execution and audience export." },
        ],
      },
      {
        id: "connect-walmart",
        title: "Connect Walmart",
        body: [
          { p: "Walmart Connect uses API-key authentication. You generate the keys in your Walmart Sponsored Products account and paste them into Anarix." },
          { list: [
            "Walmart Connect → Account → API Access → Generate Key.",
            "Copy Client ID and Secret.",
            "Anarix → Settings → Integrations → Walmart → paste both.",
            "Click Verify. Sync starts immediately.",
          ] },
        ],
      },
      {
        id: "connect-shopify",
        title: "Connect Shopify",
        body: [
          { p: "Shopify connection brings in orders, products, and customer data so Anarix can compute true contribution margin and run cross-channel attribution." },
          { list: [
            "Settings → Integrations → Shopify → Install App.",
            "Approve scopes: read_orders, read_products, read_customers.",
            "Map your Shopify products to your marketplace SKUs (Anarix auto-matches by SKU code; manual override available).",
          ] },
        ],
      },
    ],
  },
  {
    icon: BarChart3,
    title: "Profitability",
    articles: [
      {
        id: "pnl",
        title: "Unified P&L",
        body: [
          { p: "Unified P&L shows true contribution margin across channels at the SKU, brand, or account level." },
          { h: "Cost lines included" },
          { list: [
            "Cost of goods sold (COGS) - uploaded or pulled from Shopify.",
            "Marketplace fees - referral, FBA, storage, returns.",
            "Ad spend - Sponsored Products/Brands/Display, plus off-platform.",
            "Shipping & fulfillment - actual cost from settlement reports.",
            "Refunds and chargebacks.",
          ] },
          { h: "Frequency" },
          { p: "Switch between Daily / Weekly / Monthly views from the toolbar. Compare to previous period or YoY using the date range picker." },
        ],
      },
      {
        id: "tacos",
        title: "TACoS done right",
        body: [
          { p: "Total ACoS divides ad spend by total revenue (ads + organic). Anarix calculates TACoS using settled revenue, not gross orders, so refunds, returns, and cancellations are handled correctly." },
          { p: "Use TACoS as your North Star for portfolio efficiency. Use ACoS for individual campaign tuning." },
        ],
      },
    ],
  },
  {
    icon: Megaphone,
    title: "Advertising",
    articles: [
      {
        id: "campaign-manager",
        title: "Campaign Manager",
        body: [
          { p: "The Campaign Manager is your single workspace for every connected ad channel. Inline edit bids, budgets, and state without leaving the table." },
          { h: "Hierarchy" },
          { p: "Account → Campaign → Ad Group → Target/Keyword/Product Ad. Each level has its own table with consistent KPIs." },
          { h: "Bulk actions" },
          { p: "Select rows → use the bulk bar to update bids, pause, or attach a rule. All changes preview before commit." },
        ],
      },
      {
        id: "impact-analysis",
        title: "Impact Analysis",
        body: [
          { p: "Impact Analysis compares performance before and after any change - a bid edit, a new campaign, a daypart schedule." },
          { p: "Anarix automatically baselines the prior period and surfaces significant deltas as pill-style indicators on every metric." },
        ],
      },
    ],
  },
  {
    icon: Zap,
    title: "Automation",
    articles: [
      {
        id: "rule-creation",
        title: "Creating a rule",
        body: [
          { h: "1. Pick a trigger" },
          { p: "Schedule (every hour, daily at 9am) or condition (ACoS > 35% for 3 days, no impressions in 7 days)." },
          { h: "2. Define the action" },
          { p: "Adjust bid, change budget, pause, harvest search term as keyword, send alert." },
          { h: "3. Preview the impact" },
          { p: "Anarix simulates the rule against the last 30 days and shows what would have changed. No surprises." },
          { h: "4. Approve and activate" },
          { p: "Rules are off until you approve. Every run is logged with before/after state." },
        ],
      },
      {
        id: "day-parting",
        title: "Day-parting",
        body: [
          { p: "Schedule bid multipliers by hour-of-day and day-of-week. Useful when conversion rate varies sharply across the week (B2B brands, service categories)." },
          { p: "Heatmap view shows ROAS by hour. Drag-select hours to apply a multiplier." },
        ],
      },
    ],
  },
  {
    icon: Bot,
    title: "Aan",
    articles: [
      {
        id: "aan-overview",
        title: "How Aan works",
        body: [
          { p: "Aan is the AI layer sitting on top of your Anarix data. It reads, diagnoses, drafts, and explains. It never auto-applies destructive changes." },
          { h: "Where Aan shows up" },
          { list: [
            "Aan workspace - full chat with audits, rule drafts, and reports.",
            "Insights panel - prioritized findings ranked by revenue impact.",
            "Ask Aan tooltip - select any number in any table for instant context.",
            "Floating action island - quick capture and conversation from anywhere.",
          ] },
        ],
      },
    ],
  },
  {
    icon: Code2,
    title: "API Reference",
    articles: [
      {
        id: "auth",
        title: "Authentication",
        body: [
          { p: "All API requests require a workspace API key. Generate keys in Settings → Developers." },
          { code: "curl https://api.anarix.ai/v1/campaigns \\\n  -H \"Authorization: Bearer ANK_xxx\"" },
          { p: "Keys are scoped to a workspace and can be limited to read-only or read-write." },
        ],
      },
      {
        id: "campaigns-endpoint",
        title: "Campaigns endpoint",
        body: [
          { p: "List campaigns with filters and metrics for any date range." },
          { code: "GET /v1/campaigns?marketplace=amazon&from=2025-01-01&to=2025-01-31" },
        ],
      },
    ],
  },
  {
    icon: GitBranch,
    title: "Changelog",
    articles: [
      {
        id: "changelog",
        title: "Recent updates",
        body: [
          { h: "May 2026" },
          { list: [
            "Aan agents - autonomous workflows for budget pacing and anomaly response.",
            "TikTok Shop ads integration (beta).",
            "Improved scatter chart margins on Profitability dashboard.",
          ] },
          { h: "April 2026" },
          { list: [
            "Day-parting v3 - single-screen heatmap + scheduled jobs.",
            "Multi-rule filter builder on every analytical table.",
            "Dark mode polish across the application.",
          ] },
        ],
      },
    ],
  },
];

const Documentation = () => {
  const [activeId, setActiveId] = useState<string>("quickstart");
  const allArticles = sections.flatMap((s) => s.articles);
  const article = allArticles.find((a) => a.id === activeId) || allArticles[0];

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-pill bg-primary/10 text-primary text-[#f26e76] text-sm font-medium">
            <BookOpen className="w-4 h-4" /> Documentation
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
            Everything you need to <span className="text-gradient-primary">ship</span>.
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-[240px_1fr_360px] gap-8">
          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
            {sections.map((s) => (
              <div key={s.title}>
                <div className="flex items-center gap-2 mb-2 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  <s.icon className="w-3.5 h-3.5" /> {s.title}
                </div>
                <ul className="space-y-0.5">
                  {s.articles.map((a) => (
                    <li key={a.id}>
                      <button
                        onClick={() => setActiveId(a.id)}
                        className={cn(
                          "w-full text-left px-2.5 py-1.5 rounded-md text-sm transition-colors flex items-center gap-1",
                          activeId === a.id
                            ? "bg-primary/10 text-primary text-[#f26e76] font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        )}
                      >
                        <ChevronRight className="w-3 h-3 opacity-50" />
                        {a.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </aside>

          {/* Article */}
          <motion.article
            key={article.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="min-w-0 max-w-2xl"
          >
            <h2 className="text-3xl font-bold text-foreground mb-6">{article.title}</h2>
            <div className="space-y-4">
              {article.body.map((block, i) => {
                if (block.h) return <h3 key={i} className="text-lg font-semibold text-foreground mt-6">{block.h}</h3>;
                if (block.p) return <p key={i} className="text-[15px] text-muted-foreground leading-relaxed">{block.p}</p>;
                if (block.list) return (
                  <ul key={i} className="space-y-1.5 pl-1">
                    {block.list.map((item, j) => (
                      <li key={j} className="text-[15px] text-muted-foreground leading-relaxed flex gap-2">
                        <span className="text-primary text-[#f26e76] mt-1.5 w-1 h-1 rounded-full bg-primary flex-shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                );
                if (block.code) return (
                  <pre key={i} className="bg-muted/50 border border-border rounded-lg p-4 text-xs text-foreground overflow-x-auto font-mono">
                    {block.code}
                  </pre>
                );
                return null;
              })}
            </div>
          </motion.article>

          {/* Live Aan docs chat */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground mb-2">Ask the docs</div>
            <WebsiteAanChat
              scope="docs"
              height="h-[560px]"
              initialMessage="I can answer questions about Anarix's docs - setup, integrations, rules, API. What do you want to know?"
              suggested={[
                "How do I connect Amazon?",
                "How do I create a rule?",
                "What's TACoS?",
                "Show me an API example",
              ]}
            />
          </aside>
        </div>
      </div>
    </PageLayout>
  );
};

export default Documentation;
