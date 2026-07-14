import { cn } from "@/lib/utils";
import type { Decision } from "@/data/mockDecisions";

type Conf = "firm" | "soft" | "watching";

/** Confidence heuristic — critical=firm, opportunity=soft, fyi=watching. */
export function confidenceFor(d: Decision): Conf {
  if (d.severity === "critical") return "firm";
  if (d.severity === "opportunity") return "soft";
  return "watching";
}

const TONE: Record<Conf, string> = {
  firm: "text-foreground bg-muted border-border/70",
  soft: "text-muted-foreground bg-muted/60 border-border/60",
  watching: "text-muted-foreground bg-transparent border-dashed border-border/70",
};

const LABEL: Record<Conf, string> = {
  firm: "Firm",
  soft: "Soft",
  watching: "Watching",
};

export function ConfidenceChip({ decision }: { decision: Decision }) {
  const c = confidenceFor(decision);
  return (
    <span className={cn("inline-flex items-center h-6 px-2 rounded-full border text-[11.5px]", TONE[c])}>
      {LABEL[c]}
    </span>
  );
}
