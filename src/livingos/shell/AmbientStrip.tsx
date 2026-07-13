import { scenario } from "../scenario";
import { useLivingOS } from "../state/LivingOSContext";
import { CoolingWindow } from "../proposals/CoolingWindow";
import { RunningAgentIndicator } from "../agents/RunningAgentIndicator";

interface Props {
  onExit: () => void;
}

export function AmbientStrip({ onExit }: Props) {
  const { simulating, proposalStatus, setAanOpen } = useLivingOS();

  const standing = simulating
    ? `If approved: ${scenario.proposal.projectedStanding}`
    : proposalStatus === "approved"
      ? "You approved the shift. Standing holds — Advertising is settling."
      : proposalStatus === "rejected"
        ? "You declined. Advertising remains watching. Aan will re-draft if needed."
        : scenario.standing;

  const tone = simulating
    ? "var(--los-signal)"
    : proposalStatus === "approved"
      ? "var(--los-warm)"
      : "var(--los-ink)";

  return (
    <header
      style={{
        height: 48,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        gap: 24,
        padding: "0 24px",
        background: "var(--los-paper-warm)",
        borderBottom: "1px solid var(--los-line)",
        position: "relative",
        zIndex: 30,
      }}
    >
      <div
        style={{
          fontFamily: "var(--los-mono)",
          fontSize: 11,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--los-ink-muted)",
          minWidth: 140,
        }}
      >
        {scenario.day} · {scenario.time}
      </div>

      <div
        style={{
          flex: 1,
          fontFamily: "var(--los-serif)",
          fontSize: 15,
          fontWeight: 400,
          color: tone,
          textAlign: "center",
          letterSpacing: "-0.005em",
          transition: "color 320ms var(--los-ease)",
        }}
      >
        {standing}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 260, justifyContent: "flex-end" }}>
        <CoolingWindow />
        <RunningAgentIndicator />
        <button
          onClick={() => setAanOpen(true)}
          title="Ask Aan (⌥Space)"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
          }}
        >
          <span
            className="livingos-breath"
            style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--los-warm)", display: "inline-block" }}
          />
          <span
            style={{
              fontFamily: "var(--los-mono)",
              fontSize: 10,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--los-ink-muted)",
            }}
          >
            Aan
          </span>
        </button>
        <button
          onClick={onExit}
          title="Return to Anarix"
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "var(--los-paper-deep)",
            border: "1px solid var(--los-line)",
            fontFamily: "var(--los-serif)",
            fontSize: 12,
            color: "var(--los-ink)",
            cursor: "pointer",
            display: "grid",
            placeItems: "center",
          }}
        >
          JD
        </button>
      </div>
    </header>
  );
}
