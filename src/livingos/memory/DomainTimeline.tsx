import { useState } from "react";
import { Domain } from "../scenario";
import { useLivingOS } from "../state/LivingOSContext";

/** A quiet horizontal timeline pulled up from the bottom of an expanded Domain. */
export function DomainTimeline({ domain }: { domain: Domain }) {
  const { replayIndex, setReplayIndex } = useLivingOS();
  const [open, setOpen] = useState(false);
  const events = domain.timeline;

  return (
    <div style={{ marginTop: 36, borderTop: "1px solid var(--los-line)", paddingTop: 16 }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          fontFamily: "var(--los-mono)",
          fontSize: 10,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "var(--los-ink-muted)",
          cursor: "pointer",
        }}
      >
        Memory · {events.length} moments · {open ? "collapse" : "expand"}
      </button>

      <div
        style={{
          overflow: "hidden",
          maxHeight: open ? 200 : 0,
          opacity: open ? 1 : 0,
          transition: "max-height 320ms var(--los-ease), opacity 260ms var(--los-ease)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 0, marginTop: 20, position: "relative" }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 12,
              height: 1,
              background: "var(--los-line)",
            }}
          />
          {events.map((e, i) => {
            const active = replayIndex === i;
            return (
              <button
                key={e.when}
                onClick={() => setReplayIndex(active ? -1 : i)}
                style={{
                  flex: 1,
                  background: "none",
                  border: "none",
                  padding: "0 4px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <span
                  style={{
                    width: active ? 12 : 8,
                    height: active ? 12 : 8,
                    borderRadius: "50%",
                    background: active ? "var(--los-warm)" : "var(--los-paper-warm)",
                    border: `1px solid ${active ? "var(--los-warm)" : "var(--los-line)"}`,
                    transition: "all 220ms var(--los-ease)",
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--los-mono)",
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    color: active ? "var(--los-ink)" : "var(--los-ink-faint)",
                  }}
                >
                  {e.when}
                </span>
                <span
                  style={{
                    fontFamily: "var(--los-mono)",
                    fontSize: 9,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--los-ink-faint)",
                  }}
                >
                  {e.state}
                </span>
              </button>
            );
          })}
          <button
            onClick={() => setReplayIndex(-1)}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              padding: "0 4px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              position: "relative",
              zIndex: 1,
            }}
          >
            <span
              style={{
                width: replayIndex === -1 ? 12 : 8,
                height: replayIndex === -1 ? 12 : 8,
                borderRadius: "50%",
                background: replayIndex === -1 ? "var(--los-ink)" : "var(--los-paper-warm)",
                border: `1px solid ${replayIndex === -1 ? "var(--los-ink)" : "var(--los-line)"}`,
                transition: "all 220ms var(--los-ease)",
              }}
            />
            <span
              style={{
                fontFamily: "var(--los-mono)",
                fontSize: 10,
                letterSpacing: "0.1em",
                color: replayIndex === -1 ? "var(--los-ink)" : "var(--los-ink-faint)",
              }}
            >
              now
            </span>
            <span
              style={{
                fontFamily: "var(--los-mono)",
                fontSize: 9,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--los-ink-faint)",
              }}
            >
              {domain.state}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
