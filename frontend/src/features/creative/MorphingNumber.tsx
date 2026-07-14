import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MorphingNumberProps {
  value: number;
  format?: "number" | "currency" | "percent";
  duration?: number;
  showTrend?: boolean;
  trendValue?: number;
  className?: string;
  decimals?: number;
}

const formatValue = (value: number, format: string, decimals: number): string => {
  switch (format) {
    case "currency":
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(value);
    case "percent":
      return `${value.toFixed(decimals)}%`;
    default:
      return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(value);
  }
};

// Easing function for smooth animation
const easeOutExpo = (t: number): number => {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
};

export function MorphingNumber({
  value,
  format = "number",
  duration = 800,
  showTrend = false,
  trendValue = 0,
  className,
  decimals = 2,
}: MorphingNumberProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const previousValue = useRef(value);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const startValue = previousValue.current;
    const endValue = value;
    const startTime = performance.now();

    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);

      const currentValue = startValue + (endValue - startValue) * easedProgress;
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        previousValue.current = endValue;
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration]);

  const isPositive = trendValue > 0;
  const isNegative = trendValue < 0;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="tabular-nums font-medium transition-colors duration-300">
        {formatValue(displayValue, format, decimals)}
      </span>
      
      {showTrend && trendValue !== 0 && (
        <span
          className={cn(
            "flex items-center gap-0.5 text-xs font-medium transition-all duration-300",
            isPositive && "text-success",
            isNegative && "text-destructive"
          )}
        >
          {isPositive ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          {Math.abs(trendValue).toFixed(1)}%
        </span>
      )}
    </div>
  );
}
