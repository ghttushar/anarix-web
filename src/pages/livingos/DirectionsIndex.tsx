import { useEffect } from "react";
import { Link } from "react-router-dom";
import { directions } from "@/livingos/scenario";
import mood1 from "@/assets/livingos/moods/1-quiet-architecture.jpg";
import mood2 from "@/assets/livingos/moods/2-gravity-field.jpg";
import mood3 from "@/assets/livingos/moods/3-living-canvas.jpg";
import mood4 from "@/assets/livingos/moods/4-command-surface.jpg";
import mood5 from "@/assets/livingos/moods/5-ambient-room.jpg";
import mood6 from "@/assets/livingos/moods/6-editorial-intelligence.jpg";

const moods: Record<string, string> = {
  "quiet-architecture": mood1,
  "gravity-field": mood2,
  "living-canvas": mood3,
  "command-surface": mood4,
  "ambient-room": mood5,
  "editorial-intelligence": mood6,
};

export default function DirectionsIndex() {
  useEffect(() => {
    const key = "livingos-fonts";
    if (!document.getElementById(key)) {
      const link = document.createElement("link");
      link.id = key;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@300;400;500&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4efe6",
        color: "#1a1614",
        fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
        padding: "72px clamp(24px, 6vw, 96px) 96px",
      }}
    >
      {/* Masthead */}
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#6b6058",
            paddingBottom: 20,
            borderBottom: "1px solid #1a1614",
          }}
        >
          <span>Living OS · Visual Language Exploration · v0.3</span>
          <span>Six directions · Tuesday morning scenario</span>
        </div>

        <h1
          style={{
            fontFamily: "'Fraunces', 'Cormorant Garamond', Georgia, serif",
            fontWeight: 400,
            fontSize: "clamp(36px, 5vw, 64px)",
            lineHeight: 1.08,
            letterSpacing: "-0.02em",
            margin: "56px 0 20px",
            maxWidth: 900,
          }}
        >
          Six visual answers to one question:{" "}
          <em style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", color: "#4a3f36" }}>
            what does trustworthy, ambient, continuously thinking intelligence feel like?
          </em>
        </h1>

        <p
          style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: 15,
            lineHeight: 1.6,
            color: "#4a3f36",
            maxWidth: 640,
            margin: "0 0 64px",
          }}
        >
          Every prototype renders the same Tuesday morning: Advertising is holding, Q4 authority
          runs out Thursday, Aan has drafted one move, one agent is running. Same figures, same
          Standing, same Proposal. Only the rendering changes.
        </p>

        {/* Grid — 3 columns × 2 rows on desktop, 1 column on mobile */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 380px), 1fr))",
            gap: 32,
          }}
        >
          {directions.map((d, i) => (
            <Link
              key={d.slug}
              to={`/livingos/directions/${d.slug}`}
              style={{
                display: "block",
                textDecoration: "none",
                color: "inherit",
                border: "1px solid #1a1614",
                background: "#faf6ec",
                transition: "transform 220ms ease, box-shadow 220ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 18px 40px -20px rgba(26,22,20,0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              <div style={{ position: "relative", aspectRatio: "3 / 2", overflow: "hidden", borderBottom: "1px solid #1a1614" }}>
                <img
                  src={moods[d.slug]}
                  alt=""
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: "saturate(0.92)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 12,
                    left: 14,
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 10,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "rgba(250,246,236,0.85)",
                    mixBlendMode: "difference",
                  }}
                >
                  {String(i + 1).padStart(2, "0")} · {d.verdict}
                </div>
              </div>
              <div style={{ padding: "24px 26px 26px" }}>
                <div
                  style={{
                    fontFamily: "'Fraunces', 'Cormorant Garamond', Georgia, serif",
                    fontSize: 28,
                    fontWeight: 400,
                    letterSpacing: "-0.01em",
                    marginBottom: 8,
                  }}
                >
                  {d.name}
                </div>
                <div
                  style={{
                    fontFamily: "'IBM Plex Sans', sans-serif",
                    fontSize: 14,
                    lineHeight: 1.5,
                    color: "#4a3f36",
                    minHeight: 42,
                  }}
                >
                  {d.philosophy}
                </div>
                <div
                  style={{
                    marginTop: 20,
                    paddingTop: 16,
                    borderTop: "1px solid #d9cfbf",
                    display: "flex",
                    justifyContent: "space-between",
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 10.5,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#6b6058",
                  }}
                >
                  <span>Checksum · {d.checksum}/10</span>
                  <span>→ Open</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div
          style={{
            marginTop: 72,
            paddingTop: 24,
            borderTop: "1px solid #d9cfbf",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#6b6058",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>Rationale · .lovable/visual-directions.md</span>
          <span>Keyboard · ← → cycle · Esc back</span>
        </div>
      </div>
    </div>
  );
}
