import { useRef, useEffect, useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

/* ─── Color stops (HSL) for background interpolation ─── */
const COLOR_STOPS: [number, number, number][] = [
  [245, 58, 95],   // lavender
  [245, 58, 51],   // purple
  [320, 60, 50],   // magenta
  [170, 50, 40],   // teal
  [230, 35, 15],   // navy
];

function lerpHSL(a: [number, number, number], b: [number, number, number], t: number): string {
  return `hsl(${a[0] + (b[0] - a[0]) * t}, ${a[1] + (b[1] - a[1]) * t}%, ${a[2] + (b[2] - a[2]) * t}%)`;
}

function getBackgroundColor(progress: number): string {
  const seg = progress * (COLOR_STOPS.length - 1);
  const i = Math.min(Math.floor(seg), COLOR_STOPS.length - 2);
  return lerpHSL(COLOR_STOPS[i], COLOR_STOPS[i + 1], seg - i);
}

function isLightBg(progress: number): boolean {
  return progress < 0.2;
}

/* ─── Feature data ─── */
const FEATURES = [
  {
    title: "Unify Your Data.\nSee the Full Picture.",
    desc: "Campaign inefficiency surfaced in minutes. Profitability at SKU level. One dashboard that replaces five.",
  },
  {
    title: "AI-Powered Insights\nwith Aan",
    desc: "Rules applied with audit-safe previews. Your AI copilot that understands e-commerce complexity, not just data.",
  },
  {
    title: "Automate with\nConfidence",
    desc: "Rules that run with guardrails that protect. Full audit trails on every change, every time.",
  },
  {
    title: "Creative\nIntelligence",
    desc: "Understand which creatives drive conversion at the SKU level. Stop guessing, start scaling winners.",
  },
  {
    title: "One Platform for\nYour Whole Team",
    desc: "Stop chasing assets across teams. Everyone calls Anarix home - from analysts to creatives.",
  },
];

/* ═══════════════════════════════════════════════════
   ANIMATED MOCKUP COMPONENTS (CSS keyframes only)
   ═══════════════════════════════════════════════════ */

const DashboardMock = () => (
  <div className="w-full h-full bg-white rounded-2xl shadow-strong p-5 overflow-hidden relative">
    {/* Window chrome */}
    <div className="flex items-center gap-1.5 mb-4">
      <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
      <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
      <div className="ml-3 flex gap-2">
        <div className="px-3 py-1 text-[10px] font-semibold rounded-md bg-primary text-white fp-tab-active">Overview</div>
        <div className="px-3 py-1 text-[10px] font-medium rounded-md bg-gray-100 text-gray-500">Campaigns</div>
      </div>
    </div>
    {/* KPI cards */}
    <div className="grid grid-cols-3 gap-2 mb-3">
      {[
        { label: "Revenue", value: "$142.8K", color: "text-emerald-600" },
        { label: "ROAS", value: "4.2x", color: "text-primary text-[#f26e76]" },
        { label: "TACoS", value: "12.4%", color: "text-amber-600" },
      ].map((kpi, i) => (
        <div key={i} className="bg-gray-50 rounded-lg p-2.5 fp-kpi-pop" style={{ animationDelay: `${i * 0.3}s` }}>
          <div className="text-[9px] text-gray-400 uppercase tracking-wider">{kpi.label}</div>
          <div className={`text-sm font-bold ${kpi.color} fp-counter`} style={{ animationDelay: `${i * 0.4 + 0.5}s` }}>{kpi.value}</div>
        </div>
      ))}
    </div>
    {/* Bar chart */}
    <div className="flex items-end gap-1.5 h-24 px-1">
      {[65, 40, 80, 55, 90, 35, 70, 50, 85, 60, 75, 45].map((h, i) => (
        <div key={i} className="flex-1 rounded-t-sm fp-bar" style={{
          height: `${h}%`,
          backgroundColor: i === 4 ? 'hsl(245, 58%, 51%)' : i === 8 ? 'hsl(245, 58%, 51%)' : 'hsl(245, 58%, 85%)',
          animationDelay: `${i * 0.08}s`,
        }} />
      ))}
    </div>
    {/* Animated cursor */}
    <div className="absolute fp-cursor">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 1L6 14L8 8L14 6L1 1Z" fill="hsl(245,58%,51%)" stroke="white" strokeWidth="1"/></svg>
      <div className="fp-click-ripple" />
    </div>
  </div>
);

const AanChatMock = () => (
  <div className="w-full h-full bg-white rounded-2xl shadow-strong p-5 overflow-hidden flex flex-col">
    <div className="flex items-center gap-2 mb-4">
      <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">A</div>
      <span className="text-xs font-semibold text-gray-800">Aan AI</span>
      <div className="ml-auto flex gap-1 fp-status-dot"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /><span className="text-[9px] text-emerald-600">Online</span></div>
    </div>
    <div className="flex-1 space-y-2.5 overflow-hidden">
      {/* AI message 1 */}
      <div className="fp-chat-msg-left" style={{ animationDelay: "0s" }}>
        <div className="bg-gray-100 rounded-xl rounded-tl-sm p-2.5 text-[11px] text-gray-700 max-w-[85%]">
          Your ROAS on Campaign #42 dropped 18% this week. Shall I adjust bids?
        </div>
      </div>
      {/* User reply */}
      <div className="fp-chat-msg-right flex justify-end" style={{ animationDelay: "1.5s" }}>
        <div className="bg-primary text-white rounded-xl rounded-tr-sm p-2.5 text-[11px] max-w-[70%]">
          Yes, optimize for profitability.
        </div>
      </div>
      {/* Typing indicator */}
      <div className="fp-typing-indicator" style={{ animationDelay: "3s" }}>
        <div className="bg-gray-100 rounded-xl rounded-tl-sm p-2.5 inline-flex gap-1 items-center">
          <span className="fp-dot" /><span className="fp-dot" style={{ animationDelay: "0.15s" }} /><span className="fp-dot" style={{ animationDelay: "0.3s" }} />
        </div>
      </div>
      {/* AI message 2 */}
      <div className="fp-chat-msg-left" style={{ animationDelay: "4.5s" }}>
        <div className="bg-gray-100 rounded-xl rounded-tl-sm p-2.5 text-[11px] text-gray-700 max-w-[90%]">
          Done. Adjusted 12 keywords. Projected TACoS improvement: <span className="font-bold text-emerald-600">8%</span>.
        </div>
      </div>
      {/* User 2 */}
      <div className="fp-chat-msg-right flex justify-end" style={{ animationDelay: "6s" }}>
        <div className="bg-primary text-white rounded-xl rounded-tr-sm p-2.5 text-[11px] max-w-[70%]">
          Show me the bid changes.
        </div>
      </div>
    </div>
  </div>
);

const RuleBuilderMock = () => (
  <div className="w-full h-full bg-white rounded-2xl shadow-strong p-5 overflow-hidden">
    <div className="flex items-center justify-between mb-4">
      <span className="text-xs font-semibold text-gray-800">Rule Builder</span>
      <div className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] rounded-full font-medium">Active</div>
    </div>
    <div className="space-y-2">
      {/* Condition rows */}
      {[
        { label: "If ROAS < 2.0", icon: "📉" },
        { label: "Then reduce bid 10%", icon: "🔽" },
        { label: "If ACoS > 35%", icon: "⚠️" },
        { label: "Then pause keyword", icon: "⏸️" },
      ].map((rule, i) => (
        <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2 fp-rule-row" style={{ animationDelay: `${i * 0.6}s` }}>
          <span className="text-xs">{rule.icon}</span>
          <span className="text-[11px] text-gray-700 flex-1">{rule.label}</span>
          <div className={`w-7 h-4 rounded-full relative fp-toggle ${i < 2 ? 'bg-primary' : 'bg-gray-300'}`} style={{ animationDelay: `${i * 0.6 + 0.3}s` }}>
            <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-all ${i < 2 ? 'left-3.5' : 'left-0.5'}`} />
          </div>
        </div>
      ))}
    </div>
    {/* Run button */}
    <div className="mt-3 flex items-center gap-2">
      <div className="fp-run-btn flex-1 bg-primary text-white text-[11px] font-semibold rounded-lg py-2 text-center">
        Preview Changes
      </div>
    </div>
    {/* Audit log */}
    <div className="mt-2 fp-audit-row">
      <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg p-1.5 text-[9px] text-gray-400">
        <span>✓</span><span>12 keywords adjusted · 2 paused · Logged at 14:32</span>
      </div>
    </div>
  </div>
);

const CreativeGridMock = () => (
  <div className="w-full h-full bg-white rounded-2xl shadow-strong p-5 overflow-hidden">
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs font-semibold text-gray-800">Creative Performance</span>
      <span className="text-[9px] text-gray-400">Last 7 days</span>
    </div>
    <div className="grid grid-cols-2 gap-2">
      {[
        { perf: 92, label: "Hero Banner A", badge: true },
        { perf: 67, label: "Lifestyle Shot", badge: false },
        { perf: 81, label: "Product Close-up", badge: false },
        { perf: 45, label: "UGC Video Still", badge: false },
      ].map((card, i) => (
        <div key={i} className={`relative bg-gray-100 rounded-xl p-3 fp-creative-card ${card.badge ? 'ring-2 ring-primary' : ''}`} style={{ animationDelay: `${i * 0.3}s` }}>
          <div className="h-12 bg-gray-200 rounded-lg mb-2 fp-img-shimmer" style={{ animationDelay: `${i * 0.2}s` }} />
          <div className="text-[10px] text-gray-600 mb-1">{card.label}</div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full rounded-full fp-perf-bar" style={{
              width: `${card.perf}%`,
              backgroundColor: card.perf > 80 ? 'hsl(245,58%,51%)' : card.perf > 60 ? 'hsl(245,58%,70%)' : 'hsl(228,10%,70%)',
              animationDelay: `${i * 0.3 + 0.5}s`,
            }} />
          </div>
          {card.badge && (
            <div className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold fp-badge-pop">
              ★ Top
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

const TeamDashboardMock = () => (
  <div className="w-full h-full bg-white rounded-2xl shadow-strong p-5 overflow-hidden relative">
    <div className="flex items-center justify-between mb-4">
      <span className="text-xs font-semibold text-gray-800">Team Workspace</span>
      <div className="relative fp-bell">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-[7px] text-white flex items-center justify-center font-bold fp-notif-badge">3</div>
      </div>
    </div>
    {/* Avatars row */}
    <div className="flex -space-x-2 mb-4">
      {["S", "J", "M", "A", "R"].map((letter, i) => (
        <div key={i} className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white fp-avatar-pop" style={{
          backgroundColor: ['hsl(245,58%,51%)', 'hsl(320,60%,50%)', 'hsl(170,50%,40%)', 'hsl(30,80%,55%)', 'hsl(200,60%,50%)'][i],
          animationDelay: `${i * 0.25}s`,
        }}>
          {letter}
        </div>
      ))}
      <div className="w-7 h-7 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[9px] text-gray-500 font-medium fp-avatar-pop" style={{ animationDelay: "1.5s" }}>
        +4
      </div>
    </div>
    {/* Activity feed */}
    <div className="space-y-2">
      {[
        { who: "Sarah", action: "updated Campaign #42 bids", time: "2m ago" },
        { who: "Jordan", action: "added 3 new creatives", time: "8m ago" },
        { who: "Maya", action: "exported weekly report", time: "15m ago" },
      ].map((item, i) => (
        <div key={i} className="flex items-start gap-2 fp-activity-row" style={{ animationDelay: `${i * 0.5 + 1}s` }}>
          <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-[8px] text-primary text-[#f26e76] font-bold mt-0.5">{item.who[0]}</div>
          <div>
            <div className="text-[10px] text-gray-700"><span className="font-semibold">{item.who}</span> {item.action}</div>
            <div className="text-[8px] text-gray-400">{item.time}</div>
          </div>
        </div>
      ))}
    </div>
    {/* Floating cursors */}
    <div className="absolute fp-cursor-label" style={{ top: "40%", left: "65%" }}>
      <div className="bg-primary text-white text-[8px] px-1.5 py-0.5 rounded-full shadow-md">Sarah</div>
    </div>
    <div className="absolute fp-cursor-label-2" style={{ top: "60%", left: "30%" }}>
      <div className="bg-pink-500 text-white text-[8px] px-1.5 py-0.5 rounded-full shadow-md">Jordan</div>
    </div>
  </div>
);

const MOCKUPS = [DashboardMock, AanChatMock, RuleBuilderMock, CreativeGridMock, TeamDashboardMock];

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */

const FeaturePanels = () => {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const graphicRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bgRef = useRef<HTMLDivElement>(null);
  const rafId = useRef(0);

  const updateStyles = useCallback(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    if (!section || !bg) return;

    const rect = section.getBoundingClientRect();
    const sectionH = section.offsetHeight;
    const viewH = window.innerHeight;
    // progress 0→1 as we scroll through the section
    const raw = -rect.top / (sectionH - viewH);
    const progress = Math.max(0, Math.min(1, raw));

    // Background color
    bg.style.backgroundColor = getBackgroundColor(progress);

    // Which card is active
    const cardCount = FEATURES.length;
    const activeFloat = progress * cardCount;
    const activeIndex = Math.min(Math.floor(activeFloat), cardCount - 1);

    // Text/graphic crossfade
    const light = isLightBg(progress);
    textRefs.current.forEach((el, i) => {
      if (!el) return;
      const dist = activeFloat - i;
      let opacity = 0;
      let translateY = 40;
      if (dist >= 0 && dist < 1) {
        opacity = dist < 0.2 ? dist / 0.2 : dist > 0.8 ? (1 - dist) / 0.2 : 1;
        translateY = (0.5 - Math.min(dist, 0.5)) * 60;
      }
      el.style.opacity = String(opacity);
      el.style.transform = `translateY(${translateY}px)`;
      el.style.color = light ? 'hsl(230,25%,10%)' : 'white';
    });

    graphicRefs.current.forEach((el, i) => {
      if (!el) return;
      const isActive = i === activeIndex;
      el.style.opacity = isActive ? "1" : "0";
      el.style.transform = isActive ? "scale(1)" : "scale(0.95)";
    });
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const onScroll = () => {
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(updateStyles);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId.current);
    };
  }, [updateStyles, isMobile]);

  /* ── Mobile: simple stacked layout ── */
  if (isMobile) {
    return (
      <section className="py-12 space-y-10 px-4">
        {FEATURES.map((f, i) => {
          const Graphic = MOCKUPS[i];
          return (
            <div key={i} className="rounded-2xl p-6" style={{ backgroundColor: getBackgroundColor(i / (FEATURES.length - 1)) }}>
              <h2 className={`text-2xl font-bold mb-3 whitespace-pre-line ${i >= 3 ? 'text-white' : 'text-foreground'}`}>{f.title}</h2>
              <p className={`text-sm mb-5 ${i >= 3 ? 'text-white/80' : 'text-muted-foreground'}`}>{f.desc}</p>
              <div className="h-64"><Graphic /></div>
            </div>
          );
        })}
      </section>
    );
  }

  /* ── Desktop: sticky scroll ── */
  return (
    <>
      <section
        ref={sectionRef}
        className="relative"
        style={{ height: `${FEATURES.length * 100}vh` }}
      >
        {/* Background layer */}
        <div
          ref={bgRef}
          className="absolute inset-0 will-change-[background-color]"
          style={{ backgroundColor: getBackgroundColor(0) }}
        />

        {/* Sticky container */}
        <div
          ref={stickyRef}
          className="sticky top-0 h-screen flex items-center justify-center z-10"
        >
          <div className="w-full max-w-6xl mx-auto px-6 lg:px-10 grid grid-cols-2 gap-12 items-center">
            {/* Left: text stack */}
            <div className="relative h-[300px]">
              {FEATURES.map((f, i) => (
                <div
                  key={i}
                  ref={(el) => { textRefs.current[i] = el; }}
                  className="absolute inset-0 flex flex-col justify-center will-change-[opacity,transform]"
                  style={{ opacity: 0 }}
                >
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 whitespace-pre-line leading-tight">
                    {f.title}
                  </h2>
                  <p className="text-lg max-w-lg leading-relaxed opacity-80">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Right: graphic stack */}
            <div className="relative h-[400px]">
              {MOCKUPS.map((Graphic, i) => (
                <div
                  key={i}
                  ref={(el) => { graphicRefs.current[i] = el; }}
                  className="absolute inset-0 will-change-[opacity,transform] transition-none"
                  style={{ opacity: 0, transform: "scale(0.95)" }}
                >
                  <Graphic />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CSS animations for mockup micro-interactions */}
      <style>{`
        /* ── Dashboard ── */
        .fp-bar { animation: fpBarGrow 2s cubic-bezier(0.22,1,0.36,1) infinite alternate; }
        @keyframes fpBarGrow { 0% { transform: scaleY(0.3); } 100% { transform: scaleY(1); } }
        .fp-bar { transform-origin: bottom; }

        .fp-kpi-pop { animation: fpKpiPop 3s ease infinite; }
        @keyframes fpKpiPop { 0%,100% { transform: scale(1); } 50% { transform: scale(1.04); } }

        .fp-counter { animation: fpFadeNum 4s ease infinite; }
        @keyframes fpFadeNum { 0%,100% { opacity: 1; } 50% { opacity: 0.7; } }

        .fp-cursor { animation: fpCursorMove 5s cubic-bezier(0.22,1,0.36,1) infinite; top: 45%; left: 30%; }
        @keyframes fpCursorMove { 0%,100% { transform: translate(0,0); } 25% { transform: translate(120px, -20px); } 50% { transform: translate(80px, 50px); } 75% { transform: translate(-30px, 30px); } }

        .fp-click-ripple { position: absolute; top: 6px; left: 6px; width: 16px; height: 16px; border-radius: 50%; border: 1.5px solid hsl(245,58%,51%); animation: fpRipple 5s ease infinite; }
        @keyframes fpRipple { 0%,20%,40%,60%,80%,100% { transform: scale(0); opacity: 0; } 25%,65% { transform: scale(2); opacity: 0.4; } 30%,70% { transform: scale(3); opacity: 0; } }

        .fp-tab-active { animation: fpTabSlide 4s ease infinite; }
        @keyframes fpTabSlide { 0%,100% { box-shadow: 0 2px 0 0 white; } 50% { box-shadow: 0 2px 0 0 hsl(245,58%,51%); } }

        /* ── Aan Chat ── */
        .fp-chat-msg-left { opacity: 0; animation: fpSlideLeft 8s ease infinite; }
        @keyframes fpSlideLeft { 0%,5% { opacity: 0; transform: translateX(-20px); } 10%,85% { opacity: 1; transform: translateX(0); } 90%,100% { opacity: 0; } }

        .fp-chat-msg-right { opacity: 0; animation: fpSlideRight 8s ease infinite; }
        @keyframes fpSlideRight { 0%,15% { opacity: 0; transform: translateX(20px); } 22%,85% { opacity: 1; transform: translateX(0); } 90%,100% { opacity: 0; } }

        .fp-typing-indicator { opacity: 0; animation: fpTyping 8s ease infinite; }
        @keyframes fpTyping { 0%,30% { opacity: 0; } 35%,50% { opacity: 1; } 55%,100% { opacity: 0; } }

        .fp-dot { display: block; width: 4px; height: 4px; border-radius: 50%; background: hsl(228,10%,60%); animation: fpBounce 1.2s ease infinite; }
        @keyframes fpBounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }

        /* ── Rule Builder ── */
        .fp-rule-row { opacity: 0; animation: fpRuleSlide 6s cubic-bezier(0.22,1,0.36,1) infinite; }
        @keyframes fpRuleSlide { 0%,5% { opacity: 0; transform: translateX(-16px); } 15%,80% { opacity: 1; transform: translateX(0); } 90%,100% { opacity: 0; } }

        .fp-toggle { animation: fpToggleFlip 6s ease infinite; }
        @keyframes fpToggleFlip { 0%,100% { opacity: 0.8; } 50% { opacity: 1; } }

        .fp-run-btn { animation: fpRunPulse 3s ease infinite; }
        @keyframes fpRunPulse { 0%,100% { box-shadow: 0 0 0 0 hsl(245,58%,51%,0.3); } 50% { box-shadow: 0 0 0 8px hsl(245,58%,51%,0); } }

        .fp-audit-row { opacity: 0; animation: fpAuditFade 6s ease infinite; }
        @keyframes fpAuditFade { 0%,60% { opacity: 0; transform: translateY(8px); } 70%,90% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; } }

        /* ── Creative Grid ── */
        .fp-creative-card { animation: fpCardPop 4s ease infinite; }
        @keyframes fpCardPop { 0%,100% { transform: scale(1); } 50% { transform: scale(1.02); } }

        .fp-perf-bar { animation: fpBarFill 3s cubic-bezier(0.22,1,0.36,1) infinite alternate; transform-origin: left; }
        @keyframes fpBarFill { 0% { transform: scaleX(0); } 100% { transform: scaleX(1); } }

        .fp-badge-pop { animation: fpBadge 4s ease infinite; }
        @keyframes fpBadge { 0%,40% { transform: scale(0); } 50% { transform: scale(1.2); } 55%,100% { transform: scale(1); } }

        .fp-img-shimmer { animation: fpShimmer 2s ease infinite; }
        @keyframes fpShimmer { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }

        /* ── Team Dashboard ── */
        .fp-avatar-pop { opacity: 0; animation: fpAvatarPop 5s cubic-bezier(0.22,1,0.36,1) infinite; }
        @keyframes fpAvatarPop { 0%,5% { opacity: 0; transform: scale(0.5); } 15%,85% { opacity: 1; transform: scale(1); } 90%,100% { opacity: 0; transform: scale(0.5); } }

        .fp-activity-row { opacity: 0; animation: fpActivitySlide 6s ease infinite; }
        @keyframes fpActivitySlide { 0%,10% { opacity: 0; transform: translateY(10px); } 20%,80% { opacity: 1; transform: translateY(0); } 90%,100% { opacity: 0; } }

        .fp-cursor-label { animation: fpCursorFloat1 6s cubic-bezier(0.22,1,0.36,1) infinite; }
        @keyframes fpCursorFloat1 { 0%,100% { transform: translate(0,0); } 33% { transform: translate(20px, -15px); } 66% { transform: translate(-10px, 10px); } }

        .fp-cursor-label-2 { animation: fpCursorFloat2 7s cubic-bezier(0.22,1,0.36,1) infinite; }
        @keyframes fpCursorFloat2 { 0%,100% { transform: translate(0,0); } 33% { transform: translate(-15px, 20px); } 66% { transform: translate(25px, -10px); } }

        .fp-notif-badge { animation: fpNotifBounce 3s ease infinite; }
        @keyframes fpNotifBounce { 0%,100% { transform: scale(1); } 15% { transform: scale(1.3); } 30% { transform: scale(1); } }

        .fp-bell { animation: fpBellShake 4s ease infinite; }
        @keyframes fpBellShake { 0%,100% { transform: rotate(0); } 10% { transform: rotate(12deg); } 20% { transform: rotate(-10deg); } 30% { transform: rotate(6deg); } 40% { transform: rotate(0); } }
      `}</style>
    </>
  );
};

export default FeaturePanels;
