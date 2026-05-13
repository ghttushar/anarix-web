import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useScrollReveal } from "@/hooks/useScrollReveal";

type Step = "url" | "loading" | "email" | "success";

const AuditCTASection = () => {
  const { ref, isVisible } = useScrollReveal();
  const [step, setStep] = useState<Step>("url");
  const [storeUrl, setStoreUrl] = useState("");
  const [email, setEmail] = useState("");

  const handleUrlSubmit = () => {
    if (!storeUrl.trim()) return;
    setStep("loading");
    setTimeout(() => setStep("email"), 2500);
  };

  const handleEmailSubmit = () => {
    if (!email.trim()) return;
    // TODO: Backend submission
    setStep("success");
  };

  return (
    <section ref={ref} className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <div
          className={`transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
        >
          <h2 className="font-display text-3xl sm:text-4xl lg:text-6xl font-semibold text-foreground mb-4 tracking-tight leading-[1.05]">
            Get your <span className="text-gradient-primary italic">free margin audit</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-10">
            See exactly where your marketplace P&amp;L is leaking. Takes 30 seconds.
          </p>
        </div>

        <div
          className={`max-w-md mx-auto transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
        >
          <AnimatePresence mode="wait">
            {step === "url" && (
              <motion.div
                key="url"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex gap-3"
              >
                <Input
                  placeholder="Enter your store URL..."
                  value={storeUrl}
                  onChange={(e) => setStoreUrl(e.target.value)}
                  className="rounded-pill h-12"
                  onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
                />
                <Button
                  onClick={handleUrlSubmit}
                  className="rounded-pill h-12 px-6 bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-strong transition-all duration-200 active:translate-y-0 active:scale-[0.98]"
                >
                  Start <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            )}

            {step === "loading" && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center gap-4 py-8"
              >
                <Loader2 className="w-8 h-8 text-primary text-[#f26e76] animate-spin" />
                <p className="text-muted-foreground">Analyzing your store...</p>
              </motion.div>
            )}

            {step === "email" && (
              <motion.div
                key="email"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                <p className="text-sm text-muted-foreground mb-2">
                  Your audit is ready! Where should we send it?
                </p>
                <div className="flex gap-3">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-pill h-12"
                    onKeyDown={(e) => e.key === "Enter" && handleEmailSubmit()}
                  />
                  <Button
                    onClick={handleEmailSubmit}
                    className="rounded-pill h-12 px-6 bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-strong transition-all duration-200 active:translate-y-0 active:scale-[0.98]"
                  >
                    Send <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-3 py-8"
              >
                <CheckCircle2 className="w-10 h-10 text-primary text-[#f26e76]" />
                <p className="text-foreground font-semibold">Your audit will be ready in 30 minutes!</p>
                <p className="text-sm text-muted-foreground">Check your inbox shortly.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default AuditCTASection;
