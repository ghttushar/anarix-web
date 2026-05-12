import { motion } from "framer-motion";
import { Bot, FileText, Shield, Zap, Palette, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PageLayout from "@/website/components/PageLayout";
import CycloneScrollSection from "@/website/components/CycloneScrollSection";
import WebsiteAanChat from "@/website/components/WebsiteAanChat";
import { AanMascot } from "@/components/aan/AanMascot";

const capabilities = [
  { icon: FileText, title: "Reports", desc: "Auto-generated weekly and monthly insights with channel and SKU detail." },
  { icon: Shield, title: "Audits", desc: "Scans for wasted spend, missing keywords, and broken campaigns." },
  { icon: Zap, title: "Rules", desc: "Smart automation rules that adapt. Aan suggests, you approve." },
  { icon: Palette, title: "Creative", desc: "AI-generated ad copy, image suggestions, and A/B test designs." },
  { icon: Users, title: "Agents", desc: "Autonomous workflows for budgets, bids, and anomalies." },
];

const AanAI = () => {
  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-6">
        {/* Hero with real Aan mascot */}
        <div className="relative text-center mb-16">
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.18) 0%, transparent 70%)" }}
            animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div className="relative z-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex justify-center mb-6">
              <AanMascot state="idle" size={140} />
            </div>
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-pill bg-primary/10 text-primary text-sm font-medium">
              <Bot className="w-4 h-4" /> Meet Aan
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              Anarix Analytical <span className="text-gradient-primary">Nural</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Aan reads your data, diagnoses issues, drafts rules, and explains every decision. You approve. Aan executes.
            </p>
          </motion.div>
        </div>

        {/* Live chat */}
        <motion.div
          className="max-w-2xl mx-auto mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <p className="text-center text-xs uppercase tracking-[0.18em] text-muted-foreground mb-4">Talk to Aan — live</p>
          <WebsiteAanChat
            height="h-[480px]"
            initialMessage="Hey, I'm Aan. Ask me anything about Anarix — products, pricing, integrations, or how I work alongside your team."
          />
        </motion.div>

        {/* Capabilities */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-16">
          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.title}
              className="p-5 rounded-2xl border border-border bg-card text-center hover:border-primary/30 hover:shadow-medium transition-all duration-300"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
            >
              <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center">
                <cap.icon className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-bold text-foreground text-sm mb-1">{cap.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{cap.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <CycloneScrollSection />

      <div className="max-w-6xl mx-auto px-6 text-center pb-16">
        <Link to="/website/demo">
          <Button size="lg" className="rounded-pill px-8 h-12 bg-primary text-primary-foreground btn-shine">
            Schedule a Demo
          </Button>
        </Link>
      </div>
    </PageLayout>
  );
};

export default AanAI;
