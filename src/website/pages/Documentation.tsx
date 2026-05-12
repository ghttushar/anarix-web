import { Link } from "react-router-dom";
import { SectionLabel } from "../components/SectionLabel";

const SECTIONS = [
  {
    title: "Getting Started",
    docs: [
      { label: "Welcome to Anarix", to: "#" },
      { label: "Connecting Amazon", to: "#" },
      { label: "Connecting Walmart", to: "#" },
      { label: "Inviting your team", to: "#" },
    ],
  },
  {
    title: "Modules",
    docs: [
      { label: "Profitability", to: "/website/products/profitability" },
      { label: "Advertising", to: "/website/products/advertising" },
      { label: "Rule Automation", to: "/website/products/rule-automation" },
      { label: "Campaign Manager", to: "/website/products/campaign-manager" },
      { label: "Impact Analysis", to: "/website/products/impact-analysis" },
    ],
  },
  {
    title: "Aan AI",
    docs: [
      { label: "What Aan can do", to: "/website/aan-ai" },
      { label: "Safety model", to: "#" },
      { label: "Drafts vs. Apply", to: "#" },
    ],
  },
  {
    title: "Reference",
    docs: [
      { label: "Keyboard shortcuts", to: "#" },
      { label: "API & integrations", to: "#" },
      { label: "Changelog", to: "#" },
    ],
  },
];

export default function Documentation() {
  return (
    <section className="px-6 pb-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <SectionLabel>Documentation</SectionLabel>
          <h1 className="mt-3 font-[Satoshi] text-5xl font-semibold tracking-tight text-foreground md:text-6xl">
            Learn how to operate Anarix.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            Step-by-step guides for every module, with Aan available on every page to answer questions.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {SECTIONS.map((s) => (
            <div key={s.title} className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-[Satoshi] text-lg font-semibold text-foreground">{s.title}</h2>
              <ul className="mt-4 space-y-2">
                {s.docs.map((d) => (
                  <li key={d.label}>
                    <Link to={d.to} className="text-sm text-foreground/80 hover:text-primary">
                      {d.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">Can't find what you need?</p>
          <Link to="/website/aan-ai" className="mt-3 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Ask Aan
          </Link>
        </div>
      </div>
    </section>
  );
}
