import { useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TablePagination } from "@/components/tables/TablePagination";
import { Download } from "lucide-react";
import { mockUnifiedPnL } from "@/data/mockUnifiedPnL";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import amazonLogo from "@/assets/amazon-logo.png";
import walmartLogo from "@/assets/walmart-logo.png";
import { useCurrency } from "@/contexts/CurrencyContext";

const isMarginRow = (label: string) => label.toLowerCase().includes("margin");


const breadcrumbItems = [
  { label: "Profitability", href: "/profitability/unified-pnl" },
  { label: "Unified P&L" },
];
export default function UnifiedPnL() {
  const { formatCurrency } = useCurrency();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const netProfit = mockUnifiedPnL.find((r) => r.label === "Net Profit");
  const grossRevenue = mockUnifiedPnL.find((r) => r.label === "Gross Revenue");
  const grossProfit = mockUnifiedPnL.find((r) => r.label === "Gross Profit");
  const adSpend = mockUnifiedPnL.find((r) => r.label === "Advertising Spend");
  const paginatedRows = useMemo(
    () => mockUnifiedPnL.slice((page - 1) * pageSize, page * pageSize),
    [page, pageSize]
  );


  return (
    <AppLayout>
      <div className="space-y-6">
        <AppTaskbar breadcrumbItems={breadcrumbItems} />
        <PageHeader
          title="Cross-Marketplace Unified P&L"
          subtitle="Combined Amazon + Walmart profitability in a single view"
          actions={
            <Button variant="outline" size="sm" onClick={() => toast.success("Exporting unified P&L...")}><Download className="mr-2 h-4 w-4" />Export PDF</Button>
          }
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Combined Revenue", value: grossRevenue?.combined || 0 },
            { label: "Combined Gross Profit", value: grossProfit?.combined || 0 },
            { label: "Combined Ad Spend", value: adSpend?.combined || 0 },
            { label: "Combined Net Profit", value: netProfit?.combined || 0 },
          ].map((kpi) => (
            <Card key={kpi.label} className="h-full bg-card"><CardContent className="pt-4 pb-3 px-4">
              <p className="text-xs text-muted-foreground mb-1">{kpi.label}</p>
              <p className="text-xl font-semibold text-foreground">{formatCurrency(kpi.value)}</p>
            </CardContent></Card>
          ))}
        </div>

        <div className="rounded-lg border border-border bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="min-w-[260px]">Line Item</TableHead>
                <TableHead className="text-right min-w-[140px]">
                  <div className="flex items-center justify-end gap-2">
                    <img src={amazonLogo} alt="Amazon" className="h-4 w-auto" />Amazon
                  </div>
                </TableHead>
                <TableHead className="text-right min-w-[140px]">
                  <div className="flex items-center justify-end gap-2">
                    <img src={walmartLogo} alt="Walmart" className="h-4 w-auto" />Walmart
                  </div>
                </TableHead>
                <TableHead className="text-right min-w-[140px] font-semibold">Combined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRows.map((row, i) => (
                <TableRow key={i} className={cn(row.isTotal && "bg-muted/20 font-semibold border-t-2 border-border", row.isHeader && "bg-muted/10 font-medium")}>
                  <TableCell className={cn(row.indent && `pl-${4 + row.indent * 4}`)}>
                    <span className={cn(row.isTotal && "font-semibold text-foreground", row.isHeader && "font-medium text-foreground", !row.isTotal && !row.isHeader && "text-muted-foreground", row.indent && "text-sm")}>
                      {row.indent ? "  " : ""}{row.label}
                    </span>
                  </TableCell>
                  <TableCell className={cn("text-right", row.amazon < 0 && !isMarginRow(row.label) && "text-destructive")}>
                    {isMarginRow(row.label) ? `${row.amazon.toFixed(1)}%` : formatCurrency(row.amazon)}
                  </TableCell>
                  <TableCell className={cn("text-right", row.walmart < 0 && !isMarginRow(row.label) && "text-destructive")}>
                    {isMarginRow(row.label) ? `${row.walmart.toFixed(1)}%` : formatCurrency(row.walmart)}
                  </TableCell>
                  <TableCell className={cn("text-right font-medium", row.combined < 0 && !isMarginRow(row.label) && "text-destructive")}>
                    {isMarginRow(row.label) ? `${row.combined.toFixed(1)}%` : formatCurrency(row.combined)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            page={page}
            pageSize={pageSize}
            totalItems={mockUnifiedPnL.length}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </div>

      </div>
</AppLayout>
  );
}
