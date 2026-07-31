import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Filter as FilterIcon, X } from "lucide-react";
import { SOURCE_REGISTRY, type DecisionSource } from "@/lib/decisions/sourceRegistry";
import type { DecisionDomain } from "@/types/signals";
import { cn } from "@/lib/utils";

export interface FilterState {
  sources: Set<DecisionSource>;
  domains: Set<DecisionDomain>;
  window: "any" | "today" | "yesterday" | "week";
  categories: Set<string>;
}

export const EMPTY_FILTER: FilterState = {
  sources: new Set(),
  domains: new Set(),
  window: "any",
  categories: new Set(),
};

const DOMAINS: { key: DecisionDomain; label: string }[] = [
  { key: "campaign", label: "Advertising" },
  { key: "retail", label: "Retail / Listings" },
  { key: "profitability", label: "Profitability" },
  { key: "inventory", label: "Inventory" },
  { key: "cs", label: "Customer service" },
  { key: "buyer", label: "Buyer / Accounts" },
];

const WINDOWS: { key: FilterState["window"]; label: string }[] = [
  { key: "any", label: "Any time" },
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "week", label: "This week" },
];

interface Props {
  value: FilterState;
  onChange: (f: FilterState) => void;
  activeCount: number;
  /** Expanded inline filter — no Sheet/sidebar. */
  externalOpen?: boolean;
  onExternalOpenChange?: (o: boolean) => void;
  /** Category filter options from the alert categories. */
  categoryOptions?: { key: string; label: string; count: number }[];
}

export function FilterSheet({ value, onChange, activeCount, categoryOptions }: Props) {
  const [draft, setDraft] = useState<FilterState>(value);
  const [expanded, setExpanded] = useState(true);

  const toggle = <T,>(set: Set<T>, k: T): Set<T> => {
    const n = new Set(set);
    if (n.has(k)) { n.delete(k); } else { n.add(k); }
    return n;
  };

  if (!expanded) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="h-8 text-[12px] gap-1.5" onClick={() => setExpanded(true)}>
          <FilterIcon className="h-3.5 w-3.5" />
          Filter
          {activeCount > 0 && (
            <span className="ml-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold px-1.5 leading-4">
              {activeCount}
            </span>
          )}
        </Button>
      </div>
    );
  }

  const reset = () => {
    const e = { ...EMPTY_FILTER, sources: new Set<DecisionSource>(), domains: new Set<DecisionDomain>(), categories: new Set<string>() };
    setDraft(e);
    onChange(e);
  };

  const apply = () => { onChange(draft); };

  return (
    <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground">Filters</span>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={reset} className="text-[11.5px] h-6 px-2">Reset</Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setExpanded(false)}>
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Categories */}
      {categoryOptions && categoryOptions.length > 0 && (
        <section>
          <div className="text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground mb-2">Category</div>
          <div className="flex flex-wrap gap-1.5">
            {categoryOptions.map((cat) => {
              const on = draft.categories.has(cat.key);
              return (
                <button
                  key={cat.key}
                  onClick={() => setDraft((d) => ({ ...d, categories: toggle(d.categories, cat.key) }))}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-[12px]",
                    on ? "border-primary/40 bg-primary/5 text-primary font-medium" : "border-border hover:bg-muted text-muted-foreground",
                  )}
                >
                  {cat.label}
                  <span className="text-[10px] tabular-nums opacity-70">({cat.count})</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Source */}
      <section>
        <div className="text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground mb-2">Source</div>
        <div className="flex flex-wrap gap-1.5">
          {Object.values(SOURCE_REGISTRY).map((s) => {
            const on = draft.sources.has(s.key);
            const Icon = s.icon;
            return (
              <button
                key={s.key}
                onClick={() => setDraft((d) => ({ ...d, sources: toggle(d.sources, s.key) }))}
                className={cn(
                  "flex items-center gap-2 px-2.5 py-1.5 rounded-md border text-[12px]",
                  on ? "border-primary/40 bg-primary/5 text-primary" : "border-border hover:bg-muted text-muted-foreground",
                )}
              >
                <Icon className={cn("h-3.5 w-3.5", s.colorClass)} />
                {s.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Area */}
      <section>
        <div className="text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground mb-2">Area</div>
        <div className="flex flex-wrap gap-1.5">
          {DOMAINS.map((d) => {
            const on = draft.domains.has(d.key);
            return (
              <button
                key={d.key}
                onClick={() => setDraft((s) => ({ ...s, domains: toggle(s.domains, d.key) }))}
                className={cn(
                  "px-2.5 py-1.5 rounded-md border text-[12px]",
                  on ? "border-primary/40 bg-primary/5 text-primary" : "border-border hover:bg-muted text-muted-foreground",
                )}
              >
                {d.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Time window */}
      <section>
        <div className="text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground mb-2">Time window</div>
        <div className="flex flex-wrap gap-1.5">
          {WINDOWS.map((w) => (
            <button
              key={w.key}
              onClick={() => setDraft((d) => ({ ...d, window: w.key }))}
              className={cn(
                "px-2.5 py-1 rounded-md border text-[12px]",
                draft.window === w.key ? "border-primary/40 bg-primary/5 text-primary font-medium" : "border-border hover:bg-muted text-muted-foreground",
              )}
            >
              {w.label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

export function countActiveFilters(f: FilterState): number {
  return f.sources.size + f.domains.size + f.categories.size + (f.window !== "any" ? 1 : 0);
}