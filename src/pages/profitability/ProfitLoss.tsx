import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { PnLParameterTable } from "@/components/profitability/PnLParameterTable";
import { ProductsPnLTable } from "@/components/profitability/ProductsPnLTable";
import { ProductDetailPanel } from "@/components/profitability/ProductDetailPanel";
import { ProductsOrdersToggle } from "@/components/profitability/ProductsOrdersToggle";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { pnlData, profitabilityProducts } from "@/data/mockProfitability";
import { ProfitabilityProduct } from "@/types/profitability";
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
export default function ProfitLoss() {
  const { dataPanel, setDataPanel, closeDataPanel } = useActivePanel();
  const weeks = ["Week-05", "Week-04", "Week-02", "Week-01"];
  const [tableTab, setTableTab] = useState<"products" | "orders">("products");
  const [searchValue, setSearchValue] = useState("");
  const [columns, setColumns] = useState(COLUMN_DEFS);
  const [activeFilters, setActiveFilters] = useState<any[]>([]);
  const [detailProduct, setDetailProduct] = useState<ProfitabilityProduct | null>(null);
  const [showDeltas, setShowDeltas] = useState(false);
  const [catalogue, setCatalogue] = useState("all");
  const [pnlFrequency, setPnlFrequency] = useState("weekly");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const filteredProducts = profitabilityProducts.filter((p) =>
    p.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    p.itemId.toLowerCase().includes(searchValue.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleOpenDetail = (product: ProfitabilityProduct) => {
    setDetailProduct(product);
    setDataPanel("productDetail");
  };

  const handleCloseDetail = () => {
    setDetailProduct(null);
    closeDataPanel();
  };

  const handleDownload = () => {
    toast.success("Exporting data as CSV...");
  };

  const showDetail = dataPanel === "productDetail" && detailProduct;

  return (
    <AppLayout>
      <div className="flex flex-1 h-full min-h-0 min-w-0">
        <div className="flex-1 min-w-0 space-y-6 p-0">
          <PageHeader
            title="Profit & Loss"
            subtitle="Detailed P&L breakdown by period"
          />
          <AppTaskbar showDateRange showRunButton onRun={() => toast.info("Refreshing data...")} breadcrumbItems={breadcrumbItems} />

          {/* P&L Frequency Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Frequency:</span>
            <div className="flex rounded-md border border-border">
              {["Daily", "Weekly", "Monthly"].map((f) => (
                <button
                  key={f}
                  className={`px-3 py-1 text-xs font-medium transition-colors ${pnlFrequency === f.toLowerCase() ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"}`}
                  onClick={() => setPnlFrequency(f.toLowerCase())}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <PnLParameterTable data={pnlData} weeks={weeks} showDeltas={showDeltas} />

          <div className="space-y-3">
            <DataTableToolbar
              leftContent={<ProductsOrdersToggle activeTab={tableTab} onTabChange={setTableTab} />}
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              searchPlaceholder="Search by Product Name / Item ID / SKU..."
              columns={columns}
              onColumnToggle={(id) => setColumns((prev) => prev.map((c) => c.id === id ? { ...c, visible: !c.visible } : c))}
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
              onSortChange={(f, d) => { setSortField(f); setSortDirection(d); }}
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
