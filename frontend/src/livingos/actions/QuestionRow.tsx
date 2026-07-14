import { useMemo } from "react";
import { HelpCircle, Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SourceGlyph } from "./SourceGlyph";
import { useActionsStore } from "@/livingos/state/actionsStore";
import type { AanQuestion } from "@/livingos/data/mockQuestions";

interface Props {
  question: AanQuestion;
}

export function QuestionRow({ question: q }: Props) {
  const { answerQuestion, skipQuestion } = useActionsStore();
  const isOpen = q.status === "open";

  const hoursLeft = useMemo(() => {
    const ms = q.expiresAt - Date.now();
    return Math.max(0, Math.round(ms / (60 * 60 * 1000)));
  }, [q.expiresAt]);

  const chosen = q.choices.find((c) => c.id === q.chosenId);

  return (
    <div className={cn(
      "border border-border/60 rounded-lg bg-card overflow-hidden transition-colors",
      isOpen ? "hover:border-primary/30" : "opacity-70",
    )}>
      <div className="px-3.5 py-3 flex items-start gap-3">
        <span className="mt-0.5 h-7 w-7 rounded-md bg-primary/10 border border-primary/25 flex items-center justify-center shrink-0">
          <HelpCircle className="h-3.5 w-3.5 text-primary" />
        </span>

        <div className="flex-1 min-w-0 space-y-2">
          <div>
            <div className="text-[13px] text-foreground font-medium leading-snug">{q.prompt}</div>
            <div className="text-[11.5px] text-muted-foreground mt-0.5">{q.context}</div>
          </div>

          {isOpen ? (
            <div className="flex items-center gap-1.5 flex-wrap">
              {q.choices.map((c) => (
                <Button
                  key={c.id}
                  size="sm"
                  variant="outline"
                  onClick={() => answerQuestion(q.id, c.id)}
                  className="h-auto py-1.5 px-2.5 text-[11.5px] flex flex-col items-start gap-0 hover:border-primary/50 hover:bg-primary/[0.04]"
                  title={c.hint}
                >
                  <span className="font-medium text-foreground">{c.label}</span>
                  {c.hint && <span className="text-[10px] text-muted-foreground font-normal">{c.hint}</span>}
                </Button>
              ))}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => skipQuestion(q.id)}
                className="h-7 text-[11px] text-muted-foreground hover:text-foreground ml-1"
              >
                Skip · I'll guess safely
              </Button>
            </div>
          ) : (
            <div className="text-[11.5px] flex items-center gap-1.5">
              <Check className="h-3 w-3 text-success" />
              <span className="text-muted-foreground">
                You chose <span className="text-foreground font-medium">{chosen?.label ?? "—"}</span>.
                I'll remember this class ({q.policyClass}).
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 text-[10.5px] text-muted-foreground pt-1 border-t border-border/40">
            <SourceGlyph source={q.source} size={10} />
            <span className="uppercase tracking-wider font-semibold">{q.source}</span>
            <span>·</span>
            <span>{q.domain}</span>
            {isOpen && (
              <span className="ml-auto flex items-center gap-1">
                <Clock className="h-3 w-3" /> auto-expires in {hoursLeft}h
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
