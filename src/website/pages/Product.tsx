import { Section, Eyebrow, H1, H2, Lead, FeatureCard } from "../components/primitives";
import { MockProfitabilityScreen, MockAdvertisingScreen, MockDayPartingScreen } from "../components/MockScreens";
import { BarChart3, Megaphone, Target, Database, FileText, Clock, Search, ShieldCheck, Activity, Layers } from "lucide-react";

export default function Product() {
  return (
    <>
      <Section className="!pt-16 !pb-10">
        <Eyebrow>Product</Eyebrow>
        <H1 className="mt-4 max-w-4xl">Every module you need to run a marketplace business.</H1>
        <Lead className="mt-5">
          Five purpose-built modules. Shared accounts, dates, and filters. The same Aan helping
          across all of them.
        </Lead>
      </Section>

      <Module
        eyebrow="Profitability"
        icon={<BarChart3 className="h-5 w-5" />}
        title="A unified P&L for Amazon and Walmart."
        body="Dashboard, Trends, P&L, Geographical, and a Unified P&L across marketplaces. Edit COGS and fee parameters inline. Drill from any metric to the SKU and the order line."
        screen={<MockProfitabilityScreen />}
        bullets={[
          "5 interactive surfaces · scatter chart with margin contours",
          "Inline COGS editor with versioning",
          "Period breakdown panel for any custom range",
          "Currency-aware, multi-account roll-up",
        ]}
      />

      <Module
        eyebrow="Advertising"
        icon={<Megaphone className="h-5 w-5" />}
        title="Manage thousands of campaigns with surgical control."
        body="A 3-level hierarchy — Campaign → Ad Group → Product Ad / Targeting. Plus Impact Analysis, Search Term Harvesting, Budget Pacing, Anomaly Alerts, and a Creative Analyzer."
        screen={<MockAdvertisingScreen />}
        reverse
        bullets={[
          "Inline campaign editing in table rows",
          "Match-type cards for keyword targeting",
          "Base → Impact pill deltas across rule applications",
          "Bulk actions with safety-gated previews",
        ]}
      />

      <Module
        eyebrow="Day Parting"
        icon={<Clock className="h-5 w-5" />}
        title="Schedule bids around when intent actually peaks."
        body="A single-screen heatmap of conversion efficiency, paired with a campaign-level scheduler. Pattern visible in 5 seconds, schedule applied in 30."
        screen={<MockDayPartingScreen />}
        bullets={[
          "Hourly ROAS index with full week view",
          "Scheduled jobs with audit history",
          "Per-campaign or per-portfolio scope",
        ]}
      />

      <Section className="!py-16 bg-secondary/5">
        <Eyebrow>And more</Eyebrow>
        <H2 className="mt-4">The rest of the platform.</H2>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard icon={<Database className="h-5 w-5" />} title="BI" body="Brand SOV, Keyword Tracker, Keyword & Product SOV, Competitor Pricing — daily refresh." />
          <FeatureCard icon={<Layers className="h-5 w-5" />} title="Catalog" body="SKU-level table with expandable column groups for sales, ads, inventory, content health." />
          <FeatureCard icon={<Search className="h-5 w-5" />} title="AMC" body="Query builder, executed queries history, schedules, audiences, instances. Built for the BIs." />
          <FeatureCard icon={<FileText className="h-5 w-5" />} title="Reports" body="Versioned templates, history, white-labeled Client Portal for agencies." />
          <FeatureCard icon={<Target className="h-5 w-5" />} title="Rule Agents" body="Aan drafts. You approve. Each applied rule is reversible with a full audit trail." />
          <FeatureCard icon={<Activity className="h-5 w-5" />} title="Health Score" body="A single composite score with the underlying signals: spend efficiency, growth, parity, content." />
          <FeatureCard icon={<ShieldCheck className="h-5 w-5" />} title="Safety model" body="Destructive actions always preview. 'Run' buttons are non-destructive by definition." />
        </div>
      </Section>
    </>
  );
}

function Module({
  eyebrow,
  title,
  body,
  bullets,
  screen,
  icon,
  reverse,
}: {
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
  screen: React.ReactNode;
  icon: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <Section>
      <div className={`grid items-center gap-10 lg:grid-cols-2 ${reverse ? "lg:[&>div:first-child]:order-2" : ""}`}>
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {icon}
            {eyebrow}
          </div>
          <H2 className="mt-4">{title}</H2>
          <Lead className="mt-4">{body}</Lead>
          <ul className="mt-6 space-y-2 text-sm text-foreground">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {b}
              </li>
            ))}
          </ul>
        </div>
        <div>{screen}</div>
      </div>
    </Section>
  );
}
