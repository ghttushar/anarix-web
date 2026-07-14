import { createContext, useContext, useState, useMemo, ReactNode } from "react";
import { useActivePanel } from "@/contexts/ActivePanelContext";

export type AanMode = "closed" | "copilot" | "split" | "workspace";
export type ConversationType = "general" | "report" | "audit" | "creative" | "rule" | "agent";
export type FilterType = "all" | "reports" | "audit" | "creative" | "agent";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  draft?: AanDraft;
}

export interface AanDraft {
  id: string;
  type: "rule" | "audit" | "bid_change" | "campaign_edit" | "report";
  title: string;
  description: string;
  changes: DraftChange[];
  status: "pending" | "approved" | "rejected" | "editing";
}

interface DraftChange {
  field: string;
  before: string | number;
  after: string | number;
}

export interface Conversation {
  id: string;
  title: string;
  type: ConversationType;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
  artifacts: AanDraft[];
}

interface AanContextInfo {
  page: string;
  dateRange?: string;
  selectedItems?: string[];
}

interface AanContextType {
  mode: AanMode;
  setMode: (mode: AanMode) => void;
  openCopilot: () => void;
  openSplit: (artifact: AanDraft) => void;
  openWorkspace: () => void;
  closeAan: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  openPanel: () => void;
  closePanel: () => void;
  messages: Message[];
  addMessage: (content: string, role: "user" | "assistant", draft?: AanDraft) => void;
  currentDraft: AanDraft | null;
  currentArtifact: AanDraft | null;
  setCurrentDraft: (draft: AanDraft | null) => void;
  approveDraft: (draftId: string) => void;
  rejectDraft: (draftId: string) => void;
  viewingArtifact: AanDraft | null;
  viewArtifact: (artifact: AanDraft) => void;
  closeArtifactView: () => void;
  isGenerating: boolean;
  generationType: "report" | "audit" | null;
  generationProgress: number;
  setGenerationState: (isGenerating: boolean, type: "report" | "audit" | null, progress: number) => void;
  conversations: Conversation[];
  currentConversation: Conversation | null;
  activeFilter: FilterType;
  setActiveFilter: (filter: FilterType) => void;
  startNewConversation: () => void;
  selectConversation: (id: string) => void;
  context: AanContextInfo;
  setContext: (context: AanContextInfo) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  pendingPrompt: string | null;
  setPendingPrompt: (prompt: string | null) => void;
  inputFocused: boolean;
  setInputFocused: (focused: boolean) => void;
}

const AanContext = createContext<AanContextType | undefined>(undefined);

const initialConversations: Conversation[] = [
  {
    id: "conv-1", title: "Campaign Performance Analysis", type: "report",
    createdAt: new Date(Date.now() - 86400000), updatedAt: new Date(Date.now() - 3600000),
    messages: [
      { id: "msg-1-1", role: "user", content: "Generate a report for my last 7 days campaign performance", timestamp: new Date(Date.now() - 3700000) },
      { id: "msg-1-2", role: "assistant", content: "I've analyzed your campaign performance for the last 7 days.\n\n**Summary:**\n- **Total Ad Spend:** $10,973.60\n- **Total Ad Sales:** $36,955.24\n- **Overall ROAS:** 3.37x\n\nYour campaigns are performing well above the 2.5x benchmark. Top performer is SP | Catch All Brand with 4.2x ROAS.", timestamp: new Date(Date.now() - 3650000) },
      { id: "msg-1-3", role: "assistant", content: "Report ready! Click below to view the full dashboard.", timestamp: new Date(Date.now() - 3600000), draft: { id: "report-demo-1", type: "report", title: "Last 7 Day Campaign Performance Dashboard", description: "Amazon • Jan 1 - Jan 7, 2026", changes: [{ field: "Total Ad Spend", before: "N/A", after: "$10,973.60" }, { field: "Total Ad Sales", before: "N/A", after: "$36,955.24" }, { field: "Overall ROAS", before: "N/A", after: "3.37x" }, { field: "Impressions", before: "N/A", after: "1,234,567" }, { field: "Top Campaign", before: "N/A", after: "SP | Catch All Brand (4.2x ROAS)" }, { field: "Lowest Performer", before: "N/A", after: "SP | Generic Keywords (1.8x ROAS)" }, { field: "Recommendation", before: "N/A", after: "Increase budget on top 3 campaigns" }], status: "pending" } },
    ],
    artifacts: [],
  },
  {
    id: "conv-2", title: "Q4 2025 Audit Review", type: "audit",
    createdAt: new Date(Date.now() - 172800000), updatedAt: new Date(Date.now() - 86400000),
    messages: [
      { id: "msg-2-1", role: "user", content: "Create an account health summary for Q4 2025", timestamp: new Date(Date.now() - 90000000) },
      { id: "msg-2-2", role: "assistant", content: "**Overall Health Score: 78/100**\n\nYour account shows strong fundamentals with some optimization opportunities.\n\n**Strengths:**\n- Consistent ROAS above benchmark\n- Good keyword coverage\n- Low wasted spend\n\n**Areas for Improvement:**\n- 12 campaigns with no conversions in 30 days\n- 3 ad groups with high ACoS (>50%)\n- Missing negative keywords on 8 campaigns", timestamp: new Date(Date.now() - 89000000) },
      { id: "msg-2-3", role: "assistant", content: "Audit complete! Click below to view the full health report.", timestamp: new Date(Date.now() - 86400000), draft: { id: "audit-demo-1", type: "audit", title: "Account Health Audit - Q4 2025", description: "Health Score: 78/100 • Risk Level: Low", changes: [{ field: "Health Score", before: "N/A", after: "78/100" }, { field: "Wasted Spend", before: "N/A", after: "$2,341 (-15% vs Q3)" }, { field: "Optimization Score", before: "N/A", after: "B+" }, { field: "Campaigns Reviewed", before: "N/A", after: "47 campaigns" }, { field: "Issues Found", before: "N/A", after: "23 issues" }, { field: "Critical Issues", before: "N/A", after: "3 requiring immediate action" }, { field: "Quick Wins", before: "N/A", after: "12 easy optimizations available" }], status: "pending" } },
    ],
    artifacts: [],
  },
  {
    id: "conv-3", title: "New Bid Strategy Discussion", type: "general",
    createdAt: new Date(Date.now() - 604800000), updatedAt: new Date(Date.now() - 604800000),
    messages: [
      { id: "msg-3-1", role: "assistant", content: "Hello! I'm Aan, your AI assistant for Anarix. I can help you analyze campaign performance, create rules, and optimize your advertising strategy. What would you like to explore?", timestamp: new Date(Date.now() - 604800000) },
    ],
    artifacts: [],
  },
];

export function AanProvider({ children }: { children: ReactNode }) {
  const { aiPanel, setAiPanel, closeAiPanel } = useActivePanel();

  const [internalMode, setInternalMode] = useState<"workspace" | null>(null);

  const mode: AanMode = useMemo(() => {
    if (internalMode === "workspace") return "workspace";
    if (aiPanel === "copilot") return "copilot";
    return "closed";
  }, [aiPanel, internalMode]);

  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>("conv-1");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [currentDraft, setCurrentDraft] = useState<AanDraft | null>(null);
  const [currentArtifact, setCurrentArtifact] = useState<AanDraft | null>(null);
  const [context, setContext] = useState<AanContextInfo>({ page: "Campaign Manager" });
  const [viewingArtifact, setViewingArtifact] = useState<AanDraft | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationType, setGenerationType] = useState<"report" | "audit" | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [selectedModel, setSelectedModel] = useState("gemini-flash");
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);
  const [inputFocused, setInputFocused] = useState(false);

  const currentConversation = useMemo(() => {
    return conversations.find((c) => c.id === currentConversationId) || null;
  }, [conversations, currentConversationId]);

  const messages = currentConversation?.messages || [];

  const setMode = (newMode: AanMode) => {
    if (newMode === "workspace") {
      setInternalMode("workspace");
      closeAiPanel();
    } else if (newMode === "copilot") {
      setInternalMode(null);
      setAiPanel("copilot");
    } else if (newMode === "split") {
      setInternalMode(null);
      setAiPanel("copilot");
    } else {
      setInternalMode(null);
      closeAiPanel();
    }
  };

  const openCopilot = () => {
    setInternalMode(null);
    setAiPanel("copilot");
  };

  const openSplit = (artifact: AanDraft) => {
    if (internalMode === "workspace") {
      setViewingArtifact(artifact);
    } else {
      setCurrentArtifact(artifact);
      setInternalMode(null);
      setAiPanel("copilot");
    }
  };

  const viewArtifact = (artifact: AanDraft) => setViewingArtifact(artifact);
  const closeArtifactView = () => setViewingArtifact(null);

  const openWorkspace = () => {
    setCurrentArtifact(null);
    setViewingArtifact(null);
    setInternalMode("workspace");
    closeAiPanel();
  };

  const closeAan = () => {
    setInternalMode(null);
    setCurrentArtifact(null);
    setViewingArtifact(null);
    closeAiPanel();
  };

  const isOpen = mode !== "closed";
  const setIsOpen = (open: boolean) => { if (open) openCopilot(); else closeAan(); };
  const openPanel = () => openCopilot();
  const closePanel = () => closeAan();

  const setGenerationState = (generating: boolean, type: "report" | "audit" | null, progress: number) => {
    setIsGenerating(generating);
    setGenerationType(type);
    setGenerationProgress(progress);
  };

  const addMessage = (content: string, role: "user" | "assistant", draft?: AanDraft) => {
    if (!currentConversationId) return;
    const newMessage: Message = { id: Date.now().toString(), role, content, timestamp: new Date(), draft };
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === currentConversationId
          ? { ...conv, messages: [...conv.messages, newMessage], updatedAt: new Date(), type: draft?.type === "report" ? "report" : draft?.type === "audit" ? "audit" : conv.type }
          : conv
      )
    );
    if (draft) setCurrentDraft(draft);
  };

  const approveDraft = (draftId: string) => {
    if (currentDraft?.id === draftId) {
      setCurrentDraft({ ...currentDraft, status: "approved" });
      addMessage(`✓ Draft "${currentDraft.title}" has been approved and applied.`, "assistant");
      setTimeout(() => setCurrentDraft(null), 2000);
    }
  };

  const rejectDraft = (draftId: string) => {
    if (currentDraft?.id === draftId) {
      setCurrentDraft({ ...currentDraft, status: "rejected" });
      addMessage(`Draft "${currentDraft.title}" has been rejected. No changes were made.`, "assistant");
      setTimeout(() => setCurrentDraft(null), 1500);
    }
  };

  const startNewConversation = () => {
    const newConv: Conversation = {
      id: `conv-${Date.now()}`, title: "New Conversation", type: "general", createdAt: new Date(), updatedAt: new Date(),
      messages: [{ id: "welcome", role: "assistant", content: "Hello! How can I help you today?", timestamp: new Date() }],
      artifacts: [],
    };
    setConversations((prev) => [newConv, ...prev]);
    setCurrentConversationId(newConv.id);
  };

  const selectConversation = (id: string) => setCurrentConversationId(id);

  return (
    <AanContext.Provider value={{
      mode, setMode, openCopilot, openSplit, openWorkspace, closeAan,
      isOpen, setIsOpen, openPanel, closePanel,
      messages, addMessage, currentDraft, currentArtifact, setCurrentDraft, approveDraft, rejectDraft,
      viewingArtifact, viewArtifact, closeArtifactView,
      isGenerating, generationType, generationProgress, setGenerationState,
      conversations, currentConversation, activeFilter, setActiveFilter, startNewConversation, selectConversation,
      context, setContext, selectedModel, setSelectedModel,
      pendingPrompt, setPendingPrompt,
      inputFocused, setInputFocused,
    }}>
      {children}
    </AanContext.Provider>
  );
}

export function useAan() {
  const context = useContext(AanContext);
  if (context === undefined) {
    throw new Error("useAan must be used within an AanProvider");
  }
  return context;
}
