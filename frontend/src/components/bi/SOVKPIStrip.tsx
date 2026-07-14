import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { SOVMetrics } from "@/types/bi";

interface SOVKPIStripProps {
  metrics: SOVMetrics;
}

interface KPICardProps {
  label: string;
  value: string;
  delta?: number;
  highlight?: boolean;
}

function KPICard({ label, value, delta, highlight }: KPICardProps) {
  const getDeltaColor = (d: number) => {
    if (d > 0) return "text-success";
    if (d < 0) return "text-destructive";
    return "text-muted-foreground";
  };

  const getDeltaIcon = (d: number) => {
    if (d > 0) return <TrendingUp className="h-3.5 w-3.5" />;
    if (d < 0) return <TrendingDown className="h-3.5 w-3.5" />;
    return <Minus className="h-3.5 w-3.5" />;
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-lg border border-border bg-card p-4",
        highlight && "border-primary/30 bg-primary/5"
      )}
    >
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
      <div className="flex items-baseline gap-2">
        <span className={cn("text-2xl font-semibold", highlight ? "text-primary" : "text-foreground")}>
          {value}
        </span>
        {delta !== undefined && (
          <span className={cn("flex items-center gap-1 text-xs font-medium", getDeltaColor(delta))}>
            {getDeltaIcon(delta)}
            {delta > 0 ? "+" : ""}{delta.toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  );
}

export function SOVKPIStrip({ metrics }: SOVKPIStripProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
      <KPICard label="Your Brand" value={`${metrics.yourBrand}%`} highlight />
      <KPICard label="Organic SOV" value={`${metrics.organicSOV}%`} delta={metrics.organicSOVDelta} />
      <KPICard label="Sponsored SOV" value={`${metrics.sponsoredSOV}%`} delta={metrics.sponsoredSOVDelta} />
      <KPICard label="Total SOV" value={`${metrics.totalSOV}%`} delta={metrics.totalSOVDelta} />
      <KPICard label="Product Count" value={metrics.productCount.toString()} />
    </div>
  );
}
