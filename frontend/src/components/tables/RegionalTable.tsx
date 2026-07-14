import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { DeltaBadge } from "@/components/ui/delta-badge";
import { getDelta } from "@/lib/utils/deltaGenerator";
import { GeographicalData } from "@/types/profitability";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/contexts/CurrencyContext";
import { TablePagination } from "@/components/tables/TablePagination";
import { SortableTableHead, sortData, usePinning } from "@/components/tables/SortableTableHead";

interface RegionalTableProps {
  data: GeographicalData[];
  searchValue?: string;
  showDeltas?: boolean;
}

const formatNumber = (value: number) => new Intl.NumberFormat("en-US").format(value);

const PINNABLE = ["stocks", "orders", "unitsSold", "refunds", "sales", "amazonFees", "sellableReturns"];
const FIXED_OFFSET = 200;

export function RegionalTable({ data, searchValue = "", showDeltas = false }: RegionalTableProps) {
  const { formatCurrency } = useCurrency();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const { pinnedColumns, handlePinToggle, ps, pc } = usePinning(PINNABLE, FIXED_OFFSET);

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      if (sortDirection === "desc") { setSortField(null); setSortDirection("asc"); }
      else setSortDirection("desc");
    } else { setSortField(field); setSortDirection("asc"); }
  };

  const filteredData = searchValue
    ? data.filter((r) => r.region.toLowerCase().includes(searchValue.toLowerCase()))
    : data;

  const sorted = sortData(filteredData, sortField, sortDirection);
  const paginatedData = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const NumCell = ({ value, formatted, id, metric }: { value: number; formatted: string; id: string; metric: string }) => (
    <div className="flex flex-col items-end">
      <span className="text-foreground">{formatted}</span>
      {showDeltas && <DeltaBadge value={getDelta(id, metric)} />}
    </div>
  );

  const sp = { sortField, sortDirection, onSort: handleSort, pinnedColumns, onPinToggle: handlePinToggle };

  const renderRow = (region: GeographicalData, isChild = false) => {
    const hasChildren = region.children && region.children.length > 0;
    const isExpanded = expandedRows.has(region.id);
    return (
      <>
        <TableRow key={region.id} className={cn("hover:bg-muted/30 group cursor-pointer transition-colors", isChild && "bg-muted/10")}>
          <TableCell className={cn("sticky left-0 z-10 border-r border-border transition-colors", isChild ? "bg-muted group-hover:bg-muted" : "bg-background group-hover:bg-muted")}>
            <div className={cn("flex items-center gap-2", isChild && "pl-8")}>
              {hasChildren ? (
                <button onClick={() => toggleRow(region.id)} className="p-0.5 hover:bg-muted rounded">
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
              ) : (<span className="w-5" />)}
              {region.flag && <span className="text-lg">{region.flag}</span>}
              <span className="font-medium text-foreground">{region.region}</span>
            </div>
          </TableCell>
          <TableCell style={ps("stocks")} className={cn("text-right", pc("stocks"))}><NumCell value={region.stocks} formatted={formatNumber(region.stocks)} id={region.id} metric="stocks" /></TableCell>
          <TableCell style={ps("orders")} className={cn("text-right", pc("orders"))}><NumCell value={region.orders} formatted={formatNumber(region.orders)} id={region.id} metric="orders" /></TableCell>
          <TableCell style={ps("unitsSold")} className={cn("text-right", pc("unitsSold"))}><NumCell value={region.unitsSold} formatted={formatNumber(region.unitsSold)} id={region.id} metric="unitsSold" /></TableCell>
          <TableCell style={ps("refunds")} className={cn("text-right", pc("refunds"))}><NumCell value={region.refunds} formatted={formatNumber(region.refunds)} id={region.id} metric="refunds" /></TableCell>
          <TableCell style={ps("sales")} className={cn("text-right", pc("sales"))}><NumCell value={region.sales} formatted={formatCurrency(region.sales)} id={region.id} metric="sales" /></TableCell>
          <TableCell style={ps("amazonFees")} className={cn("text-right", pc("amazonFees"))}><NumCell value={region.amazonFees} formatted={formatCurrency(region.amazonFees)} id={region.id} metric="amazonFees" /></TableCell>
          <TableCell style={ps("sellableReturns")} className={cn("text-right", pc("sellableReturns"))}><NumCell value={region.sellableReturns} formatted={formatNumber(region.sellableReturns)} id={region.id} metric="sellableReturns" /></TableCell>
          <TableCell className="text-center"><button className="text-xs text-primary hover:underline">More</button></TableCell>
        </TableRow>
        {hasChildren && isExpanded && region.children!.map((child) => renderRow(child, true))}
      </>
    );
  };

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <SortableTableHead field="region" {...sp} isFixed className="sticky left-0 z-20 bg-muted min-w-[200px] border-r border-border">Region</SortableTableHead>
              <SortableTableHead field="stocks" {...sp} className={cn("text-right", pc("stocks", true))} style={ps("stocks")} align="right">Stocks</SortableTableHead>
              <SortableTableHead field="orders" {...sp} className={cn("text-right", pc("orders", true))} style={ps("orders")} align="right">Orders</SortableTableHead>
              <SortableTableHead field="unitsSold" {...sp} className={cn("text-right", pc("unitsSold", true))} style={ps("unitsSold")} align="right">Units Sold</SortableTableHead>
              <SortableTableHead field="refunds" {...sp} className={cn("text-right", pc("refunds", true))} style={ps("refunds")} align="right">Refunds</SortableTableHead>
              <SortableTableHead field="sales" {...sp} className={cn("text-right", pc("sales", true))} style={ps("sales")} align="right">Sales</SortableTableHead>
              <SortableTableHead field="amazonFees" {...sp} className={cn("text-right", pc("amazonFees", true))} style={ps("amazonFees")} align="right">Amazon Fees</SortableTableHead>
              <SortableTableHead field="sellableReturns" {...sp} className={cn("text-right", pc("sellableReturns", true))} style={ps("sellableReturns")} align="right">Sellable Returns</SortableTableHead>
              <TableHead className="text-center">Info</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{paginatedData.map((region) => renderRow(region))}</TableBody>
        </Table>
      </div>
      <TablePagination page={currentPage} pageSize={pageSize} totalItems={filteredData.length} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} />
    </div>
  );
}
