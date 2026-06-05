import { useLocation, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  Store,
  Check,
  Sun,
  Moon,
  User,
  CreditCard,
  Settings,
  SlidersHorizontal,
  Users,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { AnarixLogo } from "@/components/branding/AnarixLogo";
import { navigationGroups } from "@/components/layout/AppSidebar";
import { useFeatureToggle } from "@/contexts/FeatureToggleContext";
import { useMarketplace, Marketplace } from "@/contexts/MarketplaceContext";
import { useAccounts } from "@/contexts/AccountContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import amazonLogo from "@/assets/amazon-logo.png";
import walmartLogo from "@/assets/walmart-logo.png";

const MOBILE_BLOCKED = new Set<string>([
  "/workspace",
  "/workspace/health-score",
  "/advertising/rules/agents",
  "/advertising/rules/applied",
]);

const SUPER_SECTIONS: { label: string; groupLabels: string[] }[] = [
  { label: "Analyze", groupLabels: ["Profitability"] },
  { label: "Operate", groupLabels: ["Advertising", "Day Parting", "AMC"] },
  { label: "Discover", groupLabels: ["Business Intelligence", "Catalog", "Reports"] },
];

const MARKETPLACES: { id: Marketplace; label: string; color: string }[] = [
  { id: "amazon", label: "Amazon", color: "#FF9900" },
  { id: "walmart", label: "Walmart", color: "#0071CE" },
  { id: "shopify", label: "Shopify", color: "#96BF48" },
  { id: "tiktok", label: "TikTok", color: "#000000" },
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

  const [selectorView, setSelectorView] = useState<"summary" | "marketplaces" | "accounts">("summary");

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

  const accountsForMp = accounts.filter((a) => a.marketplace === marketplace);
  const activeMp = MARKETPLACES.find((m) => m.id === marketplace);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-[88vw] max-w-[360px] p-0 flex flex-col gap-0 bg-background"
      >
        <div className="h-14 shrink-0 px-4 flex items-center border-b border-border bg-card">
          <AnarixLogo variant="full" className="h-5 w-auto" />
        </div>

        <div className="flex-1 overflow-auto py-2 px-2 flex flex-col">
          {/* Unified Marketplace/Account Selector */}
          <div className="px-1 py-2 mb-2">
            <div className="border border-border rounded-lg bg-muted/20 overflow-hidden">
              {selectorView === "summary" && (
                <div className="divide-y divide-border/40">
                  <button
                    onClick={() => setSelectorView("marketplaces")}
                    className="w-full h-11 px-3 flex items-center gap-2.5 hover:bg-muted/60 transition-colors text-left"
                  >
                    <MpLogo id={marketplace} className="h-4 w-4" />
                    <div className="flex-1 flex flex-col min-w-0">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground leading-none mb-0.5">Marketplace</span>
                      <span className="text-[13px] font-medium text-foreground truncate">{activeMp?.label}</span>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => setSelectorView("accounts")}
                    disabled={accountsForMp.length === 0}
                    className="w-full h-11 px-3 flex items-center gap-2.5 hover:bg-muted/60 transition-colors text-left disabled:opacity-50"
                  >
                    <Store className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1 flex flex-col min-w-0">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground leading-none mb-0.5">Account</span>
                      <span className="text-[13px] font-medium text-foreground truncate">
                        {currentAccount?.merchantName ?? (accountsForMp.length === 0 ? "No accounts" : "Select account")}
                      </span>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </div>
              )}

              {selectorView === "marketplaces" && (
                <div className="flex flex-col">
                  <button 
                    onClick={() => setSelectorView("summary")}
                    className="h-9 px-2 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground border-b border-border/40"
                  >
                    <ChevronLeft className="h-3 w-3" /> Back
                  </button>
                  <div className="max-h-[240px] overflow-auto">
                    {MARKETPLACES.map((mp) => {
                      const active = mp.id === marketplace;
                      return (
                        <button
                          key={mp.id}
                          onClick={() => {
                            setMarketplace(mp.id);
                            setSelectorView("summary");
                          }}
                          className={cn(
                            "w-full h-11 px-3 flex items-center gap-3 text-[13px] hover:bg-muted/60 transition-colors",
                            active && "bg-primary/5 text-primary font-semibold"
                          )}
                        >
                          <MpLogo id={mp.id} className="h-4 w-4" />
                          <span className="flex-1 text-left">{mp.label}</span>
                          {active && <Check className="h-3.5 w-3.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectorView === "accounts" && (
                <div className="flex flex-col">
                  <button 
                    onClick={() => setSelectorView("summary")}
                    className="h-9 px-2 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground border-b border-border/40"
                  >
                    <ChevronLeft className="h-3 w-3" /> Back
                  </button>
                  <div className="max-h-[240px] overflow-auto">
                    {accountsForMp.map((a) => {
                      const active = currentAccount?.id === a.id;
                      return (
                        <button
                          key={a.id}
                          onClick={() => {
                            setCurrentAccount(a.id);
                            setSelectorView("summary");
                          }}
                          className={cn(
                            "w-full px-3 py-2.5 flex items-start gap-3 text-left hover:bg-muted/60 transition-colors",
                            active && "bg-primary/5"
                          )}
                        >
                          <Store className={cn("h-4 w-4 mt-0.5", active ? "text-primary" : "text-muted-foreground")} />
                          <div className="flex-1 min-w-0">
                            <div className={cn("text-[13px] truncate", active ? "text-primary font-semibold" : "text-foreground")}>
                              {a.merchantName}
                            </div>
                            <div className="text-[11px] text-muted-foreground truncate">
                              {a.region} · {a.accountType}
                            </div>
                          </div>
                          {active && <Check className="h-3.5 w-3.5 text-primary mt-1" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator className="mx-2 mb-2 bg-border/40" />

          {/* Navigation */}
          <div className="flex-1">
            {SUPER_SECTIONS.map((section) => {
              const sectionGroups = filteredGroups.filter((g) =>
                section.groupLabels.includes(g.label)
              );
              if (sectionGroups.length === 0) return null;
              return (
                <div key={section.label} className="mb-4">
                  <div className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    {section.label}
                  </div>
                  {sectionGroups.map((group) => {
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
                            groupActive
                              ? "text-foreground"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
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
              );
            })}
          </div>
        </div>

        {/* Footer — Profile + Theme */}
        <div className="shrink-0 border-t border-border bg-card p-3 space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="bg-primary/10 text-primary text-[11px] font-semibold">
                  JD
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-semibold text-foreground truncate">John Doe</span>
                <span className="text-[11px] text-muted-foreground truncate">john@anarix.com</span>
              </div>
            </div>
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="h-8 w-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <button 
              onClick={() => handleNav("/profile")}
              className="flex items-center gap-2 h-9 px-2.5 rounded-md hover:bg-muted text-[12px] font-medium text-foreground transition-colors"
            >
              <User className="h-3.5 w-3.5 text-muted-foreground" /> Profile
            </button>
            <button 
              onClick={() => handleNav("/settings/billing")}
              className="flex items-center gap-2 h-9 px-2.5 rounded-md hover:bg-muted text-[12px] font-medium text-foreground transition-colors"
            >
              <CreditCard className="h-3.5 w-3.5 text-muted-foreground" /> Billing
            </button>
            <button 
              onClick={() => handleNav("/settings")}
              className="flex items-center gap-2 h-9 px-2.5 rounded-md hover:bg-muted text-[12px] font-medium text-foreground transition-colors"
            >
              <Settings className="h-3.5 w-3.5 text-muted-foreground" /> Settings
            </button>
            <button 
              onClick={() => handleNav("/auth/login")}
              className="flex items-center gap-2 h-9 px-2.5 rounded-md hover:bg-muted text-[12px] font-medium text-foreground transition-colors"
            >
              <LogOut className="h-3.5 w-3.5 text-muted-foreground" /> Sign out
            </button>
          </div>
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
        "w-full h-11 flex items-center gap-3 rounded-md text-[14px] transition-colors min-h-[44px] relative",
        indent ? "pl-6 pr-3" : "px-3",
        active
          ? "bg-primary/10 text-primary font-semibold"
          : "text-foreground hover:bg-muted/60"
      )}
    >
      {active && (
        <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r bg-primary" />
      )}
      <Icon className="h-4 w-4 shrink-0 opacity-90" />
      <span className="truncate">{label}</span>
    </button>
  );
}
