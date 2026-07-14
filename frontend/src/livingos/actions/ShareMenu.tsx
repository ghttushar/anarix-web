import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Share2, Hash, Users, Mail, Link2, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  itemLabel: string;
  compact?: boolean;
}

export function ShareMenu({ itemLabel, compact = true }: Props) {
  const [copied, setCopied] = useState(false);

  const share = (channel: string) => {
    toast.message(`Shared "${itemLabel}" to ${channel}.`);
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.href} · ${itemLabel}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        {compact ? (
          <Button variant="ghost" size="icon" className="h-7 w-7" title="Share">
            <Share2 className="h-3.5 w-3.5" />
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="h-7 gap-1.5 text-[11.5px]">
            <Share2 className="h-3 w-3" /> Share
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-52 p-1.5">
        <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground px-2 py-1.5">
          Share this decision
        </div>
        <button onClick={() => share("Slack")} className="w-full flex items-center gap-2 px-2 py-1.5 text-[12px] rounded hover:bg-muted">
          <Hash className="h-3.5 w-3.5 text-[hsl(150_55%_42%)]" /> Slack
        </button>
        <button onClick={() => share("Teams")} className="w-full flex items-center gap-2 px-2 py-1.5 text-[12px] rounded hover:bg-muted">
          <Users className="h-3.5 w-3.5 text-[hsl(232_60%_58%)]" /> Teams
        </button>
        <button onClick={() => share("Email")} className="w-full flex items-center gap-2 px-2 py-1.5 text-[12px] rounded hover:bg-muted">
          <Mail className="h-3.5 w-3.5 text-[hsl(28_80%_52%)]" /> Email
        </button>
        <div className="h-px bg-border my-1" />
        <button onClick={copy} className="w-full flex items-center gap-2 px-2 py-1.5 text-[12px] rounded hover:bg-muted">
          {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Link2 className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy link"}
        </button>
      </PopoverContent>
    </Popover>
  );
}
