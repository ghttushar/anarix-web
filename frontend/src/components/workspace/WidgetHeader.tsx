import { useState, ReactNode } from "react";
import { X, Pencil, GripVertical } from "lucide-react";
import type { WidgetType } from "@/pages/workspace/Dashboard";

const typeLabels: Record<WidgetType, string> = {
  metric: "KPI",
  chart: "Chart",
  table: "Table",
  annotation: "Note",
  task: "Tasks",
};

interface WidgetHeaderProps {
  title: string;
  type: WidgetType;
  onRemove: () => void;
  onTitleChange: (title: string) => void;
  dragHandle?: ReactNode;
}

export function WidgetHeader({ title, type, onRemove, onTitleChange, dragHandle }: WidgetHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex items-center justify-between border-b border-border bg-muted/30 px-3 py-2 shrink-0">
      <div className="flex items-center gap-2 min-w-0">
        {dragHandle || <GripVertical className="h-3.5 w-3.5 text-muted-foreground cursor-grab shrink-0" />}
        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground shrink-0">
          {typeLabels[type]}
        </span>
        {isEditing ? (
          <input
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            onBlur={() => setIsEditing(false)}
            onKeyDown={(e) => e.key === "Enter" && setIsEditing(false)}
            autoFocus
            className="text-sm font-medium bg-transparent border-b border-primary outline-none text-foreground min-w-0"
          />
        ) : (
          <span
            className="text-sm font-medium text-foreground truncate cursor-pointer hover:text-primary"
            onClick={() => setIsEditing(true)}
          >
            {title}
          </span>
        )}
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => setIsEditing(true)}
          className="h-6 w-6 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Pencil className="h-3 w-3" />
        </button>
        <button
          onClick={onRemove}
          className="h-6 w-6 flex items-center justify-center rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}