import StatBlock from "@/website/components/marketing/StatBlock";

const StatBand = () => (
  <section className="py-20 sm:py-28 px-6 border-y border-border">
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
        <StatBlock value="$200M+" label="Ad spend managed" delta="across 4 marketplaces" />
        <StatBlock value="$1.2B" label="GMV driven" delta="for 120+ brands" />
        <StatBlock value="4.2x" label="Median ROAS" delta="+38% vs baseline" />
        <StatBlock value="12.8%" label="Average TACoS" delta="−2.1pp YoY" />
      </div>
    </div>
  </section>
);

export default StatBand;
