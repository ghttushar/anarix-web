import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, ArrowRight, MessageSquare, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageLayout from "@/website/components/PageLayout";
import { pricingMajors, PricingMode, PricingPlan } from "@/website/data/pricingPlans";
import { useTrial } from "@/contexts/TrialContext";
import { useBillingFlow } from "@/contexts/BillingFlowContext";

const Pricing = () => {
  const navigate = useNavigate();
  const { setTrial } = useTrial();
  const { billingFlowEnabled } = useBillingFlow();

  const [mode, setMode] = useState<PricingMode>("yearly");
  const [majorId, setMajorId] = useState(pricingMajors[0].id);
  const major = pricingMajors.find((m) => m.id === majorId)!;

  const [sectionId, setSectionId] = useState(major.sections[0].id);
  const section = major.sections.find((s) => s.id === sectionId) ?? major.sections[0];

  const handleMajorChange = (id: typeof major.id) => {
    setMajorId(id);
    const m = pricingMajors.find((x) => x.id === id)!;
    setSectionId(m.sections[0].id);
  };

  const handleChoosePlan = (_plan: PricingPlan) => {
    if (billingFlowEnabled) setTrial("paid");
    navigate("/profitability/dashboard");
  };

  const formatPrice = (plan: PricingPlan) => {
    const v = mode === "yearly" ? plan.yearly : plan.monthly;
    if (v === null) return "Custom";
    return `$${v.toLocaleString()}`;
  };

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Pricing built around <span className="text-gradient-primary">how you operate</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Pick a track. Switch any time. No marketplace fluff — just plans that map to real operators.
          </p>
        </motion.div>

        {/* Two persistent helper strips */}
        <div className="grid sm:grid-cols-2 gap-3 mb-10">
          <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">Try all features free for a month</p>
              <p className="text-xs text-muted-foreground">No credit card. Cancel anytime.</p>
            </div>
            <Button size="sm" variant="outline" onClick={() => navigate("/login")}>
              Start Free Trial
            </Button>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-md bg-muted text-foreground flex items-center justify-center shrink-0">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">Need a custom plan for your agency?</p>
              <p className="text-xs text-muted-foreground">Volume discounts and white-label available.</p>
            </div>
            <Button size="sm" variant="outline" onClick={() => navigate("/website/company/contact")}>
              Contact Us
            </Button>
          </div>
        </div>

        {/* Major tabs (Advertising | Profitability) */}
        <div className="flex items-center justify-center mb-6">
          <div className="inline-flex items-center gap-1 p-1 rounded-pill bg-muted border border-border">
            {pricingMajors.map((m) => (
              <button
                key={m.id}
                onClick={() => handleMajorChange(m.id)}
                className={`px-5 py-2 rounded-pill text-sm font-medium transition-all ${
                  majorId === m.id
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
        <p className="text-center text-sm text-muted-foreground mb-6">{major.blurb}</p>

        {/* Sub-tabs (only if multiple sections) */}
        {major.sections.length > 1 && (
          <div className="flex items-center justify-center mb-6">
            <div className="inline-flex items-center gap-1 border-b border-border">
              {major.sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSectionId(s.id)}
                  className={`px-4 py-2 text-sm font-medium transition-all border-b-2 -mb-px ${
                    sectionId === s.id
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Monthly/Annually toggle */}
        <div className="flex items-center justify-center mb-10">
          <div className="inline-flex items-center gap-1 p-1 rounded-pill bg-muted border border-border">
            <button
              onClick={() => setMode("monthly")}
              className={`px-4 py-1.5 rounded-pill text-sm font-medium transition-all ${
                mode === "monthly" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setMode("yearly")}
              className={`px-4 py-1.5 rounded-pill text-sm font-medium transition-all ${
                mode === "yearly" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
              }`}
            >
              Yearly <span className="text-primary text-xs ml-1">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Compact plan cards */}
        <div
          className={`grid gap-4 mb-16 ${
            section.plans.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"
          }`}
        >
          {section.plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i, duration: 0.35 }}
              className={`relative rounded-2xl border p-6 bg-card transition-all duration-200 hover:-translate-y-0.5 ${
                plan.highlight ? "border-primary ring-1 ring-primary/30 shadow-strong" : "border-border"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-pill bg-primary text-primary-foreground text-[11px] font-medium">
                  Most Popular
                </div>
              )}
              <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-5 min-h-[40px]">{plan.description}</p>
              <div className="mb-5">
                <span className="text-3xl font-bold text-foreground">{formatPrice(plan)}</span>
                {plan.monthly !== null && <span className="text-sm text-muted-foreground">/mo</span>}
              </div>
              <Button
                className="w-full rounded-pill mb-5"
                variant={plan.highlight ? "default" : "outline"}
                onClick={() => handleChoosePlan(plan)}
              >
                {plan.cta ?? "Choose Plan"}
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
              <ul className="space-y-2">
                {plan.features.slice(0, 4).map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Detailed comparison table */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-foreground text-center mb-2">
            Compare {section.label} plans
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-8">
            Every feature, side by side.
          </p>
          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Feature</th>
                  {section.plans.map((p) => (
                    <th
                      key={p.id}
                      className={`py-3 px-4 font-medium text-center ${
                        p.highlight ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {section.comparison.map((row) => (
                  <tr key={row.feature} className="border-b border-border/60 last:border-b-0">
                    <td className="py-3 px-4 text-foreground">{row.feature}</td>
                    {row.values.map((v, i) => (
                      <td key={i} className="py-3 px-4 text-center text-muted-foreground">
                        {typeof v === "boolean" ? (
                          v ? (
                            <Check className="w-4 h-4 text-primary inline" />
                          ) : (
                            <X className="w-4 h-4 text-muted-foreground/40 inline" />
                          )
                        ) : (
                          v
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td className="py-3 px-4" />
                  {section.plans.map((p) => (
                    <td key={p.id} className="py-3 px-4 text-center">
                      <Button
                        size="sm"
                        variant={p.highlight ? "default" : "outline"}
                        className="rounded-pill"
                        onClick={() => handleChoosePlan(p)}
                      >
                        Choose
                      </Button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Pricing;
