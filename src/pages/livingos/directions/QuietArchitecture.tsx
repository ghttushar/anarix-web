import { DirectionShell } from "@/livingos/shell/DirectionShell";
import { scenario } from "@/livingos/scenario";

// Direction 1 — Quiet Architecture.
// A single laid-paper sheet on a raw oak desk. Aan speaks in the margin.
// A loose Proposal is laid across the lower-right corner at a slight angle.

export default function QuietArchitecture() {
  return (
    <DirectionShell slug="quiet-architecture">
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 30% 30%, #6b4a2f 0%, #4a3220 55%, #2c1c11 100%)",
          overflow: "hidden",
        }}
      >
        {/* Oak grain texture */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(92deg, rgba(20,10,4,0.18) 0px, rgba(20,10,4,0.18) 1px, transparent 1px, transparent 7px), repeating-linear-gradient(89deg, rgba(255,220,180,0.03) 0px, rgba(255,220,180,0.03) 1px, transparent 1px, transparent 40px)",
            opacity: 0.85,
            mixBlendMode: "multiply",
          }}
        />

        {/* The morning sheet */}
        <article
          style={{
            position: "absolute",
            left: "10%",
            top: "8%",
            width: "min(680px, 54%)",
            aspectRatio: "3 / 4",
            background: "#f2ecdc",
            color: "#231a12",
            padding: "72px 72px 90px 72px",
            boxShadow:
              "0 40px 60px -30px rgba(0,0,0,0.55), 0 8px 16px -6px rgba(0,0,0,0.35), inset 0 0 60px rgba(180,150,110,0.08)",
            fontFamily: "'IBM Plex Sans', sans-serif",
            transform: "rotate(-0.6deg)",
          }}
        >
          {/* Kicker */}
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#8a7255",
              paddingBottom: 14,
              borderBottom: "0.5px solid #b5a180",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>{scenario.when.weekday} · {scenario.when.week}</span>
            <span>{scenario.when.time}</span>
          </div>

          {/* Standing sentence */}
          <h1
            style={{
              fontFamily: "'Fraunces', 'Cormorant Garamond', Georgia, serif",
              fontWeight: 400,
              fontSize: "clamp(28px, 3.2vw, 44px)",
              lineHeight: 1.15,
              letterSpacing: "-0.015em",
              margin: "44px 0 56px",
              color: "#1a120b",
            }}
          >
            {scenario.standing.sentence}
          </h1>

          {/* Figures */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {scenario.figures.map((f) => (
              <div
                key={f.label}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto auto",
                  gap: 20,
                  alignItems: "baseline",
                  padding: "14px 0",
                  borderBottom: "0.5px solid #c9b895",
                  fontFamily: "'Fraunces', serif",
                }}
              >
                <div
                  style={{
                    fontFamily: "'IBM Plex Sans', sans-serif",
                    fontSize: 13,
                    color: "#5a4732",
                    fontWeight: 400,
                  }}
                >
                  {f.label}
                  <span
                    style={{
                      fontFamily: "'IBM Plex Sans', sans-serif",
                      fontStyle: "normal",
                      color: "#8a7255",
                      marginLeft: 8,
                      fontSize: 11,
                    }}
                  >
                    {f.frame}
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 11,
                    color: "#8a7255",
                    letterSpacing: "0.04em",
                  }}
                >
                  {f.delta}
                </div>
                <div
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: 22,
                    fontWeight: 500,
                    color: "#1a120b",
                    fontVariantNumeric: "tabular-nums",
                    minWidth: 140,
                    textAlign: "right",
                  }}
                >
                  {f.value}
                </div>
              </div>
            ))}
          </div>

          {/* Margin annotation (Aan's hand) */}
          <div
            style={{
              position: "absolute",
              right: -140,
              top: 200,
              width: 200,
              fontFamily: "'Caveat', cursive",
              fontSize: 22,
              lineHeight: 1.3,
              color: "#2a4a6a",
              transform: "rotate(-4deg)",
            }}
          >
            {scenario.proposal.aanNote}
            <div style={{ marginTop: 6, fontSize: 26 }}>{scenario.proposal.signature}</div>
          </div>
        </article>

        {/* Loose Proposal sheet, laid across lower-right */}
        <article
          style={{
            position: "absolute",
            right: "6%",
            bottom: "8%",
            width: "min(460px, 40%)",
            background: "#ece2c8",
            color: "#231a12",
            padding: "36px 40px 40px",
            boxShadow:
              "0 30px 50px -24px rgba(0,0,0,0.65), 0 4px 10px rgba(0,0,0,0.35)",
            transform: "rotate(3deg)",
            fontFamily: "'IBM Plex Sans', sans-serif",
            borderTop: "3px solid #8a5a2a",
          }}
        >
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#8a5a2a",
              marginBottom: 12,
            }}
          >
            Proposal · unsigned
          </div>
          <div
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 20,
              lineHeight: 1.25,
              fontWeight: 500,
              marginBottom: 14,
              color: "#1a120b",
            }}
          >
            {scenario.proposal.title}
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.55, color: "#4a3f2c", margin: 0 }}>
            {scenario.proposal.body}
          </p>
          <div
            style={{
              marginTop: 20,
              paddingTop: 14,
              borderTop: "0.5px solid #b5a180",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#6b5738",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>{scenario.proposal.est.spendMoved} moved</span>
            <span>{scenario.proposal.est.recovered} recovered</span>
            <span>Risk · {scenario.proposal.est.risk}</span>
          </div>
        </article>

        {/* Running agent — a small slip of paper with a wax seal */}
        <div
          style={{
            position: "absolute",
            left: "6%",
            bottom: "10%",
            width: 240,
            background: "#e8ddc0",
            padding: "18px 22px",
            fontFamily: "'IBM Plex Sans', sans-serif",
            boxShadow: "0 14px 24px -14px rgba(0,0,0,0.55)",
            transform: "rotate(-2.5deg)",
          }}
        >
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#8a5a2a",
              marginBottom: 6,
            }}
          >
            At work · since {scenario.agent.started}
          </div>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 15, lineHeight: 1.3, color: "#1a120b" }}>
            {scenario.agent.label}
          </div>
          <div style={{ fontSize: 11, color: "#5a4732", marginTop: 4 }}>{scenario.agent.scope}</div>
          {/* Wax seal */}
          <div
            style={{
              position: "absolute",
              right: -10,
              bottom: -10,
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: "radial-gradient(circle at 35% 35%, #b0342a, #6a1a13)",
              boxShadow: "0 3px 6px rgba(0,0,0,0.4)",
            }}
          />
        </div>
      </div>
    </DirectionShell>
  );
}
