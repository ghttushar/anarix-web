import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Shield, Globe, Lock, Award } from "lucide-react";

const badges = [
  { icon: Shield, label: "SOC 2 Compliant", desc: "Enterprise-grade security" },
  { icon: Globe, label: "Global Coverage", desc: "NA, EU, APAC regions" },
  { icon: Lock, label: "Data Encryption", desc: "AES-256 at rest & in transit" },
  { icon: Award, label: "AWS Partner", desc: "Advanced technology partner" },
];

const partnerLogos = [
  "Amazon Ads", "Walmart Connect", "Google Ads", "Meta Business",
  "TikTok Ads", "Shopify Plus", "BigCommerce", "Klaviyo",
];

const TrustScaleSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="py-24 bg-muted/20">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Trusted at <span className="text-gradient-primary">Scale</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Enterprise security, global reach, and deep platform integrations.
          </p>
        </motion.div>

        {/* Security badges */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {badges.map((badge, i) => (
            <motion.div
              key={badge.label}
              className="p-6 rounded-xl border border-border bg-card text-center hover:border-primary/30 hover:shadow-soft transition-all duration-300 group"
              initial={{ opacity: 0, y: 16 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                <badge.icon className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground text-sm">{badge.label}</h4>
              <p className="text-xs text-muted-foreground mt-1">{badge.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Partner logos */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-6">
            Official Platform Partners
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {partnerLogos.map((logo) => (
              <div
                key={logo}
                className="px-5 py-2.5 rounded-lg border border-border bg-background text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all duration-200"
              >
                {logo}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustScaleSection;
