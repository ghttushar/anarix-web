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
 * Mobile AppLevelBar — sticky row directly below TopBar.
 * Uses a 3-zone grid (left: back/title, center: date, right: actions).
 * Sticky at top-14 (below TopBar).
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

  const parent = useMemo(() => {
    if (!breadcrumbItems || breadcrumbItems.length < 2) return null;
    return breadcrumbItems[breadcrumbItems.length - 2];
  }, [breadcrumbItems]);
  const current = breadcrumbItems?.[breadcrumbItems.length - 1];

  const onAan = pathname.startsWith("/aan");
  const onInsights = dataPanel === "insights";
  const onAlerts = dataPanel === "notifications";

  const hasSecondRow = !!children || showRunButton;

  return (
    <div
      data-mobile-taskbar
      className="sticky top-14 z-20 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      {/* Row 1 — AppLevelBar. 3-zone grid: left / center / right. */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-2 h-11 gap-1">
        {/* Left — Back or current label (shrinakble) */}
        <div className="min-w-0 flex justify-start">
          {parent ? (
            <button
              onClick={() => (parent.href ? navigate(parent.href) : navigate(-1))}
              className="h-8 inline-flex items-center gap-1 pl-1 pr-2 rounded-md text-[12px] font-medium text-foreground hover:bg-muted max-w-full"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="truncate">{parent.label}</span>
            </button>
          ) : (
            current && (
              <span className="block px-2 text-[12px] font-semibold text-foreground truncate max-w-full">
                {current.label}
              </span>
            )
          )}
        </div>

        {/* Center — Date (stays centered) */}
        <div className="shrink-0 flex justify-center">
          {showDateRange && (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <button className="h-8 px-2 inline-flex items-center gap-1.5 rounded-md bg-muted/40 hover:bg-muted text-[12px] font-medium text-foreground">
                  <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="tabular-nums whitespace-nowrap">
                    {format(dateRange.from, "MMM dd")} – {format(dateRange.to, "MMM dd")}
                  </span>
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[92vw] max-w-[360px] p-0"
                align="center"
                side="bottom"
              >
                <div className="max-h-[72vh] overflow-auto">
                  <div className="px-3 pt-3 pb-2 flex gap-1.5 overflow-x-auto no-scrollbar border-b border-border">
                    {QUICK_PRESETS.map((p) => (
                      <button
                        key={p.label}
                        onClick={() => setDraftRange(p.getRange())}
                        className="h-7 px-2.5 rounded-full bg-muted/50 hover:bg-muted text-[11px] font-medium text-foreground whitespace-nowrap shrink-0"
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
        </div>

        {/* Right — Actions (shrinakble/flexible) */}
        <div className="min-w-0 flex justify-end gap-0.5">
          <ActionButton
            ariaLabel="Aan"
            label="Aan"
            active={onAan}
            onClick={() => navigate("/aan")}
            icon={<AanGlyph className="h-3.5 w-3.5 aan-gradient-text" />}
          />
          <ActionButton
            ariaLabel="Insights"
            label="Insights"
            active={onInsights}
            onClick={() => setDataPanel(dataPanel === "insights" ? "none" : "insights")}
            icon={<Lightbulb className="h-3.5 w-3.5" />}
          />
          <ActionButton
            ariaLabel="Alerts"
            label="Alerts"
            active={onAlerts}
            badge={criticalCount > 0}
            onClick={() => setDataPanel(dataPanel === "notifications" ? "none" : "notifications")}
            icon={<Bell className="h-3.5 w-3.5" />}
          />
        </div>
      </div>

      {/* Row 2 — page-provided filter chips + Run */}
      {hasSecondRow && (
        <div className="flex items-center px-3 py-2 gap-2 border-t border-border/40">
          <div className="flex-1 min-w-0 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {children}
          </div>
          {showRunButton && (
            <Button size="sm" className="h-9 px-3 gap-1 shrink-0" onClick={onRun}>
              <Play className="h-3.5 w-3.5" /> Run
            </Button>
          )}
        </div>
      )}
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
      className={cn(
        "relative h-8 rounded-md flex items-center gap-1 px-1.5 text-[11px] font-medium",
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      )}
    >
      {icon}
      {label && <span className="hidden min-[380px]:inline">{label}</span>}
      {badge && (
        <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-destructive" />
      )}
    </button>
  );
}
