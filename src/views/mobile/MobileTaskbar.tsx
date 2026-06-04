import { ReactNode, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CalendarIcon, Play, Bell, Lightbulb, ChevronRight } from "lucide-react";
import { format, subDays, startOfMonth, startOfWeek, endOfWeek, subWeeks, endOfMonth, subMonths } from "date-fns";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useFilter } from "@/contexts/FilterContext";
import { useActivePanel } from "@/contexts/ActivePanelContext";
import { useInsights } from "@/components/insights";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Props {
  breadcrumbItems?: BreadcrumbItem[];
  showDateRange?: boolean;
  showRunButton?: boolean;
  onRun?: () => void;
  children?: ReactNode;
}

const today = () => new Date();
const PRESETS = [
  { label: "Today", getRange: () => ({ from: today(), to: today() }) },
  { label: "Yesterday", getRange: () => { const d = subDays(today(), 1); return { from: d, to: d }; } },
  { label: "Last 7 days", getRange: () => ({ from: subDays(today(), 6), to: today() }) },
  { label: "Last 14 days", getRange: () => ({ from: subDays(today(), 13), to: today() }) },
  { label: "Last 30 days", getRange: () => ({ from: subDays(today(), 29), to: today() }) },
  { label: "This week", getRange: () => ({ from: startOfWeek(today()), to: today() }) },
  { label: "Last week", getRange: () => { const s = startOfWeek(subWeeks(today(), 1)); return { from: s, to: endOfWeek(s) }; } },
  { label: "This month", getRange: () => ({ from: startOfMonth(today()), to: today() }) },
  { label: "Last month", getRange: () => { const s = startOfMonth(subMonths(today(), 1)); return { from: s, to: endOfMonth(s) }; } },
];

/**
 * Compact 2-row taskbar for mobile, replacing the cramped desktop AppTaskbar.
 * Row 1: breadcrumb + Insights/Alerts/Run icons.
 * Row 2: full-width date chip.
 *
 * Only renders content meant for mobile — desktop continues to use <AppTaskbar />.
 */
export function MobileTaskbar({ breadcrumbItems, showDateRange = true, showRunButton = true, onRun, children }: Props) {
  const { dateRange, setDateRange } = useFilter();
  const { setDataPanel, dataPanel } = useActivePanel();
  const { criticalCount, openPanel: openInsights } = useInsights();

  const [draftRange, setDraftRange] = useState(dateRange);
  const [open, setOpen] = useState(false);

  useEffect(() => { if (open) setDraftRange(dateRange); }, [open, dateRange]);

  const apply = () => { setDateRange(draftRange); setOpen(false); };

  return (
    <div data-mobile-taskbar className="rounded-lg border border-primary/60 bg-card mx-3 mt-3 mb-2">
      {/* Row 1 */}
      <div className="flex items-center px-3 h-10 gap-2 border-b border-border/40">
        <nav className="flex items-center gap-0.5 text-[11px] min-w-0 flex-1">
          {breadcrumbItems?.map((item, i) => {
            const last = i === breadcrumbItems.length - 1;
            return (
              <div key={i} className="flex items-center gap-0.5 min-w-0">
                {i > 0 && <ChevronRight className="h-3 w-3 text-muted-foreground/50 shrink-0" />}
                {item.href && !last ? (
                  <Link to={item.href} className="text-muted-foreground hover:text-foreground truncate">{item.label}</Link>
                ) : (
                  <span className={cn("truncate", last ? "font-semibold text-foreground" : "text-muted-foreground")}>{item.label}</span>
                )}
              </div>
            );
          })}
        </nav>
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            onClick={openInsights}
            aria-label="Insights"
            className={cn("relative h-9 w-9 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted",
              dataPanel === "insights" && "text-primary bg-primary/10"
            )}
          >
            <Lightbulb className="h-4 w-4" />
            {criticalCount > 0 && <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-destructive" />}
          </button>
          <button
            onClick={() => setDataPanel(dataPanel === "notifications" ? "none" : "notifications")}
            aria-label="Alerts"
            className={cn("h-9 w-9 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted",
              dataPanel === "notifications" && "text-primary bg-primary/10"
            )}
          >
            <Bell className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Row 2 */}
      <div className="flex items-center px-3 py-2 gap-2">
        {showDateRange && (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button className="flex-1 min-w-0 h-9 px-2.5 inline-flex items-center gap-1.5 rounded-md bg-muted/40 hover:bg-muted text-[12px] font-medium text-foreground">
                <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="truncate tabular-nums">
                  {format(dateRange.from, "MMM dd")} – {format(dateRange.to, "MMM dd, yyyy")}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-[92vw] max-w-[360px] p-0" align="start" side="bottom">
              <div className="max-h-[70vh] overflow-auto">
                <div className="p-2 grid grid-cols-2 gap-1 border-b border-border">
                  {PRESETS.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => setDraftRange(p.getRange())}
                      className="text-left text-[12px] px-2 py-2 rounded hover:bg-muted text-foreground"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
                <Calendar
                  mode="range"
                  selected={{ from: draftRange.from, to: draftRange.to }}
                  onSelect={(r) => {
                    if (r?.from && r?.to) setDraftRange({ from: r.from, to: r.to });
                    else if (r?.from) setDraftRange({ from: r.from, to: r.from });
                  }}
                  numberOfMonths={1}
                  className="p-3 pointer-events-auto"
                />
                <div className="flex items-center justify-between px-3 pb-3 pt-2 border-t border-border">
                  <span className="text-[11px] text-muted-foreground tabular-nums">
                    {format(draftRange.from, "MMM dd")} – {format(draftRange.to, "MMM dd, yyyy")}
                  </span>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" className="h-8 text-[12px]" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button size="sm" className="h-8 text-[12px]" onClick={apply}>Apply</Button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}

        {children}

        {showRunButton && (
          <Button size="sm" className="h-9 px-3 gap-1 shrink-0" onClick={onRun}>
            <Play className="h-3.5 w-3.5" /> Run
          </Button>
        )}
      </div>
    </div>
  );
}
