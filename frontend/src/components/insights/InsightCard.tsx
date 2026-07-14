import { AlertTriangle, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Insight, InsightCategory } from "./InsightsContext";
import { Button } from "@/components/ui/button";

interface InsightCardProps {
  insight: Insight;
  onActionClick?: (actionText: string) => void;
}

const categoryConfig: Record<
  InsightCategory,
  { icon: typeof AlertTriangle; colorClass: string; bgClass: string; borderClass: string }
> = {
  critical: {
    icon: AlertTriangle,
    colorClass: "text-destructive",
    bgClass: "bg-destructive/10",
    borderClass: "border-destructive/20",
  },
  attention: {
    icon: AlertCircle,
    colorClass: "text-warning",
    bgClass: "bg-warning/10",
    borderClass: "border-warning/20",
  },
  positive: {
    icon: CheckCircle2,
    colorClass: "text-success",
    bgClass: "bg-success/10",
    borderClass: "border-success/20",
  },
};

export function InsightCard({ insight, onActionClick }: InsightCardProps) {
  const config = categoryConfig[insight.category];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "rounded-lg border p-4 transition-colors hover:bg-muted/50",
        config.borderClass
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn("mt-0.5 rounded-full p-1.5", config.bgClass)}>
          <Icon className={cn("h-4 w-4", config.colorClass)} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm text-foreground leading-tight">
            {insight.title}
          </h4>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            {insight.description}
          </p>
          {insight.action && (
            <Button
              variant="ghost"
              size="sm"
              className={cn("mt-2 h-7 px-2 text-xs gap-1", config.colorClass)}
              onClick={() => onActionClick?.(insight.action!)}
            >
              {insight.action.length > 40
                ? insight.action.substring(0, 40) + "..."
                : insight.action}
              <ArrowRight className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
