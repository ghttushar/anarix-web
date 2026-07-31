import { createContext, useContext, useState, ReactNode } from "react";
import { subDays } from "date-fns";

type AdType = "All" | "SP" | "SB" | "SD" | "SV";
type Frequency = "Daily" | "Weekly" | "Monthly";

interface DateRange {
  from: Date;
  to: Date;
}

interface FilterContextType {
  adType: AdType;
  setAdType: (value: AdType) => void;
  frequency: Frequency;
  setFrequency: (value: Frequency) => void;
  dateRange: DateRange;
  setDateRange: (value: DateRange) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [adType, setAdType] = useState<AdType>(() => {
    return (localStorage.getItem("anarix-adType") as AdType) || "All";
  });
  const [frequency, setFrequency] = useState<Frequency>(() => {
    return (localStorage.getItem("anarix-frequency") as Frequency) || "Daily";
  });
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const stored = localStorage.getItem("anarix-dateRange");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return { from: new Date(parsed.from), to: new Date(parsed.to) };
      } catch { /* fall through */ }
    }
    return { from: subDays(new Date(), 7), to: new Date() };
  });

  const handleAdType = (value: AdType) => {
    setAdType(value);
    localStorage.setItem("anarix-adType", value);
  };

  const handleFrequency = (value: Frequency) => {
    setFrequency(value);
    localStorage.setItem("anarix-frequency", value);
  };

  const handleDateRange = (value: DateRange) => {
    setDateRange(value);
    localStorage.setItem("anarix-dateRange", JSON.stringify(value));
  };

  return (
    <FilterContext.Provider
      value={{
        adType,
        setAdType: handleAdType,
        frequency,
        setFrequency: handleFrequency,
        dateRange,
        setDateRange: handleDateRange,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  const context = useContext(FilterContext);
  if (!context) throw new Error("useFilter must be used within FilterProvider");
  return context;
}
