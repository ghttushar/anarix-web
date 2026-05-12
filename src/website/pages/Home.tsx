import { ArrowRight, BarChart3, Megaphone, Target, FileText, Zap, ShieldCheck, Globe, Database } from "lucide-react";
import { Link } from "react-router-dom";
import { Section, Eyebrow, H1, H2, Lead, FeatureCard } from "../components/primitives";
import { AanChatSurface } from "../components/AanChatSurface";
import { MockProfitabilityScreen, MockAdvertisingScreen } from "../components/MockScreens";
import { AanMascot } from "@/components/aan/AanMascot";

export default function Home() {
  return (
    <>
      {/* HERO */}
      <Section className="!pt-16 !pb-10">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Eyebrow>
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              The decision-support OS for Amazon &amp; Walmart
            </Eyebrow>
            <H1 className="mt-5">
              Run your marketplace business <span className="text-primary">with Aan</span>, not on instinct.
            </H1>
            <Lead className="mt-5">
              Anarix unifies profitability, advertising, BI, AMC and reports into one analytical
              workspace. Aan, your AI co-pilot, drafts every action — bids, budgets, negatives,
              reports — and never executes silently.
            </Lead>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to="/profitability/dashboard"
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Open the app <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/website/contact"
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary/10"
              >
                Book a demo
              </Link>
              <span className="ml-1 inline-flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5" /> Draft-first. Audit trail on every change.
              </span>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
              <Stat label="Avg. TACoS reduction" value="-3.4pp" />
              <Stat label="Hours saved / week" value="11" />
              <Stat label="Marketplaces" value="2" />
            </div>
          </div>

          <div className="relative">
            <AanChatSurface
              suggestedQuestions={[
                "What does Anarix do?",
                "How do rules stay safe?",
                "Show me Profitability",
                "Pricing",
              ]}
            />
            <div className="absolute -top-6 -right-2 hidden md:block">
              <AanMascot state="idle" size={56} interactive floating />
            </div>
          </div>
        </div>
      </Section>

      {/* PRODUCT SHOWCASE */}
      <Section className="!py-16 bg-secondary/5">
        <div className="mb-10 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow>The workspace</Eyebrow>
            <H2 className="mt-4">A real analytics surface, not a dashboard demo.</H2>
          </div>
          <Lead className="md:max-w-md">
            High-density tables. Sticky columns. Inline edit. Independent scroll. Built the way
            operators actually work.
          </Lead>
        </div>
        <MockProfitabilityScreen />
      </Section>

      {/* PILLARS */}
      <Section>
        <Eyebrow>What's inside</Eyebrow>
        <H2 className="mt-4 max-w-3xl">Five modules. One source of truth.</H2>
        <Lead className="mt-4">
          Every module shares the same accounts, date range, and filters. Drill from a metric to a
          SKU to an order line in two clicks.
        </Lead>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard icon={<BarChart3 className="h-5 w-5" />} title="Profitability" body="Unified P&L across Amazon and Walmart. Trends, geo, parameter editor for COGS and fees." />
          <FeatureCard icon={<Megaphone className="h-5 w-5" />} title="Advertising" body="Campaign Manager, Impact Analysis, Search Harvesting, Budget Pacing, Anomaly Alerts, Creative Analyzer." />
          <FeatureCard icon={<Target className="h-5 w-5" />} title="Rule Agents" body="Aan drafts rules. You preview impact and approve. Every applied change is reversible." />
          <FeatureCard icon={<Database className="h-5 w-5" />} title="BI &amp; AMC" body="Brand SOV, Keyword Tracker, Competitor Pricing, AMC Queries with audience builder." />
          <FeatureCard icon={<FileText className="h-5 w-5" />} title="Reports" body="Versioned, document-grade summaries. Client Portal for white-labeled delivery." />
          <FeatureCard icon={<Zap className="h-5 w-5" />} title="Aan AI" body="Diagnose, explain, draft. Conversational across every page. Never executes silently." />
        </div>
      </Section>

      {/* AD MOCK */}
      <Section className="!py-16 bg-secondary/5">
        <div className="mb-10">
          <Eyebrow>Advertising</Eyebrow>
          <H2 className="mt-4 max-w-2xl">Manage thousands of campaigns without losing the thread.</H2>
        </div>
        <MockAdvertisingScreen />
      </Section>

      {/* AAN BAND */}
      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <Eyebrow>Meet Aan</Eyebrow>
            <H2 className="mt-4">An AI you can actually trust with money.</H2>
            <Lead className="mt-4">
              Aan reads your data, diagnoses what's off, explains the reasoning, and drafts actions
              in plain language. Nothing executes until you approve. Every applied change is logged
              and reversible.
            </Lead>
            <ul className="mt-6 space-y-3 text-sm text-foreground">
              {[
                "Draft-first: bids, budgets, negatives, audiences, reports",
                "Preview expected impact before you apply",
                "Full audit trail · revert any rule with one click",
                "Lives in every page — ask Aan, not your inbox",
              ].map((p) => (
                <li key={p} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-7 flex gap-3">
              <Link
                to="/website/aan"
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Tour Aan <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/website/docs/aan"
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary/10"
              >
                Read the docs
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative rounded-3xl border border-border bg-card p-10">
              <AanMascot state="thinking" size={180} interactive floating />
              <div className="mt-6 max-w-xs text-center text-sm text-muted-foreground">
                Aan morphs as it works — diamond at rest, ball when traveling, bar while running.
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section className="!py-20">
        <div className="rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-10 md:p-14">
          <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <H2>Ready to see your data through Aan's eyes?</H2>
              <Lead className="mt-4">
                Connect a sandbox account in three minutes. We'll walk you through your real ad
                spend on a 20-minute call.
              </Lead>
            </div>
            <div className="flex gap-3 lg:justify-end">
              <Link
                to="/website/contact"
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Book a demo <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/profitability/dashboard"
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-5 py-3 text-sm font-medium text-foreground hover:bg-secondary/10"
              >
                Open app
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-[Satoshi] text-2xl font-semibold text-foreground tabular-nums">
        {value}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
