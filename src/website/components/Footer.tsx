import { Link } from "react-router-dom";
import { AnarixWordmark } from "./AnarixWordmark";

const COLS = [
  {
    title: "Product",
    links: [
      { label: "Profitability", to: "/website/products/profitability" },
      { label: "Advertising", to: "/website/products/advertising" },
      { label: "Rule Automation", to: "/website/products/rule-automation" },
      { label: "Campaign Manager", to: "/website/products/campaign-manager" },
      { label: "Aan AI", to: "/website/aan-ai" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/website/company" },
      { label: "Pricing", to: "/website/pricing" },
      { label: "Documentation", to: "/website/documentation" },
      { label: "Schedule Demo", to: "/website/demo" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", to: "/website/documentation" },
      { label: "Aan AI", to: "/website/aan-ai" },
      { label: "Open App", to: "/profitability/dashboard" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative z-10 mt-24 border-t border-border/60 bg-background/40">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-14 md:grid-cols-[1.2fr_repeat(3,1fr)]">
        <div>
          <AnarixWordmark />
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            The AI operating layer for marketplace profitability.
          </p>
        </div>
        {COLS.map((c) => (
          <div key={c.title}>
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{c.title}</div>
            <ul className="space-y-2">
              {c.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-foreground/80 hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Anarix. All rights reserved.</span>
          <span>Made for operators.</span>
        </div>
      </div>
    </footer>
  );
}
