import { SectionLabel } from "../../components/SectionLabel";
import { Reveal } from "../../components/Reveal";

export default function About() {
  return (
    <section className="px-6 pb-24">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div className="text-center">
            <SectionLabel>About</SectionLabel>
            <h1 className="mt-3 font-[Satoshi] text-5xl font-semibold tracking-tight text-foreground md:text-6xl">
              We're building the operating layer for marketplace commerce.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
              Anarix is built by a team of operators, engineers, and ML researchers who've run the spend, written the rules, and lost the sleep.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            { v: "$200M+", l: "Ad spend under management" },
            { v: "500+", l: "Brands served" },
            { v: "12+", l: "Marketplaces supported" },
          ].map((s, i) => (
            <Reveal key={s.l} delay={i * 0.06}>
              <div className="rounded-2xl border border-border bg-card p-6 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                <div className="font-[Satoshi] text-3xl font-bold text-foreground">{s.v}</div>
                <div className="mt-2 text-xs text-muted-foreground">{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
