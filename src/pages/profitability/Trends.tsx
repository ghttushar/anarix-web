import { useMemo, useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { ScatterPlotChart } from "@/components/profitability/ScatterPlotChart";
import { ProductTrendsModal } from "@/components/profitability/ProductTrendsModal";
import { ProductDetailPanel } from "@/components/profitability/ProductDetailPanel";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { TablePagination } from "@/components/tables/TablePagination";
import { scatterData, profitabilityProducts, profitabilityMetrics } from "@/data/mockProfitability";
import { ProfitabilityProduct } from "@/types/profitability";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Info, TrendingUp, ChevronDown, X } from "lucide-react";
import { toast } from "sonner";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useViewport } from "@/contexts/ViewportContext";
import { MobileCard, MobileCardList } from "@/views/mobile/MobileCardList";



const breadcrumbItems = [
  { label: "Profitability", href: "/profitability/trends" },
  { label: "Trends" },
];

type Frequency = "Daily" | "Weekly" | "Monthly";

const frequencyColumns: Record<Frequency, string[]> = {
  Daily: ["Day-01", "Day-02", "Day-03", "Day-04"],
  Weekly: ["Week-01", "Week-02", "Week-04", "Week-05"],
  Monthly: ["Jan", "Feb", "Mar", "Apr"],
};

export default function ProfitabilityTrends() {
  const { formatCurrency } = useCurrency();
  const { view } = useViewport();
  const isMobile = view === "mobile";
  const [selectedMetric, setSelectedMetric] = useState("Total Sales");
  const [frequency, setFrequency] = useState<Frequency>("Weekly");
  const [searchValue, setSearchValue] = useState("");
  const [trendsProduct, setTrendsProduct] = useState<ProfitabilityProduct | null>(null);
  const [detailProduct, setDetailProduct] = useState<ProfitabilityProduct | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [productPickerOpen, setProductPickerOpen] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);


  const columns = frequencyColumns[frequency];

  // Build a numeric key for any column label, falling back to weekly data deterministically.
  const valueForColumn = (p: ProfitabilityProduct, col: string, idx: number) => {
    if (p.weeklyData?.[col] != null) return p.weeklyData[col];
    const weeklyKeys = Object.keys(p.weeklyData ?? {});
    const fallback = weeklyKeys.length ? p.weeklyData![weeklyKeys[idx % weeklyKeys.length]] : 0;
    if (frequency === "Daily") return Math.round(fallback / 7);
    if (frequency === "Monthly") return Math.round(fallback * 4.3);
    return fallback;
  };

  const filteredProducts = useMemo(
    () =>
      profitabilityProducts.filter((p) => {
        if (selectedIds.length > 0 && !selectedIds.includes(p.id)) return false;
        if (!searchValue) return true;
        const q = searchValue.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.itemId.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
        );
      }),
    [searchValue, selectedIds]
  );

  const paginatedProducts = useMemo(
    () => filteredProducts.slice((page - 1) * pageSize, page * pageSize),
    [filteredProducts, page, pageSize]
  );

  useEffect(() => { setPage(1); }, [searchValue, selectedIds, frequency]);


  const pickerProducts = useMemo(
    () =>
      profitabilityProducts.filter((p) =>
        productSearch ? p.name.toLowerCase().includes(productSearch.toLowerCase()) : true
      ),
    [productSearch]
  );

  const toggleProduct = (id: string) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const clearSelection = () => setSelectedIds([]);

  const handleDownload = () => toast.success("Exporting data as CSV...");

  return (
    <AppLayout>
      <div className="flex flex-1 h-full min-h-0 min-w-0">
        <div className="flex-1 min-w-0 space-y-6">
        <PageHeader title="Profitability Trends" subtitle="Analyze product performance quadrants" />

        <AppTaskbar
          showDateRange
          showRunButton
          onRun={() => toast.info("Refreshing data...")}
          breadcrumbItems={breadcrumbItems}
        >
          <div className="flex items-center gap-1.5 rounded-md bg-muted/40 px-2.5 py-1">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Metric</span>
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="h-8 w-[140px] text-sm border-0 bg-transparent shadow-none px-1.5 cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {profitabilityMetrics.map((m) => (
                  <SelectItem key={m} value={m} className="text-xs cursor-pointer">
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-1.5 rounded-md bg-muted/40 px-2.5 py-1">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Frequency</span>
            <Select value={frequency} onValueChange={(v) => setFrequency(v as Frequency)}>
              <SelectTrigger className="h-8 w-[110px] text-sm border-0 bg-transparent shadow-none px-1.5 cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Daily" className="text-xs cursor-pointer">Daily</SelectItem>
                <SelectItem value="Weekly" className="text-xs cursor-pointer">Weekly</SelectItem>
                <SelectItem value="Monthly" className="text-xs cursor-pointer">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Popover open={productPickerOpen} onOpenChange={setProductPickerOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                Products
                {selectedIds.length > 0 && (
                  <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">{selectedIds.length}</Badge>
                )}
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[320px] p-0">
              <div className="p-2 border-b border-border">
                <input
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full h-8 px-2 text-xs rounded border border-border bg-background outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="max-h-[280px] overflow-y-auto p-1">
                {pickerProducts.map((p) => {
                  const checked = selectedIds.includes(p.id);
                  return (
                    <label
                      key={p.id}
                      className="flex items-center gap-2 px-2 py-1.5 text-xs rounded hover:bg-muted cursor-pointer"
                    >
                      <Checkbox checked={checked} onCheckedChange={() => toggleProduct(p.id)} />
                      <span className="line-clamp-1 flex-1">{p.name}</span>
                    </label>
                  );
                })}
                {pickerProducts.length === 0 && (
                  <div className="p-3 text-xs text-muted-foreground text-center">No products match.</div>
                )}
              </div>
              <div className="flex items-center justify-between p-2 border-t border-border">
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={clearSelection}>
                  Clear
                </Button>
                <Button size="sm" className="h-7 text-xs" onClick={() => setProductPickerOpen(false)}>
                  Done
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </AppTaskbar>

        {selectedIds.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 px-1">
            <span className="text-xs text-muted-foreground">Selected:</span>
            {selectedIds.map((id) => {
              const p = profitabilityProducts.find((x) => x.id === id);
              if (!p) return null;
              return (
                <Badge key={id} variant="secondary" className="gap-1 pr-1 text-[11px]">
                  <span className="max-w-[160px] truncate">{p.name}</span>
                  <button
                    onClick={() => toggleProduct(id)}
                    className="rounded hover:bg-background/60 p-0.5"
                    aria-label={`Remove ${p.name}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })}
            <Button variant="ghost" size="sm" className="h-6 text-[11px]" onClick={clearSelection}>
              Clear all
            </Button>
          </div>
        )}

        <ScatterPlotChart
          data={scatterData}
          selectedIds={selectedIds}
          onPointToggle={(id) => toggleProduct(id)}
          onPointDetail={(id) => {
            const p = profitabilityProducts.find((x) => x.id === id);
            if (p) setDetailProduct(p);
          }}
        />


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
            onSortChange={(f, d) => {
              setSortField(f);
              setSortDirection(d);
            }}
          />

          {isMobile ? (
            <>
              <MobileCardList>
                {paginatedProducts.map((product) => {
                  const total = columns.reduce(
                    (sum, c, idx) => sum + valueForColumn(product, c, idx),
                    0
                  );
                  return (
                    <MobileCard
                      key={product.id}
                      thumbnail={product.image}
                      title={product.name}
                      meta={`${product.itemId} · ${product.sku} · ${formatCurrency(product.price)}`}
                      kpis={[
                        { label: "GMV", value: formatCurrency(product.gmv) },
                        { label: "Net Profit", value: formatCurrency(product.netProfit) },
                        { label: "Total", value: formatCurrency(total) },
                      ]}
                      onTap={() => setDetailProduct(product)}
                    />
                  );
                })}
              </MobileCardList>
              <TablePagination
                page={page}
                pageSize={pageSize}
                totalItems={filteredProducts.length}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
              />
            </>
          ) : (
          <div className="rounded-lg border border-border bg-card">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted">
                    <TableHead className="sticky left-0 z-20 bg-muted min-w-[320px]">Product Details</TableHead>
                    {columns.map((c) => (
                      <TableHead key={c} className="text-right min-w-[100px] whitespace-nowrap">
                        {c}
                      </TableHead>
                    ))}
                    <TableHead className="text-right min-w-[120px] font-semibold whitespace-nowrap">Total</TableHead>
                    <TableHead className="text-center min-w-[90px]">More Info</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedProducts.map((product) => {
                    const total = columns.reduce(
                      (sum, c, idx) => sum + valueForColumn(product, c, idx),
                      0
                    );
                    return (
                      <TableRow key={product.id} className="hover:bg-muted/30 group">
                        <TableCell className="sticky left-0 z-10 bg-card group-hover:bg-muted transition-colors">
                          <div className="flex items-start gap-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-10 w-10 rounded-md border border-border object-cover flex-shrink-0"
                            />
                            <div className="flex flex-col min-w-0">
                              <span className="font-medium text-foreground line-clamp-1">{product.name}</span>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{product.itemId}</span>
                                <span>•</span>
                                <span>{product.sku}</span>
                                <span>•</span>
                                <span>{formatCurrency(product.price)}</span>
                              </div>
                              <button
                                onClick={() => setTrendsProduct(product)}
                                className="mt-1 inline-flex items-center gap-1 self-start text-xs text-primary hover:underline"
                              >
                                <TrendingUp className="h-3 w-3" />
                                Trends
                              </button>
                            </div>
                          </div>
                        </TableCell>
                        {columns.map((c, idx) => (
                          <TableCell key={c} className="text-right whitespace-nowrap">
                            {formatCurrency(valueForColumn(product, c, idx))}
                          </TableCell>
                        ))}
                        <TableCell className="text-right font-medium whitespace-nowrap">
                          {formatCurrency(total)}
                        </TableCell>
                        <TableCell className="text-center">
                          <button
                            onClick={() => setDetailProduct(product)}
                            className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                            title="View full breakdown"
                          >
                            <Info className="h-3 w-3" />
                            More
                          </button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow className="bg-muted font-medium">
                    <TableCell className="sticky left-0 z-10 bg-muted">Total</TableCell>
                    {columns.map((c, idx) => (
                      <TableCell key={c} className="text-right whitespace-nowrap">
                        {formatCurrency(
                          filteredProducts.reduce((sum, p) => sum + valueForColumn(p, c, idx), 0)
                        )}
                      </TableCell>
                    ))}
                    <TableCell className="text-right whitespace-nowrap">
                      {formatCurrency(
                        filteredProducts.reduce(
                          (sum, p) => sum + columns.reduce((s, c, idx) => s + valueForColumn(p, c, idx), 0),
                          0
                        )
                      )}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <TablePagination
              page={page}
              pageSize={pageSize}
              totalItems={filteredProducts.length}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          </div>
          )}

        </div>
        </div>


        {detailProduct && (
          <ProductDetailPanel
            product={detailProduct}
            isOpen={!!detailProduct}
            onClose={() => setDetailProduct(null)}
          />
        )}
      </div>

      <ProductTrendsModal
        product={trendsProduct}
        isOpen={!!trendsProduct}
        onClose={() => setTrendsProduct(null)}
      />
    </AppLayout>
  );
}
