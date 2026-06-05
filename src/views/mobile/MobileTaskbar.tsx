import { ReactNode, useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CalendarIcon,
  Play,
  Bell,
  ArrowLeft,
  Lightbulb,
} from "lucide-react";
import {
  format,
  subDays,
  startOfMonth,
  startOfWeek,
  endOfWeek,
  subWeeks,
  endOfMonth,
  subMonths,
} from "date-fns";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useFilter } from "@/contexts/FilterContext";
import { useActivePanel } from "@/contexts/ActivePanelContext";
import { useInsights } from "@/components/insights";
import { AanGlyph } from "@/components/aan/AanGlyph";

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
const QUICK_PRESETS = [
  { label: "Today", getRange: () => ({ from: today(), to: today() }) },
  { label: "7D", getRange: () => ({ from: subDays(today(), 6), to: today() }) },
  { label: "14D", getRange: () => ({ from: subDays(today(), 13), to: today() }) },
  { label: "30D", getRange: () => ({ from: subDays(today(), 29), to: today() }) },
  { label: "MTD", getRange: () => ({ from: startOfMonth(today()), to: today() }) },
  { label: "This week", getRange: () => ({ from: startOfWeek(today()), to: today() }) },
  {
    label: "Last week",
    getRange: () => {
      const s = startOfWeek(subWeeks(today(), 1));
      return { from: s, to: endOfWeek(s) };
    },
  },
  {
    label: "Last month",
    getRange: () => {
      const s = startOfMonth(subMonths(today(), 1));
      return { from: s, to: endOfMonth(s) };
    },
  },
  { label: "Yesterday", getRange: () => { const d = subDays(today(), 1); return { from: d, to: d }; } },
];

/**
 * Mobile AppLevelBar — sticky under top bar. Card style (bg-card + border)
 * so it visibly anchors as a working surface. Three zones:
 *   [Back/parent? | Date | Aan · Insight · Alert]
 * Back pill only renders on drill-down routes (breadcrumb depth >= 3 OR
 * pathname depth >= 3 segments). Home/top-level pages stay clean.
 */
export function MobileTaskbar({
  breadcrumbItems,
  showDateRange = true,
  showRunButton = false,
  onRun,
  children,
}: Props) {
  const { dateRange, setDateRange } = useFilter();
  const { setDataPanel, dataPanel } = useActivePanel();
  const { criticalCount } = useInsights();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [draftRange, setDraftRange] = useState(dateRange);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) setDraftRange(dateRange);
  }, [open, dateRange]);

  const apply = () => {
    setDateRange(draftRange);
    setOpen(false);
  };

  const isDrillDown = useMemo(() => {
    const segs = pathname.split("/").filter(Boolean).length;
    const bcDepth = breadcrumbItems?.length ?? 0;
    return segs >= 3 || bcDepth >= 3;
  }, [pathname, breadcrumbItems]);

  const parent = isDrillDown && breadcrumbItems && breadcrumbItems.length >= 2
    ? breadcrumbItems[breadcrumbItems.length - 2]
    : null;
  const current = breadcrumbItems?.[breadcrumbItems.length - 1];

  const onAan = false;
  const onInsights = dataPanel === "insights";
  const onAlerts = dataPanel === "notifications";

  const hasSecondRow = !!children || showRunButton;

  return (
    <div
      data-mobile-taskbar
      className="sticky top-14 z-30 px-3 pt-2 pb-1 bg-background"
    >
      <div className="rounded-lg border border-border bg-card shadow-sm">
        {/* Row A — Selectors (back pill + date) ............................. */}
        <div className="flex items-center px-2 py-1.5 gap-2 min-w-0">
          {parent && (
            <button
              onClick={() => (parent.href ? navigate(parent.href) : navigate(-1))}
              className="h-8 inline-flex items-center gap-1 pl-1 pr-2 rounded-md text-[12px] font-semibold text-foreground active:bg-muted min-w-0 max-w-[40vw] shrink-0"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="truncate">{current?.label ?? parent.label}</span>
            </button>
          )}

          {showDateRange && (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <button className="h-8 px-2 inline-flex items-center gap-1.5 rounded-md bg-muted/60 text-[11px] font-medium text-foreground active:bg-muted min-w-0">
                  <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="tabular-nums truncate">
                    {format(dateRange.from, "MMM dd")}–{format(dateRange.to, "MMM dd")}
                  </span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-[92vw] max-w-[360px] p-0" align="start" side="bottom">
                <div className="max-h-[72vh] overflow-auto">
                  <div className="px-3 pt-3 pb-2 flex gap-1.5 overflow-x-auto no-scrollbar border-b border-border">
                    {QUICK_PRESETS.map((p) => (
                      <button
                        key={p.label}
                        onClick={() => setDraftRange(p.getRange())}
                        className="h-7 px-2.5 rounded-full bg-muted/50 active:bg-muted text-[11px] font-medium text-foreground whitespace-nowrap shrink-0"
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
                      <Button variant="outline" size="sm" className="h-8 text-[12px]" onClick={() => setOpen(false)}>
                        Cancel
                      </Button>
                      <Button size="sm" className="h-8 text-[12px]" onClick={apply}>
                        Apply
                      </Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}

          {/* Spacer pushes action cluster to the right */}
          <div className="flex-1 min-w-0" />

          {/* Right — separated action cluster (Aan / Insight / Alert) */}
          <div className="flex items-center gap-0.5 shrink-0 pl-2 ml-1 border-l border-border/60">
            <ActionButton
              ariaLabel="Aan"
              label="Aan"
              active={onAan}
              onClick={() => navigate("/aan")}
              icon={<AanGlyph state="idle" className="h-4 w-4 aan-gradient-text" />}
            />
            <ActionButton
              ariaLabel="Insight"
              label="Insight"
              active={onInsights}
              onClick={() => setDataPanel(dataPanel === "insights" ? "none" : "insights")}
              icon={<Lightbulb className="h-3.5 w-3.5" />}
            />
            <ActionButton
              ariaLabel="Alert"
              label="Alert"
              active={onAlerts}
              badge={criticalCount > 0}
              onClick={() => setDataPanel(dataPanel === "notifications" ? "none" : "notifications")}
              icon={<Bell className="h-3.5 w-3.5" />}
            />
          </div>
        </div>

        {/* Row B — page-provided selectors/filter chips */}
        {!!children && (
          <div className="px-2 py-1.5 gap-1.5 border-t border-border/40 flex flex-wrap items-center" style={{ maxHeight: "calc(36px * 3 + 12px)", overflowY: "auto" }}>
            {children}
          </div>
        )}

        {/* Row C — Run CTA, clearly separated */}
        {showRunButton && (
          <div className="flex items-center justify-end px-2 py-1.5 border-t border-border/40">
            <Button size="sm" className="h-8 px-3 gap-1" onClick={onRun}>
              <Play className="h-3.5 w-3.5" /> Run
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function ActionButton({
  icon,
  label,
  ariaLabel,
  active,
  badge,
  onClick,
}: {
  icon: ReactNode;
  label?: string;
  ariaLabel: string;
  active?: boolean;
  badge?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={active || undefined}
      data-active={active || undefined}
      className={cn(
        "relative h-8 rounded-md flex items-center gap-1 px-2 text-[11px] font-medium select-none transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground active:bg-muted"
      )}
    >
      {icon}
      {label && <span className="hidden min-[360px]:inline leading-none">{label}</span>}
      {badge && !active && (
        <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-destructive" />
      )}
    </button>
  );
}
