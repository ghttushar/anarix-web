import { Skeleton } from "./skeleton";
import { cn } from "@/lib/utils";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function TableSkeleton({ rows = 5, columns = 6, className }: TableSkeletonProps) {
  return (
    <div className={cn("rounded-lg border border-border overflow-hidden", className)}>
      {/* Header */}
      <div className="bg-muted/30 border-b border-border">
        <div className="flex gap-4 p-4">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div 
          key={rowIndex} 
          className="flex gap-4 p-4 border-b border-border last:border-b-0"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton 
              key={colIndex} 
              className={cn(
                "h-4 flex-1",
                colIndex === 0 && "max-w-[200px]"
              )} 
            />
          ))}
        </div>
      ))}
    </div>
  );
}

interface CardSkeletonProps {
  className?: string;
  hasHeader?: boolean;
  hasFooter?: boolean;
}

export function CardSkeleton({ className, hasHeader = true, hasFooter = false }: CardSkeletonProps) {
  return (
    <div className={cn("rounded-lg border border-border bg-card p-6", className)}>
      {hasHeader && (
        <div className="mb-4">
          <Skeleton className="h-5 w-1/3 mb-2" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      )}
      
      <div className="space-y-3">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-4/5" />
        <Skeleton className="h-8 w-3/5" />
      </div>
      
      {hasFooter && (
        <div className="mt-4 pt-4 border-t border-border flex justify-end gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
        </div>
      )}
    </div>
  );
}

interface ChartSkeletonProps {
  className?: string;
  type?: "line" | "bar" | "area";
}

export function ChartSkeleton({ className, type = "area" }: ChartSkeletonProps) {
  return (
    <div className={cn("rounded-lg border border-border bg-card p-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-8 w-24" />
      </div>
      
      {/* Chart area */}
      <div className="relative h-[200px]">
        {type === "bar" ? (
          <div className="absolute inset-0 flex items-end justify-around gap-2 px-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton 
                key={i} 
                className="flex-1 rounded-t" 
                style={{ height: `${30 + Math.random() * 60}%` }}
              />
            ))}
          </div>
        ) : (
          <div className="absolute inset-0">
            <svg viewBox="0 0 400 200" className="w-full h-full">
              <path
                d="M0,150 Q50,100 100,120 T200,80 T300,100 T400,60"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="2"
                className="animate-pulse"
              />
              <path
                d="M0,150 Q50,100 100,120 T200,80 T300,100 T400,60 V200 H0 Z"
                fill="hsl(var(--muted) / 0.3)"
                className="animate-pulse"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

interface MetricSkeletonProps {
  className?: string;
}

export function MetricSkeleton({ className }: MetricSkeletonProps) {
  return (
    <div className={cn("rounded-lg border border-border bg-card p-4", className)}>
      <Skeleton className="h-3 w-16 mb-2" />
      <Skeleton className="h-8 w-24 mb-1" />
      <Skeleton className="h-3 w-12" />
    </div>
  );
}
