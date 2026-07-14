import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filter as FilterIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { SOURCE_REGISTRY, type DecisionSource } from "@/livingos/lib/decisions/sourceRegistry";
import type { DecisionDomain } from "@/livingos/data/mockDecisions";
import { cn } from "@/lib/utils";

export interface FilterState {
  sources: Set<DecisionSource>;
  domains: Set<DecisionDomain>;
  window: "any" | "today" | "yesterday" | "week";
}

export const EMPTY_FILTER: FilterState = {
  sources: new Set(),
  domains: new Set(),
  window: "any",
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
  /** Optional controlled-open override, so a banner elsewhere can force the sheet open. */
  externalOpen?: boolean;
  onExternalOpenChange?: (o: boolean) => void;
}

export function FilterSheet({ value, onChange, activeCount, externalOpen, onExternalOpenChange }: Props) {
  const [draft, setDraft] = useState<FilterState>(value);
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = (o: boolean) => {
    if (externalOpen !== undefined) onExternalOpenChange?.(o);
    else setInternalOpen(o);
  };

  const toggle = <T,>(set: Set<T>, k: T): Set<T> => {
    const n = new Set(set);
    n.has(k) ? n.delete(k) : n.add(k);
    return n;
  };

  const apply = () => { onChange(draft); setOpen(false); };
  const reset = () => { const e = { ...EMPTY_FILTER, sources: new Set<DecisionSource>(), domains: new Set<DecisionDomain>() }; setDraft(e); onChange(e); setOpen(false); };

  return (
    <Sheet open={open} onOpenChange={(o) => { setOpen(o); if (o) setDraft(value); }}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 text-[12px] gap-1.5">
          <FilterIcon className="h-3.5 w-3.5" />
          Filter
          {activeCount > 0 && (
            <span className="ml-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold px-1.5 leading-4">
              {activeCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[360px] flex flex-col">
        <SheetHeader>
          <SheetTitle>Narrow the list</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-auto py-4 space-y-5">
          <section>
            <div className="text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground mb-2">Source</div>
            <div className="grid grid-cols-2 gap-1.5">
              {Object.values(SOURCE_REGISTRY).map((s) => {
                const on = draft.sources.has(s.key);
                const Icon = s.icon;
                return (
                  <button
                    key={s.key}
                    onClick={() => setDraft((d) => ({ ...d, sources: toggle(d.sources, s.key) }))}
                    className={cn(
                      "flex items-center gap-2 px-2.5 py-1.5 rounded-md border text-[12px] text-left",
                      on ? "border-primary/40 bg-primary/5 text-primary" : "border-border hover:bg-muted"
                    )}
                  >
                    <Icon className={cn("h-3.5 w-3.5", s.colorClass)} />
                    {s.label}
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <div className="text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground mb-2">Area</div>
            <div className="grid grid-cols-2 gap-1.5">
              {DOMAINS.map((d) => {
                const on = draft.domains.has(d.key);
                return (
                  <button
                    key={d.key}
                    onClick={() => setDraft((s) => ({ ...s, domains: toggle(s.domains, d.key) }))}
                    className={cn(
                      "px-2.5 py-1.5 rounded-md border text-[12px] text-left",
                      on ? "border-primary/40 bg-primary/5 text-primary" : "border-border hover:bg-muted"
                    )}
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <div className="text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground mb-2">Time window</div>
            <div className="flex flex-wrap gap-1.5">
              {WINDOWS.map((w) => (
                <button
                  key={w.key}
                  onClick={() => setDraft((d) => ({ ...d, window: w.key }))}
                  className={cn(
                    "px-2.5 py-1 rounded-md border text-[12px]",
                    draft.window === w.key ? "border-primary/40 bg-primary/5 text-primary" : "border-border hover:bg-muted"
                  )}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </section>
        </div>

        <SheetFooter className="flex-row justify-between gap-2 pt-3 border-t">
          <Button variant="ghost" size="sm" onClick={reset} className="text-[11.5px]">Reset</Button>
          <Button size="sm" onClick={apply} className="text-[11.5px]">Apply</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export function countActiveFilters(f: FilterState): number {
  return f.sources.size + f.domains.size + (f.window !== "any" ? 1 : 0);
}
