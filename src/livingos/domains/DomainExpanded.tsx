import { useEffect, useState } from "react";
import { Domain, scenario } from "../scenario";
import { useLivingOS } from "../state/LivingOSContext";
import { ProposalSheet } from "../proposals/ProposalSheet";
import { DomainTimeline } from "../memory/DomainTimeline";
import { DelegationFace } from "../delegation/DelegationFace";
import { SatelliteRing } from "../behaviors/SatelliteRing";

interface Props {
  domain: Domain;
  onClose: () => void;
}

export function DomainExpanded({ domain, onClose }: Props) {
  const [visible, setVisible] = useState(false);
  const [hoverObject, setHoverObject] = useState(false);
  const { flippedDomainId, flipDomain, replayIndex, setReplayIndex, agentRunning, setAgentPanelOpen } =
    useLivingOS();

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  // Reset replay when leaving domain
  useEffect(() => () => setReplayIndex(-1), [setReplayIndex]);

  const flipped = flippedDomainId === domain.id;
  const hasAgent = scenario.agent.domainId === domain.id;

  // Determine which state/narrative to show — present or a replayed past moment
  const replayed = replayIndex >= 0 ? domain.timeline[replayIndex] : null;
  const shownState = replayed?.state ?? domain.state;
  const shownNarrative = replayed?.narrative ?? domain.narrative;

  return (
    <div
      onClick={onClose}
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 48,
        zIndex: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => setHoverObject(true)}
        onMouseLeave={() => setHoverObject(false)}
        style={{
          width: "min(1120px, 88%)",
          maxHeight: "90%",
          perspective: 2400,
          position: "relative",
        }}
      >
        <SatelliteRing
          visible={hoverObject && !flipped}
          verbs={{
            replay: () => setReplayIndex(replayIndex === -1 ? 0 : -1),
            inspect: () => flipDomain(domain.id),
          }}
        />

        <article
          style={{
            width: "100%",
            maxHeight: "90vh",
            overflow: "auto",
            background: "var(--los-paper-warm)",
            border: "1px solid var(--los-line)",
            padding: "48px 56px 40px",
            boxShadow: "0 32px 80px -30px rgba(26,22,20,0.35)",
            opacity: visible ? 1 : 0,
            transform: `${visible ? "scale(1)" : "scale(0.985)"} rotateY(${flipped ? 180 : 0}deg)`,
            transformStyle: "preserve-3d",
            transition:
              "opacity 420ms var(--los-ease), transform 600ms var(--los-ease)",
            filter: replayed ? "sepia(0.15) contrast(0.96)" : "none",
          }}
        >
          {!flipped ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 240px", gap: 48 }}>
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--los-mono)",
                      fontSize: 10,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: "var(--los-ink-faint)",
                    }}
                  >
                    Domain · {shownState}
                    {replayed && <> · replaying {replayed.when}</>}
                  </div>
                  {replayed && (
                    <button
                      onClick={() => setReplayIndex(-1)}
                      style={returnBtn}
                    >
                      Return to now
                    </button>
                  )}
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
                    margin: 0,
                    letterSpacing: "-0.005em",
                  }}
                >
                  {shownNarrative}
                </p>

                {replayed?.pastProposal && (
                  <div
                    style={{
                      marginTop: 20,
                      padding: "14px 18px",
                      background: "var(--los-paper-deep)",
                      borderLeft: "2px solid var(--los-line)",
                      fontFamily: "var(--los-serif)",
                      fontSize: 15,
                      fontStyle: "italic",
                      color: "var(--los-ink-muted)",
                    }}
                  >
                    Past proposal · {replayed.pastProposal}
                  </div>
                )}

                {!replayed && <ProposalSheet domainId={domain.id} />}

                {!replayed && hasAgent && agentRunning && (
                  <button
                    onClick={() => setAgentPanelOpen(true)}
                    style={{
                      marginTop: 24,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                    }}
                  >
                    <span
                      className="livingos-breath"
                      style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--los-warm)" }}
                    />
                    <span
                      style={{
                        fontFamily: "var(--los-mono)",
                        fontSize: 11,
                        letterSpacing: "0.1em",
                        color: "var(--los-ink-muted)",
                      }}
                    >
                      Aan is {scenario.agent.label} · ~{scenario.agent.remainingMinutes}m →
                    </span>
                  </button>
                )}

                <DomainTimeline domain={domain} />
              </div>

              <aside style={{ borderLeft: "1px solid var(--los-line)", paddingLeft: 32 }}>
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

                <button
                  onClick={() => flipDomain(domain.id)}
                  style={{
                    marginTop: 28,
                    background: "none",
                    border: "1px solid var(--los-line)",
                    padding: "8px 12px",
                    fontFamily: "var(--los-mono)",
                    fontSize: 10,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--los-ink-muted)",
                    cursor: "pointer",
                    width: "100%",
                    textAlign: "left",
                  }}
                >
                  Flip → delegation
                </button>

                <div
                  style={{
                    marginTop: 32,
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
            </div>
          ) : (
            <div style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" as const }}>
              <DelegationFace domain={domain} />
            </div>
          )}
        </article>
      </div>
    </div>
  );
}

const returnBtn: React.CSSProperties = {
  background: "none",
  border: "1px solid var(--los-line)",
  padding: "4px 10px",
  fontFamily: "var(--los-mono)",
  fontSize: 9.5,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--los-ink-muted)",
  cursor: "pointer",
};
