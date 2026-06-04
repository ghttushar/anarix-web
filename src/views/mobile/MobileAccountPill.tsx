import { useState, useMemo } from "react";
import { Check, ChevronDown, UserCircle2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useMarketplace } from "@/contexts/MarketplaceContext";
import { useAccounts } from "@/contexts/AccountContext";
import { cn } from "@/lib/utils";

/**
 * Account switcher pill — paired with MobileMarketplacePill in the AppLevelBar.
 * Lists only accounts under the currently selected marketplace.
 * No "+ Connect new" affordance on mobile (read-only constraint).
 */
export function MobileAccountPill() {
  const { marketplace } = useMarketplace();
  const { accounts, currentAccount, setCurrentAccount } = useAccounts();
  const [open, setOpen] = useState(false);

  const filtered = useMemo(
    () => accounts.filter((a) => a.marketplace === marketplace),
    [accounts, marketplace]
  );

  const active =
    currentAccount && currentAccount.marketplace === marketplace
      ? currentAccount
      : filtered[0] ?? null;

  const disabled = filtered.length === 0;

  return (
    <>
      <button
        onClick={() => !disabled && setOpen(true)}
        disabled={disabled}
        className={cn(
          "h-8 px-2 inline-flex items-center gap-1.5 rounded-md border border-border bg-card text-[12px] font-medium text-foreground max-w-[140px]",
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-muted/60 active:bg-muted"
        )}
        aria-label="Switch account"
      >
        <UserCircle2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <span className="truncate">
          {disabled ? "No accounts" : active?.merchantName ?? "Account"}
        </span>
        {!disabled && (
          <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" />
        )}
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="rounded-t-2xl p-0 border-t border-border"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <SheetHeader className="px-4 pt-4 pb-2 text-left">
            <SheetTitle className="text-base">Account</SheetTitle>
          </SheetHeader>
          <div className="px-2 pb-4 max-h-[60vh] overflow-auto">
            {filtered.map((a) => {
              const selected = active?.id === a.id;
              return (
                <button
                  key={a.id}
                  onClick={() => {
                    setCurrentAccount(a.id);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full p-3 flex items-start gap-3 rounded-md text-left",
                    selected ? "bg-primary/8" : "hover:bg-muted/60 active:bg-muted"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div
                      className={cn(
                        "text-sm truncate",
                        selected ? "font-semibold text-primary" : "text-foreground"
                      )}
                    >
                      {a.merchantName}
                    </div>
                    <div className="text-[12px] text-muted-foreground truncate">
                      {a.region} · {a.accountType} · {a.merchantId}
                    </div>
                  </div>
                  {selected && <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />}
                </button>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
