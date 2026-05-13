import Navbar from "@/website/components/Navbar";
import Footer from "@/website/components/Footer";
import ScrollToTop from "@/website/components/ScrollToTop";

const PageLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="pt-28 pb-16">{children}</main>
    <Footer />
    <ScrollToTop />
  </div>
);

export default PageLayout;
