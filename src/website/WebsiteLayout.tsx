import { Outlet } from "react-router-dom";
import { PillNav } from "./components/PillNav";
import { Footer } from "./components/Footer";
import { DottedBackground } from "./components/DottedBackground";

export default function WebsiteLayout() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-background text-foreground antialiased">
      <DottedBackground />
      <PillNav />
      <main className="relative z-10 min-w-0 pt-24">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
