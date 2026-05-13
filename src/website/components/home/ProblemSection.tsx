import { motion } from "framer-motion";
import SectionHeader from "@/website/components/marketing/SectionHeader";

const ProblemSection = () => (
  <section className="py-24 sm:py-32 px-6">
    <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
      <SectionHeader
        eyebrow="The problem"
        title={<>Most ad platforms tell you what happened.<br/><span className="text-primary text-[#f26e76]">None tell you what to do.</span></>}
        lead="Operators stitch together Seller Central exports, Walmart Connect dashboards, ad platform UIs, and a dozen spreadsheets. By the time a $4,000 wasted-spend pattern is visible, it's already cost you $40,000."
      />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="space-y-3"
      >
        {[
          { l: "Hours/week reconciling reports", v: "12+" },
          { l: "Avg latency on profitability data", v: "3 days" },
          { l: "Wasted spend caught after the fact", v: "8-14%" },
          { l: "Tools in the average ops stack", v: "9" },
        ].map((r) => (
          <div key={r.l} className="flex items-baseline justify-between border-b border-border py-3">
            <span className="text-sm text-muted-foreground">{r.l}</span>
            <span className="text-2xl font-bold text-foreground tabular-nums">{r.v}</span>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default ProblemSection;
