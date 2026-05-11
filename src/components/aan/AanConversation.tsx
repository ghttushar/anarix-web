import { useRef, useEffect, useState } from "react";
import { useAan } from "./AanContext";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import { AanGlyph } from "./AanGlyph";
import { AanMascot } from "./AanMascot";
import { useAanPresence } from "./AanPresenceContext";
import { useBranding } from "@/contexts/BrandingContext";
import { format } from "date-fns";
import { ArtifactCard } from "./ArtifactCard";
import { CircularProgress } from "@/components/ui/circular-progress";

export function AanConversation() {
  const { messages, openSplit, isGenerating, generationType, generationProgress } = useAan();
  const { newBranding } = useBranding();
  const { registerAnchor } = useAanPresence();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [pendingAnchorEl, setPendingAnchorEl] = useState<HTMLDivElement | null>(null);
  const [generationAnchorEl, setGenerationAnchorEl] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating, generationProgress]);

  // Register the generation card anchor — owns the live presence while generating
  useEffect(() => {
    if (!newBranding) return;
    if (isGenerating) {
      registerAnchor("generation", generationAnchorEl, 56);
    } else {
      registerAnchor("generation", null);
    }
    return () => registerAnchor("generation", null);
  }, [newBranding, isGenerating, generationAnchorEl, registerAnchor]);

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
                <AanMascot size={20} state="anchor" interactive={false} />
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
        <div className="flex">
          {/* Progress Card — clean, well-designed loader */}
          <div className="flex flex-col gap-3 p-4 rounded-2xl border border-border bg-card w-fit min-w-[300px] shadow-sm">
            <div className="flex items-center gap-3">
              {newBranding ? (
                <div
                  ref={setGenerationAnchorEl}
                  aria-hidden
                  data-aan-anchor="generation"
                  className="w-14 h-14 shrink-0 flex items-center justify-center"
                />
              ) : (
                <CircularProgress progress={generationProgress} size={56} />
              )}
              <div className="flex flex-col min-w-0">
                <p className="font-medium text-foreground text-sm leading-tight">
                  {generationType === "report" ? "Generating Report" : "Running Audit"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {Math.max(1, Math.ceil((100 - generationProgress) * 0.3))}s remaining
                </p>
              </div>
            </div>
            {/* Deterministic progress bar */}
            <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-[width] duration-700 ease-out"
                style={{ width: `${Math.min(100, Math.max(0, generationProgress))}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
