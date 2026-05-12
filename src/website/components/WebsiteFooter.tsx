import { NavLink } from "react-router-dom";
import { AnarixLogo } from "@/components/branding/AnarixLogo";
import { AanMascot } from "@/components/aan/AanMascot";

export function WebsiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-10 px-6 py-14 md:grid-cols-5">
        <div className="col-span-2">
          <div className="flex items-center gap-2">
            <AnarixLogo variant="full" className="h-7" />
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            The analytical operating system for Amazon and Walmart sellers. Built with Aan, the
            decision-support AI that drafts every action and never executes silently.
          </p>
          <div className="mt-6 inline-flex items-center gap-3">
            <AanMascot state="idle" size={28} interactive={false} staticEyes />
            <span className="text-xs text-muted-foreground">Aan, by Anarix</span>
          </div>
        </div>

        <FooterCol
          title="Product"
          items={[
            ["Profitability", "/website/product"],
            ["Advertising", "/website/product"],
            ["Aan AI", "/website/aan"],
            ["Pricing", "/website/pricing"],
          ]}
        />
        <FooterCol
          title="Resources"
          items={[
            ["Docs", "/website/docs"],
            ["Customers", "/website/customers"],
            ["About", "/website/about"],
            ["Contact", "/website/contact"],
          ]}
        />
        <FooterCol
          title="Company"
          items={[
            ["About", "/website/about"],
            ["Open the app", "/profitability/dashboard"],
          ]}
        />
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Anarix. All rights reserved.</span>
          <span>Made with care. Powered by Aan.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">{title}</h4>
      <ul className="mt-4 space-y-2">
        {items.map(([label, to]) => (
          <li key={label}>
            <NavLink to={to} className="text-sm text-muted-foreground hover:text-foreground">
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
