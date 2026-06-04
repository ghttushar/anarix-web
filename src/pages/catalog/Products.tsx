import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { CatalogProductsTable } from "@/components/catalog/CatalogProductsTable";
import { catalogProducts } from "@/data/mockCatalog";
import { toast } from "sonner";
import { useViewport } from "@/contexts/ViewportContext";
import { MobileCard, MobileCardList } from "@/views/mobile/MobileCardList";
import { useCurrency } from "@/contexts/CurrencyContext";
const COLUMN_DEFS = [
  { id: "status", label: "Status", visible: true },
  { id: "reviews", label: "Reviews", visible: true },
  { id: "inventoryCount", label: "Inventory", visible: true },
  { id: "inventoryValueCogs", label: "Value (COGS)", visible: true },
  { id: "inventoryValueRetail", label: "Value (Retail)", visible: true },
  { id: "price", label: "Price", visible: true },
  { id: "cogs", label: "COGS", visible: true },
  { id: "totalSales", label: "Total Sales", visible: true },
  { id: "gmv", label: "GMV", visible: true },
  { id: "totalUnits", label: "Units", visible: true },
  { id: "refundSales", label: "Refund Sales", visible: true },
  { id: "cancelledSales", label: "Cancelled", visible: true },
  { id: "advertised", label: "Advertised", visible: true },
  { id: "adSpend", label: "Ad Spend", visible: true },
];

const SORTABLE_FIELDS = [
  { id: "name", label: "Product Name" },
  { id: "inventoryCount", label: "Inventory" },
  { id: "price", label: "Price" },
  { id: "cogs", label: "COGS" },
  { id: "totalSales", label: "Total Sales" },
  { id: "gmv", label: "GMV" },
  { id: "totalUnits", label: "Units" },
  { id: "adSpend", label: "Ad Spend" },
];

const FILTER_FIELDS = ["Product Name", "Item ID", "SKU", "Status", "Price", "COGS"];


const breadcrumbItems = [
  { label: "Catalog", href: "/catalog/products" },
  { label: "Products" },
];
export default function CatalogProducts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [columns, setColumns] = useState(COLUMN_DEFS);
  const [activeFilters, setActiveFilters] = useState<any[]>([]);
  const [showDeltas, setShowDeltas] = useState(false);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const { view } = useViewport();
  const { formatCurrency } = useCurrency();
  const isMobile = view === "mobile";
  const filteredProducts = catalogProducts.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.itemId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Products Catalog"
          subtitle="Manage your product catalog and inventory"
        />
        <AppTaskbar showDateRange showRunButton onRun={() => toast.info("Refreshing catalog...")} breadcrumbItems={breadcrumbItems} />

        <DataTableToolbar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search by Product Name / ID / SKU..."
          columns={columns}
          onColumnToggle={(id) => setColumns((prev) => prev.map((c) => c.id === id ? { ...c, visible: !c.visible } : c))}
          onSelectAllColumns={() => setColumns((prev) => prev.map((c) => ({ ...c, visible: true })))}
          onClearAllColumns={() => setColumns((prev) => prev.map((c) => ({ ...c, visible: false })))}
          activeFilters={activeFilters}
          onFiltersChange={setActiveFilters}
          filterFields={FILTER_FIELDS}
          onDownload={() => toast.success("Exporting catalog data...")}
          showDeltas={showDeltas}
          onShowDeltasChange={setShowDeltas}
          showUpload
          onUpload={(files) => toast.info(`Uploading ${files[0]?.name}...`)}
          uploadTitle="Upload COGS"
          sortableFields={SORTABLE_FIELDS}
          sortField={sortField}
          sortDirection={sortDirection}
          onSortChange={(field, dir) => { setSortField(field); setSortDirection(dir); }}
        />

        {isMobile ? (
          <MobileCardList>
            {filteredProducts.map((p) => (
              <MobileCard
                key={p.id}
                thumbnail={p.image}
                title={p.name}
                meta={`${p.sku} • ${p.itemId}`}
                kpis={[
                  { label: "GMV", value: formatCurrency(p.gmv) },
                  { label: "Units", value: p.totalUnits.toLocaleString() },
                  { label: "Inv", value: p.inventoryCount.toLocaleString() },
                ]}
              />
            ))}
            {filteredProducts.length === 0 && (
              <div className="text-center py-10 text-sm text-muted-foreground">No products found</div>
            )}
          </MobileCardList>
        ) : (
          <CatalogProductsTable
            products={catalogProducts}
            searchQuery={searchQuery}
            showDeltas={showDeltas}
            sortField={sortField}
            sortDirection={sortDirection}
          />
        )}
      </div>
</AppLayout>
  );
}
