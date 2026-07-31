import { accountStorage, SettingsAccount, SelectedDSPAccount } from "./account-storage";

export function selectAdvertisingAccount(account: SettingsAccount | null) {
  if (!account) return;
  accountStorage.setSelectedAdvertisingAccount(account);
  accountStorage.setLastSelectedMarketplace(account.marketplace);
  if (account.marketplace === "amazon") {
    accountStorage.setLastSelectedAmazonAccount(account);
  }
  if (account.marketplace === "walmart") {
    accountStorage.setLastSelectedWalmartAccount(account);
  }
  const countryCode =
    account.advertising?.countryCode ??
    account.catalog?.countryCode ??
    "US";
  accountStorage.setAccountCountryCode(countryCode);
  accountStorage.setMIAccountCountryCode(countryCode);
}

export function initializeSelectedAccounts(availableAccounts: SettingsAccount[]) {
  accountStorage.setAvailableAccounts(availableAccounts);

  const lastMarketplace = accountStorage.getLastSelectedMarketplace();
  const marketplaceAccounts = availableAccounts.filter(
    (account) => account.marketplace === lastMarketplace
  );
  const pool = marketplaceAccounts.length > 0 ? marketplaceAccounts : availableAccounts;

  const stored = accountStorage.getSelectedAdvertisingAccount();
  const storedKey =
    stored?.advertising?.amazonProfileId || stored?.advertising?.walmartAdvertiserId;

  const matchedAccount =
    pool.find(
      (account) =>
        account.advertising?.amazonProfileId === storedKey ||
        account.advertising?.walmartAdvertiserId === storedKey
    ) ||
    pool.find((account) => account.advertising) ||
    availableAccounts.find((account) => account.advertising) ||
    null;

  selectAdvertisingAccount(matchedAccount);

  const catalogAccount =
    availableAccounts.find((account) => account.catalog?.partnerId) ??
    matchedAccount ??
    null;
  if (catalogAccount) {
    accountStorage.setSelectedCatalogAccount(catalogAccount);
  }

  return matchedAccount;
}

export function initializeDSPAccounts(dspAccounts: SelectedDSPAccount[]) {
  accountStorage.setAvailableDSPAccounts(dspAccounts);
  const stored = accountStorage.getSelectedDSPAccount();
  const matchedAccount =
    dspAccounts.find((account) => account.advertiserId === stored?.advertiserId) ??
    dspAccounts[0] ??
    null;
  accountStorage.setSelectedDSPAccount(matchedAccount);
  return matchedAccount;
}
