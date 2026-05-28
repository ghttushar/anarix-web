import { X } from "lucide-react";
import { TouchTarget } from "../primitives/TouchTarget";
import { OPERATOR_LABELS, type FilterRule } from "./types";

interface TabletFilterChipsProps {
  rules: FilterRule[];
  columnLabel: (id: string) => string;
  onRemove: (id: string) => void;
}

export function TabletFilterChips({ rules, columnLabel, onRemove }: TabletFilterChipsProps) {
  if (rules.length === 0) return null;
  return (
    <>
      {rules.map((r) => (
        <span
          key={r.id}
          className="inline-flex items-center gap-1 rounded-full bg-muted text-foreground text-xs pl-3 pr-1 py-1"
        >
          <span className="truncate max-w-[160px]">
            {columnLabel(r.columnId)} {OPERATOR_LABELS[r.operator]} {r.value || "…"}
          </span>
          <TouchTarget aria-label="Remove filter" onClick={() => onRemove(r.id)} className="h-8 w-8 rounded-full">
            <X className="h-4 w-4" />
          </TouchTarget>
        </span>
      ))}
    </>
  );
}
