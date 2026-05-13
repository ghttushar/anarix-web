import { Link } from "react-router-dom";

const footerLinks: Record<string, { label: string; href: string }[]> = {
  Products: [
    { label: "Profitability", href: "/website/products/profitability" },
    { label: "Advertising", href: "/website/products/advertising" },
    { label: "Automation", href: "/website/products/automation" },
    { label: "Managed Services", href: "/website/products/managed-services" },
  ],
  Platform: [
    { label: "Aan AI", href: "/website/aan-ai" },
    { label: "Pricing", href: "/website/pricing" },
    { label: "Documentation", href: "/website/documentation" },
  ],
  Company: [
    { label: "About", href: "/website/company/about" },
    { label: "Careers", href: "/website/company/career" },
    { label: "Contact", href: "/website/company/contact" },
  ],
  Account: [
    { label: "Sign In", href: "/login" },
    { label: "Schedule Demo", href: "/website/demo" },
  ],
};


const Footer = () => {
  return (
    <footer className="px-6 pb-6">
      <div className="max-w-6xl mx-auto bg-card rounded-3xl border border-border shadow-soft p-10 sm:p-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <Link to="/website" className="text-2xl font-display font-semibold text-foreground tracking-tight">
              Anarix<span className="text-coral">.</span>ai
            </Link>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              The complete growth platform for marketplace profitability.
            </p>
            <div className="flex gap-2 mt-5 flex-wrap">
              {badges.map((b) => (
                <div
                  key={b.label}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-pill bg-muted/60 border border-border/50"
                  title={b.label}
                >
                  <b.icon className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[10px] font-medium text-muted-foreground tracking-wide">{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Anarix. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link to="/website/privacy-policy" className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-300">
              Privacy
            </Link>
            <Link to="/website/terms-and-conditions" className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-300">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
