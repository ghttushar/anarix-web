import { createContext, useContext, useState, useCallback, ReactNode } from "react";

const STORAGE_KEY = "anarix-billing-flow";

interface BillingFlowContextType {
  billingFlowEnabled: boolean;
  toggleBillingFlow: () => void;
  setBillingFlow: (v: boolean) => void;
}

const BillingFlowContext = createContext<BillingFlowContextType>({
  billingFlowEnabled: false,
  toggleBillingFlow: () => {},
  setBillingFlow: () => {},
});

export function BillingFlowProvider({ children }: { children: ReactNode }) {
  const [billingFlowEnabled, setState] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored !== null ? JSON.parse(stored) : false;
    } catch {
      return false;
    }
  });

  const setBillingFlow = useCallback((v: boolean) => {
    setState(v);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(v)); } catch {}
  }, []);

  const toggleBillingFlow = useCallback(() => {
    setState((prev) => {
      const next = !prev;
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  return (
    <BillingFlowContext.Provider value={{ billingFlowEnabled, toggleBillingFlow, setBillingFlow }}>
      {children}
    </BillingFlowContext.Provider>
  );
}

export function useBillingFlow() {
  return useContext(BillingFlowContext);
}
