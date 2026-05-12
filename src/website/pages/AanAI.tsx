import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Bot, FileText, Shield, Zap, Palette, Users, Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PageLayout from "@/website/components/PageLayout";
import CycloneScrollSection from "@/website/components/CycloneScrollSection";

const capabilities = [
  { icon: FileText, title: "Reports", desc: "Auto-generated weekly and monthly insights with channel and SKU-level detail." },
  { icon: Shield, title: "Audits", desc: "Scans for wasted spend, missing keywords, and broken campaigns." },
  { icon: Zap, title: "Rules", desc: "Smart automation rules that adapt. Aan suggests, you approve." },
  { icon: Palette, title: "Creative", desc: "AI-generated ad copy, image suggestions, and A/B test designs." },
  { icon: Users, title: "Agents", desc: "Autonomous 24/7 workflows for budgets, bids, and anomalies." },
];

const cannedResponses: Record<string, string> = {
  "What's my ROAS this week?": "Your blended ROAS this week is 3.8x, up 12% from last week. Amazon Sponsored Products is your top performer at 5.2x.",
  "Which campaigns should I pause?": "I'd recommend pausing 3 campaigns with ACoS > 40%: 'Generic_Broad_01', 'Competitor_Exact_03', and 'Auto_Discovery_07'. This could save ~$2,400/week.",
  "Generate a report": "Here's your weekly summary: Revenue $142K (+8%), Ad Spend $38K (-3%), TACoS 26.7% (-1.2pp). Top SKU: Widget-Pro-XL at $18K revenue. I've emailed the full report to your team.",
};

const AanAI = () => {
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "Hey! I'm Aan, your AI copilot. Ask me anything about your campaigns." },
  ]);
  const [typing, setTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const handleQuestion = (q: string) => {
    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "ai", text: cannedResponses[q] || "Let me look into that for you..." }]);
      setTyping(false);
    }, 1500);
  };

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-6">
        {/* Hero with gradient orb */}
        <div className="relative text-center mb-20">
          {/* Pulsing orb */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full"
            style={{
              background: "radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 70%)",
            }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div className="relative z-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <motion.div
              className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-pill bg-primary/10 text-primary text-sm font-medium"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Bot className="w-4 h-4" /> Meet Aan
            </motion.div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              Because our AI <span className="text-gradient-primary">glows</span>.
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-2">What else do you need?</p>
            <p className="text-muted-foreground">Okayyy… here are the other boring things Aan also does.</p>
          </motion.div>
        </div>

        {/* Interactive chat demo */}
        <motion.div
          className="max-w-2xl mx-auto mb-20 rounded-2xl border border-border bg-card overflow-hidden shadow-strong"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-destructive/50" />
              <span className="w-3 h-3 rounded-full bg-yellow-400/50" />
              <span className="w-3 h-3 rounded-full bg-green-400/50" />
            </div>
            <span className="text-xs text-muted-foreground ml-2">Aan AI — Interactive Demo</span>
            <motion.div className="ml-auto w-2 h-2 rounded-full bg-green-500" animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }} />
          </div>

          <div ref={chatRef} className="p-4 space-y-3 max-h-72 overflow-y-auto">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-accent text-foreground rounded-bl-md"
                }`}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-accent rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.5, delay: i * 0.15, repeat: Infinity }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick question buttons */}
          <div className="p-3 border-t border-border bg-muted/20 flex flex-wrap gap-2">
            {Object.keys(cannedResponses).map((q) => (
              <button
                key={q}
                onClick={() => handleQuestion(q)}
                className="text-xs px-3 py-1.5 rounded-pill bg-accent text-accent-foreground hover:bg-primary/10 hover:text-primary transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Capabilities — radial layout on desktop */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-16">
          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.title}
              className="p-5 rounded-2xl border border-border bg-card text-center hover:border-primary/30 hover:shadow-medium transition-all duration-300"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.08, duration: 0.5 }}
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
      <div className="max-w-6xl mx-auto px-6 text-center pb-8">
        <Link to="/website/demo">
          <Button size="lg" className="rounded-pill px-8 h-12 bg-primary text-primary-foreground btn-shine">Try Aan Live</Button>
        </Link>
      </div>
    </PageLayout>
  );
};

export default AanAI;
