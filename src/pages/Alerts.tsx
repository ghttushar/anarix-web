import { useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { AanMascot } from "@/components/aan/AanMascot";
import { AanEventCard } from "@/components/aan/autonomous/AanInboxCard";
import { ExecutionArtifact } from "@/components/aan/autonomous/ExecutionArtifact";
import { useAanEvents, AanEvent } from "@/components/aan/autonomous/AanEventsContext";
import { cn } from "@/lib/utils";

type FilterKey = "all" | "approval" | "meetings" | "executing" | "done";

const KEPT_DOMAINS = new Set(["campaign", "retail", "profitability", "inventory"]);

type Channel = "overnight" | "meeting" | "live";

function inferChannel(e: AanEvent): Channel {
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

const CHANNEL_LEGEND: { key: Channel; label: string; dot: string; hint: string }[] = [
  { key: "overnight", label: "Overnight", dot: "bg-muted-foreground", hint: "Detected while you were away" },
  { key: "meeting", label: "From meeting", dot: "bg-primary", hint: "Captured from calls & threads" },
  { key: "live", label: "Live", dot: "bg-success", hint: "Real-time signals during your day" },
];

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
  const { events, pendingCount, criticalCount, liveMode, clearFulfilled } = useAanEvents();
  const [detailFor, setDetailFor] = useState<AanEvent | null>(null);
  const [filter, setFilter] = useState<FilterKey>("all");

  const materialEvents = useMemo(
    () => events.filter((e) => KEPT_DOMAINS.has(e.scenario.domain)),
    [events]
  );

  const withChannel = useMemo(
    () => materialEvents.map((e) => ({ event: e, channel: inferChannel(e) })),
    [materialEvents]
  );

  const approvalCount = materialEvents.filter((e) =>
    ["awaiting_approval", "detected", "analyzing"].includes(e.lifecycle)
  ).length;
  const meetingCount = withChannel.filter((r) => r.channel === "meeting").length;
  const executingCount = materialEvents.filter((e) => e.lifecycle === "executing").length;
  const doneCount = materialEvents.filter((e) => e.lifecycle === "fulfilled" || e.lifecycle === "rejected").length;

  const filtered = useMemo(() => {
    return withChannel.filter(({ event: e, channel }) => {
      if (filter === "all") return true;
      if (filter === "approval") return ["awaiting_approval", "detected", "analyzing"].includes(e.lifecycle);
      if (filter === "meetings") return channel === "meeting";
      if (filter === "executing") return e.lifecycle === "executing";
      if (filter === "done") return e.lifecycle === "fulfilled" || e.lifecycle === "rejected";
      return true;
    });
  }, [withChannel, filter]);

  const grouped = useMemo(() => {
    const sorted = [...filtered].sort((a, b) => b.event.updatedAt - a.event.updatedAt);
    const map = new Map<string, typeof sorted>();
    for (const r of sorted) {
      const b = bucketLabel(r.event.createdAt);
      if (!map.has(b)) map.set(b, []);
      map.get(b)!.push(r);
    }
    return Array.from(map.entries());
  }, [filtered]);

  const filters: { key: FilterKey; label: string; count: number; tone?: "critical" | "meeting" }[] = [
    { key: "all", label: "All", count: materialEvents.length },
    { key: "approval", label: "Needs approval", count: approvalCount, tone: "critical" },
    { key: "meetings", label: "Meetings", count: meetingCount, tone: "meeting" },
    { key: "executing", label: "Executing", count: executingCount },
    { key: "done", label: "Done", count: doneCount },
  ];

  const upNext = useMemo(
    () =>
      withChannel
        .filter((r) => ["awaiting_approval", "detected", "analyzing"].includes(r.event.lifecycle))
        .sort((a, b) => {
          const sev = (x: AanEvent) => (x.scenario.severity === "critical" ? 0 : x.scenario.severity === "opportunity" ? 1 : 2);
          return sev(a.event) - sev(b.event) || b.event.updatedAt - a.event.updatedAt;
        })
        .slice(0, 3),
    [withChannel]
  );

  return (
    <AppLayout>
      <AppTaskbar breadcrumbItems={[{ label: "Alerts" }]} />
      <div className="px-6 py-6 max-w-[1400px] mx-auto w-full">
        {/* Header */}
        <header className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="h-11 w-11 rounded-full bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center shrink-0">
              <AanMascot size={30} state={liveMode ? "listening" : "idle"} interactive={false} />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-primary">Alerts</div>
              <h1 className="font-heading text-2xl font-semibold text-foreground">What Aan noticed for you</h1>
              <p className="text-[13px] text-muted-foreground mt-1">
                {pendingCount} awaiting approval
                {criticalCount > 0 && <span className="text-destructive"> · {criticalCount} critical</span>}
                {" · "}{doneCount} completed
                {liveMode && <span className="text-success"> · Live</span>}
              </p>
            </div>
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
                  filter === f.key ? "text-primary" :
                    f.tone === "critical" ? "text-destructive" :
                    f.tone === "meeting" ? "text-primary" :
                    "text-muted-foreground"
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

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          {/* Timeline */}
          <ScrollArea className="h-[calc(100vh-260px)] pr-4">
            {grouped.length === 0 ? (
              <div className="py-16 text-center text-[13px] text-muted-foreground/70 italic">
                Nothing to show right now. Aan is watching.
              </div>
            ) : (
              <div className="space-y-10">
                {grouped.map(([bucket, list]) => (
                  <section key={bucket}>
                    <div className="mb-4 flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">{bucket}</span>
                      <span className="h-px flex-1 bg-border/60" />
                    </div>
                    <ol className="relative space-y-4 pl-6">
                      <span className="absolute left-[7px] top-1 bottom-1 w-px bg-border/60" aria-hidden />
                      {list.map(({ event: e, channel }) => (
                        <li key={e.eventId} className="relative">
                          <span className={cn(
                            "absolute -left-[22px] top-4 h-2 w-2 rounded-full border border-border",
                            channel === "meeting" ? "bg-primary" : "bg-card"
                          )} />
                          <div className="flex items-baseline gap-2 mb-1.5">
                            <span className="text-[10px] font-mono text-muted-foreground">{timeLabel(e.createdAt)}</span>
                          </div>
                          <AanEventCard
                            event={e}
                            channel={channel}
                            channelLabel={CHANNEL_LABEL[channel]}
                            onOpenDetails={() => setDetailFor(e)}
                          />
                        </li>
                      ))}
                    </ol>
                  </section>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Summary rail */}
          <aside className="hidden lg:block">
            <div className="sticky top-4 space-y-4">
              <div className="rounded-lg border border-border bg-card p-4">
                <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-3">Today at a glance</div>
                <div className="grid grid-cols-2 gap-3">
                  <Stat label="Pending" value={pendingCount} tone={criticalCount > 0 ? "critical" : "default"} />
                  <Stat label="Critical" value={criticalCount} tone="critical" />
                  <Stat label="Executing" value={executingCount} tone="primary" />
                  <Stat label="Completed" value={doneCount} tone="success" />
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-4">
                <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-3">Up next</div>
                {upNext.length === 0 ? (
                  <div className="text-[12px] text-muted-foreground italic">Nothing needs you right now.</div>
                ) : (
                  <ul className="space-y-2.5">
                    {upNext.map(({ event: e, channel }) => (
                      <li key={e.eventId}>
                        <button
                          onClick={() => setDetailFor(e)}
                          className="w-full text-left group"
                        >
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className={cn(
                              "h-1.5 w-1.5 rounded-full shrink-0",
                              channel === "meeting" ? "bg-primary" :
                                e.scenario.severity === "critical" ? "bg-destructive" :
                                e.scenario.severity === "opportunity" ? "bg-success" : "bg-muted-foreground"
                            )} />
                            <span className="text-[9.5px] uppercase tracking-wider font-semibold text-muted-foreground">
                              {CHANNEL_LABEL[channel]}
                            </span>
                          </div>
                          <div className="text-[12.5px] text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                            {e.scenario.title}
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="rounded-lg border border-border bg-card p-4">
                <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-3">Channels</div>
                <ul className="space-y-2">
                  {CHANNEL_LEGEND.map((c) => (
                    <li key={c.key} className="flex items-start gap-2">
                      <span className={cn("mt-1.5 h-1.5 w-1.5 rounded-full shrink-0", c.dot)} />
                      <div>
                        <div className="text-[12px] font-medium text-foreground">{c.label}</div>
                        <div className="text-[10.5px] text-muted-foreground">{c.hint}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {detailFor && <ExecutionArtifact event={detailFor} onClose={() => setDetailFor(null)} />}
    </AppLayout>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: "critical" | "primary" | "success" | "default" }) {
  return (
    <div>
      <div className={cn(
        "font-heading text-xl font-semibold",
        tone === "critical" && value > 0 ? "text-destructive" :
          tone === "primary" && value > 0 ? "text-primary" :
          tone === "success" && value > 0 ? "text-success" :
          "text-foreground"
      )}>{value}</div>
      <div className="text-[10.5px] uppercase tracking-wider font-medium text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}
