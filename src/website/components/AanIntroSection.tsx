import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { FileText, Shield, Zap, Palette, Bot } from "lucide-react";

const capabilities = [
  { icon: FileText, label: "Reports", desc: "Auto-generated insights across every channel." },
  { icon: Shield, label: "Audits", desc: "Identify wasted spend and missed opportunities." },
  { icon: Zap, label: "Rules", desc: "Smart automation with guardrails you control." },
  { icon: Palette, label: "Creative", desc: "AI-assisted content that converts." },
  { icon: Bot, label: "Agents", desc: "Autonomous workflows that run 24/7." },
];

const chatMessages = [
  { role: "user" as const, text: "What's my best performing campaign this week?" },
  { role: "aan" as const, text: "Your 'Summer Sale - Brand Defense' campaign on Amazon drove $48K in revenue at 4.2x ROAS, up 18% WoW. Should I scale the budget?" },
  { role: "user" as const, text: "Yes, increase by 20% and pause underperformers." },
  { role: "aan" as const, text: "Done. Budget increased to $12K/day. Paused 3 campaigns with ROAS < 1.5x. I'll monitor and report back tomorrow." },
];

const AanIntroSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="py-24 bg-muted/30 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-[#f26e76] text-sm font-medium"
            initial={{ opacity: 0, y: 12 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <Bot className="w-4 h-4" /> Aan AI
          </motion.div>
          <motion.h2
            className="text-3xl sm:text-5xl font-bold text-foreground mb-4"
            initial={{ opacity: 0, y: 16 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            Because our AI <span className="text-gradient-primary">glows</span>.
            <br />
            What else do you need?
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-lg max-w-lg mx-auto"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Okayyy… here are the other boring things Aan also does.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Capabilities */}
          <div className="space-y-4">
            {capabilities.map((cap, i) => (
              <motion.div
                key={cap.label}
                className="flex items-start gap-4 p-4 rounded-xl bg-background border border-border hover:border-primary/30 hover:shadow-soft transition-all duration-300 group"
                initial={{ opacity: 0, x: -20 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <cap.icon className="w-5 h-5 text-primary text-[#f26e76]" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{cap.label}</h4>
                  <p className="text-sm text-muted-foreground">{cap.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Chat demo */}
          <motion.div
            className="bg-background rounded-2xl border border-border shadow-medium overflow-hidden"
            initial={{ opacity: 0, x: 20 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-yellow-400" />
                <span className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <span className="text-xs text-muted-foreground ml-2">Aan AI Copilot</span>
            </div>
            <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
              {chatMessages.map((msg, i) => (
                <motion.div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.6 + i * 0.15, duration: 0.4 }}
                >
                  <div
                    className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted text-foreground rounded-bl-md"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {/* Typing indicator */}
              <motion.div
                className="flex justify-start"
                initial={{ opacity: 0 }}
                animate={isVisible ? { opacity: 1 } : {}}
                transition={{ delay: 1.4, duration: 0.3 }}
              >
                <div className="flex gap-1 px-4 py-3 bg-muted rounded-2xl rounded-bl-md">
                  {[0, 1, 2].map(d => (
                    <motion.span
                      key={d}
                      className="w-2 h-2 rounded-full bg-muted-foreground/40"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ delay: d * 0.15, duration: 0.6, repeat: Infinity, repeatDelay: 0.8 }}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AanIntroSection;
