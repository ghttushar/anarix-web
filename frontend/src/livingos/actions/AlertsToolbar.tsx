import { LayoutList, Grid3x3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ALERT_TABS, type AlertTabKey } from "./tabs";
import { type ViewMode } from "./ViewSwitcher";
import { FilterSheet, countActiveFilters, type FilterState } from "./FilterSheet";
import { SortMenu, type SortKey } from "./SortMenu";

const REGISTER_LABEL: Record<AlertTabKey, string> = {
  all: "Everything",
  judgment: "Judgment",
  ai_at_work: "Aan at work",
  watching: "Watching",
  notice: "For your notice",
  settled: "Settled",
};

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
    <div className="mb-8 mt-2 border-b border-[hsl(var(--los-hairline))]/70 pb-3">
      <div className="flex flex-wrap items-end gap-x-7 gap-y-2">
        <nav role="tablist" aria-label="Registers" className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
          {ALERT_TABS.map((t) => {
            const active = p.tab === t.key;
            const c = p.counts[t.key];
            return (
              <button
                key={t.key}
                role="tab"
                aria-selected={active}
                onClick={() => p.onTabChange(t.key)}
                className="los-register"
              >
                {REGISTER_LABEL[t.key]}
                {c > 0 && <span className="los-register-count">{c}</span>}
              </button>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 text-[hsl(var(--los-muted))]">
          <FilterSheet
            value={p.filter}
            onChange={p.onFilterChange}
            activeCount={countActiveFilters(p.filter)}
            externalOpen={p.filterSheetOpen}
            onExternalOpenChange={p.onFilterSheetOpenChange}
          />
          <SortMenu value={p.sort} onChange={p.onSortChange} />
          <div className="ml-2 flex items-center gap-0.5 rounded-sm border border-[hsl(var(--los-hairline))] p-0.5">
            <button
              onClick={() => p.onViewChange("stack")}
              title="Stream"
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-sm los-breathe",
                p.viewMode === "stack"
                  ? "bg-[hsl(var(--los-ink))] text-[hsl(var(--los-paper))]"
                  : "hover:bg-[hsl(var(--los-hairline))]/60",
              )}
            >
              <LayoutList className="h-3 w-3" />
            </button>
            <button
              onClick={() => p.onViewChange("grid")}
              title="Field"
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-sm los-breathe",
                p.viewMode === "grid"
                  ? "bg-[hsl(var(--los-ink))] text-[hsl(var(--los-paper))]"
                  : "hover:bg-[hsl(var(--los-hairline))]/60",
              )}
            >
              <Grid3x3 className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
