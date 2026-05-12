import { useScrollReveal } from "@/hooks/useScrollReveal";

const platforms = [
  "Amazon", "Walmart", "Shopify", "TikTok Shop", "Meta Ads",
  "Google Ads", "HubSpot", "Snowflake", "Looker", "Slack",
];

const SocialProofSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="py-16 overflow-hidden">
      <div
        className={`text-center mb-8 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
        style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
      >
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-[0.18em]">
          Connects to every channel you sell on
        </p>
      </div>

      <div className="relative group">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee group-hover:[animation-play-state:paused]">
          {[...platforms, ...platforms].map((logo, i) => (
            <div
              key={i}
              className="flex-shrink-0 mx-6 flex items-center justify-center h-12 px-7 rounded-pill bg-card border border-border/60 shadow-soft"
            >
              <span className="text-sm font-medium text-foreground/70 whitespace-nowrap tracking-tight">
                {logo}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
