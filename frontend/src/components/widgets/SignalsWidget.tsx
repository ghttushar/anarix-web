// Global Signals widget — floating pill on every authenticated screen.
// Replaces the Bell entry that used to live on the Floating Action Island.
// Hidden on /login, /onboarding, /alerts (page itself), /website, /mobile.
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bell, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { ActionsProvider, useActionsStore } from "@/state/actionsStore";
import { useViewport } from "@/contexts/ViewportContext";
import { importanceScore } from "@/lib/decisions/lifecycle";
import { formatValue } from "@/lib/decisions/valueFormat";
import { categorize } from "@/lib/decisions/categories";
import { filterByTab } from "@/components/actions/tabs";

const HIDDEN_PREFIXES = ["/login", "/onboarding", "/alerts", "/website", "/livingos", "/panels"];

function WidgetInner() {
  const { decisions } = useActionsStore();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const pool = useMemo(() => filterByTab(decisions, "all"), [decisions]);
  const groups = useMemo(() => categorize("all", pool), [pool]);
  const total = pool.length;
  const critical = pool.filter((d) => d.severity === "critical").length;
  const top = useMemo(
    () => [...pool].sort((a, b) => importanceScore(b) - importanceScore(a)).slice(0, 5),
    [pool],
  );

  if (total === 0) return null;

  return (
    <div className="fixed bottom-24 right-6 z-40">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            className={cn(
              "group flex items-center gap-2 h-10 pl-3 pr-4 rounded-full",
              "bg-card border border-border shadow-lg hover:shadow-xl transition-all",
              "hover:border-primary/50",
              critical > 0 && "border-destructive/50",
            )}
            aria-label={`${total} signals`}
          >
            <span className="relative flex items-center justify-center h-6 w-6">
              <Bell className={cn(
                "h-4 w-4",
                critical > 0 ? "text-destructive" : "text-foreground",
              )} />
              {critical > 0 && (
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-destructive animate-pulse" />
              )}
            </span>
            <span className="text-[12.5px] font-semibold text-foreground tabular-nums">
              {total}
            </span>
            <span className="text-[11.5px] text-muted-foreground">signals</span>
          </button>
        </PopoverTrigger>
        <PopoverContent
          side="top"
          align="end"
          className="w-[380px] p-0 border-border/70 shadow-2xl"
        >
          <div className="px-4 py-3 border-b border-border/60 flex items-baseline justify-between">
            <div>
              <div className="font-heading text-[14px] font-semibold text-foreground">Signals</div>
              <div className="text-[11.5px] text-muted-foreground mt-0.5">
                {total} open · {critical} critical
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              {groups.slice(0, 4).map((g) => (
                <span
                  key={g.key}
                  className="h-5 px-1.5 rounded-full bg-muted/60 tabular-nums"
                  title={g.label}
                >
                  {g.items.length}
                </span>
              ))}
            </div>
          </div>
          <div className="max-h-[320px] overflow-auto divide-y divide-border/40">
            {top.map((d) => {
              const val = formatValue({ cents: d.valueCents, kind: d.valueKind, cadence: d.cadence });
              const tone = d.valueKind === "gain" ? "text-success"
                : d.valueKind === "cost" ? "text-destructive"
                : d.valueKind === "at_risk" ? "text-warning" : "text-foreground/80";
              return (
                <button
                  key={d.id}
                  onClick={() => { setOpen(false); navigate("/alerts"); }}
                  className="w-full text-left px-4 py-2.5 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className={cn("font-heading text-[13px] font-semibold tabular-nums", tone)}>
                      {val.text}
                    </span>
                    <span className="text-[10.5px] uppercase tracking-widest text-muted-foreground shrink-0">
                      {d.domain}
                    </span>
                  </div>
                  <div className="mt-0.5 text-[12px] text-foreground/85 line-clamp-2">
                    {d.insight}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="px-3 py-2 border-t border-border/60 bg-muted/20">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => { setOpen(false); navigate("/alerts"); }}
              className="w-full h-8 text-[12.5px] gap-1.5 justify-center"
            >
              Open Signals
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function SignalsWidget() {
  const location = useLocation();
  const { view } = useViewport();
  if (view === "mobile") return null;
  if (HIDDEN_PREFIXES.some((p) => location.pathname.startsWith(p))) return null;
  return (
    <ActionsProvider>
      <WidgetInner />
    </ActionsProvider>
  );
}
