import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { ProfitabilityProduct } from "@/types/profitability";
import { Checkbox } from "@/components/ui/checkbox";
import { ChartType } from "@/components/charts/ChartContainer";
import { useCurrency } from "@/contexts/CurrencyContext";

interface ProductTrendsModalProps {
  product: ProfitabilityProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

const METRICS_OPTIONS = [
  { key: "orderSales", label: "Order Sales", color: "hsl(var(--primary))" },
  { key: "totalSales", label: "Total Sales", color: "hsl(var(--chart-2))" },
  { key: "commission", label: "Commission on Product", color: "hsl(var(--chart-3))" },
];

export function ProductTrendsModal({ product, isOpen, onClose }: ProductTrendsModalProps) {
  const { formatCurrency } = useCurrency();
  const [frequency, setFrequency] = useState("weekly");
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["orderSales", "totalSales"]);
  const [chartType, setChartType] = useState<ChartType>("line");

  if (!product) return null;

  const weeklyData = product.weeklyData || {};
  const chartData = Object.entries(weeklyData).map(([week, value]) => ({
    week,
    orderSales: value,
    totalSales: value * 1.08,
    commission: value * 0.15,
  }));

  const toggleMetric = (key: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(key) ? prev.filter((m) => m !== key) : [...prev, key]
    );
  };

  const activeOptions = METRICS_OPTIONS.filter((m) => selectedMetrics.includes(m.key));

  const tooltipStyle = {
    backgroundColor: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "8px",
    fontSize: "12px",
  };

  const renderChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      {chartType === "bar" ? (
        <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="week" tick={{ fontSize: 11 }} className="text-muted-foreground" />
          <YAxis tick={{ fontSize: 11 }} className="text-muted-foreground" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
          <Tooltip contentStyle={tooltipStyle} />
          {activeOptions.map((m) => (
            <Bar key={m.key} dataKey={m.key} fill={m.color} name={m.label} radius={[3, 3, 0, 0]} />
          ))}
        </BarChart>
      ) : chartType === "area" ? (
        <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="week" tick={{ fontSize: 11 }} className="text-muted-foreground" />
          <YAxis tick={{ fontSize: 11 }} className="text-muted-foreground" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
          <Tooltip contentStyle={tooltipStyle} />
          {activeOptions.map((m) => (
            <Area key={m.key} type="monotone" dataKey={m.key} stroke={m.color} fill={m.color} fillOpacity={0.15} strokeWidth={2} />
          ))}
        </AreaChart>
      ) : (
        <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="week" tick={{ fontSize: 11 }} className="text-muted-foreground" />
          <YAxis tick={{ fontSize: 11 }} className="text-muted-foreground" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
          <Tooltip contentStyle={tooltipStyle} />
          {activeOptions.map((m) => (
            <Line key={m.key} type="monotone" dataKey={m.key} stroke={m.color} strokeWidth={2} dot={{ fill: m.color, strokeWidth: 0, r: 3 }} />
          ))}
        </LineChart>
      )}
    </ResponsiveContainer>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-base">Product Trends</DialogTitle>
          <DialogDescription className="sr-only">View product trends over time</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Product info */}
          <div className="flex items-center gap-3">
            <img src={product.image} alt={product.name} className="h-10 w-10 rounded-md border border-border object-cover flex-shrink-0" />
            <div className="min-w-0">
              <p className="font-medium text-foreground text-sm line-clamp-1">{product.name}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{product.itemId}</span><span>•</span><span>{product.sku}</span><span>•</span><span>{formatCurrency(product.price)}</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 flex-wrap">
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger className="h-8 w-[120px] text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Daily", "Weekly", "Monthly", "Quarterly", "Yearly"].map((f) => (
                  <SelectItem key={f.toLowerCase()} value={f.toLowerCase()} className="text-xs">{f}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={chartType} onValueChange={(v) => setChartType(v as ChartType)}>
              <SelectTrigger className="h-8 w-[90px] text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="line" className="text-xs">Line</SelectItem>
                <SelectItem value="bar" className="text-xs">Bar</SelectItem>
                <SelectItem value="area" className="text-xs">Area</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-3">
              {METRICS_OPTIONS.map((m) => (
                <button key={m.key} onClick={() => toggleMetric(m.key)} className="flex items-center gap-1.5 text-xs">
                  <Checkbox checked={selectedMetrics.includes(m.key)} className="pointer-events-none h-3.5 w-3.5" />
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: m.color }} />
                  <span className="text-muted-foreground">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="h-[260px]">
            {renderChart()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
