import { useState } from "react";
import { scenario } from "../scenario";

interface Props {
  onOpenDomain: (id: string) => void;
  activeId: string | null;
}

export function ContextDock({ onOpenDomain, activeId }: Props) {
  const [hoverId, setHoverId] = useState<string | null>(null);
  // Show the 4 most recently relevant Domains (deterministic order)
  const dock = scenario.domains.slice(0, 4);

  return (
    <footer
      style={{
        height: 72,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        background: "var(--los-paper-warm)",
        borderTop: "1px solid var(--los-line)",
        position: "relative",
        zIndex: 10,
      }}
    >
      {dock.map((d) => {
        const isHover = hoverId === d.id;
        const isActive = activeId === d.id;
        const scale = isHover ? 1.18 : isActive ? 1.08 : 1;
        return (
          <button
            key={d.id}
            onMouseEnter={() => setHoverId(d.id)}
            onMouseLeave={() => setHoverId(null)}
            onClick={() => onOpenDomain(d.id)}
            title={d.name}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "var(--los-paper-deep)",
              border: `1px solid ${isActive ? "var(--los-warm)" : "var(--los-line)"}`,
              display: "grid",
              placeItems: "center",
              fontFamily: "var(--los-serif)",
              fontSize: 15,
              color: "var(--los-ink)",
              cursor: "pointer",
              transform: `scale(${scale})`,
              transition: "transform 220ms var(--los-ease), border-color 220ms var(--los-ease)",
            }}
          >
            {d.name[0]}
          </button>
        );
      })}

      {/* Running agent indicator */}
      <div
        style={{
          marginLeft: 16,
          paddingLeft: 16,
          borderLeft: "1px solid var(--los-line)",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
        title={`Aan is ${scenario.agent.label} — ~${scenario.agent.remainingMinutes}m`}
      >
        <span
          className="livingos-breath"
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "var(--los-warm)",
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
          1 agent · ~{scenario.agent.remainingMinutes}m
        </span>
      </div>

      {/* Cmd+K hint */}
      <div
        style={{
          position: "absolute",
          right: 24,
          fontFamily: "var(--los-mono)",
          fontSize: 10,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--los-ink-faint)",
        }}
      >
        ⌘K · ask
      </div>
    </footer>
  );
}
