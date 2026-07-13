import { DirectionShell } from "@/livingos/shell/DirectionShell";
import { scenario } from "@/livingos/scenario";

// Direction 2 — Gravity Field.
// Domains are objects with mass. Advertising is centered, heavy, breathing.
// One warm directional light. Satellites orbit. The Proposal is caught mid-drift.

export default function GravityField() {
  return (
    <DirectionShell slug="gravity-field">
      <style>{`
        @keyframes gravity-breathe {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.015); }
        }
        @keyframes gravity-orbit-1 {
          from { transform: rotate(0deg) translateX(210px) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(210px) rotate(-360deg); }
        }
        @keyframes gravity-orbit-2 {
          from { transform: rotate(120deg) translateX(280px) rotate(-120deg); }
          to   { transform: rotate(480deg) translateX(280px) rotate(-480deg); }
        }
        @keyframes gravity-orbit-3 {
          from { transform: rotate(240deg) translateX(340px) rotate(-240deg); }
          to   { transform: rotate(600deg) translateX(340px) rotate(-600deg); }
        }
        @keyframes gravity-agent {
          from { transform: rotate(0deg) translateX(150px) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(150px) rotate(-360deg); }
        }
        @keyframes gravity-proposal-drift {
          0% { transform: translate(60px, -20px); opacity: 0.6; }
          100% { transform: translate(0, 0); opacity: 1; }
        }
      `}</style>

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 40% 45%, #201f26 0%, #0e0d12 55%, #050506 100%)",
          fontFamily: "'Inter Tight', system-ui, sans-serif",
          color: "#c8c4b8",
          overflow: "hidden",
        }}
      >
        {/* Warm directional light */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "20%",
            left: "35%",
            width: 700,
            height: 700,
            background: "radial-gradient(circle, rgba(220,150,80,0.15), transparent 60%)",
            filter: "blur(10px)",
            pointerEvents: "none",
          }}
        />

        {/* Faint field grid — the substrate */}
        <svg
          aria-hidden
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.15 }}
        >
          <defs>
            <radialGradient id="gf-fade" cx="45%" cy="45%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
          </defs>
          {Array.from({ length: 8 }).map((_, i) => (
            <circle
              key={i}
              cx="45%"
              cy="50%"
              r={80 + i * 65}
              fill="none"
              stroke="url(#gf-fade)"
              strokeWidth="0.5"
            />
          ))}
        </svg>

        {/* Standing spine — very quiet, top */}
        <div
          style={{
            position: "absolute",
            top: 60,
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: "rgba(200,196,184,0.5)",
            display: "flex",
            gap: 28,
          }}
        >
          <span>{scenario.when.weekday}</span>
          <span>·</span>
          <span>{scenario.when.time}</span>
          <span>·</span>
          <span>Field at rest</span>
        </div>

        {/* Advertising — the heavy center, breathing */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "45%",
            width: 240,
            height: 240,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 35% 30%, #f0d9b0 0%, #c89a5a 30%, #6a4222 65%, #1a0f06 100%)",
            boxShadow:
              "0 60px 80px -20px rgba(0,0,0,0.85), inset -30px -40px 80px rgba(0,0,0,0.55), inset 20px 20px 40px rgba(255,230,180,0.15)",
            animation: "gravity-breathe 5.5s ease-in-out infinite",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "#1a0f06",
          }}
        >
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "rgba(26,15,6,0.7)",
            }}
          >
            Domain
          </div>
          <div
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 28,
              fontWeight: 500,
              marginTop: 4,
            }}
          >
            Advertising
          </div>
          <div style={{ fontSize: 11, color: "rgba(26,15,6,0.75)", marginTop: 8, textAlign: "center", maxWidth: 180, lineHeight: 1.4 }}>
            Holding. Authority runs out Thursday.
          </div>
        </div>

        {/* Satellite orbits — rendered as rotating containers around the center */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "45%",
            width: 0,
            height: 0,
          }}
        >
          {/* Spend */}
          <div style={{ position: "absolute", animation: "gravity-orbit-1 42s linear infinite", transformOrigin: "0 0" }}>
            <Satellite label="Spend" value="$847k" weight={0.9} tone="hazard" />
          </div>
          {/* Efficiency */}
          <div style={{ position: "absolute", animation: "gravity-orbit-2 66s linear infinite", transformOrigin: "0 0" }}>
            <Satellite label="Efficiency" value="ROAS 4.62" weight={0.55} />
          </div>
          {/* Opportunity */}
          <div style={{ position: "absolute", animation: "gravity-orbit-3 88s linear infinite", transformOrigin: "0 0" }}>
            <Satellite label="Opportunity" value="$186k unspent" weight={0.6} />
          </div>
          {/* Running agent — inner tight orbit */}
          <div style={{ position: "absolute", animation: "gravity-agent 8s linear infinite", transformOrigin: "0 0" }}>
            <div
              title={`${scenario.agent.label} · ${scenario.agent.scope} · ~${scenario.agent.etaMinutes}m`}
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: "radial-gradient(circle at 30% 30%, #ffe0a0, #d68420)",
                boxShadow: "0 0 12px rgba(230,150,60,0.7)",
                transform: "translate(-7px, -7px)",
              }}
            />
          </div>
        </div>

        {/* Distant lighter Domains, drifted to the edges */}
        <DistantDomain label="Inventory" x="10%" y="30%" size={60} />
        <DistantDomain label="Cash" x="12%" y="72%" size={54} />
        <DistantDomain label="Aan" x="86%" y="30%" size={70} soft />

        {/* Proposal — caught mid-drift into the field */}
        <div
          style={{
            position: "absolute",
            right: "6%",
            bottom: "8%",
            width: 340,
            background: "rgba(20,18,22,0.72)",
            backdropFilter: "blur(14px)",
            border: "1px solid rgba(230,180,120,0.35)",
            padding: "22px 24px",
            color: "#e8dcc4",
            fontFamily: "'Inter Tight', sans-serif",
            animation: "gravity-proposal-drift 1.6s ease-out both",
            boxShadow: "0 30px 50px -20px rgba(0,0,0,0.7)",
          }}
        >
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "rgba(230,180,120,0.85)",
              marginBottom: 10,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>◈ Proposal · arrived 08:11</span>
            <span>catch or drift</span>
          </div>
          <div style={{ fontSize: 15, lineHeight: 1.35, fontWeight: 500, marginBottom: 8 }}>
            {scenario.proposal.title}
          </div>
          <div style={{ fontSize: 12, lineHeight: 1.55, color: "rgba(200,196,184,0.7)" }}>
            {scenario.proposal.body}
          </div>
        </div>

        {/* Bottom-left status */}
        <div
          style={{
            position: "absolute",
            left: 60,
            bottom: 60,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10.5,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(200,196,184,0.5)",
            lineHeight: 1.8,
          }}
        >
          <div>◉ 1 agent working · ~{scenario.agent.etaMinutes}m</div>
          <div>Aan · thinking about Thursday</div>
        </div>
      </div>
    </DirectionShell>
  );
}

function Satellite({
  label,
  value,
  weight,
  tone,
}: {
  label: string;
  value: string;
  weight: number;
  tone?: "hazard";
}) {
  const size = 34 + weight * 40;
  const color = tone === "hazard" ? "#c98a3a" : "#7a8890";
  return (
    <div
      style={{
        transform: `translate(-${size / 2}px, -${size / 2}px)`,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle at 35% 30%, ${color}, ${tone === "hazard" ? "#3a2a10" : "#1a1e22"})`,
        boxShadow: `0 6px 14px rgba(0,0,0,0.6), 0 0 ${tone === "hazard" ? "16px" : "6px"} rgba(${tone === "hazard" ? "230,150,60,0.35" : "255,255,255,0.05"})`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "#f0e8d8",
        fontFamily: "'Inter Tight', sans-serif",
        fontSize: 9,
        lineHeight: 1.1,
        textAlign: "center",
        padding: 4,
      }}
    >
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.8 }}>
        {label}
      </div>
      <div style={{ fontSize: 10, fontWeight: 500, marginTop: 2 }}>{value}</div>
    </div>
  );
}

function DistantDomain({
  label,
  x,
  y,
  size,
  soft,
}: {
  label: string;
  x: string;
  y: string;
  size: number;
  soft?: boolean;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          background: soft
            ? "radial-gradient(circle at 35% 30%, rgba(200,180,220,0.5), rgba(60,50,80,0.2))"
            : "radial-gradient(circle at 35% 30%, #4a4a48, #15151a)",
          boxShadow: soft
            ? "0 0 40px rgba(180,160,220,0.2), 0 8px 20px rgba(0,0,0,0.5)"
            : "0 8px 20px rgba(0,0,0,0.55)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "100%",
          left: "50%",
          transform: "translateX(-50%)",
          marginTop: 12,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(200,196,184,0.55)",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
    </div>
  );
}
