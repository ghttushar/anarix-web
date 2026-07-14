import { useState } from "react";
import { ChevronRight, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfitabilitySummary } from "@/types/profitability";
import { MorphingNumber } from "@/features/creative/MorphingNumber";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface PeriodSummaryCardProps {
  summary: ProfitabilitySummary;
  accentColor?: string;
  onViewMore?: (summary: ProfitabilitySummary) => void;
  frequency?: "daily" | "monthly";
  onDateChange?: (date: Date) => void;
}

export function PeriodSummaryCard({ summary, accentColor = "hsl(var(--primary))", onViewMore, frequency = "daily", onDateChange }: PeriodSummaryCardProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());

  const metrics = [
    { label: "GMV", value: summary.gmv, format: "currency" as const },
    { label: "Auth Sales", value: summary.authSales, format: "currency" as const },
    { label: "Orders", value: summary.orders, format: "number" as const },
    { label: "Ad Cost", value: summary.adCost, format: "currency" as const },
    { label: "Net Profit", value: summary.netProfit, format: "currency" as const, highlight: true },
  ];

  const handleDateSelect = (d: Date | undefined) => {
    if (!d) return;
    setSelectedDate(d);
    onDateChange?.(d);
  };

  const handleMonthSelect = (monthIndex: number) => {
    const d = new Date(selectedMonth.getFullYear(), monthIndex, 1);
    setSelectedMonth(d);
    onDateChange?.(d);
  };

  return (
    <div
      className={cn(
        "relative flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-all hover:shadow-sm",
        "before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:rounded-l-lg"
      )}
      style={{ "--accent-color": accentColor } as React.CSSProperties}
    >
      <div
        className="absolute left-0 top-0 h-full w-1 rounded-l-lg"
        style={{ background: `linear-gradient(180deg, ${accentColor}, ${accentColor}80)` }}
      />

      <div className="min-w-[120px] pl-3">
        <div className="flex items-center gap-1.5">
          <div className="font-medium text-foreground">{summary.dateLabel}</div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground">
                <CalendarIcon className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              {frequency === "daily" ? (
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  className="p-3 pointer-events-auto"
                />
              ) : (
                <div className="p-4 space-y-3">
                  <p className="text-xs font-medium text-muted-foreground">Select Month</p>
                  <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: 12 }, (_, i) => {
                      const isSelected = i === selectedMonth.getMonth();
                      return (
                        <button
                          key={i}
                          onClick={() => handleMonthSelect(i)}
                          className={cn(
                            "px-3 py-2 text-xs rounded-md transition-colors",
                            isSelected ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"
                          )}
                        >
                          {format(new Date(2024, i, 1), "MMM")}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>
        <div className="text-xs text-muted-foreground">{summary.dateRange}</div>
      </div>

      <div className="flex flex-1 items-center gap-4 lg:gap-6 overflow-hidden">
        {metrics.map((metric) => (
          <div key={metric.label} className="flex flex-col min-w-[80px]">
            <span className="text-xs text-muted-foreground whitespace-nowrap">{metric.label}</span>
            <MorphingNumber
              value={metric.value}
              format={metric.format}
              decimals={metric.format === "number" ? 0 : 2}
              className="text-sm whitespace-nowrap text-foreground"
            />
          </div>
        ))}
      </div>

      <button
        onClick={() => onViewMore?.(summary)}
        className="flex items-center gap-1 whitespace-nowrap text-sm font-medium text-primary hover:text-primary/80 transition-colors"
      >
        View More
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
