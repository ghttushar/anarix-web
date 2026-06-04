import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useViewport } from "@/contexts/ViewportContext";
import { cn } from "@/lib/utils";

/**
 * Sticky back-aware header for mobile drill-down (stacked) routes.
 * Renders only on mobile. Pops history if no `to` is provided.
 * Phase M5.
 */
interface Props {
  title: ReactNode;
  subtitle?: ReactNode;
  to?: string;
  right?: ReactNode;
  className?: string;
}

export function MobileDrillHeader({ title, subtitle, to, right, className }: Props) {
  const { view } = useViewport();
  const navigate = useNavigate();
  if (view !== "mobile") return null;

  const handleBack = () => {
    if (to) navigate(to);
    else navigate(-1);
  };

  return (
    <div
      className={cn(
        "sticky top-14 z-20 -mx-3 px-3 h-12 flex items-center gap-2 bg-background border-b border-border",
        className
      )}
    >
      <button
        type="button"
        onClick={handleBack}
        aria-label="Back"
        className="h-10 w-10 -ml-2 rounded-md flex items-center justify-center text-foreground active:bg-muted/60"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-foreground truncate">{title}</div>
        {subtitle && <div className="text-[11px] text-muted-foreground truncate">{subtitle}</div>}
      </div>
      {right}
    </div>
  );
}
