import { motion } from "framer-motion";

const cases = [
  {
    company: "Mount-It!",
    metric: "3.2x ROAS Lift",
    detail: "Full-funnel Walmart strategy drove 3.2x ROAS improvement within 90 days. Turned an underperforming SKU into an omnichannel growth driver.",
    author: "Marcus Johnson",
    role: "Founder, Mount-It!",
    quote: "The difference between our old agency and Anarix is night and day.",
  },
  {
    company: "Drive Medical",
    metric: "$2.4M Revenue Growth",
    detail: "Unified Amazon + Walmart strategy drove 67% year-over-year sales increase with improved spend efficiencies across both marketplaces.",
    author: "Sarah Chen",
    role: "VP Growth, Drive Medical",
    quote: "Anarix found $2.4M in revenue we were leaving on the table.",
  },
  {
    company: "Karma Organics",
    metric: "22% Sales Increase",
    detail: "20-22% sales increase in the second month of partnership. Expanded into Walmart and TikTok Shop with Anarix's guidance.",
    author: "Nausil Zaheer",
    role: "COO, Karma Organics",
    quote: "The results in month two exceeded what we expected from month six.",
  },
];

const CaseStudiesSection = () => {
  return (
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
            Case Studies
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Real results from real brands.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Brands like yours are growing marketplace revenue and margin with Anarix.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {cases.map((c, i) => (
            <motion.div
              key={c.company}
              className="p-6 rounded-2xl border border-border bg-card flex flex-col"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="text-xs font-semibold text-primary uppercase tracking-[0.12em] mb-2">{c.company}</div>
              <div className="text-2xl font-bold text-foreground mb-3">{c.metric}</div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">{c.detail}</p>
              <div className="pt-4 border-t border-border">
                <div className="text-sm font-semibold text-foreground">&ldquo;{c.quote}&rdquo;</div>
                <div className="text-xs text-muted-foreground mt-2">{c.author}, {c.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudiesSection;
