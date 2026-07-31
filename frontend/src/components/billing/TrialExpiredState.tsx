import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTrial } from "@/contexts/TrialContext";
import { useBillingFlow } from "@/contexts/BillingFlowContext";
import tacoIllustration from "@/assets/illustrations/taco.svg";

/**
 * Full-card replacement shown on the Profitability Dashboard when the
 * user's trial has expired (trial === "expired"). Intentionally hides all
 * underlying data so the moment reads as a calm pause, not a paywall.
 *
 * Tone exception per §10.5 — sanctioned trial/marketing surface.
 */
export function TrialExpiredState() {
  const { trial } = useTrial();
  const { billingFlowEnabled } = useBillingFlow();
  const navigate = useNavigate();

  if (!billingFlowEnabled || trial !== "expired") return null;

  return (
    <div className="rounded-lg border border-border bg-card p-12 flex flex-col items-center justify-center text-center min-h-[420px] relative overflow-hidden">
      {/* Soft brand halo behind illustration */}
      <div
        aria-hidden
        className="absolute left-1/2 top-24 -translate-x-1/2 h-56 w-56 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--primary) / 0.35) 0%, transparent 70%)",
        }}
      />

      <img
        src={tacoIllustration}
        alt=""
        className="h-28 w-auto mb-6 relative -rotate-12 drop-shadow-md"
        style={{ filter: "grayscale(0.15)" }}
      />

      <h2 className="font-heading text-2xl font-semibold text-foreground mb-2 relative">
        Your taco's gone cold.
      </h2>
      <p className="text-sm text-muted-foreground max-w-md relative mb-6">
        Your free trial just wrapped up — your data is safe, just paused.
        Warm it back up whenever you're ready.
      </p>

      <div className="flex items-center gap-3 relative">
        <Button size="lg" onClick={() => navigate("/website/pricing")}>
          Reheat my plan
        </Button>
        <Button
          size="lg"
          variant="ghost"
          onClick={() => navigate("/website/company/contact")}
        >
          Talk to us first
        </Button>
      </div>

      <p className="text-xs text-muted-foreground mt-6 relative">
        Nothing's been deleted. Pick up exactly where you left off.
      </p>
    </div>
  );
}
