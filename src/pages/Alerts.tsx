import { useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { AanMascot } from "@/components/aan/AanMascot";
import { AanInboxCard } from "@/components/aan/autonomous/AanInboxCard";
import { MorningBriefingCard } from "@/components/aan/autonomous/MorningBriefingCard";
import { MeetingActionsCard } from "@/components/aan/autonomous/MeetingActionsCard";
import { ExecutionArtifact } from "@/components/aan/autonomous/ExecutionArtifact";
import { useAanEvents, AanEvent } from "@/components/aan/autonomous/AanEventsContext";
import { cn } from "@/lib/utils";

type FilterKey = "all" | "approval" | "executing" | "fulfilled" | "watching";

export default function AlertsPage() {
  const { events, pendingCount, criticalCount, liveMode, setLiveMode, clearFulfilled } = useAanEvents();
  const [detailFor, setDetailFor] = useState<AanEvent | null>(null);
  const [filter, setFilter] = useState<FilterKey>("all");

  const approval = useMemo(
    () => events.filter((e) => ["awaiting_approval", "detected", "analyzing"].includes(e.lifecycle) && e.scenario.severity !== "fyi"),
    [events]
  );
  const executing = useMemo(() => events.filter((e) => e.lifecycle === "executing"), [events]);
  const fulfilled = useMemo(() => events.filter((e) => e.lifecycle === "fulfilled" || e.lifecycle === "rejected"), [events]);
  const watching = useMemo(
    () => events.filter((e) => ["awaiting_approval", "detected", "analyzing"].includes(e.lifecycle) && e.scenario.severity === "fyi"),
    [events]
  );

  const filters: { key: FilterKey; label: string; count: number; tone?: "critical" }[] = [
    { key: "all", label: "All", count: events.length },
    { key: "approval", label: "Needs approval", count: approval.length, tone: "critical" },
    { key: "executing", label: "Executing", count: executing.length },
    { key: "fulfilled", label: "Fulfilled", count: fulfilled.length },
    { key: "watching", label: "Watching", count: watching.length },
  ];

  const showSection = (k: Exclude<FilterKey, "all">) => filter === "all" || filter === k;

  return (
    <AppLayout>
      <AppTaskbar breadcrumbItems={[{ label: "Alerts" }]} />
      <div className="p-6 max-w-[1400px] mx-auto">
        {/* Header */}
        <header className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="h-11 w-11 rounded-full bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center shrink-0">
              <AanMascot size={30} state={liveMode ? "listening" : "idle"} interactive={false} />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-primary">Aan · Autonomous Coworker</div>
              <h1 className="font-heading text-2xl font-semibold text-foreground">Alerts</h1>
              <p className="text-[13px] text-muted-foreground mt-1">
                {pendingCount} awaiting your approval
                {criticalCount > 0 && <span className="text-destructive"> · {criticalCount} critical</span>}
                {" · "}{fulfilled.length} executed today
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
        <div className="mb-5 flex flex-wrap gap-1.5">
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
        </div>

        {/* Two-column layout: briefing/context on left, action queues on right */}
        <div className="grid grid-cols-[380px_1fr] gap-6">
          {/* Left: Morning briefing + meeting actions */}
          <aside className="space-y-3">
            <SectionHeader label="Morning briefing" />
            <MorningBriefingCard />
            <MeetingActionsCard defaultOpen />
          </aside>

          {/* Right: action queues */}
          <ScrollArea className="h-[calc(100vh-260px)] pr-2">
            <div className="space-y-6">
              {showSection("approval") && (
                <Group label="Needs your approval" count={approval.length} tone="critical">
                  {approval.length === 0 ? (
                    <Empty text="Nothing waiting on you." />
                  ) : (
                    approval.map((e) => <AanInboxCard key={e.eventId} event={e} onOpenDetails={() => setDetailFor(e)} />)
                  )}
                </Group>
              )}

              {showSection("executing") && executing.length > 0 && (
                <Group label="Executing now" count={executing.length}>
                  {executing.map((e) => <AanInboxCard key={e.eventId} event={e} onOpenDetails={() => setDetailFor(e)} />)}
                </Group>
              )}

              {showSection("fulfilled") && (
                <Group
                  label="Recently fulfilled"
                  count={fulfilled.length}
                  action={fulfilled.length > 0 ? (
                    <Button variant="ghost" size="sm" className="h-6 text-[10.5px] text-muted-foreground" onClick={clearFulfilled}>
                      Clear history
                    </Button>
                  ) : undefined}
                >
                  {fulfilled.length === 0 ? (
                    <Empty text="No completed actions yet." />
                  ) : (
                    fulfilled.map((e) => <AanInboxCard key={e.eventId} event={e} onOpenDetails={() => setDetailFor(e)} />)
                  )}
                </Group>
              )}

              {showSection("watching") && watching.length > 0 && (
                <Group label="Watching" count={watching.length} muted>
                  {watching.map((e) => <AanInboxCard key={e.eventId} event={e} onOpenDetails={() => setDetailFor(e)} />)}
                </Group>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {detailFor && <ExecutionArtifact event={detailFor} onClose={() => setDetailFor(null)} />}
    </AppLayout>
  );
}

function SectionHeader({ label }: { label: string }) {
  return <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground px-1">{label}</div>;
}

function Group({
  label,
  count,
  tone,
  muted,
  action,
  children,
}: {
  label: string;
  count: number;
  tone?: "critical";
  muted?: boolean;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-2.5">
        <span className={cn("text-[11px] font-semibold uppercase tracking-wider", muted ? "text-muted-foreground/70" : "text-foreground/80")}>
          {label}
        </span>
        {count > 0 && (
          <span className={cn(
            "text-[10px] rounded-full px-1.5 py-0.5 font-medium",
            tone === "critical" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"
          )}>{count}</span>
        )}
        <div className="ml-auto">{action}</div>
      </div>
      <div className="space-y-2.5">{children}</div>
    </section>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="text-[12px] text-muted-foreground/70 italic px-1 py-3">{text}</div>;
}
