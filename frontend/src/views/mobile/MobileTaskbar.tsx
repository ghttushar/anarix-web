import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { CalendarIcon, ChevronRight } from "lucide-react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFilter } from "@/contexts/FilterContext";
import { useMarketplace } from "@/contexts/MarketplaceContext";
import { useAccounts } from "@/contexts/AccountContext";
import { resolvePageTitle } from "./pageTitleByRoute";
import { cn } from "@/lib/utils";
import amazonLogo from "@/assets/amazon-logo.png";
import walmartLogo from "@/assets/walmart-logo.png";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Props {
  breadcrumbItems?: BreadcrumbItem[];
  showDateRange?: boolean;
  showFrequency?: boolean;
  // Run button is intentionally ignored on mobile (view-only spec).
  showRunButton?: boolean;
  onRun?: () => void;
  // Children (filter chips, etc.) ignored on mobile to keep app-level bar clean.
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
];

/**
 * Mobile App-Level Selector — sticky directly under the top bar. Three rows:
 *   Row 1: Breadcrumb (text only).
 *   Row 2: Account chip + Marketplace chip (read-only display).
 *   Row 3: Date Range + Frequency. Run button hidden on mobile.
 */
export function MobileTaskbar({
  breadcrumbItems,
  showDateRange = true,
  showFrequency = true,
}: Props) {
  const { pathname } = useLocation();
  const { dateRange, setDateRange, frequency, setFrequency } = useFilter();
  const { marketplace } = useMarketplace();
  const { currentAccount } = useAccounts();
  const { title } = resolvePageTitle(pathname);

  const [draftRange, setDraftRange] = useState(dateRange);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (open) setDraftRange(dateRange);
  }, [open, dateRange]);

  const apply = () => {
    setDateRange(draftRange);
    setOpen(false);
  };

  // Breadcrumb: prefer provided items, else derive a short chain from the title.
  const crumbs = breadcrumbItems && breadcrumbItems.length > 0
    ? breadcrumbItems
    : ([{ label: title }] as BreadcrumbItem[]);

  const marketplaceLabel: Record<string, string> = {
    amazon: "Amazon",
    walmart: "Walmart",
    shopify: "Shopify",
    tiktok: "TikTok",
  };

  return (
    <div
      data-mobile-taskbar
      className="sticky top-14 z-30 px-3 pt-2 pb-1 bg-background"
    >
      <div className="rounded-lg border border-border bg-card shadow-sm">
        {/* Row 1 — breadcrumb */}
        <div className="px-3 py-2 text-[11px] text-muted-foreground flex items-center gap-1 min-w-0 border-b border-border/40 overflow-hidden">
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-1 min-w-0">
              {i > 0 && <ChevronRight className="h-3 w-3 opacity-50 shrink-0" />}
              <span
                className={cn(
                  "truncate",
                  i === crumbs.length - 1 ? "text-foreground font-medium" : "text-muted-foreground"
                )}
              >
                {c.label}
              </span>
            </span>
          ))}
        </div>

        {/* Row 2 — account + marketplace */}
        <div className="px-2 py-1.5 flex items-center gap-2 border-b border-border/40">
          <Chip className="flex-1 min-w-0">
            <span className="text-[10px] text-muted-foreground shrink-0">Account</span>
            <span className="text-[12px] text-foreground font-semibold truncate">
              {currentAccount?.merchantName ?? "—"}
            </span>
          </Chip>
          <Chip className="flex-1 min-w-0">
            <MpDot id={marketplace} />
            <span className="text-[12px] text-foreground font-semibold truncate">
              {marketplaceLabel[marketplace] ?? marketplace}
            </span>
          </Chip>
        </div>

        {/* Row 3 — date + frequency. Run hidden. */}
        <div className="px-2 py-1.5 flex items-center gap-2">
          {showDateRange && (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <button className="h-9 flex-1 px-2.5 inline-flex items-center gap-1.5 rounded-md bg-muted/60 text-[12px] font-medium text-foreground active:bg-muted min-w-0">
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

          {showFrequency && (
            <Select value={frequency} onValueChange={(v) => setFrequency(v as any)}>
              <SelectTrigger className="h-9 w-[110px] text-[12px] bg-muted/60 border-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Daily", "Weekly", "Monthly"].map((f) => (
                  <SelectItem key={f} value={f} className="text-[12px]">{f}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
    </div>
  );
}

function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "h-9 px-2.5 inline-flex items-center gap-1.5 rounded-md bg-muted/60 min-w-0",
        className
      )}
    >
      {children}
    </div>
  );
}

function MpDot({ id }: { id: string }) {
  if (id === "amazon") return <img src={amazonLogo} alt="" className="h-3.5 w-3.5 object-contain shrink-0" />;
  if (id === "walmart") return <img src={walmartLogo} alt="" className="h-3.5 w-3.5 object-contain shrink-0" />;
  const color = id === "shopify" ? "#96BF48" : "#000000";
  return <span className="h-2 w-2 rounded-full shrink-0" style={{ background: color }} />;
}
