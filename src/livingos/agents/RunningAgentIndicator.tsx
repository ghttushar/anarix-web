import { useLivingOS } from "../state/LivingOSContext";
import { scenario } from "../scenario";

/** Compact running agent chip that lives in the AmbientStrip. */
export function RunningAgentIndicator() {
  const { agentRunning, setAgentPanelOpen } = useLivingOS();
  if (!agentRunning) return null;
  return (
    <button
      onClick={() => setAgentPanelOpen(true)}
      title="Aan agent running"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: "none",
        border: "1px solid var(--los-line)",
        padding: "3px 10px",
        cursor: "pointer",
      }}
    >
      <span
        className="livingos-orbit"
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          border: "1px solid var(--los-warm)",
          borderTopColor: "transparent",
          display: "inline-block",
        }}
      />
      <span
        style={{
          fontFamily: "var(--los-mono)",
          fontSize: 10,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--los-ink-muted)",
        }}
      >
        1 agent · ~{scenario.agent.remainingMinutes}m
      </span>
    </button>
  );
}
