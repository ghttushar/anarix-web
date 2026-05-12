import { Outlet } from "react-router-dom";
import "./website.css";

/**
 * Wrapper that scopes the marketing-site CSS tokens & utilities.
 * Pages render their own Navbar / Footer / ScrollToTop via PageLayout.
 */
export default function WebsiteLayout() {
  return (
    <div className="website-scope min-h-screen bg-background text-foreground antialiased">
      <Outlet />
    </div>
  );
}
