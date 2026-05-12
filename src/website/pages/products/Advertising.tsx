import { motion } from "framer-motion";
import { Megaphone, Target, Sparkles, Clock, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PageLayout from "@/website/components/PageLayout";

const features = [
  { icon: Sparkles, title: "AI + Rule-Based Bidder", desc: "A bidder that thinks. Combines machine learning with rules you trust to keep CPC efficient and ROAS climbing." },
  { icon: Target, title: "Smart Keyword Automation", desc: "Discover, harvest, and graduate keywords automatically. No more manual SQP exports." },
  { icon: Clock, title: "Dayparting (AMS)", desc: "Spend when shoppers convert. Hour-of-day budget shaping for every campaign." },
  { icon: BarChart3, title: "Impact Analysis", desc: "See the lift before you commit. Counterfactual reporting on every change." },
];

const ProductAdvertising = () => (
  <PageLayout>
    <section className="px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-sm font-medium">
            <Megaphone className="w-4 h-4" /> Advertising
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            Ads that <span className="text-gradient-primary">earn their spend</span>.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Campaign management for Amazon, Walmart, and beyond — engineered for ROAS, not impressions.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-20">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="p-6 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-soft transition-all duration-300"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <f.icon className="w-7 h-7 text-primary mb-4" />
              <h3 className="text-lg font-bold text-foreground mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center pb-8">
          <Link to="/website/demo">
            <Button size="lg" className="rounded-pill px-8 h-12 bg-primary text-primary-foreground btn-shine">
              See Advertising in Action
            </Button>
          </Link>
        </div>
      </div>
    </section>
  </PageLayout>
);

export default ProductAdvertising;
