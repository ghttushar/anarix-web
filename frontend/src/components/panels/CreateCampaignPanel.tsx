import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useActivePanel } from "@/contexts/ActivePanelContext";
import { toast } from "sonner";

interface CreateCampaignPanelProps {
  onSubmit?: (data: { name: string; type: string; biddingStrategy: string; dailyBudget: number; startDate: string; endDate?: string }) => void;
}

export function CreateCampaignPanel({ onSubmit }: CreateCampaignPanelProps) {
  const { dataPanel, closeDataPanel } = useActivePanel();
  const isOpen = dataPanel === "createCampaign";

  const [name, setName] = useState("");
  const [type, setType] = useState("Sponsored Products");
  const [biddingStrategy, setBiddingStrategy] = useState("Dynamic bids - down only");
  const [dailyBudget, setDailyBudget] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Required";
    if (!dailyBudget || parseFloat(dailyBudget) <= 0) newErrors.dailyBudget = "Must be > 0";
    if (!startDate) newErrors.startDate = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit?.({ name, type, biddingStrategy, dailyBudget: parseFloat(dailyBudget), startDate, endDate: endDate || undefined });
    toast.success(`Campaign "${name}" created`);
    closeDataPanel();
    setName(""); setDailyBudget(""); setStartDate(""); setEndDate(""); setErrors({});
  };

  return (
    <div className="flex h-full w-[320px] shrink-0 flex-col border-l border-border bg-background">
      <div className="border-b border-border shrink-0">
        <div className="flex items-center justify-between px-3 py-3">
          <h2 className="font-heading text-sm font-semibold text-foreground">Create Campaign</h2>
          <Button variant="ghost" size="icon" onClick={closeDataPanel} className="h-7 w-7" title="Close">
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="space-y-4 p-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Campaign Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter name" className="h-7 text-xs" />
            {errors.name && <p className="text-[10px] text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Campaign Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Sponsored Products" className="text-xs">Sponsored Products</SelectItem>
                <SelectItem value="Sponsored Brands" className="text-xs">Sponsored Brands</SelectItem>
                <SelectItem value="Sponsored Display" className="text-xs">Sponsored Display</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Bidding Strategy</Label>
            <Select value={biddingStrategy} onValueChange={setBiddingStrategy}>
              <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Dynamic bids - down only" className="text-xs">Dynamic bids - down only</SelectItem>
                <SelectItem value="Dynamic bids - up and down" className="text-xs">Dynamic bids - up and down</SelectItem>
                <SelectItem value="Fixed bids" className="text-xs">Fixed bids</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Daily Budget ($)</Label>
            <Input type="number" value={dailyBudget} onChange={(e) => setDailyBudget(e.target.value)} placeholder="0.00" className="h-7 text-xs" min="0" step="0.01" />
            {errors.dailyBudget && <p className="text-[10px] text-destructive">{errors.dailyBudget}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Start Date</Label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-7 text-xs" />
            {errors.startDate && <p className="text-[10px] text-destructive">{errors.startDate}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">End Date (optional)</Label>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-7 text-xs" />
          </div>
        </div>
      </ScrollArea>

      <div className="border-t border-border p-3 shrink-0 flex items-center justify-end gap-2">
        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={closeDataPanel}>Cancel</Button>
        <Button size="sm" className="h-7 text-xs" onClick={handleSubmit}>Create Campaign</Button>
      </div>
    </div>
  );
}
