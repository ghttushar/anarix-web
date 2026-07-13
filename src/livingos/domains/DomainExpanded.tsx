import { useEffect, useState } from "react";
import { Domain, scenario } from "../scenario";

interface Props {
  domain: Domain;
  onClose: () => void;
}

export function DomainExpanded({ domain, onClose }: Props) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const hasProposal = scenario.proposal.domainId === domain.id;
  const hasAgent = scenario.agent.domainId === domain.id;

  return (
    <div
      onClick={onClose}
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px",
        zIndex: 20,
      }}
    >
      <article
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(1080px, 84%)",
          maxHeight: "88%",
          background: "var(--los-paper-warm)",
          border: "1px solid var(--los-line)",
          padding: "48px 56px",
          display: "grid",
          gridTemplateColumns: "1fr 240px",
          gap: 48,
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(0.985)",
          transition:
            "opacity 420ms var(--los-ease), transform 450ms var(--los-ease)",
          boxShadow: "0 32px 80px -30px rgba(26,22,20,0.35)",
          overflow: "auto",
        }}
      >
        {/* Main column */}
        <div>
          <div
            style={{
              fontFamily: "var(--los-mono)",
              fontSize: 10,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--los-ink-faint)",
              marginBottom: 10,
            }}
          >
            Domain · {domain.state}
          </div>
          <h1
            style={{
              fontFamily: "var(--los-serif)",
              fontSize: 56,
              fontWeight: 300,
              letterSpacing: "-0.025em",
              lineHeight: 1,
              margin: "0 0 32px",
              color: "var(--los-ink)",
            }}
          >
            {domain.name}
          </h1>

          <p
            style={{
              fontFamily: "var(--los-serif)",
              fontSize: 20,
              lineHeight: 1.55,
              color: "var(--los-signal)",
              margin: "0 0 32px",
              letterSpacing: "-0.005em",
            }}
          >
            {domain.narrative}
          </p>

          {hasProposal && (
            <div
              style={{
                marginTop: 40,
                padding: "24px 28px",
                background: "var(--los-paper-deep)",
                borderLeft: "2px solid var(--los-warm)",
                position: "relative",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--los-mono)",
                  fontSize: 10,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--los-warm)",
                  marginBottom: 10,
                }}
              >
                Proposal · awaiting judgment
              </div>
              <div
                style={{
                  fontFamily: "var(--los-serif)",
                  fontSize: 18,
                  lineHeight: 1.4,
                  color: "var(--los-ink)",
                  marginBottom: 12,
                }}
              >
                {scenario.proposal.sentence}
              </div>
              <div
                style={{
                  fontFamily: "var(--los-mono)",
                  fontSize: 10.5,
                  letterSpacing: "0.08em",
                  color: "var(--los-ink-muted)",
                }}
              >
                Confidence · {Math.round(scenario.proposal.confidence * 100)}% · Phase 2 will make this actionable
              </div>
            </div>
          )}

          {hasAgent && (
            <div
              style={{
                marginTop: 24,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
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
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  color: "var(--los-ink-muted)",
                }}
              >
                Aan is {scenario.agent.label} · ~{scenario.agent.remainingMinutes}m
              </span>
            </div>
          )}
        </div>

        {/* Right: relationships */}
        <aside
          style={{
            borderLeft: "1px solid var(--los-line)",
            paddingLeft: 32,
          }}
        >
          <div
            style={{
              fontFamily: "var(--los-mono)",
              fontSize: 10,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--los-ink-faint)",
              marginBottom: 16,
            }}
          >
            Relationships
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
            {domain.relationships.map((r) => (
              <li
                key={r}
                style={{
                  fontFamily: "var(--los-sans)",
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: "var(--los-ink-muted)",
                }}
              >
                {r}
              </li>
            ))}
          </ul>

          <div
            style={{
              marginTop: 40,
              fontFamily: "var(--los-mono)",
              fontSize: 10,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--los-ink-faint)",
            }}
          >
            Esc · withdraw
          </div>
        </aside>
      </article>
    </div>
  );
}
