import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface ConnectedAccount {
  id: string;
  marketplace: "amazon" | "walmart" | "shopify" | "tiktok";
  accountType: "seller" | "vendor" | "ads" | "connect" | "marketplace";
  merchantName: string;
  merchantId: string;
  region: string;
  status: "connected" | "syncing" | "error";
  lastSync?: string;
  bidAutomation?: "ai" | "rule" | "off";
}

interface AccountContextType {
  accounts: ConnectedAccount[];
  addAccount: (account: Omit<ConnectedAccount, "id">) => void;
  updateAccount: (id: string, updates: Partial<ConnectedAccount>) => void;
  removeAccount: (id: string) => void;
  clearAccounts: () => void;
  hasAccounts: boolean;
  isOnboarding: boolean;
  completeOnboarding: () => void;
  currentAccount: ConnectedAccount | null;
  setCurrentAccount: (id: string) => void;
}

const AccountContext = createContext<AccountContextType | null>(null);

export function useAccounts() {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccounts must be used within AccountProvider");
  }
  return context;
}

const STORAGE_KEY = "anarix_accounts";
const ONBOARDING_KEY = "anarix_onboarding_complete";
const CURRENT_ACCOUNT_KEY = "anarix_current_account";

export function AccountProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<ConnectedAccount[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const [isOnboarding, setIsOnboarding] = useState(() => {
    const completed = localStorage.getItem(ONBOARDING_KEY);
    return !completed;
  });

  const [currentAccountId, setCurrentAccountId] = useState<string | null>(() => {
    return localStorage.getItem(CURRENT_ACCOUNT_KEY);
  });

  // Persist accounts to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
  }, [accounts]);

  // Persist current account
  useEffect(() => {
    if (currentAccountId) {
      localStorage.setItem(CURRENT_ACCOUNT_KEY, currentAccountId);
    }
  }, [currentAccountId]);

  const addAccount = (account: Omit<ConnectedAccount, "id">) => {
    const newAccount: ConnectedAccount = {
      ...account,
      id: `acc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    setAccounts((prev) => [...prev, newAccount]);
    
    // Set as current if first account
    if (accounts.length === 0) {
      setCurrentAccountId(newAccount.id);
    }
  };

  const updateAccount = (id: string, updates: Partial<ConnectedAccount>) => {
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === id ? { ...acc, ...updates } : acc))
    );
  };

  const removeAccount = (id: string) => {
    setAccounts((prev) => prev.filter((acc) => acc.id !== id));
    if (currentAccountId === id) {
      setCurrentAccountId(accounts.find((a) => a.id !== id)?.id || null);
    }
  };

  const clearAccounts = () => {
    setAccounts([]);
    setCurrentAccountId(null);
    setIsOnboarding(true);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ONBOARDING_KEY);
    localStorage.removeItem(CURRENT_ACCOUNT_KEY);
  };

  const completeOnboarding = () => {
    setIsOnboarding(false);
    localStorage.setItem(ONBOARDING_KEY, "true");
  };

  const setCurrentAccount = (id: string) => {
    setCurrentAccountId(id);
  };

  const currentAccount = accounts.find((a) => a.id === currentAccountId) || accounts[0] || null;
  const hasAccounts = accounts.length > 0;

  return (
    <AccountContext.Provider
      value={{
        accounts,
        addAccount,
        updateAccount,
        removeAccount,
        clearAccounts,
        hasAccounts,
        isOnboarding,
        completeOnboarding,
        currentAccount,
        setCurrentAccount,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}
