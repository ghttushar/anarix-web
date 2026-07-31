import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { Decision } from "@/types/signals";

interface Event {
  ts: number;
  who: string;
  what: string;
  from?: string;
  to?: string;
  source: string;
}

function buildEvents(d: Decision): Event[] {
  const evs: Event[] = [];
  evs.push({
    ts: d.createdAt,
    who: "Aan",
    what: "Detected the situation and drafted recommendation.",
    source: d.sourceRef.label,
  });
  if (d.status !== "open") {
    evs.push({
      ts: d.updatedAt,
      who: d.status === "with_aan" ? "Tushar" : "Tushar",
      what:
        d.status === "in_flight" ? "Approved. Aan executing."
        : d.status === "with_aan" ? "Delegated to Aan."
        : d.status === "rejected" ? "Rejected — Aan stood down."
        : d.status === "completed" ? "Marked completed."
        : d.status === "snoozed" ? `Snoozed${d.snoozedUntil ? " until " + new Date(d.snoozedUntil).toLocaleString() : ""}.`
        : "Status changed.",
      from: "open",
      to: d.status,
      source: "user",
    });
  }
  return evs;
}

export function AuditTrail({ decision, defaultOpen = false }: { decision: Decision; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const events = buildEvents(decision);
  return (
    <section>
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground hover:text-foreground"
      >
        {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        Audit trail · {events.length}
      </button>
      {open && (
        <ol className="mt-2 border-l border-border ml-1 pl-4 space-y-2.5">
          {events.map((e, i) => (
            <li key={i} className="relative text-[12px]">
              <span className="absolute -left-[19px] top-1.5 h-2 w-2 rounded-full bg-muted-foreground/60" />
              <div className="text-foreground/90">{e.what}</div>
              <div className="text-muted-foreground text-[11px]">
                {new Date(e.ts).toLocaleString()} · {e.who} · {e.source}
                {e.from && e.to ? ` · ${e.from} → ${e.to}` : ""}
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
