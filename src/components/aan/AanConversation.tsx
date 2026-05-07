import { useRef, useEffect } from "react";
import { useAan } from "./AanContext";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import { AanGlyph } from "./AanGlyph";
import { AanMascot } from "./AanMascot";
import { useBranding } from "@/contexts/BrandingContext";
import { format } from "date-fns";
import { ArtifactCard } from "./ArtifactCard";
import { CircularProgress } from "@/components/ui/circular-progress";

export function AanConversation() {
  const { messages, openSplit, isGenerating, generationType, generationProgress } = useAan();
  const { newBranding } = useBranding();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating, generationProgress]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex gap-3",
            message.role === "user" ? "flex-row-reverse" : "flex-row"
          )}
        >
          {/* Avatar */}
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center",
              message.role === "assistant"
                ? newBranding
                  ? "text-foreground"
                  : "rounded-full aan-gradient text-white"
                : "rounded-full bg-muted text-muted-foreground"
            )}
          >
            {message.role === "assistant" ? (
              newBranding ? (
                <AanMascot size={26} state="idle" interactive={false} />
              ) : (
                <AanGlyph className="h-4 w-4" />
              )
            ) : (
              <User className="h-4 w-4" />
            )}
          </div>

          {/* Message Bubble */}
          <div
            className={cn(
              "flex max-w-[80%] flex-col gap-2",
              message.role === "user" ? "items-end" : "items-start"
            )}
          >
            <div
              className={cn(
                "rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap",
                message.role === "assistant"
                  ? "bg-card text-foreground border border-border"
                  : "bg-primary text-primary-foreground"
              )}
            >
              {message.content}
            </div>

            {/* Artifact Card (if present) */}
            {message.draft && (
              <ArtifactCard
                artifact={message.draft}
                onClick={() => openSplit(message.draft!)}
                className="max-w-sm"
              />
            )}

            <span className="text-xs text-muted-foreground px-2">
              {format(message.timestamp, "h:mm a")}
            </span>
          </div>
        </div>
      ))}

      {/* Generation Progress Indicator */}
      {isGenerating && (
        <div className="flex gap-3">
          {/* Avatar */}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full aan-gradient text-white">
            <AanGlyph state="thinking" className="h-4 w-4" />
          </div>

          {/* Progress Card */}
          <div className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card">
            <CircularProgress progress={generationProgress} size={56} />
            <div>
              <p className="font-medium text-foreground">
                {generationType === "report" ? "Generating Report" : "Running Audit"}
              </p>
              <p className="text-sm text-muted-foreground">
                {Math.ceil((100 - generationProgress) * 0.3)}s remaining
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
