import { useMemo, useState } from "react";
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
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useCurrency } from "@/contexts/CurrencyContext";

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
  const [geoData, setGeoData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const g = await getGeographicalData();
      if (cancelled) return;
      setGeoData(g);
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const regionLookupLocal: Record<string, any> = useMemo(() => ({
    US: geoData[0],
    CA: geoData[0]?.children?.[0] || geoData[0],
    TX: geoData[0]?.children?.[1] || geoData[0],
    NY: geoData[0]?.children?.[2] || geoData[0],
    FL: geoData[0]?.children?.[3] || geoData[0],
  }), [geoData]);

  const selectedRegion = regionLookupLocal[selectedRegionCode] || geoData[0];

  const mobileRegions = useMemo(() => {
    if (!drillRegionId) return geoData;
    const parent = geoData.find((r: any) => r.id === drillRegionId);
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
        <AppTaskbar showDateRange showRunButton onRun={() => toast.info("Refreshing data...")} breadcrumbItems={breadcrumbItems} />

        {loading ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">Loading...</div>
        ) : (
        <>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 h-full">
            <GeographyMap selectedRegion={selectedRegionCode} onRegionSelect={setSelectedRegionCode} />
          </div>
          <div className="h-full">
            <RegionStatsPanel region={selectedRegion} dateRange="Jan 1 - Jan 30, 2026" />
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
