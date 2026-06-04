import { ReactNode } from "react";
import { Search, Filter, Layers, Columns3, ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Chip {
  id: string;
  label: string;
  icon?: ReactNode;
  activeCount?: number;
  onClick?: () => void;
  active?: boolean;
}

/**
 * Mobile table toolbar — single horizontal row of compact chips.
 * Pair with MobileRightSheet for filter/columns/sort surfaces.
 */
export function MobileTableToolbar({
  onSearchClick,
  onFilterClick,
  filterCount,
  onGroupClick,
  groupActive,
  onColumnsClick,
  onSortClick,
  sortActive,
  onMoreClick,
  extra,
  viewToggle,
}: {
  onSearchClick?: () => void;
  onFilterClick?: () => void;
  filterCount?: number;
  onGroupClick?: () => void;
  groupActive?: boolean;
  onColumnsClick?: () => void;
  onSortClick?: () => void;
  sortActive?: boolean;
  onMoreClick?: () => void;
  extra?: ReactNode;
  viewToggle?: ReactNode;
}) {
  const chips: Chip[] = [];
  if (onSearchClick) chips.push({ id: "search", label: "Search", icon: <Search className="h-3.5 w-3.5" />, onClick: onSearchClick });
  if (onFilterClick) chips.push({ id: "filter", label: "Filter", icon: <Filter className="h-3.5 w-3.5" />, onClick: onFilterClick, activeCount: filterCount });
  if (onGroupClick) chips.push({ id: "group", label: "Group", icon: <Layers className="h-3.5 w-3.5" />, onClick: onGroupClick, active: groupActive });
  if (onColumnsClick) chips.push({ id: "columns", label: "Columns", icon: <Columns3 className="h-3.5 w-3.5" />, onClick: onColumnsClick });
  if (onSortClick) chips.push({ id: "sort", label: "Sort", icon: <ArrowUpDown className="h-3.5 w-3.5" />, onClick: onSortClick, active: sortActive });

  return (
    <div className="flex items-center gap-1.5 px-3 py-2 overflow-x-auto no-scrollbar">
      {viewToggle}
      {chips.map((c) => (
        <button
          key={c.id}
          onClick={c.onClick}
          className={cn(
            "h-8 inline-flex items-center gap-1 px-2.5 rounded-md border text-[12px] font-medium shrink-0 tabular-nums",
            c.active || (c.activeCount && c.activeCount > 0)
              ? "border-primary text-primary bg-primary/5"
              : "border-border text-foreground hover:bg-muted/60"
          )}
        >
          {c.icon}
          <span>{c.label}</span>
          {c.activeCount ? <span className="text-[10px] rounded-full bg-primary/15 px-1">{c.activeCount}</span> : null}
        </button>
      ))}
      {extra}
      {onMoreClick && (
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 ml-auto" onClick={onMoreClick} aria-label="More">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
