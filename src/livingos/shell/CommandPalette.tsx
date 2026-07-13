import { useEffect, useRef } from "react";
import { scenario } from "../scenario";

interface Props {
  onClose: () => void;
}

const groups = [
  {
    label: "Domains",
    items: scenario.domains.map((d) => `${d.name} · ${d.state}`),
  },
  {
    label: "Proposals",
    items: ["Shift 12% SP → SB · Advertising"],
  },
  {
    label: "Memory",
    items: ["Yesterday's Standing", "Last week — Advertising"],
  },
  {
    label: "Signals",
    items: ["SB SoV −4pts", "Q4 window · 03d left"],
  },
];

export function CommandPalette({ onClose }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div
      onClick={onClose}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 40,
        background: "rgba(26,22,20,0.28)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "22vh",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 640,
          maxWidth: "92vw",
          background: "var(--los-paper-warm)",
          border: "1px solid var(--los-line)",
          borderRadius: 4,
          boxShadow: "0 24px 60px -20px rgba(26,22,20,0.4)",
          overflow: "hidden",
        }}
      >
        <input
          ref={inputRef}
          placeholder="Ask, find, or investigate."
          style={{
            width: "100%",
            padding: "18px 22px",
            border: "none",
            outline: "none",
            background: "transparent",
            fontFamily: "var(--los-serif)",
            fontSize: 18,
            color: "var(--los-ink)",
            borderBottom: "1px solid var(--los-line)",
          }}
        />
        <div style={{ maxHeight: "50vh", overflow: "auto", padding: "10px 0" }}>
          {groups.map((g) => (
            <div key={g.label} style={{ padding: "6px 0" }}>
              <div
                style={{
                  padding: "6px 22px",
                  fontFamily: "var(--los-mono)",
                  fontSize: 10,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--los-ink-faint)",
                }}
              >
                {g.label}
              </div>
              {g.items.map((it) => (
                <div
                  key={it}
                  style={{
                    padding: "8px 22px",
                    fontFamily: "var(--los-sans)",
                    fontSize: 14,
                    color: "var(--los-ink)",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--los-paper-deep)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  {it}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div
          style={{
            padding: "8px 22px",
            borderTop: "1px solid var(--los-line)",
            fontFamily: "var(--los-mono)",
            fontSize: 10,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--los-ink-faint)",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>Natural language · semantic · memory</span>
          <span>Esc · close</span>
        </div>
      </div>
    </div>
  );
}
