import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type DataPanelType = "none" | "insights" | "notifications" | "productDetail" | "periodBreakdown" | "createSchedule" | "createCampaign" | "campaignSettings" | "adGroupSettings" | "addProductAd" | "createReport";
export type AiPanelType = "none" | "copilot";

// Backward compat alias
export type PanelType = DataPanelType | AiPanelType | "split";

interface ActivePanelContextType {
  // New dual-panel API
  dataPanel: DataPanelType;
  aiPanel: AiPanelType;
  setDataPanel: (panel: DataPanelType) => void;
  setAiPanel: (panel: AiPanelType) => void;
  closeDataPanel: () => void;
  closeAiPanel: () => void;
  hasAnyPanel: boolean;

  // Legacy API (backward compat — maps to new API)
  activePanel: PanelType;
  setActivePanel: (panel: PanelType) => void;
  closePanel: () => void;
}

const ActivePanelContext = createContext<ActivePanelContextType>({
  dataPanel: "none",
  aiPanel: "none",
  setDataPanel: () => {},
  setAiPanel: () => {},
  closeDataPanel: () => {},
  closeAiPanel: () => {},
  hasAnyPanel: false,
  activePanel: "none",
  setActivePanel: () => {},
  closePanel: () => {},
});

export function ActivePanelProvider({ children }: { children: ReactNode }) {
  const [dataPanel, setDataPanelState] = useState<DataPanelType>("none");
  const [aiPanel, setAiPanelState] = useState<AiPanelType>("none");

  // Mobile rule: only one panel (data OR ai) may be open at a time.
  const isMobile = () =>
    typeof document !== "undefined" &&
    document.documentElement.getAttribute("data-view") === "mobile";

  const setDataPanel = useCallback((panel: DataPanelType) => {
    if (isMobile() && panel !== "none") setAiPanelState("none");
    setDataPanelState(panel);
  }, []);

  const setAiPanel = useCallback((panel: AiPanelType) => {
    if (isMobile() && panel !== "none") setDataPanelState("none");
    setAiPanelState(panel);
  }, []);


  const closeDataPanel = useCallback(() => {
    setDataPanelState("none");
  }, []);

  const closeAiPanel = useCallback(() => {
    setAiPanelState("none");
  }, []);

  const hasAnyPanel = dataPanel !== "none" || aiPanel !== "none";

  // Legacy compat: activePanel returns whichever is most recently relevant
  const activePanel: PanelType = aiPanel !== "none" ? aiPanel : dataPanel;

  const setActivePanel = useCallback((panel: PanelType) => {
    if (panel === "copilot" || panel === "split") {
      setAiPanelState(panel === "split" ? "copilot" : panel as AiPanelType);
    } else if (panel === "none") {
      setDataPanelState("none");
      setAiPanelState("none");
    } else {
      setDataPanelState(panel as DataPanelType);
    }
  }, []);

  const closePanel = useCallback(() => {
    setDataPanelState("none");
    setAiPanelState("none");
  }, []);

  return (
    <ActivePanelContext.Provider value={{
      dataPanel, aiPanel,
      setDataPanel, setAiPanel,
      closeDataPanel, closeAiPanel,
      hasAnyPanel,
      activePanel, setActivePanel, closePanel,
    }}>
      {children}
    </ActivePanelContext.Provider>
  );
}

export function useActivePanel() {
  return useContext(ActivePanelContext);
}
