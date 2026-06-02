import { Plus, X } from "lucide-react";
import { TagPopover } from "./TagPopover";
import { useTags } from "@/contexts/TagsContext";
import { cn } from "@/lib/utils";

interface CampaignTagBarProps {
  campaignId: string;
  isEdit: boolean;
}

/**
 * Renders the inline tag list below a Campaign Name.
 * In view mode it's read-only chips.
 * In edit mode each chip gets a remove button and a "+ Tag" trigger opens TagPopover.
 */
export function CampaignTagBar({ campaignId, isEdit }: CampaignTagBarProps) {
  const { getEffectiveTags, toggleTag, removeTag, draftTags } = useTags();
  const tags = getEffectiveTags(campaignId);
  const isDraft = draftTags[campaignId] !== undefined;

  if (!isEdit && tags.length === 0) return null;

  // One-tag enforcement: render at most the first tag; selecting a new tag
  // replaces the existing one. The "+ Tag" trigger is hidden once a tag exists.
  const visibleTags = tags.slice(0, 1);

  const handleToggle = (t: string) => {
    // If the selected tag is already applied → remove it.
    // Otherwise clear any existing tag first, then apply the new one.
    if (tags.includes(t)) {
      removeTag(campaignId, t);
      return;
    }
    tags.forEach((existing) => removeTag(campaignId, existing));
    toggleTag(campaignId, t);
  };

  return (
    <div className="flex flex-wrap items-center gap-1 mt-1" onClick={(e) => e.stopPropagation()}>
      {visibleTags.map((tag) => (
        <span
          key={tag}
          className={cn(
            "inline-flex items-center gap-0.5 rounded-md border px-1.5 py-0.5 text-[10px] font-medium",
            isDraft
              ? "border-dashed border-primary/50 bg-primary/5 text-primary"
              : "border-border bg-muted text-foreground"
          )}
        >
          {tag}
          {isEdit && (
            <button
              onClick={() => removeTag(campaignId, tag)}
              className="ml-0.5 rounded-full hover:bg-muted-foreground/20 p-0.5 cursor-pointer"
              title="Remove tag"
            >
              <X className="h-2 w-2" />
            </button>
          )}
        </span>
      ))}
      {isEdit && visibleTags.length === 0 && (
        <TagPopover
          selectedTags={tags}
          onToggle={handleToggle}
          trigger={
            <button
              className="inline-flex items-center gap-0.5 rounded-md border border-dashed border-muted-foreground/40 px-1.5 py-0.5 text-[10px] text-muted-foreground hover:text-primary hover:border-primary/50 cursor-pointer transition-colors"
              title="Add tag"
            >
              <Plus className="h-2.5 w-2.5" />
              Tag
            </button>
          }
        />
      )}
    </div>
  );
}

