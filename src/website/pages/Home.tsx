import Navbar from "@/website/components/Navbar";
import HeroSection from "@/website/components/HeroSection";
import SocialProofSection from "@/website/components/SocialProofSection";
import StatBand from "@/website/components/home/StatBand";
import ProblemSection from "@/website/components/home/ProblemSection";
import SolutionsSection from "@/website/components/SolutionsSection";
import ProductPreviewBand from "@/website/components/home/ProductPreviewBand";
import WorkflowSection from "@/website/components/home/WorkflowSection";
import ImpactSection from "@/website/components/ImpactSection";
import TestimonialsSection from "@/website/components/TestimonialsSection";
import IntegrationOrbit from "@/website/components/IntegrationOrbit";
import AuditCTASection from "@/website/components/AuditCTASection";
import Footer from "@/website/components/Footer";
import ScrollToTop from "@/website/components/ScrollToTop";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <SocialProofSection />
      <StatBand />
      <ProblemSection />
      <SolutionsSection />
      <ProductPreviewBand />
      <WorkflowSection />
      <ImpactSection />
      <TestimonialsSection />
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <IntegrationOrbit />
        </div>
      </section>
      <AuditCTASection />
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;
