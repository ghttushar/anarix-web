const safeParse = <T>(raw: string | null): T | null => {
  if (!raw || raw === "undefined") return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

export interface SelectedAdvertisingAccount {
  marketplace?: string;
  accountType?: string;
  advertising?: {
    accountId?: string;
    brandName?: string;
    amazonProfileId?: string;
    walmartAdvertiserId?: string;
    countryCode?: string;
    currencyCode?: string;
  };
  catalog?: {
    partnerId?: string;
    partnerDisplayName?: string;
    partnerStoreId?: string;
  };
  dspAccount?: {
    accountId?: string;
    advertiserId?: string;
    name?: string;
  };
}

export interface SelectedAMCInstance {
  label: string;
  value: string;
}

export interface SelectedDSPAccount {
  accountId?: string;
  advertiserId?: string;
  name?: string;
  country?: string;
  currency?: string;
}

export const accountStorage = {
  getAuthToken: (): string => {
    return localStorage.getItem("authToken") || "";
  },
  setAuthToken: (authToken: string) => {
    localStorage.setItem("authToken", authToken);
  },

  getSelectedAdvertisingAccount: (): SelectedAdvertisingAccount | null => {
    const stored = safeParse<SelectedAdvertisingAccount>(
      localStorage.getItem("selectedAdvertisingAccount")
    );
    if (stored) return stored;

    const profileId = localStorage.getItem("anarix_amazon_profile_id");
    if (profileId) {
      return {
        marketplace: "amazon",
        advertising: { amazonProfileId: profileId },
      };
    }
    return null;
  },
  setSelectedAdvertisingAccount: (account: SelectedAdvertisingAccount | null) => {
    if (!account) {
      localStorage.removeItem("selectedAdvertisingAccount");
      return;
    }
    localStorage.setItem("selectedAdvertisingAccount", JSON.stringify(account));
  },

  getSelectedCatalogAccount: (): SelectedAdvertisingAccount | null => {
    const stored = safeParse<SelectedAdvertisingAccount>(
      localStorage.getItem("selectedCatalogAccount")
    );
    if (stored) return stored;

    const partnerId = localStorage.getItem("anarix_selling_partner_id");
    if (partnerId) {
      return { catalog: { partnerId } };
    }
    return null;
  },
  setSelectedCatalogAccount: (account: SelectedAdvertisingAccount | null) => {
    if (!account) {
      localStorage.removeItem("selectedCatalogAccount");
      return;
    }
    localStorage.setItem("selectedCatalogAccount", JSON.stringify(account));
  },

  getSelectedAMCInstance: (): SelectedAMCInstance | null => {
    return safeParse<SelectedAMCInstance>(
      localStorage.getItem("selectedInstance")
    );
  },
  setSelectedAMCInstance: (instance: SelectedAMCInstance | null) => {
    if (!instance) {
      localStorage.removeItem("selectedInstance");
      return;
    }
    localStorage.setItem("selectedInstance", JSON.stringify(instance));
  },

  getSelectedDSPAccount: (): SelectedDSPAccount | null => {
    return safeParse<SelectedDSPAccount>(
      localStorage.getItem("selectedDSPAccount")
    );
  },
  setSelectedDSPAccount: (account: SelectedDSPAccount | null) => {
    if (!account) {
      localStorage.removeItem("selectedDSPAccount");
      return;
    }
    localStorage.setItem("selectedDSPAccount", JSON.stringify(account));
  },

  getAvailableAccounts: (): SelectedAdvertisingAccount[] => {
    return safeParse<SelectedAdvertisingAccount[]>(
      localStorage.getItem("availableAccounts")
    ) ?? [];
  },
  setAvailableAccounts: (accounts: SelectedAdvertisingAccount[]) => {
    localStorage.setItem("availableAccounts", JSON.stringify(accounts));
  },

  getLastSelectedAmazonAccount: (): SelectedAdvertisingAccount | null => {
    return safeParse<SelectedAdvertisingAccount>(
      localStorage.getItem("lastSelectedAmzAccount")
    );
  },
  setLastSelectedAmazonAccount: (account: SelectedAdvertisingAccount | null) => {
    if (!account) {
      localStorage.removeItem("lastSelectedAmzAccount");
      return;
    }
    localStorage.setItem("lastSelectedAmzAccount", JSON.stringify(account));
  },

  getLastSelectedWalmartAccount: (): SelectedAdvertisingAccount | null => {
    return safeParse<SelectedAdvertisingAccount>(
      localStorage.getItem("lastSelectedWmtAccount")
    );
  },
  setLastSelectedWalmartAccount: (account: SelectedAdvertisingAccount | null) => {
    if (!account) {
      localStorage.removeItem("lastSelectedWmtAccount");
      return;
    }
    localStorage.setItem("lastSelectedWmtAccount", JSON.stringify(account));
  },

  getLastSelectedMarketplace: (): string => {
    return localStorage.getItem("lastSelectedMarketplace") || "amazon";
  },
  setLastSelectedMarketplace: (marketplace: string) => {
    localStorage.setItem("lastSelectedMarketplace", marketplace);
  },

  getAccountCountryCode: (): string => {
    return localStorage.getItem("accountCountryCode") || "US";
  },
  setAccountCountryCode: (countryCode: string) => {
    localStorage.setItem("accountCountryCode", countryCode);
  },

  getMIAccountCountryCode: (): string => {
    return localStorage.getItem("miAccountCountryCode") || "";
  },
  setMIAccountCountryCode: (countryCode: string) => {
    localStorage.setItem("miAccountCountryCode", countryCode);
  },

  clearAccountState: () => {
    const keys = [
      "selectedAdvertisingAccount",
      "selectedCatalogAccount",
      "selectedInstance",
      "selectedDSPAccount",
      "availableAccounts",
      "lastSelectedAmzAccount",
      "lastSelectedWmtAccount",
      "lastSelectedMarketplace",
      "accountCountryCode",
      "miAccountCountryCode",
      "anarix_amazon_profile_id",
      "anarix_selling_partner_id",
      "anarix_accounts",
      "anarix_current_account",
      "anarix_account_groups",
      "anarix_account_regions",
      "anarix_current_region",
    ];
    keys.forEach((key) => localStorage.removeItem(key));
  },
};
