import { useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { PnLParameterTable } from "@/components/profitability/PnLParameterTable";
import { ProductsPnLTable } from "@/components/profitability/ProductsPnLTable";
import { ProductDetailPanel } from "@/components/profitability/ProductDetailPanel";
import { ProductsOrdersToggle } from "@/components/profitability/ProductsOrdersToggle";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, X } from "lucide-react";
import { pnlData, profitabilityProducts } from "@/data/mockProfitability";
import { PnLRow, ProfitabilityProduct } from "@/types/profitability";
import { toast } from "sonner";
import { useActivePanel } from "@/contexts/ActivePanelContext";

const COLUMN_DEFS = [
  { id: "units", label: "Units", visible: true },
  { id: "refundUnits", label: "Refund Units", visible: true },
  { id: "cancelledUnits", label: "Cancelled Units", visible: true },
  { id: "gmv", label: "GMV", visible: true },
  { id: "authSales", label: "Auth Sales", visible: true },
  { id: "refundSales", label: "Refund Sales", visible: true },
  { id: "cancelledSales", label: "Cancelled Sales", visible: true },
  { id: "adSpend", label: "Ad Spend", visible: true },
  { id: "commissionProduct", label: "Comm. Product", visible: true },
];

const FILTER_FIELDS = ["Product Name", "Item ID", "SKU", "Net Profit", "Units"];

const SORTABLE_FIELDS = [
  { id: "name", label: "Product Name" },
  { id: "units", label: "Units" },
  { id: "gmv", label: "GMV" },
  { id: "authSales", label: "Auth Sales" },
  { id: "adSpend", label: "Ad Spend" },
  { id: "netProfit", label: "Net Profit" },
];

const breadcrumbItems = [
  { label: "Profitability", href: "/profitability/pnl" },
  { label: "Profit & Loss" },
];

type Frequency = "Daily" | "Weekly" | "Monthly";

const frequencyPeriods: Record<Frequency, string[]> = {
  Daily: ["Day-01", "Day-02", "Day-03", "Day-04"],
  Weekly: ["Week-05", "Week-04", "Week-02", "Week-01"],
  Monthly: ["Jan", "Feb", "Mar", "Apr"],
};

const WEEK_KEYS = ["Week-05", "Week-04", "Week-02", "Week-01"];

// Recursively project a PnLRow so its weeklyValues are keyed by the active frequency labels.
function projectRow(row: PnLRow, frequency: Frequency): PnLRow {
  const periods = frequencyPeriods[frequency];
  const projected: Record<string, number | null> = {};
  periods.forEach((label, idx) => {
    const sourceKey = WEEK_KEYS[idx % WEEK_KEYS.length];
    const sourceVal = row.weeklyValues[sourceKey];
    if (sourceVal == null) {
      projected[label] = sourceVal ?? null;
      return;
    }
    const factor = frequency === "Daily" ? 1 / 7 : frequency === "Monthly" ? 4.3 : 1;
    projected[label] = Number((sourceVal * factor).toFixed(2));
  });
  return {
    ...row,
    weeklyValues: projected,
    children: row.children?.map((c) => projectRow(c, frequency)),
  };
}

export default function ProfitLoss() {
  const { dataPanel, setDataPanel, closeDataPanel } = useActivePanel();
  const [tableTab, setTableTab] = useState<"products" | "orders">("products");
  const [searchValue, setSearchValue] = useState("");
  const [columns, setColumns] = useState(COLUMN_DEFS);
  const [activeFilters, setActiveFilters] = useState<any[]>([]);
  const [detailProduct, setDetailProduct] = useState<ProfitabilityProduct | null>(null);
  const [showDeltas, setShowDeltas] = useState(false);
  const [pnlFrequency, setPnlFrequency] = useState<Frequency>("Weekly");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [productPickerOpen, setProductPickerOpen] = useState(false);
  const [productSearch, setProductSearch] = useState("");

  const periods = frequencyPeriods[pnlFrequency];
  const projectedPnlData = useMemo(
    () => pnlData.map((row) => projectRow(row, pnlFrequency)),
    [pnlFrequency]
  );

  const filteredProducts = useMemo(
    () =>
      profitabilityProducts.filter((p) => {
        if (selectedProductIds.length > 0 && !selectedProductIds.includes(p.id)) return false;
        if (!searchValue) return true;
        const q = searchValue.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.itemId.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
        );
      }),
    [searchValue, selectedProductIds]
  );

  const pickerProducts = useMemo(
    () =>
      profitabilityProducts.filter((p) =>
        productSearch ? p.name.toLowerCase().includes(productSearch.toLowerCase()) : true
      ),
    [productSearch]
  );

  const toggleProduct = (id: string) =>
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const handleOpenDetail = (product: ProfitabilityProduct) => {
    setDetailProduct(product);
    setDataPanel("productDetail");
  };

  const handleCloseDetail = () => {
    setDetailProduct(null);
    closeDataPanel();
  };

  const handleDownload = () => toast.success("Exporting data as CSV...");

  const showDetail = dataPanel === "productDetail" && detailProduct;

  return (
    <AppLayout>
      <div className="flex flex-1 h-full min-h-0 min-w-0">
        <div className="flex-1 min-w-0 space-y-6 p-0">
          <PageHeader title="Profit & Loss" subtitle="Detailed P&L breakdown by period" />

          <AppTaskbar
            showDateRange
            showRunButton
            onRun={() => toast.info("Refreshing data...")}
            breadcrumbItems={breadcrumbItems}
          >
            <div className="flex items-center gap-1.5 rounded-md bg-muted/40 px-2.5 py-1">
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Frequency</span>
              <Select value={pnlFrequency} onValueChange={(v) => setPnlFrequency(v as Frequency)}>
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
                  {selectedProductIds.length > 0 && (
                    <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                      {selectedProductIds.length}
                    </Badge>
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
                  {pickerProducts.map((p) => (
                    <label
                      key={p.id}
                      className="flex items-center gap-2 px-2 py-1.5 text-xs rounded hover:bg-muted cursor-pointer"
                    >
                      <Checkbox
                        checked={selectedProductIds.includes(p.id)}
                        onCheckedChange={() => toggleProduct(p.id)}
                      />
                      <span className="line-clamp-1 flex-1">{p.name}</span>
                    </label>
                  ))}
                  {pickerProducts.length === 0 && (
                    <div className="p-3 text-xs text-muted-foreground text-center">No products match.</div>
                  )}
                </div>
                <div className="flex items-center justify-between p-2 border-t border-border">
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setSelectedProductIds([])}>
                    Clear
                  </Button>
                  <Button size="sm" className="h-7 text-xs" onClick={() => setProductPickerOpen(false)}>
                    Done
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </AppTaskbar>

          {selectedProductIds.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 px-1">
              <span className="text-xs text-muted-foreground">Selected:</span>
              {selectedProductIds.map((id) => {
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
              <Button variant="ghost" size="sm" className="h-6 text-[11px]" onClick={() => setSelectedProductIds([])}>
                Clear all
              </Button>
            </div>
          )}

          <PnLParameterTable data={projectedPnlData} weeks={periods} showDeltas={showDeltas} />

          <div className="space-y-3">
            <DataTableToolbar
              leftContent={<ProductsOrdersToggle activeTab={tableTab} onTabChange={setTableTab} />}
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              searchPlaceholder="Search by Product Name / Item ID / SKU..."
              columns={columns}
              onColumnToggle={(id) =>
                setColumns((prev) => prev.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c)))
              }
              onSelectAllColumns={() => setColumns((prev) => prev.map((c) => ({ ...c, visible: true })))}
              onClearAllColumns={() => setColumns((prev) => prev.map((c) => ({ ...c, visible: false })))}
              activeFilters={activeFilters}
              onFiltersChange={setActiveFilters}
              filterFields={FILTER_FIELDS}
              onDownload={handleDownload}
              showDeltas={showDeltas}
              onShowDeltasChange={setShowDeltas}
              sortableFields={SORTABLE_FIELDS}
              sortField={sortField}
              sortDirection={sortDirection}
              onSortChange={(f, d) => {
                setSortField(f);
                setSortDirection(d);
              }}
            />
            <div className="rounded-lg border border-border bg-card">
              <ProductsPnLTable
                products={filteredProducts}
                visibleColumns={columns.filter((c) => c.visible).map((c) => c.id)}
                showDeltas={showDeltas}
                onMoreClick={handleOpenDetail}
              />
            </div>
          </div>
        </div>

        {showDetail && (
          <ProductDetailPanel product={detailProduct} isOpen={true} onClose={handleCloseDetail} />
        )}
      </div>
    </AppLayout>
  );
}
