import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Campaign, CampaignStatus, BiddingStrategy } from "@/types/campaign";
import { useActivePanel } from "@/contexts/ActivePanelContext";
import { X } from "lucide-react";

interface CampaignSettingsPanelProps {
  campaign: Campaign | null;
  onSave?: (updates: Partial<Campaign>) => void;
}

export function CampaignSettingsPanel({ campaign, onSave }: CampaignSettingsPanelProps) {
  const { dataPanel, closeDataPanel } = useActivePanel();
  const isOpen = dataPanel === "campaignSettings" && campaign !== null;

  const [name, setName] = useState("");
  const [status, setStatus] = useState<CampaignStatus>("live");
  const [dailyBudget, setDailyBudget] = useState("");
  const [biddingStrategy, setBiddingStrategy] = useState<BiddingStrategy>("Dynamic Down");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [topOfSearch, setTopOfSearch] = useState("50");
  const [productPages, setProductPages] = useState("25");
  const [restOfSearch, setRestOfSearch] = useState("0");

  useEffect(() => {
    if (campaign && isOpen) {
      setName(campaign.name);
      setStatus(campaign.status);
      setDailyBudget(campaign.dailyBudget.toString());
      setBiddingStrategy(campaign.biddingStrategy);
      setStartDate(campaign.startDate);
      setEndDate(campaign.endDate || "");
    }
  }, [campaign, isOpen]);

  if (!isOpen || !campaign) return null;

  const typeLabel = "SP";
  const targetingLabel = campaign.type === "auto" ? "AUTO" : "MANUAL";

  const handleSave = () => {
    onSave?.({
      name,
      status,
      dailyBudget: parseFloat(dailyBudget) || campaign.dailyBudget,
      biddingStrategy,
      startDate,
      endDate: endDate || undefined,
    });
    closeDataPanel();
  };

  return (
    <div className="w-[320px] shrink-0 border-l border-border bg-card flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <h3 className="text-sm font-semibold text-foreground">Campaign Settings</h3>
        <button onClick={closeDataPanel} className="p-1 rounded hover:bg-muted transition-colors cursor-pointer">
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4 space-y-4">
          {/* Campaign Name */}
          <div className="space-y-1.5">
            <Label className="text-xs">Campaign Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="h-8 text-sm" />
          </div>

          {/* Campaign ID (read-only) */}
          <div className="space-y-1.5">
            <Label className="text-xs">Campaign ID</Label>
            <Input value={campaign.id} disabled className="h-8 text-sm bg-muted" />
          </div>

          {/* Type badges row */}
          <div className="flex items-center gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Type of Ad</Label>
              <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">{typeLabel}</Badge>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Type of Targeting</Label>
              <Badge variant="outline" className="text-xs bg-muted text-muted-foreground">{targetingLabel}</Badge>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <Label className="text-xs">Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as CampaignStatus)}>
              <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="live">Live</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date range */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Start Date</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-8 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">End Date</Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-8 text-sm" placeholder="No end date" />
            </div>
          </div>

          {/* Budget */}
          <div className="space-y-1.5">
            <Label className="text-xs">Daily Budget ($)</Label>
            <Input type="number" value={dailyBudget} onChange={(e) => setDailyBudget(e.target.value)} className="h-8 text-sm" min="0" step="0.01" />
          </div>

          {/* Bidding Strategy */}
          <div className="space-y-2">
            <Label className="text-xs">Bidding Strategy</Label>
            <RadioGroup value={biddingStrategy} onValueChange={(v) => setBiddingStrategy(v as BiddingStrategy)} className="space-y-2">
              <label className="flex items-start gap-2 p-2 rounded-md border border-border hover:bg-muted/50 cursor-pointer transition-colors">
                <RadioGroupItem value="Dynamic Down" className="mt-0.5" />
                <div>
                  <span className="text-sm font-medium">Dynamic bids — down only</span>
                  <p className="text-[11px] text-muted-foreground">Lowers bids when less likely to convert</p>
                </div>
              </label>
              <label className="flex items-start gap-2 p-2 rounded-md border border-border hover:bg-muted/50 cursor-pointer transition-colors">
                <RadioGroupItem value="Dynamic Up/Down" className="mt-0.5" />
                <div>
                  <span className="text-sm font-medium">Dynamic bids — up and down</span>
                  <p className="text-[11px] text-muted-foreground">Raises bids for high-convert, lowers for unlikely</p>
                </div>
              </label>
              <label className="flex items-start gap-2 p-2 rounded-md border border-border hover:bg-muted/50 cursor-pointer transition-colors">
                <RadioGroupItem value="Fixed" className="mt-0.5" />
                <div>
                  <span className="text-sm font-medium">Fixed bids</span>
                  <p className="text-[11px] text-muted-foreground">Uses your exact bid for all opportunities</p>
                </div>
              </label>
            </RadioGroup>
          </div>

          {/* Placement Bids */}
          <div className="space-y-2">
            <Label className="text-xs">Placement Bid Adjustments</Label>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">Top of Search (first page)</span>
                <div className="flex items-center gap-1">
                  <Input type="number" value={topOfSearch} onChange={(e) => setTopOfSearch(e.target.value)} className="h-7 w-16 text-xs text-right" min="0" max="900" />
                  <span className="text-xs text-muted-foreground">%</span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">Product Pages</span>
                <div className="flex items-center gap-1">
                  <Input type="number" value={productPages} onChange={(e) => setProductPages(e.target.value)} className="h-7 w-16 text-xs text-right" min="0" max="900" />
                  <span className="text-xs text-muted-foreground">%</span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">Rest of Search</span>
                <div className="flex items-center gap-1">
                  <Input type="number" value={restOfSearch} onChange={(e) => setRestOfSearch(e.target.value)} className="h-7 w-16 text-xs text-right" min="0" max="900" />
                  <span className="text-xs text-muted-foreground">%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-border shrink-0">
        <Button variant="ghost" size="sm" onClick={closeDataPanel}>Cancel</Button>
        <Button size="sm" onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
}
