import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { InlineKPIStrip } from "@/components/advertising/InlineKPIStrip";
import { PerformanceChart } from "@/components/charts/PerformanceChart";
import { SearchTermsTable } from "@/components/tables/SearchTermsTable";
import { AddProductAdsPanel } from "@/components/advertising/AddProductAdsPanel";
import { getCampaigns, getAdGroups, getProductAds, getChartData, getKPIData } from "@/services/campaigns.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/status/StatusBadge";
import { Play, Pencil, Plus } from "lucide-react";
import { useFilter } from "@/contexts/FilterContext";
import { useActivePanel } from "@/contexts/ActivePanelContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { toast } from "sonner";
const breadcrumbItems = [
  { label: "Advertising", href: "/advertising/campaigns" },
  { label: "Product Ad Detail" },
];
export default function ProductAdDetail() {
  const { campaignId, adGroupId, productAdId } = useParams();
  const navigate = useNavigate();
  const { adType } = useFilter();
  const { formatCurrency } = useCurrency();
  const { setDataPanel } = useActivePanel();
  const [searchQuery, setSearchQuery] = useState("");
  const [showImpact, setShowImpact] = useState(false);
  const [showDeltas, setShowDeltas] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [adGroups, setAdGroups] = useState<any[]>([]);
  const [productAds, setProductAds] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [kpiData, setKpiData] = useState<any[]>([]);

  useEffect(() => {
    getCampaigns().then(setCampaigns).catch(() => setCampaigns([]));
    getAdGroups().then(setAdGroups).catch(() => setAdGroups([]));
    getProductAds().then(setProductAds).catch(() => setProductAds([]));
    getChartData().then(setChartData).catch(() => setChartData([]));
    getKPIData().then(setKpiData).catch(() => setKpiData([]));
  }, []);

  const campaign = campaigns.find((c: any) => c.id === campaignId);
  const adGroup = adGroups.find((ag: any) => ag.id === adGroupId);
  const productAd = productAds.find((pa: any) => pa.id === productAdId);
  const campaignName = campaign?.name || `Campaign ${campaignId}`;
  const adGroupName = adGroup?.name || `Ad Group ${adGroupId}`;
  const productAdName = productAd?.productName || `Product Ad ${productAdId}`;
  const adTypeLabel = adType === "All" ? "SP" : adType;

  const kpiItems = kpiData.slice(0, 5).map((kpi: any, index: number) => ({
    label: kpi.label,
    value: kpi.value,
    previousValue: kpi.previousValue,
    format: kpi.format as "currency" | "number" | "percentage" | "decimal",
    accentColor: index === 0 ? "primary" : index === 1 ? "success" : index === 2 ? "accent" : index === 3 ? "warning" : "destructive",
  }));

  return (
    <AppLayout>
      <div className="flex flex-1 min-h-0 min-w-0">
        <div className="flex-1 min-w-0 space-y-4">
          <PageHeader title="Advertising" />


          <AppTaskbar showFrequency showDateRange breadcrumbItems={[
            { label: "Advertising", href: "/advertising/campaigns" },
            { label: adTypeLabel, href: "/advertising/campaigns" },
            { label: campaignName, href: `/advertising/campaigns/${campaignId}` },
            { label: adGroupName, href: `/advertising/campaigns/${campaignId}/${adGroupId}` },
            { label: productAdName },
          ]}>
            <Button size="sm" className="gap-1.5 ml-2">
              <Play className="h-3.5 w-3.5" />Run
            </Button>
          </AppTaskbar>

          {productAd && (
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <img src={productAd.productImage} alt={productAd.productName} className="h-16 w-16 rounded-lg object-cover border border-border" />
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-semibold text-foreground">{productAd.productName}</h3>
                    <div className="flex items-center gap-3 flex-wrap">
                      <StatusBadge status={productAd.status} />
                      <Badge variant="outline" className="text-xs">{productAd.itemId}</Badge>
                      <Badge variant="outline" className="text-xs">SKU: {productAd.sku}</Badge>
                      <span className="text-xs text-muted-foreground">Bid: {formatCurrency(productAd.productBid)}</span>
                      <span className="text-xs text-muted-foreground">Min: {formatCurrency(productAd.minBid)} · Max: {formatCurrency(productAd.maxBid)}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs" onClick={() => toast.info("Product Ad settings coming soon")}>
                  <Pencil className="h-3.5 w-3.5" />Edit
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">Performance Overview</h2>
            <InlineKPIStrip items={kpiItems} />
            <PerformanceChart data={chartData} showImpact={showImpact} onShowImpactChange={setShowImpact} />
          </div>

          <DataTableToolbar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search search terms..."
            onDownload={() => toast.success("Exporting data as CSV...")}
            showDeltas={showDeltas}
            onShowDeltasChange={setShowDeltas}
            activeFilters={activeFilters}
            onFiltersChange={setActiveFilters}
            filterFields={["Search Term", "Impressions", "Clicks", "CTR", "Spend", "Sales", "ACOS", "ROAS"]}
            leftContent={
              <Button size="sm" className="gap-1.5 text-xs h-8" onClick={() => setDataPanel("addProductAd")}>
                <Plus className="h-3.5 w-3.5" />Add Product Ad
              </Button>
            }
          />


          <SearchTermsTable searchQuery={searchQuery} showDeltas={showDeltas} />
        </div>

        <AddProductAdsPanel />
      </div>
</AppLayout>
  );
}
