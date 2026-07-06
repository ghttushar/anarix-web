import { useState, useMemo } from "react";
import { X, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { useActivePanel } from "@/contexts/ActivePanelContext";
import { useAanEvents, AanEvent } from "./AanEventsContext";
import { AanInboxCard } from "./AanInboxCard";
import { MorningBriefingCard } from "./MorningBriefingCard";
import { MeetingActionsCard } from "./MeetingActionsCard";
import { ExecutionArtifact } from "./ExecutionArtifact";
import { cn } from "@/lib/utils";
import { AanMascot } from "@/components/aan/AanMascot";

interface Props {
  /** When true, render outside the app shell (no close button, no border-l). Used by /panels routes. */
  standalone?: boolean;
  /** Pre-open a specific card (matches scenarioId). */
  focusScenarioId?: string;
  /** Show only the morning briefing section. */
  onlyMorning?: boolean;
  /** Show only the meeting-actions sub card. */
  onlyMeetingActions?: boolean;
}

type SectionKey = "morning" | "approval" | "executing" | "fulfilled" | "watching";

export function AanInboxPanel({ standalone = false, focusScenarioId, onlyMorning, onlyMeetingActions }: Props = {}) {
  const { dataPanel, closeDataPanel } = useActivePanel();
  const { events, pendingCount, liveMode, setLiveMode, clearFulfilled } = useAanEvents();
  const [detailFor, setDetailFor] = useState<AanEvent | null>(null);
  const [open, setOpen] = useState<Record<SectionKey, boolean>>({
    morning: true,
    approval: true,
    executing: false,
    fulfilled: false,
    watching: false,
  });
  const [showAllApproval, setShowAllApproval] = useState(false);

  if (!standalone && dataPanel !== "aan-inbox") return null;

  const approval = events.filter((e) => ["awaiting_approval", "detected", "analyzing"].includes(e.lifecycle) && e.scenario.severity !== "fyi");
  const executing = events.filter((e) => e.lifecycle === "executing");
  const fulfilled = events.filter((e) => e.lifecycle === "fulfilled" || e.lifecycle === "rejected");
  const watching = events.filter((e) => ["awaiting_approval", "detected", "analyzing"].includes(e.lifecycle) && e.scenario.severity === "fyi");

  const focusedEvent = useMemo(
    () => (focusScenarioId ? events.find((e) => e.scenarioId === focusScenarioId) ?? null : null),
    [focusScenarioId, events]
  );

  const APPROVAL_PREVIEW = 2;
  const approvalVisible = showAllApproval ? approval : approval.slice(0, APPROVAL_PREVIEW);

  const toggle = (key: SectionKey) => setOpen((o) => ({ ...o, [key]: !o[key] }));

  if (onlyMorning) {
    return (
      <div className="p-4">
        <MorningBriefingCard />
      </div>
    );
  }
  if (onlyMeetingActions) {
    return (
      <div className="p-4">
        <MeetingActionsCard defaultOpen />
      </div>
    );
  }

  return (
    <>
      <div
        data-app-panel="aan-inbox"
        className={cn(
          "flex h-full w-[380px] shrink-0 flex-col bg-background",
          !standalone && "border-l border-border"
        )}
      >
        {/* Header — single row only. Presence strip removed. */}
        <div className="border-b border-border shrink-0 px-3 py-3 flex items-center gap-2">
          <div className="relative h-8 w-8 rounded-full bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center shrink-0">
            <AanMascot size={22} state={liveMode ? "listening" : "idle"} interactive={false} />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-heading text-[15px] font-semibold text-foreground truncate">Aan Inbox</h2>
            <p className="text-[11px] text-muted-foreground truncate">
              {pendingCount} awaiting · {fulfilled.length} executed today
            </p>
          </div>
          <label className="flex items-center gap-1.5 text-[10px] text-muted-foreground cursor-pointer shrink-0">
            <span>Live</span>
            <Switch checked={liveMode} onCheckedChange={setLiveMode} className="scale-75 origin-right" />
          </label>
          {!standalone && (
            <Button variant="ghost" size="icon" onClick={closeDataPanel} className="h-7 w-7 shrink-0" title="Close inbox">
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>

        <ScrollArea className="flex-1 min-h-0">
          <div className="p-3 space-y-3">
            {/* MORNING */}
            <Section
              label="Morning briefing"
              count={null}
              open={open.morning}
              onToggle={() => toggle("morning")}
            >
              <MorningBriefingCard />
              <MeetingActionsCard />
            </Section>

            {/* NEEDS APPROVAL */}
            <Section
              label="Needs your approval"
              count={approval.length}
              tone="critical"
              open={open.approval}
              onToggle={() => toggle("approval")}
            >
              {approval.length === 0 && <EmptyLine text="Nothing waiting on you." />}
              <div className="space-y-2.5">
                {approvalVisible.map((evt) => (
                  <AanInboxCard
                    key={evt.eventId}
                    event={evt}
                    onOpenDetails={() => setDetailFor(evt)}
                    defaultOpen={focusScenarioId === evt.scenarioId}
                  />
                ))}
                {approval.length > APPROVAL_PREVIEW && (
                  <button
                    onClick={() => setShowAllApproval((v) => !v)}
                    className="w-full text-[11px] text-primary hover:underline py-1.5"
                  >
                    {showAllApproval ? "Show fewer" : `Show ${approval.length - APPROVAL_PREVIEW} more`}
                  </button>
                )}
              </div>
            </Section>

            {/* EXECUTING */}
            {executing.length > 0 && (
              <Section
                label="Executing now"
                count={executing.length}
                open={open.executing}
                onToggle={() => toggle("executing")}
              >
                <div className="space-y-2.5">
                  {executing.map((evt) => (
                    <AanInboxCard key={evt.eventId} event={evt} onOpenDetails={() => setDetailFor(evt)} />
                  ))}
                </div>
              </Section>
            )}

            {/* FULFILLED */}
            <Section
              label="Recently fulfilled"
              count={fulfilled.length}
              open={open.fulfilled}
              onToggle={() => toggle("fulfilled")}
            >
              {fulfilled.length === 0 && <EmptyLine text="No completed actions yet." />}
              <div className="space-y-2.5">
                {fulfilled.map((evt) => (
                  <AanInboxCard key={evt.eventId} event={evt} onOpenDetails={() => setDetailFor(evt)} />
                ))}
                {fulfilled.length > 0 && (
                  <button onClick={clearFulfilled} className="w-full text-[10.5px] text-muted-foreground hover:text-foreground py-1">
                    Clear executed history
                  </button>
                )}
              </div>
            </Section>

            {/* WATCHING */}
            {watching.length > 0 && (
              <Section
                label="Watching"
                count={watching.length}
                muted
                open={open.watching}
                onToggle={() => toggle("watching")}
              >
                <div className="space-y-2.5">
                  {watching.map((evt) => (
                    <AanInboxCard key={evt.eventId} event={evt} onOpenDetails={() => setDetailFor(evt)} />
                  ))}
                </div>
              </Section>
            )}
          </div>
        </ScrollArea>
      </div>
      {(detailFor || focusedEvent) && (
        <ExecutionArtifact event={(detailFor ?? focusedEvent)!} onClose={() => setDetailFor(null)} />
      )}
    </>
  );
}

function Section({
  label,
  count,
  tone,
  muted,
  open,
  onToggle,
  children,
}: {
  label: string;
  count: number | null;
  tone?: "critical";
  muted?: boolean;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-2 py-1.5 text-left"
      >
        {open ? (
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        )}
        <span
          className={cn(
            "text-[11px] font-semibold uppercase tracking-wider",
            muted ? "text-muted-foreground/70" : "text-foreground/80"
          )}
        >
          {label}
        </span>
        {count !== null && count > 0 && (
          <span
            className={cn(
              "text-[10px] rounded-full px-1.5 py-0.5 font-medium shrink-0",
              tone === "critical" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"
            )}
          >
            {count}
          </span>
        )}
      </button>
      {open && <div className="mt-2 space-y-2.5">{children}</div>}
    </div>
  );
}

function EmptyLine({ text }: { text: string }) {
  return <div className="text-[11.5px] text-muted-foreground/70 italic pl-5">{text}</div>;
}
