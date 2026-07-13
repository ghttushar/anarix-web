import { useEffect, useState } from "react";
import { scenario } from "../scenario";
import { useLivingOS } from "../state/LivingOSContext";

export function ProposalSheet({ domainId }: { domainId: string }) {
  const {
    proposalStatus,
    proposalSentence,
    approveProposal,
    rejectProposal,
    modifyProposal,
    resetProposal,
    simulating,
    toggleSimulation,
    flipDomain,
  } = useLivingOS();

  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(proposalSentence);
  const [showAlts, setShowAlts] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  if (scenario.proposal.domainId !== domainId) return null;

  const settled = proposalStatus !== "pending" && proposalStatus !== "modified";
  const confidencePct = Math.round(scenario.proposal.confidence * 100);

  return (
    <section
      style={{
        marginTop: 36,
        padding: "28px 32px 24px",
        background: "var(--los-paper-warm)",
        borderTop: "1px solid var(--los-line)",
        borderLeft: "2px solid var(--los-warm)",
        boxShadow: "0 12px 32px -20px rgba(26,22,20,0.28)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 340ms var(--los-ease), transform 340ms var(--los-ease)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <div
          style={{
            fontFamily: "var(--los-mono)",
            fontSize: 10,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--los-warm)",
          }}
        >
          Proposal ·{" "}
          {proposalStatus === "pending"
            ? "awaiting judgment"
            : proposalStatus === "approved"
              ? "approved"
              : proposalStatus === "rejected"
                ? "declined"
                : "modified — awaiting judgment"}
        </div>
        {simulating && (
          <span
            style={{
              fontFamily: "var(--los-mono)",
              fontSize: 10,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--los-signal)",
            }}
          >
            simulating
          </span>
        )}
      </div>

      {editing ? (
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
          style={{
            width: "100%",
            fontFamily: "var(--los-serif)",
            fontSize: 20,
            lineHeight: 1.4,
            color: "var(--los-ink)",
            background: "transparent",
            border: "1px dashed var(--los-line)",
            padding: 12,
            resize: "vertical",
            outline: "none",
          }}
        />
      ) : (
        <p
          style={{
            fontFamily: "var(--los-serif)",
            fontSize: 22,
            lineHeight: 1.35,
            letterSpacing: "-0.005em",
            color: "var(--los-ink)",
            margin: 0,
          }}
        >
          {proposalSentence}
        </p>
      )}

      <p
        style={{
          fontFamily: "var(--los-sans)",
          fontSize: 13.5,
          lineHeight: 1.6,
          color: "var(--los-ink-muted)",
          margin: "18px 0 16px",
        }}
      >
        <span style={{ color: "var(--los-ink)", fontWeight: 500 }}>Why. </span>
        {scenario.proposal.why}
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
        {scenario.proposal.evidence.map((e) => (
          <span
            key={e}
            style={{
              fontFamily: "var(--los-mono)",
              fontSize: 10,
              letterSpacing: "0.06em",
              color: "var(--los-ink-muted)",
              padding: "4px 8px",
              background: "var(--los-paper-deep)",
              border: "1px solid var(--los-line)",
            }}
          >
            {e}
          </span>
        ))}
      </div>

      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            fontFamily: "var(--los-sans)",
            fontSize: 13,
            color: "var(--los-signal)",
            marginBottom: 8,
            fontStyle: "italic",
          }}
        >
          {simulating ? scenario.proposal.projectedStanding : scenario.proposal.expectedImpact}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              fontFamily: "var(--los-mono)",
              fontSize: 10,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--los-ink-faint)",
              minWidth: 74,
            }}
          >
            confidence
          </span>
          <div
            style={{
              flex: 1,
              height: 2,
              background: "var(--los-paper-deep)",
              position: "relative",
              maxWidth: 260,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: `${confidencePct}%`,
                background: "var(--los-warm)",
              }}
            />
          </div>
          <span
            style={{
              fontFamily: "var(--los-mono)",
              fontSize: 11,
              color: "var(--los-ink-muted)",
            }}
          >
            {confidencePct}%
          </span>
        </div>
      </div>

      {/* Primary affordances */}
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          borderTop: "1px solid var(--los-line)",
          paddingTop: 18,
        }}
      >
        <ActionButton
          primary
          disabled={settled}
          onClick={() => {
            if (editing) {
              modifyProposal(draft);
              setEditing(false);
            }
            approveProposal();
          }}
        >
          Approve
        </ActionButton>
        <ActionButton
          disabled={settled}
          onClick={() => {
            if (!editing) setDraft(proposalSentence);
            setEditing((v) => !v);
          }}
        >
          {editing ? "Save modification" : "Modify"}
        </ActionButton>
        <ActionButton
          disabled={settled}
          onClick={() => rejectProposal()}
        >
          Reject
        </ActionButton>
        <ActionButton
          disabled={settled}
          onClick={() => toggleSimulation()}
        >
          {simulating ? "Exit simulation" : "Simulate"}
        </ActionButton>
        {settled && (
          <button
            onClick={resetProposal}
            style={quietLink}
          >
            Reset scenario
          </button>
        )}
      </div>

      {/* Secondary row */}
      <div
        style={{
          marginTop: 14,
          display: "flex",
          gap: 20,
          alignItems: "center",
        }}
      >
        <button
          onClick={() => flipDomain(domainId)}
          style={quietLink}
        >
          Delegate this decision →
        </button>
        <button
          onClick={() => setShowAlts((v) => !v)}
          style={quietLink}
        >
          {showAlts ? "Hide alternatives" : `Compare alternatives (${scenario.proposal.alternatives.length})`}
        </button>
      </div>

      {showAlts && (
        <div
          style={{
            marginTop: 18,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 14,
          }}
        >
          {scenario.proposal.alternatives.map((alt) => (
            <div
              key={alt.label}
              style={{
                padding: "16px 18px",
                background: "var(--los-paper-deep)",
                border: "1px solid var(--los-line)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--los-mono)",
                  fontSize: 10,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--los-ink-faint)",
                  marginBottom: 8,
                }}
              >
                {alt.label}
              </div>
              <div
                style={{
                  fontFamily: "var(--los-serif)",
                  fontSize: 15,
                  color: "var(--los-ink)",
                  marginBottom: 6,
                  lineHeight: 1.4,
                }}
              >
                {alt.sentence}
              </div>
              <div
                style={{
                  fontFamily: "var(--los-sans)",
                  fontSize: 12,
                  color: "var(--los-ink-muted)",
                  lineHeight: 1.5,
                }}
              >
                {alt.tradeoff}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

const quietLink: React.CSSProperties = {
  background: "none",
  border: "none",
  padding: 0,
  fontFamily: "var(--los-mono)",
  fontSize: 10.5,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "var(--los-ink-muted)",
  cursor: "pointer",
};

function ActionButton({
  children,
  onClick,
  primary,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  primary?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        fontFamily: "var(--los-sans)",
        fontSize: 13,
        letterSpacing: "0.02em",
        padding: "10px 18px",
        background: primary ? "var(--los-ink)" : "transparent",
        color: primary ? "var(--los-paper-warm)" : "var(--los-ink)",
        border: primary ? "1px solid var(--los-ink)" : "1px solid var(--los-line)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.35 : 1,
        transition: "opacity 180ms var(--los-ease), background 180ms var(--los-ease)",
      }}
    >
      {children}
    </button>
  );
}
