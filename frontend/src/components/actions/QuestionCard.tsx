import { useMemo } from "react";
import { HelpCircle, Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SourceGlyph } from "./SourceGlyph";
import { ShareMenu } from "./ShareMenu";
import { useActionsStore } from "@/state/actionsStore";
import { getSourceMeta } from "@/lib/decisions/sourceRegistry";
import type { AanQuestion } from "@/data/mockQuestions";

interface Props {
  question: AanQuestion;
}

export function QuestionCard({ question: q }: Props) {
  const { answerQuestion, skipQuestion } = useActionsStore();
  const isOpen = q.status === "open";
  const hoursLeft = useMemo(() => Math.max(0, Math.round((q.expiresAt - Date.now()) / (60 * 60 * 1000))), [q.expiresAt]);
  const chosen = q.choices.find((c) => c.id === q.chosenId);
  const sourceMeta = getSourceMeta(q.source);

  return (
    <div className={cn(
      "relative rounded-lg border bg-card overflow-hidden hover:shadow-sm transition-shadow",
      isOpen ? "border-border" : "border-border/60 opacity-80",
    )}>
      <div className={cn("absolute left-0 top-0 bottom-0 w-1", isOpen ? "bg-primary" : "bg-muted-foreground/40")} />

      <div className="pl-5 pr-5 py-4">
        {/* Top row */}
        <div className="flex items-center gap-2 text-[11.5px]">
          <span className={cn("h-1.5 w-1.5 rounded-full", isOpen ? "bg-primary" : "bg-muted-foreground/40")} />
          <span className="uppercase tracking-wider font-semibold text-foreground">QUESTION FROM ME</span>
          <span className="text-muted-foreground">·</span>
          <SourceGlyph source={q.source} size={11} className="!w-4 !h-4 border-0 bg-transparent" />
          <span className="uppercase tracking-wider font-semibold text-muted-foreground">{sourceMeta.label}</span>
          {isOpen && (
            <span className="ml-auto text-[10.5px] text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" /> {hoursLeft}h left
            </span>
          )}
        </div>

        {/* Body */}
        <div className="mt-3 flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2">
              <HelpCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <h3 className="text-[15.5px] font-semibold text-foreground leading-snug">{q.prompt}</h3>
            </div>
            <p className="mt-1 text-[13px] text-muted-foreground leading-relaxed">{q.context}</p>
          </div>
        </div>

        {/* Choices / footer */}
        <div className="mt-4">
          {isOpen ? (
            <div className="flex items-center gap-1.5 flex-wrap">
              {q.choices.map((c) => (
                <Button
                  key={c.id}
                  size="sm"
                  variant="outline"
                  onClick={() => answerQuestion(q.id, c.id)}
                  className="h-auto py-1.5 px-2.5 text-[12px] flex flex-col items-start gap-0 hover:border-primary/50 hover:bg-primary/[0.04]"
                  title={c.hint}
                >
                  <span className="font-medium text-foreground">{c.label}</span>
                  {c.hint && <span className="text-[10.5px] text-muted-foreground font-normal">{c.hint}</span>}
                </Button>
              ))}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => skipQuestion(q.id)}
                className="h-7 text-[11.5px] text-muted-foreground hover:text-foreground ml-1"
              >
                Skip · I'll guess safely
              </Button>
              <div className="ml-auto">
                <ShareMenu itemLabel={q.prompt} />
              </div>
            </div>
          ) : (
            <div className="text-[12.5px] flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-success" />
              <span className="text-muted-foreground">
                You chose <span className="text-foreground font-medium">{chosen?.label ?? "—"}</span>.
                I'll remember this class ({q.policyClass}).
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
