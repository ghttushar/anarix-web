import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { ScatterPlotChart } from "@/components/profitability/ScatterPlotChart";
import { ProductTrendsModal } from "@/components/profitability/ProductTrendsModal";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { scatterData, profitabilityProducts, profitabilityMetrics } from "@/data/mockProfitability";
import { ProfitabilityProduct } from "@/types/profitability";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useCurrency } from "@/contexts/CurrencyContext";
const breadcrumbItems = [
  { label: "Profitability", href: "/profitability/trends" },
  { label: "Trends" },
];
export default function ProfitabilityTrends() {
  const { formatCurrency } = useCurrency();
  const [selectedMetric, setSelectedMetric] = useState("Total Sales");
  const [searchValue, setSearchValue] = useState("");
  const [trendsProduct, setTrendsProduct] = useState<ProfitabilityProduct | null>(null);
  const [catalogue, setCatalogue] = useState("all");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const filteredProducts = profitabilityProducts.filter((p) =>
    p.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    p.itemId.toLowerCase().includes(searchValue.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchValue.toLowerCase())
  );

  const weeks = ["Week-01", "Week-02", "Week-04", "Week-05"];

  const handleDownload = () => {
    toast.success("Exporting data as CSV...");
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Profitability Trends"
          subtitle="Analyze product performance quadrants"
        />
        <AppTaskbar showDateRange showRunButton onRun={() => toast.info("Refreshing data...")} breadcrumbItems={breadcrumbItems}>
          <div className="flex items-center gap-1.5 rounded-md bg-muted/40 px-2.5 py-1">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Metrics</span>
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="h-8 w-[130px] text-sm border-0 bg-transparent shadow-none px-1.5 cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {profitabilityMetrics.map((m) => (
                  <SelectItem key={m} value={m} className="text-xs cursor-pointer">{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </AppTaskbar>

        <ScatterPlotChart data={scatterData} />

        <div className="space-y-3">
          <DataTableToolbar
            searchValue={searchValue}
            onSearchChange={(v) => setSearchValue(v)}
            searchPlaceholder="Search by Product Name / Item ID / SKU..."
            onDownload={handleDownload}
            sortableFields={[
              { id: "name", label: "Product Name" },
              { id: "gmv", label: "GMV" },
              { id: "netProfit", label: "Net Profit" },
            ]}
            sortField={sortField}
            sortDirection={sortDirection}
            onSortChange={(f, d) => { setSortField(f); setSortDirection(d); }}
          />
          <div className="rounded-lg border border-border bg-card">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead className="sticky left-0 z-20 bg-muted min-w-[300px]">Product Details</TableHead>
                  {weeks.map((w) => (
                    <TableHead key={w} className="text-right min-w-[100px]">{w}</TableHead>
                  ))}
                  <TableHead className="text-right min-w-[120px] font-semibold">Total</TableHead>
                  <TableHead className="text-center">Trends</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const total = weeks.reduce((sum, w) => sum + (product.weeklyData?.[w] || 0), 0);
                  return (
                    <TableRow key={product.id} className="hover:bg-muted/30 group">
                      <TableCell className="sticky left-0 z-10 bg-background group-hover:bg-muted transition-colors">
                        <div className="flex items-center gap-3">
                          <img src={product.image} alt={product.name} className="h-10 w-10 rounded-md border border-border object-cover flex-shrink-0" />
                          <div className="flex flex-col min-w-0">
                            <span className="font-medium text-foreground line-clamp-1">{product.name}</span>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{product.itemId}</span><span>•</span><span>{product.sku}</span><span>•</span><span>{formatCurrency(product.price)}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      {weeks.map((w) => (
                        <TableCell key={w} className="text-right">
                          {product.weeklyData?.[w] ? formatCurrency(product.weeklyData[w]) : "-"}
                        </TableCell>
                      ))}
                      <TableCell className="text-right font-medium">{formatCurrency(total)}</TableCell>
                      <TableCell className="text-center">
                        <button onClick={() => setTrendsProduct(product)} className="text-xs text-primary hover:underline flex items-center gap-1 mx-auto">
                          <TrendingUp className="h-3 w-3" />Trends
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                <TableRow className="bg-muted font-medium">
                  <TableCell className="sticky left-0 z-10 bg-muted">Total</TableCell>
                  {weeks.map((w) => (
                    <TableCell key={w} className="text-right">
                      {formatCurrency(filteredProducts.reduce((sum, p) => sum + (p.weeklyData?.[w] || 0), 0))}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    {formatCurrency(filteredProducts.reduce((sum, p) => sum + weeks.reduce((s, w) => s + (p.weeklyData?.[w] || 0), 0), 0))}
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableBody>
            </Table>
          </div>
          </div>
        </div>
      </div>

      <ProductTrendsModal product={trendsProduct} isOpen={!!trendsProduct} onClose={() => setTrendsProduct(null)} />
</AppLayout>
  );
}
