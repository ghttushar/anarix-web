import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Store, Globe, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FullPageLoader } from "@/components/ui/loader";
import { useAccounts } from "@/contexts/AccountContext";

const WalmartLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 2L14.5 8.5L21 9.5L16 14L17.5 21L12 17.5L6.5 21L8 14L3 9.5L9.5 8.5L12 2Z" />
  </svg>
);

export default function ConnectAccounts() {
  const navigate = useNavigate();
  const { clearAccounts, populateFromSettings, completeOnboarding } = useAccounts();
  const [step, setStep] = useState<"loading" | "accounts" | "marketplace" | "syncing">("loading");
  const [mappings, setMappings] = useState<any[]>([]);
  const [selectedMapping, setSelectedMapping] = useState<any | null>(null);
  const [settingsEntries, setSettingsEntries] = useState<any[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const { authService } = await import("@/services/auth.service");
        const mapRes = await authService.getUserAccountMapping();
        const list = mapRes.data || [];
        if (cancelled) return;
        setMappings(list);
        setStep(list.length > 0 ? "accounts" : "accounts");
      } catch (err: any) {
        if (!cancelled) setError(err.message || "Failed to load accounts");
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const handleSelectAccount = async (mapping: any) => {
    setSelectedMapping(mapping);
    setStep("syncing");
    try {
      const { authService } = await import("@/services/auth.service");
      const accountId = mapping.accountId._id;
      await authService.switchAccount(accountId);

      const settingsRes = await authService.getAccountSettings("all");
      const rawEntries = settingsRes.data || [];

      const entries: any[] = rawEntries
        .filter((e: any) => e.marketplace === "amazon")
        .map((e: any) => ({
          marketplace: e.marketplace,
          accountType: e.accountType,
          amazonProfileId: e.advertising.amazonProfileId,
          sellingPartnerId: e.catalog.partnerDisplayName,
          countryCode: e.advertising.countryCode,
        }));

      setSettingsEntries(entries);
      setStep(entries.length > 0 ? "marketplace" : "marketplace");
    } catch (err: any) {
      setError(err.message || "Failed to switch account");
      setStep("accounts");
    }
  };

  const handleSelectMarketplace = (entry: any) => {
    setSelectedEntry(entry);
    setStep("syncing");

    clearAccounts();
    const brandName = selectedMapping?.accountId.brandName || "Account";
    const accountId = selectedMapping?.accountId._id;
    populateFromSettings(
      entry ? [entry] : settingsEntries,
      brandName,
      accountId
    );

    completeOnboarding();
    navigate("/profitability/dashboard", { replace: true });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-destructive text-sm">{error}</p>
          <Button onClick={() => navigate("/login")}>Back to Login</Button>
        </div>
      </div>
    );
  }

  if (step === "syncing") {
    return <FullPageLoader message="Setting up your workspace..." />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border px-6 py-4">
        <div className="flex items-center gap-2">
          <Store className="h-5 w-5 text-primary" />
          <span className="font-semibold text-foreground">Anarix</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          {step === "accounts" && (
            <>
              <div className="text-center mb-10">
                <h1 className="text-3xl font-heading font-semibold text-foreground mb-3">
                  Select Your Account
                </h1>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Choose an account to get started with your profitability dashboard.
                </p>
              </div>

              <div className="space-y-3">
                {mappings.map((mapping) => {
                  const acc = mapping.accountId;
                  const isAmazon = acc.marketplace === "amazon";
                  return (
                    <button
                      key={mapping._id}
                      onClick={() => handleSelectAccount(mapping)}
                      className={cn(
                        "w-full flex items-center gap-4 p-5 rounded-xl border border-border",
                        "hover:border-primary hover:bg-primary/5 transition-all duration-200 text-left",
                        selectedMapping?._id === mapping._id && "border-primary bg-primary/5"
                      )}
                    >
                      <div
                        className={cn(
                          "h-12 w-12 rounded-xl flex items-center justify-center shrink-0",
                          isAmazon ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"
                        )}
                      >
                        {isAmazon ? <Store className="h-6 w-6" /> : <WalmartLogo className="h-6 w-6" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground">{acc.brandName}</h3>
                        <p className="text-sm text-muted-foreground capitalize">
                          {acc.marketplace} • {acc.accountType} • {acc.countryCode}
                        </p>
                        {acc.email && (
                          <p className="text-xs text-muted-foreground/70 mt-0.5">{acc.email}</p>
                        )}
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {step === "marketplace" && (
            <>
              <div className="text-center mb-10">
                <h1 className="text-3xl font-heading font-semibold text-foreground mb-3">
                  Select Marketplace
                </h1>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Choose the marketplace and account type for{" "}
                  <span className="font-medium text-foreground">
                    {selectedMapping?.accountId.brandName}
                  </span>
                  .
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {settingsEntries.map((entry, i) => {
                  const label = `${entry.accountType.toUpperCase()} — ${entry.countryCode}`;
                  const desc = `Amazon ${entry.accountType} account for ${entry.countryCode}`;
                  return (
                    <button
                      key={i}
                      onClick={() => handleSelectMarketplace(entry)}
                      className={cn(
                        "flex flex-col items-center gap-3 p-6 rounded-xl border border-border text-center",
                        "hover:border-primary hover:bg-primary/5 transition-all duration-200",
                        selectedEntry === entry && "border-primary bg-primary/5"
                      )}
                    >
                      <div className="h-14 w-14 rounded-2xl bg-orange-100 flex items-center justify-center">
                        <Globe className="h-7 w-7 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{label}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{desc}</p>
                      </div>
                      {selectedEntry === entry && (
                        <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                          <Check className="h-3.5 w-3.5 text-primary-foreground" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}