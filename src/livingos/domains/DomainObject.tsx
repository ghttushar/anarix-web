import { Domain } from "../scenario";

interface Props {
  domain: Domain;
  onClick: () => void;
  dimmed?: boolean;
}

// Stable organic silhouettes — one path per domain, memorised by position in the list.
// Same shape every session so spatial memory can form.
const SHAPES: Record<string, string> = {
  advertising:
    "M60,10 C90,12 116,32 118,62 C120,92 96,116 64,118 C32,120 8,96 6,64 C4,32 30,8 60,10 Z",
  inventory:
    "M62,8 C94,14 118,40 116,70 C114,100 88,120 58,118 C28,116 6,90 8,60 C10,30 32,4 62,8 Z",
  cash:
    "M64,6 C96,10 120,36 118,66 C116,96 92,120 62,118 C32,116 8,92 10,62 C12,32 34,4 64,6 Z",
  customers:
    "M60,12 C92,10 118,34 116,64 C114,94 90,118 60,116 C30,114 8,90 10,60 C12,30 34,14 60,12 Z",
  operations:
    "M58,10 C88,8 116,30 118,60 C120,90 94,118 62,120 C30,122 6,96 8,64 C10,32 32,12 58,10 Z",
  people:
    "M62,10 C94,12 118,38 116,68 C114,98 88,120 58,118 C28,116 8,90 10,60 C12,30 34,10 62,10 Z",
};

export function DomainObject({ domain, onClick, dimmed }: Props) {
  const size = 132 * domain.weight;
  const tilt = domain.leaning ? -2 : 0;
  const stateColor =
    domain.state === "watching" || domain.state === "recovering"
      ? "var(--los-warm)"
      : "var(--los-ink-muted)";

  return (
    <button
      onClick={onClick}
      style={{
        position: "absolute",
        left: `${domain.x}%`,
        top: `${domain.y}%`,
        transform: `translate(-50%, -50%) rotate(${tilt}deg)`,
        width: size,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        background: "transparent",
        border: "none",
        padding: 0,
        cursor: "pointer",
        opacity: dimmed ? 0.28 : 1,
        filter: dimmed ? "blur(2px)" : "none",
        transition:
          "opacity 320ms var(--los-ease), filter 320ms var(--los-ease), transform 420ms var(--los-ease)",
      }}
    >
      <div style={{ position: "relative", width: size, height: size }}>
        <svg
          viewBox="0 0 124 128"
          width={size}
          height={size}
          style={{
            filter: domain.leaning
              ? "drop-shadow(0 12px 24px rgba(200,135,90,0.28))"
              : "drop-shadow(0 8px 18px rgba(26,22,20,0.12))",
            transition: "filter 420ms var(--los-ease)",
          }}
        >
          <path
            d={SHAPES[domain.id] ?? SHAPES.advertising}
            fill="var(--los-paper-warm)"
            stroke={domain.leaning ? "var(--los-warm)" : "var(--los-line)"}
            strokeWidth={domain.leaning ? 1.5 : 1}
          />
        </svg>
        {domain.leaning && (
          <span
            className="livingos-breath"
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--los-warm)",
            }}
          />
        )}
      </div>
      <div
        style={{
          fontFamily: "var(--los-serif)",
          fontSize: 18,
          fontWeight: 400,
          color: "var(--los-ink)",
          letterSpacing: "-0.01em",
        }}
      >
        {domain.name}
      </div>
      <div
        style={{
          fontFamily: "var(--los-mono)",
          fontSize: 9.5,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: stateColor,
        }}
      >
        {domain.state}
      </div>
    </button>
  );
}
