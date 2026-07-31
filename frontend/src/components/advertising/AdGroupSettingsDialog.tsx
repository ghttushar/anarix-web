import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { AdGroup } from "@/types/advertising";

interface AdGroupSettingsDialogProps {
  adGroup: AdGroup;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updates: Partial<AdGroup>) => void;
}

export function AdGroupSettingsDialog({ adGroup, open, onOpenChange, onSave }: AdGroupSettingsDialogProps) {
  const [name, setName] = useState(adGroup.name);
  const [status, setStatus] = useState(adGroup.status);
  const [defaultBid, setDefaultBid] = useState(adGroup.minBid.toString());
  const [minBid, setMinBid] = useState(adGroup.minBid.toString());
  const [maxBid, setMaxBid] = useState(adGroup.maxBid.toString());
  const [targetRoas, setTargetRoas] = useState(adGroup.targetRoas.toString());

  const handleSave = () => {
    onSave({
      name,
      status: status as AdGroup["status"],
      minBid: parseFloat(minBid) || adGroup.minBid,
      maxBid: parseFloat(maxBid) || adGroup.maxBid,
      targetRoas: parseFloat(targetRoas) || adGroup.targetRoas,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base">Ad Group Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
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
            <Select value={status} onValueChange={(v) => setStatus(v as AdGroup["status"])}>
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

        <DialogFooter>
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button size="sm" onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}