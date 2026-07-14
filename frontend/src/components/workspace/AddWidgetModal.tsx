import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BarChart3, Hash, Table2, StickyNote, ListTodo } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WidgetType } from "@/pages/workspace/Dashboard";

const widgetTypes: { type: WidgetType; label: string; description: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { type: "metric", label: "Metric (KPI)", description: "Single number with delta", icon: Hash },
  { type: "chart", label: "Chart", description: "Line, Bar, Area, or Pie chart", icon: BarChart3 },
  { type: "table", label: "Table", description: "Lightweight data table", icon: Table2 },
  { type: "annotation", label: "Annotation", description: "Post-it note for thinking", icon: StickyNote },
  { type: "task", label: "Tasks", description: "Checkbox to-do list", icon: ListTodo },
];

interface AddWidgetModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (type: WidgetType) => void;
}

export function AddWidgetModal({ open, onClose, onAdd }: AddWidgetModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Add Widget</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-3 mt-4">
          {widgetTypes.map((wt) => (
            <button
              key={wt.type}
              onClick={() => onAdd(wt.type)}
              className={cn(
                "flex items-center gap-4 rounded-lg border border-border bg-card p-4 text-left",
                "hover:border-primary/50 hover:bg-muted/50 transition-colors"
              )}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                <wt.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{wt.label}</p>
                <p className="text-xs text-muted-foreground">{wt.description}</p>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
