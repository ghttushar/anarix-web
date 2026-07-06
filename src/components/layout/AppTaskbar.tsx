import { useState, useEffect, ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { ViewBadge } from "@/components/layout/ViewBadge";
import { AanAutonomyBadge } from "@/components/aan/autonomous/AanAutonomyBadge";
import { useAanEvents } from "@/components/aan/autonomous/AanEventsContext";
import { MobileTaskbar } from "@/views/mobile/MobileTaskbar";
import { useViewport } from "@/contexts/ViewportContext";

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
  shopify: null,
  tiktok: null,
};

const MARKETPLACE_COLORS: Record<string, string> = {
  amazon: "#FF9900",
  walmart: "#0071CE",
  shopify: "#96BF48",
  tiktok: "#000000",
};

function ShopifyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M15.34 3.03c-.07 0-.13.04-.15.1-.02.05-.46 1.06-.46 1.06s-.93-.19-.93-.19c-.05-.38-.26-.68-.56-.87a3.07 3.07 0 0 0-.47-.24c-.14-.46-.38-.86-.7-1.09-.55-.4-1.22-.4-1.78-.02-.18.12-.34.29-.47.49-.28-.07-.52-.04-.71.09a.96.96 0 0 0-.36.55c-.14.54.09 1.22.53 1.95-.42.13-.71.32-.73.34l.05.2c.03 0 .79-.42 1.71-.42h.11c.56.02 1.01.2 1.34.53.25.25.42.58.5.96l.02.1 4.16 1.01a.17.17 0 0 0 .2-.12L17.09 4a.17.17 0 0 0-.11-.2l-1.64-.77zM9.73 4.13c.09-.19.23-.35.39-.46.39-.27.87-.27 1.28.04.19.14.36.37.48.68-.35-.04-.72 0-1.08.12-.35-.47-.53-.94-.43-1.32a.56.56 0 0 1 .22-.34c.09-.06.19-.07.32-.04-.06.1-.12.21-.18.32zm1.47 1.1c-.35-.32-.78-.5-1.3-.52h-.1c-.46 0-.85.1-1.17.22.05.08.1.17.16.25.27.4.6.73.96.97.47-.23.99-.37 1.53-.37-.02-.18-.05-.37-.08-.55z" />
      <path d="M20.42 6.64l-4.8-1.17-.42 1.63-1.34-.32c-.1-.4-.3-.74-.58-1.01-.4-.38-.93-.59-1.56-.61h-.12c-.76 0-1.39.27-1.87.53l-.29.17 1.04 12.29 6.6 1.85 4.4-1.6-1.06-11.76zm-5.6 2.37l-.66 2.02s-.72-.39-1.6-.32c-1.29.09-1.3.89-1.29 1.1.07 1.14 3.07 1.39 3.24 4.07.13 2.1-1.12 3.54-2.92 3.66-2.17.14-3.36-1.14-3.36-1.14l.46-1.96s1.2.92 2.16.85c.63-.04.85-.55.83-.91-.09-1.49-2.53-1.4-2.69-3.85-.13-2.07 1.23-4.16 4.22-4.35 1.15-.07 1.74.22 1.74.22l-.13.61z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.8.1V9.01a6.27 6.27 0 0 0-1-.08 6.27 6.27 0 0 0-6.27 6.27A6.27 6.27 0 0 0 9.29 21.5a6.27 6.27 0 0 0 6.27-6.27V8.98a8.22 8.22 0 0 0 4.03 1.05V6.69z" />
    </svg>
  );
}

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
}

export function AppTaskbar({ showAdType = false, showFrequency = false, showDateRange = false, showRunButton = false, onRun, children, breadcrumbItems }: AppTaskbarProps) {
  const { view } = useViewport();
  // Mobile delegates to a purpose-built taskbar.
  if (view === "mobile") {
    return (
      <MobileTaskbar
        breadcrumbItems={breadcrumbItems}
        showDateRange={showDateRange}
        showRunButton={showRunButton}
        onRun={onRun}
      >
        {children}
      </MobileTaskbar>
    );
  }
  const { adType, setAdType, frequency, setFrequency, dateRange, setDateRange } = useFilter();
  const { effects } = useVisualEffects();
  const { setDataPanel, hasAnyPanel } = useActivePanel();
  const { marketplace } = useMarketplace();
  const { currentAccount } = useAccounts();
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
  const accountName = currentAccount?.merchantName || "No Account";
  const accountStatus = currentAccount?.status || "connected";
  const lastSyncTime = currentAccount?.lastSync
    ? format(new Date(currentAccount.lastSync), "MMM d, h:mm a")
    : format(new Date(), "MMM d, h:mm a");

  const renderMarketplaceLogo = () => {
    if (marketplaceLogo) {
      return <img src={marketplaceLogo} alt={marketplace} className="h-4 w-auto object-contain" />;
    }
    if (marketplace === "shopify") {
      return <ShopifyIcon className="h-4 w-4" />;
    }
    if (marketplace === "tiktok") {
      return <TikTokIcon className="h-4 w-4" />;
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
  const hasRow2 = showAdType || showFrequency || showDateRange || showRunButton || children || true;

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
            <ViewBadge />
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
          {islandOff && (
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
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 relative" onClick={() => setDataPanel("aan-inbox")}>
                    <Inbox className="h-3.5 w-3.5" />
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
                  <p>Aan Inbox{aanPendingCount > 0 ? ` (${aanPendingCount})` : ""}</p>
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
              <div className="pl-1 border-l border-border ml-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => navigate("/alerts")}>
                      <Bell className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom"><p>Alerts</p></TooltipContent>
                </Tooltip>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
