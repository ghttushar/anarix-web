import { useState } from "react";
import { DirectionShell } from "@/livingos/shell/DirectionShell";
import { scenario } from "@/livingos/scenario";

// Direction 3 — Living Canvas.
// Rice-paper texture across the whole viewport. Four regions differentiated by
// rhythm, not borders. Advertising is tensed. Others breathe. Hover a region → ink bleeds in text.

export default function LivingCanvas() {
  const [leaned, setLeaned] = useState<string | null>(null);

  return (
    <DirectionShell slug="living-canvas">
      <style>{`
        @keyframes canvas-ripple-slow {
          0%, 100% { opacity: 0.55; transform: translateY(0) scale(1); }
          50%      { opacity: 0.78; transform: translateY(-2px) scale(1.005); }
        }
        @keyframes canvas-ripple-mid {
          0%, 100% { opacity: 0.5; transform: translateY(0); }
          50%      { opacity: 0.72; transform: translateY(-3px); }
        }
        @keyframes canvas-ink-bleed {
          from { opacity: 0; filter: blur(6px); }
          to   { opacity: 1; filter: blur(0); }
        }
        @keyframes canvas-fold-catch {
          0%, 100% { transform: rotate(2deg) translateY(0); }
          50%      { transform: rotate(2deg) translateY(-2px); }
        }
      `}</style>

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(160deg, #f2eee5 0%, #ede7d8 40%, #e8dfc9 100%)",
          fontFamily: "'Fraunces', 'Cormorant Garamond', serif",
          color: "#3a352a",
          overflow: "hidden",
        }}
      >
        {/* Rice paper grain */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 15% 25%, rgba(180,150,100,0.05) 0px, transparent 2px), radial-gradient(circle at 65% 75%, rgba(120,90,50,0.04) 0px, transparent 3px), radial-gradient(circle at 85% 15%, rgba(180,150,100,0.06) 0px, transparent 2px)",
            backgroundSize: "30px 30px, 60px 60px, 45px 45px",
            mixBlendMode: "multiply",
          }}
        />

        {/* Dawn blush at left edge */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 260,
            height: "100%",
            background: "linear-gradient(90deg, rgba(230,180,140,0.25), transparent)",
            pointerEvents: "none",
          }}
        />

        {/* Four regions arranged as a 2×2 loose grid */}
        <div
          style={{
            position: "absolute",
            inset: "8% 8%",
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gridTemplateRows: "1fr 0.9fr",
            gap: 40,
          }}
        >
          {/* Advertising — tensed, still, slightly darker */}
          <Region
            id="advertising"
            leaned={leaned}
            setLeaned={setLeaned}
            tensed
            gridArea="1 / 1 / 3 / 2"
            standing={scenario.standing.sentence}
            authored={
              "Authority runs out Thursday. $186,000 of it will lapse without a move. Aan has folded a proposal into the lower corner."
            }
            label="Advertising"
          />
          {/* Inventory — gentle ripple */}
          <Region
            id="inventory"
            leaned={leaned}
            setLeaned={setLeaned}
            gridArea="1 / 2 / 2 / 3"
            ripple="slow"
            standing="Inventory is at ease."
            authored="41 days cover across top ASINs. Nothing to attend to."
            label="Inventory"
          />
          {/* Cash — mid ripple */}
          <Region
            id="cash"
            leaned={leaned}
            setLeaned={setLeaned}
            gridArea="2 / 2 / 3 / 3"
            ripple="mid"
            standing="Cash is at ease."
            authored="$2.1M operating headroom. Payroll clears Thursday."
            label="Cash"
          />
        </div>

        {/* The Proposal — a fold in the canvas at lower-right */}
        <div
          style={{
            position: "absolute",
            right: "6%",
            bottom: "8%",
            width: 300,
            padding: "26px 28px",
            background: "linear-gradient(155deg, #f6efdd 0%, #e6d9b8 100%)",
            boxShadow:
              "0 -1px 0 rgba(255,255,255,0.6) inset, 0 20px 40px -20px rgba(120,80,40,0.35), -12px 12px 0 -8px rgba(180,150,100,0.25)",
            animation: "canvas-fold-catch 8s ease-in-out infinite",
            transformOrigin: "top right",
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
          }}
        >
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#8a6a3a",
              marginBottom: 10,
            }}
          >
            A fold in the canvas
          </div>
          <div
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 18,
              lineHeight: 1.3,
              fontStyle: "italic",
              color: "#2a2015",
            }}
          >
            {scenario.proposal.title}.
          </div>
          <div
            style={{
              marginTop: 14,
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#8a6a3a",
            }}
          >
            Unfold to attend
          </div>
        </div>

        {/* Slow current — the running agent, a directional drift in the corner */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: "8%",
            bottom: 30,
            width: 300,
            height: 30,
            background:
              "linear-gradient(90deg, transparent, rgba(150,110,60,0.35), transparent)",
            filter: "blur(3px)",
            animation: "canvas-ripple-mid 6s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "8%",
            bottom: 4,
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(90,70,42,0.65)",
          }}
        >
          ~ a current: {scenario.agent.label.toLowerCase()} · {scenario.agent.scope} · ~{scenario.agent.etaMinutes}m
        </div>

        {/* Time whisper */}
        <div
          style={{
            position: "absolute",
            top: 50,
            right: 60,
            fontFamily: "'Instrument Serif', serif",
            fontStyle: "italic",
            fontSize: 18,
            color: "rgba(90,70,42,0.5)",
          }}
        >
          {scenario.when.weekday.toLowerCase()}, first light — {scenario.when.time}
        </div>
      </div>
    </DirectionShell>
  );
}

function Region({
  id,
  leaned,
  setLeaned,
  tensed,
  ripple,
  gridArea,
  standing,
  authored,
  label,
}: {
  id: string;
  leaned: string | null;
  setLeaned: (v: string | null) => void;
  tensed?: boolean;
  ripple?: "slow" | "mid";
  gridArea: string;
  standing: string;
  authored: string;
  label: string;
}) {
  const active = leaned === id;
  return (
    <div
      onMouseEnter={() => setLeaned(id)}
      onMouseLeave={() => setLeaned(null)}
      style={{
        gridArea,
        position: "relative",
        cursor: "default",
        animation: ripple ? `canvas-ripple-${ripple} ${ripple === "slow" ? 9 : 6}s ease-in-out infinite` : undefined,
        background: tensed
          ? "radial-gradient(ellipse at 30% 40%, rgba(80,60,35,0.16), rgba(80,60,35,0.05) 60%, transparent 85%)"
          : "radial-gradient(ellipse at 50% 50%, rgba(180,150,100,0.06), transparent 70%)",
        transition: "background 900ms ease",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 24,
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 10,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          color: tensed ? "rgba(90,60,30,0.75)" : "rgba(120,100,70,0.5)",
        }}
      >
        {label}
      </div>

      {/* Ink-bleed text appears only when leaned in */}
      {active && (
        <div
          style={{
            position: "absolute",
            top: "38%",
            left: 32,
            right: 32,
            animation: "canvas-ink-bleed 1200ms ease-out both",
          }}
        >
          <div
            style={{
              fontFamily: "'Fraunces', serif",
              fontStyle: "italic",
              fontSize: tensed ? 30 : 22,
              lineHeight: 1.2,
              color: "#2a2015",
              marginBottom: 14,
            }}
          >
            {standing}
          </div>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 14, lineHeight: 1.6, color: "#5a4a30" }}>
            {authored}
          </div>
        </div>
      )}

      {!active && tensed && (
        <div
          style={{
            position: "absolute",
            bottom: 24,
            left: 24,
            fontFamily: "'Instrument Serif', serif",
            fontStyle: "italic",
            fontSize: 14,
            color: "rgba(90,60,30,0.55)",
          }}
        >
          lean in
        </div>
      )}
    </div>
  );
}
