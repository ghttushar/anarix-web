import { useLivingOS } from "../state/LivingOSContext";
import { scenario } from "../scenario";

export function AgentAmbientPanel() {
  const { agentPanelOpen, setAgentPanelOpen, agentRunning, stopAgent } = useLivingOS();
  if (!agentPanelOpen) return null;
  return (
    <div
      onClick={() => setAgentPanelOpen(false)}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 30,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-end",
        padding: 32,
      }}
    >
      <aside
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 380,
          background: "var(--los-paper-warm)",
          border: "1px solid var(--los-line)",
          padding: "24px 26px",
          boxShadow: "0 24px 60px -30px rgba(26,22,20,0.35)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 14,
          }}
        >
          <span
            className="livingos-breath"
            style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--los-warm)" }}
          />
          <span
            style={{
              fontFamily: "var(--los-mono)",
              fontSize: 10,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--los-warm)",
            }}
          >
            {agentRunning ? "Running" : "Stopped"} · ~{scenario.agent.remainingMinutes}m
          </span>
        </div>

        <div
          style={{
            fontFamily: "var(--los-serif)",
            fontSize: 20,
            color: "var(--los-ink)",
            lineHeight: 1.35,
            marginBottom: 14,
          }}
        >
          Aan is {scenario.agent.label}.
        </div>

        <p
          style={{
            fontFamily: "var(--los-sans)",
            fontSize: 13.5,
            lineHeight: 1.6,
            color: "var(--los-ink-muted)",
            margin: "0 0 22px",
          }}
        >
          {scenario.agent.detail}
        </p>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={stopAgent}
            disabled={!agentRunning}
            style={{
              fontFamily: "var(--los-sans)",
              fontSize: 13,
              padding: "9px 16px",
              background: "transparent",
              border: "1px solid var(--los-line)",
              cursor: agentRunning ? "pointer" : "not-allowed",
              color: "var(--los-ink)",
              opacity: agentRunning ? 1 : 0.4,
            }}
          >
            Stop
          </button>
          <button
            onClick={() => setAgentPanelOpen(false)}
            style={{
              fontFamily: "var(--los-sans)",
              fontSize: 13,
              padding: "9px 16px",
              background: "var(--los-ink)",
              color: "var(--los-paper-warm)",
              border: "1px solid var(--los-ink)",
              cursor: "pointer",
            }}
          >
            Leave running
          </button>
        </div>
      </aside>
    </div>
  );
}
