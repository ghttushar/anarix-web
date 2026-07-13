import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

interface LivingOSState {
  // Proposal lifecycle
  proposalStatus: "pending" | "approved" | "rejected" | "modified";
  proposalSentence: string;
  approveProposal: () => void;
  rejectProposal: () => void;
  modifyProposal: (next: string) => void;
  resetProposal: () => void;

  // Cooling window (12s undo)
  coolingRemaining: number | null;
  undoApproval: () => void;

  // Simulation mode
  simulating: boolean;
  toggleSimulation: (on?: boolean) => void;

  // Delegation face (per-domain flip)
  flippedDomainId: string | null;
  flipDomain: (id: string | null) => void;

  // Replay (per-domain timeline index; -1 = present)
  replayIndex: number;
  setReplayIndex: (i: number) => void;

  // Awareness bloom trigger
  bloomTick: number;
  triggerBloom: () => void;

  // Agent
  agentRunning: boolean;
  stopAgent: () => void;
  agentPanelOpen: boolean;
  setAgentPanelOpen: (v: boolean) => void;

  // Aan copilot sheet
  aanOpen: boolean;
  setAanOpen: (v: boolean) => void;
}

const Ctx = createContext<LivingOSState | null>(null);

export function LivingOSProvider({
  children,
  initialSentence,
}: {
  children: ReactNode;
  initialSentence: string;
}) {
  const [proposalStatus, setStatus] = useState<LivingOSState["proposalStatus"]>("pending");
  const [proposalSentence, setSentence] = useState(initialSentence);
  const [coolingRemaining, setCooling] = useState<number | null>(null);
  const [simulating, setSim] = useState(false);
  const [flippedDomainId, setFlipped] = useState<string | null>(null);
  const [replayIndex, setReplayIndex] = useState(-1);
  const [bloomTick, setBloom] = useState(0);
  const [agentRunning, setAgentRunning] = useState(true);
  const [agentPanelOpen, setAgentPanelOpen] = useState(false);
  const [aanOpen, setAanOpen] = useState(false);

  // Cooling window countdown
  useEffect(() => {
    if (coolingRemaining === null) return;
    if (coolingRemaining <= 0) {
      setCooling(null);
      return;
    }
    const t = setTimeout(() => setCooling((c) => (c === null ? null : c - 1)), 1000);
    return () => clearTimeout(t);
  }, [coolingRemaining]);

  const approveProposal = useCallback(() => {
    setStatus("approved");
    setCooling(12);
    setBloom((b) => b + 1);
  }, []);

  const rejectProposal = useCallback(() => setStatus("rejected"), []);
  const modifyProposal = useCallback((next: string) => {
    setSentence(next);
    setStatus("modified");
  }, []);
  const resetProposal = useCallback(() => {
    setStatus("pending");
    setSentence(initialSentence);
    setCooling(null);
  }, [initialSentence]);

  const undoApproval = useCallback(() => {
    setStatus("pending");
    setCooling(null);
  }, []);

  const toggleSimulation = useCallback(
    (on?: boolean) => setSim((v) => (typeof on === "boolean" ? on : !v)),
    [],
  );
  const flipDomain = useCallback((id: string | null) => setFlipped(id), []);
  const triggerBloom = useCallback(() => setBloom((b) => b + 1), []);
  const stopAgent = useCallback(() => setAgentRunning(false), []);

  return (
    <Ctx.Provider
      value={{
        proposalStatus,
        proposalSentence,
        approveProposal,
        rejectProposal,
        modifyProposal,
        resetProposal,
        coolingRemaining,
        undoApproval,
        simulating,
        toggleSimulation,
        flippedDomainId,
        flipDomain,
        replayIndex,
        setReplayIndex,
        bloomTick,
        triggerBloom,
        agentRunning,
        stopAgent,
        agentPanelOpen,
        setAgentPanelOpen,
        aanOpen,
        setAanOpen,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useLivingOS() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useLivingOS must be used inside LivingOSProvider");
  return v;
}
