import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { getSourceMeta, type DecisionSource } from "@/lib/decisions/sourceRegistry";
import { cn } from "@/lib/utils";

interface Props {
  source: DecisionSource;
  /** Extra label appended to the tooltip: "Slack · #cs-urgent · 11:04" */
  refLabel?: string;
  size?: number;
  className?: string;
  /** When true, renders the source label next to the glyph. Used in the
   *  expanded panel so first-time users can learn what each glyph means. */
  withLabel?: boolean;
}

export function SourceGlyph({ source, refLabel, size = 18, className, withLabel = false }: Props) {
  const meta = getSourceMeta(source);
  const Icon = meta.icon;
  const tip = refLabel ? `${meta.label} · ${refLabel}` : meta.description;

  if (withLabel) {
    return (
      <span className={cn("inline-flex items-center gap-1.5 text-[12px] text-muted-foreground", className)}>
        <Icon size={size} className="text-muted-foreground" />
        <span className="font-medium text-foreground/80">{meta.label}</span>
      </span>
    );
  }

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn(
              "inline-flex items-center justify-center rounded-md bg-muted/50 border border-border/60 shrink-0 text-muted-foreground",
              className,
            )}
            style={{ width: size + 12, height: size + 12 }}
          >
            <Icon size={size} className="text-muted-foreground" />
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-[11px]">
          {tip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
