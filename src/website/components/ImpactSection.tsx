import { useScrollReveal } from "@/hooks/useScrollReveal";

const metrics = [
  { value: "$200M+", label: "Ad Spend Managed" },
  { value: "$1.2B+", label: "GMV Driven" },
  { value: "3.2x", label: "Avg. ROAS Lift" },
  { value: "30%", label: "TACoS Reduced" },
  { value: "500+", label: "Brands Served" },
  { value: "12+", label: "Marketplaces" },
];

const ImpactSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
        >
          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-semibold text-foreground mb-4 tracking-tight leading-[1.05]">
            Real impact. <span className="text-gradient-primary italic">By the numbers.</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {metrics.map((m, i) => (
            <div
              key={m.label}
              className={`relative p-6 rounded-2xl bg-card border border-border shadow-soft text-center transition-all duration-500 hover:-translate-y-1 hover:shadow-medium ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{
                transitionDelay: isVisible ? `${i * 80}ms` : "0ms",
                transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              {/* Soft gradient blob */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-periwinkle-light/30 to-transparent opacity-60" />
              <div className="relative">
                <div className="text-3xl sm:text-4xl font-bold text-foreground mb-1">{m.value}</div>
                <div className="text-sm text-muted-foreground">{m.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
