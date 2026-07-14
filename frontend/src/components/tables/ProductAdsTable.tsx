import { useState } from "react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/status/StatusBadge";
import { DeltaBadge } from "@/components/ui/delta-badge";
import { getDelta } from "@/lib/utils/deltaGenerator";
import { mockProductAds, productAdsTotals } from "@/data/mockProductAds";
import { mockCampaigns } from "@/data/mockCampaigns";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { AddProductAdsModal } from "@/components/advertising/AddProductAdsModal";
import { TablePagination } from "./TablePagination";
import { SortableTableHead, sortData, usePinning } from "./SortableTableHead";
import { cn } from "@/lib/utils";

interface ProductAdsTableProps {
  searchQuery?: string;
  showAddButton?: boolean;
  showDeltas?: boolean;
  onRowClick?: (productAd: typeof import("@/data/mockProductAds").mockProductAds[0]) => void;
}

const PINNABLE = ["adGroupName", "campaignName", "impressions", "clicks", "ctr", "adUnits", "cvr", "cpc", "adSpend", "adSales", "roas", "acos"];
const FIXED_OFFSET = 436;

export function ProductAdsTable({ searchQuery = "", showAddButton = false, showDeltas = false, onRowClick }: ProductAdsTableProps) {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [activeFilters, setActiveFilters] = useState<string[]>(["Product Ad Status is ENABLED"]);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const { pinnedColumns, handlePinToggle, ps, pc } = usePinning(PINNABLE, FIXED_OFFSET);

  const filteredAds = mockProductAds.filter((ad) =>
    ad.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ad.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ad.itemId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSort = (field: string) => {
    if (sortField === field) {
      if (sortDirection === "desc") { setSortField(null); setSortDirection("asc"); }
      else setSortDirection("desc");
    } else { setSortField(field); setSortDirection("asc"); }
  };

  const sorted = sortData(filteredAds, sortField, sortDirection);
  const paginatedAds = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const { formatCurrency } = useCurrency();
  const formatNumber = (value: number) => new Intl.NumberFormat("en-US").format(value);
  const formatPercent = (value: number) => `${value.toFixed(2)}%`;

  const toggleRow = (id: string) => {
    setSelectedRows((prev) => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  };
  const toggleAll = () => {
    if (selectedRows.size === paginatedAds.length) setSelectedRows(new Set());
    else setSelectedRows(new Set(paginatedAds.map((a) => a.id)));
  };
  const removeFilter = (filter: string) => { setActiveFilters((prev) => prev.filter((f) => f !== filter)); };

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
    <>
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 mb-3">
          {activeFilters.map((filter) => (
            <div key={filter} className="flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2.5 py-1 text-xs text-foreground">
              {filter}
              <button onClick={() => removeFilter(filter)} className="text-muted-foreground hover:text-foreground cursor-pointer"><X className="h-3 w-3" /></button>
            </div>
          ))}
          <button onClick={() => setActiveFilters([])} className="text-xs text-muted-foreground hover:text-foreground cursor-pointer">Clear</button>
        </div>
      )}

      <div className="rounded-lg border border-border bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead className="w-10 sticky left-0 z-10 bg-muted">
                  <Checkbox checked={selectedRows.size === paginatedAds.length && paginatedAds.length > 0} onCheckedChange={toggleAll} />
                </TableHead>
                <TableHead className="w-24 sticky left-[40px] z-10 bg-muted">Status</TableHead>
                <SortableTableHead field="productName" {...sp} isFixed className="min-w-[300px] sticky left-[136px] z-10 bg-muted">Product Ad</SortableTableHead>
                <SortableTableHead field="adGroupName" {...sp} className={cn("min-w-[150px]", pc("adGroupName", true))} style={ps("adGroupName")}>Ad Group</SortableTableHead>
                <SortableTableHead field="campaignName" {...sp} className={cn("min-w-[150px]", pc("campaignName", true))} style={ps("campaignName")}>Campaign</SortableTableHead>
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
              {paginatedAds.map((ad) => (
                <TableRow key={ad.id} className="group cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => onRowClick?.(ad)}>
                  <TableCell className="sticky left-0 z-10 bg-background group-hover:bg-muted transition-colors">
                    <Checkbox checked={selectedRows.has(ad.id)} onCheckedChange={() => toggleRow(ad.id)} />
                  </TableCell>
                  <TableCell className="sticky left-[40px] z-10 bg-background group-hover:bg-muted transition-colors"><StatusBadge status={ad.status} /></TableCell>
                  <TableCell className="sticky left-[136px] z-10 bg-background group-hover:bg-muted transition-colors">
                    <div className="flex items-center gap-3">
                      <img src={ad.productImage} alt={ad.productName} className="h-10 w-10 rounded-md object-cover" />
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{ad.productName}</span>
                        <span className="text-xs text-muted-foreground">{ad.itemId} · {ad.sku}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell style={ps("adGroupName")} className={cn("text-foreground", pc("adGroupName"))}>{ad.adGroupName}</TableCell>
                  <TableCell style={ps("campaignName")} className={cn(pc("campaignName"))}>
                    {(() => {
                      const ct = mockCampaigns.find((c) => c.name === ad.campaignName)?.type;
                      return (
                        <div className="flex items-center gap-2">
                          {ct && (
                            <Badge variant="outline" className={cn("text-xs", ct === "auto" ? "border-primary/30 bg-primary/5 text-primary" : "border-secondary/30 bg-secondary/5 text-secondary-foreground")}>
                              {ct === "auto" ? "Auto" : "Manual"}
                            </Badge>
                          )}
                          <span className="text-foreground">{ad.campaignName}</span>
                        </div>
                      );
                    })()}
                  </TableCell>
                  <TableCell style={ps("impressions")} className={cn("text-right", pc("impressions"))}><NumCell formatted={formatNumber(ad.impressions)} id={ad.id} metric="impressions" /></TableCell>
                  <TableCell style={ps("clicks")} className={cn("text-right", pc("clicks"))}><NumCell formatted={formatNumber(ad.clicks)} id={ad.id} metric="clicks" /></TableCell>
                  <TableCell style={ps("ctr")} className={cn("text-right", pc("ctr"))}><NumCell formatted={formatPercent(ad.ctr)} id={ad.id} metric="ctr" /></TableCell>
                  <TableCell style={ps("adUnits")} className={cn("text-right", pc("adUnits"))}><NumCell formatted={formatNumber(ad.adUnits)} id={ad.id} metric="adUnits" /></TableCell>
                  <TableCell style={ps("cvr")} className={cn("text-right", pc("cvr"))}><NumCell formatted={formatPercent(ad.cvr)} id={ad.id} metric="cvr" /></TableCell>
                  <TableCell style={ps("cpc")} className={cn("text-right", pc("cpc"))}><NumCell formatted={formatCurrency(ad.cpc)} id={ad.id} metric="cpc" /></TableCell>
                  <TableCell style={ps("adSpend")} className={cn("text-right", pc("adSpend"))}><NumCell formatted={formatCurrency(ad.adSpend)} id={ad.id} metric="adSpend" /></TableCell>
                  <TableCell style={ps("adSales")} className={cn("text-right", pc("adSales"))}><NumCell formatted={formatCurrency(ad.adSpend * 4.2)} id={ad.id} metric="adSales" /></TableCell>
                  <TableCell style={ps("roas")} className={cn("text-right", pc("roas"))}><NumCell formatted={(4.2).toFixed(2)} id={ad.id} metric="roas" /></TableCell>
                  <TableCell style={ps("acos")} className={cn("text-right", pc("acos"))}><NumCell formatted={formatPercent(23.8)} id={ad.id} metric="acos" /></TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted font-medium hover:bg-muted">
                <TableCell colSpan={5} className="font-semibold">Total ({filteredAds.length} product ads)</TableCell>
                <TableCell className="text-right"><TotalCell value={formatNumber(productAdsTotals.impressions)} metric="impressions" /></TableCell>
                <TableCell className="text-right"><TotalCell value={formatNumber(productAdsTotals.clicks)} metric="clicks" /></TableCell>
                <TableCell className="text-right"><TotalCell value={formatPercent(productAdsTotals.ctr)} metric="ctr" /></TableCell>
                <TableCell className="text-right"><TotalCell value={formatNumber(productAdsTotals.adUnits)} metric="adUnits" /></TableCell>
                <TableCell className="text-right"><TotalCell value={formatPercent(productAdsTotals.cvr)} metric="cvr" /></TableCell>
                <TableCell className="text-right"><TotalCell value={formatCurrency(productAdsTotals.cpc)} metric="cpc" /></TableCell>
                <TableCell className="text-right"><TotalCell value={formatCurrency(productAdsTotals.adSpend)} metric="adSpend" /></TableCell>
                <TableCell className="text-right"><TotalCell value={formatCurrency(productAdsTotals.adSpend * 4.2)} metric="adSales" /></TableCell>
                <TableCell className="text-right"><TotalCell value={(4.2).toFixed(2)} metric="roas" /></TableCell>
                <TableCell className="text-right"><TotalCell value={formatPercent(23.8)} metric="acos" /></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <TablePagination page={currentPage} pageSize={pageSize} totalItems={filteredAds.length} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} />
      </div>
      <AddProductAdsModal open={addModalOpen} onOpenChange={setAddModalOpen} />
    </>
  );
}
