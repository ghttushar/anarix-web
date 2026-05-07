import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import { AanGlyph } from "./AanGlyph";
import { useAan } from "./AanContext";
import { useFeatureToggle } from "@/contexts/FeatureToggleContext";

export function AskAanTooltip() {
  const { newFeaturesVisible } = useFeatureToggle();
  const { openCopilot, setPendingPrompt, setContext } = useAan();
  const location = useLocation();
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleMouseUp = useCallback(() => {
    if (!newFeaturesVisible) return;

    // Small delay to let selection finalize
    setTimeout(() => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();
      if (!text || text.length < 3 || text.length > 500) {
        setTooltip(null);
        return;
      }

      const range = selection?.getRangeAt(0);
      if (!range) return;

      const rect = range.getBoundingClientRect();
      setTooltip({
        text,
        x: rect.left + rect.width / 2,
        y: rect.top + window.scrollY - 8,
      });
    }, 10);
  }, [newFeaturesVisible]);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (tooltipRef.current && tooltipRef.current.contains(e.target as Node)) return;
    setTooltip(null);
  }, []);

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [handleMouseUp, handleMouseDown]);

  // Clear tooltip on navigation
  useEffect(() => {
    setTooltip(null);
  }, [location.pathname]);

  if (!tooltip) return null;

  const handleClick = () => {
    const pageName = location.pathname.split("/").filter(Boolean).join(" > ") || "Dashboard";
    setContext({ page: pageName });
    setPendingPrompt(`What does "${tooltip.text}" mean in this context?`);
    openCopilot();
    setTooltip(null);
    window.getSelection()?.removeAllRanges();
  };

  return (
    <div
      ref={tooltipRef}
      className="fixed z-[100] animate-in fade-in slide-in-from-bottom-1 duration-150"
      style={{
        left: `${tooltip.x}px`,
        top: `${tooltip.y}px`,
        transform: "translate(-50%, -100%)",
      }}
    >
      <button
        onClick={handleClick}
        className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-lg hover:opacity-90 transition-opacity cursor-pointer"
      >
        <AanGlyph className="h-3 w-3" />
        Ask Aan
      </button>
    </div>
  );
}
