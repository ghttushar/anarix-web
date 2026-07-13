import { useState } from "react";
import { Domain } from "../scenario";
import { useLivingOS } from "../state/LivingOSContext";

export function DelegationFace({ domain }: { domain: Domain }) {
  const { flipDomain } = useLivingOS();
  const [floor, setFloor] = useState(domain.delegation.confidenceFloor);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 260px",
        gap: 48,
        transform: "scaleX(-1)",
      }}
    >
      {/* content is mirrored back to normal by inner un-flip */}
      <div style={{ transform: "scaleX(-1)" }}>
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
          Delegation · {domain.name}
        </div>
        <h1
          style={{
            fontFamily: "var(--los-serif)",
            fontSize: 40,
            fontWeight: 300,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            margin: "0 0 24px",
            color: "var(--los-ink)",
          }}
        >
          What Aan may do on your behalf
        </h1>

        <Field label="Authority">
          <p style={paragraph}>{domain.delegation.scope}</p>
        </Field>

        <Field label="Confidence floor">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <input
              type="range"
              min={0.5}
              max={0.99}
              step={0.01}
              value={floor}
              onChange={(e) => setFloor(parseFloat(e.target.value))}
              style={{ flex: 1, maxWidth: 320, accentColor: "var(--los-warm)" }}
            />
            <span
              style={{
                fontFamily: "var(--los-mono)",
                fontSize: 12,
                color: "var(--los-ink)",
                minWidth: 44,
              }}
            >
              {Math.round(floor * 100)}%
            </span>
          </div>
          <div
            style={{
              fontFamily: "var(--los-sans)",
              fontSize: 12,
              color: "var(--los-ink-muted)",
              marginTop: 6,
            }}
          >
            Aan will only act unattended when its confidence sits above this line.
          </div>
        </Field>

        <Field label="Duration">
          <p style={paragraph}>{domain.delegation.duration}</p>
        </Field>

        <Field label="Boundaries">
          <ul style={list}>
            {domain.delegation.boundaries.map((b) => (
              <li key={b} style={listItem}>{b}</li>
            ))}
          </ul>
        </Field>

        <Field label="Exceptions">
          <ul style={list}>
            {domain.delegation.exceptions.map((e) => (
              <li key={e} style={listItem}>{e}</li>
            ))}
          </ul>
        </Field>

        <div style={{ marginTop: 28, display: "flex", gap: 12 }}>
          <button onClick={() => flipDomain(null)} style={primaryBtn}>
            Save delegation
          </button>
          <button onClick={() => flipDomain(null)} style={ghostBtn}>
            Back to Domain
          </button>
        </div>
      </div>

      <aside style={{ transform: "scaleX(-1)", borderLeft: "1px solid var(--los-line)", paddingLeft: 32 }}>
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
          Past delegations
        </div>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
          {domain.delegation.history.map((h) => (
            <li key={h.when + h.text}>
              <div
                style={{
                  fontFamily: "var(--los-mono)",
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  color: "var(--los-ink-faint)",
                  marginBottom: 2,
                }}
              >
                {h.when}
              </div>
              <div
                style={{
                  fontFamily: "var(--los-sans)",
                  fontSize: 13,
                  color: "var(--los-ink-muted)",
                  lineHeight: 1.45,
                }}
              >
                {h.text}
              </div>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div
        style={{
          fontFamily: "var(--los-mono)",
          fontSize: 10,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--los-ink-faint)",
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

const paragraph: React.CSSProperties = {
  fontFamily: "var(--los-sans)",
  fontSize: 14,
  color: "var(--los-ink)",
  lineHeight: 1.55,
  margin: 0,
};
const list: React.CSSProperties = { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 };
const listItem: React.CSSProperties = { ...paragraph, color: "var(--los-ink-muted)" };

const primaryBtn: React.CSSProperties = {
  fontFamily: "var(--los-sans)",
  fontSize: 13,
  padding: "10px 18px",
  background: "var(--los-ink)",
  color: "var(--los-paper-warm)",
  border: "1px solid var(--los-ink)",
  cursor: "pointer",
};
const ghostBtn: React.CSSProperties = {
  ...primaryBtn,
  background: "transparent",
  color: "var(--los-ink)",
  border: "1px solid var(--los-line)",
};
