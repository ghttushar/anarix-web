import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Button } from "@/components/ui/button";

const integrations = [
  "Amazon", "Walmart", "Shopify", "TikTok",
  "Meta", "Google Ads", "Instagram", "Pinterest",
  "HubSpot", "Klaviyo", "eBay", "Target+",
];

const IntegrationOrbit = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="py-24 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <div
          className={`mb-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Connects With Your{" "}
            <span className="text-gradient-primary">Entire Stack</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            One platform, all your channels. No more tab-switching.
          </p>
        </div>

        {/* Floating icons grid */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {integrations.map((name, i) => (
            <div
              key={name}
              className={`px-5 py-3 rounded-xl bg-card border border-border shadow-soft text-sm font-medium text-foreground transition-all duration-300 hover:scale-105 hover:shadow-medium cursor-default ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{
                transitionDelay: isVisible ? `${i * 50}ms` : "0ms",
                transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              {name}
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          className="rounded-pill px-8 h-12 text-base hover:-translate-y-0.5 hover:shadow-medium hover:border-primary/40 transition-all duration-200 active:translate-y-0 active:scale-[0.98]"
        >
          View All Integrations
        </Button>
      </div>
    </section>
  );
};

export default IntegrationOrbit;
