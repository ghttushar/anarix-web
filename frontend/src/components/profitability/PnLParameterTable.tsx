import { useState } from "react";
import { ChevronDown, ChevronRight, ChevronsUpDown } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { DeltaBadge } from "@/components/ui/delta-badge";
import { getDelta } from "@/lib/utils/deltaGenerator";
import { PnLRow } from "@/types/profitability";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface PnLParameterTableProps {
  data: PnLRow[];
  weeks: string[];
  showDeltas?: boolean;
}

export function PnLParameterTable({ data, weeks, showDeltas = false }: PnLParameterTableProps) {
  const { formatCurrency } = useCurrency();
  const formatValue = (value: number | null, isCurrency: boolean = true): string => {
    if (value === null) return "-";
    if (isCurrency) return formatCurrency(value);
    return new Intl.NumberFormat("en-US").format(value);
  };

  const collectExpandableIds = (rows: PnLRow[]): string[] => {
    const ids: string[] = [];
    rows.forEach((row) => {
      if (row.children && row.children.length > 0) {
        ids.push(row.id);
        ids.push(...collectExpandableIds(row.children));
      }
    });
    return ids;
  };

  const allExpandableIds = collectExpandableIds(data);

  const [expandedRows, setExpandedRows] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    data.forEach((row) => {
      if (row.isExpanded) initial.add(row.id);
    });
    return initial;
  });

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const expandAll = () => setExpandedRows(new Set(allExpandableIds));
  const collapseAll = () => setExpandedRows(new Set());

  const allExpanded = allExpandableIds.length > 0 && allExpandableIds.every((id) => expandedRows.has(id));

  const renderRow = (row: PnLRow, isCurrency: boolean = true) => {
    const isExpanded = expandedRows.has(row.id);
    const hasChildren = row.children && row.children.length > 0;

    return (
      <>
        <TableRow
          key={row.id}
          className={cn(
            "hover:bg-muted/30 group",
            row.isParent && "font-medium bg-muted/50"
          )}
        >
          <TableCell className={cn("sticky left-0 z-10 group-hover:bg-muted/30 transition-colors", row.isParent ? "bg-muted/50" : "bg-card")}>
            <div
              className="flex items-center gap-2"
              style={{ paddingLeft: `${row.indent * 20}px` }}
            >
              {hasChildren ? (
                <button
                  onClick={() => toggleRow(row.id)}
                  className="p-0.5 hover:bg-muted rounded cursor-pointer"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5" />
                  )}
                </button>
              ) : (
                <span className="w-4" />
              )}
              <span className="text-sm">{row.parameter}</span>
            </div>
          </TableCell>
          {weeks.map((week) => (
            <TableCell key={week} className="text-right text-sm">
              <div className="flex items-center justify-end gap-1">
                <span>{formatValue(row.weeklyValues[week], isCurrency)}</span>
                {showDeltas && row.weeklyValues[week] !== null && (
                  <DeltaBadge value={getDelta(row.id, week)} />
                )}
              </div>
            </TableCell>
          ))}
          <TableCell className="text-right font-medium text-sm">
            <div className="flex items-center justify-end gap-1">
              <span>{formatValue(row.total, isCurrency)}</span>
              {showDeltas && row.total !== null && (
                <DeltaBadge value={getDelta(row.id, "total")} />
              )}
            </div>
          </TableCell>
        </TableRow>
        {hasChildren &&
          isExpanded &&
          row.children!.map((child) =>
            renderRow(child, !child.parameter.toLowerCase().includes("unit"))
          )}
      </>
    );
  };

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="sticky top-0 left-0 z-20 bg-muted/50 min-w-[200px]">
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={allExpanded ? collapseAll : expandAll}
                        className="p-0.5 hover:bg-muted rounded cursor-pointer"
                      >
                        <ChevronsUpDown className="h-3.5 w-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>{allExpanded ? "Collapse all" : "Expand all"}</TooltipContent>
                  </Tooltip>
                  <span>Parameter / Date</span>
                </div>
              </TableHead>
              {weeks.map((week) => (
                <TableHead key={week} className="sticky top-0 z-10 bg-muted/50 text-right min-w-[100px] text-xs">
                  {week}
                </TableHead>
              ))}
              <TableHead className="sticky top-0 z-10 bg-muted/50 text-right min-w-[120px] font-semibold text-xs">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) =>
              renderRow(row, !row.parameter.toLowerCase().includes("unit"))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
