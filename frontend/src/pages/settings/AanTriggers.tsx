import { AppLayout } from "@/components/layout/AppLayout";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { SCENARIOS } from "@/data/mockAanScenarios";
import { useAanEvents } from "@/components/aan/autonomous/AanEventsContext";
import { useActivePanel } from "@/contexts/ActivePanelContext";
import { useAanPanel } from "@/contexts/AanPanelContext";
import { Zap, Copy, Radio, PanelRight, LayoutPanelTop } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AanTriggersPage() {
  const { fireScenario, liveMode, setLiveMode } = useAanEvents();
  const { setDataPanel } = useActivePanel();

  const fire = (id: string) => {
    fireScenario(id);
    setDataPanel("aan-inbox");
  };

  const copyTrigger = (id: string) => {
    navigator.clipboard?.writeText(`trigger ${id}`);
    toast.success(`Copied: trigger ${id}`);
  };

  return (
    <AppLayout>
      <AppTaskbar breadcrumbItems={[{ label: "Settings", href: "/settings/system" }, { label: "Aan Triggers" }]} />
      <div className="p-6 max-w-[1100px] mx-auto">
        <header className="mb-6">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-semibold text-primary">
            <Radio className="h-3 w-3" /> Dev / Demo Console
          </div>
          <h1 className="font-heading text-2xl font-semibold text-foreground mt-1">Aan Trigger Console</h1>
          <p className="text-[13px] text-muted-foreground mt-1 max-w-2xl">
            Fire any autonomous scenario on demand for demos, or turn on Live mode to let Aan drip-feed events in real time.
            Every scenario also runs when you type <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">trigger &lt;id&gt;</code> into Aan.
          </p>
          <div className="mt-4 flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
            <div className={cn("h-8 w-8 rounded-full flex items-center justify-center", liveMode ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
              <Radio className={cn("h-4 w-4", liveMode && "animate-pulse")} />
            </div>
            <div className="flex-1">
              <div className="text-[13px] font-medium text-foreground">Live mode</div>
              <div className="text-[11px] text-muted-foreground">Fires a fresh scenario every ~30s. Great for stakeholder demos where you want the app to feel alive.</div>
            </div>
            <Switch checked={liveMode} onCheckedChange={setLiveMode} />
          </div>
        </header>

        <div className="grid grid-cols-2 gap-3">
          {SCENARIOS.map((s) => (
            <div key={s.id} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[9px] uppercase tracking-wider font-semibold text-muted-foreground">{s.domain} · {s.severity}</div>
                  <div className="font-heading text-[13px] font-semibold text-foreground mt-0.5 line-clamp-2">{s.title}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{s.subtitle}</div>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] rounded bg-muted px-1.5 py-0.5 text-foreground/70">{s.impact}</span>
                <span className="text-[10px] text-muted-foreground">Confidence {s.confidence}%</span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Button size="sm" onClick={() => fire(s.id)} className="h-7 text-[11px]">
                  <Zap className="h-3 w-3 mr-1" />
                  Fire event
                </Button>
                <button
                  onClick={() => copyTrigger(s.id)}
                  className="inline-flex items-center gap-1 text-[10.5px] text-muted-foreground hover:text-primary"
                  title="Copy the chat trigger phrase"
                >
                  <Copy className="h-3 w-3" />
                  trigger {s.id}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
