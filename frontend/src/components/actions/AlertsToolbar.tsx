import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  density: "comfortable" | "compact";
  onDensityChange: (d: "comfortable" | "compact") => void;
  filter: FilterState;
  onFilterChange: (f: FilterState) => void;
  filterSheetOpen: boolean;
  onFilterSheetOpenChange: (o: boolean) => void;
}

export function AlertsToolbar(p: Props) {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-2">
      <nav role="tablist" aria-label="Registers" className="flex items-center gap-1">
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
                  ? "bg-foreground text-background font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
            >
              {t.label}
              {c > 0 && (
                <span className={cn(
                  "text-[11px] font-semibold px-1.5 rounded-full leading-[18px] min-w-[18px] text-center tabular-nums",
                  active ? "bg-background/20" : "bg-muted-foreground/15",
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
            placeholder="Search decisions, situations, meetings…"
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
        <div className="inline-flex items-center rounded-md border border-border p-0.5">
          {(["comfortable", "compact"] as const).map((d) => (
            <button
              key={d}
              onClick={() => p.onDensityChange(d)}
              className={cn(
                "h-6 px-2 text-[11.5px] rounded-[4px] capitalize transition-colors",
                p.density === d
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
              title={`${d} density`}
            >
              {d[0].toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
