import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AmbientStrip } from "./AmbientStrip";
import { ContextDock } from "./ContextDock";
import { CommandPalette } from "./CommandPalette";
import { DomainConstellation } from "../domains/DomainConstellation";
import { DomainExpanded } from "../domains/DomainExpanded";
import { scenario } from "../scenario";
import { LivingOSProvider, useLivingOS } from "../state/LivingOSContext";
import { SimulationOverlay } from "../proposals/SimulationMode";
import { AwarenessBloom } from "../awareness/AwarenessBloom";
import { AgentAmbientPanel } from "../agents/AgentAmbientPanel";
import { AanCopilotPanel } from "@/components/aan/AanCopilotPanel";
import { useAan } from "@/components/aan/AanContext";
import "../tokens.css";

export function LivingOSShell() {
  return (
    <LivingOSProvider initialSentence={scenario.proposal.sentence}>
      <ShellInner />
    </LivingOSProvider>
  );
}

function ShellInner() {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [entering, setEntering] = useState(true);
  const { aanOpen, setAanOpen } = useLivingOS();
  const aan = useAan();

  // Fonts
  useEffect(() => {
    const id = "livingos-fonts-v2";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,400&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@300;400;500&display=swap";
      document.head.appendChild(link);
    }
    const t = setTimeout(() => setEntering(false), 1200);
    return () => clearTimeout(t);
  }, []);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      } else if (e.altKey && e.code === "Space") {
        e.preventDefault();
        setAanOpen(true);
        aan.setMode("copilot");
      } else if (e.key === "Escape") {
        if (aanOpen) {
          setAanOpen(false);
          aan.setMode("closed");
        } else if (paletteOpen) setPaletteOpen(false);
        else if (expandedId) setExpandedId(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expandedId, paletteOpen, aanOpen, aan, setAanOpen]);

  const expanded = scenario.domains.find((d) => d.id === expandedId) ?? null;

  return (
    <div
      className="livingos-scope"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {entering && (
        <div
          className="livingos-bloom"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse 80% 40% at 50% -10%, rgba(200,135,90,0.35), transparent 70%)",
            zIndex: 5,
          }}
        />
      )}

      <AmbientStrip onExit={() => navigate(-1)} />

      <main
        className="livingos-grain"
        style={{
          flex: 1,
          position: "relative",
          background: "var(--los-paper)",
          overflow: "hidden",
        }}
      >
        <DomainConstellation onSelect={(id) => setExpandedId(id)} dimmed={!!expanded} />
        {expanded && <DomainExpanded domain={expanded} onClose={() => setExpandedId(null)} />}
        <SimulationOverlay />
        <AwarenessBloom />
        <AgentAmbientPanel />
      </main>

      <ContextDock onOpenDomain={(id) => setExpandedId(id)} activeId={expandedId} />

      {paletteOpen && <CommandPalette onClose={() => setPaletteOpen(false)} />}

      {aanOpen && (
        <div
          onClick={() => {
            setAanOpen(false);
            aan.setMode("closed");
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "rgba(15,13,10,0.28)",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(520px, 92vw)",
              height: "100%",
              background: "var(--los-paper-warm)",
              borderLeft: "1px solid var(--los-line)",
              overflow: "hidden",
            }}
          >
            <AanCopilotPanel />
          </div>
        </div>
      )}
    </div>
  );
}
