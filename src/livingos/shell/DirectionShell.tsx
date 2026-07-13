import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { directions, type DirectionSlug } from "@/livingos/scenario";

interface Props {
  slug: DirectionSlug;
  children: ReactNode;
}

/**
 * Wraps every direction prototype.
 * - Injects Google Fonts once for /livingos/*.
 * - Owns keyboard nav: Esc → index, ← / → cycle directions.
 * - Renders a hairline bottom-left return chip and a top-right cycle hint.
 * - Does NOT impose any visual system on the child. Each direction owns its own surface.
 */
export function DirectionShell({ slug, children }: Props) {
  const navigate = useNavigate();
  const idx = directions.findIndex((d) => d.slug === slug);
  const prev = directions[(idx - 1 + directions.length) % directions.length];
  const next = directions[(idx + 1) % directions.length];
  const current = directions[idx];

  useEffect(() => {
    const key = "livingos-fonts";
    if (!document.getElementById(key)) {
      const link = document.createElement("link");
      link.id = key;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?" +
        [
          "family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400",
          "family=IBM+Plex+Sans:wght@300;400;500;600",
          "family=IBM+Plex+Mono:wght@400;500",
          "family=JetBrains+Mono:wght@400;500;700",
          "family=Inter+Tight:wght@300;400;500;600;700",
          "family=Instrument+Serif:ital@0;1",
          "family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400",
          "family=Caveat:wght@400;600",
          "family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400",
        ].join("&") +
        "&display=swap";
      document.head.appendChild(link);
    }
    document.body.dataset.livingos = "true";
    return () => {
      delete document.body.dataset.livingos;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") navigate("/livingos/directions");
      else if (e.key === "ArrowRight") navigate(`/livingos/directions/${next.slug}`);
      else if (e.key === "ArrowLeft") navigate(`/livingos/directions/${prev.slug}`);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate, next.slug, prev.slug]);

  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden" }}>
      {children}

      {/* Chrome — deliberately outside every direction's visual system.
          Neutral, small, unobtrusive. Same on all six so it does not become a variable. */}
      <div
        style={{
          position: "fixed",
          top: 16,
          right: 20,
          display: "flex",
          gap: 14,
          alignItems: "center",
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          fontSize: 10.5,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "rgba(140,140,150,0.7)",
          mixBlendMode: "difference",
          zIndex: 9999,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <span>
          {String(idx + 1).padStart(2, "0")} / 06 · {current.name}
        </span>
        <span style={{ opacity: 0.55 }}>← →  Esc</span>
      </div>

      <button
        onClick={() => navigate("/livingos/directions")}
        style={{
          position: "fixed",
          bottom: 16,
          left: 20,
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          fontSize: 10.5,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "rgba(140,140,150,0.7)",
          mixBlendMode: "difference",
          zIndex: 9999,
          padding: 4,
        }}
      >
        ← Six directions
      </button>
    </div>
  );
}
