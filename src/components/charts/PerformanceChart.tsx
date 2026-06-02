import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { ChartDataPoint, MetricKey } from "@/types/campaign";
import { METRIC_CONFIGS, MAX_VISIBLE_METRICS, DEFAULT_SELECTED_METRICS } from "@/lib/constants/chartColors";
import { ChartContainer, ChartType, ChartMetric } from "./ChartContainer";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { mockCampaigns } from "@/data/mockCampaigns";
import { ExternalLink } from "lucide-react";

interface PerformanceChartProps {
  data: ChartDataPoint[];
  title?: string;
  showImpact?: boolean;
  onShowImpactChange?: (value: boolean) => void;
  selectedMetrics?: MetricKey[];
  onSelectedMetricsChange?: (next: MetricKey[]) => void;
}

const IMPACT_MULTIPLIERS: Record<string, number> = {
  spend: 0.85,
  sales: 1.12,
  impressions: 0.92,
  clicks: 1.08,
  roas: 1.15,
  acos: 0.88,
  cpc: 0.95,
  orders: 1.05,
  ctr: 1.03,
};

function formatTooltipValue(value: number, format: string): string {
  switch (format) {
    case "currency":
      return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    case "number":
      return value.toLocaleString("en-US");
    case "percentage":
      return `${value.toFixed(2)}%`;
    case "decimal":
      return value.toFixed(2);
    default:
      return String(value);
  }
}

export function PerformanceChart({ data, title = "Performance Overview", showImpact = false, onShowImpactChange, selectedMetrics: selectedMetricsProp, onSelectedMetricsChange }: PerformanceChartProps) {
  const navigate = useNavigate();
  const [internalSelected, setInternalSelected] = useState<MetricKey[]>(DEFAULT_SELECTED_METRICS);
  const selectedMetrics = selectedMetricsProp ?? internalSelected;
  const setSelectedMetrics = (next: MetricKey[]) => {
    if (onSelectedMetricsChange) onSelectedMetricsChange(next);
    else setInternalSelected(next);
  };
  const [chartType, setChartType] = useState<ChartType>("line");

  const chartData = showImpact
    ? data.map((point) => {
        const impactPoint: Record<string, any> = { ...point };
        selectedMetrics.forEach((key) => {
          const val = point[key as keyof typeof point];
          if (typeof val === "number") {
            impactPoint[`${key}_impact`] = +(val * (IMPACT_MULTIPLIERS[key] || 1)).toFixed(2);
          }
        });
        return impactPoint;
      })
    : data;

  const handleMetricToggle = (metricKey: string) => {
    const key = metricKey as MetricKey;
    if (selectedMetrics.includes(key)) {
      setSelectedMetrics(selectedMetrics.filter((m) => m !== key));
    } else if (selectedMetrics.length >= MAX_VISIBLE_METRICS) {
      setSelectedMetrics([...selectedMetrics.slice(1), key]);
    } else {
      setSelectedMetrics([...selectedMetrics, key]);
    }
  };

  const metrics: ChartMetric[] = METRIC_CONFIGS.map((m) => ({
    key: m.key,
    label: m.label,
    color: m.color,
    active: selectedMetrics.includes(m.key),
  }));

  const selectedConfigs = METRIC_CONFIGS.filter((m) => selectedMetrics.includes(m.key));
  const hasLeftAxis = selectedConfigs.some((m) => m.yAxisId === "left");
  const hasRightAxis = selectedConfigs.some((m) => m.yAxisId === "right");

  // Build top-3 / bottom-2 contributors for the Show Impact tooltip
  const contributors = (() => {
    const sorted = [...mockCampaigns].sort((a, b) => b.spend - a.spend);
    const top3 = sorted.slice(0, 3);
    const bottom2 = sorted.slice(-2).reverse();
    return { top3, bottom2 };
  })();

  const ImpactTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-md min-w-[260px]">
        <div className="flex items-center justify-between gap-3 pb-1.5 border-b border-border">
          <span className="font-medium text-foreground">{label}</span>
          <span className="text-primary font-medium">Show Impact</span>
        </div>
        <div className="space-y-1 pt-1.5">
          {payload.map((p: any) => {
            const config = METRIC_CONFIGS.find((m) => m.key === p.name || m.key === p.dataKey?.replace?.("_impact", ""));
            return (
              <div key={p.dataKey} className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
                  {config?.label || p.name}
                </span>
                <span className="font-mono text-foreground">{formatTooltipValue(p.value, config?.format || "number")}</span>
              </div>
            );
          })}
        </div>
        <div className="pt-2 mt-2 border-t border-border space-y-1.5">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">Top 3 campaigns</p>
            {contributors.top3.map((c) => (
              <div key={c.id} className="flex items-center justify-between gap-2">
                <span className="truncate text-foreground max-w-[170px]">{c.name}</span>
                <span className="font-mono text-success">${c.spend.toFixed(0)}</span>
              </div>
            ))}
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">Bottom 2 campaigns</p>
            {contributors.bottom2.map((c) => (
              <div key={c.id} className="flex items-center justify-between gap-2">
                <span className="truncate text-foreground max-w-[170px]">{c.name}</span>
                <span className="font-mono text-muted-foreground">${c.spend.toFixed(0)}</span>
              </div>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); navigate(`/advertising/impact?date=${encodeURIComponent(label)}`); }}
          className="mt-2 w-full inline-flex items-center justify-center gap-1.5 rounded-md border border-primary/30 bg-primary/5 px-2 py-1 text-[11px] font-medium text-primary hover:bg-primary/10 transition-colors cursor-pointer"
        >
          <ExternalLink className="h-3 w-3" /> View in Table
        </button>
      </div>
    );
  };

  const tooltipConfig = {
    contentStyle: {
      backgroundColor: "hsl(var(--card))",
      border: "1px solid hsl(var(--border))",
      borderRadius: "8px",
    },
    labelStyle: { color: "hsl(var(--foreground))" },
    formatter: (value: number, name: string) => {
      const config = METRIC_CONFIGS.find((m) => m.key === name);
      return [formatTooltipValue(value, config?.format || "number"), config?.label || name];
    },
  };

  const tooltipNode = showImpact ? <Tooltip content={<ImpactTooltip />} /> : <Tooltip {...tooltipConfig} />;

  const impactControl = onShowImpactChange ? (
    <div className="flex items-center gap-2">
      <Switch
        id="show-impact-chart"
        checked={showImpact}
        onCheckedChange={onShowImpactChange}
        className="h-4 w-8 [&>span]:h-3 [&>span]:w-3 [&>span]:data-[state=checked]:translate-x-4"
      />
      <Label htmlFor="show-impact-chart" className="text-[11px] font-medium text-muted-foreground cursor-pointer whitespace-nowrap">
        Show Impact
      </Label>
    </div>
  ) : undefined;

  const renderChart = (height: number) => (
    <ResponsiveContainer width="100%" height={height}>
      {chartType === "bar" ? (
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} className="text-muted-foreground" />
          <Tooltip {...tooltipConfig} />
          <Legend />
          {selectedConfigs.map((config) => (
            <Bar key={config.key} dataKey={config.key} name={config.key} fill={config.color} radius={[3, 3, 0, 0]} />
          ))}
          {showImpact && selectedConfigs.map((config) => (
            <Bar key={`${config.key}_impact`} dataKey={`${config.key}_impact`} name={`${config.label} (Impact)`} fill={config.color} fillOpacity={0.4} radius={[3, 3, 0, 0]} />
          ))}
        </BarChart>
      ) : chartType === "area" ? (
        <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} className="text-muted-foreground" />
          {hasLeftAxis && <YAxis yAxisId="left" orientation="left" tick={{ fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} className="text-muted-foreground" />}
          {hasRightAxis && <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} className="text-muted-foreground" />}
          <Tooltip {...tooltipConfig} />
          <Legend />
          {selectedConfigs.map((config) => (
            <Area key={config.key} type="monotone" dataKey={config.key} name={config.key} stroke={config.color} fill={config.color} fillOpacity={0.15} yAxisId={config.yAxisId || "left"} strokeWidth={2} />
          ))}
          {showImpact && selectedConfigs.map((config) => (
            <Area key={`${config.key}_impact`} type="monotone" dataKey={`${config.key}_impact`} name={`${config.label} (Impact)`} stroke={config.color} fill={config.color} fillOpacity={0.05} yAxisId={config.yAxisId || "left"} strokeWidth={1.5} strokeDasharray="5 3" />
          ))}
        </AreaChart>
      ) : (
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} className="text-muted-foreground" />
          {hasLeftAxis && <YAxis yAxisId="left" orientation="left" tick={{ fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} className="text-muted-foreground" />}
          {hasRightAxis && <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} className="text-muted-foreground" />}
          <Tooltip {...tooltipConfig} />
          <Legend />
          {selectedConfigs.map((config) => (
            <Line key={config.key} type="monotone" dataKey={config.key} name={config.key} stroke={config.color} yAxisId={config.yAxisId || "left"} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
          ))}
          {showImpact && selectedConfigs.map((config) => (
            <Line key={`${config.key}_impact`} type="monotone" dataKey={`${config.key}_impact`} name={`${config.label} (Impact)`} stroke={config.color} yAxisId={config.yAxisId || "left"} strokeWidth={1.5} strokeDasharray="5 3" dot={false} />
          ))}
        </LineChart>
      )}
    </ResponsiveContainer>
  );

  return (
    <ChartContainer
      title={title}
      metrics={metrics}
      onMetricToggle={handleMetricToggle}
      chartType={chartType}
      onChartTypeChange={setChartType}
      extraControls={impactControl}
      expandedChildren={renderChart(500)}
    >
      {renderChart(300)}
    </ChartContainer>
  );
}
