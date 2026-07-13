import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AmbientStrip } from "./AmbientStrip";
import { ContextDock } from "./ContextDock";
import { CommandPalette } from "./CommandPalette";
import { DomainConstellation } from "../domains/DomainConstellation";
import { DomainExpanded } from "../domains/DomainExpanded";
import { scenario } from "../scenario";
import "../tokens.css";

export function LivingOSShell() {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [entering, setEntering] = useState(true);

  // Inject fonts only within Living OS
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

  // Keyboard: Cmd+K opens palette · Esc collapses expanded Domain
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      } else if (e.key === "Escape") {
        if (paletteOpen) setPaletteOpen(false);
        else if (expandedId) setExpandedId(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expandedId, paletteOpen]);

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
      {/* Entry bloom */}
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
        <DomainConstellation
          onSelect={(id) => setExpandedId(id)}
          dimmed={!!expanded}
        />

        {expanded && (
          <DomainExpanded
            domain={expanded}
            onClose={() => setExpandedId(null)}
          />
        )}
      </main>

      <ContextDock
        onOpenDomain={(id) => setExpandedId(id)}
        activeId={expandedId}
      />

      {paletteOpen && <CommandPalette onClose={() => setPaletteOpen(false)} />}
    </div>
  );
}
