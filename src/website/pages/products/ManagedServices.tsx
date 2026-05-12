import { motion } from "framer-motion";
import { Users, Handshake, Eye, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PageLayout from "@/website/components/PageLayout";

const features = [
  { icon: Users, title: "Dedicated Team", desc: "Experienced account managers and strategists assigned to your brand. Not a call center." },
  { icon: Handshake, title: "Hybrid Model", desc: "Our experts use the Anarix platform alongside your team. Full transparency, shared dashboards." },
  { icon: Eye, title: "Complete Visibility", desc: "Every action logged, every decision documented. You see exactly what we do and why." },
  { icon: LineChart, title: "Performance Guarantees", desc: "We tie our compensation to your outcomes. Aligned incentives, not hourly billing." },
];

const ProductManagedServices = () => (
  <PageLayout>
    <div className="max-w-6xl mx-auto px-6">
      <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-sm font-medium"><Users className="w-4 h-4" /> Managed Services</div>
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Your Team, <span className="text-gradient-primary">Amplified</span></h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">Expert strategy and execution, fully transparent and aligned to your growth.</p>
      </motion.div>
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        {features.map((f, i) => (
          <motion.div key={f.title} className="p-6 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-soft transition-all duration-300" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }} whileHover={{ y: -2 }}>
            <f.icon className="w-8 h-8 text-primary mb-4" /><h3 className="text-lg font-bold text-foreground mb-2">{f.title}</h3><p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
      <div className="text-center"><Link to="/website/demo"><Button size="lg" className="rounded-pill px-8 h-12 bg-primary text-primary-foreground btn-shine">Talk to Our Team</Button></Link></div>
    </div>
  </PageLayout>
);

export default ProductManagedServices;
