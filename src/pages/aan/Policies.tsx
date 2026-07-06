import { Navigate } from "react-router-dom";

/**
 * Automation Policies moved into Preferences → Edit Alerts.
 * This route stays alive as a redirect for any lingering deep links.
 */
export default function AanPoliciesPage() {
  return <Navigate to="/settings/appearance#edit-alerts" replace />;
}
