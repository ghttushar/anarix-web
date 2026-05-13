import SectionHeader from "@/website/components/marketing/SectionHeader";
import WorkflowDiagram from "@/website/components/marketing/WorkflowDiagram";

const WorkflowSection = ({
  eyebrow = "How it works",
  title = "Aan works alongside your team — never around it.",
  lead = "Aan reads, diagnoses, and drafts. You approve. Every action is reversible and logged for audit.",
  nodes,
}: { eyebrow?: string; title?: string; lead?: string; nodes?: { label: string; sub?: string }[] }) => (
  <section className="py-24 sm:py-32 px-6">
    <div className="max-w-6xl mx-auto">
      <SectionHeader eyebrow={eyebrow} title={title} lead={lead} align="center" className="mb-16" />
      <WorkflowDiagram nodes={nodes} />
    </div>
  </section>
);

export default WorkflowSection;
