import { motion } from "framer-motion";
import { BarChart3, PieChart, TrendingUp, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PageLayout from "@/website/components/PageLayout";
import TacosSection from "@/website/components/TacosSection";

const features = [
  { icon: PieChart, title: "SKU-Level P&L", desc: "Contribution margin per SKU, fees broken out, and the cost lines hiding inside marketplace settlements." },
  { icon: BarChart3, title: "Cross-Channel Attribution", desc: "Unified view across Amazon, Walmart, Shopify, TikTok, Meta, and Google Ads." },
  { icon: TrendingUp, title: "Real-Time Dashboards", desc: "Live metrics updated every 15 minutes. No more waiting for yesterday's data." },
  { icon: Target, title: "Margin Diagnostics", desc: "Surface profit leaks in minutes. Aan flags waste before it compounds." },
];

const ProductProfitability = () => (
  <PageLayout>
    <div className="max-w-6xl mx-auto px-6">
      <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-sm font-medium">
          <BarChart3 className="w-4 h-4" /> Profitability
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">Profit you can <span className="text-gradient-primary">prove</span>.</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">SKU-level economics, cross-channel attribution, and TACoS that finally tell the truth.</p>
      </motion.div>
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        {features.map((f, i) => (
          <motion.div key={f.title} className="p-6 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-soft transition-all duration-300" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }} whileHover={{ y: -2 }}>
            <f.icon className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">{f.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
      {/* Mock dashboard */}
      <motion.div className="rounded-2xl border border-border bg-card overflow-hidden shadow-medium mb-16" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}>
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30"><div className="flex gap-1.5"><span className="w-3 h-3 rounded-full bg-red-400" /><span className="w-3 h-3 rounded-full bg-yellow-400" /><span className="w-3 h-3 rounded-full bg-green-400" /></div><span className="text-xs text-muted-foreground ml-2">Analytics Dashboard</span></div>
        <div className="p-8 grid grid-cols-4 gap-4">
          {[{ l: "Revenue", v: "$2.4M" }, { l: "ROAS", v: "4.2x" }, { l: "TACoS", v: "12.8%" }, { l: "Orders", v: "18.4K" }].map(m => (
            <div key={m.l} className="text-center"><div className="text-2xl font-bold text-foreground">{m.v}</div><div className="text-xs text-muted-foreground">{m.l}</div></div>
          ))}
        </div>
        <div className="px-8 pb-8"><div className="h-32 bg-muted/30 rounded-lg border border-border flex items-end gap-1 p-4">
          {[40, 65, 55, 80, 70, 90, 85, 95, 75, 88, 92, 78].map((h, i) => (
            <motion.div key={i} className="flex-1 bg-primary/60 rounded-t" initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: 0.6 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }} />
          ))}
        </div></div>
      </motion.div>
    </div>
    <TacosSection />
    <div className="max-w-6xl mx-auto px-6 text-center pb-8">
      <Link to="/website/demo"><Button size="lg" className="rounded-pill px-8 h-12 bg-primary text-primary-foreground btn-shine">See It in Action</Button></Link>
    </div>
  </PageLayout>
);

export default ProductProfitability;
