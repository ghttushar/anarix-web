import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  mockImpactCampaigns,
  mockImpactAdGroups,
  mockImpactProducts,
} from "@/data/mockImpactData";
import type { ImpactComparison } from "@/types/advertising";
import { cn } from "@/lib/utils";
import { TabletDataTable } from "../../data/TabletDataTable";
import { TabletTableToolbar } from "../../data/TabletTableToolbar";
import type { TabletColumn } from "../../data/types";
import { TabletKpiBand } from "../kpi/TabletKpiBand";
import { usd, num, pct, x } from "../format";

function Delta({ pct: value }: { pct: number }) {
  const positive = value >= 0;
  return (
    <span className={cn("text-xs rounded-full px-2 py-0.5", positive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700")}>
      {positive ? "+" : ""}{value.toFixed(1)}%
    </span>
  );
}

function makeColumns(navigate: (id: string) => void, basePath: string): TabletColumn<ImpactComparison>[] {
  return [
    {
      id: "name", header: "Name", sticky: true, sortable: true,
      cell: (r) => (
        <button onClick={() => navigate(r.id)} className="font-medium text-primary hover:underline text-left">{r.name}</button>
      ),
    },
    { id: "impact", header: "Impact", cell: (r) => <Delta pct={r.impactPercentage} /> },
    { id: "baseSpend", header: "Base Spend", align: "right", cell: (r) => usd(r.baseline.adSpend) },
    { id: "newSpend", header: "Now Spend", align: "right", cell: (r) => usd(r.impact.adSpend) },
    { id: "baseSales", header: "Base Sales", align: "right", cell: (r) => usd(r.baseline.adSales) },
    { id: "newSales", header: "Now Sales", align: "right", cell: (r) => usd(r.impact.adSales) },
    { id: "baseRoas", header: "Base ROAS", align: "right", cell: (r) => x(r.baseline.roas) },
    { id: "newRoas", header: "Now ROAS", align: "right", cell: (r) => x(r.impact.roas) },
    { id: "baseAcos", header: "Base ACoS", align: "right", cell: (r) => pct(r.baseline.acos) },
    { id: "newAcos", header: "Now ACoS", align: "right", cell: (r) => pct(r.impact.acos) },
    { id: "impr", header: "Impressions", align: "right", cell: (r) => num(r.impact.impressions) },
    { id: "clicks", header: "Clicks", align: "right", cell: (r) => num(r.impact.clicks) },
  ];
}

export function TabletImpactAnalysis() {
  const navigate = useNavigate();
  const rows = mockImpactCampaigns;
  const kpis = useMemo(() => {
    const baseSpend = rows.reduce((a, r) => a + r.baseline.adSpend, 0);
    const newSpend = rows.reduce((a, r) => a + r.impact.adSpend, 0);
    const baseSales = rows.reduce((a, r) => a + r.baseline.adSales, 0);
    const newSales = rows.reduce((a, r) => a + r.impact.adSales, 0);
    const delta = ((newSales - baseSales) / baseSales) * 100;
    return [
      { label: "Base Spend", value: usd(baseSpend) },
      { label: "Now Spend", value: usd(newSpend) },
      { label: "Base Sales", value: usd(baseSales) },
      { label: "Now Sales", value: usd(newSales) },
      { label: "Sales Δ", value: `${delta.toFixed(1)}%`, delta: { value: delta, positive: delta >= 0 } },
    ];
  }, [rows]);

  return (
    <div className="flex flex-col h-full p-3 gap-3">
      <TabletKpiBand chips={kpis} />
      <TabletDataTable
        rows={rows}
        columns={makeColumns((id) => navigate(`/tablet/advertising/impact/campaigns/${id}`), "campaigns")}
        rowKey={(r) => r.id}
        toolbar={<TabletTableToolbar title="Impact Analysis — Campaigns" />}
      />
    </div>
  );
}

export function TabletImpactCampaignDetail() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const campaign = mockImpactCampaigns.find((c) => c.id === campaignId);
  const rows = mockImpactAdGroups;

  if (!campaign) return <div className="p-6 text-sm text-muted-foreground">Campaign not found.</div>;

  return (
    <div className="flex flex-col h-full p-3 gap-3">
      <div>
        <h1 className="text-lg font-semibold truncate">{campaign.name}</h1>
        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
          <span>Impact</span> <Delta pct={campaign.impactPercentage} />
        </div>
      </div>
      <TabletDataTable
        rows={rows}
        columns={makeColumns((id) => navigate(`/tablet/advertising/impact/campaigns/${campaignId}/${id}`), "adgroups")}
        rowKey={(r) => r.id}
        toolbar={<TabletTableToolbar title="Ad Groups" />}
      />
    </div>
  );
}

export function TabletImpactAdGroupDetail() {
  const { adGroupId } = useParams();
  const ag = mockImpactAdGroups.find((c) => c.id === adGroupId) ?? mockImpactAdGroups[0];
  const rows = mockImpactProducts;
  return (
    <div className="flex flex-col h-full p-3 gap-3">
      <div>
        <h1 className="text-lg font-semibold truncate">{ag.name}</h1>
        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
          <span>Impact</span> <Delta pct={ag.impactPercentage} />
        </div>
      </div>
      <TabletDataTable
        rows={rows}
        columns={makeColumns(() => {}, "")}
        rowKey={(r) => r.id}
        toolbar={<TabletTableToolbar title="Product Ads" />}
      />
    </div>
  );
}
