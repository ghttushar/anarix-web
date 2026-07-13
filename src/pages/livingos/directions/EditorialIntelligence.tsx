import { DirectionShell } from "@/livingos/shell/DirectionShell";
import { scenario } from "@/livingos/scenario";

// Direction 6 — Editorial Intelligence.
// A daily edition. Masthead, lede with drop cap, call-out for the Proposal, briefs column.
// The only direction that scrolls.

const CREAM = "#f4efe4";
const INK = "#1a1712";
const RULE = "#2a251c";
const SPOT = "#a83b1c";

export default function EditorialIntelligence() {
  return (
    <DirectionShell slug="editorial-intelligence">
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflowY: "auto",
          background: CREAM,
          color: INK,
          fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
        }}
      >
        {/* Paper grain */}
        <div
          aria-hidden
          style={{
            position: "fixed",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(100,80,50,0.03) 0px, transparent 2px), radial-gradient(circle at 70% 60%, rgba(80,60,30,0.04) 0px, transparent 3px)",
            backgroundSize: "40px 40px, 70px 70px",
            pointerEvents: "none",
            mixBlendMode: "multiply",
          }}
        />

        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "48px 60px 120px", position: "relative" }}>
          {/* Masthead */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              paddingBottom: 14,
              borderBottom: `2px solid ${INK}`,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10.5,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: RULE,
            }}
          >
            <span>Living OS</span>
            <span>{scenario.when.weekday} Edition</span>
            <span>{scenario.when.date}</span>
            <span>{scenario.when.edition}</span>
          </div>

          {/* Nameplate */}
          <div
            style={{
              textAlign: "center",
              margin: "40px 0 8px",
              fontFamily: "'Playfair Display', 'Fraunces', serif",
              fontSize: "clamp(48px, 6.5vw, 96px)",
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: "-0.02em",
              color: INK,
            }}
          >
            The Morning
          </div>
          <div
            style={{
              textAlign: "center",
              fontFamily: "'Instrument Serif', serif",
              fontStyle: "italic",
              fontSize: 18,
              color: RULE,
              marginBottom: 16,
            }}
          >
            written for you by Aan · read in six minutes
          </div>
          <div style={{ borderTop: `1px solid ${RULE}`, borderBottom: `4px double ${RULE}`, height: 6, marginBottom: 48 }} />

          {/* Two-column layout: lede + briefs */}
          <div style={{ display: "grid", gridTemplateColumns: "2.2fr 1fr", gap: 56 }}>
            {/* Main column */}
            <div>
              {/* Kicker */}
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color: SPOT,
                  marginBottom: 12,
                }}
              >
                Front Page · Advertising
              </div>

              {/* Headline */}
              <h1
                style={{
                  fontFamily: "'Playfair Display', 'Fraunces', serif",
                  fontWeight: 700,
                  fontSize: "clamp(32px, 3.4vw, 46px)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.015em",
                  margin: "0 0 8px",
                  color: INK,
                }}
              >
                A Timing Problem, Not a Health Problem: Q4 Authority Runs Out Thursday
              </h1>
              <div
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: "italic",
                  fontSize: 18,
                  lineHeight: 1.35,
                  color: "#4a4235",
                  margin: "0 0 28px",
                  maxWidth: 620,
                }}
              >
                Roughly $186,000 of authorised spend will lapse without a move. Aan has one on the desk.
              </div>

              {/* Lede with drop cap */}
              <p
                style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: 17,
                  lineHeight: 1.65,
                  color: INK,
                  margin: 0,
                }}
              >
                <span
                  style={{
                    float: "left",
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 900,
                    fontSize: 88,
                    lineHeight: 0.85,
                    marginRight: 12,
                    marginTop: 6,
                    color: INK,
                  }}
                >
                  A
                </span>
                {scenario.lede.slice(1)}
              </p>

              {/* Callout — the Proposal */}
              <div
                style={{
                  margin: "40px 0 32px",
                  padding: "28px 32px",
                  background: "#eae2ce",
                  borderTop: `3px solid ${SPOT}`,
                  borderBottom: `1px solid ${RULE}`,
                }}
              >
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                    color: SPOT,
                    marginBottom: 10,
                  }}
                >
                  Aan Recommends
                </div>
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 24,
                    fontWeight: 700,
                    lineHeight: 1.2,
                    marginBottom: 12,
                    color: INK,
                  }}
                >
                  {scenario.proposal.title}
                </div>
                <p
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: 15,
                    lineHeight: 1.55,
                    color: "#3a3225",
                    margin: "0 0 18px",
                  }}
                >
                  {scenario.proposal.body}
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: 24,
                    paddingTop: 12,
                    borderTop: `1px solid ${RULE}`,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10.5,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: RULE,
                  }}
                >
                  <span><em style={{ color: "#8a7255", fontStyle: "normal" }}>Moved · </em>{scenario.proposal.est.spendMoved}</span>
                  <span><em style={{ color: "#8a7255", fontStyle: "normal" }}>Recovered · </em>{scenario.proposal.est.recovered}</span>
                  <span><em style={{ color: "#8a7255", fontStyle: "normal" }}>Risk · </em>{scenario.proposal.est.risk}</span>
                  <span style={{ marginLeft: "auto", color: SPOT }}>Commit →</span>
                </div>
              </div>

              {/* By-the-numbers — small subhead + tabular figures */}
              <div style={{ marginTop: 40 }}>
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 700,
                    fontSize: 22,
                    borderBottom: `1px solid ${RULE}`,
                    paddingBottom: 6,
                    marginBottom: 12,
                  }}
                >
                  By the numbers
                </div>
                {scenario.figures.map((f) => (
                  <div
                    key={f.label}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto auto",
                      gap: 20,
                      alignItems: "baseline",
                      padding: "10px 0",
                      borderBottom: `1px dotted ${RULE}`,
                      fontFamily: "'Fraunces', serif",
                    }}
                  >
                    <span style={{ color: INK, fontSize: 15 }}>
                      {f.label}
                      <span style={{ color: "#8a7255", fontSize: 12, marginLeft: 8, fontStyle: "italic" }}>{f.frame}</span>
                    </span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#8a7255" }}>
                      {f.delta}
                    </span>
                    <span style={{ fontSize: 20, fontWeight: 600, fontVariantNumeric: "tabular-nums", minWidth: 130, textAlign: "right", color: INK }}>
                      {f.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right rail — briefs column */}
            <aside
              style={{
                borderLeft: `1px solid ${RULE}`,
                paddingLeft: 32,
              }}
            >
              {/* At Work Now */}
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color: SPOT,
                  marginBottom: 12,
                }}
              >
                At Work Now
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  paddingBottom: 16,
                  borderBottom: `1px solid ${RULE}`,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: SPOT,
                    marginTop: 8,
                    flexShrink: 0,
                    boxShadow: `0 0 8px ${SPOT}`,
                  }}
                />
                <div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, lineHeight: 1.25 }}>
                    {scenario.agent.label}
                  </div>
                  <div style={{ fontSize: 12.5, color: "#4a4235", marginTop: 2, fontFamily: "'Fraunces', serif" }}>
                    {scenario.agent.scope} · started {scenario.agent.started} · ~{scenario.agent.etaMinutes}m remaining
                  </div>
                </div>
              </div>

              {/* Briefs — other Domains */}
              <div
                style={{
                  marginTop: 24,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color: SPOT,
                  marginBottom: 12,
                }}
              >
                Elsewhere · Firm
              </div>
              {scenario.domains
                .filter((d) => d.tone === "firm")
                .map((d) => (
                  <div key={d.key} style={{ padding: "10px 0", borderBottom: `1px dotted ${RULE}` }}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700 }}>{d.label}</div>
                    <div style={{ fontFamily: "'Fraunces', serif", fontSize: 13, color: "#4a4235", marginTop: 2 }}>{d.note}</div>
                  </div>
                ))}

              {/* Byline */}
              <div
                style={{
                  marginTop: 36,
                  paddingTop: 20,
                  borderTop: `1px solid ${RULE}`,
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: "italic",
                  fontSize: 14,
                  color: "#4a4235",
                  lineHeight: 1.6,
                }}
              >
                Compiled by <span style={{ color: SPOT }}>Aan</span> at 08:14. Next edition at close of day, unless the field breaks first.
              </div>

              {/* Reading progress marker */}
              <div
                style={{
                  marginTop: 28,
                  paddingTop: 20,
                  borderTop: `1px solid ${RULE}`,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: RULE,
                }}
              >
                Continued below · Features · Archive
              </div>
            </aside>
          </div>

          {/* Fold — the "scroll down for more" affordance */}
          <div
            style={{
              marginTop: 96,
              paddingTop: 32,
              borderTop: `4px double ${RULE}`,
              textAlign: "center",
              fontFamily: "'Instrument Serif', serif",
              fontStyle: "italic",
              fontSize: 20,
              color: "#4a4235",
            }}
          >
            Features section continues — the "why" behind the front page.
          </div>

          <div style={{ marginTop: 24, columns: 2 as unknown as number, columnGap: 40, fontFamily: "'Fraunces', serif", fontSize: 14, lineHeight: 1.65, color: INK }}>
            <p>
              The Q4 authority window opened on 12 September with $1.02M in flex spend earmarked for
              Sponsored Products and Sponsored Brands across US and CA. Advertising has drawn against
              it at a steady pace through October — enough to keep ROAS in a comfortable 4.4–4.8 band,
              but not aggressive enough to consume the whole envelope. That is the shape of the problem
              on the front page: not a Domain in distress, but authorised money that will simply expire.
            </p>
            <p>
              The reason Aan chose Sponsored Brands over further Sponsored Products spend is coverage
              rather than efficiency. Branded impression share has drifted from 71% to 64% since
              early September, quietly, without triggering any of the standard alerts. A three-day
              lift into Sponsored Brands defends that surface without touching the parts of the account
              that are already performing. If the recovery reads clean by Friday, Aan will suggest
              making the shift structural for Q1.
            </p>
          </div>
        </div>
      </div>
    </DirectionShell>
  );
}
