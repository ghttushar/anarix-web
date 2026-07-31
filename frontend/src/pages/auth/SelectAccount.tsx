import { useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useAccounts } from "@/contexts/AccountContext";
import { authService, UserAccountMapping } from "@/services/auth.service";
import {
  accountStorage,
  SettingsAccount,
} from "@/lib/account-storage";
import {
  initializeSelectedAccounts,
  initializeDSPAccounts,
} from "@/lib/account-session";
import { AnarixLogo } from "@/components/branding/AnarixLogo";
import legacyLogoWhite from "@/assets/logo-dark-full.svg";

interface LocationState {
  callbackUrl?: string;
}

export default function SelectAccount() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token, logout, setAccount, setMappedAccounts, mappedAccounts } = useAuth();
  const { populateFromSettings } = useAccounts();
  const [isLoading, setIsLoading] = useState(false);
  const [isAccountLoading, setIsAccountLoading] = useState(false);

  const locationState = (location.state as LocationState | null) ?? {};

  const loginHandler = useCallback(
    async (selectedAccount: UserAccountMapping, callbackUrl?: string) => {
      setIsAccountLoading(true);
      try {
        await authService.switchAccount(selectedAccount.accountId._id);

        setAccount(selectedAccount.accountId);
        accountStorage.setSelectedUserAccountMapping(selectedAccount);

        const settingsRes = await authService.getAccountSettings("all");
        const availableAccounts: SettingsAccount[] = settingsRes.data || [];
        initializeSelectedAccounts(availableAccounts);

        const amazonEntries = availableAccounts
          .filter((e: SettingsAccount) => e.marketplace === "amazon")
          .map((e: SettingsAccount) => ({
            marketplace: e.marketplace,
            accountType: e.accountType,
            amazonProfileId: e.advertising?.amazonProfileId,
            sellingPartnerId: e.catalog?.partnerId || e.catalog?.partnerDisplayName,
            countryCode: e.advertising?.countryCode || e.catalog?.countryCode,
          }));
        if (amazonEntries.length > 0) {
          const brandName =
            selectedAccount.accountId?.brandName ||
            amazonEntries[0]?.accountType ||
            "Account";
          populateFromSettings(amazonEntries, brandName, selectedAccount.accountId._id);
        }

        try {
          const dspRes = await authService.getDSPAccount();
          initializeDSPAccounts(dspRes.data || []);
        } catch (error) {
          console.error("Error fetching DSP accounts:", error);
        }

        navigate(callbackUrl || "/profitability/dashboard");
      } catch (error) {
        console.error("Error while selecting account:", error);
      } finally {
        setIsAccountLoading(false);
      }
    },
    [navigate, populateFromSettings, setAccount]
  );

  const handleLoginClick = (selectedId: string) => {
    const selectedAccount = mappedAccounts.find(
      (account) => account.accountId?._id === selectedId
    );
    if (selectedAccount) {
      loginHandler(selectedAccount, locationState.callbackUrl);
    }
  };

  const handleLogoutClick = () => {
    logout(true);
  };

  useEffect(() => {
    if (token) {
      setIsLoading(true);
      authService
        .getUserAccountMapping()
        .then(async (res) => {
          if (res?.success !== false) {
            const data = res?.data || [];
            setMappedAccounts(data);

            if (data.length === 1) {
              await loginHandler(data[0]);
            }
          }
        })
        .catch((error) => {
          console.error("Error fetching account mappings:", error);
        })
        .finally(() => setIsLoading(false));
    }
  }, [token, setMappedAccounts, loginHandler]);

  if (isLoading || isAccountLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-6 w-full max-w-md px-8">
          <AnarixLogo variant="full" className="h-10 w-auto" />
          <div className="w-full space-y-3">
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading your accounts...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/90 to-accent relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-40 right-20 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <img
            src={legacyLogoWhite}
            alt="Anarix"
            className="h-12 w-auto mb-12 object-contain opacity-90"
          />
          <h1 className="text-4xl font-heading font-bold mb-4 leading-tight">
            Choose your workspace
          </h1>
          <p className="text-lg text-white/80 max-w-md">
            Select the account you want to manage. You can switch between
            accounts anytime from the sidebar.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <AnarixLogo variant="full" className="h-10 w-auto" />
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-heading font-semibold text-foreground mb-2">
              {user?.firstName ? `Hi, ${user.firstName}!` : "Welcome back"}
            </h2>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>

          {mappedAccounts.length > 0 ? (
            <>
              <p className="text-sm font-medium text-foreground mb-3">
                Choose your account
              </p>
              <div className="space-y-2.5">
                {mappedAccounts.map((account) => {
                  const accountId = account.accountId?._id;
                  const brandName = account.accountId?.brandName || "Unnamed Account";
                  const accountType = account.accountId?.accountType || "";
                  const initials = brandName
                    .split(" ")
                    .map((word: string) => word[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();
                  return (
                    <button
                      key={accountId}
                      onClick={() => handleLoginClick(accountId)}
                      disabled={isAccountLoading}
                      className="w-full flex items-center gap-3 rounded-lg border border-border bg-card p-4 text-left transition-colors hover:border-primary/50 hover:bg-accent/50 disabled:opacity-60"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-foreground">
                          {brandName}
                        </p>
                        {accountType && (
                          <p className="truncate text-xs capitalize text-muted-foreground">
                            {accountType}
                          </p>
                        )}
                      </div>
                      {account.isPinned && (
                        <span className="text-xs text-muted-foreground">Pinned</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="rounded-lg border border-border bg-card p-6 text-center">
              <p className="text-sm text-foreground">
                Sorry, there is no account linked to{" "}
                <span className="font-medium">&ldquo;{user?.email}&rdquo;</span>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Please contact your admin or email at{" "}
                <span className="font-medium text-primary">tech@anarix.ai</span>
              </p>
            </div>
          )}

          <div className="mt-8 text-center">
            <Button
              variant="ghost"
              onClick={handleLogoutClick}
              disabled={isAccountLoading}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
