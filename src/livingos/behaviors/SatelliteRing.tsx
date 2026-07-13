import { useState } from "react";

interface Verb {
  label: string;
  onClick?: () => void;
}

/** Satellite ring — 6 quiet verbs orbit an object on hover. */
export function SatelliteRing({
  visible,
  verbs,
}: {
  visible: boolean;
  verbs?: Partial<Record<"share" | "watch" | "compare" | "replay" | "pin" | "inspect", () => void>>;
}) {
  const [hover, setHover] = useState<string | null>(null);
  const items: Verb[] = [
    { label: "share", onClick: verbs?.share },
    { label: "watch", onClick: verbs?.watch },
    { label: "compare", onClick: verbs?.compare },
    { label: "replay", onClick: verbs?.replay },
    { label: "pin", onClick: verbs?.pin },
    { label: "inspect", onClick: verbs?.inspect },
  ];

  return (
    <div
      aria-hidden={!visible}
      style={{
        position: "absolute",
        top: -12,
        right: -12,
        display: "flex",
        gap: 4,
        padding: "6px 10px",
        background: "var(--los-paper-warm)",
        border: "1px solid var(--los-line)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-4px)",
        transition: "opacity 220ms var(--los-ease), transform 220ms var(--los-ease)",
        pointerEvents: visible ? "auto" : "none",
        zIndex: 5,
      }}
    >
      {items.map((v) => (
        <button
          key={v.label}
          onMouseEnter={() => setHover(v.label)}
          onMouseLeave={() => setHover(null)}
          onClick={(e) => {
            e.stopPropagation();
            v.onClick?.();
          }}
          style={{
            background: "none",
            border: "none",
            padding: "2px 6px",
            fontFamily: "var(--los-mono)",
            fontSize: 9.5,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: hover === v.label ? "var(--los-ink)" : "var(--los-ink-faint)",
            cursor: "pointer",
            transition: "color 160ms var(--los-ease)",
          }}
        >
          {v.label}
        </button>
      ))}
    </div>
  );
}
