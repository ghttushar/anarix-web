import { GeographicalData } from "@/types/profitability";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/contexts/CurrencyContext";

interface RegionStatsPanelProps {
  region: GeographicalData;
  dateRange: string;
}

const formatNumber = (value: number) => {
  return new Intl.NumberFormat("en-US").format(value);
};

const formatPercent = (value: number) => `${value.toFixed(1)}%`;

export function RegionStatsPanel({ region, dateRange }: RegionStatsPanelProps) {
  const { formatCurrency } = useCurrency();
  const refundRate = (region.refunds / region.orders) * 100;
  const margin = ((region.sales - region.amazonFees) / region.sales) * 100;
  const roi = (region.sales / region.amazonFees) * 100;

  return (
    <div className="h-full rounded-lg border border-border bg-card p-4 flex flex-col">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3 border-b border-border pb-4">
        <span className="text-3xl">{region.flag}</span>
        <div>
          <h3 className="font-semibold text-foreground">{region.region}</h3>
          <p className="text-sm text-muted-foreground">{dateRange}</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-md bg-muted/50 p-3">
          <p className="text-xs text-muted-foreground">Sales</p>
          <p className="text-lg font-semibold text-foreground">{formatCurrency(region.sales)}</p>
        </div>
        <div className="rounded-md bg-muted/50 p-3">
          <p className="text-xs text-muted-foreground">Units</p>
          <p className="text-lg font-semibold text-foreground">{formatNumber(region.unitsSold)}</p>
        </div>
        <div className="rounded-md bg-muted/50 p-3">
          <p className="text-xs text-muted-foreground">Orders</p>
          <p className="text-lg font-semibold text-foreground">{formatNumber(region.orders)}</p>
        </div>
        <div className="rounded-md bg-muted/50 p-3">
          <p className="text-xs text-muted-foreground">Total Expenses</p>
          <p className="text-lg font-semibold text-foreground">{formatCurrency(region.amazonFees)}</p>
        </div>
      </div>

      {/* Calculated Metrics */}
      <div className="border-t border-border pt-4 flex-1">
        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Calculated Metrics
        </h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">% Refunds</span>
            <span className={cn("font-medium", refundRate > 10 ? "text-red-500" : "text-foreground")}>
              {formatPercent(refundRate)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Sellable Returns</span>
            <span className="font-medium text-foreground">{formatNumber(region.sellableReturns)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Margin</span>
            <span className={cn("font-medium", margin > 20 ? "text-green-600" : "text-foreground")}>
              {formatPercent(margin)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">ROI</span>
            <span className="font-medium text-foreground">{formatPercent(roi)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
