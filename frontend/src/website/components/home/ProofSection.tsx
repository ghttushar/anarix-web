import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import SectionHeader from "@/website/components/marketing/SectionHeader";

const caseStudies = [
  {
    brand: "Mount-It!",
    metric: "3.2x",
    label: "ROAS Lift",
    description: "From struggling Walmart presence to top-performing category leader in 90 days.",
    platform: "Walmart",
  },
  {
    brand: "Drive Medical",
    metric: "$2.4M",
    label: "Revenue Growth",
    description: "Unified Amazon + Walmart strategy drove 67% year-over-year sales increase.",
    platform: "Amazon + Walmart",
  },
  {
    brand: "Karma Organics",
    metric: "22%",
    label: "Sales Increase",
    description: "Expanded from Amazon to Walmart and TikTok Shop with dedicated team support.",
    platform: "Multi-Marketplace",
  },
];

const testimonials = [
  {
    quote: "Anarix didn't just manage our ads — they found $2.4M in revenue we were leaving on the table. The weekly cadence means we're always aligned, never surprised.",
    author: "Sarah Chen",
    role: "VP Growth, Drive Medical",
    avatar: "SC",
  },
  {
    quote: "The difference between our old agency and Anarix is night and day. We went from monthly PDFs to real-time decisions. Our team sleeps better now.",
    author: "Marcus Johnson",
    role: "Founder, Mount-It!",
    avatar: "MJ",
  },
  {
    quote: "Finally, a partner who says 'no' to scope creep and 'yes' to measurable outcomes. 92% retention speaks for itself.",
    author: "Elena Rodriguez",
    role: "COO, Karma Organics",
    avatar: "ER",
  },
];

const ProofSection = () => (
  <section className="py-24 lg:py-32 px-6 lg:px-8 bg-muted/20">
    <div className="max-w-7xl mx-auto">
      <SectionHeader
        eyebrow="Proof"
        title="Brands who started exactly where you are."
        lead="Managing everything themselves, or stuck with an agency that wasn't delivering. Here's what changed."
        align="center"
        className="mb-16"
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {caseStudies.map((study, i) => (
            <motion.article
              key={study.brand}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group p-8 rounded-3xl border border-border bg-card hover:border-primary/30 hover:shadow-medium transition-all duration-300 cursor-pointer"
            >
              <div className="text-xs text-primary font-semibold uppercase tracking-[0.14em] mb-4">
                {study.platform}
              </div>
              <div className="text-5xl sm:text-6xl font-bold text-foreground mb-2 leading-none">
                {study.metric}
              </div>
              <div className="text-lg font-semibold text-primary mb-4">{study.label}</div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">{study.description}</p>
              <div className="flex items-center gap-2 text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {study.brand} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center mb-24"
        >
          <Link
            to="/website/case-studies"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            View all case studies <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.author}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="p-8 rounded-3xl border border-border bg-card"
            >
              <div className="flex items-center gap-2 text-amber-500 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <div className="relative mb-6">
                <p className="text-lg text-foreground leading-relaxed relative z-10">{t.quote}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-semibold text-primary">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-foreground">{t.author}</div>
                  <div className="text-sm text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

export default ProofSection;
