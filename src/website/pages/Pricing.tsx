import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { SectionLabel } from "../components/SectionLabel";

const TIERS = [
  {
    name: "Starter",
    price: "$499",
    period: "/ month",
    blurb: "For single-brand operators getting serious.",
    features: ["1 marketplace", "1 brand", "Profitability + Advertising", "Email support"],
    cta: "Start free trial",
  },
  {
    name: "Growth",
    price: "$1,499",
    period: "/ month",
    blurb: "For teams running real ad spend across marketplaces.",
    features: ["Amazon + Walmart", "Up to 5 brands", "Aan Rule Automation", "Impact Analysis", "Priority support"],
    cta: "Schedule a demo",
    featured: true,
  },
  {
    name: "Scale",
    price: "Custom",
    period: "",
    blurb: "For agencies and 8-figure brands with AMC needs.",
    features: ["Unlimited brands", "AMC queries & audiences", "Client Portal & white-label", "SSO & audit logs", "Dedicated CSM"],
    cta: "Talk to sales",
  },
];

export default function Pricing() {
  return (
    <section className="px-6 pb-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <SectionLabel>Pricing</SectionLabel>
          <h1 className="mt-3 font-[Satoshi] text-5xl font-semibold tracking-tight text-foreground md:text-6xl">
            Pricing that scales with the spend you manage.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            All plans include the full analytical surface. You only pay more when your business grows.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {TIERS.map((t) => (
            <div
              key={t.name}
              className={
                "rounded-2xl border bg-card p-7 " +
                (t.featured ? "border-primary shadow-[0_0_0_3px_hsl(var(--primary)/0.15)]" : "border-border")
              }
            >
              <div className="text-sm font-medium text-muted-foreground">{t.name}</div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-[Satoshi] text-4xl font-bold text-foreground">{t.price}</span>
                <span className="text-sm text-muted-foreground">{t.period}</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{t.blurb}</p>
              <ul className="mt-6 space-y-2.5">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/website/demo"
                className={
                  "mt-7 inline-flex w-full items-center justify-center rounded-full px-4 py-2.5 text-sm font-medium transition-colors " +
                  (t.featured
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border border-border bg-background text-foreground hover:bg-secondary/10")
                }
              >
                {t.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
