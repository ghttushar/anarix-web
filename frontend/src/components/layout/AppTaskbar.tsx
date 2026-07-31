import { useState, useEffect, ReactNode } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CalendarIcon, Play, Bell, Lightbulb, RefreshCw, Clock, ChevronRight, Inbox } from "lucide-react";
import { AanGlyph } from "@/components/aan/AanGlyph";
import { format, subDays, startOfWeek, endOfWeek, subWeeks, startOfMonth, endOfMonth, subMonths, startOfQuarter, endOfQuarter, subQuarters } from "date-fns";

import { cn } from "@/lib/utils";
import { useFilter } from "@/contexts/FilterContext";
import { useVisualEffects } from "@/contexts/VisualEffectsContext";
import { useActivePanel } from "@/contexts/ActivePanelContext";
import { useMarketplace } from "@/contexts/MarketplaceContext";
import { useAccounts } from "@/contexts/AccountContext";
import { useAan } from "@/components/aan";
import { useInsights } from "@/components/insights";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import amazonLogo from "@/assets/amazon-logo.png";
import walmartLogo from "@/assets/walmart-logo.png";
import { AanAutonomyBadge } from "@/components/aan/autonomous/AanAutonomyBadge";
import { useAanEvents } from "@/components/aan/autonomous/AanEventsContext";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface DatePreset {
  label: string;
  getRange: () => { from: Date; to: Date };
}

const today = () => new Date();

const DATE_PRESET_GROUPS: { label: string; presets: DatePreset[] }[] = [
  {
    label: "Days",
    presets: [
      { label: "Today", getRange: () => ({ from: today(), to: today() }) },
      { label: "Yesterday", getRange: () => { const d = subDays(today(), 1); return { from: d, to: d }; } },
      { label: "Last 3 days", getRange: () => ({ from: subDays(today(), 2), to: today() }) },
      { label: "Last 7 days", getRange: () => ({ from: subDays(today(), 6), to: today() }) },
      { label: "Last 14 days", getRange: () => ({ from: subDays(today(), 13), to: today() }) },
      { label: "Last 30 days", getRange: () => ({ from: subDays(today(), 29), to: today() }) },
      { label: "Last 60 days", getRange: () => ({ from: subDays(today(), 59), to: today() }) },
    ],
  },
  {
    label: "Weeks",
    presets: [
      { label: "This week", getRange: () => ({ from: startOfWeek(today()), to: today() }) },
      { label: "Last week", getRange: () => { const s = startOfWeek(subWeeks(today(), 1)); return { from: s, to: endOfWeek(s) }; } },
      { label: "2 weeks ago", getRange: () => { const s = startOfWeek(subWeeks(today(), 2)); return { from: s, to: endOfWeek(s) }; } },
    ],
  },
  {
    label: "Months",
    presets: [
      { label: "This month", getRange: () => ({ from: startOfMonth(today()), to: today() }) },
      { label: "Last month", getRange: () => { const s = startOfMonth(subMonths(today(), 1)); return { from: s, to: endOfMonth(s) }; } },
      { label: "Last 3 months", getRange: () => ({ from: subMonths(today(), 3), to: today() }) },
    ],
  },
  {
    label: "Quarters",
    presets: [
      { label: "This quarter", getRange: () => ({ from: startOfQuarter(today()), to: today() }) },
      { label: "Last quarter", getRange: () => { const s = startOfQuarter(subQuarters(today(), 1)); return { from: s, to: endOfQuarter(s) }; } },
    ],
  },
];

const MARKETPLACE_LOGOS: Record<string, string | null> = {
  amazon: amazonLogo,
  walmart: walmartLogo,
};

const MARKETPLACE_COLORS: Record<string, string> = {
  amazon: "#FF9900",
  walmart: "#0071CE",
};


function StatusDot({ status, className }: { status: "connected" | "syncing" | "error"; className?: string }) {
  const colors = { connected: "bg-emerald-500", syncing: "bg-amber-500", error: "bg-red-500" };
  return <div className={cn("h-2 w-2 rounded-full", colors[status], className)} />;
}

interface AppTaskbarProps {
  showAdType?: boolean;
  showFrequency?: boolean;
  showDateRange?: boolean;
  showRunButton?: boolean;
  onRun?: () => void;
  children?: ReactNode;
  breadcrumbItems?: BreadcrumbItem[];
  /** Optional override — when provided, the taskbar date picker reads/writes
   *  these instead of the global FilterContext (used by /alerts). */
  dateRangeOverride?: { from: Date; to: Date };
  onDateRangeOverrideChange?: (r: { from: Date; to: Date }) => void;
  /** Hide the right-side utility cluster (Insights/Signals/Aan/Refresh) that appears when the FAI is off. */
  hideUtilityCluster?: boolean;
}

export function AppTaskbar({ showAdType = false, showFrequency = false, showDateRange = false, showRunButton = false, onRun, children, breadcrumbItems, dateRangeOverride, onDateRangeOverrideChange, hideUtilityCluster = false }: AppTaskbarProps) {
  const location = useLocation();
  const { adType, setAdType, frequency, setFrequency, dateRange: ctxDateRange, setDateRange: setCtxDateRange } = useFilter();
  const dateRange = dateRangeOverride ?? ctxDateRange;
  const setDateRange = onDateRangeOverrideChange ?? setCtxDateRange;
  const { effects } = useVisualEffects();
  const { setDataPanel, hasAnyPanel } = useActivePanel();
  const { marketplace } = useMarketplace();
  const { currentAccount, currentRegion, currentAccountGroup } = useAccounts();
  const { openPanel: openAan } = useAan();
  const { openPanel: openInsights } = useInsights();
  const { pendingCount: aanPendingCount, criticalCount: aanCriticalCount } = useAanEvents();
  const navigate = useNavigate();
  const islandOff = !effects.floatingIsland;

  const [draftRange, setDraftRange] = useState<{ from: Date; to: Date }>(dateRange);
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);

  useEffect(() => {
    if (datePopoverOpen) {
      setDraftRange(dateRange);
    }
  }, [datePopoverOpen]);

  // Hide the app taskbar entirely on the Signals page.
  if (location.pathname.startsWith("/alerts")) {
    return null;
  }

  const handleApplyDateRange = () => {
    setDateRange(draftRange);
    setDatePopoverOpen(false);
  };

  const handleCancelDateRange = () => {
    setDatePopoverOpen(false);
  };

  const handlePresetClick = (preset: DatePreset) => {
    const range = preset.getRange();
    setDraftRange(range);
  };

  const marketplaceLogo = MARKETPLACE_LOGOS[marketplace];
  const marketplaceColor = MARKETPLACE_COLORS[marketplace];
  const isAmazonRegion = marketplace === "amazon" && currentRegion && currentAccountGroup;
  const accountName = isAmazonRegion
    ? `${currentAccountGroup!.name} — ${currentRegion!.region}`
    : currentAccount?.merchantName || "No Account";
  const accountStatus = isAmazonRegion
    ? currentRegion!.status
    : currentAccount?.status || "connected";
  const lastSyncTime = isAmazonRegion
    ? (currentRegion!.lastSync
        ? format(new Date(currentRegion!.lastSync), "MMM d, h:mm a")
        : format(new Date(), "MMM d, h:mm a"))
    : currentAccount?.lastSync
      ? format(new Date(currentAccount.lastSync), "MMM d, h:mm a")
      : format(new Date(), "MMM d, h:mm a");

  const renderMarketplaceLogo = () => {
    if (marketplaceLogo) {
      return <img src={marketplaceLogo} alt={marketplace} className="h-4 w-auto object-contain" />;
    }
    return null;
  };

  const renderBreadcrumb = () => {
    if (!breadcrumbItems || breadcrumbItems.length === 0) return null;
    return (
      <nav className="flex items-center gap-0.5 text-xs shrink-0">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          return (
            <div key={index} className="flex items-center gap-0.5">
              {index > 0 && <ChevronRight className="h-3 w-3 text-muted-foreground/50" />}
              {item.href && !isLast ? (
                <Link to={item.href} className="text-muted-foreground hover:text-foreground transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className={cn(isLast ? "font-medium text-foreground" : "text-muted-foreground")}>
                  {item.label}
                </span>
              )}
            </div>
          );
        })}
      </nav>
    );
  };

  const hasRow1 = true; // always show account/sync info
  const hasRow2 = showAdType || showFrequency || showDateRange || showRunButton || !!children || (islandOff && !hideUtilityCluster);

  return (
    <div data-app-taskbar data-tour-id="taskbar" className="flex flex-col rounded-lg border bg-card shrink-0 sticky top-0 z-30 border-primary">
      {/* Row 1: Breadcrumb left, Account + Sync right */}
      {hasRow1 && (
        <div className={cn(
          "flex items-center justify-between px-4 py-2",
          hasRow2 && "border-b border-border/30"
        )}>
          <div className="flex items-center gap-2 min-w-0">
            {renderBreadcrumb()}
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {/* Marketplace + Account */}
            <div className="flex items-center gap-1.5" style={{ color: marketplaceColor }}>
              {renderMarketplaceLogo()}
            </div>
            <StatusDot status={accountStatus} className="h-1.5 w-1.5" />
            <span className="taskbar-account-name text-xs font-medium text-foreground truncate max-w-[120px]">{accountName}</span>
            <div className="h-3.5 w-px bg-border taskbar-account-name" />
            {/* Last synced */}
            <Clock className="h-3 w-3 text-muted-foreground taskbar-last-synced" />
            <span className="taskbar-last-synced text-[11px] text-muted-foreground whitespace-nowrap">Last synced: {lastSyncTime}</span>
            <div className="h-3.5 w-px bg-border" />
            <AanAutonomyBadge />
          </div>
        </div>
      )}

      {/* Row 2: Filters/children left, island-off actions + bell right */}
      {hasRow2 && (
        <div className="flex items-center px-4 py-2 gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0 flex-wrap">
            {showAdType && (
              <div className="flex items-center gap-1.5 rounded-md bg-muted/40 px-2.5 py-1">
                <span className="taskbar-filter-label text-sm font-medium text-muted-foreground whitespace-nowrap">Ad Type</span>
                <Select value={adType} onValueChange={(v) => setAdType(v as any)}>
                  <SelectTrigger className="h-8 w-[110px] text-sm border-0 bg-transparent shadow-none px-1.5 cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All" className="text-xs cursor-pointer">All Types</SelectItem>
                    <SelectItem value="SP" className="text-xs cursor-pointer">Sponsored Products</SelectItem>
                    <SelectItem value="SB" className="text-xs cursor-pointer">Sponsored Brands</SelectItem>
                    <SelectItem value="SD" className="text-xs cursor-pointer">Sponsored Display</SelectItem>
                    <SelectItem value="SV" className="text-xs cursor-pointer">Sponsored Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {showFrequency && (
              <div className="flex items-center gap-1.5 rounded-md bg-muted/40 px-2.5 py-1">
                <span className="taskbar-filter-label text-sm font-medium text-muted-foreground whitespace-nowrap">Frequency</span>
                <Select value={frequency} onValueChange={(v) => setFrequency(v as any)}>
                  <SelectTrigger className="h-8 w-[90px] text-sm border-0 bg-transparent shadow-none px-1.5 cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Daily", "Weekly", "Monthly"].map((f) => (
                      <SelectItem key={f} value={f} className="text-xs cursor-pointer">{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {showDateRange && (
              <div className="flex items-center gap-1.5 rounded-md bg-muted/40 px-2.5 py-1">
                <span className="taskbar-filter-label text-sm font-medium text-muted-foreground whitespace-nowrap">Date Range</span>
                <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-sm font-normal px-1.5 cursor-pointer">
                      <CalendarIcon className="h-3 w-3" />
                      {format(dateRange.from, "MMM dd")} – {format(dateRange.to, "MMM dd, yyyy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start" side="bottom">
                    <div className="flex">
                      <div className="w-[200px] border-r border-border py-3 space-y-4 max-h-[420px] overflow-auto bg-muted/30">
                        {DATE_PRESET_GROUPS.map((group) => (
                          <div key={group.label}>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-4 mb-1.5">{group.label}</p>
                            <div className="space-y-0.5 px-2">
                              {group.presets.map((preset) => {
                                const presetRange = preset.getRange();
                                const isSelected =
                                  draftRange.from.toDateString() === presetRange.from.toDateString() &&
                                  draftRange.to.toDateString() === presetRange.to.toDateString();
                                return (
                                  <button
                                    key={preset.label}
                                    onClick={() => handlePresetClick(preset)}
                                    className={cn(
                                      "w-full text-left text-xs px-3 py-2 rounded-md transition-colors cursor-pointer font-medium",
                                      isSelected
                                        ? "bg-primary/10 text-primary"
                                        : "text-foreground hover:bg-muted"
                                    )}
                                  >
                                    {preset.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-col">
                        <Calendar
                          mode="range"
                          selected={{ from: draftRange.from, to: draftRange.to }}
                          onSelect={(range) => {
                            if (range?.from && range?.to) {
                              setDraftRange({ from: range.from, to: range.to });
                            } else if (range?.from) {
                              setDraftRange({ from: range.from, to: range.from });
                            }
                          }}
                          numberOfMonths={2}
                          className="p-4 pointer-events-auto"
                        />
                        <div className="flex items-center justify-between px-4 pb-3 border-t border-border pt-3">
                          <p className="text-xs text-muted-foreground">
                            {format(draftRange.from, "MMM dd, yyyy")} – {format(draftRange.to, "MMM dd, yyyy")}
                          </p>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="h-8 text-xs px-4" onClick={handleCancelDateRange}>Cancel</Button>
                            <Button size="sm" className="h-8 text-xs px-4" onClick={handleApplyDateRange}>Apply</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {children}

            {showRunButton && (
              <Button size="sm" className="gap-1.5 h-8" onClick={onRun}>
                <Play className="h-3.5 w-3.5" />Run
              </Button>
            )}
          </div>

          {/* Right: utility cluster — only when the Floating Action Island is off, to keep parity without duplication */}
          {islandOff && !hideUtilityCluster && (
            <div className="flex items-center gap-0.5 ml-auto shrink-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openInsights()}>
                    <Lightbulb className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom"><p>Insights</p></TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 relative" onClick={() => navigate("/alerts")}>
                    <Bell className="h-3.5 w-3.5" />
                    {aanPendingCount > 0 && (
                      <span className={cn(
                        "absolute -top-0.5 -right-0.5 flex h-3.5 min-w-[14px] items-center justify-center rounded-full px-1 text-[9px] font-bold",
                        aanCriticalCount > 0 ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground"
                      )}>
                        {aanPendingCount}
                      </span>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Signals{aanPendingCount > 0 ? ` (${aanPendingCount})` : ""}</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openAan()}>
                    <AanGlyph className="h-4 w-4 text-primary" staticEyes />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom"><p>Ask Aan</p></TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => toast.info("Refreshing data...")}>
                    <RefreshCw className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom"><p>Refresh</p></TooltipContent>
              </Tooltip>
            </div>
          )}


        </div>
      )}
    </div>
  );
}
