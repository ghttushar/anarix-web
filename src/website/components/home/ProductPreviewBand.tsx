import { motion } from "framer-motion";
import { ShieldCheck, History, Zap } from "lucide-react";
import { MorphingNumber } from "@/features/creative/MorphingNumber";

const tickers = [
  { label: "TACoS", value: 12.4, suffix: "%", decimals: 1 },
  { label: "ROAS", value: 4.2, suffix: "x", decimals: 1 },
  { label: "Spend / 24h", value: 18420, prefix: "$", decimals: 0 },
  { label: "Margin Δ", value: 14.0, suffix: "%", decimals: 1, positive: true },
];

const rows = [
  { name: "SP · Bamboo Queen", spend: "$2,140", roas: "6.01x", trend: [3, 5, 4, 6, 7, 6, 8] },
  { name: "SB · Bed in a Box", spend: "$1,820", roas: "6.19x", trend: [4, 4, 5, 6, 6, 7, 7] },
  { name: "SP · Cooling Pillow", spend: "$1,210", roas: "4.42x", trend: [2, 3, 3, 4, 5, 4, 5] },
  { name: "SP · Mattress Topper", spend: "$  860", roas: "3.18x", trend: [3, 3, 2, 2, 3, 3, 2] },
  { name: "SP · Generic KW", spend: "$  410", roas: "1.88x", trend: [2, 2, 1, 1, 1, 1, 1] },
];

const Sparkline = ({ data }: { data: number[] }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const w = 64;
  const h = 18;
  const step = w / (data.length - 1);
  const norm = (v: number) => h - ((v - min) / Math.max(1, max - min)) * h;
  const d = data.map((v, i) => `${i === 0 ? "M" : "L"}${i * step},${norm(v)}`).join(" ");
  return (
    <svg width={w} height={h} className="text-primary/70">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
};

const trustChips = [
  { icon: Zap, label: "<200ms latency" },
  { icon: ShieldCheck, label: "Audit log" },
  { icon: History, label: "Reversible" },
];

const ProductPreviewBand = () => (
  <section className="py-24 sm:py-32 px-6 bg-muted/20">
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        {/* Left - editorial copy */}
        <div className="lg:col-span-5">
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-5">
            Inside Anarix
          </p>
          <h2 className="font-display text-4xl sm:text-5xl xl:text-[56px] font-semibold text-foreground leading-[1.05] tracking-tight">
            Built like a <span className="text-gradient-primary italic">trading desk</span>, not a dashboard.
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mt-6 leading-relaxed max-w-md">
            Every screen is data-dense, sortable, exportable, and tied to an
            action. Numbers update in place. Drift surfaces in seconds, not
            after a Monday meeting.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {trustChips.map((c) => (
              <span
                key={c.label}
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-pill bg-card border border-border text-muted-foreground"
              >
                <c.icon className="w-3.5 h-3.5 text-primary text-[#f26e76]" />
                {c.label}
              </span>
            ))}
          </div>
        </div>

        {/* Right - trading-desk mock */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
          className="lg:col-span-7 relative"
        >
          <div
            className="relative rounded-2xl bg-card border border-border overflow-hidden"
            style={{
              backgroundImage:
                "linear-gradient(hsl(var(--border)/0.4) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)/0.4) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          >
            {/* Window chrome */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-card/80">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40" />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40" />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40" />
              </div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                anarix.app · live
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                streaming
              </span>
            </div>

            {/* KPI ticker strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-border bg-card">
              {tickers.map((t) => (
                <div key={t.label} className="px-4 py-3 border-r border-border last:border-r-0">
                  <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    {t.label}
                  </div>
                  <div className="mt-1 text-foreground font-semibold tabular-nums text-base sm:text-lg">
                    <span className="inline-flex items-baseline">
                      {t.prefix}
                      <MorphingNumber value={t.value} decimals={t.decimals} duration={900} />
                      {t.suffix}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Mini campaign table */}
            <div className="bg-card">
              <div className="grid grid-cols-[1fr,80px,80px,72px] px-4 py-2 text-[10px] uppercase tracking-[0.14em] text-muted-foreground border-b border-border">
                <span>Campaign</span>
                <span className="text-right">Spend</span>
                <span className="text-right">ROAS</span>
                <span className="text-right">7d</span>
              </div>
              {rows.map((r) => (
                <div
                  key={r.name}
                  className="grid grid-cols-[1fr,80px,80px,72px] items-center px-4 py-2.5 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
                >
                  <span className="text-sm text-foreground truncate">{r.name}</span>
                  <span className="text-sm text-foreground text-right tabular-nums">{r.spend}</span>
                  <span className="text-sm text-foreground text-right tabular-nums">{r.roas}</span>
                  <span className="flex justify-end">
                    <Sparkline data={r.trend} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default ProductPreviewBand;
