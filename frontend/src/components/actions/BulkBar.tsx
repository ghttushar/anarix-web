import { useMemo } from "react";
import { CheckCircle2, ChevronDown, PenLine, X, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSelection } from "@/state/selectionStore";
import { useActionsStore } from "@/state/actionsStore";
import { valueMagnitude, formatValue } from "@/lib/decisions/valueFormat";

/** Docked bulk bar. Sits under the toolbar (not floating), matches TableToolbar style. */
export function BulkBar() {
  const { selected, clear } = useSelection();
  const { decisions, bulkApprove, delegateToAan, reject } = useActionsStore();

  const items = useMemo(
    () => decisions.filter((d) => selected.has(d.id) && d.status === "open"),
    [decisions, selected],
  );

  if (items.length < 1) return null;

  const totalCents = items.reduce((s, d) => s + valueMagnitude(d.valueKind, d.valueCents), 0);
  const totalFmt = totalCents > 0 ? formatValue({ cents: totalCents, kind: "gain" }).text.replace("+ ", "") : null;
  const ids = items.map((i) => i.id);

  return (
    <div
      role="toolbar"
      aria-label="Bulk actions"
      className="mb-3 flex flex-wrap items-center gap-2 rounded-md border border-primary/40 bg-primary/[0.05] px-3 py-2 animate-in fade-in slide-in-from-top-1 duration-150"
    >
      <div className="flex items-baseline gap-2">
        <span className="text-[13px] font-semibold text-foreground">
          {items.length} selected
        </span>
        {totalFmt && (
          <span className="text-[12.5px] font-mono text-success">total value {totalFmt}</span>
        )}
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        {/* Approve all — split */}
        <div className="flex items-stretch">
          <Button
            size="sm"
            onClick={() => { bulkApprove(ids); clear(); }}
            className="h-8 text-[12.5px] gap-1.5 rounded-r-none pr-2.5"
          >
            <CheckCircle2 className="h-3.5 w-3.5" /> Approve all
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="h-8 px-1.5 rounded-l-none border-l border-primary-foreground/25" aria-label="More">
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuItem onSelect={() => { bulkApprove(ids); clear(); }}>
                Approve all as-is
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => { ids.forEach(delegateToAan); clear(); }}
                className="flex flex-col items-start gap-0.5 py-2"
              >
                <span className="flex items-center gap-1.5"><PenLine className="h-3.5 w-3.5" /> Custom instruction for all</span>
                <span className="text-[11px] text-muted-foreground">I'll follow the note you leave in the panel.</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={() => { ids.forEach(reject); clear(); }}
          className="h-8 text-[12.5px] gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <XCircle className="h-3.5 w-3.5" /> Dismiss
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={clear}
          className="h-8 w-8 p-0 text-muted-foreground"
          title="Clear selection (Esc)"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
