import { ReactNode } from "react";
import { Search, Filter, Layers, Columns3, ArrowUpDown, Download } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Mobile table toolbar — two fixed rows, never wraps and never scrolls
 * horizontally. Row 1 is the primary action cluster (Search/Delta/Filter/
 * Columns), Row 2 is secondary chips (Group/Sort/Export).
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
  onExportClick,
  showDeltas,
  onShowDeltasChange,
  extra,
}: {
  onSearchClick?: () => void;
  onFilterClick?: () => void;
  filterCount?: number;
  onGroupClick?: () => void;
  groupActive?: boolean;
  onColumnsClick?: () => void;
  onSortClick?: () => void;
  sortActive?: boolean;
  onExportClick?: () => void;
  showDeltas?: boolean;
  onShowDeltasChange?: (v: boolean) => void;
  extra?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5 px-3 py-2">
      <div className="flex items-center gap-1.5">
        {onSearchClick && (
          <Chip label="Search" onClick={onSearchClick} icon={<Search className="h-3.5 w-3.5" />} className="flex-1 justify-start" />
        )}
        {typeof showDeltas === "boolean" && onShowDeltasChange && (
          <Chip
            label="Delta"
            onClick={() => onShowDeltasChange(!showDeltas)}
            active={showDeltas}
            icon={<ArrowUpDown className="h-3.5 w-3.5" />}
          />
        )}
        {onFilterClick && (
          <Chip
            label="Filter"
            onClick={onFilterClick}
            badge={filterCount}
            icon={<Filter className="h-3.5 w-3.5" />}
          />
        )}
        {onColumnsClick && (
          <Chip label="Columns" onClick={onColumnsClick} icon={<Columns3 className="h-3.5 w-3.5" />} />
        )}
      </div>
      {(onGroupClick || onSortClick || onExportClick || extra) && (
        <div className="flex items-center gap-1.5">
          {onGroupClick && (
            <Chip
              label="Group"
              onClick={onGroupClick}
              active={groupActive}
              icon={<Layers className="h-3.5 w-3.5" />}
            />
          )}
          {onSortClick && (
            <Chip
              label="Sort"
              onClick={onSortClick}
              active={sortActive}
              icon={<ArrowUpDown className="h-3.5 w-3.5" />}
            />
          )}
          {onExportClick && (
            <Chip
              label="Export"
              onClick={onExportClick}
              icon={<Download className="h-3.5 w-3.5" />}
            />
          )}
          {extra && <div className="ml-auto flex items-center gap-1.5">{extra}</div>}
        </div>
      )}
    </div>
  );
}

function Chip({
  label,
  icon,
  onClick,
  active,
  badge,
  className,
}: {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
  active?: boolean;
  badge?: number;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active || undefined}
      data-active={active || undefined}
      className={cn(
        "h-8 inline-flex items-center gap-1 px-2.5 rounded-md border text-[12px] font-medium shrink-0 tabular-nums transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : (badge && badge > 0)
            ? "border-primary text-primary bg-primary/5"
            : "border-border text-foreground",
        className
      )}
    >
      {icon}
      <span>{label}</span>
      {badge ? (
        <span className={cn("text-[10px] rounded-full px-1", active ? "bg-primary-foreground/20" : "bg-primary/15")}>{badge}</span>
      ) : null}
    </button>
  );
}
