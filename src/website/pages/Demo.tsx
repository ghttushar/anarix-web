import { useState } from "react";
import { SectionLabel } from "../components/SectionLabel";

export default function Demo() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <section className="px-6 pb-24">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <SectionLabel>Schedule a Demo</SectionLabel>
          <h1 className="mt-3 font-[Satoshi] text-5xl font-semibold tracking-tight text-foreground">
            Let's connect your data.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            20 minutes. We'll connect a sandbox account and walk through your real ad spend live.
          </p>
        </div>

        {submitted ? (
          <div className="mt-10 rounded-2xl border border-border bg-card p-8 text-center">
            <div className="font-[Satoshi] text-2xl font-semibold text-foreground">Thanks — we'll be in touch within one business day.</div>
            <p className="mt-2 text-sm text-muted-foreground">A calendar link is on its way to your inbox.</p>
          </div>
        ) : (
          <form
            onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
            className="mt-10 space-y-4 rounded-2xl border border-border bg-card p-6"
          >
            <Field label="Work email" type="email" />
            <Field label="Full name" type="text" />
            <Field label="Company" type="text" />
            <Field label="Monthly ad spend" type="text" placeholder="e.g. $50K" />
            <button
              type="submit"
              className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Schedule a Demo
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

function Field({ label, type, placeholder }: { label: string; type: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        required
        className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
      />
    </label>
  );
}
