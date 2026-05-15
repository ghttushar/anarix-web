import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/website/components/PageLayout";
import { HiddenRouteGuard } from "@/website/components/HiddenRouteGuard";
import { pricingMajors } from "@/website/data/pricingPlans";
import { useTrial } from "@/contexts/TrialContext";
import { toast } from "sonner";

const DowngradePlanInner = () => {
  const navigate = useNavigate();
  const { setTrial } = useTrial();

  // Show only lower tiers (everything except the most expensive in each section)
  const downgradeOptions = pricingMajors.flatMap((m) =>
    m.sections.flatMap((s) => s.plans.slice(0, -1).map((p) => ({ ...p, sectionLabel: `${m.label} · ${s.label}` })))
  );

  const handleDowngrade = (planName: string) => {
    setTrial("paid");
    try { sessionStorage.removeItem("anarix-cancel-from-app"); } catch {}
    toast.success(`Downgraded to ${planName}`);
    navigate("/profitability/dashboard");
  };

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <button
            onClick={() => navigate("/website/cancel-plan?from=app")}
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </button>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">Pick a smaller plan</h1>
          <p className="text-muted-foreground mb-10">Keep what you love about Anarix on a lighter plan. You can upgrade again any time.</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {downgradeOptions.map((p) => (
              <div key={p.id} className="rounded-xl border border-border bg-card p-5">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">{p.sectionLabel}</p>
                <h3 className="text-lg font-bold text-foreground">{p.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 min-h-[40px]">{p.description}</p>
                <p className="text-2xl font-bold text-foreground mb-4">
                  {p.monthly !== null ? `$${p.monthly}` : "Custom"}
                  {p.monthly !== null && <span className="text-sm text-muted-foreground font-normal">/mo</span>}
                </p>
                <ul className="space-y-1.5 mb-4">
                  {p.features.slice(0, 3).map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button size="sm" variant="outline" className="w-full rounded-pill" onClick={() => handleDowngrade(p.name)}>
                  Confirm Downgrade
                </Button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
};

const DowngradePlan = () => (
  <HiddenRouteGuard>
    <DowngradePlanInner />
  </HiddenRouteGuard>
);

export default DowngradePlan;
