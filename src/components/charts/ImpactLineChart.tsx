import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceArea,
} from "recharts";
import { ImpactComparison } from "@/types/advertising";
import {
  buildImpactSeries,
  DateRange,
  ImpactMetricKey,
  ImpactSeriesPoint,
} from "@/lib/utils/impactSeries";
import { IMPACT_METRIC_OPTIONS } from "@/components/advertising/ImpactMetricMultiSelect";
import { useCurrency } from "@/contexts/CurrencyContext";

interface Props {
  items: ImpactComparison[];
  previous: DateRange;
  impact: DateRange;
  metrics: ImpactMetricKey[];
}

const isRatio = (m: ImpactMetricKey) => m === "ctr" || m === "roas" || m === "acos";

export function ImpactLineChart({ items, previous, impact, metrics }: Props) {
  const { formatCurrency } = useCurrency();
  const data = buildImpactSeries(items, previous, impact, metrics);

  const fmt = (metric: ImpactMetricKey, value: number) => {
    if (value == null || isNaN(value)) return "—";
    if (metric === "adSpend" || metric === "adSales") return formatCurrency(value);
    if (metric === "ctr" || metric === "acos") return `${value.toFixed(2)}%`;
    if (metric === "roas") return value.toFixed(2);
    return new Intl.NumberFormat("en-US").format(Math.round(value));
  };

  const optionFor = (k: ImpactMetricKey) =>
    IMPACT_METRIC_OPTIONS.find((o) => o.key === k);

  // Build min/max for impact ReferenceArea shading
  const impactStartLabel = data.find((d) => d.period === "impact")?.label;
  const impactEndLabel = [...data].reverse().find((d) => d.period === "impact")?.label;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    const point: ImpactSeriesPoint | undefined = payload[0]?.payload;
    if (!point) return null;
    const periodLabel =
      point.period === "previous"
        ? "Previous period"
        : point.period === "impact"
          ? "Impact period"
          : "Gap";
    return (
      <div className="rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-md min-w-[200px]">
        <div className="flex items-center justify-between gap-3 pb-1.5 border-b border-border">
          <span className="font-medium text-foreground">{label}</span>
          <span
            className={
              point.period === "impact"
                ? "text-primary font-medium"
                : "text-muted-foreground"
            }
          >
            {periodLabel}
          </span>
        </div>
        <div className="space-y-1 pt-1.5">
          {metrics.map((m) => {
            const key = `${m}_${point.period}`;
            const v = point[key];
            const opt = optionFor(m);
            return (
              <div key={m} className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: opt?.color }}
                  />
                  {opt?.label}
                </span>
                <span className="font-mono text-foreground">{v != null ? fmt(m, v) : "—"}</span>
              </div>
            );
          })}
        </div>
        {point.contributors && point.contributors.length > 0 && (
          <div className="pt-1.5 mt-1.5 border-t border-border">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">
              Top contributors
            </p>
            <div className="space-y-0.5">
              {point.contributors.slice(0, 4).map((c, i) => (
                <div key={`${c.id}-${c.metric}-${i}`} className="flex items-center justify-between gap-3">
                  <span className="truncate text-foreground max-w-[140px]">{c.name}</span>
                  <span className="font-mono text-muted-foreground">
                    {fmt(c.metric as ImpactMetricKey, c.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!metrics.length || !items.length) {
    return (
      <div className="flex h-[240px] items-center justify-center text-xs text-muted-foreground">
        Select at least one metric and one item to visualize impact.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          interval="preserveStartEnd"
          minTickGap={20}
        />
        <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
        {impactStartLabel && impactEndLabel && (
          <ReferenceArea
            x1={impactStartLabel}
            x2={impactEndLabel}
            fill="hsl(var(--primary))"
            fillOpacity={0.06}
          />
        )}
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: "11px" }} />
        {metrics.map((m) => {
          const opt = optionFor(m);
          const color = opt?.color || "hsl(var(--primary))";
          return [
            <Line
              key={`${m}-prev`}
              type="monotone"
              dataKey={`${m}_previous`}
              name={`${opt?.label} (Previous)`}
              stroke={color}
              strokeOpacity={0.5}
              strokeDasharray="4 4"
              strokeWidth={1.75}
              dot={false}
              connectNulls
              isAnimationActive={false}
            />,
            <Line
              key={`${m}-imp`}
              type="monotone"
              dataKey={`${m}_impact`}
              name={`${opt?.label} (Impact)`}
              stroke={color}
              strokeWidth={2.25}
              dot={false}
              connectNulls
              isAnimationActive={false}
            />,
          ];
        })}
      </LineChart>
    </ResponsiveContainer>
  );
}
