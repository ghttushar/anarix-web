import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useMarketplace, Marketplace } from "@/contexts/MarketplaceContext";
import { useAccounts } from "@/contexts/AccountContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useSidebar } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { MarketplaceHoverPopup } from "./MarketplaceHoverPopup";
import amazonLogo from "@/assets/amazon-logo.png";
import walmartLogo from "@/assets/walmart-logo.png";

interface MarketplaceOption {
  id: Marketplace;
  label: string;
  brandColor: string;
  logo: "amazon" | "walmart" | "shopify" | "tiktok";
}

const marketplaceOptions: MarketplaceOption[] = [
  { id: "amazon", label: "Amazon", brandColor: "#FF9900", logo: "amazon" },
  { id: "walmart", label: "Walmart", brandColor: "#0071CE", logo: "walmart" },
  { id: "shopify", label: "Shopify", brandColor: "#96BF48", logo: "shopify" },
  { id: "tiktok", label: "TikTok", brandColor: "#000000", logo: "tiktok" },
];

function ShopifyIcon({ className, color }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={color || "currentColor"}>
      <path d="M15.34 3.04c-.07 0-.13.05-.14.12-.01.05-.29 1.77-.29 1.77s-.58-.12-.58-.12c-.01 0-.03-.01-.05-.01-.36-.28-.8-.41-1.24-.41h-.05c-.36-.43-.8-.64-1.2-.64-2.96.05-4.38 3.7-4.82 5.58l-2.02.62s-.6.19-.69.2c-.09.02-.09.02-.1.1C5.13 10.33 3 26.99 3 26.99L16.38 29.5l.02-26.44c-.34-.01-.72-.02-1.06-.02zm-1.6 2.04c0 .07 0 .16-.01.25-.34-.11-.72-.16-1.12-.12.22-.85.65-1.27 1.02-1.42.06.37.1.82.11 1.29zm-1.06-1.7c.12 0 .24.06.36.16-.49.23-.99.83-1.21 2.01-.32.1-.63.19-.96.3.28-1.33 1.05-2.45 1.77-2.47h.04zm-.63 6.15c.04.59.59 1.02 1.04 1.35.53.39.56.42.53.74-.04.47-.34.77-.79.77-.38 0-.82-.21-1.14-.37l-.35 1.51c.33.15.95.35 1.59.36 1.64.03 2.05-1.15 2.1-1.8.06-.87-.55-1.22-1.04-1.58-.41-.3-.56-.44-.53-.74.02-.24.2-.49.6-.49.26 0 .52.05.52.05l.22-1.36s-.36-.08-.8-.09c-.52-.01-1.23.11-1.7.64-.06.06-.14.17-.21.28l-.04.73z" />
    </svg>
  );
}

function TikTokIcon({ className, color }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={color || "currentColor"}>
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.05a8.16 8.16 0 004.76 1.51V7.12a4.84 4.84 0 01-1-.43z" />
    </svg>
  );
}

export function MarketplaceSelector() {
  const { marketplace, setMarketplace } = useMarketplace();
  const { currentAccount, setCurrentAccount } = useAccounts();
  const { resolvedTheme } = useTheme();
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
      case "shopify":
        return <ShopifyIcon className={size} color={isSelected ? opt.brandColor : "currentColor"} />;
      case "tiktok": {
        const tikTokColor = isSelected
          ? (resolvedTheme === "dark" ? "#FFFFFF" : "#000000")
          : undefined;
        return <TikTokIcon className={size} color={tikTokColor} />;
      }
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

          if (collapsed) {
            return (
              <div key={opt.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      ref={(el) => { triggerRefs.current[opt.id] = el; }}
                      onClick={() => setMarketplace(opt.id)}
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
                  isVisible={hoveredMp === opt.id}
                  triggerRect={triggerRects[opt.id] || null}
                  onMouseEnter={() => handleMouseEnter(opt.id)}
                  onMouseLeave={handleMouseLeave}
                  currentAccountId={currentAccount?.id}
                  onSelectAccount={setCurrentAccount}
                />
              </div>
            );
          }

          return (
            <div key={opt.id}>
              <button
                ref={(el) => { triggerRefs.current[opt.id] = el; }}
                onClick={() => setMarketplace(opt.id)}
                onMouseEnter={() => handleMouseEnter(opt.id)}
                onMouseLeave={handleMouseLeave}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-2 py-1.5 w-full text-sm transition-colors",
                  isSelected
                    ? "bg-sidebar-accent font-medium"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                )}
                style={isSelected ? { color: opt.id === "tiktok" ? (resolvedTheme === "dark" ? "#FFFFFF" : "#000000") : opt.brandColor } : undefined}
              >
                {renderLogo(opt, isSelected, "h-4 w-4")}
                <span>{opt.label}</span>
              </button>

              <MarketplaceHoverPopup
                marketplace={opt.id}
                label={opt.label}
                isVisible={hoveredMp === opt.id}
                triggerRect={triggerRects[opt.id] || null}
                onMouseEnter={() => handleMouseEnter(opt.id)}
                onMouseLeave={handleMouseLeave}
                currentAccountId={currentAccount?.id}
                onSelectAccount={setCurrentAccount}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
