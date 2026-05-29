import { Routes, Route, Navigate } from "react-router-dom";
import { TabletReports } from "./screens/TabletReports";

export function TabletReportsRoutes() {
  return (
    <Routes>
      <Route index element={<TabletReports />} />
      <Route path="client-portal" element={<TabletReports />} />
      <Route path="*" element={<Navigate to="/tablet/reports" replace />} />
    </Routes>
  );
}
