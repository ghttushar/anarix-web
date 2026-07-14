import { createContext, useContext, useState, useCallback, ReactNode, useMemo } from "react";

export interface CurrencyConfig {
  code: string;
  name: string;
  symbol: string;
  locale: string;
  rate: number;
}

export const CURRENCIES: Record<string, CurrencyConfig> = {
  USD: { code: "USD", name: "US Dollar", symbol: "$", locale: "en-US", rate: 1.00 },
  EUR: { code: "EUR", name: "Euro", symbol: "€", locale: "de-DE", rate: 0.92 },
  GBP: { code: "GBP", name: "British Pound", symbol: "£", locale: "en-GB", rate: 0.79 },
  INR: { code: "INR", name: "Indian Rupee", symbol: "₹", locale: "en-IN", rate: 83.42 },
  CAD: { code: "CAD", name: "Canadian Dollar", symbol: "CA$", locale: "en-CA", rate: 1.36 },
  AUD: { code: "AUD", name: "Australian Dollar", symbol: "A$", locale: "en-AU", rate: 1.53 },
  JPY: { code: "JPY", name: "Japanese Yen", symbol: "¥", locale: "ja-JP", rate: 149.50 },
  BRL: { code: "BRL", name: "Brazilian Real", symbol: "R$", locale: "pt-BR", rate: 4.97 },
  MXN: { code: "MXN", name: "Mexican Peso", symbol: "MX$", locale: "es-MX", rate: 17.15 },
};

interface FormatOptions {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

interface CurrencyContextValue {
  displayCurrency: string;
  setDisplayCurrency: (code: string) => void;
  formatCurrency: (value: number, options?: FormatOptions) => string;
  convertValue: (value: number) => number;
  exchangeRate: number;
  lastUpdated: Date;
  currencies: typeof CURRENCIES;
  currencyConfig: CurrencyConfig;
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

const STORAGE_KEY = "anarix-display-currency";
const MOCK_LAST_UPDATED = new Date();

function getInitialCurrency(): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && CURRENCIES[stored]) return stored;
  } catch {}
  return "USD";
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [displayCurrency, setDisplayCurrencyState] = useState<string>(getInitialCurrency);

  const currencyConfig = CURRENCIES[displayCurrency] || CURRENCIES.USD;
  const exchangeRate = currencyConfig.rate;

  const setDisplayCurrency = useCallback((code: string) => {
    if (CURRENCIES[code]) {
      setDisplayCurrencyState(code);
      try { localStorage.setItem(STORAGE_KEY, code); } catch {}
    }
  }, []);

  const convertValue = useCallback((value: number): number => {
    return value * exchangeRate;
  }, [exchangeRate]);

  const formatCurrency = useCallback((value: number, options?: FormatOptions): string => {
    const converted = value * exchangeRate;
    const minDigits = options?.minimumFractionDigits ?? 2;
    const maxDigits = options?.maximumFractionDigits ?? 2;
    return new Intl.NumberFormat(currencyConfig.locale, {
      style: "currency",
      currency: currencyConfig.code,
      minimumFractionDigits: minDigits,
      maximumFractionDigits: maxDigits,
    }).format(converted);
  }, [exchangeRate, currencyConfig.locale, currencyConfig.code]);

  const value = useMemo<CurrencyContextValue>(() => ({
    displayCurrency,
    setDisplayCurrency,
    formatCurrency,
    convertValue,
    exchangeRate,
    lastUpdated: MOCK_LAST_UPDATED,
    currencies: CURRENCIES,
    currencyConfig,
  }), [displayCurrency, setDisplayCurrency, formatCurrency, convertValue, exchangeRate, currencyConfig]);

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
