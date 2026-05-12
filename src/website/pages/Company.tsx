import { SectionLabel } from "../components/SectionLabel";

export default function Company() {
  return (
    <section className="px-6 pb-24">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <SectionLabel>Company</SectionLabel>
          <h1 className="mt-3 font-[Satoshi] text-5xl font-semibold tracking-tight text-foreground md:text-6xl">
            We're building the operating layer for marketplace commerce.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            Anarix is built by a team of operators, engineers, and ML researchers who've run the spend, written the rules, and lost the sleep.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            { v: "$200M+", l: "Ad spend under management" },
            { v: "500+", l: "Brands served" },
            { v: "12+", l: "Marketplaces supported" },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl border border-border bg-card p-6 text-center">
              <div className="font-[Satoshi] text-3xl font-bold text-foreground">{s.v}</div>
              <div className="mt-2 text-xs text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>

        <div id="customers" className="mt-16">
          <h2 className="text-center font-[Satoshi] text-3xl font-semibold text-foreground">Trusted by category leaders</h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {["Northwave", "Aurora Labs", "Pinecrest", "Halcyon", "Verdant", "Kepler", "Briar & Co.", "Tideline"].map((b) => (
              <div key={b} className="rounded-xl border border-border bg-card px-5 py-4 text-center text-sm font-medium text-foreground">
                {b}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
