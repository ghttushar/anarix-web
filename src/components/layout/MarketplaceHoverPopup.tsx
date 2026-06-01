import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useAccounts, ConnectedAccount } from "@/contexts/AccountContext";
import { Marketplace } from "@/contexts/MarketplaceContext";
import { NavLink } from "react-router-dom";
import { Plus } from "lucide-react";

function StatusDot({ status }: { status: ConnectedAccount["status"] }) {
  const colors = { connected: "bg-emerald-500", syncing: "bg-amber-500", error: "bg-red-500" };
  return <div className={cn("h-2 w-2 rounded-full shrink-0", colors[status])} />;
}

interface MarketplaceHoverPopupProps {
  marketplace: Marketplace;
  label: string;
  isVisible: boolean;
  triggerRect: DOMRect | null;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  currentAccountId?: string;
  onSelectAccount?: (id: string) => void;
}

export function MarketplaceHoverPopup({
  marketplace,
  label,
  isVisible,
  triggerRect,
  onMouseEnter,
  onMouseLeave,
  currentAccountId,
  onSelectAccount,
}: MarketplaceHoverPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const { accounts } = useAccounts();

  const filtered = accounts.filter((a) => a.marketplace === marketplace);

  useEffect(() => {
    if (isVisible && popupRef.current && triggerRect) {
      const popup = popupRef.current;
      const rect = popup.getBoundingClientRect();
      if (rect.bottom > window.innerHeight) {
        popup.style.top = `${window.innerHeight - rect.height - 16}px`;
      }
    }
  }, [isVisible, triggerRect]);

  if (!isVisible || !triggerRect) return null;

  const connectUrl = marketplace === "amazon"
    ? "/settings/connect-amazon"
    : marketplace === "walmart"
    ? "/settings/connect-walmart"
    : "/settings/accounts";

  return createPortal(
    <div
      ref={popupRef}
      data-mp-popup
      className={cn(
        "fixed z-[9999]",
        "min-w-[220px] rounded-lg border border-border bg-popover shadow-xl",
        "animate-in fade-in-0 slide-in-from-left-2 duration-150"
      )}
      style={{
        left: `${triggerRect.right + 8}px`,
        top: `${triggerRect.top - 4}px`,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Invisible bridge */}
      <div className="absolute -left-3 top-0 h-full w-3" onMouseEnter={onMouseEnter} />

      {/* Header */}
      <div className="px-3 py-2.5 border-b border-border">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label} Accounts
        </span>
      </div>

      {/* Account list */}
      <div className="p-1.5 max-h-[60vh] overflow-auto">
        {filtered.length > 0 ? (
          filtered.map((acc) => (
            <button
              key={acc.id}
              onClick={() => onSelectAccount?.(acc.id)}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2.5 min-h-11 text-sm w-full text-left transition-colors",
                currentAccountId === acc.id
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-popover-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <StatusDot status={acc.status} />
              <span className="truncate">{acc.merchantName}</span>
            </button>
          ))
        ) : (
          <div className="px-3 py-3 text-xs text-muted-foreground text-center">
            No accounts connected
          </div>
        )}
      </div>

      {/* Connect link */}
      <div className="border-t border-border p-1.5">
        <NavLink
          to={connectUrl}
          className="flex items-center gap-2 rounded-md px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Connect Account</span>
        </NavLink>
      </div>
    </div>,
    document.body
  );
}
