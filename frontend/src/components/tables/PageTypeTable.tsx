import { useState } from "react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHeader, TableRow,
} from "@/components/ui/table";
import { DeltaBadge } from "@/components/ui/delta-badge";
import { getDelta } from "@/lib/utils/deltaGenerator";
import { mockPageTypes, pageTypesTotals } from "@/data/mockPageTypePlatform";
import { TablePagination } from "./TablePagination";
import { SortableTableHead, sortData, usePinning } from "./SortableTableHead";
import { cn } from "@/lib/utils";

interface PageTypeTableProps {
  searchQuery?: string;
  showDeltas?: boolean;
}

const PINNABLE = ["pageType", "bidModifier", "impressions", "clicks", "ctr", "cpc", "adSpend", "adSales", "roas", "acos"];

export function PageTypeTable({ searchQuery = "", showDeltas = false }: PageTypeTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const { pinnedColumns, handlePinToggle, ps, pc } = usePinning(PINNABLE, 0);
  const [bidModifiers, setBidModifiers] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    mockPageTypes.forEach((pt) => { initial[pt.id] = pt.bidModifier; });
    return initial;
  });

  const filteredTypes = mockPageTypes.filter((pt) =>
    pt.pageType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSort = (field: string) => {
    if (sortField === field) {
      if (sortDirection === "desc") { setSortField(null); setSortDirection("asc"); }
      else setSortDirection("desc");
    } else { setSortField(field); setSortDirection("asc"); }
  };

  const sorted = sortData(filteredTypes, sortField, sortDirection);
  const paginatedTypes = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const { formatCurrency } = useCurrency();
  const formatNumber = (value: number) => new Intl.NumberFormat("en-US").format(value);
  const formatPercent = (value: number) => `${value.toFixed(2)}%`;

  const NumCell = ({ formatted, id, metric }: { formatted: string; id: string; metric: string }) => (
    <div className="flex flex-col items-end">
      <span className="text-foreground">{formatted}</span>
      {showDeltas && <DeltaBadge value={getDelta(id, metric)} />}
    </div>
  );

  const TotalCell = ({ value, metric }: { value: string; metric: string }) => (
    <div className="flex flex-col items-end">
      <span className="text-foreground">{value}</span>
      {showDeltas && <DeltaBadge value={getDelta("total", metric)} />}
    </div>
  );

  const sp = { sortField, sortDirection, onSort: handleSort, pinnedColumns, onPinToggle: handlePinToggle };

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted hover:bg-muted">
              <SortableTableHead field="pageType" {...sp} className={cn("min-w-[180px]", pc("pageType", true))} style={ps("pageType")}>Page Type</SortableTableHead>
              <SortableTableHead field="bidModifier" {...sp} className={cn("w-32 text-right", pc("bidModifier", true))} style={ps("bidModifier")} align="right">Bid Modifier %</SortableTableHead>
              <SortableTableHead field="impressions" {...sp} className={cn("text-right", pc("impressions", true))} style={ps("impressions")} align="right">Impressions</SortableTableHead>
              <SortableTableHead field="clicks" {...sp} className={cn("text-right", pc("clicks", true))} style={ps("clicks")} align="right">Clicks</SortableTableHead>
              <SortableTableHead field="ctr" {...sp} className={cn("text-right", pc("ctr", true))} style={ps("ctr")} align="right">CTR</SortableTableHead>
              <SortableTableHead field="cpc" {...sp} className={cn("text-right", pc("cpc", true))} style={ps("cpc")} align="right">CPC</SortableTableHead>
              <SortableTableHead field="adSpend" {...sp} className={cn("text-right", pc("adSpend", true))} style={ps("adSpend")} align="right">Ad Spend</SortableTableHead>
              <SortableTableHead field="adSales" {...sp} className={cn("text-right", pc("adSales", true))} style={ps("adSales")} align="right">Ad Sales</SortableTableHead>
              <SortableTableHead field="roas" {...sp} className={cn("text-right", pc("roas", true))} style={ps("roas")} align="right">ROAS</SortableTableHead>
              <SortableTableHead field="acos" {...sp} className={cn("text-right", pc("acos", true))} style={ps("acos")} align="right">ACOS</SortableTableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTypes.map((pageType) => (
              <TableRow key={pageType.id}>
                <TableCell style={ps("pageType")} className={cn("font-medium text-foreground", pc("pageType"))}>{pageType.pageType}</TableCell>
                <TableCell style={ps("bidModifier")} className={cn("text-right", pc("bidModifier"))}>
                  <div className="flex items-center justify-end gap-1">
                    <Input type="number" value={bidModifiers[pageType.id]} onChange={(e) => setBidModifiers((prev) => ({ ...prev, [pageType.id]: parseInt(e.target.value) || 0 }))} className="h-8 w-20 text-right" min={0} max={1000} />
                    <span className="text-muted-foreground">%</span>
                  </div>
                </TableCell>
                <TableCell style={ps("impressions")} className={cn("text-right", pc("impressions"))}><NumCell formatted={formatNumber(pageType.impressions)} id={pageType.id} metric="impressions" /></TableCell>
                <TableCell style={ps("clicks")} className={cn("text-right", pc("clicks"))}><NumCell formatted={formatNumber(pageType.clicks)} id={pageType.id} metric="clicks" /></TableCell>
                <TableCell style={ps("ctr")} className={cn("text-right", pc("ctr"))}><NumCell formatted={formatPercent(pageType.ctr)} id={pageType.id} metric="ctr" /></TableCell>
                <TableCell style={ps("cpc")} className={cn("text-right", pc("cpc"))}><NumCell formatted={formatCurrency(pageType.cpc)} id={pageType.id} metric="cpc" /></TableCell>
                <TableCell style={ps("adSpend")} className={cn("text-right", pc("adSpend"))}><NumCell formatted={formatCurrency(pageType.adSpend)} id={pageType.id} metric="adSpend" /></TableCell>
                <TableCell style={ps("adSales")} className={cn("text-right", pc("adSales"))}><NumCell formatted={formatCurrency(pageType.adSales)} id={pageType.id} metric="adSales" /></TableCell>
                <TableCell style={ps("roas")} className={cn("text-right", pc("roas"))}><NumCell formatted={pageType.roas.toFixed(2)} id={pageType.id} metric="roas" /></TableCell>
                <TableCell style={ps("acos")} className={cn("text-right", pc("acos"))}><NumCell formatted={formatPercent(pageType.acos)} id={pageType.id} metric="acos" /></TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-muted font-medium hover:bg-muted">
              <TableCell colSpan={2} className="font-semibold">Total ({filteredTypes.length} page types)</TableCell>
              <TableCell className="text-right"><TotalCell value={formatNumber(pageTypesTotals.impressions)} metric="impressions" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatNumber(pageTypesTotals.clicks)} metric="clicks" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatPercent(pageTypesTotals.ctr)} metric="ctr" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatCurrency(pageTypesTotals.cpc)} metric="cpc" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatCurrency(pageTypesTotals.adSpend)} metric="adSpend" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatCurrency(pageTypesTotals.adSales)} metric="adSales" /></TableCell>
              <TableCell className="text-right"><TotalCell value={pageTypesTotals.roas.toFixed(2)} metric="roas" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatPercent(pageTypesTotals.acos)} metric="acos" /></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <TablePagination page={currentPage} pageSize={pageSize} totalItems={filteredTypes.length} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} />
    </div>
  );
}
