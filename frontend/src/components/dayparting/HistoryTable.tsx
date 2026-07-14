import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RotateCw, ChevronDown, ChevronRight } from "lucide-react";
import { ExecutionHistory } from "@/types/dayparting";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { TablePagination } from "@/components/tables/TablePagination";
import { SortableTableHead, sortData, usePinning } from "@/components/tables/SortableTableHead";

interface HistoryTableProps {
  history: ExecutionHistory[];
  onRetry?: (id: string) => void;
}

const STATUS_STYLES: Record<string, string> = {
  success: "bg-success/10 text-success border-success/30",
  failed: "bg-destructive/10 text-destructive border-destructive/30",
  partial: "bg-warning/10 text-warning border-warning/30",
  cancelled: "bg-muted text-muted-foreground border-muted",
};

const PINNABLE = ["executedAt", "scheduleName", "campaignName", "action", "status", "duration"];

export function HistoryTable({ history, onRetry }: HistoryTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const { pinnedColumns, handlePinToggle, ps, pc } = usePinning(PINNABLE, 40);

  const handleSort = (field: string) => {
    if (sortField === field) {
      if (sortDirection === "desc") { setSortField(null); setSortDirection("asc"); }
      else setSortDirection("desc");
    } else { setSortField(field); setSortDirection("asc"); }
  };

  const sorted = sortData(history, sortField, sortDirection);
  const paginatedHistory = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const formatDuration = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const sp = { sortField, sortDirection, onSort: handleSort, pinnedColumns, onPinToggle: handlePinToggle };

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted">
            <TableHead className="w-[40px]"></TableHead>
            <SortableTableHead field="executedAt" {...sp} className={cn(pc("executedAt", true))} style={ps("executedAt")}>Execution Time</SortableTableHead>
            <SortableTableHead field="scheduleName" {...sp} className={cn(pc("scheduleName", true))} style={ps("scheduleName")}>Schedule</SortableTableHead>
            <SortableTableHead field="campaignName" {...sp} className={cn(pc("campaignName", true))} style={ps("campaignName")}>Campaign</SortableTableHead>
            <SortableTableHead field="action" {...sp} className={cn(pc("action", true))} style={ps("action")}>Action</SortableTableHead>
            <SortableTableHead field="status" {...sp} className={cn("text-center", pc("status", true))} style={ps("status")} align="center">Status</SortableTableHead>
            <SortableTableHead field="duration" {...sp} className={cn("text-right", pc("duration", true))} style={ps("duration")} align="right">Duration</SortableTableHead>
            <TableHead className="text-center w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedHistory.map((item) => {
            const isExpanded = expandedRows.has(item.id);
            const hasDetails = item.actionDetails || item.errorMessage || item.budgetBefore !== undefined;
            return (
              <>
                <TableRow key={item.id} className="hover:bg-muted/30 group">
                  <TableCell>
                    {hasDetails && (
                      <button onClick={() => toggleRow(item.id)} className="p-1 hover:bg-muted rounded">
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </button>
                    )}
                  </TableCell>
                  <TableCell style={ps("executedAt")} className={cn("text-sm", pc("executedAt"))}>{format(new Date(item.executedAt), "MMM dd, yyyy HH:mm:ss")}</TableCell>
                  <TableCell style={ps("scheduleName")} className={cn("font-medium", pc("scheduleName"))}>{item.scheduleName}</TableCell>
                  <TableCell style={ps("campaignName")} className={cn("text-sm max-w-[200px] truncate", pc("campaignName"))}>{item.campaignName}</TableCell>
                  <TableCell style={ps("action")} className={cn("text-sm capitalize", pc("action"))}>{item.action.replace("_", " ")}</TableCell>
                  <TableCell style={ps("status")} className={cn("text-center", pc("status"))}>
                    <Badge variant="outline" className={cn("capitalize", STATUS_STYLES[item.status])}>{item.status}</Badge>
                  </TableCell>
                  <TableCell style={ps("duration")} className={cn("text-right text-sm text-muted-foreground", pc("duration"))}>{formatDuration(item.duration)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      {item.status === "failed" && (
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onRetry?.(item.id)} title="Retry">
                          <RotateCw className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
                {isExpanded && hasDetails && (
                  <TableRow className="bg-muted/20">
                    <TableCell colSpan={8} className="py-4">
                      <div className="pl-10 space-y-2 text-sm">
                        {item.actionDetails && (<div><span className="font-medium text-muted-foreground">Details: </span><span>{item.actionDetails}</span></div>)}
                        {item.budgetBefore !== undefined && (
                          <div><span className="font-medium text-muted-foreground">Budget: </span><span>${item.budgetBefore.toFixed(2)}{item.budgetAfter !== undefined && (<> → ${item.budgetAfter.toFixed(2)}</>)}</span></div>
                        )}
                        {item.errorMessage && (<div className="text-destructive"><span className="font-medium">Error: </span><span>{item.errorMessage}</span></div>)}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            );
          })}
        </TableBody>
      </Table>
      <TablePagination page={currentPage} pageSize={pageSize} totalItems={history.length} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} />
    </div>
  );
}
