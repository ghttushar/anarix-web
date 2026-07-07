import { useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { AanMascot } from "@/components/aan/AanMascot";
import { AanEventCard } from "@/components/aan/autonomous/AanInboxCard";
import { ExecutionArtifact } from "@/components/aan/autonomous/ExecutionArtifact";
import { useAanEvents, AanEvent } from "@/components/aan/autonomous/AanEventsContext";
import { MeetingBundleCard } from "@/components/aan/autonomous/MeetingBundleCard";
import { MeetingBundleArtifact } from "@/components/aan/autonomous/MeetingBundleArtifact";
import { MeetingTaskBundle } from "@/data/mockMeetingTasks";
import { cn } from "@/lib/utils";

type FilterKey =
  | "all"
  | "approval"
  | "overnight"
  | "meetings"
  | "live"
  | "executing"
  | "done";

const KEPT_DOMAINS = new Set(["campaign", "retail", "profitability", "inventory"]);

type Channel = "overnight" | "meeting" | "live";

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/**
 * Deterministic channel mix for e-commerce alerts (Flow A):
 *  - Overnight (morning brief): created before 8am OR older than ~10h ago.
 *  - Live: everything else during the working day.
 * Meeting-originated tasks (Flow B) are a separate stream — they never
 * appear as "meeting" channel here.
 */
function inferChannel(e: AanEvent): Channel {
  const created = new Date(e.createdAt);
  const hour = created.getHours();
  const ageHours = (Date.now() - e.createdAt) / 3_600_000;
  if (hour < 8 || ageHours > 10) return "overnight";
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
  const { events, pendingCount, criticalCount, liveMode, clearFulfilled, meetingBundles, meetingPendingCount } = useAanEvents();
  const [detailFor, setDetailFor] = useState<AanEvent | null>(null);
  const [bundleDetailFor, setBundleDetailFor] = useState<MeetingTaskBundle | null>(null);
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
  const overnightCount = withChannel.filter((r) => r.channel === "overnight").length;
  const liveCount = withChannel.filter((r) => r.channel === "live").length;
  const executingCount = materialEvents.filter((e) => e.lifecycle === "executing").length;
  const doneCount = materialEvents.filter(
    (e) => e.lifecycle === "fulfilled" || e.lifecycle === "rejected"
  ).length;

  const filtered = useMemo(() => {
    return withChannel.filter(({ event: e, channel }) => {
      if (filter === "all") return true;
      if (filter === "approval")
        return ["awaiting_approval", "detected", "analyzing"].includes(e.lifecycle);
      if (filter === "overnight") return channel === "overnight";
      if (filter === "meetings") return channel === "meeting";
      if (filter === "live") return channel === "live";
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

  const tabs: { key: FilterKey; label: string; count: number; tone?: "critical" | "meeting" }[] = [
    { key: "all", label: "All", count: materialEvents.length },
    { key: "approval", label: "Needs approval", count: approvalCount, tone: "critical" },
    { key: "overnight", label: "Overnight", count: overnightCount },
    { key: "meetings", label: "Meetings", count: meetingPendingCount, tone: "meeting" },
    { key: "live", label: "Live", count: liveCount },
    { key: "executing", label: "Executing", count: executingCount },
    { key: "done", label: "Done", count: doneCount },
  ];

  return (
    <AppLayout>
      <AppTaskbar breadcrumbItems={[{ label: "Alerts" }]} />
      <div className="px-6 py-6 max-w-[1100px] mx-auto w-full">
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

        {/* Tabs */}
        <div className="mb-5 flex flex-wrap items-center gap-1.5">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={cn(
                "text-[12px] px-3 py-1.5 rounded-md border transition-colors",
                filter === t.key
                  ? "bg-primary/10 border-primary/30 text-primary font-medium"
                  : "bg-card border-border text-foreground hover:bg-muted"
              )}
            >
              {t.label}
              {t.count > 0 && (
                <span
                  className={cn(
                    "ml-1.5 text-[10px] font-semibold",
                    filter === t.key
                      ? "text-primary"
                      : t.tone === "critical"
                      ? "text-destructive"
                      : t.tone === "meeting"
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {t.count}
                </span>
              )}
            </button>
          ))}
          {doneCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto h-7 text-[10.5px] text-muted-foreground"
              onClick={clearFulfilled}
            >
              Clear completed
            </Button>
          )}
        </div>

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
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                      {bucket}
                    </span>
                    <span className="h-px flex-1 bg-border/60" />
                  </div>
                  <ol className="relative space-y-4 pl-6">
                    <span className="absolute left-[7px] top-1 bottom-1 w-px bg-border/60" aria-hidden />
                    {list.map(({ event: e, channel }) => (
                      <li key={e.eventId} className="relative">
                        <span
                          className={cn(
                            "absolute -left-[22px] top-4 h-2 w-2 rounded-full border border-border",
                            channel === "meeting" ? "bg-primary" : "bg-card"
                          )}
                        />
                        <div className="flex items-baseline gap-2 mb-1.5">
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {timeLabel(e.createdAt)}
                          </span>
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
      </div>

      {detailFor && <ExecutionArtifact event={detailFor} onClose={() => setDetailFor(null)} />}
    </AppLayout>
  );
}
