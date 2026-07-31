import { useState, ReactNode } from "react";
import { Maximize2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type ChartType = "line" | "bar" | "area" | "pie";

export interface ChartMetric {
  key: string;
  label: string;
  color: string;
  active: boolean;
}

const CHART_TYPE_LABELS: Record<ChartType, string> = {
  line: "Line",
  bar: "Bar",
  area: "Area",
  pie: "Pie",
};

interface ChartContainerProps {
  title?: string;
  subtitle?: string;
  metrics?: ChartMetric[];
  onMetricToggle?: (key: string) => void;
  chartType: ChartType;
  onChartTypeChange: (type: ChartType) => void;
  availableChartTypes?: ChartType[];
  children: ReactNode;
  expandedChildren?: ReactNode;
  extraControls?: ReactNode;
  className?: string;
}

export function ChartContainer({
  title,
  subtitle,
  metrics,
  onMetricToggle,
  chartType,
  onChartTypeChange,
  availableChartTypes = ["line", "bar", "area"],
  children,
  expandedChildren,
  extraControls,
  className,
}: ChartContainerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const activeMetricCount = metrics?.filter((m) => m.active).length ?? 0;
  const totalMetricCount = metrics?.length ?? 0;

  const controls = (
    <>
      {extraControls}

      {metrics && metrics.length > 0 && onMetricToggle && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1 cursor-pointer" title="Toggle chart metrics">
              Metrics ({activeMetricCount}/{totalMetricCount})
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-48 p-2">
            <div className="space-y-1">
              {metrics.map((m) => (
                <button
                  key={m.key}
                  onClick={() => onMetricToggle(m.key)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors cursor-pointer",
                    m.active
                      ? "bg-primary/10 text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: m.color }} />
                  <span className="flex-1 text-left">{m.label}</span>
                  {m.active && <Check className="h-3 w-3 text-primary" />}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}

      <Select value={chartType} onValueChange={(v) => onChartTypeChange(v as ChartType)}>
        <SelectTrigger className="h-7 w-[80px] text-xs cursor-pointer" title="Change chart type">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {availableChartTypes.map((t) => (
            <SelectItem key={t} value={t} className="text-xs cursor-pointer">
              {CHART_TYPE_LABELS[t]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );

  return (
    <>
      <div className={cn("rounded-lg border border-border bg-card p-4 flex flex-col", className)}>
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="min-w-0">
            {title && <h3 className="font-heading text-sm font-semibold text-foreground truncate">{title}</h3>}
            {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {controls}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer" onClick={() => setIsExpanded(true)}>
                  <Maximize2 className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Expand chart</TooltipContent>
            </Tooltip>
          </div>
        </div>
        <div className="flex-1 min-h-0">{children}</div>
      </div>

      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent className="max-w-[90vw] max-h-[85vh] h-[75vh]">
          <DialogHeader>
            <div className="flex items-center justify-between gap-2">
              <DialogTitle className="text-base">{title || "Chart"}</DialogTitle>
              <div className="flex items-center gap-2 shrink-0 mr-6">
                {controls}
              </div>
            </div>
            <DialogDescription className="sr-only">Expanded chart view</DialogDescription>
          </DialogHeader>
          <div className="flex-1 min-h-0 h-full">
            {expandedChildren || children}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
