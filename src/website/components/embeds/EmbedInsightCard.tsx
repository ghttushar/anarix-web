import { ArrowUpRight } from "lucide-react";

interface InsightProps {
  severity?: "high" | "medium" | "low";
  title: string;
  body: string;
  source?: string;
}

const sevColor = {
  high: "bg-rose-500",
  medium: "bg-amber-500",
  low: "bg-emerald-500",
};

const EmbedInsightCard = ({ severity = "medium", title, body, source = "Aan · 2m ago" }: InsightProps) => (
  <div className="p-5 bg-card border border-border rounded-xl">
    <div className="flex items-center gap-2 mb-3">
      <span className={`w-2 h-2 rounded-full ${sevColor[severity]}`} />
      <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{source}</span>
    </div>
    <div className="text-sm font-semibold text-foreground mb-1.5 leading-snug">{title}</div>
    <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
    <button className="mt-4 inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline">
      Open in Aan <ArrowUpRight className="w-3 h-3" />
    </button>
  </div>
);

export default EmbedInsightCard;
