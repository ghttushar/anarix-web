// Details page — middle of the 3-page carousel. Multi-strategy + execution
// plan + evidence + related work + timeline.
import { useMemo, useState } from "react";
import { StrategyPicker } from "./StrategyPicker";
import { ExecutionPlan } from "./ExecutionPlan";
import { TimelineView } from "./TimelineView";
import { RelatedDecisionChip } from "./RelatedDecisionChip";
import { strategiesFor, type Strategy } from "@/lib/decisions/strategies";
import { relationshipsFor } from "@/lib/decisions/relationships";
import { SourceGlyph } from "../SourceGlyph";
import type { Decision } from "@/types/signals";

interface Props {
  decision: Decision;
  all: Decision[];
  onOpenDecision: (id: string) => void;
  onStrategyChange?: (s: Strategy) => void;
}

function Block({ eyebrow, children, hint }: { eyebrow: string; children: React.ReactNode; hint?: string }) {
  return (
    <section>
      <div className="flex items-baseline justify-between mb-2">
        <div className="text-[10.5px] uppercase tracking-widest font-semibold text-muted-foreground">
          {eyebrow}
        </div>
        {hint && <div className="text-[10.5px] text-muted-foreground">{hint}</div>}
      </div>
      {children}
    </section>
  );
}

export function DetailsPage({ decision: d, all, onOpenDecision, onStrategyChange }: Props) {
  const strategies = useMemo(() => strategiesFor(d), [d]);
  const [selectedId, setSelectedId] = useState<string>(strategies[0].id);
  const selected = strategies.find((s) => s.id === selectedId) || strategies[0];

  const relationships = useMemo(() => relationshipsFor(d, all), [d, all]);
  const relatedById = useMemo(() => new Map(all.map((x) => [x.id, x] as const)), [all]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    const s = strategies.find((x) => x.id === id);
    if (s) onStrategyChange?.(s);
  };

  const recommendedCount = strategies.filter((s) => s.recommended).length;
  const strategyHint = `${strategies.length} option${strategies.length === 1 ? "" : "s"}${recommendedCount ? ` · ${recommendedCount} recommended` : ""}`;

  return (
    <div className="space-y-6">
      <Block eyebrow="Choose your strategy" hint={strategyHint}>
        <div className="rounded-xl border border-primary/25 bg-gradient-to-br from-primary/[0.06] via-transparent to-transparent p-3 shadow-[0_1px_0_hsl(var(--border)/0.5),0_20px_50px_-30px_hsl(var(--primary)/0.35)]">
          <StrategyPicker strategies={strategies} selectedId={selectedId} onSelect={handleSelect} />
        </div>
      </Block>

      <Block eyebrow="Execution plan">
        <ExecutionPlan strategy={selected} />
      </Block>

      {d.valueInputs && d.valueInputs.length > 0 && (
        <Block eyebrow="Evidence">
          <ul className="space-y-1.5">
            {d.valueInputs.map((line, i) => (
              <li key={i} className="flex items-start gap-2 text-[12.5px] text-muted-foreground">
                <SourceGlyph source={d.source} refLabel={d.sourceRef.label} size={12} />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </Block>
      )}

      {relationships.length > 0 && (
        <Block eyebrow="Related work">
          <div className="flex flex-wrap gap-1.5">
            {relationships.map((r) => {
              const other = relatedById.get(r.otherId);
              if (!other) return null;
              return (
                <RelatedDecisionChip
                  key={r.otherId + r.type}
                  decision={other}
                  type={r.type}
                  onOpen={onOpenDecision}
                />
              );
            })}
          </div>
        </Block>
      )}

      <Block eyebrow="Timeline">
        <TimelineView decision={d} />
      </Block>
    </div>
  );
}
