// Sticky category rail — jump between category sections without long scroll.
// Rendered to the left of the queue on xl viewports.
import {
  Megaphone, Package, TrendingUp, MessageCircle, Users, Tag, Calendar,
  Sparkles, Bot, Clock, CheckCircle2, Folder, type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

interface RailItem {
  key: string;
  label: string;
  count: number;
}

interface Props {
  items: RailItem[];
  activeKey: string | null;
  onSelect: (key: string) => void;
}

export function CategoryRail({ items, activeKey, onSelect }: Props) {
  if (!items.length) return null;
  const totalCount = items.reduce((n, it) => n + it.count, 0);
  return (
    <nav
      aria-label="Categories"
      className="sticky top-4 flex flex-col gap-0.5 py-1 pr-1"
    >
      <div className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground px-2 pb-1.5">
        Categories
      </div>
      <button
        onClick={() => onSelect("__all__")}
        className={cn(
          "group flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors",
          activeKey === null || activeKey === "__all__"
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/40",
        )}
      >
        <Folder className="h-3.5 w-3.5 shrink-0" />
        <span className="text-[12.5px] font-medium truncate flex-1">All</span>
        <span className={cn(
          "text-[10.5px] font-semibold tabular-nums h-[18px] min-w-[20px] px-1.5 rounded-full flex items-center justify-center",
          (activeKey === null || activeKey === "__all__") ? "bg-primary/20 text-primary" : "bg-muted/70 text-muted-foreground",
        )}>
          {totalCount}
        </span>
      </button>
      {items.map((it) => {
        const Icon = ICON_FOR[it.label] ?? Folder;
        const active = activeKey === it.key;
        return (
          <button
            key={it.key}
            onClick={() => onSelect(it.key)}
            className={cn(
              "group flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors",
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40",
            )}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            <span className="text-[12.5px] font-medium truncate flex-1">{it.label}</span>
            <span className={cn(
              "text-[10.5px] font-semibold tabular-nums h-[18px] min-w-[20px] px-1.5 rounded-full flex items-center justify-center",
              active ? "bg-primary/20 text-primary" : "bg-muted/70 text-muted-foreground",
            )}>
              {it.count}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
