import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { mockCampaigns } from "@/data/mockCampaigns";
import { mockAdGroups } from "@/data/mockAdGroups";
import { mockProductAds } from "@/data/mockProductAds";
import type { Campaign } from "@/types/campaign";
import type { AdGroup, ProductAd } from "@/types/advertising";
import { TabletDataTable } from "../../data/TabletDataTable";
import { TabletTableToolbar } from "../../data/TabletTableToolbar";
import { TabletColumnMenu } from "../../data/TabletColumnMenu";
import type { TabletColumn } from "../../data/types";
import { TabletFilterBuilder } from "../../filters/TabletFilterBuilder";
import { TabletFilterChips } from "../../filters/TabletFilterChips";
import type { FilterState } from "../../filters/types";
import { TabletKpiBand } from "../kpi/TabletKpiBand";
import { usd, num, pct, x } from "../format";

function StatusBadge({ status }: { status: string }) {
  const tone: Record<string, string> = {
    live: "bg-emerald-100 text-emerald-700",
    paused: "bg-amber-100 text-amber-700",
    archived: "bg-muted text-muted-foreground",
    scheduled: "bg-blue-100 text-blue-700",
    out_of_budget: "bg-red-100 text-red-700",
    completed: "bg-muted text-muted-foreground",
  };
  return (
    <span className={`text-xs rounded px-2 py-0.5 ${tone[status] ?? "bg-muted"}`}>
      {status.replace("_", " ")}
    </span>
  );
}

const CAMPAIGN_COLS_DEF: { id: string; label: string }[] = [
  { id: "name", label: "Campaign" },
  { id: "status", label: "Status" },
  { id: "type", label: "Type" },
  { id: "dailyBudget", label: "Daily budget" },
  { id: "spend", label: "Spend" },
  { id: "sales", label: "Sales" },
  { id: "roas", label: "ROAS" },
  { id: "acos", label: "ACoS" },
  { id: "impressions", label: "Impressions" },
  { id: "clicks", label: "Clicks" },
  { id: "ctr", label: "CTR" },
  { id: "cpc", label: "CPC" },
  { id: "orders", label: "Orders" },
];

export function TabletCampaignManager() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState<Set<string>>(
    new Set(["name", "status", "type", "dailyBudget", "spend", "sales", "roas", "acos"]),
  );
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState<FilterState>({ combinator: "and", rules: [] });
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const rows = mockCampaigns;
  const kpis = useMemo(() => {
    const spend = rows.reduce((a, r) => a + r.spend, 0);
    const sales = rows.reduce((a, r) => a + r.sales, 0);
    const orders = rows.reduce((a, r) => a + r.orders, 0);
    const acos = (spend / sales) * 100;
    const roas = sales / spend;
    return [
      { label: "Spend", value: usd(spend), delta: { value: 8.2, positive: true } },
      { label: "Sales", value: usd(sales), delta: { value: 12.4, positive: true } },
      { label: "ROAS", value: x(roas), delta: { value: 3.1, positive: true } },
      { label: "ACoS", value: pct(acos), delta: { value: 1.8, positive: false } },
      { label: "Orders", value: num(orders), delta: { value: 5.6, positive: true } },
    ];
  }, [rows]);

  const allCols: TabletColumn<Campaign>[] = [
    {
      id: "name",
      header: "Campaign",
      sticky: true,
      sortable: true,
      cell: (r) => (
        <button onClick={() => navigate(`/tablet/advertising/campaigns/${r.id}`)} className="font-medium text-primary underline-offset-2 hover:underline">
          {r.name}
        </button>
      ),
    },
    { id: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
    { id: "type", header: "Type", cell: (r) => r.type, sortable: true },
    { id: "dailyBudget", header: "Daily budget", align: "right", sortable: true, cell: (r) => usd(r.dailyBudget) },
    { id: "spend", header: "Spend", align: "right", sortable: true, cell: (r) => usd(r.spend) },
    { id: "sales", header: "Sales", align: "right", sortable: true, cell: (r) => usd(r.sales) },
    { id: "roas", header: "ROAS", align: "right", sortable: true, cell: (r) => x(r.roas) },
    { id: "acos", header: "ACoS", align: "right", sortable: true, cell: (r) => pct(r.acos) },
    { id: "impressions", header: "Impressions", align: "right", sortable: true, cell: (r) => num(r.impressions) },
    { id: "clicks", header: "Clicks", align: "right", sortable: true, cell: (r) => num(r.clicks) },
    { id: "ctr", header: "CTR", align: "right", sortable: true, cell: (r) => pct(r.ctr) },
    { id: "cpc", header: "CPC", align: "right", sortable: true, cell: (r) => `$${r.cpc.toFixed(2)}` },
    { id: "orders", header: "Orders", align: "right", sortable: true, cell: (r) => num(r.orders) },
  ];
  const cols = allCols.filter((c) => visible.has(c.id));
  const columnLabel = (id: string) => CAMPAIGN_COLS_DEF.find((c) => c.id === id)?.label ?? id;

  return (
    <div className="flex flex-col h-full p-3 gap-3">
      <TabletKpiBand chips={kpis} />
      <TabletDataTable
        rows={rows}
        columns={cols}
        rowKey={(r) => r.id}
        selectable
        selected={selected}
        onSelectedChange={setSelected}
        toolbar={
          <TabletTableToolbar
            title="Campaigns"
            selectedCount={selected.size}
            onColumnsClick={() => setColumnsOpen(true)}
            onFilterClick={() => setFilterOpen(true)}
            chips={
              <TabletFilterChips
                rules={filter.rules}
                columnLabel={columnLabel}
                onRemove={(id) => setFilter((f) => ({ ...f, rules: f.rules.filter((r) => r.id !== id) }))}
              />
            }
          />
        }
      />
      <TabletColumnMenu open={columnsOpen} onClose={() => setColumnsOpen(false)} options={CAMPAIGN_COLS_DEF} visible={visible} onChange={setVisible} />
      <TabletFilterBuilder open={filterOpen} onClose={() => setFilterOpen(false)} columns={CAMPAIGN_COLS_DEF} initial={filter} onApply={setFilter} />
    </div>
  );
}

export function TabletCampaignDetail() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const campaign = mockCampaigns.find((c) => c.id === campaignId);
  const adGroups = useMemo(() => mockAdGroups.filter((g) => g.campaignId === campaignId), [campaignId]);

  if (!campaign) return <div className="p-6 text-sm text-muted-foreground">Campaign not found.</div>;

  const kpis = [
    { label: "Spend", value: usd(campaign.spend) },
    { label: "Sales", value: usd(campaign.sales) },
    { label: "ROAS", value: x(campaign.roas) },
    { label: "ACoS", value: pct(campaign.acos) },
    { label: "Daily budget", value: usd(campaign.dailyBudget) },
    { label: "Orders", value: num(campaign.orders) },
  ];

  const cols: TabletColumn<AdGroup>[] = [
    {
      id: "name", header: "Ad Group", sticky: true, sortable: true,
      cell: (r) => (
        <button onClick={() => navigate(`/tablet/advertising/campaigns/${campaignId}/${r.id}`)} className="font-medium text-primary hover:underline">
          {r.name}
        </button>
      ),
    },
    { id: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
    { id: "spend", header: "Spend", align: "right", sortable: true, cell: (r) => usd(r.adSpend) },
    { id: "sales", header: "Sales", align: "right", sortable: true, cell: (r) => usd(r.adSales) },
    { id: "roas", header: "ROAS", align: "right", sortable: true, cell: (r) => x(r.roas) },
    { id: "acos", header: "ACoS", align: "right", sortable: true, cell: (r) => pct(r.acos) },
    { id: "impressions", header: "Impressions", align: "right", sortable: true, cell: (r) => num(r.impressions) },
    { id: "clicks", header: "Clicks", align: "right", sortable: true, cell: (r) => num(r.clicks) },
    { id: "ctr", header: "CTR", align: "right", sortable: true, cell: (r) => pct(r.ctr) },
    { id: "cpc", header: "CPC", align: "right", sortable: true, cell: (r) => `$${r.cpc.toFixed(2)}` },
  ];

  return (
    <div className="flex flex-col h-full p-3 gap-3">
      <h1 className="text-lg font-semibold truncate">{campaign.name}</h1>
      <TabletKpiBand chips={kpis} />
      <TabletDataTable
        rows={adGroups}
        columns={cols}
        rowKey={(r) => r.id}
        toolbar={<TabletTableToolbar title="Ad Groups" />}
        emptyMessage="No ad groups in this campaign."
      />
    </div>
  );
}

export function TabletAdGroupDetail() {
  const { campaignId, adGroupId } = useParams();
  const navigate = useNavigate();
  const adGroup = mockAdGroups.find((g) => g.id === adGroupId);
  const productAds = useMemo(() => mockProductAds.filter((p) => p.adGroupId === adGroupId), [adGroupId]);

  if (!adGroup) return <div className="p-6 text-sm text-muted-foreground">Ad group not found.</div>;

  const kpis = [
    { label: "Spend", value: usd(adGroup.adSpend) },
    { label: "Sales", value: usd(adGroup.adSales) },
    { label: "ROAS", value: x(adGroup.roas) },
    { label: "ACoS", value: pct(adGroup.acos) },
    { label: "Impressions", value: num(adGroup.impressions) },
    { label: "Clicks", value: num(adGroup.clicks) },
  ];

  const cols: TabletColumn<ProductAd>[] = [
    {
      id: "name", header: "Product Ad", sticky: true, sortable: true,
      cell: (r) => (
        <button onClick={() => navigate(`/tablet/advertising/campaigns/${campaignId}/${adGroupId}/${r.id}`)} className="font-medium text-primary hover:underline">
          {r.productName}
        </button>
      ),
    },
    { id: "sku", header: "SKU", cell: (r) => r.sku },
    { id: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
    { id: "bid", header: "Bid", align: "right", cell: (r) => `$${r.productBid.toFixed(2)}` },
    { id: "spend", header: "Spend", align: "right", sortable: true, cell: (r) => usd(r.adSpend) },
    { id: "impressions", header: "Impressions", align: "right", sortable: true, cell: (r) => num(r.impressions) },
    { id: "clicks", header: "Clicks", align: "right", sortable: true, cell: (r) => num(r.clicks) },
    { id: "ctr", header: "CTR", align: "right", sortable: true, cell: (r) => pct(r.ctr) },
    { id: "cvr", header: "CVR", align: "right", sortable: true, cell: (r) => pct(r.cvr) },
  ];

  return (
    <div className="flex flex-col h-full p-3 gap-3">
      <h1 className="text-lg font-semibold truncate">{adGroup.name}</h1>
      <TabletKpiBand chips={kpis} />
      <TabletDataTable
        rows={productAds}
        columns={cols}
        rowKey={(r) => r.id}
        toolbar={<TabletTableToolbar title="Product Ads" />}
        emptyMessage="No product ads."
      />
    </div>
  );
}

export function TabletProductAdDetail() {
  const { productAdId } = useParams();
  const ad = mockProductAds.find((p) => p.id === productAdId);
  if (!ad) return <div className="p-6 text-sm text-muted-foreground">Product ad not found.</div>;
  const kpis = [
    { label: "Spend", value: usd(ad.adSpend) },
    { label: "Impressions", value: num(ad.impressions) },
    { label: "Clicks", value: num(ad.clicks) },
    { label: "CTR", value: pct(ad.ctr) },
    { label: "CVR", value: pct(ad.cvr) },
    { label: "Units", value: num(ad.adUnits) },
  ];
  return (
    <div className="flex flex-col h-full p-3 gap-3">
      <h1 className="text-lg font-semibold truncate">{ad.productName}</h1>
      <div className="text-xs text-muted-foreground">SKU {ad.sku} · Item {ad.itemId}</div>
      <TabletKpiBand chips={kpis} />
      <div className="rounded-md border border-border bg-card p-4 text-sm text-muted-foreground">
        Product-level detail metrics available. Mirrors desktop product ad detail content.
      </div>
    </div>
  );
}
