// Situation header — the hero block above the right pane when opening a
// situation card (e.g. Winter Push). Summarises decisions, opportunity,
// running/waiting counts and last update.
import type { Situation } from "@/lib/decisions/groupSituations";
import { formatValue } from "@/lib/decisions/valueFormat";

function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.round(diff / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} minute${min === 1 ? "" : "s"} ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr} hour${hr === 1 ? "" : "s"} ago`;
  const day = Math.round(hr / 24);
  return `${day} day${day === 1 ? "" : "s"} ago`;
}

export function SituationHeader({ situation }: { situation: Situation }) {
  const totalValue = formatValue({
    cents: situation.totalCents,
    kind: situation.primaryKind,
  });
  const running = situation.decisions.filter((d) => d.status === "in_flight" || d.status === "with_aan").length;
  const waiting = situation.decisions.filter((d) => d.status === "open").length;
  const done = situation.decisions.filter((d) => d.status === "completed" || d.status === "rejected").length;
  const lastUpdate = Math.max(...situation.decisions.map((d) => d.updatedAt));

  return (
    <section className="rounded-xl border border-border/60 bg-gradient-to-br from-card via-card to-primary/[0.03] p-4 shadow-[0_1px_0_hsl(var(--border)/0.5),0_20px_40px_-24px_hsl(var(--primary)/0.25)]">
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="text-[10.5px] uppercase tracking-widest font-semibold text-muted-foreground">Situation</div>
          <h2 className="mt-0.5 font-heading text-[22px] font-semibold text-foreground leading-tight tracking-tight">
            {situation.title}
          </h2>
        </div>
        {situation.totalCents > 0 && (
          <div className="shrink-0 text-right">
            <div className="font-heading text-[22px] font-semibold tabular-nums text-success">
              {totalValue.text}
            </div>
            <div className="text-[10.5px] uppercase tracking-widest text-muted-foreground mt-0.5">Opportunity</div>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center gap-4 text-[12px] text-muted-foreground">
        <span><span className="text-foreground/85 tabular-nums font-medium">{situation.decisions.length}</span> decisions</span>
        {running > 0 && <span><span className="text-foreground/85 tabular-nums font-medium">{running}</span> running</span>}
        {waiting > 0 && <span><span className="text-foreground/85 tabular-nums font-medium">{waiting}</span> waiting</span>}
        {done > 0 && <span><span className="text-foreground/85 tabular-nums font-medium">{done}</span> completed</span>}
        <span className="ml-auto">Updated {relativeTime(lastUpdate)}</span>
      </div>
    </section>
  );
}
