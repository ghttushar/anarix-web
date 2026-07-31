import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricWidgetProps {
  config: Record<string, unknown>;
}

export function MetricWidget({ config }: MetricWidgetProps) {
  const value = (config.value as number) ?? 0;
  const delta = (config.delta as number) ?? 0;
  const metric = (config.metric as string) ?? "metric";

  const isPositive = delta >= 0;
  const isCurrency = metric === "spend" || metric === "sales";
  const isPercent = metric === "tacos" || metric === "acos";

  const formatValue = () => {
    if (isCurrency) return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (isPercent) return `${value}%`;
    return `${value}x`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-2">
      <p className="text-3xl font-bold text-foreground">{formatValue()}</p>
      {delta !== 0 && (
        <div className={cn("flex items-center gap-1 text-sm font-medium", isPositive ? "text-success" : "text-destructive")}>
          {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          <span>{isPositive ? "+" : ""}{delta}%</span>
        </div>
      )}
    </div>
  );
}
