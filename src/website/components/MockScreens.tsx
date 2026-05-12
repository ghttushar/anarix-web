import { TrendingDown, TrendingUp } from "lucide-react";
import { MockScreen } from "./primitives";

/** Stylized Profitability dashboard mock — uses real Periwinkle tokens. */
export function MockProfitabilityScreen() {
  return (
    <MockScreen title="Profitability — Dashboard" subtitle="Last 30 days · Amazon US">
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-5 gap-2">
          {[
            { label: "Net Revenue", value: "$1.24M", delta: "+12.4%", up: true },
            { label: "Gross Profit", value: "$412K", delta: "+8.1%", up: true },
            { label: "Margin", value: "33.2%", delta: "+1.4pp", up: true },
            { label: "Ad Spend", value: "$182K", delta: "-3.2%", up: false },
            { label: "TACoS", value: "14.7%", delta: "-0.8pp", up: false },
          ].map((k) => (
            <div key={k.label} className="rounded-lg border border-border bg-card p-3">
              <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {k.label}
              </div>
              <div className="mt-1 text-lg font-semibold text-foreground tabular-nums">
                {k.value}
              </div>
              <div
                className={`mt-1 inline-flex items-center gap-1 text-[10px] tabular-nums ${
                  k.up ? "text-success" : "text-destructive"
                }`}
              >
                {k.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {k.delta}
              </div>
            </div>
          ))}
        </div>

        {/* mini line chart (svg) */}
        <div className="rounded-lg border border-border bg-card p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-foreground">Net profit trend</span>
            <span className="text-[10px] text-muted-foreground">30d · daily</span>
          </div>
          <svg viewBox="0 0 600 120" className="h-24 w-full">
            <defs>
              <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.35" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0,90 C40,80 80,70 120,72 C160,74 200,55 240,48 C280,41 320,55 360,40 C400,25 440,30 480,22 C520,14 560,28 600,18 L600,120 L0,120 Z"
              fill="url(#g)"
            />
            <path
              d="M0,90 C40,80 80,70 120,72 C160,74 200,55 240,48 C280,41 320,55 360,40 C400,25 440,30 480,22 C520,14 560,28 600,18"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>

        {/* mini table */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-secondary/5 text-muted-foreground">
              <tr>
                {["SKU", "Units", "Revenue", "Margin", "TACoS"].map((h) => (
                  <th key={h} className="px-3 py-2 text-left font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["ANX-001 · Hydration tabs", "4,280", "$84,120", "38.4%", "11.2%"],
                ["ANX-014 · Recovery powder", "2,140", "$62,380", "31.1%", "16.8%"],
                ["ANX-022 · Sleep blend", "1,640", "$48,210", "29.7%", "18.4%"],
                ["ANX-008 · Daily multi", "3,810", "$41,560", "34.2%", "13.9%"],
              ].map((row) => (
                <tr key={row[0]} className="hover:bg-secondary/5">
                  {row.map((c, i) => (
                    <td
                      key={i}
                      className={`px-3 py-2 ${
                        i === 0 ? "text-foreground" : "text-foreground tabular-nums"
                      } whitespace-nowrap`}
                    >
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MockScreen>
  );
}

/** Stylized Advertising mock. */
export function MockAdvertisingScreen() {
  return (
    <MockScreen title="Advertising — Campaign Manager" subtitle="178 campaigns · Amazon SP/SB/SD">
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-primary/10 px-2 py-1 text-[10px] font-medium text-primary">
            All campaigns
          </span>
          <span className="rounded-md bg-secondary/5 px-2 py-1 text-[10px] text-muted-foreground">
            Sponsored Products
          </span>
          <span className="rounded-md bg-secondary/5 px-2 py-1 text-[10px] text-muted-foreground">
            Sponsored Brands
          </span>
          <span className="ml-auto rounded-md border border-border px-2 py-1 text-[10px] text-muted-foreground">
            Last 14 days
          </span>
        </div>

        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-secondary/5 text-muted-foreground">
              <tr>
                {["Campaign", "Spend", "Sales", "ACoS", "ROAS", "Impressions"].map((h) => (
                  <th key={h} className="px-3 py-2 text-left font-medium whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["SP · Hydration · Exact", "$4,120", "$28,400", "14.5%", "6.89", "412K"],
                ["SP · Recovery · Auto", "$3,840", "$19,200", "20.0%", "5.00", "388K"],
                ["SB · Brand defense", "$2,210", "$15,840", "13.9%", "7.16", "224K"],
                ["SD · Competitor ASINs", "$1,980", "$8,420", "23.5%", "4.25", "1.1M"],
                ["SP · Sleep blend · Phrase", "$1,440", "$9,610", "15.0%", "6.67", "182K"],
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-secondary/5">
                  {row.map((c, i) => (
                    <td
                      key={i}
                      className={`px-3 py-2 whitespace-nowrap ${
                        i === 0 ? "text-foreground" : "text-foreground tabular-nums"
                      }`}
                    >
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-lg border border-border bg-card p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-foreground">Aan suggests</span>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
              Draft · awaiting approval
            </span>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            "Recovery · Auto" has 14 search terms above 30% ACoS that haven't converted in 21 days.
            Add as exact-match negatives to lift overall ROAS by an estimated <span className="text-foreground font-medium tabular-nums">+0.42</span>.
          </p>
        </div>
      </div>
    </MockScreen>
  );
}

/** Stylized Day Parting heatmap mock. */
export function MockDayPartingScreen() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  // deterministic pseudo-random intensities
  const intensity = (d: number, h: number) => {
    const peak = h >= 18 && h <= 22 ? 1 : h >= 9 && h <= 14 ? 0.7 : 0.25;
    const dayBoost = d >= 5 ? 0.85 : 1; // weekends slightly lower
    const noise = ((d * 13 + h * 7) % 10) / 30;
    return Math.min(1, peak * dayBoost + noise);
  };
  return (
    <MockScreen title="Day Parting — Hourly Heatmap" subtitle="ROAS by hour of day · last 28 days">
      <div className="p-4">
        <div className="grid" style={{ gridTemplateColumns: "auto repeat(24, minmax(0, 1fr))" }}>
          <div />
          {hours.map((h) => (
            <div key={h} className="text-[9px] text-muted-foreground text-center">
              {h % 3 === 0 ? h : ""}
            </div>
          ))}
          {days.map((d, di) => (
            <>
              <div key={`d-${d}`} className="pr-2 text-[10px] text-muted-foreground self-center">
                {d}
              </div>
              {hours.map((h) => {
                const v = intensity(di, h);
                return (
                  <div
                    key={`${d}-${h}`}
                    className="m-[1px] aspect-square rounded-[2px]"
                    style={{
                      background: `hsl(var(--primary) / ${0.08 + v * 0.7})`,
                    }}
                    title={`${d} ${h}:00 · ROAS index ${v.toFixed(2)}`}
                  />
                );
              })}
            </>
          ))}
        </div>
      </div>
    </MockScreen>
  );
}
