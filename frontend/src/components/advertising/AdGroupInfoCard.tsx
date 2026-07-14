import { StatusBadge } from "@/components/status/StatusBadge";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useActivePanel } from "@/contexts/ActivePanelContext";
import { AdGroup } from "@/types/advertising";
import { Pencil } from "lucide-react";

interface AdGroupInfoCardProps {
  adGroup: AdGroup;
  onUpdate?: (updates: Partial<AdGroup>) => void;
}

export function AdGroupInfoCard({ adGroup, onUpdate }: AdGroupInfoCardProps) {
  const { formatCurrency } = useCurrency();
  const { setDataPanel } = useActivePanel();

  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-card px-4 py-2.5 overflow-x-auto">
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Ad Group</span>
        <span className="text-sm font-medium text-foreground truncate">{adGroup.name}</span>
      </div>

      <div className="h-8 w-px bg-border shrink-0" />

      <div className="flex flex-col gap-0.5 shrink-0">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Status</span>
        <StatusBadge status={adGroup.status} />
      </div>

      <div className="h-8 w-px bg-border shrink-0" />

      <div className="flex flex-col gap-0.5 shrink-0">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Default Bid</span>
        <span className="text-sm font-medium text-primary cursor-pointer hover:underline">{formatCurrency(adGroup.minBid)}</span>
      </div>

      <div className="h-8 w-px bg-border shrink-0" />

      <div className="flex flex-col gap-0.5 shrink-0">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Keyword Targeting</span>
        <span className="text-sm text-foreground">Bidded Value</span>
      </div>

      <div className="h-8 w-px bg-border shrink-0" />

      <div className="flex flex-col gap-0.5 shrink-0">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Min. Bid</span>
        <span className="text-sm font-medium text-primary cursor-pointer hover:underline">{formatCurrency(adGroup.minBid)}</span>
      </div>

      <div className="h-8 w-px bg-border shrink-0" />

      <div className="flex flex-col gap-0.5 shrink-0">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Max. Bid</span>
        <span className="text-sm font-medium text-primary cursor-pointer hover:underline">{formatCurrency(adGroup.maxBid)}</span>
      </div>

      <div className="h-8 w-px bg-border shrink-0" />

      <div className="flex flex-col gap-0.5 shrink-0">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">TRoAS</span>
        <span className="text-sm font-medium text-primary cursor-pointer hover:underline">{formatCurrency(adGroup.targetRoas)}</span>
      </div>

      <div className="flex-1" />

      <Button variant="outline" size="sm" className="gap-1.5 shrink-0" onClick={() => setDataPanel("adGroupSettings")}>
        <Pencil className="h-3.5 w-3.5" />
        Edit
      </Button>
    </div>
  );
}
