import { motion } from "framer-motion";
import { CaricatureMockup } from "./CaricatureMockup";

type Member = { name: string; role: string };
type Dept = { name: string; tagline: string; members: Member[] };

const DEPARTMENTS: Dept[] = [
  {
    name: "Leadership",
    tagline: "Sets the bar — and clears it.",
    members: [{ name: "Sunil", role: "CEO" }],
  },
  {
    name: "Account Management",
    tagline: "Your direct line. They own the outcome.",
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
    tagline: "The operators behind every campaign decision.",
    members: [
      { name: "Milu", role: "Service" },
      { name: "Venky", role: "Service" },
      { name: "Kartik", role: "Service" },
      { name: "Vardhan", role: "Service" },
    ],
  },
  {
    name: "Tech",
    tagline: "Engineers the platform you don't think about — because it just works.",
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
    tagline: "Makes complex data feel calm.",
    members: [
      { name: "Anubhav", role: "Design" },
      { name: "Tushar", role: "Design" },
    ],
  },
  {
    name: "Marketing",
    tagline: "Tells the story without the noise.",
    members: [
      { name: "Jasleen", role: "Marketing" },
      { name: "Devyanshi", role: "Marketing" },
      { name: "Nandan", role: "Marketing" },
    ],
  },
];

function initials(name: string) {
  const p = name.trim().split(/\s+/);
  return ((p[0]?.[0] ?? "") + (p[1]?.[0] ?? "")).toUpperCase();
}

export default function TeamsSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
            The People
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-[1.1]">
            One team. Six departments. <span className="text-gradient-primary">Zero silos.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Operators, engineers, designers, and analysts — distributed across continents but
            answering the same question every morning: what does our customer need today?
          </p>
        </div>

        <div className="space-y-14">
          {DEPARTMENTS.map((dept) => (
            <div key={dept.name} className="grid md:grid-cols-[200px_1fr] gap-6 md:gap-10">
              <div>
                <h3 className="text-xl font-bold text-foreground">{dept.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{dept.tagline}</p>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground/70 mt-3">
                  {dept.members.length} {dept.members.length === 1 ? "member" : "members"}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {dept.members.map((m) => (
                  <MemberCard key={m.name} member={m} dept={dept.name} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MemberCard({ member, dept }: { member: Member; dept: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.06, y: -2 }}
      whileFocus={{ scale: 1.06, y: -2 }}
      transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}
      tabIndex={0}
      className="group relative rounded-2xl border border-border bg-card overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-default"
    >
      <div className="aspect-square relative">
        {/* Default state: initials monogram */}
        <div className="absolute inset-0 flex items-center justify-center bg-muted/40 transition-opacity duration-200 group-hover:opacity-0 group-focus:opacity-0">
          <span className="font-bold text-2xl text-muted-foreground tracking-wide">
            {initials(member.name)}
          </span>
        </div>
        {/* Hover state: caricature mockup */}
        <div className="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus:opacity-100">
          <CaricatureMockup name={member.name} dept={dept} />
        </div>
      </div>
      <div className="p-3 border-t border-border">
        <div className="text-sm font-semibold text-foreground truncate">{member.name}</div>
        <div className="text-[11px] text-muted-foreground truncate">{member.role}</div>
      </div>
    </motion.div>
  );
}
