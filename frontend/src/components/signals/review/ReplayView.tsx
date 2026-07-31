import type { Decision } from "@/types/signals";
import { recommendationFor } from "@/lib/decisions/recommendationStructure";
import { RecommendationBlock } from "./RecommendationBlock";
import { AuditTrail } from "./AuditTrail";

export function ReplayView({ decision }: { decision: Decision }) {
  const parts = recommendationFor(decision);
  const outcome =
    decision.status === "completed" ? "Completed — value captured."
    : decision.status === "in_flight" ? "Executed by Aan — running."
    : decision.status === "rejected" ? "Rejected — no value captured."
    : decision.status === "with_aan" ? "Handed to Aan — running."
    : "Still open.";

  return (
    <div className="space-y-4">
      <section>
        <div className="text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">
          Original recommendation
        </div>
        <RecommendationBlock parts={parts} />
      </section>

      <section>
        <div className="text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">
          Your action
        </div>
        <p className="text-[13px] text-foreground/90">
          {decision.status === "in_flight" || decision.status === "completed"
            ? "You approved."
            : decision.status === "with_aan"
            ? "You delegated to Aan."
            : decision.status === "rejected"
            ? "You rejected."
            : decision.status === "snoozed"
            ? "You snoozed."
            : "No action taken yet."}
        </p>
      </section>

      <section>
        <div className="text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">
          Outcome
        </div>
        <p className="text-[13px] text-foreground/90">{outcome}</p>
      </section>

      <AuditTrail decision={decision} defaultOpen />
    </div>
  );
}
