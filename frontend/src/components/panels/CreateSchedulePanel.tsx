import { useState } from "react";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useActivePanel } from "@/contexts/ActivePanelContext";
import { dayPartingCampaigns } from "@/data/mockDayParting";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const DAYS_OF_WEEK = [
  { label: "Sun", value: 0 },
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
];

export function CreateSchedulePanel() {
  const { dataPanel, closeDataPanel } = useActivePanel();
  const isOpen = dataPanel === "createSchedule";

  const [ruleName, setRuleName] = useState("");
  const [schedStartDate, setSchedStartDate] = useState("");
  const [schedEndDate, setSchedEndDate] = useState("");
  const [noEndDate, setNoEndDate] = useState(false);
  const [recurrence, setRecurrence] = useState<"daily" | "weekly">("daily");
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [bidAction, setBidAction] = useState("decrease");
  const [bidPercent, setBidPercent] = useState("30");
  const [hourMode, setHourMode] = useState<"all" | "range">("all");
  const [timeRanges, setTimeRanges] = useState([{ start: "00", end: "06" }]);
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>(["camp-1", "camp-2"]);

  if (!isOpen) return null;

  const toggleDay = (day: number) => {
    setSelectedDays((prev) => prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]);
  };

  const addTimeRange = () => setTimeRanges((prev) => [...prev, { start: "00", end: "06" }]);
  const removeTimeRange = (idx: number) => setTimeRanges((prev) => prev.filter((_, i) => i !== idx));
  const removeCampaign = (id: string) => setSelectedCampaigns((prev) => prev.filter((c) => c !== id));

  const handleApply = () => {
    if (!ruleName.trim()) { toast.error("Please enter a rule name"); return; }
    toast.success(`Day parting rule "${ruleName}" created`);
    closeDataPanel();
    setRuleName("");
  };

  return (
    <div className="flex h-full w-[320px] shrink-0 flex-col border-l border-border bg-background">
      <div className="border-b border-border shrink-0">
        <div className="flex items-center justify-between px-3 py-3">
          <h2 className="font-heading text-sm font-semibold text-foreground">Create Day Parting Rule</h2>
          <Button variant="ghost" size="icon" onClick={closeDataPanel} className="h-7 w-7" title="Close">
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="space-y-4 p-3">
          {/* Campaigns */}
          <div className="space-y-1.5">
            <Label className="text-xs">Campaigns</Label>
            <div className="flex flex-wrap gap-1">
              {selectedCampaigns.map((id) => {
                const camp = dayPartingCampaigns.find((c) => c.id === id);
                return (
                  <Badge key={id} variant="secondary" className="gap-1 pr-1 text-[10px] h-5">
                    {camp?.name || id}
                    <button onClick={() => removeCampaign(id)} className="rounded-full p-0.5 hover:bg-muted"><X className="h-2 w-2" /></button>
                  </Badge>
                );
              })}
              <Select onValueChange={(v) => { if (!selectedCampaigns.includes(v)) setSelectedCampaigns((prev) => [...prev, v]); }}>
                <SelectTrigger className="h-5 w-16 text-[9px] border-dashed"><SelectValue placeholder="+ Add" /></SelectTrigger>
                <SelectContent>{dayPartingCampaigns.map((c) => <SelectItem key={c.id} value={c.id} className="text-xs">{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>

          {/* Rule Name */}
          <div className="space-y-1.5">
            <Label className="text-xs">Rule Name</Label>
            <Input value={ruleName} onChange={(e) => setRuleName(e.target.value)} placeholder="e.g., Pause overnight" className="h-7 text-xs" />
          </div>

          {/* Date Range */}
          <div className="space-y-1.5">
            <Label className="text-xs">Date Range</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input type="date" value={schedStartDate} onChange={(e) => setSchedStartDate(e.target.value)} className="h-7 text-xs" />
              <Input type="date" value={schedEndDate} onChange={(e) => setSchedEndDate(e.target.value)} className="h-7 text-xs" disabled={noEndDate} />
            </div>
            <label className="flex items-center gap-1.5 text-[10px] text-muted-foreground cursor-pointer">
              <Checkbox checked={noEndDate} onCheckedChange={(v) => setNoEndDate(!!v)} className="h-3 w-3" />
              No End Date
            </label>
          </div>

          {/* Recurrence */}
          <div className="space-y-1.5">
            <Label className="text-xs">Recurrence</Label>
            <RadioGroup value={recurrence} onValueChange={(v) => setRecurrence(v as "daily" | "weekly")} className="flex gap-3">
              <label className="flex items-center gap-1 text-xs cursor-pointer"><RadioGroupItem value="daily" className="h-3 w-3" />Daily</label>
              <label className="flex items-center gap-1 text-xs cursor-pointer"><RadioGroupItem value="weekly" className="h-3 w-3" />Weekly</label>
            </RadioGroup>
            {recurrence === "weekly" && (
              <div className="flex gap-1 mt-1.5">
                {DAYS_OF_WEEK.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => toggleDay(d.value)}
                    className={cn(
                      "h-6 w-7 rounded text-[9px] font-medium transition-colors cursor-pointer",
                      selectedDays.includes(d.value) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >{d.label}</button>
                ))}
              </div>
            )}
          </div>

          {/* Bid Adjustment */}
          <div className="space-y-1.5">
            <Label className="text-xs">Bid Adjustment</Label>
            <div className="flex items-center gap-1.5">
              <Select value={bidAction} onValueChange={setBidAction}>
                <SelectTrigger className="h-7 w-[110px] text-[10px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="increase" className="text-xs">Increase by %</SelectItem>
                  <SelectItem value="decrease" className="text-xs">Decrease by %</SelectItem>
                </SelectContent>
              </Select>
              <Input type="number" value={bidPercent} onChange={(e) => setBidPercent(e.target.value)} className="h-7 w-14 text-xs" min="0" max="100" />
              <span className="text-[10px] text-muted-foreground">%</span>
            </div>
          </div>

          {/* Hour of Day */}
          <div className="space-y-1.5">
            <Label className="text-xs">Hour of Day</Label>
            <RadioGroup value={hourMode} onValueChange={(v) => setHourMode(v as "all" | "range")} className="flex gap-3">
              <label className="flex items-center gap-1 text-xs cursor-pointer"><RadioGroupItem value="all" className="h-3 w-3" />All Day</label>
              <label className="flex items-center gap-1 text-xs cursor-pointer"><RadioGroupItem value="range" className="h-3 w-3" />Time Range</label>
            </RadioGroup>
            {hourMode === "range" && (
              <div className="space-y-1.5 mt-1.5">
                {timeRanges.map((range, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <Select value={range.start} onValueChange={(v) => { const next = [...timeRanges]; next[idx] = { ...next[idx], start: v }; setTimeRanges(next); }}>
                      <SelectTrigger className="h-6 w-16 text-[10px]"><SelectValue /></SelectTrigger>
                      <SelectContent>{Array.from({ length: 24 }, (_, i) => <SelectItem key={i} value={i.toString().padStart(2, "0")} className="text-xs">{i.toString().padStart(2, "0")}:00</SelectItem>)}</SelectContent>
                    </Select>
                    <span className="text-[10px] text-muted-foreground">to</span>
                    <Select value={range.end} onValueChange={(v) => { const next = [...timeRanges]; next[idx] = { ...next[idx], end: v }; setTimeRanges(next); }}>
                      <SelectTrigger className="h-6 w-16 text-[10px]"><SelectValue /></SelectTrigger>
                      <SelectContent>{Array.from({ length: 24 }, (_, i) => <SelectItem key={i} value={i.toString().padStart(2, "0")} className="text-xs">{i.toString().padStart(2, "0")}:00</SelectItem>)}</SelectContent>
                    </Select>
                    {timeRanges.length > 1 && (
                      <button onClick={() => removeTimeRange(idx)} className="p-0.5 hover:bg-muted rounded cursor-pointer"><X className="h-2.5 w-2.5 text-muted-foreground" /></button>
                    )}
                  </div>
                ))}
                <button onClick={addTimeRange} className="text-[10px] text-primary hover:underline cursor-pointer">+ Add Time Range</button>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Footer actions */}
      <div className="border-t border-border p-3 shrink-0 flex items-center justify-end gap-2">
        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={closeDataPanel}>Cancel</Button>
        <Button size="sm" className="h-7 text-xs" onClick={handleApply}>Apply Rule</Button>
      </div>
    </div>
  );
}
