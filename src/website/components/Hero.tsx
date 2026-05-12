import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative px-6 pt-20 pb-12">
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1.5 text-sm font-medium text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          The Anarix Insight Engine
        </div>

        <h1 className="mt-7 max-w-4xl font-[Satoshi] text-[56px] leading-[1.05] font-semibold tracking-tight text-foreground md:text-[72px]">
          Save 20+ hours a week on marketplace{" "}
          <span className="relative inline-block whitespace-nowrap font-serif italic font-normal text-primary">
            profitability
            <svg
              aria-hidden
              viewBox="0 0 320 16"
              className="absolute -bottom-2 left-0 h-3 w-full text-primary/70"
              preserveAspectRatio="none"
            >
              <path
                d="M2 10 C 60 2, 120 14, 180 6 S 300 12, 318 4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Anarix is the AI operating layer between your ads, your catalog, and your unified P&amp;L
          — across Amazon, Walmart, Shopify, and TikTok.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/website/demo"
            className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Schedule a Demo
          </Link>
          <Link
            to="/website/products/profitability"
            className="inline-flex items-center rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary/10"
          >
            Explore Products
          </Link>
        </div>

        <div className="mt-16 grid w-full max-w-3xl grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
          <Stat value="$200M+" label="Ad Spend Managed" />
          <Stat value="$1.2B+" label="GMV Driven" />
          <Stat value="3.2x" label="Avg. ROAS Lift" />
          <Stat value="30%" label="TACoS Reduced" />
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="font-[Satoshi] text-3xl font-bold text-foreground tabular-nums md:text-4xl">{value}</div>
      <div className="mt-1.5 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
