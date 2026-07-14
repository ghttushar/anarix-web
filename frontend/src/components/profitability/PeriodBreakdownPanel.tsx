import { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfitabilitySummary } from "@/types/profitability";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useCurrency } from "@/contexts/CurrencyContext";

interface PeriodBreakdownPanelProps {
  summary: ProfitabilitySummary;
  isOpen: boolean;
  onClose: () => void;
}

const formatPercent = (value: number) => `${value.toFixed(1)}%`;

type Row = {
  label: string;
  value: string;
  share?: number; // % of revenue base
  highlight?: boolean;
};

type Section = {
  id: string;
  title: string;
  rows: Row[];
  defaultOpen?: boolean;
};

export function PeriodBreakdownPanel({ summary, isOpen, onClose }: PeriodBreakdownPanelProps) {
  const { formatCurrency } = useCurrency();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    individual: true,
    total: true,
    sales: true,
    costs: true,
    calculated: true,
  });

  if (!isOpen) return null;

  const b = summary.breakdown;
  const revenue = summary.gmv || 1; // base for % share
  const safeUnits = Math.max(summary.units, 1);

  // Per-unit (individual-level) economics
  const individualRows: Row[] = [
    { label: "GMV / unit", value: formatCurrency(summary.gmv / safeUnits) },
    { label: "Auth Sales / unit", value: formatCurrency(summary.authSales / safeUnits) },
    { label: "Ad Cost / unit", value: formatCurrency(summary.adCost / safeUnits), share: (summary.adCost / revenue) * 100 },
    { label: "COGS / unit", value: formatCurrency(b.cogs / safeUnits), share: (b.cogs / revenue) * 100 },
    { label: "Expenses / unit", value: formatCurrency(b.totalExpenses / safeUnits), share: (b.totalExpenses / revenue) * 100 },
    { label: "Net Profit / unit", value: formatCurrency(summary.netProfit / safeUnits), highlight: true },
  ];

  // Total (aggregate) metrics
  const totalRows: Row[] = [
    { label: "Total GMV", value: formatCurrency(summary.gmv) },
    { label: "Auth Sales", value: formatCurrency(summary.authSales), share: (summary.authSales / revenue) * 100 },
    { label: "Total Orders", value: summary.orders.toLocaleString() },
    { label: "Total Units", value: summary.units.toLocaleString() },
    { label: "Returns", value: summary.returns.toLocaleString() },
    { label: "Cancelled", value: summary.cancelled.toLocaleString() },
    { label: "Estimated Payout", value: formatCurrency(summary.estPayout) },
    { label: "Net Profit", value: formatCurrency(summary.netProfit), highlight: true },
  ];

  const salesRows: Row[] = [
    { label: "Organic", value: formatCurrency(b.organic), share: (b.organic / revenue) * 100 },
    { label: "Sponsored Products", value: formatCurrency(b.sponsoredProducts), share: (b.sponsoredProducts / revenue) * 100 },
    { label: "Sponsored Brands", value: formatCurrency(b.sponsoredBrands), share: (b.sponsoredBrands / revenue) * 100 },
    { label: "Sponsored Video", value: formatCurrency(b.sponsoredVideo), share: (b.sponsoredVideo / revenue) * 100 },
  ];

  const costRows: Row[] = [
    { label: "COGS", value: formatCurrency(b.cogs), share: (b.cogs / revenue) * 100 },
    { label: "Ad Spend", value: formatCurrency(summary.adCost), share: (summary.adCost / revenue) * 100 },
    { label: "Total Expenses", value: formatCurrency(b.totalExpenses), share: (b.totalExpenses / revenue) * 100 },
  ];

  const calculatedRows: Row[] = [
    { label: "Profit Margin", value: formatPercent((summary.netProfit / revenue) * 100), highlight: true },
    { label: "TACOS", value: formatPercent(b.tacos) },
    { label: "ROAS", value: `${b.roas.toFixed(2)}x` },
    { label: "Refund Rate", value: formatPercent((summary.returns / safeUnits) * 100) },
    { label: "Cancel Rate", value: formatPercent((summary.cancelled / safeUnits) * 100) },
  ];

  const sections: Section[] = [
    { id: "individual", title: "Individual-Level Metrics", rows: individualRows, defaultOpen: true },
    { id: "total", title: "Total Metrics", rows: totalRows, defaultOpen: true },
    { id: "sales", title: "Sales Breakdown", rows: salesRows },
    { id: "costs", title: "Costs", rows: costRows },
    { id: "calculated", title: "Calculated Metrics", rows: calculatedRows },
  ];

  const toggle = (id: string) => setOpenSections((p) => ({ ...p, [id]: !p[id] }));

  return (
    <div data-app-panel="periodBreakdown" className="sticky top-0 self-start h-screen max-h-screen flex w-[360px] shrink-0 flex-col border-l border-border bg-background z-10">
      {/* Header */}
      <div className="border-b border-border shrink-0">
        <div className="flex items-center justify-between px-4 py-4">
          <div>
            <h2 className="font-heading text-base font-semibold text-foreground">
              {summary.dateLabel} Breakdown
            </h2>
            <p className="text-xs text-muted-foreground">{summary.dateRange}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8" title="Close panel">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="space-y-3 p-4">
          {sections.map((section) => {
            const open = openSections[section.id] ?? !!section.defaultOpen;
            return (
              <Collapsible key={section.id} open={open} onOpenChange={() => toggle(section.id)}>
                <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md border border-border bg-muted/40 px-3 py-2 hover:bg-muted/60 transition-colors">
                  <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
                    {section.title}
                  </span>
                  <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")} />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2">
                  <div className="space-y-1">
                    {section.rows.map((row) => (
                      <div
                        key={row.label}
                        className={cn(
                          "flex items-center justify-between rounded-md px-3 py-2",
                          row.highlight ? "bg-primary/5 border border-primary/20" : "bg-muted/40"
                        )}
                      >
                        <span className="text-sm text-muted-foreground">{row.label}</span>
                        <div className="flex items-baseline gap-2">
                          <span className={cn("text-sm font-medium", row.highlight ? "text-primary" : "text-foreground")}>
                            {row.value}
                          </span>
                          {row.share !== undefined && isFinite(row.share) && (
                            <span className="text-[10px] text-muted-foreground tabular-nums w-12 text-right">
                              {row.share.toFixed(1)}%
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
