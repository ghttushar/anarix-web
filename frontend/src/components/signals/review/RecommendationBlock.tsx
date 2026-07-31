import { cn } from "@/lib/utils";
import type { RecommendationParts } from "@/lib/decisions/recommendationStructure";

interface Props {
  parts: RecommendationParts;
  className?: string;
}

const FIELDS: Array<{ key: keyof RecommendationParts; label: string }> = [
  { key: "summary", label: "Summary" },
  { key: "reason", label: "Reason" },
  { key: "impact", label: "Impact" },
  { key: "tradeoff", label: "Tradeoff" },
  { key: "risk", label: "Risk" },
  { key: "undoability", label: "Undoability" },
  { key: "confidence", label: "Confidence" },
];

export function RecommendationBlock({ parts, className }: Props) {
  return (
    <div className={cn("rounded-md border border-border bg-muted/30 divide-y divide-border/60", className)}>
      {FIELDS.map(({ key, label }) => (
        <div key={key} className="grid grid-cols-[110px_1fr] gap-3 px-3 py-2.5">
          <div className="text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground pt-0.5">
            {label}
          </div>
          <div className={cn(
            "text-[12.5px] leading-relaxed",
            key === "summary" ? "font-medium text-foreground" : "text-foreground/85",
          )}>
            {parts[key]}
          </div>
        </div>
      ))}
    </div>
  );
}
