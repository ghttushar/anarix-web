import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Section, Eyebrow, H1, Lead } from "../components/primitives";

const TIERS = [
  {
    name: "Starter",
    price: "$299",
    cadence: "/ month",
    body: "For single-brand sellers getting their first read on profitability.",
    features: [
      "1 marketplace · 1 brand",
      "Profitability + Reports",
      "Aan diagnostics (read-only)",
      "Email support",
    ],
    cta: "Start free trial",
  },
  {
    name: "Growth",
    price: "$899",
    cadence: "/ month",
    highlight: true,
    body: "For operators running active ad spend across Amazon and Walmart.",
    features: [
      "Amazon + Walmart · up to 3 brands",
      "All modules incl. Day Parting + BI",
      "Aan Rule Agents (draft & apply)",
      "AMC queries (basic)",
      "Slack alerts",
    ],
    cta: "Start free trial",
  },
  {
    name: "Scale",
    price: "Custom",
    cadence: "",
    body: "For agencies and multi-brand teams that need seats and white-label.",
    features: [
      "Unlimited brands · agency seats",
      "Full AMC + audience activation",
      "White-labeled Client Portal",
      "SSO + role-based access",
      "Dedicated solutions engineer",
    ],
    cta: "Talk to sales",
  },
];

export default function Pricing() {
  return (
    <>
      <Section className="!pt-16 !pb-8">
        <Eyebrow>Pricing</Eyebrow>
        <H1 className="mt-4 max-w-3xl">Pricing that scales with the spend you trust us with.</H1>
        <Lead className="mt-5">
          14-day free trial on every plan. Cancel anytime. No charge for connecting accounts.
        </Lead>
      </Section>

      <Section className="!pt-4">
        <div className="grid gap-6 md:grid-cols-3">
          {TIERS.map((t) => (
            <div
              key={t.name}
              className={`rounded-2xl border bg-card p-7 transition-colors ${
                t.highlight ? "border-primary shadow-[0_30px_80px_-40px_hsl(var(--primary)/0.5)]" : "border-border"
              }`}
            >
              {t.highlight && (
                <div className="mb-3 inline-flex rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary">
                  Most popular
                </div>
              )}
              <div className="text-sm font-semibold text-foreground">{t.name}</div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-[Satoshi] text-4xl font-semibold text-foreground">{t.price}</span>
                <span className="text-sm text-muted-foreground">{t.cadence}</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{t.body}</p>
              <ul className="mt-5 space-y-2 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/website/contact"
                className={`mt-6 inline-flex w-full items-center justify-center rounded-md px-4 py-2.5 text-sm font-medium ${
                  t.highlight
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border border-border text-foreground hover:bg-secondary/10"
                }`}
              >
                {t.cta}
              </Link>
            </div>
          ))}
        </div>
      </Section>

      <Section className="!py-16 bg-secondary/5">
        <h3 className="font-[Satoshi] text-2xl font-semibold text-foreground">Frequently asked</h3>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {[
            ["Is there a free trial?", "Yes — 14 days on every plan, no card required. You can connect real accounts during trial."],
            ["What happens to my data if I leave?", "You can export everything as CSV or PDF. We delete your account-level data within 30 days of cancellation."],
            ["Does Aan execute changes automatically?", "No. Aan drafts, you approve. Every applied rule has a full audit trail and is reversible."],
            ["Can I add more brands later?", "Yes. Add brands or marketplaces at any time — billing pro-rates for the current cycle."],
          ].map(([q, a]) => (
            <div key={q} className="rounded-xl border border-border bg-card p-5">
              <div className="text-sm font-semibold text-foreground">{q}</div>
              <p className="mt-2 text-sm text-muted-foreground">{a}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
