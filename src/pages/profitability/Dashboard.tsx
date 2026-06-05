import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { ProfitabilityHeroCard } from "@/components/profitability/ProfitabilityHeroCard";
import { ProductsPnLTable } from "@/components/profitability/ProductsPnLTable";
import { COGSEditModal } from "@/components/profitability/COGSEditModal";
import { BulkCogsUploadModal } from "@/components/profitability/BulkCogsUploadModal";
import { ProductDetailPanel } from "@/components/profitability/ProductDetailPanel";
import { ProductTrendsModal } from "@/components/profitability/ProductTrendsModal";
import { ProductsOrdersToggle } from "@/components/profitability/ProductsOrdersToggle";
import { PeriodBreakdownPanel } from "@/components/profitability/PeriodBreakdownPanel";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { profitabilitySummaries, profitabilityProducts, profitabilityOrders, trendDataByPeriod } from "@/data/mockProfitability";
import { ProfitabilityProduct, ProfitabilitySummary } from "@/types/profitability";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useActivePanel } from "@/contexts/ActivePanelContext";
import { useViewport } from "@/contexts/ViewportContext";
import { MobileProfitabilityHero } from "@/views/mobile/MobileProfitabilityHero";


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
  { id: "commissionShipping", label: "Comm. Shipping", visible: true },
  { id: "wfsFulfillmentFee", label: "WFS Fee", visible: true },
  { id: "shippingFees", label: "Shipping Fees", visible: true },
  { id: "cogs", label: "COGS", visible: true },
  { id: "netProfit", label: "Net Profit", visible: true },
  { id: "additionalFee", label: "Additional Fee", visible: true },
];

const FILTER_FIELDS = ["Product Name", "Item ID", "SKU", "Net Profit", "Ad Spend", "Units"];

const SORTABLE_FIELDS = [
  { id: "name", label: "Product Name" },
  { id: "units", label: "Units" },
  { id: "gmv", label: "GMV" },
  { id: "authSales", label: "Auth Sales" },
  { id: "adSpend", label: "Ad Spend" },
  { id: "netProfit", label: "Net Profit" },
];


const breadcrumbItems = [
  { label: "Profitability", href: "/profitability/dashboard" },
  { label: "Dashboard" },
];
export default function ProfitabilityDashboard() {
  const { view } = useViewport();
  const isMobile = view === "mobile";
  const { dataPanel, setDataPanel, closeDataPanel } = useActivePanel();
  const { tab: routeTab } = useParams<{ tab?: string }>();
  const profNav = useNavigate();
  const validTabs = ["products", "orders"] as const;
  const initialTab = (routeTab && validTabs.includes(routeTab as any)) ? routeTab as "products" | "orders" : "products";
  const [selectedPeriod, setSelectedPeriod] = useState<string>("today");
  const [tableTab, setTableTab] = useState<"products" | "orders">(initialTab);

  useEffect(() => {
    if (routeTab && validTabs.includes(routeTab as any)) {
      setTableTab(routeTab as "products" | "orders");
    }
  }, [routeTab]);

  const handleTabChange = (tab: "products" | "orders") => {
    setTableTab(tab);
    profNav(`/profitability/dashboard/${tab}`, { replace: true });
  };
  const [searchValue, setSearchValue] = useState("");
  const [columns, setColumns] = useState(COLUMN_DEFS);
  const [activeFilters, setActiveFilters] = useState<any[]>([]);
  const [products, setProducts] = useState(profitabilityProducts);
  const [showDeltas, setShowDeltas] = useState(false);
  const [catalogue, setCatalogue] = useState("all");
  
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [cogsProduct, setCogsProduct] = useState<ProfitabilityProduct | null>(null);
  const [bulkCogsOpen, setBulkCogsOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState<ProfitabilityProduct | null>(null);
  const [trendsProduct, setTrendsProduct] = useState<ProfitabilityProduct | null>(null);
  const [breakdownSummary, setBreakdownSummary] = useState<ProfitabilitySummary | null>(null);

  const handleOpenDetail = (product: ProfitabilityProduct) => {
    setBreakdownSummary(null);
    setDetailProduct(product);
    setDataPanel("productDetail");
  };

  const handleOpenBreakdown = (summary: ProfitabilitySummary) => {
    setDetailProduct(null);
    setBreakdownSummary(summary);
    setDataPanel("periodBreakdown");
  };

  const handleCloseRightPanel = () => {
    setDetailProduct(null);
    setBreakdownSummary(null);
    closeDataPanel();
  };

  const handleCogsSave = (productId: string, newCogs: number) => {
    setProducts((prev) => prev.map((p) => p.id === productId ? { ...p, cogs: newCogs } : p));
  };

  const handleColumnToggle = (columnId: string) => {
    setColumns((prev) => prev.map((c) => c.id === columnId ? { ...c, visible: !c.visible } : c));
  };

  const handleDownload = () => {
    toast.success("Exporting data as CSV...");
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    p.itemId.toLowerCase().includes(searchValue.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchValue.toLowerCase())
  );

  const filteredOrders = profitabilityOrders.filter((o) =>
    o.orderId.toLowerCase().includes(searchValue.toLowerCase()) ||
    o.country.toLowerCase().includes(searchValue.toLowerCase()) ||
    o.products.some((p) => p.name.toLowerCase().includes(searchValue.toLowerCase()))
  );

  const showProductDetail = dataPanel === "productDetail" && detailProduct;
  const showBreakdown = dataPanel === "periodBreakdown" && breakdownSummary;

  return (
    <AppLayout>
      <div className="flex flex-1 h-full min-h-0 min-w-0">
        <div className="flex-1 min-w-0 space-y-6 p-0">
          <PageHeader
            title="Profitability Dashboard"
            subtitle="Track your profit metrics and financial performance"
          />
          <AppTaskbar showDateRange showRunButton onRun={() => toast.info("Refreshing data...")} breadcrumbItems={breadcrumbItems} />

          {isMobile ? (
            <MobileProfitabilityHero
              summaries={profitabilitySummaries}
              onViewBreakdown={handleOpenBreakdown}
            />
          ) : (
            <ProfitabilityHeroCard
              summaries={profitabilitySummaries}
              trendDataByPeriod={trendDataByPeriod}
              selectedPeriod={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
              onViewBreakdown={handleOpenBreakdown}
            />
          )}

          <div className="space-y-3">
            <DataTableToolbar
              leftContent={<ProductsOrdersToggle activeTab={tableTab} onTabChange={handleTabChange} />}
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              searchPlaceholder={tableTab === "products" ? "Search by Product Name / Item ID / SKU..." : "Search by Order ID / Country / Product..."}
              columns={columns}
              onColumnToggle={handleColumnToggle}
              onSelectAllColumns={() => setColumns((prev) => prev.map((c) => ({ ...c, visible: true })))}
              onClearAllColumns={() => setColumns((prev) => prev.map((c) => ({ ...c, visible: false })))}
              activeFilters={activeFilters}
              onFiltersChange={setActiveFilters}
              filterFields={FILTER_FIELDS}
              showDeltas={showDeltas}
              onShowDeltasChange={setShowDeltas}
              showUpload
              onUploadClick={() => setBulkCogsOpen(true)}
              uploadTitle="Upload Cogs"
              uploadLabel="Upload Cogs"
              onDownload={handleDownload}
              sortableFields={SORTABLE_FIELDS}
              sortField={sortField}
              sortDirection={sortDirection}
              onSortChange={(f, d) => { setSortField(f); setSortDirection(d); }}
            />
            <div className="rounded-lg border border-border bg-card">
              <ProductsPnLTable
                products={filteredProducts}
                orders={filteredOrders}
                mode={tableTab}
                visibleColumns={columns.filter((c) => c.visible).map((c) => c.id)}
                showDeltas={showDeltas}
                onCogsClick={(product) => setCogsProduct(product)}
                onTrendsClick={(product) => setTrendsProduct(product)}
                onMoreClick={handleOpenDetail}
              />
            </div>
          </div>
        </div>

        {showProductDetail && (
          <ProductDetailPanel product={detailProduct} isOpen={true} onClose={handleCloseRightPanel} />
        )}
        {showBreakdown && (
          <PeriodBreakdownPanel summary={breakdownSummary} isOpen={true} onClose={handleCloseRightPanel} />
        )}
      </div>

      <COGSEditModal
        product={cogsProduct}
        isOpen={!!cogsProduct}
        onClose={() => setCogsProduct(null)}
        onSave={handleCogsSave}
      />
      <BulkCogsUploadModal isOpen={bulkCogsOpen} onClose={() => setBulkCogsOpen(false)} />
      <ProductTrendsModal
        product={trendsProduct}
        isOpen={!!trendsProduct}
        onClose={() => setTrendsProduct(null)}
      />
</AppLayout>
  );
}
