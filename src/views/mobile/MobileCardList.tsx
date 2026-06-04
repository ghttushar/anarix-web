import { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Mobile read-only card row.
 * Renders a tappable card with optional thumbnail, title, sub-meta, KPI strip,
 * and right chevron when an onTap handler is provided.
 *
 * Used by mobile-only adaptations of desktop tables (Phase M3).
 */
export interface MobileCardKpi {
  label: string;
  value: ReactNode;
}

export interface MobileCardProps {
  thumbnail?: string;
  title: ReactNode;
  meta?: ReactNode;
  kpis?: MobileCardKpi[];
  onTap?: () => void;
  className?: string;
}

export function MobileCard({ thumbnail, title, meta, kpis = [], onTap, className }: MobileCardProps) {
  const interactive = !!onTap;
  return (
    <button
      type="button"
      onClick={onTap}
      disabled={!interactive}
      className={cn(
        "w-full rounded-lg border border-border bg-card p-3 text-left",
        interactive && "active:bg-muted/40 transition-colors",
        !interactive && "cursor-default",
        className
      )}
    >
      <div className="flex items-start gap-3">
        {thumbnail && (
          <img
            src={thumbnail}
            alt=""
            className="h-10 w-10 shrink-0 rounded-md border border-border object-cover"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="text-sm font-medium text-foreground line-clamp-2">{title}</div>
            {interactive && <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />}
          </div>
          {meta && <div className="text-xs text-muted-foreground mt-0.5 truncate">{meta}</div>}
        </div>
      </div>
      {kpis.length > 0 && (
        <div className="mt-3 grid gap-2" style={{ gridTemplateColumns: `repeat(${kpis.length}, minmax(0, 1fr))` }}>
          {kpis.map((k) => (
            <div key={k.label} className="rounded-md bg-muted/30 px-2 py-1.5">
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{k.label}</div>
              <div className="text-sm font-semibold text-foreground tabular-nums">{k.value}</div>
            </div>
          ))}
        </div>
      )}
    </button>
  );
}

export function MobileCardList({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("flex flex-col gap-2", className)}>{children}</div>;
}
