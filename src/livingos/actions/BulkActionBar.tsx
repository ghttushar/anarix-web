import { useEffect, useMemo } from "react";
import { CheckCircle2, Sparkles, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelection } from "@/state/selectionStore";
import { useActionsStore } from "@/livingos/state/actionsStore";
import { valueMagnitude, formatValue } from "@/livingos/lib/decisions/valueFormat";
import { SnoozeMenu } from "./SnoozeMenu";

/**
 * Floating bulk action bar. Appears when 2+ decisions are selected on Decide.
 * Sits pinned to the bottom of the viewport, above any global chrome.
 */
export function BulkActionBar() {
  const { selected, clear } = useSelection();
  const { decisions, bulkApprove, delegateToAan, snooze } = useActionsStore();

  const items = useMemo(
    () => decisions.filter((d) => selected.has(d.id) && d.status === "open"),
    [decisions, selected],
  );

  const totalCents = items.reduce((s, d) => s + valueMagnitude(d.valueKind, d.valueCents), 0);
  const totalFmt = totalCents > 0 ? formatValue({ cents: totalCents, kind: "gain" }).text.replace("+ ", "") : null;
  const sourceCount = new Set(items.map((d) => d.source)).size;

  // Escape clears selection.
  useEffect(() => {
    if (items.length === 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") clear();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [items.length, clear]);

  if (items.length < 2) return null;

  return (
    <div
      role="toolbar"
      aria-label="Bulk actions"
      className="fixed left-1/2 bottom-6 -translate-x-1/2 z-50 flex items-center gap-2 rounded-xl border border-primary/30 bg-card shadow-lg px-3 py-2 animate-in fade-in slide-in-from-bottom-4 duration-150"
    >
      <div className="flex flex-col text-left pr-2 border-r border-border/60">
        <span className="text-[13px] font-semibold text-foreground">
          {items.length} selected {totalFmt && <span className="text-success font-mono">· {totalFmt}</span>}
        </span>
        <span className="text-[10.5px] text-muted-foreground">
          {sourceCount} source{sourceCount === 1 ? "" : "s"} · 30-second undo on all
        </span>
      </div>

      <Button
        size="sm"
        onClick={() => { bulkApprove(items.map((i) => i.id)); clear(); }}
        className="h-8 text-[12px] gap-1.5"
      >
        <CheckCircle2 className="h-3.5 w-3.5" /> Approve {items.length}
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={() => { items.forEach((i) => delegateToAan(i.id)); clear(); }}
        className="h-8 text-[12px] gap-1.5"
      >
        <Sparkles className="h-3.5 w-3.5" /> You take care of all
      </Button>

      <SnoozeMenu onSelect={(c) => { items.forEach((i) => snooze(i.id, c)); clear(); }} />

      <Button size="sm" variant="ghost" onClick={clear} className="h-8 w-8 p-0 text-muted-foreground" title="Clear selection (Esc)">
        <X className="h-4 w-4" />
      </Button>

      <span className="hidden lg:flex items-center gap-1 text-[10px] text-muted-foreground pl-2 border-l border-border/60 ml-1">
        <Clock className="h-3 w-3" /> press <kbd className="rounded border border-border px-1 font-mono">a</kbd> to approve
      </span>
    </div>
  );
}
