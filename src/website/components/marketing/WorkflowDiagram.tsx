import { motion } from "framer-motion";

interface Node {
  label: string;
  sub?: string;
}

interface WorkflowDiagramProps {
  nodes?: Node[];
}

const defaultNodes: Node[] = [
  { label: "Connect", sub: "Amazon, Walmart, Shopify" },
  { label: "Diagnose", sub: "Aan reads the data" },
  { label: "Draft", sub: "Rules, audits, reports" },
  { label: "Approve", sub: "You stay in control" },
  { label: "Execute", sub: "Logged & reversible" },
];

const WorkflowDiagram = ({ nodes = defaultNodes }: WorkflowDiagramProps) => (
  <div className="relative w-full">
    {/* Desktop: horizontal */}
    <div className="hidden md:block">
      <div className="relative grid" style={{ gridTemplateColumns: `repeat(${nodes.length}, minmax(0, 1fr))` }}>
        {/* Connector line */}
        <svg
          className="absolute top-7 left-0 w-full h-0.5 pointer-events-none"
          viewBox="0 0 100 1"
          preserveAspectRatio="none"
        >
          <motion.line
            x1="5"
            x2="95"
            y1="0.5"
            y2="0.5"
            stroke="hsl(var(--primary))"
            strokeWidth="0.4"
            strokeDasharray="2 2"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.6 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease: [0.2, 0, 0, 1] }}
          />
        </svg>
        {nodes.map((n, i) => (
          <motion.div
            key={n.label}
            className="flex flex-col items-center text-center px-2"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, delay: 0.15 + i * 0.1, ease: [0.2, 0, 0, 1] }}
          >
            <div className="relative w-14 h-14 rounded-full bg-card border border-border flex items-center justify-center text-sm font-bold text-primary z-10">
              {i + 1}
            </div>
            <div className="mt-3 font-semibold text-foreground text-sm">{n.label}</div>
            {n.sub && <div className="text-xs text-muted-foreground mt-1 max-w-[140px]">{n.sub}</div>}
          </motion.div>
        ))}
      </div>
    </div>

    {/* Mobile: vertical */}
    <div className="md:hidden space-y-4">
      {nodes.map((n, i) => (
        <div key={n.label} className="flex gap-4 items-start">
          <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-sm font-bold text-primary shrink-0">
            {i + 1}
          </div>
          <div>
            <div className="font-semibold text-foreground text-sm">{n.label}</div>
            {n.sub && <div className="text-xs text-muted-foreground">{n.sub}</div>}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default WorkflowDiagram;
