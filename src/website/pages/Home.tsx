import Navbar from "@/website/components/Navbar";
import HeroSection from "@/website/components/HeroSection";
import SocialProofSection from "@/website/components/SocialProofSection";
import ImpactSection from "@/website/components/ImpactSection";
import SolutionsSection from "@/website/components/SolutionsSection";
import TestimonialsSection from "@/website/components/TestimonialsSection";
import AuditCTASection from "@/website/components/AuditCTASection";
import Footer from "@/website/components/Footer";
import ScrollToTop from "@/website/components/ScrollToTop";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <SocialProofSection />
      <ImpactSection />
      <SolutionsSection />
      <TestimonialsSection />
      <AuditCTASection />
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;
