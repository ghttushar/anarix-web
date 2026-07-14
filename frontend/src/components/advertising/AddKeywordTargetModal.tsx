import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockTargetCampaigns, mockTargetAdGroups } from "@/data/mockTargetingActions";
import { Plus, Trash2 } from "lucide-react";

interface KeywordEntry {
  id: string;
  keyword: string;
  broad: boolean;
  exact: boolean;
  phrase: boolean;
  bid: string;
}

interface AddKeywordTargetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (keywords: KeywordEntry[], campaignId: string, adGroupId: string) => void;
}

export function AddKeywordTargetModal({ isOpen, onClose, onAdd }: AddKeywordTargetModalProps) {
  const [keywords, setKeywords] = useState<KeywordEntry[]>([
    { id: crypto.randomUUID(), keyword: "", broad: false, exact: true, phrase: false, bid: "" },
  ]);
  const [campaignId, setCampaignId] = useState("");
  const [adGroupId, setAdGroupId] = useState("");

  const filteredAdGroups = mockTargetAdGroups.filter((ag) => ag.campaignId === campaignId);

  const addRow = () => {
    setKeywords([...keywords, { id: crypto.randomUUID(), keyword: "", broad: false, exact: true, phrase: false, bid: "" }]);
  };

  const removeRow = (id: string) => {
    if (keywords.length <= 1) return;
    setKeywords(keywords.filter((k) => k.id !== id));
  };

  const updateRow = (id: string, updates: Partial<KeywordEntry>) => {
    setKeywords(keywords.map((k) => k.id === id ? { ...k, ...updates } : k));
  };

  const handleAdd = () => {
    const valid = keywords.filter((k) => k.keyword.trim() && (k.broad || k.exact || k.phrase));
    if (valid.length === 0 || !campaignId || !adGroupId) return;
    onAdd(valid, campaignId, adGroupId);
    setKeywords([{ id: crypto.randomUUID(), keyword: "", broad: false, exact: true, phrase: false, bid: "" }]);
    setCampaignId("");
    setAdGroupId("");
    onClose();
  };

  const hasValid = keywords.some((k) => k.keyword.trim() && (k.broad || k.exact || k.phrase)) && campaignId && adGroupId;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Keywords</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Target Campaign & Ad Group */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Target Campaign</Label>
              <Select value={campaignId} onValueChange={(v) => { setCampaignId(v); setAdGroupId(""); }}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select campaign" /></SelectTrigger>
                <SelectContent>
                  {mockTargetCampaigns.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Target Ad Group</Label>
              <Select value={adGroupId} onValueChange={setAdGroupId} disabled={!campaignId}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select ad group" /></SelectTrigger>
                <SelectContent>
                  {filteredAdGroups.map((ag) => (
                    <SelectItem key={ag.id} value={ag.id}>{ag.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Keywords List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Keywords ({keywords.length})</Label>
              <button onClick={addRow} className="flex items-center gap-1 text-xs text-primary hover:underline cursor-pointer">
                <Plus className="h-3 w-3" />Add Row
              </button>
            </div>

            <div className="rounded-lg border border-border">
              {/* Match Type to Add header */}
              <div className="grid grid-cols-[1fr_180px_80px_32px] gap-2 px-3 pt-2 pb-1 text-[11px] text-muted-foreground font-medium">
                <span />
                <span className="text-center">Match Type to Add</span>
                <span />
                <span />
              </div>
              {/* Column header */}
              <div className="grid grid-cols-[1fr_60px_60px_60px_80px_32px] gap-2 px-3 py-2 bg-muted text-[11px] text-muted-foreground font-medium">
                <span>Keyword</span>
                <span className="text-center">Broad</span>
                <span className="text-center">Exact</span>
                <span className="text-center">Phrase</span>
                <span className="text-center">Bid</span>
                <span />
              </div>

              {/* Rows */}
              <div className="max-h-[240px] overflow-y-auto divide-y divide-border">
                {keywords.map((kw) => (
                  <div key={kw.id} className="grid grid-cols-[1fr_60px_60px_60px_80px_32px] gap-2 px-3 py-2 items-center">
                    <Input
                      value={kw.keyword}
                      onChange={(e) => updateRow(kw.id, { keyword: e.target.value })}
                      placeholder="Enter keyword..."
                      className="h-7 text-xs"
                    />
                    <div className="flex justify-center">
                      <Checkbox
                        checked={kw.broad}
                        onCheckedChange={(checked) => updateRow(kw.id, { broad: !!checked })}
                        className="h-3.5 w-3.5"
                      />
                    </div>
                    <div className="flex justify-center">
                      <Checkbox
                        checked={kw.exact}
                        onCheckedChange={(checked) => updateRow(kw.id, { exact: !!checked })}
                        className="h-3.5 w-3.5"
                      />
                    </div>
                    <div className="flex justify-center">
                      <Checkbox
                        checked={kw.phrase}
                        onCheckedChange={(checked) => updateRow(kw.id, { phrase: !!checked })}
                        className="h-3.5 w-3.5"
                      />
                    </div>
                    <Input
                      type="number"
                      value={kw.bid}
                      onChange={(e) => updateRow(kw.id, { bid: e.target.value })}
                      placeholder="0.00"
                      step={0.01}
                      className="h-7 text-xs text-center"
                    />
                    <button
                      onClick={() => removeRow(kw.id)}
                      className="p-1 hover:bg-muted rounded cursor-pointer"
                      title="Remove keyword"
                      disabled={keywords.length <= 1}
                    >
                      <Trash2 className="h-3 w-3 text-muted-foreground" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={handleAdd} disabled={!hasValid}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
