import { useState, useRef } from "react";
import type { Widget } from "@/pages/workspace/Dashboard";
import { MetricWidget } from "./MetricWidget";
import { ChartWidget } from "./ChartWidget";
import { TableWidget } from "./TableWidget";
import { AnnotationWidget } from "./AnnotationWidget";
import { TaskWidget } from "./TaskWidget";
import { WidgetHeader } from "./WidgetHeader";
import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react";

interface WidgetCanvasProps {
  widgets: Widget[];
  onRemoveWidget: (id: string) => void;
  onUpdateWidget: (id: string, updates: Partial<Widget>) => void;
  onReorderWidgets: (widgets: Widget[]) => void;
}

export function WidgetCanvas({ widgets, onRemoveWidget, onUpdateWidget, onReorderWidgets }: WidgetCanvasProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const dragCounter = useRef(0);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    dragCounter.current++;
    setDragOverId(id);
  };

  const handleDragLeave = () => {
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragOverId(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    dragCounter.current = 0;
    setDragOverId(null);

    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      return;
    }

    const fromIndex = widgets.findIndex((w) => w.id === draggedId);
    const toIndex = widgets.findIndex((w) => w.id === targetId);
    if (fromIndex === -1 || toIndex === -1) return;

    const newWidgets = [...widgets];
    const [moved] = newWidgets.splice(fromIndex, 1);
    newWidgets.splice(toIndex, 0, moved);
    onReorderWidgets(newWidgets);
    setDraggedId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
    dragCounter.current = 0;
  };

  if (widgets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 rounded-lg border-2 border-dashed border-border bg-muted/20">
        <p className="text-muted-foreground text-sm mb-2">No widgets yet</p>
        <p className="text-muted-foreground text-xs">Click "Add Widget" to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-4 auto-rows-[180px]">
      {widgets.map((widget) => (
        <div
          key={widget.id}
          draggable
          onDragStart={(e) => handleDragStart(e, widget.id)}
          onDragOver={handleDragOver}
          onDragEnter={(e) => handleDragEnter(e, widget.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, widget.id)}
          onDragEnd={handleDragEnd}
          className={cn(
            "rounded-lg border border-border bg-card overflow-hidden flex flex-col transition-all duration-150",
            draggedId === widget.id && "opacity-40 scale-[0.98]",
            dragOverId === widget.id && draggedId !== widget.id && "border-primary border-2 shadow-sm"
          )}
          style={{
            gridColumn: `span ${widget.colSpan}`,
            gridRow: `span ${widget.rowSpan}`,
          }}
        >
          <WidgetHeader
            title={widget.title}
            type={widget.type}
            onRemove={() => onRemoveWidget(widget.id)}
            onTitleChange={(title) => onUpdateWidget(widget.id, { title })}
            dragHandle={
              <div className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
                <GripVertical className="h-4 w-4" />
              </div>
            }
          />
          <div className="flex-1 overflow-auto p-4">
            {widget.type === "metric" && <MetricWidget config={widget.config} />}
            {widget.type === "chart" && <ChartWidget config={widget.config} onConfigChange={(config) => onUpdateWidget(widget.id, { config })} />}
            {widget.type === "table" && <TableWidget />}
            {widget.type === "annotation" && <AnnotationWidget config={widget.config} onConfigChange={(config) => onUpdateWidget(widget.id, { config })} />}
            {widget.type === "task" && <TaskWidget config={widget.config} onConfigChange={(config) => onUpdateWidget(widget.id, { config })} />}
          </div>
        </div>
      ))}
    </div>
  );
}
