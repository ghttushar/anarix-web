import { mockAnomalyAlerts, type AnomalyAlert } from "@/data/mockAnomalyAlerts";
import { mockPacingCampaigns, type PacingCampaign } from "@/data/mockBudgetPacing";
import { mockHarvestCandidates, type HarvestCandidate } from "@/data/mockSearchHarvesting";
import { mockCreativeAssets, type CreativeAsset } from "@/data/mockCreativeAnalyzer";
import { cn } from "@/lib/utils";
import { TabletDataTable } from "../../data/TabletDataTable";
import { TabletTableToolbar } from "../../data/TabletTableToolbar";
import type { TabletColumn } from "../../data/types";
import { usd, num, pct, x } from "../format";

function Severity({ s }: { s: string }) {
  const tone: Record<string, string> = {
    critical: "bg-red-100 text-red-700",
    warning: "bg-amber-100 text-amber-700",
    info: "bg-blue-100 text-blue-700",
  };
  return <span className={cn("text-xs rounded px-2 py-0.5", tone[s])}>{s}</span>;
}

export function TabletAnomalyAlerts() {
  const cols: TabletColumn<AnomalyAlert>[] = [
    { id: "metric", header: "Metric", sticky: true, sortable: true, cell: (r) => <span className="font-medium">{r.metric}</span> },
    { id: "severity", header: "Severity", cell: (r) => <Severity s={r.severity} /> },
    { id: "campaign", header: "Campaign", cell: (r) => r.campaign },
    { id: "current", header: "Current", align: "right", cell: (r) => r.currentValue },
    { id: "expected", header: "Expected", align: "right", cell: (r) => r.expectedValue },
    { id: "dev", header: "Δ", align: "right", sortable: true, cell: (r) => `${r.direction === "up" ? "+" : ""}${r.deviation}%` },
    { id: "msg", header: "Detail", cell: (r) => <span className="text-muted-foreground truncate max-w-[420px] inline-block">{r.message}</span> },
  ];
  return (
    <div className="flex flex-col h-full p-3 gap-3">
      <TabletDataTable
        rows={mockAnomalyAlerts}
        columns={cols}
        rowKey={(r) => r.id}
        toolbar={<TabletTableToolbar title="Anomaly Alerts" />}
      />
    </div>
  );
}

export function TabletBudgetPacing() {
  const cols: TabletColumn<PacingCampaign>[] = [
    { id: "name", header: "Campaign", sticky: true, sortable: true, cell: (r) => <span className="font-medium">{r.name}</span> },
    { id: "status", header: "Pacing", cell: (r) => (
      <span className={cn(
        "text-xs rounded px-2 py-0.5",
        r.status === "on_track" && "bg-emerald-100 text-emerald-700",
        r.status === "overspending" && "bg-red-100 text-red-700",
        r.status === "underspending" && "bg-amber-100 text-amber-700",
        r.status === "depleted" && "bg-muted text-muted-foreground",
      )}>{r.status.replace("_", " ")}</span>
    )},
    { id: "daily", header: "Daily budget", align: "right", sortable: true, cell: (r) => usd(r.dailyBudget) },
    { id: "today", header: "Spent today", align: "right", sortable: true, cell: (r) => usd(r.spentToday) },
    { id: "burn", header: "Burn rate", align: "right", sortable: true, cell: (r) => pct(r.burnRate) },
    { id: "month", header: "Monthly budget", align: "right", cell: (r) => usd(r.monthlyBudget) },
    { id: "mtd", header: "MTD spend", align: "right", cell: (r) => usd(r.spentThisMonth) },
    { id: "proj", header: "Projected", align: "right", cell: (r) => usd(r.projectedMonthlySpend) },
  ];
  return (
    <div className="flex flex-col h-full p-3 gap-3">
      <TabletDataTable
        rows={mockPacingCampaigns}
        columns={cols}
        rowKey={(r) => r.id}
        toolbar={<TabletTableToolbar title="Budget Pacing" />}
      />
    </div>
  );
}

export function TabletSearchHarvesting() {
  const cols: TabletColumn<HarvestCandidate>[] = [
    { id: "term", header: "Search term", sticky: true, sortable: true, cell: (r) => <span className="font-medium">{r.searchTerm}</span> },
    { id: "src", header: "Source", cell: (r) => r.sourceCampaign },
    { id: "match", header: "Suggested", cell: (r) => <span className="text-xs rounded px-2 py-0.5 bg-primary/10 text-primary capitalize">{r.suggestedMatchType}</span> },
    { id: "bid", header: "Sug. bid", align: "right", cell: (r) => `$${r.suggestedBid.toFixed(2)}` },
    { id: "conf", header: "Confidence", align: "right", sortable: true, cell: (r) => `${r.confidence}%` },
    { id: "spend", header: "Spend", align: "right", sortable: true, cell: (r) => usd(r.adSpend) },
    { id: "sales", header: "Sales", align: "right", sortable: true, cell: (r) => usd(r.adSales) },
    { id: "roas", header: "ROAS", align: "right", sortable: true, cell: (r) => x(r.roas) },
    { id: "acos", header: "ACoS", align: "right", sortable: true, cell: (r) => pct(r.acos) },
    { id: "cvr", header: "CVR", align: "right", sortable: true, cell: (r) => pct(r.cvr) },
    { id: "impr", header: "Impressions", align: "right", cell: (r) => num(r.impressions) },
    { id: "clicks", header: "Clicks", align: "right", cell: (r) => num(r.clicks) },
  ];
  return (
    <div className="flex flex-col h-full p-3 gap-3">
      <TabletDataTable
        rows={mockHarvestCandidates}
        columns={cols}
        rowKey={(r) => r.id}
        toolbar={<TabletTableToolbar title="Search Term Harvesting" />}
      />
    </div>
  );
}

export function TabletCreativeAnalyzer() {
  const cols: TabletColumn<CreativeAsset>[] = [
    { id: "name", header: "Creative", sticky: true, sortable: true, cell: (r) => <span className="font-medium">{r.name}</span> },
    { id: "type", header: "Type", cell: (r) => r.type },
    { id: "campaign", header: "Campaign", cell: (r) => r.campaign },
    { id: "spend", header: "Spend", align: "right", sortable: true, cell: (r) => usd(r.adSpend) },
    { id: "sales", header: "Sales", align: "right", sortable: true, cell: (r) => usd(r.adSales) },
    { id: "roas", header: "ROAS", align: "right", sortable: true, cell: (r) => x(r.roas) },
    { id: "impr", header: "Impressions", align: "right", sortable: true, cell: (r) => num(r.impressions) },
    { id: "clicks", header: "Clicks", align: "right", sortable: true, cell: (r) => num(r.clicks) },
    { id: "ctr", header: "CTR", align: "right", sortable: true, cell: (r) => pct(r.ctr) },
    { id: "cvr", header: "CVR", align: "right", sortable: true, cell: (r) => pct(r.cvr) },
    { id: "tags", header: "Tags", cell: (r) => (
      <div className="flex gap-1 flex-wrap">
        {r.tags.slice(0, 3).map((t) => (
          <span key={t} className="text-xs rounded bg-muted px-2 py-0.5">{t}</span>
        ))}
      </div>
    )},
  ];
  return (
    <div className="flex flex-col h-full p-3 gap-3">
      <TabletDataTable
        rows={mockCreativeAssets}
        columns={cols}
        rowKey={(r) => r.id}
        toolbar={<TabletTableToolbar title="Creative Analyzer" />}
      />
    </div>
  );
}
