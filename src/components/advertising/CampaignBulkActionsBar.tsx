import { Button } from "@/components/ui/button";
import { TagPopover } from "./TagPopover";
import { useTags } from "@/contexts/TagsContext";
import {
  CheckCircle2,
  PauseCircle,
  Tag as TagIcon,
  Calendar,
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
}

export function CampaignBulkActionsBar({
  selectedIds,
  totalCount,
  onClearSelection,
  onCancel,
  onSave,
}: CampaignBulkActionsBarProps) {
  const { bulkToggleTag, getEffectiveTags, hasDrafts } = useTags();

  // Intersection of tags across all selected rows (only show as "selected" when all share)
  const sharedTags = (() => {
    if (selectedIds.length === 0) return [];
    const sets = selectedIds.map((id) => new Set(getEffectiveTags(id)));
    const first = Array.from(sets[0]);
    return first.filter((t) => sets.every((s) => s.has(t)));
  })();

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border bg-muted/30 px-3 py-1.5">
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-foreground">
          {selectedIds.length} of {totalCount} selected
        </span>
        {selectedIds.length > 0 && (
          <button
            onClick={onClearSelection}
            className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>

      <div className="flex items-center gap-1">
        <span className="text-[11px] text-muted-foreground mr-1">Bulk Actions:</span>

        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 text-[11px] cursor-pointer"
          disabled={selectedIds.length === 0}
          onClick={() => toast.success(`Activated ${selectedIds.length} campaign(s)`)}
        >
          <CheckCircle2 className="h-3 w-3" />
          Active
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 text-[11px] cursor-pointer"
          disabled={selectedIds.length === 0}
          onClick={() => toast.success(`Paused ${selectedIds.length} campaign(s)`)}
        >
          <PauseCircle className="h-3 w-3" />
          Pause
        </Button>

        <TagPopover
          title="Tag the selected campaigns"
          selectedTags={sharedTags}
          onToggle={(tag) => bulkToggleTag(selectedIds, tag)}
          align="end"
          trigger={
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 text-[11px] cursor-pointer"
              disabled={selectedIds.length === 0}
            >
              <TagIcon className="h-3 w-3" />
              Tag
            </Button>
          }
        />

        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 text-[11px] cursor-pointer"
          disabled={selectedIds.length === 0}
          onClick={() => toast.info("End date editor coming soon")}
        >
          <Calendar className="h-3 w-3" />
          End Date
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 text-[11px] cursor-pointer"
          disabled={selectedIds.length === 0}
          onClick={() => toast.info("Daily budget editor coming soon")}
        >
          <DollarSign className="h-3 w-3" />
          Daily Budget
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 text-[11px] cursor-pointer"
          disabled={selectedIds.length === 0}
          onClick={() => toast.info("Total budget editor coming soon")}
        >
          <CircleDollarSign className="h-3 w-3" />
          Total Budget
        </Button>

        <div className="h-4 w-px bg-border mx-1" />

        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-[11px] cursor-pointer"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          size="sm"
          className="h-7 text-[11px] cursor-pointer"
          onClick={onSave}
          disabled={!hasDrafts && selectedIds.length === 0}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
