import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { ImpactTable } from "@/components/tables/ImpactTable";
import { Button } from "@/components/ui/button";
import { Download, Maximize2 } from "lucide-react";
import { toast } from "sonner";
import { ImpactDateRangePair } from "@/components/advertising/ImpactDateRangePair";
import { ImpactMetricMultiSelect } from "@/components/advertising/ImpactMetricMultiSelect";
import { ImpactLineChart } from "@/components/charts/ImpactLineChart";
import { DateRange, ImpactMetricKey, addDays } from "@/lib/utils/impactSeries";
import { mockImpactAdGroups, mockImpactCampaigns, mockImpactProducts } from "@/data/mockImpactData";

const SORTABLE_FIELDS = [
  { id: "name", label: "Name" },
  { id: "impactPercentage", label: "Impact %" },
  { id: "adSpend", label: "Ad Spend" },
  { id: "adSales", label: "Ad Sales" },
  { id: "roas", label: "ROAS" },
];

function defaultRanges(): { previous: DateRange; impact: DateRange } {
  const today = new Date();
  const impactTo = today;
  const impactFrom = addDays(today, -6);
  const previousTo = addDays(impactFrom, -1);
  const previousFrom = addDays(previousTo, -6);
  return { previous: { from: previousFrom, to: previousTo }, impact: { from: impactFrom, to: impactTo } };
}

export default function ImpactAdGroupDetail() {
  const { campaignId = "", adGroupId = "" } = useParams();
  const campaign = mockImpactCampaigns.find((c) => c.id === campaignId);
  const adGroup = mockImpactAdGroups.find((a) => a.id === adGroupId);
  const data = useMemo(() => mockImpactProducts.filter((p) => p.adGroupId === adGroupId), [adGroupId]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMetrics, setSelectedMetrics] = useState<ImpactMetricKey[]>(["adSpend", "adSales"]);
  const [{ previous, impact }, setRanges] = useState(defaultRanges());
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const selectedItems = selectedIds.size > 0 ? data.filter((d) => selectedIds.has(d.id)) : data;

  const breadcrumbItems = [
    { label: "Advertising", href: "/advertising/impact" },
    { label: "Impact Analysis", href: "/advertising/impact" },
    { label: campaign?.name ?? "Campaign", href: `/advertising/impact/campaigns/${campaignId}` },
    { label: adGroup?.name ?? "Ad Group" },
  ];

  const handleDownload = () => toast.success("Exporting impact data as CSV...");

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title={adGroup?.name ?? "Ad Group"}
          subtitle="Products within this ad group — compare impact across time periods"
        />
        <AppTaskbar
          showRunButton
          onRun={() => toast.info("Analyzing impact comparison...")}
          breadcrumbItems={breadcrumbItems}
        >
          <ImpactDateRangePair previous={previous} impact={impact} onChange={setRanges} />
          <ImpactMetricMultiSelect selected={selectedMetrics} onChange={setSelectedMetrics} />
        </AppTaskbar>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-heading text-sm font-medium text-foreground">Performance Comparison</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {selectedIds.size > 0
                  ? `Showing ${selectedIds.size} selected product${selectedIds.size === 1 ? "" : "s"}`
                  : `Showing all ${data.length} products — select rows below to filter`}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer" title="Expand chart"><Maximize2 className="h-3.5 w-3.5" /></Button>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer" onClick={handleDownload} title="Download data"><Download className="h-3.5 w-3.5" /></Button>
            </div>
          </div>
          <ImpactLineChart items={selectedItems} previous={previous} impact={impact} metrics={selectedMetrics} />
        </div>

        <DataTableToolbar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search products..."
          onDownload={handleDownload}
          sortableFields={SORTABLE_FIELDS}
          sortField={sortField}
          sortDirection={sortDirection}
          onSortChange={(f, d) => { setSortField(f); setSortDirection(d); }}
        />

        <ImpactTable
          data={data}
          searchQuery={searchQuery}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
        />
      </div>
    </AppLayout>
  );
}
