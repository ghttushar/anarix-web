import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AdGroup } from "@/types/advertising";
import { useActivePanel } from "@/contexts/ActivePanelContext";
import { X } from "lucide-react";

interface AdGroupSettingsPanelProps {
  adGroup: AdGroup | null;
  onSave?: (updates: Partial<AdGroup>) => void;
}

export function AdGroupSettingsPanel({ adGroup, onSave }: AdGroupSettingsPanelProps) {
  const { dataPanel, closeDataPanel } = useActivePanel();
  const isOpen = dataPanel === "adGroupSettings" && adGroup !== null;

  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [defaultBid, setDefaultBid] = useState("");
  const [minBid, setMinBid] = useState("");
  const [maxBid, setMaxBid] = useState("");
  const [targetRoas, setTargetRoas] = useState("");

  useEffect(() => {
    if (adGroup && isOpen) {
      setName(adGroup.name);
      setStatus(adGroup.status);
      setDefaultBid(adGroup.minBid.toString());
      setMinBid(adGroup.minBid.toString());
      setMaxBid(adGroup.maxBid.toString());
      setTargetRoas(adGroup.targetRoas.toString());
    }
  }, [adGroup, isOpen]);

  if (!isOpen || !adGroup) return null;

  const handleSave = () => {
    onSave?.({
      name,
      status: status as AdGroup["status"],
      minBid: parseFloat(minBid) || adGroup.minBid,
      maxBid: parseFloat(maxBid) || adGroup.maxBid,
      targetRoas: parseFloat(targetRoas) || adGroup.targetRoas,
    });
    closeDataPanel();
  };

  return (
    <div className="w-[320px] shrink-0 border-l border-border bg-card flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <h3 className="text-sm font-semibold text-foreground">Ad Group Settings</h3>
        <button onClick={closeDataPanel} className="p-1 rounded hover:bg-muted transition-colors cursor-pointer">
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Ad Group Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="h-8 text-sm" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Ad Group ID</Label>
            <Input value={adGroup.id} disabled className="h-8 text-sm bg-muted" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="live">Live</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Default Bid ($)</Label>
            <Input type="number" value={defaultBid} onChange={(e) => setDefaultBid(e.target.value)} className="h-8 text-sm" min="0" step="0.01" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Min Bid ($)</Label>
              <Input type="number" value={minBid} onChange={(e) => setMinBid(e.target.value)} className="h-8 text-sm" min="0" step="0.01" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Max Bid ($)</Label>
              <Input type="number" value={maxBid} onChange={(e) => setMaxBid(e.target.value)} className="h-8 text-sm" min="0" step="0.01" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Target ROAS</Label>
            <Input type="number" value={targetRoas} onChange={(e) => setTargetRoas(e.target.value)} className="h-8 text-sm" min="0" step="0.1" />
          </div>
        </div>
      </ScrollArea>

      <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-border shrink-0">
        <Button variant="ghost" size="sm" onClick={closeDataPanel}>Cancel</Button>
        <Button size="sm" onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
}
