import { useState } from "react";
import { DirectionShell } from "@/livingos/shell/DirectionShell";
import { scenario } from "@/livingos/scenario";

// Direction 5 — Ambient Room.
// A dark walnut study seen from a fixed viewpoint. One warm tungsten lamp lights Advertising.
// Other furniture (Domains) sits in warm shadow. Approach a piece → the surface lights and reveals text.

const WARM = "#e6a862";
const AMBIENT = "rgba(230,168,98,0.15)";

export default function AmbientRoom() {
  const [near, setNear] = useState<string | null>(null);

  return (
    <DirectionShell slug="ambient-room">
      <style>{`
        @keyframes room-lamp-flicker {
          0%, 92%, 100% { opacity: 1; }
          94% { opacity: 0.94; }
          96% { opacity: 1; }
        }
        @keyframes room-approach {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 62% 55%, #3a2a1c 0%, #1a120a 45%, #0a0704 100%)",
          fontFamily: "'Inter Tight', 'IBM Plex Sans', sans-serif",
          color: "#e0d5c0",
          overflow: "hidden",
        }}
      >
        {/* Room ambient wash — warm because Aan is confident */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: AMBIENT,
            mixBlendMode: "screen",
            pointerEvents: "none",
          }}
        />

        {/* Wood grain panels — subtle vertical bands */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(20,10,4,0.35) 0px, rgba(20,10,4,0.35) 1px, transparent 1px, transparent 180px)",
            opacity: 0.7,
            mixBlendMode: "multiply",
          }}
        />

        {/* Tungsten lamp glow — the room's single light source, on the "Advertising desk" */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "38%",
            left: "50%",
            width: 780,
            height: 780,
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(circle, rgba(255,180,90,0.32) 0%, rgba(255,150,60,0.14) 25%, transparent 60%)",
            filter: "blur(6px)",
            animation: "room-lamp-flicker 7s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />

        {/* Lamp itself — a small warm point */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "34%",
            left: "50%",
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "radial-gradient(circle, #ffe0a8, #d68420 55%, transparent)",
            transform: "translate(-50%, -50%)",
            boxShadow: `0 0 60px ${WARM}, 0 0 120px ${WARM}`,
          }}
        />

        {/* Domain furniture arranged around the room */}
        {/* Advertising — the lit desk, center */}
        <Furniture
          id="advertising"
          near={near}
          setNear={setNear}
          x="50%"
          y="60%"
          width={380}
          height={220}
          lit
          label="Advertising"
          standing={scenario.standing.sentence}
          note={scenario.figures[0].label + " · " + scenario.figures[0].value}
          note2={scenario.figures[2].label + " · " + scenario.figures[2].value}
        >
          {/* The Proposal — a folded letter visible from across the room */}
          <div
            style={{
              position: "absolute",
              right: 30,
              bottom: 40,
              width: 90,
              height: 60,
              background: "linear-gradient(160deg, #f0e2c4, #d4b988)",
              boxShadow: "0 6px 12px rgba(0,0,0,0.5)",
              transform: "rotate(-4deg)",
            }}
            title="Proposal from Aan"
          />
        </Furniture>

        {/* Inventory — a bookshelf to the left, dim */}
        <Furniture
          id="inventory"
          near={near}
          setNear={setNear}
          x="15%"
          y="52%"
          width={140}
          height={280}
          label="Inventory"
          standing="At ease."
          note="41 days cover"
        />

        {/* Cash — a low cabinet, right */}
        <Furniture
          id="cash"
          near={near}
          setNear={setNear}
          x="85%"
          y="70%"
          width={200}
          height={130}
          label="Cash"
          standing="At ease."
          note="$2.1M headroom"
        />

        {/* Aan — a wall of the room, felt in the light itself. A small placard high on the wall. */}
        <div
          onMouseEnter={() => setNear("aan")}
          onMouseLeave={() => setNear(null)}
          style={{
            position: "absolute",
            top: "12%",
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
            cursor: "default",
          }}
        >
          <div
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle: "italic",
              fontSize: 15,
              color: "rgba(230,168,98,0.75)",
              letterSpacing: "0.06em",
            }}
          >
            the room is warm
          </div>
          {near === "aan" && (
            <div
              style={{
                marginTop: 8,
                animation: "room-approach 700ms ease-out both",
                fontSize: 12,
                color: "rgba(224,213,192,0.85)",
                maxWidth: 260,
              }}
            >
              Aan is confident. When the room cools, look up.
            </div>
          )}
        </div>

        {/* The lit-lamp-on-a-shelf: the running agent */}
        <div
          onMouseEnter={() => setNear("agent")}
          onMouseLeave={() => setNear(null)}
          style={{
            position: "absolute",
            left: "26%",
            top: "22%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: "default",
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "radial-gradient(circle, #ffe0a0, #c67818)",
              boxShadow: `0 0 20px ${WARM}, 0 0 40px rgba(230,168,98,0.4)`,
            }}
          />
          <div style={{ width: 40, height: 3, background: "rgba(60,40,20,0.9)", marginTop: 4 }} />
          {near === "agent" && (
            <div
              style={{
                marginTop: 12,
                animation: "room-approach 700ms ease-out both",
                textAlign: "center",
                fontSize: 12,
                color: "rgba(224,213,192,0.9)",
                width: 200,
              }}
            >
              <div style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontSize: 16, marginBottom: 4 }}>
                {scenario.agent.label} is running
              </div>
              <div style={{ color: "rgba(180,160,130,0.7)" }}>
                {scenario.agent.scope} · started {scenario.agent.started} · ~{scenario.agent.etaMinutes}m
              </div>
            </div>
          )}
        </div>

        {/* Time whisper — the "clock on the mantel" */}
        <div
          style={{
            position: "absolute",
            bottom: 50,
            right: 60,
            fontFamily: "'Instrument Serif', serif",
            fontStyle: "italic",
            fontSize: 15,
            color: "rgba(230,168,98,0.4)",
            letterSpacing: "0.04em",
          }}
        >
          {scenario.when.weekday.toLowerCase()}, {scenario.when.time} — first light
        </div>
      </div>
    </DirectionShell>
  );
}

function Furniture({
  id,
  near,
  setNear,
  x,
  y,
  width,
  height,
  lit,
  label,
  standing,
  note,
  note2,
  children,
}: {
  id: string;
  near: string | null;
  setNear: (v: string | null) => void;
  x: string;
  y: string;
  width: number;
  height: number;
  lit?: boolean;
  label: string;
  standing: string;
  note?: string;
  note2?: string;
  children?: React.ReactNode;
}) {
  const active = near === id;
  const surfaceBrightness = lit || active ? 1 : 0.28;
  return (
    <div
      onMouseEnter={() => setNear(id)}
      onMouseLeave={() => setNear(null)}
      style={{
        position: "absolute",
        top: y,
        left: x,
        width,
        height,
        transform: "translate(-50%, -50%)",
        cursor: "default",
        transition: "filter 900ms ease",
        filter: `brightness(${surfaceBrightness})`,
      }}
    >
      {/* The surface itself */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(170deg, #6b4a2a 0%, #4a3018 55%, #2a1a0a 100%)",
          boxShadow: lit
            ? `0 20px 40px rgba(0,0,0,0.7), inset 0 30px 60px rgba(255,180,90,0.18)`
            : "0 20px 40px rgba(0,0,0,0.8)",
        }}
      />
      {/* Label — always visible, faint */}
      <div
        style={{
          position: "absolute",
          top: 14,
          left: 18,
          fontFamily: "'Instrument Serif', serif",
          fontStyle: "italic",
          fontSize: 14,
          color: lit ? "rgba(255,220,170,0.85)" : "rgba(220,180,130,0.4)",
          letterSpacing: "0.04em",
        }}
      >
        {label}
      </div>

      {(lit || active) && (
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 18,
            right: 18,
            animation: "room-approach 900ms ease-out both",
          }}
        >
          <div
            style={{
              fontFamily: "'Fraunces', 'Instrument Serif', serif",
              fontSize: lit ? 17 : 14,
              lineHeight: 1.3,
              color: "rgba(255,235,205,0.92)",
              marginBottom: 10,
            }}
          >
            {standing}
          </div>
          {note && (
            <div style={{ fontSize: 11.5, color: "rgba(220,190,150,0.7)", fontVariantNumeric: "tabular-nums" }}>
              {note}
            </div>
          )}
          {note2 && (
            <div style={{ fontSize: 11.5, color: "rgba(220,190,150,0.7)", fontVariantNumeric: "tabular-nums", marginTop: 3 }}>
              {note2}
            </div>
          )}
        </div>
      )}

      {children}
    </div>
  );
}
