import { useCallback, useEffect, useRef, useState } from "react";
import { Pencil, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  defaultShortcuts,
  formatKeyCombo,
  loadCustomShortcuts,
  saveCustomShortcuts,
  type ShortcutDef,
} from "./shortcutRegistry";

function ShortcutRow({
  shortcut,
  customKeys,
  isEditing,
  onEdit,
  onCaptured,
}: {
  shortcut: ShortcutDef;
  customKeys?: string[];
  isEditing: boolean;
  onEdit: () => void;
  onCaptured: (keys: string[]) => void;
}) {
  const [captured, setCaptured] = useState<string[]>([]);

  useEffect(() => {
    if (!isEditing) return;
    setCaptured([]);
    const handler = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (["Meta", "Control", "Shift", "Alt"].includes(e.key)) return;
      const parts = formatKeyCombo(e);
      if (parts.length > 0) {
        setCaptured(parts);
        onCaptured(parts);
      }
    };
    document.addEventListener("keydown", handler, true);
    return () => document.removeEventListener("keydown", handler, true);
  }, [isEditing, onCaptured]);

  const displayKeys = customKeys || shortcut.keys;

  return (
    <div className="flex items-center justify-between px-4 py-2.5 group">
      <span className="text-sm text-muted-foreground">{shortcut.description}</span>
      <div className="flex items-center gap-2">
        {isEditing ? (
          <div className="flex items-center gap-1 px-2 py-1 rounded border-2 border-primary bg-primary/5 animate-pulse">
            {captured.length > 0 ? (
              captured.map((k, i) => (
                <kbd
                  key={i}
                  className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-mono font-medium"
                >
                  {k}
                </kbd>
              ))
            ) : (
              <span className="text-xs text-primary">Press keys…</span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1">
            {displayKeys.map((key, i) => (
              <span key={i}>
                <kbd
                  className={cn(
                    "px-2 py-1 rounded bg-muted text-xs font-mono font-medium",
                    customKeys && "bg-primary/10 text-primary"
                  )}
                >
                  {key}
                </kbd>
                {i < displayKeys.length - 1 && (
                  <span className="text-muted-foreground mx-0.5">+</span>
                )}
              </span>
            ))}
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 opacity-60 group-hover:opacity-100 transition-opacity"
          onClick={onEdit}
        >
          <Pencil className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

interface ShortcutEditorProps {
  compact?: boolean;
}

export function ShortcutEditor({ compact = false }: ShortcutEditorProps) {
  const [customShortcuts, setCustomShortcuts] =
    useState<Record<string, string[]>>(loadCustomShortcuts);
  const [editingKey, setEditingKey] = useState<string | null>(null);

  useEffect(() => {
    const onChange = () => setCustomShortcuts(loadCustomShortcuts());
    window.addEventListener("anarix-shortcuts-changed", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("anarix-shortcuts-changed", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const handleCaptured = useCallback(
    (desc: string, keys: string[]) => {
      const next = { ...customShortcuts, [desc]: keys };
      setCustomShortcuts(next);
      saveCustomShortcuts(next);
      setEditingKey(null);
      toast.success(`Shortcut updated for "${desc}"`);
    },
    [customShortcuts]
  );

  const resetCategory = (category: string) => {
    const section = defaultShortcuts.find((s) => s.category === category);
    if (!section) return;
    const next = { ...customShortcuts };
    section.shortcuts.forEach((s) => delete next[s.description]);
    setCustomShortcuts(next);
    saveCustomShortcuts(next);
    toast.success(`${category} shortcuts reset to defaults`);
  };

  const resetAll = () => {
    setCustomShortcuts({});
    saveCustomShortcuts({});
    toast.success("All shortcuts reset to defaults");
  };

  return (
    <div className={cn("space-y-6", compact && "space-y-4")}>
      {defaultShortcuts.map((section) => (
        <div key={section.category} className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">{section.category}</h3>
            {section.shortcuts.some((s) => customShortcuts[s.description]) && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => resetCategory(section.category)}
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Reset
              </Button>
            )}
          </div>
          <div className="rounded-lg border border-border bg-card overflow-hidden divide-y divide-border">
            {section.shortcuts.map((shortcut) => (
              <ShortcutRow
                key={shortcut.id}
                shortcut={shortcut}
                customKeys={customShortcuts[shortcut.description]}
                isEditing={editingKey === shortcut.id}
                onEdit={() =>
                  setEditingKey(editingKey === shortcut.id ? null : shortcut.id)
                }
                onCaptured={(keys) => handleCaptured(shortcut.description, keys)}
              />
            ))}
          </div>
        </div>
      ))}
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={resetAll}>
          <RotateCcw className="h-3 w-3 mr-1.5" />
          Reset all to defaults
        </Button>
      </div>
    </div>
  );
}
