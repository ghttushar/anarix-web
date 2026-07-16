// Greeting header — minimal. The app-level KPI metric row has been removed to
// reduce cognitive load on the Signals page. Live business KPIs remain
// available in the daily briefing panel on the right.
import { useActionsStore } from "@/state/actionsStore";
import { briefingFor } from "@/lib/decisions/briefing";

interface Props {
  name?: string;
}

export function GreetingHeader({ name = "Tushar" }: Props) {
  const { decisions } = useActionsStore();
  const b = briefingFor(decisions);

  return (
    <header className="mb-2">
      <div className="flex items-center gap-3 flex-wrap">
        <h1 className="font-heading text-[24px] font-semibold text-foreground leading-tight tracking-tight">
          {b.greeting.replace(/\.$/, "")}, {name}.
        </h1>
        <p className="text-[13px] text-muted-foreground">{b.dateline}</p>
      </div>
    </header>
  );
}
