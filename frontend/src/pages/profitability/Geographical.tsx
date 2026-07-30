import { useMemo, useState, useEffect, useCallback } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { GeographyMap } from "@/components/profitability/GeographyMap";
import { RegionStatsPanel } from "@/components/profitability/RegionStatsPanel";
import { RegionalTable } from "@/components/tables/RegionalTable";
import { RegionalProductTable } from "@/components/tables/RegionalProductTable";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getGeographicalData } from "@/services/profitability.service";
import { GeographicalData } from "@/types/profitability";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useFilter } from "@/contexts/FilterContext";

const COLUMN_DEFS = [
  { id: "stocks", label: "Stocks", visible: true },
  { id: "orders", label: "Orders", visible: true },
  { id: "unitsSold", label: "Units Sold", visible: true },
  { id: "refunds", label: "Refunds", visible: true },
  { id: "sales", label: "Sales", visible: true },
  { id: "amazonFees", label: "Amazon Fees", visible: true },
  { id: "sellableReturns", label: "Sellable Returns", visible: true },
];

const FILTER_FIELDS = ["Region", "Sales", "Orders", "Stocks"];

const SORTABLE_FIELDS = [
  { id: "region", label: "Region" },
  { id: "stocks", label: "Stocks" },
  { id: "orders", label: "Orders" },
  { id: "unitsSold", label: "Units Sold" },
  { id: "sales", label: "Sales" },
];


const breadcrumbItems = [
  { label: "Profitability", href: "/profitability/geo" },
  { label: "Geographical Data" },
];
export default function Geographical() {
  const { formatCurrency } = useCurrency();
  const { dateRange, frequency } = useFilter();
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedRegionCode, setSelectedRegionCode] = useState<string>("US");
  const [drillRegionId, setDrillRegionId] = useState<string | null>(null);
  const [viewLevel, setViewLevel] = useState<"state" | "product">("state");
  const [searchValue, setSearchValue] = useState("");
  const [columns, setColumns] = useState(COLUMN_DEFS);
  const [activeFilters, setActiveFilters] = useState<any[]>([]);
  const [showDeltas, setShowDeltas] = useState(false);
  const [catalogue, setCatalogue] = useState("all");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Data state
  const [geoData, setGeoData] = useState<GeographicalData[]>([]);
  const [loading, setLoading] = useState(true);

  const diffDays = Math.round((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
  const runRange = diffDays <= 7 ? "LAST_7_DAYS_FROM_TODAY" : diffDays <= 30 ? "LAST_30_DAYS_FROM_TODAY" : "CUSTOM_RANGE";
  const freq = frequency.toLowerCase() as "daily" | "weekly" | "monthly";

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const g = await getGeographicalData(runRange, dateRange.from.toISOString().split("T")[0], dateRange.to.toISOString().split("T")[0], freq);
      setGeoData(g);
    } catch {
      setGeoData([]);
    } finally {
      setLoading(false);
    }
  }, [runRange, dateRange.from, dateRange.to, freq]);

  useEffect(() => {
    let cancelled = false;
    const promise = loadData();
    promise.then(() => { if (cancelled) return; });
    return () => { cancelled = true; };
  }, [loadData]);

  const selectedRegion = useMemo(() => {
    if (geoData.length === 0) return undefined;
    const found = geoData.find((r) => r.countryCode === selectedRegionCode);
    return found || geoData[0];
  }, [geoData, selectedRegionCode]);

  const mobileRegions = useMemo(() => {
    if (!drillRegionId) return geoData;
    const parent = geoData.find((r) => r.id === drillRegionId);
    return parent?.children || [];
  }, [drillRegionId, geoData]);


  const handleColumnToggle = (id: string) => {
    setColumns((prev) => prev.map((c) => c.id === id ? { ...c, visible: !c.visible } : c));
  };

  const handleDownload = () => toast.success("Exporting geographical data...");

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Geographical Data"
          subtitle="Regional performance breakdown across markets"
        />
        <AppTaskbar showDateRange showRunButton onRun={() => { setRefreshKey(k => k + 1); toast.success("Refreshing data..."); }} breadcrumbItems={breadcrumbItems} />

        {loading ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">Loading...</div>
        ) : (
        <>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 h-full">
            <GeographyMap selectedRegion={selectedRegionCode} onRegionSelect={setSelectedRegionCode} geoData={geoData} />
          </div>
          <div className="h-full">
            {selectedRegion ? (
              <RegionStatsPanel region={selectedRegion} dateRange={`${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`} />
            ) : (
              <div className="h-full rounded-lg border border-border bg-card p-4 flex items-center justify-center text-muted-foreground text-sm">No data available</div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <DataTableToolbar
            leftContent={
              <div className="flex rounded-md border border-border">
                <button className={cn("px-3 py-1.5 text-sm font-medium transition-colors", viewLevel === "state" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground")} onClick={() => setViewLevel("state")}>State Level</button>
                <button className={cn("px-3 py-1.5 text-sm font-medium transition-colors", viewLevel === "product" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground")} onClick={() => setViewLevel("product")}>Product Level</button>
              </div>
            }
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            searchPlaceholder={viewLevel === "state" ? "Search region..." : "Search by Product Name / Item ID..."}
            columns={columns}
            onColumnToggle={handleColumnToggle}
            onSelectAllColumns={() => setColumns((prev) => prev.map((c) => ({ ...c, visible: true })))}
            onClearAllColumns={() => setColumns((prev) => prev.map((c) => ({ ...c, visible: false })))}
            activeFilters={activeFilters}
            onFiltersChange={setActiveFilters}
            filterFields={FILTER_FIELDS}
            onDownload={handleDownload}
            showDeltas={showDeltas}
            onShowDeltasChange={setShowDeltas}
            showUpload
            onUpload={(files) => toast.info(`Uploading ${files[0]?.name}...`)}
            uploadTitle="Upload COGS"
            sortableFields={SORTABLE_FIELDS}
            sortField={sortField}
            sortDirection={sortDirection}
            onSortChange={(f, d) => { setSortField(f); setSortDirection(d); }}
          />

          <div className="rounded-lg border border-border bg-card">
            {viewLevel === "state" ? (
              <RegionalTable data={geoData} searchValue={searchValue} />
            ) : (
              <RegionalProductTable searchValue={searchValue} />
            )}
          </div>
        </div>
        </>
        )}
      </div>
</AppLayout>

  );
}
