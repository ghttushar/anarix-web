import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WhatsAppIntegration, SERVICE_META } from "@/contexts/IntegrationsContext";
import { WhatsAppLogo } from "./WhatsAppLogo";

interface Props {
  integration: WhatsAppIntegration;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ConnectionRow({ integration, onToggle, onEdit, onDelete }: Props) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 flex items-center gap-4">
      <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
        <WhatsAppLogo className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-foreground">
            {integration.countryCode} {integration.phoneNumber}
          </p>
          <Badge variant={integration.enabled ? "default" : "secondary"} className="text-[10px]">
            {integration.enabled ? "Active" : "Paused"}
          </Badge>
        </div>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {integration.services.map((s) => (
            <span
              key={s}
              className="text-[10px] uppercase tracking-wide text-muted-foreground border border-border rounded px-1.5 py-0.5"
            >
              {SERVICE_META[s].label}
            </span>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-1.5">
          {integration.accountIds.length} {integration.accountIds.length === 1 ? "account" : "accounts"} ·
          {" verified "}
          {new Date(integration.verifiedAt).toLocaleDateString()}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Switch checked={integration.enabled} onCheckedChange={onToggle} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-8 w-8 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" title="More">
              <MoreVertical className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
              <Pencil className="h-4 w-4 mr-2" /> Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDelete} className="cursor-pointer text-destructive focus:text-destructive">
              <Trash2 className="h-4 w-4 mr-2" /> Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
