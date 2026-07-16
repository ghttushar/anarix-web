import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MarketplaceProvider } from "@/contexts/MarketplaceContext";
import { FilterProvider } from "@/contexts/FilterContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ColorSchemeProvider } from "@/contexts/ColorSchemeContext";
import { DensityProvider } from "@/contexts/DensityContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { AccountProvider, useAccounts } from "@/contexts/AccountContext";
import { IntegrationsProvider } from "@/contexts/IntegrationsContext";
import { VisualEffectsProvider } from "@/contexts/VisualEffectsContext";
import { FeatureToggleProvider } from "@/contexts/FeatureToggleContext";
import { BrandingProvider } from "@/contexts/BrandingContext";
import { BillingFlowProvider } from "@/contexts/BillingFlowContext";
import { TrialProvider } from "@/contexts/TrialContext";
import { ActivePanelProvider } from "@/contexts/ActivePanelContext";
import { AanProvider } from "@/components/aan";
import { InsightsProvider } from "@/components/insights";
import { CreativeFeatures } from "@/features/creative";
import { ViewportProvider } from "@/contexts/ViewportContext";
import { GestureProvider } from "@/contexts/GestureContext";
import { GestureFeedback } from "@/components/gestures/GestureFeedback";
import { TutorialProvider } from "@/features/tutorial/TutorialContext";
import { OnboardingTutorial } from "@/features/tutorial/OnboardingTutorial";
import TabletRedirect from "@/views/tablet/TabletRedirect";
import MobileRedirect from "@/views/mobile/MobileRedirect";
import MobileGate from "@/views/mobile/MobileGate";
import { toast } from "sonner";
import NotFound from "./pages/NotFound";
import AlertsPage from "./pages/Alerts";


// Living OS — supervisory workspace (isolated, no app chrome)
import LivingOSWorkspace from "./pages/livingos/Workspace";


// Auth & Onboarding
import Login from "./pages/auth/Login";
import ConnectAccounts from "./pages/onboarding/ConnectAccounts";

// Advertising
import CampaignManager from "./pages/advertising/CampaignManager";
import ImpactAnalysis from "./pages/advertising/ImpactAnalysis";
import ImpactCampaignDetail from "./pages/advertising/ImpactCampaignDetail";
import ImpactAdGroupDetail from "./pages/advertising/ImpactAdGroupDetail";
import TargetingActions from "./pages/advertising/TargetingActions";
import AdvCampaignDetail from "./pages/advertising/CampaignDetail";
import AdGroupDetail from "./pages/advertising/AdGroupDetail";
import ProductAdDetail from "./pages/advertising/ProductAdDetail";
import BudgetPacing from "./pages/advertising/BudgetPacing";
import SearchHarvesting from "./pages/advertising/SearchHarvesting";
import AnomalyAlerts from "./pages/advertising/AnomalyAlerts";
import CreativeAnalyzer from "./pages/advertising/CreativeAnalyzer";
import RuleAgents from "./pages/advertising/RuleAgents";
import RuleCreation from "./pages/advertising/RuleCreation";
import AppliedRules from "./pages/advertising/AppliedRules";

// Profitability
import ProfitabilityDashboard from "./pages/profitability/Dashboard";
import ProfitabilityTrends from "./pages/profitability/Trends";
import ProfitLoss from "./pages/profitability/ProfitLoss";
import Geographical from "./pages/profitability/Geographical";
import UnifiedPnL from "./pages/profitability/UnifiedPnL";

// Catalog
import CatalogProducts from "./pages/catalog/Products";
import InventoryAds from "./pages/catalog/InventoryAds";

// Business Intelligence
import BrandSOV from "./pages/bi/BrandSOV";
import KeywordTracker from "./pages/bi/KeywordTracker";
import KeywordSOV from "./pages/bi/KeywordSOV";
import ProductSOV from "./pages/bi/ProductSOV";
import CompetitorPricing from "./pages/bi/CompetitorPricing";

// AMC
import AMCQueries from "./pages/amc/Queries";
import AMCExecutedQueries from "./pages/amc/ExecutedQueries";
import AMCSchedules from "./pages/amc/Schedules";
import AMCAudiences from "./pages/amc/Audiences";
import AMCCreatedAudiences from "./pages/amc/CreatedAudiences";
import AMCInstances from "./pages/amc/Instances";

// Day Parting
import HourlyData from "./pages/dayparting/HourlyData";
import WorkspaceDashboard from "./pages/workspace/Dashboard";
import HealthScore from "./pages/workspace/HealthScore";
import ClientPortal from "./pages/reports/ClientPortal";

// Aan
import AanWorkspacePage from "./pages/aan/Workspace";
import AanFeedPage from "./pages/aan/Feed";
import AanPoliciesPage from "./pages/aan/Policies";
import AanTriggersPage from "./pages/settings/AanTriggers";
import { AanEventsProvider } from "@/components/aan/autonomous/AanEventsContext";
import PanelIndex, {
  AanInboxPanelRoute,
  AanInboxMorningRoute,
  AanInboxMeetingActionsRoute,
  AanInboxCardRoute,
  AanArtifactRoute,
  InsightsPanelRoute,
  NotificationsPanelRoute,
} from "./pages/panels/PanelRoute";
import TrialStateRoute from "./pages/_dev/TrialStateRoute";

// Settings
import Preferences from "./pages/settings/Preferences";
import MobileProfile from "./views/mobile/MobileProfile";
import Accounts from "./pages/settings/Accounts";
import ConnectAmazon from "./pages/settings/ConnectAmazon";
import ConnectWalmart from "./pages/settings/ConnectWalmart";
import SettingsTeam from "./pages/settings/Team";
import SettingsSystem from "./pages/settings/System";
import DesignSystem from "./pages/settings/DesignSystem";
import ComponentLibrary from "./pages/settings/ComponentLibrary";
import Integrations from "./pages/settings/Integrations";
import Billing from "./pages/settings/Billing";

// Brand
import AanMascotShowcase from "./pages/brand/AanMascotShowcase";

// Website
import WebsiteLayout from "./website/WebsiteLayout";
import WebsiteHome from "./website/pages/Home";
import WebsiteAanAI from "./website/pages/AanAI";
import WebsitePricing from "./website/pages/Pricing";
import WebsiteDocumentation from "./website/pages/Documentation";
import WebsiteAbout from "./website/pages/company/About";
import WebsiteCareer from "./website/pages/company/Career";
import WebsiteContact from "./website/pages/company/Contact";
import WebsiteDemo from "./website/pages/Demo";
import WebsiteProductProfitability from "./website/pages/products/Profitability";
import WebsiteProductAdvertising from "./website/pages/products/Advertising";
import WebsiteProductAutomation from "./website/pages/products/Automation";
import WebsiteProductManagedServices from "./website/pages/products/ManagedServices";
import WebsitePrivacyPolicy from "./website/pages/legal/PrivacyPolicy";
import WebsiteTermsAndConditions from "./website/pages/legal/TermsAndConditions";
import WebsiteCancelPlan from "./website/pages/CancelPlan";
import WebsiteDowngradePlan from "./website/pages/DowngradePlan";

const queryClient = new QueryClient();

function WelcomeToasts() {
  const { hasAccounts } = useAccounts();

  useEffect(() => {
    if (hasAccounts) {
      const timer1 = setTimeout(() => {
        toast.success("Welcome to Anarix! Your data is syncing...");
      }, 2000);

      const timer2 = setTimeout(() => {
        toast.info("💡 Tip: Press ⌘K to open the command palette", {
          duration: 5000,
        });
      }, 8000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [hasAccounts]);

  return null;
}

function AppRoutes() {
  const { hasAccounts, isOnboarding } = useAccounts();

  return (
    <Routes>
      <Route
        path="/"
        element={
          isOnboarding && !hasAccounts ? (
            <Navigate to="/login" replace />
          ) : (
            <Navigate to="/profitability/dashboard" replace />
          )
        }
      />

      {/* Auth & Onboarding */}
      <Route path="/login" element={<Login />} />
      <Route path="/onboarding/connect" element={<MobileGate title="Connect on desktop" description="Account connection isn't available on mobile."><ConnectAccounts /></MobileGate>} />

      {/* Viewport variants — Phase 1 scaffold. Tablet/Mobile screens land in later phases. */}
      <Route path="/desktop" element={<Navigate to="/profitability/dashboard" replace />} />
      <Route path="/desktop/*" element={<Navigate to="/profitability/dashboard" replace />} />
      <Route path="/tablet" element={<TabletRedirect />} />
      <Route path="/tablet/*" element={<TabletRedirect />} />
      <Route path="/mobile" element={<MobileRedirect />} />
      <Route path="/mobile/*" element={<MobileRedirect />} />

      {/* Living OS — supervisory workspace. Fully isolated: no app chrome. */}
      <Route path="/livingos" element={<LivingOSWorkspace />} />
      <Route path="/livingos/*" element={<LivingOSWorkspace />} />



      {/* Hidden dev utility: pin a trial state and render any nav-bar page underneath */}
      <Route path="/_state/:state/*" element={<TrialStateRoute />} />

      {/* Sandbox */}
      <Route path="/workspace" element={<MobileGate title="Dashboard builder is desktop-only"><WorkspaceDashboard /></MobileGate>} />
      <Route path="/workspace/:dashboardId" element={<MobileGate title="Dashboard builder is desktop-only"><WorkspaceDashboard /></MobileGate>} />
      <Route path="/workspace/health-score" element={<HealthScore />} />

      {/* Profitability */}
      <Route path="/profitability/dashboard" element={<ProfitabilityDashboard />} />
      <Route path="/profitability/dashboard/:tab" element={<ProfitabilityDashboard />} />
      <Route path="/profitability/trends" element={<ProfitabilityTrends />} />
      <Route path="/profitability/pnl" element={<ProfitLoss />} />
      <Route path="/profitability/geo" element={<Geographical />} />
      <Route path="/profitability/unified-pnl" element={<UnifiedPnL />} />

      {/* Advertising */}
      <Route path="/advertising/campaigns" element={<CampaignManager />} />
      <Route path="/advertising/campaigns/:campaignId" element={<AdvCampaignDetail />} />
      <Route path="/advertising/campaigns/:campaignId/:adGroupId" element={<AdGroupDetail />} />
      <Route path="/advertising/campaigns/:campaignId/:adGroupId/:productAdId" element={<ProductAdDetail />} />
      <Route path="/advertising/impact" element={<ImpactAnalysis />} />
      <Route path="/advertising/impact/campaigns/:campaignId" element={<ImpactCampaignDetail />} />
      <Route path="/advertising/impact/campaigns/:campaignId/:adGroupId" element={<ImpactAdGroupDetail />} />
      <Route path="/advertising/targeting" element={<TargetingActions />} />
      <Route path="/advertising/budget-pacing" element={<BudgetPacing />} />
      <Route path="/advertising/search-harvesting" element={<SearchHarvesting />} />
      <Route path="/advertising/anomaly-alerts" element={<AnomalyAlerts />} />
      <Route path="/advertising/creative-analyzer" element={<CreativeAnalyzer />} />
      <Route path="/advertising/rules/agents" element={<RuleAgents />} />
      <Route path="/advertising/rules/applied" element={<AppliedRules />} />
      <Route path="/advertising/rules/create" element={<MobileGate title="Rule creation is desktop-only"><RuleCreation /></MobileGate>} />
      <Route path="/advertising/rules/create/:templateId" element={<MobileGate title="Rule creation is desktop-only"><RuleCreation /></MobileGate>} />
      <Route path="/advertising/rules/edit/:ruleId" element={<MobileGate title="Rule editing is desktop-only"><RuleCreation /></MobileGate>} />

      {/* Catalog */}
      <Route path="/catalog/products" element={<CatalogProducts />} />
      <Route path="/catalog/inventory-ads" element={<InventoryAds />} />

      {/* Business Intelligence */}
      <Route path="/bi/brand-sov" element={<BrandSOV />} />
      <Route path="/bi/keyword-tracker" element={<KeywordTracker />} />
      <Route path="/bi/keyword-sov" element={<KeywordSOV />} />
      <Route path="/bi/product-sov" element={<ProductSOV />} />
      <Route path="/bi/competitor-pricing" element={<CompetitorPricing />} />

      {/* AMC */}
      <Route path="/amc/queries" element={<AMCQueries />} />
      <Route path="/amc/executed" element={<AMCExecutedQueries />} />
      <Route path="/amc/schedules" element={<AMCSchedules />} />
      <Route path="/amc/audiences" element={<AMCAudiences />} />
      <Route path="/amc/created-audiences" element={<AMCCreatedAudiences />} />
      <Route path="/amc/instances" element={<AMCInstances />} />

      {/* Day Parting */}
      <Route path="/dayparting" element={<HourlyData />} />
      <Route path="/dayparting/hourly" element={<Navigate to="/dayparting" replace />} />
      <Route path="/dayparting/campaigns" element={<Navigate to="/dayparting" replace />} />
      <Route path="/dayparting/campaigns/:campaignId" element={<Navigate to="/dayparting" replace />} />
      <Route path="/dayparting/history" element={<HourlyData />} />
      <Route path="/dayparting/scheduled" element={<Navigate to="/dayparting" replace />} />
      <Route path="/dayparting/scheduled/*" element={<Navigate to="/dayparting" replace />} />

      {/* Aan */}
      <Route path="/aan" element={<AanWorkspacePage />} />
      <Route path="/aan/feed" element={<AanFeedPage />} />
      <Route path="/aan/policies" element={<AanPoliciesPage />} />

      {/* Reports */}
      <Route path="/reports/client-portal" element={<ClientPortal />} />

      {/* Signals (formerly Alerts) — full-screen workspace */}
      <Route path="/signals" element={<Navigate to="/alerts/stack" replace />} />
      <Route path="/signals/*" element={<Navigate to="/alerts/stack" replace />} />
      <Route path="/alerts" element={<Navigate to="/alerts/stack" replace />} />
      <Route path="/alerts/:viewMode" element={<AlertsPage />} />




      {/* Standalone panel routes — for figma export and shareable deep links */}
      <Route path="/panels" element={<PanelIndex />} />
      <Route path="/panels/aan-inbox" element={<AanInboxPanelRoute />} />
      <Route path="/panels/aan-inbox/morning" element={<AanInboxMorningRoute />} />
      <Route path="/panels/aan-inbox/meeting-actions" element={<AanInboxMeetingActionsRoute />} />
      <Route path="/panels/aan-inbox/card/:scenarioId" element={<AanInboxCardRoute />} />
      <Route path="/panels/aan-inbox/details/:scenarioId" element={<AanArtifactRoute />} />
      <Route path="/panels/insights" element={<InsightsPanelRoute />} />
      <Route path="/panels/notifications" element={<NotificationsPanelRoute />} />


      {/* Settings */}
      <Route path="/settings/appearance" element={<Preferences />} />
      <Route path="/profile" element={<MobileProfile />} />
      <Route path="/settings/accounts" element={<MobileGate title="Manage accounts on desktop"><Accounts /></MobileGate>} />
      <Route path="/settings/integrations" element={<MobileGate title="Integrations are desktop-only"><Integrations /></MobileGate>} />
      <Route path="/settings/accounts/connect/amazon" element={<MobileGate title="Connect on desktop"><ConnectAmazon /></MobileGate>} />
      <Route path="/settings/accounts/connect/walmart" element={<MobileGate title="Connect on desktop"><ConnectWalmart /></MobileGate>} />
      <Route path="/settings/team" element={<MobileGate title="Team settings are desktop-only"><SettingsTeam /></MobileGate>} />
      <Route path="/settings/system" element={<SettingsSystem />} />
      <Route path="/settings/aan-triggers" element={<AanTriggersPage />} />
      <Route path="/settings/design-system" element={<DesignSystem />} />
      <Route path="/settings/design-system/:tab" element={<DesignSystem />} />
      <Route path="/settings/component-library" element={<ComponentLibrary />} />
      <Route path="/settings/component-library/:section" element={<ComponentLibrary />} />
      <Route path="/settings/billing" element={<MobileGate title="Billing is desktop-only"><Billing /></MobileGate>} />
      <Route path="/settings/billing/:tab" element={<MobileGate title="Billing is desktop-only"><Billing /></MobileGate>} />

      <Route path="/brand/aan" element={<AanMascotShowcase />} />

      {/* Marketing website */}
      <Route path="/website" element={<WebsiteLayout />}>
        <Route index element={<WebsiteHome />} />
        <Route path="aan-ai" element={<WebsiteAanAI />} />
        <Route path="pricing" element={<WebsitePricing />} />
        <Route path="documentation" element={<WebsiteDocumentation />} />
        <Route path="company" element={<Navigate to="/website/company/about" replace />} />
        <Route path="company/about" element={<WebsiteAbout />} />
        <Route path="company/career" element={<WebsiteCareer />} />
        <Route path="company/contact" element={<WebsiteContact />} />
        <Route path="demo" element={<WebsiteDemo />} />
        <Route path="products/profitability" element={<WebsiteProductProfitability />} />
        <Route path="products/advertising" element={<WebsiteProductAdvertising />} />
        <Route path="products/automation" element={<WebsiteProductAutomation />} />
        <Route path="products/managed-services" element={<WebsiteProductManagedServices />} />
        <Route path="privacy-policy" element={<WebsitePrivacyPolicy />} />
        <Route path="terms-and-conditions" element={<WebsiteTermsAndConditions />} />
        <Route path="cancel-plan" element={<WebsiteCancelPlan />} />
        <Route path="downgrade-plan" element={<WebsiteDowngradePlan />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ViewportProvider>
    <ThemeProvider>
      <ColorSchemeProvider>
      <DensityProvider>
        <CurrencyProvider>
        <AccountProvider>
          <IntegrationsProvider>
          <MarketplaceProvider defaultMarketplace="walmart">
            <FilterProvider>
              <ActivePanelProvider>
                <AanProvider>
                  <AanEventsProvider>
                  <InsightsProvider>
                    <VisualEffectsProvider>
                      <FeatureToggleProvider>
                        <BrandingProvider>
                        <BillingFlowProvider>
                        <TrialProvider>
                        <TooltipProvider>
                          <Toaster />
                          <Sonner position="bottom-left" />
                          <BrowserRouter>
                            <TutorialProvider>
                              <GestureProvider>
                                <CreativeFeatures>
                                  <WelcomeToasts />
                                  <AppRoutes />
                                  
                                  <GestureFeedback />
                                  <OnboardingTutorial />
                                </CreativeFeatures>
                              </GestureProvider>
                            </TutorialProvider>
                          </BrowserRouter>
                        </TooltipProvider>
                        </TrialProvider>
                        </BillingFlowProvider>
                        </BrandingProvider>
                      </FeatureToggleProvider>
                    </VisualEffectsProvider>
                  </InsightsProvider>
                  </AanEventsProvider>
                </AanProvider>
              </ActivePanelProvider>
            </FilterProvider>
          </MarketplaceProvider>
          </IntegrationsProvider>
        </AccountProvider>
        </CurrencyProvider>
      </DensityProvider>
      </ColorSchemeProvider>
    </ThemeProvider>
    </ViewportProvider>
  </QueryClientProvider>
);

export default App;
