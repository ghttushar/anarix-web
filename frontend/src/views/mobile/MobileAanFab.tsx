import { useLocation, useNavigate } from "react-router-dom";
import { AanGlyph } from "@/components/aan/AanGlyph";

/**
 * Floating Aan AI button — fixed bottom-right, hidden on /aan.
 */
export function MobileAanFab() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  if (pathname.startsWith("/aan")) return null;

  return (
    <button
      type="button"
      onClick={() => navigate("/aan")}
      aria-label="Open Aan AI"
      className="fixed z-40 flex items-center justify-center h-14 w-14 rounded-full bg-card border border-primary/60 shadow-lg active:scale-95 transition-transform"
      style={{
        right: "calc(env(safe-area-inset-right) + 16px)",
        bottom: "calc(env(safe-area-inset-bottom) + 16px)",
      }}
    >
      <span className="absolute inset-0 rounded-full aan-gradient opacity-[0.08]" aria-hidden />
      <AanGlyph state="idle" className="h-6 w-6 aan-gradient-text relative" />
    </button>
  );
}
