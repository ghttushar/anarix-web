import { cn } from "@/lib/utils";
import { HourlyDataPoint, MetricType } from "@/types/dayparting";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface HourlyHeatmapProps {
  data: HourlyDataPoint[];
  metric: MetricType;
  onCellClick?: (hour: number, dayOfWeek: number) => void;
  selectedCells?: Set<string>;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

const formatValue = (value: number, metric: MetricType): string => {
  switch (metric) {
    case "spend":
    case "revenue":
      return `$${value.toFixed(0)}`;
    case "roas":
      return `${value.toFixed(1)}x`;
    case "acos":
    case "ctr":
    case "cvr":
      return `${value.toFixed(0)}%`;
    case "orders":
    case "units":
    case "impressions":
    case "clicks":
      return value.toFixed(0);
    default:
      return value.toFixed(1);
  }
};

const formatCellValue = (value: number, metric: MetricType): string => {
  switch (metric) {
    case "spend":
    case "revenue":
      return value >= 1000 ? `${(value / 1000).toFixed(0)}k` : `${value.toFixed(0)}`;
    case "roas":
      return value.toFixed(1);
    case "acos":
    case "ctr":
    case "cvr":
      return `${value.toFixed(0)}`;
    case "orders":
    case "units":
    case "impressions":
    case "clicks":
      return value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value.toFixed(0);
    default:
      return value.toFixed(0);
  }
};

const getMetricValue = (point: HourlyDataPoint, metric: MetricType): number => {
  return point[metric] as number;
};

export function HourlyHeatmap({ data, metric, onCellClick, selectedCells }: HourlyHeatmapProps) {
  const grid: Record<string, HourlyDataPoint> = {};
  data.forEach((point) => {
    const key = `${point.dayOfWeek}-${point.hour}`;
    if (!grid[key]) {
      grid[key] = point;
    } else {
      const existing = grid[key];
      grid[key] = {
        ...existing,
        spend: (existing.spend + point.spend) / 2,
        revenue: (existing.revenue + point.revenue) / 2,
        orders: Math.round((existing.orders + point.orders) / 2),
        units: Math.round((existing.units + point.units) / 2),
        roas: (existing.roas + point.roas) / 2,
        acos: (existing.acos + point.acos) / 2,
        ctr: (existing.ctr + point.ctr) / 2,
        cvr: (existing.cvr + point.cvr) / 2,
      };
    }
  });

  const values = Object.values(grid).map((p) => getMetricValue(p, metric));
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue || 1;

  const getIntensity = (value: number): number => {
    return (value - minValue) / range;
  };

  const getColor = (intensity: number, isGoodHigher: boolean): string => {
    const effectiveIntensity = isGoodHigher ? intensity : 1 - intensity;
    if (effectiveIntensity < 0.2) return "bg-primary/5";
    if (effectiveIntensity < 0.4) return "bg-primary/15";
    if (effectiveIntensity < 0.6) return "bg-primary/30";
    if (effectiveIntensity < 0.8) return "bg-primary/50";
    return "bg-primary/70";
  };

  const getTextColor = (intensity: number, isGoodHigher: boolean): string => {
    const effectiveIntensity = isGoodHigher ? intensity : 1 - intensity;
    return effectiveIntensity >= 0.6 ? "text-primary-foreground" : "text-foreground";
  };

  const isHigherBetter = ["revenue", "roas", "orders", "units", "clicks", "ctr", "cvr"].includes(metric);

  // Compute daily totals (sum per day across all hours)
  const dayTotals: Record<number, number> = {};
  DAYS.forEach((_, dayIndex) => {
    let total = 0;
    HOURS.forEach((hour) => {
      const point = grid[`${dayIndex}-${hour}`];
      if (point) total += getMetricValue(point, metric);
    });
    dayTotals[dayIndex] = total;
  });

  // Compute hourly totals (sum per hour across all days)
  const hourTotals: Record<number, number> = {};
  HOURS.forEach((hour) => {
    let total = 0;
    DAYS.forEach((_, dayIndex) => {
      const point = grid[`${dayIndex}-${hour}`];
      if (point) total += getMetricValue(point, metric);
    });
    hourTotals[hour] = total;
  });

  return (
    <div className="rounded-lg border border-border p-4 overflow-x-auto">
      <div className="min-w-[850px]">
        {/* Header row with hours + Daily Total */}
        <div className="grid grid-cols-[60px_repeat(24,1fr)_60px] gap-1 mb-1">
          <div className="text-xs font-medium text-muted-foreground"></div>
          {HOURS.map((hour) => (
            <div key={hour} className="text-[10px] font-medium text-muted-foreground text-center py-1">
              {hour.toString().padStart(2, "0")}
            </div>
          ))}
          <div className="text-[10px] font-medium text-muted-foreground text-center py-1">Total</div>
        </div>

        {/* Data rows */}
        {DAYS.map((day, dayIndex) => (
          <div key={day} className="grid grid-cols-[60px_repeat(24,1fr)_60px] gap-1 mb-1">
            <div className="text-xs font-medium text-muted-foreground flex items-center">
              {day}
            </div>
            {HOURS.map((hour) => {
              const key = `${dayIndex}-${hour}`;
              const point = grid[key];
              const value = point ? getMetricValue(point, metric) : 0;
              const intensity = point ? getIntensity(value) : 0;
              const isSelected = selectedCells?.has(key);

              return (
                <Tooltip key={key}>
                  <TooltipTrigger asChild>
                    <button
                      className={cn(
                        "h-8 rounded transition-all duration-150 flex items-center justify-center",
                        point ? getColor(intensity, isHigherBetter) : "bg-muted/30",
                        isSelected && "ring-2 ring-primary ring-offset-1",
                        onCellClick ? "cursor-pointer hover:opacity-80" : "cursor-default"
                      )}
                      onClick={() => onCellClick?.(hour, dayIndex)}
                    >
                      {point && (
                        <span className={cn(
                          "text-[7px] font-medium leading-none select-none",
                          getTextColor(intensity, isHigherBetter)
                        )}>
                          {formatCellValue(value, metric)}
                        </span>
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    <div className="font-medium">{day} {hour.toString().padStart(2, "0")}:00</div>
                    {point ? (
                      <div className="text-muted-foreground">
                        {metric}: {formatValue(value, metric)}
                      </div>
                    ) : (
                      <div className="text-muted-foreground">No data</div>
                    )}
                    {onCellClick && <div className="text-muted-foreground mt-0.5">Click to select</div>}
                  </TooltipContent>
                </Tooltip>
              );
            })}
            {/* Daily Total */}
            <div className="h-8 rounded bg-muted/50 flex items-center justify-center">
              <span className="text-[7px] font-semibold text-foreground">{formatCellValue(dayTotals[dayIndex], metric)}</span>
            </div>
          </div>
        ))}

        {/* Hourly Total Row */}
        <div className="grid grid-cols-[60px_repeat(24,1fr)_60px] gap-1 mt-1">
          <div className="text-xs font-medium text-muted-foreground flex items-center">Total</div>
          {HOURS.map((hour) => (
            <div key={hour} className="h-8 rounded bg-muted/50 flex items-center justify-center">
              <span className="text-[7px] font-semibold text-foreground">{formatCellValue(hourTotals[hour], metric)}</span>
            </div>
          ))}
          <div className="h-8 rounded bg-muted flex items-center justify-center">
            <span className="text-[7px] font-bold text-foreground">
              {formatCellValue(Object.values(hourTotals).reduce((a, b) => a + b, 0), metric)}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="text-xs text-muted-foreground">
            {isHigherBetter ? "Low" : "High"}
          </span>
          <div className="flex rounded overflow-hidden">
            <div className="h-4 w-8 bg-primary/5" />
            <div className="h-4 w-8 bg-primary/15" />
            <div className="h-4 w-8 bg-primary/30" />
            <div className="h-4 w-8 bg-primary/50" />
            <div className="h-4 w-8 bg-primary/70" />
          </div>
          <span className="text-xs text-muted-foreground">
            {isHigherBetter ? "High" : "Low"}
          </span>
        </div>
      </div>
    </div>
  );
}
