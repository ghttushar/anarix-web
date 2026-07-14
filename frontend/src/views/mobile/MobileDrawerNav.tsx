import { useLocation, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  Store,
  Check,
  Sun,
  Moon,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { AnarixLogo } from "@/components/branding/AnarixLogo";
import { AanGlyph } from "@/components/aan/AanGlyph";
import { navigationGroups } from "@/components/layout/AppSidebar";
import { useFeatureToggle } from "@/contexts/FeatureToggleContext";
import { useMarketplace, Marketplace } from "@/contexts/MarketplaceContext";
import { useAccounts } from "@/contexts/AccountContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Separator } from "@/components/ui/separator";
import amazonLogo from "@/assets/amazon-logo.png";
import walmartLogo from "@/assets/walmart-logo.png";

// Mobile is read-only — block writable/agent pages.
const MOBILE_BLOCKED = new Set<string>([
  "/workspace",
  "/workspace/health-score",
  "/advertising/rules/agents",
]);

const MARKETPLACES: { id: Marketplace; label: string }[] = [
  { id: "amazon", label: "Amazon" },
  { id: "walmart", label: "Walmart" },
  { id: "shopify", label: "Shopify" },
  { id: "tiktok", label: "TikTok" },
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileDrawerNav({ open, onOpenChange }: Props) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { newFeaturesVisible } = useFeatureToggle();
  const { marketplace, setMarketplace } = useMarketplace();
  const { accounts, currentAccount, setCurrentAccount } = useAccounts();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const filteredGroups = navigationGroups
    .map((g) => ({
      ...g,
      items: g.items.filter(
        (i) => (newFeaturesVisible || !i.isNewFeature) && !MOBILE_BLOCKED.has(i.url)
      ),
    }))
    .filter((g) => g.items.length > 0);

  const [openGroups, setOpenGroups] = useState<Set<string>>(
    () =>
      new Set(
        filteredGroups
          .filter((g) => g.items.some((i) => pathname.startsWith(i.url)))
          .map((g) => g.label)
      )
  );
  const [expandedMp, setExpandedMp] = useState<Marketplace | null>(marketplace);

  const toggleGroup = (label: string) =>
    setOpenGroups((prev) => {
      const n = new Set(prev);
      n.has(label) ? n.delete(label) : n.add(label);
      return n;
    });

  const handleNav = (url: string) => {
    onOpenChange(false);
    navigate(url);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-[88vw] max-w-[340px] p-0 flex flex-col gap-0 bg-background"
      >
        {/* Header — logo + close */}
        <div className="h-14 shrink-0 px-3 flex items-center justify-between border-b border-border bg-card">
          <AnarixLogo variant="full" className="h-5 w-auto" />
          <button
            onClick={() => onOpenChange(false)}
            aria-label="Close navigation"
            className="h-9 w-9 rounded-md flex items-center justify-center active:bg-muted text-muted-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-auto py-2 px-2 flex flex-col">
          {/* Ask Aan */}
          <button
            onClick={() => handleNav("/aan")}
            className="group relative w-full flex items-center gap-2 h-11 rounded-md border border-border bg-card px-3 text-[13px] font-medium text-foreground active:bg-muted mb-2"
          >
            <span className="absolute inset-0 rounded-md aan-gradient opacity-[0.06]" aria-hidden />
            <AanGlyph className="h-4 w-4 aan-gradient-text relative" staticEyes />
            <span className="relative aan-gradient-text font-semibold">Ask Aan</span>
          </button>

          {/* Marketplace */}
          <div className="px-1 pb-2">
            <div className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Marketplace
            </div>
            <div className="border border-border rounded-lg bg-muted/20 overflow-hidden">
              {MARKETPLACES.map((mp, idx) => {
                const isActive = mp.id === marketplace;
                const isExpanded = expandedMp === mp.id;
                const mpAccounts = accounts.filter((a) => a.marketplace === mp.id);
                return (
                  <div key={mp.id} className={cn(idx > 0 && "border-t border-border/40")}>
                    <button
                      onClick={() => setExpandedMp(isExpanded ? null : mp.id)}
                      className={cn(
                        "w-full h-11 px-3 flex items-center gap-2.5 text-left active:bg-muted/60",
                        isActive && "bg-primary/5"
                      )}
                    >
                      <MpLogo id={mp.id} className="h-4 w-4" />
                      <span
                        className={cn(
                          "flex-1 text-[13px] truncate",
                          isActive ? "text-foreground font-semibold" : "text-foreground"
                        )}
                      >
                        {mp.label}
                      </span>
                      {isActive && currentAccount?.marketplace === mp.id && (
                        <span className="text-[10px] text-muted-foreground truncate max-w-[120px]">
                          {currentAccount.merchantName}
                        </span>
                      )}
                      {isExpanded ? (
                        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </button>
                    {isExpanded && (
                      <div className="bg-background/50 border-t border-border/40">
                        {mpAccounts.length === 0 ? (
                          <div className="px-10 py-2 text-[11px] text-muted-foreground">No accounts</div>
                        ) : (
                          mpAccounts.map((a) => {
                            const isCurrent = currentAccount?.id === a.id && isActive;
                            return (
                              <button
                                key={a.id}
                                onClick={() => {
                                  if (!isActive) setMarketplace(mp.id);
                                  setCurrentAccount(a.id);
                                  onOpenChange(false);
                                }}
                                className={cn(
                                  "w-full pl-10 pr-3 py-2 flex items-center gap-2 text-left active:bg-muted/60",
                                  isCurrent && "bg-primary/5"
                                )}
                              >
                                <Store
                                  className={cn(
                                    "h-3.5 w-3.5",
                                    isCurrent ? "text-primary" : "text-muted-foreground"
                                  )}
                                />
                                <div className="flex-1 min-w-0">
                                  <div
                                    className={cn(
                                      "text-[12px] truncate",
                                      isCurrent ? "text-primary font-semibold" : "text-foreground"
                                    )}
                                  >
                                    {a.merchantName}
                                  </div>
                                  <div className="text-[10px] text-muted-foreground truncate">
                                    {a.region} · {a.accountType}
                                  </div>
                                </div>
                                {isCurrent && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                              </button>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <Separator className="mx-2 mb-2 bg-border/40" />

          {/* Navigation */}
          <div className="flex-1">
            {filteredGroups.map((group) => {
              const isOpen = openGroups.has(group.label);
              const groupActive = group.items.some((i) => pathname.startsWith(i.url));
              if (group.items.length === 1) {
                const item = group.items[0];
                const active = pathname.startsWith(item.url);
                return (
                  <NavRow
                    key={item.url}
                    icon={item.icon}
                    label={item.title}
                    active={active}
                    onClick={() => handleNav(item.url)}
                  />
                );
              }
              return (
                <div key={group.label} className="mb-0.5">
                  <button
                    onClick={() => toggleGroup(group.label)}
                    className={cn(
                      "w-full h-11 px-3 flex items-center gap-3 rounded-md text-[13px] font-medium",
                      groupActive ? "text-foreground" : "text-foreground active:bg-muted/60"
                    )}
                  >
                    <group.icon className="h-4 w-4 opacity-80" />
                    <span className="flex-1 text-left">{group.label}</span>
                    {isOpen ? (
                      <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5 opacity-60" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="pl-2 pt-0.5 space-y-0.5">
                      {group.items.map((item) => {
                        const active = pathname.startsWith(item.url);
                        return (
                          <NavRow
                            key={item.url}
                            icon={item.icon}
                            label={item.title}
                            active={active}
                            onClick={() => handleNav(item.url)}
                            indent
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer — theme toggle only (account lives in 👤 sheet) */}
        <div className="shrink-0 border-t border-border bg-card flex items-center justify-between px-3 h-12">
          <span className="text-[11px] text-muted-foreground">Theme</span>
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="h-9 w-9 rounded-md flex items-center justify-center text-foreground active:bg-muted border border-border"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function MpLogo({ id, className }: { id: Marketplace; className?: string }) {
  if (id === "amazon") return <img src={amazonLogo} alt="Amazon" className={cn(className, "object-contain")} />;
  if (id === "walmart") return <img src={walmartLogo} alt="Walmart" className={cn(className, "object-contain")} />;
  return <Store className={cn(className, "text-muted-foreground")} />;
}

function NavRow({
  icon: Icon,
  label,
  active,
  onClick,
  indent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
  onClick: () => void;
  indent?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full h-10 flex items-center gap-3 rounded-md text-[13px] font-medium px-3",
        indent && "pl-9",
        active ? "bg-primary/10 text-primary" : "text-foreground active:bg-muted/60"
      )}
    >
      <Icon className={cn("h-4 w-4", active ? "text-primary" : "opacity-80")} />
      <span className="flex-1 text-left truncate">{label}</span>
    </button>
  );
}
