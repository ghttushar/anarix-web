import { motion } from "framer-motion";
import { CaricatureMockup } from "./CaricatureMockup";
import { PhotoMockup } from "./PhotoMockup";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

type Member = { name: string; role: string };
type Dept = { name: string; tagline: string; members: Member[] };

const DEPARTMENTS: Dept[] = [
  { name: "Leadership", tagline: "Sets the bar. Then quietly clears it.",
    members: [{ name: "Sunil", role: "CEO" }] },
  { name: "Account Management", tagline: "Your direct line. They own the outcome, not the excuses.",
    members: [
      { name: "Bharath", role: "Account Manager" },
      { name: "Naveen", role: "Account Manager" },
      { name: "Rakesh C", role: "Account Manager" },
      { name: "Tarun Kumar", role: "Account Manager" },
      { name: "Nishith", role: "Account Manager" },
    ] },
  { name: "Service", tagline: "Operators behind every campaign decision. Quiet hands, loud results.",
    members: [
      { name: "Milu", role: "Service" },
      { name: "Venky", role: "Service" },
      { name: "Kartik", role: "Service" },
      { name: "Vardhan", role: "Service" },
    ] },
  { name: "Tech", tagline: "Builds the platform you don't think about. Because it just works.",
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
    ] },
  { name: "Design", tagline: "Makes complex data feel calm. Not cute, calm.",
    members: [
      { name: "Anubhav", role: "Design" },
      { name: "Tushar", role: "Design" },
    ] },
  { name: "Marketing", tagline: "Tells the story without the noise. Or the buzzwords.",
    members: [
      { name: "Jasleen", role: "Marketing" },
      { name: "Devyanshi", role: "Marketing" },
      { name: "Nandan", role: "Marketing" },
    ] },
];

const ALL_MEMBERS = DEPARTMENTS.flatMap((d) => d.members.map((m) => ({ ...m, dept: d.name })));

/** Stacked, overlapping, hand-laid row of caricature cards. */
function StackedRow({
  members,
  size = 88,
  overlap = 22,
  dark = false,
}: {
  members: { name: string; role: string; dept: string }[];
  size?: number;
  overlap?: number;
  dark?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center" style={{ paddingLeft: overlap }}>
      {members.map((m, i) => {
        const tilt = ((i % 7) - 3) * 1.4; // -4.2 .. 4.2 deg
        return (
          <motion.div
            key={`${m.dept}-${m.name}-${i}`}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.025, duration: 0.32, ease: [0.2, 0, 0, 1] }}
            tabIndex={0}
            className={`group relative cursor-default focus:outline-none transition-all duration-300 ease-out
              hover:!rotate-0 hover:scale-[1.14] hover:-translate-y-3 hover:z-30 focus:scale-[1.14] focus:-translate-y-3 focus:z-30
              ${dark ? "" : ""}`}
            style={{
              width: size,
              height: size,
              marginLeft: -overlap,
              transform: `rotate(${tilt}deg)`,
              zIndex: i + 1,
            }}
          >
            <div
              className={`w-full h-full rounded-[28px] overflow-hidden shadow-xl ring-1 transition-shadow duration-300 group-hover:shadow-2xl
                ${dark ? "ring-white/15" : "ring-black/5"}`}
              style={{ background: dark ? "#0e1020" : "#fff" }}
            >
              {/* Default: caricature */}
              <div className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-0 group-focus:opacity-0">
                <CaricatureMockup name={m.name} dept={m.dept} />
              </div>
              {/* Hover: photo-style */}
              <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus:opacity-100">
                <PhotoMockup name={m.name} dept={m.dept} />
              </div>
            </div>

            {/* Hover label - floats below, doesn't shift layout */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-40">
              <div className={`px-2.5 py-1 rounded-md text-[11px] font-semibold shadow-md ${dark ? "bg-white text-[#0e1020]" : "bg-foreground text-background"}`}>
                {m.name}
                <span className="opacity-60 font-normal ml-1.5">{m.role}</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function TeamsSection() {
  return (
    <>
      {/* HERO STRIP - dark, stacked caricature row preview */}
      <section className="py-24 px-6 bg-[hsl(240_30%_8%)] text-[hsl(0_0%_98%)] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{ background: "radial-gradient(800px 400px at 70% 110%, hsl(var(--primary) / 0.45), transparent 60%)" }}
        />
        <div className="max-w-6xl mx-auto relative">
          <div className="grid lg:grid-cols-[1fr_auto] gap-10 items-end">
            <div className="min-w-0">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] mb-5">
                Let's chat more over <em className="font-aan not-italic italic text-primary-foreground/95">Chai</em> (or Filter Coffee).
              </h2>
              <p className="text-lg text-[hsl(0_0%_75%)] max-w-xl mb-10">
                The team shaping advertising intelligence at Anarix. Hover any face - we promise the real ones look better.
              </p>
              <div className="pb-6">
                <StackedRow
                  members={ALL_MEMBERS.slice(0, 12)}
                  size={72}
                  overlap={20}
                  dark
                />
              </div>
              <p className="text-xs text-[hsl(0_0%_60%)] mt-2 tracking-wide uppercase">Built by operators, for operators.</p>
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

      {/* DEPARTMENTS - editorial, stacked rows */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-[#f26e76] text-xs font-medium uppercase tracking-[0.14em]">
              The People
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-[1.1]">
              One team. Six departments. <span className="text-gradient-primary">Zero silos.</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Operators, engineers, designers, and analysts. Distributed across continents but answering the same question every morning: what does our customer need today?
            </p>
          </div>

          <div className="space-y-20">
            {DEPARTMENTS.map((dept) => (
              <div key={dept.name} className="grid md:grid-cols-[220px_1fr] gap-8 md:gap-12">
                <div className="md:sticky md:top-28 self-start">
                  <h3 className="text-2xl font-bold text-foreground tracking-tight">{dept.name}</h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{dept.tagline}</p>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground/70 mt-4">
                    {dept.members.length} {dept.members.length === 1 ? "member" : "members"}
                  </div>
                </div>

                <div className="min-w-0 pb-10">
                  <StackedRow
                    members={dept.members.map((m) => ({ ...m, dept: dept.name }))}
                    size={92}
                    overlap={26}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
