import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import PageLayout from "@/website/components/PageLayout";
import { HiddenRouteGuard } from "@/website/components/HiddenRouteGuard";
import { useTrial } from "@/contexts/TrialContext";

const CancelPlanInner = () => {
  const navigate = useNavigate();
  const { setTrial } = useTrial();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleConfirmCancel = () => {
    setTrial("expired");
    try { sessionStorage.removeItem("anarix-cancel-from-app"); } catch {}
    setConfirmOpen(false);
    navigate("/profitability/dashboard");
  };

  const handleDowngrade = () => navigate("/website/downgrade-plan?from=app");

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 text-center">Before you go…</h1>
          <p className="text-muted-foreground text-center mb-10">
            We'd hate to see you leave. Pick what works for your team — or just talk to us.
          </p>

          <div className="space-y-3 mb-10">
            <button
              onClick={handleDowngrade}
              className="w-full text-left rounded-xl border border-border bg-card p-5 flex items-center gap-4 hover:border-primary/40 transition-colors"
            >
              <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <ArrowDown className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground">Downgrade plan</p>
                <p className="text-sm text-muted-foreground">Keep using Anarix on a smaller plan instead of canceling.</p>
              </div>
            </button>

            <button
              onClick={() => setConfirmOpen(true)}
              className="w-full text-left rounded-xl border border-border bg-card p-5 flex items-center gap-4 hover:border-destructive/40 transition-colors"
            >
              <div className="h-10 w-10 rounded-md bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
                <X className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground">Cancel plan</p>
                <p className="text-sm text-muted-foreground">Cancel immediately. You'll keep access until the end of your billing period.</p>
              </div>
            </button>
          </div>

          <div className="rounded-xl border border-border bg-muted/30 p-5 flex items-start gap-3">
            <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Didn't find what you were looking for?</p>
              <p className="text-sm text-muted-foreground mb-3">Need a custom solution? We'll build a plan around your team.</p>
              <Button size="sm" variant="outline" onClick={() => navigate("/website/company/contact")}>
                Contact us
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel your plan?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            You'll keep access until the end of your billing period. After that, syncing and advanced analytics will pause until you re-subscribe.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>Keep my plan</Button>
            <Button variant="destructive" onClick={handleConfirmCancel}>Cancel plan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

const CancelPlan = () => (
  <HiddenRouteGuard>
    <CancelPlanInner />
  </HiddenRouteGuard>
);

export default CancelPlan;
