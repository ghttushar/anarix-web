import { Link, NavLink } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { AnarixWordmark } from "./AnarixWordmark";
import { ThemeToggle } from "./ThemeToggle";
import { NavDropdown } from "./NavDropdown";
import { cn } from "@/lib/utils";

const PRODUCTS = [
  { label: "Profitability Dashboard", to: "/website/products/profitability", description: "SKU-level contribution margin" },
  { label: "Advertising Intelligence", to: "/website/products/advertising", description: "Bids, budgets, pacing" },
  { label: "Rule Automation", to: "/website/products/rule-automation", description: "Approve, schedule, audit" },
  { label: "Campaign Manager", to: "/website/products/campaign-manager", description: "Table-first control" },
  { label: "Impact Analysis", to: "/website/products/impact-analysis", description: "What actually moved" },
  { label: "Share of Voice", to: "/website/products/share-of-voice", description: "Visibility and ranking" },
  { label: "Master Dashboard", to: "/website/products/master-dashboard", description: "Compose your own view" },
  { label: "Enterprise Reporting", to: "/website/products/enterprise-reporting", description: "Audit-ready deliveries" },
];

const COMPANY = [
  { label: "About", to: "/website/company", description: "Mission and team" },
  { label: "Customers", to: "/website/company#customers", description: "Brands using Anarix" },
  { label: "Contact", to: "/website/demo", description: "Talk to us" },
];

export function PillNav() {
  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <div className="flex w-full max-w-[1120px] items-center justify-between gap-4 rounded-full border border-border/60 bg-card/95 px-3 py-2 shadow-[0_4px_24px_-8px_rgba(15,16,32,0.12)]">
        <div className="pl-3">
          <AnarixWordmark />
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          <NavDropdown label="Products" items={PRODUCTS} />
          <PillLink to="/website/aan-ai">Aan AI</PillLink>
          <PillLink to="/website/pricing">Pricing</PillLink>
          <PillLink to="/website/documentation">Documentation</PillLink>
          <NavDropdown label="Company" items={COMPANY} />
        </nav>

        <div className="flex items-center gap-1 pr-1">
          <ThemeToggle />
          <Link
            to="/login"
            className="hidden md:inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Sign In <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            to="/website/demo"
            className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Schedule Demo
          </Link>
        </div>
      </div>
    </header>
  );
}

function PillLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
          isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
        )
      }
    >
      {children}
    </NavLink>
  );
}
