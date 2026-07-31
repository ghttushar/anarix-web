import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ProgressRingProps {
  value: number;
  max: number;
  size?: "sm" | "md" | "lg" | "xl";
  showLabel?: boolean;
  color?: "primary" | "success" | "warning" | "destructive";
  thickness?: number;
  className?: string;
  label?: string;
}

const sizeConfig = {
  sm: { size: 40, fontSize: "text-xs", labelSize: "text-[8px]" },
  md: { size: 64, fontSize: "text-sm", labelSize: "text-[10px]" },
  lg: { size: 96, fontSize: "text-lg", labelSize: "text-xs" },
  xl: { size: 128, fontSize: "text-2xl", labelSize: "text-sm" },
};

const colorConfig = {
  primary: "stroke-primary",
  success: "stroke-success",
  warning: "stroke-warning",
  destructive: "stroke-destructive",
};

export function ProgressRing({
  value,
  max,
  size = "md",
  showLabel = true,
  color = "primary",
  thickness,
  className,
  label,
}: ProgressRingProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const config = sizeConfig[size];
  const strokeWidth = thickness || config.size / 8;
  const radius = (config.size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min((animatedValue / max) * 100, 100);
  const offset = circumference - (percentage / 100) * circumference;

  useEffect(() => {
    // Animate from 0 to value
    const duration = 1000;
    const startTime = performance.now();
    const startValue = 0;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (value - startValue) * eased;
      setAnimatedValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <div 
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: config.size, height: config.size }}
    >
      <svg
        width={config.size}
        height={config.size}
        viewBox={`0 0 ${config.size} ${config.size}`}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={config.size / 2}
          cy={config.size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="stroke-muted fill-none"
        />
        
        {/* Progress circle */}
        <circle
          cx={config.size / 2}
          cy={config.size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn("fill-none transition-all duration-500", colorConfig[color])}
        />
      </svg>
      
      {/* Center label */}
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-semibold tabular-nums", config.fontSize)}>
            {Math.round(percentage)}%
          </span>
          {label && (
            <span className={cn("text-muted-foreground", config.labelSize)}>
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
