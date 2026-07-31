import { createContext, useContext, ReactNode } from "react";
import { useActivePanel } from "@/contexts/ActivePanelContext";

export type InsightCategory = "critical" | "attention" | "positive";

export interface Insight {
  id: string;
  category: InsightCategory;
  title: string;
  description: string;
  action: string | null;
  timestamp: Date;
}

interface InsightsContextType {
  isOpen: boolean;
  openPanel: () => void;
  closePanel: () => void;
  insights: Insight[];
  criticalCount: number;
  attentionCount: number;
  positiveCount: number;
}

const InsightsContext = createContext<InsightsContextType | undefined>(undefined);

const mockInsights: Insight[] = [
  { id: "1", category: "critical", title: "High-spend, zero-conversion keywords detected", description: "15 keywords have spent over $500 with 0 conversions in the last 30 days.", action: "Pause or negatively target these keywords immediately.", timestamp: new Date(Date.now() - 3600000) },
  { id: "2", category: "critical", title: "Budget depleted campaigns", description: "3 campaigns ran out of budget before noon, missing peak traffic hours.", action: "Increase daily budget or adjust bid strategy.", timestamp: new Date(Date.now() - 7200000) },
  { id: "3", category: "attention", title: "Missing backend search terms", description: "23 products are missing optimized backend search terms.", action: "Add relevant backend keywords to improve discoverability.", timestamp: new Date(Date.now() - 10800000) },
  { id: "4", category: "attention", title: "Price competitiveness opportunity", description: "12 products are priced 15%+ higher than competitors.", action: "Review pricing strategy for these ASINs.", timestamp: new Date(Date.now() - 14400000) },
  { id: "5", category: "attention", title: "Low impression share on top keywords", description: "Your top 5 converting keywords have only 35% impression share.", action: "Consider increasing bids to capture more traffic.", timestamp: new Date(Date.now() - 18000000) },
  { id: "6", category: "positive", title: "Strong inventory health", description: "All products have sufficient stock levels for the next 45 days.", action: null, timestamp: new Date(Date.now() - 21600000) },
  { id: "7", category: "positive", title: "ROAS improvement detected", description: "Overall ROAS increased by 23% compared to last week.", action: null, timestamp: new Date(Date.now() - 25200000) },
  { id: "8", category: "positive", title: "New keyword winners identified", description: "8 new keywords are performing above your target ACoS.", action: null, timestamp: new Date(Date.now() - 28800000) },
];

export function InsightsProvider({ children }: { children: ReactNode }) {
  const { dataPanel, setDataPanel, closeDataPanel } = useActivePanel();

  const isOpen = dataPanel === "insights";
  const criticalCount = mockInsights.filter((i) => i.category === "critical").length;
  const attentionCount = mockInsights.filter((i) => i.category === "attention").length;
  const positiveCount = mockInsights.filter((i) => i.category === "positive").length;

  const openPanel = () => setDataPanel("insights");
  const closePanel = () => closeDataPanel();

  return (
    <InsightsContext.Provider value={{ isOpen, openPanel, closePanel, insights: mockInsights, criticalCount, attentionCount, positiveCount }}>
      {children}
    </InsightsContext.Provider>
  );
}

export function useInsights() {
  const context = useContext(InsightsContext);
  if (context === undefined) {
    throw new Error("useInsights must be used within an InsightsProvider");
  }
  return context;
}
