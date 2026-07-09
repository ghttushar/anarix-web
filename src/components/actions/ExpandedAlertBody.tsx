import { ArrowRight, ExternalLink, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SourceGlyph } from "./SourceGlyph";
import { AanMark } from "@/components/branding/AanMark";
import { deriveAlternateActions } from "@/lib/decisions/deriveAlternateActions";
import type { Decision } from "@/data/mockDecisions";

interface Props {
  decision: Decision;
  onApproveVariant?: (id: string, label: string) => void;
  onApprove: () => void;
  onDiscuss: () => void;
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">
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
 * Sections: Context · Why this number · Evidence · Suggested actions.
 */
export function ExpandedAlertBody({ decision: d, onApprove, onApproveVariant, onDiscuss }: Props) {
  const alternates = deriveAlternateActions(d);

  return (
    <div className="grid gap-4 md:grid-cols-5 px-4 pt-4 pb-4">
      {/* Left column: narrative */}
      <div className="md:col-span-3 space-y-4">
        {d.insightDetail && (
          <section>
            <Eyebrow>Context</Eyebrow>
            <p className="text-[13px] leading-relaxed text-foreground/85">{d.insightDetail}</p>
          </section>
        )}

        {d.valueBasis && (
          <section>
            <Eyebrow>Why this number</Eyebrow>
            <div className="rounded-md border border-border/60 bg-muted/25 px-3 py-2.5 text-[12.5px] leading-relaxed text-foreground/85">
              {d.valueBasis}
            </div>
            {d.valueInputs && d.valueInputs.length > 0 && (
              <ul className="mt-2 space-y-1">
                {d.valueInputs.map((i, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-[12px] text-muted-foreground">
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
          <div className="flex items-center gap-2.5 flex-wrap text-[12.5px]">
            <SourceGlyph source={d.source} refLabel={d.sourceRef.label} size={14} />
            <span className="text-foreground/80 font-medium">{d.sourceRef.label}</span>
            <span className="text-border">·</span>
            <span className="text-muted-foreground">{timeAgo(d.createdAt)}</span>
            {d.deepLink && (
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-[12px] gap-1.5 ml-1"
                onClick={() => window.location.assign(d.deepLink!.href)}
              >
                {d.deepLink.label}
                <ExternalLink className="h-3 w-3" />
              </Button>
            )}
          </div>
        </section>
      </div>

      {/* Right column: suggested actions */}
      <div className="md:col-span-2">
        <Eyebrow>Suggested actions</Eyebrow>
        <div className="rounded-md border border-border/60 bg-card divide-y divide-border/50 overflow-hidden">
          {alternates.map((alt, idx) => (
            <div key={alt.id} className="flex items-start gap-3 px-3 py-2.5">
              <div className="flex-1 min-w-0">
                <div className="text-[12.5px] font-medium text-foreground leading-snug">{alt.label}</div>
                {alt.hint && (
                  <div className="text-[11.5px] text-muted-foreground leading-snug mt-0.5">{alt.hint}</div>
                )}
              </div>
              <Button
                size="sm"
                variant={idx === 0 ? "default" : "outline"}
                onClick={() => onApproveVariant ? onApproveVariant(alt.id, alt.label) : onApprove()}
                className="h-7 text-[12px] gap-1 shrink-0"
              >
                <ArrowRight className="h-3 w-3" />
                Run
              </Button>
            </div>
          ))}
          <button
            onClick={onDiscuss}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-left text-[12.5px] text-primary hover:bg-primary/5 transition-colors"
          >
            <AanMark size={13} className="text-primary" />
            <PenLine className="h-3.5 w-3.5" />
            <span className="font-medium">Write custom action / Discuss with Aan</span>
          </button>
        </div>
      </div>
    </div>
  );
}
