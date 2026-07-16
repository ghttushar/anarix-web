import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ALERT_TABS, type AlertTabKey } from "./tabs";
import { FilterSheet, countActiveFilters, type FilterState } from "./FilterSheet";

interface Props {
  tab: AlertTabKey;
  onTabChange: (t: AlertTabKey) => void;
  counts: Record<AlertTabKey, number>;
  query: string;
  onQueryChange: (q: string) => void;
  filter: FilterState;
  onFilterChange: (f: FilterState) => void;
  filterSheetOpen: boolean;
  onFilterSheetOpenChange: (o: boolean) => void;
}

export function AlertsToolbar(p: Props) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <nav role="tablist" aria-label="Alerts tabs" className="flex items-center gap-1 p-1 rounded-lg bg-muted/40 border border-border/50">
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
                "h-8 px-3 rounded-md text-[13px] transition-all flex items-center gap-1.5",
                active
                  ? "bg-background text-foreground shadow-sm font-medium"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
              {c > 0 && (
                <span className={cn(
                  "text-[11px] font-semibold px-1.5 rounded-full leading-[18px] min-w-[18px] text-center tabular-nums",
                  active ? "bg-primary/12 text-primary" : "bg-muted-foreground/15 text-muted-foreground",
                )}>
                  {c}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={p.query}
            onChange={(e) => p.onQueryChange(e.target.value)}
            placeholder="Search signals, meetings, decisions…"
            className="h-8 w-[280px] pl-7 text-[12.5px]"
          />
        </div>
        <FilterSheet
          value={p.filter}
          onChange={p.onFilterChange}
          activeCount={countActiveFilters(p.filter)}
          externalOpen={p.filterSheetOpen}
          onExternalOpenChange={p.onFilterSheetOpenChange}
        />
      </div>
    </div>
  );
}
