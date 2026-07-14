import { ChevronDown, PenLine, X, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Decision } from "@/livingos/data/mockDecisions";
import { deriveAlternateActions } from "@/livingos/lib/decisions/deriveAlternateActions";
import { useUndoFor } from "./useUndoFor";
import { CountdownRing } from "./CountdownRing";

export interface ActionHandlers {
  approve: () => void;
  approveVariant?: (id: string, label: string) => void;
  reject: () => void;
  /** Opens the right-side Aan chat panel for a custom instruction / discussion. */
  custom: () => void;
  viewMore?: () => void;
}

interface Props {
  decision: Decision;
  handlers: ActionHandlers;
  layout?: "horizontal" | "vertical";
  className?: string;
  compact?: boolean;
  /** Override for the id used to observe the inline undo bus (task rows use task.id). */
  undoTargetId?: string;
}

/**
 * Two-button action cluster used everywhere:
 *   [ Primary verb ▾ ]   [ Dismiss ]
 *
 * When the approve action is pending its 30s undo window, the primary
 * button swaps into an inline "Undo · Ns" pill (with countdown ring) and
 * Dismiss is hidden — replacing the floating toast on card surfaces.
 */
export function ActionChoiceRow({ decision: d, handlers, layout = "horizontal", className, compact, undoTargetId }: Props) {
  const alternates = deriveAlternateActions(d);
  const primaryVerb = d.actionVerb || "Approve";
  const btnH = compact ? "h-8" : "h-9";
  const btnText = compact ? "text-[12.5px]" : "text-[13px]";
  const undo = useUndoFor(undoTargetId ?? d.id);

  if (undo.active) {
    return (
      <div
        className={cn(
          layout === "horizontal" ? "flex items-center" : "flex flex-col",
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={(e) => { e.stopPropagation(); undo.undo(); }}
          className={cn(
            btnH, btnText,
            "inline-flex items-center gap-2 rounded-md border border-success/40 bg-success/10 text-success",
            "px-2.5 pr-3 font-medium hover:bg-success/15 transition-colors",
          )}
          title="Undo — reverts the approve action"
        >
          <CountdownRing pct={undo.pct} secs={undo.secondsLeft} size={compact ? 20 : 22} />
          <Undo2 className="h-3.5 w-3.5" />
          <span>Undo</span>
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        layout === "horizontal" ? "flex items-center gap-1.5" : "flex flex-col gap-2",
        className,
      )}
    >
      {/* Primary — split button */}
      <div className={cn("flex items-stretch", layout === "vertical" && "w-full")}>
        <Button
          size="sm"
          onClick={(e) => { e.stopPropagation(); handlers.approve(); }}
          className={cn(
            btnH, btnText,
            "gap-1.5 font-medium rounded-r-none pr-2.5 pl-3.5",
            layout === "vertical" && "flex-1 justify-start",
          )}
          title={`Run "${primaryVerb}" as proposed`}
        >
          <span>Action</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              onClick={(e) => e.stopPropagation()}
              className={cn(
                btnH, "px-1.5 rounded-l-none border-l border-primary-foreground/25",
              )}
              title="More ways to run this"
              aria-label="More action options"
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Choose how to run
            </DropdownMenuLabel>
            {alternates.map((alt) => (
              <DropdownMenuItem
                key={alt.id}
                onSelect={() => handlers.approveVariant?.(alt.id, alt.label) ?? handlers.approve()}
                className="flex flex-col items-start gap-0.5 py-2"
              >
                <span className="text-[13px] font-medium text-foreground">{alt.label}</span>
                {alt.hint && <span className="text-[11.5px] text-muted-foreground">{alt.hint}</span>}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={handlers.custom}
              className="flex items-center gap-2 py-2 text-primary focus:text-primary"
            >
              <PenLine className="h-3.5 w-3.5" />
              <div className="flex flex-col">
                <span className="text-[13px] font-medium">Write custom action / Discuss with Aan</span>
                <span className="text-[11.5px] text-muted-foreground">Chat opens in the side panel.</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Dismiss — icon only */}
      <Button
        size="icon"
        variant="ghost"
        onClick={(e) => { e.stopPropagation(); handlers.reject(); }}
        className={cn(
          btnH, "w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10",
          layout === "vertical" && "w-full",
        )}
        title="Dismiss"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

