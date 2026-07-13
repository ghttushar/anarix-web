import { DirectionShell } from "@/livingos/shell/DirectionShell";
import { scenario } from "@/livingos/scenario";

// Direction 4 — Command Surface.
// Dense monospace. Status spine across the top. Body is three columns of figures.
// One amber indicator. Hazard yellow used exactly once. No animation.

const MONO = "'JetBrains Mono', ui-monospace, monospace";
const FG = "#d4d1c4";
const FG_DIM = "#7a7668";
const FG_FAINT = "#4a4740";
const BG = "#0a0a0b";
const HAZARD = "#e8c547";
const AMBER = "#e08a2a";

export default function CommandSurface() {
  return (
    <DirectionShell slug="command-surface">
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: BG,
          color: FG,
          fontFamily: MONO,
          fontSize: 12,
          padding: "0",
          overflow: "hidden",
        }}
      >
        {/* Status spine */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            padding: "10px 20px",
            borderBottom: `1px solid ${FG_FAINT}`,
            fontSize: 11.5,
            letterSpacing: "0.06em",
          }}
        >
          <span style={{ color: FG_DIM }}>{scenario.when.time}</span>
          <span style={{ color: FG_DIM }}>{scenario.when.weekday.toUpperCase()} · W41</span>
          {scenario.standing.codes.map((c) => (
            <span key={c.key}>
              <span style={{ color: FG_DIM }}>{c.key}:</span>
              <span
                style={{
                  color: c.tone === "hazard" ? HAZARD : c.tone === "hold" ? FG : FG,
                  fontWeight: 500,
                  marginLeft: 2,
                }}
              >
                {c.value}
              </span>
            </span>
          ))}
          <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: AMBER,
                boxShadow: `0 0 6px ${AMBER}`,
                display: "inline-block",
              }}
            />
            <span style={{ color: FG_DIM }}>1 AGENT</span>
          </span>
        </div>

        {/* Body — three columns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1.2fr 1fr",
            gap: 0,
            height: "calc(100% - 40px - 32px)",
          }}
        >
          {/* Column 1 — DOMAINS */}
          <Column title="DOMAINS">
            <Table
              rows={scenario.domains.map((d) => [
                d.label.toUpperCase(),
                d.tone.toUpperCase(),
                d.note,
              ])}
              headers={["DOMAIN", "STATE", "NOTE"]}
              toneCol={1}
            />

            <div style={{ marginTop: 32, color: FG_DIM, fontSize: 10.5, letterSpacing: "0.14em" }}>
              FIGURES · MTD
            </div>
            <div style={{ borderTop: `1px solid ${FG_FAINT}`, marginTop: 8 }}>
              {scenario.figures.map((f) => (
                <div
                  key={f.label}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto auto",
                    gap: 16,
                    padding: "9px 0",
                    borderBottom: `1px dashed ${FG_FAINT}`,
                    fontSize: 12,
                  }}
                >
                  <span style={{ color: FG_DIM }}>
                    {f.label}{" "}
                    <span style={{ color: FG_FAINT, fontSize: 10.5 }}>[{f.frame}]</span>
                  </span>
                  <span style={{ color: FG_DIM, fontSize: 11 }}>{f.delta}</span>
                  <span style={{ color: FG, fontVariantNumeric: "tabular-nums", minWidth: 120, textAlign: "right" }}>
                    {f.value}
                  </span>
                </div>
              ))}
            </div>
          </Column>

          {/* Column 2 — PROPOSAL */}
          <Column title="PROPOSAL · UNCOMMITTED" borderLeft>
            <div
              style={{
                border: `1px solid ${AMBER}`,
                padding: "14px 16px",
                background: "rgba(224,138,42,0.04)",
              }}
            >
              <div style={{ color: AMBER, fontSize: 10.5, letterSpacing: "0.14em", marginBottom: 8 }}>
                PROP-2026-1014-01 · DRAFTED 08:09 · AAN
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.45, color: FG, marginBottom: 12 }}>
                {scenario.proposal.title}
              </div>
              <div style={{ fontSize: 11.5, lineHeight: 1.55, color: FG_DIM }}>
                {scenario.proposal.body}
              </div>

              <div
                style={{
                  marginTop: 14,
                  paddingTop: 12,
                  borderTop: `1px dashed ${FG_FAINT}`,
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 8,
                  fontSize: 10.5,
                }}
              >
                <span>
                  <span style={{ color: FG_DIM }}>MOVED </span>
                  {scenario.proposal.est.spendMoved}
                </span>
                <span>
                  <span style={{ color: FG_DIM }}>RECOV </span>
                  {scenario.proposal.est.recovered}
                </span>
                <span>
                  <span style={{ color: FG_DIM }}>RISK </span>
                  {scenario.proposal.est.risk.toUpperCase()}
                </span>
              </div>
            </div>

            <div style={{ marginTop: 14, display: "flex", gap: 8, fontSize: 11 }}>
              <Key>⌘↵</Key>
              <span style={{ color: FG_DIM }}>commit</span>
              <Key>⌘⇧P</Key>
              <span style={{ color: FG_DIM }}>preview</span>
              <Key>⌘.</Key>
              <span style={{ color: FG_DIM }}>reject</span>
            </div>

            <div style={{ marginTop: 32, color: FG_DIM, fontSize: 10.5, letterSpacing: "0.14em" }}>
              QUEUE
            </div>
            <div style={{ borderTop: `1px solid ${FG_FAINT}`, marginTop: 8, color: FG_FAINT, fontSize: 11, padding: "10px 0" }}>
              (nothing else pending)
            </div>
          </Column>

          {/* Column 3 — PROCESS */}
          <Column title="AT WORK" borderLeft>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                paddingBottom: 10,
                borderBottom: `1px solid ${FG_FAINT}`,
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: AMBER,
                  boxShadow: `0 0 8px ${AMBER}`,
                }}
              />
              <span style={{ color: FG }}>{scenario.agent.label}</span>
            </div>
            <div style={{ marginTop: 10, fontSize: 11.5, color: FG_DIM, lineHeight: 1.7 }}>
              <div>SCOPE  {scenario.agent.scope.toUpperCase()}</div>
              <div>STARTED  {scenario.agent.started}</div>
              <div>ETA  ~{scenario.agent.etaMinutes}M</div>
              <div>OWNER  AAN</div>
            </div>

            <div style={{ marginTop: 14, display: "flex", gap: 8, fontSize: 11 }}>
              <Key>⌘K</Key>
              <span style={{ color: FG_DIM }}>inspect</span>
              <Key>⌘.</Key>
              <span style={{ color: FG_DIM }}>stop</span>
            </div>

            <div style={{ marginTop: 40, color: FG_DIM, fontSize: 10.5, letterSpacing: "0.14em" }}>
              AAN · TRANSCRIPT
            </div>
            <div style={{ borderTop: `1px solid ${FG_FAINT}`, marginTop: 8, fontSize: 11.5, lineHeight: 1.6, color: FG_DIM }}>
              <div style={{ padding: "8px 0", borderBottom: `1px dashed ${FG_FAINT}` }}>
                <span style={{ color: FG_FAINT }}>08:07 </span>bid-cap rebalance started.
              </div>
              <div style={{ padding: "8px 0", borderBottom: `1px dashed ${FG_FAINT}` }}>
                <span style={{ color: FG_FAINT }}>08:09 </span>drafted PROP-2026-1014-01.
              </div>
              <div style={{ padding: "8px 0" }}>
                <span style={{ color: FG_FAINT }}>08:14 </span>quiet elsewhere.
              </div>
            </div>
          </Column>
        </div>

        {/* Bottom line — command entry hint */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            display: "flex",
            gap: 20,
            padding: "9px 20px",
            borderTop: `1px solid ${FG_FAINT}`,
            fontSize: 11,
            color: FG_DIM,
            background: BG,
          }}
        >
          <span style={{ color: AMBER }}>▸</span>
          <span>type a command, or</span>
          <Key>?</Key>
          <span>help</span>
          <span style={{ marginLeft: "auto", color: FG_FAINT }}>
            LIVING OS · COMMAND SURFACE · BUILD 0.3
          </span>
        </div>
      </div>
    </DirectionShell>
  );
}

function Column({ title, borderLeft, children }: { title: string; borderLeft?: boolean; children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: "16px 20px",
        borderLeft: borderLeft ? `1px solid ${FG_FAINT}` : "none",
        overflow: "hidden",
      }}
    >
      <div style={{ color: FG_DIM, fontSize: 10.5, letterSpacing: "0.14em", marginBottom: 10 }}>{title}</div>
      {children}
    </div>
  );
}

function Table({ rows, headers, toneCol }: { rows: string[][]; headers: string[]; toneCol?: number }) {
  const toneColor = (v: string) =>
    v === "HAZARD" || v === "HOLD" ? HAZARD : v === "SOFT" ? AMBER : FG;
  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 0.7fr 1.6fr",
          gap: 16,
          padding: "6px 0",
          borderBottom: `1px solid ${FG_FAINT}`,
          color: FG_DIM,
          fontSize: 10.5,
          letterSpacing: "0.12em",
        }}
      >
        {headers.map((h) => (
          <span key={h}>{h}</span>
        ))}
      </div>
      {rows.map((r, i) => (
        <div
          key={i}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 0.7fr 1.6fr",
            gap: 16,
            padding: "9px 0",
            borderBottom: `1px dashed ${FG_FAINT}`,
            fontSize: 12,
          }}
        >
          {r.map((cell, j) => (
            <span
              key={j}
              style={{
                color: j === toneCol ? toneColor(cell) : j === 2 ? FG_DIM : FG,
                fontWeight: j === toneCol ? 500 : 400,
              }}
            >
              {cell}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

function Key({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        border: `1px solid ${FG_FAINT}`,
        padding: "1px 6px",
        fontSize: 10.5,
        color: FG,
        background: "rgba(255,255,255,0.02)",
      }}
    >
      {children}
    </span>
  );
}
