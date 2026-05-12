import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScheduleDemoModalProps {
  open: boolean;
  onClose: () => void;
}

const ScheduleDemoModal = ({ open, onClose }: ScheduleDemoModalProps) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-lg bg-card rounded-2xl border border-border shadow-strong overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-xl font-bold text-foreground">Schedule a Demo</h3>
              <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">First Name</label>
                    <input
                      required
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Last Name</label>
                    <input
                      required
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Work Email</label>
                  <input
                    required
                    type="email"
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="john@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Company</label>
                  <input
                    required
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="Acme Inc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Primary Platform</label>
                  <select
                    required
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    <option value="">Select platform…</option>
                    <option>Amazon</option>
                    <option>Walmart</option>
                    <option>D2C / Shopify</option>
                    <option>Social Commerce</option>
                    <option>Multiple / Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Monthly Ad Spend</label>
                  <select
                    required
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    <option value="">Select range…</option>
                    <option>Under $10K</option>
                    <option>$10K – $50K</option>
                    <option>$50K – $200K</option>
                    <option>$200K – $1M</option>
                    <option>$1M+</option>
                  </select>
                </div>
                <Button
                  type="submit"
                  className="w-full rounded-pill h-11 bg-primary text-primary-foreground hover:bg-primary/90 btn-shine"
                >
                  Book My Demo
                </Button>
              </form>
            ) : (
              <div className="p-12 text-center">
                <div className="text-4xl mb-4">🎉</div>
                <h4 className="text-lg font-bold text-foreground mb-2">You're all set!</h4>
                <p className="text-muted-foreground text-sm">
                  We'll reach out within 24 hours to confirm your demo time.
                </p>
                <Button onClick={onClose} variant="outline" className="mt-6 rounded-pill">
                  Close
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScheduleDemoModal;
