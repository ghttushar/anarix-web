import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FullPageLoader } from "@/components/ui/loader";
import { useAccounts } from "@/contexts/AccountContext";
import { useTrial } from "@/contexts/TrialContext";
import { useBillingFlow } from "@/contexts/BillingFlowContext";
import { useTheme } from "@/contexts/ThemeContext";
import logoFull from "@/assets/logo-light-full.svg";
import logoWhite from "@/assets/logo-dark-full.svg";

// Walmart logo
const WalmartLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 2L14.5 8.5L21 9.5L16 14L17.5 21L12 17.5L6.5 21L8 14L3 9.5L9.5 8.5L12 2Z" />
  </svg>
);

export default function ConnectAccounts() {
  const navigate = useNavigate();
  const { accounts, addAccount, completeOnboarding, hasAccounts } = useAccounts();
  const { startSync } = useTrial();
  const { billingFlowEnabled } = useBillingFlow();
  const { resolvedTheme } = useTheme();
  const [showMarketplaceModal, setShowMarketplaceModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const logoSrc = resolvedTheme === "dark" ? logoWhite : logoFull;

  const handleSelectMarketplace = (marketplace: "amazon" | "walmart") => {
    setShowMarketplaceModal(false);
    navigate(`/settings/accounts/connect/${marketplace}`);
  };

  const handleContinue = async () => {
    setIsLoading(true);
    setLoadingMessage("Setting up your workspace...");
    
    // Show loader with delay for premium feel
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setLoadingMessage("Syncing account data...");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    completeOnboarding();
    if (billingFlowEnabled) startSync();
    navigate("/profitability/dashboard");
  };

  const handleSkip = async () => {
    setIsLoading(true);
    setLoadingMessage("Creating demo account...");
    
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Add a demo account for demo purposes
    addAccount({
      marketplace: "walmart",
      accountType: "seller",
      merchantName: "Demo Store",
      merchantId: "DEMO123",
      region: "US",
      status: "connected",
      lastSync: new Date().toISOString(),
      bidAutomation: "ai",
    });
    
    setLoadingMessage("Preparing your dashboard...");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    completeOnboarding();
    if (billingFlowEnabled) startSync();
    navigate("/profitability/dashboard");
  };

  if (isLoading) {
    return <FullPageLoader message={loadingMessage} />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <img src={logoSrc} alt="Anarix" className="h-8 w-auto" />
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-3xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-heading font-semibold text-foreground mb-3">
              Connect Your Accounts
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Link your Amazon or Walmart seller accounts to start optimizing your advertising performance.
            </p>
          </div>

          {/* Account cards grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {/* Connected accounts */}
            {accounts.map((account) => (
              <div
                key={account.id}
                className="rounded-xl border border-border bg-card p-5 relative"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center",
                      account.marketplace === "amazon"
                        ? "bg-orange-100 text-orange-600"
                        : "bg-blue-100 text-blue-600"
                    )}
                  >
                    {account.marketplace === "amazon" ? (
                      <Store className="h-5 w-5" />
                    ) : (
                      <WalmartLogo className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">
                      {account.merchantName}
                    </h3>
                    <p className="text-xs text-muted-foreground capitalize">
                      {account.marketplace} • {account.accountType}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                  <span className="text-xs text-muted-foreground">Connected</span>
                </div>
              </div>
            ))}

            {/* Add Account card */}
            <button
              onClick={() => setShowMarketplaceModal(true)}
              className={cn(
                "rounded-xl border-2 border-dashed border-border bg-card/50 p-5",
                "flex flex-col items-center justify-center gap-3 min-h-[140px]",
                "text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-card",
                "transition-all duration-200"
              )}
            >
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <Plus className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium">Add Account</span>
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center gap-4">
            <Button variant="outline" onClick={handleSkip}>
              Skip for now
            </Button>
            <Button onClick={handleContinue} disabled={!hasAccounts}>
              Continue to Dashboard
            </Button>
          </div>
        </div>
      </main>

      {/* Marketplace Selection Modal */}
      <Dialog open={showMarketplaceModal} onOpenChange={setShowMarketplaceModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Choose Marketplace</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            <button
              onClick={() => handleSelectMarketplace("amazon")}
              className={cn(
                "flex flex-col items-center gap-4 p-6 rounded-xl border border-border",
                "hover:border-primary hover:bg-primary/5 transition-all duration-200"
              )}
            >
              <div className="h-16 w-16 rounded-2xl bg-orange-100 flex items-center justify-center">
                <Store className="h-8 w-8 text-orange-600" />
              </div>
              <span className="font-medium text-foreground">Amazon</span>
            </button>

            <button
              onClick={() => handleSelectMarketplace("walmart")}
              className={cn(
                "flex flex-col items-center gap-4 p-6 rounded-xl border border-border",
                "hover:border-primary hover:bg-primary/5 transition-all duration-200"
              )}
            >
              <div className="h-16 w-16 rounded-2xl bg-blue-100 flex items-center justify-center">
                <WalmartLogo className="h-8 w-8 text-blue-600" />
              </div>
              <span className="font-medium text-foreground">Walmart</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
