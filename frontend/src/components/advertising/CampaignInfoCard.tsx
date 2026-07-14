import { StatusBadge } from "@/components/status/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useActivePanel } from "@/contexts/ActivePanelContext";
import { Campaign } from "@/types/campaign";
import { Pencil } from "lucide-react";

interface CampaignInfoCardProps {
  campaign: Campaign;
  onUpdate?: (updates: Partial<Campaign>) => void;
}

export function CampaignInfoCard({ campaign, onUpdate }: CampaignInfoCardProps) {
  const { formatCurrency } = useCurrency();
  const { setDataPanel } = useActivePanel();

  const typeLabel = campaign.type === "auto" ? "SP" : "SP";
  const targetingLabel = campaign.type === "auto" ? "AUTO" : "MANUAL";

  const biddingLabel =
    campaign.biddingStrategy === "Dynamic Down" ? "Down Only" :
    campaign.biddingStrategy === "Dynamic Up/Down" ? "Up & Down" : "Fixed";

  const schedule = campaign.startDate
    ? `${campaign.startDate}${campaign.endDate ? ` — ${campaign.endDate}` : " — No End Date"}`
    : "—";

  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-card px-4 py-2.5 overflow-x-auto">
      {/* Campaign Name + Type Badges */}
      <div className="flex flex-col gap-1 min-w-0">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Campaign</span>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-foreground truncate">{campaign.name}</span>
          <Badge variant="outline" className="text-[9px] h-4 px-1.5 bg-primary/5 text-primary border-primary/20 shrink-0">{typeLabel}</Badge>
          <Badge variant="outline" className="text-[9px] h-4 px-1.5 bg-muted text-muted-foreground shrink-0">{targetingLabel}</Badge>
        </div>
      </div>

      <div className="h-8 w-px bg-border shrink-0" />

      <div className="flex flex-col gap-0.5 shrink-0">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Status</span>
        <StatusBadge status={campaign.status} />
      </div>

      <div className="h-8 w-px bg-border shrink-0" />

      <div className="flex flex-col gap-0.5 shrink-0">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Daily Budget</span>
        <span className="text-sm font-medium text-primary cursor-pointer hover:underline">{formatCurrency(campaign.dailyBudget)}</span>
      </div>

      <div className="h-8 w-px bg-border shrink-0" />

      <div className="flex flex-col gap-0.5 shrink-0">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Bidding Strategy</span>
        <span className="text-sm text-foreground">{biddingLabel}</span>
      </div>

      <div className="h-8 w-px bg-border shrink-0" />

      <div className="flex flex-col gap-0.5 shrink-0">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Schedule</span>
        <span className="text-xs text-muted-foreground">{schedule}</span>
      </div>

      <div className="flex-1" />

      <Button variant="outline" size="sm" className="gap-1.5 shrink-0" onClick={() => setDataPanel("campaignSettings")}>
        <Pencil className="h-3.5 w-3.5" />
        Edit
      </Button>
    </div>
  );
}
