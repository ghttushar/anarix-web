import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TabletRightPanel } from "../shell/TabletRightPanel";
import { TabletFilterRuleCard } from "./TabletFilterRule";
import type { FilterState, FilterRule, FilterCombinator } from "./types";

interface TabletFilterBuilderProps {
  open: boolean;
  onClose: () => void;
  columns: { id: string; label: string }[];
  initial: FilterState;
  onApply: (next: FilterState) => void;
}

let nextId = 1;
const makeRule = (columnId: string): FilterRule => ({
  id: `rule-${nextId++}`,
  columnId,
  operator: "contains",
  value: "",
});

export function TabletFilterBuilder({ open, onClose, columns, initial, onApply }: TabletFilterBuilderProps) {
  const [draft, setDraft] = useState<FilterState>(initial);

  useEffect(() => {
    if (open) setDraft(initial);
  }, [open, initial]);

  const setCombinator = (c: FilterCombinator) => setDraft((d) => ({ ...d, combinator: c }));

  return (
    <TabletRightPanel open={open} onClose={onClose} title="Filter" width={440}>
      <div className="flex flex-col h-full">
        <div className="p-4 flex items-center gap-2 border-b border-border">
          <span className="text-sm text-muted-foreground mr-2">Match</span>
          <div className="inline-flex rounded-md border border-border overflow-hidden">
            {(["and", "or"] as FilterCombinator[]).map((c) => (
              <button
                key={c}
                onClick={() => setCombinator(c)}
                className={cn(
                  "min-h-11 px-4 text-sm uppercase",
                  draft.combinator === c ? "bg-primary text-primary-foreground" : "bg-card text-foreground",
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
          {draft.rules.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">No filters. Add a rule to start.</p>
          )}
          {draft.rules.map((r) => (
            <TabletFilterRuleCard
              key={r.id}
              rule={r}
              columns={columns}
              onChange={(next) =>
                setDraft((d) => ({ ...d, rules: d.rules.map((x) => (x.id === r.id ? next : x)) }))
              }
              onRemove={() => setDraft((d) => ({ ...d, rules: d.rules.filter((x) => x.id !== r.id) }))}
            />
          ))}
          <Button
            variant="outline"
            className="w-full h-11"
            onClick={() => setDraft((d) => ({ ...d, rules: [...d.rules, makeRule(columns[0]?.id ?? "")] }))}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add rule
          </Button>
        </div>
        <div className="p-4 border-t border-border flex gap-2">
          <Button variant="outline" className="flex-1 h-12" onClick={onClose}>Cancel</Button>
          <Button
            className="flex-1 h-12"
            onClick={() => {
              onApply(draft);
              onClose();
            }}
          >
            Apply
          </Button>
        </div>
      </div>
    </TabletRightPanel>
  );
}
