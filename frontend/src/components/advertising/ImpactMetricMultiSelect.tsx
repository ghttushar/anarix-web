import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ImpactMetricKey } from "@/lib/utils/impactSeries";

export interface ImpactMetricOption {
  key: ImpactMetricKey | string;
  label: string;
  color: string;
  available: boolean; // true if mock data carries this metric
}

export const IMPACT_METRIC_OPTIONS: ImpactMetricOption[] = [
  { key: "impressions", label: "Impressions", color: "hsl(230, 29%, 69%)", available: true },
  { key: "clicks",      label: "Clicks",      color: "hsl(231, 88%, 70%)", available: true },
  { key: "ctr",         label: "CTR",         color: "hsl(231, 74%, 81%)", available: true },
  { key: "adSpend",     label: "Ad Spend",    color: "hsl(229, 65%, 57%)", available: true },
  { key: "adSales",     label: "Ad Sales",    color: "hsl(142, 71%, 45%)", available: true },
  { key: "roas",        label: "ROAS",        color: "hsl(38, 92%, 50%)",  available: true },
  { key: "acos",        label: "ACOS",        color: "hsl(0, 84%, 60%)",   available: true },
  { key: "orders",      label: "Orders",      color: "hsl(173, 58%, 39%)", available: false },
  { key: "units",       label: "Units",       color: "hsl(197, 71%, 52%)", available: false },
  { key: "cpc",         label: "CPC",         color: "hsl(234, 30%, 24%)", available: false },
  { key: "cvr",         label: "CVR",         color: "hsl(280, 60%, 60%)", available: false },
  { key: "aov",         label: "AOV",         color: "hsl(20, 80%, 55%)",  available: false },
];

export const MAX_IMPACT_METRICS = 4;

interface Props {
  selected: ImpactMetricKey[];
  onChange: (next: ImpactMetricKey[]) => void;
}

export function ImpactMetricMultiSelect({ selected, onChange }: Props) {
  const toggle = (key: ImpactMetricKey) => {
    if (selected.includes(key)) {
      onChange(selected.filter((k) => k !== key));
    } else {
      if (selected.length >= MAX_IMPACT_METRICS) return;
      onChange([...selected, key]);
    }
  };

  return (
    <div className="flex items-center gap-1.5 rounded-md bg-muted/40 px-2.5 py-1">
      <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Metrics</span>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 gap-1 text-sm font-normal px-1.5 cursor-pointer">
            <span>{selected.length}/{MAX_IMPACT_METRICS} selected</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-60 p-2">
          <div className="space-y-1">
            <p className="px-2 py-1 text-xs text-muted-foreground">
              Select up to {MAX_IMPACT_METRICS} metrics
            </p>
            {IMPACT_METRIC_OPTIONS.map((opt) => {
              const isSelected = selected.includes(opt.key as ImpactMetricKey);
              const limitReached = !isSelected && selected.length >= MAX_IMPACT_METRICS;
              const disabled = !opt.available || limitReached;
              return (
                <button
                  key={opt.key}
                  onClick={() => opt.available && toggle(opt.key as ImpactMetricKey)}
                  disabled={disabled}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                    isSelected
                      ? "bg-primary/10 text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    disabled && "cursor-not-allowed opacity-50 hover:bg-transparent",
                  )}
                  title={!opt.available ? "Coming soon" : limitReached ? "Max 4 metrics" : undefined}
                >
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: opt.color }} />
                  <span className="flex-1 text-left">{opt.label}</span>
                  {!opt.available && <span className="text-[10px] uppercase tracking-wide">soon</span>}
                  {isSelected && <Check className="h-4 w-4 text-primary" />}
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
