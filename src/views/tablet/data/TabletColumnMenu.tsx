import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { TouchTarget } from "../primitives/TouchTarget";
import { useVisualViewportInset } from "../primitives/useVisualViewportInset";

export interface ColumnOption {
  id: string;
  label: string;
}

interface TabletColumnMenuProps {
  open: boolean;
  onClose: () => void;
  options: ColumnOption[];
  visible: Set<string>;
  onChange: (next: Set<string>) => void;
}

function useIsPortrait() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(orientation: portrait)").matches;
}

export function TabletColumnMenu({ open, onClose, options, visible, onChange }: TabletColumnMenuProps) {
  const [query, setQuery] = useState("");
  const portrait = useIsPortrait();
  const kb = useVisualViewportInset();

  const filtered = useMemo(
    () => options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase())),
    [options, query],
  );

  if (!open) return null;

  const wrap = portrait
    ? "fixed inset-x-0 bottom-0 rounded-t-2xl max-h-[80dvh]"
    : "fixed right-0 top-0 h-dvh w-96 border-l border-border";

  return (
    <>
      <div className="fixed inset-0 z-40 bg-foreground/20" onClick={onClose} aria-hidden />
      <div
        className={cn("z-50 bg-card flex flex-col border border-border", wrap)}
        style={portrait ? { paddingBottom: kb } : { height: `calc(100dvh - ${kb}px)` }}
        role="dialog"
        aria-label="Columns"
      >
        <header className="flex items-center gap-2 p-3 border-b border-border">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search columns"
            className="border-0 shadow-none focus-visible:ring-0 px-0"
          />
          <TouchTarget aria-label="Close" onClick={onClose} className="rounded-md">
            <X className="h-5 w-5" />
          </TouchTarget>
        </header>
        <div className="flex-1 min-h-0 overflow-y-auto p-2">
          {filtered.map((opt) => {
            const checked = visible.has(opt.id);
            return (
              <label
                key={opt.id}
                className="flex items-center gap-3 min-h-11 px-3 rounded-md hover:bg-muted cursor-pointer"
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={(v) => {
                    const next = new Set(visible);
                    if (v) next.add(opt.id);
                    else next.delete(opt.id);
                    onChange(next);
                  }}
                  className="h-5 w-5"
                />
                <span className="text-sm">{opt.label}</span>
              </label>
            );
          })}
        </div>
      </div>
    </>
  );
}
