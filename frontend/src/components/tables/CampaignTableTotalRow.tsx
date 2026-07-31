import { TableCell, TableRow } from "@/components/ui/table";
import { Campaign } from "@/types/campaign";
import { DeltaBadge } from "@/components/ui/delta-badge";
import { getDelta } from "@/lib/utils/deltaGenerator";
import { useCurrency } from "@/contexts/CurrencyContext";

interface CampaignTableTotalRowProps {
  campaigns: Campaign[];
  showTotalBudget?: boolean;
  viewMode?: "view" | "edit";
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function CampaignTableTotalRow({ campaigns, showTotalBudget = true, viewMode = "view" }: CampaignTableTotalRowProps) {
  const { formatCurrency } = useCurrency();
  const isEdit = viewMode === "edit";

  const totals = {
    dailyBudget: campaigns.reduce((sum, c) => sum + c.dailyBudget, 0),
    totalBudget: campaigns.reduce((sum, c) => sum + (c.totalBudget || 0), 0),
    spend: campaigns.reduce((sum, c) => sum + c.spend, 0),
    sales: campaigns.reduce((sum, c) => sum + c.sales, 0),
    impressions: campaigns.reduce((sum, c) => sum + c.impressions, 0),
    clicks: campaigns.reduce((sum, c) => sum + c.clicks, 0),
  };

  const derivedTotals = {
    roas: totals.spend > 0 ? totals.sales / totals.spend : 0,
    ctr: totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0,
    acos: totals.sales > 0 ? (totals.spend / totals.sales) * 100 : 0,
  };

  const TotalCell = ({ value, metric }: { value: string; metric: string }) => (
    <div className="flex flex-col items-end">
      <span className="text-foreground">{value}</span>
      <DeltaBadge value={getDelta("total", metric)} />
    </div>
  );

  // colSpan covers: Status + Campaign Name = 2
  // In edit mode, Active column adds 1
  const labelColSpan = isEdit ? 3 : 2;

  return (
    <TableRow className="bg-muted/30 font-medium">
      <TableCell colSpan={labelColSpan} className="text-foreground">Total ({campaigns.length} campaigns)</TableCell>
      {/* Start Date, End Date, Bidding Strategy — empty for totals */}
      <TableCell />
      <TableCell />
      <TableCell />
      <TableCell className="text-right"><TotalCell value={formatCurrency(totals.dailyBudget)} metric="dailyBudget" /></TableCell>
      {showTotalBudget && (
        <TableCell className="text-right"><TotalCell value={formatCurrency(totals.totalBudget)} metric="totalBudget" /></TableCell>
      )}
      <TableCell className="text-right"><TotalCell value={formatCurrency(totals.spend)} metric="spend" /></TableCell>
      <TableCell className="text-right"><TotalCell value={formatCurrency(totals.sales)} metric="sales" /></TableCell>
      <TableCell className="text-right"><TotalCell value={derivedTotals.roas.toFixed(2)} metric="roas" /></TableCell>
      <TableCell className="text-right"><TotalCell value={formatNumber(totals.impressions)} metric="impressions" /></TableCell>
      <TableCell className="text-right"><TotalCell value={formatNumber(totals.clicks)} metric="clicks" /></TableCell>
      <TableCell className="text-right"><TotalCell value={formatPercent(derivedTotals.ctr)} metric="ctr" /></TableCell>
      <TableCell className="text-right"><TotalCell value={formatPercent(derivedTotals.acos)} metric="acos" /></TableCell>
    </TableRow>
  );
}
