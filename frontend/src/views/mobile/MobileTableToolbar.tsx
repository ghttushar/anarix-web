import { ReactNode } from "react";
import { Search, Filter, Columns3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * Mobile table toolbar — view-only row: live search input + filter icon +
 * column icon. Write/edit/export actions are intentionally absent.
 */
export function MobileTableToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search…",
  onFilterClick,
  filterCount,
  onColumnsClick,
  extra,
}: {
  searchValue?: string;
  onSearchChange?: (v: string) => void;
  searchPlaceholder?: string;
  onFilterClick?: () => void;
  filterCount?: number;
  onColumnsClick?: () => void;
  extra?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-2">
      <div className="relative flex-1 min-w-0">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          value={searchValue ?? ""}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder={searchPlaceholder}
          className="h-9 pl-8 text-[13px]"
        />
      </div>
      {onFilterClick && (
        <IconButton onClick={onFilterClick} label="Filter" badge={filterCount}>
          <Filter className="h-4 w-4" />
        </IconButton>
      )}
      {onColumnsClick && (
        <IconButton onClick={onColumnsClick} label="Columns">
          <Columns3 className="h-4 w-4" />
        </IconButton>
      )}
      {extra}
    </div>
  );
}

function IconButton({
  children,
  label,
  badge,
  onClick,
}: {
  children: ReactNode;
  label: string;
  badge?: number;
  onClick?: () => void;
}) {
  const hasBadge = !!badge && badge > 0;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "relative h-9 w-9 rounded-md border flex items-center justify-center shrink-0",
        hasBadge ? "border-primary text-primary bg-primary/5" : "border-border text-foreground active:bg-muted"
      )}
    >
      {children}
      {hasBadge && (
        <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] leading-4 text-center font-semibold">
          {badge}
        </span>
      )}
    </button>
  );
}
