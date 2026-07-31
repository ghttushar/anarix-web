import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (campaign: {
    name: string;
    type: string;
    biddingStrategy: string;
    dailyBudget: number;
    startDate: string;
    endDate?: string;
  }) => void;
}

export function CreateCampaignModal({ isOpen, onClose, onSubmit }: CreateCampaignModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState("SP");
  const [biddingStrategy, setBiddingStrategy] = useState("Dynamic Down");
  const [dailyBudget, setDailyBudget] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Campaign name is required";
    if (!dailyBudget || parseFloat(dailyBudget) <= 0) e.dailyBudget = "Budget must be greater than 0";
    if (!startDate) e.startDate = "Start date is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({
      name: name.trim(),
      type,
      biddingStrategy,
      dailyBudget: parseFloat(dailyBudget),
      startDate,
      endDate: endDate || undefined,
    });
    toast.success("Campaign created successfully");
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName(""); setType("SP"); setBiddingStrategy("Dynamic Down");
    setDailyBudget(""); setStartDate(""); setEndDate(""); setErrors({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { resetForm(); onClose(); } }}>
      <DialogContent className="max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Create Campaign</DialogTitle>
          <DialogDescription>Set up a new advertising campaign.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="camp-name" className="text-xs">Campaign Name</Label>
            <Input id="camp-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., SP | Brand | Exact" className="h-9 text-sm" />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Campaign Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="SP">Sponsored Products</SelectItem>
                  <SelectItem value="SB">Sponsored Brands</SelectItem>
                  <SelectItem value="SD">Sponsored Display</SelectItem>
                  <SelectItem value="SV">Sponsored Video</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Bidding Strategy</Label>
              <Select value={biddingStrategy} onValueChange={setBiddingStrategy}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dynamic Down">Dynamic Down</SelectItem>
                  <SelectItem value="Dynamic Up/Down">Dynamic Up/Down</SelectItem>
                  <SelectItem value="Fixed">Fixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="camp-budget" className="text-xs">Daily Budget ($)</Label>
            <Input id="camp-budget" type="number" value={dailyBudget} onChange={(e) => setDailyBudget(e.target.value)} placeholder="0.00" className="h-9 text-sm" min="0" step="0.01" />
            {errors.dailyBudget && <p className="text-xs text-destructive">{errors.dailyBudget}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="camp-start" className="text-xs">Start Date</Label>
              <Input id="camp-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-9 text-sm" />
              {errors.startDate && <p className="text-xs text-destructive">{errors.startDate}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="camp-end" className="text-xs">End Date (optional)</Label>
              <Input id="camp-end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-9 text-sm" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" size="sm" onClick={() => { resetForm(); onClose(); }}>Cancel</Button>
          <Button size="sm" onClick={handleSubmit}>Create Campaign</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
