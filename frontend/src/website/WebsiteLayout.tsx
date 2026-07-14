import { Outlet } from "react-router-dom";
import "./website.css";
import AanWebsitePanel from "./components/AanWebsitePanel";
import AmbientBackdropV2 from "./components/AmbientBackdropV2";

export default function WebsiteLayout() {
  return (
    <div className="website-scope relative min-h-screen bg-background text-foreground antialiased">
      <AmbientBackdropV2 />
      <Outlet />
      {/* Single Aan surface for the website - opened from the Floating Action Island */}
      <AanWebsitePanel />
    </div>
  );
}
