import { ArrowRight, ChevronDown, PenLine, XCircle } from "lucide-react";
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
import type { Decision } from "@/data/mockDecisions";
import { deriveAlternateActions } from "@/lib/decisions/deriveAlternateActions";

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
}

/**
 * Two-button action cluster used everywhere:
 *   [ Primary verb ▾ ]   [ Dismiss ]
 *
 * The dropdown carries alternate variants and the "Write custom action /
 * Discuss with Aan" option (opens the right-side Aan chat panel).
 */
export function ActionChoiceRow({ decision: d, handlers, layout = "horizontal", className, compact }: Props) {
  const alternates = deriveAlternateActions(d);
  const primaryVerb = d.actionVerb || "Approve";
  const btnH = compact ? "h-8" : "h-9";
  const btnText = compact ? "text-[12.5px]" : "text-[13px]";

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
          <ArrowRight className="h-3.5 w-3.5" />
          <span>{primaryVerb}</span>
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

      {/* Dismiss */}
      <Button
        size="sm"
        variant="outline"
        onClick={(e) => { e.stopPropagation(); handlers.reject(); }}
        className={cn(
          btnH, btnText,
          "gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive px-3",
          layout === "vertical" && "w-full justify-start",
        )}
      >
        <XCircle className="h-3.5 w-3.5" />
        <span>Dismiss</span>
      </Button>
    </div>
  );
}
