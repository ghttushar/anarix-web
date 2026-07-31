import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface AddKeywordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (keyword: { keyword: string; region: string; channels: ("organic" | "sponsored")[] }) => void;
}

export function AddKeywordModal({ isOpen, onClose, onAdd }: AddKeywordModalProps) {
  const [keyword, setKeyword] = useState("");
  const [region, setRegion] = useState("US");
  const [organic, setOrganic] = useState(true);
  const [sponsored, setSponsored] = useState(true);

  const handleSubmit = () => {
    if (!keyword.trim()) return;
    
    const channels: ("organic" | "sponsored")[] = [];
    if (organic) channels.push("organic");
    if (sponsored) channels.push("sponsored");
    
    if (channels.length === 0) return;
    
    onAdd({ keyword: keyword.trim(), region, channels });
    setKeyword("");
    setRegion("US");
    setOrganic(true);
    setSponsored(true);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Keyword to Track</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="keyword">Keyword</Label>
            <Input
              id="keyword"
              placeholder="Enter keyword to track..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="region">Region</Label>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger>
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="US">🇺🇸 United States</SelectItem>
                <SelectItem value="CA">🇨🇦 Canada</SelectItem>
                <SelectItem value="UK">🇬🇧 United Kingdom</SelectItem>
                <SelectItem value="DE">🇩🇪 Germany</SelectItem>
                <SelectItem value="FR">🇫🇷 France</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Channels to Track</Label>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="organic"
                  checked={organic}
                  onCheckedChange={(checked) => setOrganic(checked as boolean)}
                />
                <Label htmlFor="organic" className="text-sm font-normal cursor-pointer">
                  Organic
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="sponsored"
                  checked={sponsored}
                  onCheckedChange={(checked) => setSponsored(checked as boolean)}
                />
                <Label htmlFor="sponsored" className="text-sm font-normal cursor-pointer">
                  Sponsored
                </Label>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!keyword.trim() || (!organic && !sponsored)}>
            Add Keyword
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
