import { useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";

const FEATURES = [
  {
    title: "Advertising Intelligence",
    desc: "Control every campaign with precision. Bids, budgets, and pacing surfaced in one operational view.",
  },
  {
    title: "Profitability Dashboard",
    desc: "See contribution margin at SKU level. Reconcile fees, ad spend, and returns into a single live P&L.",
  },
  {
    title: "Rule Automation",
    desc: "Deploy automation without blind execution. Approve, schedule, and audit every action your rules take.",
  },
  {
    title: "Campaign Manager",
    desc: "Advanced table-first control over every keyword, ad group, and placement across marketplaces.",
  },
  {
    title: "Impact Analysis",
    desc: "See what actually moved performance. Attribute lift to bid changes, budget shifts, and creative swaps.",
  },
  {
    title: "Share of Voice",
    desc: "Track visibility across keywords and competitors. Spot ranking shifts before they hit revenue.",
  },
  {
    title: "Master Dashboard",
    desc: "Build your own data sandbox. Compose KPIs, channels, and cohorts into the view your team needs.",
  },
  {
    title: "Enterprise Reporting",
    desc: "Export-ready structured reporting. Audit trails, scheduled deliveries, and stakeholder-ready summaries.",
  },
  {
    title: "Aan Copilot",
    desc: "Our AI copilot for operators. Ask questions in plain English and apply suggested fixes in one click.",
  },
];

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/* ---------- Mockups ---------- */
const MockBars = () => (
  <div className="h-full w-full flex items-end justify-around gap-1.5 px-2">
    {[40, 65, 50, 80, 35, 70, 55, 90].map((h, i) => (
      <div
        key={i}
        className="flex-1 rounded-t-md"
        style={{
          height: `${h}%`,
          background: `linear-gradient(180deg, hsl(var(--periwinkle)) 0%, hsl(var(--periwinkle) / 0.5) 100%)`,
        }}
      />
    ))}
  </div>
);

const MockPnL = () => (
  <div className="h-full w-full flex flex-col gap-1.5 p-1">
    {["Revenue", "Ad Spend", "Fees", "Margin"].map((label, i) => (
      <div
        key={label}
        className="flex items-center justify-between px-3 py-2 rounded-lg bg-card border"
        style={{ borderColor: "hsl(var(--periwinkle) / 0.15)" }}
      >
        <span className="text-[11px] font-medium text-foreground">{label}</span>
        <div className="flex items-center gap-2">
          <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${[90, 60, 30, 75][i]}%`,
                background: "hsl(var(--periwinkle))",
              }}
            />
          </div>
          <span className="text-[10px] font-mono text-muted-foreground w-8 text-right">
            {["$2.4M", "$680K", "$210K", "$1.5M"][i]}
          </span>
        </div>
      </div>
    ))}
  </div>
);

const MockRules = () => (
  <div className="h-full w-full flex flex-col gap-1.5 p-1">
    {[
      { name: "Pause low-ROAS keywords", on: true },
      { name: "Bid up top SKUs", on: true },
      { name: "Budget reallocation", on: false },
      { name: "Stockout alerts", on: true },
    ].map((r) => (
      <div
        key={r.name}
        className="flex items-center justify-between px-3 py-2 rounded-lg bg-card border"
        style={{ borderColor: "hsl(var(--periwinkle) / 0.15)" }}
      >
        <span className="text-[11px] text-foreground">{r.name}</span>
        <div
          className="w-7 h-4 rounded-full flex items-center px-0.5"
          style={{
            background: r.on ? "hsl(var(--periwinkle))" : "hsl(var(--muted))",
            justifyContent: r.on ? "flex-end" : "flex-start",
          }}
        >
          <div className="w-3 h-3 rounded-full bg-white" />
        </div>
      </div>
    ))}
  </div>
);

const MockTable = () => (
  <div className="h-full w-full p-1">
    <div className="rounded-lg bg-card border overflow-hidden h-full" style={{ borderColor: "hsl(var(--periwinkle) / 0.15)" }}>
      <div className="grid grid-cols-3 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground border-b" style={{ borderColor: "hsl(var(--periwinkle) / 0.15)" }}>
        <span>Keyword</span><span className="text-right">Spend</span><span className="text-right">ROAS</span>
      </div>
      {[["nike air", "$2.1K", "4.8x"], ["wireless buds", "$1.4K", "3.2x"], ["yoga mat", "$890", "5.1x"], ["coffee maker", "$1.8K", "2.9x"]].map(([k, s, r], i) => (
        <div key={i} className="grid grid-cols-3 px-3 py-1.5 text-[10px] border-b last:border-0" style={{ borderColor: "hsl(var(--periwinkle) / 0.1)" }}>
          <span className="text-foreground truncate">{k}</span>
          <span className="text-right text-muted-foreground font-mono">{s}</span>
          <span className="text-right font-mono" style={{ color: "hsl(var(--periwinkle))" }}>{r}</span>
        </div>
      ))}
    </div>
  </div>
);

const MockImpact = () => (
  <div className="h-full w-full relative p-2">
    <svg viewBox="0 0 100 60" className="w-full h-full" preserveAspectRatio="none">
      <path d="M0,45 L20,40 L40,30 L60,32 L80,15 L100,10" stroke="hsl(var(--periwinkle))" strokeWidth="1.5" fill="none" />
      <path d="M0,45 L20,40 L40,30 L60,32 L80,15 L100,10 L100,60 L0,60 Z" fill="hsl(var(--periwinkle) / 0.15)" />
      {[[20, 40], [60, 32], [80, 15]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.5" fill="hsl(var(--periwinkle))" />
      ))}
    </svg>
  </div>
);

const MockSov = () => (
  <div className="h-full w-full flex flex-col gap-2 p-2">
    {[{ name: "Anarix", v: 78 }, { name: "Brand A", v: 52 }, { name: "Brand B", v: 34 }, { name: "Brand C", v: 22 }].map((b, i) => (
      <div key={b.name} className="flex items-center gap-2">
        <span className="text-[10px] w-14 text-foreground">{b.name}</span>
        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${b.v}%`, background: i === 0 ? "hsl(var(--periwinkle))" : "hsl(var(--periwinkle) / 0.4)" }} />
        </div>
        <span className="text-[10px] font-mono text-muted-foreground w-8 text-right">{b.v}%</span>
      </div>
    ))}
  </div>
);

const MockKpis = () => (
  <div className="h-full w-full grid grid-cols-2 gap-1.5 p-1">
    {[["GMV", "$4.2M"], ["ROAS", "5.1x"], ["ACOS", "18%"], ["CTR", "3.4%"]].map(([l, v]) => (
      <div key={l} className="rounded-lg bg-card border p-2 flex flex-col justify-between" style={{ borderColor: "hsl(var(--periwinkle) / 0.15)" }}>
        <span className="text-[9px] uppercase tracking-wider text-muted-foreground">{l}</span>
        <span className="text-base font-semibold text-foreground">{v}</span>
      </div>
    ))}
  </div>
);

const MockReport = () => (
  <div className="h-full w-full p-2 flex flex-col gap-1.5">
    <div className="rounded-md bg-card border px-3 py-1.5 text-[10px] text-foreground" style={{ borderColor: "hsl(var(--periwinkle) / 0.15)" }}>
      Q4_executive_summary.pdf
    </div>
    <div className="rounded-md bg-card border px-3 py-1.5 text-[10px] text-foreground" style={{ borderColor: "hsl(var(--periwinkle) / 0.15)" }}>
      weekly_performance.xlsx
    </div>
    <div className="rounded-md bg-card border px-3 py-1.5 text-[10px] text-foreground" style={{ borderColor: "hsl(var(--periwinkle) / 0.15)" }}>
      sku_margin_breakdown.csv
    </div>
    <div className="text-[9px] text-muted-foreground text-right pr-1">Scheduled · Mondays 8:00 AM</div>
  </div>
);

const MockChat = () => (
  <div className="h-full w-full flex flex-col gap-1.5 p-2">
    <div className="self-start rounded-2xl rounded-tl-sm bg-muted px-3 py-1.5 max-w-[85%]">
      <span className="text-[10px] text-foreground">Why did ROAS drop last week?</span>
    </div>
    <div className="self-end rounded-2xl rounded-tr-sm px-3 py-1.5 max-w-[85%]" style={{ background: "hsl(var(--periwinkle))" }}>
      <span className="text-[10px] text-white">Bid changes on 3 SKUs · suggested rollback</span>
    </div>
    <div className="self-end mt-auto flex items-center gap-2 rounded-full bg-card border px-3 py-1.5" style={{ borderColor: "hsl(var(--periwinkle) / 0.15)" }}>
      <span className="text-[10px] text-muted-foreground flex-1">Ask anything…</span>
      <div className="w-4 h-4 rounded-full" style={{ background: "hsl(var(--periwinkle))" }} />
    </div>
  </div>
);

const MOCKS = [MockBars, MockPnL, MockRules, MockTable, MockImpact, MockSov, MockKpis, MockReport, MockChat];

/* ---------- Card ---------- */
const Card = ({
  index,
  isActive,
  onClick,
  isTall,
  style,
}: {
  index: number;
  isActive: boolean;
  onClick: () => void;
  isTall: boolean;
  style?: React.CSSProperties;
}) => {
  const feat = FEATURES[index];
  const Mock = MOCKS[index];

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...style,
        backgroundColor: isActive ? "hsl(var(--periwinkle-light))" : "hsl(var(--card))",
        borderColor: isActive ? "hsl(var(--periwinkle) / 0.25)" : "hsl(var(--border) / 0.6)",
        transition: `background-color 280ms ${EASE}, border-color 280ms ${EASE}, box-shadow 280ms ${EASE}`,
      }}
      className={`group relative rounded-2xl border text-left p-6 flex flex-col overflow-hidden hover:shadow-medium ${
        isTall ? "row-span-2" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[17px] font-semibold text-foreground leading-snug max-w-[80%]">
          {feat.title}
        </h3>
        <span
          className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: isActive ? "hsl(var(--periwinkle))" : "hsl(var(--card))",
            border: isActive ? "1px solid hsl(var(--periwinkle))" : "1px solid hsl(var(--border))",
            color: isActive ? "#fff" : "hsl(var(--periwinkle))",
            transition: `background-color 280ms ${EASE}, color 280ms ${EASE}, border-color 280ms ${EASE}`,
          }}
        >
          {isActive ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </span>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed mt-3">{feat.desc}</p>

      {isTall && (
        <div
          className="mt-4 pt-4 border-t flex-1 min-h-[180px] animate-fade-in"
          style={{ borderColor: "hsl(var(--periwinkle) / 0.18)" }}
        >
          <Mock />
        </div>
      )}
    </button>
  );
};

/* ---------- Section ---------- */
const SolutionsSection = () => {
  const [activeIndex, setActiveIndex] = useState(1);

  // Desktop layout: 5 cols × 2 rows. Active card spans 2 rows in its column.
  // Active column = (activeIndex % 5) + 1 - keeps the card roughly where it was.
  const activeCol = (activeIndex % 5) + 1;
  const others = FEATURES.map((_, i) => i).filter((i) => i !== activeIndex);

  return (
    <section
      className="py-24 lg:py-36 px-6"
      style={{ backgroundColor: "hsl(245, 58%, 96%)" }}
    >
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block text-[11px] font-semibold tracking-[0.15em] uppercase px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[#f26e76] mb-5">
            Platform Capabilities
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[44px] font-semibold text-foreground leading-tight tracking-tight">
            The Anarix Operating System
          </h2>
          <p className="text-base lg:text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
            Advertising, analytics, automation, and intelligence - unified in one operational system.
          </p>
        </div>

        {/* Desktop: 5-col × 2-row grid with column-spanning active card */}
        <div
          className="hidden lg:grid gap-4"
          style={{
            gridTemplateColumns: "repeat(5, 1fr)",
            gridTemplateRows: "240px 240px",
            gridAutoFlow: "column",
          }}
        >
          {/* Active card placed explicitly */}
          <Card
            key={`active-${activeIndex}`}
            index={activeIndex}
            isActive
            isTall
            onClick={() => {}}
            style={{ gridColumn: activeCol, gridRow: "1 / span 2" }}
          />
          {/* Others auto-flow into remaining columns (top then bottom of each column) */}
          {others.map((i) => (
            <Card
              key={i}
              index={i}
              isActive={false}
              isTall={false}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>

        {/* Tablet: 2-col, expand inline */}
        <div className="hidden sm:grid lg:hidden grid-cols-2 gap-4 auto-rows-[240px]">
          {FEATURES.map((_, i) => (
            <Card
              key={i}
              index={i}
              isActive={activeIndex === i}
              isTall={activeIndex === i}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>

        {/* Mobile: stacked */}
        <div className="grid sm:hidden grid-cols-1 gap-3 auto-rows-min">
          {FEATURES.map((_, i) => (
            <Card
              key={i}
              index={i}
              isActive={activeIndex === i}
              isTall={activeIndex === i}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;
