import { useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AanMascot } from "@/components/aan/AanMascot";
import { FEED_ENTRIES, CONNECTED_SYSTEMS, FeedEntry } from "@/data/mockAanFeed";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Ear, Eye, Sparkles, Zap, Coffee, MessageSquare, Wrench, Video, Activity, ChevronDown } from "lucide-react";
import { useAanEvents } from "@/components/aan/autonomous/AanEventsContext";
import { AAN_PRESENCE_MESSAGES } from "@/components/aan/autonomous/AanEventsContext";


const kindMeta: Record<FeedEntry["kind"], { icon: any; color: string; label: string }> = {
  briefing: { icon: Coffee, color: "text-primary", label: "Prepared" },
  listened: { icon: Ear, color: "text-muted-foreground", label: "Listening" },
  attended: { icon: Video, color: "text-primary", label: "Attending" },
  detected: { icon: Eye, color: "text-destructive", label: "Detected" },
  recommended: { icon: Sparkles, color: "text-success", label: "Recommended" },
  executed: { icon: Zap, color: "text-primary", label: "Executed" },
  policy: { icon: Wrench, color: "text-primary", label: "Policy" },
  captured: { icon: MessageSquare, color: "text-primary", label: "Captured" },
};

export default function AanFeedPage() {
  const navigate = useNavigate();
  const { presenceIndex, liveMode } = useAanEvents();
  const [showAmbient, setShowAmbient] = useState(false);

  const materialEntries = useMemo(
    () => FEED_ENTRIES.filter((e) => (e.importance ?? "material") === "material"),
    []
  );
  const ambientCount = FEED_ENTRIES.length - materialEntries.length;
  const visibleEntries = showAmbient ? FEED_ENTRIES : materialEntries;


  return (
    <AppLayout>
      <AppTaskbar
        breadcrumbItems={[{ label: "Aan", href: "/aan" }, { label: "Feed" }]}
      />
      <div className="p-6 max-w-[1200px] mx-auto">
        <header className="mb-6 flex items-start gap-4">
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <AanMascot size={42} state={liveMode ? "listening" : "idle"} interactive={false} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] uppercase tracking-wider font-semibold text-primary">Aan Feed · Today</div>
            <h1 className="font-heading text-2xl font-semibold text-foreground">Aan's day</h1>
            <p className="text-[13px] text-muted-foreground mt-1">
              A chronological log of everything Aan attended, listened to, detected, recommended, and executed today.
            </p>
            <div className="mt-2 inline-flex items-center gap-2 text-[11px] text-foreground/80 rounded-full bg-primary/5 border border-primary/20 px-3 py-1">
              <Activity className="h-3 w-3 text-primary" />
              <span>{AAN_PRESENCE_MESSAGES[presenceIndex]}</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-[1fr_320px] gap-6">
          {/* Timeline */}
          <div className="bg-card rounded-lg border border-border">
            <div className="px-4 py-3 border-b border-border">
              <h2 className="font-heading text-sm font-semibold">Timeline</h2>
            </div>
            <ScrollArea className="h-[calc(100vh-260px)]">
              <ol className="p-4 space-y-0">
                {FEED_ENTRIES.map((entry, i) => {
                  const meta = kindMeta[entry.kind];
                  const Icon = meta.icon;
                  return (
                    <li key={entry.id} className="relative pl-8 pb-4">
                      {i < FEED_ENTRIES.length - 1 && (
                        <span className="absolute left-3 top-6 bottom-0 w-px bg-border" />
                      )}
                      <div className={cn("absolute left-0 top-1 h-6 w-6 rounded-full bg-muted flex items-center justify-center", meta.color)}>
                        <Icon className="h-3 w-3" />
                      </div>
                      <div className="flex items-baseline gap-2 mb-0.5">
                        <span className="text-[10px] font-mono text-muted-foreground">{entry.time}</span>
                        <span className={cn("text-[9px] uppercase tracking-wider font-semibold", meta.color)}>{meta.label}</span>
                        {entry.source && <span className="text-[9px] text-muted-foreground">· {entry.source}</span>}
                      </div>
                      <div className="text-[13px] text-foreground font-medium">{entry.headline}</div>
                      {entry.detail && <div className="text-[11.5px] text-muted-foreground mt-0.5">{entry.detail}</div>}
                      {entry.scenarioId && (
                        <button
                          onClick={() => navigate("/advertising/rules/applied")}
                          className="mt-1 text-[10px] text-primary hover:underline"
                        >
                          View linked artifact →
                        </button>
                      )}
                    </li>
                  );
                })}
              </ol>
            </ScrollArea>
          </div>

          {/* Connected Systems */}
          <aside className="space-y-4">
            <div className="bg-card rounded-lg border border-border p-4">
              <h2 className="font-heading text-sm font-semibold mb-3">Connected Systems</h2>
              <p className="text-[11px] text-muted-foreground mb-3">
                Aan pulls context from every connected system. Green pulse = actively reading right now.
              </p>
              <ul className="space-y-1.5">
                {CONNECTED_SYSTEMS.map((sys) => (
                  <li key={sys.id} className="flex items-center gap-2 text-[12px]">
                    <span className="relative flex h-2 w-2 shrink-0">
                      {sys.pulse && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />}
                      <span className={cn("relative inline-flex h-2 w-2 rounded-full", sys.status === "active" ? "bg-success" : "bg-muted-foreground/40")} />
                    </span>
                    <span className="text-foreground/80 flex-1">{sys.name}</span>
                    <span className="text-[9px] uppercase tracking-wider text-muted-foreground">{sys.status}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-card rounded-lg border border-border p-4">
              <h2 className="font-heading text-sm font-semibold mb-2">How Aan works</h2>
              <p className="text-[11.5px] text-muted-foreground leading-relaxed">
                Aan is an autonomous coworker, not a chatbot. It attends your meetings, watches your channels,
                and quietly correlates that context with your live business data. It never acts without your
                approval — unless you save a decision as a policy.
              </p>
              <button onClick={() => navigate("/aan/policies")} className="mt-3 text-[11px] text-primary hover:underline">
                Review automation policies →
              </button>
            </div>
          </aside>
        </div>
      </div>
    </AppLayout>
  );
}
