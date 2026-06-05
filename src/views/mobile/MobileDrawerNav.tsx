import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  Store,
  Check,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { AnarixLogo } from "@/components/branding/AnarixLogo";
import { navigationGroups } from "@/components/layout/AppSidebar";
import { useFeatureToggle } from "@/contexts/FeatureToggleContext";
import { useMarketplace, Marketplace } from "@/contexts/MarketplaceContext";
import { useAccounts } from "@/contexts/AccountContext";
import amazonLogo from "@/assets/amazon-logo.png";
import walmartLogo from "@/assets/walmart-logo.png";

// Routes write-only on desktop, hidden on mobile drawer.
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
  const [mpOpen, setMpOpen] = useState(false);
  const [acctOpen, setAcctOpen] = useState(false);

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
        {/* Header — single close affordance via SheetContent's built-in X */}
        <div className="h-14 shrink-0 px-4 flex items-center border-b border-border bg-card">
          <AnarixLogo variant="full" className="h-5 w-auto" />
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-auto py-2 px-2">
          {/* Marketplace + Account stacked selectors */}
          <div className="px-1 py-2 space-y-1.5">
            <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground px-2">
              Marketplace
            </div>
            <div className="border border-border rounded-md overflow-hidden">
              <button
                onClick={() => setMpOpen((v) => !v)}
                className="w-full h-10 px-3 flex items-center gap-2 hover:bg-muted/60 text-left"
              >
                <MpLogo id={marketplace} className="h-4 w-4" />
                <span className="flex-1 text-[13px] font-medium text-foreground">
                  {activeMp?.label}
                </span>
                <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", mpOpen && "rotate-180")} />
              </button>
              {mpOpen && (
                <div className="border-t border-border bg-muted/20">
                  {MARKETPLACES.map((mp) => {
                    const active = mp.id === marketplace;
                    return (
                      <button
                        key={mp.id}
                        onClick={() => {
                          setMarketplace(mp.id);
                          setMpOpen(false);
                        }}
                        className={cn(
                          "w-full h-10 px-3 flex items-center gap-2 text-[13px] hover:bg-muted/60",
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
              )}
            </div>

            <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground px-2 pt-1">
              Account
            </div>
            <div className="border border-border rounded-md overflow-hidden">
              <button
                onClick={() => setAcctOpen((v) => !v)}
                disabled={accountsForMp.length === 0}
                className="w-full h-10 px-3 flex items-center gap-2 hover:bg-muted/60 text-left disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Store className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1 text-[13px] font-medium text-foreground truncate">
                  {currentAccount?.merchantName ?? (accountsForMp.length === 0 ? "No accounts" : "Select account")}
                </span>
                {accountsForMp.length > 0 && (
                  <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", acctOpen && "rotate-180")} />
                )}
              </button>
              {acctOpen && accountsForMp.length > 0 && (
                <div className="border-t border-border bg-muted/20 max-h-[200px] overflow-auto">
                  {accountsForMp.map((a) => {
                    const active = currentAccount?.id === a.id;
                    return (
                      <button
                        key={a.id}
                        onClick={() => {
                          setCurrentAccount(a.id);
                          setAcctOpen(false);
                        }}
                        className={cn(
                          "w-full px-3 py-2 flex items-start gap-2 text-left hover:bg-muted/60",
                          active && "bg-primary/5"
                        )}
                      >
                        <div className="flex-1 min-w-0">
                          <div className={cn("text-[13px] truncate", active ? "text-primary font-semibold" : "text-foreground")}>
                            {a.merchantName}
                          </div>
                          <div className="text-[11px] text-muted-foreground truncate">
                            {a.region} · {a.accountType}
                          </div>
                        </div>
                        {active && <Check className="h-3.5 w-3.5 text-primary mt-0.5" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="pt-2">
            {SUPER_SECTIONS.map((section) => {
              const sectionGroups = filteredGroups.filter((g) =>
                section.groupLabels.includes(g.label)
              );
              if (sectionGroups.length === 0) return null;
              return (
                <div key={section.label} className="mb-3">
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
