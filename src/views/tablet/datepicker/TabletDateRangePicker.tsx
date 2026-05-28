import { useEffect, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { TouchTarget } from "../primitives/TouchTarget";
import { useVisualViewportInset } from "../primitives/useVisualViewportInset";
import { DATE_PRESETS } from "./presets";

interface TabletDateRangePickerProps {
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
  className?: string;
}

function useIsPortrait() {
  const [p, setP] = useState(typeof window !== "undefined" ? window.matchMedia("(orientation: portrait)").matches : false);
  useEffect(() => {
    const mql = window.matchMedia("(orientation: portrait)");
    const h = (e: MediaQueryListEvent) => setP(e.matches);
    mql.addEventListener("change", h);
    return () => mql.removeEventListener("change", h);
  }, []);
  return p;
}

export function TabletDateRangePicker({ value, onChange, className }: TabletDateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DateRange | undefined>(value);
  const portrait = useIsPortrait();
  const kb = useVisualViewportInset();

  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  const label = value?.from
    ? `${format(value.from, "MMM d")}${value.to ? ` – ${format(value.to, "MMM d")}` : ""}`
    : "Select dates";

  return (
    <>
      <TouchTarget
        onClick={() => setOpen(true)}
        className={cn("rounded-md border border-border px-3 gap-2 text-sm", className)}
      >
        <CalendarIcon className="h-4 w-4" />
        <span>{label}</span>
      </TouchTarget>

      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-foreground/20" onClick={() => setOpen(false)} aria-hidden />
          <div
            role="dialog"
            aria-label="Select date range"
            className={cn(
              "fixed z-50 bg-card border border-border flex flex-col",
              portrait
                ? "inset-x-0 bottom-0 rounded-t-2xl max-h-[85dvh]"
                : "right-4 top-20 rounded-md shadow-lg w-[640px]",
            )}
            style={portrait ? { paddingBottom: kb } : undefined}
          >
            <div className="flex-1 min-h-0 flex overflow-hidden">
              <div className="w-40 shrink-0 border-r border-border overflow-y-auto p-2">
                {DATE_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setDraft(p.range())}
                    className="block w-full text-left min-h-12 px-3 rounded-md text-sm hover:bg-muted"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <div className="flex-1 min-w-0 overflow-auto p-2">
                <Calendar
                  mode="range"
                  selected={draft}
                  onSelect={setDraft}
                  numberOfMonths={portrait ? 1 : 2}
                  className={cn("p-3 pointer-events-auto")}
                />
              </div>
            </div>
            <div className="p-3 border-t border-border flex gap-2">
              <Button variant="outline" className="flex-1 h-12" onClick={() => setOpen(false)}>Cancel</Button>
              <Button
                className="flex-1 h-12"
                onClick={() => {
                  onChange(draft);
                  setOpen(false);
                }}
              >
                Apply
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
