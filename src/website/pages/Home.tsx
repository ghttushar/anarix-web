import Navbar from "@/website/components/Navbar";
import HeroSection from "@/website/components/HeroSection";
import ImpactSection from "@/website/components/ImpactSection";
import TestimonialsSection from "@/website/components/TestimonialsSection";
import ProblemSection from "@/website/components/home/ProblemSection";
import SolutionsSection from "@/website/components/SolutionsSection";
import ProductPreviewBand from "@/website/components/home/ProductPreviewBand";
import InnovationBand from "@/website/components/home/InnovationBand";
import WorkflowSection from "@/website/components/home/WorkflowSection";
import CycloneScrollSection from "@/website/components/CycloneScrollSection";
import AuditCTASection from "@/website/components/AuditCTASection";
import Footer from "@/website/components/Footer";


const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ImpactSection />
      <CycloneScrollSection />
      <TestimonialsSection />
      <ProblemSection />
      <SolutionsSection />
      <ProductPreviewBand />
      <InnovationBand />
      <WorkflowSection />
      <AuditCTASection />
      <Footer />
    </div>
  );
};

export default Index;
