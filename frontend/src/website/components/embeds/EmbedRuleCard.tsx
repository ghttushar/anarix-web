import { ShieldCheck, Eye } from "lucide-react";

const EmbedRuleCard = () => (
  <div className="p-5 bg-card">
    <div className="flex items-start justify-between mb-4">
      <div>
        <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Draft rule · v3</div>
        <div className="text-sm font-semibold text-foreground mt-1">Pause underperforming search terms</div>
      </div>
      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 font-medium">Pending approval</span>
    </div>

    <div className="space-y-2 text-xs font-mono">
      <div className="px-3 py-2 rounded-md bg-muted/40 border border-border">
        <span className="text-primary font-semibold">IF</span>{" "}
        <span className="text-foreground">spend &gt; $50</span>{" "}
        <span className="text-muted-foreground">AND</span>{" "}
        <span className="text-foreground">orders = 0</span>{" "}
        <span className="text-muted-foreground">in last 14 days</span>
      </div>
      <div className="px-3 py-2 rounded-md bg-muted/40 border border-border">
        <span className="text-primary font-semibold">THEN</span>{" "}
        <span className="text-foreground">negate as exact match</span>
      </div>
    </div>

    <div className="flex flex-wrap gap-1.5 mt-4">
      <span className="text-[10px] px-2 py-0.5 rounded-pill bg-primary/10 text-primary">Guardrail: max 25/day</span>
      <span className="text-[10px] px-2 py-0.5 rounded-pill bg-primary/10 text-primary">Reversible</span>
      <span className="text-[10px] px-2 py-0.5 rounded-pill bg-primary/10 text-primary">Logged</span>
    </div>

    <div className="flex gap-2 mt-5 pt-4 border-t border-border">
      <button className="flex-1 inline-flex items-center justify-center gap-1.5 h-8 rounded-md border border-border text-xs font-medium text-foreground">
        <Eye className="w-3.5 h-3.5" /> Preview impact
      </button>
      <button className="flex-1 inline-flex items-center justify-center gap-1.5 h-8 rounded-md bg-primary text-primary-foreground text-xs font-medium">
        <ShieldCheck className="w-3.5 h-3.5" /> Approve
      </button>
    </div>
  </div>
);

export default EmbedRuleCard;
