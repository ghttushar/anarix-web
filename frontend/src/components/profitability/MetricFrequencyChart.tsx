import { useState, useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  TrendingUp, BarChart as BarChartIcon, LineChart as LineChartIcon,
  ChevronDown, Check, ArrowUpRight, ArrowDownRight, Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProfitabilitySummary, TrendDataPoint } from "@/types/profitability";
import { cn } from "@/lib/utils";

export type MetricKey =
  | "gmv" | "authSales" | "orders" | "units"
  | "adCost" | "netProfit" | "cogs" | "estPayout"
  | "returns" | "cancelled";

export const METRIC_DEFS: { key: MetricKey; label: string; format: "currency" | "number"; color: string }[] = [
  { key: "gmv",        label: "GMV",          format: "currency", color: "hsl(var(--primary))" },
  { key: "authSales",  label: "Auth Sales",   format: "currency", color: "hsl(var(--chart-2))" },
  { key: "netProfit",  label: "Net Profit",   format: "currency", color: "hsl(var(--chart-3))" },
  { key: "adCost",     label: "Ad Cost",      format: "currency", color: "hsl(var(--chart-4))" },
  { key: "cogs",       label: "COGS",         format: "currency", color: "hsl(var(--chart-5, var(--primary)))" },
  { key: "estPayout",  label: "Est. Payout",  format: "currency", color: "hsl(var(--primary))" },
  { key: "orders",     label: "Orders",       format: "number",   color: "hsl(var(--chart-2))" },
  { key: "units",      label: "Units",        format: "number",   color: "hsl(var(--chart-3))" },
  { key: "returns",    label: "Returns",      format: "number",   color: "hsl(var(--chart-4))" },
  { key: "cancelled",  label: "Cancelled",    format: "number",   color: "hsl(var(--chart-5, var(--primary)))" },
];

export type Frequency = "daily" | "weekly" | "monthly";

const MAX_METRICS = 4;

function getValue(s: ProfitabilitySummary, key: MetricKey): number {
  if (key === "cogs") return s.breakdown.cogs;
  return (s as any)[key] ?? 0;
}

function getDelta(curr: number, prev: number) {
  if (!prev) return { value: 0, trend: "neutral" as const };
  const pct = ((curr - prev) / Math.abs(prev)) * 100;
  if (Math.abs(pct) < 0.1) return { value: 0, trend: "neutral" as const };
  return { value: pct, trend: pct > 0 ? ("up" as const) : ("down" as const) };
}

function DeltaPill({ value, trend }: { value: number; trend: "up" | "down" | "neutral" }) {
  if (trend === "neutral")
    return (
      <span className="text-[10px] text-muted-foreground inline-flex items-center gap-0.5">
        <Minus className="h-2.5 w-2.5" /> 0%
      </span>
    );
  return (
    <span className={cn("text-[10px] font-medium inline-flex items-center gap-0.5", trend === "up" ? "text-success" : "text-destructive")}>
      {trend === "up" ? <ArrowUpRight className="h-2.5 w-2.5" /> : <ArrowDownRight className="h-2.5 w-2.5" />}
      {trend === "up" ? "+" : ""}{value.toFixed(1)}%
    </span>
  );
}

interface Props {
  summary: ProfitabilitySummary;
  compareTo: ProfitabilitySummary;
  trendData: TrendDataPoint[];
  selectedMetrics: MetricKey[];
  onSelectedMetricsChange: (next: MetricKey[]) => void;
  frequency: Frequency;
  onFrequencyChange: (f: Frequency) => void;
  formatCurrency: (v: number) => string;
  contextLabel?: string;
}

export function MetricFrequencyChart({
  summary, compareTo, trendData, selectedMetrics, onSelectedMetricsChange,
  frequency, onFrequencyChange, formatCurrency, contextLabel,
}: Props) {
  const [chartView, setChartView] = useState<"area" | "bar" | "line">("area");
  const [pickerOpen, setPickerOpen] = useState(false);

  // Re-bucket the trend points based on frequency.
  // Source data has weekly-ish points. We approximate buckets by group size.
  const groupSize = frequency === "daily" ? 1 : frequency === "weekly" ? 1 : 4;
  const xLabel = frequency === "daily" ? "Day" : frequency === "weekly" ? "Week" : "Month";

  // Synthesize per-metric series by scaling the trend's order distribution
  // against the summary's actual metric total.
  const chartData = useMemo(() => {
    if (!trendData.length) return [];

    // Group trend data into buckets
    const buckets: { label: string; weight: number }[] = [];
    for (let i = 0; i < trendData.length; i += groupSize) {
      const slice = trendData.slice(i, i + groupSize);
      const weight = slice.reduce((sum, p) => sum + (p.orders || 0), 0);
      const label = frequency === "monthly"
        ? `${xLabel} ${buckets.length + 1}`
        : (slice[0]?.week ?? `${xLabel} ${buckets.length + 1}`);
      buckets.push({ label, weight });
    }

    const totalWeight = buckets.reduce((s, b) => s + b.weight, 0) || 1;

    return buckets.map((b, idx) => {
      const row: Record<string, any> = { label: b.label };
      const share = b.weight / totalWeight;
      selectedMetrics.forEach((m) => {
        const total = getValue(summary, m);
        row[m] = +(total * share).toFixed(2);
      });
      return row;
    });
  }, [trendData, groupSize, frequency, selectedMetrics, summary, xLabel]);

  const tooltipStyle = {
    backgroundColor: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "8px",
    fontSize: "11px",
  };

  const formatValue = (key: MetricKey, val: number) => {
    const def = METRIC_DEFS.find((d) => d.key === key);
    if (def?.format === "currency") return formatCurrency(val);
    return val.toLocaleString();
  };

  const toggleMetric = (key: MetricKey) => {
    if (selectedMetrics.includes(key)) {
      onSelectedMetricsChange(selectedMetrics.filter((m) => m !== key));
    } else if (selectedMetrics.length < MAX_METRICS) {
      onSelectedMetricsChange([...selectedMetrics, key]);
    }
  };

  const renderChart = (height: number) => {
    const commonAxes = (
      <>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" opacity={0.5} />
        <XAxis dataKey="label" tick={{ fontSize: 10 }} className="text-muted-foreground" tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 10 }} className="text-muted-foreground" tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(val: number, name: string) => {
            const def = METRIC_DEFS.find((d) => d.key === name);
            return [def?.format === "currency" ? formatCurrency(val) : val.toLocaleString(), def?.label ?? name];
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: "10px" }}
          formatter={(value: string) => METRIC_DEFS.find((d) => d.key === value)?.label ?? value}
        />
      </>
    );

    return (
      <ResponsiveContainer width="100%" height={height}>
        {chartView === "bar" ? (
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            {commonAxes}
            {selectedMetrics.map((m) => {
              const def = METRIC_DEFS.find((d) => d.key === m)!;
              return <Bar key={m} dataKey={m} fill={def.color} radius={[2, 2, 0, 0]} />;
            })}
          </BarChart>
        ) : chartView === "line" ? (
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            {commonAxes}
            {selectedMetrics.map((m) => {
              const def = METRIC_DEFS.find((d) => d.key === m)!;
              return <Line key={m} type="monotone" dataKey={m} stroke={def.color} strokeWidth={1.5} dot={false} />;
            })}
          </LineChart>
        ) : (
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            {commonAxes}
            {selectedMetrics.map((m) => {
              const def = METRIC_DEFS.find((d) => d.key === m)!;
              return (
                <Area
                  key={m} type="monotone" dataKey={m}
                  stroke={def.color} fill={def.color} fillOpacity={0.08} strokeWidth={1.5}
                />
              );
            })}
          </AreaChart>
        )}
      </ResponsiveContainer>
    );
  };

  return (
    <div className="rounded-lg border border-border bg-card p-3 min-w-0">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          <h4 className="text-xs font-semibold text-foreground whitespace-nowrap">Performance Trend</h4>
          {contextLabel && (
            <span className="text-[10px] text-muted-foreground truncate">· {contextLabel}</span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Metric multi-select */}
          <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 text-[11px]">
                Metrics ({selectedMetrics.length}/{MAX_METRICS})
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-56 p-1">
              <div className="px-2 py-1.5 text-[10px] text-muted-foreground border-b border-border mb-1">
                Up to {MAX_METRICS} metrics
              </div>
              {METRIC_DEFS.map((def) => {
                const checked = selectedMetrics.includes(def.key);
                const disabled = !checked && selectedMetrics.length >= MAX_METRICS;
                return (
                  <button
                    key={def.key}
                    type="button"
                    disabled={disabled}
                    onClick={() => toggleMetric(def.key)}
                    className={cn(
                      "w-full flex items-center justify-between px-2 py-1.5 rounded text-[11px] text-left transition-colors",
                      checked ? "bg-primary/10 text-foreground" : "hover:bg-muted",
                      disabled && "opacity-40 cursor-not-allowed",
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ background: def.color }} />
                      {def.label}
                    </span>
                    {checked && <Check className="h-3 w-3 text-primary" />}
                  </button>
                );
              })}
            </PopoverContent>
          </Popover>

          {/* Frequency */}
          <Select value={frequency} onValueChange={(v) => onFrequencyChange(v as Frequency)}>
            <SelectTrigger className="h-7 text-[11px] w-[110px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily" className="text-[11px]">Daily</SelectItem>
              <SelectItem value="weekly" className="text-[11px]">Weekly</SelectItem>
              <SelectItem value="monthly" className="text-[11px]">Monthly</SelectItem>
            </SelectContent>
          </Select>

          {/* Chart view */}
          <div className="flex items-center gap-0.5 rounded-md border border-border p-0.5">
            <Button variant={chartView === "area" ? "secondary" : "ghost"} size="sm" className="h-6 w-6 p-0" onClick={() => setChartView("area")} title="Area">
              <TrendingUp className="h-3 w-3" />
            </Button>
            <Button variant={chartView === "bar" ? "secondary" : "ghost"} size="sm" className="h-6 w-6 p-0" onClick={() => setChartView("bar")} title="Bar">
              <BarChartIcon className="h-3 w-3" />
            </Button>
            <Button variant={chartView === "line" ? "secondary" : "ghost"} size="sm" className="h-6 w-6 p-0" onClick={() => setChartView("line")} title="Line">
              <LineChartIcon className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Chart */}
      {selectedMetrics.length === 0 ? (
        <div className="h-[220px] flex items-center justify-center text-xs text-muted-foreground">
          Select at least one metric to display the chart.
        </div>
      ) : (
        renderChart(220)
      )}

      {/* Metric legend strip below chart */}
      {selectedMetrics.length > 0 && (
        <div className="border-t border-border/50 mt-3 pt-3 grid gap-2" style={{ gridTemplateColumns: `repeat(${selectedMetrics.length}, minmax(0, 1fr))` }}>
          {selectedMetrics.map((m) => {
            const def = METRIC_DEFS.find((d) => d.key === m)!;
            const curr = getValue(summary, m);
            const prev = getValue(compareTo, m);
            const d = getDelta(curr, prev);
            return (
              <div key={m} className="rounded-md border border-border/50 px-2.5 py-2 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ background: def.color }} />
                  <span className="text-[10px] text-muted-foreground truncate">{def.label}</span>
                </div>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-sm font-semibold text-foreground tabular-nums truncate">
                    {formatValue(m, curr)}
                  </span>
                  <DeltaPill value={d.value} trend={d.trend} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
