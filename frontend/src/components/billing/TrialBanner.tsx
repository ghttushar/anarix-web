import { useNavigate } from "react-router-dom";
import { Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTrial } from "@/contexts/TrialContext";
import { useBillingFlow } from "@/contexts/BillingFlowContext";

export function TrialBanner() {
  const navigate = useNavigate();
  const { trial, setTrial } = useTrial();
  const { billingFlowEnabled } = useBillingFlow();

  if (!billingFlowEnabled || trial !== "expired") return null;

  return (
    <div className="rounded-lg border border-primary/40 bg-primary/5 px-4 py-3 flex items-center gap-3">
      <div className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
        <Sparkles className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">Your free trial has ended.</p>
        <p className="text-xs text-muted-foreground">Upgrade your plan to keep syncing data and unlock advanced analytics.</p>
      </div>
      <Button size="sm" onClick={() => navigate("/website/pricing")}>Upgrade plan</Button>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => setTrial("paid")}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
