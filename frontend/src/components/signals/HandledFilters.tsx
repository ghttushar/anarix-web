import { cn } from "@/lib/utils";

export type HandledResolution = "all" | "completed" | "rejected" | "expired";

const CHIPS: { key: HandledResolution; label: string; className: string }[] = [
  { key: "all",       label: "All",         className: "text-foreground" },
  { key: "completed", label: "Completed",   className: "text-success" },
  { key: "rejected",  label: "Rejected",    className: "text-destructive" },
  { key: "expired",   label: "Expired",     className: "text-muted-foreground" },
];

interface Props {
  value: HandledResolution;
  onChange: (v: HandledResolution) => void;
  counts: Record<HandledResolution, number>;
}

export function HandledFilters({ value, onChange, counts }: Props) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {CHIPS.map((c) => {
        const active = value === c.key;
        return (
          <button
            key={c.key}
            onClick={() => onChange(c.key)}
            className={cn(
              "text-[11.5px] px-2.5 py-1 rounded-full border transition-colors flex items-center gap-1.5",
              active
                ? "border-primary/50 bg-primary/[0.06] text-primary font-medium"
                : "border-border text-muted-foreground hover:text-foreground hover:bg-muted",
            )}
          >
            {c.label}
            {counts[c.key] > 0 && (
              <span className={cn(
                "text-[10px] font-mono tabular-nums rounded-full leading-4 px-1.5",
                active ? "bg-primary/15" : "bg-muted-foreground/15",
              )}>
                {counts[c.key]}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
