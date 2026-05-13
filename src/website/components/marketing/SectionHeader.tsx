import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SectionHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  lead?: string;
  align?: "left" | "center";
  className?: string;
}

const SectionHeader = ({ eyebrow, title, lead, align = "left", className = "" }: SectionHeaderProps) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
    className={`${align === "center" ? "text-center mx-auto" : ""} max-w-3xl ${className}`}
  >
    {eyebrow && (
      <div className="inline-flex items-center px-3 py-1 mb-4 rounded-pill bg-primary/10 text-primary text-[#f26e76] text-xs font-medium uppercase tracking-[0.14em]">
        {eyebrow}
      </div>
    )}
    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
      {title}
    </h2>
    {lead && <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{lead}</p>}
  </motion.div>
);

export default SectionHeader;
