import { motion } from "framer-motion";
import { Target, Heart, Eye, Rocket, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PageLayout from "@/website/components/PageLayout";
import TeamsSection from "@/website/components/company/TeamsSection";

const values = [
  { icon: Target, title: "Outcome Obsessed", desc: "We measure success by your revenue, not our features." },
  { icon: Heart, title: "Radically Transparent", desc: "Every action logged, every decision visible. No black boxes." },
  { icon: Eye, title: "Data First", desc: "Opinions are cheap. We make decisions with evidence." },
  { icon: Rocket, title: "Relentlessly Iterative", desc: "Ship fast, learn faster. Perfection is the enemy of progress." },
];

const milestones = [
  { year: "2019", event: "Founded in New York. First Amazon brand onboarded." },
  { year: "2020", event: "Expanded to Walmart. $10M ad spend managed." },
  { year: "2021", event: "Launched automation engine. 50+ brands." },
  { year: "2022", event: "Aan AI copilot beta. $100M ad spend milestone." },
  { year: "2023", event: "Series A funding. Global expansion." },
  { year: "2024", event: "$200M+ ad spend. $1.2B GMV driven." },
];

const About = () => (
  <PageLayout>
    <div className="max-w-6xl mx-auto px-6">
      {/* Hero - large typography */}
      <motion.div
        className="mb-24"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground tracking-tight leading-[1.1] mb-8">
          We Understand
          <br />
          <span className="text-gradient-primary">Your Chaos</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
          Built by operators who've managed millions in ad spend.
          We know the pain because we've lived it.
        </p>
      </motion.div>

      {/* Values - large typography blocks */}
      <div className="grid md:grid-cols-2 gap-12 mb-24">
        {values.map((v, i) => (
          <motion.div
            key={v.title}
            className="group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
          >
            <v.icon className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-2">{v.title}</h3>
            <p className="text-muted-foreground text-lg leading-relaxed">{v.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Timeline - horizontal scroll */}
      <motion.div
        className="mb-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-3xl font-bold text-foreground mb-8">Our Journey</h2>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute top-5 left-0 right-0 h-px bg-border" />
          <div className="flex gap-0 overflow-x-auto pb-4 scrollbar-none">
            {milestones.map((m, i) => (
              <motion.div
                key={m.year}
                className="flex-shrink-0 w-48 relative pt-10"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.08, duration: 0.4 }}
              >
                {/* Dot */}
                <div className="absolute top-3 left-0 w-4 h-4 rounded-full bg-primary border-4 border-background" />
                <div className="font-bold text-primary text-lg mb-1">{m.year}</div>
                <p className="text-sm text-muted-foreground leading-relaxed pr-4">{m.event}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Team stats */}
      <motion.div
        className="bg-gradient-to-r from-primary/5 via-accent/30 to-primary/5 rounded-2xl p-12 mb-16 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-foreground mb-6">Powered by 40+ experts across 8 countries</h2>
        <p className="text-muted-foreground max-w-lg mx-auto mb-6">
          Engineers, strategists, designers, and account managers - united by a mission to make e-commerce advertising work.
        </p>
        <Link to="/website/company/career">
          <Button className="rounded-pill px-6 bg-primary text-primary-foreground btn-shine">
            Join Our Team <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </motion.div>
    </div>

    {/* Principles - operating beliefs */}
    <section className="py-16 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center px-3 py-1 mb-4 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
            How we operate
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground leading-[1.1]">
            Three principles. <span className="text-gradient-primary">Held loudly.</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { t: "Operators first", d: "Every feature is reviewed by the people who'd use it under pressure. If it doesn't survive a Monday morning, it doesn't ship." },
            { t: "Reversible by default", d: "Nothing irreversible without a preview, a confirmation, and a rollback window. Mistakes should be cheap." },
            { t: "Numbers don't lie. They whisper.", d: "We design for the person reading the dashboard at 11pm. Hierarchy, sources, and severity, always." },
          ].map((p) => (
            <div key={p.t} className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-lg font-bold text-foreground mb-2">{p.t}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Teams - full-width section */}
    <TeamsSection />
  </PageLayout>
);

export default About;
