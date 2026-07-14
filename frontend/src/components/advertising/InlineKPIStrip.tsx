import { ArrowDown, ArrowUp, Minus, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface KPIItem {
  label: string;
  value: number;
  previousValue: number;
  format: "currency" | "number" | "percentage" | "decimal";
  accentColor?: string;
}

interface AvailableMetric {
  key: string;
  label: string;
  format: "currency" | "number" | "percentage" | "decimal";
}

interface InlineKPIStripProps {
  items: KPIItem[];
  availableMetrics?: AvailableMetric[];
  onMetricChange?: (index: number, metricKey: string) => void;
}

function formatValue(value: number, format: string): string {
  switch (format) {
    case "currency":
      if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
      if (value >= 100000) return `$${(value / 1000).toFixed(0)}K`;
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
    case "percentage":
      return `${value.toFixed(2)}%`;
    case "decimal":
      return value.toFixed(2);
    case "number":
    default:
      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
      if (value >= 100000) return `${(value / 1000).toFixed(0)}K`;
      return new Intl.NumberFormat("en-US").format(value);
  }
}

function formatPrevValue(value: number, format: string): string {
  switch (format) {
    case "currency":
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
    case "percentage":
      return `${value.toFixed(2)}%`;
    case "decimal":
      return value.toFixed(2);
    case "number":
    default:
      return new Intl.NumberFormat("en-US").format(value);
  }
}

function calculateDelta(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

const accentColors: Record<string, string> = {
  primary: "border-l-primary",
  success: "border-l-success",
  warning: "border-l-warning",
  destructive: "border-l-destructive",
  accent: "border-l-accent",
};

export function InlineKPIStrip({ items, availableMetrics, onMetricChange }: InlineKPIStripProps) {
  const isSwappable = !!(availableMetrics && onMetricChange);

  return (
    <div data-inline-kpi-strip className="flex gap-1 rounded-lg bg-card p-1 overflow-x-auto">
      {items.map((item, index) => {
        const delta = calculateDelta(item.value, item.previousValue);
        const isPositive = delta > 0;
        const isNeutral = delta === 0;
        const colorClass = accentColors[item.accentColor || "primary"] || "border-l-primary";

        const cardContent = (
          <div
            className={cn(
              "flex flex-1 flex-col gap-0.5 border-l-4 bg-background/50 px-3 py-2.5 first:rounded-l-md last:rounded-r-md min-w-0",
              colorClass,
              isSwappable && "cursor-pointer hover:bg-muted/50 transition-colors"
            )}
          >
            <div className="flex items-center justify-between">
              {isSwappable ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                      {item.label}
                      <ChevronDown className="h-2.5 w-2.5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="max-h-[240px] overflow-auto">
                    {availableMetrics!.map((metric) => (
                      <DropdownMenuItem
                        key={metric.key}
                        onClick={() => onMetricChange!(index, metric.key)}
                        className="text-xs cursor-pointer"
                      >
                        {metric.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  {item.label}
                </span>
              )}
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-lg font-semibold text-foreground leading-tight">
                {formatValue(item.value, item.format)}
              </span>
              <div
                className={cn(
                  "flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-medium shrink-0",
                  isNeutral
                    ? "bg-muted text-muted-foreground"
                    : isPositive
                    ? "bg-success/10 text-success"
                    : "bg-destructive/10 text-destructive"
                )}
              >
                {isNeutral ? (
                  <Minus className="h-3 w-3" />
                ) : isPositive ? (
                  <ArrowUp className="h-3 w-3" />
                ) : (
                  <ArrowDown className="h-3 w-3" />
                )}
                <span>{Math.abs(delta).toFixed(1)}%</span>
              </div>
            </div>
            <span className="text-[10px] text-muted-foreground">
              Prev 7 days: {formatPrevValue(item.previousValue, item.format)}
            </span>
          </div>
        );

        if (isSwappable) {
          return (
            <Tooltip key={`${item.label}-${index}`}>
              <TooltipTrigger asChild>{cardContent}</TooltipTrigger>
              <TooltipContent>Click to change metric</TooltipContent>
            </Tooltip>
          );
        }

        return <div key={`${item.label}-${index}`} className="flex flex-1 min-w-0">{cardContent}</div>;
      })}
    </div>
  );
}