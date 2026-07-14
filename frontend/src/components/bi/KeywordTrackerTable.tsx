import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Trash2, Search as SearchIcon } from "lucide-react";
import { TrackedKeyword } from "@/types/bi";
import { format } from "date-fns";
import { TablePagination } from "@/components/tables/TablePagination";
import { SortableTableHead, sortData, usePinning } from "@/components/tables/SortableTableHead";
import { cn } from "@/lib/utils";

interface KeywordTrackerTableProps {
  keywords: TrackedKeyword[];
  onStatusChange?: (id: string, status: "active" | "inactive") => void;
  onDelete?: (id: string) => void;
}

const PINNABLE = ["keyword", "addedAt", "updatedAt", "region", "status"];

export function KeywordTrackerTable({ keywords, onStatusChange, onDelete }: KeywordTrackerTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const { pinnedColumns, handlePinToggle, ps, pc } = usePinning(PINNABLE, 0);

  const handleSort = (field: string) => {
    if (sortField === field) {
      if (sortDirection === "desc") { setSortField(null); setSortDirection("asc"); }
      else setSortDirection("desc");
    } else { setSortField(field); setSortDirection("asc"); }
  };

  const sorted = sortData(keywords, sortField, sortDirection);
  const paginatedKeywords = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const formatDate = (dateString: string) => format(new Date(dateString), "MMM dd, yyyy HH:mm");

  const sp = { sortField, sortDirection, onSort: handleSort, pinnedColumns, onPinToggle: handlePinToggle };

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted">
            <SortableTableHead field="keyword" {...sp} className={cn(pc("keyword", true))} style={ps("keyword")}>Keyword</SortableTableHead>
            <SortableTableHead field="addedAt" {...sp} className={cn(pc("addedAt", true))} style={ps("addedAt")}>Added At</SortableTableHead>
            <SortableTableHead field="updatedAt" {...sp} className={cn(pc("updatedAt", true))} style={ps("updatedAt")}>Updated At</SortableTableHead>
            <SortableTableHead field="region" {...sp} className={cn("text-center", pc("region", true))} style={ps("region")} align="center">Region</SortableTableHead>
            <TableHead className="text-center">Channels</TableHead>
            <SortableTableHead field="status" {...sp} className={cn("text-center", pc("status", true))} style={ps("status")} align="center">Status</SortableTableHead>
            <TableHead className="text-center w-[80px]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedKeywords.map((keyword) => (
            <TableRow key={keyword.id} className="hover:bg-muted/30 group">
              <TableCell style={ps("keyword")} className={cn("font-medium", pc("keyword"))}>{keyword.keyword}</TableCell>
              <TableCell style={ps("addedAt")} className={cn("text-muted-foreground text-sm", pc("addedAt"))}>{formatDate(keyword.addedAt)}</TableCell>
              <TableCell style={ps("updatedAt")} className={cn("text-muted-foreground text-sm", pc("updatedAt"))}>{formatDate(keyword.updatedAt)}</TableCell>
              <TableCell style={ps("region")} className={cn("text-center", pc("region"))}>
                <span className="flex items-center justify-center gap-1.5">
                  <span>{keyword.regionFlag}</span>
                  <span className="text-sm text-muted-foreground">{keyword.region}</span>
                </span>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-2">
                  {keyword.channels.includes("organic") && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                      <SearchIcon className="h-3 w-3" />Organic
                    </span>
                  )}
                  {keyword.channels.includes("sponsored") && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">Sponsored</span>
                  )}
                </div>
              </TableCell>
              <TableCell style={ps("status")} className={cn("text-center", pc("status"))}>
                <Switch checked={keyword.status === "active"} onCheckedChange={(checked) => onStatusChange?.(keyword.id, checked ? "active" : "inactive")} />
              </TableCell>
              <TableCell className="text-center">
                <Button variant="ghost" size="icon" onClick={() => onDelete?.(keyword.id)} className="h-8 w-8 text-destructive hover:text-destructive/80 hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination page={currentPage} pageSize={pageSize} totalItems={keywords.length} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} />
    </div>
  );
}
