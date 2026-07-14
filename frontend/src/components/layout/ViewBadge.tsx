import { Link } from "react-router-dom";
import { Monitor, Tablet, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useViewport, AppView } from "@/contexts/ViewportContext";

const ICONS: Record<AppView, typeof Monitor> = {
  desktop: Monitor,
  tablet: Tablet,
  mobile: Smartphone,
};

const LABELS: Record<AppView, string> = {
  desktop: "Desktop",
  tablet: "Tablet",
  mobile: "Mobile",
};

export function ViewBadge({ className }: { className?: string }) {
  const { view } = useViewport();
  const Icon = ICONS[view];
  return (
    <Link
      to="/settings/appearance"
      title={`Active view: ${LABELS[view]} — click to change in Preferences`}
      className={cn(
        "inline-flex items-center gap-1 rounded-md border border-border bg-muted/40 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
        className,
      )}
    >
      <Icon className="h-3 w-3" />
      <span className="uppercase tracking-wider">{LABELS[view]}</span>
    </Link>
  );
}
