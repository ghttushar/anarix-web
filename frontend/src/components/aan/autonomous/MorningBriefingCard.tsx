import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const BRIEFING = {
  greeting: "Good morning, Bharath",
  subtitle: "Here's what happened while you were away.",
  criticalCount: 3,
  bullets: [
    { severity: "critical" as const, label: "Mount-It", detail: "≈ $4,500 in projected revenue lost overnight. SKU MI-212 went OOS 7:42 PM." },
    { severity: "critical" as const, label: "Buy Box", detail: "Lost on MI-101 and MI-107 to FastShipDeals ($0.42 gap)." },
    { severity: "high" as const, label: "Promotion", detail: "'Office Essentials' failed validation — 23 SKUs affected, ~$1,100/day impact." },
    { severity: "opp" as const, label: "Opportunity", detail: "Desk Accessories ROAS +18%. Budget top-up recommended." },
    { severity: "meeting" as const, label: "10:00 AM", detail: "Staples Review — Aan will attend and produce summary." },
    { severity: "info" as const, label: "Inbox", detail: "6 unread client emails • 3 pending approvals • 2 overdue action items." },
  ],
};

const dotClass: Record<string, string> = {
  critical: "bg-destructive",
  high: "bg-warning",
  opp: "bg-success",
  meeting: "bg-primary",
  info: "bg-muted-foreground",
};

export function MorningBriefingCard() {
  const [expanded, setExpanded] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="mt-0.5 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Coffee className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-primary/80">Morning Briefing</div>
            <div className="font-heading text-sm font-semibold text-foreground truncate">{BRIEFING.greeting}</div>
            <div className="text-[11px] text-muted-foreground">{BRIEFING.subtitle}</div>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setExpanded((v) => !v)} className="h-7 w-7 shrink-0">
          {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </Button>
      </div>

      {expanded && (
        <div className="mt-3 space-y-2 pl-1">
          {BRIEFING.bullets.map((b, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className={cn("mt-1.5 h-1.5 w-1.5 rounded-full shrink-0", dotClass[b.severity])} />
              <div className="min-w-0 text-[12px] leading-relaxed">
                <span className="font-medium text-foreground">{b.label}</span>
                <span className="text-muted-foreground"> — {b.detail}</span>
              </div>
            </div>
          ))}
          <div className="pt-2 flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => navigate("/aan/feed")}>
              Open Aan Feed
            </Button>
            <Button size="sm" variant="ghost" className="h-7 text-[11px] text-muted-foreground" onClick={() => navigate("/aan")}>
              Ask Aan a question
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
