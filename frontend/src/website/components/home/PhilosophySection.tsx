import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { AanMascot } from "@/components/aan/AanMascot";

const PhilosophySection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const textX = useTransform(scrollYProgress, [0, 0.5, 1], [-20, 0, 10]);
  const mascotScale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.85, 1, 1, 0.9]);

  return (
    <section ref={ref} className="relative py-28 overflow-hidden border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div style={{ x: textX }}>
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
                Our Approach
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight leading-[1.1] mb-6">
                Most platforms hand you a dashboard{" "}
                <span className="text-gradient-primary">and call it homework.</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                We built ours to do the opposite.
              </p>
            </motion.div>

            <div className="space-y-5">
              {[
                {
                  title: "Relentless execution at machine speed.",
                  desc: "The days of manually adjusting bids and babysitting campaigns are over — our technology handles that grind continuously, at a scale and speed no human could match.",
                },
                {
                  title: "Testing, testing, and more testing.",
                  desc: "New creative, new keywords, new budget structures, new DSP audiences — a constant stream of experiments to find what works for your brand, not a playbook recycled from someone else&apos;s.",
                },
                {
                  title: "Deep dives, not dashboards.",
                  desc: "Real analysis of where your account is headed, what&apos;s holding it back, and what comes next — the kind of thinking that only happens when your team isn&apos;t buried in manual optimization.",
                },
                {
                  title: "Decisions, not to-do lists.",
                  desc: "Not &ldquo;consider optimizing your campaigns,&rdquo; but a specific call: change this, here&apos;s why, here&apos;s what it&apos;s worth.",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  className="p-4 rounded-xl border border-border/30 bg-card/20 hover:bg-card/40 transition-colors duration-500"
                  initial={{ opacity: 0, x: -12, scale: 0.97 }}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h4 className="text-sm font-semibold text-foreground mb-1">{item.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="mt-8 p-5 rounded-2xl border border-primary/10 bg-primary/5"
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <p className="text-sm text-foreground leading-relaxed font-medium">
                Technology does what it does best — relentless, precise execution at machine speed. Our people do what they do best — test, think, and push your brand further than a script ever could.{" "}
                <span className="text-primary">You get both.</span>
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex justify-center"
            style={{ scale: mascotScale }}
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/5 blur-3xl scale-150" />
              <AanMascot state="thinking" size={160} interactive floating layoutId="philosophy-mascot" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PhilosophySection;
