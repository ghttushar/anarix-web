import { FileText, BarChart3, Search, Zap, Palette, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { AanDraft } from "./AanContext";

interface ArtifactCardProps {
  artifact: AanDraft;
  onClick: () => void;
  className?: string;
}

const typeConfig: Record<
  AanDraft["type"],
  { icon: React.ComponentType<{ className?: string }>; label: string; color: string }
> = {
  report: { icon: BarChart3, label: "Report", color: "text-primary" },
  audit: { icon: Search, label: "Audit", color: "text-warning" },
  bid_change: { icon: Zap, label: "Bid Change", color: "text-success" },
  campaign_edit: { icon: FileText, label: "Campaign Edit", color: "text-accent" },
  rule: { icon: Zap, label: "Rule", color: "text-primary" },
};

export function ArtifactCard({ artifact, onClick, className }: ArtifactCardProps) {
  const config = typeConfig[artifact.type] || typeConfig.report;
  const Icon = config.icon;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-sm group",
        className
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted",
            config.color
          )}
        >
          <Icon className="h-5 w-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {config.label}
            </span>
            <span
              className={cn(
                "text-xs px-1.5 py-0.5 rounded-full",
                artifact.status === "pending" && "bg-warning/10 text-warning",
                artifact.status === "approved" && "bg-success/10 text-success",
                artifact.status === "rejected" && "bg-destructive/10 text-destructive",
                artifact.status === "editing" && "bg-primary/10 text-primary"
              )}
            >
              {artifact.status}
            </span>
          </div>

          <h4 className="font-semibold text-foreground truncate mb-1">
            {artifact.title}
          </h4>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {artifact.description}
          </p>

          {/* Changes summary */}
          {artifact.changes.length > 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              {artifact.changes.length} change{artifact.changes.length !== 1 ? "s" : ""} proposed
            </p>
          )}
        </div>

        {/* Open indicator */}
        <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
      </div>
    </button>
  );
}
