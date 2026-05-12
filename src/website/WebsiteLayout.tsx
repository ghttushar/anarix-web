import { Outlet } from "react-router-dom";
import { WebsiteNav } from "./components/WebsiteNav";
import { WebsiteFooter } from "./components/WebsiteFooter";

export function WebsiteLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <WebsiteNav />
      <main className="min-w-0">
        <Outlet />
      </main>
      <WebsiteFooter />
    </div>
  );
}

export default WebsiteLayout;
