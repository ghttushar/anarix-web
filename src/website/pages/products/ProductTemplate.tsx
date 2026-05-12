import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SectionLabel } from "../../components/SectionLabel";

interface Props {
  eyebrow: string;
  title: string;
  blurb: string;
  bullets: string[];
}

export function ProductTemplate({ eyebrow, title, blurb, bullets }: Props) {
  return (
    <section className="px-6 pb-24">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <SectionLabel>{eyebrow}</SectionLabel>
          <h1 className="mt-3 font-[Satoshi] text-5xl font-semibold tracking-tight text-foreground md:text-6xl">
            {title}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">{blurb}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/website/demo" className="inline-flex items-center gap-1 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              Schedule a Demo <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link to="/website" className="inline-flex items-center rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground hover:bg-secondary/10">
              Back to overview
            </Link>
          </div>
        </div>

        <ul className="mt-14 grid gap-4 md:grid-cols-2">
          {bullets.map((b) => (
            <li key={b} className="rounded-2xl border border-border bg-card p-5 text-sm text-foreground">
              {b}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
