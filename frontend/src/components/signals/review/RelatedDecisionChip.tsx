import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Decision } from "@/types/signals";
import { RELATIONSHIP_LABEL, type RelationshipType } from "@/lib/decisions/relationships";

interface Props {
  decision: Decision;
  type: RelationshipType;
  onOpen: (id: string) => void;
}

const TONE: Record<RelationshipType, string> = {
  blocks: "border-destructive/40 text-destructive",
  depends_on: "border-warning/40 text-warning",
  duplicates: "border-border/70 text-muted-foreground",
  merged_into: "border-primary/30 text-primary",
  caused_by: "border-border/70 text-muted-foreground",
  related: "border-border/70 text-muted-foreground",
};

export function RelatedDecisionChip({ decision, type, onOpen }: Props) {
  return (
    <button
      onClick={() => onOpen(decision.id)}
      className={cn(
        "group inline-flex items-center gap-2 h-7 pl-2 pr-1.5 rounded-full border bg-card text-[11.5px] hover:bg-muted/50",
        TONE[type],
      )}
    >
      <span className="font-medium">{RELATIONSHIP_LABEL[type]}</span>
      <span className="text-muted-foreground/90 max-w-[220px] truncate">{decision.insight}</span>
      <ArrowRight className="h-3 w-3 opacity-60 group-hover:opacity-100" />
    </button>
  );
}
