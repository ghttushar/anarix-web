import { Link } from "react-router-dom";
import {
  BarChart3,
  Megaphone,
  Bot,
  Table2,
  TrendingUp,
  Eye,
  LayoutDashboard,
  FileText,
  Sparkles,
} from "lucide-react";
import { SectionLabel } from "./SectionLabel";
import { MiniPnLCard } from "./MiniPnLCard";

interface Cap {
  icon: React.ReactNode;
  title: string;
  body: string;
  to: string;
  extra?: React.ReactNode;
}

const CAPS: Cap[] = [
  {
    icon: <BarChart3 className="h-5 w-5" />,
    title: "Profitability Dashboard",
    body: "See contribution margin at SKU level. Reconcile fees, ad spend, and returns into a single live P&L.",
    to: "/website/products/profitability",
    extra: <MiniPnLCard />,
  },
  {
    icon: <Megaphone className="h-5 w-5" />,
    title: "Advertising Intelligence",
    body: "Control every campaign with precision. Bids, budgets, and pacing surfaced in one operational view.",
    to: "/website/products/advertising",
  },
  {
    icon: <Bot className="h-5 w-5" />,
    title: "Rule Automation",
    body: "Deploy automation without blind execution. Approve, schedule, and audit every action your rules take.",
    to: "/website/products/rule-automation",
  },
  {
    icon: <Table2 className="h-5 w-5" />,
    title: "Campaign Manager",
    body: "Advanced table-first control over every keyword, ad group, and placement across marketplaces.",
    to: "/website/products/campaign-manager",
  },
  {
    icon: <TrendingUp className="h-5 w-5" />,
    title: "Impact Analysis",
    body: "See what actually moved performance. Attribute lift to bid changes, budget shifts, and creative swaps.",
    to: "/website/products/impact-analysis",
  },
  {
    icon: <Eye className="h-5 w-5" />,
    title: "Share of Voice",
    body: "Track visibility across keywords and competitors. Spot ranking shifts before they hit revenue.",
    to: "/website/products/share-of-voice",
  },
  {
    icon: <LayoutDashboard className="h-5 w-5" />,
    title: "Master Dashboard",
    body: "Build your own data sandbox. Compose KPIs, channels, and cohorts into the view your team needs.",
    to: "/website/products/master-dashboard",
  },
  {
    icon: <FileText className="h-5 w-5" />,
    title: "Enterprise Reporting",
    body: "Export-ready structured reporting. Audit trails, scheduled deliveries, and stakeholder-ready summaries.",
    to: "/website/products/enterprise-reporting",
  },
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: "Aan Copilot",
    body: "Our AI copilot for operators. Ask questions in plain English and apply suggested fixes in one click.",
    to: "/website/aan-ai",
  },
];

export function CapabilitiesGrid() {
  return (
    <section className="relative px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <SectionLabel>Platform Capabilities</SectionLabel>
        <h2 className="mt-3 text-center font-[Satoshi] text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
          The Anarix Operating System
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-base text-muted-foreground">
          Advertising, analytics, automation, and intelligence — unified in one operational system.
        </p>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {CAPS.map((c) => (
            <Link
              key={c.title}
              to={c.to}
              className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {c.icon}
              </div>
              <h3 className="mt-4 font-[Satoshi] text-xl font-semibold text-foreground">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
              {c.extra}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
