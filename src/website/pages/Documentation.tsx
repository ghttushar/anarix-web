import { motion } from "framer-motion";
import { BookOpen, Rocket, Plug, Code2, GitBranch } from "lucide-react";
import { Link } from "react-router-dom";
import PageLayout from "@/website/components/PageLayout";

const sections = [
  {
    icon: Rocket,
    title: "Getting Started",
    items: ["Create your workspace", "Connect your first marketplace", "Invite your team", "Set spend guardrails"],
  },
  {
    icon: Plug,
    title: "Integrations",
    items: ["Amazon Ads (SP, SB, SD, AMC)", "Walmart Connect", "Shopify", "Meta & Google Ads", "BigQuery & Snowflake"],
  },
  {
    icon: Code2,
    title: "API Reference",
    items: ["Authentication", "Campaigns endpoint", "Reports endpoint", "Webhooks", "Rate limits"],
  },
  {
    icon: GitBranch,
    title: "Glossary",
    items: ["TACoS vs ACoS", "Contribution margin", "Dayparting", "Sponsored Brand budgeting", "AMC audiences"],
  },
];

const Docs = () => (
  <PageLayout>
    <section className="px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-sm font-medium">
            <BookOpen className="w-4 h-4" /> Documentation
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            Everything you need to <span className="text-gradient-primary">ship</span>.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Practical guides, API references, and integration recipes for the Anarix platform.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-20">
          {sections.map((s, i) => (
            <motion.div
              key={s.title}
              className="p-8 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-soft transition-all duration-300"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <s.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{s.title}</h3>
              </div>
              <ul className="space-y-2.5">
                {s.items.map((item) => (
                  <li key={item}>
                    <Link
                      to="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-coral group-hover:scale-150 transition-transform" />
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </PageLayout>
);

export default Docs;
