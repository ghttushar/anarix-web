import { MoreHorizontal, Keyboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ALERT_TABS, type AlertTabKey } from "./tabs";
import { ViewSwitcher, type ViewMode } from "./ViewSwitcher";
import { FilterSheet, countActiveFilters, type FilterState } from "./FilterSheet";
import { SortMenu, type SortKey } from "./SortMenu";

interface Props {
  tab: AlertTabKey;
  onTabChange: (t: AlertTabKey) => void;
  counts: Record<AlertTabKey, number>;
  viewMode: ViewMode;
  onViewChange: (v: ViewMode) => void;
  filter: FilterState;
  onFilterChange: (f: FilterState) => void;
  sort: SortKey;
  onSortChange: (s: SortKey) => void;
  filterSheetOpen: boolean;
  onFilterSheetOpenChange: (o: boolean) => void;
  onOpenShortcuts?: () => void;
}

export function AlertsToolbar(p: Props) {
  return (
    <div className="sticky top-0 z-20 mb-3 rounded-md border border-border bg-card">
      <div className="flex flex-wrap items-center gap-2 px-3 py-2">
        {/* Tabs — left side */}
        <nav role="tablist" aria-label="Alert filters" className="flex flex-wrap items-center gap-1">
          {ALERT_TABS.map((t) => {
            const active = p.tab === t.key;
            const c = p.counts[t.key];
            return (
              <button
                key={t.key}
                role="tab"
                aria-selected={active}
                onClick={() => p.onTabChange(t.key)}
                className={cn(
                  "h-8 px-3 rounded-md text-[13px] transition-colors flex items-center gap-1.5",
                  active
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                {t.label}
                {c > 0 && (
                  <span
                    className={cn(
                      "text-[11px] font-semibold px-1.5 rounded-full leading-[18px] min-w-[18px] text-center",
                      active ? "bg-primary-foreground/20" : "bg-muted-foreground/15",
                    )}
                  >
                    {c}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right side controls */}
        <div className="ml-auto flex items-center gap-2">
          <FilterSheet
            value={p.filter}
            onChange={p.onFilterChange}
            activeCount={countActiveFilters(p.filter)}
            externalOpen={p.filterSheetOpen}
            onExternalOpenChange={p.onFilterSheetOpenChange}
          />
          <SortMenu value={p.sort} onChange={p.onSortChange} />
          <ViewSwitcher value={p.viewMode} onChange={p.onViewChange} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" title="More">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {p.onOpenShortcuts && (
                <DropdownMenuItem onSelect={p.onOpenShortcuts}>
                  <Keyboard className="h-4 w-4 mr-2" /> Keyboard shortcuts
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
