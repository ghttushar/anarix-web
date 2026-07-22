import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

const navItems: Array<{
  label: string;
  href?: string;
  dropdown?: { label: string; href: string }[];
}> = [
  { label: "Product", href: "/website/product" },
  { label: "Pricing", href: "/website/pricing" },
  {
    label: "Company",
    dropdown: [
      { label: "About", href: "/website/company/about" },
      { label: "Careers", href: "/website/company/career" },
    ],
  },
  { label: "Contact Us", href: "/website/company/contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <nav
        className={`grid grid-cols-[auto_1fr_auto] items-center px-6 py-3 w-full max-w-6xl rounded-pill border backdrop-blur-xl transition-all duration-500 ${
          scrolled
            ? "bg-surface-elevated/95 shadow-medium border-border/80"
            : "bg-surface-elevated/60 shadow-soft border-border/30"
        }`}
      >
        {/* Logo */}
        <Link to="/website" className="text-xl font-bold text-foreground tracking-tight whitespace-nowrap">
          Anarix<span className="text-primary">.ai</span>
        </Link>

        {/* Desktop Nav - centered */}
        <div className="hidden lg:flex items-center justify-center gap-0.5">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => item.dropdown && setOpenDropdown(item.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              {item.href ? (
                <Link
                  to={item.href}
                  className="relative flex items-center gap-1 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-lg group"
                >
                  {item.label}
                  <span className="absolute bottom-0.5 left-3 right-3 h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
                </Link>
              ) : (
                <button
                  className="relative flex items-center gap-1 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-lg group"
                >
                  {item.label}
                  {item.dropdown && (
                    <ChevronDown
                      className="w-3.5 h-3.5 transition-transform duration-200"
                      style={{
                        transform: openDropdown === item.label ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    />
                  )}
                  <span className="absolute bottom-0.5 left-3 right-3 h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
                </button>
              )}

              {/* Dropdown */}
              <AnimatePresence>
                {item.dropdown && openDropdown === item.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-full left-0 mt-1 min-w-[180px] py-2 bg-surface-elevated rounded-xl border border-border shadow-medium z-50"
                  >
                    {item.dropdown.map((sub) => (
                      <Link
                        key={sub.label}
                        to={sub.href}
                        className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-150"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Right side */}
        <div className="hidden lg:flex items-center gap-2 justify-end">
          <Link
            to="/login"
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 group px-2"
          >
            Sign In
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
          <Link to="/website/demo">
            <Button
              className="rounded-pill px-6 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-strong active:translate-y-0 active:scale-[0.97] will-change-transform btn-shine"
            >
              Schedule Demo
            </Button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 text-foreground justify-self-end"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden mt-2 overflow-hidden bg-surface-elevated rounded-2xl border border-border shadow-medium"
          >
            <div className="p-4 space-y-1">
              {navItems.map((item) => (
                <div key={item.label}>
                  {item.href ? (
                    <Link
                      to={item.href}
                      className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-foreground rounded-lg hover:bg-accent transition-colors"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-foreground rounded-lg hover:bg-accent transition-colors"
                      onClick={() =>
                        item.dropdown &&
                        setOpenDropdown(openDropdown === item.label ? null : item.label)
                      }
                    >
                      {item.label}
                      {item.dropdown && (
                        <ChevronDown
                          className="w-4 h-4 transition-transform duration-200"
                          style={{
                            transform: openDropdown === item.label ? "rotate(180deg)" : "rotate(0deg)",
                          }}
                        />
                      )}
                    </button>
                  )}
                  <AnimatePresence>
                    {item.dropdown && openDropdown === item.label && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden pl-4"
                      >
                        {item.dropdown.map((sub) => (
                          <Link
                            key={sub.label}
                            to={sub.href}
                            className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
              <div className="pt-3 border-t border-border space-y-2">
                <Link to="/login" className="flex items-center gap-1 px-3 py-2 text-sm text-muted-foreground">
                  Sign In <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link to="/website/demo">
                  <Button className="w-full rounded-pill bg-primary text-primary-foreground">
                    Schedule Demo
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
