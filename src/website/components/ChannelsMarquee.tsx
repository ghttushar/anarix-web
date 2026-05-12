const CHANNELS = [
  "Amazon",
  "Walmart",
  "Shopify",
  "TikTok Shop",
  "Meta Ads",
  "Google Ads",
  "HubSpot",
  "Snowflake",
  "Looker",
  "Slack",
];

export function ChannelsMarquee() {
  const items = [...CHANNELS, ...CHANNELS];
  return (
    <section className="relative px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="text-center text-sm font-medium text-muted-foreground">
          Connects to every channel you sell on
        </div>
        <div className="relative mt-8 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
          <div className="flex w-max animate-[marquee_38s_linear_infinite] gap-3">
            {items.map((c, i) => (
              <span
                key={`${c}-${i}`}
                className="inline-flex shrink-0 items-center rounded-full border border-border bg-card px-5 py-2 text-sm font-medium text-foreground"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
