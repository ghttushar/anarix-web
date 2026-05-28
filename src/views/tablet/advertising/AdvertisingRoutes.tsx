import { Routes, Route, Navigate } from "react-router-dom";
import {
  TabletCampaignManager,
  TabletCampaignDetail,
  TabletAdGroupDetail,
  TabletProductAdDetail,
} from "./screens/TabletCampaigns";
import {
  TabletImpactAnalysis,
  TabletImpactCampaignDetail,
  TabletImpactAdGroupDetail,
} from "./screens/TabletImpact";
import { TabletTargetingActions } from "./screens/TabletTargeting";
import {
  TabletRuleAgents,
  TabletAppliedRules,
  TabletRuleCreation,
} from "./screens/TabletRules";
import {
  TabletAnomalyAlerts,
  TabletBudgetPacing,
  TabletSearchHarvesting,
  TabletCreativeAnalyzer,
} from "./screens/TabletMisc";

export function TabletAdvertisingRoutes() {
  return (
    <Routes>
      <Route index element={<Navigate to="campaigns" replace />} />
      <Route path="campaigns" element={<TabletCampaignManager />} />
      <Route path="campaigns/:campaignId" element={<TabletCampaignDetail />} />
      <Route path="campaigns/:campaignId/:adGroupId" element={<TabletAdGroupDetail />} />
      <Route path="campaigns/:campaignId/:adGroupId/:productAdId" element={<TabletProductAdDetail />} />
      <Route path="impact" element={<TabletImpactAnalysis />} />
      <Route path="impact/campaigns/:campaignId" element={<TabletImpactCampaignDetail />} />
      <Route path="impact/campaigns/:campaignId/:adGroupId" element={<TabletImpactAdGroupDetail />} />
      <Route path="targeting" element={<TabletTargetingActions />} />
      <Route path="budget-pacing" element={<TabletBudgetPacing />} />
      <Route path="search-harvesting" element={<TabletSearchHarvesting />} />
      <Route path="anomaly-alerts" element={<TabletAnomalyAlerts />} />
      <Route path="creative-analyzer" element={<TabletCreativeAnalyzer />} />
      <Route path="rules" element={<Navigate to="agents" replace />} />
      <Route path="rules/agents" element={<TabletRuleAgents />} />
      <Route path="rules/applied" element={<TabletAppliedRules />} />
      <Route path="rules/create" element={<TabletRuleCreation />} />
      <Route path="rules/create/:templateId" element={<TabletRuleCreation />} />
      <Route path="rules/edit/:ruleId" element={<TabletRuleCreation />} />
    </Routes>
  );
}
