import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { UnderlineTabs } from "@/components/advertising/UnderlineTabs";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { ImpactTable } from "@/components/tables/ImpactTable";
import { Button } from "@/components/ui/button";
import { Download, Maximize2 } from "lucide-react";
import { toast } from "sonner";
import { ImpactDateRangePair } from "@/components/advertising/ImpactDateRangePair";
import { ImpactMetricMultiSelect } from "@/components/advertising/ImpactMetricMultiSelect";
import { ImpactLineChart } from "@/components/charts/ImpactLineChart";
import { DateRange, ImpactMetricKey, addDays } from "@/lib/utils/impactSeries";
import {
  mockImpactCampaigns,
  mockImpactAdGroups,
  mockImpactProducts,
  mockImpactKeywords,
  mockImpactSearchTerms,
} from "@/data/mockImpactData";

type ImpactTab = "campaigns" | "ad-groups" | "products" | "keywords" | "search-terms";

const tabs = [
  { value: "campaigns", label: "Campaigns" },
  { value: "ad-groups", label: "Ad Groups" },
  { value: "products", label: "Products" },
  { value: "keywords", label: "Keywords" },
  { value: "search-terms", label: "Search Terms" },
];

const SORTABLE_FIELDS = [
  { id: "name", label: "Name" },
  { id: "impactPercentage", label: "Impact %" },
  { id: "adSpend", label: "Ad Spend" },
  { id: "adSales", label: "Ad Sales" },
  { id: "roas", label: "ROAS" },
];

const FILTER_FIELDS = ["Name", "Impact %", "Impressions", "Clicks", "CTR", "Ad Spend", "Ad Sales", "ROAS", "ACOS"];

const breadcrumbItems = [
  { label: "Advertising", href: "/advertising/impact" },
  { label: "Impact Analysis" },
];

// Default: last 7 days as impact, prior 7 days as previous
function defaultRanges(): { previous: DateRange; impact: DateRange } {
  const today = new Date();
  const impactTo = today;
  const impactFrom = addDays(today, -6);
  const previousTo = addDays(impactFrom, -1);
  const previousFrom = addDays(previousTo, -6);
  return { previous: { from: previousFrom, to: previousTo }, impact: { from: impactFrom, to: impactTo } };
}

export default function ImpactAnalysis() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ImpactTab>("campaigns");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMetrics, setSelectedMetrics] = useState<ImpactMetricKey[]>(["adSpend", "adSales"]);
  const [{ previous, impact }, setRanges] = useState(defaultRanges());
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [activeFilters, setActiveFilters] = useState<{ id: string; field: string; operator: string; value: string }[]>([]);

  const data = useMemo(() => {
    switch (activeTab) {
      case "campaigns": return mockImpactCampaigns;
      case "ad-groups": return mockImpactAdGroups;
      case "products": return mockImpactProducts;
      case "keywords": return mockImpactKeywords;
      case "search-terms": return mockImpactSearchTerms;
      default: return mockImpactCampaigns;
    }
  }, [activeTab]);

  const selectedItems = data;

  const handleDownload = () => {
    toast.success("Exporting impact data as CSV...");
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Impact Analysis"
          subtitle="Compare performance across time periods to measure campaign impact"
        />
        <AppTaskbar
          showRunButton
          onRun={() => toast.info("Analyzing impact comparison...")}
          breadcrumbItems={breadcrumbItems}
        >
          <ImpactDateRangePair
            previous={previous}
            impact={impact}
            onChange={setRanges}
          />
          <ImpactMetricMultiSelect selected={selectedMetrics} onChange={setSelectedMetrics} />
        </AppTaskbar>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-heading text-sm font-medium text-foreground">Performance Comparison</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Showing all {data.length} items
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer" title="Expand chart"><Maximize2 className="h-3.5 w-3.5" /></Button>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer" onClick={handleDownload} title="Download data"><Download className="h-3.5 w-3.5" /></Button>
            </div>
          </div>
          <ImpactLineChart
            items={selectedItems}
            previous={previous}
            impact={impact}
            metrics={selectedMetrics}
          />
        </div>

        <UnderlineTabs tabs={tabs} value={activeTab} onChange={(v) => setActiveTab(v as ImpactTab)} />

        <DataTableToolbar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder={`Search ${activeTab.replace("-", " ")}...`}
          onDownload={handleDownload}
          activeFilters={activeFilters}
          onFiltersChange={setActiveFilters}
          filterFields={FILTER_FIELDS}
          sortableFields={SORTABLE_FIELDS}
          sortField={sortField}
          sortDirection={sortDirection}
          onSortChange={(f, d) => { setSortField(f); setSortDirection(d); }}
        />

        <ImpactTable
          data={data}
          searchQuery={searchQuery}
          hideSelection
          onRowClick={activeTab === "campaigns" ? (id) => navigate(`/advertising/impact/campaigns/${id}`) : undefined}
        />
      </div>
    </AppLayout>
  );
}
