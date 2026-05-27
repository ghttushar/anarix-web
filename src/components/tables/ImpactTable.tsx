import { useState } from "react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { ImpactComparison } from "@/types/advertising";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";
import { TablePagination } from "./TablePagination";
import { SortableTableHead, sortData, usePinning } from "./SortableTableHead";

interface ImpactTableProps {
  data: ImpactComparison[];
  searchQuery?: string;
}

const PINNABLE = ["impactPercentage", "impressions", "clicks", "ctr", "adSpend", "adSales", "roas", "acos"];
const FIXED_OFFSET = 250;

export function ImpactTable({ data, searchQuery = "" }: ImpactTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const { pinnedColumns, handlePinToggle, ps, pc } = usePinning(PINNABLE, FIXED_OFFSET);

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSort = (field: string) => {
    if (sortField === field) {
      if (sortDirection === "desc") { setSortField(null); setSortDirection("asc"); }
      else setSortDirection("desc");
    } else { setSortField(field); setSortDirection("asc"); }
  };

  const sorted = sortData(filteredData, sortField, sortDirection);
  const paginatedData = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const { formatCurrency } = useCurrency();
  const formatNumber = (value: number) => new Intl.NumberFormat("en-US").format(value);
  const formatPercent = (value: number) => `${value.toFixed(2)}%`;

  const calculateDelta = (baseline: number, impact: number) => {
    if (baseline === 0) return impact > 0 ? 100 : 0;
    return ((impact - baseline) / baseline) * 100;
  };

  const fmtVal = (value: number, format: string) =>
    format === "currency" ? formatCurrency(value) : format === "percent" ? formatPercent(value) : formatNumber(value);

  const DeltaCell = ({ baseline, impact, format = "number" }: { baseline: number; impact: number; format?: string }) => {
    const delta = calculateDelta(baseline, impact);
    const isPositive = delta > 0;
    const isNeutral = delta === 0;
    return (
      <div className="flex items-center justify-end gap-1.5">
        <span className="text-muted-foreground">{fmtVal(baseline, format)}</span>
        <span className="text-[10px] text-muted-foreground/40">→</span>
        <span className="font-medium text-foreground">{fmtVal(impact, format)}</span>
        <span className={cn(
          "inline-flex items-center gap-0.5 text-xs font-medium rounded-full px-1.5 py-0.5",
          isNeutral ? "text-muted-foreground bg-muted" : isPositive ? "text-success bg-success/10" : "text-destructive bg-destructive/10"
        )}>
          {!isNeutral && (isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
          {Math.abs(delta).toFixed(1)}%
        </span>
      </div>
    );
  };

  const sp = { sortField, sortDirection, onSort: handleSort, pinnedColumns, onPinToggle: handlePinToggle };

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted hover:bg-muted">
              <SortableTableHead field="name" {...sp} isFixed className="min-w-[250px] sticky left-0 z-10 bg-muted">Name</SortableTableHead>
              <SortableTableHead field="impactPercentage" {...sp} className={cn("w-28 text-center", pc("impactPercentage", true))} style={ps("impactPercentage")} align="center">Impact</SortableTableHead>
              <SortableTableHead field="impressions" {...sp} className={cn("min-w-[180px] text-right", pc("impressions", true))} style={ps("impressions")} align="right">Impressions</SortableTableHead>
              <SortableTableHead field="clicks" {...sp} className={cn("min-w-[150px] text-right", pc("clicks", true))} style={ps("clicks")} align="right">Clicks</SortableTableHead>
              <SortableTableHead field="ctr" {...sp} className={cn("min-w-[140px] text-right", pc("ctr", true))} style={ps("ctr")} align="right">CTR</SortableTableHead>
              <SortableTableHead field="adSpend" {...sp} className={cn("min-w-[180px] text-right", pc("adSpend", true))} style={ps("adSpend")} align="right">Ad Spend</SortableTableHead>
              <SortableTableHead field="adSales" {...sp} className={cn("min-w-[180px] text-right", pc("adSales", true))} style={ps("adSales")} align="right">Ad Sales</SortableTableHead>
              <SortableTableHead field="roas" {...sp} className={cn("min-w-[140px] text-right", pc("roas", true))} style={ps("roas")} align="right">ROAS</SortableTableHead>
              <SortableTableHead field="acos" {...sp} className={cn("min-w-[140px] text-right", pc("acos", true))} style={ps("acos")} align="right">ACOS</SortableTableHead>
            </TableRow>
            <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
              <TableHead className="sticky left-0 z-10 bg-muted/50 h-6" />
              <TableHead className="h-6" />
              {["impressions", "clicks", "ctr", "adSpend", "adSales", "roas", "acos"].map((field) => (
                <TableHead key={field} className={cn("h-6 text-center", pc(field, true))} style={ps(field)}>
                  <span className="text-[10px] text-muted-foreground">previous</span>
                  <span className="text-[10px] text-muted-foreground/40 mx-1">→</span>
                  <span className="text-[10px] text-foreground">current</span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item) => {
              const isPositive = item.impactPercentage > 0;
              const isNeutral = item.impactPercentage === 0;
              return (
                <TableRow key={item.id} className="group cursor-pointer hover:bg-muted/50 transition-colors">
                  <TableCell className="sticky left-0 z-10 bg-background group-hover:bg-muted transition-colors">
                    <span className="font-medium">{item.name}</span>
                  </TableCell>
                  <TableCell style={ps("impactPercentage")} className={cn("text-center", pc("impactPercentage"))}>
                    <Badge variant="outline" className={cn("gap-1", isNeutral ? "border-muted bg-muted text-muted-foreground" : isPositive ? "border-success/30 bg-success/10 text-success" : "border-destructive/30 bg-destructive/10 text-destructive")}>
                      {isPositive ? <ArrowUp className="h-3 w-3" /> : !isNeutral ? <ArrowDown className="h-3 w-3" /> : null}
                      {Math.abs(item.impactPercentage).toFixed(1)}%
                    </Badge>
                  </TableCell>
                  <TableCell style={ps("impressions")} className={cn(pc("impressions"))}><DeltaCell baseline={item.baseline.impressions} impact={item.impact.impressions} /></TableCell>
                  <TableCell style={ps("clicks")} className={cn(pc("clicks"))}><DeltaCell baseline={item.baseline.clicks} impact={item.impact.clicks} /></TableCell>
                  <TableCell style={ps("ctr")} className={cn(pc("ctr"))}><DeltaCell baseline={item.baseline.ctr} impact={item.impact.ctr} format="percent" /></TableCell>
                  <TableCell style={ps("adSpend")} className={cn(pc("adSpend"))}><DeltaCell baseline={item.baseline.adSpend} impact={item.impact.adSpend} format="currency" /></TableCell>
                  <TableCell style={ps("adSales")} className={cn(pc("adSales"))}><DeltaCell baseline={item.baseline.adSales} impact={item.impact.adSales} format="currency" /></TableCell>
                  <TableCell style={ps("roas")} className={cn(pc("roas"))}><DeltaCell baseline={item.baseline.roas} impact={item.impact.roas} format="decimal" /></TableCell>
                  <TableCell style={ps("acos")} className={cn(pc("acos"))}><DeltaCell baseline={item.baseline.acos} impact={item.impact.acos} format="percent" /></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <TablePagination page={currentPage} pageSize={pageSize} totalItems={filteredData.length} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} />
    </div>
  );
}
