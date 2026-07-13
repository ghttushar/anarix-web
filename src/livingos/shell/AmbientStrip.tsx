import { scenario } from "../scenario";

interface Props {
  onExit: () => void;
}

export function AmbientStrip({ onExit }: Props) {
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
        zIndex: 10,
      }}
    >
      {/* Left: day + time */}
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

      {/* Center: Standing sentence */}
      <div
        style={{
          flex: 1,
          fontFamily: "var(--los-serif)",
          fontSize: 15,
          fontWeight: 400,
          color: "var(--los-ink)",
          textAlign: "center",
          letterSpacing: "-0.005em",
        }}
      >
        {scenario.standing}
      </div>

      {/* Right: Aan presence + avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 140, justifyContent: "flex-end" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            className="livingos-breath"
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "var(--los-warm)",
              display: "inline-block",
            }}
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
        </div>
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
