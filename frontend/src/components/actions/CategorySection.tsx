// Category section — collapsible section per bucket inside a tab.
// Accordion-aware: if `open` and `onToggle` are provided, external state wins.
// Falls back to internal state otherwise. Collapsed by default.
import { useState, forwardRef } from "react";
import {
  ChevronDown, ChevronRight, Megaphone, Package, TrendingUp, MessageCircle,
  Users, Tag, Calendar, Sparkles, Bot, Clock, CheckCircle2, Folder,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  count: number;
  defaultOpen?: boolean;
  open?: boolean;
  onToggle?: () => void;
  children: React.ReactNode;
  aggregate?: string;
}

const ICON_FOR: Record<string, LucideIcon> = {
  "Advertising": Megaphone,
  "Inventory": Package,
  "Profitability": TrendingUp,
  "Customer Service": MessageCircle,
  "Buyer / Accounts": Users,
  "Retail Listings": Tag,
  "Amazon": Calendar,
  "Walmart": Calendar,
  "Internal": Calendar,
  "Customer Calls": MessageCircle,
  "Insights": Sparkles,
  "Trends": TrendingUp,
  "Market Changes": TrendingUp,
  "Competitor Updates": Sparkles,
  "Automated": Bot,
  "Pending This Week": Clock,
  "Completed Today": CheckCircle2,
  "Completed This Week": CheckCircle2,
};

export const CategorySection = forwardRef<HTMLElement, Props>(function CategorySection(
  { label, count, defaultOpen = false, open, onToggle, children, aggregate },
  ref,
) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const toggle = () => {
    if (onToggle) onToggle();
    if (!isControlled) setInternalOpen((v) => !v);
  };
  if (count === 0) return null;
  const Icon = ICON_FOR[label] ?? Folder;
  return (
    <section ref={ref} className="mb-2" data-category-key={label}>
      <button
        onClick={toggle}
        className={cn(
          "w-full flex items-center gap-2 px-2 py-2 text-left rounded-md",
          "transition-colors hover:bg-muted/40 group",
          isOpen && "bg-muted/30",
        )}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        )}
        <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <span className="text-[12.5px] font-semibold text-foreground/85 tracking-tight">
          {label}
        </span>
        <span className="text-[10.5px] font-semibold text-muted-foreground tabular-nums h-[18px] min-w-[20px] px-1.5 rounded-full bg-muted/60 flex items-center justify-center">
          {count}
        </span>
        <span className="ml-1 flex-1 h-px bg-border/50" />
        {aggregate && (
          <span className="text-[11px] text-muted-foreground tabular-nums shrink-0">{aggregate}</span>
        )}
      </button>
      {isOpen && (
        <div className="mt-1 rounded-lg border border-border/60 bg-card overflow-hidden animate-in fade-in duration-150">
          {children}
        </div>
      )}
    </section>
  );
});
