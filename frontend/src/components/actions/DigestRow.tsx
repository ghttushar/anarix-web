import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SourceGlyph } from "./SourceGlyph";
import { ValuePill } from "./ValuePill";
import type { DigestItem } from "@/data/mockDecisions";

interface Props {
  items: DigestItem[];
  totalCents: number;
}

/**
 * Digest bar — the "everything Aan handled quietly" row.
 * Single line by default. Expands to a compact table.
 */
export function DigestRow({ items, totalCents }: Props) {
  const [open, setOpen] = useState(false);
  if (items.length === 0) return null;

  return (
    <div className="rounded-md border border-dashed border-border/70 bg-muted/20">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-3.5 py-2.5 text-left hover:bg-muted/30 rounded-md"
      >
        {open ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
        <span className="text-[12px] text-muted-foreground">
          I handled <span className="text-foreground font-medium">{items.length}</span> low-value items —
        </span>
        <ValuePill cents={totalCents} kind="gain" />
        <span className="text-[11px] text-muted-foreground ml-auto">
          mostly bid tweaks & negatives
        </span>
      </button>

      {open && (
        <div className="border-t border-border/60">
          <table className="w-full text-[11.5px]">
            <thead className="text-muted-foreground">
              <tr>
                <th className="text-left font-normal px-3.5 py-1.5 w-8"></th>
                <th className="text-left font-normal px-1 py-1.5">What</th>
                <th className="text-right font-normal px-3.5 py-1.5 w-24">Value</th>
                <th className="text-right font-normal px-3.5 py-1.5 w-16">When</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} className="border-t border-border/40 hover:bg-muted/30">
                  <td className="px-3.5 py-1.5">
                    <SourceGlyph source={it.source} size={11} />
                  </td>
                  <td className="px-1 py-1.5 text-foreground/80">{it.what}</td>
                  <td className="px-3.5 py-1.5 text-right">
                    <ValuePill cents={it.valueCents} kind={it.valueKind} />
                  </td>
                  <td className="px-3.5 py-1.5 text-right text-muted-foreground font-mono">
                    {new Date(it.ts).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
