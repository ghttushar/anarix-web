import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { InlineKPIStrip } from "@/components/advertising/InlineKPIStrip";
import { UnderlineTabs } from "@/components/advertising/UnderlineTabs";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { PerformanceChart } from "@/components/charts/PerformanceChart";
import { CampaignTable } from "@/components/tables/CampaignTable";
import { AdGroupsTable } from "@/components/tables/AdGroupsTable";
import { ProductAdsTable } from "@/components/tables/ProductAdsTable";
import { KeywordTargetingTable } from "@/components/tables/KeywordTargetingTable";
import { SearchTermsTable } from "@/components/tables/SearchTermsTable";
import { PageTypeTable } from "@/components/tables/PageTypeTable";
import { PlatformTable } from "@/components/tables/PlatformTable";
import { ProductTargetingTable } from "@/components/tables/ProductTargetingTable";
import { CreateCampaignModal } from "@/components/advertising/CreateCampaignModal";
import { CreateCampaignPanel } from "@/components/panels/CreateCampaignPanel";
import { mockCampaigns, mockChartData, mockKPIData } from "@/data/mockCampaigns";
import { useMarketplace } from "@/contexts/MarketplaceContext";
import { useFilter } from "@/contexts/FilterContext";
import { Campaign } from "@/types/campaign";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useActivePanel } from "@/contexts/ActivePanelContext";
import { TagsProvider, useTags } from "@/contexts/TagsContext";
import { CampaignBulkActionsBar } from "@/components/advertising/CampaignBulkActionsBar";
import { useViewport } from "@/contexts/ViewportContext";
import { MobileCard, MobileCardList } from "@/views/mobile/MobileCardList";
import { useCurrency } from "@/contexts/CurrencyContext";
type TabValue = "campaigns" | "ad-groups" | "product-ads" | "keywords" | "product-targeting" | "search-terms" | "page-type" | "platform";

interface FilterRule {
  id: string;
  field: string;
  operator: string;
  value: string;
}

const tabs = [
  { value: "campaigns", label: "Campaigns" },
  { value: "ad-groups", label: "Ad Groups" },
  { value: "product-ads", label: "Product Ads" },
  { value: "keywords", label: "Keyword Targeting" },
  { value: "product-targeting", label: "Product Targeting" },
  { value: "search-terms", label: "Search Terms" },
  { value: "page-type", label: "Page Type" },
  { value: "platform", label: "Platform" },
];

const COLUMN_DEFS: Record<string, { id: string; label: string }[]> = {
  campaigns: [
    { id: "active", label: "Active" }, { id: "status", label: "Status" },
    { id: "name", label: "Campaign Name" },
    { id: "startDate", label: "Start Date" }, { id: "endDate", label: "End Date" },
    { id: "biddingStrategy", label: "Bidding Strategy" }, { id: "dailyBudget", label: "Budget" },
    { id: "totalBudget", label: "Total Budget" }, { id: "spend", label: "Spend" },
    { id: "sales", label: "Sales" }, { id: "roas", label: "ROAS" }, { id: "impressions", label: "Impressions" },
    { id: "clicks", label: "Clicks" }, { id: "ctr", label: "CTR" }, { id: "acos", label: "ACOS" },
  ],
  "ad-groups": [
    { id: "status", label: "Status" }, { id: "name", label: "Ad Group" }, { id: "campaign", label: "Campaign" },
    { id: "bidAuto", label: "Bid Auto" }, { id: "impressions", label: "Impressions" }, { id: "clicks", label: "Clicks" },
    { id: "ctr", label: "CTR" }, { id: "adSpend", label: "Ad Spend" }, { id: "adSales", label: "Ad Sales" },
    { id: "roas", label: "ROAS" }, { id: "acos", label: "ACOS" },
  ],
  "product-ads": [
    { id: "status", label: "Status" }, { id: "productAd", label: "Product Ad" }, { id: "adGroup", label: "Ad Group" },
    { id: "campaign", label: "Campaign" }, { id: "impressions", label: "Impressions" }, { id: "clicks", label: "Clicks" },
    { id: "ctr", label: "CTR" }, { id: "adSpend", label: "Ad Spend" },
  ],
  keywords: [
    { id: "status", label: "Status" }, { id: "keyword", label: "Keyword" }, { id: "matchType", label: "Match Type" },
    { id: "adGroup", label: "Ad Group" }, { id: "campaign", label: "Campaign" }, { id: "impressions", label: "Impressions" },
    { id: "clicks", label: "Clicks" }, { id: "adSpend", label: "Ad Spend" },
  ],
  "product-targeting": [
    { id: "status", label: "Status" }, { id: "target", label: "Target" }, { id: "type", label: "Type" },
    { id: "adGroup", label: "Ad Group" }, { id: "campaign", label: "Campaign" }, { id: "impressions", label: "Impressions" },
    { id: "clicks", label: "Clicks" }, { id: "adSpend", label: "Ad Spend" }, { id: "adSales", label: "Ad Sales" },
    { id: "roas", label: "ROAS" }, { id: "acos", label: "ACOS" },
  ],
  "search-terms": [
    { id: "searchTerm", label: "Search Term" }, { id: "productAd", label: "Product Ad" }, { id: "keyword", label: "Keyword" },
    { id: "matchType", label: "Match Type" }, { id: "impressions", label: "Impressions" }, { id: "clicks", label: "Clicks" },
    { id: "adSpend", label: "Ad Spend" },
  ],
  "page-type": [
    { id: "pageType", label: "Page Type" }, { id: "bidModifier", label: "Bid Modifier" },
    { id: "impressions", label: "Impressions" }, { id: "adSpend", label: "Ad Spend" }, { id: "roas", label: "ROAS" },
  ],
  platform: [
    { id: "platform", label: "Platform" }, { id: "bidModifier", label: "Bid Modifier" },
    { id: "impressions", label: "Impressions" }, { id: "adSpend", label: "Ad Spend" }, { id: "roas", label: "ROAS" },
  ],
};

const FILTER_FIELDS: Record<string, string[]> = {
  campaigns: ["Campaign Status", "Campaign Name", "Campaign Type", "Daily Budget", "Spend", "ROAS", "ACOS", "Bidding Strategy"],
  "ad-groups": ["Status", "Ad Group Name", "Campaign Name", "Impressions", "ROAS"],
  "product-ads": ["Status", "Product Name", "SKU", "Ad Group", "Campaign"],
  keywords: ["Status", "Keyword", "Match Type", "Ad Group", "Campaign"],
  "product-targeting": ["Status", "Target", "Type", "Ad Group", "Campaign"],
  "search-terms": ["Search Term", "Keyword", "Match Type", "Campaign"],
  "page-type": ["Page Type", "Bid Modifier", "ROAS"],
  platform: ["Platform", "Bid Modifier", "ROAS"],
};

const SORTABLE_FIELDS: Record<string, { id: string; label: string }[]> = {
  campaigns: [
    { id: "name", label: "Campaign Name" }, { id: "dailyBudget", label: "Budget" },
    { id: "spend", label: "Spend" }, { id: "sales", label: "Sales" }, { id: "roas", label: "ROAS" },
    { id: "impressions", label: "Impressions" }, { id: "clicks", label: "Clicks" },
    { id: "ctr", label: "CTR" }, { id: "acos", label: "ACOS" },
  ],
  "ad-groups": [
    { id: "name", label: "Ad Group" }, { id: "campaignName", label: "Campaign" },
    { id: "impressions", label: "Impressions" }, { id: "clicks", label: "Clicks" },
    { id: "adSpend", label: "Ad Spend" }, { id: "adSales", label: "Ad Sales" },
    { id: "roas", label: "ROAS" }, { id: "acos", label: "ACOS" },
  ],
  "product-ads": [
    { id: "productName", label: "Product" }, { id: "impressions", label: "Impressions" },
    { id: "clicks", label: "Clicks" }, { id: "adSpend", label: "Ad Spend" },
    { id: "roas", label: "ROAS" }, { id: "acos", label: "ACOS" },
  ],
  keywords: [
    { id: "keyword", label: "Keyword" }, { id: "impressions", label: "Impressions" },
    { id: "clicks", label: "Clicks" }, { id: "adSpend", label: "Ad Spend" },
    { id: "roas", label: "ROAS" }, { id: "acos", label: "ACOS" },
  ],
  "product-targeting": [
    { id: "targetLabel", label: "Target" }, { id: "impressions", label: "Impressions" },
    { id: "clicks", label: "Clicks" }, { id: "adSpend", label: "Ad Spend" },
    { id: "roas", label: "ROAS" }, { id: "acos", label: "ACOS" },
  ],
  "search-terms": [
    { id: "searchTerm", label: "Search Term" }, { id: "impressions", label: "Impressions" },
    { id: "clicks", label: "Clicks" }, { id: "adSpend", label: "Ad Spend" },
  ],
  "page-type": [
    { id: "pageType", label: "Page Type" }, { id: "impressions", label: "Impressions" },
    { id: "adSpend", label: "Ad Spend" }, { id: "roas", label: "ROAS" },
  ],
  platform: [
    { id: "platform", label: "Platform" }, { id: "impressions", label: "Impressions" },
    { id: "adSpend", label: "Ad Spend" }, { id: "roas", label: "ROAS" },
  ],
};

const AVAILABLE_METRICS = [
  { key: "impressions", label: "Impressions", format: "number" as const },
  { key: "clicks", label: "Clicks", format: "number" as const },
  { key: "spend", label: "Ad Spend", format: "currency" as const },
  { key: "sales", label: "Ad Sales", format: "currency" as const },
  { key: "orders", label: "Ad Orders", format: "number" as const },
  { key: "roas", label: "ROAS", format: "decimal" as const },
  { key: "acos", label: "ACOS", format: "percentage" as const },
  { key: "ctr", label: "CTR", format: "percentage" as const },
  { key: "cpc", label: "CPC", format: "currency" as const },
];


const breadcrumbItems = [
  { label: "Advertising", href: "/advertising/campaigns" },
  { label: "Campaign Manager" },
];
export default function CampaignManager() {
  return (
    <TagsProvider>
      <CampaignManagerInner />
    </TagsProvider>
  );
}

function CampaignManagerInner() {
  const navigate = useNavigate();
  const { isWalmart } = useMarketplace();
  const { adType, setAdType } = useFilter();
  const { setDataPanel } = useActivePanel();
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [activeTab, setActiveTab] = useState<TabValue>("campaigns");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"view" | "edit">("view");
  const [activeFilters, setActiveFilters] = useState<FilterRule[]>([]);
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());
  const [selectedKPIs, setSelectedKPIs] = useState<string[]>(
    mockKPIData.slice(0, 5).map((k) => k.label)
  );
  const [showImpact, setShowImpact] = useState(false);
  const [showDeltas, setShowDeltas] = useState(false);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const { commitDrafts, discardDrafts } = useTags();
  const { view } = useViewport();
  const { formatCurrency } = useCurrency();
  const isMobile = view === "mobile";

  const kpiItems = mockKPIData
    .filter((kpi) => selectedKPIs.includes(kpi.label))
    .map((kpi, index) => ({
      label: kpi.label,
      value: kpi.value,
      previousValue: kpi.previousValue,
      format: kpi.format as "currency" | "number" | "percentage" | "decimal",
      accentColor: index === 0 ? "primary" : index === 1 ? "success" : index === 2 ? "accent" : index === 3 ? "warning" : "destructive",
    }));

  const currentColumnDefs = COLUMN_DEFS[activeTab] || [];
  const columns = currentColumnDefs.map((c) => ({ ...c, visible: !hiddenColumns.has(c.id) }));

  const handleColumnToggle = (columnId: string) => {
    setHiddenColumns((prev) => {
      const next = new Set(prev);
      if (next.has(columnId)) next.delete(columnId); else next.add(columnId);
      return next;
    });
  };

  const handleSelectAllColumns = () => setHiddenColumns(new Set());
  const handleClearAllColumns = () => setHiddenColumns(new Set(currentColumnDefs.map((c) => c.id)));

  const handleActiveToggle = (id: string, isActive: boolean) => {
    setCampaigns((prev) =>
      prev.map((c) => c.id === id ? { ...c, isActive, status: isActive ? "live" : "paused" } : c)
    );
  };

  const handleCampaignUpdate = (id: string, updates: Partial<Campaign>) => {
    setCampaigns((prev) =>
      prev.map((c) => c.id === id ? { ...c, ...updates } : c)
    );
  };

  const handleKPISwap = (index: number, newMetricKey: string) => {
    const metric = AVAILABLE_METRICS.find((m) => m.key === newMetricKey);
    if (!metric) return;
    setSelectedKPIs((prev) => {
      const next = [...prev];
      next[index] = metric.label;
      return next;
    });
  };

  const handleCreateCampaign = (data: { name: string; type: string; biddingStrategy: string; dailyBudget: number; startDate: string; endDate?: string }) => {
    const newCampaign: Campaign = {
      id: `camp-new-${Date.now()}`, name: data.name, status: "live", isActive: true,
      biddingStrategy: data.biddingStrategy as any, type: data.type as any,
      dailyBudget: data.dailyBudget, totalBudget: data.dailyBudget * 30,
      spend: 0, sales: 0, roas: 0, impressions: 0, clicks: 0, ctr: 0, acos: 0, orders: 0, cpc: 0, units: 0,
      startDate: data.startDate, endDate: data.endDate,
    };
    setCampaigns((prev) => [newCampaign, ...prev]);
  };

  const renderTable = () => {
    // Mobile uses the same desktop tables — CSS handles the horizontal
    // scroll + sticky first column. Drill-down detail screens keep their
    // own stacked layouts via MobileDrillHeader.
    switch (activeTab) {
      case "campaigns": return <CampaignTable campaigns={campaigns} onActiveToggle={handleActiveToggle} onCampaignUpdate={handleCampaignUpdate} showTotalBudget={isWalmart} searchQuery={searchQuery} viewMode={viewMode} onRowClick={(id) => navigate(`/advertising/campaigns/${id}`)} hiddenColumns={hiddenColumns} showDeltas={showDeltas} selectedIds={selectedIds} onSelectionChange={setSelectedIds} />;
      case "ad-groups": return <AdGroupsTable searchQuery={searchQuery} showDeltas={showDeltas} />;
      case "product-ads": return <ProductAdsTable searchQuery={searchQuery} showDeltas={showDeltas} />;
      case "keywords": return <KeywordTargetingTable searchQuery={searchQuery} showDeltas={showDeltas} />;
      case "product-targeting": return <ProductTargetingTable searchQuery={searchQuery} showDeltas={showDeltas} />;
      case "search-terms": return <SearchTermsTable searchQuery={searchQuery} showDeltas={showDeltas} />;
      case "page-type": return <PageTypeTable searchQuery={searchQuery} showDeltas={showDeltas} />;
      case "platform": return <PlatformTable searchQuery={searchQuery} showDeltas={showDeltas} />;
      default: return null;
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-1 min-h-0 min-w-0">
        <div className="flex-1 min-w-0 space-y-6">
        <PageHeader
            title="Campaign Manager"
            subtitle="Manage and optimize your advertising campaigns"
          />
          <AppTaskbar showFrequency showDateRange showRunButton onRun={() => toast.info("Refreshing data...")} breadcrumbItems={breadcrumbItems}>
            <div className="flex items-center gap-1.5 rounded-md bg-muted/40 px-2.5 py-1">
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Ad Type</span>
              <Select value={adType} onValueChange={(v) => setAdType(v as any)}>
                <SelectTrigger className="h-8 w-[130px] text-sm border-0 bg-transparent shadow-none px-1.5 cursor-pointer">
                  <SelectValue placeholder="Ad Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All" className="text-xs cursor-pointer">All Types</SelectItem>
                  <SelectItem value="SP" className="text-xs cursor-pointer">Sponsored Products</SelectItem>
                  <SelectItem value="SB" className="text-xs cursor-pointer">Sponsored Brands</SelectItem>
                  <SelectItem value="SD" className="text-xs cursor-pointer">Sponsored Display</SelectItem>
                  <SelectItem value="SV" className="text-xs cursor-pointer">Sponsored Video</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </AppTaskbar>

          <InlineKPIStrip items={kpiItems} availableMetrics={AVAILABLE_METRICS} onMetricChange={handleKPISwap} />
          <PerformanceChart
            data={mockChartData}
            showImpact={showImpact}
            onShowImpactChange={setShowImpact}
            selectedMetrics={(() => {
              const labelToKey: Record<string, string> = {
                "Ad Spend": "adSpend", "Ad Sales": "adSales", "Ad Units": "clicks", "Ad Orders": "clicks",
                "ROAS": "roas", "Impressions": "impressions", "Clicks": "clicks",
                "CTR": "ctr", "CPC": "cpc", "ACOS": "acos",
              };
              return selectedKPIs.slice(0, 4).map((l) => labelToKey[l] || "adSpend") as any;
            })()}
            onSelectedMetricsChange={(next) => {
              const keyToLabel: Record<string, string> = {
                adSpend: "Ad Spend", adSales: "Ad Sales", roas: "ROAS",
                impressions: "Impressions", clicks: "Clicks", ctr: "CTR", cpc: "CPC", acos: "ACOS",
              };
              setSelectedKPIs(next.map((k) => keyToLabel[k] || k));
            }}
          />
          <UnderlineTabs tabs={tabs} value={activeTab} onChange={(v) => setActiveTab(v as TabValue)} />

          <DataTableToolbar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder={`Search ${activeTab.replace("-", " ")}...`}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            showViewToggle={activeTab === "campaigns" || activeTab === "ad-groups" || activeTab === "keywords"}
            columns={columns}
            onColumnToggle={handleColumnToggle}
            onSelectAllColumns={handleSelectAllColumns}
            onClearAllColumns={handleClearAllColumns}
            activeFilters={activeFilters}
            onFiltersChange={setActiveFilters}
            filterFields={FILTER_FIELDS[activeTab] || []}
            onDownload={() => toast.success("Exporting data as CSV...")}
            showDeltas={showDeltas}
            onShowDeltasChange={setShowDeltas}
            sortableFields={SORTABLE_FIELDS[activeTab] || []}
            sortField={sortField}
            sortDirection={sortDirection}
            onSortChange={(field, dir) => { setSortField(field); setSortDirection(dir); }}
            leftContent={
              <Button data-write-action size="sm" className="gap-1.5 text-xs h-8" onClick={() => setDataPanel("createCampaign")}>
                <Plus className="h-3.5 w-3.5" />Create Campaign
              </Button>
            }
          />

          {viewMode === "edit" && activeTab === "campaigns" && (
            <CampaignBulkActionsBar
              selectedIds={Array.from(selectedIds)}
              totalCount={campaigns.length}
              onClearSelection={() => setSelectedIds(new Set())}
              onCancel={() => { discardDrafts(); setSelectedIds(new Set()); setViewMode("view"); }}
              onSave={() => { commitDrafts(); setSelectedIds(new Set()); toast.success("Changes saved"); }}
              onBulkUpdate={(updates) => {
                selectedIds.forEach((id) => handleCampaignUpdate(id, updates));
              }}
            />
          )}


          {renderTable()}
        </div>

        <CreateCampaignPanel onSubmit={handleCreateCampaign} />
      </div>

      <CreateCampaignModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateCampaign}
      />
</AppLayout>
  );
}
