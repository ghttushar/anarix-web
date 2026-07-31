import { useEffect, useState, useCallback } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { CatalogProductsTable } from "@/components/catalog/CatalogProductsTable";
import { getCatalogProducts, getCatalogAggregated } from "@/services/catalog.service";
import { buildPeriodRange } from "@/services/profitability.service";
import { useFilter } from "@/contexts/FilterContext";
import type { CatalogProduct, AggregatedCatalogData } from "@/types/catalog";
import { toast } from "sonner";

const breadcrumbItems = [
  { label: "Catalog", href: "/catalog/products" },
  { label: "Products" },
];

export default function CatalogProducts() {
  const { dateRange } = useFilter();
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [aggregated, setAggregated] = useState<AggregatedCatalogData | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState("");

  const range = buildPeriodRange(dateRange.from, dateRange.to).range;

  const fetchData = useCallback(async () => {
    try {
      const [productsRes, aggregatedRes] = await Promise.all([
        getCatalogProducts(page, pageSize, searchText, range),
        getCatalogAggregated(range),
      ]);
      setProducts(productsRes.data);
      setTotal(productsRes.total);
      setAggregated(aggregatedRes);
    } catch {
      setProducts([]);
      setTotal(0);
      setAggregated(null);
    }
  }, [page, pageSize, searchText, range]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchText(value);
    setPage(1);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Products Catalog"
          subtitle="Manage your product catalog and inventory"
        />
        <AppTaskbar showDateRange showRunButton onRun={fetchData} breadcrumbItems={breadcrumbItems} />

        <DataTableToolbar
          searchValue={searchText}
          onSearchChange={handleSearchChange}
          searchPlaceholder="Search by Product Name / ASIN / SKU / UPC..."
          onDownload={() => toast.success("Exporting catalog data...")}
          showUpload
          onUpload={(files) => toast.info(`Uploading ${files[0]?.name}...`)}
          uploadTitle="Upload COGS"
        />

        <CatalogProductsTable
          products={products}
          aggregated={aggregated}
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </AppLayout>
  );
}
