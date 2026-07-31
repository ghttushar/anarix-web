import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface MetricPulseProps {
  active: boolean;
  color?: "primary" | "success" | "warning" | "destructive";
  duration?: number;
  children: React.ReactNode;
  className?: string;
}

const colorClasses = {
  primary: "bg-primary/20",
  success: "bg-success/20",
  warning: "bg-warning/20",
  destructive: "bg-destructive/20",
};

export function MetricPulse({
  active,
  color = "primary",
  duration = 1000,
  children,
  className,
}: MetricPulseProps) {
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    if (active) {
      setIsPulsing(true);
      const timeout = setTimeout(() => {
        setIsPulsing(false);
      }, duration);
      return () => clearTimeout(timeout);
    }
  }, [active, duration]);

  return (
    <div className={cn("relative", className)}>
      {/* Pulse ring */}
      {isPulsing && (
        <div
          className={cn(
            "absolute inset-0 rounded-lg pointer-events-none",
            colorClasses[color]
          )}
          style={{
            animation: `pulse-ring ${duration}ms ease-out forwards`,
          }}
        />
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      <style>{`
        @keyframes pulse-ring {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.3;
          }
          100% {
            transform: scale(1.1);
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          @keyframes pulse-ring {
            0%, 100% {
              transform: scale(1);
              opacity: 0;
            }
          }
        }
      `}</style>
    </div>
  );
}
