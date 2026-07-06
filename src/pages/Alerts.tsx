import { useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { AanMascot } from "@/components/aan/AanMascot";
import { AanEventCard } from "@/components/aan/autonomous/AanInboxCard";
import { ExecutionArtifact } from "@/components/aan/autonomous/ExecutionArtifact";
import { useAanEvents, AanEvent } from "@/components/aan/autonomous/AanEventsContext";
import { cn } from "@/lib/utils";

type FilterKey = "all" | "approval" | "executing" | "done";

// Only the domains that matter operationally.
const KEPT_DOMAINS = new Set(["campaign", "retail", "profitability", "inventory"]);

type Channel = "overnight" | "meeting" | "live";

function inferChannel(e: AanEvent): Channel {
  // Deterministic-ish mapping so the demo always shows all three channels.
  const hour = new Date(e.createdAt).getHours();
  if (hour < 8) return "overnight";
  const seed = e.eventId.charCodeAt(e.eventId.length - 1);
  if (seed % 5 === 0) return "meeting";
  return "live";
}

const CHANNEL_LABEL: Record<Channel, string> = {
  overnight: "Overnight",
  meeting: "From meeting",
  live: "Live",
};

function bucketLabel(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) return "Today";
  const y = new Date(now);
  y.setDate(now.getDate() - 1);
  if (d.toDateString() === y.toDateString()) return "Yesterday";
  return "Earlier";
}

function timeLabel(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export default function AlertsPage() {
  const { events, pendingCount, criticalCount, liveMode, setLiveMode, clearFulfilled } = useAanEvents();
  const [detailFor, setDetailFor] = useState<AanEvent | null>(null);
  const [filter, setFilter] = useState<FilterKey>("all");

  // Keep only material domains (drop briefing/workspace).
  const materialEvents = useMemo(
    () => events.filter((e) => KEPT_DOMAINS.has(e.scenario.domain)),
    [events]
  );

  const approvalCount = materialEvents.filter((e) =>
    ["awaiting_approval", "detected", "analyzing"].includes(e.lifecycle)
  ).length;
  const executingCount = materialEvents.filter((e) => e.lifecycle === "executing").length;
  const doneCount = materialEvents.filter((e) => e.lifecycle === "fulfilled" || e.lifecycle === "rejected").length;

  const filtered = useMemo(() => {
    return materialEvents.filter((e) => {
      if (filter === "all") return true;
      if (filter === "approval") return ["awaiting_approval", "detected", "analyzing"].includes(e.lifecycle);
      if (filter === "executing") return e.lifecycle === "executing";
      if (filter === "done") return e.lifecycle === "fulfilled" || e.lifecycle === "rejected";
      return true;
    });
  }, [materialEvents, filter]);

  // Group by time bucket, most-recent-first.
  const grouped = useMemo(() => {
    const sorted = [...filtered].sort((a, b) => b.updatedAt - a.updatedAt);
    const map = new Map<string, AanEvent[]>();
    for (const e of sorted) {
      const b = bucketLabel(e.createdAt);
      if (!map.has(b)) map.set(b, []);
      map.get(b)!.push(e);
    }
    return Array.from(map.entries());
  }, [filtered]);

  const filters: { key: FilterKey; label: string; count: number; tone?: "critical" }[] = [
    { key: "all", label: "All", count: materialEvents.length },
    { key: "approval", label: "Needs approval", count: approvalCount, tone: "critical" },
    { key: "executing", label: "Executing", count: executingCount },
    { key: "done", label: "Done", count: doneCount },
  ];

  return (
    <AppLayout>
      <AppTaskbar breadcrumbItems={[{ label: "Alerts" }]} />
      <div className="p-6 max-w-[820px] mx-auto">
        {/* Header */}
        <header className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="h-11 w-11 rounded-full bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center shrink-0">
              <AanMascot size={30} state={liveMode ? "listening" : "idle"} interactive={false} />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-primary">Aan · Alerts</div>
              <h1 className="font-heading text-2xl font-semibold text-foreground">Aan's day</h1>
              <p className="text-[13px] text-muted-foreground mt-1">
                {pendingCount} awaiting approval
                {criticalCount > 0 && <span className="text-destructive"> · {criticalCount} critical</span>}
                {" · "}{doneCount} completed
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-[11px] text-muted-foreground cursor-pointer">
              <span>Live mode</span>
              <Switch checked={liveMode} onCheckedChange={setLiveMode} className="scale-90" />
            </label>
          </div>
        </header>

        {/* Filter pills */}
        <div className="mb-5 flex flex-wrap items-center gap-1.5">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "text-[12px] px-3 py-1.5 rounded-md border transition-colors",
                filter === f.key
                  ? "bg-primary/10 border-primary/30 text-primary font-medium"
                  : "bg-card border-border text-foreground hover:bg-muted"
              )}
            >
              {f.label}
              {f.count > 0 && (
                <span className={cn(
                  "ml-1.5 text-[10px] font-semibold",
                  filter === f.key ? "text-primary" : f.tone === "critical" ? "text-destructive" : "text-muted-foreground"
                )}>{f.count}</span>
              )}
            </button>
          ))}
          {doneCount > 0 && (
            <Button variant="ghost" size="sm" className="ml-auto h-7 text-[10.5px] text-muted-foreground" onClick={clearFulfilled}>
              Clear completed
            </Button>
          )}
        </div>

        {/* Timeline */}
        <ScrollArea className="h-[calc(100vh-260px)] pr-2">
          {grouped.length === 0 ? (
            <div className="py-16 text-center text-[13px] text-muted-foreground/70 italic">
              Nothing to show right now. Aan is watching.
            </div>
          ) : (
            <div className="space-y-8">
              {grouped.map(([bucket, list]) => (
                <section key={bucket}>
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">{bucket}</span>
                    <span className="h-px flex-1 bg-border/60" />
                  </div>
                  <ol className="relative space-y-3 pl-6">
                    {/* rail */}
                    <span className="absolute left-[7px] top-1 bottom-1 w-px bg-border/60" aria-hidden />
                    {list.map((e) => {
                      const channel = inferChannel(e);
                      return (
                        <li key={e.eventId} className="relative">
                          <span className="absolute -left-[22px] top-3 h-2 w-2 rounded-full bg-card border border-border" />
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-[10px] font-mono text-muted-foreground">{timeLabel(e.createdAt)}</span>
                          </div>
                          <AanEventCard
                            event={e}
                            channelLabel={CHANNEL_LABEL[channel]}
                            onOpenDetails={() => setDetailFor(e)}
                          />
                        </li>
                      );
                    })}
                  </ol>
                </section>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {detailFor && <ExecutionArtifact event={detailFor} onClose={() => setDetailFor(null)} />}
    </AppLayout>
  );
}
