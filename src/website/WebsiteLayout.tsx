import { Outlet } from "react-router-dom";
import "./website.css";
import WebsiteAanLauncher from "./components/WebsiteAanLauncher";

export default function WebsiteLayout() {
  return (
    <div className="website-scope min-h-screen bg-background text-foreground antialiased">
      <Outlet />
      <WebsiteAanLauncher />
    </div>
  );
}
