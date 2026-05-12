import { SectionLabel } from "../../components/SectionLabel";
import { Reveal } from "../../components/Reveal";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const ROLES = [
  { title: "Senior Frontend Engineer", location: "Remote · Full-time", team: "Engineering" },
  { title: "ML Engineer — Forecasting", location: "Bangalore · Full-time", team: "AI" },
  { title: "Account Strategist", location: "Remote · Full-time", team: "Managed Services" },
  { title: "Product Designer", location: "Remote · Full-time", team: "Design" },
  { title: "Marketplace Operator", location: "Remote · Full-time", team: "Managed Services" },
];

const VALUES = [
  { t: "Operators first", b: "We build for people running real spend, not for dashboards." },
  { t: "Receipts over claims", b: "Every recommendation comes with the data behind it." },
  { t: "Calm by design", b: "High-stakes work deserves software that doesn't add noise." },
];

export default function Career() {
  return (
    <section className="px-6 pb-24">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div className="text-center">
            <SectionLabel>Careers</SectionLabel>
            <h1 className="mt-3 font-[Satoshi] text-5xl font-semibold tracking-tight text-foreground md:text-6xl">
              Build the system operators trust.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
              We're a small, senior team. Everyone ships, everyone talks to customers, no one hides behind a title.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {VALUES.map((v, i) => (
            <Reveal key={v.t} delay={i * 0.06}>
              <div className="h-full rounded-2xl border border-border bg-card p-6">
                <div className="font-[Satoshi] text-lg font-semibold text-foreground">{v.t}</div>
                <p className="mt-2 text-sm text-muted-foreground">{v.b}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <h2 className="mt-20 font-[Satoshi] text-3xl font-semibold text-foreground">Open roles</h2>
        </Reveal>
        <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-card">
          {ROLES.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.04}>
              <Link
                to="/website/company/contact"
                className="group flex items-center justify-between p-5 transition-colors hover:bg-secondary/10"
              >
                <div>
                  <div className="font-[Satoshi] text-base font-medium text-foreground">{r.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{r.team} · {r.location}</div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
