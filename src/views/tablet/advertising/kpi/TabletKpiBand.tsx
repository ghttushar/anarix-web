import { cn } from "@/lib/utils";

export interface KpiChip {
  label: string;
  value: string;
  delta?: { value: number; positive?: boolean };
}

interface TabletKpiBandProps {
  chips: KpiChip[];
}

export function TabletKpiBand({ chips }: TabletKpiBandProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {chips.map((c) => (
        <div
          key={c.label}
          className="shrink-0 min-w-[140px] rounded-md border border-border bg-card px-3 py-2"
        >
          <div className="text-xs text-muted-foreground whitespace-nowrap">{c.label}</div>
          <div className="flex items-baseline gap-2 mt-0.5">
            <div className="text-base font-semibold text-foreground whitespace-nowrap">{c.value}</div>
            {c.delta && (
              <span
                className={cn(
                  "text-xs whitespace-nowrap",
                  c.delta.positive ? "text-emerald-600" : "text-red-600",
                )}
              >
                {c.delta.positive ? "+" : ""}
                {c.delta.value.toFixed(1)}%
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
