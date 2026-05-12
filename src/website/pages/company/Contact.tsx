import { useState } from "react";
import { Mail, MessageSquare, MapPin } from "lucide-react";
import { SectionLabel } from "../../components/SectionLabel";
import { Reveal } from "../../components/Reveal";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <section className="px-6 pb-24">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div className="text-center">
            <SectionLabel>Contact</SectionLabel>
            <h1 className="mt-3 font-[Satoshi] text-5xl font-semibold tracking-tight text-foreground md:text-6xl">
              Talk to a real human.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
              Sales, support, partnerships — we'll route your message to the right person within one business day.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {[
            { I: Mail, t: "Sales", v: "sales@anarix.ai" },
            { I: MessageSquare, t: "Support", v: "support@anarix.ai" },
            { I: MapPin, t: "Office", v: "Bangalore · Remote-first" },
          ].map(({ I, t, v }, i) => (
            <Reveal key={t} delay={i * 0.06}>
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <I className="h-5 w-5" />
                </div>
                <div className="mt-4 font-[Satoshi] text-base font-semibold text-foreground">{t}</div>
                <div className="mt-1 text-sm text-muted-foreground">{v}</div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          {submitted ? (
            <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-border bg-card p-8 text-center">
              <div className="font-[Satoshi] text-2xl font-semibold text-foreground">Thanks — we'll be in touch within one business day.</div>
            </div>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
              className="mx-auto mt-12 max-w-2xl space-y-4 rounded-2xl border border-border bg-card p-6"
            >
              <Field label="Your name" type="text" />
              <Field label="Email" type="email" />
              <label className="block">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Message</span>
                <textarea
                  required
                  rows={5}
                  className="mt-1.5 w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </label>
              <button
                type="submit"
                className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-all duration-200 hover:bg-primary/90 active:scale-[0.98]"
              >
                Send message
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}

function Field({ label, type }: { label: string; type: string }) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        required
        type={type}
        className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
      />
    </label>
  );
}
