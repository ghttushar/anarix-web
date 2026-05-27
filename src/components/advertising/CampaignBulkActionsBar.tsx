import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { TagPopover } from "./TagPopover";
import { useTags } from "@/contexts/TagsContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Campaign } from "@/types/campaign";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  CheckCircle2,
  PauseCircle,
  Tag as TagIcon,
  Calendar as CalendarIcon,
  DollarSign,
  CircleDollarSign,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface CampaignBulkActionsBarProps {
  selectedIds: string[];
  totalCount: number;
  onClearSelection: () => void;
  onCancel: () => void;
  onSave: () => void;
  onBulkUpdate?: (updates: Partial<Campaign>) => void;
}

export function CampaignBulkActionsBar({
  selectedIds,
  totalCount,
  onClearSelection,
  onCancel,
  onSave,
  onBulkUpdate,
}: CampaignBulkActionsBarProps) {
  const { bulkToggleTag, getEffectiveTags, hasDrafts } = useTags();
  const { currencyConfig } = useCurrency();

  const disabled = selectedIds.length === 0;
  const count = selectedIds.length;

  // Per-action popover state
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [dailyBudget, setDailyBudget] = useState("");
  const [dailyOpen, setDailyOpen] = useState(false);
  const [totalBudget, setTotalBudget] = useState("");
  const [totalOpen, setTotalOpen] = useState(false);
  const [activeOpen, setActiveOpen] = useState(false);
  const [pauseOpen, setPauseOpen] = useState(false);

  const sharedTags = (() => {
    if (selectedIds.length === 0) return [];
    const sets = selectedIds.map((id) => new Set(getEffectiveTags(id)));
    const first = Array.from(sets[0]);
    return first.filter((t) => sets.every((s) => s.has(t)));
  })();

  const applyActive = (isActive: boolean) => {
    onBulkUpdate?.({ isActive, status: isActive ? "live" : "paused" });
    toast.success(`${isActive ? "Activated" : "Paused"} ${count} campaign(s)`);
    setActiveOpen(false);
    setPauseOpen(false);
  };

  const applyEndDate = () => {
    if (!endDate) return;
    onBulkUpdate?.({ endDate: endDate.toISOString().slice(0, 10) });
    toast.success(`End date set on ${count} campaign(s)`);
    setEndDateOpen(false);
  };

  const applyDailyBudget = () => {
    const n = parseFloat(dailyBudget);
    if (!Number.isFinite(n) || n <= 0) {
      toast.error("Enter a valid daily budget");
      return;
    }
    onBulkUpdate?.({ dailyBudget: n });
    toast.success(`Daily budget updated on ${count} campaign(s)`);
    setDailyOpen(false);
    setDailyBudget("");
  };

  const applyTotalBudget = () => {
    const n = parseFloat(totalBudget);
    if (!Number.isFinite(n) || n <= 0) {
      toast.error("Enter a valid total budget");
      return;
    }
    onBulkUpdate?.({ totalBudget: n });
    toast.success(`Total budget updated on ${count} campaign(s)`);
    setTotalOpen(false);
    setTotalBudget("");
  };

  const triggerClass = cn(
    "h-7 gap-1 text-[11px] cursor-pointer",
  );

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border bg-muted/30 px-3 py-1.5">
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-foreground">
          {count} of {totalCount} selected
        </span>
        {count > 0 && (
          <button
            onClick={onClearSelection}
            className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        )}
        {disabled && (
          <span className="text-[11px] text-muted-foreground">
            Select rows to enable bulk actions
          </span>
        )}
      </div>

      <div className="flex items-center gap-1">
        <span className="text-[11px] text-muted-foreground mr-1">Bulk Actions:</span>

        {/* Active */}
        <Popover open={activeOpen} onOpenChange={setActiveOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className={triggerClass} disabled={disabled}>
              <CheckCircle2 className="h-3 w-3" />
              Active
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-3 space-y-2" align="end">
            <p className="text-xs text-foreground">
              Activate {count} selected campaign(s)?
            </p>
            <div className="flex justify-end gap-1">
              <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => setActiveOpen(false)}>Cancel</Button>
              <Button size="sm" className="h-8 text-xs" onClick={() => applyActive(true)}>Apply</Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Pause */}
        <Popover open={pauseOpen} onOpenChange={setPauseOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className={triggerClass} disabled={disabled}>
              <PauseCircle className="h-3 w-3" />
              Pause
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-3 space-y-2" align="end">
            <p className="text-xs text-foreground">
              Pause {count} selected campaign(s)?
            </p>
            <div className="flex justify-end gap-1">
              <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => setPauseOpen(false)}>Cancel</Button>
              <Button size="sm" className="h-8 text-xs" onClick={() => applyActive(false)}>Apply</Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Tag */}
        <TagPopover
          title="Tag the selected campaigns"
          selectedTags={sharedTags}
          onToggle={(tag) => bulkToggleTag(selectedIds, tag)}
          align="end"
          trigger={
            <Button variant="ghost" size="sm" className={triggerClass} disabled={disabled}>
              <TagIcon className="h-3 w-3" />
              Tag
            </Button>
          }
        />

        {/* End Date */}
        <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className={triggerClass} disabled={disabled}>
              <CalendarIcon className="h-3 w-3" />
              End Date
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <div className="p-2 border-b border-border">
              <p className="text-[11px] text-muted-foreground px-1">
                {endDate ? `End: ${format(endDate, "PPP")}` : "Pick end date"}
              </p>
            </div>
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={setEndDate}
              initialFocus
              className="p-3 pointer-events-auto"
            />
            <div className="flex justify-end gap-1 p-2 border-t border-border">
              <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => setEndDateOpen(false)}>Cancel</Button>
              <Button size="sm" className="h-8 text-xs" onClick={applyEndDate} disabled={!endDate}>Apply</Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Daily Budget */}
        <Popover open={dailyOpen} onOpenChange={setDailyOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className={triggerClass} disabled={disabled}>
              <DollarSign className="h-3 w-3" />
              Daily Budget
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-3 space-y-2" align="end">
            <label className="text-[11px] text-muted-foreground">New daily budget</label>
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                {currencyConfig.symbol}
              </span>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={dailyBudget}
                onChange={(e) => setDailyBudget(e.target.value)}
                placeholder="0.00"
                className="h-8 text-xs pl-6"
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-1">
              <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => setDailyOpen(false)}>Cancel</Button>
              <Button size="sm" className="h-8 text-xs" onClick={applyDailyBudget}>Apply</Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Total Budget */}
        <Popover open={totalOpen} onOpenChange={setTotalOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className={triggerClass} disabled={disabled}>
              <CircleDollarSign className="h-3 w-3" />
              Total Budget
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-3 space-y-2" align="end">
            <label className="text-[11px] text-muted-foreground">New total budget</label>
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                {currencyConfig.symbol}
              </span>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={totalBudget}
                onChange={(e) => setTotalBudget(e.target.value)}
                placeholder="0.00"
                className="h-8 text-xs pl-6"
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-1">
              <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => setTotalOpen(false)}>Cancel</Button>
              <Button size="sm" className="h-8 text-xs" onClick={applyTotalBudget}>Apply</Button>
            </div>
          </PopoverContent>
        </Popover>

        <div className="h-4 w-px bg-border mx-1" />

        <Button variant="ghost" size="sm" className="h-7 text-[11px] cursor-pointer" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          size="sm"
          className="h-7 text-[11px] cursor-pointer"
          onClick={onSave}
          disabled={!hasDrafts && count === 0}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
