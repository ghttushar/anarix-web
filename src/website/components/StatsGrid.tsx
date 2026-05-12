import { SectionLabel } from "./SectionLabel";
import { Reveal } from "./Reveal";

const STATS = [
  { value: "$200M+", label: "Ad Spend Managed" },
  { value: "$1.2B+", label: "GMV Driven" },
  { value: "3.2x", label: "Avg. ROAS Lift" },
  { value: "30%", label: "TACoS Reduced" },
  { value: "500+", label: "Brands Served" },
  { value: "12+", label: "Marketplaces" },
];

export function StatsGrid() {
  return (
    <section className="relative px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionLabel>By the numbers</SectionLabel>
          <h2 className="mt-3 text-center font-[Satoshi] text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            Real impact. By the numbers.
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.04}>
              <div className="rounded-2xl border border-border bg-card p-6 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                <div className="font-[Satoshi] text-3xl font-bold text-foreground tabular-nums">{s.value}</div>
                <div className="mt-2 text-xs text-muted-foreground">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
