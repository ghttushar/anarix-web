import { ReactNode, useState, useMemo } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Pin, MoreHorizontal, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { SwipeableRow } from "../primitives/SwipeableRow";
import { TouchTarget } from "../primitives/TouchTarget";
import type { TabletColumn, SortState } from "./types";

interface TabletDataTableProps<T> {
  rows: T[];
  columns: TabletColumn<T>[];
  rowKey: (row: T) => string;
  selectable?: boolean;
  selected?: Set<string>;
  onSelectedChange?: (next: Set<string>) => void;
  onRowAction?: (row: T, action: "pin" | "edit" | "more") => void;
  toolbar?: ReactNode;
  emptyMessage?: string;
}

export function TabletDataTable<T>({
  rows,
  columns,
  rowKey,
  selectable,
  selected,
  onSelectedChange,
  onRowAction,
  toolbar,
  emptyMessage = "No data",
}: TabletDataTableProps<T>) {
  const [sort, setSort] = useState<SortState>({ columnId: null, direction: null });

  const sortedRows = useMemo(() => {
    if (!sort.columnId || !sort.direction) return rows;
    const col = columns.find((c) => c.id === sort.columnId);
    if (!col) return rows;
    const dir = sort.direction === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const av = String(col.cell(a) ?? "");
      const bv = String(col.cell(b) ?? "");
      return av.localeCompare(bv, undefined, { numeric: true }) * dir;
    });
  }, [rows, columns, sort]);

  const toggleSort = (id: string) => {
    setSort((s) => {
      if (s.columnId !== id) return { columnId: id, direction: "asc" };
      if (s.direction === "asc") return { columnId: id, direction: "desc" };
      return { columnId: null, direction: null };
    });
  };

  const allSelected = selectable && selected && rows.length > 0 && rows.every((r) => selected.has(rowKey(r)));

  return (
    <div className="flex flex-col flex-1 min-h-0 min-w-0 bg-card border border-border rounded-md overflow-hidden">
      {toolbar}
      <div className="flex-1 min-h-0 min-w-0 overflow-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="sticky top-0 z-20 bg-card">
            <tr className="border-b border-border">
              {selectable && (
                <th className="sticky left-0 z-30 bg-card w-12 px-3 py-3">
                  <Checkbox
                    checked={!!allSelected}
                    onCheckedChange={(v) => {
                      if (!onSelectedChange) return;
                      const next = new Set(selected ?? []);
                      if (v) rows.forEach((r) => next.add(rowKey(r)));
                      else rows.forEach((r) => next.delete(rowKey(r)));
                      onSelectedChange(next);
                    }}
                    className="h-5 w-5"
                  />
                </th>
              )}
              {columns.map((col, idx) => {
                const isSorted = sort.columnId === col.id;
                const SortIcon = !isSorted ? ArrowUpDown : sort.direction === "asc" ? ArrowUp : ArrowDown;
                return (
                  <th
                    key={col.id}
                    className={cn(
                      "px-3 py-3 text-left font-medium text-muted-foreground whitespace-nowrap",
                      col.align === "right" && "text-right",
                      col.sticky && "sticky z-20 bg-card",
                      col.sticky && (selectable ? "left-12" : "left-0"),
                      col.widthClass,
                    )}
                  >
                    <div className={cn("flex items-center gap-2", col.align === "right" && "justify-end")}>
                      <span>{col.header}</span>
                      {col.sortable && (
                        <TouchTarget
                          aria-label={`Sort ${col.header}`}
                          onClick={() => toggleSort(col.id)}
                          className="h-8 w-8 rounded text-muted-foreground hover:text-foreground"
                        >
                          <SortIcon className="h-4 w-4" />
                        </TouchTarget>
                      )}
                      {idx === 0 && (
                        <TouchTarget aria-label="Pin column" className="h-8 w-8 rounded text-muted-foreground hover:text-foreground">
                          <Pin className="h-4 w-4" />
                        </TouchTarget>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sortedRows.length === 0 && (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="text-center text-muted-foreground py-12">
                  {emptyMessage}
                </td>
              </tr>
            )}
            {sortedRows.map((row) => {
              const key = rowKey(row);
              const isSelected = selected?.has(key);
              return (
                <tr key={key} className="border-b border-border last:border-b-0">
                  <td colSpan={columns.length + (selectable ? 1 : 0)} className="p-0">
                    <SwipeableRow
                      actions={
                        <div className="flex items-stretch divide-x divide-border bg-muted">
                          <TouchTarget aria-label="Pin row" onClick={() => onRowAction?.(row, "pin")} className="flex-1">
                            <Pin className="h-5 w-5" />
                          </TouchTarget>
                          <TouchTarget aria-label="Edit row" onClick={() => onRowAction?.(row, "edit")} className="flex-1">
                            <Pencil className="h-5 w-5" />
                          </TouchTarget>
                          <TouchTarget aria-label="More" onClick={() => onRowAction?.(row, "more")} className="flex-1">
                            <MoreHorizontal className="h-5 w-5" />
                          </TouchTarget>
                        </div>
                      }
                    >
                      <div className="flex items-stretch min-h-[52px]">
                        {selectable && (
                          <div className="sticky left-0 z-10 bg-card w-12 flex items-center justify-center">
                            <Checkbox
                              checked={!!isSelected}
                              onCheckedChange={(v) => {
                                if (!onSelectedChange) return;
                                const next = new Set(selected ?? []);
                                if (v) next.add(key);
                                else next.delete(key);
                                onSelectedChange(next);
                              }}
                              className="h-5 w-5"
                            />
                          </div>
                        )}
                        <div className="flex-1 grid items-center" style={{ gridTemplateColumns: columns.map((c) => c.widthClass ? "auto" : "1fr").join(" ") }}>
                          {columns.map((col) => (
                            <div
                              key={col.id}
                              className={cn(
                                "px-3 py-2 whitespace-nowrap",
                                col.align === "right" && "text-right",
                                col.id !== "name" && "text-foreground",
                              )}
                            >
                              {col.cell(row)}
                            </div>
                          ))}
                        </div>
                      </div>
                    </SwipeableRow>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
