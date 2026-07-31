import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeltaBadgeProps {
  value: number; // percentage change
  className?: string;
}

export function DeltaBadge({ value, className }: DeltaBadgeProps) {
  if (value === 0) return null;

  const isPositive = value > 0;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium leading-none px-1 py-0.5",
        isPositive ? "text-success" : "text-destructive",
        className
      )}
    >
      {isPositive ? (
        <ArrowUp className="h-3.5 w-3.5" />
      ) : (
        <ArrowDown className="h-3.5 w-3.5" />
      )}
      {isPositive ? "+" : ""}
      {value.toFixed(1)}%
    </span>
  );
}