import { Trash2, GripVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TouchTarget } from "../primitives/TouchTarget";
import { OPERATOR_LABELS, type FilterOperator, type FilterRule } from "./types";

interface TabletFilterRuleProps {
  rule: FilterRule;
  columns: { id: string; label: string }[];
  onChange: (next: FilterRule) => void;
  onRemove: () => void;
}

export function TabletFilterRuleCard({ rule, columns, onChange, onRemove }: TabletFilterRuleProps) {
  return (
    <div className="flex items-start gap-2 p-3 border border-border rounded-md bg-card">
      <TouchTarget aria-label="Drag" className="text-muted-foreground cursor-grab">
        <GripVertical className="h-5 w-5" />
      </TouchTarget>
      <div className="flex-1 grid grid-cols-1 gap-2">
        <Select value={rule.columnId} onValueChange={(v) => onChange({ ...rule, columnId: v })}>
          <SelectTrigger className="h-11"><SelectValue placeholder="Column" /></SelectTrigger>
          <SelectContent>
            {columns.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={rule.operator} onValueChange={(v) => onChange({ ...rule, operator: v as FilterOperator })}>
          <SelectTrigger className="h-11"><SelectValue placeholder="Operator" /></SelectTrigger>
          <SelectContent>
            {Object.entries(OPERATOR_LABELS).map(([k, label]) => (
              <SelectItem key={k} value={k}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          value={rule.value}
          onChange={(e) => onChange({ ...rule, value: e.target.value })}
          placeholder="Value"
          className="h-11"
        />
      </div>
      <TouchTarget aria-label="Remove rule" onClick={onRemove} className="text-destructive">
        <Trash2 className="h-5 w-5" />
      </TouchTarget>
    </div>
  );
}
