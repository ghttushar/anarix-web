import { useLivingOS } from "../state/LivingOSContext";

export function CoolingWindow() {
  const { coolingRemaining, undoApproval } = useLivingOS();
  if (coolingRemaining === null) return null;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "4px 10px",
        background: "var(--los-paper-deep)",
        border: "1px solid var(--los-warm)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--los-mono)",
          fontSize: 10,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--los-warm)",
        }}
      >
        Approved · {coolingRemaining}s
      </span>
      <button
        onClick={undoApproval}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          fontFamily: "var(--los-mono)",
          fontSize: 10,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--los-ink)",
          cursor: "pointer",
          textDecoration: "underline",
        }}
      >
        Undo
      </button>
    </div>
  );
}
