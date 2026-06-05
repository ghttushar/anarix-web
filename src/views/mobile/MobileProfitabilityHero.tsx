import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfitabilitySummary } from "@/types/profitability";
import { useCurrency } from "@/contexts/CurrencyContext";

interface Props {
  summaries: ProfitabilitySummary[];
  onViewBreakdown?: (summary: ProfitabilitySummary) => void;
}

function compact(v: number, currency: (n: number) => string) {
  const abs = Math.abs(v);
  if (abs >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  return currency(v).replace(/\.\d+/, "");
}

function delta(curr: number, prev: number) {
  if (!prev) return { pct: 0, trend: "neutral" as const };
  const pct = ((curr - prev) / Math.abs(prev)) * 100;
  if (Math.abs(pct) < 0.1) return { pct: 0, trend: "neutral" as const };
  return { pct, trend: pct > 0 ? ("up" as const) : ("down" as const) };
}

function Tile({
  label,
  value,
  d,
  onClick,
  active,
}: {
  label: string;
  value: string;
  d: { pct: number; trend: "up" | "down" | "neutral" };
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-lg border bg-card text-left px-3 py-2.5 flex flex-col gap-1 min-w-0",
        active ? "border-primary ring-1 ring-primary/40" : "border-border"
      )}
    >
      <div className="text-[11px] text-muted-foreground truncate">{label}</div>
      <div className="text-foreground font-semibold tabular-nums leading-tight" style={{ fontSize: "clamp(14px, 4.4vw, 18px)" }}>
        {value}
      </div>
      <div
        className={cn(
          "text-[10px] inline-flex items-center gap-0.5 font-medium",
          d.trend === "up" && "text-success",
          d.trend === "down" && "text-destructive",
          d.trend === "neutral" && "text-muted-foreground"
        )}
      >
        {d.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : d.trend === "down" ? <ArrowDownRight className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
        {d.trend === "neutral" ? "0%" : `${d.pct > 0 ? "+" : ""}${d.pct.toFixed(1)}%`}
      </div>
    </button>
  );
}

/**
 * Mobile profitability hero — 2x2 KPI grid replacing the desktop 5-card
 * scrollable strip. No charts, no forecast, no horizontal scroll.
 * Tap a tile to open the period breakdown panel (parity with desktop).
 */
export function MobileProfitabilityHero({ summaries, onViewBreakdown }: Props) {
  const { formatCurrency } = useCurrency();
  const today = summaries.find((s) => s.period === "today") || summaries[0];
  const yesterday = summaries.find((s) => s.period === "yesterday") || summaries[1] || today;

  if (!today) return null;

  const tiles = [
    {
      label: "Net Profit",
      value: compact(today.netProfit, formatCurrency),
      d: delta(today.netProfit, yesterday.netProfit),
    },
    {
      label: "GMV",
      value: compact(today.gmv, formatCurrency),
      d: delta(today.gmv, yesterday.gmv),
    },
    {
      label: "Ad Cost",
      value: compact(today.adCost, formatCurrency),
      d: delta(today.adCost, yesterday.adCost),
    },
    {
      label: "Orders",
      value: today.orders.toLocaleString(),
      d: delta(today.orders, yesterday.orders),
    },
  ];

  return (
    <div className="px-3 space-y-2" data-mobile-profitability-hero>
      <div className="flex items-center justify-between">
        <h2 className="text-[13px] font-semibold text-foreground">Today</h2>
        {today.dateRange && (
          <span className="text-[11px] text-muted-foreground tabular-nums">{today.dateRange}</span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {tiles.map((t) => (
          <Tile key={t.label} label={t.label} value={t.value} d={t.d} onClick={() => onViewBreakdown?.(today)} />
        ))}
      </div>
    </div>
  );
}
