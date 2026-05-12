import { NavLink, useNavigate } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { AnarixLogo } from "@/components/branding/AnarixLogo";
import { WebsiteThemeToggle } from "./WebsiteThemeToggle";
import { cn } from "@/lib/utils";

const LINKS = [
  { to: "/website/product", label: "Product" },
  { to: "/website/aan", label: "Aan" },
  { to: "/website/pricing", label: "Pricing" },
  { to: "/website/customers", label: "Customers" },
  { to: "/website/docs", label: "Docs" },
  { to: "/website/about", label: "About" },
];

export function WebsiteNav() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-6 px-6">
        <NavLink to="/website" className="flex items-center gap-2">
          <AnarixLogo variant="full" className="h-7" />
        </NavLink>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-foreground bg-secondary/10"
                    : l.label === "Aan"
                    ? "text-primary hover:text-primary/80"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/5"
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <WebsiteThemeToggle />
          <button
            onClick={() => navigate("/profitability/dashboard")}
            className="hidden md:inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Open App <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
          <button
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/60 bg-background">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-4 py-3">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-2 text-sm font-medium",
                    isActive ? "bg-secondary/10 text-foreground" : "text-muted-foreground"
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
            <button
              onClick={() => {
                setOpen(false);
                navigate("/profitability/dashboard");
              }}
              className="mt-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
            >
              Open App
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
