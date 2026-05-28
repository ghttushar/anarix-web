import { Routes, Route, Navigate } from "react-router-dom";
import {
  TabletProfitabilityDashboard,
  TabletProfitabilityTrends,
  TabletProfitLoss,
  TabletGeographical,
  TabletUnifiedPnL,
} from "./screens/TabletProfitability";

export function TabletProfitabilityRoutes() {
  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<TabletProfitabilityDashboard />} />
      <Route path="dashboard/:tab" element={<TabletProfitabilityDashboard />} />
      <Route path="trends" element={<TabletProfitabilityTrends />} />
      <Route path="pnl" element={<TabletProfitLoss />} />
      <Route path="geo" element={<TabletGeographical />} />
      <Route path="unified-pnl" element={<TabletUnifiedPnL />} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
}
