import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type Marketplace = "amazon" | "walmart";

interface MarketplaceContextType {
  marketplace: Marketplace;
  setMarketplace: (marketplace: Marketplace) => void;
  isWalmart: boolean;
  isAmazon: boolean;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

const STORAGE_KEY = "anarix_marketplace";

interface MarketplaceProviderProps {
  children: ReactNode;
  defaultMarketplace?: Marketplace;
}

export function MarketplaceProvider({ 
  children, 
  defaultMarketplace = "amazon" 
}: MarketplaceProviderProps) {
  const [marketplace, setMarketplaceState] = useState<Marketplace>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && ["amazon", "walmart"].includes(stored)) {
      return stored as Marketplace;
    }
    return defaultMarketplace;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, marketplace);
  }, [marketplace]);

  const setMarketplace = (mp: Marketplace) => {
    setMarketplaceState(mp);
  };

  const value: MarketplaceContextType = {
    marketplace,
    setMarketplace,
    isWalmart: marketplace === "walmart",
    isAmazon: marketplace === "amazon",
  };

  return (
    <MarketplaceContext.Provider value={value}>
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const context = useContext(MarketplaceContext);
  if (context === undefined) {
    throw new Error("useMarketplace must be used within a MarketplaceProvider");
  }
  return context;
}
