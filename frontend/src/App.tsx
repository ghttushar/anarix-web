import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { BrandingProvider } from "@/contexts/BrandingContext";
import { ActivePanelProvider } from "@/contexts/ActivePanelContext";
import { TrialProvider } from "@/contexts/TrialContext";
import { BillingFlowProvider } from "@/contexts/BillingFlowContext";
import { AanProvider } from "@/components/aan/AanContext";
import { Toaster } from "sonner";
import WebsiteLayout from "@/website/WebsiteLayout";
import WebsiteHome from "@/website/pages/Home";
import WebsiteProduct from "@/website/pages/Product";
import WebsiteAan from "@/website/pages/AanPage";
import WebsiteMcp from "@/website/pages/McpPage";
import WebsiteSignals from "@/website/pages/SignalsPage";
import WebsitePricing from "@/website/pages/Pricing";
import WebsiteDocumentation from "@/website/pages/Documentation";
import WebsiteDemo from "@/website/pages/Demo";
import WebsiteAbout from "@/website/pages/company/About";
import WebsiteCareer from "@/website/pages/company/Career";
import WebsiteContact from "@/website/pages/company/Contact";
import WebsitePrivacyPolicy from "@/website/pages/legal/PrivacyPolicy";
import WebsiteTermsAndConditions from "@/website/pages/legal/TermsAndConditions";
import WebsiteCancelPlan from "@/website/pages/CancelPlan";
import WebsiteDowngradePlan from "@/website/pages/DowngradePlan";

/** Keeps old /website/* URLs working after the move to root paths. */
function LegacyWebsiteRedirect() {
  const { pathname, search } = useLocation();
  const target = pathname.replace(/^\/website(?:\/(.*))?$/, (_match, rest: string | undefined) =>
    rest ? `/${rest}` : "/"
  );
  return <Navigate to={target + search} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/website/*" element={<LegacyWebsiteRedirect />} />
      <Route path="/products/*" element={<Navigate to="/product" replace />} />

      <Route path="/" element={<WebsiteLayout />}>
        <Route index element={<WebsiteHome />} />
        <Route path="product" element={<WebsiteProduct />} />
        <Route path="aan-ai" element={<WebsiteAan />} />
        <Route path="mcp" element={<WebsiteMcp />} />
        <Route path="signals" element={<WebsiteSignals />} />
        <Route path="pricing" element={<WebsitePricing />} />
        <Route path="documentation" element={<WebsiteDocumentation />} />
        <Route path="demo" element={<WebsiteDemo />} />
        <Route path="company" element={<Navigate to="/company/about" replace />} />
        <Route path="company/about" element={<WebsiteAbout />} />
        <Route path="company/career" element={<WebsiteCareer />} />
        <Route path="company/contact" element={<WebsiteContact />} />
        <Route path="privacy-policy" element={<WebsitePrivacyPolicy />} />
        <Route path="terms-and-conditions" element={<WebsiteTermsAndConditions />} />
        <Route path="cancel-plan" element={<WebsiteCancelPlan />} />
        <Route path="downgrade-plan" element={<WebsiteDowngradePlan />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

const App = () => (
  <ThemeProvider>
    <BrandingProvider>
      <ActivePanelProvider>
        <TrialProvider>
          <BillingFlowProvider>
            <AanProvider>
              <Toaster position="bottom-left" />
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </AanProvider>
          </BillingFlowProvider>
        </TrialProvider>
      </ActivePanelProvider>
    </BrandingProvider>
  </ThemeProvider>
);

export default App;
