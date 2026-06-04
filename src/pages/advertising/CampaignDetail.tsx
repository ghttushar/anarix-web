import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { UnderlineTabs } from "@/components/advertising/UnderlineTabs";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { InlineKPIStrip } from "@/components/advertising/InlineKPIStrip";
import { PerformanceChart } from "@/components/charts/PerformanceChart";
import { CampaignInfoCard } from "@/components/advertising/CampaignInfoCard";
import { CampaignSettingsPanel } from "@/components/advertising/CampaignSettingsPanel";
import { AdGroupsTable } from "@/components/tables/AdGroupsTable";
import { ProductAdsTable } from "@/components/tables/ProductAdsTable";
import { KeywordTargetingTable } from "@/components/tables/KeywordTargetingTable";
import { SearchTermsTable } from "@/components/tables/SearchTermsTable";
import { mockCampaigns, mockChartData, mockKPIData } from "@/data/mockCampaigns";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useFilter } from "@/contexts/FilterContext";
import { toast } from "sonner";
import { MobileDrillHeader } from "@/views/mobile/MobileDrillHeader";
type TabValue = "ad-groups" | "product-ads" | "keywords" | "search-terms";

const tabs = [
  { value: "ad-groups", label: "Ad Groups" },
  { value: "product-ads", label: "Product Ads" },
  { value: "keywords", label: "Keywords" },
  { value: "search-terms", label: "Search Terms" },
];


const staticBreadcrumbItems = [
  { label: "Advertising", href: "/advertising/campaigns" },
  { label: "Campaign Detail" },
];
export default function CampaignDetail() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const { adType } = useFilter();
  const [activeTab, setActiveTab] = useState<TabValue>("ad-groups");
  const [searchQuery, setSearchQuery] = useState("");
  const [showImpact, setShowImpact] = useState(false);
  const [showDeltas, setShowDeltas] = useState(false);

  const campaign = mockCampaigns.find((c) => c.id === campaignId);
  const campaignName = campaign?.name || `Campaign ${campaignId}`;
  const adTypeLabel = adType === "All" ? "SP" : adType;

  const kpiItems = mockKPIData.slice(0, 5).map((kpi, index) => ({
    label: kpi.label,
    value: kpi.value,
    previousValue: kpi.previousValue,
    format: kpi.format as "currency" | "number" | "percentage" | "decimal",
    accentColor: index === 0 ? "primary" : index === 1 ? "success" : index === 2 ? "accent" : index === 3 ? "warning" : "destructive",
  }));

  const renderTable = () => {
    switch (activeTab) {
      case "ad-groups": return <AdGroupsTable searchQuery={searchQuery} showDeltas={showDeltas} onRowClick={(ag) => navigate(`/advertising/campaigns/${campaignId}/${ag.id}`)} />;
      case "product-ads": return <ProductAdsTable searchQuery={searchQuery} showAddButton showDeltas={showDeltas} onRowClick={(pa) => navigate(`/advertising/campaigns/${campaignId}/${pa.adGroupId}/${pa.id}`)} />;
      case "keywords": return <KeywordTargetingTable searchQuery={searchQuery} showDeltas={showDeltas} />;
      case "search-terms": return <SearchTermsTable searchQuery={searchQuery} showDeltas={showDeltas} />;
      default: return null;
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-1 min-h-0 min-w-0">
        <div className="flex-1 min-w-0 space-y-4">
          <MobileDrillHeader title={campaignName} subtitle={adTypeLabel} to="/advertising/campaigns" />
          <PageHeader title="Advertising" />

          <AppTaskbar showFrequency showDateRange breadcrumbItems={[
            { label: "Advertising", href: "/advertising/campaigns" },
            { label: adTypeLabel, href: "/advertising/campaigns" },
            { label: campaignName },
          ]}>
            <Button size="sm" className="gap-1.5 ml-2">
              <Play className="h-3.5 w-3.5" />Run
            </Button>
          </AppTaskbar>

          {campaign && <CampaignInfoCard campaign={campaign} />}

          <div className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">Performance Overview</h2>
            <InlineKPIStrip items={kpiItems} />
            <PerformanceChart data={mockChartData} showImpact={showImpact} onShowImpactChange={setShowImpact} />
          </div>

          <UnderlineTabs tabs={tabs} value={activeTab} onChange={(v) => setActiveTab(v as TabValue)} />

          <DataTableToolbar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder={`Search ${activeTab.replace("-", " ")}...`}
            onDownload={() => toast.success("Exporting data as CSV...")}
            showDeltas={showDeltas}
            onShowDeltasChange={setShowDeltas}
          />

          {renderTable()}
        </div>

        {campaign && <CampaignSettingsPanel campaign={campaign} />}
      </div>
</AppLayout>
  );
}
