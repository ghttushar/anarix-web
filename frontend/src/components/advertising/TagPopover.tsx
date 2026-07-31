import { useState, useMemo, ReactNode } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Check, Pencil, Trash2, Plus } from "lucide-react";
import { useTags } from "@/contexts/TagsContext";
import { cn } from "@/lib/utils";

interface TagPopoverProps {
  /** Render-prop trigger. */
  trigger: ReactNode;
  /** Tags currently selected on the target (single row, or intersection of bulk). */
  selectedTags: string[];
  /** Called when a tag is toggled. */
  onToggle: (tag: string) => void;
  /** Optional title shown above the search input. */
  title?: string;
  align?: "start" | "center" | "end";
}

export function TagPopover({
  trigger,
  selectedTags,
  onToggle,
  title,
  align = "start",
}: TagPopoverProps) {
  const { tags, createTag, renameTag, deleteTag } = useTags();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tags;
    return tags.filter((t) => t.toLowerCase().includes(q));
  }, [tags, query]);

  const exactMatch = useMemo(
    () => tags.some((t) => t.toLowerCase() === query.trim().toLowerCase()),
    [tags, query]
  );

  const handleCreate = () => {
    const clean = query.trim();
    if (!clean || exactMatch) return;
    createTag(clean);
    onToggle(clean);
    setQuery("");
  };

  const startEdit = (tag: string) => {
    setEditingTag(tag);
    setEditValue(tag);
  };

  const commitEdit = () => {
    if (editingTag && editValue.trim() && editValue !== editingTag) {
      renameTag(editingTag, editValue.trim());
    }
    setEditingTag(null);
    setEditValue("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent align={align} className="w-[260px] p-2">
        {title && (
          <p className="text-[11px] font-medium text-muted-foreground px-1.5 pb-1.5">
            {title}
          </p>
        )}
        <Input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the tags to create a tag"
          className="h-7 text-xs mb-1.5"
          onKeyDown={(e) => {
            if (e.key === "Enter" && query.trim() && !exactMatch) {
              e.preventDefault();
              handleCreate();
            }
          }}
        />
        {query.trim() && !exactMatch && (
          <button
            onClick={handleCreate}
            className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-primary hover:bg-primary/10 cursor-pointer mb-0.5"
          >
            <Plus className="h-3 w-3" />
            Create "{query.trim()}"
          </button>
        )}
        <div className="max-h-[200px] overflow-y-auto">
          {filtered.length === 0 && !query.trim() && (
            <p className="text-[11px] text-muted-foreground px-2 py-2">
              No tags here. Investment yet.
            </p>
          )}
          {filtered.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            const isEditing = editingTag === tag;
            return (
              <div
                key={tag}
                className={cn(
                  "group flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs cursor-pointer hover:bg-muted",
                  isSelected && "bg-primary/5"
                )}
              >
                {isEditing ? (
                  <Input
                    autoFocus
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={commitEdit}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        commitEdit();
                      }
                      if (e.key === "Escape") {
                        setEditingTag(null);
                        setEditValue("");
                      }
                    }}
                    className="h-6 text-xs flex-1"
                  />
                ) : (
                  <>
                    <button
                      onClick={() => onToggle(tag)}
                      className="flex flex-1 items-center gap-1.5 text-left cursor-pointer"
                    >
                      <span
                        className={cn(
                          "flex h-3.5 w-3.5 items-center justify-center rounded-sm border",
                          isSelected
                            ? "bg-primary border-primary text-primary-foreground"
                            : "border-muted-foreground/40"
                        )}
                      >
                        {isSelected && <Check className="h-2.5 w-2.5" />}
                      </span>
                      <span className="text-foreground">{tag}</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEdit(tag);
                      }}
                      className="p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-muted cursor-pointer transition-opacity"
                      title="Rename tag"
                    >
                      <Pencil className="h-3 w-3 text-muted-foreground" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTag(tag);
                      }}
                      className="p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-destructive/10 cursor-pointer transition-opacity"
                      title="Delete tag"
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
