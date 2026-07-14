import { useEffect } from "react";
import { useParams, Routes, Route, Navigate } from "react-router-dom";
import { useTrial, TrialState } from "@/contexts/TrialContext";
import { useBillingFlow } from "@/contexts/BillingFlowContext";

// Profitability
import ProfitabilityDashboard from "@/pages/profitability/Dashboard";
import ProfitabilityTrends from "@/pages/profitability/Trends";
import ProfitLoss from "@/pages/profitability/ProfitLoss";
import Geographical from "@/pages/profitability/Geographical";
import UnifiedPnL from "@/pages/profitability/UnifiedPnL";

// Workspace
import WorkspaceDashboard from "@/pages/workspace/Dashboard";
import HealthScore from "@/pages/workspace/HealthScore";

// Advertising
import CampaignManager from "@/pages/advertising/CampaignManager";
import ImpactAnalysis from "@/pages/advertising/ImpactAnalysis";
import TargetingActions from "@/pages/advertising/TargetingActions";
import BudgetPacing from "@/pages/advertising/BudgetPacing";
import SearchHarvesting from "@/pages/advertising/SearchHarvesting";
import AnomalyAlerts from "@/pages/advertising/AnomalyAlerts";
import CreativeAnalyzer from "@/pages/advertising/CreativeAnalyzer";
import RuleAgents from "@/pages/advertising/RuleAgents";
import AppliedRules from "@/pages/advertising/AppliedRules";

// Catalog
import CatalogProducts from "@/pages/catalog/Products";
import InventoryAds from "@/pages/catalog/InventoryAds";

// AMC
import AMCQueries from "@/pages/amc/Queries";
import AMCExecutedQueries from "@/pages/amc/ExecutedQueries";
import AMCSchedules from "@/pages/amc/Schedules";
import AMCAudiences from "@/pages/amc/Audiences";
import AMCCreatedAudiences from "@/pages/amc/CreatedAudiences";
import AMCInstances from "@/pages/amc/Instances";

// BI
import BrandSOV from "@/pages/bi/BrandSOV";
import KeywordTracker from "@/pages/bi/KeywordTracker";
import KeywordSOV from "@/pages/bi/KeywordSOV";
import ProductSOV from "@/pages/bi/ProductSOV";
import CompetitorPricing from "@/pages/bi/CompetitorPricing";

// Day Parting
import HourlyData from "@/pages/dayparting/HourlyData";

// Reports
import ClientPortal from "@/pages/reports/ClientPortal";

const VALID: TrialState[] = ["none", "syncing", "active", "expired", "paid"];

/**
 * Hidden utility route: /_state/:state/*
 *
 * Pins the trial state to :state on every render (defeating TrialContext's
 * auto-progress timer) and renders the matching left-nav page at the wildcard
 * path. The URL stays stable (e.g. /_state/expired/advertising/campaigns),
 * which lets Figma's link-to-design plugin target every (state x page) combo.
 *
 * AppLayout's TrialStateGate handles the visual overlay automatically.
 */
export default function TrialStateRoute() {
  const { state } = useParams<{ state: string }>();
  const { trial, setTrial } = useTrial();
  const { billingFlowEnabled, setBillingFlow } = useBillingFlow();

  const target = (VALID.includes(state as TrialState) ? state : "none") as TrialState;

  useEffect(() => {
    if (!billingFlowEnabled) setBillingFlow(true);
  }, [billingFlowEnabled, setBillingFlow]);

  // Re-pin on every render to defeat TrialContext auto-progress timers.
  useEffect(() => {
    if (trial !== target) setTrial(target);
  });

  return (
    <Routes>
      {/* Default landing inside a state */}
      <Route index element={<Navigate to="profitability/dashboard" replace />} />

      {/* Workspace */}
      <Route path="workspace" element={<WorkspaceDashboard />} />
      <Route path="workspace/health-score" element={<HealthScore />} />
      <Route path="workspace/:dashboardId" element={<WorkspaceDashboard />} />

      {/* Profitability */}
      <Route path="profitability/dashboard" element={<ProfitabilityDashboard />} />
      <Route path="profitability/dashboard/:tab" element={<ProfitabilityDashboard />} />
      <Route path="profitability/trends" element={<ProfitabilityTrends />} />
      <Route path="profitability/pnl" element={<ProfitLoss />} />
      <Route path="profitability/geo" element={<Geographical />} />
      <Route path="profitability/unified-pnl" element={<UnifiedPnL />} />

      {/* Advertising */}
      <Route path="advertising/campaigns" element={<CampaignManager />} />
      <Route path="advertising/impact" element={<ImpactAnalysis />} />
      <Route path="advertising/targeting" element={<TargetingActions />} />
      <Route path="advertising/budget-pacing" element={<BudgetPacing />} />
      <Route path="advertising/search-harvesting" element={<SearchHarvesting />} />
      <Route path="advertising/anomaly-alerts" element={<AnomalyAlerts />} />
      <Route path="advertising/creative-analyzer" element={<CreativeAnalyzer />} />
      <Route path="advertising/rules/agents" element={<RuleAgents />} />
      <Route path="advertising/rules/applied" element={<AppliedRules />} />

      {/* Catalog */}
      <Route path="catalog/products" element={<CatalogProducts />} />
      <Route path="catalog/inventory-ads" element={<InventoryAds />} />

      {/* AMC */}
      <Route path="amc/queries" element={<AMCQueries />} />
      <Route path="amc/executed" element={<AMCExecutedQueries />} />
      <Route path="amc/schedules" element={<AMCSchedules />} />
      <Route path="amc/audiences" element={<AMCAudiences />} />
      <Route path="amc/created-audiences" element={<AMCCreatedAudiences />} />
      <Route path="amc/instances" element={<AMCInstances />} />

      {/* Business Intelligence */}
      <Route path="bi/brand-sov" element={<BrandSOV />} />
      <Route path="bi/keyword-tracker" element={<KeywordTracker />} />
      <Route path="bi/keyword-sov" element={<KeywordSOV />} />
      <Route path="bi/product-sov" element={<ProductSOV />} />
      <Route path="bi/competitor-pricing" element={<CompetitorPricing />} />

      {/* Day Parting */}
      <Route path="dayparting" element={<HourlyData />} />
      <Route path="dayparting/history" element={<HourlyData />} />

      {/* Reports */}
      <Route path="reports/client-portal" element={<ClientPortal />} />

      {/* Fallback: unknown sub-path inside a state -> dashboard */}
      <Route path="*" element={<Navigate to="profitability/dashboard" replace />} />
    </Routes>
  );
}
