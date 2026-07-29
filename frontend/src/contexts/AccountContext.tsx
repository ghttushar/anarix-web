import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface ConnectedAccount {
  id: string;
  marketplace: "amazon" | "walmart";
  accountType: "seller" | "vendor" | "ads" | "connect" | "marketplace";
  merchantName: string;
  merchantId: string;
  region: string;
  status: "connected" | "syncing" | "error";
  lastSync?: string;
  bidAutomation?: "ai" | "rule" | "off";
}

export interface AccountGroup {
  id: string;
  marketplace: "amazon";
  name: string;
  accountType: "seller" | "vendor" | "ads";
  accountId?: string;
}

export interface AccountRegion {
  id: string;
  groupId: string;
  region: string;
  merchantName: string;
  merchantId: string;
  status: "connected" | "syncing" | "error";
  lastSync?: string;
  bidAutomation?: "ai" | "rule" | "off";
  amazonProfileId?: string;
  sellingPartnerId?: string;
}

export const AMAZON_REGIONS = [
  { value: "US", label: "United States" },
  { value: "CA", label: "Canada" },
  { value: "MX", label: "Mexico" },
  { value: "UK", label: "United Kingdom" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
  { value: "IT", label: "Italy" },
  { value: "ES", label: "Spain" },
  { value: "JP", label: "Japan" },
  { value: "AU", label: "Australia" },
  { value: "IN", label: "India" },
  { value: "SA", label: "Saudi Arabia" },
  { value: "AE", label: "UAE" },
  { value: "BR", label: "Brazil" },
  { value: "SG", label: "Singapore" },
  { value: "NL", label: "Netherlands" },
  { value: "SE", label: "Sweden" },
  { value: "PL", label: "Poland" },
];

export interface SettingsEntry {
  marketplace: string;
  accountType: string;
  amazonProfileId: string;
  sellingPartnerId: string;
  countryCode: string;
}

interface AccountContextType {
  accounts: ConnectedAccount[];
  addAccount: (account: Omit<ConnectedAccount, "id">) => void;
  updateAccount: (id: string, updates: Partial<ConnectedAccount>) => void;
  removeAccount: (id: string) => void;
  accountGroups: AccountGroup[];
  accountRegions: AccountRegion[];
  addAccountGroup: (group: Omit<AccountGroup, "id">) => AccountGroup;
  addRegionToGroup: (region: Omit<AccountRegion, "id">) => void;
  updateRegion: (id: string, updates: Partial<AccountRegion>) => void;
  removeRegion: (id: string) => void;
  clearAccounts: () => void;
  hasAccounts: boolean;
  isOnboarding: boolean;
  completeOnboarding: () => void;
  currentAccount: ConnectedAccount | null;
  setCurrentAccount: (id: string) => void;
  currentRegion: AccountRegion | null;
  currentAccountGroup: AccountGroup | null;
  setCurrentRegion: (regionId: string) => void;
  populateFromSettings: (entries: SettingsEntry[], brandName: string, accountId?: string) => AccountRegion | null;
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
const ACCOUNT_GROUPS_KEY = "anarix_account_groups";
const ACCOUNT_REGIONS_KEY = "anarix_account_regions";
const CURRENT_REGION_KEY = "anarix_current_region";
const MIGRATED_KEY = "anarix_migration_v1_done";

function migrateOldAmazonAccounts(
  oldAccounts: ConnectedAccount[],
): { nonAmazon: ConnectedAccount[]; groups: AccountGroup[]; regions: AccountRegion[] } {
  const amazon = oldAccounts.filter((a) => a.marketplace === "amazon");
  const nonAmazon = oldAccounts.filter((a) => a.marketplace !== "amazon");

  if (amazon.length === 0) return { nonAmazon, groups: [], regions: [] };

  const groups: AccountGroup[] = [];
  const regions: AccountRegion[] = [];
  const seenNames = new Set<string>();

  for (const acc of amazon) {
    const key = acc.merchantName;
    if (!seenNames.has(key)) {
      seenNames.add(key);
      groups.push({
        id: `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        marketplace: "amazon",
        name: acc.merchantName,
        accountType: acc.accountType as "seller" | "vendor" | "ads",
      });
    }
    const group = groups[groups.length - 1];
    regions.push({
      id: `reg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      groupId: group.id,
      region: acc.region,
      merchantName: acc.merchantName,
      merchantId: acc.merchantId,
      status: acc.status,
      lastSync: acc.lastSync,
      bidAutomation: acc.bidAutomation,
    });
  }

  return { nonAmazon, groups, regions };
}

export function AccountProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<ConnectedAccount[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed: ConnectedAccount[] = stored ? JSON.parse(stored) : [];
    const migrated = localStorage.getItem(MIGRATED_KEY) === "true";
    if (migrated) return parsed;
    const { nonAmazon, groups, regions } = migrateOldAmazonAccounts(parsed);
    if (groups.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nonAmazon));
      localStorage.setItem(ACCOUNT_GROUPS_KEY, JSON.stringify(groups));
      localStorage.setItem(ACCOUNT_REGIONS_KEY, JSON.stringify(regions));
      localStorage.setItem(MIGRATED_KEY, "true");
    }
    return nonAmazon;
  });

  const [accountGroups, setAccountGroups] = useState<AccountGroup[]>(() => {
    const stored = localStorage.getItem(ACCOUNT_GROUPS_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const [accountRegions, setAccountRegions] = useState<AccountRegion[]>(() => {
    const stored = localStorage.getItem(ACCOUNT_REGIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const [isOnboarding, setIsOnboarding] = useState(() => {
    const completed = localStorage.getItem(ONBOARDING_KEY);
    return !completed;
  });

  const [currentAccountId, setCurrentAccountId] = useState<string | null>(() => {
    return localStorage.getItem(CURRENT_ACCOUNT_KEY);
  });

  const [currentRegionId, setCurrentRegionId] = useState<string | null>(() => {
    const stored = localStorage.getItem(CURRENT_REGION_KEY);
    if (stored) return stored;
    const regions = JSON.parse(localStorage.getItem(ACCOUNT_REGIONS_KEY) || "[]") as AccountRegion[];
    return regions.length > 0 ? regions[0].id : null;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem(ACCOUNT_GROUPS_KEY, JSON.stringify(accountGroups));
  }, [accountGroups]);

  useEffect(() => {
    localStorage.setItem(ACCOUNT_REGIONS_KEY, JSON.stringify(accountRegions));
  }, [accountRegions]);

  useEffect(() => {
    if (currentAccountId) {
      localStorage.setItem(CURRENT_ACCOUNT_KEY, currentAccountId);
    }
  }, [currentAccountId]);

  useEffect(() => {
    if (currentRegionId) {
      localStorage.setItem(CURRENT_REGION_KEY, currentRegionId);
    }
  }, [currentRegionId]);

  useEffect(() => {
    if (currentRegion?.amazonProfileId) {
      localStorage.setItem("anarix_amazon_profile_id", currentRegion.amazonProfileId);
    } else {
      localStorage.removeItem("anarix_amazon_profile_id");
    }
    if (currentRegion?.sellingPartnerId) {
      localStorage.setItem("anarix_selling_partner_id", currentRegion.sellingPartnerId);
    } else {
      localStorage.removeItem("anarix_selling_partner_id");
    }
  }, [currentRegion]);

  const addAccount = (account: Omit<ConnectedAccount, "id">) => {
    const newAccount: ConnectedAccount = {
      ...account,
      id: `acc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    setAccounts((prev) => [...prev, newAccount]);
    if (accounts.length === 0 && accountGroups.length === 0 && accountRegions.length === 0) {
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
      const remaining = accounts.filter((a) => a.id !== id);
      setCurrentAccountId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const addAccountGroup = (group: Omit<AccountGroup, "id">) => {
    const newGroup: AccountGroup = {
      ...group,
      id: `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    setAccountGroups((prev) => [...prev, newGroup]);
    if (accounts.length === 0 && accountGroups.length === 0 && accountRegions.length === 0) {
      setCurrentRegionId(newGroup.id);
    }
    return newGroup;
  };

  const addRegionToGroup = (region: Omit<AccountRegion, "id">) => {
    const newRegion: AccountRegion = {
      ...region,
      id: `reg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    setAccountRegions((prev) => [...prev, newRegion]);
    if (accountRegions.length === 0 && !currentRegionId) {
      setCurrentRegionId(newRegion.id);
    }
  };

  const updateRegion = (id: string, updates: Partial<AccountRegion>) => {
    setAccountRegions((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  const removeRegion = (id: string) => {
    setAccountRegions((prev) => prev.filter((r) => r.id !== id));
    if (currentRegionId === id) {
      const remaining = accountRegions.filter((r) => r.id !== id);
      setCurrentRegionId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const clearAccounts = () => {
    setAccounts([]);
    setAccountGroups([]);
    setAccountRegions([]);
    setCurrentAccountId(null);
    setCurrentRegionId(null);
    setIsOnboarding(true);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ONBOARDING_KEY);
    localStorage.removeItem(CURRENT_ACCOUNT_KEY);
    localStorage.removeItem(ACCOUNT_GROUPS_KEY);
    localStorage.removeItem(ACCOUNT_REGIONS_KEY);
    localStorage.removeItem(CURRENT_REGION_KEY);
  };

  const completeOnboarding = () => {
    setIsOnboarding(false);
    localStorage.setItem(ONBOARDING_KEY, "true");
  };

  const setCurrentAccount = (id: string) => {
    setCurrentAccountId(id);
  };

  const setCurrentRegion = (regionId: string) => {
    setCurrentRegionId(regionId);
  };

  const populateFromSettings = (entries: SettingsEntry[], brandName: string, accountId?: string): AccountRegion | null => {
    const groups: AccountGroup[] = [];
    const regions: AccountRegion[] = [];

    for (const entry of entries) {
      let group = groups.find(
        (g) => g.accountType === entry.accountType && g.marketplace === (entry.marketplace as "amazon")
      );
      if (!group) {
        group = {
          id: `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          marketplace: entry.marketplace as "amazon",
          name: `${brandName} - ${entry.accountType.charAt(0).toUpperCase() + entry.accountType.slice(1)}`,
          accountType: entry.accountType as "seller" | "vendor" | "ads",
          accountId,
        };
        groups.push(group);
      }

      regions.push({
        id: `reg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        groupId: group.id,
        region: entry.countryCode,
        merchantName: brandName,
        merchantId: accountId || "",
        status: "connected",
        lastSync: new Date().toISOString(),
        amazonProfileId: entry.amazonProfileId,
        sellingPartnerId: entry.sellingPartnerId,
      });
    }

    setAccountGroups(groups);
    setAccountRegions(regions);

    const firstRegion = regions.length > 0 ? regions[0] : null;
    if (firstRegion) {
      setCurrentRegionId(firstRegion.id);
    }

    return firstRegion;
  };

  const currentAccount = accounts.find((a) => a.id === currentAccountId) || accounts[0] || null;
  const currentRegion = accountRegions.find((r) => r.id === currentRegionId) || accountRegions[0] || null;
  const currentAccountGroup = currentRegion
    ? accountGroups.find((g) => g.id === currentRegion.groupId) || null
    : null;
  const hasAccounts = accounts.length > 0 || accountGroups.length > 0;

  return (
    <AccountContext.Provider
      value={{
        accounts,
        addAccount,
        updateAccount,
        removeAccount,
        accountGroups,
        accountRegions,
        addAccountGroup,
        addRegionToGroup,
        updateRegion,
        removeRegion,
        clearAccounts,
        hasAccounts,
        isOnboarding,
        completeOnboarding,
        currentAccount,
        setCurrentAccount,
        currentRegion,
        currentAccountGroup,
        setCurrentRegion,
        populateFromSettings,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}
