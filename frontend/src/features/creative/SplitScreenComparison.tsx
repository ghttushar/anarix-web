import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar, X } from "lucide-react";

interface Period {
  start: string;
  end: string;
  label?: string;
}

interface ComparisonData {
  metric: string;
  leftValue: number;
  rightValue: number;
  format?: "number" | "currency" | "percent";
}

interface SplitScreenComparisonProps {
  leftPeriod: Period;
  rightPeriod: Period;
  data: ComparisonData[];
  onClose?: () => void;
  className?: string;
}

const formatValue = (value: number, format?: string): string => {
  switch (format) {
    case "currency":
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    case "percent":
      return `${value.toFixed(1)}%`;
    default:
      return new Intl.NumberFormat("en-US").format(value);
  }
};

export function SplitScreenComparison({
  leftPeriod,
  rightPeriod,
  data,
  onClose,
  className,
}: SplitScreenComparisonProps) {
  const leftScrollRef = useRef<HTMLDivElement>(null);
  const rightScrollRef = useRef<HTMLDivElement>(null);
  const [syncing, setSyncing] = useState(false);

  // Sync scroll between left and right panels
  const handleScroll = (source: "left" | "right") => {
    if (syncing) return;
    setSyncing(true);

    const sourceRef = source === "left" ? leftScrollRef : rightScrollRef;
    const targetRef = source === "left" ? rightScrollRef : leftScrollRef;

    if (sourceRef.current && targetRef.current) {
      targetRef.current.scrollTop = sourceRef.current.scrollTop;
    }

    requestAnimationFrame(() => setSyncing(false));
  };

  return (
    <div className={cn("fixed inset-0 z-50 bg-background", className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <h2 className="text-lg font-heading font-semibold">Period Comparison</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Split panels */}
      <div className="flex h-[calc(100vh-65px)]">
        {/* Left panel */}
        <div className="flex-1 border-r border-border">
          <div className="px-6 py-4 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{leftPeriod.label || `${leftPeriod.start} - ${leftPeriod.end}`}</span>
            </div>
          </div>
          <div 
            ref={leftScrollRef}
            className="overflow-auto h-[calc(100%-57px)]"
            onScroll={() => handleScroll("left")}
          >
            <table className="w-full">
              <thead className="sticky top-0 bg-card border-b border-border">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Metric</th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-muted-foreground">Value</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={i} className="border-b border-border">
                    <td className="px-6 py-4 text-sm">{row.metric}</td>
                    <td className="px-6 py-4 text-sm text-right font-medium tabular-nums">
                      {formatValue(row.leftValue, row.format)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Divider with difference */}
        <div className="w-32 bg-muted/30 flex flex-col">
          <div className="px-4 py-4 border-b border-border text-center">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Difference
            </span>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-muted/30 border-b border-border">
                <tr>
                  <th className="py-3">&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => {
                  const diff = row.rightValue - row.leftValue;
                  const percentDiff = row.leftValue !== 0 
                    ? ((diff / row.leftValue) * 100)
                    : 0;
                  const isPositive = diff > 0;
                  const isNegative = diff < 0;

                  return (
                    <tr key={i} className="border-b border-border">
                      <td className="px-2 py-4 text-center">
                        <span className={cn(
                          "text-xs font-medium tabular-nums",
                          isPositive && "text-success",
                          isNegative && "text-destructive"
                        )}>
                          {isPositive && "+"}
                          {percentDiff.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1">
          <div className="px-6 py-4 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{rightPeriod.label || `${rightPeriod.start} - ${rightPeriod.end}`}</span>
            </div>
          </div>
          <div 
            ref={rightScrollRef}
            className="overflow-auto h-[calc(100%-57px)]"
            onScroll={() => handleScroll("right")}
          >
            <table className="w-full">
              <thead className="sticky top-0 bg-card border-b border-border">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Metric</th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-muted-foreground">Value</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => {
                  const diff = row.rightValue - row.leftValue;
                  const isPositive = diff > 0;
                  const isNegative = diff < 0;

                  return (
                    <tr key={i} className="border-b border-border">
                      <td className="px-6 py-4 text-sm">{row.metric}</td>
                      <td className={cn(
                        "px-6 py-4 text-sm text-right font-medium tabular-nums",
                        isPositive && "text-success",
                        isNegative && "text-destructive"
                      )}>
                        {formatValue(row.rightValue, row.format)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
