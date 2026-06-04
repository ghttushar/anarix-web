import { AppLayout } from "@/components/layout/AppLayout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { LogOut, Mail, Building2, Shield, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * Mobile-only read-only Profile page.
 * Shows account identity + safe links. Edit flows live on desktop.
 */
export function MobileProfile() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="px-4 py-4 space-y-6 pb-24">
        <div>
          <h1 className="font-heading text-xl font-semibold text-foreground">Profile</h1>
          <p className="text-sm text-muted-foreground">Your account at a glance.</p>
        </div>

        {/* Identity */}
        <div className="rounded-lg border border-border bg-card p-4 flex items-center gap-3">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="bg-primary/10 text-primary text-base font-semibold">JD</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-base font-medium text-foreground truncate">John Doe</p>
            <p className="text-xs text-muted-foreground truncate">john@anarix.com</p>
            <p className="mt-1 text-[11px] text-muted-foreground">Admin · Anarix Inc.</p>
          </div>
        </div>

        {/* Details */}
        <section className="rounded-lg border border-border bg-card divide-y divide-border">
          <Row icon={<Mail className="h-4 w-4 text-muted-foreground" />} label="Email" value="john@anarix.com" />
          <Row icon={<Building2 className="h-4 w-4 text-muted-foreground" />} label="Organization" value="Anarix Inc." />
          <Row icon={<Shield className="h-4 w-4 text-muted-foreground" />} label="Role" value="Admin" />
        </section>

        <Separator />

        {/* Safe nav links */}
        <section className="space-y-2">
          <button
            onClick={() => navigate("/settings/appearance")}
            className="w-full flex items-center justify-between rounded-lg border border-border bg-card p-4 min-h-[56px]"
          >
            <span className="text-sm font-medium text-foreground">Preferences</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        </section>

        <p className="text-[11px] text-muted-foreground text-center">
          Account edits, team, and billing are managed on desktop.
        </p>

        <Button variant="outline" className="w-full min-h-[44px] text-destructive">
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </Button>
      </div>
    </AppLayout>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-4 min-h-[56px]">
      {icon}
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-sm text-foreground truncate">{value}</p>
      </div>
    </div>
  );
}

export default MobileProfile;
