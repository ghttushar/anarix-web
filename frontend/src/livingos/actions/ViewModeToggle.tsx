import { Rows3, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

export type ViewMode = "stack" | "card";

interface Props {
  value: ViewMode;
  onChange: (m: ViewMode) => void;
}

export function ViewModeToggle({ value, onChange }: Props) {
  return (
    <div className="inline-flex items-center rounded-lg border border-border bg-card p-1" role="tablist" aria-label="View mode">
      {([
        { k: "stack", label: "Stack", Icon: Rows3 },
        { k: "card", label: "Card", Icon: LayoutGrid },
      ] as const).map(({ k, label, Icon }) => {
        const active = value === k;
        return (
          <button
            key={k}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(k)}
            className={cn(
              "text-[12px] px-2.5 py-1.5 rounded-md flex items-center gap-1.5 transition-colors",
              active
                ? "bg-primary text-primary-foreground font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            )}
            title={`${label} view`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
