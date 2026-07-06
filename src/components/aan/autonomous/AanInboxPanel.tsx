import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { useActivePanel } from "@/contexts/ActivePanelContext";
import { useAanEvents, AanEvent } from "./AanEventsContext";
import { AanInboxCard } from "./AanInboxCard";
import { AanPresenceStrip } from "./AanPresenceStrip";
import { MorningBriefingCard } from "./MorningBriefingCard";
import { ExecutionArtifact } from "./ExecutionArtifact";
import { cn } from "@/lib/utils";
import { AanMascot } from "@/components/aan/AanMascot";

type Filter = "all" | "critical" | "opportunity" | "fyi" | "executed";

export function AanInboxPanel() {
  const { dataPanel, closeDataPanel } = useActivePanel();
  const { events, pendingCount, liveMode, setLiveMode, clearFulfilled } = useAanEvents();
  const [filter, setFilter] = useState<Filter>("all");
  const [detailFor, setDetailFor] = useState<AanEvent | null>(null);

  if (dataPanel !== "aan-inbox") return null;

  const pending = events.filter((e) => e.lifecycle !== "fulfilled" && e.lifecycle !== "rejected");
  const executed = events.filter((e) => e.lifecycle === "fulfilled" || e.lifecycle === "rejected");

  const filtered = useMemo(() => {
    if (filter === "executed") return executed;
    if (filter === "all") return pending;
    return pending.filter((e) => e.scenario.severity === filter);
  }, [filter, pending, executed]);

  return (
    <>
      <div data-app-panel="aan-inbox" className="flex h-full w-[380px] shrink-0 flex-col border-l border-border bg-background">
        <div className="border-b border-border shrink-0">
          <div className="flex items-center justify-between px-3 py-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="relative h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0">
                <AanMascot size={22} state={liveMode ? "listening" : "idle"} interactive={false} />
              </div>
              <div className="min-w-0">
                <h2 className="font-heading text-sm font-semibold text-foreground truncate">Aan Inbox</h2>
                <p className="text-[10px] text-muted-foreground">
                  {pendingCount} awaiting approval · {executed.length} executed today
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={closeDataPanel} className="h-7 w-7 shrink-0" title="Close inbox">
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
          <AanPresenceStrip />
          <div className="flex items-center gap-1 px-3 py-2 border-t border-border/50 overflow-x-auto no-scrollbar">
            {(["all", "critical", "opportunity", "fyi", "executed"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "shrink-0 rounded-full px-2.5 py-1 text-[10.5px] font-medium capitalize transition-colors",
                  filter === f
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                {f}
                {f === "all" && pending.length > 0 && <span className="ml-1 opacity-70">{pending.length}</span>}
                {f === "executed" && executed.length > 0 && <span className="ml-1 opacity-70">{executed.length}</span>}
              </button>
            ))}
            <label className="ml-auto flex items-center gap-1.5 text-[10px] text-muted-foreground cursor-pointer shrink-0">
              <span>Live</span>
              <Switch checked={liveMode} onCheckedChange={setLiveMode} className="scale-75 origin-right" />
            </label>
          </div>
        </div>

        <ScrollArea className="flex-1 min-h-0">
          <div className="p-3 space-y-2.5">
            {filter === "all" && <MorningBriefingCard />}
            {filtered.length === 0 && (
              <div className="text-center py-10 text-[11px] text-muted-foreground">
                Nothing here right now. Aan is watching.
              </div>
            )}
            {filtered.map((evt) => (
              <AanInboxCard key={evt.eventId} event={evt} onOpenDetails={() => setDetailFor(evt)} />
            ))}
            {filter === "executed" && executed.length > 0 && (
              <button onClick={clearFulfilled} className="w-full text-[10px] text-muted-foreground hover:text-foreground py-2">
                Clear executed history
              </button>
            )}
          </div>
        </ScrollArea>
      </div>
      {detailFor && <ExecutionArtifact event={detailFor} onClose={() => setDetailFor(null)} />}
    </>
  );
}
