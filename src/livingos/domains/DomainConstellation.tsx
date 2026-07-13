import { scenario } from "../scenario";
import { DomainObject } from "./DomainObject";

interface Props {
  onSelect: (id: string) => void;
  dimmed: boolean;
}

export function DomainConstellation({ onSelect, dimmed }: Props) {
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* Aan's morning line, above the constellation */}
      <div
        style={{
          position: "absolute",
          top: "8%",
          left: "50%",
          transform: "translateX(-50%)",
          maxWidth: 720,
          padding: "0 32px",
          textAlign: "center",
          opacity: dimmed ? 0 : 1,
          transition: "opacity 320ms var(--los-ease)",
          pointerEvents: dimmed ? "none" : "auto",
        }}
      >
        <div
          style={{
            fontFamily: "var(--los-mono)",
            fontSize: 10,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--los-ink-faint)",
            marginBottom: 14,
          }}
        >
          Aan · morning
        </div>
        <p
          style={{
            fontFamily: "var(--los-serif)",
            fontSize: 26,
            lineHeight: 1.35,
            fontWeight: 400,
            color: "var(--los-signal)",
            letterSpacing: "-0.015em",
            margin: 0,
          }}
        >
          {scenario.greeting}
        </p>
      </div>

      {/* Constellation region */}
      <div
        style={{
          position: "absolute",
          top: "26%",
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        {scenario.domains.map((d) => (
          <DomainObject
            key={d.id}
            domain={d}
            dimmed={dimmed}
            onClick={() => onSelect(d.id)}
          />
        ))}
      </div>
    </div>
  );
}
