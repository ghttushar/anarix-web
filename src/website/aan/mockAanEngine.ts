// Mock Aan engine for the marketing website. Pure frontend, no LLM.
// Keyword-matched canned responses about Anarix.

export interface MockAanReply {
  text: string;
  followups?: string[];
}

interface Rule {
  match: RegExp;
  reply: MockAanReply;
}

const RULES: Rule[] = [
  {
    match: /(profit|p&l|pnl|margin|cogs)/i,
    reply: {
      text:
        "Anarix's Profitability module unifies orders, fees, COGS, and ad spend into a single P&L. You get four interactive surfaces — Dashboard, Trends, P&L, and Geographical — plus a Unified P&L view that rolls Amazon and Walmart into one statement. You can drill from a metric down to the SKU and the order line in two clicks.",
      followups: ["Show me the dashboard", "How is COGS calculated?", "Open the docs"],
    },
  },
  {
    match: /(advertis|campaign|ppc|amc|targeting|bid|search term|harvest|impact)/i,
    reply: {
      text:
        "The Advertising module is built around a 3-level analytical hierarchy: Campaign → Ad Group → Product Ad / Targeting. Beyond the manager, you get Impact Analysis, Search Term Harvesting, Budget Pacing, Anomaly Alerts, a Creative Analyzer, and a Rule Agent system where I draft rules for you and you approve them before they ever run.",
      followups: ["How do rules work?", "Show me Impact Analysis", "What is Day Parting?"],
    },
  },
  {
    match: /(rule|automation|agent|safety)/i,
    reply: {
      text:
        "Rules in Anarix are draft-first. I propose changes — bid adjustments, negative keywords, budget shifts — and surface a preview of expected impact. Nothing executes until you click Apply. Every applied rule has a full audit trail and can be paused or reverted.",
      followups: ["Create my first rule", "What rule templates exist?"],
    },
  },
  {
    match: /(aan|ai|copilot|assistant|chat)/i,
    reply: {
      text:
        "Hi — I'm Aan. I read your data, diagnose what's off, explain why, and draft actions. I never execute silently. You'll see me as a small diamond near most workflows; ask me anything and I morph and travel to wherever the answer is being generated.",
      followups: ["What can you do?", "Show me a demo", "Open Aan workspace"],
    },
  },
  {
    match: /(price|pricing|cost|plan|tier|subscription)/i,
    reply: {
      text:
        "Anarix has three tiers: Starter (single brand, one marketplace), Growth (multi-brand, Amazon + Walmart, Aan rules), and Scale (agency seats, AMC, white-labeled reports). Pricing scales with ad spend under management — see the Pricing page for the live calculator.",
      followups: ["Open pricing", "Talk to sales"],
    },
  },
  {
    match: /(amazon|walmart|marketplace|integration|connect)/i,
    reply: {
      text:
        "Anarix natively supports Amazon (SP, SB, SD, AMC) and Walmart Connect. Connection takes about three minutes per account — OAuth for Amazon, API key for Walmart. Marketplace-specific validation rules adapt automatically: campaign types, bid floors, targeting options.",
      followups: ["Connect Amazon", "Connect Walmart", "What's AMC?"],
    },
  },
  {
    match: /(report|export|share|client portal)/i,
    reply: {
      text:
        "Reports are document-grade summaries you can generate, version, and share. Templates cover weekly performance, monthly P&L, ad efficiency, and competitor watch. Each generation is versioned and exportable as PDF or CSV. Agencies use the Client Portal to white-label them.",
      followups: ["Show report templates", "Open Client Portal"],
    },
  },
  {
    match: /(theme|dark|light|appearance|color|design)/i,
    reply: {
      text:
        "The interface uses Periwinkle System 01 — a calm analytical palette tuned for long sessions. Light and dark modes share the exact same layout; only tokens swap. Try the toggle at the top right of this site, it's the same one used inside the app.",
      followups: ["Open design system", "What font do you use?"],
    },
  },
  {
    match: /(competitor|sov|share of voice|brand|keyword)/i,
    reply: {
      text:
        "Business Intelligence covers Brand SOV, Keyword Tracker, Keyword SOV, Product SOV, and Competitor Pricing. Track who's outranking you on which terms, watch competitor price moves daily, and tie share-of-voice swings back to your own ad changes.",
      followups: ["Show me Brand SOV", "Track a keyword"],
    },
  },
  {
    match: /(day parting|hourly|schedule|time of day)/i,
    reply: {
      text:
        "Day Parting gives you an hourly heatmap of conversion efficiency across the week, then lets you schedule bid multipliers per slot — single-screen, zero context-switching. Useful when your category has clear high-intent windows.",
      followups: ["Open Day Parting"],
    },
  },
  {
    match: /(catalog|product|inventory|sku)/i,
    reply: {
      text:
        "The Catalog module shows every SKU with expandable column groups for sales, ads, inventory, and content health. Inventory + Ads ties days-of-cover to active ad spend so you stop pushing ads on items that will stock out before they ship.",
      followups: ["Open Catalog"],
    },
  },
  {
    match: /(team|seat|user|role|permission)/i,
    reply: {
      text:
        "Team management supports role-based access — Admin, Operator, Analyst, Viewer. Per-marketplace and per-brand scoping for agencies. SSO is on the Scale tier.",
      followups: ["Pricing", "Contact sales"],
    },
  },
  {
    match: /(demo|trial|book|sales|talk to)/i,
    reply: {
      text:
        "Happy to set you up. The fastest path is a 20-minute demo where we connect a sandbox account and walk through your real ad spend live. Use the Contact page to book — I'll be there too.",
      followups: ["Book a demo", "Open the app"],
    },
  },
];

const FALLBACK: MockAanReply = {
  text:
    "Good question. I can speak to Profitability, Advertising, Aan rules, BI, AMC, Day Parting, Reports, pricing, and integrations. Try one of those — or jump into the Docs and I'll be there on every page.",
  followups: ["Show me the product", "Open the docs", "Pricing"],
};

export function generateMockReply(question: string): MockAanReply {
  const q = question.trim();
  if (!q) return FALLBACK;
  for (const rule of RULES) {
    if (rule.match.test(q)) return rule.reply;
  }
  return FALLBACK;
}

/** Token-by-token streaming simulator — yields chunks via callback. */
export async function streamMockReply(
  question: string,
  onChunk: (chunk: string) => void,
  opts: { tokenDelayMs?: number; signal?: AbortSignal } = {}
): Promise<MockAanReply> {
  const reply = generateMockReply(question);
  const delay = opts.tokenDelayMs ?? 18;
  const tokens = reply.text.split(/(\s+)/);
  for (const t of tokens) {
    if (opts.signal?.aborted) break;
    await new Promise((r) => setTimeout(r, delay));
    onChunk(t);
  }
  return reply;
}
