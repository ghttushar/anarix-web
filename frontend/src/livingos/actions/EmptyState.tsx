import { Sparkles } from "lucide-react";

interface Props {
  headline: string;
  body?: string;
}

export function EmptyState({ headline, body }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center mb-3">
        <Sparkles className="h-5 w-5 text-primary" />
      </div>
      <div className="text-[14px] font-medium text-foreground">{headline}</div>
      {body && <div className="text-[12px] text-muted-foreground mt-1 max-w-xs">{body}</div>}
    </div>
  );
}
