import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PageLayout from "@/website/components/PageLayout";

const plans = [
  {
    name: "Starter",
    desc: "For growing brands getting started with ads.",
    monthly: 499,
    yearly: 399,
    features: ["Up to $50K ad spend", "2 channels", "Basic analytics", "Email support", "5 automation rules"],
    cta: "Get Started",
    style: "border-border bg-card",
  },
  {
    name: "Growth",
    desc: "For brands scaling aggressively across channels.",
    monthly: 1499,
    yearly: 1199,
    popular: true,
    features: ["Up to $500K ad spend", "All channels", "Advanced analytics", "Priority support", "Unlimited rules", "Aan AI copilot", "Creative Studio"],
    cta: "Start Free Trial",
    style: "border-primary bg-card shadow-strong ring-1 ring-primary/20",
  },
  {
    name: "Enterprise",
    desc: "For large brands and agencies needing everything.",
    monthly: null,
    yearly: null,
    features: ["Unlimited ad spend", "All channels + custom", "Custom dashboards", "Dedicated AM", "Unlimited rules", "Full Aan AI suite", "Creative Studio", "API access", "SSO & compliance"],
    cta: "Contact Sales",
    style: "border-border bg-foreground text-background",
    dark: true,
  },
];

const compareFeatures = [
  { feature: "Ad Spend Limit", starter: "$50K", growth: "$500K", enterprise: "Unlimited" },
  { feature: "Channels", starter: "2", growth: "All", enterprise: "All + Custom" },
  { feature: "Analytics", starter: "Basic", growth: "Advanced", enterprise: "Custom" },
  { feature: "Automation Rules", starter: "5", growth: "Unlimited", enterprise: "Unlimited" },
  { feature: "Aan AI", starter: "-", growth: "✓", enterprise: "Full Suite" },
  { feature: "Creative Studio", starter: "-", growth: "✓", enterprise: "✓" },
  { feature: "API Access", starter: "-", growth: "-", enterprise: "✓" },
  { feature: "Dedicated AM", starter: "-", growth: "-", enterprise: "✓" },
];

const faqs = [
  { q: "Can I switch plans anytime?", a: "Yes, you can upgrade or downgrade at any time. Changes take effect at your next billing cycle." },
  { q: "Is there a free trial?", a: "Yes, Growth plan comes with a 14-day free trial. No credit card required to start." },
  { q: "What happens if I exceed my ad spend limit?", a: "We'll notify you and help you upgrade seamlessly. No service interruption." },
  { q: "Do you offer agency pricing?", a: "Yes, we have special pricing for agencies managing multiple brands. Contact sales for details." },
];

const Pricing = () => {
  const [annual, setAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <PageLayout>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12 space-y-4">
            <div className="h-12 w-80 mx-auto rounded-xl shimmer" />
            <div className="h-6 w-60 mx-auto rounded-lg shimmer" />
            <div className="h-10 w-48 mx-auto rounded-pill shimmer" />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-8 rounded-2xl border border-border space-y-4">
                <div className="h-6 w-24 rounded shimmer" />
                <div className="h-4 w-full rounded shimmer" />
                <div className="h-10 w-32 rounded shimmer" />
                <div className="h-10 w-full rounded-pill shimmer" />
                <div className="space-y-2">
                  {[1, 2, 3, 4].map(j => <div key={j} className="h-4 w-full rounded shimmer" />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Simple, <span className="text-gradient-primary">Transparent</span> Pricing
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">No hidden fees. Scale as you grow.</p>
          <div className="inline-flex items-center gap-3 p-1 rounded-pill bg-muted border border-border">
            <button onClick={() => setAnnual(false)} className={`px-4 py-2 rounded-pill text-sm font-medium transition-all duration-200 ${!annual ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}>Monthly</button>
            <button onClick={() => setAnnual(true)} className={`px-4 py-2 rounded-pill text-sm font-medium transition-all duration-200 ${annual ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}>
              Yearly <span className="text-primary text-xs ml-1">Save 20%</span>
            </button>
          </div>
        </motion.div>

        {/* Pricing cards - differentiated styles */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              className={`relative p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${plan.style}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-pill bg-primary text-primary-foreground text-xs font-medium">
                  Most Popular
                </div>
              )}
              <h3 className={`text-xl font-bold ${plan.dark ? "text-background" : "text-foreground"}`}>{plan.name}</h3>
              <p className={`text-sm mt-1 mb-4 ${plan.dark ? "text-background/60" : "text-muted-foreground"}`}>{plan.desc}</p>
              <div className="mb-6">
                {plan.monthly ? (
                  <>
                    <span className={`text-4xl font-bold ${plan.dark ? "text-background" : "text-foreground"}`}>${annual ? plan.yearly : plan.monthly}</span>
                    <span className={plan.dark ? "text-background/60" : "text-muted-foreground"}>/mo</span>
                  </>
                ) : (
                  <span className={`text-2xl font-bold ${plan.dark ? "text-background" : "text-foreground"}`}>Custom</span>
                )}
              </div>
              <Link to="/website/demo">
                <Button
                  className={`w-full rounded-pill mb-6 ${
                    plan.popular ? "bg-primary text-primary-foreground btn-shine" :
                    plan.dark ? "bg-background text-foreground hover:bg-background/90" : ""
                  }`}
                  variant={plan.popular || plan.dark ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </Link>
              <ul className="space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className={`flex items-start gap-2 text-sm ${plan.dark ? "text-background/70" : "text-muted-foreground"}`}>
                    <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.dark ? "text-background/60" : "text-primary"}`} /> {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Comparison table */}
        <motion.div className="mb-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">Compare Plans</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Feature</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-foreground">Starter</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-primary">Growth</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-foreground">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {compareFeatures.map((row, i) => (
                  <tr key={row.feature} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                    <td className="py-3 px-4 text-sm text-foreground">{row.feature}</td>
                    <td className="py-3 px-4 text-sm text-center text-muted-foreground">{row.starter}</td>
                    <td className="py-3 px-4 text-sm text-center text-foreground font-medium">{row.growth}</td>
                    <td className="py-3 px-4 text-sm text-center text-muted-foreground">{row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div className="max-w-2xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-border rounded-xl overflow-hidden">
                <button className="w-full flex items-center justify-between p-4 text-left text-sm font-medium text-foreground hover:bg-muted/30 transition-colors" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="flex items-center gap-2"><HelpCircle className="w-4 h-4 text-primary" />{faq.q}</span>
                  <span className="text-muted-foreground">{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && (
                  <motion.div className="px-4 pb-4 text-sm text-muted-foreground" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.2 }}>
                    {faq.a}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default Pricing;
