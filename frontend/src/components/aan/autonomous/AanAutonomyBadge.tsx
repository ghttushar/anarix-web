import { useAanEvents } from "@/components/aan/autonomous/AanEventsContext";
import { Shield, Radio } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const levelMeta = {
  advisory: { label: "Advisory", detail: "Recommends only", color: "text-muted-foreground bg-muted" },
  assisted: { label: "Assisted", detail: "3 policies active", color: "text-primary bg-primary/10" },
  autonomous: { label: "Autonomous", detail: "Broad automation", color: "text-success bg-success/10" },
};

export function AanAutonomyBadge() {
  const { autonomyLevel, liveMode } = useAanEvents();
  const navigate = useNavigate();
  const meta = levelMeta[autonomyLevel];

  return (
    <button
      onClick={() => navigate("/settings/appearance#edit-alerts")}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors hover:opacity-80",
        meta.color
      )}
      title="Aan autonomy level — click to review policies"
    >
      <Shield className="h-2.5 w-2.5" />
      <span className="whitespace-nowrap">Aan: {meta.label}</span>
      {liveMode && (
        <span className="ml-0.5 flex items-center gap-0.5 text-[9px] uppercase tracking-wider">
          <Radio className="h-2 w-2 animate-pulse" />
          Live
        </span>
      )}
    </button>
  );
}
