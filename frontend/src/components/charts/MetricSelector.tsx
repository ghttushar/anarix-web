import { MetricKey } from "@/types/campaign";
import { METRIC_CONFIGS, CHART_COLORS } from "@/lib/constants/chartColors";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronDown } from "lucide-react";

interface MetricSelectorProps {
  selectedMetrics: MetricKey[];
  onToggle: (metric: MetricKey) => void;
  maxMetrics: number;
}

export function MetricSelector({ selectedMetrics, onToggle, maxMetrics }: MetricSelectorProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          Metrics ({selectedMetrics.length}/{maxMetrics})
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56 p-2">
        <div className="space-y-1">
          <p className="px-2 py-1 text-xs text-muted-foreground">
            Select up to {maxMetrics} metrics
          </p>
          {METRIC_CONFIGS.map((config) => {
            const isSelected = selectedMetrics.includes(config.key);
            const isDisabled = !isSelected && selectedMetrics.length >= maxMetrics;

            return (
              <button
                key={config.key}
                onClick={() => onToggle(config.key)}
                disabled={isDisabled}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                  isSelected
                    ? "bg-primary/10 text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  isDisabled && "cursor-not-allowed opacity-50"
                )}
              >
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: config.color }}
                />
                <span className="flex-1 text-left">{config.label}</span>
                {isSelected && <Check className="h-4 w-4 text-primary" />}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
