import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/website/components/Navbar";
import NewHero from "@/website/components/NewHero";
import ResultsStrip from "@/website/components/home/ResultsStrip";
import ServiceModelSection from "@/website/components/home/ServiceModelSection";
import PlatformTeaser from "@/website/components/home/PlatformTeaser";
import CaseStudiesSection from "@/website/components/home/CaseStudiesSection";
import Footer from "@/website/components/Footer";
import ScrollToTop from "@/website/components/ScrollToTop";

const week = [
  { day: "Mon", title: "Aan-generated audit", body: "Strategist annotates the week's anomalies. You receive a 5-minute read by 9am." },
  { day: "Tue", title: "Action queue published", body: "Drafted rules and bid changes are queued for your review with projected impact." },
  { day: "Wed", title: "Working session", body: "30 minutes on the top three opportunities. Decisions, not status updates." },
  { day: "Thu", title: "Execution + monitoring", body: "Approved actions execute. Real-time anomaly alerts on shared Slack channel." },
  { day: "Fri", title: "Results review", body: "Projected vs actual lift. Documented learnings carried into next week." },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <NewHero />
      <ResultsStrip />

      {/* Problem Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
              The Problem
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Disconnected tools are costing you margin.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Most marketplace sellers juggle separate tools for advertising, inventory, pricing, profitability, and competitive intelligence. Each tool shows a piece of the picture, but no single view connects them. The result is missed signals, hidden fees, wasted ad spend, and margin erosion that goes unnoticed until the quarterly report.
            </p>
          </motion.div>
        </div>
      </section>

      <ServiceModelSection />

      {/* Process Section */}
      <section className="py-24 border-t border-border">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
              Cadence
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              A week with us.
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A weekly cadence built around decisions, not status updates. No 90-minute alignment calls.
            </p>
          </motion.div>

          <div className="rounded-2xl border border-border bg-card divide-y divide-border">
            {week.map((w) => (
              <div key={w.day} className="grid grid-cols-[80px_180px_1fr] gap-6 px-6 py-4 items-start">
                <div className="text-sm font-bold text-primary uppercase tracking-[0.14em]">{w.day}</div>
                <div className="text-sm font-semibold text-foreground">{w.title}</div>
                <div className="text-sm text-muted-foreground leading-relaxed">{w.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PlatformTeaser />
      <CaseStudiesSection />

      {/* CTA Section */}
      <section className="py-24 border-t border-border">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Let's grow your marketplace business.
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
              Get a custom growth plan with projected impact. No commitment, no pitch deck.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/website/demo">
                <Button size="lg" className="rounded-pill px-8 h-12 text-base bg-primary text-primary-foreground hover:bg-primary/90 btn-shine">
                  Talk to Our Team
                </Button>
              </Link>
              <Link to="/website/product">
                <Button size="lg" variant="outline" className="rounded-pill px-8 h-12 text-base border-border hover:border-primary/40 transition-all duration-200">
                  Explore the Platform
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Home;
