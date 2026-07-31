// Timeline (was: Audit). Vertical event list of what happened.
import type { Decision } from "@/types/signals";

interface Event {
  ts: number;
  who: string;
  what: string;
  detail?: string;
}

function buildEvents(d: Decision): Event[] {
  const evs: Event[] = [];
  evs.push({
    ts: d.createdAt,
    who: "Aan",
    what: "Detected the situation and drafted recommendation.",
    detail: d.sourceRef.label,
  });
  if (d.status !== "open") {
    evs.push({
      ts: d.updatedAt,
      who: "You",
      what:
        d.status === "in_flight" ? "Approved. Aan is executing." :
        d.status === "with_aan" ? "Assigned to Aan." :
        d.status === "rejected" ? "Rejected — Aan stood down." :
        d.status === "completed" ? "Marked completed." :
        d.status === "snoozed" ? `Snoozed${d.snoozedUntil ? " until " + new Date(d.snoozedUntil).toLocaleString() : ""}.` :
        "Status changed.",
      detail: "user",
    });
  }
  return evs;
}

export function TimelineView({ decision }: { decision: Decision }) {
  const events = buildEvents(decision);
  return (
    <ol className="border-l border-border ml-1 pl-4 space-y-3">
      {events.map((e, i) => (
        <li key={i} className="relative text-[12.5px]">
          <span className="absolute -left-[19px] top-1.5 h-2 w-2 rounded-full bg-primary/70 shadow-[0_0_10px_hsl(var(--primary)/0.6)]" />
          <div className="text-foreground/90 font-medium">{e.what}</div>
          <div className="text-muted-foreground text-[11.5px]">
            {new Date(e.ts).toLocaleString()} · {e.who}
            {e.detail ? ` · ${e.detail}` : ""}
          </div>
        </li>
      ))}
    </ol>
  );
}
