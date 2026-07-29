import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useMarketplace, Marketplace } from "@/contexts/MarketplaceContext";
import { useAccounts } from "@/contexts/AccountContext";
import { useSidebar } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { MarketplaceHoverPopup } from "./MarketplaceHoverPopup";
import amazonLogo from "@/assets/amazon-logo.png";
import walmartLogo from "@/assets/walmart-logo.png";

interface MarketplaceOption {
  id: Marketplace;
  label: string;
  brandColor: string;
  logo: "amazon" | "walmart";
}

const marketplaceOptions: MarketplaceOption[] = [
  { id: "amazon", label: "Amazon", brandColor: "#FF9900", logo: "amazon" },
  { id: "walmart", label: "Walmart", brandColor: "#0071CE", logo: "walmart" },

];


export function MarketplaceSelector() {
  const { marketplace, setMarketplace } = useMarketplace();
  const { currentAccount, setCurrentAccount, currentRegion, setCurrentRegion, accountRegions, accountGroups, currentAccountGroup, populateFromSettings } = useAccounts();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const [hoveredMp, setHoveredMp] = useState<Marketplace | null>(null);
  const [pinnedMp, setPinnedMp] = useState<Marketplace | null>(null);
  const [triggerRects, setTriggerRects] = useState<Record<string, DOMRect | null>>({});
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const isTabletView = typeof document !== "undefined" && document.documentElement.getAttribute("data-view") === "tablet";

  const updateRect = useCallback((id: Marketplace) => {
    const trigger = triggerRefs.current[id];
    if (trigger) setTriggerRects(prev => ({ ...prev, [id]: trigger.getBoundingClientRect() }));
  }, []);

  const handleMouseEnter = useCallback((id: Marketplace) => {
    if (isTabletView) return;
    if (hoverTimeoutRef.current) { clearTimeout(hoverTimeoutRef.current); hoverTimeoutRef.current = null; }
    updateRect(id);
    setHoveredMp(id);
  }, [isTabletView, updateRect]);

  const handleMouseLeave = useCallback(() => {
    if (isTabletView) return;
    hoverTimeoutRef.current = setTimeout(() => setHoveredMp(null), 200);
  }, [isTabletView]);

  const handleTriggerClick = useCallback((id: Marketplace) => {
    setMarketplace(id);
    if (isTabletView) {
      updateRect(id);
      setPinnedMp((prev) => (prev === id ? null : id));
    }
  }, [isTabletView, setMarketplace, updateRect]);

  // Dismiss pinned popup on outside tap (tablet only).
  useEffect(() => {
    if (!isTabletView || !pinnedMp) return;
    const onDown = (ev: PointerEvent) => {
      const target = ev.target as HTMLElement | null;
      if (!target) return;
      if (target.closest("[data-mp-popup]")) return;
      if (target.closest("[data-mp-trigger]")) return;
      setPinnedMp(null);
    };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, [isTabletView, pinnedMp]);

  useEffect(() => {
    return () => { if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current); };
  }, []);

  const renderLogo = (opt: MarketplaceOption, isSelected: boolean, size: string) => {
    const color = isSelected ? opt.brandColor : undefined;
    switch (opt.logo) {
      case "amazon":
        return <img src={amazonLogo} alt="Amazon" className={cn(size, "object-contain", !isSelected && "opacity-50 grayscale")} />;
      case "walmart":
        return <img src={walmartLogo} alt="Walmart" className={cn(size, "object-contain", !isSelected && "opacity-50 grayscale")} />;

    }
  };

  return (
    <div className={cn("shrink-0", collapsed ? "px-1 py-2" : "px-3 py-2")}>
      {!collapsed && (
        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-2 mb-1.5">
          Marketplace
        </div>
      )}

      <div className={cn("flex flex-col", collapsed ? "items-center gap-1" : "gap-0.5")}>
        {marketplaceOptions.map((opt) => {
          const isSelected = marketplace === opt.id;
          const popupOpen = hoveredMp === opt.id || pinnedMp === opt.id;

          const handleAccountPick = (id: string) => {
            setCurrentAccount(id);
            setPinnedMp(null);
          };

          const handleRegionPick = async (regionId: string) => {
            const targetRegion = accountRegions.find((r) => r.id === regionId);
            const targetGroup = targetRegion
              ? accountGroups.find((g) => g.id === targetRegion.groupId)
              : null;

            if (targetGroup && currentAccountGroup && targetGroup.id !== currentAccountGroup.id) {
              if (targetGroup.accountId) {
                try {
                  const { authService } = await import("@/services/auth.service");
                  await authService.switchAccount(targetGroup.accountId);
                  const settingsRes = await authService.getAccountSettings("all");
                  const rawEntries = settingsRes.data || [];
                  const entries = rawEntries
                    .filter((e: any) => e.marketplace === "amazon")
                    .map((e: any) => ({
                      marketplace: e.marketplace,
                      accountType: e.accountType,
                      amazonProfileId: e.advertising.amazonProfileId,
                      sellingPartnerId: e.catalog.partnerDisplayName,
                      countryCode: e.advertising.countryCode,
                    }));
                  const newRegion = populateFromSettings(entries, targetGroup.name, targetGroup.accountId);
                  if (newRegion) {
                    setCurrentRegion(newRegion.id);
                  }
                  setPinnedMp(null);
                  return;
                } catch {
                  // fall through
                }
              }
            }
            setCurrentRegion(regionId);
            setPinnedMp(null);
          };

          if (collapsed) {
            return (
              <div key={opt.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      ref={(el) => { triggerRefs.current[opt.id] = el; }}
                      data-mp-trigger
                      onClick={() => handleTriggerClick(opt.id)}
                      onMouseEnter={() => handleMouseEnter(opt.id)}
                      onMouseLeave={handleMouseLeave}
                      className={cn(
                        "flex items-center justify-center rounded-md h-8 w-8 transition-colors",
                        isSelected
                          ? "bg-sidebar-accent"
                          : "text-muted-foreground hover:bg-sidebar-accent"
                      )}
                    >
                      {renderLogo(opt, isSelected, "h-4 w-4")}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">{opt.label}</TooltipContent>
                </Tooltip>

                <MarketplaceHoverPopup
                  marketplace={opt.id}
                  label={opt.label}
                  isVisible={popupOpen}
                  triggerRect={triggerRects[opt.id] || null}
                  onMouseEnter={() => handleMouseEnter(opt.id)}
                  onMouseLeave={handleMouseLeave}
                  currentAccountId={currentAccount?.id}
                  onSelectAccount={handleAccountPick}
                  currentRegionId={currentRegion?.id}
                  onSelectRegion={handleRegionPick}
                />
              </div>
            );
          }

          return (
            <div key={opt.id}>
              <button
                ref={(el) => { triggerRefs.current[opt.id] = el; }}
                data-mp-trigger
                onClick={() => handleTriggerClick(opt.id)}
                onMouseEnter={() => handleMouseEnter(opt.id)}
                onMouseLeave={handleMouseLeave}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-2 py-1.5 w-full text-sm transition-colors",
                  isSelected
                    ? "bg-sidebar-accent font-medium"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                )}
                style={isSelected ? { color: opt.brandColor } : undefined}
              >
                {renderLogo(opt, isSelected, "h-4 w-4")}
                <span>{opt.label}</span>
              </button>

              <MarketplaceHoverPopup
                marketplace={opt.id}
                label={opt.label}
                isVisible={popupOpen}
                triggerRect={triggerRects[opt.id] || null}
                onMouseEnter={() => handleMouseEnter(opt.id)}
                onMouseLeave={handleMouseLeave}
                currentAccountId={currentAccount?.id}
                onSelectAccount={handleAccountPick}
                currentRegionId={currentRegion?.id}
                onSelectRegion={handleRegionPick}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
