import { Section, Eyebrow, H1, H2, Lead } from "../components/primitives";
import { Quote, ArrowUpRight } from "lucide-react";

const LOGOS = ["NORTHWAVE", "FERMENT.CO", "ATLAS LABS", "OAKBOX", "RIDGE GOODS", "PEAR & PINE"];

const STORIES = [
  {
    name: "Northwave",
    quote:
      "We cut TACoS by 4.1pp in the first quarter and got our weekends back. Aan drafting negatives every morning is honestly the feature.",
    person: "Mara K. · Head of Performance",
    metric: "-4.1pp TACoS",
  },
  {
    name: "Atlas Labs",
    quote:
      "First tool that didn't make me babysit it. Approving Aan's rule drafts feels like reviewing a colleague's PR — fast, with context.",
    person: "Devon R. · DTC Director",
    metric: "+38% Net Margin",
  },
  {
    name: "Ridge Goods",
    quote:
      "The Unified P&L finally let us see Walmart and Amazon as one business. The day-parting heatmap paid for itself in a week.",
    person: "Priya S. · CFO",
    metric: "11h saved / week",
  },
];

export default function Customers() {
  return (
    <>
      <Section className="!pt-16 !pb-10">
        <Eyebrow>Customers</Eyebrow>
        <H1 className="mt-4 max-w-3xl">Operators who refuse to fly blind.</H1>
        <Lead className="mt-5">
          From single-SKU brands to nine-figure agencies — Anarix is built for teams that need
          clarity faster than the market moves.
        </Lead>
        <div className="mt-12 grid grid-cols-2 gap-y-6 sm:grid-cols-3 md:grid-cols-6">
          {LOGOS.map((l) => (
            <div
              key={l}
              className="text-center text-sm font-[Satoshi] font-semibold tracking-[0.2em] text-muted-foreground/80"
            >
              {l}
            </div>
          ))}
        </div>
      </Section>

      <Section className="!py-16 bg-secondary/5">
        <H2>What they say.</H2>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {STORIES.map((s) => (
            <article
              key={s.name}
              className="rounded-2xl border border-border bg-card p-7 flex flex-col"
            >
              <Quote className="h-5 w-5 text-primary" />
              <p className="mt-4 text-base leading-relaxed text-foreground">"{s.quote}"</p>
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-foreground">{s.name}</div>
                  <div className="text-xs text-muted-foreground">{s.person}</div>
                </div>
                <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary tabular-nums">
                  {s.metric}
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-10">
          <a
            href="/website/contact"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            Become the next case study <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </Section>
    </>
  );
}
