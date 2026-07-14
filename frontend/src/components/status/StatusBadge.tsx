import { CampaignStatus } from "@/types/campaign";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StatusBadgeProps {
  status: CampaignStatus;
  className?: string;
}

const statusConfig: Record<CampaignStatus, { 
  label: string; 
  className: string; 
  tooltip: string;
}> = {
  live: {
    label: "Live",
    className: "status-live",
    tooltip: "Campaign is actively running",
  },
  paused: {
    label: "Paused",
    className: "status-paused",
    tooltip: "Campaign paused by user",
  },
  archived: {
    label: "Archived",
    className: "status-archived",
    tooltip: "Permanently stopped",
  },
  scheduled: {
    label: "Scheduled",
    className: "status-scheduled",
    tooltip: "Campaign scheduled to start",
  },
  out_of_budget: {
    label: "Out of Budget",
    className: "status-out-of-budget",
    tooltip: "Daily budget exhausted",
  },
  completed: {
    label: "Completed",
    className: "status-completed",
    tooltip: "Campaign ended",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
            config.className,
            className
          )}
        >
          {config.label}
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p>{config.tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}
