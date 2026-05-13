import { motion } from "framer-motion";
import { Bot, MousePointerClick, Maximize2, Compass, Lightbulb, Command, Clock, LayoutDashboard } from "lucide-react";

const features = [
  {
    icon: Bot,
    name: "Aan Copilot",
    pun: "A second brain. No second guessing.",
    desc: "Right-side workspace that reads your data, drafts the action, and waits for your nod.",
  },
  {
    icon: MousePointerClick,
    name: "Ask Aan",
    pun: "Highlight. Ask. Move on.",
    desc: "Select any number on screen. Aan explains the why, the source, and what to do next.",
  },
  {
    icon: Maximize2,
    name: "Full-Screen Aan",
    pun: "When the question is bigger than a sidebar.",
    desc: "Dedicated /aan workspace for deep diagnostics, multi-artifact reasoning, and long context.",
  },
  {
    icon: Compass,
    name: "Floating Action Island",
    pun: "Always nearby. Never in the way.",
    desc: "Persistent hub for alerts, Ask Aan, quick rules, and shortcuts. One reach, every action.",
  },
  {
    icon: Lightbulb,
    name: "Insights System",
    pun: "Issues that move money, surfaced first.",
    desc: "Severity-coded findings with sources cited. One click to the underlying data, one more to act.",
  },
  {
    icon: Command,
    name: "Command Palette",
    pun: "Cmd+K. Then anything.",
    desc: "Jump to any page, run any action, query any metric. Power users live here.",
  },
  {
    icon: Clock,
    name: "Day-Parting Heatmap",
    pun: "Your ad spend has bedtime now.",
    desc: "Hour-by-hour heatmap with one-click bid scheduling. Stop paying for sleeping shoppers.",
  },
  {
    icon: LayoutDashboard,
    name: "Sandbox Workspace",
    pun: "Build the dashboard your boss keeps asking for.",
    desc: "Drag, drop, pin. Composable widgets that read live data. No engineering ticket required.",
  },
];

export default function InnovationBand() {
  return (
    <section className="py-24 px-6 bg-muted/20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <div className="inline-flex items-center px-3 py-1 mb-4 rounded-pill bg-primary/10 text-primary text-[#f26e76] text-xs font-medium uppercase tracking-[0.14em]">
            What's inside
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-[1.1]">
            Eight surfaces. <span className="text-gradient-primary">One workflow.</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Built for operators who don't have time to learn another tool. Most of these you'll find within the first ten minutes. The rest you'll discover the day they save you.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.article
              key={f.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.35 }}
              className="group p-5 rounded-2xl border border-border bg-card hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="w-10 h-10 mb-4 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                <f.icon className="w-5 h-5 text-primary text-[#f26e76]" />
              </div>
              <h3 className="font-bold text-foreground text-base mb-1">{f.name}</h3>
              <p className="text-xs text-primary/80 italic mb-2">{f.pun}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
