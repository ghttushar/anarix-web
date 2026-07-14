import { LayoutGrid, Rows3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export type ViewMode = "stack" | "grid";

interface Props {
  value: ViewMode;
  onChange?: (v: ViewMode) => void;
  className?: string;
}

/** Segmented Stack / Grid control. Navigates to /alerts/stack or /alerts/grid. */
export function ViewSwitcher({ value, onChange, className }: Props) {
  const navigate = useNavigate();
  const opts: { key: ViewMode; label: string; icon: typeof Rows3 }[] = [
    { key: "stack", label: "Stack", icon: Rows3 },
    { key: "grid", label: "Grid", icon: LayoutGrid },
  ];
  return (
    <div
      role="tablist"
      aria-label="View mode"
      className={cn("inline-flex items-center rounded-md border border-border bg-card p-0.5", className)}
    >
      {opts.map((o) => {
        const active = value === o.key;
        const Icon = o.icon;
        return (
          <button
            key={o.key}
            role="tab"
            aria-selected={active}
            onClick={() => {
              onChange?.(o.key);
              navigate(`/alerts/${o.key}`);
            }}
            className={cn(
              "flex items-center gap-1.5 h-7 px-2.5 text-[12.5px] rounded-[5px] transition-colors",
              active
                ? "bg-primary text-primary-foreground font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
