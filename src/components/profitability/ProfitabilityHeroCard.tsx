import { useState, useMemo } from "react";
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  LineChart as LineChartIcon, BarChart as BarChartIcon,
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package,
  BarChart3, Eye, ChevronRight, ArrowUpRight, ArrowDownRight,
  Minus, Target, Percent, Layers, CalendarIcon, Sparkles,
  Maximize2, Minimize2, Download,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { BarChart, Bar, LineChart, Line } from "recharts";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ProfitabilitySummary, TrendDataPoint } from "@/types/profitability";
import { MorphingNumber } from "@/features/creative/MorphingNumber";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useCurrency } from "@/contexts/CurrencyContext";

interface ProfitabilityHeroCardProps {
  summaries: ProfitabilitySummary[];
  trendDataByPeriod: Record<string, TrendDataPoint[]>;
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
  onViewBreakdown?: (summary: ProfitabilitySummary) => void;
}

const PIE_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
];

const ACCENT_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5, var(--primary)))",
];

/* ── Helpers ── */

function getDelta(current: number, previous: number): { value: number; trend: "up" | "down" | "neutral" } {
  if (previous === 0) return { value: 0, trend: "neutral" };
  const pct = ((current - previous) / Math.abs(previous)) * 100;
  if (Math.abs(pct) < 0.1) return { value: 0, trend: "neutral" };
  return { value: pct, trend: pct > 0 ? "up" : "down" };
}

function DeltaIndicator({ value, trend, className }: { value: number; trend: string; className?: string }) {
  if (trend === "neutral") return <span className={cn("text-[10px] text-muted-foreground flex items-center gap-0.5", className)}><Minus className="h-2.5 w-2.5" /> 0%</span>;
  return (
    <span className={cn("text-[10px] font-medium flex items-center gap-0.5", trend === "up" ? "text-success" : "text-destructive", className)}>
      {trend === "up" ? <ArrowUpRight className="h-2.5 w-2.5" /> : <ArrowDownRight className="h-2.5 w-2.5" />}
      {trend === "up" ? "+" : ""}{value.toFixed(1)}%
    </span>
  );
}

/* ── Per-Card Date Picker ── */
function CardDatePicker({
  frequency, date, onDateChange,
}: {
  frequency: "daily" | "monthly";
  date: Date;
  onDateChange: (d: Date) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground"
          onClick={(e) => e.stopPropagation()}
        >
          <CalendarIcon className="h-3 w-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start" onClick={(e) => e.stopPropagation()}>
        {frequency === "daily" ? (
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => d && onDateChange(d)}
            className="p-3 pointer-events-auto"
          />
        ) : (
          <div className="p-4 space-y-3">
            <p className="text-xs font-medium text-muted-foreground">Select Month</p>
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 12 }, (_, i) => {
                const isSelected = i === date.getMonth();
                return (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); onDateChange(new Date(date.getFullYear(), i, 1)); }}
                    className={cn(
                      "px-3 py-2 text-xs rounded-md transition-colors",
                      isSelected ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"
                    )}
                  >
                    {format(new Date(2024, i, 1), "MMM")}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

/* ── Summary Card ── */
function SummaryCard({
  summary,
  label,
  compareTo,
  accentColor,
  formatCurrency,
  frequency,
  date,
  onDateChange,
  onViewMore,
  isSelected,
  onSelect,
}: {
  summary: ProfitabilitySummary;
  label: string;
  compareTo: ProfitabilitySummary;
  accentColor: string;
  formatCurrency: (v: number) => string;
  frequency: "daily" | "monthly";
  date: Date;
  onDateChange: (d: Date) => void;
  onViewMore?: () => void;
  isSelected?: boolean;
  onSelect?: () => void;
}) {
  const profitMargin = summary.gmv > 0 ? (summary.netProfit / summary.gmv) * 100 : 0;
  const netDelta = getDelta(summary.netProfit, compareTo.netProfit);

  const metrics = [
    { label: "GMV", value: summary.gmv, fmt: "currency" as const },
    { label: "Orders", value: summary.orders, fmt: "number" as const },
    { label: "Auth Sales", value: summary.authSales, fmt: "currency" as const },
    { label: "Ad Cost", value: summary.adCost, fmt: "currency" as const },
    { label: "Units", value: summary.units, fmt: "number" as const },
    { label: "Est. Payout", value: summary.estPayout, fmt: "currency" as const },
  ];

  return (
    <div
      onClick={onSelect}
      className={cn(
        "rounded-lg bg-card overflow-hidden flex flex-col min-w-0 cursor-pointer transition-all",
        isSelected ? "ring-2 ring-primary border-primary shadow-md border" : "border border-border"
      )}
      style={{ borderLeftWidth: 3, borderLeftColor: accentColor }}
    >
      <div className="px-3 pt-3 pb-2">
        <div className="flex items-center gap-1.5">
          <h4 className="text-xs font-semibold text-foreground truncate">{label}</h4>
          <CardDatePicker frequency={frequency} date={date} onDateChange={onDateChange} />
        </div>
        {summary.dateRange && (
          <p className="text-[10px] text-muted-foreground mt-0.5">{summary.dateRange}</p>
        )}
      </div>

      <div className="px-3 pb-2">
        <div className="rounded-md bg-muted/30 px-3 py-2">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold text-foreground">
              <MorphingNumber value={summary.netProfit} format="currency" decimals={0} />
            </span>
            <DeltaIndicator value={netDelta.value} trend={netDelta.trend} />
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-[10px] text-muted-foreground">Margin</span>
            <span className={cn("text-[10px] font-medium", profitMargin > 20 ? "text-success" : profitMargin > 10 ? "text-foreground" : "text-destructive")}>
              {profitMargin.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 px-3 pb-3 border-t border-border/50 pt-2">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-md border border-border/50 px-2.5 py-2">
            <p className="text-[10px] text-muted-foreground">{m.label}</p>
            <p className="text-[11px] font-semibold text-foreground mt-0.5">
              {m.fmt === "currency" ? formatCurrency(m.value) : m.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {onViewMore && (
        <div className="mt-auto border-t border-border/50 px-3 py-1.5">
          <button
            onClick={(e) => { e.stopPropagation(); onViewMore(); }}
            className="flex items-center gap-0.5 text-[10px] font-medium text-primary hover:text-primary/80 transition-colors"
          >
            View More <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Forecast Card ── */
function ForecastCard({
  baseSummary,
  formatCurrency,
  isSelected,
  onSelect,
}: {
  baseSummary: ProfitabilitySummary;
  formatCurrency: (v: number) => string;
  isSelected?: boolean;
  onSelect?: () => void;
}) {
  const projectionMultiplier = 1.67;
  const estProfit = baseSummary.netProfit * projectionMultiplier;
  const estGMV = baseSummary.gmv * projectionMultiplier;
  const estOrders = Math.round(baseSummary.orders * projectionMultiplier);
  const estUnits = Math.round(baseSummary.units * projectionMultiplier);
  const estPayout = baseSummary.estPayout * projectionMultiplier;
  const confidence = 78;

  const metrics = [
    { label: "Est. GMV", value: formatCurrency(estGMV) },
    { label: "Est. Orders", value: estOrders.toLocaleString() },
    { label: "Est. Units", value: estUnits.toLocaleString() },
    { label: "Est. Payout", value: formatCurrency(estPayout) },
    { label: "Confidence", value: `${confidence}%` },
    { label: "Multiplier", value: `${projectionMultiplier}x` },
  ];

  return (
    <div
      onClick={onSelect}
      className={cn(
        "rounded-lg border-dashed bg-card/50 overflow-hidden flex flex-col min-w-0 cursor-pointer transition-all",
        isSelected ? "ring-2 ring-primary border-primary shadow-md border" : "border border-border"
      )}
    >
      <div className="px-3 pt-3 pb-2">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-primary" />
          <h4 className="text-xs font-semibold text-foreground">Forecast</h4>
        </div>
        <p className="text-[10px] text-muted-foreground mt-0.5">Projected end-of-period</p>
      </div>

      <div className="px-3 pb-2">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-semibold text-foreground">
            <MorphingNumber value={estProfit} format="currency" decimals={0} />
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground">Est. Net Profit</span>
      </div>

      <div className="grid grid-cols-3 gap-2 px-3 pb-3 border-t border-border/50 pt-2">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-md border border-border/50 px-2.5 py-2">
            <p className="text-[10px] text-muted-foreground">{m.label}</p>
            <p className="text-[11px] font-semibold text-foreground mt-0.5">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-auto px-3 pb-3 pt-1">
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-primary/60 transition-all" style={{ width: `${confidence}%` }} />
        </div>
      </div>
    </div>
  );
}

/* ── Comparison Chart (full-width) ── */
function ComparisonChart({
  datasets,
}: {
  datasets: { data: TrendDataPoint[]; label: string; color: string; dashed?: boolean }[];
}) {
  const [chartView, setChartView] = useState<"area" | "bar" | "line">("area");
  const [expanded, setExpanded] = useState(false);

  const maxLen = Math.max(...datasets.map(d => d.data.length));
  const combined = Array.from({ length: maxLen }, (_, i) => {
    const row: Record<string, any> = { label: datasets[0]?.data[i]?.week ?? `W${i + 1}` };
    datasets.forEach(ds => {
      row[ds.label] = ds.data[i]?.orders ?? 0;
    });
    return row;
  });

  const tooltipStyle = { backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "11px" };

  const renderChart = (height: number) => (
    <ResponsiveContainer width="100%" height={height}>
      {chartView === "bar" ? (
        <BarChart data={combined} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" opacity={0.5} />
          <XAxis dataKey="label" tick={{ fontSize: 10 }} className="text-muted-foreground" tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 10 }} className="text-muted-foreground" tickLine={false} axisLine={false} />
          <Tooltip contentStyle={tooltipStyle} />
          {datasets.map((ds) => (
            <Bar key={ds.label} dataKey={ds.label} fill={ds.color} radius={[2, 2, 0, 0]} opacity={ds.dashed ? 0.5 : 1} />
          ))}
          <Legend wrapperStyle={{ fontSize: "10px" }} />
        </BarChart>
      ) : chartView === "line" ? (
        <LineChart data={combined} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" opacity={0.5} />
          <XAxis dataKey="label" tick={{ fontSize: 10 }} className="text-muted-foreground" tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 10 }} className="text-muted-foreground" tickLine={false} axisLine={false} />
          <Tooltip contentStyle={tooltipStyle} />
          {datasets.map((ds) => (
            <Line key={ds.label} type="monotone" dataKey={ds.label} stroke={ds.color} strokeWidth={1.5} strokeDasharray={ds.dashed ? "5 3" : undefined} dot={false} />
          ))}
          <Legend wrapperStyle={{ fontSize: "10px" }} />
        </LineChart>
      ) : (
        <AreaChart data={combined} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" opacity={0.5} />
          <XAxis dataKey="label" tick={{ fontSize: 10 }} className="text-muted-foreground" tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 10 }} className="text-muted-foreground" tickLine={false} axisLine={false} />
          <Tooltip contentStyle={tooltipStyle} />
          {datasets.map((ds) => (
            <Area key={ds.label} type="monotone" dataKey={ds.label} stroke={ds.color} fill={ds.color} fillOpacity={0.06} strokeWidth={1.5} strokeDasharray={ds.dashed ? "5 3" : undefined} />
          ))}
          <Legend wrapperStyle={{ fontSize: "10px" }} />
        </AreaChart>
      )}
    </ResponsiveContainer>
  );

  const toolbar = (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5 rounded-md border border-border p-0.5">
        <Button variant={chartView === "area" ? "secondary" : "ghost"} size="sm" className="h-6 w-6 p-0" onClick={() => setChartView("area")} title="Area chart">
          <TrendingUp className="h-3 w-3" />
        </Button>
        <Button variant={chartView === "bar" ? "secondary" : "ghost"} size="sm" className="h-6 w-6 p-0" onClick={() => setChartView("bar")} title="Bar chart">
          <BarChartIcon className="h-3 w-3" />
        </Button>
        <Button variant={chartView === "line" ? "secondary" : "ghost"} size="sm" className="h-6 w-6 p-0" onClick={() => setChartView("line")} title="Line chart">
          <LineChartIcon className="h-3 w-3" />
        </Button>
      </div>
      <div className="w-px h-4 bg-border mx-0.5" />
      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => toast.success("Exporting chart...")} title="Export chart">
        <Download className="h-3.5 w-3.5" />
      </Button>
      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setExpanded(!expanded)} title="Expand">
        {expanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
      </Button>
    </div>
  );

  return (
    <>
      <div className="rounded-lg border border-border bg-card p-3 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-semibold text-foreground">Trend Comparison</h4>
          {toolbar}
        </div>
        {renderChart(220)}
      </div>

      <Dialog open={expanded} onOpenChange={setExpanded}>
        <DialogContent className="max-w-4xl w-[90vw]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Trend Comparison</h3>
            {toolbar}
          </div>
          {renderChart(400)}
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ── Main Exported Component ── */
export function ProfitabilityHeroCard({
  summaries, trendDataByPeriod, selectedPeriod, onPeriodChange, onViewBreakdown,
}: ProfitabilityHeroCardProps) {
  const { formatCurrency } = useCurrency();
  const [activeView, setActiveView] = useState<"overview" | "breakdown" | "efficiency">("overview");
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);

  // Per-card dates
  const [todayDate, setTodayDate] = useState<Date>(new Date());
  const [yesterdayDate, setYesterdayDate] = useState<Date>(() => new Date(Date.now() - 86400000));
  const [thisMonthDate, setThisMonthDate] = useState<Date>(new Date());
  const [lastMonthDate, setLastMonthDate] = useState<Date>(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d;
  });

  // Fixed period mapping
  const todaySummary = summaries.find(s => s.period === "today") || summaries[0];
  const yesterdaySummary = summaries.find(s => s.period === "yesterday") || summaries[1] || summaries[0];
  const thisMonthSummary = summaries.find(s => s.period === "this_month") || summaries[2] || summaries[0];
  const lastMonthSummary = summaries.find(s => s.period === "last_month") || summaries[3] || summaries[0];

  const todayTrend = trendDataByPeriod["today"] || trendDataByPeriod["this_month"] || [];
  const yesterdayTrend = trendDataByPeriod["yesterday"] || trendDataByPeriod["last_month"] || [];
  const thisMonthTrend = trendDataByPeriod["this_month"] || [];
  const lastMonthTrend = trendDataByPeriod["last_month"] || trendDataByPeriod["this_month"] || [];

  const forecastTrend = useMemo(() => {
    return thisMonthTrend.map(d => ({ ...d, orders: Math.round(d.orders * 1.67), units: Math.round(d.units * 1.67) }));
  }, [thisMonthTrend]);

  const primarySummary = todaySummary;
  const secondarySummary = yesterdaySummary;

  const profitMargin = primarySummary.gmv > 0 ? (primarySummary.netProfit / primarySummary.gmv) * 100 : 0;
  const prevMargin = secondarySummary.gmv > 0 ? (secondarySummary.netProfit / secondarySummary.gmv) * 100 : 0;

  const salesBreakdown = useMemo(() => [
    { name: "Organic", value: primarySummary.breakdown.organic },
    { name: "SP", value: primarySummary.breakdown.sponsoredProducts },
    { name: "SB", value: primarySummary.breakdown.sponsoredBrands },
    { name: "SV", value: primarySummary.breakdown.sponsoredVideo },
  ], [primarySummary]);

  const totalAdSales = primarySummary.breakdown.sponsoredProducts + primarySummary.breakdown.sponsoredBrands + primarySummary.breakdown.sponsoredVideo;
  const organicRatio = primarySummary.gmv > 0 ? (primarySummary.breakdown.organic / primarySummary.gmv) * 100 : 0;

  const views = [
    { key: "overview", label: "Overview" },
    { key: "breakdown", label: "Sales Mix" },
    { key: "efficiency", label: "Efficiency" },
  ];

  const cardConfigs = [
    { summary: todaySummary, label: format(todayDate, "MMM dd, yyyy"), compareTo: yesterdaySummary, accent: ACCENT_COLORS[0], freq: "daily" as const, date: todayDate, setDate: setTodayDate },
    { summary: yesterdaySummary, label: format(yesterdayDate, "MMM dd, yyyy"), compareTo: todaySummary, accent: ACCENT_COLORS[1], freq: "daily" as const, date: yesterdayDate, setDate: setYesterdayDate },
    { summary: thisMonthSummary, label: format(thisMonthDate, "MMMM yyyy"), compareTo: lastMonthSummary, accent: ACCENT_COLORS[2], freq: "monthly" as const, date: thisMonthDate, setDate: setThisMonthDate },
    { summary: lastMonthSummary, label: format(lastMonthDate, "MMMM yyyy"), compareTo: thisMonthSummary, accent: ACCENT_COLORS[3], freq: "monthly" as const, date: lastMonthDate, setDate: setLastMonthDate },
  ];

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="flex items-center gap-0.5 bg-muted rounded-md p-0.5">
          {views.map((v) => (
            <button
              key={v.key}
              onClick={() => setActiveView(v.key as typeof activeView)}
              className={cn(
                "px-2 py-1 text-[11px] font-medium rounded transition-all",
                activeView === v.key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {v.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => onViewBreakdown?.(primarySummary)}
          className="flex items-center justify-center h-6 w-6 rounded-full text-primary hover:bg-primary/10 transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Body */}
      <div className="p-3 space-y-3">
        {activeView === "overview" && (
          <>
            {/* 5 cards */}
            <div className="grid grid-cols-5 xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 gap-3">
              {cardConfigs.map((cfg, i) => (
                <SummaryCard
                  key={i}
                  summary={cfg.summary}
                  label={cfg.label}
                  compareTo={cfg.compareTo}
                  accentColor={cfg.accent}
                  formatCurrency={formatCurrency}
                  frequency={cfg.freq}
                  date={cfg.date}
                  onDateChange={cfg.setDate}
                  onViewMore={() => onViewBreakdown?.(cfg.summary)}
                  isSelected={selectedCardIndex === i}
                  onSelect={() => setSelectedCardIndex(i)}
                />
              ))}
              <ForecastCard
                baseSummary={thisMonthSummary}
                formatCurrency={formatCurrency}
                isSelected={selectedCardIndex === 4}
                onSelect={() => setSelectedCardIndex(4)}
              />
            </div>

            {/* Full-width chart */}
            <ComparisonChart
              datasets={[
                { data: todayTrend, label: "Today", color: ACCENT_COLORS[0] },
                { data: yesterdayTrend, label: "Yesterday", color: ACCENT_COLORS[1] },
                { data: thisMonthTrend, label: "This Month", color: ACCENT_COLORS[2] },
                { data: lastMonthTrend, label: "Last Month", color: ACCENT_COLORS[3] },
                { data: forecastTrend, label: "Forecast", color: ACCENT_COLORS[4], dashed: true },
              ]}
            />
          </>
        )}

        {activeView === "breakdown" && (
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4 flex flex-col items-center justify-center">
              <div className="text-xs text-muted-foreground font-medium mb-2">Sales Channel Mix</div>
              <div className="h-[140px] w-[140px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={salesBreakdown} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={3} dataKey="value" stroke="none">
                      {salesBreakdown.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                    </Pie>
                    <Tooltip formatter={(val: number) => [`$${val.toLocaleString()}`, ""]} contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "11px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center mt-1">
                <div className="text-base font-semibold text-foreground">{organicRatio.toFixed(0)}%</div>
                <div className="text-[10px] text-muted-foreground">Organic</div>
              </div>
            </div>
            <div className="col-span-8 space-y-2">
              <div className="text-xs text-muted-foreground font-medium mb-2">Channel Breakdown</div>
              {salesBreakdown.map((channel, i) => {
                const pct = primarySummary.gmv > 0 ? (channel.value / primarySummary.gmv) * 100 : 0;
                return (
                  <div key={channel.name} className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ background: PIE_COLORS[i] }} />
                    <span className="text-[11px] text-foreground w-16">{channel.name}</span>
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: PIE_COLORS[i] }} />
                    </div>
                    <span className="text-[11px] font-medium text-foreground w-20 text-right">${channel.value.toLocaleString()}</span>
                    <span className="text-[10px] text-muted-foreground w-10 text-right">{pct.toFixed(1)}%</span>
                  </div>
                );
              })}
              <div className="border-t border-border pt-2 mt-2 grid grid-cols-3 gap-2">
                <div className="rounded-md border border-border/50 px-2 py-1.5">
                  <div className="text-[10px] text-muted-foreground">Total Ad Sales</div>
                  <div className="text-xs font-semibold text-foreground">${totalAdSales.toLocaleString()}</div>
                </div>
                <div className="rounded-md border border-border/50 px-2 py-1.5">
                  <div className="text-[10px] text-muted-foreground">Ad Cost</div>
                  <div className="text-xs font-semibold text-foreground">${primarySummary.adCost.toLocaleString()}</div>
                </div>
                <div className="rounded-md border border-border/50 px-2 py-1.5">
                  <div className="text-[10px] text-muted-foreground">COGS</div>
                  <div className="text-xs font-semibold text-foreground">${primarySummary.breakdown.cogs.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === "efficiency" && (
          <div className="grid grid-cols-4 gap-3">
            <div className="rounded-md border border-border/50 p-3 flex flex-col items-center text-center">
              <Target className="h-4 w-4 text-primary mb-1.5" />
              <div className="text-[10px] text-muted-foreground mb-0.5">ROAS</div>
              <div className="text-xl font-semibold text-foreground">{primarySummary.breakdown.roas.toFixed(1)}x</div>
              <DeltaIndicator {...getDelta(primarySummary.breakdown.roas, secondarySummary.breakdown.roas)} className="mt-0.5" />
              <div className="text-[10px] text-muted-foreground mt-1">Return on Ad Spend</div>
            </div>
            <div className="rounded-md border border-border/50 p-3 flex flex-col items-center text-center">
              <Percent className="h-4 w-4 text-chart-2 mb-1.5" />
              <div className="text-[10px] text-muted-foreground mb-0.5">TACoS</div>
              <div className={cn("text-xl font-semibold", primarySummary.breakdown.tacos < 10 ? "text-success" : "text-destructive")}>{primarySummary.breakdown.tacos.toFixed(1)}%</div>
              <DeltaIndicator {...getDelta(primarySummary.breakdown.tacos, secondarySummary.breakdown.tacos)} className="mt-0.5" />
              <div className="text-[10px] text-muted-foreground mt-1">Total Ad Cost of Sale</div>
            </div>
            <div className="rounded-md border border-border/50 p-3 flex flex-col items-center text-center">
              <Layers className="h-4 w-4 text-chart-3 mb-1.5" />
              <div className="text-[10px] text-muted-foreground mb-0.5">Profit Margin</div>
              <div className={cn("text-xl font-semibold", profitMargin > 20 ? "text-success" : profitMargin > 10 ? "text-foreground" : "text-destructive")}>
                {profitMargin.toFixed(1)}%
              </div>
              <DeltaIndicator {...getDelta(profitMargin, prevMargin)} className="mt-0.5" />
              <div className="text-[10px] text-muted-foreground mt-1">Net Profit / GMV</div>
            </div>
            <div className="rounded-md border border-border/50 p-3 flex flex-col items-center text-center">
              <Eye className="h-4 w-4 text-chart-4 mb-1.5" />
              <div className="text-[10px] text-muted-foreground mb-0.5">Return Rate</div>
              <div className={cn("text-xl font-semibold", primarySummary.orders > 0 && (primarySummary.returns / primarySummary.orders) * 100 > 5 ? "text-destructive" : "text-success")}>
                {primarySummary.orders > 0 ? ((primarySummary.returns / primarySummary.orders) * 100).toFixed(1) : "0.0"}%
              </div>
              <div className="text-[10px] text-muted-foreground mt-2">
                {primarySummary.returns} returns · {primarySummary.cancelled} cancelled
              </div>
              <div className="text-[10px] text-muted-foreground">out of {primarySummary.orders} orders</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
