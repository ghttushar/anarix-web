import { useMemo } from "react";
import { useActionsStore } from "@/state/actionsStore";
import { lifecycleFor } from "@/lib/decisions/lifecycle";

function greetingWord(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function GreetingHeader({ name = "there" }: { name?: string }) {
  const { decisions } = useActionsStore();
  const { needsCount, handledCount } = useMemo(() => {
    let n = 0, h = 0;
    for (const d of decisions) {
      const lc = lifecycleFor(d);
      if (lc === "needs_me" || lc === "needs_review") n += 1;
      else if (lc === "completed_today" || lc === "aan_working") h += 1;
    }
    return { needsCount: n, handledCount: h };
  }, [decisions]);

  return (
    <header className="mb-5">
      <h1 className="font-heading text-[26px] font-semibold text-foreground leading-tight tracking-tight">
        {greetingWord()}, {name}.
      </h1>
      <p className="mt-1 text-[14px] text-muted-foreground">
        <span className="text-foreground font-medium">{needsCount}</span>
        {needsCount === 1 ? " thing needs" : " things need"} your judgment today.
        <span className="mx-1.5 text-border">·</span>
        <span className="text-foreground font-medium">{handledCount}</span> handled automatically.
      </p>
    </header>
  );
}
