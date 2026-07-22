import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/website/components/Navbar";
import HeroSectionNew from "@/website/components/home/HeroSectionNew";
import PainPointsSection from "@/website/components/home/PainPointsSection";
import TestimonialsWrapper from "@/website/components/home/TestimonialsWrapper";
import ProcessSteps from "@/website/components/home/ProcessSteps";
import PhilosophySection from "@/website/components/home/PhilosophySection";
import ServicesGrid from "@/website/components/home/ServicesGrid";
import ScrollProgress from "@/website/components/ScrollProgress";
import Footer from "@/website/components/Footer";
import ScrollToTop from "@/website/components/ScrollToTop";
import { ArrowRight } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <ScrollProgress />

      <HeroSectionNew />

      <PainPointsSection />

      <TestimonialsWrapper />

      <ProcessSteps />

      <PhilosophySection />

      <ServicesGrid />

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
              Ready?
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight leading-[1.1] mb-4">
              Hand it over.{" "}
              <span className="text-gradient-primary">We&apos;ve got the night shift.</span>
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Start with a free audit. We&apos;ll show you what your account is losing before you pay a thing.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/website/demo">
                <Button size="lg" className="rounded-pill px-8 h-12 text-base bg-primary text-primary-foreground hover:bg-primary/90 btn-shine group">
                  Hand it over
                  <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
              <Link to="/website/product">
                <Button size="lg" variant="outline" className="rounded-pill px-8 h-12 text-base border-border hover:border-primary/40 transition-all duration-200">
                  Explore the Platform
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Home;
