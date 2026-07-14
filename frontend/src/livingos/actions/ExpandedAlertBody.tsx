import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SourceGlyph } from "./SourceGlyph";
import type { Decision } from "@/livingos/data/mockDecisions";

interface Props {
  decision: Decision;
  onApproveVariant?: (id: string, label: string) => void;
  onApprove: () => void;
  onDiscuss: () => void;
}


function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11.5px] uppercase tracking-wider font-semibold text-muted-foreground mb-2">
      {children}
    </div>
  );
}

function timeAgo(ts: number): string {
  const m = Math.round((Date.now() - ts) / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

/**
 * Categorized expanded body for non-meeting Decision cards.
 * Sections: Context · Why this number · Evidence.
 */
export function ExpandedAlertBody({ decision: d }: Props) {
  return (
    <div className="px-5 pt-4 pb-4 space-y-5">
      {d.insightDetail && (
        <section>
          <Eyebrow>Context</Eyebrow>
          <p className="text-[14px] leading-relaxed text-foreground/90">{d.insightDetail}</p>
        </section>
      )}

      {d.valueBasis && (
        <section>
          <Eyebrow>Why this number</Eyebrow>
          <div className="rounded-md border border-border/60 bg-muted/25 px-3.5 py-3 text-[13.5px] leading-relaxed text-foreground/90">
            {d.valueBasis}
          </div>
          {d.valueInputs && d.valueInputs.length > 0 && (
            <ul className="mt-2.5 space-y-1.5">
              {d.valueInputs.map((i, idx) => (
                <li key={idx} className="flex items-start gap-2 text-[13px] text-muted-foreground">
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-muted-foreground/60 shrink-0" />
                  <span>{i}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <section>
        <Eyebrow>Evidence</Eyebrow>
        <div className="flex items-center gap-2.5 flex-wrap text-[13.5px]">
          <SourceGlyph source={d.source} refLabel={d.sourceRef.label} size={15} />
          <span className="text-foreground/85 font-medium">{d.sourceRef.label}</span>
          <span className="text-border">·</span>
          <span className="text-muted-foreground">{timeAgo(d.createdAt)}</span>
          {d.deepLink && (
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-[12.5px] gap-1.5 ml-1"
              onClick={() => window.location.assign(d.deepLink!.href)}
            >
              {d.deepLink.label}
              <ExternalLink className="h-3 w-3" />
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
