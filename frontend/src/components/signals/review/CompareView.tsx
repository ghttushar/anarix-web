import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import type { Decision } from "@/types/signals";
import { cn } from "@/lib/utils";
import { recommendationFor } from "@/lib/decisions/recommendationStructure";
import { RecommendationBlock } from "./RecommendationBlock";
import { ImpactChip } from "../chips/ImpactChip";
import { ConfidenceChip } from "../chips/ConfidenceChip";
import { relationshipsFor } from "@/lib/decisions/relationships";

interface Props {
  subject: Decision;
  all: Decision[];
}

export function CompareView({ subject, all }: Props) {
  const candidates = useMemo(() => {
    const rels = relationshipsFor(subject, all);
    const byId = new Map(all.map((d) => [d.id, d] as const));
    return rels
      .map((r) => byId.get(r.otherId))
      .filter(Boolean) as Decision[];
  }, [subject, all]);
  const [peerId, setPeerId] = useState<string | null>(candidates[0]?.id ?? null);
  const peer = candidates.find((c) => c.id === peerId) || null;

  if (candidates.length === 0) {
    return (
      <div className="text-[13px] text-muted-foreground py-8">
        No related decisions available to compare.
      </div>
    );
  }

  const subjectParts = recommendationFor(subject);
  const peerParts = peer ? recommendationFor(peer) : null;

  return (
    <div className="space-y-4">
      {/* Peer picker */}
      <div>
        <div className="text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">
          Compare with
        </div>
        <div className="flex flex-wrap gap-1.5">
          {candidates.map((c) => (
            <button
              key={c.id}
              onClick={() => setPeerId(c.id)}
              className={cn(
                "inline-flex items-center gap-1.5 h-7 px-2 rounded-full border text-[11.5px] max-w-[280px]",
                peerId === c.id
                  ? "border-primary text-primary bg-primary/5"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {peerId === c.id && <Check className="h-3 w-3" />}
              <span className="truncate">{c.insight}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Column title={subject.insight} decision={subject} parts={subjectParts} />
        {peer && peerParts && (
          <Column title={peer.insight} decision={peer} parts={peerParts} />
        )}
      </div>
    </div>
  );
}

function Column({ title, decision, parts }: { title: string; decision: Decision; parts: ReturnType<typeof recommendationFor> }) {
  return (
    <div className="rounded-md border border-border bg-card overflow-hidden">
      <header className="px-3 py-2 border-b border-border">
        <div className="text-[13px] font-medium text-foreground line-clamp-2">{title}</div>
        <div className="mt-1.5 flex items-center gap-1.5">
          <ImpactChip decision={decision} />
          <ConfidenceChip decision={decision} />
        </div>
      </header>
      <div className="p-3">
        <RecommendationBlock parts={parts} />
      </div>
    </div>
  );
}
