import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pause, Play, Trash2 } from "lucide-react";
import { DayPartingSchedule } from "@/types/dayparting";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { TablePagination } from "@/components/tables/TablePagination";
import { SortableTableHead, sortData, usePinning } from "@/components/tables/SortableTableHead";

interface ScheduledJobsTableProps {
  schedules: DayPartingSchedule[];
  onPauseResume?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const ACTION_LABELS: Record<string, string> = {
  pause: "Pause Campaign",
  reduce_budget: "Reduce Budget",
  increase_budget: "Increase Budget",
};

const STATUS_STYLES: Record<string, string> = {
  active: "bg-success/10 text-success border-success/30",
  paused: "bg-warning/10 text-warning border-warning/30",
  completed: "bg-muted text-muted-foreground border-muted",
  draft: "bg-primary/10 text-primary border-primary/30",
};

const PINNABLE = ["name", "campaignNames", "actionType", "repeatType", "nextRun", "status"];

export function ScheduledJobsTable({ schedules, onPauseResume, onDelete }: ScheduledJobsTableProps) {
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

  const sorted = sortData(schedules, sortField, sortDirection);
  const paginatedSchedules = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const formatNextRun = (nextRun?: string) => {
    if (!nextRun) return "-";
    return format(new Date(nextRun), "MMM dd, yyyy HH:mm");
  };

  const getDaysLabel = (days: number[]) => {
    if (days.length === 7) return "Every day";
    if (days.length === 5 && !days.includes(0) && !days.includes(6)) return "Weekdays";
    if (days.length === 2 && days.includes(0) && days.includes(6)) return "Weekends";
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days.map((d) => dayNames[d]).join(", ");
  };

  const sp = { sortField, sortDirection, onSort: handleSort, pinnedColumns, onPinToggle: handlePinToggle };

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted">
            <SortableTableHead field="name" {...sp} className={cn(pc("name", true))} style={ps("name")}>Schedule Name</SortableTableHead>
            <SortableTableHead field="campaignNames" {...sp} className={cn(pc("campaignNames", true))} style={ps("campaignNames")}>Campaign(s)</SortableTableHead>
            <SortableTableHead field="actionType" {...sp} className={cn(pc("actionType", true))} style={ps("actionType")}>Action Type</SortableTableHead>
            <SortableTableHead field="repeatType" {...sp} className={cn(pc("repeatType", true))} style={ps("repeatType")}>Frequency</SortableTableHead>
            <SortableTableHead field="nextRun" {...sp} className={cn(pc("nextRun", true))} style={ps("nextRun")}>Next Run</SortableTableHead>
            <SortableTableHead field="status" {...sp} className={cn("text-center", pc("status", true))} style={ps("status")} align="center">Status</SortableTableHead>
            <TableHead className="text-center w-[120px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedSchedules.map((schedule) => (
            <TableRow key={schedule.id} className="hover:bg-muted/30 group">
              <TableCell style={ps("name")} className={cn("font-medium", pc("name"))}>{schedule.name}</TableCell>
              <TableCell style={ps("campaignNames")} className={cn(pc("campaignNames"))}>
                <div className="max-w-[200px]">
                  {schedule.campaignNames.length === 1 ? (
                    <span className="text-sm">{schedule.campaignNames[0]}</span>
                  ) : (
                    <span className="text-sm">
                      {schedule.campaignNames[0]}
                      <span className="text-muted-foreground ml-1">+{schedule.campaignNames.length - 1} more</span>
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell style={ps("actionType")} className={cn(pc("actionType"))}>
                <div className="flex flex-col">
                  <span className="text-sm">{ACTION_LABELS[schedule.actionType]}</span>
                  {schedule.budgetModifier && (
                    <span className="text-xs text-muted-foreground">{schedule.budgetModifier > 0 ? "+" : ""}{schedule.budgetModifier}%</span>
                  )}
                </div>
              </TableCell>
              <TableCell style={ps("repeatType")} className={cn(pc("repeatType"))}>
                <div className="flex flex-col text-sm">
                  <span className="capitalize">{schedule.repeatType}</span>
                  <span className="text-xs text-muted-foreground">{getDaysLabel(schedule.daysOfWeek)}</span>
                </div>
              </TableCell>
              <TableCell style={ps("nextRun")} className={cn("text-sm", pc("nextRun"))}>{formatNextRun(schedule.nextRun)}</TableCell>
              <TableCell style={ps("status")} className={cn("text-center", pc("status"))}>
                <Badge variant="outline" className={cn("capitalize", STATUS_STYLES[schedule.status])}>{schedule.status}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-1">
                  {schedule.status !== "draft" && (
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onPauseResume?.(schedule.id)}>
                      {schedule.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive/80 hover:bg-destructive/10" onClick={() => onDelete?.(schedule.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination page={currentPage} pageSize={pageSize} totalItems={schedules.length} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} />
    </div>
  );
}
