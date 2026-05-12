import { SectionLabel } from "./SectionLabel";

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
        <SectionLabel>By the numbers</SectionLabel>
        <h2 className="mt-3 text-center font-[Satoshi] text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
          Real impact. By the numbers.
        </h2>

        <div className="mt-14 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-border bg-card p-6 text-center"
            >
              <div className="font-[Satoshi] text-3xl font-bold text-foreground tabular-nums">{s.value}</div>
              <div className="mt-2 text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
