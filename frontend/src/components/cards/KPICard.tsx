import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface KPICardProps {
  label: string;
  value: number;
  previousValue: number;
  format: "currency" | "number" | "percentage" | "decimal";
  className?: string;
}

function formatValue(value: number, format: KPICardProps["format"]): string {
  switch (format) {
    case "currency":
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    case "number":
      return new Intl.NumberFormat("en-US").format(value);
    case "percentage":
      return `${value.toFixed(2)}%`;
    case "decimal":
      return value.toFixed(2);
    default:
      return String(value);
  }
}

function calculateDelta(current: number, previous: number): { 
  percentage: number; 
  trend: "up" | "down" | "neutral" 
} {
  if (previous === 0) {
    return { percentage: 0, trend: "neutral" };
  }
  const percentage = ((current - previous) / previous) * 100;
  
  if (Math.abs(percentage) < 0.01) {
    return { percentage: 0, trend: "neutral" };
  }
  
  return {
    percentage: Math.abs(percentage),
    trend: percentage > 0 ? "up" : "down",
  };
}

export function KPICard({ 
  label, 
  value, 
  previousValue, 
  format,
  className 
}: KPICardProps) {
  const { percentage, trend } = calculateDelta(value, previousValue);

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  
  const trendColorClass = 
    trend === "up" ? "text-success" : 
    trend === "down" ? "text-destructive" : 
    "text-muted-foreground";

  return (
    <Card className={cn("", className)}>
      <CardContent className="p-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-2xl font-semibold text-foreground">
              {formatValue(value, format)}
            </span>
          </div>
          <div className={cn("flex items-center gap-1.5 text-xs", trendColorClass)}>
            <TrendIcon className="h-3.5 w-3.5" />
            <span>{percentage.toFixed(1)}%</span>
            <span className="text-muted-foreground">vs previous period</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
