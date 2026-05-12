import { Section, Eyebrow, H1, H2, Lead } from "../components/primitives";
import { AanMascot } from "@/components/aan/AanMascot";

const TEAM = [
  { name: "Asha Mehta", role: "Co-founder · Product", initials: "AM" },
  { name: "Rohan Iyer", role: "Co-founder · Engineering", initials: "RI" },
  { name: "Tushar G.", role: "Founding Engineer", initials: "TG" },
  { name: "Lena P.", role: "Design", initials: "LP" },
  { name: "Marcus C.", role: "Customer Success", initials: "MC" },
  { name: "Yuki S.", role: "Data Science", initials: "YS" },
];

export default function About() {
  return (
    <>
      <Section className="!pt-16 !pb-10">
        <Eyebrow>About</Eyebrow>
        <H1 className="mt-4 max-w-3xl">We build the analytical OS we always wished we had.</H1>
        <Lead className="mt-5">
          Anarix exists because operators deserve software that respects their stress, their time,
          and their judgment. We started with the data we wanted to trust — then we built Aan to
          make it actionable.
        </Lead>
      </Section>

      <Section className="!py-16 bg-secondary/5">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] items-center">
          <div>
            <Eyebrow>Mission</Eyebrow>
            <H2 className="mt-4">No silent decisions. No black boxes. No babysitting.</H2>
            <Lead className="mt-4">
              We believe AI should make operators sharper, not replace them. Every Aan output has
              reasoning attached. Every applied change is reversible. Every chart points back to a
              row of data.
            </Lead>
          </div>
          <div className="flex justify-center">
            <div className="rounded-3xl border border-border bg-card p-10">
              <AanMascot state="listening" size={160} interactive floating />
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <Eyebrow>Hall of Fame</Eyebrow>
        <H2 className="mt-4">The team.</H2>
        <Lead className="mt-4">Small. Senior. Allergic to dashboards-for-dashboards-sake.</Lead>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TEAM.map((m) => (
            <div key={m.name} className="rounded-2xl border border-border bg-card p-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {m.initials}
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">{m.name}</div>
                <div className="text-xs text-muted-foreground">{m.role}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
