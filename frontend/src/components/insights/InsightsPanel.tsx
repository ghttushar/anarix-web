import { X, AlertTriangle, AlertCircle, CheckCircle2, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useInsights } from "./InsightsContext";
import { InsightCard } from "./InsightCard";
import { useAan } from "@/components/aan/AanContext";

export function InsightsPanel() {
  const { isOpen, closePanel, insights, criticalCount, attentionCount, positiveCount } = useInsights();
  const { openCopilot, setPendingPrompt, setContext } = useAan();

  const criticalInsights = insights.filter((i) => i.category === "critical");
  const attentionInsights = insights.filter((i) => i.category === "attention");
  const positiveInsights = insights.filter((i) => i.category === "positive");

  const handleActionClick = (actionText: string) => {
    setContext({ page: "Insights" });
    setPendingPrompt(`I want to take action on: ${actionText}`);
    openCopilot();
  };

  if (!isOpen) return null;

  return (
    <div data-app-panel="insights" className="flex h-full w-[320px] shrink-0 flex-col border-l border-border bg-background">
      <div className="border-b border-border shrink-0">
        <div className="flex items-center justify-between px-3 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Lightbulb className="h-3.5 w-3.5 text-primary" />
            </div>
            <div>
              <h2 className="font-heading text-sm font-semibold text-foreground">Insights</h2>
              <p className="text-[10px] text-muted-foreground">{criticalCount + attentionCount + positiveCount} active</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={closePanel} className="h-7 w-7" title="Close insights">
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="flex items-center gap-2 border-t border-border/50 bg-muted/30 px-3 py-1.5">
          <div className="flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px]">
            <AlertTriangle className="h-2.5 w-2.5 text-destructive" />
            <span className="font-medium text-destructive">{criticalCount}</span>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-warning/10 px-2 py-0.5 text-[10px]">
            <AlertCircle className="h-2.5 w-2.5 text-warning" />
            <span className="font-medium text-warning">{attentionCount}</span>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px]">
            <CheckCircle2 className="h-2.5 w-2.5 text-success" />
            <span className="font-medium text-success">{positiveCount}</span>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="space-y-4 p-3">
          {criticalInsights.length > 0 && (
            <section>
              <div className="mb-2 flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                <h3 className="text-xs font-semibold text-destructive">Critical Alerts</h3>
              </div>
              <div className="space-y-2">
                {criticalInsights.map((insight) => <InsightCard key={insight.id} insight={insight} onActionClick={handleActionClick} />)}
              </div>
            </section>
          )}
          {attentionInsights.length > 0 && (
            <section>
              <div className="mb-2 flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5 text-warning" />
                <h3 className="text-xs font-semibold text-warning">Worth a Look</h3>
              </div>
              <div className="space-y-2">
                {attentionInsights.map((insight) => <InsightCard key={insight.id} insight={insight} onActionClick={handleActionClick} />)}
              </div>
            </section>
          )}
          {positiveInsights.length > 0 && (
            <section>
              <div className="mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                <h3 className="text-xs font-semibold text-success">Wins & Highlights</h3>
              </div>
              <div className="space-y-2">
                {positiveInsights.map((insight) => <InsightCard key={insight.id} insight={insight} onActionClick={handleActionClick} />)}
              </div>
            </section>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
