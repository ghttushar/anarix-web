import { motion } from "framer-motion";
import { CaricatureMockup } from "./CaricatureMockup";
import { PhotoMockup } from "./PhotoMockup";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

type Member = { name: string; role: string };
type Dept = { name: string; tagline: string; members: Member[] };

const DEPARTMENTS: Dept[] = [
  {
    name: "Leadership",
    tagline: "Sets the bar. Then quietly clears it.",
    members: [{ name: "Sunil", role: "CEO" }],
  },
  {
    name: "Account Management",
    tagline: "Your direct line. They own the outcome, not the excuses.",
    members: [
      { name: "Bharath", role: "Account Manager" },
      { name: "Naveen", role: "Account Manager" },
      { name: "Rakesh C", role: "Account Manager" },
      { name: "Tarun Kumar", role: "Account Manager" },
      { name: "Nishith", role: "Account Manager" },
    ],
  },
  {
    name: "Service",
    tagline: "Operators behind every campaign decision. Quiet hands, loud results.",
    members: [
      { name: "Milu", role: "Service" },
      { name: "Venky", role: "Service" },
      { name: "Kartik", role: "Service" },
      { name: "Vardhan", role: "Service" },
    ],
  },
  {
    name: "Tech",
    tagline: "Builds the platform you don't think about. Because it just works.",
    members: [
      { name: "Aman", role: "Engineering" },
      { name: "Rajveer", role: "Engineering" },
      { name: "Samarth", role: "Engineering" },
      { name: "Samim", role: "Engineering" },
      { name: "Vikas", role: "Engineering" },
      { name: "Mohan", role: "Engineering" },
      { name: "Rohit", role: "Engineering" },
      { name: "Ben", role: "Engineering" },
      { name: "Lipsa", role: "Engineering" },
      { name: "Archana", role: "Engineering" },
      { name: "Loges", role: "Engineering" },
      { name: "Sam", role: "Engineering" },
    ],
  },
  {
    name: "Design",
    tagline: "Makes complex data feel calm. Not cute, calm.",
    members: [
      { name: "Anubhav", role: "Design" },
      { name: "Tushar", role: "Design" },
    ],
  },
  {
    name: "Marketing",
    tagline: "Tells the story without the noise. Or the buzzwords.",
    members: [
      { name: "Jasleen", role: "Marketing" },
      { name: "Devyanshi", role: "Marketing" },
      { name: "Nandan", role: "Marketing" },
    ],
  },
];

const ALL_MEMBERS = DEPARTMENTS.flatMap((d) => d.members.map((m) => ({ ...m, dept: d.name })));

export default function TeamsSection() {
  return (
    <>
      {/* Hero strip - dark, caricature row preview */}
      <section className="py-24 px-6 bg-[hsl(240_30%_8%)] text-[hsl(0_0%_98%)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 pointer-events-none"
          style={{ background: "radial-gradient(800px 400px at 70% 110%, hsl(var(--primary) / 0.4), transparent 60%)" }}
        />
        <div className="max-w-6xl mx-auto relative">
          <div className="grid lg:grid-cols-[1fr_auto] gap-10 items-end">
            <div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] mb-5">
                Let's chat more over <em className="font-aan not-italic text-primary-foreground/95 italic">Chai</em> (or Filter Coffee).
              </h2>
              <p className="text-lg text-[hsl(0_0%_75%)] max-w-xl mb-8">
                The team shaping advertising intelligence at Anarix. Hover any face - we promise the real ones look better.
              </p>
              <div className="flex flex-wrap gap-2 max-w-2xl">
                {ALL_MEMBERS.slice(0, 12).map((m, i) => (
                  <motion.div
                    key={m.name}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                    style={{ transform: `rotate(${(i % 5) - 2}deg)` }}
                    className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10 shadow-lg"
                  >
                    <CaricatureMockup name={m.name} dept={m.dept} />
                  </motion.div>
                ))}
              </div>
              <p className="text-xs text-[hsl(0_0%_60%)] mt-6 tracking-wide uppercase">Built by operators, for operators.</p>
            </div>
            <div className="lg:justify-self-end">
              <Link to="/website/demo">
                <Button size="lg" className="rounded-pill h-12 px-7 bg-white text-[hsl(240_30%_8%)] hover:bg-white/90">
                  Talk to an Expert <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Departments - editorial layout */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
              The People
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-[1.1]">
              One team. Six departments. <span className="text-gradient-primary">Zero silos.</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Operators, engineers, designers, and analysts. Distributed across continents but answering the same question every morning: what does our customer need today?
            </p>
          </div>

          <div className="space-y-16">
            {DEPARTMENTS.map((dept) => (
              <div key={dept.name} className="grid md:grid-cols-[220px_1fr] gap-8 md:gap-12">
                <div className="md:sticky md:top-28 self-start">
                  <h3 className="text-2xl font-bold text-foreground tracking-tight">{dept.name}</h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{dept.tagline}</p>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground/70 mt-4">
                    {dept.members.length} {dept.members.length === 1 ? "member" : "members"}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {dept.members.map((m, i) => (
                    <MemberCard key={m.name} member={m} dept={dept.name} index={i} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function MemberCard({ member, dept, index }: { member: Member; dept: string; index: number }) {
  const tilt = ((index % 5) - 2) * 0.6;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.03, duration: 0.35, ease: [0.2, 0, 0, 1] }}
      whileHover={{ scale: 1.08, y: -6, rotate: 0 }}
      whileFocus={{ scale: 1.08, y: -6, rotate: 0 }}
      style={{ transform: `rotate(${tilt}deg)` }}
      tabIndex={0}
      className="group relative rounded-2xl border border-border bg-card overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-default shadow-sm hover:shadow-lg hover:z-10 transition-shadow"
    >
      <div className="aspect-square relative">
        {/* Default state: caricature */}
        <div className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-0 group-focus:opacity-0">
          <CaricatureMockup name={member.name} dept={dept} />
        </div>
        {/* Hover state: photo-style portrait */}
        <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus:opacity-100">
          <PhotoMockup name={member.name} dept={dept} />
        </div>
      </div>
      <div className="p-3 border-t border-border bg-card">
        <div className="text-sm font-semibold text-foreground truncate">{member.name}</div>
        <div className="text-[11px] text-muted-foreground truncate">{member.role}</div>
      </div>
    </motion.div>
  );
}
