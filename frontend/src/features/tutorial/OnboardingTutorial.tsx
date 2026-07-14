import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, SkipForward, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTutorial } from "./TutorialContext";
import { tutorialSteps, type TutorialStep } from "./steps";
import { useActivePanel } from "@/contexts/ActivePanelContext";
import { useAan } from "@/components/aan/AanContext";

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const PAD = 8;

function useTargetRect(target: string | null) {
  const [rect, setRect] = useState<Rect | null>(null);

  useLayoutEffect(() => {
    if (!target) {
      setRect(null);
      return;
    }
    let raf: number;
    const measure = () => {
      const el = document.querySelector(target) as HTMLElement | null;
      if (!el) {
        setRect(null);
        return;
      }
      const r = el.getBoundingClientRect();
      setRect({
        top: r.top - PAD,
        left: r.left - PAD,
        width: r.width + PAD * 2,
        height: r.height + PAD * 2,
      });
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    };
    measure();
    const obs = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    });
    const el = document.querySelector(target) as HTMLElement | null;
    if (el) obs.observe(el);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    const t = setInterval(measure, 400); // catches late-mount panels
    return () => {
      cancelAnimationFrame(raf);
      obs.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
      clearInterval(t);
    };
  }, [target]);

  return rect;
}

function computeCardPosition(
  rect: Rect | null,
  side: TutorialStep["side"] = "bottom"
): React.CSSProperties {
  const CARD_W = 360;
  const CARD_H = 200;
  const MARGIN = 16;
  if (!rect || side === "center") {
    return {
      left: `calc(50% - ${CARD_W / 2}px)`,
      top: `calc(50% - ${CARD_H / 2}px)`,
    };
  }
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let left = rect.left + rect.width / 2 - CARD_W / 2;
  let top = rect.top + rect.height + MARGIN;
  if (side === "top") top = rect.top - CARD_H - MARGIN;
  if (side === "left") {
    left = rect.left - CARD_W - MARGIN;
    top = rect.top + rect.height / 2 - CARD_H / 2;
  }
  if (side === "right") {
    left = rect.left + rect.width + MARGIN;
    top = rect.top + rect.height / 2 - CARD_H / 2;
  }
  left = Math.max(16, Math.min(left, vw - CARD_W - 16));
  top = Math.max(16, Math.min(top, vh - CARD_H - 16));
  return { left, top };
}

export function OnboardingTutorial() {
  const { active, state, next, prev, skip, complete } = useTutorial();
  const navigate = useNavigate();
  const { setDataPanel, closeDataPanel } = useActivePanel();
  const { openCopilot, closePanel } = useAan();

  const step = tutorialSteps[state.currentStep];
  const isLast = state.currentStep === tutorialSteps.length - 1;
  const isFirst = state.currentStep === 0;

  // Side-effects per step: navigate & open dependent panels.
  useEffect(() => {
    if (!active || !step) return;
    if (step.navigateTo && window.location.pathname !== step.navigateTo) {
      navigate(step.navigateTo);
    }
    if (step.panel === "insights") setDataPanel("insights");
    else if (step.panel === "notifications") setDataPanel("notifications");
    else if (step.panel === "aan") openCopilot();
    return () => {
      if (step.panel === "insights" || step.panel === "notifications") closeDataPanel();
      if (step.panel === "aan") closePanel();
    };
  }, [active, step, navigate, setDataPanel, closeDataPanel, openCopilot, closePanel]);

  // Lock background scroll while active.
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);

  // Keyboard navigation
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        skip();
      } else if (e.key === "ArrowRight" || e.key === "Enter") {
        e.preventDefault();
        if (isLast) complete();
        else next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (!isFirst) prev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, isLast, isFirst, next, prev, skip, complete]);

  const rect = useTargetRect(active ? step?.target ?? null : null);
  const cardPos = useMemo(
    () => computeCardPosition(rect, step?.side),
    [rect, step?.side]
  );

  if (!active || !step) return null;

  const progressPct = ((state.currentStep + 1) / tutorialSteps.length) * 100;

  return createPortal(
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Spotlight overlay using SVG mask */}
      <svg className="absolute inset-0 w-full h-full pointer-events-auto" aria-hidden="true">
        <defs>
          <mask id="tour-mask">
            <rect width="100%" height="100%" fill="white" />
            {rect && (
              <rect
                x={rect.left}
                y={rect.top}
                width={rect.width}
                height={rect.height}
                rx={12}
                ry={12}
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="hsl(var(--foreground))"
          fillOpacity={0.55}
          mask="url(#tour-mask)"
          style={{ transition: "all 220ms cubic-bezier(0.2,0,0,1)" }}
        />
      </svg>

      {/* Halo ring */}
      {rect && (
        <div
          className="absolute rounded-xl pointer-events-none"
          style={{
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            boxShadow:
              "0 0 0 2px hsl(var(--primary) / 0.6), 0 0 48px hsl(var(--primary) / 0.35)",
            transition: "all 220ms cubic-bezier(0.2,0,0,1)",
          }}
        />
      )}

      {/* Tooltip card */}
      <div
        key={step.id}
        className={cn(
          "absolute pointer-events-auto w-[360px]",
          "bg-card border border-primary/40 rounded-xl shadow-2xl",
          "animate-in fade-in zoom-in-95 duration-220"
        )}
        style={{ ...cardPos, transition: "left 220ms, top 220ms" }}
      >
        <div className="p-5">
          <div className="flex items-center gap-1.5 mb-3">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-[10px] font-semibold tracking-wider text-primary uppercase">
              Step {state.currentStep + 1} of {tutorialSteps.length}
            </span>
          </div>
          <h3 className="font-heading text-lg font-semibold text-foreground mb-1.5">
            {step.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{step.body}</p>
        </div>

        <div className="h-1 w-full bg-muted overflow-hidden rounded-b-xl">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={skip}
            className="text-xs text-muted-foreground"
          >
            <SkipForward className="h-3 w-3 mr-1" />
            Skip tour
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prev}
              disabled={isFirst}
              className="h-8"
            >
              <ChevronLeft className="h-3.5 w-3.5 mr-0.5" />
              Back
            </Button>
            <Button
              size="sm"
              onClick={isLast ? complete : next}
              className="h-8"
            >
              {isLast ? "Finish" : "Next"}
              {!isLast && <ChevronRight className="h-3.5 w-3.5 ml-0.5" />}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
