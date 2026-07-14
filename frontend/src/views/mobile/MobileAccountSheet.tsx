import { useNavigate } from "react-router-dom";
import { Globe, Settings, Link as LinkIcon, Plug, Users, Wrench, Palette, Layers, CreditCard, User, LogOut } from "lucide-react";
import { MobileRightSheet } from "./MobileRightSheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const ITEMS = [
  { label: "Anarix Website", icon: Globe, href: "/website" },
  { label: "Preferences", icon: Settings, href: "/settings/appearance" },
  { label: "Accounts", icon: LinkIcon, href: "/settings/accounts" },
  { label: "Integrations", icon: Plug, href: "/settings/integrations" },
  { label: "Team", icon: Users, href: "/settings/team" },
  { label: "System", icon: Wrench, href: "/settings/system" },
  { label: "Design System", icon: Palette, href: "/settings/design-system" },
  { label: "Component Library", icon: Layers, href: "/settings/component-library" },
  { label: "Billing", icon: CreditCard, href: "/settings/billing" },
  { label: "Profile", icon: User, href: "/profile" },
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileAccountSheet({ open, onOpenChange }: Props) {
  const navigate = useNavigate();
  const go = (href: string) => {
    onOpenChange(false);
    navigate(href);
  };
  return (
    <MobileRightSheet
      open={open}
      onClose={() => onOpenChange(false)}
      title="Account"
    >
      <div className="flex items-center gap-3 px-3 py-3 border-b border-border">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-primary/10 text-primary text-[12px] font-semibold">JD</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className="text-[14px] font-semibold text-foreground truncate">John Doe</div>
          <div className="text-[11px] text-muted-foreground truncate">john@anarix.com</div>
        </div>
      </div>
      <nav className="py-2">
        {ITEMS.map((it) => (
          <Row key={it.label} label={it.label} icon={it.icon} onClick={() => go(it.href)} />
        ))}
        <div className="my-2 border-t border-border" />
        <Row label="Logout" icon={LogOut} destructive onClick={() => go("/login")} />
      </nav>
    </MobileRightSheet>
  );
}

function Row({
  label,
  icon: Icon,
  destructive,
  onClick,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  destructive?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 h-11 text-[14px] font-medium active:bg-muted/60",
        destructive ? "text-destructive" : "text-foreground"
      )}
    >
      <Icon className={cn("h-4 w-4 shrink-0", destructive ? "text-destructive" : "text-muted-foreground")} />
      <span className="truncate">{label}</span>
    </button>
  );
}
