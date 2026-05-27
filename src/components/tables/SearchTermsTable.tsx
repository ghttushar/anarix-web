import { useState } from "react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { DeltaBadge } from "@/components/ui/delta-badge";
import { getDelta } from "@/lib/utils/deltaGenerator";
import { mockSearchTerms, searchTermsTotals } from "@/data/mockSearchTerms";
import { mockCampaigns } from "@/data/mockCampaigns";
import { cn } from "@/lib/utils";
import { TablePagination } from "./TablePagination";
import { SortableTableHead, sortData, usePinning } from "./SortableTableHead";

interface SearchTermsTableProps {
  searchQuery?: string;
  showDeltas?: boolean;
}

const matchTypeColors: Record<string, string> = {
  broad: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  exact: "bg-green-500/10 text-green-600 border-green-500/20",
  phrase: "bg-purple-500/10 text-purple-600 border-purple-500/20",
};

const PINNABLE = ["keyword", "adGroupName", "campaignName", "impressions", "clicks", "ctr", "adUnits", "cvr", "cpc", "adSpend", "adSales", "roas", "acos"];
const FIXED_OFFSET = 240;

export function SearchTermsTable({ searchQuery = "", showDeltas = false }: SearchTermsTableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const { pinnedColumns, handlePinToggle, ps, pc } = usePinning(PINNABLE, FIXED_OFFSET);

  const filteredTerms = mockSearchTerms.filter((term) =>
    term.searchTerm.toLowerCase().includes(searchQuery.toLowerCase()) ||
    term.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    term.keyword.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSort = (field: string) => {
    if (sortField === field) {
      if (sortDirection === "desc") { setSortField(null); setSortDirection("asc"); }
      else setSortDirection("desc");
    } else { setSortField(field); setSortDirection("asc"); }
  };

  const sorted = sortData(filteredTerms, sortField, sortDirection);
  const paginatedTerms = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const { formatCurrency } = useCurrency();
  const formatNumber = (value: number) => new Intl.NumberFormat("en-US").format(value);
  const formatPercent = (value: number) => `${value.toFixed(2)}%`;

  const toggleRow = (id: string) => {
    setSelectedRows((prev) => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  };
  const toggleAll = () => {
    if (selectedRows.size === paginatedTerms.length) setSelectedRows(new Set());
    else setSelectedRows(new Set(paginatedTerms.map((t) => t.id)));
  };

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
              <TableHead className="w-10 sticky left-0 z-10 bg-muted">
                <Checkbox checked={selectedRows.size === paginatedTerms.length && paginatedTerms.length > 0} onCheckedChange={toggleAll} />
              </TableHead>
              <SortableTableHead field="searchTerm" {...sp} isFixed className="min-w-[200px] sticky left-[40px] z-10 bg-muted">Search Term</SortableTableHead>
              <SortableTableHead field="keyword" {...sp} className={cn("min-w-[150px]", pc("keyword", true))} style={ps("keyword")}>Keyword</SortableTableHead>
              <TableHead className="w-24">Match Type</TableHead>
              <SortableTableHead field="adGroupName" {...sp} className={cn("min-w-[150px]", pc("adGroupName", true))} style={ps("adGroupName")}>Ad Group</SortableTableHead>
              <SortableTableHead field="campaignName" {...sp} className={cn("min-w-[180px]", pc("campaignName", true))} style={ps("campaignName")}>Campaign</SortableTableHead>
              <SortableTableHead field="impressions" {...sp} className={cn("text-right", pc("impressions", true))} style={ps("impressions")} align="right">Impressions</SortableTableHead>
              <SortableTableHead field="clicks" {...sp} className={cn("text-right", pc("clicks", true))} style={ps("clicks")} align="right">Clicks</SortableTableHead>
              <SortableTableHead field="ctr" {...sp} className={cn("text-right", pc("ctr", true))} style={ps("ctr")} align="right">CTR</SortableTableHead>
              <SortableTableHead field="adUnits" {...sp} className={cn("text-right", pc("adUnits", true))} style={ps("adUnits")} align="right">Ad Units</SortableTableHead>
              <SortableTableHead field="cvr" {...sp} className={cn("text-right", pc("cvr", true))} style={ps("cvr")} align="right">CVR</SortableTableHead>
              <SortableTableHead field="cpc" {...sp} className={cn("text-right", pc("cpc", true))} style={ps("cpc")} align="right">CPC</SortableTableHead>
              <SortableTableHead field="adSpend" {...sp} className={cn("text-right", pc("adSpend", true))} style={ps("adSpend")} align="right">Ad Spend</SortableTableHead>
              <SortableTableHead field="adSales" {...sp} className={cn("text-right", pc("adSales", true))} style={ps("adSales")} align="right">Ad Sales</SortableTableHead>
              <SortableTableHead field="roas" {...sp} className={cn("text-right", pc("roas", true))} style={ps("roas")} align="right">ROAS</SortableTableHead>
              <SortableTableHead field="acos" {...sp} className={cn("text-right", pc("acos", true))} style={ps("acos")} align="right">ACOS</SortableTableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTerms.map((term) => (
              <TableRow key={term.id} className="group cursor-pointer hover:bg-muted/50 transition-colors">
                <TableCell className="sticky left-0 z-10 bg-background group-hover:bg-muted transition-colors">
                  <Checkbox checked={selectedRows.has(term.id)} onCheckedChange={() => toggleRow(term.id)} />
                </TableCell>
                <TableCell className="font-medium text-foreground sticky left-[40px] z-10 bg-background group-hover:bg-muted transition-colors">{term.searchTerm}</TableCell>
                <TableCell style={ps("keyword")} className={cn("text-foreground", pc("keyword"))}>{term.keyword}</TableCell>
                <TableCell><Badge variant="outline" className={cn("text-xs uppercase", matchTypeColors[term.matchType])}>{term.matchType}</Badge></TableCell>
                <TableCell style={ps("adGroupName")} className={cn("text-foreground", pc("adGroupName"))}>{term.adGroupName}</TableCell>
                <TableCell style={ps("campaignName")} className={cn(pc("campaignName"))}>
                  {(() => {
                    const ct = mockCampaigns.find((c) => c.name === term.campaignName)?.type;
                    return (
                      <div className="flex items-center gap-2">
                        {ct && (
                          <Badge variant="outline" className={cn("text-xs", ct === "auto" ? "border-primary/30 bg-primary/5 text-primary" : "border-secondary/30 bg-secondary/5 text-secondary-foreground")}>
                            {ct === "auto" ? "Auto" : "Manual"}
                          </Badge>
                        )}
                        <span className="text-foreground">{term.campaignName}</span>
                      </div>
                    );
                  })()}
                </TableCell>
                <TableCell style={ps("impressions")} className={cn("text-right", pc("impressions"))}><NumCell formatted={formatNumber(term.impressions)} id={term.id} metric="impressions" /></TableCell>
                <TableCell style={ps("clicks")} className={cn("text-right", pc("clicks"))}><NumCell formatted={formatNumber(term.clicks)} id={term.id} metric="clicks" /></TableCell>
                <TableCell style={ps("ctr")} className={cn("text-right", pc("ctr"))}><NumCell formatted={formatPercent(term.ctr)} id={term.id} metric="ctr" /></TableCell>
                <TableCell style={ps("adUnits")} className={cn("text-right", pc("adUnits"))}><NumCell formatted={formatNumber(term.adUnits)} id={term.id} metric="adUnits" /></TableCell>
                <TableCell style={ps("cvr")} className={cn("text-right", pc("cvr"))}><NumCell formatted={formatPercent(term.cvr)} id={term.id} metric="cvr" /></TableCell>
                <TableCell style={ps("cpc")} className={cn("text-right", pc("cpc"))}><NumCell formatted={formatCurrency(term.cpc)} id={term.id} metric="cpc" /></TableCell>
                <TableCell style={ps("adSpend")} className={cn("text-right", pc("adSpend"))}><NumCell formatted={formatCurrency(term.adSpend)} id={term.id} metric="adSpend" /></TableCell>
                <TableCell style={ps("adSales")} className={cn("text-right", pc("adSales"))}><NumCell formatted={formatCurrency(term.adSpend * 3.8)} id={term.id} metric="adSales" /></TableCell>
                <TableCell style={ps("roas")} className={cn("text-right", pc("roas"))}><NumCell formatted={(3.8).toFixed(2)} id={term.id} metric="roas" /></TableCell>
                <TableCell style={ps("acos")} className={cn("text-right", pc("acos"))}><NumCell formatted={formatPercent(26.3)} id={term.id} metric="acos" /></TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-muted font-medium hover:bg-muted">
              <TableCell colSpan={6} className="font-semibold">Total ({filteredTerms.length} search terms)</TableCell>
              <TableCell className="text-right"><TotalCell value={formatNumber(searchTermsTotals.impressions)} metric="impressions" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatNumber(searchTermsTotals.clicks)} metric="clicks" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatPercent(searchTermsTotals.ctr)} metric="ctr" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatNumber(searchTermsTotals.adUnits)} metric="adUnits" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatPercent(searchTermsTotals.cvr)} metric="cvr" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatCurrency(searchTermsTotals.cpc)} metric="cpc" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatCurrency(searchTermsTotals.adSpend)} metric="adSpend" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatCurrency(searchTermsTotals.adSpend * 3.8)} metric="adSales" /></TableCell>
              <TableCell className="text-right"><TotalCell value={(3.8).toFixed(2)} metric="roas" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatPercent(26.3)} metric="acos" /></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <TablePagination page={currentPage} pageSize={pageSize} totalItems={filteredTerms.length} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} />
    </div>
  );
}
